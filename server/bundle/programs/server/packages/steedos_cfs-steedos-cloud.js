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
var CLOUDAWS;

var require = meteorInstall({"node_modules":{"meteor":{"steedos:cfs-steedos-cloud":{"checkNpm.js":function module(require,exports,module){

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                               //
// packages/steedos_cfs-steedos-cloud/checkNpm.js                                                                //
//                                                                                                               //
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                 //
let checkNpmVersions;
module.link("meteor/tmeasday:check-npm-versions", {
  checkNpmVersions(v) {
    checkNpmVersions = v;
  }

}, 0);

const fs = require('fs');

const path = require('path');

if (Meteor.settings && Meteor.settings.public && Meteor.settings.public.cfs && Meteor.settings.public.cfs.store === 'STEEDOSCLOUD') {
  checkNpmVersions({
    'aws-sdk': "^2.0.23"
  }, 'steedos:cfs-steedos-cloud'); // // 修改s3-2006-03-01.min.json 将 SteedosApiKey添加进members用于请求时aws-sdk发送此header
  // var base = process.cwd();
  // console.log('process.cwd(): ', process.cwd());
  // if (process.env.CREATOR_NODE_ENV == 'development') {
  //   base = path.resolve('.').split('.meteor')[0];
  // }
  // console.log('base: ', base);
  // var sdkPath = path.join(base, require.resolve('aws-sdk/package.json', {
  //   paths: [base]
  // }));
  // console.log('sdkPath: ', sdkPath);
  // var sdkVersionMinJsonPath = path.join(sdkPath, '../apis/s3-2006-03-01.min.json');
  // console.log('sdkVersionMinJsonPath: ', sdkVersionMinJsonPath);
  // var minJson = JSON.parse(fs.readFileSync(sdkVersionMinJsonPath));
  // console.log(minJson);
  // var operations = minJson.operations;
  // for (const key in operations) {
  //   if (Object.hasOwnProperty.call(operations, key)) {
  //     const element = operations[key];
  //     if (element.input) {
  //       element.input.members.SteedosApiKey = { "location": "header", "locationName": "apikey" }
  //     }
  //   }
  // }
  // fs.writeFileSync(sdkVersionMinJsonPath, JSON.stringify(minJson)); 

  CLOUDAWS = require('aws-sdk');
}
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"s3.server.js":function module(require,exports,module){

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                               //
// packages/steedos_cfs-steedos-cloud/s3.server.js                                                               //
//                                                                                                               //
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                 //
let _objectSpread;

module.link("@babel/runtime/helpers/objectSpread2", {
  default(v) {
    _objectSpread = v;
  }

}, 0);
if (!CLOUDAWS) return;

const path = require('path'); // We use the official aws sdk


var validS3ServiceParamKeys = ['endpoint', 'accessKeyId', 'secretAccessKey', 'sessionToken', 'credentials', 'credentialProvider', 'region', 'maxRetries', 'maxRedirects', 'sslEnabled', 'paramValidation', 'computeChecksums', 's3ForcePathStyle', 'httpOptions', 'apiVersion', 'apiVersions', 'logger', 'signatureVersion'];
var validS3PutParamKeys = ['ACL', 'Body', 'Bucket', 'CacheControl', 'ContentDisposition', 'ContentEncoding', 'ContentLanguage', 'ContentLength', 'ContentMD5', 'ContentType', 'Expires', 'GrantFullControl', 'GrantRead', 'GrantReadACP', 'GrantWriteACP', 'Key', 'Metadata', 'ServerSideEncryption', 'StorageClass', 'WebsiteRedirectLocation'];
/**
 * @public
 * @constructor
 * @param {String} name - The store name
 * @param {Object} options
 * @param {String} options.region - Bucket region
 * @param {String} options.steedosBucket - Bucket name
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

FS.Store.STEEDOSCLOUD = function (name, opts) {
  var self = this;
  if (!(self instanceof FS.Store.STEEDOSCLOUD)) throw new Error('FS.Store.STEEDOSCLOUD missing keyword "new"');
  opts = opts || {};

  var options = _objectSpread({}, opts);

  options.s3ForcePathStyle = true; // Determine which folder (key prefix) in the bucket to use

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

  var steedosBucket = options.steedosBucket || 's3-kong-servie';
  var bucket = options.bucket;
  if (!bucket) throw new Error('FS.Store.STEEDOSCLOUD you must specify the "bucket" option'); // 拼接folder

  options.folder = path.join(bucket, folder, '/');
  folder = options.folder;
  delete options.bucket;
  var defaultAcl = options.ACL || 'private';
  var SteedosApiKey = options.secretAccessKey; // Remove serviceParams from SA options
  // options = _.omit(options, validS3ServiceParamKeys);

  var serviceParams = FS.Utility.extend({
    Bucket: steedosBucket,
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

  var S3 = new CLOUDAWS.S3(serviceParams);
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
      // console.log('S3.createReadStream...........: ', fileKey, options);
      return S3.createReadStream({
        Bucket: steedosBucket,
        Key: folder + fileKey
      }, {}, SteedosApiKey);
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
        Bucket: steedosBucket,
        Key: folder + fileKey,
        fileKey: fileKey,
        ACL: defaultAcl
      }, options); // console.log('S3.createWriteStream...........: ', options);

      return S3.createWriteStream(options, {}, SteedosApiKey);
    },
    remove: function (fileKey, callback) {
      // console.log('S3.deleteObject...........: ', fileKey);
      var deleteObjectReq = S3.deleteObject({
        Bucket: steedosBucket,
        Key: folder + fileKey
      });
      deleteObjectReq.on('build', function () {
        deleteObjectReq.httpRequest.headers['apikey'] = SteedosApiKey;
      });
      deleteObjectReq.send(function (error) {
        callback(error, !error);
      }); // callback(null, true);
    },
    watch: function () {
      throw new Error("S3 storage adapter does not support the sync option");
    }
  });
};
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"s3.upload.stream2.js":function module(require){

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                               //
// packages/steedos_cfs-steedos-cloud/s3.upload.stream2.js                                                       //
//                                                                                                               //
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                 //
if (!CLOUDAWS) return;

var Writable = require('stream').Writable; // This is based on the code from
// https://github.com/nathanpeck/s3-upload-stream/blob/master/lib/s3-upload-stream.js
// But much is rewritten and adapted to cfs


CLOUDAWS.S3.prototype.createReadStream = function (params, options, SteedosApiKey) {
  // Simple wrapper
  // return this.getObject(params).createReadStream();
  var getObjectReq = this.getObject(params);
  getObjectReq.on('build', function () {
    getObjectReq.httpRequest.headers['apikey'] = SteedosApiKey;
  });
  return getObjectReq.createReadStream();
}; // Extend the AWS.S3 API


CLOUDAWS.S3.prototype.createWriteStream = function (params, options, SteedosApiKey) {
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

      var abortMultipartUploadReq = self.abortMultipartUpload({
        Bucket: params.Bucket,
        Key: params.Key,
        UploadId: multipartUploadID
      });
      abortMultipartUploadReq.on('build', function () {
        abortMultipartUploadReq.httpRequest.headers['apikey'] = SteedosApiKey;
      });
      abortMultipartUploadReq.send(function (err) {
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

    receivedSize += uploadingChunk.length; // console.log('multipartUploadID: ', multipartUploadID);
    // Upload the part

    var uploadPartReq = self.uploadPart({
      Body: uploadingChunk,
      Bucket: params.Bucket,
      Key: params.Key,
      UploadId: multipartUploadID,
      PartNumber: localChunkNumber
    });
    uploadPartReq.on('build', function () {
      uploadPartReq.httpRequest.headers['apikey'] = SteedosApiKey;
    });
    uploadPartReq.send(function (err, result) {
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
          var completeMultipartUploadReq = self.completeMultipartUpload({
            Bucket: params.Bucket,
            Key: params.Key,
            UploadId: multipartUploadID,
            MultipartUpload: {
              Parts: parts
            }
          });
          completeMultipartUploadReq.on('build', function () {
            completeMultipartUploadReq.httpRequest.headers['apikey'] = SteedosApiKey;
          });
          completeMultipartUploadReq.send(function (err, result) {
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


  var createMultipartUploadReq = self.createMultipartUpload(params);
  createMultipartUploadReq.on('build', function () {
    createMultipartUploadReq.httpRequest.headers['apikey'] = SteedosApiKey;
  });
  createMultipartUploadReq.send(function (err, data) {
    if (err) {
      // Emit the error
      writeStream.emit('error', err);
    } else {
      // Set the upload id
      // console.log('data.UploadId: ', data.UploadId);
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
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}}}}},{
  "extensions": [
    ".js",
    ".json"
  ]
});

require("/node_modules/meteor/steedos:cfs-steedos-cloud/checkNpm.js");
require("/node_modules/meteor/steedos:cfs-steedos-cloud/s3.server.js");
require("/node_modules/meteor/steedos:cfs-steedos-cloud/s3.upload.stream2.js");

/* Exports */
Package._define("steedos:cfs-steedos-cloud");

})();

//# sourceURL=meteor://💻app/packages/steedos_cfs-steedos-cloud.js
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvczpjZnMtc3RlZWRvcy1jbG91ZC9jaGVja05wbS5qcyIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvczpjZnMtc3RlZWRvcy1jbG91ZC9zMy5zZXJ2ZXIuanMiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3M6Y2ZzLXN0ZWVkb3MtY2xvdWQvczMudXBsb2FkLnN0cmVhbTIuanMiXSwibmFtZXMiOlsiY2hlY2tOcG1WZXJzaW9ucyIsIm1vZHVsZSIsImxpbmsiLCJ2IiwiZnMiLCJyZXF1aXJlIiwicGF0aCIsIk1ldGVvciIsInNldHRpbmdzIiwicHVibGljIiwiY2ZzIiwic3RvcmUiLCJDTE9VREFXUyIsIl9vYmplY3RTcHJlYWQiLCJkZWZhdWx0IiwidmFsaWRTM1NlcnZpY2VQYXJhbUtleXMiLCJ2YWxpZFMzUHV0UGFyYW1LZXlzIiwiRlMiLCJTdG9yZSIsIlNURUVET1NDTE9VRCIsIm5hbWUiLCJvcHRzIiwic2VsZiIsIkVycm9yIiwib3B0aW9ucyIsInMzRm9yY2VQYXRoU3R5bGUiLCJmb2xkZXIiLCJsZW5ndGgiLCJzbGljZSIsInN0ZWVkb3NCdWNrZXQiLCJidWNrZXQiLCJqb2luIiwiZGVmYXVsdEFjbCIsIkFDTCIsIlN0ZWVkb3NBcGlLZXkiLCJzZWNyZXRBY2Nlc3NLZXkiLCJzZXJ2aWNlUGFyYW1zIiwiVXRpbGl0eSIsImV4dGVuZCIsIkJ1Y2tldCIsInJlZ2lvbiIsImFjY2Vzc0tleUlkIiwiUzMiLCJTdG9yYWdlQWRhcHRlciIsInR5cGVOYW1lIiwiZmlsZUtleSIsImZpbGVPYmoiLCJpbmZvIiwiX2dldEluZm8iLCJrZXkiLCJmaWxlbmFtZSIsImZpbGVuYW1lSW5TdG9yZSIsImNvbGxlY3Rpb25OYW1lIiwiX2lkIiwiY3JlYXRlUmVhZFN0cmVhbSIsIktleSIsImNyZWF0ZVdyaXRlU3RyZWFtIiwiY29udGVudFR5cGUiLCJDb250ZW50VHlwZSIsImFsaWFzZXMiLCJtZXRhZGF0YSIsInJlbW92ZSIsImNhbGxiYWNrIiwiZGVsZXRlT2JqZWN0UmVxIiwiZGVsZXRlT2JqZWN0Iiwib24iLCJodHRwUmVxdWVzdCIsImhlYWRlcnMiLCJzZW5kIiwiZXJyb3IiLCJ3YXRjaCIsIldyaXRhYmxlIiwicHJvdG90eXBlIiwicGFyYW1zIiwiZ2V0T2JqZWN0UmVxIiwiZ2V0T2JqZWN0Iiwid3JpdGVTdHJlYW0iLCJoaWdoV2F0ZXJNYXJrIiwicGFydE51bWJlciIsInBhcnRzIiwicmVjZWl2ZWRTaXplIiwidXBsb2FkZWRTaXplIiwiY3VycmVudENodW5rIiwiQnVmZmVyIiwibWF4Q2h1bmtTaXplIiwibXVsdGlwYXJ0VXBsb2FkSUQiLCJ3YWl0aW5nQ2FsbGJhY2siLCJydW5XaGVuUmVhZHkiLCJfd3JpdGUiLCJjaHVuayIsImVuYyIsIm5leHQiLCJjb25jYXQiLCJmbHVzaENodW5rIiwiX29yaWdpbmFsRW5kIiwiZW5kIiwiZW5jb2RpbmciLCJjYWxsIiwiZGVidWciLCJjb25zb2xlIiwibG9nIiwiYWJvcnRNdWx0aXBhcnRVcGxvYWRSZXEiLCJhYm9ydE11bHRpcGFydFVwbG9hZCIsIlVwbG9hZElkIiwiZXJyIiwibGFzdENodW5rIiwidXBsb2FkaW5nQ2h1bmsiLCJjb3B5IiwibG9jYWxDaHVua051bWJlciIsInVwbG9hZFBhcnRSZXEiLCJ1cGxvYWRQYXJ0IiwiQm9keSIsIlBhcnROdW1iZXIiLCJyZXN1bHQiLCJlbWl0IiwiRVRhZyIsIl93cml0YWJsZVN0YXRlIiwiZW5kZWQiLCJjb21wbGV0ZU11bHRpcGFydFVwbG9hZFJlcSIsImNvbXBsZXRlTXVsdGlwYXJ0VXBsb2FkIiwiTXVsdGlwYXJ0VXBsb2FkIiwiUGFydHMiLCJzaXplIiwic3RvcmVkQXQiLCJEYXRlIiwiY3JlYXRlTXVsdGlwYXJ0VXBsb2FkUmVxIiwiY3JlYXRlTXVsdGlwYXJ0VXBsb2FkIiwiZGF0YSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLElBQUlBLGdC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Q2hCO0FBRUY7QUFDRixHQWpCRCxFQXZMa0YsQ0EwTWxGOztBQUNBLFNBQU9WLFdBQVA7QUFDRCxDQTVNRCxDIiwiZmlsZSI6Ii9wYWNrYWdlcy9zdGVlZG9zX2Nmcy1zdGVlZG9zLWNsb3VkLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLypcbiAqIEBBdXRob3I6IHN1bmhhb2xpbkBob3RvYS5jb21cbiAqIEBEYXRlOiAyMDIxLTA4LTEzIDIyOjAyOjAyXG4gKiBATGFzdEVkaXRvcnM6IHN1bmhhb2xpbkBob3RvYS5jb21cbiAqIEBMYXN0RWRpdFRpbWU6IDIwMjItMDgtMjQgMTY6Mjk6NDlcbiAqIEBEZXNjcmlwdGlvbjogXG4gKi9cbmltcG9ydCB7XG4gIGNoZWNrTnBtVmVyc2lvbnNcbn0gZnJvbSAnbWV0ZW9yL3RtZWFzZGF5OmNoZWNrLW5wbS12ZXJzaW9ucyc7XG5cbmNvbnN0IGZzID0gcmVxdWlyZSgnZnMnKTtcbmNvbnN0IHBhdGggPSByZXF1aXJlKCdwYXRoJylcblxuaWYgKE1ldGVvci5zZXR0aW5ncyAmJiBNZXRlb3Iuc2V0dGluZ3MucHVibGljICYmIE1ldGVvci5zZXR0aW5ncy5wdWJsaWMuY2ZzICYmIE1ldGVvci5zZXR0aW5ncy5wdWJsaWMuY2ZzLnN0b3JlID09PSAnU1RFRURPU0NMT1VEJykge1xuICBjaGVja05wbVZlcnNpb25zKHtcbiAgICAnYXdzLXNkayc6IFwiXjIuMC4yM1wiXG4gIH0sICdzdGVlZG9zOmNmcy1zdGVlZG9zLWNsb3VkJyk7XG5cbiAgLy8gLy8g5L+u5pS5czMtMjAwNi0wMy0wMS5taW4uanNvbiDlsIYgU3RlZWRvc0FwaUtleea3u+WKoOi/m21lbWJlcnPnlKjkuo7or7fmsYLml7Zhd3Mtc2Rr5Y+R6YCB5q2kaGVhZGVyXG4gIC8vIHZhciBiYXNlID0gcHJvY2Vzcy5jd2QoKTtcbiAgLy8gY29uc29sZS5sb2coJ3Byb2Nlc3MuY3dkKCk6ICcsIHByb2Nlc3MuY3dkKCkpO1xuICAvLyBpZiAocHJvY2Vzcy5lbnYuQ1JFQVRPUl9OT0RFX0VOViA9PSAnZGV2ZWxvcG1lbnQnKSB7XG4gIC8vICAgYmFzZSA9IHBhdGgucmVzb2x2ZSgnLicpLnNwbGl0KCcubWV0ZW9yJylbMF07XG4gIC8vIH1cbiAgLy8gY29uc29sZS5sb2coJ2Jhc2U6ICcsIGJhc2UpO1xuICAvLyB2YXIgc2RrUGF0aCA9IHBhdGguam9pbihiYXNlLCByZXF1aXJlLnJlc29sdmUoJ2F3cy1zZGsvcGFja2FnZS5qc29uJywge1xuICAvLyAgIHBhdGhzOiBbYmFzZV1cbiAgLy8gfSkpO1xuICAvLyBjb25zb2xlLmxvZygnc2RrUGF0aDogJywgc2RrUGF0aCk7XG4gIC8vIHZhciBzZGtWZXJzaW9uTWluSnNvblBhdGggPSBwYXRoLmpvaW4oc2RrUGF0aCwgJy4uL2FwaXMvczMtMjAwNi0wMy0wMS5taW4uanNvbicpO1xuICAvLyBjb25zb2xlLmxvZygnc2RrVmVyc2lvbk1pbkpzb25QYXRoOiAnLCBzZGtWZXJzaW9uTWluSnNvblBhdGgpO1xuICAvLyB2YXIgbWluSnNvbiA9IEpTT04ucGFyc2UoZnMucmVhZEZpbGVTeW5jKHNka1ZlcnNpb25NaW5Kc29uUGF0aCkpO1xuICAvLyBjb25zb2xlLmxvZyhtaW5Kc29uKTtcbiAgLy8gdmFyIG9wZXJhdGlvbnMgPSBtaW5Kc29uLm9wZXJhdGlvbnM7XG4gIC8vIGZvciAoY29uc3Qga2V5IGluIG9wZXJhdGlvbnMpIHtcbiAgLy8gICBpZiAoT2JqZWN0Lmhhc093blByb3BlcnR5LmNhbGwob3BlcmF0aW9ucywga2V5KSkge1xuICAvLyAgICAgY29uc3QgZWxlbWVudCA9IG9wZXJhdGlvbnNba2V5XTtcbiAgLy8gICAgIGlmIChlbGVtZW50LmlucHV0KSB7XG4gIC8vICAgICAgIGVsZW1lbnQuaW5wdXQubWVtYmVycy5TdGVlZG9zQXBpS2V5ID0geyBcImxvY2F0aW9uXCI6IFwiaGVhZGVyXCIsIFwibG9jYXRpb25OYW1lXCI6IFwiYXBpa2V5XCIgfVxuICAvLyAgICAgfVxuICAvLyAgIH1cbiAgLy8gfVxuXG4gIC8vIGZzLndyaXRlRmlsZVN5bmMoc2RrVmVyc2lvbk1pbkpzb25QYXRoLCBKU09OLnN0cmluZ2lmeShtaW5Kc29uKSk7IFxuXG4gIENMT1VEQVdTID0gcmVxdWlyZSgnYXdzLXNkaycpO1xufVxuIiwiaWYgKCFDTE9VREFXUylcbiAgcmV0dXJuO1xuXG5jb25zdCBwYXRoID0gcmVxdWlyZSgncGF0aCcpO1xuXG4vLyBXZSB1c2UgdGhlIG9mZmljaWFsIGF3cyBzZGtcblxuXG52YXIgdmFsaWRTM1NlcnZpY2VQYXJhbUtleXMgPSBbXG4gICdlbmRwb2ludCcsXG4gICdhY2Nlc3NLZXlJZCcsXG4gICdzZWNyZXRBY2Nlc3NLZXknLFxuICAnc2Vzc2lvblRva2VuJyxcbiAgJ2NyZWRlbnRpYWxzJyxcbiAgJ2NyZWRlbnRpYWxQcm92aWRlcicsXG4gICdyZWdpb24nLFxuICAnbWF4UmV0cmllcycsXG4gICdtYXhSZWRpcmVjdHMnLFxuICAnc3NsRW5hYmxlZCcsXG4gICdwYXJhbVZhbGlkYXRpb24nLFxuICAnY29tcHV0ZUNoZWNrc3VtcycsXG4gICdzM0ZvcmNlUGF0aFN0eWxlJyxcbiAgJ2h0dHBPcHRpb25zJyxcbiAgJ2FwaVZlcnNpb24nLFxuICAnYXBpVmVyc2lvbnMnLFxuICAnbG9nZ2VyJyxcbiAgJ3NpZ25hdHVyZVZlcnNpb24nXG5dO1xudmFyIHZhbGlkUzNQdXRQYXJhbUtleXMgPSBbXG4gICdBQ0wnLFxuICAnQm9keScsXG4gICdCdWNrZXQnLFxuICAnQ2FjaGVDb250cm9sJyxcbiAgJ0NvbnRlbnREaXNwb3NpdGlvbicsXG4gICdDb250ZW50RW5jb2RpbmcnLFxuICAnQ29udGVudExhbmd1YWdlJyxcbiAgJ0NvbnRlbnRMZW5ndGgnLFxuICAnQ29udGVudE1ENScsXG4gICdDb250ZW50VHlwZScsXG4gICdFeHBpcmVzJyxcbiAgJ0dyYW50RnVsbENvbnRyb2wnLFxuICAnR3JhbnRSZWFkJyxcbiAgJ0dyYW50UmVhZEFDUCcsXG4gICdHcmFudFdyaXRlQUNQJyxcbiAgJ0tleScsXG4gICdNZXRhZGF0YScsXG4gICdTZXJ2ZXJTaWRlRW5jcnlwdGlvbicsXG4gICdTdG9yYWdlQ2xhc3MnLFxuICAnV2Vic2l0ZVJlZGlyZWN0TG9jYXRpb24nXG5dO1xuXG4vKipcbiAqIEBwdWJsaWNcbiAqIEBjb25zdHJ1Y3RvclxuICogQHBhcmFtIHtTdHJpbmd9IG5hbWUgLSBUaGUgc3RvcmUgbmFtZVxuICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnNcbiAqIEBwYXJhbSB7U3RyaW5nfSBvcHRpb25zLnJlZ2lvbiAtIEJ1Y2tldCByZWdpb25cbiAqIEBwYXJhbSB7U3RyaW5nfSBvcHRpb25zLnN0ZWVkb3NCdWNrZXQgLSBCdWNrZXQgbmFtZVxuICogQHBhcmFtIHtTdHJpbmd9IFtvcHRpb25zLmFjY2Vzc0tleUlkXSAtIEFXUyBJQU0ga2V5OyByZXF1aXJlZCBpZiBub3Qgc2V0IGluIGVudmlyb25tZW50IHZhcmlhYmxlc1xuICogQHBhcmFtIHtTdHJpbmd9IFtvcHRpb25zLnNlY3JldEFjY2Vzc0tleV0gLSBBV1MgSUFNIHNlY3JldDsgcmVxdWlyZWQgaWYgbm90IHNldCBpbiBlbnZpcm9ubWVudCB2YXJpYWJsZXNcbiAqIEBwYXJhbSB7U3RyaW5nfSBbb3B0aW9ucy5BQ0w9J3ByaXZhdGUnXSAtIEFDTCBmb3Igb2JqZWN0cyB3aGVuIHB1dHRpbmdcbiAqIEBwYXJhbSB7U3RyaW5nfSBbb3B0aW9ucy5mb2xkZXI9Jy8nXSAtIFdoaWNoIGZvbGRlciAoa2V5IHByZWZpeCkgaW4gdGhlIGJ1Y2tldCB0byB1c2VcbiAqIEBwYXJhbSB7RnVuY3Rpb259IFtvcHRpb25zLmJlZm9yZVNhdmVdIC0gRnVuY3Rpb24gdG8gcnVuIGJlZm9yZSBzYXZpbmcgYSBmaWxlIGZyb20gdGhlIHNlcnZlci4gVGhlIGNvbnRleHQgb2YgdGhlIGZ1bmN0aW9uIHdpbGwgYmUgdGhlIGBGUy5GaWxlYCBpbnN0YW5jZSB3ZSdyZSBzYXZpbmcuIFRoZSBmdW5jdGlvbiBtYXkgYWx0ZXIgaXRzIHByb3BlcnRpZXMuXG4gKiBAcGFyYW0ge051bWJlcn0gW29wdGlvbnMubWF4VHJpZXM9NV0gLSBNYXggdGltZXMgdG8gYXR0ZW1wdCBzYXZpbmcgYSBmaWxlXG4gKiBAcmV0dXJucyB7RlMuU3RvcmFnZUFkYXB0ZXJ9IEFuIGluc3RhbmNlIG9mIEZTLlN0b3JhZ2VBZGFwdGVyLlxuICpcbiAqIENyZWF0ZXMgYW4gUzMgc3RvcmUgaW5zdGFuY2Ugb24gdGhlIHNlcnZlci4gSW5oZXJpdHMgZnJvbSBGUy5TdG9yYWdlQWRhcHRlclxuICogdHlwZS5cbiAqL1xuRlMuU3RvcmUuU1RFRURPU0NMT1VEID0gZnVuY3Rpb24gKG5hbWUsIG9wdHMpIHtcbiAgdmFyIHNlbGYgPSB0aGlzO1xuICBpZiAoIShzZWxmIGluc3RhbmNlb2YgRlMuU3RvcmUuU1RFRURPU0NMT1VEKSlcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ0ZTLlN0b3JlLlNURUVET1NDTE9VRCBtaXNzaW5nIGtleXdvcmQgXCJuZXdcIicpO1xuXG4gIG9wdHMgPSBvcHRzIHx8IHt9O1xuICB2YXIgb3B0aW9ucyA9IHtcbiAgICAuLi5vcHRzXG4gIH1cbiAgb3B0aW9ucy5zM0ZvcmNlUGF0aFN0eWxlID0gdHJ1ZTtcblxuICAvLyBEZXRlcm1pbmUgd2hpY2ggZm9sZGVyIChrZXkgcHJlZml4KSBpbiB0aGUgYnVja2V0IHRvIHVzZVxuICB2YXIgZm9sZGVyID0gb3B0aW9ucy5mb2xkZXI7XG4gIGlmICh0eXBlb2YgZm9sZGVyID09PSBcInN0cmluZ1wiICYmIGZvbGRlci5sZW5ndGgpIHtcbiAgICBpZiAoZm9sZGVyLnNsaWNlKDAsIDEpID09PSBcIi9cIikge1xuICAgICAgZm9sZGVyID0gZm9sZGVyLnNsaWNlKDEpO1xuICAgIH1cbiAgICBpZiAoZm9sZGVyLnNsaWNlKC0xKSAhPT0gXCIvXCIpIHtcbiAgICAgIGZvbGRlciArPSBcIi9cIjtcbiAgICB9XG4gIH0gZWxzZSB7XG4gICAgZm9sZGVyID0gXCJcIjtcbiAgfVxuXG4gIHZhciBzdGVlZG9zQnVja2V0ID0gb3B0aW9ucy5zdGVlZG9zQnVja2V0IHx8ICdzMy1rb25nLXNlcnZpZSc7XG4gIHZhciBidWNrZXQgPSBvcHRpb25zLmJ1Y2tldDtcbiAgaWYgKCFidWNrZXQpXG4gICAgdGhyb3cgbmV3IEVycm9yKCdGUy5TdG9yZS5TVEVFRE9TQ0xPVUQgeW91IG11c3Qgc3BlY2lmeSB0aGUgXCJidWNrZXRcIiBvcHRpb24nKTtcblxuICAvLyDmi7zmjqVmb2xkZXJcbiAgb3B0aW9ucy5mb2xkZXIgPSBwYXRoLmpvaW4oYnVja2V0LCBmb2xkZXIsICcvJyk7XG4gIGZvbGRlciA9IG9wdGlvbnMuZm9sZGVyO1xuICBkZWxldGUgb3B0aW9ucy5idWNrZXQ7XG5cbiAgdmFyIGRlZmF1bHRBY2wgPSBvcHRpb25zLkFDTCB8fCAncHJpdmF0ZSc7XG5cbiAgdmFyIFN0ZWVkb3NBcGlLZXkgPSBvcHRpb25zLnNlY3JldEFjY2Vzc0tleTtcblxuICAvLyBSZW1vdmUgc2VydmljZVBhcmFtcyBmcm9tIFNBIG9wdGlvbnNcbiAgLy8gb3B0aW9ucyA9IF8ub21pdChvcHRpb25zLCB2YWxpZFMzU2VydmljZVBhcmFtS2V5cyk7XG5cbiAgdmFyIHNlcnZpY2VQYXJhbXMgPSBGUy5VdGlsaXR5LmV4dGVuZCh7XG4gICAgQnVja2V0OiBzdGVlZG9zQnVja2V0LFxuICAgIHJlZ2lvbjogbnVsbCwgLy9yZXF1aXJlZFxuICAgIGFjY2Vzc0tleUlkOiBudWxsLCAvL3JlcXVpcmVkXG4gICAgc2VjcmV0QWNjZXNzS2V5OiBudWxsLCAvL3JlcXVpcmVkXG4gICAgQUNMOiBkZWZhdWx0QWNsXG4gIH0sIG9wdGlvbnMpO1xuXG4gIC8vIFdoaXRlbGlzdCBzZXJ2aWNlUGFyYW1zLCBlbHNlIGF3cy1zZGsgdGhyb3dzIGFuIGVycm9yXG4gIC8vIFhYWDogSSd2ZSBjb21tZW50ZWQgdGhpcyBhdCB0aGUgbW9tZW50Li4uIEl0IHN0b3BwZWQgdGhpbmdzIGZyb20gd29ya2luZ1xuICAvLyB3ZSBoYXZlIHRvIGNoZWNrIHVwIG9uIHRoaXNcbiAgLy8gc2VydmljZVBhcmFtcyA9IF8ucGljayhzZXJ2aWNlUGFyYW1zLCB2YWxpZFMzU2VydmljZVBhcmFtS2V5cyk7XG5cbiAgLy8gQ3JlYXRlIFMzIHNlcnZpY2VcbiAgdmFyIFMzID0gbmV3IENMT1VEQVdTLlMzKHNlcnZpY2VQYXJhbXMpO1xuXG4gIHJldHVybiBuZXcgRlMuU3RvcmFnZUFkYXB0ZXIobmFtZSwgb3B0aW9ucywge1xuICAgIHR5cGVOYW1lOiAnc3RvcmFnZS5zMycsXG4gICAgZmlsZUtleTogZnVuY3Rpb24gKGZpbGVPYmopIHtcbiAgICAgIC8vIExvb2t1cCB0aGUgY29weVxuICAgICAgdmFyIGluZm8gPSBmaWxlT2JqICYmIGZpbGVPYmouX2dldEluZm8obmFtZSk7XG4gICAgICAvLyBJZiB0aGUgc3RvcmUgYW5kIGtleSBpcyBmb3VuZCByZXR1cm4gdGhlIGtleVxuICAgICAgaWYgKGluZm8gJiYgaW5mby5rZXkpIHJldHVybiBpbmZvLmtleTtcblxuICAgICAgdmFyIGZpbGVuYW1lID0gZmlsZU9iai5uYW1lKCk7XG4gICAgICB2YXIgZmlsZW5hbWVJblN0b3JlID0gZmlsZU9iai5uYW1lKHtcbiAgICAgICAgc3RvcmU6IG5hbWVcbiAgICAgIH0pO1xuXG4gICAgICAvLyBJZiBubyBzdG9yZSBrZXkgZm91bmQgd2UgcmVzb2x2ZSAvIGdlbmVyYXRlIGEga2V5XG4gICAgICByZXR1cm4gZmlsZU9iai5jb2xsZWN0aW9uTmFtZSArICcvJyArIGZpbGVPYmouY29sbGVjdGlvbk5hbWUgKyBcIi1cIiArIGZpbGVPYmouX2lkICsgJy0nICsgKGZpbGVuYW1lSW5TdG9yZSB8fCBmaWxlbmFtZSk7XG4gICAgfSxcbiAgICBjcmVhdGVSZWFkU3RyZWFtOiBmdW5jdGlvbiAoZmlsZUtleSwgb3B0aW9ucykge1xuICAgICAgLy8gY29uc29sZS5sb2coJ1MzLmNyZWF0ZVJlYWRTdHJlYW0uLi4uLi4uLi4uLjogJywgZmlsZUtleSwgb3B0aW9ucyk7XG5cbiAgICAgIHJldHVybiBTMy5jcmVhdGVSZWFkU3RyZWFtKHtcbiAgICAgICAgQnVja2V0OiBzdGVlZG9zQnVja2V0LFxuICAgICAgICBLZXk6IGZvbGRlciArIGZpbGVLZXksXG4gICAgICB9LCB7fSwgU3RlZWRvc0FwaUtleSk7XG5cbiAgICB9LFxuICAgIC8vIENvbW1lbnQgdG8gZG9jdW1lbnRhdGlvbjogU2V0IG9wdGlvbnMuQ29udGVudExlbmd0aCBvdGhlcndpc2UgdGhlXG4gICAgLy8gaW5kaXJlY3Qgc3RyZWFtIHdpbGwgYmUgdXNlZCBjcmVhdGluZyBleHRyYSBvdmVyaGVhZCBvbiB0aGUgZmlsZXN5c3RlbS5cbiAgICAvLyBBbiBlYXN5IHdheSBpZiB0aGUgZGF0YSBpcyBub3QgdHJhbnNmb3JtZWQgaXMgdG8gc2V0IHRoZVxuICAgIC8vIG9wdGlvbnMuQ29udGVudExlbmd0aCA9IGZpbGVPYmouc2l6ZSAuLi5cbiAgICBjcmVhdGVXcml0ZVN0cmVhbTogZnVuY3Rpb24gKGZpbGVLZXksIG9wdGlvbnMpIHtcbiAgICAgIG9wdGlvbnMgPSBvcHRpb25zIHx8IHt9O1xuXG4gICAgICBpZiAob3B0aW9ucy5jb250ZW50VHlwZSkge1xuICAgICAgICBvcHRpb25zLkNvbnRlbnRUeXBlID0gb3B0aW9ucy5jb250ZW50VHlwZTtcbiAgICAgIH1cblxuICAgICAgLy8gV2UgZG9udCBzdXBwb3J0IGFycmF5IG9mIGFsaWFzZXNcbiAgICAgIGRlbGV0ZSBvcHRpb25zLmFsaWFzZXM7XG4gICAgICAvLyBXZSBkb250IHN1cHBvcnQgY29udGVudFR5cGVcbiAgICAgIGRlbGV0ZSBvcHRpb25zLmNvbnRlbnRUeXBlO1xuICAgICAgLy8gV2UgZG9udCBzdXBwb3J0IG1ldGFkYXRhIHVzZSBNZXRhZGF0YT9cbiAgICAgIGRlbGV0ZSBvcHRpb25zLm1ldGFkYXRhO1xuXG4gICAgICAvLyBTZXQgb3B0aW9uc1xuICAgICAgdmFyIG9wdGlvbnMgPSBGUy5VdGlsaXR5LmV4dGVuZCh7XG4gICAgICAgIEJ1Y2tldDogc3RlZWRvc0J1Y2tldCxcbiAgICAgICAgS2V5OiBmb2xkZXIgKyBmaWxlS2V5LFxuICAgICAgICBmaWxlS2V5OiBmaWxlS2V5LFxuICAgICAgICBBQ0w6IGRlZmF1bHRBY2wsXG4gICAgICB9LCBvcHRpb25zKTtcbiAgICAgIC8vIGNvbnNvbGUubG9nKCdTMy5jcmVhdGVXcml0ZVN0cmVhbS4uLi4uLi4uLi4uOiAnLCBvcHRpb25zKTtcbiAgICAgIHJldHVybiBTMy5jcmVhdGVXcml0ZVN0cmVhbShvcHRpb25zLCB7fSwgU3RlZWRvc0FwaUtleSk7XG4gICAgfSxcbiAgICByZW1vdmU6IGZ1bmN0aW9uIChmaWxlS2V5LCBjYWxsYmFjaykge1xuICAgICAgLy8gY29uc29sZS5sb2coJ1MzLmRlbGV0ZU9iamVjdC4uLi4uLi4uLi4uOiAnLCBmaWxlS2V5KTtcblxuICAgICAgdmFyIGRlbGV0ZU9iamVjdFJlcSA9IFMzLmRlbGV0ZU9iamVjdCh7XG4gICAgICAgIEJ1Y2tldDogc3RlZWRvc0J1Y2tldCxcbiAgICAgICAgS2V5OiBmb2xkZXIgKyBmaWxlS2V5LFxuICAgICAgfSk7XG5cbiAgICAgIGRlbGV0ZU9iamVjdFJlcS5vbignYnVpbGQnLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGRlbGV0ZU9iamVjdFJlcS5odHRwUmVxdWVzdC5oZWFkZXJzWydhcGlrZXknXSA9IFN0ZWVkb3NBcGlLZXk7XG4gICAgICB9KTtcbiAgICAgIGRlbGV0ZU9iamVjdFJlcS5zZW5kKGZ1bmN0aW9uIChlcnJvcikge1xuICAgICAgICBjYWxsYmFjayhlcnJvciwgIWVycm9yKTtcbiAgICAgIH0pO1xuXG5cbiAgICAgIC8vIGNhbGxiYWNrKG51bGwsIHRydWUpO1xuICAgIH0sXG4gICAgd2F0Y2g6IGZ1bmN0aW9uICgpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihcIlMzIHN0b3JhZ2UgYWRhcHRlciBkb2VzIG5vdCBzdXBwb3J0IHRoZSBzeW5jIG9wdGlvblwiKTtcbiAgICB9XG4gIH0pO1xufTsiLCJpZiAoIUNMT1VEQVdTKVxuICByZXR1cm47XG5cbnZhciBXcml0YWJsZSA9IHJlcXVpcmUoJ3N0cmVhbScpLldyaXRhYmxlO1xuXG4vLyBUaGlzIGlzIGJhc2VkIG9uIHRoZSBjb2RlIGZyb21cbi8vIGh0dHBzOi8vZ2l0aHViLmNvbS9uYXRoYW5wZWNrL3MzLXVwbG9hZC1zdHJlYW0vYmxvYi9tYXN0ZXIvbGliL3MzLXVwbG9hZC1zdHJlYW0uanNcbi8vIEJ1dCBtdWNoIGlzIHJld3JpdHRlbiBhbmQgYWRhcHRlZCB0byBjZnNcblxuQ0xPVURBV1MuUzMucHJvdG90eXBlLmNyZWF0ZVJlYWRTdHJlYW0gPSBmdW5jdGlvbiAocGFyYW1zLCBvcHRpb25zLCBTdGVlZG9zQXBpS2V5KSB7XG4gIC8vIFNpbXBsZSB3cmFwcGVyXG4gIC8vIHJldHVybiB0aGlzLmdldE9iamVjdChwYXJhbXMpLmNyZWF0ZVJlYWRTdHJlYW0oKTtcblxuICB2YXIgZ2V0T2JqZWN0UmVxID0gdGhpcy5nZXRPYmplY3QocGFyYW1zKTtcbiAgZ2V0T2JqZWN0UmVxLm9uKCdidWlsZCcsIGZ1bmN0aW9uICgpIHtcbiAgICBnZXRPYmplY3RSZXEuaHR0cFJlcXVlc3QuaGVhZGVyc1snYXBpa2V5J10gPSBTdGVlZG9zQXBpS2V5O1xuICB9KTtcbiAgcmV0dXJuIGdldE9iamVjdFJlcS5jcmVhdGVSZWFkU3RyZWFtKCk7XG59O1xuXG4vLyBFeHRlbmQgdGhlIEFXUy5TMyBBUElcbkNMT1VEQVdTLlMzLnByb3RvdHlwZS5jcmVhdGVXcml0ZVN0cmVhbSA9IGZ1bmN0aW9uIChwYXJhbXMsIG9wdGlvbnMsIFN0ZWVkb3NBcGlLZXkpIHtcbiAgdmFyIHNlbGYgPSB0aGlzO1xuXG4gIC8vQ3JlYXRlIHRoZSB3cml0ZWFibGUgc3RyZWFtIGludGVyZmFjZS5cbiAgdmFyIHdyaXRlU3RyZWFtID0gV3JpdGFibGUoe1xuICAgIGhpZ2hXYXRlck1hcms6IDQxOTQzMDQgLy8gNCBNQlxuICB9KTtcblxuICB2YXIgcGFydE51bWJlciA9IDE7XG4gIHZhciBwYXJ0cyA9IFtdO1xuICB2YXIgcmVjZWl2ZWRTaXplID0gMDtcbiAgdmFyIHVwbG9hZGVkU2l6ZSA9IDA7XG4gIHZhciBjdXJyZW50Q2h1bmsgPSBCdWZmZXIoMCk7XG4gIHZhciBtYXhDaHVua1NpemUgPSA1MjQyODgwO1xuICB2YXIgbXVsdGlwYXJ0VXBsb2FkSUQgPSBudWxsO1xuICB2YXIgd2FpdGluZ0NhbGxiYWNrO1xuICB2YXIgZmlsZUtleSA9IHBhcmFtcyAmJiAocGFyYW1zLmZpbGVLZXkgfHwgcGFyYW1zLktleSk7XG5cbiAgLy8gQ2xlYW4gdXAgZm9yIEFXUyBzZGtcbiAgZGVsZXRlIHBhcmFtcy5maWxlS2V5O1xuXG4gIC8vIFRoaXMgc21hbGwgZnVuY3Rpb24gc3RvcHMgdGhlIHdyaXRlIHN0cmVhbSB1bnRpbCB3ZSBoYXZlIGNvbm5lY3RlZCB3aXRoXG4gIC8vIHRoZSBzMyBzZXJ2ZXJcbiAgdmFyIHJ1bldoZW5SZWFkeSA9IGZ1bmN0aW9uIChjYWxsYmFjaykge1xuICAgIC8vIElmIHdlIGRvbnQgaGF2ZSBhIHVwbG9hZCBpZCB3ZSBhcmUgbm90IHJlYWR5XG4gICAgaWYgKG11bHRpcGFydFVwbG9hZElEID09PSBudWxsKSB7XG4gICAgICAvLyBXZSBzZXQgdGhlIHdhaXRpbmcgY2FsbGJhY2tcbiAgICAgIHdhaXRpbmdDYWxsYmFjayA9IGNhbGxiYWNrO1xuICAgIH0gZWxzZSB7XG4gICAgICAvLyBObyBwcm9ibGVtIC0ganVzdCBjb250aW51ZVxuICAgICAgY2FsbGJhY2soKTtcbiAgICB9XG4gIH07XG5cbiAgLy9IYW5kbGVyIHRvIHJlY2VpdmUgZGF0YSBhbmQgdXBsb2FkIGl0IHRvIFMzLlxuICB3cml0ZVN0cmVhbS5fd3JpdGUgPSBmdW5jdGlvbiAoY2h1bmssIGVuYywgbmV4dCkge1xuICAgIGN1cnJlbnRDaHVuayA9IEJ1ZmZlci5jb25jYXQoW2N1cnJlbnRDaHVuaywgY2h1bmtdKTtcblxuICAgIC8vIElmIHRoZSBjdXJyZW50IGNodW5rIGJ1ZmZlciBpcyBnZXR0aW5nIHRvIGxhcmdlLCBvciB0aGUgc3RyZWFtIHBpcGVkIGluXG4gICAgLy8gaGFzIGVuZGVkIHRoZW4gZmx1c2ggdGhlIGNodW5rIGJ1ZmZlciBkb3duc3RyZWFtIHRvIFMzIHZpYSB0aGUgbXVsdGlwYXJ0XG4gICAgLy8gdXBsb2FkIEFQSS5cbiAgICBpZiAoY3VycmVudENodW5rLmxlbmd0aCA+IG1heENodW5rU2l6ZSkge1xuICAgICAgLy8gTWFrZSBzdXJlIHdlIG9ubHkgcnVuIHdoZW4gdGhlIHMzIHVwbG9hZCBpcyByZWFkeVxuICAgICAgcnVuV2hlblJlYWR5KGZ1bmN0aW9uICgpIHsgZmx1c2hDaHVuayhuZXh0LCBmYWxzZSk7IH0pO1xuICAgIH0gZWxzZSB7XG4gICAgICAvLyBXZSBkb250IGhhdmUgdG8gY29udGFjdCBzMyBmb3IgdGhpc1xuICAgICAgcnVuV2hlblJlYWR5KG5leHQpO1xuICAgIH1cbiAgfTtcblxuICAvLyBPdmVyd3JpdGUgdGhlIGVuZCBtZXRob2Qgc28gdGhhdCB3ZSBjYW4gaGlqYWNrIGl0IHRvIGZsdXNoIHRoZSBsYXN0IHBhcnRcbiAgLy8gYW5kIHRoZW4gY29tcGxldGUgdGhlIG11bHRpcGFydCB1cGxvYWRcbiAgdmFyIF9vcmlnaW5hbEVuZCA9IHdyaXRlU3RyZWFtLmVuZDtcbiAgd3JpdGVTdHJlYW0uZW5kID0gZnVuY3Rpb24gKGNodW5rLCBlbmNvZGluZywgY2FsbGJhY2spIHtcbiAgICAvLyBDYWxsIHRoZSBzdXBlclxuICAgIF9vcmlnaW5hbEVuZC5jYWxsKHRoaXMsIGNodW5rLCBlbmNvZGluZywgZnVuY3Rpb24gKCkge1xuICAgICAgLy8gTWFrZSBzdXJlIHdlIG9ubHkgcnVuIHdoZW4gdGhlIHMzIHVwbG9hZCBpcyByZWFkeVxuICAgICAgcnVuV2hlblJlYWR5KGZ1bmN0aW9uICgpIHsgZmx1c2hDaHVuayhjYWxsYmFjaywgdHJ1ZSk7IH0pO1xuICAgIH0pO1xuICB9O1xuXG4gIHdyaXRlU3RyZWFtLm9uKCdlcnJvcicsIGZ1bmN0aW9uICgpIHtcbiAgICBpZiAobXVsdGlwYXJ0VXBsb2FkSUQpIHtcbiAgICAgIGlmIChGUy5kZWJ1Zykge1xuICAgICAgICBjb25zb2xlLmxvZygnU0EgUzMgLSBFUlJPUiEhJyk7XG4gICAgICB9XG4gICAgICB2YXIgYWJvcnRNdWx0aXBhcnRVcGxvYWRSZXEgPSBzZWxmLmFib3J0TXVsdGlwYXJ0VXBsb2FkKHtcbiAgICAgICAgQnVja2V0OiBwYXJhbXMuQnVja2V0LFxuICAgICAgICBLZXk6IHBhcmFtcy5LZXksXG4gICAgICAgIFVwbG9hZElkOiBtdWx0aXBhcnRVcGxvYWRJRFxuICAgICAgfSk7XG5cbiAgICAgIGFib3J0TXVsdGlwYXJ0VXBsb2FkUmVxLm9uKCdidWlsZCcsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgYWJvcnRNdWx0aXBhcnRVcGxvYWRSZXEuaHR0cFJlcXVlc3QuaGVhZGVyc1snYXBpa2V5J10gPSBTdGVlZG9zQXBpS2V5O1xuICAgICAgfSk7XG4gICAgICBhYm9ydE11bHRpcGFydFVwbG9hZFJlcS5zZW5kKGZ1bmN0aW9uIChlcnIpIHtcbiAgICAgICAgaWYgKGVycikge1xuICAgICAgICAgIGNvbnNvbGUuZXJyb3IoJ1NBIFMzIC0gQ291bGQgbm90IGFib3J0IG11bHRpcGFydCB1cGxvYWQnLCBlcnIpXG4gICAgICAgIH1cbiAgICAgIH0pO1xuXG4gICAgfVxuICB9KTtcblxuICB2YXIgZmx1c2hDaHVuayA9IGZ1bmN0aW9uIChjYWxsYmFjaywgbGFzdENodW5rKSB7XG4gICAgaWYgKG11bHRpcGFydFVwbG9hZElEID09PSBudWxsKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ0ludGVybmFsIGVycm9yIG11bHRpcGFydFVwbG9hZElEIGlzIG51bGwnKTtcbiAgICB9XG4gICAgLy8gR2V0IHRoZSBjaHVuayBkYXRhXG4gICAgdmFyIHVwbG9hZGluZ0NodW5rID0gQnVmZmVyKGN1cnJlbnRDaHVuay5sZW5ndGgpO1xuICAgIGN1cnJlbnRDaHVuay5jb3B5KHVwbG9hZGluZ0NodW5rKTtcblxuXG4gICAgLy8gU3RvcmUgdGhlIGN1cnJlbnQgcGFydCBudW1iZXIgYW5kIHRoZW4gaW5jcmVhc2UgdGhlIGNvdW50ZXJcbiAgICB2YXIgbG9jYWxDaHVua051bWJlciA9IHBhcnROdW1iZXIrKztcblxuICAgIC8vIFdlIGFkZCB0aGUgc2l6ZSBvZiBkYXRhXG4gICAgcmVjZWl2ZWRTaXplICs9IHVwbG9hZGluZ0NodW5rLmxlbmd0aDtcbiAgICAvLyBjb25zb2xlLmxvZygnbXVsdGlwYXJ0VXBsb2FkSUQ6ICcsIG11bHRpcGFydFVwbG9hZElEKTtcbiAgICAvLyBVcGxvYWQgdGhlIHBhcnRcbiAgICB2YXIgdXBsb2FkUGFydFJlcSA9IHNlbGYudXBsb2FkUGFydCh7XG4gICAgICBCb2R5OiB1cGxvYWRpbmdDaHVuayxcbiAgICAgIEJ1Y2tldDogcGFyYW1zLkJ1Y2tldCxcbiAgICAgIEtleTogcGFyYW1zLktleSxcbiAgICAgIFVwbG9hZElkOiBtdWx0aXBhcnRVcGxvYWRJRCxcbiAgICAgIFBhcnROdW1iZXI6IGxvY2FsQ2h1bmtOdW1iZXJcbiAgICB9KTtcblxuICAgIHVwbG9hZFBhcnRSZXEub24oJ2J1aWxkJywgZnVuY3Rpb24gKCkge1xuICAgICAgdXBsb2FkUGFydFJlcS5odHRwUmVxdWVzdC5oZWFkZXJzWydhcGlrZXknXSA9IFN0ZWVkb3NBcGlLZXk7XG4gICAgfSk7XG4gICAgdXBsb2FkUGFydFJlcS5zZW5kKGZ1bmN0aW9uIChlcnIsIHJlc3VsdCkge1xuICAgICAgLy8gQ2FsbCB0aGUgbmV4dCBkYXRhXG4gICAgICBpZiAodHlwZW9mIGNhbGxiYWNrID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgIGNhbGxiYWNrKCk7XG4gICAgICB9XG5cbiAgICAgIGlmIChlcnIpIHtcbiAgICAgICAgd3JpdGVTdHJlYW0uZW1pdCgnZXJyb3InLCBlcnIpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgLy8gSW5jcmVhc2UgdGhlIHVwbG9hZCBzaXplXG4gICAgICAgIHVwbG9hZGVkU2l6ZSArPSB1cGxvYWRpbmdDaHVuay5sZW5ndGg7XG4gICAgICAgIHBhcnRzW2xvY2FsQ2h1bmtOdW1iZXIgLSAxXSA9IHtcbiAgICAgICAgICBFVGFnOiByZXN1bHQuRVRhZyxcbiAgICAgICAgICBQYXJ0TnVtYmVyOiBsb2NhbENodW5rTnVtYmVyXG4gICAgICAgIH07XG5cbiAgICAgICAgLy8gWFhYOiBldmVudCBmb3IgZGVidWdnaW5nXG4gICAgICAgIHdyaXRlU3RyZWFtLmVtaXQoJ2NodW5rJywge1xuICAgICAgICAgIEVUYWc6IHJlc3VsdC5FVGFnLFxuICAgICAgICAgIFBhcnROdW1iZXI6IGxvY2FsQ2h1bmtOdW1iZXIsXG4gICAgICAgICAgcmVjZWl2ZWRTaXplOiByZWNlaXZlZFNpemUsXG4gICAgICAgICAgdXBsb2FkZWRTaXplOiB1cGxvYWRlZFNpemVcbiAgICAgICAgfSk7XG5cbiAgICAgICAgLy8gVGhlIGluY29taW5nIHN0cmVhbSBoYXMgZmluaXNoZWQgZ2l2aW5nIHVzIGFsbCBkYXRhIGFuZCB3ZSBoYXZlXG4gICAgICAgIC8vIGZpbmlzaGVkIHVwbG9hZGluZyBhbGwgdGhhdCBkYXRhIHRvIFMzLiBTbyB0ZWxsIFMzIHRvIGFzc2VtYmxlIHRob3NlXG4gICAgICAgIC8vIHBhcnRzIHdlIHVwbG9hZGVkIGludG8gdGhlIGZpbmFsIHByb2R1Y3QuXG4gICAgICAgIGlmICh3cml0ZVN0cmVhbS5fd3JpdGFibGVTdGF0ZS5lbmRlZCA9PT0gdHJ1ZSAmJlxuICAgICAgICAgIHVwbG9hZGVkU2l6ZSA9PT0gcmVjZWl2ZWRTaXplICYmIGxhc3RDaHVuaykge1xuICAgICAgICAgIC8vIENvbXBsZXRlIHRoZSB1cGxvYWRcbiAgICAgICAgICB2YXIgY29tcGxldGVNdWx0aXBhcnRVcGxvYWRSZXEgPSBzZWxmLmNvbXBsZXRlTXVsdGlwYXJ0VXBsb2FkKHtcbiAgICAgICAgICAgIEJ1Y2tldDogcGFyYW1zLkJ1Y2tldCxcbiAgICAgICAgICAgIEtleTogcGFyYW1zLktleSxcbiAgICAgICAgICAgIFVwbG9hZElkOiBtdWx0aXBhcnRVcGxvYWRJRCxcbiAgICAgICAgICAgIE11bHRpcGFydFVwbG9hZDoge1xuICAgICAgICAgICAgICBQYXJ0czogcGFydHNcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9KTtcblxuICAgICAgICAgIGNvbXBsZXRlTXVsdGlwYXJ0VXBsb2FkUmVxLm9uKCdidWlsZCcsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIGNvbXBsZXRlTXVsdGlwYXJ0VXBsb2FkUmVxLmh0dHBSZXF1ZXN0LmhlYWRlcnNbJ2FwaWtleSddID0gU3RlZWRvc0FwaUtleTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgICBjb21wbGV0ZU11bHRpcGFydFVwbG9hZFJlcS5zZW5kKGZ1bmN0aW9uIChlcnIsIHJlc3VsdCkge1xuICAgICAgICAgICAgaWYgKGVycikge1xuICAgICAgICAgICAgICB3cml0ZVN0cmVhbS5lbWl0KCdlcnJvcicsIGVycik7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAvLyBFbWl0IHRoZSBjZnMgZW5kIGV2ZW50IGZvciB1cGxvYWRzXG4gICAgICAgICAgICAgIGlmIChGUy5kZWJ1Zykge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdTQSBTMyAtIERPTkUhIScpO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIHdyaXRlU3RyZWFtLmVtaXQoJ3N0b3JlZCcsIHtcbiAgICAgICAgICAgICAgICBmaWxlS2V5OiBmaWxlS2V5LFxuICAgICAgICAgICAgICAgIHNpemU6IHVwbG9hZGVkU2l6ZSxcbiAgICAgICAgICAgICAgICBzdG9yZWRBdDogbmV3IERhdGUoKVxuICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgIH0pO1xuXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9KTtcblxuICAgIC8vIFJlc2V0IHRoZSBjdXJyZW50IGJ1ZmZlclxuICAgIGN1cnJlbnRDaHVuayA9IEJ1ZmZlcigwKTtcbiAgfTtcblxuICAvL1VzZSB0aGUgUzMgY2xpZW50IHRvIGluaXRpYWxpemUgYSBtdWx0aXBhcnQgdXBsb2FkIHRvIFMzLlxuICB2YXIgY3JlYXRlTXVsdGlwYXJ0VXBsb2FkUmVxID0gc2VsZi5jcmVhdGVNdWx0aXBhcnRVcGxvYWQocGFyYW1zKTtcbiAgY3JlYXRlTXVsdGlwYXJ0VXBsb2FkUmVxLm9uKCdidWlsZCcsIGZ1bmN0aW9uICgpIHtcbiAgICBjcmVhdGVNdWx0aXBhcnRVcGxvYWRSZXEuaHR0cFJlcXVlc3QuaGVhZGVyc1snYXBpa2V5J10gPSBTdGVlZG9zQXBpS2V5O1xuICB9KTtcbiAgY3JlYXRlTXVsdGlwYXJ0VXBsb2FkUmVxLnNlbmQoZnVuY3Rpb24gKGVyciwgZGF0YSkge1xuICAgIGlmIChlcnIpIHtcbiAgICAgIC8vIEVtaXQgdGhlIGVycm9yXG4gICAgICB3cml0ZVN0cmVhbS5lbWl0KCdlcnJvcicsIGVycik7XG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIFNldCB0aGUgdXBsb2FkIGlkXG4gICAgICAvLyBjb25zb2xlLmxvZygnZGF0YS5VcGxvYWRJZDogJywgZGF0YS5VcGxvYWRJZCk7XG4gICAgICBtdWx0aXBhcnRVcGxvYWRJRCA9IGRhdGEuVXBsb2FkSWQ7XG5cbiAgICAgIC8vIENhbGwgd2FpdGluZyBjYWxsYmFja1xuICAgICAgaWYgKHR5cGVvZiB3YWl0aW5nQ2FsbGJhY2sgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgLy8gV2UgY2FsbCB0aGUgd2FpdGluZyBjYWxsYmFjayBpZiBhbnkgbm93IHNpbmNlIHdlIGVzdGFibGlzaGVkIGFcbiAgICAgICAgLy8gY29ubmVjdGlvbiB0byB0aGUgczNcbiAgICAgICAgd2FpdGluZ0NhbGxiYWNrKCk7XG4gICAgICB9XG5cbiAgICB9XG4gIH0pO1xuXG4gIC8vIFdlIHJldHVybiB0aGUgd3JpdGUgc3RyZWFtXG4gIHJldHVybiB3cml0ZVN0cmVhbTtcbn07XG4iXX0=
