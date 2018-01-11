// We ideally want to pass through the stream to s3
var PassThrough = Npm.require('stream').PassThrough;

// ... But this is not allways possible since S3 requires the data length set
var TransformStream = Npm.require('stream').Transform;

// We create a temp file if needed for the indirect streaming
var fs = Npm.require('fs');
var temp = Npm.require('temp');

// We use inherites
var util = Npm.require('util');

var Stream = Npm.require('stream'); // XXX: Is this used?

// Well now, S3 requires content length but we want a general streaming pattern
// in cfs. The createWriteStream will use this
IndirectS3Stream = function(options, callback) {
  var self = this;

  // Use new to fire up this baby
  if (!(this instanceof IndirectS3Stream))
    return new IndirectS3Stream(options);

  // So we use the transform stream patter - even though we only use the write
  // part. We do this to take advantage of the _flush mechanism for repporting
  // back errors and halting the stream until we have actually uploaded the data
  // to the s3 server.
  TransformStream.call(this, options);

  // We require a callback for returning stream, length etc.
  if (typeof callback !== 'function')
    throw new Error('S3 SA IndirectS3Stream needs callback');

  // We calculate the size on the run, this way we dont need to do fs.stats
  // to get file size
  self._cfsDataLength = 0;

  // This doesnt make the big difference - setting it to true makes sure both
  // read/write streams are ended
  self.allowHalfOpen = true;

  // Callback - will be served with
  // 1. readStream
  // 2. length of data
  // 3. callback to repport errors and end the stream
  self.callback = callback;

  // Get a temporary filename
  self.tempName = temp.path({ suffix: '.cfsS3.bin'});

  // Create a temporary file for as buffer - keeping the data out of memory
  self.tempWriteStream = fs.createWriteStream(self.tempName);
};

util.inherits(IndirectS3Stream, TransformStream);

// We rig the transform - it basically dumps the data into the tempfile
// and sums up the data length
IndirectS3Stream.prototype._transform = function(chunk, encoding, done) {
  var self = this;

  // Add to data length
  self._cfsDataLength += chunk.length;

  // Push to the write stream and let this call done
  self.tempWriteStream.write(chunk, encoding, done);
};

IndirectS3Stream.prototype._flush = function(done) {
  var self = this;

  // End write stream
  self.tempWriteStream.end();

  // Create write stream from temp file
  var readStream = fs.createReadStream(self.tempName);

  readStream.on('error', function(err) {
    // Clean up the tempfile
    try {
      fs.unlinkSync(self.tempName);
    } catch(e) {
      // noop we already got an error to repport
    }
    // Emit the passed error
    self.emit('error', err);
  });

  // Return readstream and size of it
  return self.callback(readStream, self._cfsDataLength, function(err) {
    // When done we emit events
    if (err) {
      self.emit('error', err);
    } else {
      // Emit the end event - should we have our own 'completed' ?
      self.emit('close');
      self.emit('done');
    }

    // Clean up the tempfile
    try {
      fs.unlinkSync(self.tempName);
    }catch(e) {
      // We dont care too much. XXX: should this be handled?
    }
    // Call done - this is not respected
    done(err);
  });
};

// Extend the AWS.S3 API
AWS.S3.prototype.createWriteStream = function(params, options) {
  var self = this;
  params = params || {};

  if (params.ContentLength > 0) {
    // This is direct streaming

    // Create a simple pass through stream
    var PassThroughStream = new PassThrough();

    // Set the body to the pass through stream
    params.Body = PassThroughStream;

    console.log('putObject direct streaming size: ' + params.ContentLength);

    self.putObject(params, function(err) {
      if (err) {
        // Emit S3 error to the stream
        PassThroughStream.emit('error', err);
      } else {
        // Emit a close event - this triggers a complete method
        PassThroughStream.emit('done');
      }
    });

    // Return the pass through stream
    return PassThroughStream;

  } else {
    // No content length? bugger - AWS needs a length for security reasons
    // so we need to stop by the filesystem to get the length - we dont
    // want this buffered up in memory...
    //
    var indirectS3Stream = new IndirectS3Stream({}, function(readStream, size, callback) {
      console.log('CALLBACK got size: ', size);

      // Set the body to the readstream
      params.Body = readStream;

      // Set the content length
      params.ContentLength = size;

      // Send the data to the S3
      self.putObject(params, callback);

    });

    indirectS3Stream.on('error', function(err) {
      console.log(err);
    });

    return indirectS3Stream;
  }
};

AWS.S3.prototype.createReadStream = function(params, options) {
  // Simple wrapper
  return this.getObject(params).createReadStream();
};
