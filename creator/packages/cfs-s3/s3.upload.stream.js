// Try to implement true write stream for s3... To see the difference
// This code is from https://github.com/hughsk/s3-write-stream/blob/master/index.js
//

// Note the original code was really badly formatted - and its buffering all
// data into the memory - This is a poor solution imho... RaiX

var through2 = Npm.require('through2');
var backoff = Npm.require('backoff');
var bl = Npm.require('bl');
var maxSize = 5 * 1024 * 1024; // Max size 5mb?

var boSettings = {
  initialDelay: 500,
  maxDelay: 10000
};

AWS.S3.prototype.createReadStream = function(params, options) {
  // Simple wrapper
  return this.getObject(params).createReadStream();
};

// Extend the AWS.S3 API
AWS.S3.prototype.createWriteStream = function(params, options) {
  var self = this;

  var streamClosed = false;
  var buffer = bl();
  var uploadId = null;
  var pending = 0;
  var part = 1;
  var parts = [];

  var stream = through2(write, flush);
  var bo = backoff.fibonacci(boSettings);
  var lastErr;
  var fileKey = params && (params.fileKey || params.Key);

  // Clean up for AWS sdk
  delete params.fileKey;

  bo.failAfter(10);
  bo.on('backoff', function() {
    self.createMultipartUpload(params
      , function(err, data) {
        if (err) {
          lastErr = err;
          return bo.backoff()
        }
        uploadId = data.UploadId;
        stream.emit('upload started');
      })
  }).on('fail', function() {
    return stream.emit('error', lastErr);
  }).backoff();

  return stream;

  function write(chunk, enc, next) {
    buffer.append(chunk);
    console.log('Upload stream buffer length:', buffer.length, ' CHUNK SIZE:', chunk.length);
    if (buffer.length < maxSize) return next();
    flushChunk(next);
  }

  function flush() {
    streamClosed = true;
    flushChunk();
  }

  function flushChunk(next) {
    var lastErr = null;
    var chunk = part++;
    var uploading = buffer.slice();
    var bo = backoff.fibonacci(boSettings);

    buffer._bufs.length = 0;
    buffer.length = 0;
    pending += 1;

    if (!uploadId) return stream.once('upload started', uploadPart);

    uploadPart();
    function uploadPart() {
      bo.failAfter(5);
      bo.on('backoff', function() {
        self.uploadPart({
          Body: uploading,
          Bucket: params.Bucket,
          Key: params.Key,
          UploadId: uploadId,
          PartNumber: chunk
        }, function(err, result) {
          if (err) {
            lastErr = err;
            return bo.backoff();
          }

          parts[chunk-1] = {
            ETag: result.ETag,
            PartNumber: chunk
          }

          if (next) next()
          if (!--pending && streamClosed) finish();
        })
      }).on('fail', function() {
        return stream.emit('error', lastErr);
      }).backoff()
    }
  }

  function finish() {
    var bo = backoff.fibonacci(boSettings);

    bo.failAfter(10);
    bo.on('backoff', function() {
      self.completeMultipartUpload({
        Bucket: params.Bucket,
        Key: params.Key,
        UploadId: uploadId,
        MultipartUpload: {
          Parts: parts
        }
      }, function(err, result) {
        if (err) {
          lastErr = err;
          return bo.backoff();
        }
        stream.emit('end', fileKey, 0, new Date); //TODO 0 should be the stored filesize
        stream.emit('done');
      })
    }).on('fail', function() {
      stream.emit('error', lastErr);
    }).backoff()
  }
}; // EO write stream
