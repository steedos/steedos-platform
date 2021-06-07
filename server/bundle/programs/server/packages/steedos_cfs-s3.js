(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var global = Package.meteor.global;
var meteorEnv = Package.meteor.meteorEnv;
var ECMAScript = Package.ecmascript.ECMAScript;
var FS = Package['steedos:cfs-base-package'].FS;
var meteorInstall = Package.modules.meteorInstall;
var Promise = Package.promise.Promise;

/* Package-scope variables */
var AWS;

var require = meteorInstall({"node_modules":{"meteor":{"steedos:cfs-s3":{"checkNpm.js":function module(require,exports,module){

///////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                           //
// packages/steedos_cfs-s3/checkNpm.js                                                                       //
//                                                                                                           //
///////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                             //
let checkNpmVersions;
module.link("meteor/tmeasday:check-npm-versions", {
  checkNpmVersions(v) {
    checkNpmVersions = v;
  }

}, 0);

if (Meteor.settings && Meteor.settings.cfs && Meteor.settings.cfs.aws) {
  checkNpmVersions({
    'aws-sdk': "^2.0.23"
  }, 'steedos:cfs-s3');
  AWS = require('aws-sdk');
}
///////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"s3.server.js":function module(){

///////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                           //
// packages/steedos_cfs-s3/s3.server.js                                                                      //
//                                                                                                           //
///////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                             //
if (!AWS) return; // We use the official aws sdk

var validS3ServiceParamKeys = ['endpoint', 'accessKeyId', 'secretAccessKey', 'sessionToken', 'credentials', 'credentialProvider', 'region', 'maxRetries', 'maxRedirects', 'sslEnabled', 'paramValidation', 'computeChecksums', 's3ForcePathStyle', 'httpOptions', 'apiVersion', 'apiVersions', 'logger', 'signatureVersion'];
var validS3PutParamKeys = ['ACL', 'Body', 'Bucket', 'CacheControl', 'ContentDisposition', 'ContentEncoding', 'ContentLanguage', 'ContentLength', 'ContentMD5', 'ContentType', 'Expires', 'GrantFullControl', 'GrantRead', 'GrantReadACP', 'GrantWriteACP', 'Key', 'Metadata', 'ServerSideEncryption', 'StorageClass', 'WebsiteRedirectLocation'];
/**
 * @public
 * @constructor
 * @param {String} name - The store name
 * @param {Object} options
 * @param {String} options.region - Bucket region
 * @param {String} options.bucket - Bucket name
 * @param {String} [options.accessKeyId] - AWS IAM key; required if not set in environment variables
 * @param {String} [options.secretAccessKey] - AWS IAM secret; required if not set in environment variables
 * @param {String} [options.ACL='private'] - ACL for objects when putting
 * @param {String} [options.folder='/'] - Which folder (key prefix) in the bucket to use
 * @param {Function} [options.beforeSave] - Function to run before saving a file from the server. The context of the function will be the `FS.File` instance we're saving. The function may alter its properties.
 * @param {Number} [options.maxTries=5] - Max times to attempt saving a file
 * @returns {FS.StorageAdapter} An instance of FS.StorageAdapter.
 *
 * Creates an S3 store instance on the server. Inherits from FS.StorageAdapter
 * type.
 */

FS.Store.S3 = function (name, options) {
  var self = this;
  if (!(self instanceof FS.Store.S3)) throw new Error('FS.Store.S3 missing keyword "new"');
  options = options || {}; // Determine which folder (key prefix) in the bucket to use

  var folder = options.folder;

  if (typeof folder === "string" && folder.length) {
    if (folder.slice(0, 1) === "/") {
      folder = folder.slice(1);
    }

    if (folder.slice(-1) !== "/") {
      folder += "/";
    }
  } else {
    folder = "";
  }

  var bucket = options.bucket;
  if (!bucket) throw new Error('FS.Store.S3 you must specify the "bucket" option');
  var defaultAcl = options.ACL || 'private'; // Remove serviceParams from SA options
  // options = _.omit(options, validS3ServiceParamKeys);

  var serviceParams = FS.Utility.extend({
    Bucket: bucket,
    region: null,
    //required
    accessKeyId: null,
    //required
    secretAccessKey: null,
    //required
    ACL: defaultAcl
  }, options); // Whitelist serviceParams, else aws-sdk throws an error
  // XXX: I've commented this at the moment... It stopped things from working
  // we have to check up on this
  // serviceParams = _.pick(serviceParams, validS3ServiceParamKeys);
  // Create S3 service

  var S3 = new AWS.S3(serviceParams);
  return new FS.StorageAdapter(name, options, {
    typeName: 'storage.s3',
    fileKey: function (fileObj) {
      // Lookup the copy
      var info = fileObj && fileObj._getInfo(name); // If the store and key is found return the key


      if (info && info.key) return info.key;
      var filename = fileObj.name();
      var filenameInStore = fileObj.name({
        store: name
      }); // If no store key found we resolve / generate a key

      return fileObj.collectionName + '/' + fileObj.collectionName + "-" + fileObj._id + '-' + (filenameInStore || filename);
    },
    createReadStream: function (fileKey, options) {
      return S3.createReadStream({
        Bucket: bucket,
        Key: folder + fileKey
      });
    },
    // Comment to documentation: Set options.ContentLength otherwise the
    // indirect stream will be used creating extra overhead on the filesystem.
    // An easy way if the data is not transformed is to set the
    // options.ContentLength = fileObj.size ...
    createWriteStream: function (fileKey, options) {
      options = options || {};

      if (options.contentType) {
        options.ContentType = options.contentType;
      } // We dont support array of aliases


      delete options.aliases; // We dont support contentType

      delete options.contentType; // We dont support metadata use Metadata?

      delete options.metadata; // Set options

      var options = FS.Utility.extend({
        Bucket: bucket,
        Key: folder + fileKey,
        fileKey: fileKey,
        ACL: defaultAcl
      }, options);
      return S3.createWriteStream(options);
    },
    remove: function (fileKey, callback) {
      S3.deleteObject({
        Bucket: bucket,
        Key: folder + fileKey
      }, function (error) {
        callback(error, !error);
      }); // callback(null, true);
    },
    watch: function () {
      throw new Error("S3 storage adapter does not support the sync option");
    }
  });
};
///////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"s3.upload.stream2.js":function module(require){

///////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                           //
// packages/steedos_cfs-s3/s3.upload.stream2.js                                                              //
//                                                                                                           //
///////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                             //
if (!AWS) return;

var Writable = require('stream').Writable; // This is based on the code from
// https://github.com/nathanpeck/s3-upload-stream/blob/master/lib/s3-upload-stream.js
// But much is rewritten and adapted to cfs


AWS.S3.prototype.createReadStream = function (params, options) {
  // Simple wrapper
  return this.getObject(params).createReadStream();
}; // Extend the AWS.S3 API


AWS.S3.prototype.createWriteStream = function (params, options) {
  var self = this; //Create the writeable stream interface.

  var writeStream = Writable({
    highWaterMark: 4194304 // 4 MB

  });
  var partNumber = 1;
  var parts = [];
  var receivedSize = 0;
  var uploadedSize = 0;
  var currentChunk = Buffer(0);
  var maxChunkSize = 5242880;
  var multipartUploadID = null;
  var waitingCallback;
  var fileKey = params && (params.fileKey || params.Key); // Clean up for AWS sdk

  delete params.fileKey; // This small function stops the write stream until we have connected with
  // the s3 server

  var runWhenReady = function (callback) {
    // If we dont have a upload id we are not ready
    if (multipartUploadID === null) {
      // We set the waiting callback
      waitingCallback = callback;
    } else {
      // No problem - just continue
      callback();
    }
  }; //Handler to receive data and upload it to S3.


  writeStream._write = function (chunk, enc, next) {
    currentChunk = Buffer.concat([currentChunk, chunk]); // If the current chunk buffer is getting to large, or the stream piped in
    // has ended then flush the chunk buffer downstream to S3 via the multipart
    // upload API.

    if (currentChunk.length > maxChunkSize) {
      // Make sure we only run when the s3 upload is ready
      runWhenReady(function () {
        flushChunk(next, false);
      });
    } else {
      // We dont have to contact s3 for this
      runWhenReady(next);
    }
  }; // Overwrite the end method so that we can hijack it to flush the last part
  // and then complete the multipart upload


  var _originalEnd = writeStream.end;

  writeStream.end = function (chunk, encoding, callback) {
    // Call the super
    _originalEnd.call(this, chunk, encoding, function () {
      // Make sure we only run when the s3 upload is ready
      runWhenReady(function () {
        flushChunk(callback, true);
      });
    });
  };

  writeStream.on('error', function () {
    if (multipartUploadID) {
      if (FS.debug) {
        console.log('SA S3 - ERROR!!');
      }

      self.abortMultipartUpload({
        Bucket: params.Bucket,
        Key: params.Key,
        UploadId: multipartUploadID
      }, function (err) {
        if (err) {
          console.error('SA S3 - Could not abort multipart upload', err);
        }
      });
    }
  });

  var flushChunk = function (callback, lastChunk) {
    if (multipartUploadID === null) {
      throw new Error('Internal error multipartUploadID is null');
    } // Get the chunk data


    var uploadingChunk = Buffer(currentChunk.length);
    currentChunk.copy(uploadingChunk); // Store the current part number and then increase the counter

    var localChunkNumber = partNumber++; // We add the size of data

    receivedSize += uploadingChunk.length; // Upload the part

    self.uploadPart({
      Body: uploadingChunk,
      Bucket: params.Bucket,
      Key: params.Key,
      UploadId: multipartUploadID,
      PartNumber: localChunkNumber
    }, function (err, result) {
      // Call the next data
      if (typeof callback === 'function') {
        callback();
      }

      if (err) {
        writeStream.emit('error', err);
      } else {
        // Increase the upload size
        uploadedSize += uploadingChunk.length;
        parts[localChunkNumber - 1] = {
          ETag: result.ETag,
          PartNumber: localChunkNumber
        }; // XXX: event for debugging

        writeStream.emit('chunk', {
          ETag: result.ETag,
          PartNumber: localChunkNumber,
          receivedSize: receivedSize,
          uploadedSize: uploadedSize
        }); // The incoming stream has finished giving us all data and we have
        // finished uploading all that data to S3. So tell S3 to assemble those
        // parts we uploaded into the final product.

        if (writeStream._writableState.ended === true && uploadedSize === receivedSize && lastChunk) {
          // Complete the upload
          self.completeMultipartUpload({
            Bucket: params.Bucket,
            Key: params.Key,
            UploadId: multipartUploadID,
            MultipartUpload: {
              Parts: parts
            }
          }, function (err, result) {
            if (err) {
              writeStream.emit('error', err);
            } else {
              // Emit the cfs end event for uploads
              if (FS.debug) {
                console.log('SA S3 - DONE!!');
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
    }); // Reset the current buffer

    currentChunk = Buffer(0);
  }; //Use the S3 client to initialize a multipart upload to S3.


  self.createMultipartUpload(params, function (err, data) {
    if (err) {
      // Emit the error
      writeStream.emit('error', err);
    } else {
      // Set the upload id
      multipartUploadID = data.UploadId; // Call waiting callback

      if (typeof waitingCallback === 'function') {
        // We call the waiting callback if any now since we established a
        // connection to the s3
        waitingCallback();
      }
    }
  }); // We return the write stream

  return writeStream;
};
///////////////////////////////////////////////////////////////////////////////////////////////////////////////

}}}}},{
  "extensions": [
    ".js",
    ".json"
  ]
});

require("/node_modules/meteor/steedos:cfs-s3/checkNpm.js");
require("/node_modules/meteor/steedos:cfs-s3/s3.server.js");
require("/node_modules/meteor/steedos:cfs-s3/s3.upload.stream2.js");

/* Exports */
Package._define("steedos:cfs-s3");

})();

//# sourceURL=meteor://💻app/packages/steedos_cfs-s3.js
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvczpjZnMtczMvY2hlY2tOcG0uanMiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3M6Y2ZzLXMzL3MzLnNlcnZlci5qcyIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvczpjZnMtczMvczMudXBsb2FkLnN0cmVhbTIuanMiXSwibmFtZXMiOlsiY2hlY2tOcG1WZXJzaW9ucyIsIm1vZHVsZSIsImxpbmsiLCJ2IiwiTWV0ZW9yIiwic2V0dGluZ3MiLCJjZnMiLCJhd3MiLCJBV1MiLCJyZXF1aXJlIiwidmFsaWRTM1NlcnZpY2VQYXJhbUtleXMiLCJ2YWxpZFMzUHV0UGFyYW1LZXlzIiwiRlMiLCJTdG9yZSIsIlMzIiwibmFtZSIsIm9wdGlvbnMiLCJzZWxmIiwiRXJyb3IiLCJmb2xkZXIiLCJsZW5ndGgiLCJzbGljZSIsImJ1Y2tldCIsImRlZmF1bHRBY2wiLCJBQ0wiLCJzZXJ2aWNlUGFyYW1zIiwiVXRpbGl0eSIsImV4dGVuZCIsIkJ1Y2tldCIsInJlZ2lvbiIsImFjY2Vzc0tleUlkIiwic2VjcmV0QWNjZXNzS2V5IiwiU3RvcmFnZUFkYXB0ZXIiLCJ0eXBlTmFtZSIsImZpbGVLZXkiLCJmaWxlT2JqIiwiaW5mbyIsIl9nZXRJbmZvIiwia2V5IiwiZmlsZW5hbWUiLCJmaWxlbmFtZUluU3RvcmUiLCJzdG9yZSIsImNvbGxlY3Rpb25OYW1lIiwiX2lkIiwiY3JlYXRlUmVhZFN0cmVhbSIsIktleSIsImNyZWF0ZVdyaXRlU3RyZWFtIiwiY29udGVudFR5cGUiLCJDb250ZW50VHlwZSIsImFsaWFzZXMiLCJtZXRhZGF0YSIsInJlbW92ZSIsImNhbGxiYWNrIiwiZGVsZXRlT2JqZWN0IiwiZXJyb3IiLCJ3YXRjaCIsIldyaXRhYmxlIiwicHJvdG90eXBlIiwicGFyYW1zIiwiZ2V0T2JqZWN0Iiwid3JpdGVTdHJlYW0iLCJoaWdoV2F0ZXJNYXJrIiwicGFydE51bWJlciIsInBhcnRzIiwicmVjZWl2ZWRTaXplIiwidXBsb2FkZWRTaXplIiwiY3VycmVudENodW5rIiwiQnVmZmVyIiwibWF4Q2h1bmtTaXplIiwibXVsdGlwYXJ0VXBsb2FkSUQiLCJ3YWl0aW5nQ2FsbGJhY2siLCJydW5XaGVuUmVhZHkiLCJfd3JpdGUiLCJjaHVuayIsImVuYyIsIm5leHQiLCJjb25jYXQiLCJmbHVzaENodW5rIiwiX29yaWdpbmFsRW5kIiwiZW5kIiwiZW5jb2RpbmciLCJjYWxsIiwib24iLCJkZWJ1ZyIsImNvbnNvbGUiLCJsb2ciLCJhYm9ydE11bHRpcGFydFVwbG9hZCIsIlVwbG9hZElkIiwiZXJyIiwibGFzdENodW5rIiwidXBsb2FkaW5nQ2h1bmsiLCJjb3B5IiwibG9jYWxDaHVua051bWJlciIsInVwbG9hZFBhcnQiLCJCb2R5IiwiUGFydE51bWJlciIsInJlc3VsdCIsImVtaXQiLCJFVGFnIiwiX3dyaXRhYmxlU3RhdGUiLCJlbmRlZCIsImNvbXBsZXRlTXVsdGlwYXJ0VXBsb2FkIiwiTXVsdGlwYXJ0VXBsb2FkIiwiUGFydHMiLCJzaXplIiwic3RvcmVkQXQiLCJEYXRlIiwiY3JlYXRlTXVsdGlwYXJ0VXBsb2FkIiwiZGF0YSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLElBQUlBLGdCQUFKO0FBQXFCQyxNQUFNLENBQUNDLElBQVAsQ0FBWSxvQ0FBWixFQUFpRDtBQUFDRixrQkFBZ0IsQ0FBQ0csQ0FBRCxFQUFHO0FBQUNILG9CQUFnQixHQUFDRyxDQUFqQjtBQUFtQjs7QUFBeEMsQ0FBakQsRUFBMkYsQ0FBM0Y7O0FBSXJCLElBQUlDLE1BQU0sQ0FBQ0MsUUFBUCxJQUFtQkQsTUFBTSxDQUFDQyxRQUFQLENBQWdCQyxHQUFuQyxJQUEwQ0YsTUFBTSxDQUFDQyxRQUFQLENBQWdCQyxHQUFoQixDQUFvQkMsR0FBbEUsRUFBdUU7QUFDckVQLGtCQUFnQixDQUFDO0FBQ2YsZUFBVztBQURJLEdBQUQsRUFFYixnQkFGYSxDQUFoQjtBQUlBUSxLQUFHLEdBQUdD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QUNGO0FBQ0YsS0E3REQsRUFoQjhDLENBK0U5Qzs7QUFDQXhDLGdCQUFZLEdBQUdDLE1BQU0sQ0FBQyxDQUFELENBQXJCO0FBQ0QsR0FqRkQsQ0E5RTZELENBaUs3RDs7O0FBQ0FsRCxNQUFJLENBQUMwRixxQkFBTCxDQUE0QmpELE1BQTVCLEVBQW9DLFVBQVU4QixHQUFWLEVBQWVvQixJQUFmLEVBQXFCO0FBQ3ZELFFBQUdwQixHQUFILEVBQVE7QUFDTjtBQUNBNUIsaUJBQVcsQ0FBQ3FDLElBQVosQ0FBaUIsT0FBakIsRUFBMEJULEdBQTFCO0FBQ0QsS0FIRCxNQUdPO0FBQ0w7QUFDQW5CLHVCQUFpQixHQUFHdUMsSUFBSSxDQUFDckIsUUFBekIsQ0FGSyxDQUlMOztBQUNBLFVBQUksT0FBT2pCLGVBQVAsS0FBMkIsVUFBL0IsRUFBMkM7QUFDekM7QUFDQTtBQUNBQSx1QkFBZTtBQUNoQjtBQUVGO0FBQ0YsR0FoQkQsRUFsSzZELENBb0w3RDs7QUFDQSxTQUFPVixXQUFQO0FBQ0QsQ0F0TEQsQyIsImZpbGUiOiIvcGFja2FnZXMvc3RlZWRvc19jZnMtczMuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge1xyXG4gIGNoZWNrTnBtVmVyc2lvbnNcclxufSBmcm9tICdtZXRlb3IvdG1lYXNkYXk6Y2hlY2stbnBtLXZlcnNpb25zJztcclxuXHJcbmlmIChNZXRlb3Iuc2V0dGluZ3MgJiYgTWV0ZW9yLnNldHRpbmdzLmNmcyAmJiBNZXRlb3Iuc2V0dGluZ3MuY2ZzLmF3cykge1xyXG4gIGNoZWNrTnBtVmVyc2lvbnMoe1xyXG4gICAgJ2F3cy1zZGsnOiBcIl4yLjAuMjNcIlxyXG4gIH0sICdzdGVlZG9zOmNmcy1zMycpO1xyXG5cclxuICBBV1MgPSByZXF1aXJlKCdhd3Mtc2RrJyk7XHJcbn1cclxuIiwiaWYgKCFBV1MpXHJcbiAgcmV0dXJuO1xyXG5cclxuLy8gV2UgdXNlIHRoZSBvZmZpY2lhbCBhd3Mgc2RrXHJcblxyXG5cclxudmFyIHZhbGlkUzNTZXJ2aWNlUGFyYW1LZXlzID0gW1xyXG4gICdlbmRwb2ludCcsXHJcbiAgJ2FjY2Vzc0tleUlkJyxcclxuICAnc2VjcmV0QWNjZXNzS2V5JyxcclxuICAnc2Vzc2lvblRva2VuJyxcclxuICAnY3JlZGVudGlhbHMnLFxyXG4gICdjcmVkZW50aWFsUHJvdmlkZXInLFxyXG4gICdyZWdpb24nLFxyXG4gICdtYXhSZXRyaWVzJyxcclxuICAnbWF4UmVkaXJlY3RzJyxcclxuICAnc3NsRW5hYmxlZCcsXHJcbiAgJ3BhcmFtVmFsaWRhdGlvbicsXHJcbiAgJ2NvbXB1dGVDaGVja3N1bXMnLFxyXG4gICdzM0ZvcmNlUGF0aFN0eWxlJyxcclxuICAnaHR0cE9wdGlvbnMnLFxyXG4gICdhcGlWZXJzaW9uJyxcclxuICAnYXBpVmVyc2lvbnMnLFxyXG4gICdsb2dnZXInLFxyXG4gICdzaWduYXR1cmVWZXJzaW9uJ1xyXG5dO1xyXG52YXIgdmFsaWRTM1B1dFBhcmFtS2V5cyA9IFtcclxuICAnQUNMJyxcclxuICAnQm9keScsXHJcbiAgJ0J1Y2tldCcsXHJcbiAgJ0NhY2hlQ29udHJvbCcsXHJcbiAgJ0NvbnRlbnREaXNwb3NpdGlvbicsXHJcbiAgJ0NvbnRlbnRFbmNvZGluZycsXHJcbiAgJ0NvbnRlbnRMYW5ndWFnZScsXHJcbiAgJ0NvbnRlbnRMZW5ndGgnLFxyXG4gICdDb250ZW50TUQ1JyxcclxuICAnQ29udGVudFR5cGUnLFxyXG4gICdFeHBpcmVzJyxcclxuICAnR3JhbnRGdWxsQ29udHJvbCcsXHJcbiAgJ0dyYW50UmVhZCcsXHJcbiAgJ0dyYW50UmVhZEFDUCcsXHJcbiAgJ0dyYW50V3JpdGVBQ1AnLFxyXG4gICdLZXknLFxyXG4gICdNZXRhZGF0YScsXHJcbiAgJ1NlcnZlclNpZGVFbmNyeXB0aW9uJyxcclxuICAnU3RvcmFnZUNsYXNzJyxcclxuICAnV2Vic2l0ZVJlZGlyZWN0TG9jYXRpb24nXHJcbl07XHJcblxyXG4vKipcclxuICogQHB1YmxpY1xyXG4gKiBAY29uc3RydWN0b3JcclxuICogQHBhcmFtIHtTdHJpbmd9IG5hbWUgLSBUaGUgc3RvcmUgbmFtZVxyXG4gKiBAcGFyYW0ge09iamVjdH0gb3B0aW9uc1xyXG4gKiBAcGFyYW0ge1N0cmluZ30gb3B0aW9ucy5yZWdpb24gLSBCdWNrZXQgcmVnaW9uXHJcbiAqIEBwYXJhbSB7U3RyaW5nfSBvcHRpb25zLmJ1Y2tldCAtIEJ1Y2tldCBuYW1lXHJcbiAqIEBwYXJhbSB7U3RyaW5nfSBbb3B0aW9ucy5hY2Nlc3NLZXlJZF0gLSBBV1MgSUFNIGtleTsgcmVxdWlyZWQgaWYgbm90IHNldCBpbiBlbnZpcm9ubWVudCB2YXJpYWJsZXNcclxuICogQHBhcmFtIHtTdHJpbmd9IFtvcHRpb25zLnNlY3JldEFjY2Vzc0tleV0gLSBBV1MgSUFNIHNlY3JldDsgcmVxdWlyZWQgaWYgbm90IHNldCBpbiBlbnZpcm9ubWVudCB2YXJpYWJsZXNcclxuICogQHBhcmFtIHtTdHJpbmd9IFtvcHRpb25zLkFDTD0ncHJpdmF0ZSddIC0gQUNMIGZvciBvYmplY3RzIHdoZW4gcHV0dGluZ1xyXG4gKiBAcGFyYW0ge1N0cmluZ30gW29wdGlvbnMuZm9sZGVyPScvJ10gLSBXaGljaCBmb2xkZXIgKGtleSBwcmVmaXgpIGluIHRoZSBidWNrZXQgdG8gdXNlXHJcbiAqIEBwYXJhbSB7RnVuY3Rpb259IFtvcHRpb25zLmJlZm9yZVNhdmVdIC0gRnVuY3Rpb24gdG8gcnVuIGJlZm9yZSBzYXZpbmcgYSBmaWxlIGZyb20gdGhlIHNlcnZlci4gVGhlIGNvbnRleHQgb2YgdGhlIGZ1bmN0aW9uIHdpbGwgYmUgdGhlIGBGUy5GaWxlYCBpbnN0YW5jZSB3ZSdyZSBzYXZpbmcuIFRoZSBmdW5jdGlvbiBtYXkgYWx0ZXIgaXRzIHByb3BlcnRpZXMuXHJcbiAqIEBwYXJhbSB7TnVtYmVyfSBbb3B0aW9ucy5tYXhUcmllcz01XSAtIE1heCB0aW1lcyB0byBhdHRlbXB0IHNhdmluZyBhIGZpbGVcclxuICogQHJldHVybnMge0ZTLlN0b3JhZ2VBZGFwdGVyfSBBbiBpbnN0YW5jZSBvZiBGUy5TdG9yYWdlQWRhcHRlci5cclxuICpcclxuICogQ3JlYXRlcyBhbiBTMyBzdG9yZSBpbnN0YW5jZSBvbiB0aGUgc2VydmVyLiBJbmhlcml0cyBmcm9tIEZTLlN0b3JhZ2VBZGFwdGVyXHJcbiAqIHR5cGUuXHJcbiAqL1xyXG5GUy5TdG9yZS5TMyA9IGZ1bmN0aW9uKG5hbWUsIG9wdGlvbnMpIHtcclxuICB2YXIgc2VsZiA9IHRoaXM7XHJcbiAgaWYgKCEoc2VsZiBpbnN0YW5jZW9mIEZTLlN0b3JlLlMzKSlcclxuICAgIHRocm93IG5ldyBFcnJvcignRlMuU3RvcmUuUzMgbWlzc2luZyBrZXl3b3JkIFwibmV3XCInKTtcclxuXHJcbiAgb3B0aW9ucyA9IG9wdGlvbnMgfHwge307XHJcblxyXG4gIC8vIERldGVybWluZSB3aGljaCBmb2xkZXIgKGtleSBwcmVmaXgpIGluIHRoZSBidWNrZXQgdG8gdXNlXHJcbiAgdmFyIGZvbGRlciA9IG9wdGlvbnMuZm9sZGVyO1xyXG4gIGlmICh0eXBlb2YgZm9sZGVyID09PSBcInN0cmluZ1wiICYmIGZvbGRlci5sZW5ndGgpIHtcclxuICAgIGlmIChmb2xkZXIuc2xpY2UoMCwgMSkgPT09IFwiL1wiKSB7XHJcbiAgICAgIGZvbGRlciA9IGZvbGRlci5zbGljZSgxKTtcclxuICAgIH1cclxuICAgIGlmIChmb2xkZXIuc2xpY2UoLTEpICE9PSBcIi9cIikge1xyXG4gICAgICBmb2xkZXIgKz0gXCIvXCI7XHJcbiAgICB9XHJcbiAgfSBlbHNlIHtcclxuICAgIGZvbGRlciA9IFwiXCI7XHJcbiAgfVxyXG5cclxuICB2YXIgYnVja2V0ID0gb3B0aW9ucy5idWNrZXQ7XHJcbiAgaWYgKCFidWNrZXQpXHJcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ0ZTLlN0b3JlLlMzIHlvdSBtdXN0IHNwZWNpZnkgdGhlIFwiYnVja2V0XCIgb3B0aW9uJyk7XHJcblxyXG4gIHZhciBkZWZhdWx0QWNsID0gb3B0aW9ucy5BQ0wgfHwgJ3ByaXZhdGUnO1xyXG5cclxuICAvLyBSZW1vdmUgc2VydmljZVBhcmFtcyBmcm9tIFNBIG9wdGlvbnNcclxuICAvLyBvcHRpb25zID0gXy5vbWl0KG9wdGlvbnMsIHZhbGlkUzNTZXJ2aWNlUGFyYW1LZXlzKTtcclxuXHJcbiAgdmFyIHNlcnZpY2VQYXJhbXMgPSBGUy5VdGlsaXR5LmV4dGVuZCh7XHJcbiAgICBCdWNrZXQ6IGJ1Y2tldCxcclxuICAgIHJlZ2lvbjogbnVsbCwgLy9yZXF1aXJlZFxyXG4gICAgYWNjZXNzS2V5SWQ6IG51bGwsIC8vcmVxdWlyZWRcclxuICAgIHNlY3JldEFjY2Vzc0tleTogbnVsbCwgLy9yZXF1aXJlZFxyXG4gICAgQUNMOiBkZWZhdWx0QWNsXHJcbiAgfSwgb3B0aW9ucyk7XHJcblxyXG4gIC8vIFdoaXRlbGlzdCBzZXJ2aWNlUGFyYW1zLCBlbHNlIGF3cy1zZGsgdGhyb3dzIGFuIGVycm9yXHJcbiAgLy8gWFhYOiBJJ3ZlIGNvbW1lbnRlZCB0aGlzIGF0IHRoZSBtb21lbnQuLi4gSXQgc3RvcHBlZCB0aGluZ3MgZnJvbSB3b3JraW5nXHJcbiAgLy8gd2UgaGF2ZSB0byBjaGVjayB1cCBvbiB0aGlzXHJcbiAgLy8gc2VydmljZVBhcmFtcyA9IF8ucGljayhzZXJ2aWNlUGFyYW1zLCB2YWxpZFMzU2VydmljZVBhcmFtS2V5cyk7XHJcblxyXG4gIC8vIENyZWF0ZSBTMyBzZXJ2aWNlXHJcbiAgdmFyIFMzID0gbmV3IEFXUy5TMyhzZXJ2aWNlUGFyYW1zKTtcclxuXHJcbiAgcmV0dXJuIG5ldyBGUy5TdG9yYWdlQWRhcHRlcihuYW1lLCBvcHRpb25zLCB7XHJcbiAgICB0eXBlTmFtZTogJ3N0b3JhZ2UuczMnLFxyXG4gICAgZmlsZUtleTogZnVuY3Rpb24oZmlsZU9iaikge1xyXG4gICAgICAvLyBMb29rdXAgdGhlIGNvcHlcclxuICAgICAgdmFyIGluZm8gPSBmaWxlT2JqICYmIGZpbGVPYmouX2dldEluZm8obmFtZSk7XHJcbiAgICAgIC8vIElmIHRoZSBzdG9yZSBhbmQga2V5IGlzIGZvdW5kIHJldHVybiB0aGUga2V5XHJcbiAgICAgIGlmIChpbmZvICYmIGluZm8ua2V5KSByZXR1cm4gaW5mby5rZXk7XHJcblxyXG4gICAgICB2YXIgZmlsZW5hbWUgPSBmaWxlT2JqLm5hbWUoKTtcclxuICAgICAgdmFyIGZpbGVuYW1lSW5TdG9yZSA9IGZpbGVPYmoubmFtZSh7XHJcbiAgICAgICAgc3RvcmU6IG5hbWVcclxuICAgICAgfSk7XHJcblxyXG4gICAgICAvLyBJZiBubyBzdG9yZSBrZXkgZm91bmQgd2UgcmVzb2x2ZSAvIGdlbmVyYXRlIGEga2V5XHJcbiAgICAgIHJldHVybiBmaWxlT2JqLmNvbGxlY3Rpb25OYW1lICsgJy8nICsgZmlsZU9iai5jb2xsZWN0aW9uTmFtZSArIFwiLVwiICsgZmlsZU9iai5faWQgKyAnLScgKyAoZmlsZW5hbWVJblN0b3JlIHx8IGZpbGVuYW1lKTtcclxuICAgIH0sXHJcbiAgICBjcmVhdGVSZWFkU3RyZWFtOiBmdW5jdGlvbihmaWxlS2V5LCBvcHRpb25zKSB7XHJcblxyXG4gICAgICByZXR1cm4gUzMuY3JlYXRlUmVhZFN0cmVhbSh7XHJcbiAgICAgICAgQnVja2V0OiBidWNrZXQsXHJcbiAgICAgICAgS2V5OiBmb2xkZXIgKyBmaWxlS2V5XHJcbiAgICAgIH0pO1xyXG5cclxuICAgIH0sXHJcbiAgICAvLyBDb21tZW50IHRvIGRvY3VtZW50YXRpb246IFNldCBvcHRpb25zLkNvbnRlbnRMZW5ndGggb3RoZXJ3aXNlIHRoZVxyXG4gICAgLy8gaW5kaXJlY3Qgc3RyZWFtIHdpbGwgYmUgdXNlZCBjcmVhdGluZyBleHRyYSBvdmVyaGVhZCBvbiB0aGUgZmlsZXN5c3RlbS5cclxuICAgIC8vIEFuIGVhc3kgd2F5IGlmIHRoZSBkYXRhIGlzIG5vdCB0cmFuc2Zvcm1lZCBpcyB0byBzZXQgdGhlXHJcbiAgICAvLyBvcHRpb25zLkNvbnRlbnRMZW5ndGggPSBmaWxlT2JqLnNpemUgLi4uXHJcbiAgICBjcmVhdGVXcml0ZVN0cmVhbTogZnVuY3Rpb24oZmlsZUtleSwgb3B0aW9ucykge1xyXG4gICAgICBvcHRpb25zID0gb3B0aW9ucyB8fCB7fTtcclxuXHJcbiAgICAgIGlmIChvcHRpb25zLmNvbnRlbnRUeXBlKSB7XHJcbiAgICAgICAgb3B0aW9ucy5Db250ZW50VHlwZSA9IG9wdGlvbnMuY29udGVudFR5cGU7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIC8vIFdlIGRvbnQgc3VwcG9ydCBhcnJheSBvZiBhbGlhc2VzXHJcbiAgICAgIGRlbGV0ZSBvcHRpb25zLmFsaWFzZXM7XHJcbiAgICAgIC8vIFdlIGRvbnQgc3VwcG9ydCBjb250ZW50VHlwZVxyXG4gICAgICBkZWxldGUgb3B0aW9ucy5jb250ZW50VHlwZTtcclxuICAgICAgLy8gV2UgZG9udCBzdXBwb3J0IG1ldGFkYXRhIHVzZSBNZXRhZGF0YT9cclxuICAgICAgZGVsZXRlIG9wdGlvbnMubWV0YWRhdGE7XHJcblxyXG4gICAgICAvLyBTZXQgb3B0aW9uc1xyXG4gICAgICB2YXIgb3B0aW9ucyA9IEZTLlV0aWxpdHkuZXh0ZW5kKHtcclxuICAgICAgICBCdWNrZXQ6IGJ1Y2tldCxcclxuICAgICAgICBLZXk6IGZvbGRlciArIGZpbGVLZXksXHJcbiAgICAgICAgZmlsZUtleTogZmlsZUtleSxcclxuICAgICAgICBBQ0w6IGRlZmF1bHRBY2xcclxuICAgICAgfSwgb3B0aW9ucyk7XHJcblxyXG4gICAgICByZXR1cm4gUzMuY3JlYXRlV3JpdGVTdHJlYW0ob3B0aW9ucyk7XHJcbiAgICB9LFxyXG4gICAgcmVtb3ZlOiBmdW5jdGlvbihmaWxlS2V5LCBjYWxsYmFjaykge1xyXG5cclxuICAgICAgUzMuZGVsZXRlT2JqZWN0KHtcclxuICAgICAgICBCdWNrZXQ6IGJ1Y2tldCxcclxuICAgICAgICBLZXk6IGZvbGRlciArIGZpbGVLZXlcclxuICAgICAgfSwgZnVuY3Rpb24oZXJyb3IpIHtcclxuICAgICAgICBjYWxsYmFjayhlcnJvciwgIWVycm9yKTtcclxuICAgICAgfSk7XHJcbiAgICAgIC8vIGNhbGxiYWNrKG51bGwsIHRydWUpO1xyXG4gICAgfSxcclxuICAgIHdhdGNoOiBmdW5jdGlvbigpIHtcclxuICAgICAgdGhyb3cgbmV3IEVycm9yKFwiUzMgc3RvcmFnZSBhZGFwdGVyIGRvZXMgbm90IHN1cHBvcnQgdGhlIHN5bmMgb3B0aW9uXCIpO1xyXG4gICAgfVxyXG4gIH0pO1xyXG59OyIsImlmICghQVdTKVxyXG4gIHJldHVybjtcclxuXHJcbnZhciBXcml0YWJsZSA9IHJlcXVpcmUoJ3N0cmVhbScpLldyaXRhYmxlO1xyXG5cclxuLy8gVGhpcyBpcyBiYXNlZCBvbiB0aGUgY29kZSBmcm9tXHJcbi8vIGh0dHBzOi8vZ2l0aHViLmNvbS9uYXRoYW5wZWNrL3MzLXVwbG9hZC1zdHJlYW0vYmxvYi9tYXN0ZXIvbGliL3MzLXVwbG9hZC1zdHJlYW0uanNcclxuLy8gQnV0IG11Y2ggaXMgcmV3cml0dGVuIGFuZCBhZGFwdGVkIHRvIGNmc1xyXG5cclxuQVdTLlMzLnByb3RvdHlwZS5jcmVhdGVSZWFkU3RyZWFtID0gZnVuY3Rpb24ocGFyYW1zLCBvcHRpb25zKSB7XHJcbiAgLy8gU2ltcGxlIHdyYXBwZXJcclxuICByZXR1cm4gdGhpcy5nZXRPYmplY3QocGFyYW1zKS5jcmVhdGVSZWFkU3RyZWFtKCk7XHJcbn07XHJcblxyXG4vLyBFeHRlbmQgdGhlIEFXUy5TMyBBUElcclxuQVdTLlMzLnByb3RvdHlwZS5jcmVhdGVXcml0ZVN0cmVhbSA9IGZ1bmN0aW9uKHBhcmFtcywgb3B0aW9ucykge1xyXG4gIHZhciBzZWxmID0gdGhpcztcclxuXHJcbiAgLy9DcmVhdGUgdGhlIHdyaXRlYWJsZSBzdHJlYW0gaW50ZXJmYWNlLlxyXG4gIHZhciB3cml0ZVN0cmVhbSA9IFdyaXRhYmxlKHtcclxuICAgIGhpZ2hXYXRlck1hcms6IDQxOTQzMDQgLy8gNCBNQlxyXG4gIH0pO1xyXG5cclxuICB2YXIgcGFydE51bWJlciA9IDE7XHJcbiAgdmFyIHBhcnRzID0gW107XHJcbiAgdmFyIHJlY2VpdmVkU2l6ZSA9IDA7XHJcbiAgdmFyIHVwbG9hZGVkU2l6ZSA9IDA7XHJcbiAgdmFyIGN1cnJlbnRDaHVuayA9IEJ1ZmZlcigwKTtcclxuICB2YXIgbWF4Q2h1bmtTaXplID0gNTI0Mjg4MDtcclxuICB2YXIgbXVsdGlwYXJ0VXBsb2FkSUQgPSBudWxsO1xyXG4gIHZhciB3YWl0aW5nQ2FsbGJhY2s7XHJcbiAgdmFyIGZpbGVLZXkgPSBwYXJhbXMgJiYgKHBhcmFtcy5maWxlS2V5IHx8IHBhcmFtcy5LZXkpO1xyXG5cclxuICAvLyBDbGVhbiB1cCBmb3IgQVdTIHNka1xyXG4gIGRlbGV0ZSBwYXJhbXMuZmlsZUtleTtcclxuXHJcbiAgLy8gVGhpcyBzbWFsbCBmdW5jdGlvbiBzdG9wcyB0aGUgd3JpdGUgc3RyZWFtIHVudGlsIHdlIGhhdmUgY29ubmVjdGVkIHdpdGhcclxuICAvLyB0aGUgczMgc2VydmVyXHJcbiAgdmFyIHJ1bldoZW5SZWFkeSA9IGZ1bmN0aW9uKGNhbGxiYWNrKSB7XHJcbiAgICAvLyBJZiB3ZSBkb250IGhhdmUgYSB1cGxvYWQgaWQgd2UgYXJlIG5vdCByZWFkeVxyXG4gICAgaWYgKG11bHRpcGFydFVwbG9hZElEID09PSBudWxsKSB7XHJcbiAgICAgIC8vIFdlIHNldCB0aGUgd2FpdGluZyBjYWxsYmFja1xyXG4gICAgICB3YWl0aW5nQ2FsbGJhY2sgPSBjYWxsYmFjaztcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIC8vIE5vIHByb2JsZW0gLSBqdXN0IGNvbnRpbnVlXHJcbiAgICAgIGNhbGxiYWNrKCk7XHJcbiAgICB9XHJcbiAgfTtcclxuXHJcbiAgLy9IYW5kbGVyIHRvIHJlY2VpdmUgZGF0YSBhbmQgdXBsb2FkIGl0IHRvIFMzLlxyXG4gIHdyaXRlU3RyZWFtLl93cml0ZSA9IGZ1bmN0aW9uIChjaHVuaywgZW5jLCBuZXh0KSB7XHJcbiAgICBjdXJyZW50Q2h1bmsgPSBCdWZmZXIuY29uY2F0KFtjdXJyZW50Q2h1bmssIGNodW5rXSk7XHJcblxyXG4gICAgLy8gSWYgdGhlIGN1cnJlbnQgY2h1bmsgYnVmZmVyIGlzIGdldHRpbmcgdG8gbGFyZ2UsIG9yIHRoZSBzdHJlYW0gcGlwZWQgaW5cclxuICAgIC8vIGhhcyBlbmRlZCB0aGVuIGZsdXNoIHRoZSBjaHVuayBidWZmZXIgZG93bnN0cmVhbSB0byBTMyB2aWEgdGhlIG11bHRpcGFydFxyXG4gICAgLy8gdXBsb2FkIEFQSS5cclxuICAgIGlmKGN1cnJlbnRDaHVuay5sZW5ndGggPiBtYXhDaHVua1NpemUpIHtcclxuICAgICAgLy8gTWFrZSBzdXJlIHdlIG9ubHkgcnVuIHdoZW4gdGhlIHMzIHVwbG9hZCBpcyByZWFkeVxyXG4gICAgICBydW5XaGVuUmVhZHkoZnVuY3Rpb24oKSB7IGZsdXNoQ2h1bmsobmV4dCwgZmFsc2UpOyB9KTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIC8vIFdlIGRvbnQgaGF2ZSB0byBjb250YWN0IHMzIGZvciB0aGlzXHJcbiAgICAgIHJ1bldoZW5SZWFkeShuZXh0KTtcclxuICAgIH1cclxuICB9O1xyXG5cclxuICAvLyBPdmVyd3JpdGUgdGhlIGVuZCBtZXRob2Qgc28gdGhhdCB3ZSBjYW4gaGlqYWNrIGl0IHRvIGZsdXNoIHRoZSBsYXN0IHBhcnRcclxuICAvLyBhbmQgdGhlbiBjb21wbGV0ZSB0aGUgbXVsdGlwYXJ0IHVwbG9hZFxyXG4gIHZhciBfb3JpZ2luYWxFbmQgPSB3cml0ZVN0cmVhbS5lbmQ7XHJcbiAgd3JpdGVTdHJlYW0uZW5kID0gZnVuY3Rpb24gKGNodW5rLCBlbmNvZGluZywgY2FsbGJhY2spIHtcclxuICAgIC8vIENhbGwgdGhlIHN1cGVyXHJcbiAgICBfb3JpZ2luYWxFbmQuY2FsbCh0aGlzLCBjaHVuaywgZW5jb2RpbmcsIGZ1bmN0aW9uICgpIHtcclxuICAgICAgLy8gTWFrZSBzdXJlIHdlIG9ubHkgcnVuIHdoZW4gdGhlIHMzIHVwbG9hZCBpcyByZWFkeVxyXG4gICAgICBydW5XaGVuUmVhZHkoZnVuY3Rpb24oKSB7IGZsdXNoQ2h1bmsoY2FsbGJhY2ssIHRydWUpOyB9KTtcclxuICAgIH0pO1xyXG4gIH07XHJcblxyXG4gIHdyaXRlU3RyZWFtLm9uKCdlcnJvcicsIGZ1bmN0aW9uICgpIHtcclxuICAgIGlmIChtdWx0aXBhcnRVcGxvYWRJRCkge1xyXG4gICAgICBpZiAoRlMuZGVidWcpIHtcclxuICAgICAgICBjb25zb2xlLmxvZygnU0EgUzMgLSBFUlJPUiEhJyk7XHJcbiAgICAgIH1cclxuICAgICAgc2VsZi5hYm9ydE11bHRpcGFydFVwbG9hZCh7XHJcbiAgICAgICAgQnVja2V0OiBwYXJhbXMuQnVja2V0LFxyXG4gICAgICAgIEtleTogcGFyYW1zLktleSxcclxuICAgICAgICBVcGxvYWRJZDogbXVsdGlwYXJ0VXBsb2FkSURcclxuICAgICAgfSwgZnVuY3Rpb24gKGVycikge1xyXG4gICAgICAgIGlmKGVycikge1xyXG4gICAgICAgICAgY29uc29sZS5lcnJvcignU0EgUzMgLSBDb3VsZCBub3QgYWJvcnQgbXVsdGlwYXJ0IHVwbG9hZCcsIGVycilcclxuICAgICAgICB9XHJcbiAgICAgIH0pO1xyXG4gICAgfVxyXG4gIH0pO1xyXG5cclxuICB2YXIgZmx1c2hDaHVuayA9IGZ1bmN0aW9uIChjYWxsYmFjaywgbGFzdENodW5rKSB7XHJcbiAgICBpZiAobXVsdGlwYXJ0VXBsb2FkSUQgPT09IG51bGwpIHtcclxuICAgICAgdGhyb3cgbmV3IEVycm9yKCdJbnRlcm5hbCBlcnJvciBtdWx0aXBhcnRVcGxvYWRJRCBpcyBudWxsJyk7XHJcbiAgICB9XHJcbiAgICAvLyBHZXQgdGhlIGNodW5rIGRhdGFcclxuICAgIHZhciB1cGxvYWRpbmdDaHVuayA9IEJ1ZmZlcihjdXJyZW50Q2h1bmsubGVuZ3RoKTtcclxuICAgIGN1cnJlbnRDaHVuay5jb3B5KHVwbG9hZGluZ0NodW5rKTtcclxuXHJcblxyXG4gICAgLy8gU3RvcmUgdGhlIGN1cnJlbnQgcGFydCBudW1iZXIgYW5kIHRoZW4gaW5jcmVhc2UgdGhlIGNvdW50ZXJcclxuICAgIHZhciBsb2NhbENodW5rTnVtYmVyID0gcGFydE51bWJlcisrO1xyXG5cclxuICAgIC8vIFdlIGFkZCB0aGUgc2l6ZSBvZiBkYXRhXHJcbiAgICByZWNlaXZlZFNpemUgKz0gdXBsb2FkaW5nQ2h1bmsubGVuZ3RoO1xyXG5cclxuICAgIC8vIFVwbG9hZCB0aGUgcGFydFxyXG4gICAgc2VsZi51cGxvYWRQYXJ0KHtcclxuICAgICAgQm9keTogdXBsb2FkaW5nQ2h1bmssXHJcbiAgICAgIEJ1Y2tldDogcGFyYW1zLkJ1Y2tldCxcclxuICAgICAgS2V5OiBwYXJhbXMuS2V5LFxyXG4gICAgICBVcGxvYWRJZDogbXVsdGlwYXJ0VXBsb2FkSUQsXHJcbiAgICAgIFBhcnROdW1iZXI6IGxvY2FsQ2h1bmtOdW1iZXJcclxuICAgIH0sIGZ1bmN0aW9uIChlcnIsIHJlc3VsdCkge1xyXG4gICAgICAvLyBDYWxsIHRoZSBuZXh0IGRhdGFcclxuICAgICAgaWYodHlwZW9mIGNhbGxiYWNrID09PSAnZnVuY3Rpb24nKSB7XHJcbiAgICAgICAgY2FsbGJhY2soKTtcclxuICAgICAgfVxyXG5cclxuICAgICAgaWYoZXJyKSB7XHJcbiAgICAgICAgd3JpdGVTdHJlYW0uZW1pdCgnZXJyb3InLCBlcnIpO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIC8vIEluY3JlYXNlIHRoZSB1cGxvYWQgc2l6ZVxyXG4gICAgICAgIHVwbG9hZGVkU2l6ZSArPSB1cGxvYWRpbmdDaHVuay5sZW5ndGg7XHJcbiAgICAgICAgcGFydHNbbG9jYWxDaHVua051bWJlci0xXSA9IHtcclxuICAgICAgICAgIEVUYWc6IHJlc3VsdC5FVGFnLFxyXG4gICAgICAgICAgUGFydE51bWJlcjogbG9jYWxDaHVua051bWJlclxyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIC8vIFhYWDogZXZlbnQgZm9yIGRlYnVnZ2luZ1xyXG4gICAgICAgIHdyaXRlU3RyZWFtLmVtaXQoJ2NodW5rJywge1xyXG4gICAgICAgICAgRVRhZzogcmVzdWx0LkVUYWcsXHJcbiAgICAgICAgICBQYXJ0TnVtYmVyOiBsb2NhbENodW5rTnVtYmVyLFxyXG4gICAgICAgICAgcmVjZWl2ZWRTaXplOiByZWNlaXZlZFNpemUsXHJcbiAgICAgICAgICB1cGxvYWRlZFNpemU6IHVwbG9hZGVkU2l6ZVxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICAvLyBUaGUgaW5jb21pbmcgc3RyZWFtIGhhcyBmaW5pc2hlZCBnaXZpbmcgdXMgYWxsIGRhdGEgYW5kIHdlIGhhdmVcclxuICAgICAgICAvLyBmaW5pc2hlZCB1cGxvYWRpbmcgYWxsIHRoYXQgZGF0YSB0byBTMy4gU28gdGVsbCBTMyB0byBhc3NlbWJsZSB0aG9zZVxyXG4gICAgICAgIC8vIHBhcnRzIHdlIHVwbG9hZGVkIGludG8gdGhlIGZpbmFsIHByb2R1Y3QuXHJcbiAgICAgICAgaWYod3JpdGVTdHJlYW0uX3dyaXRhYmxlU3RhdGUuZW5kZWQgPT09IHRydWUgJiZcclxuICAgICAgICAgICAgICAgIHVwbG9hZGVkU2l6ZSA9PT0gcmVjZWl2ZWRTaXplICYmIGxhc3RDaHVuaykge1xyXG4gICAgICAgICAgLy8gQ29tcGxldGUgdGhlIHVwbG9hZFxyXG4gICAgICAgICAgc2VsZi5jb21wbGV0ZU11bHRpcGFydFVwbG9hZCh7XHJcbiAgICAgICAgICAgIEJ1Y2tldDogcGFyYW1zLkJ1Y2tldCxcclxuICAgICAgICAgICAgS2V5OiBwYXJhbXMuS2V5LFxyXG4gICAgICAgICAgICBVcGxvYWRJZDogbXVsdGlwYXJ0VXBsb2FkSUQsXHJcbiAgICAgICAgICAgIE11bHRpcGFydFVwbG9hZDoge1xyXG4gICAgICAgICAgICAgIFBhcnRzOiBwYXJ0c1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9LCBmdW5jdGlvbiAoZXJyLCByZXN1bHQpIHtcclxuICAgICAgICAgICAgaWYoZXJyKSB7XHJcbiAgICAgICAgICAgICAgd3JpdGVTdHJlYW0uZW1pdCgnZXJyb3InLCBlcnIpO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgIC8vIEVtaXQgdGhlIGNmcyBlbmQgZXZlbnQgZm9yIHVwbG9hZHNcclxuICAgICAgICAgICAgICBpZiAoRlMuZGVidWcpIHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdTQSBTMyAtIERPTkUhIScpO1xyXG4gICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICB3cml0ZVN0cmVhbS5lbWl0KCdzdG9yZWQnLCB7XHJcbiAgICAgICAgICAgICAgICBmaWxlS2V5OiBmaWxlS2V5LFxyXG4gICAgICAgICAgICAgICAgc2l6ZTogdXBsb2FkZWRTaXplLFxyXG4gICAgICAgICAgICAgICAgc3RvcmVkQXQ6IG5ldyBEYXRlKClcclxuICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfSk7XHJcblxyXG4gICAgLy8gUmVzZXQgdGhlIGN1cnJlbnQgYnVmZmVyXHJcbiAgICBjdXJyZW50Q2h1bmsgPSBCdWZmZXIoMCk7XHJcbiAgfTtcclxuXHJcbiAgLy9Vc2UgdGhlIFMzIGNsaWVudCB0byBpbml0aWFsaXplIGEgbXVsdGlwYXJ0IHVwbG9hZCB0byBTMy5cclxuICBzZWxmLmNyZWF0ZU11bHRpcGFydFVwbG9hZCggcGFyYW1zLCBmdW5jdGlvbiAoZXJyLCBkYXRhKSB7XHJcbiAgICBpZihlcnIpIHtcclxuICAgICAgLy8gRW1pdCB0aGUgZXJyb3JcclxuICAgICAgd3JpdGVTdHJlYW0uZW1pdCgnZXJyb3InLCBlcnIpO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgLy8gU2V0IHRoZSB1cGxvYWQgaWRcclxuICAgICAgbXVsdGlwYXJ0VXBsb2FkSUQgPSBkYXRhLlVwbG9hZElkO1xyXG5cclxuICAgICAgLy8gQ2FsbCB3YWl0aW5nIGNhbGxiYWNrXHJcbiAgICAgIGlmICh0eXBlb2Ygd2FpdGluZ0NhbGxiYWNrID09PSAnZnVuY3Rpb24nKSB7XHJcbiAgICAgICAgLy8gV2UgY2FsbCB0aGUgd2FpdGluZyBjYWxsYmFjayBpZiBhbnkgbm93IHNpbmNlIHdlIGVzdGFibGlzaGVkIGFcclxuICAgICAgICAvLyBjb25uZWN0aW9uIHRvIHRoZSBzM1xyXG4gICAgICAgIHdhaXRpbmdDYWxsYmFjaygpO1xyXG4gICAgICB9XHJcblxyXG4gICAgfVxyXG4gIH0pO1xyXG5cclxuICAvLyBXZSByZXR1cm4gdGhlIHdyaXRlIHN0cmVhbVxyXG4gIHJldHVybiB3cml0ZVN0cmVhbTtcclxufTtcclxuIl19
