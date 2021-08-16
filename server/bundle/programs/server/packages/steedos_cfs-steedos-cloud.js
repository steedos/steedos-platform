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

  AWS = require('aws-sdk');
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
if (!AWS) return;

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
if (!AWS) return;

var Writable = require('stream').Writable; // This is based on the code from
// https://github.com/nathanpeck/s3-upload-stream/blob/master/lib/s3-upload-stream.js
// But much is rewritten and adapted to cfs


AWS.S3.prototype.createReadStream = function (params, options, SteedosApiKey) {
  // Simple wrapper
  // return this.getObject(params).createReadStream();
  var getObjectReq = this.getObject(params);
  getObjectReq.on('build', function () {
    getObjectReq.httpRequest.headers['apikey'] = SteedosApiKey;
  });
  return getObjectReq.createReadStream();
}; // Extend the AWS.S3 API


AWS.S3.prototype.createWriteStream = function (params, options, SteedosApiKey) {
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvczpjZnMtc3RlZWRvcy1jbG91ZC9jaGVja05wbS5qcyIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvczpjZnMtc3RlZWRvcy1jbG91ZC9zMy5zZXJ2ZXIuanMiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3M6Y2ZzLXN0ZWVkb3MtY2xvdWQvczMudXBsb2FkLnN0cmVhbTIuanMiXSwibmFtZXMiOlsiY2hlY2tOcG1WZXJzaW9ucyIsIm1vZHVsZSIsImxpbmsiLCJ2IiwiZnMiLCJyZXF1aXJlIiwicGF0aCIsIk1ldGVvciIsInNldHRpbmdzIiwiY2ZzIiwic3RlZWRvc0Nsb3VkIiwiQVdTIiwiX29iamVjdFNwcmVhZCIsImRlZmF1bHQiLCJ2YWxpZFMzU2VydmljZVBhcmFtS2V5cyIsInZhbGlkUzNQdXRQYXJhbUtleXMiLCJGUyIsIlN0b3JlIiwiU1RFRURPU0NMT1VEIiwibmFtZSIsIm9wdHMiLCJzZWxmIiwiRXJyb3IiLCJvcHRpb25zIiwiczNGb3JjZVBhdGhTdHlsZSIsImZvbGRlciIsImxlbmd0aCIsInNsaWNlIiwic3RlZWRvc0J1Y2tldCIsImJ1Y2tldCIsImpvaW4iLCJkZWZhdWx0QWNsIiwiQUNMIiwiU3RlZWRvc0FwaUtleSIsInNlY3JldEFjY2Vzc0tleSIsInNlcnZpY2VQYXJhbXMiLCJVdGlsaXR5IiwiZXh0ZW5kIiwiQnVja2V0IiwicmVnaW9uIiwiYWNjZXNzS2V5SWQiLCJTMyIsIlN0b3JhZ2VBZGFwdGVyIiwidHlwZU5hbWUiLCJmaWxlS2V5IiwiZmlsZU9iaiIsImluZm8iLCJfZ2V0SW5mbyIsImtleSIsImZpbGVuYW1lIiwiZmlsZW5hbWVJblN0b3JlIiwic3RvcmUiLCJjb2xsZWN0aW9uTmFtZSIsIl9pZCIsImNyZWF0ZVJlYWRTdHJlYW0iLCJLZXkiLCJjcmVhdGVXcml0ZVN0cmVhbSIsImNvbnRlbnRUeXBlIiwiQ29udGVudFR5cGUiLCJhbGlhc2VzIiwibWV0YWRhdGEiLCJyZW1vdmUiLCJjYWxsYmFjayIsImRlbGV0ZU9iamVjdFJlcSIsImRlbGV0ZU9iamVjdCIsIm9uIiwiaHR0cFJlcXVlc3QiLCJoZWFkZXJzIiwic2VuZCIsImVycm9yIiwid2F0Y2giLCJXcml0YWJsZSIsInByb3RvdHlwZSIsInBhcmFtcyIsImdldE9iamVjdFJlcSIsImdldE9iamVjdCIsIndyaXRlU3RyZWFtIiwiaGlnaFdhdGVyTWFyayIsInBhcnROdW1iZXIiLCJwYXJ0cyIsInJlY2VpdmVkU2l6ZSIsInVwbG9hZGVkU2l6ZSIsImN1cnJlbnRDaHVuayIsIkJ1ZmZlciIsIm1heENodW5rU2l6ZSIsIm11bHRpcGFydFVwbG9hZElEIiwid2FpdGluZ0NhbGxiYWNrIiwicnVuV2hlblJlYWR5IiwiX3dyaXRlIiwiY2h1bmsiLCJlbmMiLCJuZXh0IiwiY29uY2F0IiwiZmx1c2hDaHVuayIsIl9vcmlnaW5hbEVuZCIsImVuZCIsImVuY29kaW5nIiwiY2FsbCIsImRlYnVnIiwiY29uc29sZSIsImxvZyIsImFib3J0TXVsdGlwYXJ0VXBsb2FkUmVxIiwiYWJvcnRNdWx0aXBhcnRVcGxvYWQiLCJVcGxvYWRJZCIsImVyciIsImxhc3RDaHVuayIsInVwbG9hZGluZ0NodW5rIiwiY29weSIsImxvY2FsQ2h1bmtOdW1iZXIiLCJ1cGxvYWRQYXJ0UmVxIiwidXBsb2FkUGFydCIsIkJvZHkiLCJQYXJ0TnVtYmVyIiwicmVzdWx0IiwiZW1pdCIsIkVUYWciLCJfd3JpdGFibGVTdGF0ZSIsImVuZGVkIiwiY29tcGxldGVNdWx0aXBhcnRVcGxvYWRSZXEiLCJjb21wbGV0ZU11bHRpcGFydFVwbG9hZCIsIk11bHRpcGFydFVwbG9hZCIsIlBhcnRzIiwic2l6ZSIsInN0b3JlZEF0IiwiRGF0ZSIsImNyZWF0ZU11bHRpcGFydFVwbG9hZFJlcSIsImNyZWF0ZU11bHRpcGFydFVwbG9hZCIsImRhdGEiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSxJQUFJQSxn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L3BhY2thZ2VzL3N0ZWVkb3NfY2ZzLXN0ZWVkb3MtY2xvdWQuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge1xuICBjaGVja05wbVZlcnNpb25zXG59IGZyb20gJ21ldGVvci90bWVhc2RheTpjaGVjay1ucG0tdmVyc2lvbnMnO1xuXG5jb25zdCBmcyA9IHJlcXVpcmUoJ2ZzJyk7XG5jb25zdCBwYXRoID0gcmVxdWlyZSgncGF0aCcpXG5cbmlmIChNZXRlb3Iuc2V0dGluZ3MgJiYgTWV0ZW9yLnNldHRpbmdzLmNmcyAmJiBNZXRlb3Iuc2V0dGluZ3MuY2ZzLnN0ZWVkb3NDbG91ZCkge1xuICBjaGVja05wbVZlcnNpb25zKHtcbiAgICAnYXdzLXNkayc6IFwiXjIuMC4yM1wiXG4gIH0sICdzdGVlZG9zOmNmcy1zdGVlZG9zLWNsb3VkJyk7XG5cbiAgLy8gLy8g5L+u5pS5czMtMjAwNi0wMy0wMS5taW4uanNvbiDlsIYgU3RlZWRvc0FwaUtleea3u+WKoOi/m21lbWJlcnPnlKjkuo7or7fmsYLml7Zhd3Mtc2Rr5Y+R6YCB5q2kaGVhZGVyXG4gIC8vIHZhciBiYXNlID0gcHJvY2Vzcy5jd2QoKTtcbiAgLy8gY29uc29sZS5sb2coJ3Byb2Nlc3MuY3dkKCk6ICcsIHByb2Nlc3MuY3dkKCkpO1xuICAvLyBpZiAocHJvY2Vzcy5lbnYuQ1JFQVRPUl9OT0RFX0VOViA9PSAnZGV2ZWxvcG1lbnQnKSB7XG4gIC8vICAgYmFzZSA9IHBhdGgucmVzb2x2ZSgnLicpLnNwbGl0KCcubWV0ZW9yJylbMF07XG4gIC8vIH1cbiAgLy8gY29uc29sZS5sb2coJ2Jhc2U6ICcsIGJhc2UpO1xuICAvLyB2YXIgc2RrUGF0aCA9IHBhdGguam9pbihiYXNlLCByZXF1aXJlLnJlc29sdmUoJ2F3cy1zZGsvcGFja2FnZS5qc29uJywge1xuICAvLyAgIHBhdGhzOiBbYmFzZV1cbiAgLy8gfSkpO1xuICAvLyBjb25zb2xlLmxvZygnc2RrUGF0aDogJywgc2RrUGF0aCk7XG4gIC8vIHZhciBzZGtWZXJzaW9uTWluSnNvblBhdGggPSBwYXRoLmpvaW4oc2RrUGF0aCwgJy4uL2FwaXMvczMtMjAwNi0wMy0wMS5taW4uanNvbicpO1xuICAvLyBjb25zb2xlLmxvZygnc2RrVmVyc2lvbk1pbkpzb25QYXRoOiAnLCBzZGtWZXJzaW9uTWluSnNvblBhdGgpO1xuICAvLyB2YXIgbWluSnNvbiA9IEpTT04ucGFyc2UoZnMucmVhZEZpbGVTeW5jKHNka1ZlcnNpb25NaW5Kc29uUGF0aCkpO1xuICAvLyBjb25zb2xlLmxvZyhtaW5Kc29uKTtcbiAgLy8gdmFyIG9wZXJhdGlvbnMgPSBtaW5Kc29uLm9wZXJhdGlvbnM7XG4gIC8vIGZvciAoY29uc3Qga2V5IGluIG9wZXJhdGlvbnMpIHtcbiAgLy8gICBpZiAoT2JqZWN0Lmhhc093blByb3BlcnR5LmNhbGwob3BlcmF0aW9ucywga2V5KSkge1xuICAvLyAgICAgY29uc3QgZWxlbWVudCA9IG9wZXJhdGlvbnNba2V5XTtcbiAgLy8gICAgIGlmIChlbGVtZW50LmlucHV0KSB7XG4gIC8vICAgICAgIGVsZW1lbnQuaW5wdXQubWVtYmVycy5TdGVlZG9zQXBpS2V5ID0geyBcImxvY2F0aW9uXCI6IFwiaGVhZGVyXCIsIFwibG9jYXRpb25OYW1lXCI6IFwiYXBpa2V5XCIgfVxuICAvLyAgICAgfVxuICAvLyAgIH1cbiAgLy8gfVxuXG4gIC8vIGZzLndyaXRlRmlsZVN5bmMoc2RrVmVyc2lvbk1pbkpzb25QYXRoLCBKU09OLnN0cmluZ2lmeShtaW5Kc29uKSk7IFxuXG4gIEFXUyA9IHJlcXVpcmUoJ2F3cy1zZGsnKTtcbn1cbiIsImlmICghQVdTKVxuICByZXR1cm47XG5cbmNvbnN0IHBhdGggPSByZXF1aXJlKCdwYXRoJyk7XG5cbi8vIFdlIHVzZSB0aGUgb2ZmaWNpYWwgYXdzIHNka1xuXG5cbnZhciB2YWxpZFMzU2VydmljZVBhcmFtS2V5cyA9IFtcbiAgJ2VuZHBvaW50JyxcbiAgJ2FjY2Vzc0tleUlkJyxcbiAgJ3NlY3JldEFjY2Vzc0tleScsXG4gICdzZXNzaW9uVG9rZW4nLFxuICAnY3JlZGVudGlhbHMnLFxuICAnY3JlZGVudGlhbFByb3ZpZGVyJyxcbiAgJ3JlZ2lvbicsXG4gICdtYXhSZXRyaWVzJyxcbiAgJ21heFJlZGlyZWN0cycsXG4gICdzc2xFbmFibGVkJyxcbiAgJ3BhcmFtVmFsaWRhdGlvbicsXG4gICdjb21wdXRlQ2hlY2tzdW1zJyxcbiAgJ3MzRm9yY2VQYXRoU3R5bGUnLFxuICAnaHR0cE9wdGlvbnMnLFxuICAnYXBpVmVyc2lvbicsXG4gICdhcGlWZXJzaW9ucycsXG4gICdsb2dnZXInLFxuICAnc2lnbmF0dXJlVmVyc2lvbidcbl07XG52YXIgdmFsaWRTM1B1dFBhcmFtS2V5cyA9IFtcbiAgJ0FDTCcsXG4gICdCb2R5JyxcbiAgJ0J1Y2tldCcsXG4gICdDYWNoZUNvbnRyb2wnLFxuICAnQ29udGVudERpc3Bvc2l0aW9uJyxcbiAgJ0NvbnRlbnRFbmNvZGluZycsXG4gICdDb250ZW50TGFuZ3VhZ2UnLFxuICAnQ29udGVudExlbmd0aCcsXG4gICdDb250ZW50TUQ1JyxcbiAgJ0NvbnRlbnRUeXBlJyxcbiAgJ0V4cGlyZXMnLFxuICAnR3JhbnRGdWxsQ29udHJvbCcsXG4gICdHcmFudFJlYWQnLFxuICAnR3JhbnRSZWFkQUNQJyxcbiAgJ0dyYW50V3JpdGVBQ1AnLFxuICAnS2V5JyxcbiAgJ01ldGFkYXRhJyxcbiAgJ1NlcnZlclNpZGVFbmNyeXB0aW9uJyxcbiAgJ1N0b3JhZ2VDbGFzcycsXG4gICdXZWJzaXRlUmVkaXJlY3RMb2NhdGlvbidcbl07XG5cbi8qKlxuICogQHB1YmxpY1xuICogQGNvbnN0cnVjdG9yXG4gKiBAcGFyYW0ge1N0cmluZ30gbmFtZSAtIFRoZSBzdG9yZSBuYW1lXG4gKiBAcGFyYW0ge09iamVjdH0gb3B0aW9uc1xuICogQHBhcmFtIHtTdHJpbmd9IG9wdGlvbnMucmVnaW9uIC0gQnVja2V0IHJlZ2lvblxuICogQHBhcmFtIHtTdHJpbmd9IG9wdGlvbnMuc3RlZWRvc0J1Y2tldCAtIEJ1Y2tldCBuYW1lXG4gKiBAcGFyYW0ge1N0cmluZ30gW29wdGlvbnMuYWNjZXNzS2V5SWRdIC0gQVdTIElBTSBrZXk7IHJlcXVpcmVkIGlmIG5vdCBzZXQgaW4gZW52aXJvbm1lbnQgdmFyaWFibGVzXG4gKiBAcGFyYW0ge1N0cmluZ30gW29wdGlvbnMuc2VjcmV0QWNjZXNzS2V5XSAtIEFXUyBJQU0gc2VjcmV0OyByZXF1aXJlZCBpZiBub3Qgc2V0IGluIGVudmlyb25tZW50IHZhcmlhYmxlc1xuICogQHBhcmFtIHtTdHJpbmd9IFtvcHRpb25zLkFDTD0ncHJpdmF0ZSddIC0gQUNMIGZvciBvYmplY3RzIHdoZW4gcHV0dGluZ1xuICogQHBhcmFtIHtTdHJpbmd9IFtvcHRpb25zLmZvbGRlcj0nLyddIC0gV2hpY2ggZm9sZGVyIChrZXkgcHJlZml4KSBpbiB0aGUgYnVja2V0IHRvIHVzZVxuICogQHBhcmFtIHtGdW5jdGlvbn0gW29wdGlvbnMuYmVmb3JlU2F2ZV0gLSBGdW5jdGlvbiB0byBydW4gYmVmb3JlIHNhdmluZyBhIGZpbGUgZnJvbSB0aGUgc2VydmVyLiBUaGUgY29udGV4dCBvZiB0aGUgZnVuY3Rpb24gd2lsbCBiZSB0aGUgYEZTLkZpbGVgIGluc3RhbmNlIHdlJ3JlIHNhdmluZy4gVGhlIGZ1bmN0aW9uIG1heSBhbHRlciBpdHMgcHJvcGVydGllcy5cbiAqIEBwYXJhbSB7TnVtYmVyfSBbb3B0aW9ucy5tYXhUcmllcz01XSAtIE1heCB0aW1lcyB0byBhdHRlbXB0IHNhdmluZyBhIGZpbGVcbiAqIEByZXR1cm5zIHtGUy5TdG9yYWdlQWRhcHRlcn0gQW4gaW5zdGFuY2Ugb2YgRlMuU3RvcmFnZUFkYXB0ZXIuXG4gKlxuICogQ3JlYXRlcyBhbiBTMyBzdG9yZSBpbnN0YW5jZSBvbiB0aGUgc2VydmVyLiBJbmhlcml0cyBmcm9tIEZTLlN0b3JhZ2VBZGFwdGVyXG4gKiB0eXBlLlxuICovXG5GUy5TdG9yZS5TVEVFRE9TQ0xPVUQgPSBmdW5jdGlvbiAobmFtZSwgb3B0cykge1xuICB2YXIgc2VsZiA9IHRoaXM7XG4gIGlmICghKHNlbGYgaW5zdGFuY2VvZiBGUy5TdG9yZS5TVEVFRE9TQ0xPVUQpKVxuICAgIHRocm93IG5ldyBFcnJvcignRlMuU3RvcmUuU1RFRURPU0NMT1VEIG1pc3Npbmcga2V5d29yZCBcIm5ld1wiJyk7XG5cbiAgb3B0cyA9IG9wdHMgfHwge307XG4gIHZhciBvcHRpb25zID0ge1xuICAgIC4uLm9wdHNcbiAgfVxuICBvcHRpb25zLnMzRm9yY2VQYXRoU3R5bGUgPSB0cnVlO1xuXG4gIC8vIERldGVybWluZSB3aGljaCBmb2xkZXIgKGtleSBwcmVmaXgpIGluIHRoZSBidWNrZXQgdG8gdXNlXG4gIHZhciBmb2xkZXIgPSBvcHRpb25zLmZvbGRlcjtcbiAgaWYgKHR5cGVvZiBmb2xkZXIgPT09IFwic3RyaW5nXCIgJiYgZm9sZGVyLmxlbmd0aCkge1xuICAgIGlmIChmb2xkZXIuc2xpY2UoMCwgMSkgPT09IFwiL1wiKSB7XG4gICAgICBmb2xkZXIgPSBmb2xkZXIuc2xpY2UoMSk7XG4gICAgfVxuICAgIGlmIChmb2xkZXIuc2xpY2UoLTEpICE9PSBcIi9cIikge1xuICAgICAgZm9sZGVyICs9IFwiL1wiO1xuICAgIH1cbiAgfSBlbHNlIHtcbiAgICBmb2xkZXIgPSBcIlwiO1xuICB9XG5cbiAgdmFyIHN0ZWVkb3NCdWNrZXQgPSBvcHRpb25zLnN0ZWVkb3NCdWNrZXQgfHwgJ3MzLWtvbmctc2VydmllJztcbiAgdmFyIGJ1Y2tldCA9IG9wdGlvbnMuYnVja2V0O1xuICBpZiAoIWJ1Y2tldClcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ0ZTLlN0b3JlLlNURUVET1NDTE9VRCB5b3UgbXVzdCBzcGVjaWZ5IHRoZSBcImJ1Y2tldFwiIG9wdGlvbicpO1xuXG4gIC8vIOaLvOaOpWZvbGRlclxuICBvcHRpb25zLmZvbGRlciA9IHBhdGguam9pbihidWNrZXQsIGZvbGRlciwgJy8nKTtcbiAgZm9sZGVyID0gb3B0aW9ucy5mb2xkZXI7XG4gIGRlbGV0ZSBvcHRpb25zLmJ1Y2tldDtcblxuICB2YXIgZGVmYXVsdEFjbCA9IG9wdGlvbnMuQUNMIHx8ICdwcml2YXRlJztcblxuICB2YXIgU3RlZWRvc0FwaUtleSA9IG9wdGlvbnMuc2VjcmV0QWNjZXNzS2V5O1xuXG4gIC8vIFJlbW92ZSBzZXJ2aWNlUGFyYW1zIGZyb20gU0Egb3B0aW9uc1xuICAvLyBvcHRpb25zID0gXy5vbWl0KG9wdGlvbnMsIHZhbGlkUzNTZXJ2aWNlUGFyYW1LZXlzKTtcblxuICB2YXIgc2VydmljZVBhcmFtcyA9IEZTLlV0aWxpdHkuZXh0ZW5kKHtcbiAgICBCdWNrZXQ6IHN0ZWVkb3NCdWNrZXQsXG4gICAgcmVnaW9uOiBudWxsLCAvL3JlcXVpcmVkXG4gICAgYWNjZXNzS2V5SWQ6IG51bGwsIC8vcmVxdWlyZWRcbiAgICBzZWNyZXRBY2Nlc3NLZXk6IG51bGwsIC8vcmVxdWlyZWRcbiAgICBBQ0w6IGRlZmF1bHRBY2xcbiAgfSwgb3B0aW9ucyk7XG5cbiAgLy8gV2hpdGVsaXN0IHNlcnZpY2VQYXJhbXMsIGVsc2UgYXdzLXNkayB0aHJvd3MgYW4gZXJyb3JcbiAgLy8gWFhYOiBJJ3ZlIGNvbW1lbnRlZCB0aGlzIGF0IHRoZSBtb21lbnQuLi4gSXQgc3RvcHBlZCB0aGluZ3MgZnJvbSB3b3JraW5nXG4gIC8vIHdlIGhhdmUgdG8gY2hlY2sgdXAgb24gdGhpc1xuICAvLyBzZXJ2aWNlUGFyYW1zID0gXy5waWNrKHNlcnZpY2VQYXJhbXMsIHZhbGlkUzNTZXJ2aWNlUGFyYW1LZXlzKTtcblxuICAvLyBDcmVhdGUgUzMgc2VydmljZVxuICB2YXIgUzMgPSBuZXcgQVdTLlMzKHNlcnZpY2VQYXJhbXMpO1xuXG4gIHJldHVybiBuZXcgRlMuU3RvcmFnZUFkYXB0ZXIobmFtZSwgb3B0aW9ucywge1xuICAgIHR5cGVOYW1lOiAnc3RvcmFnZS5zMycsXG4gICAgZmlsZUtleTogZnVuY3Rpb24gKGZpbGVPYmopIHtcbiAgICAgIC8vIExvb2t1cCB0aGUgY29weVxuICAgICAgdmFyIGluZm8gPSBmaWxlT2JqICYmIGZpbGVPYmouX2dldEluZm8obmFtZSk7XG4gICAgICAvLyBJZiB0aGUgc3RvcmUgYW5kIGtleSBpcyBmb3VuZCByZXR1cm4gdGhlIGtleVxuICAgICAgaWYgKGluZm8gJiYgaW5mby5rZXkpIHJldHVybiBpbmZvLmtleTtcblxuICAgICAgdmFyIGZpbGVuYW1lID0gZmlsZU9iai5uYW1lKCk7XG4gICAgICB2YXIgZmlsZW5hbWVJblN0b3JlID0gZmlsZU9iai5uYW1lKHtcbiAgICAgICAgc3RvcmU6IG5hbWVcbiAgICAgIH0pO1xuXG4gICAgICAvLyBJZiBubyBzdG9yZSBrZXkgZm91bmQgd2UgcmVzb2x2ZSAvIGdlbmVyYXRlIGEga2V5XG4gICAgICByZXR1cm4gZmlsZU9iai5jb2xsZWN0aW9uTmFtZSArICcvJyArIGZpbGVPYmouY29sbGVjdGlvbk5hbWUgKyBcIi1cIiArIGZpbGVPYmouX2lkICsgJy0nICsgKGZpbGVuYW1lSW5TdG9yZSB8fCBmaWxlbmFtZSk7XG4gICAgfSxcbiAgICBjcmVhdGVSZWFkU3RyZWFtOiBmdW5jdGlvbiAoZmlsZUtleSwgb3B0aW9ucykge1xuICAgICAgLy8gY29uc29sZS5sb2coJ1MzLmNyZWF0ZVJlYWRTdHJlYW0uLi4uLi4uLi4uLjogJywgZmlsZUtleSwgb3B0aW9ucyk7XG5cbiAgICAgIHJldHVybiBTMy5jcmVhdGVSZWFkU3RyZWFtKHtcbiAgICAgICAgQnVja2V0OiBzdGVlZG9zQnVja2V0LFxuICAgICAgICBLZXk6IGZvbGRlciArIGZpbGVLZXksXG4gICAgICB9LCB7fSwgU3RlZWRvc0FwaUtleSk7XG5cbiAgICB9LFxuICAgIC8vIENvbW1lbnQgdG8gZG9jdW1lbnRhdGlvbjogU2V0IG9wdGlvbnMuQ29udGVudExlbmd0aCBvdGhlcndpc2UgdGhlXG4gICAgLy8gaW5kaXJlY3Qgc3RyZWFtIHdpbGwgYmUgdXNlZCBjcmVhdGluZyBleHRyYSBvdmVyaGVhZCBvbiB0aGUgZmlsZXN5c3RlbS5cbiAgICAvLyBBbiBlYXN5IHdheSBpZiB0aGUgZGF0YSBpcyBub3QgdHJhbnNmb3JtZWQgaXMgdG8gc2V0IHRoZVxuICAgIC8vIG9wdGlvbnMuQ29udGVudExlbmd0aCA9IGZpbGVPYmouc2l6ZSAuLi5cbiAgICBjcmVhdGVXcml0ZVN0cmVhbTogZnVuY3Rpb24gKGZpbGVLZXksIG9wdGlvbnMpIHtcbiAgICAgIG9wdGlvbnMgPSBvcHRpb25zIHx8IHt9O1xuXG4gICAgICBpZiAob3B0aW9ucy5jb250ZW50VHlwZSkge1xuICAgICAgICBvcHRpb25zLkNvbnRlbnRUeXBlID0gb3B0aW9ucy5jb250ZW50VHlwZTtcbiAgICAgIH1cblxuICAgICAgLy8gV2UgZG9udCBzdXBwb3J0IGFycmF5IG9mIGFsaWFzZXNcbiAgICAgIGRlbGV0ZSBvcHRpb25zLmFsaWFzZXM7XG4gICAgICAvLyBXZSBkb250IHN1cHBvcnQgY29udGVudFR5cGVcbiAgICAgIGRlbGV0ZSBvcHRpb25zLmNvbnRlbnRUeXBlO1xuICAgICAgLy8gV2UgZG9udCBzdXBwb3J0IG1ldGFkYXRhIHVzZSBNZXRhZGF0YT9cbiAgICAgIGRlbGV0ZSBvcHRpb25zLm1ldGFkYXRhO1xuXG4gICAgICAvLyBTZXQgb3B0aW9uc1xuICAgICAgdmFyIG9wdGlvbnMgPSBGUy5VdGlsaXR5LmV4dGVuZCh7XG4gICAgICAgIEJ1Y2tldDogc3RlZWRvc0J1Y2tldCxcbiAgICAgICAgS2V5OiBmb2xkZXIgKyBmaWxlS2V5LFxuICAgICAgICBmaWxlS2V5OiBmaWxlS2V5LFxuICAgICAgICBBQ0w6IGRlZmF1bHRBY2wsXG4gICAgICB9LCBvcHRpb25zKTtcbiAgICAgIC8vIGNvbnNvbGUubG9nKCdTMy5jcmVhdGVXcml0ZVN0cmVhbS4uLi4uLi4uLi4uOiAnLCBvcHRpb25zKTtcbiAgICAgIHJldHVybiBTMy5jcmVhdGVXcml0ZVN0cmVhbShvcHRpb25zLCB7fSwgU3RlZWRvc0FwaUtleSk7XG4gICAgfSxcbiAgICByZW1vdmU6IGZ1bmN0aW9uIChmaWxlS2V5LCBjYWxsYmFjaykge1xuICAgICAgLy8gY29uc29sZS5sb2coJ1MzLmRlbGV0ZU9iamVjdC4uLi4uLi4uLi4uOiAnLCBmaWxlS2V5KTtcblxuICAgICAgdmFyIGRlbGV0ZU9iamVjdFJlcSA9IFMzLmRlbGV0ZU9iamVjdCh7XG4gICAgICAgIEJ1Y2tldDogc3RlZWRvc0J1Y2tldCxcbiAgICAgICAgS2V5OiBmb2xkZXIgKyBmaWxlS2V5LFxuICAgICAgfSk7XG5cbiAgICAgIGRlbGV0ZU9iamVjdFJlcS5vbignYnVpbGQnLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGRlbGV0ZU9iamVjdFJlcS5odHRwUmVxdWVzdC5oZWFkZXJzWydhcGlrZXknXSA9IFN0ZWVkb3NBcGlLZXk7XG4gICAgICB9KTtcbiAgICAgIGRlbGV0ZU9iamVjdFJlcS5zZW5kKGZ1bmN0aW9uIChlcnJvcikge1xuICAgICAgICBjYWxsYmFjayhlcnJvciwgIWVycm9yKTtcbiAgICAgIH0pO1xuXG5cbiAgICAgIC8vIGNhbGxiYWNrKG51bGwsIHRydWUpO1xuICAgIH0sXG4gICAgd2F0Y2g6IGZ1bmN0aW9uICgpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihcIlMzIHN0b3JhZ2UgYWRhcHRlciBkb2VzIG5vdCBzdXBwb3J0IHRoZSBzeW5jIG9wdGlvblwiKTtcbiAgICB9XG4gIH0pO1xufTsiLCJpZiAoIUFXUylcbiAgcmV0dXJuO1xuXG52YXIgV3JpdGFibGUgPSByZXF1aXJlKCdzdHJlYW0nKS5Xcml0YWJsZTtcblxuLy8gVGhpcyBpcyBiYXNlZCBvbiB0aGUgY29kZSBmcm9tXG4vLyBodHRwczovL2dpdGh1Yi5jb20vbmF0aGFucGVjay9zMy11cGxvYWQtc3RyZWFtL2Jsb2IvbWFzdGVyL2xpYi9zMy11cGxvYWQtc3RyZWFtLmpzXG4vLyBCdXQgbXVjaCBpcyByZXdyaXR0ZW4gYW5kIGFkYXB0ZWQgdG8gY2ZzXG5cbkFXUy5TMy5wcm90b3R5cGUuY3JlYXRlUmVhZFN0cmVhbSA9IGZ1bmN0aW9uIChwYXJhbXMsIG9wdGlvbnMsIFN0ZWVkb3NBcGlLZXkpIHtcbiAgLy8gU2ltcGxlIHdyYXBwZXJcbiAgLy8gcmV0dXJuIHRoaXMuZ2V0T2JqZWN0KHBhcmFtcykuY3JlYXRlUmVhZFN0cmVhbSgpO1xuXG4gIHZhciBnZXRPYmplY3RSZXEgPSB0aGlzLmdldE9iamVjdChwYXJhbXMpO1xuICBnZXRPYmplY3RSZXEub24oJ2J1aWxkJywgZnVuY3Rpb24gKCkge1xuICAgIGdldE9iamVjdFJlcS5odHRwUmVxdWVzdC5oZWFkZXJzWydhcGlrZXknXSA9IFN0ZWVkb3NBcGlLZXk7XG4gIH0pO1xuICByZXR1cm4gZ2V0T2JqZWN0UmVxLmNyZWF0ZVJlYWRTdHJlYW0oKTtcbn07XG5cbi8vIEV4dGVuZCB0aGUgQVdTLlMzIEFQSVxuQVdTLlMzLnByb3RvdHlwZS5jcmVhdGVXcml0ZVN0cmVhbSA9IGZ1bmN0aW9uIChwYXJhbXMsIG9wdGlvbnMsIFN0ZWVkb3NBcGlLZXkpIHtcbiAgdmFyIHNlbGYgPSB0aGlzO1xuXG4gIC8vQ3JlYXRlIHRoZSB3cml0ZWFibGUgc3RyZWFtIGludGVyZmFjZS5cbiAgdmFyIHdyaXRlU3RyZWFtID0gV3JpdGFibGUoe1xuICAgIGhpZ2hXYXRlck1hcms6IDQxOTQzMDQgLy8gNCBNQlxuICB9KTtcblxuICB2YXIgcGFydE51bWJlciA9IDE7XG4gIHZhciBwYXJ0cyA9IFtdO1xuICB2YXIgcmVjZWl2ZWRTaXplID0gMDtcbiAgdmFyIHVwbG9hZGVkU2l6ZSA9IDA7XG4gIHZhciBjdXJyZW50Q2h1bmsgPSBCdWZmZXIoMCk7XG4gIHZhciBtYXhDaHVua1NpemUgPSA1MjQyODgwO1xuICB2YXIgbXVsdGlwYXJ0VXBsb2FkSUQgPSBudWxsO1xuICB2YXIgd2FpdGluZ0NhbGxiYWNrO1xuICB2YXIgZmlsZUtleSA9IHBhcmFtcyAmJiAocGFyYW1zLmZpbGVLZXkgfHwgcGFyYW1zLktleSk7XG5cbiAgLy8gQ2xlYW4gdXAgZm9yIEFXUyBzZGtcbiAgZGVsZXRlIHBhcmFtcy5maWxlS2V5O1xuXG4gIC8vIFRoaXMgc21hbGwgZnVuY3Rpb24gc3RvcHMgdGhlIHdyaXRlIHN0cmVhbSB1bnRpbCB3ZSBoYXZlIGNvbm5lY3RlZCB3aXRoXG4gIC8vIHRoZSBzMyBzZXJ2ZXJcbiAgdmFyIHJ1bldoZW5SZWFkeSA9IGZ1bmN0aW9uIChjYWxsYmFjaykge1xuICAgIC8vIElmIHdlIGRvbnQgaGF2ZSBhIHVwbG9hZCBpZCB3ZSBhcmUgbm90IHJlYWR5XG4gICAgaWYgKG11bHRpcGFydFVwbG9hZElEID09PSBudWxsKSB7XG4gICAgICAvLyBXZSBzZXQgdGhlIHdhaXRpbmcgY2FsbGJhY2tcbiAgICAgIHdhaXRpbmdDYWxsYmFjayA9IGNhbGxiYWNrO1xuICAgIH0gZWxzZSB7XG4gICAgICAvLyBObyBwcm9ibGVtIC0ganVzdCBjb250aW51ZVxuICAgICAgY2FsbGJhY2soKTtcbiAgICB9XG4gIH07XG5cbiAgLy9IYW5kbGVyIHRvIHJlY2VpdmUgZGF0YSBhbmQgdXBsb2FkIGl0IHRvIFMzLlxuICB3cml0ZVN0cmVhbS5fd3JpdGUgPSBmdW5jdGlvbiAoY2h1bmssIGVuYywgbmV4dCkge1xuICAgIGN1cnJlbnRDaHVuayA9IEJ1ZmZlci5jb25jYXQoW2N1cnJlbnRDaHVuaywgY2h1bmtdKTtcblxuICAgIC8vIElmIHRoZSBjdXJyZW50IGNodW5rIGJ1ZmZlciBpcyBnZXR0aW5nIHRvIGxhcmdlLCBvciB0aGUgc3RyZWFtIHBpcGVkIGluXG4gICAgLy8gaGFzIGVuZGVkIHRoZW4gZmx1c2ggdGhlIGNodW5rIGJ1ZmZlciBkb3duc3RyZWFtIHRvIFMzIHZpYSB0aGUgbXVsdGlwYXJ0XG4gICAgLy8gdXBsb2FkIEFQSS5cbiAgICBpZiAoY3VycmVudENodW5rLmxlbmd0aCA+IG1heENodW5rU2l6ZSkge1xuICAgICAgLy8gTWFrZSBzdXJlIHdlIG9ubHkgcnVuIHdoZW4gdGhlIHMzIHVwbG9hZCBpcyByZWFkeVxuICAgICAgcnVuV2hlblJlYWR5KGZ1bmN0aW9uICgpIHsgZmx1c2hDaHVuayhuZXh0LCBmYWxzZSk7IH0pO1xuICAgIH0gZWxzZSB7XG4gICAgICAvLyBXZSBkb250IGhhdmUgdG8gY29udGFjdCBzMyBmb3IgdGhpc1xuICAgICAgcnVuV2hlblJlYWR5KG5leHQpO1xuICAgIH1cbiAgfTtcblxuICAvLyBPdmVyd3JpdGUgdGhlIGVuZCBtZXRob2Qgc28gdGhhdCB3ZSBjYW4gaGlqYWNrIGl0IHRvIGZsdXNoIHRoZSBsYXN0IHBhcnRcbiAgLy8gYW5kIHRoZW4gY29tcGxldGUgdGhlIG11bHRpcGFydCB1cGxvYWRcbiAgdmFyIF9vcmlnaW5hbEVuZCA9IHdyaXRlU3RyZWFtLmVuZDtcbiAgd3JpdGVTdHJlYW0uZW5kID0gZnVuY3Rpb24gKGNodW5rLCBlbmNvZGluZywgY2FsbGJhY2spIHtcbiAgICAvLyBDYWxsIHRoZSBzdXBlclxuICAgIF9vcmlnaW5hbEVuZC5jYWxsKHRoaXMsIGNodW5rLCBlbmNvZGluZywgZnVuY3Rpb24gKCkge1xuICAgICAgLy8gTWFrZSBzdXJlIHdlIG9ubHkgcnVuIHdoZW4gdGhlIHMzIHVwbG9hZCBpcyByZWFkeVxuICAgICAgcnVuV2hlblJlYWR5KGZ1bmN0aW9uICgpIHsgZmx1c2hDaHVuayhjYWxsYmFjaywgdHJ1ZSk7IH0pO1xuICAgIH0pO1xuICB9O1xuXG4gIHdyaXRlU3RyZWFtLm9uKCdlcnJvcicsIGZ1bmN0aW9uICgpIHtcbiAgICBpZiAobXVsdGlwYXJ0VXBsb2FkSUQpIHtcbiAgICAgIGlmIChGUy5kZWJ1Zykge1xuICAgICAgICBjb25zb2xlLmxvZygnU0EgUzMgLSBFUlJPUiEhJyk7XG4gICAgICB9XG4gICAgICB2YXIgYWJvcnRNdWx0aXBhcnRVcGxvYWRSZXEgPSBzZWxmLmFib3J0TXVsdGlwYXJ0VXBsb2FkKHtcbiAgICAgICAgQnVja2V0OiBwYXJhbXMuQnVja2V0LFxuICAgICAgICBLZXk6IHBhcmFtcy5LZXksXG4gICAgICAgIFVwbG9hZElkOiBtdWx0aXBhcnRVcGxvYWRJRFxuICAgICAgfSk7XG5cbiAgICAgIGFib3J0TXVsdGlwYXJ0VXBsb2FkUmVxLm9uKCdidWlsZCcsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgYWJvcnRNdWx0aXBhcnRVcGxvYWRSZXEuaHR0cFJlcXVlc3QuaGVhZGVyc1snYXBpa2V5J10gPSBTdGVlZG9zQXBpS2V5O1xuICAgICAgfSk7XG4gICAgICBhYm9ydE11bHRpcGFydFVwbG9hZFJlcS5zZW5kKGZ1bmN0aW9uIChlcnIpIHtcbiAgICAgICAgaWYgKGVycikge1xuICAgICAgICAgIGNvbnNvbGUuZXJyb3IoJ1NBIFMzIC0gQ291bGQgbm90IGFib3J0IG11bHRpcGFydCB1cGxvYWQnLCBlcnIpXG4gICAgICAgIH1cbiAgICAgIH0pO1xuXG4gICAgfVxuICB9KTtcblxuICB2YXIgZmx1c2hDaHVuayA9IGZ1bmN0aW9uIChjYWxsYmFjaywgbGFzdENodW5rKSB7XG4gICAgaWYgKG11bHRpcGFydFVwbG9hZElEID09PSBudWxsKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ0ludGVybmFsIGVycm9yIG11bHRpcGFydFVwbG9hZElEIGlzIG51bGwnKTtcbiAgICB9XG4gICAgLy8gR2V0IHRoZSBjaHVuayBkYXRhXG4gICAgdmFyIHVwbG9hZGluZ0NodW5rID0gQnVmZmVyKGN1cnJlbnRDaHVuay5sZW5ndGgpO1xuICAgIGN1cnJlbnRDaHVuay5jb3B5KHVwbG9hZGluZ0NodW5rKTtcblxuXG4gICAgLy8gU3RvcmUgdGhlIGN1cnJlbnQgcGFydCBudW1iZXIgYW5kIHRoZW4gaW5jcmVhc2UgdGhlIGNvdW50ZXJcbiAgICB2YXIgbG9jYWxDaHVua051bWJlciA9IHBhcnROdW1iZXIrKztcblxuICAgIC8vIFdlIGFkZCB0aGUgc2l6ZSBvZiBkYXRhXG4gICAgcmVjZWl2ZWRTaXplICs9IHVwbG9hZGluZ0NodW5rLmxlbmd0aDtcbiAgICAvLyBjb25zb2xlLmxvZygnbXVsdGlwYXJ0VXBsb2FkSUQ6ICcsIG11bHRpcGFydFVwbG9hZElEKTtcbiAgICAvLyBVcGxvYWQgdGhlIHBhcnRcbiAgICB2YXIgdXBsb2FkUGFydFJlcSA9IHNlbGYudXBsb2FkUGFydCh7XG4gICAgICBCb2R5OiB1cGxvYWRpbmdDaHVuayxcbiAgICAgIEJ1Y2tldDogcGFyYW1zLkJ1Y2tldCxcbiAgICAgIEtleTogcGFyYW1zLktleSxcbiAgICAgIFVwbG9hZElkOiBtdWx0aXBhcnRVcGxvYWRJRCxcbiAgICAgIFBhcnROdW1iZXI6IGxvY2FsQ2h1bmtOdW1iZXJcbiAgICB9KTtcblxuICAgIHVwbG9hZFBhcnRSZXEub24oJ2J1aWxkJywgZnVuY3Rpb24gKCkge1xuICAgICAgdXBsb2FkUGFydFJlcS5odHRwUmVxdWVzdC5oZWFkZXJzWydhcGlrZXknXSA9IFN0ZWVkb3NBcGlLZXk7XG4gICAgfSk7XG4gICAgdXBsb2FkUGFydFJlcS5zZW5kKGZ1bmN0aW9uIChlcnIsIHJlc3VsdCkge1xuICAgICAgLy8gQ2FsbCB0aGUgbmV4dCBkYXRhXG4gICAgICBpZiAodHlwZW9mIGNhbGxiYWNrID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgIGNhbGxiYWNrKCk7XG4gICAgICB9XG5cbiAgICAgIGlmIChlcnIpIHtcbiAgICAgICAgd3JpdGVTdHJlYW0uZW1pdCgnZXJyb3InLCBlcnIpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgLy8gSW5jcmVhc2UgdGhlIHVwbG9hZCBzaXplXG4gICAgICAgIHVwbG9hZGVkU2l6ZSArPSB1cGxvYWRpbmdDaHVuay5sZW5ndGg7XG4gICAgICAgIHBhcnRzW2xvY2FsQ2h1bmtOdW1iZXIgLSAxXSA9IHtcbiAgICAgICAgICBFVGFnOiByZXN1bHQuRVRhZyxcbiAgICAgICAgICBQYXJ0TnVtYmVyOiBsb2NhbENodW5rTnVtYmVyXG4gICAgICAgIH07XG5cbiAgICAgICAgLy8gWFhYOiBldmVudCBmb3IgZGVidWdnaW5nXG4gICAgICAgIHdyaXRlU3RyZWFtLmVtaXQoJ2NodW5rJywge1xuICAgICAgICAgIEVUYWc6IHJlc3VsdC5FVGFnLFxuICAgICAgICAgIFBhcnROdW1iZXI6IGxvY2FsQ2h1bmtOdW1iZXIsXG4gICAgICAgICAgcmVjZWl2ZWRTaXplOiByZWNlaXZlZFNpemUsXG4gICAgICAgICAgdXBsb2FkZWRTaXplOiB1cGxvYWRlZFNpemVcbiAgICAgICAgfSk7XG5cbiAgICAgICAgLy8gVGhlIGluY29taW5nIHN0cmVhbSBoYXMgZmluaXNoZWQgZ2l2aW5nIHVzIGFsbCBkYXRhIGFuZCB3ZSBoYXZlXG4gICAgICAgIC8vIGZpbmlzaGVkIHVwbG9hZGluZyBhbGwgdGhhdCBkYXRhIHRvIFMzLiBTbyB0ZWxsIFMzIHRvIGFzc2VtYmxlIHRob3NlXG4gICAgICAgIC8vIHBhcnRzIHdlIHVwbG9hZGVkIGludG8gdGhlIGZpbmFsIHByb2R1Y3QuXG4gICAgICAgIGlmICh3cml0ZVN0cmVhbS5fd3JpdGFibGVTdGF0ZS5lbmRlZCA9PT0gdHJ1ZSAmJlxuICAgICAgICAgIHVwbG9hZGVkU2l6ZSA9PT0gcmVjZWl2ZWRTaXplICYmIGxhc3RDaHVuaykge1xuICAgICAgICAgIC8vIENvbXBsZXRlIHRoZSB1cGxvYWRcbiAgICAgICAgICB2YXIgY29tcGxldGVNdWx0aXBhcnRVcGxvYWRSZXEgPSBzZWxmLmNvbXBsZXRlTXVsdGlwYXJ0VXBsb2FkKHtcbiAgICAgICAgICAgIEJ1Y2tldDogcGFyYW1zLkJ1Y2tldCxcbiAgICAgICAgICAgIEtleTogcGFyYW1zLktleSxcbiAgICAgICAgICAgIFVwbG9hZElkOiBtdWx0aXBhcnRVcGxvYWRJRCxcbiAgICAgICAgICAgIE11bHRpcGFydFVwbG9hZDoge1xuICAgICAgICAgICAgICBQYXJ0czogcGFydHNcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9KTtcblxuICAgICAgICAgIGNvbXBsZXRlTXVsdGlwYXJ0VXBsb2FkUmVxLm9uKCdidWlsZCcsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIGNvbXBsZXRlTXVsdGlwYXJ0VXBsb2FkUmVxLmh0dHBSZXF1ZXN0LmhlYWRlcnNbJ2FwaWtleSddID0gU3RlZWRvc0FwaUtleTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgICBjb21wbGV0ZU11bHRpcGFydFVwbG9hZFJlcS5zZW5kKGZ1bmN0aW9uIChlcnIsIHJlc3VsdCkge1xuICAgICAgICAgICAgaWYgKGVycikge1xuICAgICAgICAgICAgICB3cml0ZVN0cmVhbS5lbWl0KCdlcnJvcicsIGVycik7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAvLyBFbWl0IHRoZSBjZnMgZW5kIGV2ZW50IGZvciB1cGxvYWRzXG4gICAgICAgICAgICAgIGlmIChGUy5kZWJ1Zykge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdTQSBTMyAtIERPTkUhIScpO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIHdyaXRlU3RyZWFtLmVtaXQoJ3N0b3JlZCcsIHtcbiAgICAgICAgICAgICAgICBmaWxlS2V5OiBmaWxlS2V5LFxuICAgICAgICAgICAgICAgIHNpemU6IHVwbG9hZGVkU2l6ZSxcbiAgICAgICAgICAgICAgICBzdG9yZWRBdDogbmV3IERhdGUoKVxuICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgIH0pO1xuXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9KTtcblxuICAgIC8vIFJlc2V0IHRoZSBjdXJyZW50IGJ1ZmZlclxuICAgIGN1cnJlbnRDaHVuayA9IEJ1ZmZlcigwKTtcbiAgfTtcblxuICAvL1VzZSB0aGUgUzMgY2xpZW50IHRvIGluaXRpYWxpemUgYSBtdWx0aXBhcnQgdXBsb2FkIHRvIFMzLlxuICB2YXIgY3JlYXRlTXVsdGlwYXJ0VXBsb2FkUmVxID0gc2VsZi5jcmVhdGVNdWx0aXBhcnRVcGxvYWQocGFyYW1zKTtcbiAgY3JlYXRlTXVsdGlwYXJ0VXBsb2FkUmVxLm9uKCdidWlsZCcsIGZ1bmN0aW9uICgpIHtcbiAgICBjcmVhdGVNdWx0aXBhcnRVcGxvYWRSZXEuaHR0cFJlcXVlc3QuaGVhZGVyc1snYXBpa2V5J10gPSBTdGVlZG9zQXBpS2V5O1xuICB9KTtcbiAgY3JlYXRlTXVsdGlwYXJ0VXBsb2FkUmVxLnNlbmQoZnVuY3Rpb24gKGVyciwgZGF0YSkge1xuICAgIGlmIChlcnIpIHtcbiAgICAgIC8vIEVtaXQgdGhlIGVycm9yXG4gICAgICB3cml0ZVN0cmVhbS5lbWl0KCdlcnJvcicsIGVycik7XG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIFNldCB0aGUgdXBsb2FkIGlkXG4gICAgICAvLyBjb25zb2xlLmxvZygnZGF0YS5VcGxvYWRJZDogJywgZGF0YS5VcGxvYWRJZCk7XG4gICAgICBtdWx0aXBhcnRVcGxvYWRJRCA9IGRhdGEuVXBsb2FkSWQ7XG5cbiAgICAgIC8vIENhbGwgd2FpdGluZyBjYWxsYmFja1xuICAgICAgaWYgKHR5cGVvZiB3YWl0aW5nQ2FsbGJhY2sgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgLy8gV2UgY2FsbCB0aGUgd2FpdGluZyBjYWxsYmFjayBpZiBhbnkgbm93IHNpbmNlIHdlIGVzdGFibGlzaGVkIGFcbiAgICAgICAgLy8gY29ubmVjdGlvbiB0byB0aGUgczNcbiAgICAgICAgd2FpdGluZ0NhbGxiYWNrKCk7XG4gICAgICB9XG5cbiAgICB9XG4gIH0pO1xuXG4gIC8vIFdlIHJldHVybiB0aGUgd3JpdGUgc3RyZWFtXG4gIHJldHVybiB3cml0ZVN0cmVhbTtcbn07XG4iXX0=
