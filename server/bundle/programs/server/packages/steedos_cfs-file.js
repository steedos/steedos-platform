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
var MongoInternals = Package.mongo.MongoInternals;
var Mongo = Package.mongo.Mongo;
var HTTP = Package.http.HTTP;
var HTTPInternals = Package.http.HTTPInternals;
var DataMan = Package['steedos:cfs-data-man'].DataMan;
var EventEmitter = Package['raix:eventemitter'].EventEmitter;
var meteorInstall = Package.modules.meteorInstall;
var Promise = Package.promise.Promise;

var require = meteorInstall({"node_modules":{"meteor":{"steedos:cfs-file":{"checkNpm.js":function module(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/steedos_cfs-file/checkNpm.js                                                                              //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
let checkNpmVersions;
module.link("meteor/tmeasday:check-npm-versions", {
  checkNpmVersions(v) {
    checkNpmVersions = v;
  }

}, 0);

// fix warning: xxx not installed
require("temp/package.json");

checkNpmVersions({
  temp: "0.7.0" // for tests only

}, 'steedos:cfs-file');
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"fsFile-common.js":function module(){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/steedos_cfs-file/fsFile-common.js                                                                         //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
/**
 * @method FS.File
 * @namespace FS.File
 * @public
 * @constructor
 * @param {object|FS.File|data to attach} [ref] Another FS.File instance, a filerecord, or some data to pass to attachData
 */
FS.File = function (ref, createdByTransform) {
  var self = this;
  self.createdByTransform = !!createdByTransform;

  if (ref instanceof FS.File || isBasicObject(ref)) {
    // Extend self with filerecord related data
    FS.Utility.extend(self, FS.Utility.cloneFileRecord(ref, {
      full: true
    }));
  } else if (ref) {
    self.attachData(ref);
  }
}; // An FS.File can emit events


FS.File.prototype = new EventEmitter();
/**
 * @method FS.File.prototype.attachData
 * @public
 * @param {File|Blob|Buffer|ArrayBuffer|Uint8Array|String} data The data that you want to attach to the file.
 * @param {Object} [options] Options
 * @param {String} [options.type] The data content (MIME) type, if known.
 * @param {String} [options.headers] When attaching a URL, headers to be used for the GET request (currently server only)
 * @param {String} [options.auth] When attaching a URL, "username:password" to be used for the GET request (currently server only)
 * @param {Function} [callback] Callback function, callback(error). On the client, a callback is required if data is a URL.
 * @returns {FS.File} This FS.File instance.
 *
 */

FS.File.prototype.attachData = function fsFileAttachData(data, options, callback) {
  var self = this;

  if (!callback && typeof options === "function") {
    callback = options;
    options = {};
  }

  options = options || {};

  if (!data) {
    throw new Error('FS.File.attachData requires a data argument with some data');
  }

  var urlOpts; // Set any other properties we can determine from the source data
  // File

  if (typeof File !== "undefined" && data instanceof File) {
    self.name(data.name);
    self.updatedAt(data.lastModifiedDate);
    self.size(data.size);
    setData(data.type);
  } // Blob
  else if (typeof Blob !== "undefined" && data instanceof Blob) {
      self.name(data.name);
      self.updatedAt(new Date());
      self.size(data.size);
      setData(data.type);
    } // URL: we need to do a HEAD request to get the type because type
    // is required for filtering to work.
    else if (typeof data === "string" && (data.slice(0, 5) === "http:" || data.slice(0, 6) === "https:")) {
        urlOpts = FS.Utility.extend({}, options);

        if (urlOpts.type) {
          delete urlOpts.type;
        }

        if (!callback) {
          if (Meteor.isClient) {
            throw new Error('FS.File.attachData requires a callback when attaching a URL on the client');
          }

          var result = Meteor.call('_cfs_getUrlInfo', data, urlOpts);
          FS.Utility.extend(self, {
            original: result
          });
          setData(result.type);
        } else {
          Meteor.call('_cfs_getUrlInfo', data, urlOpts, function (error, result) {
            FS.debug && console.log("URL HEAD RESULT:", result);

            if (error) {
              callback(error);
            } else {
              var type = result.type || options.type;

              if (!type) {
                throw new Error('FS.File.attachData got a URL for which it could not determine the MIME type and none was provided using options.type');
              }

              FS.Utility.extend(self, {
                original: result
              });
              setData(type);
            }
          });
        }
      } // Everything else
      else {
          setData(options.type);
        } // Set the data


  function setData(type) {
    self.data = new DataMan(data, type, urlOpts); // Update the type to match what the data is

    self.type(self.data.type()); // Update the size to match what the data is.
    // It's always safe to call self.data.size() without supplying a callback
    // because it requires a callback only for URLs on the client, and we
    // already added size for URLs when we got the result from '_cfs_getUrlInfo' method.

    if (!self.size()) {
      if (callback) {
        self.data.size(function (error, size) {
          if (error) {
            callback && callback(error);
          } else {
            self.size(size);
            setName();
          }
        });
      } else {
        self.size(self.data.size());
        setName();
      }
    } else {
      setName();
    }
  }

  function setName() {
    // See if we can extract a file name from URL or filepath
    if (!self.name() && typeof data === "string") {
      // name from URL
      if (data.slice(0, 5) === "http:" || data.slice(0, 6) === "https:") {
        if (FS.Utility.getFileExtension(data).length) {
          // for a URL we assume the end is a filename only if it has an extension
          self.name(FS.Utility.getFileName(data));
        }
      } // name from filepath
      else if (data.slice(0, 5) !== "data:") {
          self.name(FS.Utility.getFileName(data));
        }
    }

    callback && callback();
  }

  return self; //allow chaining
};
/**
 * @method FS.File.prototype.uploadProgress
 * @public
 * @returns {number} The server confirmed upload progress
 */


FS.File.prototype.uploadProgress = function () {
  var self = this; // Make sure our file record is updated

  self.getFileRecord(); // If fully uploaded, return 100

  if (self.uploadedAt) {
    return 100;
  } // Otherwise return the confirmed progress or 0
  else {
      return Math.round((self.chunkCount || 0) / (self.chunkSum || 1) * 100);
    }
};
/**
 * @method FS.File.prototype.controlledByDeps
 * @public
 * @returns {FS.Collection} Returns true if this FS.File is reactive
 *
 * > Note: Returns true if this FS.File object was created by a FS.Collection
 * > and we are in a reactive computations. What does this mean? Well it should
 * > mean that our fileRecord is fully updated by Meteor and we are mounted on
 * > a collection
 */


FS.File.prototype.controlledByDeps = function () {
  var self = this;
  return self.createdByTransform && Deps.active;
};
/**
 * @method FS.File.prototype.getCollection
 * @public
 * @returns {FS.Collection} Returns attached collection or undefined if not mounted
 */


FS.File.prototype.getCollection = function () {
  // Get the collection reference
  var self = this; // If we already made the link then do no more

  if (self.collection) {
    return self.collection;
  } // If we don't have a collectionName then there's not much to do, the file is
  // not mounted yet


  if (!self.collectionName) {
    // Should not throw an error here - could be common that the file is not
    // yet mounted into a collection
    return;
  } // Link the collection to the file


  self.collection = FS._collections[self.collectionName];
  return self.collection; //possibly undefined, but that's desired behavior
};
/**
 * @method FS.File.prototype.isMounted
 * @public
 * @returns {FS.Collection} Returns attached collection or undefined if not mounted
 */


FS.File.prototype.isMounted = FS.File.prototype.getCollection;
/**
 * @method FS.File.prototype.getFileRecord Returns the fileRecord
 * @public
 * @returns {object} The filerecord
 */

FS.File.prototype.getFileRecord = function () {
  var self = this; // Check if this file object fileRecord is kept updated by Meteor, if so
  // return self

  if (self.controlledByDeps()) {
    return self;
  } // Go for manually updating the file record


  if (self.isMounted()) {
    FS.debug && console.log('GET FILERECORD: ' + self._id); // Return the fileRecord or an empty object

    var fileRecord = self.collection.files.findOne({
      _id: self._id
    }) || {};
    FS.Utility.extend(self, fileRecord);
    return fileRecord;
  } else {
    // We return an empty object, this way users can still do `getRecord().size`
    // Without getting an error
    return {};
  }
};
/**
 * @method FS.File.prototype.update
 * @public
 * @param {modifier} modifier
 * @param {object} [options]
 * @param {function} [callback]
 *
 * Updates the fileRecord.
 */


FS.File.prototype.update = function (modifier, options, callback) {
  var self = this;
  FS.debug && console.log('UPDATE: ' + JSON.stringify(modifier)); // Make sure we have options and callback

  if (!callback && typeof options === 'function') {
    callback = options;
    options = {};
  }

  callback = callback || FS.Utility.defaultCallback;

  if (!self.isMounted()) {
    callback(new Error("Cannot update a file that is not associated with a collection"));
    return;
  } // Call collection update - File record


  return self.collection.files.update({
    _id: self._id
  }, modifier, options, function (err, count) {
    // Update the fileRecord if it was changed and on the client
    // The server-side methods will pull the fileRecord if needed
    if (count > 0 && Meteor.isClient) self.getFileRecord(); // Call callback

    callback(err, count);
  });
};
/**
 * @method FS.File.prototype._saveChanges
 * @private
 * @param {String} [what] "_original" to save original info, or a store name to save info for that store, or saves everything
 *
 * Updates the fileRecord from values currently set on the FS.File instance.
 */


FS.File.prototype._saveChanges = function (what) {
  var self = this;

  if (!self.isMounted()) {
    return;
  }

  FS.debug && console.log("FS.File._saveChanges:", what || "all");
  var mod = {
    $set: {}
  };

  if (what === "_original") {
    mod.$set.original = self.original;
  } else if (typeof what === "string") {
    var info = self.copies[what];

    if (info) {
      mod.$set["copies." + what] = info;
    }
  } else {
    mod.$set.original = self.original;
    mod.$set.copies = self.copies;
  }

  self.update(mod);
};
/**
 * @method FS.File.prototype.remove
 * @public
 * @param {Function} [callback]
 * @returns {number} Count
 *
 * Remove the current file from its FS.Collection
 */


FS.File.prototype.remove = function (callback) {
  var self = this;
  FS.debug && console.log('REMOVE: ' + self._id);
  callback = callback || FS.Utility.defaultCallback;

  if (!self.isMounted()) {
    callback(new Error("Cannot remove a file that is not associated with a collection"));
    return;
  }

  return self.collection.files.remove({
    _id: self._id
  }, function (err, res) {
    if (!err) {
      delete self._id;
      delete self.collection;
      delete self.collectionName;
    }

    callback(err, res);
  });
};
/**
 * @method FS.File.prototype.moveTo
 * @param {FS.Collection} targetCollection
 * @private // Marked private until implemented
 * @todo Needs to be implemented
 *
 * Move the file from current collection to another collection
 *
 * > Note: Not yet implemented
 */

/**
 * @method FS.File.prototype.getExtension Returns the lowercase file extension
 * @public
 * @deprecated Use the `extension` getter/setter method instead.
 * @param {Object} [options]
 * @param {String} [options.store] - Store name. Default is the original extension.
 * @returns {string} The extension eg.: `jpg` or if not found then an empty string ''
 */


FS.File.prototype.getExtension = function (options) {
  var self = this;
  return self.extension(options);
};

function checkContentType(fsFile, storeName, startOfType) {
  var type;

  if (storeName && fsFile.hasStored(storeName)) {
    type = fsFile.type({
      store: storeName
    });
  } else {
    type = fsFile.type();
  }

  if (typeof type === "string") {
    return type.indexOf(startOfType) === 0;
  }

  return false;
}
/**
 * @method FS.File.prototype.isImage Is it an image file?
 * @public
 * @param {object} [options]
 * @param {string} [options.store] The store we're interested in
 *
 * Returns true if the copy of this file in the specified store has an image
 * content type. If the file object is unmounted or doesn't have a copy for
 * the specified store, or if you don't specify a store, this method checks
 * the content type of the original file.
 */


FS.File.prototype.isImage = function (options) {
  return checkContentType(this, (options || {}).store, 'image/');
};
/**
 * @method FS.File.prototype.isVideo Is it a video file?
 * @public
 * @param {object} [options]
 * @param {string} [options.store] The store we're interested in
 *
 * Returns true if the copy of this file in the specified store has a video
 * content type. If the file object is unmounted or doesn't have a copy for
 * the specified store, or if you don't specify a store, this method checks
 * the content type of the original file.
 */


FS.File.prototype.isVideo = function (options) {
  return checkContentType(this, (options || {}).store, 'video/');
};
/**
 * @method FS.File.prototype.isAudio Is it an audio file?
 * @public
 * @param {object} [options]
 * @param {string} [options.store] The store we're interested in
 *
 * Returns true if the copy of this file in the specified store has an audio
 * content type. If the file object is unmounted or doesn't have a copy for
 * the specified store, or if you don't specify a store, this method checks
 * the content type of the original file.
 */


FS.File.prototype.isAudio = function (options) {
  return checkContentType(this, (options || {}).store, 'audio/');
};
/**
 * @method FS.File.prototype.formattedSize
 * @public
 * @param  {Object} options
 * @param  {String} [options.store=none,display original file size] Which file do you want to get the size of?
 * @param  {String} [options.formatString='0.00 b'] The `numeral` format string to use.
 * @return {String} The file size formatted as a human readable string and reactively updated.
 *
 * * You must add the `numeral` package to your app before you can use this method.
 * * If info is not found or a size can't be determined, it will show 0.
 */


FS.File.prototype.formattedSize = function fsFileFormattedSize(options) {
  var self = this;
  if (typeof numeral !== "function") throw new Error("You must add the numeral package if you call FS.File.formattedSize");
  options = options || {};
  options = options.hash || options;
  var size = self.size(options) || 0;
  return numeral(size).format(options.formatString || '0.00 b');
};
/**
 * @method FS.File.prototype.isUploaded Is this file completely uploaded?
 * @public
 * @returns {boolean} True if the number of uploaded bytes is equal to the file size.
 */


FS.File.prototype.isUploaded = function () {
  var self = this; // Make sure we use the updated file record

  self.getFileRecord();
  return !!self.uploadedAt;
};
/**
 * @method FS.File.prototype.hasStored
 * @public
 * @param {string} storeName Name of the store
 * @param {boolean} [optimistic=false] In case that the file record is not found, read below
 * @returns {boolean} Is a version of this file stored in the given store?
 *
 * > Note: If the file is not published to the client or simply not found:
 * this method cannot know for sure if it exists or not. The `optimistic`
 * param is the boolean value to return. Are we `optimistic` that the copy
 * could exist. This is the case in `FS.File.url` we are optimistic that the
 * copy supplied by the user exists.
 */


FS.File.prototype.hasStored = function (storeName, optimistic) {
  var self = this; // Make sure we use the updated file record

  self.getFileRecord(); // If we havent the published data then

  if (FS.Utility.isEmpty(self.copies)) {
    return !!optimistic;
  }

  if (typeof storeName === "string") {
    // Return true only if the `key` property is present, which is not set until
    // storage is complete.
    return !!(self.copies && self.copies[storeName] && self.copies[storeName].key);
  }

  return false;
}; // Backwards compatibility


FS.File.prototype.hasCopy = FS.File.prototype.hasStored;
/**
 * @method FS.File.prototype.getCopyInfo
 * @public
 * @deprecated Use individual methods with `store` option instead.
 * @param {string} storeName Name of the store for which to get copy info.
 * @returns {Object} The file details, e.g., name, size, key, etc., specific to the copy saved in this store.
 */

FS.File.prototype.getCopyInfo = function (storeName) {
  var self = this; // Make sure we use the updated file record

  self.getFileRecord();
  return self.copies && self.copies[storeName] || null;
};
/**
 * @method FS.File.prototype._getInfo
 * @private
 * @param {String} [storeName] Name of the store for which to get file info. Omit for original file details.
 * @param {Object} [options]
 * @param {Boolean} [options.updateFileRecordFirst=false] Update this instance with data from the DB first?
 * @returns {Object} The file details, e.g., name, size, key, etc. If not found, returns an empty object.
 */


FS.File.prototype._getInfo = function (storeName, options) {
  var self = this;
  options = options || {};

  if (options.updateFileRecordFirst) {
    // Make sure we use the updated file record
    self.getFileRecord();
  }

  if (storeName) {
    return self.copies && self.copies[storeName] || {};
  } else {
    return self.original || {};
  }
};
/**
 * @method FS.File.prototype._setInfo
 * @private
 * @param {String} storeName - Name of the store for which to set file info. Non-string will set original file details.
 * @param {String} property - Property to set
 * @param {String} value - New value for property
 * @param {Boolean} save - Should the new value be saved to the DB, too, or just set in the FS.File properties?
 * @returns {undefined}
 */


FS.File.prototype._setInfo = function (storeName, property, value, save) {
  var self = this;

  if (typeof storeName === "string") {
    self.copies = self.copies || {};
    self.copies[storeName] = self.copies[storeName] || {};
    self.copies[storeName][property] = value;
    save && self._saveChanges(storeName);
  } else {
    self.original = self.original || {};
    self.original[property] = value;
    save && self._saveChanges("_original");
  }
};
/**
 * @method FS.File.prototype.name
 * @public
 * @param {String|null} [value] - If setting the name, specify the new name as the first argument. Otherwise the options argument should be first.
 * @param {Object} [options]
 * @param {Object} [options.store=none,original] - Get or set the name of the version of the file that was saved in this store. Default is the original file name.
 * @param {Boolean} [options.updateFileRecordFirst=false] Update this instance with data from the DB first? Applies to getter usage only.
 * @param {Boolean} [options.save=true] Save change to database? Applies to setter usage only.
 * @returns {String|undefined} If setting, returns `undefined`. If getting, returns the file name.
 */


FS.File.prototype.name = function (value, options) {
  var self = this;

  if (!options && (typeof value === "object" && value !== null || typeof value === "undefined")) {
    // GET
    options = value || {};
    options = options.hash || options; // allow use as UI helper

    return self._getInfo(options.store, options).name;
  } else {
    // SET
    options = options || {};
    return self._setInfo(options.store, 'name', value, typeof options.save === "boolean" ? options.save : true);
  }
};
/**
 * @method FS.File.prototype.extension
 * @public
 * @param {String|null} [value] - If setting the extension, specify the new extension (without period) as the first argument. Otherwise the options argument should be first.
 * @param {Object} [options]
 * @param {Object} [options.store=none,original] - Get or set the extension of the version of the file that was saved in this store. Default is the original file extension.
 * @param {Boolean} [options.updateFileRecordFirst=false] Update this instance with data from the DB first? Applies to getter usage only.
 * @param {Boolean} [options.save=true] Save change to database? Applies to setter usage only.
 * @returns {String|undefined} If setting, returns `undefined`. If getting, returns the file extension or an empty string if there isn't one.
 */


FS.File.prototype.extension = function (value, options) {
  var self = this;

  if (!options && (typeof value === "object" && value !== null || typeof value === "undefined")) {
    // GET
    options = value || {};
    return FS.Utility.getFileExtension(self.name(options) || '');
  } else {
    // SET
    options = options || {};
    var newName = FS.Utility.setFileExtension(self.name(options) || '', value);
    return self._setInfo(options.store, 'name', newName, typeof options.save === "boolean" ? options.save : true);
  }
};
/**
 * @method FS.File.prototype.size
 * @public
 * @param {Number} [value] - If setting the size, specify the new size in bytes as the first argument. Otherwise the options argument should be first.
 * @param {Object} [options]
 * @param {Object} [options.store=none,original] - Get or set the size of the version of the file that was saved in this store. Default is the original file size.
 * @param {Boolean} [options.updateFileRecordFirst=false] Update this instance with data from the DB first? Applies to getter usage only.
 * @param {Boolean} [options.save=true] Save change to database? Applies to setter usage only.
 * @returns {Number|undefined} If setting, returns `undefined`. If getting, returns the file size.
 */


FS.File.prototype.size = function (value, options) {
  var self = this;

  if (!options && (typeof value === "object" && value !== null || typeof value === "undefined")) {
    // GET
    options = value || {};
    options = options.hash || options; // allow use as UI helper

    return self._getInfo(options.store, options).size;
  } else {
    // SET
    options = options || {};
    return self._setInfo(options.store, 'size', value, typeof options.save === "boolean" ? options.save : true);
  }
};
/**
 * @method FS.File.prototype.type
 * @public
 * @param {String} [value] - If setting the type, specify the new type as the first argument. Otherwise the options argument should be first.
 * @param {Object} [options]
 * @param {Object} [options.store=none,original] - Get or set the type of the version of the file that was saved in this store. Default is the original file type.
 * @param {Boolean} [options.updateFileRecordFirst=false] Update this instance with data from the DB first? Applies to getter usage only.
 * @param {Boolean} [options.save=true] Save change to database? Applies to setter usage only.
 * @returns {String|undefined} If setting, returns `undefined`. If getting, returns the file type.
 */


FS.File.prototype.type = function (value, options) {
  var self = this;

  if (!options && (typeof value === "object" && value !== null || typeof value === "undefined")) {
    // GET
    options = value || {};
    options = options.hash || options; // allow use as UI helper

    return self._getInfo(options.store, options).type;
  } else {
    // SET
    options = options || {};
    return self._setInfo(options.store, 'type', value, typeof options.save === "boolean" ? options.save : true);
  }
};
/**
 * @method FS.File.prototype.updatedAt
 * @public
 * @param {String} [value] - If setting updatedAt, specify the new date as the first argument. Otherwise the options argument should be first.
 * @param {Object} [options]
 * @param {Object} [options.store=none,original] - Get or set the last updated date for the version of the file that was saved in this store. Default is the original last updated date.
 * @param {Boolean} [options.updateFileRecordFirst=false] Update this instance with data from the DB first? Applies to getter usage only.
 * @param {Boolean} [options.save=true] Save change to database? Applies to setter usage only.
 * @returns {String|undefined} If setting, returns `undefined`. If getting, returns the file's last updated date.
 */


FS.File.prototype.updatedAt = function (value, options) {
  var self = this;

  if (!options && (typeof value === "object" && value !== null && !(value instanceof Date) || typeof value === "undefined")) {
    // GET
    options = value || {};
    options = options.hash || options; // allow use as UI helper

    return self._getInfo(options.store, options).updatedAt;
  } else {
    // SET
    options = options || {};
    return self._setInfo(options.store, 'updatedAt', value, typeof options.save === "boolean" ? options.save : true);
  }
};
/**
 * @method FS.File.onStoredCallback
 * @summary Calls callback when the file is fully stored to the specify storeName
 * @public
 * @param {String} [storeName] - The name of the file store we want to get called when stored.
 * @param {function} [callback]
 */


FS.File.prototype.onStoredCallback = function (storeName, callback) {
  // Check file is not already stored
  if (this.hasStored(storeName)) {
    callback();
    return;
  }

  if (Meteor.isServer) {
    // Listen to file stored events
    // TODO Require thinking whether it is better to use observer for case of using multiple application instances, Ask for same image url while upload is being done.
    this.on('stored', function (newStoreName) {
      // If stored is completed to the specified store call callback
      if (storeName === newStoreName) {
        // Remove the specified file stored listener
        this.removeListener('stored', arguments.callee);
        callback();
      }
    }.bind(this));
  } else {
    var fileId = this._id,
        collectionName = this.collectionName; // Wait for file to be fully uploaded

    Tracker.autorun(function (c) {
      Meteor.call('_cfs_returnWhenStored', collectionName, fileId, storeName, function (error, result) {
        if (result && result === true) {
          c.stop();
          callback();
        } else {
          Meteor.setTimeout(function () {
            c.invalidate();
          }, 100);
        }
      });
    });
  }
};
/**
 * @method FS.File.onStored
 * @summary Function that returns when the file is fully stored to the specify storeName
 * @public
 * @param {String} storeName - The name of the file store we want to get called when stored.
 *
 * Function that returns when the file is fully stored to the specify storeName.
 *
 * For example needed if wanted to save the direct link to a file on s3 when fully uploaded.
 */


FS.File.prototype.onStored = function (arguments) {
  var onStoredSync = Meteor.wrapAsync(this.onStoredCallback);
  return onStoredSync.call(this, arguments);
};

function isBasicObject(obj) {
  return obj === Object(obj) && Object.getPrototypeOf(obj) === Object.prototype;
} // getPrototypeOf polyfill


if (typeof Object.getPrototypeOf !== "function") {
  if (typeof "".__proto__ === "object") {
    Object.getPrototypeOf = function (object) {
      return object.__proto__;
    };
  } else {
    Object.getPrototypeOf = function (object) {
      // May break if the constructor has been tampered with
      return object.constructor.prototype;
    };
  }
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"fsFile-server.js":function module(){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/steedos_cfs-file/fsFile-server.js                                                                         //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
/**
 * Notes a details about a storage adapter failure within the file record
 * @param {string} storeName
 * @param {number} maxTries
 * @return {undefined}
 * @todo deprecate this
 */
FS.File.prototype.logCopyFailure = function (storeName, maxTries) {
  var self = this; // hasStored will update from the fileRecord

  if (self.hasStored(storeName)) {
    throw new Error("logCopyFailure: invalid storeName");
  } // Make sure we have a temporary file saved since we will be
  // trying the save again.


  FS.TempStore.ensureForFile(self);
  var now = new Date();
  var currentCount = self.failures && self.failures.copies && self.failures.copies[storeName] && typeof self.failures.copies[storeName].count === "number" ? self.failures.copies[storeName].count : 0;
  maxTries = maxTries || 5;
  var modifier = {};
  modifier.$set = {};
  modifier.$set['failures.copies.' + storeName + '.lastAttempt'] = now;

  if (currentCount === 0) {
    modifier.$set['failures.copies.' + storeName + '.firstAttempt'] = now;
  }

  modifier.$set['failures.copies.' + storeName + '.count'] = currentCount + 1;
  modifier.$set['failures.copies.' + storeName + '.doneTrying'] = currentCount + 1 >= maxTries;
  self.update(modifier);
};
/**
 * Has this store permanently failed?
 * @param {String} storeName The name of the store
 * @return {boolean} Has this store failed permanently?
 * @todo deprecate this
 */


FS.File.prototype.failedPermanently = function (storeName) {
  var self = this;
  return !!(self.failures && self.failures.copies && self.failures.copies[storeName] && self.failures.copies[storeName].doneTrying);
};
/**
 * @method FS.File.prototype.createReadStream
 * @public
 * @param {String} [storeName]
 * @returns {stream.Readable} Readable NodeJS stream
 *
 * Returns a readable stream. Where the stream reads from depends on the FS.File instance and whether you pass a store name.
 *
 * * If you pass a `storeName`, a readable stream for the file data saved in that store is returned.
 * * If you don't pass a `storeName` and data is attached to the FS.File instance (on `data` property, which must be a DataMan instance), then a readable stream for the attached data is returned.
 * * If you don't pass a `storeName` and there is no data attached to the FS.File instance, a readable stream for the file data currently in the temporary store (`FS.TempStore`) is returned.
 *
 */


FS.File.prototype.createReadStream = function (storeName) {
  var self = this; // If we dont have a store name but got Buffer data?

  if (!storeName && self.data) {
    FS.debug && console.log("fileObj.createReadStream creating read stream for attached data"); // Stream from attached data if present

    return self.data.createReadStream();
  } else if (!storeName && FS.TempStore && FS.TempStore.exists(self)) {
    FS.debug && console.log("fileObj.createReadStream creating read stream for temp store"); // Stream from temp store - its a bit slower than regular streams?

    return FS.TempStore.createReadStream(self);
  } else {
    // Stream from the store using storage adapter
    if (self.isMounted()) {
      var storage = self.collection.storesLookup[storeName] || self.collection.primaryStore;
      FS.debug && console.log("fileObj.createReadStream creating read stream for store", storage.name); // return stream

      return storage.adapter.createReadStream(self);
    } else {
      throw new Meteor.Error('File not mounted');
    }
  }
};
/**
 * @method FS.File.prototype.createWriteStream
 * @public
 * @param {String} [storeName]
 * @returns {stream.Writeable} Writeable NodeJS stream
 *
 * Returns a writeable stream. Where the stream writes to depends on whether you pass in a store name.
 *
 * * If you pass a `storeName`, a writeable stream for (over)writing the file data in that store is returned.
 * * If you don't pass a `storeName`, a writeable stream for writing to the temp store for this file is returned.
 *
 */


FS.File.prototype.createWriteStream = function (storeName) {
  var self = this; // We have to have a mounted file in order for this to work

  if (self.isMounted()) {
    if (!storeName && FS.TempStore && FS.FileWorker) {
      // If we have worker installed - we pass the file to FS.TempStore
      // We dont need the storeName since all stores will be generated from
      // TempStore.
      // This should trigger FS.FileWorker at some point?
      FS.TempStore.createWriteStream(self);
    } else {
      // Stream directly to the store using storage adapter
      var storage = self.collection.storesLookup[storeName] || self.collection.primaryStore;
      return storage.adapter.createWriteStream(self);
    }
  } else {
    throw new Meteor.Error('File not mounted');
  }
};
/**
 * @method FS.File.prototype.copy Makes a copy of the file and underlying data in all stores.
 * @public
 * @returns {FS.File} The new FS.File instance
 */


FS.File.prototype.copy = function () {
  var self = this;

  if (!self.isMounted()) {
    throw new Error("Cannot copy a file that is not associated with a collection");
  } // Get the file record


  var fileRecord = self.collection.files.findOne({
    _id: self._id
  }, {
    transform: null
  }) || {}; // Remove _id and copy keys from the file record

  delete fileRecord._id; // Insert directly; we don't have access to "original" in this case

  var newId = self.collection.files.insert(fileRecord);
  var newFile = self.collection.findOne(newId); // Copy underlying files in the stores

  var mod, oldKey;

  for (var name in newFile.copies) {
    if (newFile.copies.hasOwnProperty(name)) {
      oldKey = newFile.copies[name].key;

      if (oldKey) {
        // We need to ask the adapter for the true oldKey because
        // right now gridfs does some extra stuff.
        // TODO GridFS should probably set the full key object
        // (with _id and filename) into `copies.key`
        // so that copies.key can be passed directly to
        // createReadStreamForFileKey
        var sourceFileStorage = self.collection.storesLookup[name];

        if (!sourceFileStorage) {
          throw new Error(name + " is not a valid store name");
        }

        oldKey = sourceFileStorage.adapter.fileKey(self); // delete so that new fileKey will be generated in copyStoreData

        delete newFile.copies[name].key;
        mod = mod || {};
        mod["copies." + name + ".key"] = copyStoreData(newFile, name, oldKey);
      }
    }
  } // Update keys in the filerecord


  if (mod) {
    newFile.update({
      $set: mod
    });
  }

  return newFile;
};

Meteor.methods({
  // Does a HEAD request to URL to get the type, updatedAt,
  // and size prior to actually downloading the data.
  // That way we can do filter checks without actually downloading.
  '_cfs_getUrlInfo': function (url, options) {
    check(url, String);
    check(options, Object);
    this.unblock();
    var response = HTTP.call("HEAD", url, options);
    var headers = response.headers;
    var result = {};

    if (headers['content-type']) {
      result.type = headers['content-type'];
    }

    if (headers['content-length']) {
      result.size = +headers['content-length'];
    }

    if (headers['last-modified']) {
      result.updatedAt = new Date(headers['last-modified']);
    }

    return result;
  },
  // Helper function that checks whether given fileId from collectionName
  //  Is fully uploaded to specify storeName.
  '_cfs_returnWhenStored': function (collectionName, fileId, storeName) {
    check(collectionName, String);
    check(fileId, String);
    check(storeName, String);
    var collection = FS._collections[collectionName];

    if (!collection) {
      return Meteor.Error('_cfs_returnWhenStored: FSCollection name not exists');
    }

    var file = collection.findOne({
      _id: fileId
    });

    if (!file) {
      return Meteor.Error('_cfs_returnWhenStored: FSFile not exists');
    }

    return file.hasStored(storeName);
  }
}); // TODO maybe this should be in cfs-storage-adapter

function _copyStoreData(fileObj, storeName, sourceKey, callback) {
  if (!fileObj.isMounted()) {
    throw new Error("Cannot copy store data for a file that is not associated with a collection");
  }

  var storage = fileObj.collection.storesLookup[storeName];

  if (!storage) {
    throw new Error(storeName + " is not a valid store name");
  } // We want to prevent beforeWrite and transformWrite from running, so
  // we interact directly with the store.


  var destinationKey = storage.adapter.fileKey(fileObj);
  var readStream = storage.adapter.createReadStreamForFileKey(sourceKey);
  var writeStream = storage.adapter.createWriteStreamForFileKey(destinationKey);
  writeStream.once('stored', function (result) {
    callback(null, result.fileKey);
  });
  writeStream.once('error', function (error) {
    callback(error);
  });
  readStream.pipe(writeStream);
}

var copyStoreData = Meteor.wrapAsync(_copyStoreData);
/**
 * @method FS.File.prototype.copyData Copies the content of a store directly into another store.
 * @public
 * @param {string} sourceStoreName
 * @param {string} targetStoreName
 * @param {boolean=} move
 */

FS.File.prototype.copyData = function (sourceStoreName, targetStoreName, move) {
  move = !!move;
  /**
   * @type {Object.<string,*>}
   */

  var sourceStoreValues = this.copies[sourceStoreName];
  /**
   * @type {string}
   */

  var copyKey = cloneDataToStore(this, sourceStoreName, targetStoreName, move);
  /**
   * @type {Object.<string,*>}
   */

  var targetStoreValues = {};

  for (var v in sourceStoreValues) {
    if (sourceStoreValues.hasOwnProperty(v)) {
      targetStoreValues[v] = sourceStoreValues[v];
    }
  }

  targetStoreValues.key = copyKey;
  targetStoreValues.createdAt = new Date();
  targetStoreValues.updatedAt = new Date();
  /**
   *
   * @type {modifier}
   */

  var modifier = {};
  modifier.$set = {};
  modifier.$set["copies." + targetStoreName] = targetStoreValues;

  if (move) {
    modifier.$unset = {};
    modifier.$unset["copies." + sourceStoreName] = "";
  }

  this.update(modifier);
};
/**
 * @method FS.File.prototype.moveData Moves the content of a store directly into another store.
 * @public
 * @param {string} sourceStoreName
 * @param {string} targetStoreName
 */


FS.File.prototype.moveData = function (sourceStoreName, targetStoreName) {
  this.copyData(sourceStoreName, targetStoreName, true);
}; // TODO maybe this should be in cfs-storage-adapter

/**
 *
 * @param {FS.File} fileObj
 * @param {string} sourceStoreName
 * @param {string} targetStoreName
 * @param {boolean} move
 * @param callback
 * @private
 */


function _copyDataFromStoreToStore(fileObj, sourceStoreName, targetStoreName, move, callback) {
  if (!fileObj.isMounted()) {
    throw new Error("Cannot copy store data for a file that is not associated with a collection");
  }
  /**
   * @type {FS.StorageAdapter}
   */


  var sourceStorage = fileObj.collection.storesLookup[sourceStoreName];
  /**
   * @type {FS.StorageAdapter}
   */

  var targetStorage = fileObj.collection.storesLookup[targetStoreName];

  if (!sourceStorage) {
    throw new Error(sourceStoreName + " is not a valid store name");
  }

  if (!targetStorage) {
    throw new Error(targetStorage + " is not a valid store name");
  } // We want to prevent beforeWrite and transformWrite from running, so
  // we interact directly with the store.


  var sourceKey = sourceStorage.adapter.fileKey(fileObj);
  var targetKey = targetStorage.adapter.fileKey(fileObj);
  var readStream = sourceStorage.adapter.createReadStreamForFileKey(sourceKey);
  var writeStream = targetStorage.adapter.createWriteStreamForFileKey(targetKey);
  writeStream.safeOnce('stored', function (result) {
    if (move && sourceStorage.adapter.remove(fileObj) === false) {
      callback("Copied to store:" + targetStoreName + " with fileKey: " + result.fileKey + ", but could not delete from source store: " + sourceStoreName);
    } else {
      callback(null, result.fileKey);
    }
  });
  writeStream.once('error', function (error) {
    callback(error);
  });
  readStream.pipe(writeStream);
}

var cloneDataToStore = Meteor.wrapAsync(_copyDataFromStoreToStore);
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}}}}},{
  "extensions": [
    ".js",
    ".json"
  ]
});

require("/node_modules/meteor/steedos:cfs-file/checkNpm.js");
require("/node_modules/meteor/steedos:cfs-file/fsFile-common.js");
require("/node_modules/meteor/steedos:cfs-file/fsFile-server.js");

/* Exports */
Package._define("steedos:cfs-file");

})();

//# sourceURL=meteor://💻app/packages/steedos_cfs-file.js
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvczpjZnMtZmlsZS9jaGVja05wbS5qcyIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvczpjZnMtZmlsZS9mc0ZpbGUtY29tbW9uLmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zOmNmcy1maWxlL2ZzRmlsZS1zZXJ2ZXIuanMiXSwibmFtZXMiOlsiY2hlY2tOcG1WZXJzaW9ucyIsIm1vZHVsZSIsImxpbmsiLCJ2IiwicmVxdWlyZSIsInRlbXAiLCJGUyIsIkZpbGUiLCJyZWYiLCJjcmVhdGVkQnlUcmFuc2Zvcm0iLCJzZWxmIiwiaXNCYXNpY09iamVjdCIsIlV0aWxpdHkiLCJleHRlbmQiLCJjbG9uZUZpbGVSZWNvcmQiLCJmdWxsIiwiYXR0YWNoRGF0YSIsInByb3RvdHlwZSIsIkV2ZW50RW1pdHRlciIsImZzRmlsZUF0dGFjaERhdGEiLCJkYXRhIiwib3B0aW9ucyIsImNhbGxiYWNrIiwiRXJyb3IiLCJ1cmxPcHRzIiwibmFtZSIsInVwZGF0ZWRBdCIsImxhc3RNb2RpZmllZERhdGUiLCJzaXplIiwic2V0RGF0YSIsInR5cGUiLCJCbG9iIiwiRGF0ZSIsInNsaWNlIiwiTWV0ZW9yIiwiaXNDbGllbnQiLCJyZXN1bHQiLCJjYWxsIiwib3JpZ2luYWwiLCJlcnJvciIsImRlYnVnIiwiY29uc29sZSIsImxvZyIsIkRhdGFNYW4iLCJzZXROYW1lIiwiZ2V0RmlsZUV4dGVuc2lvbiIsImxlbmd0aCIsImdldEZpbGVOYW1lIiwidXBsb2FkUHJvZ3Jlc3MiLCJnZXRGaWxlUmVjb3JkIiwidXBsb2FkZWRBdCIsIk1hdGgiLCJyb3VuZCIsImNodW5rQ291bnQiLCJjaHVua1N1bSIsImNvbnRyb2xsZWRCeURlcHMiLCJEZXBzIiwiYWN0aXZlIiwiZ2V0Q29sbGVjdGlvbiIsImNvbGxlY3Rpb24iLCJjb2xsZWN0aW9uTmFtZSIsIl9jb2xsZWN0aW9ucyIsImlzTW91bnRlZCIsIl9pZCIsImZpbGVSZWNvcmQiLCJmaWxlcyIsImZpbmRPbmUiLCJ1cGRhdGUiLCJtb2RpZmllciIsIkpTT04iLCJzdHJpbmdpZnkiLCJkZWZhdWx0Q2FsbGJhY2siLCJlcnIiLCJjb3VudCIsIl9zYXZlQ2hhbmdlcyIsIndoYXQiLCJtb2QiLCIkc2V0IiwiaW5mbyIsImNvcGllcyIsInJlbW92ZSIsInJlcyIsImdldEV4dGVuc2lvbiIsImV4dGVuc2lvbiIsImNoZWNrQ29udGVudFR5cGUiLCJmc0ZpbGUiLCJzdG9yZU5hbWUiLCJzdGFydE9mVHlwZSIsImhhc1N0b3JlZCIsInN0b3JlIiwiaW5kZXhPZiIsImlzSW1hZ2UiLCJpc1ZpZGVvIiwiaXNBdWRpbyIsImZvcm1hdHRlZFNpemUiLCJmc0ZpbGVGb3JtYXR0ZWRTaXplIiwibnVtZXJhbCIsImhhc2giLCJmb3JtYXQiLCJmb3JtYXRTdHJpbmciLCJpc1VwbG9hZGVkIiwib3B0aW1pc3RpYyIsImlzRW1wdHkiLCJrZXkiLCJoYXNDb3B5IiwiZ2V0Q29weUluZm8iLCJfZ2V0SW5mbyIsInVwZGF0ZUZpbGVSZWNvcmRGaXJzdCIsIl9zZXRJbmZvIiwicHJvcGVydHkiLCJ2YWx1ZSIsInNhdmUiLCJuZXdOYW1lIiwic2V0RmlsZUV4dGVuc2lvbiIsIm9uU3RvcmVkQ2FsbGJhY2siLCJpc1NlcnZlciIsIm9uIiwibmV3U3RvcmVOYW1lIiwicmVtb3ZlTGlzdGVuZXIiLCJhcmd1bWVudHMiLCJjYWxsZWUiLCJiaW5kIiwiZmlsZUlkIiwiVHJhY2tlciIsImF1dG9ydW4iLCJjIiwic3RvcCIsInNldFRpbWVvdXQiLCJpbnZhbGlkYXRlIiwib25TdG9yZWQiLCJvblN0b3JlZFN5bmMiLCJ3cmFwQXN5bmMiLCJvYmoiLCJPYmplY3QiLCJnZXRQcm90b3R5cGVPZiIsIl9fcHJvdG9fXyIsIm9iamVjdCIsImNvbnN0cnVjdG9yIiwibG9nQ29weUZhaWx1cmUiLCJtYXhUcmllcyIsIlRlbXBTdG9yZSIsImVuc3VyZUZvckZpbGUiLCJub3ciLCJjdXJyZW50Q291bnQiLCJmYWlsdXJlcyIsImZhaWxlZFBlcm1hbmVudGx5IiwiZG9uZVRyeWluZyIsImNyZWF0ZVJlYWRTdHJlYW0iLCJleGlzdHMiLCJzdG9yYWdlIiwic3RvcmVzTG9va3VwIiwicHJpbWFyeVN0b3JlIiwiYWRhcHRlciIsImNyZWF0ZVdyaXRlU3RyZWFtIiwiRmlsZVdvcmtlciIsImNvcHkiLCJ0cmFuc2Zvcm0iLCJuZXdJZCIsImluc2VydCIsIm5ld0ZpbGUiLCJvbGRLZXkiLCJoYXNPd25Qcm9wZXJ0eSIsInNvdXJjZUZpbGVTdG9yYWdlIiwiZmlsZUtleSIsImNvcHlTdG9yZURhdGEiLCJtZXRob2RzIiwidXJsIiwiY2hlY2siLCJTdHJpbmciLCJ1bmJsb2NrIiwicmVzcG9uc2UiLCJIVFRQIiwiaGVhZGVycyIsImZpbGUiLCJfY29weVN0b3JlRGF0YSIsImZpbGVPYmoiLCJzb3VyY2VLZXkiLCJkZXN0aW5hdGlvbktleSIsInJlYWRTdHJlYW0iLCJjcmVhdGVSZWFkU3RyZWFtRm9yRmlsZUtleSIsIndyaXRlU3RyZWFtIiwiY3JlYXRlV3JpdGVTdHJlYW1Gb3JGaWxlS2V5Iiwib25jZSIsInBpcGUiLCJjb3B5RGF0YSIsInNvdXJjZVN0b3JlTmFtZSIsInRhcmdldFN0b3JlTmFtZSIsIm1vdmUiLCJzb3VyY2VTdG9yZVZhbHVlcyIsImNvcHlLZXkiLCJjbG9uZURhdGFUb1N0b3JlIiwidGFyZ2V0U3RvcmVWYWx1ZXMiLCJjcmVhdGVkQXQiLCIkdW5zZXQiLCJtb3ZlRGF0YSIsIl9jb3B5RGF0YUZyb21TdG9yZVRvU3RvcmUiLCJzb3VyY2VTdG9yYWdlIiwidGFyZ2V0U3RvcmFnZSIsInRhcmdldEtleSIsInNhZmVPbmNlIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUEsSUFBSUEsZ0JBQUo7QUFBcUJDLE1BQU0sQ0FBQ0MsSUFBUCxDQUFZLG9DQUFaLEVBQWlEO0FBQUNGLGtCQUFnQixDQUFDRyxDQUFELEVBQUc7QUFBQ0gsb0JBQWdCLEdBQUNHLENB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QixhQUFXLENBQUNtQixRQUFaLENBQXFCLFFBQXJCLEVBQStCLFVBQVNuSyxNQUFULEVBQWlCO0FBQzlDLFFBQUd1SixJQUFJLElBQUlTLGFBQWEsQ0FBQzVDLE9BQWQsQ0FBc0J4RSxNQUF0QixDQUE2QitGLE9BQTdCLE1BQXdDLEtBQW5ELEVBQXlEO0FBQ3ZEekosY0FBUSxDQUFDLHFCQUFxQm9LLGVBQXJCLEdBQ1AsaUJBRE8sR0FFUHRKLE1BQU0sQ0FBQytILE9BRkEsR0FHUCw0Q0FITyxHQUlQc0IsZUFKTSxDQUFSO0FBS0QsS0FORCxNQU1LO0FBQ0huSyxjQUFRLENBQUMsSUFBRCxFQUFPYyxNQUFNLENBQUMrSCxPQUFkLENBQVI7QUFDRDtBQUNGLEdBVkQ7QUFZQWlCLGFBQVcsQ0FBQ0UsSUFBWixDQUFpQixPQUFqQixFQUEwQixVQUFTL0ksS0FBVCxFQUFnQjtBQUN4Q2pCLFlBQVEsQ0FBQ2lCLEtBQUQsQ0FBUjtBQUNELEdBRkQ7QUFJQTJJLFlBQVUsQ0FBQ0ssSUFBWCxDQUFnQkgsV0FBaEI7QUFDRDs7QUFDRCxJQUFJVSxnQkFBZ0IsR0FBRzVKLE1BQU0sQ0FBQ2lHLFNBQVAsQ0FBaUJnRSx5QkFBakIsQ0FBdkIsQyIsImZpbGUiOiIvcGFja2FnZXMvc3RlZWRvc19jZnMtZmlsZS5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8vIGZpeCB3YXJuaW5nOiB4eHggbm90IGluc3RhbGxlZFxyXG5yZXF1aXJlKFwidGVtcC9wYWNrYWdlLmpzb25cIik7XHJcblxyXG5pbXBvcnQgeyBjaGVja05wbVZlcnNpb25zIH0gZnJvbSAnbWV0ZW9yL3RtZWFzZGF5OmNoZWNrLW5wbS12ZXJzaW9ucyc7XHJcbmNoZWNrTnBtVmVyc2lvbnMoe1xyXG5cdHRlbXA6IFwiMC43LjBcIiAvLyBmb3IgdGVzdHMgb25seVxyXG59LCAnc3RlZWRvczpjZnMtZmlsZScpOyIsIi8qKlxyXG4gKiBAbWV0aG9kIEZTLkZpbGVcclxuICogQG5hbWVzcGFjZSBGUy5GaWxlXHJcbiAqIEBwdWJsaWNcclxuICogQGNvbnN0cnVjdG9yXHJcbiAqIEBwYXJhbSB7b2JqZWN0fEZTLkZpbGV8ZGF0YSB0byBhdHRhY2h9IFtyZWZdIEFub3RoZXIgRlMuRmlsZSBpbnN0YW5jZSwgYSBmaWxlcmVjb3JkLCBvciBzb21lIGRhdGEgdG8gcGFzcyB0byBhdHRhY2hEYXRhXHJcbiAqL1xyXG5GUy5GaWxlID0gZnVuY3Rpb24ocmVmLCBjcmVhdGVkQnlUcmFuc2Zvcm0pIHtcclxuICB2YXIgc2VsZiA9IHRoaXM7XHJcblxyXG4gIHNlbGYuY3JlYXRlZEJ5VHJhbnNmb3JtID0gISFjcmVhdGVkQnlUcmFuc2Zvcm07XHJcblxyXG4gIGlmIChyZWYgaW5zdGFuY2VvZiBGUy5GaWxlIHx8IGlzQmFzaWNPYmplY3QocmVmKSkge1xyXG4gICAgLy8gRXh0ZW5kIHNlbGYgd2l0aCBmaWxlcmVjb3JkIHJlbGF0ZWQgZGF0YVxyXG4gICAgRlMuVXRpbGl0eS5leHRlbmQoc2VsZiwgRlMuVXRpbGl0eS5jbG9uZUZpbGVSZWNvcmQocmVmLCB7ZnVsbDogdHJ1ZX0pKTtcclxuICB9IGVsc2UgaWYgKHJlZikge1xyXG4gICAgc2VsZi5hdHRhY2hEYXRhKHJlZik7XHJcbiAgfVxyXG59O1xyXG5cclxuLy8gQW4gRlMuRmlsZSBjYW4gZW1pdCBldmVudHNcclxuRlMuRmlsZS5wcm90b3R5cGUgPSBuZXcgRXZlbnRFbWl0dGVyKCk7XHJcblxyXG4vKipcclxuICogQG1ldGhvZCBGUy5GaWxlLnByb3RvdHlwZS5hdHRhY2hEYXRhXHJcbiAqIEBwdWJsaWNcclxuICogQHBhcmFtIHtGaWxlfEJsb2J8QnVmZmVyfEFycmF5QnVmZmVyfFVpbnQ4QXJyYXl8U3RyaW5nfSBkYXRhIFRoZSBkYXRhIHRoYXQgeW91IHdhbnQgdG8gYXR0YWNoIHRvIHRoZSBmaWxlLlxyXG4gKiBAcGFyYW0ge09iamVjdH0gW29wdGlvbnNdIE9wdGlvbnNcclxuICogQHBhcmFtIHtTdHJpbmd9IFtvcHRpb25zLnR5cGVdIFRoZSBkYXRhIGNvbnRlbnQgKE1JTUUpIHR5cGUsIGlmIGtub3duLlxyXG4gKiBAcGFyYW0ge1N0cmluZ30gW29wdGlvbnMuaGVhZGVyc10gV2hlbiBhdHRhY2hpbmcgYSBVUkwsIGhlYWRlcnMgdG8gYmUgdXNlZCBmb3IgdGhlIEdFVCByZXF1ZXN0IChjdXJyZW50bHkgc2VydmVyIG9ubHkpXHJcbiAqIEBwYXJhbSB7U3RyaW5nfSBbb3B0aW9ucy5hdXRoXSBXaGVuIGF0dGFjaGluZyBhIFVSTCwgXCJ1c2VybmFtZTpwYXNzd29yZFwiIHRvIGJlIHVzZWQgZm9yIHRoZSBHRVQgcmVxdWVzdCAoY3VycmVudGx5IHNlcnZlciBvbmx5KVxyXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBbY2FsbGJhY2tdIENhbGxiYWNrIGZ1bmN0aW9uLCBjYWxsYmFjayhlcnJvcikuIE9uIHRoZSBjbGllbnQsIGEgY2FsbGJhY2sgaXMgcmVxdWlyZWQgaWYgZGF0YSBpcyBhIFVSTC5cclxuICogQHJldHVybnMge0ZTLkZpbGV9IFRoaXMgRlMuRmlsZSBpbnN0YW5jZS5cclxuICpcclxuICovXHJcbkZTLkZpbGUucHJvdG90eXBlLmF0dGFjaERhdGEgPSBmdW5jdGlvbiBmc0ZpbGVBdHRhY2hEYXRhKGRhdGEsIG9wdGlvbnMsIGNhbGxiYWNrKSB7XHJcbiAgdmFyIHNlbGYgPSB0aGlzO1xyXG5cclxuICBpZiAoIWNhbGxiYWNrICYmIHR5cGVvZiBvcHRpb25zID09PSBcImZ1bmN0aW9uXCIpIHtcclxuICAgIGNhbGxiYWNrID0gb3B0aW9ucztcclxuICAgIG9wdGlvbnMgPSB7fTtcclxuICB9XHJcbiAgb3B0aW9ucyA9IG9wdGlvbnMgfHwge307XHJcblxyXG4gIGlmICghZGF0YSkge1xyXG4gICAgdGhyb3cgbmV3IEVycm9yKCdGUy5GaWxlLmF0dGFjaERhdGEgcmVxdWlyZXMgYSBkYXRhIGFyZ3VtZW50IHdpdGggc29tZSBkYXRhJyk7XHJcbiAgfVxyXG5cclxuICB2YXIgdXJsT3B0cztcclxuXHJcbiAgLy8gU2V0IGFueSBvdGhlciBwcm9wZXJ0aWVzIHdlIGNhbiBkZXRlcm1pbmUgZnJvbSB0aGUgc291cmNlIGRhdGFcclxuICAvLyBGaWxlXHJcbiAgaWYgKHR5cGVvZiBGaWxlICE9PSBcInVuZGVmaW5lZFwiICYmIGRhdGEgaW5zdGFuY2VvZiBGaWxlKSB7XHJcbiAgICBzZWxmLm5hbWUoZGF0YS5uYW1lKTtcclxuICAgIHNlbGYudXBkYXRlZEF0KGRhdGEubGFzdE1vZGlmaWVkRGF0ZSk7XHJcbiAgICBzZWxmLnNpemUoZGF0YS5zaXplKTtcclxuICAgIHNldERhdGEoZGF0YS50eXBlKTtcclxuICB9XHJcbiAgLy8gQmxvYlxyXG4gIGVsc2UgaWYgKHR5cGVvZiBCbG9iICE9PSBcInVuZGVmaW5lZFwiICYmIGRhdGEgaW5zdGFuY2VvZiBCbG9iKSB7XHJcbiAgICBzZWxmLm5hbWUoZGF0YS5uYW1lKTtcclxuICAgIHNlbGYudXBkYXRlZEF0KG5ldyBEYXRlKCkpO1xyXG4gICAgc2VsZi5zaXplKGRhdGEuc2l6ZSk7XHJcbiAgICBzZXREYXRhKGRhdGEudHlwZSk7XHJcbiAgfVxyXG4gIC8vIFVSTDogd2UgbmVlZCB0byBkbyBhIEhFQUQgcmVxdWVzdCB0byBnZXQgdGhlIHR5cGUgYmVjYXVzZSB0eXBlXHJcbiAgLy8gaXMgcmVxdWlyZWQgZm9yIGZpbHRlcmluZyB0byB3b3JrLlxyXG4gIGVsc2UgaWYgKHR5cGVvZiBkYXRhID09PSBcInN0cmluZ1wiICYmIChkYXRhLnNsaWNlKDAsIDUpID09PSBcImh0dHA6XCIgfHwgZGF0YS5zbGljZSgwLCA2KSA9PT0gXCJodHRwczpcIikpIHtcclxuICAgIHVybE9wdHMgPSBGUy5VdGlsaXR5LmV4dGVuZCh7fSwgb3B0aW9ucyk7XHJcbiAgICBpZiAodXJsT3B0cy50eXBlKSB7XHJcbiAgICAgIGRlbGV0ZSB1cmxPcHRzLnR5cGU7XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKCFjYWxsYmFjaykge1xyXG4gICAgICBpZiAoTWV0ZW9yLmlzQ2xpZW50KSB7XHJcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdGUy5GaWxlLmF0dGFjaERhdGEgcmVxdWlyZXMgYSBjYWxsYmFjayB3aGVuIGF0dGFjaGluZyBhIFVSTCBvbiB0aGUgY2xpZW50Jyk7XHJcbiAgICAgIH1cclxuICAgICAgdmFyIHJlc3VsdCA9IE1ldGVvci5jYWxsKCdfY2ZzX2dldFVybEluZm8nLCBkYXRhLCB1cmxPcHRzKTtcclxuICAgICAgRlMuVXRpbGl0eS5leHRlbmQoc2VsZiwge29yaWdpbmFsOiByZXN1bHR9KTtcclxuICAgICAgc2V0RGF0YShyZXN1bHQudHlwZSk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBNZXRlb3IuY2FsbCgnX2Nmc19nZXRVcmxJbmZvJywgZGF0YSwgdXJsT3B0cywgZnVuY3Rpb24gKGVycm9yLCByZXN1bHQpIHtcclxuICAgICAgICBGUy5kZWJ1ZyAmJiBjb25zb2xlLmxvZyhcIlVSTCBIRUFEIFJFU1VMVDpcIiwgcmVzdWx0KTtcclxuICAgICAgICBpZiAoZXJyb3IpIHtcclxuICAgICAgICAgIGNhbGxiYWNrKGVycm9yKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgdmFyIHR5cGUgPSByZXN1bHQudHlwZSB8fCBvcHRpb25zLnR5cGU7XHJcbiAgICAgICAgICBpZiAoISB0eXBlKSB7XHJcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignRlMuRmlsZS5hdHRhY2hEYXRhIGdvdCBhIFVSTCBmb3Igd2hpY2ggaXQgY291bGQgbm90IGRldGVybWluZSB0aGUgTUlNRSB0eXBlIGFuZCBub25lIHdhcyBwcm92aWRlZCB1c2luZyBvcHRpb25zLnR5cGUnKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICAgIEZTLlV0aWxpdHkuZXh0ZW5kKHNlbGYsIHtvcmlnaW5hbDogcmVzdWx0fSk7XHJcbiAgICAgICAgICBzZXREYXRhKHR5cGUpO1xyXG4gICAgICAgIH1cclxuICAgICAgfSk7XHJcbiAgICB9XHJcbiAgfVxyXG4gIC8vIEV2ZXJ5dGhpbmcgZWxzZVxyXG4gIGVsc2Uge1xyXG4gICAgc2V0RGF0YShvcHRpb25zLnR5cGUpO1xyXG4gIH1cclxuXHJcbiAgLy8gU2V0IHRoZSBkYXRhXHJcbiAgZnVuY3Rpb24gc2V0RGF0YSh0eXBlKSB7XHJcbiAgICBzZWxmLmRhdGEgPSBuZXcgRGF0YU1hbihkYXRhLCB0eXBlLCB1cmxPcHRzKTtcclxuXHJcbiAgICAvLyBVcGRhdGUgdGhlIHR5cGUgdG8gbWF0Y2ggd2hhdCB0aGUgZGF0YSBpc1xyXG4gICAgc2VsZi50eXBlKHNlbGYuZGF0YS50eXBlKCkpO1xyXG5cclxuICAgIC8vIFVwZGF0ZSB0aGUgc2l6ZSB0byBtYXRjaCB3aGF0IHRoZSBkYXRhIGlzLlxyXG4gICAgLy8gSXQncyBhbHdheXMgc2FmZSB0byBjYWxsIHNlbGYuZGF0YS5zaXplKCkgd2l0aG91dCBzdXBwbHlpbmcgYSBjYWxsYmFja1xyXG4gICAgLy8gYmVjYXVzZSBpdCByZXF1aXJlcyBhIGNhbGxiYWNrIG9ubHkgZm9yIFVSTHMgb24gdGhlIGNsaWVudCwgYW5kIHdlXHJcbiAgICAvLyBhbHJlYWR5IGFkZGVkIHNpemUgZm9yIFVSTHMgd2hlbiB3ZSBnb3QgdGhlIHJlc3VsdCBmcm9tICdfY2ZzX2dldFVybEluZm8nIG1ldGhvZC5cclxuICAgIGlmICghc2VsZi5zaXplKCkpIHtcclxuICAgICAgaWYgKGNhbGxiYWNrKSB7XHJcbiAgICAgICAgc2VsZi5kYXRhLnNpemUoZnVuY3Rpb24gKGVycm9yLCBzaXplKSB7XHJcbiAgICAgICAgICBpZiAoZXJyb3IpIHtcclxuICAgICAgICAgICAgY2FsbGJhY2sgJiYgY2FsbGJhY2soZXJyb3IpO1xyXG4gICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgc2VsZi5zaXplKHNpemUpO1xyXG4gICAgICAgICAgICBzZXROYW1lKCk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgc2VsZi5zaXplKHNlbGYuZGF0YS5zaXplKCkpO1xyXG4gICAgICAgIHNldE5hbWUoKTtcclxuICAgICAgfVxyXG4gICAgfSBlbHNlIHtcclxuICAgICAgc2V0TmFtZSgpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gc2V0TmFtZSgpIHtcclxuICAgIC8vIFNlZSBpZiB3ZSBjYW4gZXh0cmFjdCBhIGZpbGUgbmFtZSBmcm9tIFVSTCBvciBmaWxlcGF0aFxyXG4gICAgaWYgKCFzZWxmLm5hbWUoKSAmJiB0eXBlb2YgZGF0YSA9PT0gXCJzdHJpbmdcIikge1xyXG4gICAgICAvLyBuYW1lIGZyb20gVVJMXHJcbiAgICAgIGlmIChkYXRhLnNsaWNlKDAsIDUpID09PSBcImh0dHA6XCIgfHwgZGF0YS5zbGljZSgwLCA2KSA9PT0gXCJodHRwczpcIikge1xyXG4gICAgICAgIGlmIChGUy5VdGlsaXR5LmdldEZpbGVFeHRlbnNpb24oZGF0YSkubGVuZ3RoKSB7XHJcbiAgICAgICAgICAvLyBmb3IgYSBVUkwgd2UgYXNzdW1lIHRoZSBlbmQgaXMgYSBmaWxlbmFtZSBvbmx5IGlmIGl0IGhhcyBhbiBleHRlbnNpb25cclxuICAgICAgICAgIHNlbGYubmFtZShGUy5VdGlsaXR5LmdldEZpbGVOYW1lKGRhdGEpKTtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgICAgLy8gbmFtZSBmcm9tIGZpbGVwYXRoXHJcbiAgICAgIGVsc2UgaWYgKGRhdGEuc2xpY2UoMCwgNSkgIT09IFwiZGF0YTpcIikge1xyXG4gICAgICAgIHNlbGYubmFtZShGUy5VdGlsaXR5LmdldEZpbGVOYW1lKGRhdGEpKTtcclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGNhbGxiYWNrICYmIGNhbGxiYWNrKCk7XHJcbiAgfVxyXG5cclxuICByZXR1cm4gc2VsZjsgLy9hbGxvdyBjaGFpbmluZ1xyXG59O1xyXG5cclxuLyoqXHJcbiAqIEBtZXRob2QgRlMuRmlsZS5wcm90b3R5cGUudXBsb2FkUHJvZ3Jlc3NcclxuICogQHB1YmxpY1xyXG4gKiBAcmV0dXJucyB7bnVtYmVyfSBUaGUgc2VydmVyIGNvbmZpcm1lZCB1cGxvYWQgcHJvZ3Jlc3NcclxuICovXHJcbkZTLkZpbGUucHJvdG90eXBlLnVwbG9hZFByb2dyZXNzID0gZnVuY3Rpb24oKSB7XHJcbiAgdmFyIHNlbGYgPSB0aGlzO1xyXG4gIC8vIE1ha2Ugc3VyZSBvdXIgZmlsZSByZWNvcmQgaXMgdXBkYXRlZFxyXG4gIHNlbGYuZ2V0RmlsZVJlY29yZCgpO1xyXG5cclxuICAvLyBJZiBmdWxseSB1cGxvYWRlZCwgcmV0dXJuIDEwMFxyXG4gIGlmIChzZWxmLnVwbG9hZGVkQXQpIHtcclxuICAgIHJldHVybiAxMDA7XHJcbiAgfVxyXG4gIC8vIE90aGVyd2lzZSByZXR1cm4gdGhlIGNvbmZpcm1lZCBwcm9ncmVzcyBvciAwXHJcbiAgZWxzZSB7XHJcbiAgICByZXR1cm4gTWF0aC5yb3VuZCgoc2VsZi5jaHVua0NvdW50IHx8IDApIC8gKHNlbGYuY2h1bmtTdW0gfHwgMSkgKiAxMDApO1xyXG4gIH1cclxufTtcclxuXHJcbi8qKlxyXG4gKiBAbWV0aG9kIEZTLkZpbGUucHJvdG90eXBlLmNvbnRyb2xsZWRCeURlcHNcclxuICogQHB1YmxpY1xyXG4gKiBAcmV0dXJucyB7RlMuQ29sbGVjdGlvbn0gUmV0dXJucyB0cnVlIGlmIHRoaXMgRlMuRmlsZSBpcyByZWFjdGl2ZVxyXG4gKlxyXG4gKiA+IE5vdGU6IFJldHVybnMgdHJ1ZSBpZiB0aGlzIEZTLkZpbGUgb2JqZWN0IHdhcyBjcmVhdGVkIGJ5IGEgRlMuQ29sbGVjdGlvblxyXG4gKiA+IGFuZCB3ZSBhcmUgaW4gYSByZWFjdGl2ZSBjb21wdXRhdGlvbnMuIFdoYXQgZG9lcyB0aGlzIG1lYW4/IFdlbGwgaXQgc2hvdWxkXHJcbiAqID4gbWVhbiB0aGF0IG91ciBmaWxlUmVjb3JkIGlzIGZ1bGx5IHVwZGF0ZWQgYnkgTWV0ZW9yIGFuZCB3ZSBhcmUgbW91bnRlZCBvblxyXG4gKiA+IGEgY29sbGVjdGlvblxyXG4gKi9cclxuRlMuRmlsZS5wcm90b3R5cGUuY29udHJvbGxlZEJ5RGVwcyA9IGZ1bmN0aW9uKCkge1xyXG4gIHZhciBzZWxmID0gdGhpcztcclxuICByZXR1cm4gc2VsZi5jcmVhdGVkQnlUcmFuc2Zvcm0gJiYgRGVwcy5hY3RpdmU7XHJcbn07XHJcblxyXG4vKipcclxuICogQG1ldGhvZCBGUy5GaWxlLnByb3RvdHlwZS5nZXRDb2xsZWN0aW9uXHJcbiAqIEBwdWJsaWNcclxuICogQHJldHVybnMge0ZTLkNvbGxlY3Rpb259IFJldHVybnMgYXR0YWNoZWQgY29sbGVjdGlvbiBvciB1bmRlZmluZWQgaWYgbm90IG1vdW50ZWRcclxuICovXHJcbkZTLkZpbGUucHJvdG90eXBlLmdldENvbGxlY3Rpb24gPSBmdW5jdGlvbigpIHtcclxuICAvLyBHZXQgdGhlIGNvbGxlY3Rpb24gcmVmZXJlbmNlXHJcbiAgdmFyIHNlbGYgPSB0aGlzO1xyXG5cclxuICAvLyBJZiB3ZSBhbHJlYWR5IG1hZGUgdGhlIGxpbmsgdGhlbiBkbyBubyBtb3JlXHJcbiAgaWYgKHNlbGYuY29sbGVjdGlvbikge1xyXG4gICAgcmV0dXJuIHNlbGYuY29sbGVjdGlvbjtcclxuICB9XHJcblxyXG4gIC8vIElmIHdlIGRvbid0IGhhdmUgYSBjb2xsZWN0aW9uTmFtZSB0aGVuIHRoZXJlJ3Mgbm90IG11Y2ggdG8gZG8sIHRoZSBmaWxlIGlzXHJcbiAgLy8gbm90IG1vdW50ZWQgeWV0XHJcbiAgaWYgKCFzZWxmLmNvbGxlY3Rpb25OYW1lKSB7XHJcbiAgICAvLyBTaG91bGQgbm90IHRocm93IGFuIGVycm9yIGhlcmUgLSBjb3VsZCBiZSBjb21tb24gdGhhdCB0aGUgZmlsZSBpcyBub3RcclxuICAgIC8vIHlldCBtb3VudGVkIGludG8gYSBjb2xsZWN0aW9uXHJcbiAgICByZXR1cm47XHJcbiAgfVxyXG5cclxuICAvLyBMaW5rIHRoZSBjb2xsZWN0aW9uIHRvIHRoZSBmaWxlXHJcbiAgc2VsZi5jb2xsZWN0aW9uID0gRlMuX2NvbGxlY3Rpb25zW3NlbGYuY29sbGVjdGlvbk5hbWVdO1xyXG5cclxuICByZXR1cm4gc2VsZi5jb2xsZWN0aW9uOyAvL3Bvc3NpYmx5IHVuZGVmaW5lZCwgYnV0IHRoYXQncyBkZXNpcmVkIGJlaGF2aW9yXHJcbn07XHJcblxyXG4vKipcclxuICogQG1ldGhvZCBGUy5GaWxlLnByb3RvdHlwZS5pc01vdW50ZWRcclxuICogQHB1YmxpY1xyXG4gKiBAcmV0dXJucyB7RlMuQ29sbGVjdGlvbn0gUmV0dXJucyBhdHRhY2hlZCBjb2xsZWN0aW9uIG9yIHVuZGVmaW5lZCBpZiBub3QgbW91bnRlZFxyXG4gKi9cclxuRlMuRmlsZS5wcm90b3R5cGUuaXNNb3VudGVkID0gRlMuRmlsZS5wcm90b3R5cGUuZ2V0Q29sbGVjdGlvbjtcclxuXHJcbi8qKlxyXG4gKiBAbWV0aG9kIEZTLkZpbGUucHJvdG90eXBlLmdldEZpbGVSZWNvcmQgUmV0dXJucyB0aGUgZmlsZVJlY29yZFxyXG4gKiBAcHVibGljXHJcbiAqIEByZXR1cm5zIHtvYmplY3R9IFRoZSBmaWxlcmVjb3JkXHJcbiAqL1xyXG5GUy5GaWxlLnByb3RvdHlwZS5nZXRGaWxlUmVjb3JkID0gZnVuY3Rpb24oKSB7XHJcbiAgdmFyIHNlbGYgPSB0aGlzO1xyXG4gIC8vIENoZWNrIGlmIHRoaXMgZmlsZSBvYmplY3QgZmlsZVJlY29yZCBpcyBrZXB0IHVwZGF0ZWQgYnkgTWV0ZW9yLCBpZiBzb1xyXG4gIC8vIHJldHVybiBzZWxmXHJcbiAgaWYgKHNlbGYuY29udHJvbGxlZEJ5RGVwcygpKSB7XHJcbiAgICByZXR1cm4gc2VsZjtcclxuICB9XHJcbiAgLy8gR28gZm9yIG1hbnVhbGx5IHVwZGF0aW5nIHRoZSBmaWxlIHJlY29yZFxyXG4gIGlmIChzZWxmLmlzTW91bnRlZCgpKSB7XHJcbiAgICBGUy5kZWJ1ZyAmJiBjb25zb2xlLmxvZygnR0VUIEZJTEVSRUNPUkQ6ICcgKyBzZWxmLl9pZCk7XHJcblxyXG4gICAgLy8gUmV0dXJuIHRoZSBmaWxlUmVjb3JkIG9yIGFuIGVtcHR5IG9iamVjdFxyXG4gICAgdmFyIGZpbGVSZWNvcmQgPSBzZWxmLmNvbGxlY3Rpb24uZmlsZXMuZmluZE9uZSh7X2lkOiBzZWxmLl9pZH0pIHx8IHt9O1xyXG4gICAgRlMuVXRpbGl0eS5leHRlbmQoc2VsZiwgZmlsZVJlY29yZCk7XHJcbiAgICByZXR1cm4gZmlsZVJlY29yZDtcclxuICB9IGVsc2Uge1xyXG4gICAgLy8gV2UgcmV0dXJuIGFuIGVtcHR5IG9iamVjdCwgdGhpcyB3YXkgdXNlcnMgY2FuIHN0aWxsIGRvIGBnZXRSZWNvcmQoKS5zaXplYFxyXG4gICAgLy8gV2l0aG91dCBnZXR0aW5nIGFuIGVycm9yXHJcbiAgICByZXR1cm4ge307XHJcbiAgfVxyXG59O1xyXG5cclxuLyoqXHJcbiAqIEBtZXRob2QgRlMuRmlsZS5wcm90b3R5cGUudXBkYXRlXHJcbiAqIEBwdWJsaWNcclxuICogQHBhcmFtIHttb2RpZmllcn0gbW9kaWZpZXJcclxuICogQHBhcmFtIHtvYmplY3R9IFtvcHRpb25zXVxyXG4gKiBAcGFyYW0ge2Z1bmN0aW9ufSBbY2FsbGJhY2tdXHJcbiAqXHJcbiAqIFVwZGF0ZXMgdGhlIGZpbGVSZWNvcmQuXHJcbiAqL1xyXG5GUy5GaWxlLnByb3RvdHlwZS51cGRhdGUgPSBmdW5jdGlvbihtb2RpZmllciwgb3B0aW9ucywgY2FsbGJhY2spIHtcclxuICB2YXIgc2VsZiA9IHRoaXM7XHJcblxyXG4gIEZTLmRlYnVnICYmIGNvbnNvbGUubG9nKCdVUERBVEU6ICcgKyBKU09OLnN0cmluZ2lmeShtb2RpZmllcikpO1xyXG5cclxuICAvLyBNYWtlIHN1cmUgd2UgaGF2ZSBvcHRpb25zIGFuZCBjYWxsYmFja1xyXG4gIGlmICghY2FsbGJhY2sgJiYgdHlwZW9mIG9wdGlvbnMgPT09ICdmdW5jdGlvbicpIHtcclxuICAgIGNhbGxiYWNrID0gb3B0aW9ucztcclxuICAgIG9wdGlvbnMgPSB7fTtcclxuICB9XHJcbiAgY2FsbGJhY2sgPSBjYWxsYmFjayB8fCBGUy5VdGlsaXR5LmRlZmF1bHRDYWxsYmFjaztcclxuXHJcbiAgaWYgKCFzZWxmLmlzTW91bnRlZCgpKSB7XHJcbiAgICBjYWxsYmFjayhuZXcgRXJyb3IoXCJDYW5ub3QgdXBkYXRlIGEgZmlsZSB0aGF0IGlzIG5vdCBhc3NvY2lhdGVkIHdpdGggYSBjb2xsZWN0aW9uXCIpKTtcclxuICAgIHJldHVybjtcclxuICB9XHJcblxyXG4gIC8vIENhbGwgY29sbGVjdGlvbiB1cGRhdGUgLSBGaWxlIHJlY29yZFxyXG4gIHJldHVybiBzZWxmLmNvbGxlY3Rpb24uZmlsZXMudXBkYXRlKHtfaWQ6IHNlbGYuX2lkfSwgbW9kaWZpZXIsIG9wdGlvbnMsIGZ1bmN0aW9uKGVyciwgY291bnQpIHtcclxuICAgIC8vIFVwZGF0ZSB0aGUgZmlsZVJlY29yZCBpZiBpdCB3YXMgY2hhbmdlZCBhbmQgb24gdGhlIGNsaWVudFxyXG4gICAgLy8gVGhlIHNlcnZlci1zaWRlIG1ldGhvZHMgd2lsbCBwdWxsIHRoZSBmaWxlUmVjb3JkIGlmIG5lZWRlZFxyXG4gICAgaWYgKGNvdW50ID4gMCAmJiBNZXRlb3IuaXNDbGllbnQpXHJcbiAgICAgIHNlbGYuZ2V0RmlsZVJlY29yZCgpO1xyXG4gICAgLy8gQ2FsbCBjYWxsYmFja1xyXG4gICAgY2FsbGJhY2soZXJyLCBjb3VudCk7XHJcbiAgfSk7XHJcbn07XHJcblxyXG4vKipcclxuICogQG1ldGhvZCBGUy5GaWxlLnByb3RvdHlwZS5fc2F2ZUNoYW5nZXNcclxuICogQHByaXZhdGVcclxuICogQHBhcmFtIHtTdHJpbmd9IFt3aGF0XSBcIl9vcmlnaW5hbFwiIHRvIHNhdmUgb3JpZ2luYWwgaW5mbywgb3IgYSBzdG9yZSBuYW1lIHRvIHNhdmUgaW5mbyBmb3IgdGhhdCBzdG9yZSwgb3Igc2F2ZXMgZXZlcnl0aGluZ1xyXG4gKlxyXG4gKiBVcGRhdGVzIHRoZSBmaWxlUmVjb3JkIGZyb20gdmFsdWVzIGN1cnJlbnRseSBzZXQgb24gdGhlIEZTLkZpbGUgaW5zdGFuY2UuXHJcbiAqL1xyXG5GUy5GaWxlLnByb3RvdHlwZS5fc2F2ZUNoYW5nZXMgPSBmdW5jdGlvbih3aGF0KSB7XHJcbiAgdmFyIHNlbGYgPSB0aGlzO1xyXG5cclxuICBpZiAoIXNlbGYuaXNNb3VudGVkKCkpIHtcclxuICAgIHJldHVybjtcclxuICB9XHJcblxyXG4gIEZTLmRlYnVnICYmIGNvbnNvbGUubG9nKFwiRlMuRmlsZS5fc2F2ZUNoYW5nZXM6XCIsIHdoYXQgfHwgXCJhbGxcIik7XHJcblxyXG4gIHZhciBtb2QgPSB7JHNldDoge319O1xyXG4gIGlmICh3aGF0ID09PSBcIl9vcmlnaW5hbFwiKSB7XHJcbiAgICBtb2QuJHNldC5vcmlnaW5hbCA9IHNlbGYub3JpZ2luYWw7XHJcbiAgfSBlbHNlIGlmICh0eXBlb2Ygd2hhdCA9PT0gXCJzdHJpbmdcIikge1xyXG4gICAgdmFyIGluZm8gPSBzZWxmLmNvcGllc1t3aGF0XTtcclxuICAgIGlmIChpbmZvKSB7XHJcbiAgICAgIG1vZC4kc2V0W1wiY29waWVzLlwiICsgd2hhdF0gPSBpbmZvO1xyXG4gICAgfVxyXG4gIH0gZWxzZSB7XHJcbiAgICBtb2QuJHNldC5vcmlnaW5hbCA9IHNlbGYub3JpZ2luYWw7XHJcbiAgICBtb2QuJHNldC5jb3BpZXMgPSBzZWxmLmNvcGllcztcclxuICB9XHJcblxyXG4gIHNlbGYudXBkYXRlKG1vZCk7XHJcbn07XHJcblxyXG4vKipcclxuICogQG1ldGhvZCBGUy5GaWxlLnByb3RvdHlwZS5yZW1vdmVcclxuICogQHB1YmxpY1xyXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBbY2FsbGJhY2tdXHJcbiAqIEByZXR1cm5zIHtudW1iZXJ9IENvdW50XHJcbiAqXHJcbiAqIFJlbW92ZSB0aGUgY3VycmVudCBmaWxlIGZyb20gaXRzIEZTLkNvbGxlY3Rpb25cclxuICovXHJcbkZTLkZpbGUucHJvdG90eXBlLnJlbW92ZSA9IGZ1bmN0aW9uKGNhbGxiYWNrKSB7XHJcbiAgdmFyIHNlbGYgPSB0aGlzO1xyXG5cclxuICBGUy5kZWJ1ZyAmJiBjb25zb2xlLmxvZygnUkVNT1ZFOiAnICsgc2VsZi5faWQpO1xyXG5cclxuICBjYWxsYmFjayA9IGNhbGxiYWNrIHx8IEZTLlV0aWxpdHkuZGVmYXVsdENhbGxiYWNrO1xyXG5cclxuICBpZiAoIXNlbGYuaXNNb3VudGVkKCkpIHtcclxuICAgIGNhbGxiYWNrKG5ldyBFcnJvcihcIkNhbm5vdCByZW1vdmUgYSBmaWxlIHRoYXQgaXMgbm90IGFzc29jaWF0ZWQgd2l0aCBhIGNvbGxlY3Rpb25cIikpO1xyXG4gICAgcmV0dXJuO1xyXG4gIH1cclxuXHJcbiAgcmV0dXJuIHNlbGYuY29sbGVjdGlvbi5maWxlcy5yZW1vdmUoe19pZDogc2VsZi5faWR9LCBmdW5jdGlvbihlcnIsIHJlcykge1xyXG4gICAgaWYgKCFlcnIpIHtcclxuICAgICAgZGVsZXRlIHNlbGYuX2lkO1xyXG4gICAgICBkZWxldGUgc2VsZi5jb2xsZWN0aW9uO1xyXG4gICAgICBkZWxldGUgc2VsZi5jb2xsZWN0aW9uTmFtZTtcclxuICAgIH1cclxuICAgIGNhbGxiYWNrKGVyciwgcmVzKTtcclxuICB9KTtcclxufTtcclxuXHJcbi8qKlxyXG4gKiBAbWV0aG9kIEZTLkZpbGUucHJvdG90eXBlLm1vdmVUb1xyXG4gKiBAcGFyYW0ge0ZTLkNvbGxlY3Rpb259IHRhcmdldENvbGxlY3Rpb25cclxuICogQHByaXZhdGUgLy8gTWFya2VkIHByaXZhdGUgdW50aWwgaW1wbGVtZW50ZWRcclxuICogQHRvZG8gTmVlZHMgdG8gYmUgaW1wbGVtZW50ZWRcclxuICpcclxuICogTW92ZSB0aGUgZmlsZSBmcm9tIGN1cnJlbnQgY29sbGVjdGlvbiB0byBhbm90aGVyIGNvbGxlY3Rpb25cclxuICpcclxuICogPiBOb3RlOiBOb3QgeWV0IGltcGxlbWVudGVkXHJcbiAqL1xyXG5cclxuLyoqXHJcbiAqIEBtZXRob2QgRlMuRmlsZS5wcm90b3R5cGUuZ2V0RXh0ZW5zaW9uIFJldHVybnMgdGhlIGxvd2VyY2FzZSBmaWxlIGV4dGVuc2lvblxyXG4gKiBAcHVibGljXHJcbiAqIEBkZXByZWNhdGVkIFVzZSB0aGUgYGV4dGVuc2lvbmAgZ2V0dGVyL3NldHRlciBtZXRob2QgaW5zdGVhZC5cclxuICogQHBhcmFtIHtPYmplY3R9IFtvcHRpb25zXVxyXG4gKiBAcGFyYW0ge1N0cmluZ30gW29wdGlvbnMuc3RvcmVdIC0gU3RvcmUgbmFtZS4gRGVmYXVsdCBpcyB0aGUgb3JpZ2luYWwgZXh0ZW5zaW9uLlxyXG4gKiBAcmV0dXJucyB7c3RyaW5nfSBUaGUgZXh0ZW5zaW9uIGVnLjogYGpwZ2Agb3IgaWYgbm90IGZvdW5kIHRoZW4gYW4gZW1wdHkgc3RyaW5nICcnXHJcbiAqL1xyXG5GUy5GaWxlLnByb3RvdHlwZS5nZXRFeHRlbnNpb24gPSBmdW5jdGlvbihvcHRpb25zKSB7XHJcbiAgdmFyIHNlbGYgPSB0aGlzO1xyXG4gIHJldHVybiBzZWxmLmV4dGVuc2lvbihvcHRpb25zKTtcclxufTtcclxuXHJcbmZ1bmN0aW9uIGNoZWNrQ29udGVudFR5cGUoZnNGaWxlLCBzdG9yZU5hbWUsIHN0YXJ0T2ZUeXBlKSB7XHJcbiAgdmFyIHR5cGU7XHJcbiAgaWYgKHN0b3JlTmFtZSAmJiBmc0ZpbGUuaGFzU3RvcmVkKHN0b3JlTmFtZSkpIHtcclxuICAgIHR5cGUgPSBmc0ZpbGUudHlwZSh7c3RvcmU6IHN0b3JlTmFtZX0pO1xyXG4gIH0gZWxzZSB7XHJcbiAgICB0eXBlID0gZnNGaWxlLnR5cGUoKTtcclxuICB9XHJcbiAgaWYgKHR5cGVvZiB0eXBlID09PSBcInN0cmluZ1wiKSB7XHJcbiAgICByZXR1cm4gdHlwZS5pbmRleE9mKHN0YXJ0T2ZUeXBlKSA9PT0gMDtcclxuICB9XHJcbiAgcmV0dXJuIGZhbHNlO1xyXG59XHJcblxyXG4vKipcclxuICogQG1ldGhvZCBGUy5GaWxlLnByb3RvdHlwZS5pc0ltYWdlIElzIGl0IGFuIGltYWdlIGZpbGU/XHJcbiAqIEBwdWJsaWNcclxuICogQHBhcmFtIHtvYmplY3R9IFtvcHRpb25zXVxyXG4gKiBAcGFyYW0ge3N0cmluZ30gW29wdGlvbnMuc3RvcmVdIFRoZSBzdG9yZSB3ZSdyZSBpbnRlcmVzdGVkIGluXHJcbiAqXHJcbiAqIFJldHVybnMgdHJ1ZSBpZiB0aGUgY29weSBvZiB0aGlzIGZpbGUgaW4gdGhlIHNwZWNpZmllZCBzdG9yZSBoYXMgYW4gaW1hZ2VcclxuICogY29udGVudCB0eXBlLiBJZiB0aGUgZmlsZSBvYmplY3QgaXMgdW5tb3VudGVkIG9yIGRvZXNuJ3QgaGF2ZSBhIGNvcHkgZm9yXHJcbiAqIHRoZSBzcGVjaWZpZWQgc3RvcmUsIG9yIGlmIHlvdSBkb24ndCBzcGVjaWZ5IGEgc3RvcmUsIHRoaXMgbWV0aG9kIGNoZWNrc1xyXG4gKiB0aGUgY29udGVudCB0eXBlIG9mIHRoZSBvcmlnaW5hbCBmaWxlLlxyXG4gKi9cclxuRlMuRmlsZS5wcm90b3R5cGUuaXNJbWFnZSA9IGZ1bmN0aW9uKG9wdGlvbnMpIHtcclxuICByZXR1cm4gY2hlY2tDb250ZW50VHlwZSh0aGlzLCAob3B0aW9ucyB8fCB7fSkuc3RvcmUsICdpbWFnZS8nKTtcclxufTtcclxuXHJcbi8qKlxyXG4gKiBAbWV0aG9kIEZTLkZpbGUucHJvdG90eXBlLmlzVmlkZW8gSXMgaXQgYSB2aWRlbyBmaWxlP1xyXG4gKiBAcHVibGljXHJcbiAqIEBwYXJhbSB7b2JqZWN0fSBbb3B0aW9uc11cclxuICogQHBhcmFtIHtzdHJpbmd9IFtvcHRpb25zLnN0b3JlXSBUaGUgc3RvcmUgd2UncmUgaW50ZXJlc3RlZCBpblxyXG4gKlxyXG4gKiBSZXR1cm5zIHRydWUgaWYgdGhlIGNvcHkgb2YgdGhpcyBmaWxlIGluIHRoZSBzcGVjaWZpZWQgc3RvcmUgaGFzIGEgdmlkZW9cclxuICogY29udGVudCB0eXBlLiBJZiB0aGUgZmlsZSBvYmplY3QgaXMgdW5tb3VudGVkIG9yIGRvZXNuJ3QgaGF2ZSBhIGNvcHkgZm9yXHJcbiAqIHRoZSBzcGVjaWZpZWQgc3RvcmUsIG9yIGlmIHlvdSBkb24ndCBzcGVjaWZ5IGEgc3RvcmUsIHRoaXMgbWV0aG9kIGNoZWNrc1xyXG4gKiB0aGUgY29udGVudCB0eXBlIG9mIHRoZSBvcmlnaW5hbCBmaWxlLlxyXG4gKi9cclxuRlMuRmlsZS5wcm90b3R5cGUuaXNWaWRlbyA9IGZ1bmN0aW9uKG9wdGlvbnMpIHtcclxuICByZXR1cm4gY2hlY2tDb250ZW50VHlwZSh0aGlzLCAob3B0aW9ucyB8fCB7fSkuc3RvcmUsICd2aWRlby8nKTtcclxufTtcclxuXHJcbi8qKlxyXG4gKiBAbWV0aG9kIEZTLkZpbGUucHJvdG90eXBlLmlzQXVkaW8gSXMgaXQgYW4gYXVkaW8gZmlsZT9cclxuICogQHB1YmxpY1xyXG4gKiBAcGFyYW0ge29iamVjdH0gW29wdGlvbnNdXHJcbiAqIEBwYXJhbSB7c3RyaW5nfSBbb3B0aW9ucy5zdG9yZV0gVGhlIHN0b3JlIHdlJ3JlIGludGVyZXN0ZWQgaW5cclxuICpcclxuICogUmV0dXJucyB0cnVlIGlmIHRoZSBjb3B5IG9mIHRoaXMgZmlsZSBpbiB0aGUgc3BlY2lmaWVkIHN0b3JlIGhhcyBhbiBhdWRpb1xyXG4gKiBjb250ZW50IHR5cGUuIElmIHRoZSBmaWxlIG9iamVjdCBpcyB1bm1vdW50ZWQgb3IgZG9lc24ndCBoYXZlIGEgY29weSBmb3JcclxuICogdGhlIHNwZWNpZmllZCBzdG9yZSwgb3IgaWYgeW91IGRvbid0IHNwZWNpZnkgYSBzdG9yZSwgdGhpcyBtZXRob2QgY2hlY2tzXHJcbiAqIHRoZSBjb250ZW50IHR5cGUgb2YgdGhlIG9yaWdpbmFsIGZpbGUuXHJcbiAqL1xyXG5GUy5GaWxlLnByb3RvdHlwZS5pc0F1ZGlvID0gZnVuY3Rpb24ob3B0aW9ucykge1xyXG4gIHJldHVybiBjaGVja0NvbnRlbnRUeXBlKHRoaXMsIChvcHRpb25zIHx8IHt9KS5zdG9yZSwgJ2F1ZGlvLycpO1xyXG59O1xyXG5cclxuLyoqXHJcbiAqIEBtZXRob2QgRlMuRmlsZS5wcm90b3R5cGUuZm9ybWF0dGVkU2l6ZVxyXG4gKiBAcHVibGljXHJcbiAqIEBwYXJhbSAge09iamVjdH0gb3B0aW9uc1xyXG4gKiBAcGFyYW0gIHtTdHJpbmd9IFtvcHRpb25zLnN0b3JlPW5vbmUsZGlzcGxheSBvcmlnaW5hbCBmaWxlIHNpemVdIFdoaWNoIGZpbGUgZG8geW91IHdhbnQgdG8gZ2V0IHRoZSBzaXplIG9mP1xyXG4gKiBAcGFyYW0gIHtTdHJpbmd9IFtvcHRpb25zLmZvcm1hdFN0cmluZz0nMC4wMCBiJ10gVGhlIGBudW1lcmFsYCBmb3JtYXQgc3RyaW5nIHRvIHVzZS5cclxuICogQHJldHVybiB7U3RyaW5nfSBUaGUgZmlsZSBzaXplIGZvcm1hdHRlZCBhcyBhIGh1bWFuIHJlYWRhYmxlIHN0cmluZyBhbmQgcmVhY3RpdmVseSB1cGRhdGVkLlxyXG4gKlxyXG4gKiAqIFlvdSBtdXN0IGFkZCB0aGUgYG51bWVyYWxgIHBhY2thZ2UgdG8geW91ciBhcHAgYmVmb3JlIHlvdSBjYW4gdXNlIHRoaXMgbWV0aG9kLlxyXG4gKiAqIElmIGluZm8gaXMgbm90IGZvdW5kIG9yIGEgc2l6ZSBjYW4ndCBiZSBkZXRlcm1pbmVkLCBpdCB3aWxsIHNob3cgMC5cclxuICovXHJcbkZTLkZpbGUucHJvdG90eXBlLmZvcm1hdHRlZFNpemUgPSBmdW5jdGlvbiBmc0ZpbGVGb3JtYXR0ZWRTaXplKG9wdGlvbnMpIHtcclxuICB2YXIgc2VsZiA9IHRoaXM7XHJcblxyXG4gIGlmICh0eXBlb2YgbnVtZXJhbCAhPT0gXCJmdW5jdGlvblwiKVxyXG4gICAgdGhyb3cgbmV3IEVycm9yKFwiWW91IG11c3QgYWRkIHRoZSBudW1lcmFsIHBhY2thZ2UgaWYgeW91IGNhbGwgRlMuRmlsZS5mb3JtYXR0ZWRTaXplXCIpO1xyXG5cclxuICBvcHRpb25zID0gb3B0aW9ucyB8fCB7fTtcclxuICBvcHRpb25zID0gb3B0aW9ucy5oYXNoIHx8IG9wdGlvbnM7XHJcblxyXG4gIHZhciBzaXplID0gc2VsZi5zaXplKG9wdGlvbnMpIHx8IDA7XHJcbiAgcmV0dXJuIG51bWVyYWwoc2l6ZSkuZm9ybWF0KG9wdGlvbnMuZm9ybWF0U3RyaW5nIHx8ICcwLjAwIGInKTtcclxufTtcclxuXHJcbi8qKlxyXG4gKiBAbWV0aG9kIEZTLkZpbGUucHJvdG90eXBlLmlzVXBsb2FkZWQgSXMgdGhpcyBmaWxlIGNvbXBsZXRlbHkgdXBsb2FkZWQ/XHJcbiAqIEBwdWJsaWNcclxuICogQHJldHVybnMge2Jvb2xlYW59IFRydWUgaWYgdGhlIG51bWJlciBvZiB1cGxvYWRlZCBieXRlcyBpcyBlcXVhbCB0byB0aGUgZmlsZSBzaXplLlxyXG4gKi9cclxuRlMuRmlsZS5wcm90b3R5cGUuaXNVcGxvYWRlZCA9IGZ1bmN0aW9uKCkge1xyXG4gIHZhciBzZWxmID0gdGhpcztcclxuXHJcbiAgLy8gTWFrZSBzdXJlIHdlIHVzZSB0aGUgdXBkYXRlZCBmaWxlIHJlY29yZFxyXG4gIHNlbGYuZ2V0RmlsZVJlY29yZCgpO1xyXG5cclxuICByZXR1cm4gISFzZWxmLnVwbG9hZGVkQXQ7XHJcbn07XHJcblxyXG4vKipcclxuICogQG1ldGhvZCBGUy5GaWxlLnByb3RvdHlwZS5oYXNTdG9yZWRcclxuICogQHB1YmxpY1xyXG4gKiBAcGFyYW0ge3N0cmluZ30gc3RvcmVOYW1lIE5hbWUgb2YgdGhlIHN0b3JlXHJcbiAqIEBwYXJhbSB7Ym9vbGVhbn0gW29wdGltaXN0aWM9ZmFsc2VdIEluIGNhc2UgdGhhdCB0aGUgZmlsZSByZWNvcmQgaXMgbm90IGZvdW5kLCByZWFkIGJlbG93XHJcbiAqIEByZXR1cm5zIHtib29sZWFufSBJcyBhIHZlcnNpb24gb2YgdGhpcyBmaWxlIHN0b3JlZCBpbiB0aGUgZ2l2ZW4gc3RvcmU/XHJcbiAqXHJcbiAqID4gTm90ZTogSWYgdGhlIGZpbGUgaXMgbm90IHB1Ymxpc2hlZCB0byB0aGUgY2xpZW50IG9yIHNpbXBseSBub3QgZm91bmQ6XHJcbiAqIHRoaXMgbWV0aG9kIGNhbm5vdCBrbm93IGZvciBzdXJlIGlmIGl0IGV4aXN0cyBvciBub3QuIFRoZSBgb3B0aW1pc3RpY2BcclxuICogcGFyYW0gaXMgdGhlIGJvb2xlYW4gdmFsdWUgdG8gcmV0dXJuLiBBcmUgd2UgYG9wdGltaXN0aWNgIHRoYXQgdGhlIGNvcHlcclxuICogY291bGQgZXhpc3QuIFRoaXMgaXMgdGhlIGNhc2UgaW4gYEZTLkZpbGUudXJsYCB3ZSBhcmUgb3B0aW1pc3RpYyB0aGF0IHRoZVxyXG4gKiBjb3B5IHN1cHBsaWVkIGJ5IHRoZSB1c2VyIGV4aXN0cy5cclxuICovXHJcbkZTLkZpbGUucHJvdG90eXBlLmhhc1N0b3JlZCA9IGZ1bmN0aW9uKHN0b3JlTmFtZSwgb3B0aW1pc3RpYykge1xyXG4gIHZhciBzZWxmID0gdGhpcztcclxuICAvLyBNYWtlIHN1cmUgd2UgdXNlIHRoZSB1cGRhdGVkIGZpbGUgcmVjb3JkXHJcbiAgc2VsZi5nZXRGaWxlUmVjb3JkKCk7XHJcbiAgLy8gSWYgd2UgaGF2ZW50IHRoZSBwdWJsaXNoZWQgZGF0YSB0aGVuXHJcbiAgaWYgKEZTLlV0aWxpdHkuaXNFbXB0eShzZWxmLmNvcGllcykpIHtcclxuICAgIHJldHVybiAhIW9wdGltaXN0aWM7XHJcbiAgfVxyXG4gIGlmICh0eXBlb2Ygc3RvcmVOYW1lID09PSBcInN0cmluZ1wiKSB7XHJcbiAgICAvLyBSZXR1cm4gdHJ1ZSBvbmx5IGlmIHRoZSBga2V5YCBwcm9wZXJ0eSBpcyBwcmVzZW50LCB3aGljaCBpcyBub3Qgc2V0IHVudGlsXHJcbiAgICAvLyBzdG9yYWdlIGlzIGNvbXBsZXRlLlxyXG4gICAgcmV0dXJuICEhKHNlbGYuY29waWVzICYmIHNlbGYuY29waWVzW3N0b3JlTmFtZV0gJiYgc2VsZi5jb3BpZXNbc3RvcmVOYW1lXS5rZXkpO1xyXG4gIH1cclxuICByZXR1cm4gZmFsc2U7XHJcbn07XHJcblxyXG4vLyBCYWNrd2FyZHMgY29tcGF0aWJpbGl0eVxyXG5GUy5GaWxlLnByb3RvdHlwZS5oYXNDb3B5ID0gRlMuRmlsZS5wcm90b3R5cGUuaGFzU3RvcmVkO1xyXG5cclxuLyoqXHJcbiAqIEBtZXRob2QgRlMuRmlsZS5wcm90b3R5cGUuZ2V0Q29weUluZm9cclxuICogQHB1YmxpY1xyXG4gKiBAZGVwcmVjYXRlZCBVc2UgaW5kaXZpZHVhbCBtZXRob2RzIHdpdGggYHN0b3JlYCBvcHRpb24gaW5zdGVhZC5cclxuICogQHBhcmFtIHtzdHJpbmd9IHN0b3JlTmFtZSBOYW1lIG9mIHRoZSBzdG9yZSBmb3Igd2hpY2ggdG8gZ2V0IGNvcHkgaW5mby5cclxuICogQHJldHVybnMge09iamVjdH0gVGhlIGZpbGUgZGV0YWlscywgZS5nLiwgbmFtZSwgc2l6ZSwga2V5LCBldGMuLCBzcGVjaWZpYyB0byB0aGUgY29weSBzYXZlZCBpbiB0aGlzIHN0b3JlLlxyXG4gKi9cclxuRlMuRmlsZS5wcm90b3R5cGUuZ2V0Q29weUluZm8gPSBmdW5jdGlvbihzdG9yZU5hbWUpIHtcclxuICB2YXIgc2VsZiA9IHRoaXM7XHJcbiAgLy8gTWFrZSBzdXJlIHdlIHVzZSB0aGUgdXBkYXRlZCBmaWxlIHJlY29yZFxyXG4gIHNlbGYuZ2V0RmlsZVJlY29yZCgpO1xyXG4gIHJldHVybiAoc2VsZi5jb3BpZXMgJiYgc2VsZi5jb3BpZXNbc3RvcmVOYW1lXSkgfHwgbnVsbDtcclxufTtcclxuXHJcbi8qKlxyXG4gKiBAbWV0aG9kIEZTLkZpbGUucHJvdG90eXBlLl9nZXRJbmZvXHJcbiAqIEBwcml2YXRlXHJcbiAqIEBwYXJhbSB7U3RyaW5nfSBbc3RvcmVOYW1lXSBOYW1lIG9mIHRoZSBzdG9yZSBmb3Igd2hpY2ggdG8gZ2V0IGZpbGUgaW5mby4gT21pdCBmb3Igb3JpZ2luYWwgZmlsZSBkZXRhaWxzLlxyXG4gKiBAcGFyYW0ge09iamVjdH0gW29wdGlvbnNdXHJcbiAqIEBwYXJhbSB7Qm9vbGVhbn0gW29wdGlvbnMudXBkYXRlRmlsZVJlY29yZEZpcnN0PWZhbHNlXSBVcGRhdGUgdGhpcyBpbnN0YW5jZSB3aXRoIGRhdGEgZnJvbSB0aGUgREIgZmlyc3Q/XHJcbiAqIEByZXR1cm5zIHtPYmplY3R9IFRoZSBmaWxlIGRldGFpbHMsIGUuZy4sIG5hbWUsIHNpemUsIGtleSwgZXRjLiBJZiBub3QgZm91bmQsIHJldHVybnMgYW4gZW1wdHkgb2JqZWN0LlxyXG4gKi9cclxuRlMuRmlsZS5wcm90b3R5cGUuX2dldEluZm8gPSBmdW5jdGlvbihzdG9yZU5hbWUsIG9wdGlvbnMpIHtcclxuICB2YXIgc2VsZiA9IHRoaXM7XHJcbiAgb3B0aW9ucyA9IG9wdGlvbnMgfHwge307XHJcblxyXG4gIGlmIChvcHRpb25zLnVwZGF0ZUZpbGVSZWNvcmRGaXJzdCkge1xyXG4gICAgLy8gTWFrZSBzdXJlIHdlIHVzZSB0aGUgdXBkYXRlZCBmaWxlIHJlY29yZFxyXG4gICAgc2VsZi5nZXRGaWxlUmVjb3JkKCk7XHJcbiAgfVxyXG5cclxuICBpZiAoc3RvcmVOYW1lKSB7XHJcbiAgICByZXR1cm4gKHNlbGYuY29waWVzICYmIHNlbGYuY29waWVzW3N0b3JlTmFtZV0pIHx8IHt9O1xyXG4gIH0gZWxzZSB7XHJcbiAgICByZXR1cm4gc2VsZi5vcmlnaW5hbCB8fCB7fTtcclxuICB9XHJcbn07XHJcblxyXG4vKipcclxuICogQG1ldGhvZCBGUy5GaWxlLnByb3RvdHlwZS5fc2V0SW5mb1xyXG4gKiBAcHJpdmF0ZVxyXG4gKiBAcGFyYW0ge1N0cmluZ30gc3RvcmVOYW1lIC0gTmFtZSBvZiB0aGUgc3RvcmUgZm9yIHdoaWNoIHRvIHNldCBmaWxlIGluZm8uIE5vbi1zdHJpbmcgd2lsbCBzZXQgb3JpZ2luYWwgZmlsZSBkZXRhaWxzLlxyXG4gKiBAcGFyYW0ge1N0cmluZ30gcHJvcGVydHkgLSBQcm9wZXJ0eSB0byBzZXRcclxuICogQHBhcmFtIHtTdHJpbmd9IHZhbHVlIC0gTmV3IHZhbHVlIGZvciBwcm9wZXJ0eVxyXG4gKiBAcGFyYW0ge0Jvb2xlYW59IHNhdmUgLSBTaG91bGQgdGhlIG5ldyB2YWx1ZSBiZSBzYXZlZCB0byB0aGUgREIsIHRvbywgb3IganVzdCBzZXQgaW4gdGhlIEZTLkZpbGUgcHJvcGVydGllcz9cclxuICogQHJldHVybnMge3VuZGVmaW5lZH1cclxuICovXHJcbkZTLkZpbGUucHJvdG90eXBlLl9zZXRJbmZvID0gZnVuY3Rpb24oc3RvcmVOYW1lLCBwcm9wZXJ0eSwgdmFsdWUsIHNhdmUpIHtcclxuICB2YXIgc2VsZiA9IHRoaXM7XHJcbiAgaWYgKHR5cGVvZiBzdG9yZU5hbWUgPT09IFwic3RyaW5nXCIpIHtcclxuICAgIHNlbGYuY29waWVzID0gc2VsZi5jb3BpZXMgfHwge307XHJcbiAgICBzZWxmLmNvcGllc1tzdG9yZU5hbWVdID0gc2VsZi5jb3BpZXNbc3RvcmVOYW1lXSB8fCB7fTtcclxuICAgIHNlbGYuY29waWVzW3N0b3JlTmFtZV1bcHJvcGVydHldID0gdmFsdWU7XHJcbiAgICBzYXZlICYmIHNlbGYuX3NhdmVDaGFuZ2VzKHN0b3JlTmFtZSk7XHJcbiAgfSBlbHNlIHtcclxuICAgIHNlbGYub3JpZ2luYWwgPSBzZWxmLm9yaWdpbmFsIHx8IHt9O1xyXG4gICAgc2VsZi5vcmlnaW5hbFtwcm9wZXJ0eV0gPSB2YWx1ZTtcclxuICAgIHNhdmUgJiYgc2VsZi5fc2F2ZUNoYW5nZXMoXCJfb3JpZ2luYWxcIik7XHJcbiAgfVxyXG59O1xyXG5cclxuLyoqXHJcbiAqIEBtZXRob2QgRlMuRmlsZS5wcm90b3R5cGUubmFtZVxyXG4gKiBAcHVibGljXHJcbiAqIEBwYXJhbSB7U3RyaW5nfG51bGx9IFt2YWx1ZV0gLSBJZiBzZXR0aW5nIHRoZSBuYW1lLCBzcGVjaWZ5IHRoZSBuZXcgbmFtZSBhcyB0aGUgZmlyc3QgYXJndW1lbnQuIE90aGVyd2lzZSB0aGUgb3B0aW9ucyBhcmd1bWVudCBzaG91bGQgYmUgZmlyc3QuXHJcbiAqIEBwYXJhbSB7T2JqZWN0fSBbb3B0aW9uc11cclxuICogQHBhcmFtIHtPYmplY3R9IFtvcHRpb25zLnN0b3JlPW5vbmUsb3JpZ2luYWxdIC0gR2V0IG9yIHNldCB0aGUgbmFtZSBvZiB0aGUgdmVyc2lvbiBvZiB0aGUgZmlsZSB0aGF0IHdhcyBzYXZlZCBpbiB0aGlzIHN0b3JlLiBEZWZhdWx0IGlzIHRoZSBvcmlnaW5hbCBmaWxlIG5hbWUuXHJcbiAqIEBwYXJhbSB7Qm9vbGVhbn0gW29wdGlvbnMudXBkYXRlRmlsZVJlY29yZEZpcnN0PWZhbHNlXSBVcGRhdGUgdGhpcyBpbnN0YW5jZSB3aXRoIGRhdGEgZnJvbSB0aGUgREIgZmlyc3Q/IEFwcGxpZXMgdG8gZ2V0dGVyIHVzYWdlIG9ubHkuXHJcbiAqIEBwYXJhbSB7Qm9vbGVhbn0gW29wdGlvbnMuc2F2ZT10cnVlXSBTYXZlIGNoYW5nZSB0byBkYXRhYmFzZT8gQXBwbGllcyB0byBzZXR0ZXIgdXNhZ2Ugb25seS5cclxuICogQHJldHVybnMge1N0cmluZ3x1bmRlZmluZWR9IElmIHNldHRpbmcsIHJldHVybnMgYHVuZGVmaW5lZGAuIElmIGdldHRpbmcsIHJldHVybnMgdGhlIGZpbGUgbmFtZS5cclxuICovXHJcbkZTLkZpbGUucHJvdG90eXBlLm5hbWUgPSBmdW5jdGlvbih2YWx1ZSwgb3B0aW9ucykge1xyXG4gIHZhciBzZWxmID0gdGhpcztcclxuXHJcbiAgaWYgKCFvcHRpb25zICYmICgodHlwZW9mIHZhbHVlID09PSBcIm9iamVjdFwiICYmIHZhbHVlICE9PSBudWxsKSB8fCB0eXBlb2YgdmFsdWUgPT09IFwidW5kZWZpbmVkXCIpKSB7XHJcbiAgICAvLyBHRVRcclxuICAgIG9wdGlvbnMgPSB2YWx1ZSB8fCB7fTtcclxuICAgIG9wdGlvbnMgPSBvcHRpb25zLmhhc2ggfHwgb3B0aW9uczsgLy8gYWxsb3cgdXNlIGFzIFVJIGhlbHBlclxyXG4gICAgcmV0dXJuIHNlbGYuX2dldEluZm8ob3B0aW9ucy5zdG9yZSwgb3B0aW9ucykubmFtZTtcclxuICB9IGVsc2Uge1xyXG4gICAgLy8gU0VUXHJcbiAgICBvcHRpb25zID0gb3B0aW9ucyB8fCB7fTtcclxuICAgIHJldHVybiBzZWxmLl9zZXRJbmZvKG9wdGlvbnMuc3RvcmUsICduYW1lJywgdmFsdWUsIHR5cGVvZiBvcHRpb25zLnNhdmUgPT09IFwiYm9vbGVhblwiID8gb3B0aW9ucy5zYXZlIDogdHJ1ZSk7XHJcbiAgfVxyXG59O1xyXG5cclxuLyoqXHJcbiAqIEBtZXRob2QgRlMuRmlsZS5wcm90b3R5cGUuZXh0ZW5zaW9uXHJcbiAqIEBwdWJsaWNcclxuICogQHBhcmFtIHtTdHJpbmd8bnVsbH0gW3ZhbHVlXSAtIElmIHNldHRpbmcgdGhlIGV4dGVuc2lvbiwgc3BlY2lmeSB0aGUgbmV3IGV4dGVuc2lvbiAod2l0aG91dCBwZXJpb2QpIGFzIHRoZSBmaXJzdCBhcmd1bWVudC4gT3RoZXJ3aXNlIHRoZSBvcHRpb25zIGFyZ3VtZW50IHNob3VsZCBiZSBmaXJzdC5cclxuICogQHBhcmFtIHtPYmplY3R9IFtvcHRpb25zXVxyXG4gKiBAcGFyYW0ge09iamVjdH0gW29wdGlvbnMuc3RvcmU9bm9uZSxvcmlnaW5hbF0gLSBHZXQgb3Igc2V0IHRoZSBleHRlbnNpb24gb2YgdGhlIHZlcnNpb24gb2YgdGhlIGZpbGUgdGhhdCB3YXMgc2F2ZWQgaW4gdGhpcyBzdG9yZS4gRGVmYXVsdCBpcyB0aGUgb3JpZ2luYWwgZmlsZSBleHRlbnNpb24uXHJcbiAqIEBwYXJhbSB7Qm9vbGVhbn0gW29wdGlvbnMudXBkYXRlRmlsZVJlY29yZEZpcnN0PWZhbHNlXSBVcGRhdGUgdGhpcyBpbnN0YW5jZSB3aXRoIGRhdGEgZnJvbSB0aGUgREIgZmlyc3Q/IEFwcGxpZXMgdG8gZ2V0dGVyIHVzYWdlIG9ubHkuXHJcbiAqIEBwYXJhbSB7Qm9vbGVhbn0gW29wdGlvbnMuc2F2ZT10cnVlXSBTYXZlIGNoYW5nZSB0byBkYXRhYmFzZT8gQXBwbGllcyB0byBzZXR0ZXIgdXNhZ2Ugb25seS5cclxuICogQHJldHVybnMge1N0cmluZ3x1bmRlZmluZWR9IElmIHNldHRpbmcsIHJldHVybnMgYHVuZGVmaW5lZGAuIElmIGdldHRpbmcsIHJldHVybnMgdGhlIGZpbGUgZXh0ZW5zaW9uIG9yIGFuIGVtcHR5IHN0cmluZyBpZiB0aGVyZSBpc24ndCBvbmUuXHJcbiAqL1xyXG5GUy5GaWxlLnByb3RvdHlwZS5leHRlbnNpb24gPSBmdW5jdGlvbih2YWx1ZSwgb3B0aW9ucykge1xyXG4gIHZhciBzZWxmID0gdGhpcztcclxuXHJcbiAgaWYgKCFvcHRpb25zICYmICgodHlwZW9mIHZhbHVlID09PSBcIm9iamVjdFwiICYmIHZhbHVlICE9PSBudWxsKSB8fCB0eXBlb2YgdmFsdWUgPT09IFwidW5kZWZpbmVkXCIpKSB7XHJcbiAgICAvLyBHRVRcclxuICAgIG9wdGlvbnMgPSB2YWx1ZSB8fCB7fTtcclxuICAgIHJldHVybiBGUy5VdGlsaXR5LmdldEZpbGVFeHRlbnNpb24oc2VsZi5uYW1lKG9wdGlvbnMpIHx8ICcnKTtcclxuICB9IGVsc2Uge1xyXG4gICAgLy8gU0VUXHJcbiAgICBvcHRpb25zID0gb3B0aW9ucyB8fCB7fTtcclxuICAgIHZhciBuZXdOYW1lID0gRlMuVXRpbGl0eS5zZXRGaWxlRXh0ZW5zaW9uKHNlbGYubmFtZShvcHRpb25zKSB8fCAnJywgdmFsdWUpO1xyXG4gICAgcmV0dXJuIHNlbGYuX3NldEluZm8ob3B0aW9ucy5zdG9yZSwgJ25hbWUnLCBuZXdOYW1lLCB0eXBlb2Ygb3B0aW9ucy5zYXZlID09PSBcImJvb2xlYW5cIiA/IG9wdGlvbnMuc2F2ZSA6IHRydWUpO1xyXG4gIH1cclxufTtcclxuXHJcbi8qKlxyXG4gKiBAbWV0aG9kIEZTLkZpbGUucHJvdG90eXBlLnNpemVcclxuICogQHB1YmxpY1xyXG4gKiBAcGFyYW0ge051bWJlcn0gW3ZhbHVlXSAtIElmIHNldHRpbmcgdGhlIHNpemUsIHNwZWNpZnkgdGhlIG5ldyBzaXplIGluIGJ5dGVzIGFzIHRoZSBmaXJzdCBhcmd1bWVudC4gT3RoZXJ3aXNlIHRoZSBvcHRpb25zIGFyZ3VtZW50IHNob3VsZCBiZSBmaXJzdC5cclxuICogQHBhcmFtIHtPYmplY3R9IFtvcHRpb25zXVxyXG4gKiBAcGFyYW0ge09iamVjdH0gW29wdGlvbnMuc3RvcmU9bm9uZSxvcmlnaW5hbF0gLSBHZXQgb3Igc2V0IHRoZSBzaXplIG9mIHRoZSB2ZXJzaW9uIG9mIHRoZSBmaWxlIHRoYXQgd2FzIHNhdmVkIGluIHRoaXMgc3RvcmUuIERlZmF1bHQgaXMgdGhlIG9yaWdpbmFsIGZpbGUgc2l6ZS5cclxuICogQHBhcmFtIHtCb29sZWFufSBbb3B0aW9ucy51cGRhdGVGaWxlUmVjb3JkRmlyc3Q9ZmFsc2VdIFVwZGF0ZSB0aGlzIGluc3RhbmNlIHdpdGggZGF0YSBmcm9tIHRoZSBEQiBmaXJzdD8gQXBwbGllcyB0byBnZXR0ZXIgdXNhZ2Ugb25seS5cclxuICogQHBhcmFtIHtCb29sZWFufSBbb3B0aW9ucy5zYXZlPXRydWVdIFNhdmUgY2hhbmdlIHRvIGRhdGFiYXNlPyBBcHBsaWVzIHRvIHNldHRlciB1c2FnZSBvbmx5LlxyXG4gKiBAcmV0dXJucyB7TnVtYmVyfHVuZGVmaW5lZH0gSWYgc2V0dGluZywgcmV0dXJucyBgdW5kZWZpbmVkYC4gSWYgZ2V0dGluZywgcmV0dXJucyB0aGUgZmlsZSBzaXplLlxyXG4gKi9cclxuRlMuRmlsZS5wcm90b3R5cGUuc2l6ZSA9IGZ1bmN0aW9uKHZhbHVlLCBvcHRpb25zKSB7XHJcbiAgdmFyIHNlbGYgPSB0aGlzO1xyXG5cclxuICBpZiAoIW9wdGlvbnMgJiYgKCh0eXBlb2YgdmFsdWUgPT09IFwib2JqZWN0XCIgJiYgdmFsdWUgIT09IG51bGwpIHx8IHR5cGVvZiB2YWx1ZSA9PT0gXCJ1bmRlZmluZWRcIikpIHtcclxuICAgIC8vIEdFVFxyXG4gICAgb3B0aW9ucyA9IHZhbHVlIHx8IHt9O1xyXG4gICAgb3B0aW9ucyA9IG9wdGlvbnMuaGFzaCB8fCBvcHRpb25zOyAvLyBhbGxvdyB1c2UgYXMgVUkgaGVscGVyXHJcbiAgICByZXR1cm4gc2VsZi5fZ2V0SW5mbyhvcHRpb25zLnN0b3JlLCBvcHRpb25zKS5zaXplO1xyXG4gIH0gZWxzZSB7XHJcbiAgICAvLyBTRVRcclxuICAgIG9wdGlvbnMgPSBvcHRpb25zIHx8IHt9O1xyXG4gICAgcmV0dXJuIHNlbGYuX3NldEluZm8ob3B0aW9ucy5zdG9yZSwgJ3NpemUnLCB2YWx1ZSwgdHlwZW9mIG9wdGlvbnMuc2F2ZSA9PT0gXCJib29sZWFuXCIgPyBvcHRpb25zLnNhdmUgOiB0cnVlKTtcclxuICB9XHJcbn07XHJcblxyXG4vKipcclxuICogQG1ldGhvZCBGUy5GaWxlLnByb3RvdHlwZS50eXBlXHJcbiAqIEBwdWJsaWNcclxuICogQHBhcmFtIHtTdHJpbmd9IFt2YWx1ZV0gLSBJZiBzZXR0aW5nIHRoZSB0eXBlLCBzcGVjaWZ5IHRoZSBuZXcgdHlwZSBhcyB0aGUgZmlyc3QgYXJndW1lbnQuIE90aGVyd2lzZSB0aGUgb3B0aW9ucyBhcmd1bWVudCBzaG91bGQgYmUgZmlyc3QuXHJcbiAqIEBwYXJhbSB7T2JqZWN0fSBbb3B0aW9uc11cclxuICogQHBhcmFtIHtPYmplY3R9IFtvcHRpb25zLnN0b3JlPW5vbmUsb3JpZ2luYWxdIC0gR2V0IG9yIHNldCB0aGUgdHlwZSBvZiB0aGUgdmVyc2lvbiBvZiB0aGUgZmlsZSB0aGF0IHdhcyBzYXZlZCBpbiB0aGlzIHN0b3JlLiBEZWZhdWx0IGlzIHRoZSBvcmlnaW5hbCBmaWxlIHR5cGUuXHJcbiAqIEBwYXJhbSB7Qm9vbGVhbn0gW29wdGlvbnMudXBkYXRlRmlsZVJlY29yZEZpcnN0PWZhbHNlXSBVcGRhdGUgdGhpcyBpbnN0YW5jZSB3aXRoIGRhdGEgZnJvbSB0aGUgREIgZmlyc3Q/IEFwcGxpZXMgdG8gZ2V0dGVyIHVzYWdlIG9ubHkuXHJcbiAqIEBwYXJhbSB7Qm9vbGVhbn0gW29wdGlvbnMuc2F2ZT10cnVlXSBTYXZlIGNoYW5nZSB0byBkYXRhYmFzZT8gQXBwbGllcyB0byBzZXR0ZXIgdXNhZ2Ugb25seS5cclxuICogQHJldHVybnMge1N0cmluZ3x1bmRlZmluZWR9IElmIHNldHRpbmcsIHJldHVybnMgYHVuZGVmaW5lZGAuIElmIGdldHRpbmcsIHJldHVybnMgdGhlIGZpbGUgdHlwZS5cclxuICovXHJcbkZTLkZpbGUucHJvdG90eXBlLnR5cGUgPSBmdW5jdGlvbih2YWx1ZSwgb3B0aW9ucykge1xyXG4gIHZhciBzZWxmID0gdGhpcztcclxuXHJcbiAgaWYgKCFvcHRpb25zICYmICgodHlwZW9mIHZhbHVlID09PSBcIm9iamVjdFwiICYmIHZhbHVlICE9PSBudWxsKSB8fCB0eXBlb2YgdmFsdWUgPT09IFwidW5kZWZpbmVkXCIpKSB7XHJcbiAgICAvLyBHRVRcclxuICAgIG9wdGlvbnMgPSB2YWx1ZSB8fCB7fTtcclxuICAgIG9wdGlvbnMgPSBvcHRpb25zLmhhc2ggfHwgb3B0aW9uczsgLy8gYWxsb3cgdXNlIGFzIFVJIGhlbHBlclxyXG4gICAgcmV0dXJuIHNlbGYuX2dldEluZm8ob3B0aW9ucy5zdG9yZSwgb3B0aW9ucykudHlwZTtcclxuICB9IGVsc2Uge1xyXG4gICAgLy8gU0VUXHJcbiAgICBvcHRpb25zID0gb3B0aW9ucyB8fCB7fTtcclxuICAgIHJldHVybiBzZWxmLl9zZXRJbmZvKG9wdGlvbnMuc3RvcmUsICd0eXBlJywgdmFsdWUsIHR5cGVvZiBvcHRpb25zLnNhdmUgPT09IFwiYm9vbGVhblwiID8gb3B0aW9ucy5zYXZlIDogdHJ1ZSk7XHJcbiAgfVxyXG59O1xyXG5cclxuLyoqXHJcbiAqIEBtZXRob2QgRlMuRmlsZS5wcm90b3R5cGUudXBkYXRlZEF0XHJcbiAqIEBwdWJsaWNcclxuICogQHBhcmFtIHtTdHJpbmd9IFt2YWx1ZV0gLSBJZiBzZXR0aW5nIHVwZGF0ZWRBdCwgc3BlY2lmeSB0aGUgbmV3IGRhdGUgYXMgdGhlIGZpcnN0IGFyZ3VtZW50LiBPdGhlcndpc2UgdGhlIG9wdGlvbnMgYXJndW1lbnQgc2hvdWxkIGJlIGZpcnN0LlxyXG4gKiBAcGFyYW0ge09iamVjdH0gW29wdGlvbnNdXHJcbiAqIEBwYXJhbSB7T2JqZWN0fSBbb3B0aW9ucy5zdG9yZT1ub25lLG9yaWdpbmFsXSAtIEdldCBvciBzZXQgdGhlIGxhc3QgdXBkYXRlZCBkYXRlIGZvciB0aGUgdmVyc2lvbiBvZiB0aGUgZmlsZSB0aGF0IHdhcyBzYXZlZCBpbiB0aGlzIHN0b3JlLiBEZWZhdWx0IGlzIHRoZSBvcmlnaW5hbCBsYXN0IHVwZGF0ZWQgZGF0ZS5cclxuICogQHBhcmFtIHtCb29sZWFufSBbb3B0aW9ucy51cGRhdGVGaWxlUmVjb3JkRmlyc3Q9ZmFsc2VdIFVwZGF0ZSB0aGlzIGluc3RhbmNlIHdpdGggZGF0YSBmcm9tIHRoZSBEQiBmaXJzdD8gQXBwbGllcyB0byBnZXR0ZXIgdXNhZ2Ugb25seS5cclxuICogQHBhcmFtIHtCb29sZWFufSBbb3B0aW9ucy5zYXZlPXRydWVdIFNhdmUgY2hhbmdlIHRvIGRhdGFiYXNlPyBBcHBsaWVzIHRvIHNldHRlciB1c2FnZSBvbmx5LlxyXG4gKiBAcmV0dXJucyB7U3RyaW5nfHVuZGVmaW5lZH0gSWYgc2V0dGluZywgcmV0dXJucyBgdW5kZWZpbmVkYC4gSWYgZ2V0dGluZywgcmV0dXJucyB0aGUgZmlsZSdzIGxhc3QgdXBkYXRlZCBkYXRlLlxyXG4gKi9cclxuRlMuRmlsZS5wcm90b3R5cGUudXBkYXRlZEF0ID0gZnVuY3Rpb24odmFsdWUsIG9wdGlvbnMpIHtcclxuICB2YXIgc2VsZiA9IHRoaXM7XHJcblxyXG4gIGlmICghb3B0aW9ucyAmJiAoKHR5cGVvZiB2YWx1ZSA9PT0gXCJvYmplY3RcIiAmJiB2YWx1ZSAhPT0gbnVsbCAmJiAhKHZhbHVlIGluc3RhbmNlb2YgRGF0ZSkpIHx8IHR5cGVvZiB2YWx1ZSA9PT0gXCJ1bmRlZmluZWRcIikpIHtcclxuICAgIC8vIEdFVFxyXG4gICAgb3B0aW9ucyA9IHZhbHVlIHx8IHt9O1xyXG4gICAgb3B0aW9ucyA9IG9wdGlvbnMuaGFzaCB8fCBvcHRpb25zOyAvLyBhbGxvdyB1c2UgYXMgVUkgaGVscGVyXHJcbiAgICByZXR1cm4gc2VsZi5fZ2V0SW5mbyhvcHRpb25zLnN0b3JlLCBvcHRpb25zKS51cGRhdGVkQXQ7XHJcbiAgfSBlbHNlIHtcclxuICAgIC8vIFNFVFxyXG4gICAgb3B0aW9ucyA9IG9wdGlvbnMgfHwge307XHJcbiAgICByZXR1cm4gc2VsZi5fc2V0SW5mbyhvcHRpb25zLnN0b3JlLCAndXBkYXRlZEF0JywgdmFsdWUsIHR5cGVvZiBvcHRpb25zLnNhdmUgPT09IFwiYm9vbGVhblwiID8gb3B0aW9ucy5zYXZlIDogdHJ1ZSk7XHJcbiAgfVxyXG59O1xyXG5cclxuLyoqXHJcbiAqIEBtZXRob2QgRlMuRmlsZS5vblN0b3JlZENhbGxiYWNrXHJcbiAqIEBzdW1tYXJ5IENhbGxzIGNhbGxiYWNrIHdoZW4gdGhlIGZpbGUgaXMgZnVsbHkgc3RvcmVkIHRvIHRoZSBzcGVjaWZ5IHN0b3JlTmFtZVxyXG4gKiBAcHVibGljXHJcbiAqIEBwYXJhbSB7U3RyaW5nfSBbc3RvcmVOYW1lXSAtIFRoZSBuYW1lIG9mIHRoZSBmaWxlIHN0b3JlIHdlIHdhbnQgdG8gZ2V0IGNhbGxlZCB3aGVuIHN0b3JlZC5cclxuICogQHBhcmFtIHtmdW5jdGlvbn0gW2NhbGxiYWNrXVxyXG4gKi9cclxuRlMuRmlsZS5wcm90b3R5cGUub25TdG9yZWRDYWxsYmFjayA9IGZ1bmN0aW9uIChzdG9yZU5hbWUsIGNhbGxiYWNrKSB7XHJcbiAgLy8gQ2hlY2sgZmlsZSBpcyBub3QgYWxyZWFkeSBzdG9yZWRcclxuICBpZiAodGhpcy5oYXNTdG9yZWQoc3RvcmVOYW1lKSkge1xyXG4gICAgY2FsbGJhY2soKTtcclxuICAgIHJldHVybjtcclxuICB9XHJcbiAgaWYgKE1ldGVvci5pc1NlcnZlcikge1xyXG4gICAgLy8gTGlzdGVuIHRvIGZpbGUgc3RvcmVkIGV2ZW50c1xyXG4gICAgLy8gVE9ETyBSZXF1aXJlIHRoaW5raW5nIHdoZXRoZXIgaXQgaXMgYmV0dGVyIHRvIHVzZSBvYnNlcnZlciBmb3IgY2FzZSBvZiB1c2luZyBtdWx0aXBsZSBhcHBsaWNhdGlvbiBpbnN0YW5jZXMsIEFzayBmb3Igc2FtZSBpbWFnZSB1cmwgd2hpbGUgdXBsb2FkIGlzIGJlaW5nIGRvbmUuXHJcbiAgICB0aGlzLm9uKCdzdG9yZWQnLCBmdW5jdGlvbiAobmV3U3RvcmVOYW1lKSB7XHJcbiAgICAgIC8vIElmIHN0b3JlZCBpcyBjb21wbGV0ZWQgdG8gdGhlIHNwZWNpZmllZCBzdG9yZSBjYWxsIGNhbGxiYWNrXHJcbiAgICAgIGlmIChzdG9yZU5hbWUgPT09IG5ld1N0b3JlTmFtZSkge1xyXG4gICAgICAgIC8vIFJlbW92ZSB0aGUgc3BlY2lmaWVkIGZpbGUgc3RvcmVkIGxpc3RlbmVyXHJcbiAgICAgICAgdGhpcy5yZW1vdmVMaXN0ZW5lcignc3RvcmVkJywgYXJndW1lbnRzLmNhbGxlZSk7XHJcbiAgICAgICAgY2FsbGJhY2soKTtcclxuICAgICAgfVxyXG4gICAgfS5iaW5kKHRoaXMpXHJcbiAgICApO1xyXG4gIH0gZWxzZSB7XHJcbiAgICB2YXIgZmlsZUlkID0gdGhpcy5faWQsXHJcbiAgICAgICAgY29sbGVjdGlvbk5hbWUgPSB0aGlzLmNvbGxlY3Rpb25OYW1lO1xyXG4gICAgLy8gV2FpdCBmb3IgZmlsZSB0byBiZSBmdWxseSB1cGxvYWRlZFxyXG4gICAgVHJhY2tlci5hdXRvcnVuKGZ1bmN0aW9uIChjKSB7XHJcbiAgICAgIE1ldGVvci5jYWxsKCdfY2ZzX3JldHVybldoZW5TdG9yZWQnLCBjb2xsZWN0aW9uTmFtZSwgZmlsZUlkLCBzdG9yZU5hbWUsIGZ1bmN0aW9uIChlcnJvciwgcmVzdWx0KSB7XHJcbiAgICAgICAgaWYgKHJlc3VsdCAmJiByZXN1bHQgPT09IHRydWUpIHtcclxuICAgICAgICAgIGMuc3RvcCgpO1xyXG4gICAgICAgICAgY2FsbGJhY2soKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgTWV0ZW9yLnNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICBjLmludmFsaWRhdGUoKTtcclxuICAgICAgICAgIH0sIDEwMCk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9KTtcclxuICAgIH0pO1xyXG4gIH1cclxufTtcclxuXHJcbi8qKlxyXG4gKiBAbWV0aG9kIEZTLkZpbGUub25TdG9yZWRcclxuICogQHN1bW1hcnkgRnVuY3Rpb24gdGhhdCByZXR1cm5zIHdoZW4gdGhlIGZpbGUgaXMgZnVsbHkgc3RvcmVkIHRvIHRoZSBzcGVjaWZ5IHN0b3JlTmFtZVxyXG4gKiBAcHVibGljXHJcbiAqIEBwYXJhbSB7U3RyaW5nfSBzdG9yZU5hbWUgLSBUaGUgbmFtZSBvZiB0aGUgZmlsZSBzdG9yZSB3ZSB3YW50IHRvIGdldCBjYWxsZWQgd2hlbiBzdG9yZWQuXHJcbiAqXHJcbiAqIEZ1bmN0aW9uIHRoYXQgcmV0dXJucyB3aGVuIHRoZSBmaWxlIGlzIGZ1bGx5IHN0b3JlZCB0byB0aGUgc3BlY2lmeSBzdG9yZU5hbWUuXHJcbiAqXHJcbiAqIEZvciBleGFtcGxlIG5lZWRlZCBpZiB3YW50ZWQgdG8gc2F2ZSB0aGUgZGlyZWN0IGxpbmsgdG8gYSBmaWxlIG9uIHMzIHdoZW4gZnVsbHkgdXBsb2FkZWQuXHJcbiAqL1xyXG5GUy5GaWxlLnByb3RvdHlwZS5vblN0b3JlZCA9IGZ1bmN0aW9uIChhcmd1bWVudHMpIHtcclxuICB2YXIgb25TdG9yZWRTeW5jID0gTWV0ZW9yLndyYXBBc3luYyh0aGlzLm9uU3RvcmVkQ2FsbGJhY2spO1xyXG4gIHJldHVybiBvblN0b3JlZFN5bmMuY2FsbCh0aGlzLCBhcmd1bWVudHMpO1xyXG59O1xyXG5cclxuZnVuY3Rpb24gaXNCYXNpY09iamVjdChvYmopIHtcclxuICByZXR1cm4gKG9iaiA9PT0gT2JqZWN0KG9iaikgJiYgT2JqZWN0LmdldFByb3RvdHlwZU9mKG9iaikgPT09IE9iamVjdC5wcm90b3R5cGUpO1xyXG59XHJcblxyXG4vLyBnZXRQcm90b3R5cGVPZiBwb2x5ZmlsbFxyXG5pZiAodHlwZW9mIE9iamVjdC5nZXRQcm90b3R5cGVPZiAhPT0gXCJmdW5jdGlvblwiKSB7XHJcbiAgaWYgKHR5cGVvZiBcIlwiLl9fcHJvdG9fXyA9PT0gXCJvYmplY3RcIikge1xyXG4gICAgT2JqZWN0LmdldFByb3RvdHlwZU9mID0gZnVuY3Rpb24ob2JqZWN0KSB7XHJcbiAgICAgIHJldHVybiBvYmplY3QuX19wcm90b19fO1xyXG4gICAgfTtcclxuICB9IGVsc2Uge1xyXG4gICAgT2JqZWN0LmdldFByb3RvdHlwZU9mID0gZnVuY3Rpb24ob2JqZWN0KSB7XHJcbiAgICAgIC8vIE1heSBicmVhayBpZiB0aGUgY29uc3RydWN0b3IgaGFzIGJlZW4gdGFtcGVyZWQgd2l0aFxyXG4gICAgICByZXR1cm4gb2JqZWN0LmNvbnN0cnVjdG9yLnByb3RvdHlwZTtcclxuICAgIH07XHJcbiAgfVxyXG59XHJcblxyXG5cclxuIiwiLyoqXHJcbiAqIE5vdGVzIGEgZGV0YWlscyBhYm91dCBhIHN0b3JhZ2UgYWRhcHRlciBmYWlsdXJlIHdpdGhpbiB0aGUgZmlsZSByZWNvcmRcclxuICogQHBhcmFtIHtzdHJpbmd9IHN0b3JlTmFtZVxyXG4gKiBAcGFyYW0ge251bWJlcn0gbWF4VHJpZXNcclxuICogQHJldHVybiB7dW5kZWZpbmVkfVxyXG4gKiBAdG9kbyBkZXByZWNhdGUgdGhpc1xyXG4gKi9cclxuRlMuRmlsZS5wcm90b3R5cGUubG9nQ29weUZhaWx1cmUgPSBmdW5jdGlvbihzdG9yZU5hbWUsIG1heFRyaWVzKSB7XHJcbiAgdmFyIHNlbGYgPSB0aGlzO1xyXG5cclxuICAvLyBoYXNTdG9yZWQgd2lsbCB1cGRhdGUgZnJvbSB0aGUgZmlsZVJlY29yZFxyXG4gIGlmIChzZWxmLmhhc1N0b3JlZChzdG9yZU5hbWUpKSB7XHJcbiAgICB0aHJvdyBuZXcgRXJyb3IoXCJsb2dDb3B5RmFpbHVyZTogaW52YWxpZCBzdG9yZU5hbWVcIik7XHJcbiAgfVxyXG5cclxuICAvLyBNYWtlIHN1cmUgd2UgaGF2ZSBhIHRlbXBvcmFyeSBmaWxlIHNhdmVkIHNpbmNlIHdlIHdpbGwgYmVcclxuICAvLyB0cnlpbmcgdGhlIHNhdmUgYWdhaW4uXHJcbiAgRlMuVGVtcFN0b3JlLmVuc3VyZUZvckZpbGUoc2VsZik7XHJcblxyXG4gIHZhciBub3cgPSBuZXcgRGF0ZSgpO1xyXG4gIHZhciBjdXJyZW50Q291bnQgPSAoc2VsZi5mYWlsdXJlcyAmJiBzZWxmLmZhaWx1cmVzLmNvcGllcyAmJiBzZWxmLmZhaWx1cmVzLmNvcGllc1tzdG9yZU5hbWVdICYmIHR5cGVvZiBzZWxmLmZhaWx1cmVzLmNvcGllc1tzdG9yZU5hbWVdLmNvdW50ID09PSBcIm51bWJlclwiKSA/IHNlbGYuZmFpbHVyZXMuY29waWVzW3N0b3JlTmFtZV0uY291bnQgOiAwO1xyXG4gIG1heFRyaWVzID0gbWF4VHJpZXMgfHwgNTtcclxuXHJcbiAgdmFyIG1vZGlmaWVyID0ge307XHJcbiAgbW9kaWZpZXIuJHNldCA9IHt9O1xyXG4gIG1vZGlmaWVyLiRzZXRbJ2ZhaWx1cmVzLmNvcGllcy4nICsgc3RvcmVOYW1lICsgJy5sYXN0QXR0ZW1wdCddID0gbm93O1xyXG4gIGlmIChjdXJyZW50Q291bnQgPT09IDApIHtcclxuICAgIG1vZGlmaWVyLiRzZXRbJ2ZhaWx1cmVzLmNvcGllcy4nICsgc3RvcmVOYW1lICsgJy5maXJzdEF0dGVtcHQnXSA9IG5vdztcclxuICB9XHJcbiAgbW9kaWZpZXIuJHNldFsnZmFpbHVyZXMuY29waWVzLicgKyBzdG9yZU5hbWUgKyAnLmNvdW50J10gPSBjdXJyZW50Q291bnQgKyAxO1xyXG4gIG1vZGlmaWVyLiRzZXRbJ2ZhaWx1cmVzLmNvcGllcy4nICsgc3RvcmVOYW1lICsgJy5kb25lVHJ5aW5nJ10gPSAoY3VycmVudENvdW50ICsgMSA+PSBtYXhUcmllcyk7XHJcbiAgc2VsZi51cGRhdGUobW9kaWZpZXIpO1xyXG59O1xyXG5cclxuLyoqXHJcbiAqIEhhcyB0aGlzIHN0b3JlIHBlcm1hbmVudGx5IGZhaWxlZD9cclxuICogQHBhcmFtIHtTdHJpbmd9IHN0b3JlTmFtZSBUaGUgbmFtZSBvZiB0aGUgc3RvcmVcclxuICogQHJldHVybiB7Ym9vbGVhbn0gSGFzIHRoaXMgc3RvcmUgZmFpbGVkIHBlcm1hbmVudGx5P1xyXG4gKiBAdG9kbyBkZXByZWNhdGUgdGhpc1xyXG4gKi9cclxuRlMuRmlsZS5wcm90b3R5cGUuZmFpbGVkUGVybWFuZW50bHkgPSBmdW5jdGlvbihzdG9yZU5hbWUpIHtcclxuICB2YXIgc2VsZiA9IHRoaXM7XHJcbiAgcmV0dXJuICEhKHNlbGYuZmFpbHVyZXMgJiZcclxuICAgICAgICAgICAgc2VsZi5mYWlsdXJlcy5jb3BpZXMgJiZcclxuICAgICAgICAgICAgc2VsZi5mYWlsdXJlcy5jb3BpZXNbc3RvcmVOYW1lXSAmJlxyXG4gICAgICAgICAgICBzZWxmLmZhaWx1cmVzLmNvcGllc1tzdG9yZU5hbWVdLmRvbmVUcnlpbmcpO1xyXG59O1xyXG5cclxuLyoqXHJcbiAqIEBtZXRob2QgRlMuRmlsZS5wcm90b3R5cGUuY3JlYXRlUmVhZFN0cmVhbVxyXG4gKiBAcHVibGljXHJcbiAqIEBwYXJhbSB7U3RyaW5nfSBbc3RvcmVOYW1lXVxyXG4gKiBAcmV0dXJucyB7c3RyZWFtLlJlYWRhYmxlfSBSZWFkYWJsZSBOb2RlSlMgc3RyZWFtXHJcbiAqXHJcbiAqIFJldHVybnMgYSByZWFkYWJsZSBzdHJlYW0uIFdoZXJlIHRoZSBzdHJlYW0gcmVhZHMgZnJvbSBkZXBlbmRzIG9uIHRoZSBGUy5GaWxlIGluc3RhbmNlIGFuZCB3aGV0aGVyIHlvdSBwYXNzIGEgc3RvcmUgbmFtZS5cclxuICpcclxuICogKiBJZiB5b3UgcGFzcyBhIGBzdG9yZU5hbWVgLCBhIHJlYWRhYmxlIHN0cmVhbSBmb3IgdGhlIGZpbGUgZGF0YSBzYXZlZCBpbiB0aGF0IHN0b3JlIGlzIHJldHVybmVkLlxyXG4gKiAqIElmIHlvdSBkb24ndCBwYXNzIGEgYHN0b3JlTmFtZWAgYW5kIGRhdGEgaXMgYXR0YWNoZWQgdG8gdGhlIEZTLkZpbGUgaW5zdGFuY2UgKG9uIGBkYXRhYCBwcm9wZXJ0eSwgd2hpY2ggbXVzdCBiZSBhIERhdGFNYW4gaW5zdGFuY2UpLCB0aGVuIGEgcmVhZGFibGUgc3RyZWFtIGZvciB0aGUgYXR0YWNoZWQgZGF0YSBpcyByZXR1cm5lZC5cclxuICogKiBJZiB5b3UgZG9uJ3QgcGFzcyBhIGBzdG9yZU5hbWVgIGFuZCB0aGVyZSBpcyBubyBkYXRhIGF0dGFjaGVkIHRvIHRoZSBGUy5GaWxlIGluc3RhbmNlLCBhIHJlYWRhYmxlIHN0cmVhbSBmb3IgdGhlIGZpbGUgZGF0YSBjdXJyZW50bHkgaW4gdGhlIHRlbXBvcmFyeSBzdG9yZSAoYEZTLlRlbXBTdG9yZWApIGlzIHJldHVybmVkLlxyXG4gKlxyXG4gKi9cclxuRlMuRmlsZS5wcm90b3R5cGUuY3JlYXRlUmVhZFN0cmVhbSA9IGZ1bmN0aW9uKHN0b3JlTmFtZSkge1xyXG4gIHZhciBzZWxmID0gdGhpcztcclxuXHJcbiAgLy8gSWYgd2UgZG9udCBoYXZlIGEgc3RvcmUgbmFtZSBidXQgZ290IEJ1ZmZlciBkYXRhP1xyXG4gIGlmICghc3RvcmVOYW1lICYmIHNlbGYuZGF0YSkge1xyXG4gICAgRlMuZGVidWcgJiYgY29uc29sZS5sb2coXCJmaWxlT2JqLmNyZWF0ZVJlYWRTdHJlYW0gY3JlYXRpbmcgcmVhZCBzdHJlYW0gZm9yIGF0dGFjaGVkIGRhdGFcIik7XHJcbiAgICAvLyBTdHJlYW0gZnJvbSBhdHRhY2hlZCBkYXRhIGlmIHByZXNlbnRcclxuICAgIHJldHVybiBzZWxmLmRhdGEuY3JlYXRlUmVhZFN0cmVhbSgpO1xyXG4gIH0gZWxzZSBpZiAoIXN0b3JlTmFtZSAmJiBGUy5UZW1wU3RvcmUgJiYgRlMuVGVtcFN0b3JlLmV4aXN0cyhzZWxmKSkge1xyXG4gICAgRlMuZGVidWcgJiYgY29uc29sZS5sb2coXCJmaWxlT2JqLmNyZWF0ZVJlYWRTdHJlYW0gY3JlYXRpbmcgcmVhZCBzdHJlYW0gZm9yIHRlbXAgc3RvcmVcIik7XHJcbiAgICAvLyBTdHJlYW0gZnJvbSB0ZW1wIHN0b3JlIC0gaXRzIGEgYml0IHNsb3dlciB0aGFuIHJlZ3VsYXIgc3RyZWFtcz9cclxuICAgIHJldHVybiBGUy5UZW1wU3RvcmUuY3JlYXRlUmVhZFN0cmVhbShzZWxmKTtcclxuICB9IGVsc2Uge1xyXG4gICAgLy8gU3RyZWFtIGZyb20gdGhlIHN0b3JlIHVzaW5nIHN0b3JhZ2UgYWRhcHRlclxyXG4gICAgaWYgKHNlbGYuaXNNb3VudGVkKCkpIHtcclxuICAgICAgdmFyIHN0b3JhZ2UgPSBzZWxmLmNvbGxlY3Rpb24uc3RvcmVzTG9va3VwW3N0b3JlTmFtZV0gfHwgc2VsZi5jb2xsZWN0aW9uLnByaW1hcnlTdG9yZTtcclxuICAgICAgRlMuZGVidWcgJiYgY29uc29sZS5sb2coXCJmaWxlT2JqLmNyZWF0ZVJlYWRTdHJlYW0gY3JlYXRpbmcgcmVhZCBzdHJlYW0gZm9yIHN0b3JlXCIsIHN0b3JhZ2UubmFtZSk7XHJcbiAgICAgIC8vIHJldHVybiBzdHJlYW1cclxuICAgICAgcmV0dXJuIHN0b3JhZ2UuYWRhcHRlci5jcmVhdGVSZWFkU3RyZWFtKHNlbGYpO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcignRmlsZSBub3QgbW91bnRlZCcpO1xyXG4gICAgfVxyXG5cclxuICB9XHJcbn07XHJcblxyXG4vKipcclxuICogQG1ldGhvZCBGUy5GaWxlLnByb3RvdHlwZS5jcmVhdGVXcml0ZVN0cmVhbVxyXG4gKiBAcHVibGljXHJcbiAqIEBwYXJhbSB7U3RyaW5nfSBbc3RvcmVOYW1lXVxyXG4gKiBAcmV0dXJucyB7c3RyZWFtLldyaXRlYWJsZX0gV3JpdGVhYmxlIE5vZGVKUyBzdHJlYW1cclxuICpcclxuICogUmV0dXJucyBhIHdyaXRlYWJsZSBzdHJlYW0uIFdoZXJlIHRoZSBzdHJlYW0gd3JpdGVzIHRvIGRlcGVuZHMgb24gd2hldGhlciB5b3UgcGFzcyBpbiBhIHN0b3JlIG5hbWUuXHJcbiAqXHJcbiAqICogSWYgeW91IHBhc3MgYSBgc3RvcmVOYW1lYCwgYSB3cml0ZWFibGUgc3RyZWFtIGZvciAob3Zlcil3cml0aW5nIHRoZSBmaWxlIGRhdGEgaW4gdGhhdCBzdG9yZSBpcyByZXR1cm5lZC5cclxuICogKiBJZiB5b3UgZG9uJ3QgcGFzcyBhIGBzdG9yZU5hbWVgLCBhIHdyaXRlYWJsZSBzdHJlYW0gZm9yIHdyaXRpbmcgdG8gdGhlIHRlbXAgc3RvcmUgZm9yIHRoaXMgZmlsZSBpcyByZXR1cm5lZC5cclxuICpcclxuICovXHJcbkZTLkZpbGUucHJvdG90eXBlLmNyZWF0ZVdyaXRlU3RyZWFtID0gZnVuY3Rpb24oc3RvcmVOYW1lKSB7XHJcbiAgdmFyIHNlbGYgPSB0aGlzO1xyXG5cclxuICAvLyBXZSBoYXZlIHRvIGhhdmUgYSBtb3VudGVkIGZpbGUgaW4gb3JkZXIgZm9yIHRoaXMgdG8gd29ya1xyXG4gIGlmIChzZWxmLmlzTW91bnRlZCgpKSB7XHJcbiAgICBpZiAoIXN0b3JlTmFtZSAmJiBGUy5UZW1wU3RvcmUgJiYgRlMuRmlsZVdvcmtlcikge1xyXG4gICAgICAvLyBJZiB3ZSBoYXZlIHdvcmtlciBpbnN0YWxsZWQgLSB3ZSBwYXNzIHRoZSBmaWxlIHRvIEZTLlRlbXBTdG9yZVxyXG4gICAgICAvLyBXZSBkb250IG5lZWQgdGhlIHN0b3JlTmFtZSBzaW5jZSBhbGwgc3RvcmVzIHdpbGwgYmUgZ2VuZXJhdGVkIGZyb21cclxuICAgICAgLy8gVGVtcFN0b3JlLlxyXG4gICAgICAvLyBUaGlzIHNob3VsZCB0cmlnZ2VyIEZTLkZpbGVXb3JrZXIgYXQgc29tZSBwb2ludD9cclxuICAgICAgRlMuVGVtcFN0b3JlLmNyZWF0ZVdyaXRlU3RyZWFtKHNlbGYpO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgLy8gU3RyZWFtIGRpcmVjdGx5IHRvIHRoZSBzdG9yZSB1c2luZyBzdG9yYWdlIGFkYXB0ZXJcclxuICAgICAgdmFyIHN0b3JhZ2UgPSBzZWxmLmNvbGxlY3Rpb24uc3RvcmVzTG9va3VwW3N0b3JlTmFtZV0gfHwgc2VsZi5jb2xsZWN0aW9uLnByaW1hcnlTdG9yZTtcclxuICAgICAgcmV0dXJuIHN0b3JhZ2UuYWRhcHRlci5jcmVhdGVXcml0ZVN0cmVhbShzZWxmKTtcclxuICAgIH1cclxuICB9IGVsc2Uge1xyXG4gICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcignRmlsZSBub3QgbW91bnRlZCcpO1xyXG4gIH1cclxufTtcclxuXHJcbi8qKlxyXG4gKiBAbWV0aG9kIEZTLkZpbGUucHJvdG90eXBlLmNvcHkgTWFrZXMgYSBjb3B5IG9mIHRoZSBmaWxlIGFuZCB1bmRlcmx5aW5nIGRhdGEgaW4gYWxsIHN0b3Jlcy5cclxuICogQHB1YmxpY1xyXG4gKiBAcmV0dXJucyB7RlMuRmlsZX0gVGhlIG5ldyBGUy5GaWxlIGluc3RhbmNlXHJcbiAqL1xyXG5GUy5GaWxlLnByb3RvdHlwZS5jb3B5ID0gZnVuY3Rpb24oKSB7XHJcbiAgdmFyIHNlbGYgPSB0aGlzO1xyXG5cclxuICBpZiAoIXNlbGYuaXNNb3VudGVkKCkpIHtcclxuICAgIHRocm93IG5ldyBFcnJvcihcIkNhbm5vdCBjb3B5IGEgZmlsZSB0aGF0IGlzIG5vdCBhc3NvY2lhdGVkIHdpdGggYSBjb2xsZWN0aW9uXCIpO1xyXG4gIH1cclxuXHJcbiAgLy8gR2V0IHRoZSBmaWxlIHJlY29yZFxyXG4gIHZhciBmaWxlUmVjb3JkID0gc2VsZi5jb2xsZWN0aW9uLmZpbGVzLmZpbmRPbmUoe19pZDogc2VsZi5faWR9LCB7dHJhbnNmb3JtOiBudWxsfSkgfHwge307XHJcblxyXG4gIC8vIFJlbW92ZSBfaWQgYW5kIGNvcHkga2V5cyBmcm9tIHRoZSBmaWxlIHJlY29yZFxyXG4gIGRlbGV0ZSBmaWxlUmVjb3JkLl9pZDtcclxuXHJcbiAgLy8gSW5zZXJ0IGRpcmVjdGx5OyB3ZSBkb24ndCBoYXZlIGFjY2VzcyB0byBcIm9yaWdpbmFsXCIgaW4gdGhpcyBjYXNlXHJcbiAgdmFyIG5ld0lkID0gc2VsZi5jb2xsZWN0aW9uLmZpbGVzLmluc2VydChmaWxlUmVjb3JkKTtcclxuXHJcbiAgdmFyIG5ld0ZpbGUgPSBzZWxmLmNvbGxlY3Rpb24uZmluZE9uZShuZXdJZCk7XHJcblxyXG4gIC8vIENvcHkgdW5kZXJseWluZyBmaWxlcyBpbiB0aGUgc3RvcmVzXHJcbiAgdmFyIG1vZCwgb2xkS2V5O1xyXG4gIGZvciAodmFyIG5hbWUgaW4gbmV3RmlsZS5jb3BpZXMpIHtcclxuICAgIGlmIChuZXdGaWxlLmNvcGllcy5oYXNPd25Qcm9wZXJ0eShuYW1lKSkge1xyXG4gICAgICBvbGRLZXkgPSBuZXdGaWxlLmNvcGllc1tuYW1lXS5rZXk7XHJcbiAgICAgIGlmIChvbGRLZXkpIHtcclxuICAgICAgICAvLyBXZSBuZWVkIHRvIGFzayB0aGUgYWRhcHRlciBmb3IgdGhlIHRydWUgb2xkS2V5IGJlY2F1c2VcclxuICAgICAgICAvLyByaWdodCBub3cgZ3JpZGZzIGRvZXMgc29tZSBleHRyYSBzdHVmZi5cclxuICAgICAgICAvLyBUT0RPIEdyaWRGUyBzaG91bGQgcHJvYmFibHkgc2V0IHRoZSBmdWxsIGtleSBvYmplY3RcclxuICAgICAgICAvLyAod2l0aCBfaWQgYW5kIGZpbGVuYW1lKSBpbnRvIGBjb3BpZXMua2V5YFxyXG4gICAgICAgIC8vIHNvIHRoYXQgY29waWVzLmtleSBjYW4gYmUgcGFzc2VkIGRpcmVjdGx5IHRvXHJcbiAgICAgICAgLy8gY3JlYXRlUmVhZFN0cmVhbUZvckZpbGVLZXlcclxuICAgICAgICB2YXIgc291cmNlRmlsZVN0b3JhZ2UgPSBzZWxmLmNvbGxlY3Rpb24uc3RvcmVzTG9va3VwW25hbWVdO1xyXG4gICAgICAgIGlmICghc291cmNlRmlsZVN0b3JhZ2UpIHtcclxuICAgICAgICAgIHRocm93IG5ldyBFcnJvcihuYW1lICsgXCIgaXMgbm90IGEgdmFsaWQgc3RvcmUgbmFtZVwiKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgb2xkS2V5ID0gc291cmNlRmlsZVN0b3JhZ2UuYWRhcHRlci5maWxlS2V5KHNlbGYpO1xyXG4gICAgICAgIC8vIGRlbGV0ZSBzbyB0aGF0IG5ldyBmaWxlS2V5IHdpbGwgYmUgZ2VuZXJhdGVkIGluIGNvcHlTdG9yZURhdGFcclxuICAgICAgICBkZWxldGUgbmV3RmlsZS5jb3BpZXNbbmFtZV0ua2V5O1xyXG4gICAgICAgIG1vZCA9IG1vZCB8fCB7fTtcclxuICAgICAgICBtb2RbXCJjb3BpZXMuXCIgKyBuYW1lICsgXCIua2V5XCJdID0gY29weVN0b3JlRGF0YShuZXdGaWxlLCBuYW1lLCBvbGRLZXkpO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfVxyXG4gIC8vIFVwZGF0ZSBrZXlzIGluIHRoZSBmaWxlcmVjb3JkXHJcbiAgaWYgKG1vZCkge1xyXG4gICAgbmV3RmlsZS51cGRhdGUoeyRzZXQ6IG1vZH0pO1xyXG4gIH1cclxuXHJcbiAgcmV0dXJuIG5ld0ZpbGU7XHJcbn07XHJcblxyXG5NZXRlb3IubWV0aG9kcyh7XHJcbiAgLy8gRG9lcyBhIEhFQUQgcmVxdWVzdCB0byBVUkwgdG8gZ2V0IHRoZSB0eXBlLCB1cGRhdGVkQXQsXHJcbiAgLy8gYW5kIHNpemUgcHJpb3IgdG8gYWN0dWFsbHkgZG93bmxvYWRpbmcgdGhlIGRhdGEuXHJcbiAgLy8gVGhhdCB3YXkgd2UgY2FuIGRvIGZpbHRlciBjaGVja3Mgd2l0aG91dCBhY3R1YWxseSBkb3dubG9hZGluZy5cclxuICAnX2Nmc19nZXRVcmxJbmZvJzogZnVuY3Rpb24gKHVybCwgb3B0aW9ucykge1xyXG4gICAgY2hlY2sodXJsLCBTdHJpbmcpO1xyXG4gICAgY2hlY2sob3B0aW9ucywgT2JqZWN0KTtcclxuXHJcbiAgICB0aGlzLnVuYmxvY2soKTtcclxuXHJcbiAgICB2YXIgcmVzcG9uc2UgPSBIVFRQLmNhbGwoXCJIRUFEXCIsIHVybCwgb3B0aW9ucyk7XHJcbiAgICB2YXIgaGVhZGVycyA9IHJlc3BvbnNlLmhlYWRlcnM7XHJcbiAgICB2YXIgcmVzdWx0ID0ge307XHJcblxyXG4gICAgaWYgKGhlYWRlcnNbJ2NvbnRlbnQtdHlwZSddKSB7XHJcbiAgICAgIHJlc3VsdC50eXBlID0gaGVhZGVyc1snY29udGVudC10eXBlJ107XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKGhlYWRlcnNbJ2NvbnRlbnQtbGVuZ3RoJ10pIHtcclxuICAgICAgcmVzdWx0LnNpemUgPSAraGVhZGVyc1snY29udGVudC1sZW5ndGgnXTtcclxuICAgIH1cclxuXHJcbiAgICBpZiAoaGVhZGVyc1snbGFzdC1tb2RpZmllZCddKSB7XHJcbiAgICAgIHJlc3VsdC51cGRhdGVkQXQgPSBuZXcgRGF0ZShoZWFkZXJzWydsYXN0LW1vZGlmaWVkJ10pO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiByZXN1bHQ7XHJcbiAgfSxcclxuICAvLyBIZWxwZXIgZnVuY3Rpb24gdGhhdCBjaGVja3Mgd2hldGhlciBnaXZlbiBmaWxlSWQgZnJvbSBjb2xsZWN0aW9uTmFtZVxyXG4gIC8vICBJcyBmdWxseSB1cGxvYWRlZCB0byBzcGVjaWZ5IHN0b3JlTmFtZS5cclxuICAnX2Nmc19yZXR1cm5XaGVuU3RvcmVkJyA6IGZ1bmN0aW9uIChjb2xsZWN0aW9uTmFtZSwgZmlsZUlkLCBzdG9yZU5hbWUpIHtcclxuICAgIGNoZWNrKGNvbGxlY3Rpb25OYW1lLCBTdHJpbmcpO1xyXG4gICAgY2hlY2soZmlsZUlkLCBTdHJpbmcpO1xyXG4gICAgY2hlY2soc3RvcmVOYW1lLCBTdHJpbmcpO1xyXG5cclxuICAgIHZhciBjb2xsZWN0aW9uID0gRlMuX2NvbGxlY3Rpb25zW2NvbGxlY3Rpb25OYW1lXTtcclxuICAgIGlmICghY29sbGVjdGlvbikge1xyXG4gICAgICByZXR1cm4gTWV0ZW9yLkVycm9yKCdfY2ZzX3JldHVybldoZW5TdG9yZWQ6IEZTQ29sbGVjdGlvbiBuYW1lIG5vdCBleGlzdHMnKTtcclxuICAgIH1cclxuXHJcbiAgICB2YXIgZmlsZSA9IGNvbGxlY3Rpb24uZmluZE9uZSh7X2lkOiBmaWxlSWR9KTtcclxuICAgIGlmICghZmlsZSkge1xyXG4gICAgICByZXR1cm4gTWV0ZW9yLkVycm9yKCdfY2ZzX3JldHVybldoZW5TdG9yZWQ6IEZTRmlsZSBub3QgZXhpc3RzJyk7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gZmlsZS5oYXNTdG9yZWQoc3RvcmVOYW1lKTtcclxuICB9XHJcbn0pO1xyXG5cclxuLy8gVE9ETyBtYXliZSB0aGlzIHNob3VsZCBiZSBpbiBjZnMtc3RvcmFnZS1hZGFwdGVyXHJcbmZ1bmN0aW9uIF9jb3B5U3RvcmVEYXRhKGZpbGVPYmosIHN0b3JlTmFtZSwgc291cmNlS2V5LCBjYWxsYmFjaykge1xyXG4gIGlmICghZmlsZU9iai5pc01vdW50ZWQoKSkge1xyXG4gICAgdGhyb3cgbmV3IEVycm9yKFwiQ2Fubm90IGNvcHkgc3RvcmUgZGF0YSBmb3IgYSBmaWxlIHRoYXQgaXMgbm90IGFzc29jaWF0ZWQgd2l0aCBhIGNvbGxlY3Rpb25cIik7XHJcbiAgfVxyXG5cclxuICB2YXIgc3RvcmFnZSA9IGZpbGVPYmouY29sbGVjdGlvbi5zdG9yZXNMb29rdXBbc3RvcmVOYW1lXTtcclxuICBpZiAoIXN0b3JhZ2UpIHtcclxuICAgIHRocm93IG5ldyBFcnJvcihzdG9yZU5hbWUgKyBcIiBpcyBub3QgYSB2YWxpZCBzdG9yZSBuYW1lXCIpO1xyXG4gIH1cclxuXHJcbiAgLy8gV2Ugd2FudCB0byBwcmV2ZW50IGJlZm9yZVdyaXRlIGFuZCB0cmFuc2Zvcm1Xcml0ZSBmcm9tIHJ1bm5pbmcsIHNvXHJcbiAgLy8gd2UgaW50ZXJhY3QgZGlyZWN0bHkgd2l0aCB0aGUgc3RvcmUuXHJcbiAgdmFyIGRlc3RpbmF0aW9uS2V5ID0gc3RvcmFnZS5hZGFwdGVyLmZpbGVLZXkoZmlsZU9iaik7XHJcbiAgdmFyIHJlYWRTdHJlYW0gPSBzdG9yYWdlLmFkYXB0ZXIuY3JlYXRlUmVhZFN0cmVhbUZvckZpbGVLZXkoc291cmNlS2V5KTtcclxuICB2YXIgd3JpdGVTdHJlYW0gPSBzdG9yYWdlLmFkYXB0ZXIuY3JlYXRlV3JpdGVTdHJlYW1Gb3JGaWxlS2V5KGRlc3RpbmF0aW9uS2V5KTtcclxuXHJcbiAgd3JpdGVTdHJlYW0ub25jZSgnc3RvcmVkJywgZnVuY3Rpb24ocmVzdWx0KSB7XHJcbiAgICBjYWxsYmFjayhudWxsLCByZXN1bHQuZmlsZUtleSk7XHJcbiAgfSk7XHJcblxyXG4gIHdyaXRlU3RyZWFtLm9uY2UoJ2Vycm9yJywgZnVuY3Rpb24oZXJyb3IpIHtcclxuICAgIGNhbGxiYWNrKGVycm9yKTtcclxuICB9KTtcclxuXHJcbiAgcmVhZFN0cmVhbS5waXBlKHdyaXRlU3RyZWFtKTtcclxufVxyXG52YXIgY29weVN0b3JlRGF0YSA9IE1ldGVvci53cmFwQXN5bmMoX2NvcHlTdG9yZURhdGEpO1xyXG5cclxuLyoqXHJcbiAqIEBtZXRob2QgRlMuRmlsZS5wcm90b3R5cGUuY29weURhdGEgQ29waWVzIHRoZSBjb250ZW50IG9mIGEgc3RvcmUgZGlyZWN0bHkgaW50byBhbm90aGVyIHN0b3JlLlxyXG4gKiBAcHVibGljXHJcbiAqIEBwYXJhbSB7c3RyaW5nfSBzb3VyY2VTdG9yZU5hbWVcclxuICogQHBhcmFtIHtzdHJpbmd9IHRhcmdldFN0b3JlTmFtZVxyXG4gKiBAcGFyYW0ge2Jvb2xlYW49fSBtb3ZlXHJcbiAqL1xyXG5GUy5GaWxlLnByb3RvdHlwZS5jb3B5RGF0YSA9IGZ1bmN0aW9uKHNvdXJjZVN0b3JlTmFtZSwgdGFyZ2V0U3RvcmVOYW1lLCBtb3ZlKXtcclxuXHJcbiAgbW92ZSA9ICEhbW92ZTtcclxuICAvKipcclxuICAgKiBAdHlwZSB7T2JqZWN0LjxzdHJpbmcsKj59XHJcbiAgICovXHJcbiAgdmFyIHNvdXJjZVN0b3JlVmFsdWVzID0gdGhpcy5jb3BpZXNbc291cmNlU3RvcmVOYW1lXTtcclxuICAvKipcclxuICAgKiBAdHlwZSB7c3RyaW5nfVxyXG4gICAqL1xyXG4gIHZhciBjb3B5S2V5ID0gY2xvbmVEYXRhVG9TdG9yZSh0aGlzLCBzb3VyY2VTdG9yZU5hbWUsIHRhcmdldFN0b3JlTmFtZSwgbW92ZSk7XHJcbiAgLyoqXHJcbiAgICogQHR5cGUge09iamVjdC48c3RyaW5nLCo+fVxyXG4gICAqL1xyXG4gIHZhciB0YXJnZXRTdG9yZVZhbHVlcyA9IHt9O1xyXG4gIGZvciAodmFyIHYgaW4gc291cmNlU3RvcmVWYWx1ZXMpIHtcclxuICAgIGlmIChzb3VyY2VTdG9yZVZhbHVlcy5oYXNPd25Qcm9wZXJ0eSh2KSkge1xyXG4gICAgICB0YXJnZXRTdG9yZVZhbHVlc1t2XSA9IHNvdXJjZVN0b3JlVmFsdWVzW3ZdXHJcbiAgICB9XHJcbiAgfVxyXG4gIHRhcmdldFN0b3JlVmFsdWVzLmtleSA9IGNvcHlLZXk7XHJcbiAgdGFyZ2V0U3RvcmVWYWx1ZXMuY3JlYXRlZEF0ID0gbmV3IERhdGUoKTtcclxuICB0YXJnZXRTdG9yZVZhbHVlcy51cGRhdGVkQXQgPSBuZXcgRGF0ZSgpO1xyXG4gIC8qKlxyXG4gICAqXHJcbiAgICogQHR5cGUge21vZGlmaWVyfVxyXG4gICAqL1xyXG4gIHZhciBtb2RpZmllciA9IHt9O1xyXG4gIG1vZGlmaWVyLiRzZXQgPSB7fTtcclxuICBtb2RpZmllci4kc2V0W1wiY29waWVzLlwiK3RhcmdldFN0b3JlTmFtZV0gPSB0YXJnZXRTdG9yZVZhbHVlcztcclxuICBpZihtb3ZlKXtcclxuICAgIG1vZGlmaWVyLiR1bnNldCA9IHt9O1xyXG4gICAgbW9kaWZpZXIuJHVuc2V0W1wiY29waWVzLlwiK3NvdXJjZVN0b3JlTmFtZV0gPSBcIlwiO1xyXG4gIH1cclxuICB0aGlzLnVwZGF0ZShtb2RpZmllcik7XHJcbn07XHJcbi8qKlxyXG4gKiBAbWV0aG9kIEZTLkZpbGUucHJvdG90eXBlLm1vdmVEYXRhIE1vdmVzIHRoZSBjb250ZW50IG9mIGEgc3RvcmUgZGlyZWN0bHkgaW50byBhbm90aGVyIHN0b3JlLlxyXG4gKiBAcHVibGljXHJcbiAqIEBwYXJhbSB7c3RyaW5nfSBzb3VyY2VTdG9yZU5hbWVcclxuICogQHBhcmFtIHtzdHJpbmd9IHRhcmdldFN0b3JlTmFtZVxyXG4gKi9cclxuRlMuRmlsZS5wcm90b3R5cGUubW92ZURhdGEgPSBmdW5jdGlvbihzb3VyY2VTdG9yZU5hbWUsIHRhcmdldFN0b3JlTmFtZSl7XHJcbiAgdGhpcy5jb3B5RGF0YShzb3VyY2VTdG9yZU5hbWUsIHRhcmdldFN0b3JlTmFtZSwgdHJ1ZSk7XHJcbn07XHJcbi8vIFRPRE8gbWF5YmUgdGhpcyBzaG91bGQgYmUgaW4gY2ZzLXN0b3JhZ2UtYWRhcHRlclxyXG4vKipcclxuICpcclxuICogQHBhcmFtIHtGUy5GaWxlfSBmaWxlT2JqXHJcbiAqIEBwYXJhbSB7c3RyaW5nfSBzb3VyY2VTdG9yZU5hbWVcclxuICogQHBhcmFtIHtzdHJpbmd9IHRhcmdldFN0b3JlTmFtZVxyXG4gKiBAcGFyYW0ge2Jvb2xlYW59IG1vdmVcclxuICogQHBhcmFtIGNhbGxiYWNrXHJcbiAqIEBwcml2YXRlXHJcbiAqL1xyXG5mdW5jdGlvbiBfY29weURhdGFGcm9tU3RvcmVUb1N0b3JlKGZpbGVPYmosIHNvdXJjZVN0b3JlTmFtZSwgdGFyZ2V0U3RvcmVOYW1lLCBtb3ZlLCBjYWxsYmFjaykge1xyXG4gIGlmICghZmlsZU9iai5pc01vdW50ZWQoKSkge1xyXG4gICAgdGhyb3cgbmV3IEVycm9yKFwiQ2Fubm90IGNvcHkgc3RvcmUgZGF0YSBmb3IgYSBmaWxlIHRoYXQgaXMgbm90IGFzc29jaWF0ZWQgd2l0aCBhIGNvbGxlY3Rpb25cIik7XHJcbiAgfVxyXG4gIC8qKlxyXG4gICAqIEB0eXBlIHtGUy5TdG9yYWdlQWRhcHRlcn1cclxuICAgKi9cclxuICB2YXIgc291cmNlU3RvcmFnZSA9IGZpbGVPYmouY29sbGVjdGlvbi5zdG9yZXNMb29rdXBbc291cmNlU3RvcmVOYW1lXTtcclxuICAvKipcclxuICAgKiBAdHlwZSB7RlMuU3RvcmFnZUFkYXB0ZXJ9XHJcbiAgICovXHJcbiAgdmFyIHRhcmdldFN0b3JhZ2UgPSBmaWxlT2JqLmNvbGxlY3Rpb24uc3RvcmVzTG9va3VwW3RhcmdldFN0b3JlTmFtZV07XHJcblxyXG4gIGlmICghc291cmNlU3RvcmFnZSkge1xyXG4gICAgdGhyb3cgbmV3IEVycm9yKHNvdXJjZVN0b3JlTmFtZSArIFwiIGlzIG5vdCBhIHZhbGlkIHN0b3JlIG5hbWVcIik7XHJcbiAgfVxyXG4gIGlmICghdGFyZ2V0U3RvcmFnZSkge1xyXG4gICAgdGhyb3cgbmV3IEVycm9yKHRhcmdldFN0b3JhZ2UgKyBcIiBpcyBub3QgYSB2YWxpZCBzdG9yZSBuYW1lXCIpO1xyXG4gIH1cclxuXHJcbiAgLy8gV2Ugd2FudCB0byBwcmV2ZW50IGJlZm9yZVdyaXRlIGFuZCB0cmFuc2Zvcm1Xcml0ZSBmcm9tIHJ1bm5pbmcsIHNvXHJcbiAgLy8gd2UgaW50ZXJhY3QgZGlyZWN0bHkgd2l0aCB0aGUgc3RvcmUuXHJcbiAgdmFyIHNvdXJjZUtleSA9IHNvdXJjZVN0b3JhZ2UuYWRhcHRlci5maWxlS2V5KGZpbGVPYmopO1xyXG4gIHZhciB0YXJnZXRLZXkgPSB0YXJnZXRTdG9yYWdlLmFkYXB0ZXIuZmlsZUtleShmaWxlT2JqKTtcclxuICB2YXIgcmVhZFN0cmVhbSA9IHNvdXJjZVN0b3JhZ2UuYWRhcHRlci5jcmVhdGVSZWFkU3RyZWFtRm9yRmlsZUtleShzb3VyY2VLZXkpO1xyXG4gIHZhciB3cml0ZVN0cmVhbSA9IHRhcmdldFN0b3JhZ2UuYWRhcHRlci5jcmVhdGVXcml0ZVN0cmVhbUZvckZpbGVLZXkodGFyZ2V0S2V5KTtcclxuXHJcblxyXG4gIHdyaXRlU3RyZWFtLnNhZmVPbmNlKCdzdG9yZWQnLCBmdW5jdGlvbihyZXN1bHQpIHtcclxuICAgIGlmKG1vdmUgJiYgc291cmNlU3RvcmFnZS5hZGFwdGVyLnJlbW92ZShmaWxlT2JqKT09PWZhbHNlKXtcclxuICAgICAgY2FsbGJhY2soXCJDb3BpZWQgdG8gc3RvcmU6XCIgKyB0YXJnZXRTdG9yZU5hbWVcclxuICAgICAgKyBcIiB3aXRoIGZpbGVLZXk6IFwiXHJcbiAgICAgICsgcmVzdWx0LmZpbGVLZXlcclxuICAgICAgKyBcIiwgYnV0IGNvdWxkIG5vdCBkZWxldGUgZnJvbSBzb3VyY2Ugc3RvcmU6IFwiXHJcbiAgICAgICsgc291cmNlU3RvcmVOYW1lKTtcclxuICAgIH1lbHNle1xyXG4gICAgICBjYWxsYmFjayhudWxsLCByZXN1bHQuZmlsZUtleSk7XHJcbiAgICB9XHJcbiAgfSk7XHJcblxyXG4gIHdyaXRlU3RyZWFtLm9uY2UoJ2Vycm9yJywgZnVuY3Rpb24oZXJyb3IpIHtcclxuICAgIGNhbGxiYWNrKGVycm9yKTtcclxuICB9KTtcclxuXHJcbiAgcmVhZFN0cmVhbS5waXBlKHdyaXRlU3RyZWFtKTtcclxufVxyXG52YXIgY2xvbmVEYXRhVG9TdG9yZSA9IE1ldGVvci53cmFwQXN5bmMoX2NvcHlEYXRhRnJvbVN0b3JlVG9TdG9yZSk7XHJcbiJdfQ==
