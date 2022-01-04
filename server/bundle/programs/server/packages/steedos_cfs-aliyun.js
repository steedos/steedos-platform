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
var Aliyun, o, s;

var require = meteorInstall({"node_modules":{"meteor":{"steedos:cfs-aliyun":{"checkNpm.js":function module(require,exports,module){

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

},"aliyun.server.js":function module(){

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
      timeout: 60000
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

},"aliyun.stream.js":function module(require){

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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvczpjZnMtYWxpeXVuL2NoZWNrTnBtLmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zOmNmcy1hbGl5dW4vYWxpeXVuLnNlcnZlci5qcyIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvczpjZnMtYWxpeXVuL2FsaXl1bi5zdHJlYW0uanMiXSwibmFtZXMiOlsiY2hlY2tOcG1WZXJzaW9ucyIsIm1vZHVsZSIsImxpbmsiLCJ2IiwiTWV0ZW9yIiwic2V0dGluZ3MiLCJjZnMiLCJhbGl5dW4iLCJBbGl5dW4iLCJyZXF1aXJlIiwiRlMiLCJTdG9yZSIsIk9TUyIsIm5hbWUiLCJvcHRpb25zIiwic2VsZiIsIkVycm9yIiwiZm9sZGVyIiwibGVuZ3RoIiwicmVwbGFjZSIsImJ1Y2tldCIsImRlZmF1bHRBY2wiLCJBQ0wiLCJyZWdpb24iLCJlbmRwb2ludCIsInNlcnZpY2VQYXJhbXMiLCJVdGlsaXR5IiwiZXh0ZW5kIiwiYWNjZXNzS2V5SWQiLCJzZWNyZXRBY2Nlc3NLZXkiLCJodHRwT3B0aW9ucyIsInRpbWVvdXQiLCJhcGlWZXJzaW9uIiwib3NzU3RvcmUiLCJwaWNrIiwib2JqIiwia2V5cyIsInJlc3VsdCIsIml0ZXJhdGVlIiwiYXJndW1lbnRzIiwiaSIsImtleSIsImhhc093blByb3BlcnR5IiwiU3RvcmFnZUFkYXB0ZXIiLCJ0eXBlTmFtZSIsImZpbGVLZXkiLCJmaWxlT2JqIiwiaW5mbyIsIl9nZXRJbmZvIiwiZmlsZW5hbWUiLCJmaWxlbmFtZUluU3RvcmUiLCJzdG9yZSIsImNvbGxlY3Rpb25OYW1lIiwiX2lkIiwiY3JlYXRlUmVhZFN0cmVhbSIsIkJ1Y2tldCIsIktleSIsImNyZWF0ZVdyaXRlU3RyZWFtIiwiYWxpYXNlcyIsImNvbnRlbnRUeXBlIiwibWV0YWRhdGEiLCJyZW1vdmUiLCJjYWxsYmFjayIsImRlbGV0ZU9iamVjdCIsImVycm9yIiwiY29uc29sZSIsImxvZyIsIndhdGNoIiwic3RyZWFtIiwicHJvdG90eXBlIiwicGFyYW1zIiwib3B0aW9uIiwibyIsImdldE9iamVjdCIsInMiLCJfYWxpeXVuT2JqZWN0IiwiX21heExpc3RlbmVycyIsIndyaXRlU3RyZWFtIiwiV3JpdGFibGUiLCJoaWdoV2F0ZXJNYXJrIiwibXVsdGlwYXJ0VXBsb2FkSUQiLCJjaHVua1NpemVUaHJlYXNob2xkIiwiYXdhaXRpbmdDYWxsYmFjayIsImN1cnJlbnRDaHVuayIsIkJ1ZmZlciIsImNodW5rTnVtYmVyIiwicGFydHMiLCJyZWNlaXZlZFNpemUiLCJ1cGxvYWRlZFNpemUiLCJydW5XaGVuUmVhZHkiLCJfd3JpdGUiLCJpbmNvbWluZ0NodW5rIiwiZW5jIiwibmV4dCIsImNvbmNhdCIsImZsdXNoQ2h1bmsiLCJfb3JpZ2luYWxFbmQiLCJlbmQiLCJjaHVuayIsImVuY29kaW5nIiwiY2FsbCIsImxhc3RDaHVuayIsInVwbG9hZGluZ0NodW5rIiwiY29weSIsImxvY2FsQ2h1bmtOdW1iZXIiLCJ1cGxvYWRQYXJ0IiwiQm9keSIsIlVwbG9hZElkIiwiUGFydE51bWJlciIsInVwbG9hZFBhcnRDYWxsYmFjayIsImFib3J0VXBsb2FkIiwiSlNPTiIsInN0cmluZ2lmeSIsIkVUYWciLCJfd3JpdGFibGVTdGF0ZSIsImVuZGVkIiwiY2xvc2VVcGxvYWRTdHJlYW0iLCJjb21wbGV0ZU11bHRpcGFydFVwbG9hZCIsIkNvbXBsZXRlTXVsdGlwYXJ0VXBsb2FkIiwiUGFydHMiLCJkZWJ1ZyIsImVtaXQiLCJzaXplIiwic3RvcmVkQXQiLCJEYXRlIiwiZXJyb3JUZXh0IiwiYWJvcnRNdWx0aXBhcnRVcGxvYWQiLCJhYm9ydEVycm9yIiwiY3JlYXRlTXVsdGlwYXJ0VXBsb2FkIiwiZGF0YSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLElBQUlBLGdCQUFKO0FBQXFCQyxNQUFNLENBQUNDLElBQVAsQ0FBWSxvQ0FBWixFQUFpRDtBQUFDRixrQkFBZ0IsQ0FB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QUVlLE1BQU0sQ0FBQ2YsTUFEUztBQUV4QkMsU0FBRyxFQUFFYyxNQUFNLENBQUNkLEdBRlk7QUFHeEJtRCxjQUFRLEVBQUUzQjtBQUhjLEtBQTFCLEVBSUcsVUFBUytDLFVBQVQsRUFBcUI7QUFDdEIsVUFBSUEsVUFBSixFQUFnQjtBQUNkbEQsbUJBQVcsQ0FBQzRDLElBQVosQ0FBaUIsT0FBakIsRUFDaUJJLFNBQVMsR0FBRyw0QkFBWixHQUEyQ0UsVUFENUQ7QUFFRCxPQUhELE1BR087QUFDTGxELG1CQUFXLENBQUM0QyxJQUFaLENBQWlCLE9BQWpCLEVBQTBCSSxTQUExQjtBQUNEO0FBQ0YsS0FYRDtBQVlEOztBQUFBO0FBRUQ5RyxNQUFJLENBQUNpSCxxQkFBTCxDQUEyQjFELE1BQTNCLEVBQW1DLFVBQVNOLEtBQVQsRUFBZ0JpRSxJQUFoQixFQUFzQjtBQUN2RCxRQUFJakUsS0FBSixFQUFXO0FBQ1RhLGlCQUFXLENBQUM0QyxJQUFaLENBQWlCLE9BQWpCLEVBQTBCLHVCQUF1QlYsSUFBSSxDQUFDQyxTQUFMLENBQWVoRCxLQUFmLENBQWpEO0FBQ0E7QUFDRDs7QUFDRGdCLHFCQUFpQixHQUFHaUQsSUFBSSxDQUFDdEIsUUFBekIsQ0FMdUQsQ0FNdkQ7O0FBQ0EsUUFBSSxPQUFPekIsZ0JBQVAsS0FBNEIsVUFBaEMsRUFBNEM7QUFDMUNBLHNCQUFnQjtBQUNqQjtBQUNGLEdBVkQ7QUFZQSxTQUFPTCxXQUFQO0FBQ0QsQ0F0TEQsQyIsImZpbGUiOiIvcGFja2FnZXMvc3RlZWRvc19jZnMtYWxpeXVuLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtcclxuICBjaGVja05wbVZlcnNpb25zXHJcbn0gZnJvbSAnbWV0ZW9yL3RtZWFzZGF5OmNoZWNrLW5wbS12ZXJzaW9ucyc7XHJcblxyXG5pZiAoTWV0ZW9yLnNldHRpbmdzICYmIE1ldGVvci5zZXR0aW5ncy5jZnMgJiYgTWV0ZW9yLnNldHRpbmdzLmNmcy5hbGl5dW4pIHtcclxuICBjaGVja05wbVZlcnNpb25zKHtcclxuICAgICdhbGl5dW4tc2RrJzogJ14xLjkuMidcclxuICB9LCAnc3RlZWRvczpjZnMtYWxpeXVuJyk7XHJcblxyXG4gIEFsaXl1biA9IHJlcXVpcmUoJ2FsaXl1bi1zZGsnKTtcclxufSIsImlmICghQWxpeXVuKVxyXG4gIHJldHVybjtcclxuXHJcbi8vIFdlIHVzZSB0aGUgb2ZmaWNpYWwgYXdzIHNka1xyXG5cclxuLyoqXHJcbiAqIENyZWF0ZXMgYW4gQWxpeXVuIE9TUyBzdG9yZSBpbnN0YW5jZSBvbiBzZXJ2ZXIuIEluaGVyaXRzIGBGUy5TdG9yYWdlQWRhcHRlcmBcclxuICogdHlwZS5cclxuICpcclxuICogQHB1YmxpY1xyXG4gKiBAY29uc3RydWN0b3JcclxuICogQHBhcmFtIHtTdHJpbmd9IG5hbWUgICAgICBUaGUgc3RvcmUgbmFtZVxyXG4gKiBAcGFyYW0ge09iamVjdH0gb3B0aW9ucyAgIFN0b3JhZ2Ugb3B0aW9uc1xyXG4gKiBAcmV0dXJuIHtGUy5TdG9yZS5PU1N9ICAgIEFuIGluc3RhbmNlIG9mIEZTLlN0b3JhZ2VBZGFwdGVyLlxyXG4gKi9cclxuRlMuU3RvcmUuT1NTID0gZnVuY3Rpb24obmFtZSwgb3B0aW9ucykge1xyXG4gIHZhciBzZWxmID0gdGhpcztcclxuICBpZiAoIShzZWxmIGluc3RhbmNlb2YgRlMuU3RvcmUuT1NTKSkge1xyXG4gICAgdGhyb3cgbmV3IEVycm9yKCdGUy5TdG9yZS5PU1MgbWlzc2luZyBrZXl3b3JkIFwibmV3XCInKTtcclxuICB9XHJcblxyXG4gIG9wdGlvbnMgPSBvcHRpb25zIHx8IHt9O1xyXG5cclxuICAvLyBEZXRlcm1pbmUgd2hpY2ggZm9sZGVyIChrZXkgcHJlZml4KSBpbiB0aGUgYnVja2V0IHRvIHVzZVxyXG4gIHZhciBmb2xkZXIgPSBvcHRpb25zLmZvbGRlcjtcclxuICBmb2xkZXIgPSB0eXBlb2YgZm9sZGVyID09PSAnc3RyaW5nJyAmJiBmb2xkZXIubGVuZ3RoID9cclxuICAgIGZvbGRlci5yZXBsYWNlKC9eXFwvLywgJycpLnJlcGxhY2UoL1xcLz8kLywgJy8nKSA6ICcnO1xyXG4gIGZvbGRlciA9IGZvbGRlciA9PT0gJy8nID8gJycgOiBmb2xkZXI7XHJcblxyXG4gIC8vIERldGVybWluZSB3aGljaCBidWNrZXQgdG8gdXNlLCByZXJ1aXJlZFxyXG4gIHZhciBidWNrZXQgPSBvcHRpb25zLmJ1Y2tldDtcclxuICBpZiAoIWJ1Y2tldCkge1xyXG4gICAgdGhyb3cgbmV3IEVycm9yKCdGUy5TdG9yZS5PU1MgcmVxdWlyZXMgXCJidWNrZWN0XCInKTtcclxuICB9XHJcblxyXG4gIC8vIFRob3NlIEFDTCB2YWx1ZXMgYXJlIGFsbG93ZWQ6ICdwcml2YXRlJywgJ3B1YmxpYy1yZWFkJywgJ3B1YmxpYy1yZWFkLXdyaXRlJ1xyXG4gIHZhciBkZWZhdWx0QWNsID0gb3B0aW9ucy5BQ0wgfHwgJ3ByaXZhdGUnO1xyXG5cclxuICB2YXIgcmVnaW9uID0gb3B0aW9ucy5yZWdpb24gfHwgJ29zcy1jbi1iZWlqaW5nJztcclxuICAvLyB2YXIgcmVnaW9uTGlzdCA9IFsnb3NzLWNuLWhhbmd6aG91JywgJ29zcy1jbi1iZWlqaW5nJywgJ29zcy1jbi1xaW5nZGFvJyxcclxuICAvLyAgICAgICAgICAgICAgICAgICAnb3NzLWNuLXNoZW56aGVuJywgJ29zcy1jbi1ob25na29uZyddO1xyXG4gIC8vIGlmIChyZWdpb25MaXN0LmluZGV4T2YocmVnaW9uKSA9PT0gLTEpIHtcclxuICAvLyAgIHRocm93IG5ldyBFcnJvcignRlMuU3RvcmUuT1NTIGludmFsaWQgcmVnaW9uJyk7XHJcbiAgLy8gfVxyXG5cclxuICAvLyB2YXIgZW5kcG9pbnQgPSAnaHR0cDovLycgKyByZWdpb24gKyAob3B0aW9ucy5pbnRlcm5hbCA/ICctaW50ZXJuYWwnIDogJycpICtcclxuICAvLyAgICAgICAgICAgICAgICAnLmFsaXl1bmNzLmNvbSc7XHJcbiAgdmFyIGVuZHBvaW50ID0gJ2h0dHA6Ly8nICsgcmVnaW9uICsgJy5hbGl5dW5jcy5jb20nO1xyXG5cclxuICB2YXIgc2VydmljZVBhcmFtcyA9IEZTLlV0aWxpdHkuZXh0ZW5kKHtcclxuICAgIGFjY2Vzc0tleUlkOiBudWxsLCAvLyBSZXF1aXJlZFxyXG4gICAgc2VjcmV0QWNjZXNzS2V5OiBudWxsLCAvLyBSZXF1aXJlZFxyXG4gICAgZW5kcG9pbnQ6IGVuZHBvaW50LFxyXG4gICAgaHR0cE9wdGlvbnM6IHtcclxuICAgICAgdGltZW91dDogNjAwMDBcclxuICAgIH0sXHJcbiAgICBhcGlWZXJzaW9uOiAnMjAxMy0xMC0xNScgLy8gUmVxdWlyZWQsIERPIE5PVCBVUERBVEVcclxuICB9LCBvcHRpb25zKTtcclxuXHJcbiAgLy8gQ3JlYXRlIFMzIHNlcnZpY2VcclxuICB2YXIgb3NzU3RvcmUgPSBuZXcgQWxpeXVuLk9TUyhzZXJ2aWNlUGFyYW1zKTtcclxuXHJcbiAgLyoqXHJcbiAgICogUGljayBrZXlzIGZyb20gb2JqZWN0XHJcbiAgICogQHBhcmFtICB7T2JqZWN0fSBvYmogIE9yaWdpbmFsIG9iamVjdFxyXG4gICAqIEBwYXJhbSAge0FycmF5fSAga2V5cyBBcnJheSBvZiBrZXlzIHRvIGJlIHByZXNlcnZlZFxyXG4gICAqIEByZXR1cm4ge09iamVjdH0gICAgICBOZXcgb2JqZWN0XHJcbiAgICovXHJcbiAgZnVuY3Rpb24gcGljayhvYmosIGtleXMpIHtcclxuICAgIHZhciByZXN1bHQgPSB7fSxcclxuICAgICAgaXRlcmF0ZWUgPSBrZXlzWzBdO1xyXG4gICAgaWYgKG9iaiA9PSBudWxsIHx8IGFyZ3VtZW50cy5sZW5ndGggPCAyKSByZXR1cm4gcmVzdWx0O1xyXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBrZXlzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgIHZhciBrZXkgPSBrZXlzW2ldO1xyXG4gICAgICBpZiAob2JqLmhhc093blByb3BlcnR5KGtleSkpIHtcclxuICAgICAgICByZXN1bHRba2V5XSA9IG9ialtrZXldO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgICByZXR1cm4gcmVzdWx0O1xyXG4gIH1cclxuXHJcbiAgcmV0dXJuIG5ldyBGUy5TdG9yYWdlQWRhcHRlcihuYW1lLCBvcHRpb25zLCB7XHJcbiAgICB0eXBlTmFtZTogJ3N0b3JhZ2Uub3NzJyxcclxuICAgIGZpbGVLZXk6IGZ1bmN0aW9uKGZpbGVPYmopIHtcclxuICAgICAgLy8gTG9va3VwIHRoZSBjb3B5XHJcbiAgICAgIHZhciBpbmZvID0gZmlsZU9iaiAmJiBmaWxlT2JqLl9nZXRJbmZvKG5hbWUpO1xyXG4gICAgICAvLyBJZiB0aGUgc3RvcmUgYW5kIGtleSBpcyBmb3VuZCByZXR1cm4gdGhlIGtleVxyXG4gICAgICBpZiAoaW5mbyAmJiBpbmZvLmtleSkgcmV0dXJuIGluZm8ua2V5O1xyXG5cclxuICAgICAgdmFyIGZpbGVuYW1lID0gZmlsZU9iai5uYW1lKCk7XHJcbiAgICAgIHZhciBmaWxlbmFtZUluU3RvcmUgPSBmaWxlT2JqLm5hbWUoe1xyXG4gICAgICAgIHN0b3JlOiBuYW1lXHJcbiAgICAgIH0pO1xyXG5cclxuICAgICAgLy8gSWYgbm8gc3RvcmUga2V5IGZvdW5kIHdlIHJlc29sdmUgLyBnZW5lcmF0ZSBhIGtleVxyXG4gICAgICByZXR1cm4gZmlsZU9iai5jb2xsZWN0aW9uTmFtZSArICcvJyArIGZpbGVPYmouY29sbGVjdGlvbk5hbWUgKyBcIi1cIiArXHJcbiAgICAgICAgZmlsZU9iai5faWQgKyAnLScgKyAoZmlsZW5hbWVJblN0b3JlIHx8IGZpbGVuYW1lKTtcclxuICAgIH0sXHJcblxyXG4gICAgY3JlYXRlUmVhZFN0cmVhbTogZnVuY3Rpb24oZmlsZUtleSwgb3B0aW9ucykge1xyXG4gICAgICByZXR1cm4gb3NzU3RvcmUuY3JlYXRlUmVhZFN0cmVhbSh7XHJcbiAgICAgICAgQnVja2V0OiBidWNrZXQsXHJcbiAgICAgICAgS2V5OiBmaWxlS2V5XHJcbiAgICAgIH0sIG9wdGlvbnMpO1xyXG4gICAgfSxcclxuICAgIC8vIENvbW1lbnQgdG8gZG9jdW1lbnRhdGlvbjogU2V0IG9wdGlvbnMuQ29udGVudExlbmd0aCBvdGhlcndpc2UgdGhlXHJcbiAgICAvLyBpbmRpcmVjdCBzdHJlYW0gd2lsbCBiZSB1c2VkIGNyZWF0aW5nIGV4dHJhIG92ZXJoZWFkIG9uIHRoZSBmaWxlc3lzdGVtLlxyXG4gICAgLy8gQW4gZWFzeSB3YXkgaWYgdGhlIGRhdGEgaXMgbm90IHRyYW5zZm9ybWVkIGlzIHRvIHNldCB0aGVcclxuICAgIC8vIG9wdGlvbnMuQ29udGVudExlbmd0aCA9IGZpbGVPYmouc2l6ZSAuLi5cclxuICAgIGNyZWF0ZVdyaXRlU3RyZWFtOiBmdW5jdGlvbihmaWxlS2V5LCBvcHRpb25zKSB7XHJcbiAgICAgIG9wdGlvbnMgPSBvcHRpb25zIHx8IHt9O1xyXG5cclxuICAgICAgLy8gV2UgZG9udCBzdXBwb3J0IGFycmF5IG9mIGFsaWFzZXNcclxuICAgICAgZGVsZXRlIG9wdGlvbnMuYWxpYXNlcztcclxuICAgICAgLy8gV2UgZG9udCBzdXBwb3J0IGNvbnRlbnRUeXBlXHJcbiAgICAgIGRlbGV0ZSBvcHRpb25zLmNvbnRlbnRUeXBlO1xyXG4gICAgICAvLyBXZSBkb250IHN1cHBvcnQgbWV0YWRhdGEgdXNlIE1ldGFkYXRhP1xyXG4gICAgICBkZWxldGUgb3B0aW9ucy5tZXRhZGF0YTtcclxuXHJcbiAgICAgIC8vIFNldCBvcHRpb25zXHJcbiAgICAgIHZhciBvcHRpb25zID0gRlMuVXRpbGl0eS5leHRlbmQoe1xyXG4gICAgICAgIEJ1Y2tldDogYnVja2V0LFxyXG4gICAgICAgIEtleTogZm9sZGVyICsgZmlsZUtleSxcclxuICAgICAgICBBQ0w6IGRlZmF1bHRBY2xcclxuICAgICAgfSwgb3B0aW9ucyk7XHJcblxyXG4gICAgICByZXR1cm4gb3NzU3RvcmUuY3JlYXRlV3JpdGVTdHJlYW0ob3B0aW9ucyk7XHJcbiAgICB9LFxyXG4gICAgcmVtb3ZlOiBmdW5jdGlvbihmaWxlS2V5LCBjYWxsYmFjaykge1xyXG5cclxuICAgICAgb3NzU3RvcmUuZGVsZXRlT2JqZWN0KHtcclxuICAgICAgICBCdWNrZXQ6IGJ1Y2tldCxcclxuICAgICAgICBLZXk6IGZpbGVLZXlcclxuICAgICAgfSwgZnVuY3Rpb24oZXJyb3IpIHtcclxuICAgICAgICBjb25zb2xlLmxvZyhlcnJvcik7XHJcbiAgICAgICAgY2FsbGJhY2soZXJyb3IsICFlcnJvcik7XHJcbiAgICAgIH0pO1xyXG4gICAgICAvLyBjYWxsYmFjayhudWxsLCB0cnVlKTtcclxuICAgIH0sXHJcbiAgICB3YXRjaDogZnVuY3Rpb24oKSB7XHJcbiAgICAgIHRocm93IG5ldyBFcnJvcignT1NTIGRvZXMgbm90IHN1cHBvcnQgd2F0Y2guJyk7XHJcbiAgICB9XHJcbiAgfSk7XHJcbn07IiwiaWYgKCFBbGl5dW4pXHJcbiAgcmV0dXJuO1xyXG5cclxudmFyIHN0cmVhbSA9IHJlcXVpcmUoJ3N0cmVhbScpO1xyXG5cclxuLyoqXHJcbiAqIFdyYXBzIG9mZmljaWFsIHB1dCBzdHJlYW1cclxuICogQHBhcmFtICB7W3R5cGVdfSBwYXJhbXMgW2Rlc2NyaXB0aW9uXVxyXG4gKiBAcGFyYW0gIHtbdHlwZV19IG9wdGlvbiBbZGVzY3JpcHRpb25dXHJcbiAqIEByZXR1cm4ge1t0eXBlXX0gICAgICAgIFtkZXNjcmlwdGlvbl1cclxuICovXHJcbkFsaXl1bi5PU1MucHJvdG90eXBlLmNyZWF0ZVJlYWRTdHJlYW0gPSBmdW5jdGlvbihwYXJhbXMsIG9wdGlvbikge1xyXG4gIG8gPSB0aGlzLmdldE9iamVjdChwYXJhbXMpO1xyXG4gIHMgPSBvLmNyZWF0ZVJlYWRTdHJlYW0oKTtcclxuICBzLl9hbGl5dW5PYmplY3QgPSBvO1xyXG4gIHMuX21heExpc3RlbmVycyA9IDEwMDtcclxuICByZXR1cm4gcztcclxufTtcclxuXHJcbi8qKlxyXG4gKiBDcmVhdGVzIGdldCBwdXQgc3RyZWFtLCBpbnNwaXJlZCBieSBnaXRodWIuY29tL21ldGVvcm1hdHQ6XHJcbiAqIGh0dHBzOi8vZ2l0aHViLmNvbS9tZXRlb3JtYXR0L29zcy11cGxvYWQtc3RyZWFtXHJcbiAqIEBwYXJhbSAge09iamVjdH0gcGFyYW1zIENvbGxlY3Rpb25GUyBQYXJhbXNcclxuICogQHBhcmFtICB7T2JqZWN0fSBvcHRpb24gQ29sbGVjdGlvbkZTIE9wdGlvbnNcclxuICogQHJldHVybiB7U3RyZWFtfSAgICAgICAgd3JpdGVTdHJlYW0gb2JqZWN0XHJcbiAqL1xyXG5BbGl5dW4uT1NTLnByb3RvdHlwZS5jcmVhdGVXcml0ZVN0cmVhbSA9IGZ1bmN0aW9uKHBhcmFtcywgb3B0aW9uKSB7XHJcbiAgdmFyIHNlbGYgPSB0aGlzO1xyXG5cclxuICAvLyBTY29wZSB2YXJpYWJsZXNcclxuICAvLyBDcmVhdGUgdGhlIHdyaXRhYmxlIHN0cmVhbSBpbnRlcmZhY2UuXHJcbiAgdmFyIHdyaXRlU3RyZWFtID0gbmV3IHN0cmVhbS5Xcml0YWJsZSh7aGlnaFdhdGVyTWFyazogNDE5NDMwNH0pOyAvLyA0TUJcclxuICB2YXIgbXVsdGlwYXJ0VXBsb2FkSUQgPSBudWxsO1xyXG4gIHZhciBjaHVua1NpemVUaHJlYXNob2xkID0gNTI0Mjg4MDtcclxuICB2YXIgYXdhaXRpbmdDYWxsYmFjaztcclxuICB2YXIgZmlsZUtleSA9IHBhcmFtcyAmJiAocGFyYW1zLmZpbGVLZXkgfHwgcGFyYW1zLktleSk7XHJcblxyXG4gIC8vIEN1cnJlbnQgY2h1bmtcclxuICB2YXIgY3VycmVudENodW5rID0gQnVmZmVyKDApO1xyXG4gIHZhciBjaHVua051bWJlciA9IDE7XHJcblxyXG4gIC8vIFN0YXR1c1xyXG4gIHZhciBwYXJ0cyA9IFtdO1xyXG4gIHZhciByZWNlaXZlZFNpemUgPSAwO1xyXG4gIHZhciB1cGxvYWRlZFNpemUgPSAwO1xyXG5cclxuICB2YXIgcnVuV2hlblJlYWR5ID0gZnVuY3Rpb24oY2FsbGJhY2spIHtcclxuICAgIC8vIElmIHdlIGRvbnQgaGF2ZSBhIHVwbG9hZCBpZCB3ZSBhcmUgbm90IHJlYWR5XHJcbiAgICBpZiAobXVsdGlwYXJ0VXBsb2FkSUQgPT09IG51bGwpIHtcclxuICAgICAgLy8gV2Ugc2V0IHRoZSB3YWl0aW5nIGNhbGxiYWNrXHJcbiAgICAgIGF3YWl0aW5nQ2FsbGJhY2sgPSBjYWxsYmFjaztcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIC8vIE5vIHByb2JsZW0gLSBqdXN0IGNvbnRpbnVlXHJcbiAgICAgIGNhbGxiYWNrKCk7XHJcbiAgICB9XHJcbiAgfTtcclxuXHJcbiAgLy8gSGFuZGxlciB0byByZWNlaXZlIGRhdGEgYW5kIHVwbG9hZCBpdCB0byBPU1MuXHJcbiAgd3JpdGVTdHJlYW0uX3dyaXRlID0gZnVuY3Rpb24oaW5jb21pbmdDaHVuaywgZW5jLCBuZXh0KSB7XHJcbiAgICBjdXJyZW50Q2h1bmsgPSBCdWZmZXIuY29uY2F0KFtjdXJyZW50Q2h1bmssIGluY29taW5nQ2h1bmtdKTtcclxuXHJcbiAgICAvLyBXaGlsZSB0aGUgY3VycmVudCBjaHVuayBpcyBsYXJnZXIgdGhhbiBjaHVua1NpemVUaHJlYXNob2xkLCB3ZSBmbHVzaFxyXG4gICAgLy8gdGhlIGNodW5rIGJ1ZmZlciB0byBPU1MgdmlhIG11bHRpcGFydCB1cGxvYWQuXHJcbiAgICBpZiAoY3VycmVudENodW5rLmxlbmd0aCA+IGNodW5rU2l6ZVRocmVhc2hvbGQpIHtcclxuICAgICAgLy8gVXBsb2FkIHdoZW4gbmVjZXNzYXJ5O1xyXG4gICAgICBydW5XaGVuUmVhZHkoZnVuY3Rpb24oKSB7IGZsdXNoQ2h1bmsobmV4dCwgZmFsc2UpOyB9KTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHJ1bldoZW5SZWFkeShuZXh0KTtcclxuICAgIH1cclxuICB9O1xyXG5cclxuICAvLyBIaWphY2sgdGhlIGVuZCBtZXRob2QsIHNlbmQgdG8gT1NTIGFuZCBjb21wbGV0ZS5cclxuICB2YXIgX29yaWdpbmFsRW5kID0gd3JpdGVTdHJlYW0uZW5kO1xyXG4gIHdyaXRlU3RyZWFtLmVuZCA9IGZ1bmN0aW9uKGNodW5rLCBlbmNvZGluZywgY2FsbGJhY2spIHtcclxuICAgIF9vcmlnaW5hbEVuZC5jYWxsKHRoaXMsIGNodW5rLCBlbmNvZGluZywgZnVuY3Rpb24oKSB7XHJcbiAgICAgIHJ1bldoZW5SZWFkeShmdW5jdGlvbigpIHsgZmx1c2hDaHVuayhjYWxsYmFjaywgdHJ1ZSk7IH0pO1xyXG4gICAgfSk7XHJcbiAgfTtcclxuXHJcbiAgLyoqXHJcbiAgICogRmx1c2hlcyBjaHVuayB0byBBbGl5dW5cclxuICAgKiBAcGFyYW0gIHtGdW5jdGlvbn0gY2FsbGJhY2sgIENhbGxiYWNrLCBub3JtYWxseSBmb3IgbmV4dCBwYXJ0IG9mIGRhdGEuXHJcbiAgICogQHBhcmFtICB7Qm9vbGVhbn0gIGxhc3RDaHVuayBJZiBpdCdzIHRoZSBsYXN0IGNodW5rLlxyXG4gICAqIEByZXR1cm4ge3VuZGVmaW5lZH1cclxuICAgKi9cclxuICBmdW5jdGlvbiBmbHVzaENodW5rKGNhbGxiYWNrLCBsYXN0Q2h1bmspIHtcclxuICAgIGlmIChtdWx0aXBhcnRVcGxvYWRJRCA9PT0gbnVsbCkge1xyXG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ09TUyBDbGllbnQgRXJyb3I6IE1pc3NpbmcgbXVsaXRpcGFydCB1cGxvYWQgSUQnKTtcclxuICAgIH1cclxuXHJcbiAgICAvLyBDaHVuayB0byB1cGxvYWRcclxuICAgIHZhciB1cGxvYWRpbmdDaHVuayA9IEJ1ZmZlcihjdXJyZW50Q2h1bmsubGVuZ3RoKTtcclxuICAgIGN1cnJlbnRDaHVuay5jb3B5KHVwbG9hZGluZ0NodW5rKTsgLy8gY29waWVzIHRvIHRhcmdldFxyXG5cclxuICAgIHZhciBsb2NhbENodW5rTnVtYmVyID0gY2h1bmtOdW1iZXIrKztcclxuICAgIHJlY2VpdmVkU2l6ZSArPSB1cGxvYWRpbmdDaHVuay5sZW5ndGg7XHJcblxyXG4gICAgc2VsZi51cGxvYWRQYXJ0KHtcclxuICAgICAgQm9keTogdXBsb2FkaW5nQ2h1bmssXHJcbiAgICAgIEJ1Y2tldDogcGFyYW1zLkJ1Y2tldCxcclxuICAgICAgS2V5OiBwYXJhbXMuS2V5LFxyXG4gICAgICBVcGxvYWRJZDogbXVsdGlwYXJ0VXBsb2FkSUQsXHJcbiAgICAgIFBhcnROdW1iZXI6IGxvY2FsQ2h1bmtOdW1iZXJcclxuICAgIH0sIHVwbG9hZFBhcnRDYWxsYmFjayk7XHJcblxyXG4gICAgLy8gUmVzZXQgdGhlIGN1cnJlbnQgYnVmZmVyXHJcbiAgICBjdXJyZW50Q2h1bmsgPSBCdWZmZXIoMCk7XHJcblxyXG4gICAgZnVuY3Rpb24gdXBsb2FkUGFydENhbGxiYWNrKGVycm9yLCByZXN1bHQpIHtcclxuICAgICAgLy8gSGFuZGxlIGVycm9yIGFzIHRoZSB0b3AgcHJpb3JpdHk7XHJcbiAgICAgIGlmIChlcnJvcikge1xyXG4gICAgICAgIGFib3J0VXBsb2FkKCdPU1MgQ2xpZW50IEVycm9yOiAnICsgSlNPTi5zdHJpbmdpZnkoZXJyb3IpKTtcclxuICAgICAgICByZXR1cm47XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIC8vIE5leHQgcGFydCBvZiBkYXRhLlxyXG4gICAgICBpZiAodHlwZW9mIGNhbGxiYWNrID09PSAnZnVuY3Rpb24nKSB7XHJcbiAgICAgICAgY2FsbGJhY2soKTtcclxuICAgICAgfVxyXG5cclxuICAgICAgdXBsb2FkZWRTaXplICs9IHVwbG9hZGluZ0NodW5rLmxlbmd0aDtcclxuICAgICAgcGFydHNbbG9jYWxDaHVua051bWJlciAtIDFdID0ge1xyXG4gICAgICAgIEVUYWc6IHJlc3VsdC5FVGFnLFxyXG4gICAgICAgIFBhcnROdW1iZXI6IGxvY2FsQ2h1bmtOdW1iZXJcclxuICAgICAgfTtcclxuXHJcbiAgICAgIC8vIERlYnVnIG9ubHkuXHJcbiAgICAgIC8vIHdyaXRlU3RyZWFtLmVtaXQoJ2NodW5rJywge1xyXG4gICAgICAvLyAgIEVUYWc6IHJlc3VsdC5FVGFnLFxyXG4gICAgICAvLyAgIFBhcnROdW1iZXI6IGxvY2FsQ2h1bmtOdW1iZXIsXHJcbiAgICAgIC8vICAgcmVjZWl2ZWRTaXplOiByZWNlaXZlZFNpemUsXHJcbiAgICAgIC8vICAgdXBsb2FkZWRTaXplOiB1cGxvYWRlZFNpemVcclxuICAgICAgLy8gfSk7XHJcblxyXG4gICAgICAvLyBXaGlsZSBpbmNvbWluZyBzdHJlYW0gaXMgZmluaXNoZWQgYW5kIHdlIGhhdmUgdXBsb2FkZWQgZXZlcnl0aGluZyxcclxuICAgICAgLy8gd2Ugd291bGQgZnVydGhlciBub3RpY2UgT1NTXHJcbiAgICAgIGlmICh3cml0ZVN0cmVhbS5fd3JpdGFibGVTdGF0ZS5lbmRlZCA9PT0gdHJ1ZSAmJlxyXG4gICAgICAgICAgdXBsb2FkZWRTaXplID09PSByZWNlaXZlZFNpemUgJiYgbGFzdENodW5rKSB7XHJcbiAgICAgICAgY2xvc2VVcGxvYWRTdHJlYW0oKTtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH07XHJcblxyXG4gIC8qKlxyXG4gICAqIFNodXRzIGRvd24gdXBsb2FkIHN0cmVhbSwgY2FsbHMgQWxpeXVuIHRvIG1lcmdlIGV2ZXJ5IGNodW5rIG9mIGZpbGVcclxuICAgKiBAcmV0dXJuIHt1bmRlZmluZWR9XHJcbiAgICovXHJcbiAgZnVuY3Rpb24gY2xvc2VVcGxvYWRTdHJlYW0oKSB7XHJcbiAgICAvLyBOb3QgcG9zc2libGUgd2l0aG91dCBtdWx0aXBhcnQgdXBsb2FkIGlkXHJcbiAgICBpZiAoIW11bHRpcGFydFVwbG9hZElEKSB7XHJcbiAgICAgIHJldHVybjtcclxuICAgIH1cclxuXHJcbiAgICBzZWxmLmNvbXBsZXRlTXVsdGlwYXJ0VXBsb2FkKHtcclxuICAgICAgQnVja2V0OiBwYXJhbXMuQnVja2V0LFxyXG4gICAgICBLZXk6IHBhcmFtcy5LZXksXHJcbiAgICAgIFVwbG9hZElkOiBtdWx0aXBhcnRVcGxvYWRJRCxcclxuICAgICAgQ29tcGxldGVNdWx0aXBhcnRVcGxvYWQ6IHtQYXJ0czogcGFydHN9XHJcbiAgICB9LCBmdW5jdGlvbihlcnJvciwgcmVzdWx0KSB7XHJcbiAgICAgIGlmIChlcnJvcikge1xyXG4gICAgICAgIGFib3J0VXBsb2FkKCdPU1MgQ2xpZW50IEVycm9yIGF0IENvbWxldGlvbjogJyArIEpTT04uc3RyaW5naWZ5KGVycm9yKSk7XHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBpZiAoRlMuZGVidWcpIHtcclxuICAgICAgICBjb25zb2xlLmxvZygnU0EgT1NTIC0gRE9ORSEhJyk7XHJcbiAgICAgIH1cclxuICAgICAgd3JpdGVTdHJlYW0uZW1pdCgnc3RvcmVkJywge1xyXG4gICAgICAgIGZpbGVLZXk6IGZpbGVLZXksXHJcbiAgICAgICAgc2l6ZTogdXBsb2FkZWRTaXplLFxyXG4gICAgICAgIHN0b3JlZEF0OiBuZXcgRGF0ZSgpXHJcbiAgICAgIH0pO1xyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBXaGVuIGEgZmF0YWwgZXJyb3Igb2NjdXJzIGFib3J0IHRoZSBtdWx0aXBhcnQgdXBsb2FkXHJcbiAgICogQHBhcmFtICB7U3RyaW5nfSBlcnJvclRleHQgRXJyb3IgdGV4dFxyXG4gICAqIEByZXR1cm4ge3VuZGVmaW5lZH1cclxuICAgKi9cclxuICBmdW5jdGlvbiBhYm9ydFVwbG9hZChlcnJvclRleHQpIHtcclxuICAgIHNlbGYuYWJvcnRNdWx0aXBhcnRVcGxvYWQoe1xyXG4gICAgICBCdWNrZXQ6IHBhcmFtcy5CdWNrZXQsXHJcbiAgICAgIEtleTogcGFyYW1zLktleSxcclxuICAgICAgVXBsb2FkSWQ6IG11bHRpcGFydFVwbG9hZElEXHJcbiAgICB9LCBmdW5jdGlvbihhYm9ydEVycm9yKSB7XHJcbiAgICAgIGlmIChhYm9ydEVycm9yKSB7XHJcbiAgICAgICAgd3JpdGVTdHJlYW0uZW1pdCgnZXJyb3InLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgZXJyb3JUZXh0ICsgJ1xcbk9TUyBDbGllbnQgQWJvcnQgRXJyb3I6ICcgKyBhYm9ydEVycm9yKTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICB3cml0ZVN0cmVhbS5lbWl0KCdlcnJvcicsIGVycm9yVGV4dCk7XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG4gIH07XHJcblxyXG4gIHNlbGYuY3JlYXRlTXVsdGlwYXJ0VXBsb2FkKHBhcmFtcywgZnVuY3Rpb24oZXJyb3IsIGRhdGEpIHtcclxuICAgIGlmIChlcnJvcikge1xyXG4gICAgICB3cml0ZVN0cmVhbS5lbWl0KCdlcnJvcicsICdPU1MgQ2xpZW50IEVycm9yOiAnICsgSlNPTi5zdHJpbmdpZnkoZXJyb3IpKTtcclxuICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG4gICAgbXVsdGlwYXJ0VXBsb2FkSUQgPSBkYXRhLlVwbG9hZElkO1xyXG4gICAgLy8gQ2FsbCBhd2FpdGluZyBjYWxsYmFjayB0byBzdGFydCB1cGxvYWRcclxuICAgIGlmICh0eXBlb2YgYXdhaXRpbmdDYWxsYmFjayA9PT0gJ2Z1bmN0aW9uJykge1xyXG4gICAgICBhd2FpdGluZ0NhbGxiYWNrKCk7XHJcbiAgICB9XHJcbiAgfSk7XHJcblxyXG4gIHJldHVybiB3cml0ZVN0cmVhbTtcclxufTtcclxuIl19
