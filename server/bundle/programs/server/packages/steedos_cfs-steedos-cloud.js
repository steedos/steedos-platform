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

if (Meteor.settings && Meteor.settings.cfs && Meteor.settings.cfs.steedosCloud) {
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvczpjZnMtc3RlZWRvcy1jbG91ZC9jaGVja05wbS5qcyIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvczpjZnMtc3RlZWRvcy1jbG91ZC9zMy5zZXJ2ZXIuanMiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3M6Y2ZzLXN0ZWVkb3MtY2xvdWQvczMudXBsb2FkLnN0cmVhbTIuanMiXSwibmFtZXMiOlsiY2hlY2tOcG1WZXJzaW9ucyIsIm1vZHVsZSIsImxpbmsiLCJ2IiwiZnMiLCJyZXF1aXJlIiwicGF0aCIsIk1ldGVvciIsInNldHRpbmdzIiwiY2ZzIiwic3RlZWRvc0Nsb3VkIiwiQ0xPVURBV1MiLCJfb2JqZWN0U3ByZWFkIiwiZGVmYXVsdCIsInZhbGlkUzNTZXJ2aWNlUGFyYW1LZXlzIiwidmFsaWRTM1B1dFBhcmFtS2V5cyIsIkZTIiwiU3RvcmUiLCJTVEVFRE9TQ0xPVUQiLCJuYW1lIiwib3B0cyIsInNlbGYiLCJFcnJvciIsIm9wdGlvbnMiLCJzM0ZvcmNlUGF0aFN0eWxlIiwiZm9sZGVyIiwibGVuZ3RoIiwic2xpY2UiLCJzdGVlZG9zQnVja2V0IiwiYnVja2V0Iiwiam9pbiIsImRlZmF1bHRBY2wiLCJBQ0wiLCJTdGVlZG9zQXBpS2V5Iiwic2VjcmV0QWNjZXNzS2V5Iiwic2VydmljZVBhcmFtcyIsIlV0aWxpdHkiLCJleHRlbmQiLCJCdWNrZXQiLCJyZWdpb24iLCJhY2Nlc3NLZXlJZCIsIlMzIiwiU3RvcmFnZUFkYXB0ZXIiLCJ0eXBlTmFtZSIsImZpbGVLZXkiLCJmaWxlT2JqIiwiaW5mbyIsIl9nZXRJbmZvIiwia2V5IiwiZmlsZW5hbWUiLCJmaWxlbmFtZUluU3RvcmUiLCJzdG9yZSIsImNvbGxlY3Rpb25OYW1lIiwiX2lkIiwiY3JlYXRlUmVhZFN0cmVhbSIsIktleSIsImNyZWF0ZVdyaXRlU3RyZWFtIiwiY29udGVudFR5cGUiLCJDb250ZW50VHlwZSIsImFsaWFzZXMiLCJtZXRhZGF0YSIsInJlbW92ZSIsImNhbGxiYWNrIiwiZGVsZXRlT2JqZWN0UmVxIiwiZGVsZXRlT2JqZWN0Iiwib24iLCJodHRwUmVxdWVzdCIsImhlYWRlcnMiLCJzZW5kIiwiZXJyb3IiLCJ3YXRjaCIsIldyaXRhYmxlIiwicHJvdG90eXBlIiwicGFyYW1zIiwiZ2V0T2JqZWN0UmVxIiwiZ2V0T2JqZWN0Iiwid3JpdGVTdHJlYW0iLCJoaWdoV2F0ZXJNYXJrIiwicGFydE51bWJlciIsInBhcnRzIiwicmVjZWl2ZWRTaXplIiwidXBsb2FkZWRTaXplIiwiY3VycmVudENodW5rIiwiQnVmZmVyIiwibWF4Q2h1bmtTaXplIiwibXVsdGlwYXJ0VXBsb2FkSUQiLCJ3YWl0aW5nQ2FsbGJhY2siLCJydW5XaGVuUmVhZHkiLCJfd3JpdGUiLCJjaHVuayIsImVuYyIsIm5leHQiLCJjb25jYXQiLCJmbHVzaENodW5rIiwiX29yaWdpbmFsRW5kIiwiZW5kIiwiZW5jb2RpbmciLCJjYWxsIiwiZGVidWciLCJjb25zb2xlIiwibG9nIiwiYWJvcnRNdWx0aXBhcnRVcGxvYWRSZXEiLCJhYm9ydE11bHRpcGFydFVwbG9hZCIsIlVwbG9hZElkIiwiZXJyIiwibGFzdENodW5rIiwidXBsb2FkaW5nQ2h1bmsiLCJjb3B5IiwibG9jYWxDaHVua051bWJlciIsInVwbG9hZFBhcnRSZXEiLCJ1cGxvYWRQYXJ0IiwiQm9keSIsIlBhcnROdW1iZXIiLCJyZXN1bHQiLCJlbWl0IiwiRVRhZyIsIl93cml0YWJsZVN0YXRlIiwiZW5kZWQiLCJjb21wbGV0ZU11bHRpcGFydFVwbG9hZFJlcSIsImNvbXBsZXRlTXVsdGlwYXJ0VXBsb2FkIiwiTXVsdGlwYXJ0VXBsb2FkIiwiUGFydHMiLCJzaXplIiwic3RvcmVkQXQiLCJEYXRlIiwiY3JlYXRlTXVsdGlwYXJ0VXBsb2FkUmVxIiwiY3JlYXRlTXVsdGlwYXJ0VXBsb2FkIiwiZGF0YSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLElB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ImZpbGUiOiIvcGFja2FnZXMvc3RlZWRvc19jZnMtc3RlZWRvcy1jbG91ZC5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7XG4gIGNoZWNrTnBtVmVyc2lvbnNcbn0gZnJvbSAnbWV0ZW9yL3RtZWFzZGF5OmNoZWNrLW5wbS12ZXJzaW9ucyc7XG5cbmNvbnN0IGZzID0gcmVxdWlyZSgnZnMnKTtcbmNvbnN0IHBhdGggPSByZXF1aXJlKCdwYXRoJylcblxuaWYgKE1ldGVvci5zZXR0aW5ncyAmJiBNZXRlb3Iuc2V0dGluZ3MuY2ZzICYmIE1ldGVvci5zZXR0aW5ncy5jZnMuc3RlZWRvc0Nsb3VkKSB7XG4gIGNoZWNrTnBtVmVyc2lvbnMoe1xuICAgICdhd3Mtc2RrJzogXCJeMi4wLjIzXCJcbiAgfSwgJ3N0ZWVkb3M6Y2ZzLXN0ZWVkb3MtY2xvdWQnKTtcblxuICAvLyAvLyDkv67mlLlzMy0yMDA2LTAzLTAxLm1pbi5qc29uIOWwhiBTdGVlZG9zQXBpS2V55re75Yqg6L+bbWVtYmVyc+eUqOS6juivt+axguaXtmF3cy1zZGvlj5HpgIHmraRoZWFkZXJcbiAgLy8gdmFyIGJhc2UgPSBwcm9jZXNzLmN3ZCgpO1xuICAvLyBjb25zb2xlLmxvZygncHJvY2Vzcy5jd2QoKTogJywgcHJvY2Vzcy5jd2QoKSk7XG4gIC8vIGlmIChwcm9jZXNzLmVudi5DUkVBVE9SX05PREVfRU5WID09ICdkZXZlbG9wbWVudCcpIHtcbiAgLy8gICBiYXNlID0gcGF0aC5yZXNvbHZlKCcuJykuc3BsaXQoJy5tZXRlb3InKVswXTtcbiAgLy8gfVxuICAvLyBjb25zb2xlLmxvZygnYmFzZTogJywgYmFzZSk7XG4gIC8vIHZhciBzZGtQYXRoID0gcGF0aC5qb2luKGJhc2UsIHJlcXVpcmUucmVzb2x2ZSgnYXdzLXNkay9wYWNrYWdlLmpzb24nLCB7XG4gIC8vICAgcGF0aHM6IFtiYXNlXVxuICAvLyB9KSk7XG4gIC8vIGNvbnNvbGUubG9nKCdzZGtQYXRoOiAnLCBzZGtQYXRoKTtcbiAgLy8gdmFyIHNka1ZlcnNpb25NaW5Kc29uUGF0aCA9IHBhdGguam9pbihzZGtQYXRoLCAnLi4vYXBpcy9zMy0yMDA2LTAzLTAxLm1pbi5qc29uJyk7XG4gIC8vIGNvbnNvbGUubG9nKCdzZGtWZXJzaW9uTWluSnNvblBhdGg6ICcsIHNka1ZlcnNpb25NaW5Kc29uUGF0aCk7XG4gIC8vIHZhciBtaW5Kc29uID0gSlNPTi5wYXJzZShmcy5yZWFkRmlsZVN5bmMoc2RrVmVyc2lvbk1pbkpzb25QYXRoKSk7XG4gIC8vIGNvbnNvbGUubG9nKG1pbkpzb24pO1xuICAvLyB2YXIgb3BlcmF0aW9ucyA9IG1pbkpzb24ub3BlcmF0aW9ucztcbiAgLy8gZm9yIChjb25zdCBrZXkgaW4gb3BlcmF0aW9ucykge1xuICAvLyAgIGlmIChPYmplY3QuaGFzT3duUHJvcGVydHkuY2FsbChvcGVyYXRpb25zLCBrZXkpKSB7XG4gIC8vICAgICBjb25zdCBlbGVtZW50ID0gb3BlcmF0aW9uc1trZXldO1xuICAvLyAgICAgaWYgKGVsZW1lbnQuaW5wdXQpIHtcbiAgLy8gICAgICAgZWxlbWVudC5pbnB1dC5tZW1iZXJzLlN0ZWVkb3NBcGlLZXkgPSB7IFwibG9jYXRpb25cIjogXCJoZWFkZXJcIiwgXCJsb2NhdGlvbk5hbWVcIjogXCJhcGlrZXlcIiB9XG4gIC8vICAgICB9XG4gIC8vICAgfVxuICAvLyB9XG5cbiAgLy8gZnMud3JpdGVGaWxlU3luYyhzZGtWZXJzaW9uTWluSnNvblBhdGgsIEpTT04uc3RyaW5naWZ5KG1pbkpzb24pKTsgXG5cbiAgQ0xPVURBV1MgPSByZXF1aXJlKCdhd3Mtc2RrJyk7XG59XG4iLCJpZiAoIUNMT1VEQVdTKVxuICByZXR1cm47XG5cbmNvbnN0IHBhdGggPSByZXF1aXJlKCdwYXRoJyk7XG5cbi8vIFdlIHVzZSB0aGUgb2ZmaWNpYWwgYXdzIHNka1xuXG5cbnZhciB2YWxpZFMzU2VydmljZVBhcmFtS2V5cyA9IFtcbiAgJ2VuZHBvaW50JyxcbiAgJ2FjY2Vzc0tleUlkJyxcbiAgJ3NlY3JldEFjY2Vzc0tleScsXG4gICdzZXNzaW9uVG9rZW4nLFxuICAnY3JlZGVudGlhbHMnLFxuICAnY3JlZGVudGlhbFByb3ZpZGVyJyxcbiAgJ3JlZ2lvbicsXG4gICdtYXhSZXRyaWVzJyxcbiAgJ21heFJlZGlyZWN0cycsXG4gICdzc2xFbmFibGVkJyxcbiAgJ3BhcmFtVmFsaWRhdGlvbicsXG4gICdjb21wdXRlQ2hlY2tzdW1zJyxcbiAgJ3MzRm9yY2VQYXRoU3R5bGUnLFxuICAnaHR0cE9wdGlvbnMnLFxuICAnYXBpVmVyc2lvbicsXG4gICdhcGlWZXJzaW9ucycsXG4gICdsb2dnZXInLFxuICAnc2lnbmF0dXJlVmVyc2lvbidcbl07XG52YXIgdmFsaWRTM1B1dFBhcmFtS2V5cyA9IFtcbiAgJ0FDTCcsXG4gICdCb2R5JyxcbiAgJ0J1Y2tldCcsXG4gICdDYWNoZUNvbnRyb2wnLFxuICAnQ29udGVudERpc3Bvc2l0aW9uJyxcbiAgJ0NvbnRlbnRFbmNvZGluZycsXG4gICdDb250ZW50TGFuZ3VhZ2UnLFxuICAnQ29udGVudExlbmd0aCcsXG4gICdDb250ZW50TUQ1JyxcbiAgJ0NvbnRlbnRUeXBlJyxcbiAgJ0V4cGlyZXMnLFxuICAnR3JhbnRGdWxsQ29udHJvbCcsXG4gICdHcmFudFJlYWQnLFxuICAnR3JhbnRSZWFkQUNQJyxcbiAgJ0dyYW50V3JpdGVBQ1AnLFxuICAnS2V5JyxcbiAgJ01ldGFkYXRhJyxcbiAgJ1NlcnZlclNpZGVFbmNyeXB0aW9uJyxcbiAgJ1N0b3JhZ2VDbGFzcycsXG4gICdXZWJzaXRlUmVkaXJlY3RMb2NhdGlvbidcbl07XG5cbi8qKlxuICogQHB1YmxpY1xuICogQGNvbnN0cnVjdG9yXG4gKiBAcGFyYW0ge1N0cmluZ30gbmFtZSAtIFRoZSBzdG9yZSBuYW1lXG4gKiBAcGFyYW0ge09iamVjdH0gb3B0aW9uc1xuICogQHBhcmFtIHtTdHJpbmd9IG9wdGlvbnMucmVnaW9uIC0gQnVja2V0IHJlZ2lvblxuICogQHBhcmFtIHtTdHJpbmd9IG9wdGlvbnMuc3RlZWRvc0J1Y2tldCAtIEJ1Y2tldCBuYW1lXG4gKiBAcGFyYW0ge1N0cmluZ30gW29wdGlvbnMuYWNjZXNzS2V5SWRdIC0gQVdTIElBTSBrZXk7IHJlcXVpcmVkIGlmIG5vdCBzZXQgaW4gZW52aXJvbm1lbnQgdmFyaWFibGVzXG4gKiBAcGFyYW0ge1N0cmluZ30gW29wdGlvbnMuc2VjcmV0QWNjZXNzS2V5XSAtIEFXUyBJQU0gc2VjcmV0OyByZXF1aXJlZCBpZiBub3Qgc2V0IGluIGVudmlyb25tZW50IHZhcmlhYmxlc1xuICogQHBhcmFtIHtTdHJpbmd9IFtvcHRpb25zLkFDTD0ncHJpdmF0ZSddIC0gQUNMIGZvciBvYmplY3RzIHdoZW4gcHV0dGluZ1xuICogQHBhcmFtIHtTdHJpbmd9IFtvcHRpb25zLmZvbGRlcj0nLyddIC0gV2hpY2ggZm9sZGVyIChrZXkgcHJlZml4KSBpbiB0aGUgYnVja2V0IHRvIHVzZVxuICogQHBhcmFtIHtGdW5jdGlvbn0gW29wdGlvbnMuYmVmb3JlU2F2ZV0gLSBGdW5jdGlvbiB0byBydW4gYmVmb3JlIHNhdmluZyBhIGZpbGUgZnJvbSB0aGUgc2VydmVyLiBUaGUgY29udGV4dCBvZiB0aGUgZnVuY3Rpb24gd2lsbCBiZSB0aGUgYEZTLkZpbGVgIGluc3RhbmNlIHdlJ3JlIHNhdmluZy4gVGhlIGZ1bmN0aW9uIG1heSBhbHRlciBpdHMgcHJvcGVydGllcy5cbiAqIEBwYXJhbSB7TnVtYmVyfSBbb3B0aW9ucy5tYXhUcmllcz01XSAtIE1heCB0aW1lcyB0byBhdHRlbXB0IHNhdmluZyBhIGZpbGVcbiAqIEByZXR1cm5zIHtGUy5TdG9yYWdlQWRhcHRlcn0gQW4gaW5zdGFuY2Ugb2YgRlMuU3RvcmFnZUFkYXB0ZXIuXG4gKlxuICogQ3JlYXRlcyBhbiBTMyBzdG9yZSBpbnN0YW5jZSBvbiB0aGUgc2VydmVyLiBJbmhlcml0cyBmcm9tIEZTLlN0b3JhZ2VBZGFwdGVyXG4gKiB0eXBlLlxuICovXG5GUy5TdG9yZS5TVEVFRE9TQ0xPVUQgPSBmdW5jdGlvbiAobmFtZSwgb3B0cykge1xuICB2YXIgc2VsZiA9IHRoaXM7XG4gIGlmICghKHNlbGYgaW5zdGFuY2VvZiBGUy5TdG9yZS5TVEVFRE9TQ0xPVUQpKVxuICAgIHRocm93IG5ldyBFcnJvcignRlMuU3RvcmUuU1RFRURPU0NMT1VEIG1pc3Npbmcga2V5d29yZCBcIm5ld1wiJyk7XG5cbiAgb3B0cyA9IG9wdHMgfHwge307XG4gIHZhciBvcHRpb25zID0ge1xuICAgIC4uLm9wdHNcbiAgfVxuICBvcHRpb25zLnMzRm9yY2VQYXRoU3R5bGUgPSB0cnVlO1xuXG4gIC8vIERldGVybWluZSB3aGljaCBmb2xkZXIgKGtleSBwcmVmaXgpIGluIHRoZSBidWNrZXQgdG8gdXNlXG4gIHZhciBmb2xkZXIgPSBvcHRpb25zLmZvbGRlcjtcbiAgaWYgKHR5cGVvZiBmb2xkZXIgPT09IFwic3RyaW5nXCIgJiYgZm9sZGVyLmxlbmd0aCkge1xuICAgIGlmIChmb2xkZXIuc2xpY2UoMCwgMSkgPT09IFwiL1wiKSB7XG4gICAgICBmb2xkZXIgPSBmb2xkZXIuc2xpY2UoMSk7XG4gICAgfVxuICAgIGlmIChmb2xkZXIuc2xpY2UoLTEpICE9PSBcIi9cIikge1xuICAgICAgZm9sZGVyICs9IFwiL1wiO1xuICAgIH1cbiAgfSBlbHNlIHtcbiAgICBmb2xkZXIgPSBcIlwiO1xuICB9XG5cbiAgdmFyIHN0ZWVkb3NCdWNrZXQgPSBvcHRpb25zLnN0ZWVkb3NCdWNrZXQgfHwgJ3MzLWtvbmctc2VydmllJztcbiAgdmFyIGJ1Y2tldCA9IG9wdGlvbnMuYnVja2V0O1xuICBpZiAoIWJ1Y2tldClcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ0ZTLlN0b3JlLlNURUVET1NDTE9VRCB5b3UgbXVzdCBzcGVjaWZ5IHRoZSBcImJ1Y2tldFwiIG9wdGlvbicpO1xuXG4gIC8vIOaLvOaOpWZvbGRlclxuICBvcHRpb25zLmZvbGRlciA9IHBhdGguam9pbihidWNrZXQsIGZvbGRlciwgJy8nKTtcbiAgZm9sZGVyID0gb3B0aW9ucy5mb2xkZXI7XG4gIGRlbGV0ZSBvcHRpb25zLmJ1Y2tldDtcblxuICB2YXIgZGVmYXVsdEFjbCA9IG9wdGlvbnMuQUNMIHx8ICdwcml2YXRlJztcblxuICB2YXIgU3RlZWRvc0FwaUtleSA9IG9wdGlvbnMuc2VjcmV0QWNjZXNzS2V5O1xuXG4gIC8vIFJlbW92ZSBzZXJ2aWNlUGFyYW1zIGZyb20gU0Egb3B0aW9uc1xuICAvLyBvcHRpb25zID0gXy5vbWl0KG9wdGlvbnMsIHZhbGlkUzNTZXJ2aWNlUGFyYW1LZXlzKTtcblxuICB2YXIgc2VydmljZVBhcmFtcyA9IEZTLlV0aWxpdHkuZXh0ZW5kKHtcbiAgICBCdWNrZXQ6IHN0ZWVkb3NCdWNrZXQsXG4gICAgcmVnaW9uOiBudWxsLCAvL3JlcXVpcmVkXG4gICAgYWNjZXNzS2V5SWQ6IG51bGwsIC8vcmVxdWlyZWRcbiAgICBzZWNyZXRBY2Nlc3NLZXk6IG51bGwsIC8vcmVxdWlyZWRcbiAgICBBQ0w6IGRlZmF1bHRBY2xcbiAgfSwgb3B0aW9ucyk7XG5cbiAgLy8gV2hpdGVsaXN0IHNlcnZpY2VQYXJhbXMsIGVsc2UgYXdzLXNkayB0aHJvd3MgYW4gZXJyb3JcbiAgLy8gWFhYOiBJJ3ZlIGNvbW1lbnRlZCB0aGlzIGF0IHRoZSBtb21lbnQuLi4gSXQgc3RvcHBlZCB0aGluZ3MgZnJvbSB3b3JraW5nXG4gIC8vIHdlIGhhdmUgdG8gY2hlY2sgdXAgb24gdGhpc1xuICAvLyBzZXJ2aWNlUGFyYW1zID0gXy5waWNrKHNlcnZpY2VQYXJhbXMsIHZhbGlkUzNTZXJ2aWNlUGFyYW1LZXlzKTtcblxuICAvLyBDcmVhdGUgUzMgc2VydmljZVxuICB2YXIgUzMgPSBuZXcgQ0xPVURBV1MuUzMoc2VydmljZVBhcmFtcyk7XG5cbiAgcmV0dXJuIG5ldyBGUy5TdG9yYWdlQWRhcHRlcihuYW1lLCBvcHRpb25zLCB7XG4gICAgdHlwZU5hbWU6ICdzdG9yYWdlLnMzJyxcbiAgICBmaWxlS2V5OiBmdW5jdGlvbiAoZmlsZU9iaikge1xuICAgICAgLy8gTG9va3VwIHRoZSBjb3B5XG4gICAgICB2YXIgaW5mbyA9IGZpbGVPYmogJiYgZmlsZU9iai5fZ2V0SW5mbyhuYW1lKTtcbiAgICAgIC8vIElmIHRoZSBzdG9yZSBhbmQga2V5IGlzIGZvdW5kIHJldHVybiB0aGUga2V5XG4gICAgICBpZiAoaW5mbyAmJiBpbmZvLmtleSkgcmV0dXJuIGluZm8ua2V5O1xuXG4gICAgICB2YXIgZmlsZW5hbWUgPSBmaWxlT2JqLm5hbWUoKTtcbiAgICAgIHZhciBmaWxlbmFtZUluU3RvcmUgPSBmaWxlT2JqLm5hbWUoe1xuICAgICAgICBzdG9yZTogbmFtZVxuICAgICAgfSk7XG5cbiAgICAgIC8vIElmIG5vIHN0b3JlIGtleSBmb3VuZCB3ZSByZXNvbHZlIC8gZ2VuZXJhdGUgYSBrZXlcbiAgICAgIHJldHVybiBmaWxlT2JqLmNvbGxlY3Rpb25OYW1lICsgJy8nICsgZmlsZU9iai5jb2xsZWN0aW9uTmFtZSArIFwiLVwiICsgZmlsZU9iai5faWQgKyAnLScgKyAoZmlsZW5hbWVJblN0b3JlIHx8IGZpbGVuYW1lKTtcbiAgICB9LFxuICAgIGNyZWF0ZVJlYWRTdHJlYW06IGZ1bmN0aW9uIChmaWxlS2V5LCBvcHRpb25zKSB7XG4gICAgICAvLyBjb25zb2xlLmxvZygnUzMuY3JlYXRlUmVhZFN0cmVhbS4uLi4uLi4uLi4uOiAnLCBmaWxlS2V5LCBvcHRpb25zKTtcblxuICAgICAgcmV0dXJuIFMzLmNyZWF0ZVJlYWRTdHJlYW0oe1xuICAgICAgICBCdWNrZXQ6IHN0ZWVkb3NCdWNrZXQsXG4gICAgICAgIEtleTogZm9sZGVyICsgZmlsZUtleSxcbiAgICAgIH0sIHt9LCBTdGVlZG9zQXBpS2V5KTtcblxuICAgIH0sXG4gICAgLy8gQ29tbWVudCB0byBkb2N1bWVudGF0aW9uOiBTZXQgb3B0aW9ucy5Db250ZW50TGVuZ3RoIG90aGVyd2lzZSB0aGVcbiAgICAvLyBpbmRpcmVjdCBzdHJlYW0gd2lsbCBiZSB1c2VkIGNyZWF0aW5nIGV4dHJhIG92ZXJoZWFkIG9uIHRoZSBmaWxlc3lzdGVtLlxuICAgIC8vIEFuIGVhc3kgd2F5IGlmIHRoZSBkYXRhIGlzIG5vdCB0cmFuc2Zvcm1lZCBpcyB0byBzZXQgdGhlXG4gICAgLy8gb3B0aW9ucy5Db250ZW50TGVuZ3RoID0gZmlsZU9iai5zaXplIC4uLlxuICAgIGNyZWF0ZVdyaXRlU3RyZWFtOiBmdW5jdGlvbiAoZmlsZUtleSwgb3B0aW9ucykge1xuICAgICAgb3B0aW9ucyA9IG9wdGlvbnMgfHwge307XG5cbiAgICAgIGlmIChvcHRpb25zLmNvbnRlbnRUeXBlKSB7XG4gICAgICAgIG9wdGlvbnMuQ29udGVudFR5cGUgPSBvcHRpb25zLmNvbnRlbnRUeXBlO1xuICAgICAgfVxuXG4gICAgICAvLyBXZSBkb250IHN1cHBvcnQgYXJyYXkgb2YgYWxpYXNlc1xuICAgICAgZGVsZXRlIG9wdGlvbnMuYWxpYXNlcztcbiAgICAgIC8vIFdlIGRvbnQgc3VwcG9ydCBjb250ZW50VHlwZVxuICAgICAgZGVsZXRlIG9wdGlvbnMuY29udGVudFR5cGU7XG4gICAgICAvLyBXZSBkb250IHN1cHBvcnQgbWV0YWRhdGEgdXNlIE1ldGFkYXRhP1xuICAgICAgZGVsZXRlIG9wdGlvbnMubWV0YWRhdGE7XG5cbiAgICAgIC8vIFNldCBvcHRpb25zXG4gICAgICB2YXIgb3B0aW9ucyA9IEZTLlV0aWxpdHkuZXh0ZW5kKHtcbiAgICAgICAgQnVja2V0OiBzdGVlZG9zQnVja2V0LFxuICAgICAgICBLZXk6IGZvbGRlciArIGZpbGVLZXksXG4gICAgICAgIGZpbGVLZXk6IGZpbGVLZXksXG4gICAgICAgIEFDTDogZGVmYXVsdEFjbCxcbiAgICAgIH0sIG9wdGlvbnMpO1xuICAgICAgLy8gY29uc29sZS5sb2coJ1MzLmNyZWF0ZVdyaXRlU3RyZWFtLi4uLi4uLi4uLi46ICcsIG9wdGlvbnMpO1xuICAgICAgcmV0dXJuIFMzLmNyZWF0ZVdyaXRlU3RyZWFtKG9wdGlvbnMsIHt9LCBTdGVlZG9zQXBpS2V5KTtcbiAgICB9LFxuICAgIHJlbW92ZTogZnVuY3Rpb24gKGZpbGVLZXksIGNhbGxiYWNrKSB7XG4gICAgICAvLyBjb25zb2xlLmxvZygnUzMuZGVsZXRlT2JqZWN0Li4uLi4uLi4uLi46ICcsIGZpbGVLZXkpO1xuXG4gICAgICB2YXIgZGVsZXRlT2JqZWN0UmVxID0gUzMuZGVsZXRlT2JqZWN0KHtcbiAgICAgICAgQnVja2V0OiBzdGVlZG9zQnVja2V0LFxuICAgICAgICBLZXk6IGZvbGRlciArIGZpbGVLZXksXG4gICAgICB9KTtcblxuICAgICAgZGVsZXRlT2JqZWN0UmVxLm9uKCdidWlsZCcsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgZGVsZXRlT2JqZWN0UmVxLmh0dHBSZXF1ZXN0LmhlYWRlcnNbJ2FwaWtleSddID0gU3RlZWRvc0FwaUtleTtcbiAgICAgIH0pO1xuICAgICAgZGVsZXRlT2JqZWN0UmVxLnNlbmQoZnVuY3Rpb24gKGVycm9yKSB7XG4gICAgICAgIGNhbGxiYWNrKGVycm9yLCAhZXJyb3IpO1xuICAgICAgfSk7XG5cblxuICAgICAgLy8gY2FsbGJhY2sobnVsbCwgdHJ1ZSk7XG4gICAgfSxcbiAgICB3YXRjaDogZnVuY3Rpb24gKCkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKFwiUzMgc3RvcmFnZSBhZGFwdGVyIGRvZXMgbm90IHN1cHBvcnQgdGhlIHN5bmMgb3B0aW9uXCIpO1xuICAgIH1cbiAgfSk7XG59OyIsImlmICghQ0xPVURBV1MpXG4gIHJldHVybjtcblxudmFyIFdyaXRhYmxlID0gcmVxdWlyZSgnc3RyZWFtJykuV3JpdGFibGU7XG5cbi8vIFRoaXMgaXMgYmFzZWQgb24gdGhlIGNvZGUgZnJvbVxuLy8gaHR0cHM6Ly9naXRodWIuY29tL25hdGhhbnBlY2svczMtdXBsb2FkLXN0cmVhbS9ibG9iL21hc3Rlci9saWIvczMtdXBsb2FkLXN0cmVhbS5qc1xuLy8gQnV0IG11Y2ggaXMgcmV3cml0dGVuIGFuZCBhZGFwdGVkIHRvIGNmc1xuXG5DTE9VREFXUy5TMy5wcm90b3R5cGUuY3JlYXRlUmVhZFN0cmVhbSA9IGZ1bmN0aW9uIChwYXJhbXMsIG9wdGlvbnMsIFN0ZWVkb3NBcGlLZXkpIHtcbiAgLy8gU2ltcGxlIHdyYXBwZXJcbiAgLy8gcmV0dXJuIHRoaXMuZ2V0T2JqZWN0KHBhcmFtcykuY3JlYXRlUmVhZFN0cmVhbSgpO1xuXG4gIHZhciBnZXRPYmplY3RSZXEgPSB0aGlzLmdldE9iamVjdChwYXJhbXMpO1xuICBnZXRPYmplY3RSZXEub24oJ2J1aWxkJywgZnVuY3Rpb24gKCkge1xuICAgIGdldE9iamVjdFJlcS5odHRwUmVxdWVzdC5oZWFkZXJzWydhcGlrZXknXSA9IFN0ZWVkb3NBcGlLZXk7XG4gIH0pO1xuICByZXR1cm4gZ2V0T2JqZWN0UmVxLmNyZWF0ZVJlYWRTdHJlYW0oKTtcbn07XG5cbi8vIEV4dGVuZCB0aGUgQVdTLlMzIEFQSVxuQ0xPVURBV1MuUzMucHJvdG90eXBlLmNyZWF0ZVdyaXRlU3RyZWFtID0gZnVuY3Rpb24gKHBhcmFtcywgb3B0aW9ucywgU3RlZWRvc0FwaUtleSkge1xuICB2YXIgc2VsZiA9IHRoaXM7XG5cbiAgLy9DcmVhdGUgdGhlIHdyaXRlYWJsZSBzdHJlYW0gaW50ZXJmYWNlLlxuICB2YXIgd3JpdGVTdHJlYW0gPSBXcml0YWJsZSh7XG4gICAgaGlnaFdhdGVyTWFyazogNDE5NDMwNCAvLyA0IE1CXG4gIH0pO1xuXG4gIHZhciBwYXJ0TnVtYmVyID0gMTtcbiAgdmFyIHBhcnRzID0gW107XG4gIHZhciByZWNlaXZlZFNpemUgPSAwO1xuICB2YXIgdXBsb2FkZWRTaXplID0gMDtcbiAgdmFyIGN1cnJlbnRDaHVuayA9IEJ1ZmZlcigwKTtcbiAgdmFyIG1heENodW5rU2l6ZSA9IDUyNDI4ODA7XG4gIHZhciBtdWx0aXBhcnRVcGxvYWRJRCA9IG51bGw7XG4gIHZhciB3YWl0aW5nQ2FsbGJhY2s7XG4gIHZhciBmaWxlS2V5ID0gcGFyYW1zICYmIChwYXJhbXMuZmlsZUtleSB8fCBwYXJhbXMuS2V5KTtcblxuICAvLyBDbGVhbiB1cCBmb3IgQVdTIHNka1xuICBkZWxldGUgcGFyYW1zLmZpbGVLZXk7XG5cbiAgLy8gVGhpcyBzbWFsbCBmdW5jdGlvbiBzdG9wcyB0aGUgd3JpdGUgc3RyZWFtIHVudGlsIHdlIGhhdmUgY29ubmVjdGVkIHdpdGhcbiAgLy8gdGhlIHMzIHNlcnZlclxuICB2YXIgcnVuV2hlblJlYWR5ID0gZnVuY3Rpb24gKGNhbGxiYWNrKSB7XG4gICAgLy8gSWYgd2UgZG9udCBoYXZlIGEgdXBsb2FkIGlkIHdlIGFyZSBub3QgcmVhZHlcbiAgICBpZiAobXVsdGlwYXJ0VXBsb2FkSUQgPT09IG51bGwpIHtcbiAgICAgIC8vIFdlIHNldCB0aGUgd2FpdGluZyBjYWxsYmFja1xuICAgICAgd2FpdGluZ0NhbGxiYWNrID0gY2FsbGJhY2s7XG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIE5vIHByb2JsZW0gLSBqdXN0IGNvbnRpbnVlXG4gICAgICBjYWxsYmFjaygpO1xuICAgIH1cbiAgfTtcblxuICAvL0hhbmRsZXIgdG8gcmVjZWl2ZSBkYXRhIGFuZCB1cGxvYWQgaXQgdG8gUzMuXG4gIHdyaXRlU3RyZWFtLl93cml0ZSA9IGZ1bmN0aW9uIChjaHVuaywgZW5jLCBuZXh0KSB7XG4gICAgY3VycmVudENodW5rID0gQnVmZmVyLmNvbmNhdChbY3VycmVudENodW5rLCBjaHVua10pO1xuXG4gICAgLy8gSWYgdGhlIGN1cnJlbnQgY2h1bmsgYnVmZmVyIGlzIGdldHRpbmcgdG8gbGFyZ2UsIG9yIHRoZSBzdHJlYW0gcGlwZWQgaW5cbiAgICAvLyBoYXMgZW5kZWQgdGhlbiBmbHVzaCB0aGUgY2h1bmsgYnVmZmVyIGRvd25zdHJlYW0gdG8gUzMgdmlhIHRoZSBtdWx0aXBhcnRcbiAgICAvLyB1cGxvYWQgQVBJLlxuICAgIGlmIChjdXJyZW50Q2h1bmsubGVuZ3RoID4gbWF4Q2h1bmtTaXplKSB7XG4gICAgICAvLyBNYWtlIHN1cmUgd2Ugb25seSBydW4gd2hlbiB0aGUgczMgdXBsb2FkIGlzIHJlYWR5XG4gICAgICBydW5XaGVuUmVhZHkoZnVuY3Rpb24gKCkgeyBmbHVzaENodW5rKG5leHQsIGZhbHNlKTsgfSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIFdlIGRvbnQgaGF2ZSB0byBjb250YWN0IHMzIGZvciB0aGlzXG4gICAgICBydW5XaGVuUmVhZHkobmV4dCk7XG4gICAgfVxuICB9O1xuXG4gIC8vIE92ZXJ3cml0ZSB0aGUgZW5kIG1ldGhvZCBzbyB0aGF0IHdlIGNhbiBoaWphY2sgaXQgdG8gZmx1c2ggdGhlIGxhc3QgcGFydFxuICAvLyBhbmQgdGhlbiBjb21wbGV0ZSB0aGUgbXVsdGlwYXJ0IHVwbG9hZFxuICB2YXIgX29yaWdpbmFsRW5kID0gd3JpdGVTdHJlYW0uZW5kO1xuICB3cml0ZVN0cmVhbS5lbmQgPSBmdW5jdGlvbiAoY2h1bmssIGVuY29kaW5nLCBjYWxsYmFjaykge1xuICAgIC8vIENhbGwgdGhlIHN1cGVyXG4gICAgX29yaWdpbmFsRW5kLmNhbGwodGhpcywgY2h1bmssIGVuY29kaW5nLCBmdW5jdGlvbiAoKSB7XG4gICAgICAvLyBNYWtlIHN1cmUgd2Ugb25seSBydW4gd2hlbiB0aGUgczMgdXBsb2FkIGlzIHJlYWR5XG4gICAgICBydW5XaGVuUmVhZHkoZnVuY3Rpb24gKCkgeyBmbHVzaENodW5rKGNhbGxiYWNrLCB0cnVlKTsgfSk7XG4gICAgfSk7XG4gIH07XG5cbiAgd3JpdGVTdHJlYW0ub24oJ2Vycm9yJywgZnVuY3Rpb24gKCkge1xuICAgIGlmIChtdWx0aXBhcnRVcGxvYWRJRCkge1xuICAgICAgaWYgKEZTLmRlYnVnKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKCdTQSBTMyAtIEVSUk9SISEnKTtcbiAgICAgIH1cbiAgICAgIHZhciBhYm9ydE11bHRpcGFydFVwbG9hZFJlcSA9IHNlbGYuYWJvcnRNdWx0aXBhcnRVcGxvYWQoe1xuICAgICAgICBCdWNrZXQ6IHBhcmFtcy5CdWNrZXQsXG4gICAgICAgIEtleTogcGFyYW1zLktleSxcbiAgICAgICAgVXBsb2FkSWQ6IG11bHRpcGFydFVwbG9hZElEXG4gICAgICB9KTtcblxuICAgICAgYWJvcnRNdWx0aXBhcnRVcGxvYWRSZXEub24oJ2J1aWxkJywgZnVuY3Rpb24gKCkge1xuICAgICAgICBhYm9ydE11bHRpcGFydFVwbG9hZFJlcS5odHRwUmVxdWVzdC5oZWFkZXJzWydhcGlrZXknXSA9IFN0ZWVkb3NBcGlLZXk7XG4gICAgICB9KTtcbiAgICAgIGFib3J0TXVsdGlwYXJ0VXBsb2FkUmVxLnNlbmQoZnVuY3Rpb24gKGVycikge1xuICAgICAgICBpZiAoZXJyKSB7XG4gICAgICAgICAgY29uc29sZS5lcnJvcignU0EgUzMgLSBDb3VsZCBub3QgYWJvcnQgbXVsdGlwYXJ0IHVwbG9hZCcsIGVycilcbiAgICAgICAgfVxuICAgICAgfSk7XG5cbiAgICB9XG4gIH0pO1xuXG4gIHZhciBmbHVzaENodW5rID0gZnVuY3Rpb24gKGNhbGxiYWNrLCBsYXN0Q2h1bmspIHtcbiAgICBpZiAobXVsdGlwYXJ0VXBsb2FkSUQgPT09IG51bGwpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignSW50ZXJuYWwgZXJyb3IgbXVsdGlwYXJ0VXBsb2FkSUQgaXMgbnVsbCcpO1xuICAgIH1cbiAgICAvLyBHZXQgdGhlIGNodW5rIGRhdGFcbiAgICB2YXIgdXBsb2FkaW5nQ2h1bmsgPSBCdWZmZXIoY3VycmVudENodW5rLmxlbmd0aCk7XG4gICAgY3VycmVudENodW5rLmNvcHkodXBsb2FkaW5nQ2h1bmspO1xuXG5cbiAgICAvLyBTdG9yZSB0aGUgY3VycmVudCBwYXJ0IG51bWJlciBhbmQgdGhlbiBpbmNyZWFzZSB0aGUgY291bnRlclxuICAgIHZhciBsb2NhbENodW5rTnVtYmVyID0gcGFydE51bWJlcisrO1xuXG4gICAgLy8gV2UgYWRkIHRoZSBzaXplIG9mIGRhdGFcbiAgICByZWNlaXZlZFNpemUgKz0gdXBsb2FkaW5nQ2h1bmsubGVuZ3RoO1xuICAgIC8vIGNvbnNvbGUubG9nKCdtdWx0aXBhcnRVcGxvYWRJRDogJywgbXVsdGlwYXJ0VXBsb2FkSUQpO1xuICAgIC8vIFVwbG9hZCB0aGUgcGFydFxuICAgIHZhciB1cGxvYWRQYXJ0UmVxID0gc2VsZi51cGxvYWRQYXJ0KHtcbiAgICAgIEJvZHk6IHVwbG9hZGluZ0NodW5rLFxuICAgICAgQnVja2V0OiBwYXJhbXMuQnVja2V0LFxuICAgICAgS2V5OiBwYXJhbXMuS2V5LFxuICAgICAgVXBsb2FkSWQ6IG11bHRpcGFydFVwbG9hZElELFxuICAgICAgUGFydE51bWJlcjogbG9jYWxDaHVua051bWJlclxuICAgIH0pO1xuXG4gICAgdXBsb2FkUGFydFJlcS5vbignYnVpbGQnLCBmdW5jdGlvbiAoKSB7XG4gICAgICB1cGxvYWRQYXJ0UmVxLmh0dHBSZXF1ZXN0LmhlYWRlcnNbJ2FwaWtleSddID0gU3RlZWRvc0FwaUtleTtcbiAgICB9KTtcbiAgICB1cGxvYWRQYXJ0UmVxLnNlbmQoZnVuY3Rpb24gKGVyciwgcmVzdWx0KSB7XG4gICAgICAvLyBDYWxsIHRoZSBuZXh0IGRhdGFcbiAgICAgIGlmICh0eXBlb2YgY2FsbGJhY2sgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgY2FsbGJhY2soKTtcbiAgICAgIH1cblxuICAgICAgaWYgKGVycikge1xuICAgICAgICB3cml0ZVN0cmVhbS5lbWl0KCdlcnJvcicsIGVycik7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICAvLyBJbmNyZWFzZSB0aGUgdXBsb2FkIHNpemVcbiAgICAgICAgdXBsb2FkZWRTaXplICs9IHVwbG9hZGluZ0NodW5rLmxlbmd0aDtcbiAgICAgICAgcGFydHNbbG9jYWxDaHVua051bWJlciAtIDFdID0ge1xuICAgICAgICAgIEVUYWc6IHJlc3VsdC5FVGFnLFxuICAgICAgICAgIFBhcnROdW1iZXI6IGxvY2FsQ2h1bmtOdW1iZXJcbiAgICAgICAgfTtcblxuICAgICAgICAvLyBYWFg6IGV2ZW50IGZvciBkZWJ1Z2dpbmdcbiAgICAgICAgd3JpdGVTdHJlYW0uZW1pdCgnY2h1bmsnLCB7XG4gICAgICAgICAgRVRhZzogcmVzdWx0LkVUYWcsXG4gICAgICAgICAgUGFydE51bWJlcjogbG9jYWxDaHVua051bWJlcixcbiAgICAgICAgICByZWNlaXZlZFNpemU6IHJlY2VpdmVkU2l6ZSxcbiAgICAgICAgICB1cGxvYWRlZFNpemU6IHVwbG9hZGVkU2l6ZVxuICAgICAgICB9KTtcblxuICAgICAgICAvLyBUaGUgaW5jb21pbmcgc3RyZWFtIGhhcyBmaW5pc2hlZCBnaXZpbmcgdXMgYWxsIGRhdGEgYW5kIHdlIGhhdmVcbiAgICAgICAgLy8gZmluaXNoZWQgdXBsb2FkaW5nIGFsbCB0aGF0IGRhdGEgdG8gUzMuIFNvIHRlbGwgUzMgdG8gYXNzZW1ibGUgdGhvc2VcbiAgICAgICAgLy8gcGFydHMgd2UgdXBsb2FkZWQgaW50byB0aGUgZmluYWwgcHJvZHVjdC5cbiAgICAgICAgaWYgKHdyaXRlU3RyZWFtLl93cml0YWJsZVN0YXRlLmVuZGVkID09PSB0cnVlICYmXG4gICAgICAgICAgdXBsb2FkZWRTaXplID09PSByZWNlaXZlZFNpemUgJiYgbGFzdENodW5rKSB7XG4gICAgICAgICAgLy8gQ29tcGxldGUgdGhlIHVwbG9hZFxuICAgICAgICAgIHZhciBjb21wbGV0ZU11bHRpcGFydFVwbG9hZFJlcSA9IHNlbGYuY29tcGxldGVNdWx0aXBhcnRVcGxvYWQoe1xuICAgICAgICAgICAgQnVja2V0OiBwYXJhbXMuQnVja2V0LFxuICAgICAgICAgICAgS2V5OiBwYXJhbXMuS2V5LFxuICAgICAgICAgICAgVXBsb2FkSWQ6IG11bHRpcGFydFVwbG9hZElELFxuICAgICAgICAgICAgTXVsdGlwYXJ0VXBsb2FkOiB7XG4gICAgICAgICAgICAgIFBhcnRzOiBwYXJ0c1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgY29tcGxldGVNdWx0aXBhcnRVcGxvYWRSZXEub24oJ2J1aWxkJywgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgY29tcGxldGVNdWx0aXBhcnRVcGxvYWRSZXEuaHR0cFJlcXVlc3QuaGVhZGVyc1snYXBpa2V5J10gPSBTdGVlZG9zQXBpS2V5O1xuICAgICAgICAgIH0pO1xuICAgICAgICAgIGNvbXBsZXRlTXVsdGlwYXJ0VXBsb2FkUmVxLnNlbmQoZnVuY3Rpb24gKGVyciwgcmVzdWx0KSB7XG4gICAgICAgICAgICBpZiAoZXJyKSB7XG4gICAgICAgICAgICAgIHdyaXRlU3RyZWFtLmVtaXQoJ2Vycm9yJywgZXJyKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIC8vIEVtaXQgdGhlIGNmcyBlbmQgZXZlbnQgZm9yIHVwbG9hZHNcbiAgICAgICAgICAgICAgaWYgKEZTLmRlYnVnKSB7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ1NBIFMzIC0gRE9ORSEhJyk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgd3JpdGVTdHJlYW0uZW1pdCgnc3RvcmVkJywge1xuICAgICAgICAgICAgICAgIGZpbGVLZXk6IGZpbGVLZXksXG4gICAgICAgICAgICAgICAgc2l6ZTogdXBsb2FkZWRTaXplLFxuICAgICAgICAgICAgICAgIHN0b3JlZEF0OiBuZXcgRGF0ZSgpXG4gICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgfSk7XG5cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0pO1xuXG4gICAgLy8gUmVzZXQgdGhlIGN1cnJlbnQgYnVmZmVyXG4gICAgY3VycmVudENodW5rID0gQnVmZmVyKDApO1xuICB9O1xuXG4gIC8vVXNlIHRoZSBTMyBjbGllbnQgdG8gaW5pdGlhbGl6ZSBhIG11bHRpcGFydCB1cGxvYWQgdG8gUzMuXG4gIHZhciBjcmVhdGVNdWx0aXBhcnRVcGxvYWRSZXEgPSBzZWxmLmNyZWF0ZU11bHRpcGFydFVwbG9hZChwYXJhbXMpO1xuICBjcmVhdGVNdWx0aXBhcnRVcGxvYWRSZXEub24oJ2J1aWxkJywgZnVuY3Rpb24gKCkge1xuICAgIGNyZWF0ZU11bHRpcGFydFVwbG9hZFJlcS5odHRwUmVxdWVzdC5oZWFkZXJzWydhcGlrZXknXSA9IFN0ZWVkb3NBcGlLZXk7XG4gIH0pO1xuICBjcmVhdGVNdWx0aXBhcnRVcGxvYWRSZXEuc2VuZChmdW5jdGlvbiAoZXJyLCBkYXRhKSB7XG4gICAgaWYgKGVycikge1xuICAgICAgLy8gRW1pdCB0aGUgZXJyb3JcbiAgICAgIHdyaXRlU3RyZWFtLmVtaXQoJ2Vycm9yJywgZXJyKTtcbiAgICB9IGVsc2Uge1xuICAgICAgLy8gU2V0IHRoZSB1cGxvYWQgaWRcbiAgICAgIC8vIGNvbnNvbGUubG9nKCdkYXRhLlVwbG9hZElkOiAnLCBkYXRhLlVwbG9hZElkKTtcbiAgICAgIG11bHRpcGFydFVwbG9hZElEID0gZGF0YS5VcGxvYWRJZDtcblxuICAgICAgLy8gQ2FsbCB3YWl0aW5nIGNhbGxiYWNrXG4gICAgICBpZiAodHlwZW9mIHdhaXRpbmdDYWxsYmFjayA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAvLyBXZSBjYWxsIHRoZSB3YWl0aW5nIGNhbGxiYWNrIGlmIGFueSBub3cgc2luY2Ugd2UgZXN0YWJsaXNoZWQgYVxuICAgICAgICAvLyBjb25uZWN0aW9uIHRvIHRoZSBzM1xuICAgICAgICB3YWl0aW5nQ2FsbGJhY2soKTtcbiAgICAgIH1cblxuICAgIH1cbiAgfSk7XG5cbiAgLy8gV2UgcmV0dXJuIHRoZSB3cml0ZSBzdHJlYW1cbiAgcmV0dXJuIHdyaXRlU3RyZWFtO1xufTtcbiJdfQ==
