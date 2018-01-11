var Writable = Npm.require('stream').Writable;
var streamBuffers = Npm.require("stream-buffers");

// Extend the Dropbox.Client API
Dropbox.Client.prototype.createReadStream = function (params, options) {
  var key = params.Key;
  var wrappedReadFile = Meteor.wrapAsync(this.readFile, this);
  var readableStreamBuffer = new streamBuffers.ReadableStreamBuffer();
  var buffer;

  // Ask Dropbox to return Buffer instance
  params.buffer = true;
  try {
    buffer = wrappedReadFile(key, params);
  } catch (e) {
    if (FS.debug) console.log('readFile error: ', e);
  }
  
  // Put buffer into the stream
  readableStreamBuffer.put(buffer);
  return readableStreamBuffer;
};

Dropbox.Client.prototype.createWriteStream = function(params, options) {
  var self = this;

  // Create the writeable stream interface.
  var writeStream = Writable({
    highWaterMark: 4194304 // 4 MB
  });
  var partNumber = 1;
  var parts = [];
  var receivedSize = 0;
  var uploadedSize = 0;
  var currentChunk = Buffer(0);
  var maxChunkSize = 5242880;
  var uploadCursor = null;
  var waitingCallback;
  var fileKey = params && params.fileKey || params.Key;
  var key = params && params.Key || params.fileKey;
  var uploadCursor = null;

  // Clean up for Bropbox sdk
  delete params.fileKey;

  // This small function stops the write stream until we have connected with
  // the dropbox server
  var runWhenReady = function(callback) {

    // If we dont have a upload id we are not ready
    if (uploadCursor === null) {

      // We set the waiting callback
      waitingCallback = callback;
    } else {

      // No problem - just continue
      callback();
    }
  };

  //Handler to receive data and upload it to Dropbox.
  writeStream._write = function (chunk, enc, next) {
    currentChunk = Buffer.concat([currentChunk, chunk]);

    // If the current chunk buffer is getting to large, or the stream piped in
    // has ended then flush the chunk buffer downstream to Dropbox via the multipart
    // upload API.
    if(currentChunk.length > maxChunkSize) {

      // Make sure we only run when the dropbox upload is ready
      runWhenReady(function() { flushChunk(next, false); });
    } else {

      // We dont have to contact dropbox for this
      runWhenReady(next);
    }
  };

  // Overwrite the end method so that we can hijack it to flush the last part
  // and then complete the multipart upload
  var _originalEnd = writeStream.end;
  writeStream.end = function (chunk, encoding, callback) {

    // Call the super
    _originalEnd.call(this, chunk, encoding, function () {

      // Make sure we only run when the dropbox upload is ready
      runWhenReady(function() { flushChunk(callback, true); });
    });
  };

  writeStream.on('error', function () {
    if (uploadCursor) {
      if (FS.debug) {
        console.log('Dropbox cursor - ERROR!');
      }
    }
  });

  var flushChunk = function (callback, lastChunk) {
    if (uploadCursor === null) {
      throw new Error('Internal error uploadCursor is null');
    }

    // Get the chunk data
    var uploadingChunk = Buffer(currentChunk.length);
    currentChunk.copy(uploadingChunk);

    // Store the current part number and then increase the counter
    var localChunkNumber = partNumber++;

    // We add the size of data
    receivedSize += uploadingChunk.length;

    // Upload the part
    self.resumableUploadStep(uploadingChunk, uploadCursor, function (err, result) {

      // Call the next data
      if(typeof callback === 'function') {
        callback();
      }

      if(err) {
        writeStream.emit('error', err);
      } else {

        // Increase the upload size
        uploadedSize += uploadingChunk.length;
        parts[localChunkNumber-1] = {
          ETag: result.ETag,
          PartNumber: localChunkNumber
        };

        // XXX: event for debugging
        writeStream.emit('chunk', {
          ETag: result.ETag,
          PartNumber: localChunkNumber,
          receivedSize: receivedSize,
          uploadedSize: uploadedSize
        });

        // The incoming stream has finished giving us all data and we have
        // finished uploading all that data to Dropbox. So tell Dropbox to assemble those
        // parts we uploaded into the final product.
        if(writeStream._writableState.ended === true &&
                uploadedSize === receivedSize && lastChunk) {

          // Complete the upload
          self.resumableUploadFinish(key, uploadCursor, function (err, result) {
            if(err) {
              writeStream.emit('error', err);
            } else {

              // Emit the cfs end event for uploads
              if (FS.debug) {
                console.log('SA Dropbox - DONE!!');
              }
              writeStream.emit('stored', {
                fileKey: fileKey,
                size: uploadedSize,
                storedAt: new Date()
              });
            }

          });
        }
      }
    });

    // Reset the current buffer
    currentChunk = Buffer(0);
  };

  // Needs to initialize the upload
  var emptyBuffer = Buffer(0);

  // Use the Dropbox.Client to initialize a multipart upload to Dropbox.
  // There is no method to initialize the upload, so we pass an empty buffer.
  self.resumableUploadStep(emptyBuffer, null, function (err, data) {
    if(err) {

      // Emit the error
      writeStream.emit('error', err);
    } else {

      // Set the upload id
      uploadCursor = data;

      // Call waiting callback
      if (typeof waitingCallback === 'function') {

        // We call the waiting callback if any now since we established a
        // connection to the dropbox
        waitingCallback();
      }
    }
  });

  // We return the write stream
  return writeStream;
};
