(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var global = Package.meteor.global;
var meteorEnv = Package.meteor.meteorEnv;
var ECMAScript = Package.ecmascript.ECMAScript;
var FS = Package['steedos:cfs-base-package'].FS;
var MongoInternals = Package.mongo.MongoInternals;
var Mongo = Package.mongo.Mongo;
var meteorInstall = Package.modules.meteorInstall;
var meteorBabelHelpers = Package['babel-runtime'].meteorBabelHelpers;
var Promise = Package.promise.Promise;

/* Package-scope variables */
var _chunkPath, _fileReference;

var require = meteorInstall({"node_modules":{"meteor":{"steedos:cfs-tempstore":{"checkNpm.js":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/steedos_cfs-tempstore/checkNpm.js                                                                          //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
let checkNpmVersions;
module.link("meteor/tmeasday:check-npm-versions", {
  checkNpmVersions(v) {
    checkNpmVersions = v;
  }

}, 0);
checkNpmVersions({
  'combined-stream': '0.0.4'
}, 'steedos:cfs-tempstore');
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"tempStore.js":function(require){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/steedos_cfs-tempstore/tempStore.js                                                                         //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
// ##Temporary Storage
//
// Temporary storage is used for chunked uploads until all chunks are received
// and all copies have been made or given up. In some cases, the original file
// is stored only in temporary storage (for example, if all copies do some
// manipulation in beforeSave). This is why we use the temporary file as the
// basis for each saved copy, and then remove it after all copies are saved.
//
// Every chunk is saved as an individual temporary file. This is safer than
// attempting to write multiple incoming chunks to different positions in a
// single temporary file, which can lead to write conflicts.
//
// Using temp files also allows us to easily resume uploads, even if the server
// restarts, and to keep the working memory clear.
// The FS.TempStore emits events that others are able to listen to
var EventEmitter = require('events').EventEmitter; // We have a special stream concating all chunk files into one readable stream


var CombinedStream = require('combined-stream');
/** @namespace FS.TempStore
 * @property FS.TempStore
 * @type {object}
 * @public
 * *it's an event emitter*
 */


FS.TempStore = new EventEmitter(); // Create a tracker collection for keeping track of all chunks for any files that are currently in the temp store

var tracker = FS.TempStore.Tracker = new Mongo.Collection('cfs._tempstore.chunks');
/**
 * @property FS.TempStore.Storage
 * @type {StorageAdapter}
 * @namespace FS.TempStore
 * @private
 * This property is set to either `FS.Store.FileSystem` or `FS.Store.GridFS`
 *
 * __When and why:__
 * We normally default to `cfs-filesystem` unless its not installed. *(we default to gridfs if installed)*
 * But if `cfs-gridfs` and `cfs-worker` is installed we default to `cfs-gridfs`
 *
 * If `cfs-gridfs` and `cfs-filesystem` is not installed we log a warning.
 * the user can set `FS.TempStore.Storage` them selfs eg.:
 * ```js
 *   // Its important to set `internal: true` this lets the SA know that we
 *   // are using this internally and it will give us direct SA api
 *   FS.TempStore.Storage = new FS.Store.GridFS('_tempstore', { internal: true });
 * ```
 *
 * > Note: This is considered as `advanced` use, its not a common pattern.
 */

FS.TempStore.Storage = null; // We will not mount a storage adapter until needed. This allows us to check for the
// existance of FS.FileWorker, which is loaded after this package because it
// depends on this package.

function mountStorage() {
  if (FS.TempStore.Storage) return; // XXX: We could replace this test, testing the FS scope for grifFS etc.
  // This is on the todo later when we get "stable"

  if (Package["steedos:cfs-gridfs"] && (Package["steedos:cfs-worker"] || !Package["steedos:cfs-filesystem"])) {
    // If the file worker is installed we would prefer to use the gridfs sa
    // for scalability. We also default to gridfs if filesystem is not found
    // Use the gridfs
    FS.TempStore.Storage = new FS.Store.GridFS('_tempstore', {
      internal: true
    });
  } else if (Package["steedos:cfs-filesystem"]) {
    // use the Filesystem
    FS.TempStore.Storage = new FS.Store.FileSystem('_tempstore', {
      path: Creator.steedosStorageDir + '/_tempstore',
      internal: true
    });
  } else {
    throw new Error('FS.TempStore.Storage is not set: Install steedos:cfs-filesystem or steedos:cfs-gridfs or set it manually');
  }

  FS.debug && console.log('TempStore is mounted on', FS.TempStore.Storage.typeName);
}

function mountFile(fileObj, name) {
  if (!fileObj.isMounted()) {
    throw new Error(name + ' cannot work with unmounted file');
  }
} // We update the fileObj on progress


FS.TempStore.on('progress', function (fileObj, chunkNum, count, total, result) {
  FS.debug && console.log('TempStore progress: Received ' + count + ' of ' + total + ' chunks for ' + fileObj.name());
}); // XXX: TODO
// FS.TempStore.on('stored', function(fileObj, chunkCount, result) {
//   // This should work if we pass on result from the SA on stored event...
//   fileObj.update({ $set: { chunkSum: 1, chunkCount: chunkCount, size: result.size } });
// });
// Stream implementation

/**
 * @method _chunkPath
 * @private
 * @param {Number} [n] Chunk number
 * @returns {String} Chunk naming convention
 */

_chunkPath = function (n) {
  return (n || 0) + '.chunk';
};
/**
 * @method _fileReference
 * @param {FS.File} fileObj
 * @param {Number} chunk
 * @private
 * @returns {String} Generated SA specific fileKey for the chunk
 *
 * Note: Calling function should call mountStorage() first, and
 * make sure that fileObj is mounted.
 */


_fileReference = function (fileObj, chunk, existing) {
  // Maybe it's a chunk we've already saved
  existing = existing || tracker.findOne({
    fileId: fileObj._id,
    collectionName: fileObj.collectionName
  }); // Make a temporary fileObj just for fileKey generation

  var tempFileObj = new FS.File({
    collectionName: fileObj.collectionName,
    _id: fileObj._id,
    original: {
      name: _chunkPath(chunk)
    },
    copies: {
      _tempstore: {
        key: existing && existing.keys[chunk]
      }
    }
  }); // Return a fitting fileKey SA specific

  return FS.TempStore.Storage.adapter.fileKey(tempFileObj);
};
/**
 * @method FS.TempStore.exists
 * @param {FS.File} File object
 * @returns {Boolean} Is this file, or parts of it, currently stored in the TempStore
 */


FS.TempStore.exists = function (fileObj) {
  var existing = tracker.findOne({
    fileId: fileObj._id,
    collectionName: fileObj.collectionName
  });
  return !!existing;
};
/**
 * @method FS.TempStore.listParts
 * @param {FS.File} fileObj
 * @returns {Object} of parts already stored
 * @todo This is not yet implemented, milestone 1.1.0
 */


FS.TempStore.listParts = function fsTempStoreListParts(fileObj) {
  var self = this;
  console.warn('This function is not correctly implemented using SA in TempStore'); //XXX This function might be necessary for resume. Not currently supported.
};
/**
 * @method FS.TempStore.removeFile
 * @public
 * @param {FS.File} fileObj
 * This function removes the file from tempstorage - it cares not if file is
 * already removed or not found, goal is reached anyway.
 */


FS.TempStore.removeFile = function fsTempStoreRemoveFile(fileObj) {
  var self = this; // Ensure that we have a storage adapter mounted; if not, throw an error.

  mountStorage(); // If fileObj is not mounted or can't be, throw an error

  mountFile(fileObj, 'FS.TempStore.removeFile'); // Emit event

  self.emit('remove', fileObj);
  var chunkInfo = tracker.findOne({
    fileId: fileObj._id,
    collectionName: fileObj.collectionName
  });

  if (chunkInfo) {
    // Unlink each file
    FS.Utility.each(chunkInfo.keys || {}, function (key, chunk) {
      var fileKey = _fileReference(fileObj, chunk, chunkInfo);

      FS.TempStore.Storage.adapter.remove(fileKey, FS.Utility.noop);
    }); // Remove fileObj from tracker collection, too

    tracker.remove({
      _id: chunkInfo._id
    });
  }
};
/**
 * @method FS.TempStore.removeAll
 * @public
 * This function removes all files from tempstorage - it cares not if file is
 * already removed or not found, goal is reached anyway.
 */


FS.TempStore.removeAll = function fsTempStoreRemoveAll() {
  var self = this; // Ensure that we have a storage adapter mounted; if not, throw an error.

  mountStorage();
  tracker.find().forEach(function (chunkInfo) {
    // Unlink each file
    FS.Utility.each(chunkInfo.keys || {}, function (key, chunk) {
      var fileKey = _fileReference({
        _id: chunkInfo.fileId,
        collectionName: chunkInfo.collectionName
      }, chunk, chunkInfo);

      FS.TempStore.Storage.adapter.remove(fileKey, FS.Utility.noop);
    }); // Remove from tracker collection, too

    tracker.remove({
      _id: chunkInfo._id
    });
  });
};
/**
 * @method FS.TempStore.createWriteStream
 * @public
 * @param {FS.File} fileObj File to store in temporary storage
 * @param {Number | String} [options]
 * @returns {Stream} Writeable stream
 *
 * `options` of different types mean differnt things:
 * * `undefined` We store the file in one part
 * *(Normal server-side api usage)*
 * * `Number` the number is the part number total
 * *(multipart uploads will use this api)*
 * * `String` the string is the name of the `store` that wants to store file data
 * *(stores that want to sync their data to the rest of the files stores will use this)*
 *
 * > Note: fileObj must be mounted on a `FS.Collection`, it makes no sense to store otherwise
 */


FS.TempStore.createWriteStream = function (fileObj, options) {
  var self = this; // Ensure that we have a storage adapter mounted; if not, throw an error.

  mountStorage(); // If fileObj is not mounted or can't be, throw an error

  mountFile(fileObj, 'FS.TempStore.createWriteStream'); // Cache the selector for use multiple times below

  var selector = {
    fileId: fileObj._id,
    collectionName: fileObj.collectionName
  }; // TODO, should pass in chunkSum so we don't need to use FS.File for it

  var chunkSum = fileObj.chunkSum || 1; // Add fileObj to tracker collection

  tracker.upsert(selector, {
    $setOnInsert: {
      keys: {}
    }
  }); // Determine how we're using the writeStream

  var isOnePart = false,
      isMultiPart = false,
      isStoreSync = false,
      chunkNum = 0;

  if (options === +options) {
    isMultiPart = true;
    chunkNum = options;
  } else if (options === '' + options) {
    isStoreSync = true;
  } else {
    isOnePart = true;
  } // XXX: it should be possible for a store to sync by storing data into the
  // tempstore - this could be done nicely by setting the store name as string
  // in the chunk variable?
  // This store name could be passed on the the fileworker via the uploaded
  // event
  // So the uploaded event can return:
  // undefined - if data is stored into and should sync out to all storage adapters
  // number - if a chunk has been uploaded
  // string - if a storage adapter wants to sync its data to the other SA's
  // Find a nice location for the chunk data


  var fileKey = _fileReference(fileObj, chunkNum); // Create the stream as Meteor safe stream


  var writeStream = FS.TempStore.Storage.adapter.createWriteStream(fileKey); // When the stream closes we update the chunkCount

  writeStream.safeOn('stored', function (result) {
    // Save key in tracker document
    var setObj = {};
    setObj['keys.' + chunkNum] = result.fileKey;
    tracker.update(selector, {
      $set: setObj
    }); // Get updated chunkCount

    var chunkCount = FS.Utility.size(tracker.findOne(selector).keys); // Progress

    self.emit('progress', fileObj, chunkNum, chunkCount, chunkSum, result); // If upload is completed

    if (chunkCount === chunkSum) {
      // We no longer need the chunk info
      var modifier = {
        $set: {},
        $unset: {
          chunkCount: 1,
          chunkSum: 1,
          chunkSize: 1
        }
      }; // Check if the file has been uploaded before

      if (typeof fileObj.uploadedAt === 'undefined') {
        // We set the uploadedAt date
        modifier.$set.uploadedAt = new Date();
      } else {
        // We have been uploaded so an event were file data is updated is
        // called synchronizing - so this must be a synchronizedAt?
        modifier.$set.synchronizedAt = new Date();
      } // Update the fileObject


      fileObj.update(modifier); // Fire ending events

      var eventName = isStoreSync ? 'synchronized' : 'stored';
      self.emit(eventName, fileObj, result); // XXX is emitting "ready" necessary?

      self.emit('ready', fileObj, chunkCount, result);
    } else {
      // Update the chunkCount on the fileObject
      fileObj.update({
        $set: {
          chunkCount: chunkCount
        }
      });
    }
  }); // Emit errors

  writeStream.on('error', function (error) {
    FS.debug && console.log('TempStore writeStream error:', error);
    self.emit('error', error, fileObj);
  });
  return writeStream;
};
/**
  * @method FS.TempStore.createReadStream
  * @public
  * @param {FS.File} fileObj The file to read
  * @return {Stream} Returns readable stream
  *
  */


FS.TempStore.createReadStream = function (fileObj) {
  // Ensure that we have a storage adapter mounted; if not, throw an error.
  mountStorage(); // If fileObj is not mounted or can't be, throw an error

  mountFile(fileObj, 'FS.TempStore.createReadStream');
  FS.debug && console.log('FS.TempStore creating read stream for ' + fileObj._id); // Determine how many total chunks there are from the tracker collection

  var chunkInfo = tracker.findOne({
    fileId: fileObj._id,
    collectionName: fileObj.collectionName
  }) || {};
  var totalChunks = FS.Utility.size(chunkInfo.keys);

  function getNextStreamFunc(chunk) {
    return Meteor.bindEnvironment(function (next) {
      var fileKey = _fileReference(fileObj, chunk);

      var chunkReadStream = FS.TempStore.Storage.adapter.createReadStream(fileKey);
      next(chunkReadStream);
    }, function (error) {
      throw error;
    });
  } // Make a combined stream


  var combinedStream = CombinedStream.create(); // Add each chunk stream to the combined stream when the previous chunk stream ends

  var currentChunk = 0;

  for (var chunk = 0; chunk < totalChunks; chunk++) {
    combinedStream.append(getNextStreamFunc(chunk));
  } // Return the combined stream


  return combinedStream;
};
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}}}}},{
  "extensions": [
    ".js",
    ".json"
  ]
});

require("/node_modules/meteor/steedos:cfs-tempstore/checkNpm.js");
require("/node_modules/meteor/steedos:cfs-tempstore/tempStore.js");

/* Exports */
Package._define("steedos:cfs-tempstore");

})();

