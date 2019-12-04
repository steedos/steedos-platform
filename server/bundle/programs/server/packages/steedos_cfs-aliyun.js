(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var global = Package.meteor.global;
var meteorEnv = Package.meteor.meteorEnv;
var ECMAScript = Package.ecmascript.ECMAScript;
var FS = Package['steedos:cfs-base-package'].FS;
var meteorInstall = Package.modules.meteorInstall;
var meteorBabelHelpers = Package['babel-runtime'].meteorBabelHelpers;
var Promise = Package.promise.Promise;

/* Package-scope variables */
var Aliyun, o, s;

var require = meteorInstall({"node_modules":{"meteor":{"steedos:cfs-aliyun":{"checkNpm.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                            //
// packages/steedos_cfs-aliyun/checkNpm.js                                                                    //
//                                                                                                            //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                              //
let checkNpmVersions;
module.link("meteor/tmeasday:check-npm-versions", {
  checkNpmVersions(v) {
    checkNpmVersions = v;
  }

}, 0);

if (Meteor.settings && Meteor.settings.cfs && Meteor.settings.cfs.aliyun) {
  checkNpmVersions({
    'aliyun-sdk': '^1.9.2'
  }, 'steedos:cfs-aliyun');
  Aliyun = require('aliyun-sdk');
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"aliyun.server.js":function(){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                            //
// packages/steedos_cfs-aliyun/aliyun.server.js                                                               //
//                                                                                                            //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                              //
if (!Aliyun) return; // We use the official aws sdk

/**
 * Creates an Aliyun OSS store instance on server. Inherits `FS.StorageAdapter`
 * type.
 *
 * @public
 * @constructor
 * @param {String} name      The store name
 * @param {Object} options   Storage options
 * @return {FS.Store.OSS}    An instance of FS.StorageAdapter.
 */

FS.Store.OSS = function (name, options) {
  var self = this;

  if (!(self instanceof FS.Store.OSS)) {
    throw new Error('FS.Store.OSS missing keyword "new"');
  }

  options = options || {}; // Determine which folder (key prefix) in the bucket to use

  var folder = options.folder;
  folder = typeof folder === 'string' && folder.length ? folder.replace(/^\//, '').replace(/\/?$/, '/') : '';
  folder = folder === '/' ? '' : folder; // Determine which bucket to use, reruired

  var bucket = options.bucket;

  if (!bucket) {
    throw new Error('FS.Store.OSS requires "buckect"');
  } // Those ACL values are allowed: 'private', 'public-read', 'public-read-write'


  var defaultAcl = options.ACL || 'private';
  var region = options.region || 'oss-cn-beijing'; // var regionList = ['oss-cn-hangzhou', 'oss-cn-beijing', 'oss-cn-qingdao',
  //                   'oss-cn-shenzhen', 'oss-cn-hongkong'];
  // if (regionList.indexOf(region) === -1) {
  //   throw new Error('FS.Store.OSS invalid region');
  // }
  // var endpoint = 'http://' + region + (options.internal ? '-internal' : '') +
  //                '.aliyuncs.com';

  var endpoint = 'http://' + region + '.aliyuncs.com';
  var serviceParams = FS.Utility.extend({
    accessKeyId: null,
    // Required
    secretAccessKey: null,
    // Required
    endpoint: endpoint,
    httpOptions: {
      timeout: 6000
    },
    apiVersion: '2013-10-15' // Required, DO NOT UPDATE

  }, options); // Create S3 service

  var ossStore = new Aliyun.OSS(serviceParams);
  /**
   * Pick keys from object
   * @param  {Object} obj  Original object
   * @param  {Array}  keys Array of keys to be preserved
   * @return {Object}      New object
   */

  function pick(obj, keys) {
    var result = {},
        iteratee = keys[0];
    if (obj == null || arguments.length < 2) return result;

    for (var i = 0; i < keys.length; i++) {
      var key = keys[i];

      if (obj.hasOwnProperty(key)) {
        result[key] = obj[key];
      }
    }

    return result;
  }

  return new FS.StorageAdapter(name, options, {
    typeName: 'storage.oss',
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
      return ossStore.createReadStream({
        Bucket: bucket,
        Key: fileKey
      }, options);
    },
    // Comment to documentation: Set options.ContentLength otherwise the
    // indirect stream will be used creating extra overhead on the filesystem.
    // An easy way if the data is not transformed is to set the
    // options.ContentLength = fileObj.size ...
    createWriteStream: function (fileKey, options) {
      options = options || {}; // We dont support array of aliases

      delete options.aliases; // We dont support contentType

      delete options.contentType; // We dont support metadata use Metadata?

      delete options.metadata; // Set options

      var options = FS.Utility.extend({
        Bucket: bucket,
        Key: folder + fileKey,
        ACL: defaultAcl
      }, options);
      return ossStore.createWriteStream(options);
    },
    remove: function (fileKey, callback) {
      ossStore.deleteObject({
        Bucket: bucket,
        Key: fileKey
      }, function (error) {
        console.log(error);
        callback(error, !error);
      }); // callback(null, true);
    },
    watch: function () {
      throw new Error('OSS does not support watch.');
    }
  });
};
////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"aliyun.stream.js":function(require){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                            //
// packages/steedos_cfs-aliyun/aliyun.stream.js                                                               //
//                                                                                                            //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                              //
if (!Aliyun) return;

var stream = require('stream');
/**
 * Wraps official put stream
 * @param  {[type]} params [description]
 * @param  {[type]} option [description]
 * @return {[type]}        [description]
 */


Aliyun.OSS.prototype.createReadStream = function (params, option) {
  o = this.getObject(params);
  s = o.createReadStream();
  s._aliyunObject = o;
  s._maxListeners = 100;
  return s;
};
/**
 * Creates get put stream, inspired by github.com/meteormatt:
 * https://github.com/meteormatt/oss-upload-stream
 * @param  {Object} params CollectionFS Params
 * @param  {Object} option CollectionFS Options
 * @return {Stream}        writeStream object
 */


Aliyun.OSS.prototype.createWriteStream = function (params, option) {
  var self = this; // Scope variables
  // Create the writable stream interface.

  var writeStream = new stream.Writable({
    highWaterMark: 4194304
  }); // 4MB

  var multipartUploadID = null;
  var chunkSizeThreashold = 5242880;
  var awaitingCallback;
  var fileKey = params && (params.fileKey || params.Key); // Current chunk

  var currentChunk = Buffer(0);
  var chunkNumber = 1; // Status

  var parts = [];
  var receivedSize = 0;
  var uploadedSize = 0;

  var runWhenReady = function (callback) {
    // If we dont have a upload id we are not ready
    if (multipartUploadID === null) {
      // We set the waiting callback
      awaitingCallback = callback;
    } else {
      // No problem - just continue
      callback();
    }
  }; // Handler to receive data and upload it to OSS.


  writeStream._write = function (incomingChunk, enc, next) {
    currentChunk = Buffer.concat([currentChunk, incomingChunk]); // While the current chunk is larger than chunkSizeThreashold, we flush
    // the chunk buffer to OSS via multipart upload.

    if (currentChunk.length > chunkSizeThreashold) {
      // Upload when necessary;
      runWhenReady(function () {
        flushChunk(next, false);
      });
    } else {
      runWhenReady(next);
    }
  }; // Hijack the end method, send to OSS and complete.


  var _originalEnd = writeStream.end;

  writeStream.end = function (chunk, encoding, callback) {
    _originalEnd.call(this, chunk, encoding, function () {
      runWhenReady(function () {
        flushChunk(callback, true);
      });
    });
  };
  /**
   * Flushes chunk to Aliyun
   * @param  {Function} callback  Callback, normally for next part of data.
   * @param  {Boolean}  lastChunk If it's the last chunk.
   * @return {undefined}
   */


  function flushChunk(callback, lastChunk) {
    if (multipartUploadID === null) {
      throw new Error('OSS Client Error: Missing mulitipart upload ID');
    } // Chunk to upload


    var uploadingChunk = Buffer(currentChunk.length);
    currentChunk.copy(uploadingChunk); // copies to target

    var localChunkNumber = chunkNumber++;
    receivedSize += uploadingChunk.length;
    self.uploadPart({
      Body: uploadingChunk,
      Bucket: params.Bucket,
      Key: params.Key,
      UploadId: multipartUploadID,
      PartNumber: localChunkNumber
    }, uploadPartCallback); // Reset the current buffer

    currentChunk = Buffer(0);

    function uploadPartCallback(error, result) {
      // Handle error as the top priority;
      if (error) {
        abortUpload('OSS Client Error: ' + JSON.stringify(error));
        return;
      } // Next part of data.


      if (typeof callback === 'function') {
        callback();
      }

      uploadedSize += uploadingChunk.length;
      parts[localChunkNumber - 1] = {
        ETag: result.ETag,
        PartNumber: localChunkNumber
      }; // Debug only.
      // writeStream.emit('chunk', {
      //   ETag: result.ETag,
      //   PartNumber: localChunkNumber,
      //   receivedSize: receivedSize,
      //   uploadedSize: uploadedSize
      // });
      // While incoming stream is finished and we have uploaded everything,
      // we would further notice OSS

      if (writeStream._writableState.ended === true && uploadedSize === receivedSize && lastChunk) {
        closeUploadStream();
      }
    }
  }

  ;
  /**
   * Shuts down upload stream, calls Aliyun to merge every chunk of file
   * @return {undefined}
   */

  function closeUploadStream() {
    // Not possible without multipart upload id
    if (!multipartUploadID) {
      return;
    }

    self.completeMultipartUpload({
      Bucket: params.Bucket,
      Key: params.Key,
      UploadId: multipartUploadID,
      CompleteMultipartUpload: {
        Parts: parts
      }
    }, function (error, result) {
      if (error) {
        abortUpload('OSS Client Error at Comletion: ' + JSON.stringify(error));
        return;
      }

      if (FS.debug) {
        console.log('SA OSS - DONE!!');
      }

      writeStream.emit('stored', {
        fileKey: fileKey,
        size: uploadedSize,
        storedAt: new Date()
      });
    });
  }
  /**
   * When a fatal error occurs abort the multipart upload
   * @param  {String} errorText Error text
   * @return {undefined}
   */


  function abortUpload(errorText) {
    self.abortMultipartUpload({
      Bucket: params.Bucket,
      Key: params.Key,
      UploadId: multipartUploadID
    }, function (abortError) {
      if (abortError) {
        writeStream.emit('error', errorText + '\nOSS Client Abort Error: ' + abortError);
      } else {
        writeStream.emit('error', errorText);
      }
    });
  }

  ;
  self.createMultipartUpload(params, function (error, data) {
    if (error) {
      writeStream.emit('error', 'OSS Client Error: ' + JSON.stringify(error));
      return;
    }

    multipartUploadID = data.UploadId; // Call awaiting callback to start upload

    if (typeof awaitingCallback === 'function') {
      awaitingCallback();
    }
  });
  return writeStream;
};
////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}}}}},{
  "extensions": [
    ".js",
    ".json"
  ]
});

require("/node_modules/meteor/steedos:cfs-aliyun/checkNpm.js");
require("/node_modules/meteor/steedos:cfs-aliyun/aliyun.server.js");
require("/node_modules/meteor/steedos:cfs-aliyun/aliyun.stream.js");

/* Exports */
Package._define("steedos:cfs-aliyun");

})();

//# sourceURL=meteor://💻app/packages/steedos_cfs-aliyun.js
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvczpjZnMtYWxpeXVuL2NoZWNrTnBtLmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zOmNmcy1hbGl5dW4vYWxpeXVuLnNlcnZlci5qcyIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvczpjZnMtYWxpeXVuL2FsaXl1bi5zdHJlYW0uanMiXSwibmFtZXMiOlsiY2hlY2tOcG1WZXJzaW9ucyIsIm1vZHVsZSIsImxpbmsiLCJ2IiwiTWV0ZW9yIiwic2V0dGluZ3MiLCJjZnMiLCJhbGl5dW4iLCJBbGl5dW4iLCJyZXF1aXJlIiwiRlMiLCJTdG9yZSIsIk9TUyIsIm5hbWUiLCJvcHRpb25zIiwic2VsZiIsIkVycm9yIiwiZm9sZGVyIiwibGVuZ3RoIiwicmVwbGFjZSIsImJ1Y2tldCIsImRlZmF1bHRBY2wiLCJBQ0wiLCJyZWdpb24iLCJlbmRwb2ludCIsInNlcnZpY2VQYXJhbXMiLCJVdGlsaXR5IiwiZXh0ZW5kIiwiYWNjZXNzS2V5SWQiLCJzZWNyZXRBY2Nlc3NLZXkiLCJodHRwT3B0aW9ucyIsInRpbWVvdXQiLCJhcGlWZXJzaW9uIiwib3NzU3RvcmUiLCJwaWNrIiwib2JqIiwia2V5cyIsInJlc3VsdCIsIml0ZXJhdGVlIiwiYXJndW1lbnRzIiwiaSIsImtleSIsImhhc093blByb3BlcnR5IiwiU3RvcmFnZUFkYXB0ZXIiLCJ0eXBlTmFtZSIsImZpbGVLZXkiLCJmaWxlT2JqIiwiaW5mbyIsIl9nZXRJbmZvIiwiZmlsZW5hbWUiLCJmaWxlbmFtZUluU3RvcmUiLCJzdG9yZSIsImNvbGxlY3Rpb25OYW1lIiwiX2lkIiwiY3JlYXRlUmVhZFN0cmVhbSIsIkJ1Y2tldCIsIktleSIsImNyZWF0ZVdyaXRlU3RyZWFtIiwiYWxpYXNlcyIsImNvbnRlbnRUeXBlIiwibWV0YWRhdGEiLCJyZW1vdmUiLCJjYWxsYmFjayIsImRlbGV0ZU9iamVjdCIsImVycm9yIiwiY29uc29sZSIsImxvZyIsIndhdGNoIiwic3RyZWFtIiwicHJvdG90eXBlIiwicGFyYW1zIiwib3B0aW9uIiwibyIsImdldE9iamVjdCIsInMiLCJfYWxpeXVuT2JqZWN0IiwiX21heExpc3RlbmVycyIsIndyaXRlU3RyZWFtIiwiV3JpdGFibGUiLCJoaWdoV2F0ZXJNYXJrIiwibXVsdGlwYXJ0VXBsb2FkSUQiLCJjaHVua1NpemVUaHJlYXNob2xkIiwiYXdhaXRpbmdDYWxsYmFjayIsImN1cnJlbnRDaHVuayIsIkJ1ZmZlciIsImNodW5rTnVtYmVyIiwicGFydHMiLCJyZWNlaXZlZFNpemUiLCJ1cGxvYWRlZFNpemUiLCJydW5XaGVuUmVhZHkiLCJfd3JpdGUiLCJpbmNvbWluZ0NodW5rIiwiZW5jIiwibmV4dCIsImNvbmNhdCIsImZsdXNoQ2h1bmsiLCJfb3JpZ2luYWxFbmQiLCJlbmQiLCJjaHVuayIsImVuY29kaW5nIiwiY2FsbCIsImxhc3RDaHVuayIsInVwbG9hZGluZ0NodW5rIiwiY29weSIsImxvY2FsQ2h1bmtOdW1iZXIiLCJ1cGxvYWRQYXJ0IiwiQm9keSIsIlVwbG9hZElkIiwiUGFydE51bWJlciIsInVwbG9hZFBhcnRDYWxsYmFjayIsImFib3J0VXBsb2FkIiwiSlNPTiIsInN0cmluZ2lmeSIsIkVUYWciLCJfd3JpdGFibGVTdGF0ZSIsImVuZGVkIiwiY2xvc2VVcGxvYWRTdHJlYW0iLCJjb21wbGV0ZU11bHRpcGFydFVwbG9hZCIsIkNvbXBsZXRlTXVsdGlwYXJ0VXBsb2FkIiwiUGFydHMiLCJkZWJ1ZyIsImVtaXQiLCJzaXplIiwic3RvcmVkQXQiLCJEYXRlIiwiZXJyb3JUZXh0IiwiYWJvcnRNdWx0aXBhcnRVcGxvYWQiLCJhYm9ydEVycm9yIiwiY3JlYXRlTXVsdGlwYXJ0VXBsb2FkIiwiZGF0YSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSxJQUFJQSxnQkFBSjtBQUFxQkMsTUFBTSxDQUFDQyxJQUFQLENBQVksb0NBQVosRUFBaUQ7QUFBQ0Ysa0JBQWdCLENBQUNHLENBQUQsRUFBRztBQUFDSCxvQkFBZ0IsR0FBQ0csQ0FBakI7QUFBbUI7O0FBQXhDLENBQWpELEVBQTJGLENBQTNGOztBQUlyQixJQUFJQyxNQUFNLENBQUNDLFFBQVAsSUFBbUJELE1BQU0sQ0FBQ0MsUUFBUCxDQUFnQkMsR0FBbkMsSUFBMENGLE1BQU0sQ0FBQ0MsUUFBUCxDQUFnQkMsR0FBaEIsQ0FBb0JDLE1BQWxFLEVBQTBFO0FBQ3hFUCxrQkFBZ0IsQ0FBQztBQUNmLGtCQUFjO0FBREMsR0FBRCxFQUViLG9CQUZhLENBQWhCO0FBSUFRLFFBQU0sR0FBR0MsT0FBTyxDQUFDLFlBQUQsQ0FBaEI7QUFDRCxDOzs7Ozs7Ozs7OztBQ1ZELElBQUksQ0FBQ0QsTUFBTCxFQUNFLE8sQ0FFRjs7QUFFQTs7Ozs7Ozs7Ozs7QUFVQUUsRUFBRSxDQUFDQyxLQUFILENBQVNDLEdBQVQsR0FBZSxVQUFTQyxJQUFULEVBQWVDLE9BQWYsRUFBd0I7QUFDckMsTUFBSUMsSUFBSSxHQUFHLElBQVg7O0FBQ0EsTUFBSSxFQUFFQSxJQUFJLFlBQVlMLEVBQUUsQ0FBQ0MsS0FBSCxDQUFTQyxHQUEzQixDQUFKLEVBQXFDO0FBQ25DLFVBQU0sSUFBSUksS0FBSixDQUFVLG9DQUFWLENBQU47QUFDRDs7QUFFREYsU0FBTyxHQUFHQSxPQUFPLElBQUksRUFBckIsQ0FOcUMsQ0FRckM7O0FBQ0EsTUFBSUcsTUFBTSxHQUFHSCxPQUFPLENBQUNHLE1BQXJCO0FBQ0FBLFFBQU0sR0FBRyxPQUFPQSxNQUFQLEtBQWtCLFFBQWxCLElBQThCQSxNQUFNLENBQUNDLE1BQXJDLEdBQ1BELE1BQU0sQ0FBQ0UsT0FBUCxDQUFlLEtBQWYsRUFBc0IsRUFBdEIsRUFBMEJBLE9BQTFCLENBQWtDLE1BQWxDLEVBQTBDLEdBQTFDLENBRE8sR0FDMEMsRUFEbkQ7QUFFQUYsUUFBTSxHQUFHQSxNQUFNLEtBQUssR0FBWCxHQUFpQixFQUFqQixHQUFzQkEsTUFBL0IsQ0FacUMsQ0FjckM7O0FBQ0EsTUFBSUcsTUFBTSxHQUFHTixPQUFPLENBQUNNLE1BQXJCOztBQUNBLE1BQUksQ0FBQ0EsTUFBTCxFQUFhO0FBQ1gsVUFBTSxJQUFJSixLQUFKLENBQVUsaUNBQVYsQ0FBTjtBQUNELEdBbEJvQyxDQW9CckM7OztBQUNBLE1BQUlLLFVBQVUsR0FBR1AsT0FBTyxDQUFDUSxHQUFSLElBQWUsU0FBaEM7QUFFQSxNQUFJQyxNQUFNLEdBQUdULE9BQU8sQ0FBQ1MsTUFBUixJQUFrQixnQkFBL0IsQ0F2QnFDLENBd0JyQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTs7QUFDQSxNQUFJQyxRQUFRLEdBQUcsWUFBWUQsTUFBWixHQUFxQixlQUFwQztBQUVBLE1BQUlFLGFBQWEsR0FBR2YsRUFBRSxDQUFDZ0IsT0FBSCxDQUFXQyxNQUFYLENBQWtCO0FBQ3BDQyxlQUFXLEVBQUUsSUFEdUI7QUFDakI7QUFDbkJDLG1CQUFlLEVBQUUsSUFGbUI7QUFFYjtBQUN2QkwsWUFBUSxFQUFFQSxRQUgwQjtBQUlwQ00sZUFBVyxFQUFFO0FBQ1hDLGFBQU8sRUFBRTtBQURFLEtBSnVCO0FBT3BDQyxjQUFVLEVBQUUsWUFQd0IsQ0FPWDs7QUFQVyxHQUFsQixFQVFqQmxCLE9BUmlCLENBQXBCLENBbENxQyxDQTRDckM7O0FBQ0EsTUFBSW1CLFFBQVEsR0FBRyxJQUFJekIsTUFBTSxDQUFDSSxHQUFYLENBQWVhLGFBQWYsQ0FBZjtBQUVBOzs7Ozs7O0FBTUEsV0FBU1MsSUFBVCxDQUFjQyxHQUFkLEVBQW1CQyxJQUFuQixFQUF5QjtBQUN2QixRQUFJQyxNQUFNLEdBQUcsRUFBYjtBQUFBLFFBQ0VDLFFBQVEsR0FBR0YsSUFBSSxDQUFDLENBQUQsQ0FEakI7QUFFQSxRQUFJRCxHQUFHLElBQUksSUFBUCxJQUFlSSxTQUFTLENBQUNyQixNQUFWLEdBQW1CLENBQXRDLEVBQXlDLE9BQU9tQixNQUFQOztBQUN6QyxTQUFLLElBQUlHLENBQUMsR0FBRyxDQUFiLEVBQWdCQSxDQUFDLEdBQUdKLElBQUksQ0FBQ2xCLE1BQXpCLEVBQWlDc0IsQ0FBQyxFQUFsQyxFQUFzQztBQUNwQyxVQUFJQyxHQUFHLEdBQUdMLElBQUksQ0FBQ0ksQ0FBRCxDQUFkOztBQUNBLFVBQUlMLEdBQUcsQ0FBQ08sY0FBSixDQUFtQkQsR0FBbkIsQ0FBSixFQUE2QjtBQUMzQkosY0FBTSxDQUFDSSxHQUFELENBQU4sR0FBY04sR0FBRyxDQUFDTSxHQUFELENBQWpCO0FBQ0Q7QUFDRjs7QUFDRCxXQUFPSixNQUFQO0FBQ0Q7O0FBRUQsU0FBTyxJQUFJM0IsRUFBRSxDQUFDaUMsY0FBUCxDQUFzQjlCLElBQXRCLEVBQTRCQyxPQUE1QixFQUFxQztBQUMxQzhCLFlBQVEsRUFBRSxhQURnQztBQUUxQ0MsV0FBTyxFQUFFLFVBQVNDLE9BQVQsRUFBa0I7QUFDekI7QUFDQSxVQUFJQyxJQUFJLEdBQUdELE9BQU8sSUFBSUEsT0FBTyxDQUFDRSxRQUFSLENBQWlCbkMsSUFBakIsQ0FBdEIsQ0FGeUIsQ0FHekI7OztBQUNBLFVBQUlrQyxJQUFJLElBQUlBLElBQUksQ0FBQ04sR0FBakIsRUFBc0IsT0FBT00sSUFBSSxDQUFDTixHQUFaO0FBRXRCLFVBQUlRLFFBQVEsR0FBR0gsT0FBTyxDQUFDakMsSUFBUixFQUFmO0FBQ0EsVUFBSXFDLGVBQWUsR0FBR0osT0FBTyxDQUFDakMsSUFBUixDQUFhO0FBQ2pDc0MsYUFBSyxFQUFFdEM7QUFEMEIsT0FBYixDQUF0QixDQVB5QixDQVd6Qjs7QUFDQSxhQUFPaUMsT0FBTyxDQUFDTSxjQUFSLEdBQXlCLEdBQXpCLEdBQStCTixPQUFPLENBQUNNLGNBQXZDLEdBQXdELEdBQXhELEdBQ0xOLE9BQU8sQ0FBQ08sR0FESCxHQUNTLEdBRFQsSUFDZ0JILGVBQWUsSUFBSUQsUUFEbkMsQ0FBUDtBQUVELEtBaEJ5QztBQWtCMUNLLG9CQUFnQixFQUFFLFVBQVNULE9BQVQsRUFBa0IvQixPQUFsQixFQUEyQjtBQUMzQyxhQUFPbUIsUUFBUSxDQUFDcUIsZ0JBQVQsQ0FBMEI7QUFDL0JDLGNBQU0sRUFBRW5DLE1BRHVCO0FBRS9Cb0MsV0FBRyxFQUFFWDtBQUYwQixPQUExQixFQUdKL0IsT0FISSxDQUFQO0FBSUQsS0F2QnlDO0FBd0IxQztBQUNBO0FBQ0E7QUFDQTtBQUNBMkMscUJBQWlCLEVBQUUsVUFBU1osT0FBVCxFQUFrQi9CLE9BQWxCLEVBQTJCO0FBQzVDQSxhQUFPLEdBQUdBLE9BQU8sSUFBSSxFQUFyQixDQUQ0QyxDQUc1Qzs7QUFDQSxhQUFPQSxPQUFPLENBQUM0QyxPQUFmLENBSjRDLENBSzVDOztBQUNBLGFBQU81QyxPQUFPLENBQUM2QyxXQUFmLENBTjRDLENBTzVDOztBQUNBLGFBQU83QyxPQUFPLENBQUM4QyxRQUFmLENBUjRDLENBVTVDOztBQUNBLFVBQUk5QyxPQUFPLEdBQUdKLEVBQUUsQ0FBQ2dCLE9BQUgsQ0FBV0MsTUFBWCxDQUFrQjtBQUM5QjRCLGNBQU0sRUFBRW5DLE1BRHNCO0FBRTlCb0MsV0FBRyxFQUFFdkMsTUFBTSxHQUFHNEIsT0FGZ0I7QUFHOUJ2QixXQUFHLEVBQUVEO0FBSHlCLE9BQWxCLEVBSVhQLE9BSlcsQ0FBZDtBQU1BLGFBQU9tQixRQUFRLENBQUN3QixpQkFBVCxDQUEyQjNDLE9BQTNCLENBQVA7QUFDRCxLQTlDeUM7QUErQzFDK0MsVUFBTSxFQUFFLFVBQVNoQixPQUFULEVBQWtCaUIsUUFBbEIsRUFBNEI7QUFFbEM3QixjQUFRLENBQUM4QixZQUFULENBQXNCO0FBQ3BCUixjQUFNLEVBQUVuQyxNQURZO0FBRXBCb0MsV0FBRyxFQUFFWDtBQUZlLE9BQXRCLEVBR0csVUFBU21CLEtBQVQsRUFBZ0I7QUFDakJDLGVBQU8sQ0FBQ0MsR0FBUixDQUFZRixLQUFaO0FBQ0FGLGdCQUFRLENBQUNFLEtBQUQsRUFBUSxDQUFDQSxLQUFULENBQVI7QUFDRCxPQU5ELEVBRmtDLENBU2xDO0FBQ0QsS0F6RHlDO0FBMEQxQ0csU0FBSyxFQUFFLFlBQVc7QUFDaEIsWUFBTSxJQUFJbkQsS0FBSixDQUFVLDZCQUFWLENBQU47QUFDRDtBQTVEeUMsR0FBckMsQ0FBUDtBQThERCxDQWhJRCxDOzs7Ozs7Ozs7OztBQ2ZBLElBQUksQ0FBQ1IsTUFBTCxFQUNFOztBQUVGLElBQUk0RCxNQUFNLEdBQUczRCxPQUFPLENBQUMsUUFBRCxDQUFwQjtBQUVBOzs7Ozs7OztBQU1BRCxNQUFNLENBQUNJLEdBQVAsQ0FBV3lELFNBQVgsQ0FBcUJmLGdCQUFyQixHQUF3QyxVQUFTZ0IsTUFBVCxFQUFpQkMsTUFBakIsRUFBeUI7QUFDL0RDLEdBQUMsR0FBRyxLQUFLQyxTQUFMLENBQWVILE1BQWYsQ0FBSjtBQUNBSSxHQUFDLEdBQUdGLENBQUMsQ0FBQ2xCLGdCQUFGLEVBQUo7QUFDQW9CLEdBQUMsQ0FBQ0MsYUFBRixHQUFrQkgsQ0FBbEI7QUFDQUUsR0FBQyxDQUFDRSxhQUFGLEdBQWtCLEdBQWxCO0FBQ0EsU0FBT0YsQ0FBUDtBQUNELENBTkQ7QUFRQTs7Ozs7Ozs7O0FBT0FsRSxNQUFNLENBQUNJLEdBQVAsQ0FBV3lELFNBQVgsQ0FBcUJaLGlCQUFyQixHQUF5QyxVQUFTYSxNQUFULEVBQWlCQyxNQUFqQixFQUF5QjtBQUNoRSxNQUFJeEQsSUFBSSxHQUFHLElBQVgsQ0FEZ0UsQ0FHaEU7QUFDQTs7QUFDQSxNQUFJOEQsV0FBVyxHQUFHLElBQUlULE1BQU0sQ0FBQ1UsUUFBWCxDQUFvQjtBQUFDQyxpQkFBYSxFQUFFO0FBQWhCLEdBQXBCLENBQWxCLENBTGdFLENBS0M7O0FBQ2pFLE1BQUlDLGlCQUFpQixHQUFHLElBQXhCO0FBQ0EsTUFBSUMsbUJBQW1CLEdBQUcsT0FBMUI7QUFDQSxNQUFJQyxnQkFBSjtBQUNBLE1BQUlyQyxPQUFPLEdBQUd5QixNQUFNLEtBQUtBLE1BQU0sQ0FBQ3pCLE9BQVAsSUFBa0J5QixNQUFNLENBQUNkLEdBQTlCLENBQXBCLENBVGdFLENBV2hFOztBQUNBLE1BQUkyQixZQUFZLEdBQUdDLE1BQU0sQ0FBQyxDQUFELENBQXpCO0FBQ0EsTUFBSUMsV0FBVyxHQUFHLENBQWxCLENBYmdFLENBZWhFOztBQUNBLE1BQUlDLEtBQUssR0FBRyxFQUFaO0FBQ0EsTUFBSUMsWUFBWSxHQUFHLENBQW5CO0FBQ0EsTUFBSUMsWUFBWSxHQUFHLENBQW5COztBQUVBLE1BQUlDLFlBQVksR0FBRyxVQUFTM0IsUUFBVCxFQUFtQjtBQUNwQztBQUNBLFFBQUlrQixpQkFBaUIsS0FBSyxJQUExQixFQUFnQztBQUM5QjtBQUNBRSxzQkFBZ0IsR0FBR3BCLFFBQW5CO0FBQ0QsS0FIRCxNQUdPO0FBQ0w7QUFDQUEsY0FBUTtBQUNUO0FBQ0YsR0FURCxDQXBCZ0UsQ0ErQmhFOzs7QUFDQWUsYUFBVyxDQUFDYSxNQUFaLEdBQXFCLFVBQVNDLGFBQVQsRUFBd0JDLEdBQXhCLEVBQTZCQyxJQUE3QixFQUFtQztBQUN0RFYsZ0JBQVksR0FBR0MsTUFBTSxDQUFDVSxNQUFQLENBQWMsQ0FBQ1gsWUFBRCxFQUFlUSxhQUFmLENBQWQsQ0FBZixDQURzRCxDQUd0RDtBQUNBOztBQUNBLFFBQUlSLFlBQVksQ0FBQ2pFLE1BQWIsR0FBc0IrRCxtQkFBMUIsRUFBK0M7QUFDN0M7QUFDQVEsa0JBQVksQ0FBQyxZQUFXO0FBQUVNLGtCQUFVLENBQUNGLElBQUQsRUFBTyxLQUFQLENBQVY7QUFBMEIsT0FBeEMsQ0FBWjtBQUNELEtBSEQsTUFHTztBQUNMSixrQkFBWSxDQUFDSSxJQUFELENBQVo7QUFDRDtBQUNGLEdBWEQsQ0FoQ2dFLENBNkNoRTs7O0FBQ0EsTUFBSUcsWUFBWSxHQUFHbkIsV0FBVyxDQUFDb0IsR0FBL0I7O0FBQ0FwQixhQUFXLENBQUNvQixHQUFaLEdBQWtCLFVBQVNDLEtBQVQsRUFBZ0JDLFFBQWhCLEVBQTBCckMsUUFBMUIsRUFBb0M7QUFDcERrQyxnQkFBWSxDQUFDSSxJQUFiLENBQWtCLElBQWxCLEVBQXdCRixLQUF4QixFQUErQkMsUUFBL0IsRUFBeUMsWUFBVztBQUNsRFYsa0JBQVksQ0FBQyxZQUFXO0FBQUVNLGtCQUFVLENBQUNqQyxRQUFELEVBQVcsSUFBWCxDQUFWO0FBQTZCLE9BQTNDLENBQVo7QUFDRCxLQUZEO0FBR0QsR0FKRDtBQU1BOzs7Ozs7OztBQU1BLFdBQVNpQyxVQUFULENBQW9CakMsUUFBcEIsRUFBOEJ1QyxTQUE5QixFQUF5QztBQUN2QyxRQUFJckIsaUJBQWlCLEtBQUssSUFBMUIsRUFBZ0M7QUFDOUIsWUFBTSxJQUFJaEUsS0FBSixDQUFVLGdEQUFWLENBQU47QUFDRCxLQUhzQyxDQUt2Qzs7O0FBQ0EsUUFBSXNGLGNBQWMsR0FBR2xCLE1BQU0sQ0FBQ0QsWUFBWSxDQUFDakUsTUFBZCxDQUEzQjtBQUNBaUUsZ0JBQVksQ0FBQ29CLElBQWIsQ0FBa0JELGNBQWxCLEVBUHVDLENBT0o7O0FBRW5DLFFBQUlFLGdCQUFnQixHQUFHbkIsV0FBVyxFQUFsQztBQUNBRSxnQkFBWSxJQUFJZSxjQUFjLENBQUNwRixNQUEvQjtBQUVBSCxRQUFJLENBQUMwRixVQUFMLENBQWdCO0FBQ2RDLFVBQUksRUFBRUosY0FEUTtBQUVkL0MsWUFBTSxFQUFFZSxNQUFNLENBQUNmLE1BRkQ7QUFHZEMsU0FBRyxFQUFFYyxNQUFNLENBQUNkLEdBSEU7QUFJZG1ELGNBQVEsRUFBRTNCLGlCQUpJO0FBS2Q0QixnQkFBVSxFQUFFSjtBQUxFLEtBQWhCLEVBTUdLLGtCQU5ILEVBWnVDLENBb0J2Qzs7QUFDQTFCLGdCQUFZLEdBQUdDLE1BQU0sQ0FBQyxDQUFELENBQXJCOztBQUVBLGFBQVN5QixrQkFBVCxDQUE0QjdDLEtBQTVCLEVBQW1DM0IsTUFBbkMsRUFBMkM7QUFDekM7QUFDQSxVQUFJMkIsS0FBSixFQUFXO0FBQ1Q4QyxtQkFBVyxDQUFDLHVCQUF1QkMsSUFBSSxDQUFDQyxTQUFMLENBQWVoRCxLQUFmLENBQXhCLENBQVg7QUFDQTtBQUNELE9BTHdDLENBT3pDOzs7QUFDQSxVQUFJLE9BQU9GLFFBQVAsS0FBb0IsVUFBeEIsRUFBb0M7QUFDbENBLGdCQUFRO0FBQ1Q7O0FBRUQwQixrQkFBWSxJQUFJYyxjQUFjLENBQUNwRixNQUEvQjtBQUNBb0UsV0FBSyxDQUFDa0IsZ0JBQWdCLEdBQUcsQ0FBcEIsQ0FBTCxHQUE4QjtBQUM1QlMsWUFBSSxFQUFFNUUsTUFBTSxDQUFDNEUsSUFEZTtBQUU1Qkwsa0JBQVUsRUFBRUo7QUFGZ0IsT0FBOUIsQ0FieUMsQ0FrQnpDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTs7QUFDQSxVQUFJM0IsV0FBVyxDQUFDcUMsY0FBWixDQUEyQkMsS0FBM0IsS0FBcUMsSUFBckMsSUFDQTNCLFlBQVksS0FBS0QsWUFEakIsSUFDaUNjLFNBRHJDLEVBQ2dEO0FBQzlDZSx5QkFBaUI7QUFDbEI7QUFDRjtBQUNGOztBQUFBO0FBRUQ7Ozs7O0FBSUEsV0FBU0EsaUJBQVQsR0FBNkI7QUFDM0I7QUFDQSxRQUFJLENBQUNwQyxpQkFBTCxFQUF3QjtBQUN0QjtBQUNEOztBQUVEakUsUUFBSSxDQUFDc0csdUJBQUwsQ0FBNkI7QUFDM0I5RCxZQUFNLEVBQUVlLE1BQU0sQ0FBQ2YsTUFEWTtBQUUzQkMsU0FBRyxFQUFFYyxNQUFNLENBQUNkLEdBRmU7QUFHM0JtRCxjQUFRLEVBQUUzQixpQkFIaUI7QUFJM0JzQyw2QkFBdUIsRUFBRTtBQUFDQyxhQUFLLEVBQUVqQztBQUFSO0FBSkUsS0FBN0IsRUFLRyxVQUFTdEIsS0FBVCxFQUFnQjNCLE1BQWhCLEVBQXdCO0FBQ3pCLFVBQUkyQixLQUFKLEVBQVc7QUFDVDhDLG1CQUFXLENBQUMsb0NBQW9DQyxJQUFJLENBQUNDLFNBQUwsQ0FBZWhELEtBQWYsQ0FBckMsQ0FBWDtBQUNBO0FBQ0Q7O0FBRUQsVUFBSXRELEVBQUUsQ0FBQzhHLEtBQVAsRUFBYztBQUNadkQsZUFBTyxDQUFDQyxHQUFSLENBQVksaUJBQVo7QUFDRDs7QUFDRFcsaUJBQVcsQ0FBQzRDLElBQVosQ0FBaUIsUUFBakIsRUFBMkI7QUFDekI1RSxlQUFPLEVBQUVBLE9BRGdCO0FBRXpCNkUsWUFBSSxFQUFFbEMsWUFGbUI7QUFHekJtQyxnQkFBUSxFQUFFLElBQUlDLElBQUo7QUFIZSxPQUEzQjtBQUtELEtBbkJEO0FBb0JEO0FBRUQ7Ozs7Ozs7QUFLQSxXQUFTZCxXQUFULENBQXFCZSxTQUFyQixFQUFnQztBQUM5QjlHLFFBQUksQ0FBQytHLG9CQUFMLENBQTBCO0FBQ3hCdkUsWUFBTSxFQUFFZSxNQUFNLENBQUNmLE1BRFM7QUFFeEJDLFNBQUcsRUFBRWMsTUFBTSxDQUFDZCxHQUZZO0FBR3hCbUQsY0FBUSxFQUFFM0I7QUFIYyxLQUExQixFQUlHLFVBQVMrQyxVQUFULEVBQXFCO0FBQ3RCLFVBQUlBLFVBQUosRUFBZ0I7QUFDZGxELG1CQUFXLENBQUM0QyxJQUFaLENBQWlCLE9BQWpCLEVBQ2lCSSxTQUFTLEdBQUcsNEJBQVosR0FBMkNFLFVBRDVEO0FBRUQsT0FIRCxNQUdPO0FBQ0xsRCxtQkFBVyxDQUFDNEMsSUFBWixDQUFpQixPQUFqQixFQUEwQkksU0FBMUI7QUFDRDtBQUNGLEtBWEQ7QUFZRDs7QUFBQTtBQUVEOUcsTUFBSSxDQUFDaUgscUJBQUwsQ0FBMkIxRCxNQUEzQixFQUFtQyxVQUFTTixLQUFULEVBQWdCaUUsSUFBaEIsRUFBc0I7QUFDdkQsUUFBSWpFLEtBQUosRUFBVztBQUNUYSxpQkFBVyxDQUFDNEMsSUFBWixDQUFpQixPQUFqQixFQUEwQix1QkFBdUJWLElBQUksQ0FBQ0MsU0FBTCxDQUFlaEQsS0FBZixDQUFqRDtBQUNBO0FBQ0Q7O0FBQ0RnQixxQkFBaUIsR0FBR2lELElBQUksQ0FBQ3RCLFFBQXpCLENBTHVELENBTXZEOztBQUNBLFFBQUksT0FBT3pCLGdCQUFQLEtBQTRCLFVBQWhDLEVBQTRDO0FBQzFDQSxzQkFBZ0I7QUFDakI7QUFDRixHQVZEO0FBWUEsU0FBT0wsV0FBUDtBQUNELENBdExELEMiLCJmaWxlIjoiL3BhY2thZ2VzL3N0ZWVkb3NfY2ZzLWFsaXl1bi5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7XHJcbiAgY2hlY2tOcG1WZXJzaW9uc1xyXG59IGZyb20gJ21ldGVvci90bWVhc2RheTpjaGVjay1ucG0tdmVyc2lvbnMnO1xyXG5cclxuaWYgKE1ldGVvci5zZXR0aW5ncyAmJiBNZXRlb3Iuc2V0dGluZ3MuY2ZzICYmIE1ldGVvci5zZXR0aW5ncy5jZnMuYWxpeXVuKSB7XHJcbiAgY2hlY2tOcG1WZXJzaW9ucyh7XHJcbiAgICAnYWxpeXVuLXNkayc6ICdeMS45LjInXHJcbiAgfSwgJ3N0ZWVkb3M6Y2ZzLWFsaXl1bicpO1xyXG5cclxuICBBbGl5dW4gPSByZXF1aXJlKCdhbGl5dW4tc2RrJyk7XHJcbn0iLCJpZiAoIUFsaXl1bilcclxuICByZXR1cm47XHJcblxyXG4vLyBXZSB1c2UgdGhlIG9mZmljaWFsIGF3cyBzZGtcclxuXHJcbi8qKlxyXG4gKiBDcmVhdGVzIGFuIEFsaXl1biBPU1Mgc3RvcmUgaW5zdGFuY2Ugb24gc2VydmVyLiBJbmhlcml0cyBgRlMuU3RvcmFnZUFkYXB0ZXJgXHJcbiAqIHR5cGUuXHJcbiAqXHJcbiAqIEBwdWJsaWNcclxuICogQGNvbnN0cnVjdG9yXHJcbiAqIEBwYXJhbSB7U3RyaW5nfSBuYW1lICAgICAgVGhlIHN0b3JlIG5hbWVcclxuICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnMgICBTdG9yYWdlIG9wdGlvbnNcclxuICogQHJldHVybiB7RlMuU3RvcmUuT1NTfSAgICBBbiBpbnN0YW5jZSBvZiBGUy5TdG9yYWdlQWRhcHRlci5cclxuICovXHJcbkZTLlN0b3JlLk9TUyA9IGZ1bmN0aW9uKG5hbWUsIG9wdGlvbnMpIHtcclxuICB2YXIgc2VsZiA9IHRoaXM7XHJcbiAgaWYgKCEoc2VsZiBpbnN0YW5jZW9mIEZTLlN0b3JlLk9TUykpIHtcclxuICAgIHRocm93IG5ldyBFcnJvcignRlMuU3RvcmUuT1NTIG1pc3Npbmcga2V5d29yZCBcIm5ld1wiJyk7XHJcbiAgfVxyXG5cclxuICBvcHRpb25zID0gb3B0aW9ucyB8fCB7fTtcclxuXHJcbiAgLy8gRGV0ZXJtaW5lIHdoaWNoIGZvbGRlciAoa2V5IHByZWZpeCkgaW4gdGhlIGJ1Y2tldCB0byB1c2VcclxuICB2YXIgZm9sZGVyID0gb3B0aW9ucy5mb2xkZXI7XHJcbiAgZm9sZGVyID0gdHlwZW9mIGZvbGRlciA9PT0gJ3N0cmluZycgJiYgZm9sZGVyLmxlbmd0aCA/XHJcbiAgICBmb2xkZXIucmVwbGFjZSgvXlxcLy8sICcnKS5yZXBsYWNlKC9cXC8/JC8sICcvJykgOiAnJztcclxuICBmb2xkZXIgPSBmb2xkZXIgPT09ICcvJyA/ICcnIDogZm9sZGVyO1xyXG5cclxuICAvLyBEZXRlcm1pbmUgd2hpY2ggYnVja2V0IHRvIHVzZSwgcmVydWlyZWRcclxuICB2YXIgYnVja2V0ID0gb3B0aW9ucy5idWNrZXQ7XHJcbiAgaWYgKCFidWNrZXQpIHtcclxuICAgIHRocm93IG5ldyBFcnJvcignRlMuU3RvcmUuT1NTIHJlcXVpcmVzIFwiYnVja2VjdFwiJyk7XHJcbiAgfVxyXG5cclxuICAvLyBUaG9zZSBBQ0wgdmFsdWVzIGFyZSBhbGxvd2VkOiAncHJpdmF0ZScsICdwdWJsaWMtcmVhZCcsICdwdWJsaWMtcmVhZC13cml0ZSdcclxuICB2YXIgZGVmYXVsdEFjbCA9IG9wdGlvbnMuQUNMIHx8ICdwcml2YXRlJztcclxuXHJcbiAgdmFyIHJlZ2lvbiA9IG9wdGlvbnMucmVnaW9uIHx8ICdvc3MtY24tYmVpamluZyc7XHJcbiAgLy8gdmFyIHJlZ2lvbkxpc3QgPSBbJ29zcy1jbi1oYW5nemhvdScsICdvc3MtY24tYmVpamluZycsICdvc3MtY24tcWluZ2RhbycsXHJcbiAgLy8gICAgICAgICAgICAgICAgICAgJ29zcy1jbi1zaGVuemhlbicsICdvc3MtY24taG9uZ2tvbmcnXTtcclxuICAvLyBpZiAocmVnaW9uTGlzdC5pbmRleE9mKHJlZ2lvbikgPT09IC0xKSB7XHJcbiAgLy8gICB0aHJvdyBuZXcgRXJyb3IoJ0ZTLlN0b3JlLk9TUyBpbnZhbGlkIHJlZ2lvbicpO1xyXG4gIC8vIH1cclxuXHJcbiAgLy8gdmFyIGVuZHBvaW50ID0gJ2h0dHA6Ly8nICsgcmVnaW9uICsgKG9wdGlvbnMuaW50ZXJuYWwgPyAnLWludGVybmFsJyA6ICcnKSArXHJcbiAgLy8gICAgICAgICAgICAgICAgJy5hbGl5dW5jcy5jb20nO1xyXG4gIHZhciBlbmRwb2ludCA9ICdodHRwOi8vJyArIHJlZ2lvbiArICcuYWxpeXVuY3MuY29tJztcclxuXHJcbiAgdmFyIHNlcnZpY2VQYXJhbXMgPSBGUy5VdGlsaXR5LmV4dGVuZCh7XHJcbiAgICBhY2Nlc3NLZXlJZDogbnVsbCwgLy8gUmVxdWlyZWRcclxuICAgIHNlY3JldEFjY2Vzc0tleTogbnVsbCwgLy8gUmVxdWlyZWRcclxuICAgIGVuZHBvaW50OiBlbmRwb2ludCxcclxuICAgIGh0dHBPcHRpb25zOiB7XHJcbiAgICAgIHRpbWVvdXQ6IDYwMDBcclxuICAgIH0sXHJcbiAgICBhcGlWZXJzaW9uOiAnMjAxMy0xMC0xNScgLy8gUmVxdWlyZWQsIERPIE5PVCBVUERBVEVcclxuICB9LCBvcHRpb25zKTtcclxuXHJcbiAgLy8gQ3JlYXRlIFMzIHNlcnZpY2VcclxuICB2YXIgb3NzU3RvcmUgPSBuZXcgQWxpeXVuLk9TUyhzZXJ2aWNlUGFyYW1zKTtcclxuXHJcbiAgLyoqXHJcbiAgICogUGljayBrZXlzIGZyb20gb2JqZWN0XHJcbiAgICogQHBhcmFtICB7T2JqZWN0fSBvYmogIE9yaWdpbmFsIG9iamVjdFxyXG4gICAqIEBwYXJhbSAge0FycmF5fSAga2V5cyBBcnJheSBvZiBrZXlzIHRvIGJlIHByZXNlcnZlZFxyXG4gICAqIEByZXR1cm4ge09iamVjdH0gICAgICBOZXcgb2JqZWN0XHJcbiAgICovXHJcbiAgZnVuY3Rpb24gcGljayhvYmosIGtleXMpIHtcclxuICAgIHZhciByZXN1bHQgPSB7fSxcclxuICAgICAgaXRlcmF0ZWUgPSBrZXlzWzBdO1xyXG4gICAgaWYgKG9iaiA9PSBudWxsIHx8IGFyZ3VtZW50cy5sZW5ndGggPCAyKSByZXR1cm4gcmVzdWx0O1xyXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBrZXlzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgIHZhciBrZXkgPSBrZXlzW2ldO1xyXG4gICAgICBpZiAob2JqLmhhc093blByb3BlcnR5KGtleSkpIHtcclxuICAgICAgICByZXN1bHRba2V5XSA9IG9ialtrZXldO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgICByZXR1cm4gcmVzdWx0O1xyXG4gIH1cclxuXHJcbiAgcmV0dXJuIG5ldyBGUy5TdG9yYWdlQWRhcHRlcihuYW1lLCBvcHRpb25zLCB7XHJcbiAgICB0eXBlTmFtZTogJ3N0b3JhZ2Uub3NzJyxcclxuICAgIGZpbGVLZXk6IGZ1bmN0aW9uKGZpbGVPYmopIHtcclxuICAgICAgLy8gTG9va3VwIHRoZSBjb3B5XHJcbiAgICAgIHZhciBpbmZvID0gZmlsZU9iaiAmJiBmaWxlT2JqLl9nZXRJbmZvKG5hbWUpO1xyXG4gICAgICAvLyBJZiB0aGUgc3RvcmUgYW5kIGtleSBpcyBmb3VuZCByZXR1cm4gdGhlIGtleVxyXG4gICAgICBpZiAoaW5mbyAmJiBpbmZvLmtleSkgcmV0dXJuIGluZm8ua2V5O1xyXG5cclxuICAgICAgdmFyIGZpbGVuYW1lID0gZmlsZU9iai5uYW1lKCk7XHJcbiAgICAgIHZhciBmaWxlbmFtZUluU3RvcmUgPSBmaWxlT2JqLm5hbWUoe1xyXG4gICAgICAgIHN0b3JlOiBuYW1lXHJcbiAgICAgIH0pO1xyXG5cclxuICAgICAgLy8gSWYgbm8gc3RvcmUga2V5IGZvdW5kIHdlIHJlc29sdmUgLyBnZW5lcmF0ZSBhIGtleVxyXG4gICAgICByZXR1cm4gZmlsZU9iai5jb2xsZWN0aW9uTmFtZSArICcvJyArIGZpbGVPYmouY29sbGVjdGlvbk5hbWUgKyBcIi1cIiArXHJcbiAgICAgICAgZmlsZU9iai5faWQgKyAnLScgKyAoZmlsZW5hbWVJblN0b3JlIHx8IGZpbGVuYW1lKTtcclxuICAgIH0sXHJcblxyXG4gICAgY3JlYXRlUmVhZFN0cmVhbTogZnVuY3Rpb24oZmlsZUtleSwgb3B0aW9ucykge1xyXG4gICAgICByZXR1cm4gb3NzU3RvcmUuY3JlYXRlUmVhZFN0cmVhbSh7XHJcbiAgICAgICAgQnVja2V0OiBidWNrZXQsXHJcbiAgICAgICAgS2V5OiBmaWxlS2V5XHJcbiAgICAgIH0sIG9wdGlvbnMpO1xyXG4gICAgfSxcclxuICAgIC8vIENvbW1lbnQgdG8gZG9jdW1lbnRhdGlvbjogU2V0IG9wdGlvbnMuQ29udGVudExlbmd0aCBvdGhlcndpc2UgdGhlXHJcbiAgICAvLyBpbmRpcmVjdCBzdHJlYW0gd2lsbCBiZSB1c2VkIGNyZWF0aW5nIGV4dHJhIG92ZXJoZWFkIG9uIHRoZSBmaWxlc3lzdGVtLlxyXG4gICAgLy8gQW4gZWFzeSB3YXkgaWYgdGhlIGRhdGEgaXMgbm90IHRyYW5zZm9ybWVkIGlzIHRvIHNldCB0aGVcclxuICAgIC8vIG9wdGlvbnMuQ29udGVudExlbmd0aCA9IGZpbGVPYmouc2l6ZSAuLi5cclxuICAgIGNyZWF0ZVdyaXRlU3RyZWFtOiBmdW5jdGlvbihmaWxlS2V5LCBvcHRpb25zKSB7XHJcbiAgICAgIG9wdGlvbnMgPSBvcHRpb25zIHx8IHt9O1xyXG5cclxuICAgICAgLy8gV2UgZG9udCBzdXBwb3J0IGFycmF5IG9mIGFsaWFzZXNcclxuICAgICAgZGVsZXRlIG9wdGlvbnMuYWxpYXNlcztcclxuICAgICAgLy8gV2UgZG9udCBzdXBwb3J0IGNvbnRlbnRUeXBlXHJcbiAgICAgIGRlbGV0ZSBvcHRpb25zLmNvbnRlbnRUeXBlO1xyXG4gICAgICAvLyBXZSBkb250IHN1cHBvcnQgbWV0YWRhdGEgdXNlIE1ldGFkYXRhP1xyXG4gICAgICBkZWxldGUgb3B0aW9ucy5tZXRhZGF0YTtcclxuXHJcbiAgICAgIC8vIFNldCBvcHRpb25zXHJcbiAgICAgIHZhciBvcHRpb25zID0gRlMuVXRpbGl0eS5leHRlbmQoe1xyXG4gICAgICAgIEJ1Y2tldDogYnVja2V0LFxyXG4gICAgICAgIEtleTogZm9sZGVyICsgZmlsZUtleSxcclxuICAgICAgICBBQ0w6IGRlZmF1bHRBY2xcclxuICAgICAgfSwgb3B0aW9ucyk7XHJcblxyXG4gICAgICByZXR1cm4gb3NzU3RvcmUuY3JlYXRlV3JpdGVTdHJlYW0ob3B0aW9ucyk7XHJcbiAgICB9LFxyXG4gICAgcmVtb3ZlOiBmdW5jdGlvbihmaWxlS2V5LCBjYWxsYmFjaykge1xyXG5cclxuICAgICAgb3NzU3RvcmUuZGVsZXRlT2JqZWN0KHtcclxuICAgICAgICBCdWNrZXQ6IGJ1Y2tldCxcclxuICAgICAgICBLZXk6IGZpbGVLZXlcclxuICAgICAgfSwgZnVuY3Rpb24oZXJyb3IpIHtcclxuICAgICAgICBjb25zb2xlLmxvZyhlcnJvcik7XHJcbiAgICAgICAgY2FsbGJhY2soZXJyb3IsICFlcnJvcik7XHJcbiAgICAgIH0pO1xyXG4gICAgICAvLyBjYWxsYmFjayhudWxsLCB0cnVlKTtcclxuICAgIH0sXHJcbiAgICB3YXRjaDogZnVuY3Rpb24oKSB7XHJcbiAgICAgIHRocm93IG5ldyBFcnJvcignT1NTIGRvZXMgbm90IHN1cHBvcnQgd2F0Y2guJyk7XHJcbiAgICB9XHJcbiAgfSk7XHJcbn07IiwiaWYgKCFBbGl5dW4pXHJcbiAgcmV0dXJuO1xyXG5cclxudmFyIHN0cmVhbSA9IHJlcXVpcmUoJ3N0cmVhbScpO1xyXG5cclxuLyoqXHJcbiAqIFdyYXBzIG9mZmljaWFsIHB1dCBzdHJlYW1cclxuICogQHBhcmFtICB7W3R5cGVdfSBwYXJhbXMgW2Rlc2NyaXB0aW9uXVxyXG4gKiBAcGFyYW0gIHtbdHlwZV19IG9wdGlvbiBbZGVzY3JpcHRpb25dXHJcbiAqIEByZXR1cm4ge1t0eXBlXX0gICAgICAgIFtkZXNjcmlwdGlvbl1cclxuICovXHJcbkFsaXl1bi5PU1MucHJvdG90eXBlLmNyZWF0ZVJlYWRTdHJlYW0gPSBmdW5jdGlvbihwYXJhbXMsIG9wdGlvbikge1xyXG4gIG8gPSB0aGlzLmdldE9iamVjdChwYXJhbXMpO1xyXG4gIHMgPSBvLmNyZWF0ZVJlYWRTdHJlYW0oKTtcclxuICBzLl9hbGl5dW5PYmplY3QgPSBvO1xyXG4gIHMuX21heExpc3RlbmVycyA9IDEwMDtcclxuICByZXR1cm4gcztcclxufTtcclxuXHJcbi8qKlxyXG4gKiBDcmVhdGVzIGdldCBwdXQgc3RyZWFtLCBpbnNwaXJlZCBieSBnaXRodWIuY29tL21ldGVvcm1hdHQ6XHJcbiAqIGh0dHBzOi8vZ2l0aHViLmNvbS9tZXRlb3JtYXR0L29zcy11cGxvYWQtc3RyZWFtXHJcbiAqIEBwYXJhbSAge09iamVjdH0gcGFyYW1zIENvbGxlY3Rpb25GUyBQYXJhbXNcclxuICogQHBhcmFtICB7T2JqZWN0fSBvcHRpb24gQ29sbGVjdGlvbkZTIE9wdGlvbnNcclxuICogQHJldHVybiB7U3RyZWFtfSAgICAgICAgd3JpdGVTdHJlYW0gb2JqZWN0XHJcbiAqL1xyXG5BbGl5dW4uT1NTLnByb3RvdHlwZS5jcmVhdGVXcml0ZVN0cmVhbSA9IGZ1bmN0aW9uKHBhcmFtcywgb3B0aW9uKSB7XHJcbiAgdmFyIHNlbGYgPSB0aGlzO1xyXG5cclxuICAvLyBTY29wZSB2YXJpYWJsZXNcclxuICAvLyBDcmVhdGUgdGhlIHdyaXRhYmxlIHN0cmVhbSBpbnRlcmZhY2UuXHJcbiAgdmFyIHdyaXRlU3RyZWFtID0gbmV3IHN0cmVhbS5Xcml0YWJsZSh7aGlnaFdhdGVyTWFyazogNDE5NDMwNH0pOyAvLyA0TUJcclxuICB2YXIgbXVsdGlwYXJ0VXBsb2FkSUQgPSBudWxsO1xyXG4gIHZhciBjaHVua1NpemVUaHJlYXNob2xkID0gNTI0Mjg4MDtcclxuICB2YXIgYXdhaXRpbmdDYWxsYmFjaztcclxuICB2YXIgZmlsZUtleSA9IHBhcmFtcyAmJiAocGFyYW1zLmZpbGVLZXkgfHwgcGFyYW1zLktleSk7XHJcblxyXG4gIC8vIEN1cnJlbnQgY2h1bmtcclxuICB2YXIgY3VycmVudENodW5rID0gQnVmZmVyKDApO1xyXG4gIHZhciBjaHVua051bWJlciA9IDE7XHJcblxyXG4gIC8vIFN0YXR1c1xyXG4gIHZhciBwYXJ0cyA9IFtdO1xyXG4gIHZhciByZWNlaXZlZFNpemUgPSAwO1xyXG4gIHZhciB1cGxvYWRlZFNpemUgPSAwO1xyXG5cclxuICB2YXIgcnVuV2hlblJlYWR5ID0gZnVuY3Rpb24oY2FsbGJhY2spIHtcclxuICAgIC8vIElmIHdlIGRvbnQgaGF2ZSBhIHVwbG9hZCBpZCB3ZSBhcmUgbm90IHJlYWR5XHJcbiAgICBpZiAobXVsdGlwYXJ0VXBsb2FkSUQgPT09IG51bGwpIHtcclxuICAgICAgLy8gV2Ugc2V0IHRoZSB3YWl0aW5nIGNhbGxiYWNrXHJcbiAgICAgIGF3YWl0aW5nQ2FsbGJhY2sgPSBjYWxsYmFjaztcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIC8vIE5vIHByb2JsZW0gLSBqdXN0IGNvbnRpbnVlXHJcbiAgICAgIGNhbGxiYWNrKCk7XHJcbiAgICB9XHJcbiAgfTtcclxuXHJcbiAgLy8gSGFuZGxlciB0byByZWNlaXZlIGRhdGEgYW5kIHVwbG9hZCBpdCB0byBPU1MuXHJcbiAgd3JpdGVTdHJlYW0uX3dyaXRlID0gZnVuY3Rpb24oaW5jb21pbmdDaHVuaywgZW5jLCBuZXh0KSB7XHJcbiAgICBjdXJyZW50Q2h1bmsgPSBCdWZmZXIuY29uY2F0KFtjdXJyZW50Q2h1bmssIGluY29taW5nQ2h1bmtdKTtcclxuXHJcbiAgICAvLyBXaGlsZSB0aGUgY3VycmVudCBjaHVuayBpcyBsYXJnZXIgdGhhbiBjaHVua1NpemVUaHJlYXNob2xkLCB3ZSBmbHVzaFxyXG4gICAgLy8gdGhlIGNodW5rIGJ1ZmZlciB0byBPU1MgdmlhIG11bHRpcGFydCB1cGxvYWQuXHJcbiAgICBpZiAoY3VycmVudENodW5rLmxlbmd0aCA+IGNodW5rU2l6ZVRocmVhc2hvbGQpIHtcclxuICAgICAgLy8gVXBsb2FkIHdoZW4gbmVjZXNzYXJ5O1xyXG4gICAgICBydW5XaGVuUmVhZHkoZnVuY3Rpb24oKSB7IGZsdXNoQ2h1bmsobmV4dCwgZmFsc2UpOyB9KTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHJ1bldoZW5SZWFkeShuZXh0KTtcclxuICAgIH1cclxuICB9O1xyXG5cclxuICAvLyBIaWphY2sgdGhlIGVuZCBtZXRob2QsIHNlbmQgdG8gT1NTIGFuZCBjb21wbGV0ZS5cclxuICB2YXIgX29yaWdpbmFsRW5kID0gd3JpdGVTdHJlYW0uZW5kO1xyXG4gIHdyaXRlU3RyZWFtLmVuZCA9IGZ1bmN0aW9uKGNodW5rLCBlbmNvZGluZywgY2FsbGJhY2spIHtcclxuICAgIF9vcmlnaW5hbEVuZC5jYWxsKHRoaXMsIGNodW5rLCBlbmNvZGluZywgZnVuY3Rpb24oKSB7XHJcbiAgICAgIHJ1bldoZW5SZWFkeShmdW5jdGlvbigpIHsgZmx1c2hDaHVuayhjYWxsYmFjaywgdHJ1ZSk7IH0pO1xyXG4gICAgfSk7XHJcbiAgfTtcclxuXHJcbiAgLyoqXHJcbiAgICogRmx1c2hlcyBjaHVuayB0byBBbGl5dW5cclxuICAgKiBAcGFyYW0gIHtGdW5jdGlvbn0gY2FsbGJhY2sgIENhbGxiYWNrLCBub3JtYWxseSBmb3IgbmV4dCBwYXJ0IG9mIGRhdGEuXHJcbiAgICogQHBhcmFtICB7Qm9vbGVhbn0gIGxhc3RDaHVuayBJZiBpdCdzIHRoZSBsYXN0IGNodW5rLlxyXG4gICAqIEByZXR1cm4ge3VuZGVmaW5lZH1cclxuICAgKi9cclxuICBmdW5jdGlvbiBmbHVzaENodW5rKGNhbGxiYWNrLCBsYXN0Q2h1bmspIHtcclxuICAgIGlmIChtdWx0aXBhcnRVcGxvYWRJRCA9PT0gbnVsbCkge1xyXG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ09TUyBDbGllbnQgRXJyb3I6IE1pc3NpbmcgbXVsaXRpcGFydCB1cGxvYWQgSUQnKTtcclxuICAgIH1cclxuXHJcbiAgICAvLyBDaHVuayB0byB1cGxvYWRcclxuICAgIHZhciB1cGxvYWRpbmdDaHVuayA9IEJ1ZmZlcihjdXJyZW50Q2h1bmsubGVuZ3RoKTtcclxuICAgIGN1cnJlbnRDaHVuay5jb3B5KHVwbG9hZGluZ0NodW5rKTsgLy8gY29waWVzIHRvIHRhcmdldFxyXG5cclxuICAgIHZhciBsb2NhbENodW5rTnVtYmVyID0gY2h1bmtOdW1iZXIrKztcclxuICAgIHJlY2VpdmVkU2l6ZSArPSB1cGxvYWRpbmdDaHVuay5sZW5ndGg7XHJcblxyXG4gICAgc2VsZi51cGxvYWRQYXJ0KHtcclxuICAgICAgQm9keTogdXBsb2FkaW5nQ2h1bmssXHJcbiAgICAgIEJ1Y2tldDogcGFyYW1zLkJ1Y2tldCxcclxuICAgICAgS2V5OiBwYXJhbXMuS2V5LFxyXG4gICAgICBVcGxvYWRJZDogbXVsdGlwYXJ0VXBsb2FkSUQsXHJcbiAgICAgIFBhcnROdW1iZXI6IGxvY2FsQ2h1bmtOdW1iZXJcclxuICAgIH0sIHVwbG9hZFBhcnRDYWxsYmFjayk7XHJcblxyXG4gICAgLy8gUmVzZXQgdGhlIGN1cnJlbnQgYnVmZmVyXHJcbiAgICBjdXJyZW50Q2h1bmsgPSBCdWZmZXIoMCk7XHJcblxyXG4gICAgZnVuY3Rpb24gdXBsb2FkUGFydENhbGxiYWNrKGVycm9yLCByZXN1bHQpIHtcclxuICAgICAgLy8gSGFuZGxlIGVycm9yIGFzIHRoZSB0b3AgcHJpb3JpdHk7XHJcbiAgICAgIGlmIChlcnJvcikge1xyXG4gICAgICAgIGFib3J0VXBsb2FkKCdPU1MgQ2xpZW50IEVycm9yOiAnICsgSlNPTi5zdHJpbmdpZnkoZXJyb3IpKTtcclxuICAgICAgICByZXR1cm47XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIC8vIE5leHQgcGFydCBvZiBkYXRhLlxyXG4gICAgICBpZiAodHlwZW9mIGNhbGxiYWNrID09PSAnZnVuY3Rpb24nKSB7XHJcbiAgICAgICAgY2FsbGJhY2soKTtcclxuICAgICAgfVxyXG5cclxuICAgICAgdXBsb2FkZWRTaXplICs9IHVwbG9hZGluZ0NodW5rLmxlbmd0aDtcclxuICAgICAgcGFydHNbbG9jYWxDaHVua051bWJlciAtIDFdID0ge1xyXG4gICAgICAgIEVUYWc6IHJlc3VsdC5FVGFnLFxyXG4gICAgICAgIFBhcnROdW1iZXI6IGxvY2FsQ2h1bmtOdW1iZXJcclxuICAgICAgfTtcclxuXHJcbiAgICAgIC8vIERlYnVnIG9ubHkuXHJcbiAgICAgIC8vIHdyaXRlU3RyZWFtLmVtaXQoJ2NodW5rJywge1xyXG4gICAgICAvLyAgIEVUYWc6IHJlc3VsdC5FVGFnLFxyXG4gICAgICAvLyAgIFBhcnROdW1iZXI6IGxvY2FsQ2h1bmtOdW1iZXIsXHJcbiAgICAgIC8vICAgcmVjZWl2ZWRTaXplOiByZWNlaXZlZFNpemUsXHJcbiAgICAgIC8vICAgdXBsb2FkZWRTaXplOiB1cGxvYWRlZFNpemVcclxuICAgICAgLy8gfSk7XHJcblxyXG4gICAgICAvLyBXaGlsZSBpbmNvbWluZyBzdHJlYW0gaXMgZmluaXNoZWQgYW5kIHdlIGhhdmUgdXBsb2FkZWQgZXZlcnl0aGluZyxcclxuICAgICAgLy8gd2Ugd291bGQgZnVydGhlciBub3RpY2UgT1NTXHJcbiAgICAgIGlmICh3cml0ZVN0cmVhbS5fd3JpdGFibGVTdGF0ZS5lbmRlZCA9PT0gdHJ1ZSAmJlxyXG4gICAgICAgICAgdXBsb2FkZWRTaXplID09PSByZWNlaXZlZFNpemUgJiYgbGFzdENodW5rKSB7XHJcbiAgICAgICAgY2xvc2VVcGxvYWRTdHJlYW0oKTtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH07XHJcblxyXG4gIC8qKlxyXG4gICAqIFNodXRzIGRvd24gdXBsb2FkIHN0cmVhbSwgY2FsbHMgQWxpeXVuIHRvIG1lcmdlIGV2ZXJ5IGNodW5rIG9mIGZpbGVcclxuICAgKiBAcmV0dXJuIHt1bmRlZmluZWR9XHJcbiAgICovXHJcbiAgZnVuY3Rpb24gY2xvc2VVcGxvYWRTdHJlYW0oKSB7XHJcbiAgICAvLyBOb3QgcG9zc2libGUgd2l0aG91dCBtdWx0aXBhcnQgdXBsb2FkIGlkXHJcbiAgICBpZiAoIW11bHRpcGFydFVwbG9hZElEKSB7XHJcbiAgICAgIHJldHVybjtcclxuICAgIH1cclxuXHJcbiAgICBzZWxmLmNvbXBsZXRlTXVsdGlwYXJ0VXBsb2FkKHtcclxuICAgICAgQnVja2V0OiBwYXJhbXMuQnVja2V0LFxyXG4gICAgICBLZXk6IHBhcmFtcy5LZXksXHJcbiAgICAgIFVwbG9hZElkOiBtdWx0aXBhcnRVcGxvYWRJRCxcclxuICAgICAgQ29tcGxldGVNdWx0aXBhcnRVcGxvYWQ6IHtQYXJ0czogcGFydHN9XHJcbiAgICB9LCBmdW5jdGlvbihlcnJvciwgcmVzdWx0KSB7XHJcbiAgICAgIGlmIChlcnJvcikge1xyXG4gICAgICAgIGFib3J0VXBsb2FkKCdPU1MgQ2xpZW50IEVycm9yIGF0IENvbWxldGlvbjogJyArIEpTT04uc3RyaW5naWZ5KGVycm9yKSk7XHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBpZiAoRlMuZGVidWcpIHtcclxuICAgICAgICBjb25zb2xlLmxvZygnU0EgT1NTIC0gRE9ORSEhJyk7XHJcbiAgICAgIH1cclxuICAgICAgd3JpdGVTdHJlYW0uZW1pdCgnc3RvcmVkJywge1xyXG4gICAgICAgIGZpbGVLZXk6IGZpbGVLZXksXHJcbiAgICAgICAgc2l6ZTogdXBsb2FkZWRTaXplLFxyXG4gICAgICAgIHN0b3JlZEF0OiBuZXcgRGF0ZSgpXHJcbiAgICAgIH0pO1xyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBXaGVuIGEgZmF0YWwgZXJyb3Igb2NjdXJzIGFib3J0IHRoZSBtdWx0aXBhcnQgdXBsb2FkXHJcbiAgICogQHBhcmFtICB7U3RyaW5nfSBlcnJvclRleHQgRXJyb3IgdGV4dFxyXG4gICAqIEByZXR1cm4ge3VuZGVmaW5lZH1cclxuICAgKi9cclxuICBmdW5jdGlvbiBhYm9ydFVwbG9hZChlcnJvclRleHQpIHtcclxuICAgIHNlbGYuYWJvcnRNdWx0aXBhcnRVcGxvYWQoe1xyXG4gICAgICBCdWNrZXQ6IHBhcmFtcy5CdWNrZXQsXHJcbiAgICAgIEtleTogcGFyYW1zLktleSxcclxuICAgICAgVXBsb2FkSWQ6IG11bHRpcGFydFVwbG9hZElEXHJcbiAgICB9LCBmdW5jdGlvbihhYm9ydEVycm9yKSB7XHJcbiAgICAgIGlmIChhYm9ydEVycm9yKSB7XHJcbiAgICAgICAgd3JpdGVTdHJlYW0uZW1pdCgnZXJyb3InLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgZXJyb3JUZXh0ICsgJ1xcbk9TUyBDbGllbnQgQWJvcnQgRXJyb3I6ICcgKyBhYm9ydEVycm9yKTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICB3cml0ZVN0cmVhbS5lbWl0KCdlcnJvcicsIGVycm9yVGV4dCk7XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG4gIH07XHJcblxyXG4gIHNlbGYuY3JlYXRlTXVsdGlwYXJ0VXBsb2FkKHBhcmFtcywgZnVuY3Rpb24oZXJyb3IsIGRhdGEpIHtcclxuICAgIGlmIChlcnJvcikge1xyXG4gICAgICB3cml0ZVN0cmVhbS5lbWl0KCdlcnJvcicsICdPU1MgQ2xpZW50IEVycm9yOiAnICsgSlNPTi5zdHJpbmdpZnkoZXJyb3IpKTtcclxuICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG4gICAgbXVsdGlwYXJ0VXBsb2FkSUQgPSBkYXRhLlVwbG9hZElkO1xyXG4gICAgLy8gQ2FsbCBhd2FpdGluZyBjYWxsYmFjayB0byBzdGFydCB1cGxvYWRcclxuICAgIGlmICh0eXBlb2YgYXdhaXRpbmdDYWxsYmFjayA9PT0gJ2Z1bmN0aW9uJykge1xyXG4gICAgICBhd2FpdGluZ0NhbGxiYWNrKCk7XHJcbiAgICB9XHJcbiAgfSk7XHJcblxyXG4gIHJldHVybiB3cml0ZVN0cmVhbTtcclxufTtcclxuIl19
