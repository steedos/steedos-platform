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

var require = meteorInstall({"node_modules":{"meteor":{"steedos:cfs-storage-adapter":{"storageAdapter.server.js":function module(require){

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

var lengthStream = require('./length-stream');

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

},"length-stream.js":function module(require,exports,module){

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                  //
// packages/steedos_cfs-storage-adapter/length-stream.js                                                            //
//                                                                                                                  //
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                    //
/*
 * @Author: sunhaolin@hotoa.com
 * @Date: 2022-07-05 20:40:56
 * @LastEditors: sunhaolin@hotoa.com
 * @LastEditTime: 2022-07-06 10:06:48
 * @Description: 
 */
'use strict';

!function (module1) {
  var passStream = require('./pass-stream');

  function lengthStream(options, lengthListener) {
    if (arguments.length === 1) {
      // options not provided, shift
      lengthListener = options;
      options = {};
    }

    options = options || {};
    if (typeof lengthListener !== 'function') throw new Error('lengthStream requires a lengthListener fn');
    var length = 0;

    function writeFn(data, encoding, cb) {
      /*jshint validthis:true */
      length += data.length;
      this.push(data);
      cb();
    }

    function endFn(cb) {
      /*jshint validthis:true */
      lengthListener(length); // call with resultant length

      cb();
    }

    var stream = passStream(writeFn, endFn, options);
    return stream;
  }

  module.exports = lengthStream;
}.call(this, module);
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"pass-stream.js":function module(require,exports,module){

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                  //
// packages/steedos_cfs-storage-adapter/pass-stream.js                                                              //
//                                                                                                                  //
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                    //
/*
 * @Author: sunhaolin@hotoa.com
 * @Date: 2022-07-06 10:05:56
 * @LastEditors: sunhaolin@hotoa.com
 * @LastEditTime: 2022-07-06 10:06:05
 * @Description: 
 */
'use strict';

!function (module1) {
  var Stream = require('stream');

  var util = require('util');

  var Transform = Stream.Transform;

  function PassThroughExt(writeFn, endFn, options) {
    if (!(this instanceof PassThroughExt)) {
      return new PassThroughExt(writeFn, endFn, options);
    }

    Transform.call(this, options);
    this._writeFn = writeFn;
    this._endFn = endFn;
  }

  util.inherits(PassThroughExt, Transform);

  function passTransform(chunk, encoding, cb) {
    /*jshint validthis:true */
    this.push(chunk);
    cb();
  }

  PassThroughExt.prototype._transform = function _transform(chunk, encoding, cb) {
    if (this._writeFn) return this._writeFn.apply(this, arguments);
    return passTransform.apply(this, arguments);
  };

  PassThroughExt.prototype._flush = function _flush(cb) {
    if (this._endFn) return this._endFn.apply(this, arguments);
    return cb();
  };

  function passStream(writeFn, endFn, options) {
    var stream = new PassThroughExt(writeFn, endFn, options);
    return stream;
  }

  module.exports = passStream;
}.call(this, module);
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}}}}},{
  "extensions": [
    ".js",
    ".json"
  ]
});

require("/node_modules/meteor/steedos:cfs-storage-adapter/storageAdapter.server.js");
require("/node_modules/meteor/steedos:cfs-storage-adapter/transform.server.js");

/* Exports */
Package._define("steedos:cfs-storage-adapter");

})();