//# sourceURL=meteor://💻app/packages/steedos_cfs-tempstore.js
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvczpjZnMtdGVtcHN0b3JlL2NoZWNrTnBtLmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zOmNmcy10ZW1wc3RvcmUvdGVtcFN0b3JlLmpzIl0sIm5hbWVzIjpbImNoZWNrTnBtVmVyc2lvbnMiLCJtb2R1bGUiLCJsaW5rIiwidiIsIkV2ZW50RW1pdHRlciIsInJlcXVpcmUiLCJDb21iaW5lZFN0cmVhbSIsIkZTIiwiVGVtcFN0b3JlIiwidHJhY2tlciIsIlRyYWNrZXIiLCJNb25nbyIsIkNvbGxlY3Rpb24iLCJTdG9yYWdlIiwibW91bnRTdG9yYWdlIiwiUGFja2FnZSIsIlN0b3JlIiwiR3JpZEZTIiwiaW50ZXJuYWwiLCJGaWxlU3lzdGVtIiwicGF0aCIsIkNyZWF0b3IiLCJzdGVlZG9zU3RvcmFnZURpciIsIkVycm9yIiwiZGVidWciLCJjb25zb2xlIiwibG9nIiwidHlwZU5hbWUiLCJtb3VudEZpbGUiLCJmaWxlT2JqIiwibmFtZSIsImlzTW91bnRlZCIsIm9uIiwiY2h1bmtOdW0iLCJjb3VudCIsInRvdGFsIiwicmVzdWx0IiwiX2NodW5rUGF0aCIsIm4iLCJfZmlsZVJlZmVyZW5jZSIsImNodW5rIiwiZXhpc3RpbmciLCJmaW5kT25lIiwiZmlsZUlkIiwiX2lkIiwiY29sbGVjdGlvbk5hbWUiLCJ0ZW1wRmlsZU9iaiIsIkZpbGUiLCJvcmlnaW5hbCIsImNvcGllcyIsIl90ZW1wc3RvcmUiLCJrZXkiLCJrZXlzIiwiYWRhcHRlciIsImZpbGVLZXkiLCJleGlzdHMiLCJsaXN0UGFydHMiLCJmc1RlbXBTdG9yZUxpc3RQYXJ0cyIsInNlbGYiLCJ3YXJuIiwicmVtb3ZlRmlsZSIsImZzVGVtcFN0b3JlUmVtb3ZlRmlsZSIsImVtaXQiLCJjaHVua0luZm8iLCJVdGlsaXR5IiwiZWFjaCIsInJlbW92ZSIsIm5vb3AiLCJyZW1vdmVBbGwiLCJmc1RlbXBTdG9yZVJlbW92ZUFsbCIsImZpbmQiLCJmb3JFYWNoIiwiY3JlYXRlV3JpdGVTdHJlYW0iLCJvcHRpb25zIiwic2VsZWN0b3IiLCJjaHVua1N1bSIsInVwc2VydCIsIiRzZXRPbkluc2VydCIsImlzT25lUGFydCIsImlzTXVsdGlQYXJ0IiwiaXNTdG9yZVN5bmMiLCJ3cml0ZVN0cmVhbSIsInNhZmVPbiIsInNldE9iaiIsInVwZGF0ZSIsIiRzZXQiLCJjaHVua0NvdW50Iiwic2l6ZSIsIm1vZGlmaWVyIiwiJHVuc2V0IiwiY2h1bmtTaXplIiwidXBsb2FkZWRBdCIsIkRhdGUiLCJzeW5jaHJvbml6ZWRBdCIsImV2ZW50TmFtZSIsImVycm9yIiwiY3JlYXRlUmVhZFN0cmVhbSIsInRvdGFsQ2h1bmtzIiwiZ2V0TmV4dFN0cmVhbUZ1bmMiLCJNZXRlb3IiLCJiaW5kRW52aXJvbm1lbnQiLCJuZXh0IiwiY2h1bmtSZWFkU3RyZWFtIiwiY29tYmluZWRTdHJlYW0iLCJjcmVhdGUiLCJjdXJyZW50Q2h1bmsiLCJhcHBlbmQiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSxJQUFJQSxnQkFBSjtBQUFxQkMsTUFBTSxDQUFDQyxJQUFQLENBQVksb0NBQVosRUFBaUQ7QUFBQ0Ysa0JBQWdCLENBQUNHLENBQUQsRUFBRztBQUFDSCxvQkFBZ0IsR0FBQ0csQ0FBakI7QUFBbUI7O0FBQXhDLENBQWpELEVBQTJGLENBQTNGO0FBQ3JCSCxnQkFBZ0IsQ0FBQztBQUNoQixxQkFBbUI7QUFESCxDQUFELEVBRWIsdUJBRmEsQ0FBaEIsQzs7Ozs7Ozs7Ozs7QUNEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQSxJQUFJSSxZQUFZLEdBQUdDLE9BQU8sQ0FBQyxRQUFELENBQVAsQ0FBa0JELFlBQXJDLEMsQ0FFQTs7O0FBQ0EsSUFBSUUsY0FBYyxHQUFHRCxPQUFPLENBQUMsaUJBQUQsQ0FBNUI7QUFFQTs7Ozs7Ozs7QUFNQUUsRUFB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QUcvRixFQUFFLENBQUNDLFNBQUgsQ0FBYUssT0FBYixDQUFxQndDLE9BQXJCLENBQTZCMkMsZ0JBQTdCLENBQThDMUMsT0FBOUMsQ0FBdEI7QUFDQStDLFVBQUksQ0FBQ0MsZUFBRCxDQUFKO0FBQ0QsS0FKTSxFQUlKLFVBQVVQLEtBQVYsRUFBaUI7QUFDbEIsWUFBTUEsS0FBTjtBQUNELEtBTk0sQ0FBUDtBQU9ELEdBckIrQyxDQXVCaEQ7OztBQUNBLE1BQUlRLGNBQWMsR0FBR2pHLGNBQWMsQ0FBQ2tHLE1BQWYsRUFBckIsQ0F4QmdELENBMEJoRDs7QUFDQSxNQUFJQyxZQUFZLEdBQUcsQ0FBbkI7O0FBQ0EsT0FBSyxJQUFJakUsS0FBSyxHQUFHLENBQWpCLEVBQW9CQSxLQUFLLEdBQUd5RCxXQUE1QixFQUF5Q3pELEtBQUssRUFBOUMsRUFBa0Q7QUFDaEQrRCxrQkFBYyxDQUFDRyxNQUFmLENBQXNCUixpQkFBaUIsQ0FBQzFELEtBQUQsQ0FBdkM7QUFDRCxHQTlCK0MsQ0FnQ2hEOzs7QUFDQSxTQUFPK0QsY0FBUDtBQUNELENBbENELEMiLCJmaWxlIjoiL3BhY2thZ2VzL3N0ZWVkb3NfY2ZzLXRlbXBzdG9yZS5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IGNoZWNrTnBtVmVyc2lvbnMgfSBmcm9tICdtZXRlb3IvdG1lYXNkYXk6Y2hlY2stbnBtLXZlcnNpb25zJztcbmNoZWNrTnBtVmVyc2lvbnMoe1xuXHQnY29tYmluZWQtc3RyZWFtJzogJzAuMC40J1xufSwgJ3N0ZWVkb3M6Y2ZzLXRlbXBzdG9yZScpOyIsIi8vICMjVGVtcG9yYXJ5IFN0b3JhZ2Vcbi8vXG4vLyBUZW1wb3Jhcnkgc3RvcmFnZSBpcyB1c2VkIGZvciBjaHVua2VkIHVwbG9hZHMgdW50aWwgYWxsIGNodW5rcyBhcmUgcmVjZWl2ZWRcbi8vIGFuZCBhbGwgY29waWVzIGhhdmUgYmVlbiBtYWRlIG9yIGdpdmVuIHVwLiBJbiBzb21lIGNhc2VzLCB0aGUgb3JpZ2luYWwgZmlsZVxuLy8gaXMgc3RvcmVkIG9ubHkgaW4gdGVtcG9yYXJ5IHN0b3JhZ2UgKGZvciBleGFtcGxlLCBpZiBhbGwgY29waWVzIGRvIHNvbWVcbi8vIG1hbmlwdWxhdGlvbiBpbiBiZWZvcmVTYXZlKS4gVGhpcyBpcyB3aHkgd2UgdXNlIHRoZSB0ZW1wb3JhcnkgZmlsZSBhcyB0aGVcbi8vIGJhc2lzIGZvciBlYWNoIHNhdmVkIGNvcHksIGFuZCB0aGVuIHJlbW92ZSBpdCBhZnRlciBhbGwgY29waWVzIGFyZSBzYXZlZC5cbi8vXG4vLyBFdmVyeSBjaHVuayBpcyBzYXZlZCBhcyBhbiBpbmRpdmlkdWFsIHRlbXBvcmFyeSBmaWxlLiBUaGlzIGlzIHNhZmVyIHRoYW5cbi8vIGF0dGVtcHRpbmcgdG8gd3JpdGUgbXVsdGlwbGUgaW5jb21pbmcgY2h1bmtzIHRvIGRpZmZlcmVudCBwb3NpdGlvbnMgaW4gYVxuLy8gc2luZ2xlIHRlbXBvcmFyeSBmaWxlLCB3aGljaCBjYW4gbGVhZCB0byB3cml0ZSBjb25mbGljdHMuXG4vL1xuLy8gVXNpbmcgdGVtcCBmaWxlcyBhbHNvIGFsbG93cyB1cyB0byBlYXNpbHkgcmVzdW1lIHVwbG9hZHMsIGV2ZW4gaWYgdGhlIHNlcnZlclxuLy8gcmVzdGFydHMsIGFuZCB0byBrZWVwIHRoZSB3b3JraW5nIG1lbW9yeSBjbGVhci5cblxuLy8gVGhlIEZTLlRlbXBTdG9yZSBlbWl0cyBldmVudHMgdGhhdCBvdGhlcnMgYXJlIGFibGUgdG8gbGlzdGVuIHRvXG52YXIgRXZlbnRFbWl0dGVyID0gcmVxdWlyZSgnZXZlbnRzJykuRXZlbnRFbWl0dGVyO1xuXG4vLyBXZSBoYXZlIGEgc3BlY2lhbCBzdHJlYW0gY29uY2F0aW5nIGFsbCBjaHVuayBmaWxlcyBpbnRvIG9uZSByZWFkYWJsZSBzdHJlYW1cbnZhciBDb21iaW5lZFN0cmVhbSA9IHJlcXVpcmUoJ2NvbWJpbmVkLXN0cmVhbScpO1xuXG4vKiogQG5hbWVzcGFjZSBGUy5UZW1wU3RvcmVcbiAqIEBwcm9wZXJ0eSBGUy5UZW1wU3RvcmVcbiAqIEB0eXBlIHtvYmplY3R9XG4gKiBAcHVibGljXG4gKiAqaXQncyBhbiBldmVudCBlbWl0dGVyKlxuICovXG5GUy5UZW1wU3RvcmUgPSBuZXcgRXZlbnRFbWl0dGVyKCk7XG5cbi8vIENyZWF0ZSBhIHRyYWNrZXIgY29sbGVjdGlvbiBmb3Iga2VlcGluZyB0cmFjayBvZiBhbGwgY2h1bmtzIGZvciBhbnkgZmlsZXMgdGhhdCBhcmUgY3VycmVudGx5IGluIHRoZSB0ZW1wIHN0b3JlXG52YXIgdHJhY2tlciA9IEZTLlRlbXBTdG9yZS5UcmFja2VyID0gbmV3IE1vbmdvLkNvbGxlY3Rpb24oJ2Nmcy5fdGVtcHN0b3JlLmNodW5rcycpO1xuXG4vKipcbiAqIEBwcm9wZXJ0eSBGUy5UZW1wU3RvcmUuU3RvcmFnZVxuICogQHR5cGUge1N0b3JhZ2VBZGFwdGVyfVxuICogQG5hbWVzcGFjZSBGUy5UZW1wU3RvcmVcbiAqIEBwcml2YXRlXG4gKiBUaGlzIHByb3BlcnR5IGlzIHNldCB0byBlaXRoZXIgYEZTLlN0b3JlLkZpbGVTeXN0ZW1gIG9yIGBGUy5TdG9yZS5HcmlkRlNgXG4gKlxuICogX19XaGVuIGFuZCB3aHk6X19cbiAqIFdlIG5vcm1hbGx5IGRlZmF1bHQgdG8gYGNmcy1maWxlc3lzdGVtYCB1bmxlc3MgaXRzIG5vdCBpbnN0YWxsZWQuICood2UgZGVmYXVsdCB0byBncmlkZnMgaWYgaW5zdGFsbGVkKSpcbiAqIEJ1dCBpZiBgY2ZzLWdyaWRmc2AgYW5kIGBjZnMtd29ya2VyYCBpcyBpbnN0YWxsZWQgd2UgZGVmYXVsdCB0byBgY2ZzLWdyaWRmc2BcbiAqXG4gKiBJZiBgY2ZzLWdyaWRmc2AgYW5kIGBjZnMtZmlsZXN5c3RlbWAgaXMgbm90IGluc3RhbGxlZCB3ZSBsb2cgYSB3YXJuaW5nLlxuICogdGhlIHVzZXIgY2FuIHNldCBgRlMuVGVtcFN0b3JlLlN0b3JhZ2VgIHRoZW0gc2VsZnMgZWcuOlxuICogYGBganNcbiAqICAgLy8gSXRzIGltcG9ydGFudCB0byBzZXQgYGludGVybmFsOiB0cnVlYCB0aGlzIGxldHMgdGhlIFNBIGtub3cgdGhhdCB3ZVxuICogICAvLyBhcmUgdXNpbmcgdGhpcyBpbnRlcm5hbGx5IGFuZCBpdCB3aWxsIGdpdmUgdXMgZGlyZWN0IFNBIGFwaVxuICogICBGUy5UZW1wU3RvcmUuU3RvcmFnZSA9IG5ldyBGUy5TdG9yZS5HcmlkRlMoJ190ZW1wc3RvcmUnLCB7IGludGVybmFsOiB0cnVlIH0pO1xuICogYGBgXG4gKlxuICogPiBOb3RlOiBUaGlzIGlzIGNvbnNpZGVyZWQgYXMgYGFkdmFuY2VkYCB1c2UsIGl0cyBub3QgYSBjb21tb24gcGF0dGVybi5cbiAqL1xuRlMuVGVtcFN0b3JlLlN0b3JhZ2UgPSBudWxsO1xuXG4vLyBXZSB3aWxsIG5vdCBtb3VudCBhIHN0b3JhZ2UgYWRhcHRlciB1bnRpbCBuZWVkZWQuIFRoaXMgYWxsb3dzIHVzIHRvIGNoZWNrIGZvciB0aGVcbi8vIGV4aXN0YW5jZSBvZiBGUy5GaWxlV29ya2VyLCB3aGljaCBpcyBsb2FkZWQgYWZ0ZXIgdGhpcyBwYWNrYWdlIGJlY2F1c2UgaXRcbi8vIGRlcGVuZHMgb24gdGhpcyBwYWNrYWdlLlxuZnVuY3Rpb24gbW91bnRTdG9yYWdlKCkge1xuXG4gIGlmIChGUy5UZW1wU3RvcmUuU3RvcmFnZSkgcmV0dXJuO1xuXG4gIC8vIFhYWDogV2UgY291bGQgcmVwbGFjZSB0aGlzIHRlc3QsIHRlc3RpbmcgdGhlIEZTIHNjb3BlIGZvciBncmlmRlMgZXRjLlxuICAvLyBUaGlzIGlzIG9uIHRoZSB0b2RvIGxhdGVyIHdoZW4gd2UgZ2V0IFwic3RhYmxlXCJcbiAgaWYgKFBhY2thZ2VbXCJzdGVlZG9zOmNmcy1ncmlkZnNcIl0gJiYgKFBhY2thZ2VbXCJzdGVlZG9zOmNmcy13b3JrZXJcIl0gfHwgIVBhY2thZ2VbXCJzdGVlZG9zOmNmcy1maWxlc3lzdGVtXCJdKSkge1xuICAgIC8vIElmIHRoZSBmaWxlIHdvcmtlciBpcyBpbnN0YWxsZWQgd2Ugd291bGQgcHJlZmVyIHRvIHVzZSB0aGUgZ3JpZGZzIHNhXG4gICAgLy8gZm9yIHNjYWxhYmlsaXR5LiBXZSBhbHNvIGRlZmF1bHQgdG8gZ3JpZGZzIGlmIGZpbGVzeXN0ZW0gaXMgbm90IGZvdW5kXG5cbiAgICAvLyBVc2UgdGhlIGdyaWRmc1xuICAgIEZTLlRlbXBTdG9yZS5TdG9yYWdlID0gbmV3IEZTLlN0b3JlLkdyaWRGUygnX3RlbXBzdG9yZScsIHsgaW50ZXJuYWw6IHRydWUgfSk7XG4gIH0gZWxzZSBpZiAoUGFja2FnZVtcInN0ZWVkb3M6Y2ZzLWZpbGVzeXN0ZW1cIl0pIHtcblxuICAgIC8vIHVzZSB0aGUgRmlsZXN5c3RlbVxuICAgIEZTLlRlbXBTdG9yZS5TdG9yYWdlID0gbmV3IEZTLlN0b3JlLkZpbGVTeXN0ZW0oJ190ZW1wc3RvcmUnLCB7IHBhdGg6IENyZWF0b3Iuc3RlZWRvc1N0b3JhZ2VEaXIrJy9fdGVtcHN0b3JlJywgaW50ZXJuYWw6IHRydWUgfSk7XG4gIH0gZWxzZSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdGUy5UZW1wU3RvcmUuU3RvcmFnZSBpcyBub3Qgc2V0OiBJbnN0YWxsIHN0ZWVkb3M6Y2ZzLWZpbGVzeXN0ZW0gb3Igc3RlZWRvczpjZnMtZ3JpZGZzIG9yIHNldCBpdCBtYW51YWxseScpO1xuICB9XG5cbiAgRlMuZGVidWcgJiYgY29uc29sZS5sb2coJ1RlbXBTdG9yZSBpcyBtb3VudGVkIG9uJywgRlMuVGVtcFN0b3JlLlN0b3JhZ2UudHlwZU5hbWUpO1xufVxuXG5mdW5jdGlvbiBtb3VudEZpbGUoZmlsZU9iaiwgbmFtZSkge1xuICBpZiAoIWZpbGVPYmouaXNNb3VudGVkKCkpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IobmFtZSArICcgY2Fubm90IHdvcmsgd2l0aCB1bm1vdW50ZWQgZmlsZScpO1xuICB9XG59XG5cbi8vIFdlIHVwZGF0ZSB0aGUgZmlsZU9iaiBvbiBwcm9ncmVzc1xuRlMuVGVtcFN0b3JlLm9uKCdwcm9ncmVzcycsIGZ1bmN0aW9uKGZpbGVPYmosIGNodW5rTnVtLCBjb3VudCwgdG90YWwsIHJlc3VsdCkge1xuICBGUy5kZWJ1ZyAmJiBjb25zb2xlLmxvZygnVGVtcFN0b3JlIHByb2dyZXNzOiBSZWNlaXZlZCAnICsgY291bnQgKyAnIG9mICcgKyB0b3RhbCArICcgY2h1bmtzIGZvciAnICsgZmlsZU9iai5uYW1lKCkpO1xufSk7XG5cbi8vIFhYWDogVE9ET1xuLy8gRlMuVGVtcFN0b3JlLm9uKCdzdG9yZWQnLCBmdW5jdGlvbihmaWxlT2JqLCBjaHVua0NvdW50LCByZXN1bHQpIHtcbi8vICAgLy8gVGhpcyBzaG91bGQgd29yayBpZiB3ZSBwYXNzIG9uIHJlc3VsdCBmcm9tIHRoZSBTQSBvbiBzdG9yZWQgZXZlbnQuLi5cbi8vICAgZmlsZU9iai51cGRhdGUoeyAkc2V0OiB7IGNodW5rU3VtOiAxLCBjaHVua0NvdW50OiBjaHVua0NvdW50LCBzaXplOiByZXN1bHQuc2l6ZSB9IH0pO1xuLy8gfSk7XG5cbi8vIFN0cmVhbSBpbXBsZW1lbnRhdGlvblxuXG4vKipcbiAqIEBtZXRob2QgX2NodW5rUGF0aFxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7TnVtYmVyfSBbbl0gQ2h1bmsgbnVtYmVyXG4gKiBAcmV0dXJucyB7U3RyaW5nfSBDaHVuayBuYW1pbmcgY29udmVudGlvblxuICovXG5fY2h1bmtQYXRoID0gZnVuY3Rpb24obikge1xuICByZXR1cm4gKG4gfHwgMCkgKyAnLmNodW5rJztcbn07XG5cbi8qKlxuICogQG1ldGhvZCBfZmlsZVJlZmVyZW5jZVxuICogQHBhcmFtIHtGUy5GaWxlfSBmaWxlT2JqXG4gKiBAcGFyYW0ge051bWJlcn0gY2h1bmtcbiAqIEBwcml2YXRlXG4gKiBAcmV0dXJucyB7U3RyaW5nfSBHZW5lcmF0ZWQgU0Egc3BlY2lmaWMgZmlsZUtleSBmb3IgdGhlIGNodW5rXG4gKlxuICogTm90ZTogQ2FsbGluZyBmdW5jdGlvbiBzaG91bGQgY2FsbCBtb3VudFN0b3JhZ2UoKSBmaXJzdCwgYW5kXG4gKiBtYWtlIHN1cmUgdGhhdCBmaWxlT2JqIGlzIG1vdW50ZWQuXG4gKi9cbl9maWxlUmVmZXJlbmNlID0gZnVuY3Rpb24oZmlsZU9iaiwgY2h1bmssIGV4aXN0aW5nKSB7XG4gIC8vIE1heWJlIGl0J3MgYSBjaHVuayB3ZSd2ZSBhbHJlYWR5IHNhdmVkXG4gIGV4aXN0aW5nID0gZXhpc3RpbmcgfHwgdHJhY2tlci5maW5kT25lKHtmaWxlSWQ6IGZpbGVPYmouX2lkLCBjb2xsZWN0aW9uTmFtZTogZmlsZU9iai5jb2xsZWN0aW9uTmFtZX0pO1xuXG4gIC8vIE1ha2UgYSB0ZW1wb3JhcnkgZmlsZU9iaiBqdXN0IGZvciBmaWxlS2V5IGdlbmVyYXRpb25cbiAgdmFyIHRlbXBGaWxlT2JqID0gbmV3IEZTLkZpbGUoe1xuICAgIGNvbGxlY3Rpb25OYW1lOiBmaWxlT2JqLmNvbGxlY3Rpb25OYW1lLFxuICAgIF9pZDogZmlsZU9iai5faWQsXG4gICAgb3JpZ2luYWw6IHtcbiAgICAgIG5hbWU6IF9jaHVua1BhdGgoY2h1bmspXG4gICAgfSxcbiAgICBjb3BpZXM6IHtcbiAgICAgIF90ZW1wc3RvcmU6IHtcbiAgICAgICAga2V5OiBleGlzdGluZyAmJiBleGlzdGluZy5rZXlzW2NodW5rXVxuICAgICAgfVxuICAgIH1cbiAgfSk7XG5cbiAgLy8gUmV0dXJuIGEgZml0dGluZyBmaWxlS2V5IFNBIHNwZWNpZmljXG4gIHJldHVybiBGUy5UZW1wU3RvcmUuU3RvcmFnZS5hZGFwdGVyLmZpbGVLZXkodGVtcEZpbGVPYmopO1xufTtcblxuLyoqXG4gKiBAbWV0aG9kIEZTLlRlbXBTdG9yZS5leGlzdHNcbiAqIEBwYXJhbSB7RlMuRmlsZX0gRmlsZSBvYmplY3RcbiAqIEByZXR1cm5zIHtCb29sZWFufSBJcyB0aGlzIGZpbGUsIG9yIHBhcnRzIG9mIGl0LCBjdXJyZW50bHkgc3RvcmVkIGluIHRoZSBUZW1wU3RvcmVcbiAqL1xuRlMuVGVtcFN0b3JlLmV4aXN0cyA9IGZ1bmN0aW9uKGZpbGVPYmopIHtcbiAgdmFyIGV4aXN0aW5nID0gdHJhY2tlci5maW5kT25lKHtmaWxlSWQ6IGZpbGVPYmouX2lkLCBjb2xsZWN0aW9uTmFtZTogZmlsZU9iai5jb2xsZWN0aW9uTmFtZX0pO1xuICByZXR1cm4gISFleGlzdGluZztcbn07XG5cbi8qKlxuICogQG1ldGhvZCBGUy5UZW1wU3RvcmUubGlzdFBhcnRzXG4gKiBAcGFyYW0ge0ZTLkZpbGV9IGZpbGVPYmpcbiAqIEByZXR1cm5zIHtPYmplY3R9IG9mIHBhcnRzIGFscmVhZHkgc3RvcmVkXG4gKiBAdG9kbyBUaGlzIGlzIG5vdCB5ZXQgaW1wbGVtZW50ZWQsIG1pbGVzdG9uZSAxLjEuMFxuICovXG5GUy5UZW1wU3RvcmUubGlzdFBhcnRzID0gZnVuY3Rpb24gZnNUZW1wU3RvcmVMaXN0UGFydHMoZmlsZU9iaikge1xuICB2YXIgc2VsZiA9IHRoaXM7XG4gIGNvbnNvbGUud2FybignVGhpcyBmdW5jdGlvbiBpcyBub3QgY29ycmVjdGx5IGltcGxlbWVudGVkIHVzaW5nIFNBIGluIFRlbXBTdG9yZScpO1xuICAvL1hYWCBUaGlzIGZ1bmN0aW9uIG1pZ2h0IGJlIG5lY2Vzc2FyeSBmb3IgcmVzdW1lLiBOb3QgY3VycmVudGx5IHN1cHBvcnRlZC5cbn07XG5cbi8qKlxuICogQG1ldGhvZCBGUy5UZW1wU3RvcmUucmVtb3ZlRmlsZVxuICogQHB1YmxpY1xuICogQHBhcmFtIHtGUy5GaWxlfSBmaWxlT2JqXG4gKiBUaGlzIGZ1bmN0aW9uIHJlbW92ZXMgdGhlIGZpbGUgZnJvbSB0ZW1wc3RvcmFnZSAtIGl0IGNhcmVzIG5vdCBpZiBmaWxlIGlzXG4gKiBhbHJlYWR5IHJlbW92ZWQgb3Igbm90IGZvdW5kLCBnb2FsIGlzIHJlYWNoZWQgYW55d2F5LlxuICovXG5GUy5UZW1wU3RvcmUucmVtb3ZlRmlsZSA9IGZ1bmN0aW9uIGZzVGVtcFN0b3JlUmVtb3ZlRmlsZShmaWxlT2JqKSB7XG4gIHZhciBzZWxmID0gdGhpcztcblxuICAvLyBFbnN1cmUgdGhhdCB3ZSBoYXZlIGEgc3RvcmFnZSBhZGFwdGVyIG1vdW50ZWQ7IGlmIG5vdCwgdGhyb3cgYW4gZXJyb3IuXG4gIG1vdW50U3RvcmFnZSgpO1xuXG4gIC8vIElmIGZpbGVPYmogaXMgbm90IG1vdW50ZWQgb3IgY2FuJ3QgYmUsIHRocm93IGFuIGVycm9yXG4gIG1vdW50RmlsZShmaWxlT2JqLCAnRlMuVGVtcFN0b3JlLnJlbW92ZUZpbGUnKTtcblxuICAvLyBFbWl0IGV2ZW50XG4gIHNlbGYuZW1pdCgncmVtb3ZlJywgZmlsZU9iaik7XG5cbiAgdmFyIGNodW5rSW5mbyA9IHRyYWNrZXIuZmluZE9uZSh7XG4gICAgZmlsZUlkOiBmaWxlT2JqLl9pZCxcbiAgICBjb2xsZWN0aW9uTmFtZTogZmlsZU9iai5jb2xsZWN0aW9uTmFtZVxuICB9KTtcblxuICBpZiAoY2h1bmtJbmZvKSB7XG5cbiAgICAvLyBVbmxpbmsgZWFjaCBmaWxlXG4gICAgRlMuVXRpbGl0eS5lYWNoKGNodW5rSW5mby5rZXlzIHx8IHt9LCBmdW5jdGlvbiAoa2V5LCBjaHVuaykge1xuICAgICAgdmFyIGZpbGVLZXkgPSBfZmlsZVJlZmVyZW5jZShmaWxlT2JqLCBjaHVuaywgY2h1bmtJbmZvKTtcbiAgICAgIEZTLlRlbXBTdG9yZS5TdG9yYWdlLmFkYXB0ZXIucmVtb3ZlKGZpbGVLZXksIEZTLlV0aWxpdHkubm9vcCk7XG4gICAgfSk7XG5cbiAgICAvLyBSZW1vdmUgZmlsZU9iaiBmcm9tIHRyYWNrZXIgY29sbGVjdGlvbiwgdG9vXG4gICAgdHJhY2tlci5yZW1vdmUoe19pZDogY2h1bmtJbmZvLl9pZH0pO1xuXG4gIH1cbn07XG5cbi8qKlxuICogQG1ldGhvZCBGUy5UZW1wU3RvcmUucmVtb3ZlQWxsXG4gKiBAcHVibGljXG4gKiBUaGlzIGZ1bmN0aW9uIHJlbW92ZXMgYWxsIGZpbGVzIGZyb20gdGVtcHN0b3JhZ2UgLSBpdCBjYXJlcyBub3QgaWYgZmlsZSBpc1xuICogYWxyZWFkeSByZW1vdmVkIG9yIG5vdCBmb3VuZCwgZ29hbCBpcyByZWFjaGVkIGFueXdheS5cbiAqL1xuRlMuVGVtcFN0b3JlLnJlbW92ZUFsbCA9IGZ1bmN0aW9uIGZzVGVtcFN0b3JlUmVtb3ZlQWxsKCkge1xuICB2YXIgc2VsZiA9IHRoaXM7XG5cbiAgLy8gRW5zdXJlIHRoYXQgd2UgaGF2ZSBhIHN0b3JhZ2UgYWRhcHRlciBtb3VudGVkOyBpZiBub3QsIHRocm93IGFuIGVycm9yLlxuICBtb3VudFN0b3JhZ2UoKTtcblxuICB0cmFja2VyLmZpbmQoKS5mb3JFYWNoKGZ1bmN0aW9uIChjaHVua0luZm8pIHtcbiAgICAvLyBVbmxpbmsgZWFjaCBmaWxlXG4gICAgRlMuVXRpbGl0eS5lYWNoKGNodW5rSW5mby5rZXlzIHx8IHt9LCBmdW5jdGlvbiAoa2V5LCBjaHVuaykge1xuICAgICAgdmFyIGZpbGVLZXkgPSBfZmlsZVJlZmVyZW5jZSh7X2lkOiBjaHVua0luZm8uZmlsZUlkLCBjb2xsZWN0aW9uTmFtZTogY2h1bmtJbmZvLmNvbGxlY3Rpb25OYW1lfSwgY2h1bmssIGNodW5rSW5mbyk7XG4gICAgICBGUy5UZW1wU3RvcmUuU3RvcmFnZS5hZGFwdGVyLnJlbW92ZShmaWxlS2V5LCBGUy5VdGlsaXR5Lm5vb3ApO1xuICAgIH0pO1xuXG4gICAgLy8gUmVtb3ZlIGZyb20gdHJhY2tlciBjb2xsZWN0aW9uLCB0b29cbiAgICB0cmFja2VyLnJlbW92ZSh7X2lkOiBjaHVua0luZm8uX2lkfSk7XG4gIH0pO1xufTtcblxuLyoqXG4gKiBAbWV0aG9kIEZTLlRlbXBTdG9yZS5jcmVhdGVXcml0ZVN0cmVhbVxuICogQHB1YmxpY1xuICogQHBhcmFtIHtGUy5GaWxlfSBmaWxlT2JqIEZpbGUgdG8gc3RvcmUgaW4gdGVtcG9yYXJ5IHN0b3JhZ2VcbiAqIEBwYXJhbSB7TnVtYmVyIHwgU3RyaW5nfSBbb3B0aW9uc11cbiAqIEByZXR1cm5zIHtTdHJlYW19IFdyaXRlYWJsZSBzdHJlYW1cbiAqXG4gKiBgb3B0aW9uc2Agb2YgZGlmZmVyZW50IHR5cGVzIG1lYW4gZGlmZmVybnQgdGhpbmdzOlxuICogKiBgdW5kZWZpbmVkYCBXZSBzdG9yZSB0aGUgZmlsZSBpbiBvbmUgcGFydFxuICogKihOb3JtYWwgc2VydmVyLXNpZGUgYXBpIHVzYWdlKSpcbiAqICogYE51bWJlcmAgdGhlIG51bWJlciBpcyB0aGUgcGFydCBudW1iZXIgdG90YWxcbiAqICoobXVsdGlwYXJ0IHVwbG9hZHMgd2lsbCB1c2UgdGhpcyBhcGkpKlxuICogKiBgU3RyaW5nYCB0aGUgc3RyaW5nIGlzIHRoZSBuYW1lIG9mIHRoZSBgc3RvcmVgIHRoYXQgd2FudHMgdG8gc3RvcmUgZmlsZSBkYXRhXG4gKiAqKHN0b3JlcyB0aGF0IHdhbnQgdG8gc3luYyB0aGVpciBkYXRhIHRvIHRoZSByZXN0IG9mIHRoZSBmaWxlcyBzdG9yZXMgd2lsbCB1c2UgdGhpcykqXG4gKlxuICogPiBOb3RlOiBmaWxlT2JqIG11c3QgYmUgbW91bnRlZCBvbiBhIGBGUy5Db2xsZWN0aW9uYCwgaXQgbWFrZXMgbm8gc2Vuc2UgdG8gc3RvcmUgb3RoZXJ3aXNlXG4gKi9cbkZTLlRlbXBTdG9yZS5jcmVhdGVXcml0ZVN0cmVhbSA9IGZ1bmN0aW9uKGZpbGVPYmosIG9wdGlvbnMpIHtcbiAgdmFyIHNlbGYgPSB0aGlzO1xuXG4gIC8vIEVuc3VyZSB0aGF0IHdlIGhhdmUgYSBzdG9yYWdlIGFkYXB0ZXIgbW91bnRlZDsgaWYgbm90LCB0aHJvdyBhbiBlcnJvci5cbiAgbW91bnRTdG9yYWdlKCk7XG5cbiAgLy8gSWYgZmlsZU9iaiBpcyBub3QgbW91bnRlZCBvciBjYW4ndCBiZSwgdGhyb3cgYW4gZXJyb3JcbiAgbW91bnRGaWxlKGZpbGVPYmosICdGUy5UZW1wU3RvcmUuY3JlYXRlV3JpdGVTdHJlYW0nKTtcblxuICAvLyBDYWNoZSB0aGUgc2VsZWN0b3IgZm9yIHVzZSBtdWx0aXBsZSB0aW1lcyBiZWxvd1xuICB2YXIgc2VsZWN0b3IgPSB7ZmlsZUlkOiBmaWxlT2JqLl9pZCwgY29sbGVjdGlvbk5hbWU6IGZpbGVPYmouY29sbGVjdGlvbk5hbWV9O1xuXG4gIC8vIFRPRE8sIHNob3VsZCBwYXNzIGluIGNodW5rU3VtIHNvIHdlIGRvbid0IG5lZWQgdG8gdXNlIEZTLkZpbGUgZm9yIGl0XG4gIHZhciBjaHVua1N1bSA9IGZpbGVPYmouY2h1bmtTdW0gfHwgMTtcblxuICAvLyBBZGQgZmlsZU9iaiB0byB0cmFja2VyIGNvbGxlY3Rpb25cbiAgdHJhY2tlci51cHNlcnQoc2VsZWN0b3IsIHskc2V0T25JbnNlcnQ6IHtrZXlzOiB7fX19KTtcblxuICAvLyBEZXRlcm1pbmUgaG93IHdlJ3JlIHVzaW5nIHRoZSB3cml0ZVN0cmVhbVxuICB2YXIgaXNPbmVQYXJ0ID0gZmFsc2UsIGlzTXVsdGlQYXJ0ID0gZmFsc2UsIGlzU3RvcmVTeW5jID0gZmFsc2UsIGNodW5rTnVtID0gMDtcbiAgaWYgKG9wdGlvbnMgPT09ICtvcHRpb25zKSB7XG4gICAgaXNNdWx0aVBhcnQgPSB0cnVlO1xuICAgIGNodW5rTnVtID0gb3B0aW9ucztcbiAgfSBlbHNlIGlmIChvcHRpb25zID09PSAnJytvcHRpb25zKSB7XG4gICAgaXNTdG9yZVN5bmMgPSB0cnVlO1xuICB9IGVsc2Uge1xuICAgIGlzT25lUGFydCA9IHRydWU7XG4gIH1cblxuICAvLyBYWFg6IGl0IHNob3VsZCBiZSBwb3NzaWJsZSBmb3IgYSBzdG9yZSB0byBzeW5jIGJ5IHN0b3JpbmcgZGF0YSBpbnRvIHRoZVxuICAvLyB0ZW1wc3RvcmUgLSB0aGlzIGNvdWxkIGJlIGRvbmUgbmljZWx5IGJ5IHNldHRpbmcgdGhlIHN0b3JlIG5hbWUgYXMgc3RyaW5nXG4gIC8vIGluIHRoZSBjaHVuayB2YXJpYWJsZT9cbiAgLy8gVGhpcyBzdG9yZSBuYW1lIGNvdWxkIGJlIHBhc3NlZCBvbiB0aGUgdGhlIGZpbGV3b3JrZXIgdmlhIHRoZSB1cGxvYWRlZFxuICAvLyBldmVudFxuICAvLyBTbyB0aGUgdXBsb2FkZWQgZXZlbnQgY2FuIHJldHVybjpcbiAgLy8gdW5kZWZpbmVkIC0gaWYgZGF0YSBpcyBzdG9yZWQgaW50byBhbmQgc2hvdWxkIHN5bmMgb3V0IHRvIGFsbCBzdG9yYWdlIGFkYXB0ZXJzXG4gIC8vIG51bWJlciAtIGlmIGEgY2h1bmsgaGFzIGJlZW4gdXBsb2FkZWRcbiAgLy8gc3RyaW5nIC0gaWYgYSBzdG9yYWdlIGFkYXB0ZXIgd2FudHMgdG8gc3luYyBpdHMgZGF0YSB0byB0aGUgb3RoZXIgU0Enc1xuXG4gIC8vIEZpbmQgYSBuaWNlIGxvY2F0aW9uIGZvciB0aGUgY2h1bmsgZGF0YVxuICB2YXIgZmlsZUtleSA9IF9maWxlUmVmZXJlbmNlKGZpbGVPYmosIGNodW5rTnVtKTtcblxuICAvLyBDcmVhdGUgdGhlIHN0cmVhbSBhcyBNZXRlb3Igc2FmZSBzdHJlYW1cbiAgdmFyIHdyaXRlU3RyZWFtID0gRlMuVGVtcFN0b3JlLlN0b3JhZ2UuYWRhcHRlci5jcmVhdGVXcml0ZVN0cmVhbShmaWxlS2V5KTtcblxuICAvLyBXaGVuIHRoZSBzdHJlYW0gY2xvc2VzIHdlIHVwZGF0ZSB0aGUgY2h1bmtDb3VudFxuICB3cml0ZVN0cmVhbS5zYWZlT24oJ3N0b3JlZCcsIGZ1bmN0aW9uKHJlc3VsdCkge1xuICAgIC8vIFNhdmUga2V5IGluIHRyYWNrZXIgZG9jdW1lbnRcbiAgICB2YXIgc2V0T2JqID0ge307XG4gICAgc2V0T2JqWydrZXlzLicgKyBjaHVua051bV0gPSByZXN1bHQuZmlsZUtleTtcbiAgICB0cmFja2VyLnVwZGF0ZShzZWxlY3RvciwgeyRzZXQ6IHNldE9ian0pO1xuXG4gICAgLy8gR2V0IHVwZGF0ZWQgY2h1bmtDb3VudFxuICAgIHZhciBjaHVua0NvdW50ID0gRlMuVXRpbGl0eS5zaXplKHRyYWNrZXIuZmluZE9uZShzZWxlY3Rvcikua2V5cyk7XG5cbiAgICAvLyBQcm9ncmVzc1xuICAgIHNlbGYuZW1pdCgncHJvZ3Jlc3MnLCBmaWxlT2JqLCBjaHVua051bSwgY2h1bmtDb3VudCwgY2h1bmtTdW0sIHJlc3VsdCk7XG5cbiAgICAvLyBJZiB1cGxvYWQgaXMgY29tcGxldGVkXG4gICAgaWYgKGNodW5rQ291bnQgPT09IGNodW5rU3VtKSB7XG4gICAgICAvLyBXZSBubyBsb25nZXIgbmVlZCB0aGUgY2h1bmsgaW5mb1xuICAgICAgdmFyIG1vZGlmaWVyID0geyAkc2V0OiB7fSwgJHVuc2V0OiB7Y2h1bmtDb3VudDogMSwgY2h1bmtTdW06IDEsIGNodW5rU2l6ZTogMX0gfTtcblxuICAgICAgLy8gQ2hlY2sgaWYgdGhlIGZpbGUgaGFzIGJlZW4gdXBsb2FkZWQgYmVmb3JlXG4gICAgICBpZiAodHlwZW9mIGZpbGVPYmoudXBsb2FkZWRBdCA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgLy8gV2Ugc2V0IHRoZSB1cGxvYWRlZEF0IGRhdGVcbiAgICAgICAgbW9kaWZpZXIuJHNldC51cGxvYWRlZEF0ID0gbmV3IERhdGUoKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIC8vIFdlIGhhdmUgYmVlbiB1cGxvYWRlZCBzbyBhbiBldmVudCB3ZXJlIGZpbGUgZGF0YSBpcyB1cGRhdGVkIGlzXG4gICAgICAgIC8vIGNhbGxlZCBzeW5jaHJvbml6aW5nIC0gc28gdGhpcyBtdXN0IGJlIGEgc3luY2hyb25pemVkQXQ/XG4gICAgICAgIG1vZGlmaWVyLiRzZXQuc3luY2hyb25pemVkQXQgPSBuZXcgRGF0ZSgpO1xuICAgICAgfVxuXG4gICAgICAvLyBVcGRhdGUgdGhlIGZpbGVPYmplY3RcbiAgICAgIGZpbGVPYmoudXBkYXRlKG1vZGlmaWVyKTtcblxuICAgICAgLy8gRmlyZSBlbmRpbmcgZXZlbnRzXG4gICAgICB2YXIgZXZlbnROYW1lID0gaXNTdG9yZVN5bmMgPyAnc3luY2hyb25pemVkJyA6ICdzdG9yZWQnO1xuICAgICAgc2VsZi5lbWl0KGV2ZW50TmFtZSwgZmlsZU9iaiwgcmVzdWx0KTtcblxuICAgICAgLy8gWFhYIGlzIGVtaXR0aW5nIFwicmVhZHlcIiBuZWNlc3Nhcnk/XG4gICAgICBzZWxmLmVtaXQoJ3JlYWR5JywgZmlsZU9iaiwgY2h1bmtDb3VudCwgcmVzdWx0KTtcbiAgICB9IGVsc2Uge1xuICAgICAgLy8gVXBkYXRlIHRoZSBjaHVua0NvdW50IG9uIHRoZSBmaWxlT2JqZWN0XG4gICAgICBmaWxlT2JqLnVwZGF0ZSh7ICRzZXQ6IHtjaHVua0NvdW50OiBjaHVua0NvdW50fSB9KTtcbiAgICB9XG4gIH0pO1xuXG4gIC8vIEVtaXQgZXJyb3JzXG4gIHdyaXRlU3RyZWFtLm9uKCdlcnJvcicsIGZ1bmN0aW9uIChlcnJvcikge1xuICAgIEZTLmRlYnVnICYmIGNvbnNvbGUubG9nKCdUZW1wU3RvcmUgd3JpdGVTdHJlYW0gZXJyb3I6JywgZXJyb3IpO1xuICAgIHNlbGYuZW1pdCgnZXJyb3InLCBlcnJvciwgZmlsZU9iaik7XG4gIH0pO1xuXG4gIHJldHVybiB3cml0ZVN0cmVhbTtcbn07XG5cbi8qKlxuICAqIEBtZXRob2QgRlMuVGVtcFN0b3JlLmNyZWF0ZVJlYWRTdHJlYW1cbiAgKiBAcHVibGljXG4gICogQHBhcmFtIHtGUy5GaWxlfSBmaWxlT2JqIFRoZSBmaWxlIHRvIHJlYWRcbiAgKiBAcmV0dXJuIHtTdHJlYW19IFJldHVybnMgcmVhZGFibGUgc3RyZWFtXG4gICpcbiAgKi9cbkZTLlRlbXBTdG9yZS5jcmVhdGVSZWFkU3RyZWFtID0gZnVuY3Rpb24oZmlsZU9iaikge1xuICAvLyBFbnN1cmUgdGhhdCB3ZSBoYXZlIGEgc3RvcmFnZSBhZGFwdGVyIG1vdW50ZWQ7IGlmIG5vdCwgdGhyb3cgYW4gZXJyb3IuXG4gIG1vdW50U3RvcmFnZSgpO1xuXG4gIC8vIElmIGZpbGVPYmogaXMgbm90IG1vdW50ZWQgb3IgY2FuJ3QgYmUsIHRocm93IGFuIGVycm9yXG4gIG1vdW50RmlsZShmaWxlT2JqLCAnRlMuVGVtcFN0b3JlLmNyZWF0ZVJlYWRTdHJlYW0nKTtcblxuICBGUy5kZWJ1ZyAmJiBjb25zb2xlLmxvZygnRlMuVGVtcFN0b3JlIGNyZWF0aW5nIHJlYWQgc3RyZWFtIGZvciAnICsgZmlsZU9iai5faWQpO1xuXG4gIC8vIERldGVybWluZSBob3cgbWFueSB0b3RhbCBjaHVua3MgdGhlcmUgYXJlIGZyb20gdGhlIHRyYWNrZXIgY29sbGVjdGlvblxuICB2YXIgY2h1bmtJbmZvID0gdHJhY2tlci5maW5kT25lKHtmaWxlSWQ6IGZpbGVPYmouX2lkLCBjb2xsZWN0aW9uTmFtZTogZmlsZU9iai5jb2xsZWN0aW9uTmFtZX0pIHx8IHt9O1xuICB2YXIgdG90YWxDaHVua3MgPSBGUy5VdGlsaXR5LnNpemUoY2h1bmtJbmZvLmtleXMpO1xuXG4gIGZ1bmN0aW9uIGdldE5leHRTdHJlYW1GdW5jKGNodW5rKSB7XG4gICAgcmV0dXJuIE1ldGVvci5iaW5kRW52aXJvbm1lbnQoZnVuY3Rpb24obmV4dCkge1xuICAgICAgdmFyIGZpbGVLZXkgPSBfZmlsZVJlZmVyZW5jZShmaWxlT2JqLCBjaHVuayk7XG4gICAgICB2YXIgY2h1bmtSZWFkU3RyZWFtID0gRlMuVGVtcFN0b3JlLlN0b3JhZ2UuYWRhcHRlci5jcmVhdGVSZWFkU3RyZWFtKGZpbGVLZXkpO1xuICAgICAgbmV4dChjaHVua1JlYWRTdHJlYW0pO1xuICAgIH0sIGZ1bmN0aW9uIChlcnJvcikge1xuICAgICAgdGhyb3cgZXJyb3I7XG4gICAgfSk7XG4gIH1cblxuICAvLyBNYWtlIGEgY29tYmluZWQgc3RyZWFtXG4gIHZhciBjb21iaW5lZFN0cmVhbSA9IENvbWJpbmVkU3RyZWFtLmNyZWF0ZSgpO1xuXG4gIC8vIEFkZCBlYWNoIGNodW5rIHN0cmVhbSB0byB0aGUgY29tYmluZWQgc3RyZWFtIHdoZW4gdGhlIHByZXZpb3VzIGNodW5rIHN0cmVhbSBlbmRzXG4gIHZhciBjdXJyZW50Q2h1bmsgPSAwO1xuICBmb3IgKHZhciBjaHVuayA9IDA7IGNodW5rIDwgdG90YWxDaHVua3M7IGNodW5rKyspIHtcbiAgICBjb21iaW5lZFN0cmVhbS5hcHBlbmQoZ2V0TmV4dFN0cmVhbUZ1bmMoY2h1bmspKTtcbiAgfVxuXG4gIC8vIFJldHVybiB0aGUgY29tYmluZWQgc3RyZWFtXG4gIHJldHVybiBjb21iaW5lZFN0cmVhbTtcbn07XG4iXX0=
