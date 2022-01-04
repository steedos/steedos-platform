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
var Promise = Package.promise.Promise;

/* Package-scope variables */
var _chunkPath, _fileReference;

var require = meteorInstall({"node_modules":{"meteor":{"steedos:cfs-tempstore":{"checkNpm.js":function module(require,exports,module){

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

},"tempStore.js":function module(require){

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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvczpjZnMtdGVtcHN0b3JlL2NoZWNrTnBtLmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zOmNmcy10ZW1wc3RvcmUvdGVtcFN0b3JlLmpzIl0sIm5hbWVzIjpbImNoZWNrTnBtVmVyc2lvbnMiLCJtb2R1bGUiLCJsaW5rIiwidiIsIkV2ZW50RW1pdHRlciIsInJlcXVpcmUiLCJDb21iaW5lZFN0cmVhbSIsIkZTIiwiVGVtcFN0b3JlIiwidHJhY2tlciIsIlRyYWNrZXIiLCJNb25nbyIsIkNvbGxlY3Rpb24iLCJTdG9yYWdlIiwibW91bnRTdG9yYWdlIiwiUGFja2FnZSIsIlN0b3JlIiwiR3JpZEZTIiwiaW50ZXJuYWwiLCJGaWxlU3lzdGVtIiwicGF0aCIsIkNyZWF0b3IiLCJzdGVlZG9zU3RvcmFnZURpciIsIkVycm9yIiwiZGVidWciLCJjb25zb2xlIiwibG9nIiwidHlwZU5hbWUiLCJtb3VudEZpbGUiLCJmaWxlT2JqIiwibmFtZSIsImlzTW91bnRlZCIsIm9uIiwiY2h1bmtOdW0iLCJjb3VudCIsInRvdGFsIiwicmVzdWx0IiwiX2NodW5rUGF0aCIsIm4iLCJfZmlsZVJlZmVyZW5jZSIsImNodW5rIiwiZXhpc3RpbmciLCJmaW5kT25lIiwiZmlsZUlkIiwiX2lkIiwiY29sbGVjdGlvbk5hbWUiLCJ0ZW1wRmlsZU9iaiIsIkZpbGUiLCJvcmlnaW5hbCIsImNvcGllcyIsIl90ZW1wc3RvcmUiLCJrZXkiLCJrZXlzIiwiYWRhcHRlciIsImZpbGVLZXkiLCJleGlzdHMiLCJsaXN0UGFydHMiLCJmc1RlbXBTdG9yZUxpc3RQYXJ0cyIsInNlbGYiLCJ3YXJuIiwicmVtb3ZlRmlsZSIsImZzVGVtcFN0b3JlUmVtb3ZlRmlsZSIsImVtaXQiLCJjaHVua0luZm8iLCJVdGlsaXR5IiwiZWFjaCIsInJlbW92ZSIsIm5vb3AiLCJyZW1vdmVBbGwiLCJmc1RlbXBTdG9yZVJlbW92ZUFsbCIsImZpbmQiLCJmb3JFYWNoIiwiY3JlYXRlV3JpdGVTdHJlYW0iLCJvcHRpb25zIiwic2VsZWN0b3IiLCJjaHVua1N1bSIsInVwc2VydCIsIiRzZXRPbkluc2VydCIsImlzT25lUGFydCIsImlzTXVsdGlQYXJ0IiwiaXNTdG9yZVN5bmMiLCJ3cml0ZVN0cmVhbSIsInNhZmVPbiIsInNldE9iaiIsInVwZGF0ZSIsIiRzZXQiLCJjaHVua0NvdW50Iiwic2l6ZSIsIm1vZGlmaWVyIiwiJHVuc2V0IiwiY2h1bmtTaXplIiwidXBsb2FkZWRBdCIsIkRhdGUiLCJzeW5jaHJvbml6ZWRBdCIsImV2ZW50TmFtZSIsImVycm9yIiwiY3JlYXRlUmVhZFN0cmVhbSIsInRvdGFsQ2h1bmtzIiwiZ2V0TmV4dFN0cmVhbUZ1bmMiLCJNZXRlb3IiLCJiaW5kRW52aXJvbm1lbnQiLCJuZXh0IiwiY2h1bmtSZWFkU3RyZWFtIiwiY29tYmluZWRTdHJlYW0iLCJjcmVhdGUiLCJjdXJyZW50Q2h1bmsiLCJhcHBlbmQiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLElBQUlBLGdCQUFKO0FBQXFCQyxNQUFNLENBQUNDLElBQVAsQ0FBWSxvQ0FBWixFQUFpRDtBQUFDRixrQkFBZ0IsQ0FBQ0csQ0FBRCxFQUFHO0FBQUNILG9CQUFnQixHQUFDRyxDQUFqQjtBQUFtQjs7QUFBeEMsQ0FBakQsRUFBMkYsQ0FBM0Y7QUFDckJILGdCQUFnQixDQUFDO0FBQ2hCLHFCQUFtQjtBQURILENBQUQsRUFFYix1QkFGYSxDQUFoQixDOzs7Ozs7Ozs7OztBQ0RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBLElBQUlJLFlBQVksR0FBR0MsT0FBTyxDQUFDLFFBQUQsQ0FBUCxDQUFrQkQsWUFBckMsQyxDQUVBOzs7QUFDQSxJQUFJRSxjQUFjLEdBQUdELE9BQU8sQ0FBQyxpQkFBRCxDQUE1QjtBQUVBOzs7Ozs7OztBQU1BRSxFQUFF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Ry9GLEVBQUUsQ0FBQ0MsU0FBSCxDQUFhSyxPQUFiLENBQXFCd0MsT0FBckIsQ0FBNkIyQyxnQkFBN0IsQ0FBOEMxQyxPQUE5QyxDQUF0QjtBQUNBK0MsVUFBSSxDQUFDQyxlQUFELENBQUo7QUFDRCxLQUpNLEVBSUosVUFBVVAsS0FBVixFQUFpQjtBQUNsQixZQUFNQSxLQUFOO0FBQ0QsS0FOTSxDQUFQO0FBT0QsR0FyQitDLENBdUJoRDs7O0FBQ0EsTUFBSVEsY0FBYyxHQUFHakcsY0FBYyxDQUFDa0csTUFBZixFQUFyQixDQXhCZ0QsQ0EwQmhEOztBQUNBLE1BQUlDLFlBQVksR0FBRyxDQUFuQjs7QUFDQSxPQUFLLElBQUlqRSxLQUFLLEdBQUcsQ0FBakIsRUFBb0JBLEtBQUssR0FBR3lELFdBQTVCLEVBQXlDekQsS0FBSyxFQUE5QyxFQUFrRDtBQUNoRCtELGtCQUFjLENBQUNHLE1BQWYsQ0FBc0JSLGlCQUFpQixDQUFDMUQsS0FBRCxDQUF2QztBQUNELEdBOUIrQyxDQWdDaEQ7OztBQUNBLFNBQU8rRCxjQUFQO0FBQ0QsQ0FsQ0QsQyIsImZpbGUiOiIvcGFja2FnZXMvc3RlZWRvc19jZnMtdGVtcHN0b3JlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgY2hlY2tOcG1WZXJzaW9ucyB9IGZyb20gJ21ldGVvci90bWVhc2RheTpjaGVjay1ucG0tdmVyc2lvbnMnO1xuY2hlY2tOcG1WZXJzaW9ucyh7XG5cdCdjb21iaW5lZC1zdHJlYW0nOiAnMC4wLjQnXG59LCAnc3RlZWRvczpjZnMtdGVtcHN0b3JlJyk7IiwiLy8gIyNUZW1wb3JhcnkgU3RvcmFnZVxuLy9cbi8vIFRlbXBvcmFyeSBzdG9yYWdlIGlzIHVzZWQgZm9yIGNodW5rZWQgdXBsb2FkcyB1bnRpbCBhbGwgY2h1bmtzIGFyZSByZWNlaXZlZFxuLy8gYW5kIGFsbCBjb3BpZXMgaGF2ZSBiZWVuIG1hZGUgb3IgZ2l2ZW4gdXAuIEluIHNvbWUgY2FzZXMsIHRoZSBvcmlnaW5hbCBmaWxlXG4vLyBpcyBzdG9yZWQgb25seSBpbiB0ZW1wb3Jhcnkgc3RvcmFnZSAoZm9yIGV4YW1wbGUsIGlmIGFsbCBjb3BpZXMgZG8gc29tZVxuLy8gbWFuaXB1bGF0aW9uIGluIGJlZm9yZVNhdmUpLiBUaGlzIGlzIHdoeSB3ZSB1c2UgdGhlIHRlbXBvcmFyeSBmaWxlIGFzIHRoZVxuLy8gYmFzaXMgZm9yIGVhY2ggc2F2ZWQgY29weSwgYW5kIHRoZW4gcmVtb3ZlIGl0IGFmdGVyIGFsbCBjb3BpZXMgYXJlIHNhdmVkLlxuLy9cbi8vIEV2ZXJ5IGNodW5rIGlzIHNhdmVkIGFzIGFuIGluZGl2aWR1YWwgdGVtcG9yYXJ5IGZpbGUuIFRoaXMgaXMgc2FmZXIgdGhhblxuLy8gYXR0ZW1wdGluZyB0byB3cml0ZSBtdWx0aXBsZSBpbmNvbWluZyBjaHVua3MgdG8gZGlmZmVyZW50IHBvc2l0aW9ucyBpbiBhXG4vLyBzaW5nbGUgdGVtcG9yYXJ5IGZpbGUsIHdoaWNoIGNhbiBsZWFkIHRvIHdyaXRlIGNvbmZsaWN0cy5cbi8vXG4vLyBVc2luZyB0ZW1wIGZpbGVzIGFsc28gYWxsb3dzIHVzIHRvIGVhc2lseSByZXN1bWUgdXBsb2FkcywgZXZlbiBpZiB0aGUgc2VydmVyXG4vLyByZXN0YXJ0cywgYW5kIHRvIGtlZXAgdGhlIHdvcmtpbmcgbWVtb3J5IGNsZWFyLlxuXG4vLyBUaGUgRlMuVGVtcFN0b3JlIGVtaXRzIGV2ZW50cyB0aGF0IG90aGVycyBhcmUgYWJsZSB0byBsaXN0ZW4gdG9cbnZhciBFdmVudEVtaXR0ZXIgPSByZXF1aXJlKCdldmVudHMnKS5FdmVudEVtaXR0ZXI7XG5cbi8vIFdlIGhhdmUgYSBzcGVjaWFsIHN0cmVhbSBjb25jYXRpbmcgYWxsIGNodW5rIGZpbGVzIGludG8gb25lIHJlYWRhYmxlIHN0cmVhbVxudmFyIENvbWJpbmVkU3RyZWFtID0gcmVxdWlyZSgnY29tYmluZWQtc3RyZWFtJyk7XG5cbi8qKiBAbmFtZXNwYWNlIEZTLlRlbXBTdG9yZVxuICogQHByb3BlcnR5IEZTLlRlbXBTdG9yZVxuICogQHR5cGUge29iamVjdH1cbiAqIEBwdWJsaWNcbiAqICppdCdzIGFuIGV2ZW50IGVtaXR0ZXIqXG4gKi9cbkZTLlRlbXBTdG9yZSA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcblxuLy8gQ3JlYXRlIGEgdHJhY2tlciBjb2xsZWN0aW9uIGZvciBrZWVwaW5nIHRyYWNrIG9mIGFsbCBjaHVua3MgZm9yIGFueSBmaWxlcyB0aGF0IGFyZSBjdXJyZW50bHkgaW4gdGhlIHRlbXAgc3RvcmVcbnZhciB0cmFja2VyID0gRlMuVGVtcFN0b3JlLlRyYWNrZXIgPSBuZXcgTW9uZ28uQ29sbGVjdGlvbignY2ZzLl90ZW1wc3RvcmUuY2h1bmtzJyk7XG5cbi8qKlxuICogQHByb3BlcnR5IEZTLlRlbXBTdG9yZS5TdG9yYWdlXG4gKiBAdHlwZSB7U3RvcmFnZUFkYXB0ZXJ9XG4gKiBAbmFtZXNwYWNlIEZTLlRlbXBTdG9yZVxuICogQHByaXZhdGVcbiAqIFRoaXMgcHJvcGVydHkgaXMgc2V0IHRvIGVpdGhlciBgRlMuU3RvcmUuRmlsZVN5c3RlbWAgb3IgYEZTLlN0b3JlLkdyaWRGU2BcbiAqXG4gKiBfX1doZW4gYW5kIHdoeTpfX1xuICogV2Ugbm9ybWFsbHkgZGVmYXVsdCB0byBgY2ZzLWZpbGVzeXN0ZW1gIHVubGVzcyBpdHMgbm90IGluc3RhbGxlZC4gKih3ZSBkZWZhdWx0IHRvIGdyaWRmcyBpZiBpbnN0YWxsZWQpKlxuICogQnV0IGlmIGBjZnMtZ3JpZGZzYCBhbmQgYGNmcy13b3JrZXJgIGlzIGluc3RhbGxlZCB3ZSBkZWZhdWx0IHRvIGBjZnMtZ3JpZGZzYFxuICpcbiAqIElmIGBjZnMtZ3JpZGZzYCBhbmQgYGNmcy1maWxlc3lzdGVtYCBpcyBub3QgaW5zdGFsbGVkIHdlIGxvZyBhIHdhcm5pbmcuXG4gKiB0aGUgdXNlciBjYW4gc2V0IGBGUy5UZW1wU3RvcmUuU3RvcmFnZWAgdGhlbSBzZWxmcyBlZy46XG4gKiBgYGBqc1xuICogICAvLyBJdHMgaW1wb3J0YW50IHRvIHNldCBgaW50ZXJuYWw6IHRydWVgIHRoaXMgbGV0cyB0aGUgU0Ega25vdyB0aGF0IHdlXG4gKiAgIC8vIGFyZSB1c2luZyB0aGlzIGludGVybmFsbHkgYW5kIGl0IHdpbGwgZ2l2ZSB1cyBkaXJlY3QgU0EgYXBpXG4gKiAgIEZTLlRlbXBTdG9yZS5TdG9yYWdlID0gbmV3IEZTLlN0b3JlLkdyaWRGUygnX3RlbXBzdG9yZScsIHsgaW50ZXJuYWw6IHRydWUgfSk7XG4gKiBgYGBcbiAqXG4gKiA+IE5vdGU6IFRoaXMgaXMgY29uc2lkZXJlZCBhcyBgYWR2YW5jZWRgIHVzZSwgaXRzIG5vdCBhIGNvbW1vbiBwYXR0ZXJuLlxuICovXG5GUy5UZW1wU3RvcmUuU3RvcmFnZSA9IG51bGw7XG5cbi8vIFdlIHdpbGwgbm90IG1vdW50IGEgc3RvcmFnZSBhZGFwdGVyIHVudGlsIG5lZWRlZC4gVGhpcyBhbGxvd3MgdXMgdG8gY2hlY2sgZm9yIHRoZVxuLy8gZXhpc3RhbmNlIG9mIEZTLkZpbGVXb3JrZXIsIHdoaWNoIGlzIGxvYWRlZCBhZnRlciB0aGlzIHBhY2thZ2UgYmVjYXVzZSBpdFxuLy8gZGVwZW5kcyBvbiB0aGlzIHBhY2thZ2UuXG5mdW5jdGlvbiBtb3VudFN0b3JhZ2UoKSB7XG5cbiAgaWYgKEZTLlRlbXBTdG9yZS5TdG9yYWdlKSByZXR1cm47XG5cbiAgLy8gWFhYOiBXZSBjb3VsZCByZXBsYWNlIHRoaXMgdGVzdCwgdGVzdGluZyB0aGUgRlMgc2NvcGUgZm9yIGdyaWZGUyBldGMuXG4gIC8vIFRoaXMgaXMgb24gdGhlIHRvZG8gbGF0ZXIgd2hlbiB3ZSBnZXQgXCJzdGFibGVcIlxuICBpZiAoUGFja2FnZVtcInN0ZWVkb3M6Y2ZzLWdyaWRmc1wiXSAmJiAoUGFja2FnZVtcInN0ZWVkb3M6Y2ZzLXdvcmtlclwiXSB8fCAhUGFja2FnZVtcInN0ZWVkb3M6Y2ZzLWZpbGVzeXN0ZW1cIl0pKSB7XG4gICAgLy8gSWYgdGhlIGZpbGUgd29ya2VyIGlzIGluc3RhbGxlZCB3ZSB3b3VsZCBwcmVmZXIgdG8gdXNlIHRoZSBncmlkZnMgc2FcbiAgICAvLyBmb3Igc2NhbGFiaWxpdHkuIFdlIGFsc28gZGVmYXVsdCB0byBncmlkZnMgaWYgZmlsZXN5c3RlbSBpcyBub3QgZm91bmRcblxuICAgIC8vIFVzZSB0aGUgZ3JpZGZzXG4gICAgRlMuVGVtcFN0b3JlLlN0b3JhZ2UgPSBuZXcgRlMuU3RvcmUuR3JpZEZTKCdfdGVtcHN0b3JlJywgeyBpbnRlcm5hbDogdHJ1ZSB9KTtcbiAgfSBlbHNlIGlmIChQYWNrYWdlW1wic3RlZWRvczpjZnMtZmlsZXN5c3RlbVwiXSkge1xuXG4gICAgLy8gdXNlIHRoZSBGaWxlc3lzdGVtXG4gICAgRlMuVGVtcFN0b3JlLlN0b3JhZ2UgPSBuZXcgRlMuU3RvcmUuRmlsZVN5c3RlbSgnX3RlbXBzdG9yZScsIHsgcGF0aDogQ3JlYXRvci5zdGVlZG9zU3RvcmFnZURpcisnL190ZW1wc3RvcmUnLCBpbnRlcm5hbDogdHJ1ZSB9KTtcbiAgfSBlbHNlIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ0ZTLlRlbXBTdG9yZS5TdG9yYWdlIGlzIG5vdCBzZXQ6IEluc3RhbGwgc3RlZWRvczpjZnMtZmlsZXN5c3RlbSBvciBzdGVlZG9zOmNmcy1ncmlkZnMgb3Igc2V0IGl0IG1hbnVhbGx5Jyk7XG4gIH1cblxuICBGUy5kZWJ1ZyAmJiBjb25zb2xlLmxvZygnVGVtcFN0b3JlIGlzIG1vdW50ZWQgb24nLCBGUy5UZW1wU3RvcmUuU3RvcmFnZS50eXBlTmFtZSk7XG59XG5cbmZ1bmN0aW9uIG1vdW50RmlsZShmaWxlT2JqLCBuYW1lKSB7XG4gIGlmICghZmlsZU9iai5pc01vdW50ZWQoKSkge1xuICAgIHRocm93IG5ldyBFcnJvcihuYW1lICsgJyBjYW5ub3Qgd29yayB3aXRoIHVubW91bnRlZCBmaWxlJyk7XG4gIH1cbn1cblxuLy8gV2UgdXBkYXRlIHRoZSBmaWxlT2JqIG9uIHByb2dyZXNzXG5GUy5UZW1wU3RvcmUub24oJ3Byb2dyZXNzJywgZnVuY3Rpb24oZmlsZU9iaiwgY2h1bmtOdW0sIGNvdW50LCB0b3RhbCwgcmVzdWx0KSB7XG4gIEZTLmRlYnVnICYmIGNvbnNvbGUubG9nKCdUZW1wU3RvcmUgcHJvZ3Jlc3M6IFJlY2VpdmVkICcgKyBjb3VudCArICcgb2YgJyArIHRvdGFsICsgJyBjaHVua3MgZm9yICcgKyBmaWxlT2JqLm5hbWUoKSk7XG59KTtcblxuLy8gWFhYOiBUT0RPXG4vLyBGUy5UZW1wU3RvcmUub24oJ3N0b3JlZCcsIGZ1bmN0aW9uKGZpbGVPYmosIGNodW5rQ291bnQsIHJlc3VsdCkge1xuLy8gICAvLyBUaGlzIHNob3VsZCB3b3JrIGlmIHdlIHBhc3Mgb24gcmVzdWx0IGZyb20gdGhlIFNBIG9uIHN0b3JlZCBldmVudC4uLlxuLy8gICBmaWxlT2JqLnVwZGF0ZSh7ICRzZXQ6IHsgY2h1bmtTdW06IDEsIGNodW5rQ291bnQ6IGNodW5rQ291bnQsIHNpemU6IHJlc3VsdC5zaXplIH0gfSk7XG4vLyB9KTtcblxuLy8gU3RyZWFtIGltcGxlbWVudGF0aW9uXG5cbi8qKlxuICogQG1ldGhvZCBfY2h1bmtQYXRoXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtOdW1iZXJ9IFtuXSBDaHVuayBudW1iZXJcbiAqIEByZXR1cm5zIHtTdHJpbmd9IENodW5rIG5hbWluZyBjb252ZW50aW9uXG4gKi9cbl9jaHVua1BhdGggPSBmdW5jdGlvbihuKSB7XG4gIHJldHVybiAobiB8fCAwKSArICcuY2h1bmsnO1xufTtcblxuLyoqXG4gKiBAbWV0aG9kIF9maWxlUmVmZXJlbmNlXG4gKiBAcGFyYW0ge0ZTLkZpbGV9IGZpbGVPYmpcbiAqIEBwYXJhbSB7TnVtYmVyfSBjaHVua1xuICogQHByaXZhdGVcbiAqIEByZXR1cm5zIHtTdHJpbmd9IEdlbmVyYXRlZCBTQSBzcGVjaWZpYyBmaWxlS2V5IGZvciB0aGUgY2h1bmtcbiAqXG4gKiBOb3RlOiBDYWxsaW5nIGZ1bmN0aW9uIHNob3VsZCBjYWxsIG1vdW50U3RvcmFnZSgpIGZpcnN0LCBhbmRcbiAqIG1ha2Ugc3VyZSB0aGF0IGZpbGVPYmogaXMgbW91bnRlZC5cbiAqL1xuX2ZpbGVSZWZlcmVuY2UgPSBmdW5jdGlvbihmaWxlT2JqLCBjaHVuaywgZXhpc3RpbmcpIHtcbiAgLy8gTWF5YmUgaXQncyBhIGNodW5rIHdlJ3ZlIGFscmVhZHkgc2F2ZWRcbiAgZXhpc3RpbmcgPSBleGlzdGluZyB8fCB0cmFja2VyLmZpbmRPbmUoe2ZpbGVJZDogZmlsZU9iai5faWQsIGNvbGxlY3Rpb25OYW1lOiBmaWxlT2JqLmNvbGxlY3Rpb25OYW1lfSk7XG5cbiAgLy8gTWFrZSBhIHRlbXBvcmFyeSBmaWxlT2JqIGp1c3QgZm9yIGZpbGVLZXkgZ2VuZXJhdGlvblxuICB2YXIgdGVtcEZpbGVPYmogPSBuZXcgRlMuRmlsZSh7XG4gICAgY29sbGVjdGlvbk5hbWU6IGZpbGVPYmouY29sbGVjdGlvbk5hbWUsXG4gICAgX2lkOiBmaWxlT2JqLl9pZCxcbiAgICBvcmlnaW5hbDoge1xuICAgICAgbmFtZTogX2NodW5rUGF0aChjaHVuaylcbiAgICB9LFxuICAgIGNvcGllczoge1xuICAgICAgX3RlbXBzdG9yZToge1xuICAgICAgICBrZXk6IGV4aXN0aW5nICYmIGV4aXN0aW5nLmtleXNbY2h1bmtdXG4gICAgICB9XG4gICAgfVxuICB9KTtcblxuICAvLyBSZXR1cm4gYSBmaXR0aW5nIGZpbGVLZXkgU0Egc3BlY2lmaWNcbiAgcmV0dXJuIEZTLlRlbXBTdG9yZS5TdG9yYWdlLmFkYXB0ZXIuZmlsZUtleSh0ZW1wRmlsZU9iaik7XG59O1xuXG4vKipcbiAqIEBtZXRob2QgRlMuVGVtcFN0b3JlLmV4aXN0c1xuICogQHBhcmFtIHtGUy5GaWxlfSBGaWxlIG9iamVjdFxuICogQHJldHVybnMge0Jvb2xlYW59IElzIHRoaXMgZmlsZSwgb3IgcGFydHMgb2YgaXQsIGN1cnJlbnRseSBzdG9yZWQgaW4gdGhlIFRlbXBTdG9yZVxuICovXG5GUy5UZW1wU3RvcmUuZXhpc3RzID0gZnVuY3Rpb24oZmlsZU9iaikge1xuICB2YXIgZXhpc3RpbmcgPSB0cmFja2VyLmZpbmRPbmUoe2ZpbGVJZDogZmlsZU9iai5faWQsIGNvbGxlY3Rpb25OYW1lOiBmaWxlT2JqLmNvbGxlY3Rpb25OYW1lfSk7XG4gIHJldHVybiAhIWV4aXN0aW5nO1xufTtcblxuLyoqXG4gKiBAbWV0aG9kIEZTLlRlbXBTdG9yZS5saXN0UGFydHNcbiAqIEBwYXJhbSB7RlMuRmlsZX0gZmlsZU9ialxuICogQHJldHVybnMge09iamVjdH0gb2YgcGFydHMgYWxyZWFkeSBzdG9yZWRcbiAqIEB0b2RvIFRoaXMgaXMgbm90IHlldCBpbXBsZW1lbnRlZCwgbWlsZXN0b25lIDEuMS4wXG4gKi9cbkZTLlRlbXBTdG9yZS5saXN0UGFydHMgPSBmdW5jdGlvbiBmc1RlbXBTdG9yZUxpc3RQYXJ0cyhmaWxlT2JqKSB7XG4gIHZhciBzZWxmID0gdGhpcztcbiAgY29uc29sZS53YXJuKCdUaGlzIGZ1bmN0aW9uIGlzIG5vdCBjb3JyZWN0bHkgaW1wbGVtZW50ZWQgdXNpbmcgU0EgaW4gVGVtcFN0b3JlJyk7XG4gIC8vWFhYIFRoaXMgZnVuY3Rpb24gbWlnaHQgYmUgbmVjZXNzYXJ5IGZvciByZXN1bWUuIE5vdCBjdXJyZW50bHkgc3VwcG9ydGVkLlxufTtcblxuLyoqXG4gKiBAbWV0aG9kIEZTLlRlbXBTdG9yZS5yZW1vdmVGaWxlXG4gKiBAcHVibGljXG4gKiBAcGFyYW0ge0ZTLkZpbGV9IGZpbGVPYmpcbiAqIFRoaXMgZnVuY3Rpb24gcmVtb3ZlcyB0aGUgZmlsZSBmcm9tIHRlbXBzdG9yYWdlIC0gaXQgY2FyZXMgbm90IGlmIGZpbGUgaXNcbiAqIGFscmVhZHkgcmVtb3ZlZCBvciBub3QgZm91bmQsIGdvYWwgaXMgcmVhY2hlZCBhbnl3YXkuXG4gKi9cbkZTLlRlbXBTdG9yZS5yZW1vdmVGaWxlID0gZnVuY3Rpb24gZnNUZW1wU3RvcmVSZW1vdmVGaWxlKGZpbGVPYmopIHtcbiAgdmFyIHNlbGYgPSB0aGlzO1xuXG4gIC8vIEVuc3VyZSB0aGF0IHdlIGhhdmUgYSBzdG9yYWdlIGFkYXB0ZXIgbW91bnRlZDsgaWYgbm90LCB0aHJvdyBhbiBlcnJvci5cbiAgbW91bnRTdG9yYWdlKCk7XG5cbiAgLy8gSWYgZmlsZU9iaiBpcyBub3QgbW91bnRlZCBvciBjYW4ndCBiZSwgdGhyb3cgYW4gZXJyb3JcbiAgbW91bnRGaWxlKGZpbGVPYmosICdGUy5UZW1wU3RvcmUucmVtb3ZlRmlsZScpO1xuXG4gIC8vIEVtaXQgZXZlbnRcbiAgc2VsZi5lbWl0KCdyZW1vdmUnLCBmaWxlT2JqKTtcblxuICB2YXIgY2h1bmtJbmZvID0gdHJhY2tlci5maW5kT25lKHtcbiAgICBmaWxlSWQ6IGZpbGVPYmouX2lkLFxuICAgIGNvbGxlY3Rpb25OYW1lOiBmaWxlT2JqLmNvbGxlY3Rpb25OYW1lXG4gIH0pO1xuXG4gIGlmIChjaHVua0luZm8pIHtcblxuICAgIC8vIFVubGluayBlYWNoIGZpbGVcbiAgICBGUy5VdGlsaXR5LmVhY2goY2h1bmtJbmZvLmtleXMgfHwge30sIGZ1bmN0aW9uIChrZXksIGNodW5rKSB7XG4gICAgICB2YXIgZmlsZUtleSA9IF9maWxlUmVmZXJlbmNlKGZpbGVPYmosIGNodW5rLCBjaHVua0luZm8pO1xuICAgICAgRlMuVGVtcFN0b3JlLlN0b3JhZ2UuYWRhcHRlci5yZW1vdmUoZmlsZUtleSwgRlMuVXRpbGl0eS5ub29wKTtcbiAgICB9KTtcblxuICAgIC8vIFJlbW92ZSBmaWxlT2JqIGZyb20gdHJhY2tlciBjb2xsZWN0aW9uLCB0b29cbiAgICB0cmFja2VyLnJlbW92ZSh7X2lkOiBjaHVua0luZm8uX2lkfSk7XG5cbiAgfVxufTtcblxuLyoqXG4gKiBAbWV0aG9kIEZTLlRlbXBTdG9yZS5yZW1vdmVBbGxcbiAqIEBwdWJsaWNcbiAqIFRoaXMgZnVuY3Rpb24gcmVtb3ZlcyBhbGwgZmlsZXMgZnJvbSB0ZW1wc3RvcmFnZSAtIGl0IGNhcmVzIG5vdCBpZiBmaWxlIGlzXG4gKiBhbHJlYWR5IHJlbW92ZWQgb3Igbm90IGZvdW5kLCBnb2FsIGlzIHJlYWNoZWQgYW55d2F5LlxuICovXG5GUy5UZW1wU3RvcmUucmVtb3ZlQWxsID0gZnVuY3Rpb24gZnNUZW1wU3RvcmVSZW1vdmVBbGwoKSB7XG4gIHZhciBzZWxmID0gdGhpcztcblxuICAvLyBFbnN1cmUgdGhhdCB3ZSBoYXZlIGEgc3RvcmFnZSBhZGFwdGVyIG1vdW50ZWQ7IGlmIG5vdCwgdGhyb3cgYW4gZXJyb3IuXG4gIG1vdW50U3RvcmFnZSgpO1xuXG4gIHRyYWNrZXIuZmluZCgpLmZvckVhY2goZnVuY3Rpb24gKGNodW5rSW5mbykge1xuICAgIC8vIFVubGluayBlYWNoIGZpbGVcbiAgICBGUy5VdGlsaXR5LmVhY2goY2h1bmtJbmZvLmtleXMgfHwge30sIGZ1bmN0aW9uIChrZXksIGNodW5rKSB7XG4gICAgICB2YXIgZmlsZUtleSA9IF9maWxlUmVmZXJlbmNlKHtfaWQ6IGNodW5rSW5mby5maWxlSWQsIGNvbGxlY3Rpb25OYW1lOiBjaHVua0luZm8uY29sbGVjdGlvbk5hbWV9LCBjaHVuaywgY2h1bmtJbmZvKTtcbiAgICAgIEZTLlRlbXBTdG9yZS5TdG9yYWdlLmFkYXB0ZXIucmVtb3ZlKGZpbGVLZXksIEZTLlV0aWxpdHkubm9vcCk7XG4gICAgfSk7XG5cbiAgICAvLyBSZW1vdmUgZnJvbSB0cmFja2VyIGNvbGxlY3Rpb24sIHRvb1xuICAgIHRyYWNrZXIucmVtb3ZlKHtfaWQ6IGNodW5rSW5mby5faWR9KTtcbiAgfSk7XG59O1xuXG4vKipcbiAqIEBtZXRob2QgRlMuVGVtcFN0b3JlLmNyZWF0ZVdyaXRlU3RyZWFtXG4gKiBAcHVibGljXG4gKiBAcGFyYW0ge0ZTLkZpbGV9IGZpbGVPYmogRmlsZSB0byBzdG9yZSBpbiB0ZW1wb3Jhcnkgc3RvcmFnZVxuICogQHBhcmFtIHtOdW1iZXIgfCBTdHJpbmd9IFtvcHRpb25zXVxuICogQHJldHVybnMge1N0cmVhbX0gV3JpdGVhYmxlIHN0cmVhbVxuICpcbiAqIGBvcHRpb25zYCBvZiBkaWZmZXJlbnQgdHlwZXMgbWVhbiBkaWZmZXJudCB0aGluZ3M6XG4gKiAqIGB1bmRlZmluZWRgIFdlIHN0b3JlIHRoZSBmaWxlIGluIG9uZSBwYXJ0XG4gKiAqKE5vcm1hbCBzZXJ2ZXItc2lkZSBhcGkgdXNhZ2UpKlxuICogKiBgTnVtYmVyYCB0aGUgbnVtYmVyIGlzIHRoZSBwYXJ0IG51bWJlciB0b3RhbFxuICogKihtdWx0aXBhcnQgdXBsb2FkcyB3aWxsIHVzZSB0aGlzIGFwaSkqXG4gKiAqIGBTdHJpbmdgIHRoZSBzdHJpbmcgaXMgdGhlIG5hbWUgb2YgdGhlIGBzdG9yZWAgdGhhdCB3YW50cyB0byBzdG9yZSBmaWxlIGRhdGFcbiAqICooc3RvcmVzIHRoYXQgd2FudCB0byBzeW5jIHRoZWlyIGRhdGEgdG8gdGhlIHJlc3Qgb2YgdGhlIGZpbGVzIHN0b3JlcyB3aWxsIHVzZSB0aGlzKSpcbiAqXG4gKiA+IE5vdGU6IGZpbGVPYmogbXVzdCBiZSBtb3VudGVkIG9uIGEgYEZTLkNvbGxlY3Rpb25gLCBpdCBtYWtlcyBubyBzZW5zZSB0byBzdG9yZSBvdGhlcndpc2VcbiAqL1xuRlMuVGVtcFN0b3JlLmNyZWF0ZVdyaXRlU3RyZWFtID0gZnVuY3Rpb24oZmlsZU9iaiwgb3B0aW9ucykge1xuICB2YXIgc2VsZiA9IHRoaXM7XG5cbiAgLy8gRW5zdXJlIHRoYXQgd2UgaGF2ZSBhIHN0b3JhZ2UgYWRhcHRlciBtb3VudGVkOyBpZiBub3QsIHRocm93IGFuIGVycm9yLlxuICBtb3VudFN0b3JhZ2UoKTtcblxuICAvLyBJZiBmaWxlT2JqIGlzIG5vdCBtb3VudGVkIG9yIGNhbid0IGJlLCB0aHJvdyBhbiBlcnJvclxuICBtb3VudEZpbGUoZmlsZU9iaiwgJ0ZTLlRlbXBTdG9yZS5jcmVhdGVXcml0ZVN0cmVhbScpO1xuXG4gIC8vIENhY2hlIHRoZSBzZWxlY3RvciBmb3IgdXNlIG11bHRpcGxlIHRpbWVzIGJlbG93XG4gIHZhciBzZWxlY3RvciA9IHtmaWxlSWQ6IGZpbGVPYmouX2lkLCBjb2xsZWN0aW9uTmFtZTogZmlsZU9iai5jb2xsZWN0aW9uTmFtZX07XG5cbiAgLy8gVE9ETywgc2hvdWxkIHBhc3MgaW4gY2h1bmtTdW0gc28gd2UgZG9uJ3QgbmVlZCB0byB1c2UgRlMuRmlsZSBmb3IgaXRcbiAgdmFyIGNodW5rU3VtID0gZmlsZU9iai5jaHVua1N1bSB8fCAxO1xuXG4gIC8vIEFkZCBmaWxlT2JqIHRvIHRyYWNrZXIgY29sbGVjdGlvblxuICB0cmFja2VyLnVwc2VydChzZWxlY3RvciwgeyRzZXRPbkluc2VydDoge2tleXM6IHt9fX0pO1xuXG4gIC8vIERldGVybWluZSBob3cgd2UncmUgdXNpbmcgdGhlIHdyaXRlU3RyZWFtXG4gIHZhciBpc09uZVBhcnQgPSBmYWxzZSwgaXNNdWx0aVBhcnQgPSBmYWxzZSwgaXNTdG9yZVN5bmMgPSBmYWxzZSwgY2h1bmtOdW0gPSAwO1xuICBpZiAob3B0aW9ucyA9PT0gK29wdGlvbnMpIHtcbiAgICBpc011bHRpUGFydCA9IHRydWU7XG4gICAgY2h1bmtOdW0gPSBvcHRpb25zO1xuICB9IGVsc2UgaWYgKG9wdGlvbnMgPT09ICcnK29wdGlvbnMpIHtcbiAgICBpc1N0b3JlU3luYyA9IHRydWU7XG4gIH0gZWxzZSB7XG4gICAgaXNPbmVQYXJ0ID0gdHJ1ZTtcbiAgfVxuXG4gIC8vIFhYWDogaXQgc2hvdWxkIGJlIHBvc3NpYmxlIGZvciBhIHN0b3JlIHRvIHN5bmMgYnkgc3RvcmluZyBkYXRhIGludG8gdGhlXG4gIC8vIHRlbXBzdG9yZSAtIHRoaXMgY291bGQgYmUgZG9uZSBuaWNlbHkgYnkgc2V0dGluZyB0aGUgc3RvcmUgbmFtZSBhcyBzdHJpbmdcbiAgLy8gaW4gdGhlIGNodW5rIHZhcmlhYmxlP1xuICAvLyBUaGlzIHN0b3JlIG5hbWUgY291bGQgYmUgcGFzc2VkIG9uIHRoZSB0aGUgZmlsZXdvcmtlciB2aWEgdGhlIHVwbG9hZGVkXG4gIC8vIGV2ZW50XG4gIC8vIFNvIHRoZSB1cGxvYWRlZCBldmVudCBjYW4gcmV0dXJuOlxuICAvLyB1bmRlZmluZWQgLSBpZiBkYXRhIGlzIHN0b3JlZCBpbnRvIGFuZCBzaG91bGQgc3luYyBvdXQgdG8gYWxsIHN0b3JhZ2UgYWRhcHRlcnNcbiAgLy8gbnVtYmVyIC0gaWYgYSBjaHVuayBoYXMgYmVlbiB1cGxvYWRlZFxuICAvLyBzdHJpbmcgLSBpZiBhIHN0b3JhZ2UgYWRhcHRlciB3YW50cyB0byBzeW5jIGl0cyBkYXRhIHRvIHRoZSBvdGhlciBTQSdzXG5cbiAgLy8gRmluZCBhIG5pY2UgbG9jYXRpb24gZm9yIHRoZSBjaHVuayBkYXRhXG4gIHZhciBmaWxlS2V5ID0gX2ZpbGVSZWZlcmVuY2UoZmlsZU9iaiwgY2h1bmtOdW0pO1xuXG4gIC8vIENyZWF0ZSB0aGUgc3RyZWFtIGFzIE1ldGVvciBzYWZlIHN0cmVhbVxuICB2YXIgd3JpdGVTdHJlYW0gPSBGUy5UZW1wU3RvcmUuU3RvcmFnZS5hZGFwdGVyLmNyZWF0ZVdyaXRlU3RyZWFtKGZpbGVLZXkpO1xuXG4gIC8vIFdoZW4gdGhlIHN0cmVhbSBjbG9zZXMgd2UgdXBkYXRlIHRoZSBjaHVua0NvdW50XG4gIHdyaXRlU3RyZWFtLnNhZmVPbignc3RvcmVkJywgZnVuY3Rpb24ocmVzdWx0KSB7XG4gICAgLy8gU2F2ZSBrZXkgaW4gdHJhY2tlciBkb2N1bWVudFxuICAgIHZhciBzZXRPYmogPSB7fTtcbiAgICBzZXRPYmpbJ2tleXMuJyArIGNodW5rTnVtXSA9IHJlc3VsdC5maWxlS2V5O1xuICAgIHRyYWNrZXIudXBkYXRlKHNlbGVjdG9yLCB7JHNldDogc2V0T2JqfSk7XG5cbiAgICAvLyBHZXQgdXBkYXRlZCBjaHVua0NvdW50XG4gICAgdmFyIGNodW5rQ291bnQgPSBGUy5VdGlsaXR5LnNpemUodHJhY2tlci5maW5kT25lKHNlbGVjdG9yKS5rZXlzKTtcblxuICAgIC8vIFByb2dyZXNzXG4gICAgc2VsZi5lbWl0KCdwcm9ncmVzcycsIGZpbGVPYmosIGNodW5rTnVtLCBjaHVua0NvdW50LCBjaHVua1N1bSwgcmVzdWx0KTtcblxuICAgIC8vIElmIHVwbG9hZCBpcyBjb21wbGV0ZWRcbiAgICBpZiAoY2h1bmtDb3VudCA9PT0gY2h1bmtTdW0pIHtcbiAgICAgIC8vIFdlIG5vIGxvbmdlciBuZWVkIHRoZSBjaHVuayBpbmZvXG4gICAgICB2YXIgbW9kaWZpZXIgPSB7ICRzZXQ6IHt9LCAkdW5zZXQ6IHtjaHVua0NvdW50OiAxLCBjaHVua1N1bTogMSwgY2h1bmtTaXplOiAxfSB9O1xuXG4gICAgICAvLyBDaGVjayBpZiB0aGUgZmlsZSBoYXMgYmVlbiB1cGxvYWRlZCBiZWZvcmVcbiAgICAgIGlmICh0eXBlb2YgZmlsZU9iai51cGxvYWRlZEF0ID09PSAndW5kZWZpbmVkJykge1xuICAgICAgICAvLyBXZSBzZXQgdGhlIHVwbG9hZGVkQXQgZGF0ZVxuICAgICAgICBtb2RpZmllci4kc2V0LnVwbG9hZGVkQXQgPSBuZXcgRGF0ZSgpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgLy8gV2UgaGF2ZSBiZWVuIHVwbG9hZGVkIHNvIGFuIGV2ZW50IHdlcmUgZmlsZSBkYXRhIGlzIHVwZGF0ZWQgaXNcbiAgICAgICAgLy8gY2FsbGVkIHN5bmNocm9uaXppbmcgLSBzbyB0aGlzIG11c3QgYmUgYSBzeW5jaHJvbml6ZWRBdD9cbiAgICAgICAgbW9kaWZpZXIuJHNldC5zeW5jaHJvbml6ZWRBdCA9IG5ldyBEYXRlKCk7XG4gICAgICB9XG5cbiAgICAgIC8vIFVwZGF0ZSB0aGUgZmlsZU9iamVjdFxuICAgICAgZmlsZU9iai51cGRhdGUobW9kaWZpZXIpO1xuXG4gICAgICAvLyBGaXJlIGVuZGluZyBldmVudHNcbiAgICAgIHZhciBldmVudE5hbWUgPSBpc1N0b3JlU3luYyA/ICdzeW5jaHJvbml6ZWQnIDogJ3N0b3JlZCc7XG4gICAgICBzZWxmLmVtaXQoZXZlbnROYW1lLCBmaWxlT2JqLCByZXN1bHQpO1xuXG4gICAgICAvLyBYWFggaXMgZW1pdHRpbmcgXCJyZWFkeVwiIG5lY2Vzc2FyeT9cbiAgICAgIHNlbGYuZW1pdCgncmVhZHknLCBmaWxlT2JqLCBjaHVua0NvdW50LCByZXN1bHQpO1xuICAgIH0gZWxzZSB7XG4gICAgICAvLyBVcGRhdGUgdGhlIGNodW5rQ291bnQgb24gdGhlIGZpbGVPYmplY3RcbiAgICAgIGZpbGVPYmoudXBkYXRlKHsgJHNldDoge2NodW5rQ291bnQ6IGNodW5rQ291bnR9IH0pO1xuICAgIH1cbiAgfSk7XG5cbiAgLy8gRW1pdCBlcnJvcnNcbiAgd3JpdGVTdHJlYW0ub24oJ2Vycm9yJywgZnVuY3Rpb24gKGVycm9yKSB7XG4gICAgRlMuZGVidWcgJiYgY29uc29sZS5sb2coJ1RlbXBTdG9yZSB3cml0ZVN0cmVhbSBlcnJvcjonLCBlcnJvcik7XG4gICAgc2VsZi5lbWl0KCdlcnJvcicsIGVycm9yLCBmaWxlT2JqKTtcbiAgfSk7XG5cbiAgcmV0dXJuIHdyaXRlU3RyZWFtO1xufTtcblxuLyoqXG4gICogQG1ldGhvZCBGUy5UZW1wU3RvcmUuY3JlYXRlUmVhZFN0cmVhbVxuICAqIEBwdWJsaWNcbiAgKiBAcGFyYW0ge0ZTLkZpbGV9IGZpbGVPYmogVGhlIGZpbGUgdG8gcmVhZFxuICAqIEByZXR1cm4ge1N0cmVhbX0gUmV0dXJucyByZWFkYWJsZSBzdHJlYW1cbiAgKlxuICAqL1xuRlMuVGVtcFN0b3JlLmNyZWF0ZVJlYWRTdHJlYW0gPSBmdW5jdGlvbihmaWxlT2JqKSB7XG4gIC8vIEVuc3VyZSB0aGF0IHdlIGhhdmUgYSBzdG9yYWdlIGFkYXB0ZXIgbW91bnRlZDsgaWYgbm90LCB0aHJvdyBhbiBlcnJvci5cbiAgbW91bnRTdG9yYWdlKCk7XG5cbiAgLy8gSWYgZmlsZU9iaiBpcyBub3QgbW91bnRlZCBvciBjYW4ndCBiZSwgdGhyb3cgYW4gZXJyb3JcbiAgbW91bnRGaWxlKGZpbGVPYmosICdGUy5UZW1wU3RvcmUuY3JlYXRlUmVhZFN0cmVhbScpO1xuXG4gIEZTLmRlYnVnICYmIGNvbnNvbGUubG9nKCdGUy5UZW1wU3RvcmUgY3JlYXRpbmcgcmVhZCBzdHJlYW0gZm9yICcgKyBmaWxlT2JqLl9pZCk7XG5cbiAgLy8gRGV0ZXJtaW5lIGhvdyBtYW55IHRvdGFsIGNodW5rcyB0aGVyZSBhcmUgZnJvbSB0aGUgdHJhY2tlciBjb2xsZWN0aW9uXG4gIHZhciBjaHVua0luZm8gPSB0cmFja2VyLmZpbmRPbmUoe2ZpbGVJZDogZmlsZU9iai5faWQsIGNvbGxlY3Rpb25OYW1lOiBmaWxlT2JqLmNvbGxlY3Rpb25OYW1lfSkgfHwge307XG4gIHZhciB0b3RhbENodW5rcyA9IEZTLlV0aWxpdHkuc2l6ZShjaHVua0luZm8ua2V5cyk7XG5cbiAgZnVuY3Rpb24gZ2V0TmV4dFN0cmVhbUZ1bmMoY2h1bmspIHtcbiAgICByZXR1cm4gTWV0ZW9yLmJpbmRFbnZpcm9ubWVudChmdW5jdGlvbihuZXh0KSB7XG4gICAgICB2YXIgZmlsZUtleSA9IF9maWxlUmVmZXJlbmNlKGZpbGVPYmosIGNodW5rKTtcbiAgICAgIHZhciBjaHVua1JlYWRTdHJlYW0gPSBGUy5UZW1wU3RvcmUuU3RvcmFnZS5hZGFwdGVyLmNyZWF0ZVJlYWRTdHJlYW0oZmlsZUtleSk7XG4gICAgICBuZXh0KGNodW5rUmVhZFN0cmVhbSk7XG4gICAgfSwgZnVuY3Rpb24gKGVycm9yKSB7XG4gICAgICB0aHJvdyBlcnJvcjtcbiAgICB9KTtcbiAgfVxuXG4gIC8vIE1ha2UgYSBjb21iaW5lZCBzdHJlYW1cbiAgdmFyIGNvbWJpbmVkU3RyZWFtID0gQ29tYmluZWRTdHJlYW0uY3JlYXRlKCk7XG5cbiAgLy8gQWRkIGVhY2ggY2h1bmsgc3RyZWFtIHRvIHRoZSBjb21iaW5lZCBzdHJlYW0gd2hlbiB0aGUgcHJldmlvdXMgY2h1bmsgc3RyZWFtIGVuZHNcbiAgdmFyIGN1cnJlbnRDaHVuayA9IDA7XG4gIGZvciAodmFyIGNodW5rID0gMDsgY2h1bmsgPCB0b3RhbENodW5rczsgY2h1bmsrKykge1xuICAgIGNvbWJpbmVkU3RyZWFtLmFwcGVuZChnZXROZXh0U3RyZWFtRnVuYyhjaHVuaykpO1xuICB9XG5cbiAgLy8gUmV0dXJuIHRoZSBjb21iaW5lZCBzdHJlYW1cbiAgcmV0dXJuIGNvbWJpbmVkU3RyZWFtO1xufTtcbiJdfQ==