//# sourceURL=meteor://💻app/packages/steedos_cfs-storage-adapter.js
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvczpjZnMtc3RvcmFnZS1hZGFwdGVyL3N0b3JhZ2VBZGFwdGVyLnNlcnZlci5qcyIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvczpjZnMtc3RvcmFnZS1hZGFwdGVyL3RyYW5zZm9ybS5zZXJ2ZXIuanMiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3M6Y2ZzLXN0b3JhZ2UtYWRhcHRlci9sZW5ndGgtc3RyZWFtLmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zOmNmcy1zdG9yYWdlLWFkYXB0ZXIvcGFzcy1zdHJlYW0uanMiXSwibmFtZXMiOlsiX3N0b3JhZ2VBZGFwdGVycyIsIkZTIiwiU3RvcmFnZUFkYXB0ZXIiLCJzdG9yZU5hbWUiLCJvcHRpb25zIiwiYXBpIiwic2VsZiIsImZpbGVLZXlNYWtlciIsImFyZ3VtZW50cyIsImxlbmd0aCIsIkVycm9yIiwiVXRpbGl0eSIsImVhY2giLCJzcGxpdCIsIm5hbWUiLCJ0eXBlTmFtZSIsImludGVybmFsIiwiaW5kZXhPZiIsImZpbGVLZXkiLCJiZWZvcmVXcml0ZSIsImV4dGVuZCIsImFkYXB0ZXIiLCJmaWxlT2JqIiwiY3JlYXRlUmVhZFN0cmVhbUZvckZpbGVLZXkiLCJkZWJ1ZyIsImNvbnNvbGUiLCJsb2ciLCJzYWZlU3RyZWFtIiwiY3JlYXRlUmVhZFN0cmVhbSIsIl90cmFuc2Zvcm0iLCJsb2dFdmVudHNGb3JTdHJlYW0iLCJzdHJlYW0iLCJvbiIsImVycm9yIiwibWVzc2FnZSIsImNvZGUiLCJjcmVhdGVXcml0ZVN0cmVhbUZvckZpbGVLZXkiLCJ3cml0ZVN0cmVhbSIsImNyZWF0ZVdyaXRlU3RyZWFtIiwic3RvcmUiLCJzYXZlIiwidHlwZSIsInNpemUiLCJmaWxlQ2hhbmdlcyIsImV4dGVuc2lvbiIsInNhZmVPbiIsInJlc3VsdCIsImNvcGllcyIsImtleSIsInVwZGF0ZWRBdCIsInN0b3JlZEF0IiwiRGF0ZSIsImNyZWF0ZWRBdCIsIl9zYXZlQ2hhbmdlcyIsIm9uY2UiLCJlbWl0dGVkIiwiZW1pdCIsIl9yZW1vdmVBc3luYyIsImNhbGxiYWNrIiwicmVtb3ZlIiwiY2FsbCIsIkZpbGUiLCJzYWZlQ2FsbGJhY2siLCJNZXRlb3IiLCJ3cmFwQXN5bmMiLCJ3YXJuIiwiaW5pdCIsImJpbmQiLCJUcmFuc2Zvcm0iLCJ0cmFuc2Zvcm1Xcml0ZSIsInRyYW5zZm9ybVJlYWQiLCJyZXF1aXJlIiwiaW5oZXJpdHMiLCJFdmVudEVtaXR0ZXIiLCJQYXNzVGhyb3VnaCIsImxlbmd0aFN0cmVhbSIsInN0b3JhZ2UiLCJzY29wZSIsImdtIiwic291cmNlIiwiaGVpZ2h0IiwiY29sb3IiLCJwcm90b3R5cGUiLCJkZXN0aW5hdGlvblN0cmVhbSIsImFsaWFzZXMiLCJjb250ZW50VHlwZSIsIm1ldGFkYXRhIiwiYWRkUGFzc1Rocm91Z2giLCJwdFN0cmVhbSIsIm9yaWdpbmFsU3RyZWFtIiwiZXJyIiwibHN0cmVhbSIsImZpbGVTaXplIiwicGlwZSIsInNvdXJjZVN0cmVhbSIsImZ1bmMiLCJwdHMiLCJwYXNzU3RyZWFtIiwibGVuZ3RoTGlzdGVuZXIiLCJ3cml0ZUZuIiwiZGF0YSIsImVuY29kaW5nIiwiY2IiLCJwdXNoIiwiZW5kRm4iLCJtb2R1bGUiLCJleHBvcnRzIiwiU3RyZWFtIiwidXRpbCIsIlBhc3NUaHJvdWdoRXh0IiwiX3dyaXRlRm4iLCJfZW5kRm4iLCJwYXNzVHJhbnNmb3JtIiwiY2h1bmsiLCJhcHBseSIsIl9mbHVzaCJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQUEsZ0JBQWdCLEdBQUcsRUFBbkI7O0FBRUFDLEVBQUUsQ0FBQ0MsY0FBSCxHQUFvQixVQUFTQyxTQUFULEVBQW9CQyxPQUFwQixFQUE2QkMsR0FBN0IsRUFBa0M7QUFDcEQsTUFBSUMsSUFBSSxHQUFHLElBQVg7QUFBQSxNQUFp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QVNBLE1BQVQsQ0FBZ0JiLEVBQWhCLEVBQW9CO0FBQ3BELFFBQUksS0FBS1MsTUFBVCxFQUFpQixPQUFPLEtBQUtBLE1BQUwsQ0FBWUcsS0FBWixDQUFrQixJQUFsQixFQUF3QjFHLFNBQXhCLENBQVA7QUFDakIsV0FBTzhGLEVBQUUsRUFBVDtBQUNELEdBSEQ7O0FBS0EsV0FBU0wsVUFBVCxDQUFvQkUsT0FBcEIsRUFBNkJLLEtBQTdCLEVBQW9DcEcsT0FBcEMsRUFBNkM7QUFDM0MsUUFBSTJCLE1BQU0sR0FBRyxJQUFJOEUsY0FBSixDQUFtQlYsT0FBbkIsRUFBNEJLLEtBQTVCLEVBQW1DcEcsT0FBbkMsQ0FBYjtBQUNBLFdBQU8yQixNQUFQO0FBQ0Q7O0FBRUQwRSxRQUFNLENBQUNDLE9BQVAsR0FBaUJULFVBQWpCIiwiZmlsZSI6Ii9wYWNrYWdlcy9zdGVlZG9zX2Nmcy1zdG9yYWdlLWFkYXB0ZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiBnbG9iYWwgRlMsIF9zdG9yYWdlQWRhcHRlcnM6dHJ1ZSwgRXZlbnRFbWl0dGVyICovXG5cbi8vICMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjXG4vL1xuLy8gU1RPUkFHRSBBREFQVEVSXG4vL1xuLy8gIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyNcbl9zdG9yYWdlQWRhcHRlcnMgPSB7fTtcblxuRlMuU3RvcmFnZUFkYXB0ZXIgPSBmdW5jdGlvbihzdG9yZU5hbWUsIG9wdGlvbnMsIGFwaSkge1xuICB2YXIgc2VsZiA9IHRoaXMsIGZpbGVLZXlNYWtlcjtcbiAgb3B0aW9ucyA9IG9wdGlvbnMgfHwge307XG5cbiAgLy8gSWYgc3RvcmVOYW1lIGlzIHRoZSBvbmx5IGFyZ3VtZW50LCBhIHN0cmluZyBhbmQgdGhlIFNBIGFscmVhZHkgZm91bmRcbiAgLy8gd2Ugd2lsbCBqdXN0IHJldHVybiB0aGF0IFNBXG4gIGlmIChhcmd1bWVudHMubGVuZ3RoID09PSAxICYmIHN0b3JlTmFtZSA9PT0gJycgKyBzdG9yZU5hbWUgJiZcbiAgICAgICAgICB0eXBlb2YgX3N0b3JhZ2VBZGFwdGVyc1tzdG9yZU5hbWVdICE9PSAndW5kZWZpbmVkJylcbiAgICByZXR1cm4gX3N0b3JhZ2VBZGFwdGVyc1tzdG9yZU5hbWVdO1xuXG4gIC8vIFZlcmlmeSB0aGF0IHRoZSBzdG9yYWdlIGFkYXB0ZXIgZGVmaW5lcyBhbGwgdGhlIG5lY2Vzc2FyeSBBUEkgbWV0aG9kc1xuICBpZiAodHlwZW9mIGFwaSA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ0ZTLlN0b3JhZ2VBZGFwdGVyIHBsZWFzZSBkZWZpbmUgYW4gYXBpJyk7XG4gIH1cblxuICBGUy5VdGlsaXR5LmVhY2goJ2ZpbGVLZXkscmVtb3ZlLHR5cGVOYW1lLGNyZWF0ZVJlYWRTdHJlYW0sY3JlYXRlV3JpdGVTdHJlYW0nLnNwbGl0KCcsJyksIGZ1bmN0aW9uKG5hbWUpIHtcbiAgICBpZiAodHlwZW9mIGFwaVtuYW1lXSA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignRlMuU3RvcmFnZUFkYXB0ZXIgcGxlYXNlIGRlZmluZSBhbiBhcGkuIFwiJyArIG5hbWUgKyAnXCIgJyArIChhcGkudHlwZU5hbWUgfHwgJycpKTtcbiAgICB9XG4gIH0pO1xuXG4gIC8vIENyZWF0ZSBhbiBpbnRlcm5hbCBuYW1lc3BhY2UsIHN0YXJ0aW5nIGEgbmFtZSB3aXRoIHVuZGVyc2NvcmUgaXMgb25seVxuICAvLyBhbGxvd2VkIGZvciBzdG9yZXMgbWFya2VkIHdpdGggb3B0aW9ucy5pbnRlcm5hbCA9PT0gdHJ1ZVxuICBpZiAob3B0aW9ucy5pbnRlcm5hbCAhPT0gdHJ1ZSAmJiBzdG9yZU5hbWVbMF0gPT09ICdfJykge1xuICAgIHRocm93IG5ldyBFcnJvcignQSBzdG9yYWdlIGFkYXB0ZXIgbmFtZSBtYXkgbm90IGJlZ2luIHdpdGggXCJfXCInKTtcbiAgfVxuXG4gIGlmIChzdG9yZU5hbWUuaW5kZXhPZignLicpICE9PSAtMSkge1xuICAgIHRocm93IG5ldyBFcnJvcignQSBzdG9yYWdlIGFkYXB0ZXIgbmFtZSBtYXkgbm90IGNvbnRhaW4gYSBcIi5cIicpO1xuICB9XG5cbiAgLy8gc3RvcmUgcmVmZXJlbmNlIGZvciBlYXN5IGxvb2t1cCBieSBzdG9yZU5hbWVcbiAgaWYgKHR5cGVvZiBfc3RvcmFnZUFkYXB0ZXJzW3N0b3JlTmFtZV0gIT09ICd1bmRlZmluZWQnKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdTdG9yYWdlIG5hbWUgYWxyZWFkeSBleGlzdHM6IFwiJyArIHN0b3JlTmFtZSArICdcIicpO1xuICB9IGVsc2Uge1xuICAgIF9zdG9yYWdlQWRhcHRlcnNbc3RvcmVOYW1lXSA9IHNlbGY7XG4gIH1cblxuICAvLyBVc2VyIGNhbiBjdXN0b21pemUgdGhlIGZpbGUga2V5IGdlbmVyYXRpb24gZnVuY3Rpb25cbiAgaWYgKHR5cGVvZiBvcHRpb25zLmZpbGVLZXlNYWtlciA9PT0gXCJmdW5jdGlvblwiKSB7XG4gICAgZmlsZUtleU1ha2VyID0gb3B0aW9ucy5maWxlS2V5TWFrZXI7XG4gIH0gZWxzZSB7XG4gICAgZmlsZUtleU1ha2VyID0gYXBpLmZpbGVLZXk7XG4gIH1cblxuICAvLyBVc2VyIGNhbiBwcm92aWRlIGEgZnVuY3Rpb24gdG8gYWRqdXN0IHRoZSBmaWxlT2JqXG4gIC8vIGJlZm9yZSBpdCBpcyB3cml0dGVuIHRvIHRoZSBzdG9yZS5cbiAgdmFyIGJlZm9yZVdyaXRlID0gb3B0aW9ucy5iZWZvcmVXcml0ZTtcblxuICAvLyBleHRlbmQgc2VsZiB3aXRoIG9wdGlvbnMgYW5kIG90aGVyIGluZm9cbiAgRlMuVXRpbGl0eS5leHRlbmQodGhpcywgb3B0aW9ucywge1xuICAgIG5hbWU6IHN0b3JlTmFtZSxcbiAgICB0eXBlTmFtZTogYXBpLnR5cGVOYW1lXG4gIH0pO1xuXG4gIC8vIENyZWF0ZSBhIG5pY2VyIGFic3RyYWN0ZWQgYWRhcHRlciBpbnRlcmZhY2VcbiAgc2VsZi5hZGFwdGVyID0ge307XG5cbiAgc2VsZi5hZGFwdGVyLmZpbGVLZXkgPSBmdW5jdGlvbihmaWxlT2JqKSB7XG4gICAgcmV0dXJuIGZpbGVLZXlNYWtlcihmaWxlT2JqKTtcbiAgfTtcblxuICAvLyBSZXR1cm4gcmVhZGFibGUgc3RyZWFtIGZvciBmaWxlS2V5XG4gIHNlbGYuYWRhcHRlci5jcmVhdGVSZWFkU3RyZWFtRm9yRmlsZUtleSA9IGZ1bmN0aW9uKGZpbGVLZXksIG9wdGlvbnMpIHtcbiAgICBpZiAoRlMuZGVidWcpIGNvbnNvbGUubG9nKCdjcmVhdGVSZWFkU3RyZWFtRm9yRmlsZUtleSAnICsgc3RvcmVOYW1lKTtcbiAgICByZXR1cm4gRlMuVXRpbGl0eS5zYWZlU3RyZWFtKCBhcGkuY3JlYXRlUmVhZFN0cmVhbShmaWxlS2V5LCBvcHRpb25zKSApO1xuICB9O1xuXG4gIC8vIFJldHVybiByZWFkYWJsZSBzdHJlYW0gZm9yIGZpbGVPYmpcbiAgc2VsZi5hZGFwdGVyLmNyZWF0ZVJlYWRTdHJlYW0gPSBmdW5jdGlvbihmaWxlT2JqLCBvcHRpb25zKSB7XG4gICAgaWYgKEZTLmRlYnVnKSBjb25zb2xlLmxvZygnY3JlYXRlUmVhZFN0cmVhbSAnICsgc3RvcmVOYW1lKTtcbiAgICBpZiAoc2VsZi5pbnRlcm5hbCkge1xuICAgICAgLy8gSW50ZXJuYWwgc3RvcmVzIHRha2UgYSBmaWxlS2V5XG4gICAgICByZXR1cm4gc2VsZi5hZGFwdGVyLmNyZWF0ZVJlYWRTdHJlYW1Gb3JGaWxlS2V5KGZpbGVPYmosIG9wdGlvbnMpO1xuICAgIH1cbiAgICByZXR1cm4gRlMuVXRpbGl0eS5zYWZlU3RyZWFtKCBzZWxmLl90cmFuc2Zvcm0uY3JlYXRlUmVhZFN0cmVhbShmaWxlT2JqLCBvcHRpb25zKSApO1xuICB9O1xuXG4gIGZ1bmN0aW9uIGxvZ0V2ZW50c0ZvclN0cmVhbShzdHJlYW0pIHtcbiAgICBpZiAoRlMuZGVidWcpIHtcbiAgICAgIHN0cmVhbS5vbignc3RvcmVkJywgZnVuY3Rpb24oKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKCctLS0tLS0tLS0tLVNUT1JFRCBTVFJFQU0nLCBzdG9yZU5hbWUpO1xuICAgICAgfSk7XG5cbiAgICAgIHN0cmVhbS5vbignY2xvc2UnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgY29uc29sZS5sb2coJy0tLS0tLS0tLS0tQ0xPU0UgU1RSRUFNJywgc3RvcmVOYW1lKTtcbiAgICAgIH0pO1xuXG4gICAgICBzdHJlYW0ub24oJ2VuZCcsIGZ1bmN0aW9uKCkge1xuICAgICAgICBjb25zb2xlLmxvZygnLS0tLS0tLS0tLS1FTkQgU1RSRUFNJywgc3RvcmVOYW1lKTtcbiAgICAgIH0pO1xuXG4gICAgICBzdHJlYW0ub24oJ2ZpbmlzaCcsIGZ1bmN0aW9uKCkge1xuICAgICAgICBjb25zb2xlLmxvZygnLS0tLS0tLS0tLS1GSU5JU0ggU1RSRUFNJywgc3RvcmVOYW1lKTtcbiAgICAgIH0pO1xuXG4gICAgICBzdHJlYW0ub24oJ2Vycm9yJywgZnVuY3Rpb24oZXJyb3IpIHtcbiAgICAgICAgY29uc29sZS5sb2coJy0tLS0tLS0tLS0tRVJST1IgU1RSRUFNJywgc3RvcmVOYW1lLCBlcnJvciAmJiAoZXJyb3IubWVzc2FnZSB8fCBlcnJvci5jb2RlKSk7XG4gICAgICB9KTtcbiAgICB9XG4gIH1cblxuICAvLyBSZXR1cm4gd3JpdGVhYmxlIHN0cmVhbSBmb3IgZmlsZUtleVxuICBzZWxmLmFkYXB0ZXIuY3JlYXRlV3JpdGVTdHJlYW1Gb3JGaWxlS2V5ID0gZnVuY3Rpb24oZmlsZUtleSwgb3B0aW9ucykge1xuICAgIGlmIChGUy5kZWJ1ZykgY29uc29sZS5sb2coJ2NyZWF0ZVdyaXRlU3RyZWFtRm9yRmlsZUtleSAnICsgc3RvcmVOYW1lKTtcbiAgICB2YXIgd3JpdGVTdHJlYW0gPSBGUy5VdGlsaXR5LnNhZmVTdHJlYW0oIGFwaS5jcmVhdGVXcml0ZVN0cmVhbShmaWxlS2V5LCBvcHRpb25zKSApO1xuXG4gICAgbG9nRXZlbnRzRm9yU3RyZWFtKHdyaXRlU3RyZWFtKTtcblxuICAgIHJldHVybiB3cml0ZVN0cmVhbTtcbiAgfTtcblxuICAvLyBSZXR1cm4gd3JpdGVhYmxlIHN0cmVhbSBmb3IgZmlsZU9ialxuICBzZWxmLmFkYXB0ZXIuY3JlYXRlV3JpdGVTdHJlYW0gPSBmdW5jdGlvbihmaWxlT2JqLCBvcHRpb25zKSB7XG4gICAgaWYgKEZTLmRlYnVnKSBjb25zb2xlLmxvZygnY3JlYXRlV3JpdGVTdHJlYW0gJyArIHN0b3JlTmFtZSArICcsIGludGVybmFsOiAnICsgISFzZWxmLmludGVybmFsKTtcblxuICAgIGlmIChzZWxmLmludGVybmFsKSB7XG4gICAgICAvLyBJbnRlcm5hbCBzdG9yZXMgdGFrZSBhIGZpbGVLZXlcbiAgICAgIHJldHVybiBzZWxmLmFkYXB0ZXIuY3JlYXRlV3JpdGVTdHJlYW1Gb3JGaWxlS2V5KGZpbGVPYmosIG9wdGlvbnMpO1xuICAgIH1cblxuICAgIC8vIElmIHdlIGhhdmVuJ3Qgc2V0IG5hbWUsIHR5cGUsIG9yIHNpemUgZm9yIHRoaXMgdmVyc2lvbiB5ZXQsXG4gICAgLy8gc2V0IGl0IHRvIHNhbWUgdmFsdWVzIGFzIG9yaWdpbmFsIHZlcnNpb24uIFdlIGRvbid0IHNhdmVcbiAgICAvLyB0aGVzZSB0byB0aGUgREIgcmlnaHQgYXdheSBiZWNhdXNlIHRoZXkgbWlnaHQgYmUgY2hhbmdlZFxuICAgIC8vIGluIGEgdHJhbnNmb3JtV3JpdGUgZnVuY3Rpb24uXG4gICAgaWYgKCFmaWxlT2JqLm5hbWUoe3N0b3JlOiBzdG9yZU5hbWV9KSkge1xuICAgICAgZmlsZU9iai5uYW1lKGZpbGVPYmoubmFtZSgpLCB7c3RvcmU6IHN0b3JlTmFtZSwgc2F2ZTogZmFsc2V9KTtcbiAgICB9XG4gICAgaWYgKCFmaWxlT2JqLnR5cGUoe3N0b3JlOiBzdG9yZU5hbWV9KSkge1xuICAgICAgZmlsZU9iai50eXBlKGZpbGVPYmoudHlwZSgpLCB7c3RvcmU6IHN0b3JlTmFtZSwgc2F2ZTogZmFsc2V9KTtcbiAgICB9XG4gICAgaWYgKCFmaWxlT2JqLnNpemUoe3N0b3JlOiBzdG9yZU5hbWV9KSkge1xuICAgICAgZmlsZU9iai5zaXplKGZpbGVPYmouc2l6ZSgpLCB7c3RvcmU6IHN0b3JlTmFtZSwgc2F2ZTogZmFsc2V9KTtcbiAgICB9XG5cbiAgICAvLyBDYWxsIHVzZXIgZnVuY3Rpb24gdG8gYWRqdXN0IGZpbGUgbWV0YWRhdGEgZm9yIHRoaXMgc3RvcmUuXG4gICAgLy8gV2Ugc3VwcG9ydCB1cGRhdGluZyBuYW1lLCBleHRlbnNpb24sIGFuZC9vciB0eXBlIGJhc2VkIG9uXG4gICAgLy8gaW5mbyByZXR1cm5lZCBpbiBhbiBvYmplY3QuIE9yIGBmaWxlT2JqYCBjb3VsZCBiZVxuICAgIC8vIGFsdGVyZWQgZGlyZWN0bHkgd2l0aGluIHRoZSBiZWZvcmVXcml0ZSBmdW5jdGlvbi5cbiAgICBpZiAoYmVmb3JlV3JpdGUpIHtcbiAgICAgIHZhciBmaWxlQ2hhbmdlcyA9IGJlZm9yZVdyaXRlKGZpbGVPYmopO1xuICAgICAgaWYgKHR5cGVvZiBmaWxlQ2hhbmdlcyA9PT0gXCJvYmplY3RcIikge1xuICAgICAgICBpZiAoZmlsZUNoYW5nZXMuZXh0ZW5zaW9uKSB7XG4gICAgICAgICAgZmlsZU9iai5leHRlbnNpb24oZmlsZUNoYW5nZXMuZXh0ZW5zaW9uLCB7c3RvcmU6IHN0b3JlTmFtZSwgc2F2ZTogZmFsc2V9KTtcbiAgICAgICAgfSBlbHNlIGlmIChmaWxlQ2hhbmdlcy5uYW1lKSB7XG4gICAgICAgICAgZmlsZU9iai5uYW1lKGZpbGVDaGFuZ2VzLm5hbWUsIHtzdG9yZTogc3RvcmVOYW1lLCBzYXZlOiBmYWxzZX0pO1xuICAgICAgICB9XG4gICAgICAgIGlmIChmaWxlQ2hhbmdlcy50eXBlKSB7XG4gICAgICAgICAgZmlsZU9iai50eXBlKGZpbGVDaGFuZ2VzLnR5cGUsIHtzdG9yZTogc3RvcmVOYW1lLCBzYXZlOiBmYWxzZX0pO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgdmFyIHdyaXRlU3RyZWFtID0gRlMuVXRpbGl0eS5zYWZlU3RyZWFtKCBzZWxmLl90cmFuc2Zvcm0uY3JlYXRlV3JpdGVTdHJlYW0oZmlsZU9iaiwgb3B0aW9ucykgKTtcblxuICAgIGxvZ0V2ZW50c0ZvclN0cmVhbSh3cml0ZVN0cmVhbSk7XG5cbiAgICAvLyBJdHMgcmVhbGx5IG9ubHkgdGhlIHN0b3JhZ2UgYWRhcHRlciB3aG8ga25vd3MgaWYgdGhlIGZpbGUgaXMgdXBsb2FkZWRcbiAgICAvL1xuICAgIC8vIFdlIGhhdmUgdG8gdXNlIG91ciBvd24gZXZlbnQgbWFraW5nIHN1cmUgdGhlIHN0b3JhZ2UgcHJvY2VzcyBpcyBjb21wbGV0ZWRcbiAgICAvLyB0aGlzIGlzIG1haW5seVxuICAgIHdyaXRlU3RyZWFtLnNhZmVPbignc3RvcmVkJywgZnVuY3Rpb24ocmVzdWx0KSB7XG4gICAgICBpZiAodHlwZW9mIHJlc3VsdC5maWxlS2V5ID09PSAndW5kZWZpbmVkJykge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ1NBICcgKyBzdG9yZU5hbWUgKyAnIHR5cGUgJyArIGFwaS50eXBlTmFtZSArICcgZGlkIG5vdCByZXR1cm4gYSBmaWxlS2V5Jyk7XG4gICAgICB9XG4gICAgICBpZiAoRlMuZGVidWcpIGNvbnNvbGUubG9nKCdTQScsIHN0b3JlTmFtZSwgJ3N0b3JlZCcsIHJlc3VsdC5maWxlS2V5KTtcbiAgICAgIC8vIFNldCB0aGUgZmlsZUtleVxuICAgICAgZmlsZU9iai5jb3BpZXNbc3RvcmVOYW1lXS5rZXkgPSByZXN1bHQuZmlsZUtleTtcblxuICAgICAgLy8gVXBkYXRlIHRoZSBzaXplLCBhcyBwcm92aWRlZCBieSB0aGUgU0EsIGluIGNhc2UgaXQgd2FzIGNoYW5nZWQgYnkgc3RyZWFtIHRyYW5zZm9ybWF0aW9uXG4gICAgICBpZiAodHlwZW9mIHJlc3VsdC5zaXplID09PSBcIm51bWJlclwiKSB7XG4gICAgICAgIGZpbGVPYmouY29waWVzW3N0b3JlTmFtZV0uc2l6ZSA9IHJlc3VsdC5zaXplO1xuICAgICAgfVxuXG4gICAgICAvLyBTZXQgbGFzdCB1cGRhdGVkIHRpbWUsIGVpdGhlciBwcm92aWRlZCBieSBTQSBvciBub3dcbiAgICAgIGZpbGVPYmouY29waWVzW3N0b3JlTmFtZV0udXBkYXRlZEF0ID0gcmVzdWx0LnN0b3JlZEF0IHx8IG5ldyBEYXRlKCk7XG5cbiAgICAgIC8vIElmIHRoZSBmaWxlIG9iamVjdCBjb3B5IGhhdmVudCBnb3QgYSBjcmVhdGVkQXQgdGhlbiBzZXQgdGhpc1xuICAgICAgaWYgKHR5cGVvZiBmaWxlT2JqLmNvcGllc1tzdG9yZU5hbWVdLmNyZWF0ZWRBdCA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgZmlsZU9iai5jb3BpZXNbc3RvcmVOYW1lXS5jcmVhdGVkQXQgPSBmaWxlT2JqLmNvcGllc1tzdG9yZU5hbWVdLnVwZGF0ZWRBdDtcbiAgICAgIH1cblxuICAgICAgZmlsZU9iai5fc2F2ZUNoYW5nZXMoc3RvcmVOYW1lKTtcblxuICAgICAgLy8gVGhlcmUgaXMgY29kZSBpbiB0cmFuc2Zvcm0gdGhhdCBtYXkgaGF2ZSBzZXQgdGhlIG9yaWdpbmFsIGZpbGUgc2l6ZSwgdG9vLlxuICAgICAgZmlsZU9iai5fc2F2ZUNoYW5nZXMoJ19vcmlnaW5hbCcpO1xuICAgIH0pO1xuXG4gICAgLy8gRW1pdCBldmVudHMgZnJvbSBTQVxuICAgIHdyaXRlU3RyZWFtLm9uY2UoJ3N0b3JlZCcsIGZ1bmN0aW9uKC8qcmVzdWx0Ki8pIHtcbiAgICAgIC8vIFhYWCBCZWNhdXNlIG9mIHRoZSB3YXkgc3RvcmVzIGluaGVyaXQgZnJvbSBTQSwgdGhpcyB3aWxsIGVtaXQgb24gZXZlcnkgc3RvcmUuXG4gICAgICAvLyBNYXliZSBuZWVkIHRvIHJld3JpdGUgdGhlIHdheSB3ZSBpbmhlcml0IGZyb20gU0E/XG4gICAgICB2YXIgZW1pdHRlZCA9IHNlbGYuZW1pdCgnc3RvcmVkJywgc3RvcmVOYW1lLCBmaWxlT2JqKTtcbiAgICAgIGlmIChGUy5kZWJ1ZyAmJiAhZW1pdHRlZCkge1xuICAgICAgICBjb25zb2xlLmxvZyhmaWxlT2JqLm5hbWUoKSArICcgd2FzIHN1Y2Nlc3NmdWxseSBzdG9yZWQgaW4gdGhlICcgKyBzdG9yZU5hbWUgKyAnIHN0b3JlLiBZb3UgYXJlIHNlZWluZyB0aGlzIGluZm9ybWF0aW9uYWwgbWVzc2FnZSBiZWNhdXNlIHlvdSBlbmFibGVkIGRlYnVnZ2luZyBhbmQgeW91IGhhdmUgbm90IGRlZmluZWQgYW55IGxpc3RlbmVycyBmb3IgdGhlIFwic3RvcmVkXCIgZXZlbnQgb24gdGhpcyBzdG9yZS4nKTtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIHdyaXRlU3RyZWFtLm9uKCdlcnJvcicsIGZ1bmN0aW9uKGVycm9yKSB7XG4gICAgICAvLyBYWFggV2UgY291bGQgd3JhcCBhbmQgY2xhcmlmeSBlcnJvclxuICAgICAgLy8gWFhYIEJlY2F1c2Ugb2YgdGhlIHdheSBzdG9yZXMgaW5oZXJpdCBmcm9tIFNBLCB0aGlzIHdpbGwgZW1pdCBvbiBldmVyeSBzdG9yZS5cbiAgICAgIC8vIE1heWJlIG5lZWQgdG8gcmV3cml0ZSB0aGUgd2F5IHdlIGluaGVyaXQgZnJvbSBTQT9cbiAgICAgIHZhciBlbWl0dGVkID0gc2VsZi5lbWl0KCdlcnJvcicsIHN0b3JlTmFtZSwgZXJyb3IsIGZpbGVPYmopO1xuICAgICAgaWYgKEZTLmRlYnVnICYmICFlbWl0dGVkKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKGVycm9yKTtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIHJldHVybiB3cml0ZVN0cmVhbTtcbiAgfTtcblxuICAvL2ludGVybmFsXG4gIHNlbGYuX3JlbW92ZUFzeW5jID0gZnVuY3Rpb24oZmlsZUtleSwgY2FsbGJhY2spIHtcbiAgICAvLyBSZW1vdmUgdGhlIGZpbGUgZnJvbSB0aGUgc3RvcmVcbiAgICBhcGkucmVtb3ZlLmNhbGwoc2VsZiwgZmlsZUtleSwgY2FsbGJhY2spO1xuICB9O1xuXG4gIC8qKlxuICAgKiBAbWV0aG9kIEZTLlN0b3JhZ2VBZGFwdGVyLnByb3RvdHlwZS5yZW1vdmVcbiAgICogQHB1YmxpY1xuICAgKiBAcGFyYW0ge0ZTLkZpbGV9IGZzRmlsZSBUaGUgRlMuRmlsZSBpbnN0YW5jZSB0byBiZSBzdG9yZWQuXG4gICAqIEBwYXJhbSB7RnVuY3Rpb259IFtjYWxsYmFja10gSWYgbm90IHByb3ZpZGVkLCB3aWxsIGJsb2NrIGFuZCByZXR1cm4gdHJ1ZSBvciBmYWxzZVxuICAgKlxuICAgKiBBdHRlbXB0cyB0byByZW1vdmUgYSBmaWxlIGZyb20gdGhlIHN0b3JlLiBSZXR1cm5zIHRydWUgaWYgcmVtb3ZlZCBvciBub3RcbiAgICogZm91bmQsIG9yIGZhbHNlIGlmIHRoZSBmaWxlIGNvdWxkbid0IGJlIHJlbW92ZWQuXG4gICAqL1xuICBzZWxmLmFkYXB0ZXIucmVtb3ZlID0gZnVuY3Rpb24oZmlsZU9iaiwgY2FsbGJhY2spIHtcbiAgICBpZiAoRlMuZGVidWcpIGNvbnNvbGUubG9nKFwiLS0tU0EgUkVNT1ZFXCIpO1xuXG4gICAgLy8gR2V0IHRoZSBmaWxlS2V5XG4gICAgdmFyIGZpbGVLZXkgPSAoZmlsZU9iaiBpbnN0YW5jZW9mIEZTLkZpbGUpID8gc2VsZi5hZGFwdGVyLmZpbGVLZXkoZmlsZU9iaikgOiBmaWxlT2JqO1xuXG4gICAgaWYgKGNhbGxiYWNrKSB7XG4gICAgICByZXR1cm4gc2VsZi5fcmVtb3ZlQXN5bmMoZmlsZUtleSwgRlMuVXRpbGl0eS5zYWZlQ2FsbGJhY2soY2FsbGJhY2spKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIE1ldGVvci53cmFwQXN5bmMoc2VsZi5fcmVtb3ZlQXN5bmMpKGZpbGVLZXkpO1xuICAgIH1cbiAgfTtcblxuICBzZWxmLnJlbW92ZSA9IGZ1bmN0aW9uKGZpbGVPYmosIGNhbGxiYWNrKSB7XG4gICAgLy8gQWRkIGRlcHJlY2F0aW9uIG5vdGVcbiAgICBjb25zb2xlLndhcm4oJ1N0b3JhZ2UucmVtb3ZlIGlzIGRlcHJlY2F0aW5nLCB1c2UgXCJTdG9yYWdlLmFkYXB0ZXIucmVtb3ZlXCInKTtcbiAgICByZXR1cm4gc2VsZi5hZGFwdGVyLnJlbW92ZShmaWxlT2JqLCBjYWxsYmFjayk7XG4gIH07XG5cbiAgaWYgKHR5cGVvZiBhcGkuaW5pdCA9PT0gJ2Z1bmN0aW9uJykge1xuICAgIE1ldGVvci53cmFwQXN5bmMoYXBpLmluaXQuYmluZChzZWxmKSkoKTtcbiAgfVxuXG4gIC8vIFRoaXMgc3VwcG9ydHMgb3B0aW9uYWwgdHJhbnNmb3JtV3JpdGUgYW5kIHRyYW5zZm9ybVJlYWRcbiAgc2VsZi5fdHJhbnNmb3JtID0gbmV3IEZTLlRyYW5zZm9ybSh7XG4gICAgYWRhcHRlcjogc2VsZi5hZGFwdGVyLFxuICAgIC8vIE9wdGlvbmFsIHRyYW5zZm9ybWF0aW9uIGZ1bmN0aW9uczpcbiAgICB0cmFuc2Zvcm1Xcml0ZTogb3B0aW9ucy50cmFuc2Zvcm1Xcml0ZSxcbiAgICB0cmFuc2Zvcm1SZWFkOiBvcHRpb25zLnRyYW5zZm9ybVJlYWRcbiAgfSk7XG5cbn07XG5cbnJlcXVpcmUoJ3V0aWwnKS5pbmhlcml0cyhGUy5TdG9yYWdlQWRhcHRlciwgRXZlbnRFbWl0dGVyKTtcbiIsIi8qIGdsb2JhbCBGUywgZ20gKi9cblxudmFyIFBhc3NUaHJvdWdoID0gcmVxdWlyZSgnc3RyZWFtJykuUGFzc1Rocm91Z2g7XG52YXIgbGVuZ3RoU3RyZWFtID0gcmVxdWlyZSgnLi9sZW5ndGgtc3RyZWFtJyk7XG5cbkZTLlRyYW5zZm9ybSA9IGZ1bmN0aW9uKG9wdGlvbnMpIHtcbiAgdmFyIHNlbGYgPSB0aGlzO1xuXG4gIG9wdGlvbnMgPSBvcHRpb25zIHx8IHt9O1xuXG4gIGlmICghKHNlbGYgaW5zdGFuY2VvZiBGUy5UcmFuc2Zvcm0pKVxuICAgIHRocm93IG5ldyBFcnJvcignRlMuVHJhbnNmb3JtIG11c3QgYmUgY2FsbGVkIHdpdGggdGhlIFwibmV3XCIga2V5d29yZCcpO1xuXG4gIGlmICghb3B0aW9ucy5hZGFwdGVyKVxuICAgIHRocm93IG5ldyBFcnJvcignVHJhbnNmb3JtIGV4cGVjdHMgb3B0aW9uLmFkYXB0ZXIgdG8gYmUgYSBzdG9yYWdlIGFkYXB0ZXInKTtcblxuICBzZWxmLnN0b3JhZ2UgPSBvcHRpb25zLmFkYXB0ZXI7XG5cbiAgLy8gRmV0Y2ggdGhlIHRyYW5zZm9ybWF0aW9uIGZ1bmN0aW9ucyBpZiBhbnlcbiAgc2VsZi50cmFuc2Zvcm1Xcml0ZSA9IG9wdGlvbnMudHJhbnNmb3JtV3JpdGU7XG4gIHNlbGYudHJhbnNmb3JtUmVhZCA9IG9wdGlvbnMudHJhbnNmb3JtUmVhZDtcbn07XG5cbi8vIEFsbG93IHBhY2thZ2VzIHRvIGFkZCBzY29wZVxuRlMuVHJhbnNmb3JtLnNjb3BlID0ge1xuLy8gRGVwcmVjYXRlIGdtIHNjb3BlOlxuICBnbTogZnVuY3Rpb24oc291cmNlLCBoZWlnaHQsIGNvbG9yKSB7XG4gICAgY29uc29sZS53YXJuKCdEZXByZWNhdGlvbiBub3RpY2U6IGB0aGlzLmdtYCBpcyBkZXByZWNhdGluZyBpbiBmYXZvdXIgb2YgdGhlIGdlbmVyYWwgZ2xvYmFsIGBnbWAgc2NvcGUnKTtcbiAgICBpZiAodHlwZW9mIGdtICE9PSAnZnVuY3Rpb24nKVxuICAgICAgdGhyb3cgbmV3IEVycm9yKCdObyBncmFwaGljc21hZ2ljayBwYWNrYWdlIGluc3RhbGxlZCwgYGdtYCBub3QgZm91bmQgaW4gc2NvcGUsIGVnLiBgY2ZzLWdyYXBoaWNzbWFnaWNrYCcpO1xuICAgIHJldHVybiBnbShzb3VyY2UsIGhlaWdodCwgY29sb3IpO1xuICB9XG4vLyBFTyBEZXByZWNhdGUgZ20gc2NvcGVcbn07XG5cbi8vIFRoZSB0cmFuc2Zvcm1hdGlvbiBzdHJlYW0gdHJpZ2dlcnMgYW4gXCJzdG9yZWRcIiBldmVudCB3aGVuIGRhdGEgaXMgc3RvcmVkIGludG9cbi8vIHRoZSBzdG9yYWdlIGFkYXB0ZXJcbkZTLlRyYW5zZm9ybS5wcm90b3R5cGUuY3JlYXRlV3JpdGVTdHJlYW0gPSBmdW5jdGlvbihmaWxlT2JqKSB7XG4gIHZhciBzZWxmID0gdGhpcztcblxuICAvLyBHZXQgdGhlIGZpbGUga2V5XG4gIHZhciBmaWxlS2V5ID0gc2VsZi5zdG9yYWdlLmZpbGVLZXkoZmlsZU9iaik7XG5cbiAgLy8gUmlnIHdyaXRlIHN0cmVhbVxuICB2YXIgZGVzdGluYXRpb25TdHJlYW0gPSBzZWxmLnN0b3JhZ2UuY3JlYXRlV3JpdGVTdHJlYW1Gb3JGaWxlS2V5KGZpbGVLZXksIHtcbiAgICAvLyBOb3QgYWxsIFNBJ3MgY2FuIHNldCB0aGVzZSBvcHRpb25zIGFuZCBjZnMgZG9udCBkZXBlbmQgb24gc2V0dGluZyB0aGVzZVxuICAgIC8vIGJ1dCBpdHMgbmljZSBpZiBvdGhlciBzeXN0ZW1zIGFyZSBhY2Nlc3NpbmcgdGhlIFNBIHRoYXQgc29tZSBvZiB0aGUgZGF0YVxuICAgIC8vIGlzIGFsc28gYXZhaWxhYmxlIHRvIHRob3NlXG4gICAgYWxpYXNlczogW2ZpbGVPYmoubmFtZSgpXSxcbiAgICBjb250ZW50VHlwZTogZmlsZU9iai50eXBlKCksXG4gICAgbWV0YWRhdGE6IGZpbGVPYmoubWV0YWRhdGFcbiAgfSk7XG5cbiAgLy8gUGFzcyB0aHJvdWdoIHRyYW5zZm9ybVdyaXRlIGZ1bmN0aW9uIGlmIHByb3ZpZGVkXG4gIGlmICh0eXBlb2Ygc2VsZi50cmFuc2Zvcm1Xcml0ZSA9PT0gJ2Z1bmN0aW9uJykge1xuXG4gICAgZGVzdGluYXRpb25TdHJlYW0gPSBhZGRQYXNzVGhyb3VnaChkZXN0aW5hdGlvblN0cmVhbSwgZnVuY3Rpb24gKHB0U3RyZWFtLCBvcmlnaW5hbFN0cmVhbSkge1xuICAgICAgLy8gUmlnIHRyYW5zZm9ybVxuICAgICAgdHJ5IHtcbiAgICAgICAgc2VsZi50cmFuc2Zvcm1Xcml0ZS5jYWxsKEZTLlRyYW5zZm9ybS5zY29wZSwgZmlsZU9iaiwgcHRTdHJlYW0sIG9yaWdpbmFsU3RyZWFtKTtcbiAgICAgICAgLy8gWFhYOiBJZiB0aGUgdHJhbnNmb3JtIGZ1bmN0aW9uIHJldHVybnMgYSBidWZmZXIgc2hvdWxkIHdlIHN0cmVhbSB0aGF0P1xuICAgICAgfSBjYXRjaChlcnIpIHtcbiAgICAgICAgLy8gV2UgZW1pdCBhbiBlcnJvciAtIHNob3VsZCB3ZSB0aHJvdyBhbiBlcnJvcj9cbiAgICAgICAgY29uc29sZS53YXJuKCdGUy5UcmFuc2Zvcm0uY3JlYXRlV3JpdGVTdHJlYW0gdHJhbnNmb3JtIGZ1bmN0aW9uIGZhaWxlZCwgRXJyb3I6ICcpO1xuICAgICAgICB0aHJvdyBlcnI7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgfVxuXG4gIC8vIElmIG9yaWdpbmFsIGRvZXNuJ3QgaGF2ZSBzaXplLCBhZGQgYW5vdGhlciBQYXNzVGhyb3VnaCB0byBnZXQgYW5kIHNldCB0aGUgc2l6ZS5cbiAgLy8gVGhpcyB3aWxsIHJ1biBvbiBzaXplPTAsIHRvbywgd2hpY2ggaXMgT0suXG4gIC8vIE5PVEU6IFRoaXMgbXVzdCBjb21lIEFGVEVSIHRoZSB0cmFuc2Zvcm1Xcml0ZSBjb2RlIGJsb2NrIGFib3ZlLiBUaGlzIG1pZ2h0IHNlZW1cbiAgLy8gY29uZnVzaW5nLCBidXQgYnkgY29taW5nIGFmdGVyIGl0LCB0aGlzIHdpbGwgYWN0dWFsbHkgYmUgZXhlY3V0ZWQgQkVGT1JFIHRoZSB1c2VyJ3NcbiAgLy8gdHJhbnNmb3JtLCB3aGljaCBpcyB3aGF0IHdlIG5lZWQgaW4gb3JkZXIgdG8gYmUgc3VyZSB3ZSBnZXQgdGhlIG9yaWdpbmFsIGZpbGVcbiAgLy8gc2l6ZSBhbmQgbm90IHRoZSB0cmFuc2Zvcm1lZCBmaWxlIHNpemUuXG4gIGlmICghZmlsZU9iai5zaXplKCkpIHtcbiAgICBkZXN0aW5hdGlvblN0cmVhbSA9IGFkZFBhc3NUaHJvdWdoKGRlc3RpbmF0aW9uU3RyZWFtLCBmdW5jdGlvbiAocHRTdHJlYW0sIG9yaWdpbmFsU3RyZWFtKSB7XG4gICAgICB2YXIgbHN0cmVhbSA9IGxlbmd0aFN0cmVhbShmdW5jdGlvbiAoZmlsZVNpemUpIHtcbiAgICAgICAgZmlsZU9iai5zaXplKGZpbGVTaXplLCB7c2F2ZTogZmFsc2V9KTtcbiAgICAgIH0pO1xuXG4gICAgICBwdFN0cmVhbS5waXBlKGxzdHJlYW0pLnBpcGUob3JpZ2luYWxTdHJlYW0pO1xuICAgIH0pO1xuICB9XG5cbiAgcmV0dXJuIGRlc3RpbmF0aW9uU3RyZWFtO1xufTtcblxuRlMuVHJhbnNmb3JtLnByb3RvdHlwZS5jcmVhdGVSZWFkU3RyZWFtID0gZnVuY3Rpb24oZmlsZU9iaiwgb3B0aW9ucykge1xuICB2YXIgc2VsZiA9IHRoaXM7XG5cbiAgLy8gR2V0IHRoZSBmaWxlIGtleVxuICB2YXIgZmlsZUtleSA9IHNlbGYuc3RvcmFnZS5maWxlS2V5KGZpbGVPYmopO1xuXG4gIC8vIFJpZyByZWFkIHN0cmVhbVxuICB2YXIgc291cmNlU3RyZWFtID0gc2VsZi5zdG9yYWdlLmNyZWF0ZVJlYWRTdHJlYW1Gb3JGaWxlS2V5KGZpbGVLZXksIG9wdGlvbnMpO1xuXG4gIC8vIFBhc3MgdGhyb3VnaCB0cmFuc2Zvcm1SZWFkIGZ1bmN0aW9uIGlmIHByb3ZpZGVkXG4gIGlmICh0eXBlb2Ygc2VsZi50cmFuc2Zvcm1SZWFkID09PSAnZnVuY3Rpb24nKSB7XG5cbiAgICBzb3VyY2VTdHJlYW0gPSBhZGRQYXNzVGhyb3VnaChzb3VyY2VTdHJlYW0sIGZ1bmN0aW9uIChwdFN0cmVhbSwgb3JpZ2luYWxTdHJlYW0pIHtcbiAgICAgIC8vIFJpZyB0cmFuc2Zvcm1cbiAgICAgIHRyeSB7XG4gICAgICAgIHNlbGYudHJhbnNmb3JtUmVhZC5jYWxsKEZTLlRyYW5zZm9ybS5zY29wZSwgZmlsZU9iaiwgb3JpZ2luYWxTdHJlYW0sIHB0U3RyZWFtKTtcbiAgICAgIH0gY2F0Y2goZXJyKSB7XG4gICAgICAgIC8vdGhyb3cgbmV3IEVycm9yKGVycik7XG4gICAgICAgIC8vIFdlIGVtaXQgYW4gZXJyb3IgLSBzaG91bGQgd2UgdGhyb3cgYW4gZXJyb3I/XG4gICAgICAgIHNvdXJjZVN0cmVhbS5lbWl0KCdlcnJvcicsICdGUy5UcmFuc2Zvcm0uY3JlYXRlUmVhZFN0cmVhbSB0cmFuc2Zvcm0gZnVuY3Rpb24gZmFpbGVkJyk7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgfVxuXG4gIC8vIFdlIGRvbnQgdHJhbnNmb3JtIGp1c3Qgbm9ybWFsIFNBIGludGVyZmFjZVxuICByZXR1cm4gc291cmNlU3RyZWFtO1xufTtcblxuLy8gVXRpbGl0eSBmdW5jdGlvbiB0byBzaW1wbGlmeSBhZGRpbmcgbGF5ZXJzIG9mIHBhc3N0aHJvdWdoXG5mdW5jdGlvbiBhZGRQYXNzVGhyb3VnaChzdHJlYW0sIGZ1bmMpIHtcbiAgdmFyIHB0cyA9IG5ldyBQYXNzVGhyb3VnaCgpO1xuICAvLyBXZSBwYXNzIG9uIHRoZSBzcGVjaWFsIFwic3RvcmVkXCIgZXZlbnQgZm9yIHRob3NlIGxpc3RlbmluZ1xuICBzdHJlYW0ub24oJ3N0b3JlZCcsIGZ1bmN0aW9uKHJlc3VsdCkge1xuICAgIHB0cy5lbWl0KCdzdG9yZWQnLCByZXN1bHQpO1xuICB9KTtcbiAgZnVuYyhwdHMsIHN0cmVhbSk7XG4gIHJldHVybiBwdHM7XG59XG4iLCIvKlxuICogQEF1dGhvcjogc3VuaGFvbGluQGhvdG9hLmNvbVxuICogQERhdGU6IDIwMjItMDctMDUgMjA6NDA6NTZcbiAqIEBMYXN0RWRpdG9yczogc3VuaGFvbGluQGhvdG9hLmNvbVxuICogQExhc3RFZGl0VGltZTogMjAyMi0wNy0wNiAxMDowNjo0OFxuICogQERlc2NyaXB0aW9uOiBcbiAqL1xuJ3VzZSBzdHJpY3QnO1xuXG52YXIgcGFzc1N0cmVhbSA9IHJlcXVpcmUoJy4vcGFzcy1zdHJlYW0nKTtcblxuZnVuY3Rpb24gbGVuZ3RoU3RyZWFtKG9wdGlvbnMsIGxlbmd0aExpc3RlbmVyKSB7XG4gIGlmIChhcmd1bWVudHMubGVuZ3RoID09PSAxKSB7ICAvLyBvcHRpb25zIG5vdCBwcm92aWRlZCwgc2hpZnRcbiAgICBsZW5ndGhMaXN0ZW5lciA9IG9wdGlvbnM7XG4gICAgb3B0aW9ucyA9IHt9O1xuICB9XG4gIG9wdGlvbnMgPSBvcHRpb25zIHx8IHt9O1xuICBpZiAodHlwZW9mIGxlbmd0aExpc3RlbmVyICE9PSAnZnVuY3Rpb24nKSB0aHJvdyBuZXcgRXJyb3IoJ2xlbmd0aFN0cmVhbSByZXF1aXJlcyBhIGxlbmd0aExpc3RlbmVyIGZuJyk7XG4gIHZhciBsZW5ndGggPSAwO1xuICBmdW5jdGlvbiB3cml0ZUZuKGRhdGEsIGVuY29kaW5nLCBjYikge1xuICAgIC8qanNoaW50IHZhbGlkdGhpczp0cnVlICovXG4gICAgbGVuZ3RoICs9IGRhdGEubGVuZ3RoO1xuICAgIHRoaXMucHVzaChkYXRhKTtcbiAgICBjYigpO1xuICB9XG4gIGZ1bmN0aW9uIGVuZEZuKGNiKSB7XG4gICAgLypqc2hpbnQgdmFsaWR0aGlzOnRydWUgKi9cbiAgICBsZW5ndGhMaXN0ZW5lcihsZW5ndGgpOyAvLyBjYWxsIHdpdGggcmVzdWx0YW50IGxlbmd0aFxuICAgIGNiKCk7XG4gIH1cbiAgdmFyIHN0cmVhbSA9IHBhc3NTdHJlYW0od3JpdGVGbiwgZW5kRm4sIG9wdGlvbnMpO1xuICByZXR1cm4gc3RyZWFtO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGxlbmd0aFN0cmVhbTsiLCIvKlxuICogQEF1dGhvcjogc3VuaGFvbGluQGhvdG9hLmNvbVxuICogQERhdGU6IDIwMjItMDctMDYgMTA6MDU6NTZcbiAqIEBMYXN0RWRpdG9yczogc3VuaGFvbGluQGhvdG9hLmNvbVxuICogQExhc3RFZGl0VGltZTogMjAyMi0wNy0wNiAxMDowNjowNVxuICogQERlc2NyaXB0aW9uOiBcbiAqL1xuJ3VzZSBzdHJpY3QnO1xuXG52YXIgU3RyZWFtID0gcmVxdWlyZSgnc3RyZWFtJyk7XG52YXIgdXRpbCA9IHJlcXVpcmUoJ3V0aWwnKTtcblxudmFyIFRyYW5zZm9ybSA9IFN0cmVhbS5UcmFuc2Zvcm07XG5cbmZ1bmN0aW9uIFBhc3NUaHJvdWdoRXh0KHdyaXRlRm4sIGVuZEZuLCBvcHRpb25zKSB7XG4gIGlmICghKHRoaXMgaW5zdGFuY2VvZiBQYXNzVGhyb3VnaEV4dCkpIHtcbiAgICByZXR1cm4gbmV3IFBhc3NUaHJvdWdoRXh0KHdyaXRlRm4sIGVuZEZuLCBvcHRpb25zKTtcbiAgfVxuICBUcmFuc2Zvcm0uY2FsbCh0aGlzLCBvcHRpb25zKTtcbiAgdGhpcy5fd3JpdGVGbiA9IHdyaXRlRm47XG4gIHRoaXMuX2VuZEZuID0gZW5kRm47XG59XG5cbnV0aWwuaW5oZXJpdHMoUGFzc1Rocm91Z2hFeHQsIFRyYW5zZm9ybSk7XG5cbmZ1bmN0aW9uIHBhc3NUcmFuc2Zvcm0oY2h1bmssIGVuY29kaW5nLCBjYikge1xuICAvKmpzaGludCB2YWxpZHRoaXM6dHJ1ZSAqL1xuICB0aGlzLnB1c2goY2h1bmspO1xuICBjYigpO1xufVxuXG5QYXNzVGhyb3VnaEV4dC5wcm90b3R5cGUuX3RyYW5zZm9ybSA9IGZ1bmN0aW9uIF90cmFuc2Zvcm0oY2h1bmssIGVuY29kaW5nLCBjYikge1xuICBpZiAodGhpcy5fd3JpdGVGbikgcmV0dXJuIHRoaXMuX3dyaXRlRm4uYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgcmV0dXJuIHBhc3NUcmFuc2Zvcm0uYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbn07XG5cblBhc3NUaHJvdWdoRXh0LnByb3RvdHlwZS5fZmx1c2ggPSBmdW5jdGlvbiBfZmx1c2goY2IpIHtcbiAgaWYgKHRoaXMuX2VuZEZuKSByZXR1cm4gdGhpcy5fZW5kRm4uYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgcmV0dXJuIGNiKCk7XG59O1xuXG5mdW5jdGlvbiBwYXNzU3RyZWFtKHdyaXRlRm4sIGVuZEZuLCBvcHRpb25zKSB7XG4gIHZhciBzdHJlYW0gPSBuZXcgUGFzc1Rocm91Z2hFeHQod3JpdGVGbiwgZW5kRm4sIG9wdGlvbnMpO1xuICByZXR1cm4gc3RyZWFtO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHBhc3NTdHJlYW07Il19
