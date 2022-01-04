(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var global = Package.meteor.global;
var meteorEnv = Package.meteor.meteorEnv;
var ECMAScript = Package.ecmascript.ECMAScript;
var FS = Package['steedos:cfs-base-package'].FS;
var Tracker = Package.tracker.Tracker;
var Deps = Package.tracker.Deps;
var check = Package.check.check;
var Match = Package.check.Match;
var DDP = Package['ddp-client'].DDP;
var DDPServer = Package['ddp-server'].DDPServer;
var EJSON = Package.ejson.EJSON;
var EventEmitter = Package['raix:eventemitter'].EventEmitter;
var meteorInstall = Package.modules.meteorInstall;
var Promise = Package.promise.Promise;
var MongoInternals = Package.mongo.MongoInternals;
var Mongo = Package.mongo.Mongo;

/* Package-scope variables */
var _storageAdapters;

var require = meteorInstall({"node_modules":{"meteor":{"steedos:cfs-storage-adapter":{"checkNpm.js":function module(require,exports,module){

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                  //
// packages/steedos_cfs-storage-adapter/checkNpm.js                                                                 //
//                                                                                                                  //
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                    //
let checkNpmVersions;
module.link("meteor/tmeasday:check-npm-versions", {
  checkNpmVersions(v) {
    checkNpmVersions = v;
  }

}, 0);
checkNpmVersions({
  'length-stream': '0.1.1'
}, 'steedos:cfs-storage-adapter');
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"storageAdapter.server.js":function module(require){

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                  //
// packages/steedos_cfs-storage-adapter/storageAdapter.server.js                                                    //
//                                                                                                                  //
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                    //
/* global FS, _storageAdapters:true, EventEmitter */
// #############################################################################
//
// STORAGE ADAPTER
//
// #############################################################################
_storageAdapters = {};

FS.StorageAdapter = function (storeName, options, api) {
  var self = this,
      fileKeyMaker;
  options = options || {}; // If storeName is the only argument, a string and the SA already found
  // we will just return that SA

  if (arguments.length === 1 && storeName === '' + storeName && typeof _storageAdapters[storeName] !== 'undefined') return _storageAdapters[storeName]; // Verify that the storage adapter defines all the necessary API methods

  if (typeof api === 'undefined') {
    throw new Error('FS.StorageAdapter please define an api');
  }

  FS.Utility.each('fileKey,remove,typeName,createReadStream,createWriteStream'.split(','), function (name) {
    if (typeof api[name] === 'undefined') {
      throw new Error('FS.StorageAdapter please define an api. "' + name + '" ' + (api.typeName || ''));
    }
  }); // Create an internal namespace, starting a name with underscore is only
  // allowed for stores marked with options.internal === true

  if (options.internal !== true && storeName[0] === '_') {
    throw new Error('A storage adapter name may not begin with "_"');
  }

  if (storeName.indexOf('.') !== -1) {
    throw new Error('A storage adapter name may not contain a "."');
  } // store reference for easy lookup by storeName


  if (typeof _storageAdapters[storeName] !== 'undefined') {
    throw new Error('Storage name already exists: "' + storeName + '"');
  } else {
    _storageAdapters[storeName] = self;
  } // User can customize the file key generation function


  if (typeof options.fileKeyMaker === "function") {
    fileKeyMaker = options.fileKeyMaker;
  } else {
    fileKeyMaker = api.fileKey;
  } // User can provide a function to adjust the fileObj
  // before it is written to the store.


  var beforeWrite = options.beforeWrite; // extend self with options and other info

  FS.Utility.extend(this, options, {
    name: storeName,
    typeName: api.typeName
  }); // Create a nicer abstracted adapter interface

  self.adapter = {};

  self.adapter.fileKey = function (fileObj) {
    return fileKeyMaker(fileObj);
  }; // Return readable stream for fileKey


  self.adapter.createReadStreamForFileKey = function (fileKey, options) {
    if (FS.debug) console.log('createReadStreamForFileKey ' + storeName);
    return FS.Utility.safeStream(api.createReadStream(fileKey, options));
  }; // Return readable stream for fileObj


  self.adapter.createReadStream = function (fileObj, options) {
    if (FS.debug) console.log('createReadStream ' + storeName);

    if (self.internal) {
      // Internal stores take a fileKey
      return self.adapter.createReadStreamForFileKey(fileObj, options);
    }

    return FS.Utility.safeStream(self._transform.createReadStream(fileObj, options));
  };

  function logEventsForStream(stream) {
    if (FS.debug) {
      stream.on('stored', function () {
        console.log('-----------STORED STREAM', storeName);
      });
      stream.on('close', function () {
        console.log('-----------CLOSE STREAM', storeName);
      });
      stream.on('end', function () {
        console.log('-----------END STREAM', storeName);
      });
      stream.on('finish', function () {
        console.log('-----------FINISH STREAM', storeName);
      });
      stream.on('error', function (error) {
        console.log('-----------ERROR STREAM', storeName, error && (error.message || error.code));
      });
    }
  } // Return writeable stream for fileKey


  self.adapter.createWriteStreamForFileKey = function (fileKey, options) {
    if (FS.debug) console.log('createWriteStreamForFileKey ' + storeName);
    var writeStream = FS.Utility.safeStream(api.createWriteStream(fileKey, options));
    logEventsForStream(writeStream);
    return writeStream;
  }; // Return writeable stream for fileObj


  self.adapter.createWriteStream = function (fileObj, options) {
    if (FS.debug) console.log('createWriteStream ' + storeName + ', internal: ' + !!self.internal);

    if (self.internal) {
      // Internal stores take a fileKey
      return self.adapter.createWriteStreamForFileKey(fileObj, options);
    } // If we haven't set name, type, or size for this version yet,
    // set it to same values as original version. We don't save
    // these to the DB right away because they might be changed
    // in a transformWrite function.


    if (!fileObj.name({
      store: storeName
    })) {
      fileObj.name(fileObj.name(), {
        store: storeName,
        save: false
      });
    }

    if (!fileObj.type({
      store: storeName
    })) {
      fileObj.type(fileObj.type(), {
        store: storeName,
        save: false
      });
    }

    if (!fileObj.size({
      store: storeName
    })) {
      fileObj.size(fileObj.size(), {
        store: storeName,
        save: false
      });
    } // Call user function to adjust file metadata for this store.
    // We support updating name, extension, and/or type based on
    // info returned in an object. Or `fileObj` could be
    // altered directly within the beforeWrite function.


    if (beforeWrite) {
      var fileChanges = beforeWrite(fileObj);

      if (typeof fileChanges === "object") {
        if (fileChanges.extension) {
          fileObj.extension(fileChanges.extension, {
            store: storeName,
            save: false
          });
        } else if (fileChanges.name) {
          fileObj.name(fileChanges.name, {
            store: storeName,
            save: false
          });
        }

        if (fileChanges.type) {
          fileObj.type(fileChanges.type, {
            store: storeName,
            save: false
          });
        }
      }
    }

    var writeStream = FS.Utility.safeStream(self._transform.createWriteStream(fileObj, options));
    logEventsForStream(writeStream); // Its really only the storage adapter who knows if the file is uploaded
    //
    // We have to use our own event making sure the storage process is completed
    // this is mainly

    writeStream.safeOn('stored', function (result) {
      if (typeof result.fileKey === 'undefined') {
        throw new Error('SA ' + storeName + ' type ' + api.typeName + ' did not return a fileKey');
      }

      if (FS.debug) console.log('SA', storeName, 'stored', result.fileKey); // Set the fileKey

      fileObj.copies[storeName].key = result.fileKey; // Update the size, as provided by the SA, in case it was changed by stream transformation

      if (typeof result.size === "number") {
        fileObj.copies[storeName].size = result.size;
      } // Set last updated time, either provided by SA or now


      fileObj.copies[storeName].updatedAt = result.storedAt || new Date(); // If the file object copy havent got a createdAt then set this

      if (typeof fileObj.copies[storeName].createdAt === 'undefined') {
        fileObj.copies[storeName].createdAt = fileObj.copies[storeName].updatedAt;
      }

      fileObj._saveChanges(storeName); // There is code in transform that may have set the original file size, too.


      fileObj._saveChanges('_original');
    }); // Emit events from SA

    writeStream.once('stored', function ()
    /*result*/
    {
      // XXX Because of the way stores inherit from SA, this will emit on every store.
      // Maybe need to rewrite the way we inherit from SA?
      var emitted = self.emit('stored', storeName, fileObj);

      if (FS.debug && !emitted) {
        console.log(fileObj.name() + ' was successfully stored in the ' + storeName + ' store. You are seeing this informational message because you enabled debugging and you have not defined any listeners for the "stored" event on this store.');
      }
    });
    writeStream.on('error', function (error) {
      // XXX We could wrap and clarify error
      // XXX Because of the way stores inherit from SA, this will emit on every store.
      // Maybe need to rewrite the way we inherit from SA?
      var emitted = self.emit('error', storeName, error, fileObj);

      if (FS.debug && !emitted) {
        console.log(error);
      }
    });
    return writeStream;
  }; //internal


  self._removeAsync = function (fileKey, callback) {
    // Remove the file from the store
    api.remove.call(self, fileKey, callback);
  };
  /**
   * @method FS.StorageAdapter.prototype.remove
   * @public
   * @param {FS.File} fsFile The FS.File instance to be stored.
   * @param {Function} [callback] If not provided, will block and return true or false
   *
   * Attempts to remove a file from the store. Returns true if removed or not
   * found, or false if the file couldn't be removed.
   */


  self.adapter.remove = function (fileObj, callback) {
    if (FS.debug) console.log("---SA REMOVE"); // Get the fileKey

    var fileKey = fileObj instanceof FS.File ? self.adapter.fileKey(fileObj) : fileObj;

    if (callback) {
      return self._removeAsync(fileKey, FS.Utility.safeCallback(callback));
    } else {
      return Meteor.wrapAsync(self._removeAsync)(fileKey);
    }
  };

  self.remove = function (fileObj, callback) {
    // Add deprecation note
    console.warn('Storage.remove is deprecating, use "Storage.adapter.remove"');
    return self.adapter.remove(fileObj, callback);
  };

  if (typeof api.init === 'function') {
    Meteor.wrapAsync(api.init.bind(self))();
  } // This supports optional transformWrite and transformRead


  self._transform = new FS.Transform({
    adapter: self.adapter,
    // Optional transformation functions:
    transformWrite: options.transformWrite,
    transformRead: options.transformRead
  });
};

require('util').inherits(FS.StorageAdapter, EventEmitter);
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"transform.server.js":function module(require){

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                  //
// packages/steedos_cfs-storage-adapter/transform.server.js                                                         //
//                                                                                                                  //
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                    //
/* global FS, gm */
var PassThrough = require('stream').PassThrough;

var lengthStream = require('length-stream');

FS.Transform = function (options) {
  var self = this;
  options = options || {};
  if (!(self instanceof FS.Transform)) throw new Error('FS.Transform must be called with the "new" keyword');
  if (!options.adapter) throw new Error('Transform expects option.adapter to be a storage adapter');
  self.storage = options.adapter; // Fetch the transformation functions if any

  self.transformWrite = options.transformWrite;
  self.transformRead = options.transformRead;
}; // Allow packages to add scope


FS.Transform.scope = {
  // Deprecate gm scope:
  gm: function (source, height, color) {
    console.warn('Deprecation notice: `this.gm` is deprecating in favour of the general global `gm` scope');
    if (typeof gm !== 'function') throw new Error('No graphicsmagick package installed, `gm` not found in scope, eg. `cfs-graphicsmagick`');
    return gm(source, height, color);
  } // EO Deprecate gm scope

}; // The transformation stream triggers an "stored" event when data is stored into
// the storage adapter

FS.Transform.prototype.createWriteStream = function (fileObj) {
  var self = this; // Get the file key

  var fileKey = self.storage.fileKey(fileObj); // Rig write stream

  var destinationStream = self.storage.createWriteStreamForFileKey(fileKey, {
    // Not all SA's can set these options and cfs dont depend on setting these
    // but its nice if other systems are accessing the SA that some of the data
    // is also available to those
    aliases: [fileObj.name()],
    contentType: fileObj.type(),
    metadata: fileObj.metadata
  }); // Pass through transformWrite function if provided

  if (typeof self.transformWrite === 'function') {
    destinationStream = addPassThrough(destinationStream, function (ptStream, originalStream) {
      // Rig transform
      try {
        self.transformWrite.call(FS.Transform.scope, fileObj, ptStream, originalStream); // XXX: If the transform function returns a buffer should we stream that?
      } catch (err) {
        // We emit an error - should we throw an error?
        console.warn('FS.Transform.createWriteStream transform function failed, Error: ');
        throw err;
      }
    });
  } // If original doesn't have size, add another PassThrough to get and set the size.
  // This will run on size=0, too, which is OK.
  // NOTE: This must come AFTER the transformWrite code block above. This might seem
  // confusing, but by coming after it, this will actually be executed BEFORE the user's
  // transform, which is what we need in order to be sure we get the original file
  // size and not the transformed file size.


  if (!fileObj.size()) {
    destinationStream = addPassThrough(destinationStream, function (ptStream, originalStream) {
      var lstream = lengthStream(function (fileSize) {
        fileObj.size(fileSize, {
          save: false
        });
      });
      ptStream.pipe(lstream).pipe(originalStream);
    });
  }

  return destinationStream;
};

FS.Transform.prototype.createReadStream = function (fileObj, options) {
  var self = this; // Get the file key

  var fileKey = self.storage.fileKey(fileObj); // Rig read stream

  var sourceStream = self.storage.createReadStreamForFileKey(fileKey, options); // Pass through transformRead function if provided

  if (typeof self.transformRead === 'function') {
    sourceStream = addPassThrough(sourceStream, function (ptStream, originalStream) {
      // Rig transform
      try {
        self.transformRead.call(FS.Transform.scope, fileObj, originalStream, ptStream);
      } catch (err) {
        //throw new Error(err);
        // We emit an error - should we throw an error?
        sourceStream.emit('error', 'FS.Transform.createReadStream transform function failed');
      }
    });
  } // We dont transform just normal SA interface


  return sourceStream;
}; // Utility function to simplify adding layers of passthrough


function addPassThrough(stream, func) {
  var pts = new PassThrough(); // We pass on the special "stored" event for those listening

  stream.on('stored', function (result) {
    pts.emit('stored', result);
  });
  func(pts, stream);
  return pts;
}
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}}}}},{
  "extensions": [
    ".js",
    ".json"
  ]
});

require("/node_modules/meteor/steedos:cfs-storage-adapter/checkNpm.js");
require("/node_modules/meteor/steedos:cfs-storage-adapter/storageAdapter.server.js");
require("/node_modules/meteor/steedos:cfs-storage-adapter/transform.server.js");

/* Exports */
Package._define("steedos:cfs-storage-adapter");

})();

//# sourceURL=meteor://💻app/packages/steedos_cfs-storage-adapter.js
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvczpjZnMtc3RvcmFnZS1hZGFwdGVyL2NoZWNrTnBtLmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zOmNmcy1zdG9yYWdlLWFkYXB0ZXIvc3RvcmFnZUFkYXB0ZXIuc2VydmVyLmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zOmNmcy1zdG9yYWdlLWFkYXB0ZXIvdHJhbnNmb3JtLnNlcnZlci5qcyJdLCJuYW1lcyI6WyJjaGVja05wbVZlcnNpb25zIiwibW9kdWxlIiwibGluayIsInYiLCJfc3RvcmFnZUFkYXB0ZXJzIiwiRlMiLCJTdG9yYWdlQWRhcHRlciIsInN0b3JlTmFtZSIsIm9wdGlvbnMiLCJhcGkiLCJzZWxmIiwiZmlsZUtleU1ha2VyIiwiYXJndW1lbnRzIiwibGVuZ3RoIiwiRXJyb3IiLCJVdGlsaXR5IiwiZWFjaCIsInNwbGl0IiwibmFtZSIsInR5cGVOYW1lIiwiaW50ZXJuYWwiLCJpbmRleE9mIiwiZmlsZUtleSIsImJlZm9yZVdyaXRlIiwiZXh0ZW5kIiwiYWRhcHRlciIsImZpbGVPYmoiLCJjcmVhdGVSZWFkU3RyZWFtRm9yRmlsZUtleSIsImRlYnVnIiwiY29uc29sZSIsImxvZyIsInNhZmVTdHJlYW0iLCJjcmVhdGVSZWFkU3RyZWFtIiwiX3RyYW5zZm9ybSIsImxvZ0V2ZW50c0ZvclN0cmVhbSIsInN0cmVhbSIsIm9uIiwiZXJyb3IiLCJtZXNzYWdlIiwiY29kZSIsImNyZWF0ZVdyaXRlU3RyZWFtRm9yRmlsZUtleSIsIndyaXRlU3RyZWFtIiwiY3JlYXRlV3JpdGVTdHJlYW0iLCJzdG9yZSIsInNhdmUiLCJ0eXBlIiwic2l6ZSIsImZpbGVDaGFuZ2VzIiwiZXh0ZW5zaW9uIiwic2FmZU9uIiwicmVzdWx0IiwiY29waWVzIiwia2V5IiwidXBkYXRlZEF0Iiwic3RvcmVkQXQiLCJEYXRlIiwiY3JlYXRlZEF0IiwiX3NhdmVDaGFuZ2VzIiwib25jZSIsImVtaXR0ZWQiLCJlbWl0IiwiX3JlbW92ZUFzeW5jIiwiY2FsbGJhY2siLCJyZW1vdmUiLCJjYWxsIiwiRmlsZSIsInNhZmVDYWxsYmFjayIsIk1ldGVvciIsIndyYXBBc3luYyIsIndhcm4iLCJpbml0IiwiYmluZCIsIlRyYW5zZm9ybSIsInRyYW5zZm9ybVdyaXRlIiwidHJhbnNmb3JtUmVhZCIsInJlcXVpcmUiLCJpbmhlcml0cyIsIkV2ZW50RW1pdHRlciIsIlBhc3NUaHJvdWdoIiwibGVuZ3RoU3RyZWFtIiwic3RvcmFnZSIsInNjb3BlIiwiZ20iLCJzb3VyY2UiLCJoZWlnaHQiLCJjb2xvciIsInByb3RvdHlwZSIsImRlc3RpbmF0aW9uU3RyZWFtIiwiYWxpYXNlcyIsImNvbnRlbnRUeXBlIiwibWV0YWRhdGEiLCJhZGRQYXNzVGhyb3VnaCIsInB0U3RyZWFtIiwib3JpZ2luYWxTdHJlYW0iLCJlcnIiLCJsc3RyZWFtIiwiZmlsZVNpemUiLCJwaXBlIiwic291cmNlU3RyZWFtIiwiZnVuYyIsInB0cyJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSxJQUFJQSxnQkFBSjtBQUFxQkMsTUFBTSxDQUFDQyxJQUFQLENBQVksb0NBQVosRUFBaUQ7QUFBQ0Ysa0JBQWdCLENBQUNHLENBQUQsRUFBRztBQUFDSCxvQkFBZ0IsR0FBQ0csQ0FBakI7QUFBbUI7O0FBQXhDLENBQWpELEVBQTJGLENBQTNGO0FBQ3JCSCxnQkFBZ0IsQ0FBQztBQUNoQixtQkFBaUI7QUFERCxDQUFELEVBRWIsNkJBRmEsQ0FBaEIsQzs7Ozs7Ozs7Ozs7QUNEQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQUksZ0JBQWdCLEdBQUcsRUFBbkI7O0FBRUFDLEVBQUUsQ0FBQ0MsY0FBSCxHQUFvQixVQUFTQyxTQUFULEVBQW9CQyxPQUFwQixFQUE2QkMsR0FBN0IsRUFBa0M7QUFDcEQsTUFBSUMsSUFBSSxHQUFHLElBQVg7QUFBQSxNQUFpQkMsWUFBakI7QUFDQUgs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QUFDbkNrRCxPQUFHLENBQUN4QyxJQUFKLENBQVMsUUFBVCxFQUFtQlYsTUFBbkI7QUFDRCxHQUZEO0FBR0FpRCxNQUFJLENBQUNDLEdBQUQsRUFBTWpFLE1BQU4sQ0FBSjtBQUNBLFNBQU9pRSxHQUFQO0FBQ0QsQyIsImZpbGUiOiIvcGFja2FnZXMvc3RlZWRvc19jZnMtc3RvcmFnZS1hZGFwdGVyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgY2hlY2tOcG1WZXJzaW9ucyB9IGZyb20gJ21ldGVvci90bWVhc2RheTpjaGVjay1ucG0tdmVyc2lvbnMnO1xyXG5jaGVja05wbVZlcnNpb25zKHtcclxuXHQnbGVuZ3RoLXN0cmVhbSc6ICcwLjEuMSdcclxufSwgJ3N0ZWVkb3M6Y2ZzLXN0b3JhZ2UtYWRhcHRlcicpOyIsIi8qIGdsb2JhbCBGUywgX3N0b3JhZ2VBZGFwdGVyczp0cnVlLCBFdmVudEVtaXR0ZXIgKi9cclxuXHJcbi8vICMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjXHJcbi8vXHJcbi8vIFNUT1JBR0UgQURBUFRFUlxyXG4vL1xyXG4vLyAjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjI1xyXG5fc3RvcmFnZUFkYXB0ZXJzID0ge307XHJcblxyXG5GUy5TdG9yYWdlQWRhcHRlciA9IGZ1bmN0aW9uKHN0b3JlTmFtZSwgb3B0aW9ucywgYXBpKSB7XHJcbiAgdmFyIHNlbGYgPSB0aGlzLCBmaWxlS2V5TWFrZXI7XHJcbiAgb3B0aW9ucyA9IG9wdGlvbnMgfHwge307XHJcblxyXG4gIC8vIElmIHN0b3JlTmFtZSBpcyB0aGUgb25seSBhcmd1bWVudCwgYSBzdHJpbmcgYW5kIHRoZSBTQSBhbHJlYWR5IGZvdW5kXHJcbiAgLy8gd2Ugd2lsbCBqdXN0IHJldHVybiB0aGF0IFNBXHJcbiAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT09IDEgJiYgc3RvcmVOYW1lID09PSAnJyArIHN0b3JlTmFtZSAmJlxyXG4gICAgICAgICAgdHlwZW9mIF9zdG9yYWdlQWRhcHRlcnNbc3RvcmVOYW1lXSAhPT0gJ3VuZGVmaW5lZCcpXHJcbiAgICByZXR1cm4gX3N0b3JhZ2VBZGFwdGVyc1tzdG9yZU5hbWVdO1xyXG5cclxuICAvLyBWZXJpZnkgdGhhdCB0aGUgc3RvcmFnZSBhZGFwdGVyIGRlZmluZXMgYWxsIHRoZSBuZWNlc3NhcnkgQVBJIG1ldGhvZHNcclxuICBpZiAodHlwZW9mIGFwaSA9PT0gJ3VuZGVmaW5lZCcpIHtcclxuICAgIHRocm93IG5ldyBFcnJvcignRlMuU3RvcmFnZUFkYXB0ZXIgcGxlYXNlIGRlZmluZSBhbiBhcGknKTtcclxuICB9XHJcblxyXG4gIEZTLlV0aWxpdHkuZWFjaCgnZmlsZUtleSxyZW1vdmUsdHlwZU5hbWUsY3JlYXRlUmVhZFN0cmVhbSxjcmVhdGVXcml0ZVN0cmVhbScuc3BsaXQoJywnKSwgZnVuY3Rpb24obmFtZSkge1xyXG4gICAgaWYgKHR5cGVvZiBhcGlbbmFtZV0gPT09ICd1bmRlZmluZWQnKSB7XHJcbiAgICAgIHRocm93IG5ldyBFcnJvcignRlMuU3RvcmFnZUFkYXB0ZXIgcGxlYXNlIGRlZmluZSBhbiBhcGkuIFwiJyArIG5hbWUgKyAnXCIgJyArIChhcGkudHlwZU5hbWUgfHwgJycpKTtcclxuICAgIH1cclxuICB9KTtcclxuXHJcbiAgLy8gQ3JlYXRlIGFuIGludGVybmFsIG5hbWVzcGFjZSwgc3RhcnRpbmcgYSBuYW1lIHdpdGggdW5kZXJzY29yZSBpcyBvbmx5XHJcbiAgLy8gYWxsb3dlZCBmb3Igc3RvcmVzIG1hcmtlZCB3aXRoIG9wdGlvbnMuaW50ZXJuYWwgPT09IHRydWVcclxuICBpZiAob3B0aW9ucy5pbnRlcm5hbCAhPT0gdHJ1ZSAmJiBzdG9yZU5hbWVbMF0gPT09ICdfJykge1xyXG4gICAgdGhyb3cgbmV3IEVycm9yKCdBIHN0b3JhZ2UgYWRhcHRlciBuYW1lIG1heSBub3QgYmVnaW4gd2l0aCBcIl9cIicpO1xyXG4gIH1cclxuXHJcbiAgaWYgKHN0b3JlTmFtZS5pbmRleE9mKCcuJykgIT09IC0xKSB7XHJcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ0Egc3RvcmFnZSBhZGFwdGVyIG5hbWUgbWF5IG5vdCBjb250YWluIGEgXCIuXCInKTtcclxuICB9XHJcblxyXG4gIC8vIHN0b3JlIHJlZmVyZW5jZSBmb3IgZWFzeSBsb29rdXAgYnkgc3RvcmVOYW1lXHJcbiAgaWYgKHR5cGVvZiBfc3RvcmFnZUFkYXB0ZXJzW3N0b3JlTmFtZV0gIT09ICd1bmRlZmluZWQnKSB7XHJcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ1N0b3JhZ2UgbmFtZSBhbHJlYWR5IGV4aXN0czogXCInICsgc3RvcmVOYW1lICsgJ1wiJyk7XHJcbiAgfSBlbHNlIHtcclxuICAgIF9zdG9yYWdlQWRhcHRlcnNbc3RvcmVOYW1lXSA9IHNlbGY7XHJcbiAgfVxyXG5cclxuICAvLyBVc2VyIGNhbiBjdXN0b21pemUgdGhlIGZpbGUga2V5IGdlbmVyYXRpb24gZnVuY3Rpb25cclxuICBpZiAodHlwZW9mIG9wdGlvbnMuZmlsZUtleU1ha2VyID09PSBcImZ1bmN0aW9uXCIpIHtcclxuICAgIGZpbGVLZXlNYWtlciA9IG9wdGlvbnMuZmlsZUtleU1ha2VyO1xyXG4gIH0gZWxzZSB7XHJcbiAgICBmaWxlS2V5TWFrZXIgPSBhcGkuZmlsZUtleTtcclxuICB9XHJcblxyXG4gIC8vIFVzZXIgY2FuIHByb3ZpZGUgYSBmdW5jdGlvbiB0byBhZGp1c3QgdGhlIGZpbGVPYmpcclxuICAvLyBiZWZvcmUgaXQgaXMgd3JpdHRlbiB0byB0aGUgc3RvcmUuXHJcbiAgdmFyIGJlZm9yZVdyaXRlID0gb3B0aW9ucy5iZWZvcmVXcml0ZTtcclxuXHJcbiAgLy8gZXh0ZW5kIHNlbGYgd2l0aCBvcHRpb25zIGFuZCBvdGhlciBpbmZvXHJcbiAgRlMuVXRpbGl0eS5leHRlbmQodGhpcywgb3B0aW9ucywge1xyXG4gICAgbmFtZTogc3RvcmVOYW1lLFxyXG4gICAgdHlwZU5hbWU6IGFwaS50eXBlTmFtZVxyXG4gIH0pO1xyXG5cclxuICAvLyBDcmVhdGUgYSBuaWNlciBhYnN0cmFjdGVkIGFkYXB0ZXIgaW50ZXJmYWNlXHJcbiAgc2VsZi5hZGFwdGVyID0ge307XHJcblxyXG4gIHNlbGYuYWRhcHRlci5maWxlS2V5ID0gZnVuY3Rpb24oZmlsZU9iaikge1xyXG4gICAgcmV0dXJuIGZpbGVLZXlNYWtlcihmaWxlT2JqKTtcclxuICB9O1xyXG5cclxuICAvLyBSZXR1cm4gcmVhZGFibGUgc3RyZWFtIGZvciBmaWxlS2V5XHJcbiAgc2VsZi5hZGFwdGVyLmNyZWF0ZVJlYWRTdHJlYW1Gb3JGaWxlS2V5ID0gZnVuY3Rpb24oZmlsZUtleSwgb3B0aW9ucykge1xyXG4gICAgaWYgKEZTLmRlYnVnKSBjb25zb2xlLmxvZygnY3JlYXRlUmVhZFN0cmVhbUZvckZpbGVLZXkgJyArIHN0b3JlTmFtZSk7XHJcbiAgICByZXR1cm4gRlMuVXRpbGl0eS5zYWZlU3RyZWFtKCBhcGkuY3JlYXRlUmVhZFN0cmVhbShmaWxlS2V5LCBvcHRpb25zKSApO1xyXG4gIH07XHJcblxyXG4gIC8vIFJldHVybiByZWFkYWJsZSBzdHJlYW0gZm9yIGZpbGVPYmpcclxuICBzZWxmLmFkYXB0ZXIuY3JlYXRlUmVhZFN0cmVhbSA9IGZ1bmN0aW9uKGZpbGVPYmosIG9wdGlvbnMpIHtcclxuICAgIGlmIChGUy5kZWJ1ZykgY29uc29sZS5sb2coJ2NyZWF0ZVJlYWRTdHJlYW0gJyArIHN0b3JlTmFtZSk7XHJcbiAgICBpZiAoc2VsZi5pbnRlcm5hbCkge1xyXG4gICAgICAvLyBJbnRlcm5hbCBzdG9yZXMgdGFrZSBhIGZpbGVLZXlcclxuICAgICAgcmV0dXJuIHNlbGYuYWRhcHRlci5jcmVhdGVSZWFkU3RyZWFtRm9yRmlsZUtleShmaWxlT2JqLCBvcHRpb25zKTtcclxuICAgIH1cclxuICAgIHJldHVybiBGUy5VdGlsaXR5LnNhZmVTdHJlYW0oIHNlbGYuX3RyYW5zZm9ybS5jcmVhdGVSZWFkU3RyZWFtKGZpbGVPYmosIG9wdGlvbnMpICk7XHJcbiAgfTtcclxuXHJcbiAgZnVuY3Rpb24gbG9nRXZlbnRzRm9yU3RyZWFtKHN0cmVhbSkge1xyXG4gICAgaWYgKEZTLmRlYnVnKSB7XHJcbiAgICAgIHN0cmVhbS5vbignc3RvcmVkJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgY29uc29sZS5sb2coJy0tLS0tLS0tLS0tU1RPUkVEIFNUUkVBTScsIHN0b3JlTmFtZSk7XHJcbiAgICAgIH0pO1xyXG5cclxuICAgICAgc3RyZWFtLm9uKCdjbG9zZScsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIGNvbnNvbGUubG9nKCctLS0tLS0tLS0tLUNMT1NFIFNUUkVBTScsIHN0b3JlTmFtZSk7XHJcbiAgICAgIH0pO1xyXG5cclxuICAgICAgc3RyZWFtLm9uKCdlbmQnLCBmdW5jdGlvbigpIHtcclxuICAgICAgICBjb25zb2xlLmxvZygnLS0tLS0tLS0tLS1FTkQgU1RSRUFNJywgc3RvcmVOYW1lKTtcclxuICAgICAgfSk7XHJcblxyXG4gICAgICBzdHJlYW0ub24oJ2ZpbmlzaCcsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIGNvbnNvbGUubG9nKCctLS0tLS0tLS0tLUZJTklTSCBTVFJFQU0nLCBzdG9yZU5hbWUpO1xyXG4gICAgICB9KTtcclxuXHJcbiAgICAgIHN0cmVhbS5vbignZXJyb3InLCBmdW5jdGlvbihlcnJvcikge1xyXG4gICAgICAgIGNvbnNvbGUubG9nKCctLS0tLS0tLS0tLUVSUk9SIFNUUkVBTScsIHN0b3JlTmFtZSwgZXJyb3IgJiYgKGVycm9yLm1lc3NhZ2UgfHwgZXJyb3IuY29kZSkpO1xyXG4gICAgICB9KTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIC8vIFJldHVybiB3cml0ZWFibGUgc3RyZWFtIGZvciBmaWxlS2V5XHJcbiAgc2VsZi5hZGFwdGVyLmNyZWF0ZVdyaXRlU3RyZWFtRm9yRmlsZUtleSA9IGZ1bmN0aW9uKGZpbGVLZXksIG9wdGlvbnMpIHtcclxuICAgIGlmIChGUy5kZWJ1ZykgY29uc29sZS5sb2coJ2NyZWF0ZVdyaXRlU3RyZWFtRm9yRmlsZUtleSAnICsgc3RvcmVOYW1lKTtcclxuICAgIHZhciB3cml0ZVN0cmVhbSA9IEZTLlV0aWxpdHkuc2FmZVN0cmVhbSggYXBpLmNyZWF0ZVdyaXRlU3RyZWFtKGZpbGVLZXksIG9wdGlvbnMpICk7XHJcblxyXG4gICAgbG9nRXZlbnRzRm9yU3RyZWFtKHdyaXRlU3RyZWFtKTtcclxuXHJcbiAgICByZXR1cm4gd3JpdGVTdHJlYW07XHJcbiAgfTtcclxuXHJcbiAgLy8gUmV0dXJuIHdyaXRlYWJsZSBzdHJlYW0gZm9yIGZpbGVPYmpcclxuICBzZWxmLmFkYXB0ZXIuY3JlYXRlV3JpdGVTdHJlYW0gPSBmdW5jdGlvbihmaWxlT2JqLCBvcHRpb25zKSB7XHJcbiAgICBpZiAoRlMuZGVidWcpIGNvbnNvbGUubG9nKCdjcmVhdGVXcml0ZVN0cmVhbSAnICsgc3RvcmVOYW1lICsgJywgaW50ZXJuYWw6ICcgKyAhIXNlbGYuaW50ZXJuYWwpO1xyXG5cclxuICAgIGlmIChzZWxmLmludGVybmFsKSB7XHJcbiAgICAgIC8vIEludGVybmFsIHN0b3JlcyB0YWtlIGEgZmlsZUtleVxyXG4gICAgICByZXR1cm4gc2VsZi5hZGFwdGVyLmNyZWF0ZVdyaXRlU3RyZWFtRm9yRmlsZUtleShmaWxlT2JqLCBvcHRpb25zKTtcclxuICAgIH1cclxuXHJcbiAgICAvLyBJZiB3ZSBoYXZlbid0IHNldCBuYW1lLCB0eXBlLCBvciBzaXplIGZvciB0aGlzIHZlcnNpb24geWV0LFxyXG4gICAgLy8gc2V0IGl0IHRvIHNhbWUgdmFsdWVzIGFzIG9yaWdpbmFsIHZlcnNpb24uIFdlIGRvbid0IHNhdmVcclxuICAgIC8vIHRoZXNlIHRvIHRoZSBEQiByaWdodCBhd2F5IGJlY2F1c2UgdGhleSBtaWdodCBiZSBjaGFuZ2VkXHJcbiAgICAvLyBpbiBhIHRyYW5zZm9ybVdyaXRlIGZ1bmN0aW9uLlxyXG4gICAgaWYgKCFmaWxlT2JqLm5hbWUoe3N0b3JlOiBzdG9yZU5hbWV9KSkge1xyXG4gICAgICBmaWxlT2JqLm5hbWUoZmlsZU9iai5uYW1lKCksIHtzdG9yZTogc3RvcmVOYW1lLCBzYXZlOiBmYWxzZX0pO1xyXG4gICAgfVxyXG4gICAgaWYgKCFmaWxlT2JqLnR5cGUoe3N0b3JlOiBzdG9yZU5hbWV9KSkge1xyXG4gICAgICBmaWxlT2JqLnR5cGUoZmlsZU9iai50eXBlKCksIHtzdG9yZTogc3RvcmVOYW1lLCBzYXZlOiBmYWxzZX0pO1xyXG4gICAgfVxyXG4gICAgaWYgKCFmaWxlT2JqLnNpemUoe3N0b3JlOiBzdG9yZU5hbWV9KSkge1xyXG4gICAgICBmaWxlT2JqLnNpemUoZmlsZU9iai5zaXplKCksIHtzdG9yZTogc3RvcmVOYW1lLCBzYXZlOiBmYWxzZX0pO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIENhbGwgdXNlciBmdW5jdGlvbiB0byBhZGp1c3QgZmlsZSBtZXRhZGF0YSBmb3IgdGhpcyBzdG9yZS5cclxuICAgIC8vIFdlIHN1cHBvcnQgdXBkYXRpbmcgbmFtZSwgZXh0ZW5zaW9uLCBhbmQvb3IgdHlwZSBiYXNlZCBvblxyXG4gICAgLy8gaW5mbyByZXR1cm5lZCBpbiBhbiBvYmplY3QuIE9yIGBmaWxlT2JqYCBjb3VsZCBiZVxyXG4gICAgLy8gYWx0ZXJlZCBkaXJlY3RseSB3aXRoaW4gdGhlIGJlZm9yZVdyaXRlIGZ1bmN0aW9uLlxyXG4gICAgaWYgKGJlZm9yZVdyaXRlKSB7XHJcbiAgICAgIHZhciBmaWxlQ2hhbmdlcyA9IGJlZm9yZVdyaXRlKGZpbGVPYmopO1xyXG4gICAgICBpZiAodHlwZW9mIGZpbGVDaGFuZ2VzID09PSBcIm9iamVjdFwiKSB7XHJcbiAgICAgICAgaWYgKGZpbGVDaGFuZ2VzLmV4dGVuc2lvbikge1xyXG4gICAgICAgICAgZmlsZU9iai5leHRlbnNpb24oZmlsZUNoYW5nZXMuZXh0ZW5zaW9uLCB7c3RvcmU6IHN0b3JlTmFtZSwgc2F2ZTogZmFsc2V9KTtcclxuICAgICAgICB9IGVsc2UgaWYgKGZpbGVDaGFuZ2VzLm5hbWUpIHtcclxuICAgICAgICAgIGZpbGVPYmoubmFtZShmaWxlQ2hhbmdlcy5uYW1lLCB7c3RvcmU6IHN0b3JlTmFtZSwgc2F2ZTogZmFsc2V9KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKGZpbGVDaGFuZ2VzLnR5cGUpIHtcclxuICAgICAgICAgIGZpbGVPYmoudHlwZShmaWxlQ2hhbmdlcy50eXBlLCB7c3RvcmU6IHN0b3JlTmFtZSwgc2F2ZTogZmFsc2V9KTtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICB2YXIgd3JpdGVTdHJlYW0gPSBGUy5VdGlsaXR5LnNhZmVTdHJlYW0oIHNlbGYuX3RyYW5zZm9ybS5jcmVhdGVXcml0ZVN0cmVhbShmaWxlT2JqLCBvcHRpb25zKSApO1xyXG5cclxuICAgIGxvZ0V2ZW50c0ZvclN0cmVhbSh3cml0ZVN0cmVhbSk7XHJcblxyXG4gICAgLy8gSXRzIHJlYWxseSBvbmx5IHRoZSBzdG9yYWdlIGFkYXB0ZXIgd2hvIGtub3dzIGlmIHRoZSBmaWxlIGlzIHVwbG9hZGVkXHJcbiAgICAvL1xyXG4gICAgLy8gV2UgaGF2ZSB0byB1c2Ugb3VyIG93biBldmVudCBtYWtpbmcgc3VyZSB0aGUgc3RvcmFnZSBwcm9jZXNzIGlzIGNvbXBsZXRlZFxyXG4gICAgLy8gdGhpcyBpcyBtYWlubHlcclxuICAgIHdyaXRlU3RyZWFtLnNhZmVPbignc3RvcmVkJywgZnVuY3Rpb24ocmVzdWx0KSB7XHJcbiAgICAgIGlmICh0eXBlb2YgcmVzdWx0LmZpbGVLZXkgPT09ICd1bmRlZmluZWQnKSB7XHJcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdTQSAnICsgc3RvcmVOYW1lICsgJyB0eXBlICcgKyBhcGkudHlwZU5hbWUgKyAnIGRpZCBub3QgcmV0dXJuIGEgZmlsZUtleScpO1xyXG4gICAgICB9XHJcbiAgICAgIGlmIChGUy5kZWJ1ZykgY29uc29sZS5sb2coJ1NBJywgc3RvcmVOYW1lLCAnc3RvcmVkJywgcmVzdWx0LmZpbGVLZXkpO1xyXG4gICAgICAvLyBTZXQgdGhlIGZpbGVLZXlcclxuICAgICAgZmlsZU9iai5jb3BpZXNbc3RvcmVOYW1lXS5rZXkgPSByZXN1bHQuZmlsZUtleTtcclxuXHJcbiAgICAgIC8vIFVwZGF0ZSB0aGUgc2l6ZSwgYXMgcHJvdmlkZWQgYnkgdGhlIFNBLCBpbiBjYXNlIGl0IHdhcyBjaGFuZ2VkIGJ5IHN0cmVhbSB0cmFuc2Zvcm1hdGlvblxyXG4gICAgICBpZiAodHlwZW9mIHJlc3VsdC5zaXplID09PSBcIm51bWJlclwiKSB7XHJcbiAgICAgICAgZmlsZU9iai5jb3BpZXNbc3RvcmVOYW1lXS5zaXplID0gcmVzdWx0LnNpemU7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIC8vIFNldCBsYXN0IHVwZGF0ZWQgdGltZSwgZWl0aGVyIHByb3ZpZGVkIGJ5IFNBIG9yIG5vd1xyXG4gICAgICBmaWxlT2JqLmNvcGllc1tzdG9yZU5hbWVdLnVwZGF0ZWRBdCA9IHJlc3VsdC5zdG9yZWRBdCB8fCBuZXcgRGF0ZSgpO1xyXG5cclxuICAgICAgLy8gSWYgdGhlIGZpbGUgb2JqZWN0IGNvcHkgaGF2ZW50IGdvdCBhIGNyZWF0ZWRBdCB0aGVuIHNldCB0aGlzXHJcbiAgICAgIGlmICh0eXBlb2YgZmlsZU9iai5jb3BpZXNbc3RvcmVOYW1lXS5jcmVhdGVkQXQgPT09ICd1bmRlZmluZWQnKSB7XHJcbiAgICAgICAgZmlsZU9iai5jb3BpZXNbc3RvcmVOYW1lXS5jcmVhdGVkQXQgPSBmaWxlT2JqLmNvcGllc1tzdG9yZU5hbWVdLnVwZGF0ZWRBdDtcclxuICAgICAgfVxyXG5cclxuICAgICAgZmlsZU9iai5fc2F2ZUNoYW5nZXMoc3RvcmVOYW1lKTtcclxuXHJcbiAgICAgIC8vIFRoZXJlIGlzIGNvZGUgaW4gdHJhbnNmb3JtIHRoYXQgbWF5IGhhdmUgc2V0IHRoZSBvcmlnaW5hbCBmaWxlIHNpemUsIHRvby5cclxuICAgICAgZmlsZU9iai5fc2F2ZUNoYW5nZXMoJ19vcmlnaW5hbCcpO1xyXG4gICAgfSk7XHJcblxyXG4gICAgLy8gRW1pdCBldmVudHMgZnJvbSBTQVxyXG4gICAgd3JpdGVTdHJlYW0ub25jZSgnc3RvcmVkJywgZnVuY3Rpb24oLypyZXN1bHQqLykge1xyXG4gICAgICAvLyBYWFggQmVjYXVzZSBvZiB0aGUgd2F5IHN0b3JlcyBpbmhlcml0IGZyb20gU0EsIHRoaXMgd2lsbCBlbWl0IG9uIGV2ZXJ5IHN0b3JlLlxyXG4gICAgICAvLyBNYXliZSBuZWVkIHRvIHJld3JpdGUgdGhlIHdheSB3ZSBpbmhlcml0IGZyb20gU0E/XHJcbiAgICAgIHZhciBlbWl0dGVkID0gc2VsZi5lbWl0KCdzdG9yZWQnLCBzdG9yZU5hbWUsIGZpbGVPYmopO1xyXG4gICAgICBpZiAoRlMuZGVidWcgJiYgIWVtaXR0ZWQpIHtcclxuICAgICAgICBjb25zb2xlLmxvZyhmaWxlT2JqLm5hbWUoKSArICcgd2FzIHN1Y2Nlc3NmdWxseSBzdG9yZWQgaW4gdGhlICcgKyBzdG9yZU5hbWUgKyAnIHN0b3JlLiBZb3UgYXJlIHNlZWluZyB0aGlzIGluZm9ybWF0aW9uYWwgbWVzc2FnZSBiZWNhdXNlIHlvdSBlbmFibGVkIGRlYnVnZ2luZyBhbmQgeW91IGhhdmUgbm90IGRlZmluZWQgYW55IGxpc3RlbmVycyBmb3IgdGhlIFwic3RvcmVkXCIgZXZlbnQgb24gdGhpcyBzdG9yZS4nKTtcclxuICAgICAgfVxyXG4gICAgfSk7XHJcblxyXG4gICAgd3JpdGVTdHJlYW0ub24oJ2Vycm9yJywgZnVuY3Rpb24oZXJyb3IpIHtcclxuICAgICAgLy8gWFhYIFdlIGNvdWxkIHdyYXAgYW5kIGNsYXJpZnkgZXJyb3JcclxuICAgICAgLy8gWFhYIEJlY2F1c2Ugb2YgdGhlIHdheSBzdG9yZXMgaW5oZXJpdCBmcm9tIFNBLCB0aGlzIHdpbGwgZW1pdCBvbiBldmVyeSBzdG9yZS5cclxuICAgICAgLy8gTWF5YmUgbmVlZCB0byByZXdyaXRlIHRoZSB3YXkgd2UgaW5oZXJpdCBmcm9tIFNBP1xyXG4gICAgICB2YXIgZW1pdHRlZCA9IHNlbGYuZW1pdCgnZXJyb3InLCBzdG9yZU5hbWUsIGVycm9yLCBmaWxlT2JqKTtcclxuICAgICAgaWYgKEZTLmRlYnVnICYmICFlbWl0dGVkKSB7XHJcbiAgICAgICAgY29uc29sZS5sb2coZXJyb3IpO1xyXG4gICAgICB9XHJcbiAgICB9KTtcclxuXHJcbiAgICByZXR1cm4gd3JpdGVTdHJlYW07XHJcbiAgfTtcclxuXHJcbiAgLy9pbnRlcm5hbFxyXG4gIHNlbGYuX3JlbW92ZUFzeW5jID0gZnVuY3Rpb24oZmlsZUtleSwgY2FsbGJhY2spIHtcclxuICAgIC8vIFJlbW92ZSB0aGUgZmlsZSBmcm9tIHRoZSBzdG9yZVxyXG4gICAgYXBpLnJlbW92ZS5jYWxsKHNlbGYsIGZpbGVLZXksIGNhbGxiYWNrKTtcclxuICB9O1xyXG5cclxuICAvKipcclxuICAgKiBAbWV0aG9kIEZTLlN0b3JhZ2VBZGFwdGVyLnByb3RvdHlwZS5yZW1vdmVcclxuICAgKiBAcHVibGljXHJcbiAgICogQHBhcmFtIHtGUy5GaWxlfSBmc0ZpbGUgVGhlIEZTLkZpbGUgaW5zdGFuY2UgdG8gYmUgc3RvcmVkLlxyXG4gICAqIEBwYXJhbSB7RnVuY3Rpb259IFtjYWxsYmFja10gSWYgbm90IHByb3ZpZGVkLCB3aWxsIGJsb2NrIGFuZCByZXR1cm4gdHJ1ZSBvciBmYWxzZVxyXG4gICAqXHJcbiAgICogQXR0ZW1wdHMgdG8gcmVtb3ZlIGEgZmlsZSBmcm9tIHRoZSBzdG9yZS4gUmV0dXJucyB0cnVlIGlmIHJlbW92ZWQgb3Igbm90XHJcbiAgICogZm91bmQsIG9yIGZhbHNlIGlmIHRoZSBmaWxlIGNvdWxkbid0IGJlIHJlbW92ZWQuXHJcbiAgICovXHJcbiAgc2VsZi5hZGFwdGVyLnJlbW92ZSA9IGZ1bmN0aW9uKGZpbGVPYmosIGNhbGxiYWNrKSB7XHJcbiAgICBpZiAoRlMuZGVidWcpIGNvbnNvbGUubG9nKFwiLS0tU0EgUkVNT1ZFXCIpO1xyXG5cclxuICAgIC8vIEdldCB0aGUgZmlsZUtleVxyXG4gICAgdmFyIGZpbGVLZXkgPSAoZmlsZU9iaiBpbnN0YW5jZW9mIEZTLkZpbGUpID8gc2VsZi5hZGFwdGVyLmZpbGVLZXkoZmlsZU9iaikgOiBmaWxlT2JqO1xyXG5cclxuICAgIGlmIChjYWxsYmFjaykge1xyXG4gICAgICByZXR1cm4gc2VsZi5fcmVtb3ZlQXN5bmMoZmlsZUtleSwgRlMuVXRpbGl0eS5zYWZlQ2FsbGJhY2soY2FsbGJhY2spKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHJldHVybiBNZXRlb3Iud3JhcEFzeW5jKHNlbGYuX3JlbW92ZUFzeW5jKShmaWxlS2V5KTtcclxuICAgIH1cclxuICB9O1xyXG5cclxuICBzZWxmLnJlbW92ZSA9IGZ1bmN0aW9uKGZpbGVPYmosIGNhbGxiYWNrKSB7XHJcbiAgICAvLyBBZGQgZGVwcmVjYXRpb24gbm90ZVxyXG4gICAgY29uc29sZS53YXJuKCdTdG9yYWdlLnJlbW92ZSBpcyBkZXByZWNhdGluZywgdXNlIFwiU3RvcmFnZS5hZGFwdGVyLnJlbW92ZVwiJyk7XHJcbiAgICByZXR1cm4gc2VsZi5hZGFwdGVyLnJlbW92ZShmaWxlT2JqLCBjYWxsYmFjayk7XHJcbiAgfTtcclxuXHJcbiAgaWYgKHR5cGVvZiBhcGkuaW5pdCA9PT0gJ2Z1bmN0aW9uJykge1xyXG4gICAgTWV0ZW9yLndyYXBBc3luYyhhcGkuaW5pdC5iaW5kKHNlbGYpKSgpO1xyXG4gIH1cclxuXHJcbiAgLy8gVGhpcyBzdXBwb3J0cyBvcHRpb25hbCB0cmFuc2Zvcm1Xcml0ZSBhbmQgdHJhbnNmb3JtUmVhZFxyXG4gIHNlbGYuX3RyYW5zZm9ybSA9IG5ldyBGUy5UcmFuc2Zvcm0oe1xyXG4gICAgYWRhcHRlcjogc2VsZi5hZGFwdGVyLFxyXG4gICAgLy8gT3B0aW9uYWwgdHJhbnNmb3JtYXRpb24gZnVuY3Rpb25zOlxyXG4gICAgdHJhbnNmb3JtV3JpdGU6IG9wdGlvbnMudHJhbnNmb3JtV3JpdGUsXHJcbiAgICB0cmFuc2Zvcm1SZWFkOiBvcHRpb25zLnRyYW5zZm9ybVJlYWRcclxuICB9KTtcclxuXHJcbn07XHJcblxyXG5yZXF1aXJlKCd1dGlsJykuaW5oZXJpdHMoRlMuU3RvcmFnZUFkYXB0ZXIsIEV2ZW50RW1pdHRlcik7XHJcbiIsIi8qIGdsb2JhbCBGUywgZ20gKi9cclxuXHJcbnZhciBQYXNzVGhyb3VnaCA9IHJlcXVpcmUoJ3N0cmVhbScpLlBhc3NUaHJvdWdoO1xyXG52YXIgbGVuZ3RoU3RyZWFtID0gcmVxdWlyZSgnbGVuZ3RoLXN0cmVhbScpO1xyXG5cclxuRlMuVHJhbnNmb3JtID0gZnVuY3Rpb24ob3B0aW9ucykge1xyXG4gIHZhciBzZWxmID0gdGhpcztcclxuXHJcbiAgb3B0aW9ucyA9IG9wdGlvbnMgfHwge307XHJcblxyXG4gIGlmICghKHNlbGYgaW5zdGFuY2VvZiBGUy5UcmFuc2Zvcm0pKVxyXG4gICAgdGhyb3cgbmV3IEVycm9yKCdGUy5UcmFuc2Zvcm0gbXVzdCBiZSBjYWxsZWQgd2l0aCB0aGUgXCJuZXdcIiBrZXl3b3JkJyk7XHJcblxyXG4gIGlmICghb3B0aW9ucy5hZGFwdGVyKVxyXG4gICAgdGhyb3cgbmV3IEVycm9yKCdUcmFuc2Zvcm0gZXhwZWN0cyBvcHRpb24uYWRhcHRlciB0byBiZSBhIHN0b3JhZ2UgYWRhcHRlcicpO1xyXG5cclxuICBzZWxmLnN0b3JhZ2UgPSBvcHRpb25zLmFkYXB0ZXI7XHJcblxyXG4gIC8vIEZldGNoIHRoZSB0cmFuc2Zvcm1hdGlvbiBmdW5jdGlvbnMgaWYgYW55XHJcbiAgc2VsZi50cmFuc2Zvcm1Xcml0ZSA9IG9wdGlvbnMudHJhbnNmb3JtV3JpdGU7XHJcbiAgc2VsZi50cmFuc2Zvcm1SZWFkID0gb3B0aW9ucy50cmFuc2Zvcm1SZWFkO1xyXG59O1xyXG5cclxuLy8gQWxsb3cgcGFja2FnZXMgdG8gYWRkIHNjb3BlXHJcbkZTLlRyYW5zZm9ybS5zY29wZSA9IHtcclxuLy8gRGVwcmVjYXRlIGdtIHNjb3BlOlxyXG4gIGdtOiBmdW5jdGlvbihzb3VyY2UsIGhlaWdodCwgY29sb3IpIHtcclxuICAgIGNvbnNvbGUud2FybignRGVwcmVjYXRpb24gbm90aWNlOiBgdGhpcy5nbWAgaXMgZGVwcmVjYXRpbmcgaW4gZmF2b3VyIG9mIHRoZSBnZW5lcmFsIGdsb2JhbCBgZ21gIHNjb3BlJyk7XHJcbiAgICBpZiAodHlwZW9mIGdtICE9PSAnZnVuY3Rpb24nKVxyXG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ05vIGdyYXBoaWNzbWFnaWNrIHBhY2thZ2UgaW5zdGFsbGVkLCBgZ21gIG5vdCBmb3VuZCBpbiBzY29wZSwgZWcuIGBjZnMtZ3JhcGhpY3NtYWdpY2tgJyk7XHJcbiAgICByZXR1cm4gZ20oc291cmNlLCBoZWlnaHQsIGNvbG9yKTtcclxuICB9XHJcbi8vIEVPIERlcHJlY2F0ZSBnbSBzY29wZVxyXG59O1xyXG5cclxuLy8gVGhlIHRyYW5zZm9ybWF0aW9uIHN0cmVhbSB0cmlnZ2VycyBhbiBcInN0b3JlZFwiIGV2ZW50IHdoZW4gZGF0YSBpcyBzdG9yZWQgaW50b1xyXG4vLyB0aGUgc3RvcmFnZSBhZGFwdGVyXHJcbkZTLlRyYW5zZm9ybS5wcm90b3R5cGUuY3JlYXRlV3JpdGVTdHJlYW0gPSBmdW5jdGlvbihmaWxlT2JqKSB7XHJcbiAgdmFyIHNlbGYgPSB0aGlzO1xyXG5cclxuICAvLyBHZXQgdGhlIGZpbGUga2V5XHJcbiAgdmFyIGZpbGVLZXkgPSBzZWxmLnN0b3JhZ2UuZmlsZUtleShmaWxlT2JqKTtcclxuXHJcbiAgLy8gUmlnIHdyaXRlIHN0cmVhbVxyXG4gIHZhciBkZXN0aW5hdGlvblN0cmVhbSA9IHNlbGYuc3RvcmFnZS5jcmVhdGVXcml0ZVN0cmVhbUZvckZpbGVLZXkoZmlsZUtleSwge1xyXG4gICAgLy8gTm90IGFsbCBTQSdzIGNhbiBzZXQgdGhlc2Ugb3B0aW9ucyBhbmQgY2ZzIGRvbnQgZGVwZW5kIG9uIHNldHRpbmcgdGhlc2VcclxuICAgIC8vIGJ1dCBpdHMgbmljZSBpZiBvdGhlciBzeXN0ZW1zIGFyZSBhY2Nlc3NpbmcgdGhlIFNBIHRoYXQgc29tZSBvZiB0aGUgZGF0YVxyXG4gICAgLy8gaXMgYWxzbyBhdmFpbGFibGUgdG8gdGhvc2VcclxuICAgIGFsaWFzZXM6IFtmaWxlT2JqLm5hbWUoKV0sXHJcbiAgICBjb250ZW50VHlwZTogZmlsZU9iai50eXBlKCksXHJcbiAgICBtZXRhZGF0YTogZmlsZU9iai5tZXRhZGF0YVxyXG4gIH0pO1xyXG5cclxuICAvLyBQYXNzIHRocm91Z2ggdHJhbnNmb3JtV3JpdGUgZnVuY3Rpb24gaWYgcHJvdmlkZWRcclxuICBpZiAodHlwZW9mIHNlbGYudHJhbnNmb3JtV3JpdGUgPT09ICdmdW5jdGlvbicpIHtcclxuXHJcbiAgICBkZXN0aW5hdGlvblN0cmVhbSA9IGFkZFBhc3NUaHJvdWdoKGRlc3RpbmF0aW9uU3RyZWFtLCBmdW5jdGlvbiAocHRTdHJlYW0sIG9yaWdpbmFsU3RyZWFtKSB7XHJcbiAgICAgIC8vIFJpZyB0cmFuc2Zvcm1cclxuICAgICAgdHJ5IHtcclxuICAgICAgICBzZWxmLnRyYW5zZm9ybVdyaXRlLmNhbGwoRlMuVHJhbnNmb3JtLnNjb3BlLCBmaWxlT2JqLCBwdFN0cmVhbSwgb3JpZ2luYWxTdHJlYW0pO1xyXG4gICAgICAgIC8vIFhYWDogSWYgdGhlIHRyYW5zZm9ybSBmdW5jdGlvbiByZXR1cm5zIGEgYnVmZmVyIHNob3VsZCB3ZSBzdHJlYW0gdGhhdD9cclxuICAgICAgfSBjYXRjaChlcnIpIHtcclxuICAgICAgICAvLyBXZSBlbWl0IGFuIGVycm9yIC0gc2hvdWxkIHdlIHRocm93IGFuIGVycm9yP1xyXG4gICAgICAgIGNvbnNvbGUud2FybignRlMuVHJhbnNmb3JtLmNyZWF0ZVdyaXRlU3RyZWFtIHRyYW5zZm9ybSBmdW5jdGlvbiBmYWlsZWQsIEVycm9yOiAnKTtcclxuICAgICAgICB0aHJvdyBlcnI7XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG5cclxuICB9XHJcblxyXG4gIC8vIElmIG9yaWdpbmFsIGRvZXNuJ3QgaGF2ZSBzaXplLCBhZGQgYW5vdGhlciBQYXNzVGhyb3VnaCB0byBnZXQgYW5kIHNldCB0aGUgc2l6ZS5cclxuICAvLyBUaGlzIHdpbGwgcnVuIG9uIHNpemU9MCwgdG9vLCB3aGljaCBpcyBPSy5cclxuICAvLyBOT1RFOiBUaGlzIG11c3QgY29tZSBBRlRFUiB0aGUgdHJhbnNmb3JtV3JpdGUgY29kZSBibG9jayBhYm92ZS4gVGhpcyBtaWdodCBzZWVtXHJcbiAgLy8gY29uZnVzaW5nLCBidXQgYnkgY29taW5nIGFmdGVyIGl0LCB0aGlzIHdpbGwgYWN0dWFsbHkgYmUgZXhlY3V0ZWQgQkVGT1JFIHRoZSB1c2VyJ3NcclxuICAvLyB0cmFuc2Zvcm0sIHdoaWNoIGlzIHdoYXQgd2UgbmVlZCBpbiBvcmRlciB0byBiZSBzdXJlIHdlIGdldCB0aGUgb3JpZ2luYWwgZmlsZVxyXG4gIC8vIHNpemUgYW5kIG5vdCB0aGUgdHJhbnNmb3JtZWQgZmlsZSBzaXplLlxyXG4gIGlmICghZmlsZU9iai5zaXplKCkpIHtcclxuICAgIGRlc3RpbmF0aW9uU3RyZWFtID0gYWRkUGFzc1Rocm91Z2goZGVzdGluYXRpb25TdHJlYW0sIGZ1bmN0aW9uIChwdFN0cmVhbSwgb3JpZ2luYWxTdHJlYW0pIHtcclxuICAgICAgdmFyIGxzdHJlYW0gPSBsZW5ndGhTdHJlYW0oZnVuY3Rpb24gKGZpbGVTaXplKSB7XHJcbiAgICAgICAgZmlsZU9iai5zaXplKGZpbGVTaXplLCB7c2F2ZTogZmFsc2V9KTtcclxuICAgICAgfSk7XHJcblxyXG4gICAgICBwdFN0cmVhbS5waXBlKGxzdHJlYW0pLnBpcGUob3JpZ2luYWxTdHJlYW0pO1xyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICByZXR1cm4gZGVzdGluYXRpb25TdHJlYW07XHJcbn07XHJcblxyXG5GUy5UcmFuc2Zvcm0ucHJvdG90eXBlLmNyZWF0ZVJlYWRTdHJlYW0gPSBmdW5jdGlvbihmaWxlT2JqLCBvcHRpb25zKSB7XHJcbiAgdmFyIHNlbGYgPSB0aGlzO1xyXG5cclxuICAvLyBHZXQgdGhlIGZpbGUga2V5XHJcbiAgdmFyIGZpbGVLZXkgPSBzZWxmLnN0b3JhZ2UuZmlsZUtleShmaWxlT2JqKTtcclxuXHJcbiAgLy8gUmlnIHJlYWQgc3RyZWFtXHJcbiAgdmFyIHNvdXJjZVN0cmVhbSA9IHNlbGYuc3RvcmFnZS5jcmVhdGVSZWFkU3RyZWFtRm9yRmlsZUtleShmaWxlS2V5LCBvcHRpb25zKTtcclxuXHJcbiAgLy8gUGFzcyB0aHJvdWdoIHRyYW5zZm9ybVJlYWQgZnVuY3Rpb24gaWYgcHJvdmlkZWRcclxuICBpZiAodHlwZW9mIHNlbGYudHJhbnNmb3JtUmVhZCA9PT0gJ2Z1bmN0aW9uJykge1xyXG5cclxuICAgIHNvdXJjZVN0cmVhbSA9IGFkZFBhc3NUaHJvdWdoKHNvdXJjZVN0cmVhbSwgZnVuY3Rpb24gKHB0U3RyZWFtLCBvcmlnaW5hbFN0cmVhbSkge1xyXG4gICAgICAvLyBSaWcgdHJhbnNmb3JtXHJcbiAgICAgIHRyeSB7XHJcbiAgICAgICAgc2VsZi50cmFuc2Zvcm1SZWFkLmNhbGwoRlMuVHJhbnNmb3JtLnNjb3BlLCBmaWxlT2JqLCBvcmlnaW5hbFN0cmVhbSwgcHRTdHJlYW0pO1xyXG4gICAgICB9IGNhdGNoKGVycikge1xyXG4gICAgICAgIC8vdGhyb3cgbmV3IEVycm9yKGVycik7XHJcbiAgICAgICAgLy8gV2UgZW1pdCBhbiBlcnJvciAtIHNob3VsZCB3ZSB0aHJvdyBhbiBlcnJvcj9cclxuICAgICAgICBzb3VyY2VTdHJlYW0uZW1pdCgnZXJyb3InLCAnRlMuVHJhbnNmb3JtLmNyZWF0ZVJlYWRTdHJlYW0gdHJhbnNmb3JtIGZ1bmN0aW9uIGZhaWxlZCcpO1xyXG4gICAgICB9XHJcbiAgICB9KTtcclxuXHJcbiAgfVxyXG5cclxuICAvLyBXZSBkb250IHRyYW5zZm9ybSBqdXN0IG5vcm1hbCBTQSBpbnRlcmZhY2VcclxuICByZXR1cm4gc291cmNlU3RyZWFtO1xyXG59O1xyXG5cclxuLy8gVXRpbGl0eSBmdW5jdGlvbiB0byBzaW1wbGlmeSBhZGRpbmcgbGF5ZXJzIG9mIHBhc3N0aHJvdWdoXHJcbmZ1bmN0aW9uIGFkZFBhc3NUaHJvdWdoKHN0cmVhbSwgZnVuYykge1xyXG4gIHZhciBwdHMgPSBuZXcgUGFzc1Rocm91Z2goKTtcclxuICAvLyBXZSBwYXNzIG9uIHRoZSBzcGVjaWFsIFwic3RvcmVkXCIgZXZlbnQgZm9yIHRob3NlIGxpc3RlbmluZ1xyXG4gIHN0cmVhbS5vbignc3RvcmVkJywgZnVuY3Rpb24ocmVzdWx0KSB7XHJcbiAgICBwdHMuZW1pdCgnc3RvcmVkJywgcmVzdWx0KTtcclxuICB9KTtcclxuICBmdW5jKHB0cywgc3RyZWFtKTtcclxuICByZXR1cm4gcHRzO1xyXG59XHJcbiJdfQ==
