(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var global = Package.meteor.global;
var meteorEnv = Package.meteor.meteorEnv;
var ECMAScript = Package.ecmascript.ECMAScript;
var Tracker = Package.tracker.Tracker;
var Deps = Package.tracker.Deps;
var _ = Package.underscore._;
var EJSON = Package.ejson.EJSON;
var meteorInstall = Package.modules.meteorInstall;
var Promise = Package.promise.Promise;

/* Package-scope variables */
var FS, _Utility;

var require = meteorInstall({"node_modules":{"meteor":{"steedos:cfs-base-package":{"base-common.js":function module(){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/steedos_cfs-base-package/base-common.js                                                                   //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
// Exported namespace
FS = {}; // namespace for adapters; XXX should this be added by cfs-storage-adapter pkg instead?

FS.Store = {
  GridFS: function () {
    throw new Error('To use FS.Store.GridFS, you must add the "steedos:cfs-gridfs" package.');
  },
  FileSystem: function () {
    throw new Error('To use FS.Store.FileSystem, you must add the "steedos:cfs-filesystem" package.');
  },
  S3: function () {
    throw new Error('To use FS.Store.S3, you must add the "steedos:cfs-s3" package.');
  },
  WABS: function () {
    throw new Error('To use FS.Store.WABS, you must add the "steedos:cfs-wabs" package.');
  },
  Dropbox: function () {
    throw new Error('To use FS.Store.Dropbox, you must add the "steedos:cfs-dropbox" package.');
  }
}; // namespace for access points

FS.AccessPoint = {}; // namespace for utillities

FS.Utility = {}; // A general place for any package to store global config settings

FS.config = {}; // An internal collection reference

FS._collections = {}; // Test scope

_Utility = {}; // #############################################################################
//
// HELPERS
//
// #############################################################################

/** @method _Utility.defaultZero
 * @private
  * @param {Any} val Returns number or 0 if value is a falsy
  */

_Utility.defaultZero = function (val) {
  return +(val || 0);
};
/**
 * @method FS.Utility.cloneFileRecord
 * @public
 * @param {FS.File|FS.Collection filerecord} rec
 * @param {Object} [options]
 * @param {Boolean} [options.full=false] Set `true` to prevent certain properties from being omitted from the clone.
 * @returns {Object} Cloned filerecord
 *
 * Makes a shallow clone of `rec`, filtering out some properties that might be present if
 * it's an FS.File instance, but which we never want to be part of the stored
 * filerecord.
 *
 * This is a blacklist clone rather than a whitelist because we want the user to be able
 * to specify whatever additional properties they wish.
 *
 * In general, we expect the following whitelist properties used by the internal and
 * external APIs:
 *
 * _id, name, size, type, chunkCount, chunkSize, chunkSum, copies, createdAt, updatedAt, uploadedAt
 *
 * Those properties, and any additional properties added by the user, should be present
 * in the returned object, which is suitable for inserting into the backing collection or
 * extending an FS.File instance.
 *
 */


FS.Utility.cloneFileRecord = function (rec, options) {
  options = options || {};
  var result = {}; // We use this method for two purposes. If using it to clone one FS.File into another, then
  // we want a full clone. But if using it to get a filerecord object for inserting into the
  // internal collection, then there are certain properties we want to omit so that they aren't
  // stored in the collection.

  var omit = options.full ? [] : ['collectionName', 'collection', 'data', 'createdByTransform'];

  for (var prop in rec) {
    if (rec.hasOwnProperty(prop) && !_.contains(omit, prop)) {
      result[prop] = rec[prop];
    }
  }

  return result;
};
/**
 * @method FS.Utility.defaultCallback
 * @public
 * @param {Error} [err]
 * @returns {undefined}
 *
 * Can be used as a default callback for client methods that need a callback.
 * Simply throws the provided error if there is one.
 */


FS.Utility.defaultCallback = function defaultCallback(err) {
  if (err) {
    // Show gentle error if Meteor error
    if (err instanceof Meteor.Error) {
      console.error(err.message);
    } else {
      // Normal error, just throw error
      throw err;
    }
  }
};
/**
 * @method FS.Utility.defaultCallback
 * @public
 * @param {Function} [f] A callback function, if you have one. Can be undefined or null.
 * @param {Meteor.Error | Error | String} [err] Error or error message (string)
 * @returns {Any} the callback result if any
 *
 * Handle Error, creates an Error instance with the given text. If callback is
 * a function, passes the error to that function. Otherwise throws it. Useful
 * for dealing with errors in methods that optionally accept a callback.
 */


FS.Utility.handleError = function (f, err, result) {
  // Set callback
  var callback = typeof f === 'function' ? f : FS.Utility.defaultCallback; // Set the err

  var error = err === '' + err ? new Error(err) : err; // callback

  return callback(error, result);
};
/**
 * @method FS.Utility.noop
 * @public
 * Use this to hand a no operation / empty function
 */


FS.Utility.noop = function () {};
/**
 * @method validateAction
 * @private
 * @param {Object} validators - The validators object to use, with `deny` and `allow` properties.
 * @param {FS.File} fileObj - Mounted or mountable file object to be passed to validators.
 * @param {String} userId - The ID of the user who is attempting the action.
 * @returns {undefined}
 *
 * Throws a "400-Bad Request" Meteor error if the file is not mounted or
 * a "400-Access denied" Meteor error if the action is not allowed.
 */


FS.Utility.validateAction = function validateAction(validators, fileObj, userId) {
  var denyValidators = validators.deny;
  var allowValidators = validators.allow; // If insecure package is used and there are no validators defined,
  // allow the action.

  if (typeof Package === 'object' && Package.insecure && denyValidators.length + allowValidators.length === 0) {
    return;
  } // If already mounted, validators should receive a fileObj
  // that is fully populated


  if (fileObj.isMounted()) {
    fileObj.getFileRecord();
  } // Any deny returns true means denied.


  if (_.any(denyValidators, function (validator) {
    return validator(userId, fileObj);
  })) {
    throw new Meteor.Error(403, "Access denied");
  } // Any allow returns true means proceed. Throw error if they all fail.


  if (_.all(allowValidators, function (validator) {
    return !validator(userId, fileObj);
  })) {
    throw new Meteor.Error(403, "Access denied");
  }
};
/**
 * @method FS.Utility.getFileName
 * @private
 * @param {String} name - A filename, filepath, or URL
 * @returns {String} The filename without the URL, filepath, or query string
 */


FS.Utility.getFileName = function utilGetFileName(name) {
  // in case it's a URL, strip off potential query string
  // should have no effect on filepath
  name = name.split('?')[0]; // strip off beginning path or url

  var lastSlash = name.lastIndexOf('/');

  if (lastSlash !== -1) {
    name = name.slice(lastSlash + 1);
  }

  return name;
};
/**
 * @method FS.Utility.getFileExtension
 * @public
 * @param {String} name - A filename, filepath, or URL that may or may not have an extension.
 * @returns {String} The extension or an empty string if no extension found.
 */


FS.Utility.getFileExtension = function utilGetFileExtension(name) {
  name = FS.Utility.getFileName(name); // Seekout the last '.' if found

  var found = name.lastIndexOf('.'); // Return the extension if found else ''
  // If found is -1, we return '' because there is no extension
  // If found is 0, we return '' because it's a hidden file

  return found > 0 ? name.slice(found + 1).toLowerCase() : '';
};
/**
 * @method FS.Utility.setFileExtension
 * @public
 * @param {String} name - A filename that may or may not already have an extension.
 * @param {String} ext - An extension without leading period, which you want to be the new extension on `name`.
 * @returns {String} The filename with changed extension.
 */


FS.Utility.setFileExtension = function utilSetFileExtension(name, ext) {
  if (!name || !name.length) {
    return name;
  }

  var currentExt = FS.Utility.getFileExtension(name);

  if (currentExt.length) {
    name = name.slice(0, currentExt.length * -1) + ext;
  } else {
    name = name + '.' + ext;
  }

  return name;
};
/*
 * Borrowed these from http package
 */


FS.Utility.encodeParams = function encodeParams(params) {
  var buf = [];

  _.each(params, function (value, key) {
    if (buf.length) buf.push('&');
    buf.push(FS.Utility.encodeString(key), '=', FS.Utility.encodeString(value));
  });

  return buf.join('').replace(/%20/g, '+');
};

FS.Utility.encodeString = function encodeString(str) {
  return encodeURIComponent(str).replace(/[!'()]/g, escape).replace(/\*/g, "%2A");
};
/*
 * btoa and atob shims for client and server
 */


FS.Utility._btoa = function _fsUtility_btoa(str) {
  var buffer;

  if (str instanceof Buffer) {
    buffer = str;
  } else {
    buffer = new Buffer(str.toString(), 'binary');
  }

  return buffer.toString('base64');
};

FS.Utility.btoa = function fsUtility_btoa(str) {
  if (typeof btoa === 'function') {
    // Client
    return btoa(str);
  } else if (typeof Buffer !== 'undefined') {
    // Server
    return FS.Utility._btoa(str);
  } else {
    throw new Error('FS.Utility.btoa: Cannot base64 encode on your system');
  }
};

FS.Utility._atob = function _fsUtility_atob(str) {
  return new Buffer(str, 'base64').toString('binary');
};

FS.Utility.atob = function fsUtility_atob(str) {
  if (typeof atob === 'function') {
    // Client
    return atob(str);
  } else if (typeof Buffer !== 'undefined') {
    // Server
    return FS.Utility._atob(str);
  } else {
    throw new Error('FS.Utility.atob: Cannot base64 encode on your system');
  }
}; // Api wrap for 3party libs like underscore


FS.Utility.extend = _.extend;
FS.Utility.each = _.each;
FS.Utility.isEmpty = _.isEmpty;
FS.Utility.indexOf = _.indexOf;
FS.Utility.isArray = _.isArray;
FS.Utility.map = _.map;
FS.Utility.once = _.once;
FS.Utility.include = _.include;
FS.Utility.size = _.size;
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"base-server.js":function module(require){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/steedos_cfs-base-package/base-server.js                                                                   //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
/**
 * @method FS.Utility.binaryToBuffer
 * @public
 * @param {Uint8Array} data
 * @returns {Buffer}
 *
 * Converts a Uint8Array instance to a Node Buffer instance
 */
FS.Utility.binaryToBuffer = function (data) {
  var len = data.length;
  var buffer = new Buffer(len);

  for (var i = 0; i < len; i++) {
    buffer[i] = data[i];
  }

  return buffer;
};
/**
 * @method FS.Utility.bufferToBinary
 * @public
 * @param {Buffer} data
 * @returns {Uint8Array}
 *
 * Converts a Node Buffer instance to a Uint8Array instance
 */


FS.Utility.bufferToBinary = function (data) {
  var len = data.length;
  var binary = EJSON.newBinary(len);

  for (var i = 0; i < len; i++) {
    binary[i] = data[i];
  }

  return binary;
};
/**
 * @method FS.Utility.safeCallback
 * @public
 * @param {Function} callback
 * @returns {Function}
 *
 * Makes a callback safe for Meteor code
 */


FS.Utility.safeCallback = function (callback) {
  return Meteor.bindEnvironment(callback, function (err) {
    throw err;
  });
};
/**
 * @method FS.Utility.safeStream
 * @public
 * @param {Stream} nodestream
 * @returns {Stream}
 *
 * Adds `safeOn` and `safeOnce` methods to a NodeJS Stream
 * object. These are the same as `on` and `once`, except
 * that the callback is wrapped for use in Meteor.
 */


FS.Utility.safeStream = function (nodestream) {
  if (!nodestream || typeof nodestream.on !== 'function') throw new Error('FS.Utility.safeStream requires a NodeJS Stream'); // Create Meteor safe events

  nodestream.safeOn = function (name, callback) {
    return nodestream.on(name, FS.Utility.safeCallback(callback));
  }; // Create Meteor safe events


  nodestream.safeOnce = function (name, callback) {
    return nodestream.once(name, FS.Utility.safeCallback(callback));
  }; // Return the modified stream - modified anyway


  return nodestream;
};
/**
 * @method FS.Utility.eachFileFromPath
 * @public
 * @param {String} p - Server path
 * @param {Function} f - Function to run for each file found in the path.
 * @returns {undefined}
 *
 * Utility for iteration over files from path on server
 */


FS.Utility.eachFileFromPath = function (p, f) {
  var fs = require('fs');

  var path = require('path');

  var files = fs.readdirSync(p);
  files.map(function (file) {
    return path.join(p, file);
  }).filter(function (filePath) {
    return fs.statSync(filePath).isFile() && path.basename(filePath)[0] !== '.';
  }).forEach(function (filePath) {
    f(filePath);
  });
};
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}}}}},{
  "extensions": [
    ".js",
    ".json"
  ]
});

require("/node_modules/meteor/steedos:cfs-base-package/base-common.js");
require("/node_modules/meteor/steedos:cfs-base-package/base-server.js");

/* Exports */
Package._define("steedos:cfs-base-package", {
  FS: FS,
  _Utility: _Utility
});

})();

//# sourceURL=meteor://💻app/packages/steedos_cfs-base-package.js
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvczpjZnMtYmFzZS1wYWNrYWdlL2Jhc2UtY29tbW9uLmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zOmNmcy1iYXNlLXBhY2thZ2UvYmFzZS1zZXJ2ZXIuanMiXSwibmFtZXMiOlsiRlMiLCJTdG9yZSIsIkdyaWRGUyIsIkVycm9yIiwiRmlsZVN5c3RlbSIsIlMzIiwiV0FCUyIsIkRyb3Bib3giLCJBY2Nlc3NQb2ludCIsIlV0aWxpdHkiLCJjb25maWciLCJfY29sbGVjdGlvbnMiLCJfVXRpbGl0eSIsImRlZmF1bHRaZXJvIiwidmFsIiwiY2xvbmVGaWxlUmVjb3JkIiwicmVjIiwib3B0aW9ucyIsInJlc3VsdCIsIm9taXQiLCJmdWxsIiwicHJvcCIsImhhc093blByb3BlcnR5IiwiXyIsImNvbnRhaW5zIiwiZGVmYXVsdENhbGxiYWNrIiwiZXJyIiwiTWV0ZW9yIiwiY29uc29sZSIsImVycm9yIiwibWVzc2FnZSIsImhhbmRsZUVycm9yIiwiZiIsImNhbGxiYWNrIiwibm9vcCIsInZhbGlkYXRlQWN0aW9uIiwidmFsaWRhdG9ycyIsImZpbGVPYmoiLCJ1c2VySWQiLCJkZW55VmFsaWRhdG9ycyIsImRlbnkiLCJhbGxvd1ZhbGlkYXRvcnMiLCJhbGxvdyIsIlBhY2thZ2UiLCJpbnNlY3VyZSIsImxlbmd0aCIsImlzTW91bnRlZCIsImdldEZpbGVSZWNvcmQiLCJhbnkiLCJ2YWxpZGF0b3IiLCJhbGwiLCJnZXRGaWxlTmFtZSIsInV0aWxHZXRGaWxlTmFtZSIsIm5hbWUiLCJzcGxpdCIsImxhc3RTbGFzaCIsImxhc3RJbmRleE9mIiwic2xpY2UiLCJnZXRGaWxlRXh0ZW5zaW9uIiwidXRpbEdldEZpbGVFeHRlbnNpb24iLCJmb3VuZCIsInRvTG93ZXJDYXNlIiwic2V0RmlsZUV4dGVuc2lvbiIsInV0aWxTZXRGaWxlRXh0ZW5zaW9uIiwiZXh0IiwiY3VycmVudEV4dCIsImVuY29kZVBhcmFtcyIsInBhcmFtcyIsImJ1ZiIsImVhY2giLCJ2YWx1ZSIsImtleSIsInB1c2giLCJlbmNvZGVTdHJpbmciLCJqb2luIiwicmVwbGFjZSIsInN0ciIsImVuY29kZVVSSUNvbXBvbmVudCIsImVzY2FwZSIsIl9idG9hIiwiX2ZzVXRpbGl0eV9idG9hIiwiYnVmZmVyIiwiQnVmZmVyIiwidG9TdHJpbmciLCJidG9hIiwiZnNVdGlsaXR5X2J0b2EiLCJfYXRvYiIsIl9mc1V0aWxpdHlfYXRvYiIsImF0b2IiLCJmc1V0aWxpdHlfYXRvYiIsImV4dGVuZCIsImlzRW1wdHkiLCJpbmRleE9mIiwiaXNBcnJheSIsIm1hcCIsIm9uY2UiLCJpbmNsdWRlIiwic2l6ZSIsImJpbmFyeVRvQnVmZmVyIiwiZGF0YSIsImxlbiIsImkiLCJidWZmZXJUb0JpbmFyeSIsImJpbmFyeSIsIkVKU09OIiwibmV3QmluYXJ5Iiwic2FmZUNhbGxiYWNrIiwiYmluZEVudmlyb25tZW50Iiwic2FmZVN0cmVhbSIsIm5vZGVzdHJlYW0iLCJvbiIsInNhZmVPbiIsInNhZmVPbmNlIiwiZWFjaEZpbGVGcm9tUGF0aCIsInAiLCJmcyIsInJlcXVpcmUiLCJwYXRoIiwiZmlsZXMiLCJyZWFkZGlyU3luYyIsImZpbGUiLCJmaWx0ZXIiLCJmaWxlUGF0aCIsInN0YXRTeW5jIiwiaXNGaWxlIiwiYmFzZW5hbWUiLCJmb3JFYWNoIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7QUFDQUEsRUFBRSxHQUFHLEVBQUwsQyxDQUVBOztBQUNBQSxFQUFFLENBQUNDLEtBQUgsR0FBVztBQUNUQyxRQUFNLEVBQUUsWUFBWTtBQUNsQixVQUFNLElBQUlDLEtBQUosQ0FBVSx3RUFBVixDQUFOO0FBQ0QsR0FIUTtBQUlUQyxZQUFVLEVBQUUsWUFBWTtBQUN0QixVQUFNLElBQUlELEtBQUosQ0FBVSxnRkFBVixDQUFOO0FBQ0QsR0FOUTtBQU9URSxJQUFFLEVBQUUsWUFBWTtBQUNkLFVBQU0sSUFBSUYsS0FBSixDQUFV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S0FBQyxDQUFDMEYsUUFBRCxDQUFEO0FBQ0QsR0FORDtBQU9ELENBWEQsQyIsImZpbGUiOiIvcGFja2FnZXMvc3RlZWRvc19jZnMtYmFzZS1wYWNrYWdlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLy8gRXhwb3J0ZWQgbmFtZXNwYWNlXHJcbkZTID0ge307XHJcblxyXG4vLyBuYW1lc3BhY2UgZm9yIGFkYXB0ZXJzOyBYWFggc2hvdWxkIHRoaXMgYmUgYWRkZWQgYnkgY2ZzLXN0b3JhZ2UtYWRhcHRlciBwa2cgaW5zdGVhZD9cclxuRlMuU3RvcmUgPSB7XHJcbiAgR3JpZEZTOiBmdW5jdGlvbiAoKSB7XHJcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ1RvIHVzZSBGUy5TdG9yZS5HcmlkRlMsIHlvdSBtdXN0IGFkZCB0aGUgXCJzdGVlZG9zOmNmcy1ncmlkZnNcIiBwYWNrYWdlLicpO1xyXG4gIH0sXHJcbiAgRmlsZVN5c3RlbTogZnVuY3Rpb24gKCkge1xyXG4gICAgdGhyb3cgbmV3IEVycm9yKCdUbyB1c2UgRlMuU3RvcmUuRmlsZVN5c3RlbSwgeW91IG11c3QgYWRkIHRoZSBcInN0ZWVkb3M6Y2ZzLWZpbGVzeXN0ZW1cIiBwYWNrYWdlLicpO1xyXG4gIH0sXHJcbiAgUzM6IGZ1bmN0aW9uICgpIHtcclxuICAgIHRocm93IG5ldyBFcnJvcignVG8gdXNlIEZTLlN0b3JlLlMzLCB5b3UgbXVzdCBhZGQgdGhlIFwic3RlZWRvczpjZnMtczNcIiBwYWNrYWdlLicpO1xyXG4gIH0sXHJcbiAgV0FCUzogZnVuY3Rpb24gKCkge1xyXG4gICAgdGhyb3cgbmV3IEVycm9yKCdUbyB1c2UgRlMuU3RvcmUuV0FCUywgeW91IG11c3QgYWRkIHRoZSBcInN0ZWVkb3M6Y2ZzLXdhYnNcIiBwYWNrYWdlLicpO1xyXG4gIH0sXHJcbiAgRHJvcGJveDogZnVuY3Rpb24gKCkge1xyXG4gICAgdGhyb3cgbmV3IEVycm9yKCdUbyB1c2UgRlMuU3RvcmUuRHJvcGJveCwgeW91IG11c3QgYWRkIHRoZSBcInN0ZWVkb3M6Y2ZzLWRyb3Bib3hcIiBwYWNrYWdlLicpO1xyXG4gIH1cclxufTtcclxuXHJcbi8vIG5hbWVzcGFjZSBmb3IgYWNjZXNzIHBvaW50c1xyXG5GUy5BY2Nlc3NQb2ludCA9IHt9O1xyXG5cclxuLy8gbmFtZXNwYWNlIGZvciB1dGlsbGl0aWVzXHJcbkZTLlV0aWxpdHkgPSB7fTtcclxuXHJcbi8vIEEgZ2VuZXJhbCBwbGFjZSBmb3IgYW55IHBhY2thZ2UgdG8gc3RvcmUgZ2xvYmFsIGNvbmZpZyBzZXR0aW5nc1xyXG5GUy5jb25maWcgPSB7fTtcclxuXHJcbi8vIEFuIGludGVybmFsIGNvbGxlY3Rpb24gcmVmZXJlbmNlXHJcbkZTLl9jb2xsZWN0aW9ucyA9IHt9O1xyXG5cclxuLy8gVGVzdCBzY29wZVxyXG5fVXRpbGl0eSA9IHt9O1xyXG5cclxuLy8gIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyNcclxuLy9cclxuLy8gSEVMUEVSU1xyXG4vL1xyXG4vLyAjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjI1xyXG5cclxuLyoqIEBtZXRob2QgX1V0aWxpdHkuZGVmYXVsdFplcm9cclxuICogQHByaXZhdGVcclxuICAqIEBwYXJhbSB7QW55fSB2YWwgUmV0dXJucyBudW1iZXIgb3IgMCBpZiB2YWx1ZSBpcyBhIGZhbHN5XHJcbiAgKi9cclxuX1V0aWxpdHkuZGVmYXVsdFplcm8gPSBmdW5jdGlvbih2YWwpIHtcclxuICByZXR1cm4gKyh2YWwgfHwgMCk7XHJcbn07XHJcblxyXG4vKipcclxuICogQG1ldGhvZCBGUy5VdGlsaXR5LmNsb25lRmlsZVJlY29yZFxyXG4gKiBAcHVibGljXHJcbiAqIEBwYXJhbSB7RlMuRmlsZXxGUy5Db2xsZWN0aW9uIGZpbGVyZWNvcmR9IHJlY1xyXG4gKiBAcGFyYW0ge09iamVjdH0gW29wdGlvbnNdXHJcbiAqIEBwYXJhbSB7Qm9vbGVhbn0gW29wdGlvbnMuZnVsbD1mYWxzZV0gU2V0IGB0cnVlYCB0byBwcmV2ZW50IGNlcnRhaW4gcHJvcGVydGllcyBmcm9tIGJlaW5nIG9taXR0ZWQgZnJvbSB0aGUgY2xvbmUuXHJcbiAqIEByZXR1cm5zIHtPYmplY3R9IENsb25lZCBmaWxlcmVjb3JkXHJcbiAqXHJcbiAqIE1ha2VzIGEgc2hhbGxvdyBjbG9uZSBvZiBgcmVjYCwgZmlsdGVyaW5nIG91dCBzb21lIHByb3BlcnRpZXMgdGhhdCBtaWdodCBiZSBwcmVzZW50IGlmXHJcbiAqIGl0J3MgYW4gRlMuRmlsZSBpbnN0YW5jZSwgYnV0IHdoaWNoIHdlIG5ldmVyIHdhbnQgdG8gYmUgcGFydCBvZiB0aGUgc3RvcmVkXHJcbiAqIGZpbGVyZWNvcmQuXHJcbiAqXHJcbiAqIFRoaXMgaXMgYSBibGFja2xpc3QgY2xvbmUgcmF0aGVyIHRoYW4gYSB3aGl0ZWxpc3QgYmVjYXVzZSB3ZSB3YW50IHRoZSB1c2VyIHRvIGJlIGFibGVcclxuICogdG8gc3BlY2lmeSB3aGF0ZXZlciBhZGRpdGlvbmFsIHByb3BlcnRpZXMgdGhleSB3aXNoLlxyXG4gKlxyXG4gKiBJbiBnZW5lcmFsLCB3ZSBleHBlY3QgdGhlIGZvbGxvd2luZyB3aGl0ZWxpc3QgcHJvcGVydGllcyB1c2VkIGJ5IHRoZSBpbnRlcm5hbCBhbmRcclxuICogZXh0ZXJuYWwgQVBJczpcclxuICpcclxuICogX2lkLCBuYW1lLCBzaXplLCB0eXBlLCBjaHVua0NvdW50LCBjaHVua1NpemUsIGNodW5rU3VtLCBjb3BpZXMsIGNyZWF0ZWRBdCwgdXBkYXRlZEF0LCB1cGxvYWRlZEF0XHJcbiAqXHJcbiAqIFRob3NlIHByb3BlcnRpZXMsIGFuZCBhbnkgYWRkaXRpb25hbCBwcm9wZXJ0aWVzIGFkZGVkIGJ5IHRoZSB1c2VyLCBzaG91bGQgYmUgcHJlc2VudFxyXG4gKiBpbiB0aGUgcmV0dXJuZWQgb2JqZWN0LCB3aGljaCBpcyBzdWl0YWJsZSBmb3IgaW5zZXJ0aW5nIGludG8gdGhlIGJhY2tpbmcgY29sbGVjdGlvbiBvclxyXG4gKiBleHRlbmRpbmcgYW4gRlMuRmlsZSBpbnN0YW5jZS5cclxuICpcclxuICovXHJcbkZTLlV0aWxpdHkuY2xvbmVGaWxlUmVjb3JkID0gZnVuY3Rpb24ocmVjLCBvcHRpb25zKSB7XHJcbiAgb3B0aW9ucyA9IG9wdGlvbnMgfHwge307XHJcbiAgdmFyIHJlc3VsdCA9IHt9O1xyXG4gIC8vIFdlIHVzZSB0aGlzIG1ldGhvZCBmb3IgdHdvIHB1cnBvc2VzLiBJZiB1c2luZyBpdCB0byBjbG9uZSBvbmUgRlMuRmlsZSBpbnRvIGFub3RoZXIsIHRoZW5cclxuICAvLyB3ZSB3YW50IGEgZnVsbCBjbG9uZS4gQnV0IGlmIHVzaW5nIGl0IHRvIGdldCBhIGZpbGVyZWNvcmQgb2JqZWN0IGZvciBpbnNlcnRpbmcgaW50byB0aGVcclxuICAvLyBpbnRlcm5hbCBjb2xsZWN0aW9uLCB0aGVuIHRoZXJlIGFyZSBjZXJ0YWluIHByb3BlcnRpZXMgd2Ugd2FudCB0byBvbWl0IHNvIHRoYXQgdGhleSBhcmVuJ3RcclxuICAvLyBzdG9yZWQgaW4gdGhlIGNvbGxlY3Rpb24uXHJcbiAgdmFyIG9taXQgPSBvcHRpb25zLmZ1bGwgPyBbXSA6IFsnY29sbGVjdGlvbk5hbWUnLCAnY29sbGVjdGlvbicsICdkYXRhJywgJ2NyZWF0ZWRCeVRyYW5zZm9ybSddO1xyXG4gIGZvciAodmFyIHByb3AgaW4gcmVjKSB7XHJcbiAgICBpZiAocmVjLmhhc093blByb3BlcnR5KHByb3ApICYmICFfLmNvbnRhaW5zKG9taXQsIHByb3ApKSB7XHJcbiAgICAgIHJlc3VsdFtwcm9wXSA9IHJlY1twcm9wXTtcclxuICAgIH1cclxuICB9XHJcbiAgcmV0dXJuIHJlc3VsdDtcclxufTtcclxuXHJcbi8qKlxyXG4gKiBAbWV0aG9kIEZTLlV0aWxpdHkuZGVmYXVsdENhbGxiYWNrXHJcbiAqIEBwdWJsaWNcclxuICogQHBhcmFtIHtFcnJvcn0gW2Vycl1cclxuICogQHJldHVybnMge3VuZGVmaW5lZH1cclxuICpcclxuICogQ2FuIGJlIHVzZWQgYXMgYSBkZWZhdWx0IGNhbGxiYWNrIGZvciBjbGllbnQgbWV0aG9kcyB0aGF0IG5lZWQgYSBjYWxsYmFjay5cclxuICogU2ltcGx5IHRocm93cyB0aGUgcHJvdmlkZWQgZXJyb3IgaWYgdGhlcmUgaXMgb25lLlxyXG4gKi9cclxuRlMuVXRpbGl0eS5kZWZhdWx0Q2FsbGJhY2sgPSBmdW5jdGlvbiBkZWZhdWx0Q2FsbGJhY2soZXJyKSB7XHJcbiAgaWYgKGVycikge1xyXG4gICAgLy8gU2hvdyBnZW50bGUgZXJyb3IgaWYgTWV0ZW9yIGVycm9yXHJcbiAgICBpZiAoZXJyIGluc3RhbmNlb2YgTWV0ZW9yLkVycm9yKSB7XHJcbiAgICAgIGNvbnNvbGUuZXJyb3IoZXJyLm1lc3NhZ2UpO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgLy8gTm9ybWFsIGVycm9yLCBqdXN0IHRocm93IGVycm9yXHJcbiAgICAgIHRocm93IGVycjtcclxuICAgIH1cclxuXHJcbiAgfVxyXG59O1xyXG5cclxuLyoqXHJcbiAqIEBtZXRob2QgRlMuVXRpbGl0eS5kZWZhdWx0Q2FsbGJhY2tcclxuICogQHB1YmxpY1xyXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBbZl0gQSBjYWxsYmFjayBmdW5jdGlvbiwgaWYgeW91IGhhdmUgb25lLiBDYW4gYmUgdW5kZWZpbmVkIG9yIG51bGwuXHJcbiAqIEBwYXJhbSB7TWV0ZW9yLkVycm9yIHwgRXJyb3IgfCBTdHJpbmd9IFtlcnJdIEVycm9yIG9yIGVycm9yIG1lc3NhZ2UgKHN0cmluZylcclxuICogQHJldHVybnMge0FueX0gdGhlIGNhbGxiYWNrIHJlc3VsdCBpZiBhbnlcclxuICpcclxuICogSGFuZGxlIEVycm9yLCBjcmVhdGVzIGFuIEVycm9yIGluc3RhbmNlIHdpdGggdGhlIGdpdmVuIHRleHQuIElmIGNhbGxiYWNrIGlzXHJcbiAqIGEgZnVuY3Rpb24sIHBhc3NlcyB0aGUgZXJyb3IgdG8gdGhhdCBmdW5jdGlvbi4gT3RoZXJ3aXNlIHRocm93cyBpdC4gVXNlZnVsXHJcbiAqIGZvciBkZWFsaW5nIHdpdGggZXJyb3JzIGluIG1ldGhvZHMgdGhhdCBvcHRpb25hbGx5IGFjY2VwdCBhIGNhbGxiYWNrLlxyXG4gKi9cclxuRlMuVXRpbGl0eS5oYW5kbGVFcnJvciA9IGZ1bmN0aW9uKGYsIGVyciwgcmVzdWx0KSB7XHJcbiAgLy8gU2V0IGNhbGxiYWNrXHJcbiAgdmFyIGNhbGxiYWNrID0gKHR5cGVvZiBmID09PSAnZnVuY3Rpb24nKT8gZiA6IEZTLlV0aWxpdHkuZGVmYXVsdENhbGxiYWNrO1xyXG4gIC8vIFNldCB0aGUgZXJyXHJcbiAgdmFyIGVycm9yID0gKGVyciA9PT0gJycrZXJyKT8gbmV3IEVycm9yKGVycikgOiBlcnI7XHJcbiAgLy8gY2FsbGJhY2tcclxuICByZXR1cm4gY2FsbGJhY2soZXJyb3IsIHJlc3VsdCk7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBAbWV0aG9kIEZTLlV0aWxpdHkubm9vcFxyXG4gKiBAcHVibGljXHJcbiAqIFVzZSB0aGlzIHRvIGhhbmQgYSBubyBvcGVyYXRpb24gLyBlbXB0eSBmdW5jdGlvblxyXG4gKi9cclxuRlMuVXRpbGl0eS5ub29wID0gZnVuY3Rpb24oKSB7fTtcclxuXHJcbi8qKlxyXG4gKiBAbWV0aG9kIHZhbGlkYXRlQWN0aW9uXHJcbiAqIEBwcml2YXRlXHJcbiAqIEBwYXJhbSB7T2JqZWN0fSB2YWxpZGF0b3JzIC0gVGhlIHZhbGlkYXRvcnMgb2JqZWN0IHRvIHVzZSwgd2l0aCBgZGVueWAgYW5kIGBhbGxvd2AgcHJvcGVydGllcy5cclxuICogQHBhcmFtIHtGUy5GaWxlfSBmaWxlT2JqIC0gTW91bnRlZCBvciBtb3VudGFibGUgZmlsZSBvYmplY3QgdG8gYmUgcGFzc2VkIHRvIHZhbGlkYXRvcnMuXHJcbiAqIEBwYXJhbSB7U3RyaW5nfSB1c2VySWQgLSBUaGUgSUQgb2YgdGhlIHVzZXIgd2hvIGlzIGF0dGVtcHRpbmcgdGhlIGFjdGlvbi5cclxuICogQHJldHVybnMge3VuZGVmaW5lZH1cclxuICpcclxuICogVGhyb3dzIGEgXCI0MDAtQmFkIFJlcXVlc3RcIiBNZXRlb3IgZXJyb3IgaWYgdGhlIGZpbGUgaXMgbm90IG1vdW50ZWQgb3JcclxuICogYSBcIjQwMC1BY2Nlc3MgZGVuaWVkXCIgTWV0ZW9yIGVycm9yIGlmIHRoZSBhY3Rpb24gaXMgbm90IGFsbG93ZWQuXHJcbiAqL1xyXG5GUy5VdGlsaXR5LnZhbGlkYXRlQWN0aW9uID0gZnVuY3Rpb24gdmFsaWRhdGVBY3Rpb24odmFsaWRhdG9ycywgZmlsZU9iaiwgdXNlcklkKSB7XHJcbiAgdmFyIGRlbnlWYWxpZGF0b3JzID0gdmFsaWRhdG9ycy5kZW55O1xyXG4gIHZhciBhbGxvd1ZhbGlkYXRvcnMgPSB2YWxpZGF0b3JzLmFsbG93O1xyXG5cclxuICAvLyBJZiBpbnNlY3VyZSBwYWNrYWdlIGlzIHVzZWQgYW5kIHRoZXJlIGFyZSBubyB2YWxpZGF0b3JzIGRlZmluZWQsXHJcbiAgLy8gYWxsb3cgdGhlIGFjdGlvbi5cclxuICBpZiAodHlwZW9mIFBhY2thZ2UgPT09ICdvYmplY3QnXHJcbiAgICAgICAgICAmJiBQYWNrYWdlLmluc2VjdXJlXHJcbiAgICAgICAgICAmJiBkZW55VmFsaWRhdG9ycy5sZW5ndGggKyBhbGxvd1ZhbGlkYXRvcnMubGVuZ3RoID09PSAwKSB7XHJcbiAgICByZXR1cm47XHJcbiAgfVxyXG5cclxuICAvLyBJZiBhbHJlYWR5IG1vdW50ZWQsIHZhbGlkYXRvcnMgc2hvdWxkIHJlY2VpdmUgYSBmaWxlT2JqXHJcbiAgLy8gdGhhdCBpcyBmdWxseSBwb3B1bGF0ZWRcclxuICBpZiAoZmlsZU9iai5pc01vdW50ZWQoKSkge1xyXG4gICAgZmlsZU9iai5nZXRGaWxlUmVjb3JkKCk7XHJcbiAgfVxyXG5cclxuICAvLyBBbnkgZGVueSByZXR1cm5zIHRydWUgbWVhbnMgZGVuaWVkLlxyXG4gIGlmIChfLmFueShkZW55VmFsaWRhdG9ycywgZnVuY3Rpb24odmFsaWRhdG9yKSB7XHJcbiAgICByZXR1cm4gdmFsaWRhdG9yKHVzZXJJZCwgZmlsZU9iaik7XHJcbiAgfSkpIHtcclxuICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoNDAzLCBcIkFjY2VzcyBkZW5pZWRcIik7XHJcbiAgfVxyXG4gIC8vIEFueSBhbGxvdyByZXR1cm5zIHRydWUgbWVhbnMgcHJvY2VlZC4gVGhyb3cgZXJyb3IgaWYgdGhleSBhbGwgZmFpbC5cclxuICBpZiAoXy5hbGwoYWxsb3dWYWxpZGF0b3JzLCBmdW5jdGlvbih2YWxpZGF0b3IpIHtcclxuICAgIHJldHVybiAhdmFsaWRhdG9yKHVzZXJJZCwgZmlsZU9iaik7XHJcbiAgfSkpIHtcclxuICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoNDAzLCBcIkFjY2VzcyBkZW5pZWRcIik7XHJcbiAgfVxyXG59O1xyXG5cclxuLyoqXHJcbiAqIEBtZXRob2QgRlMuVXRpbGl0eS5nZXRGaWxlTmFtZVxyXG4gKiBAcHJpdmF0ZVxyXG4gKiBAcGFyYW0ge1N0cmluZ30gbmFtZSAtIEEgZmlsZW5hbWUsIGZpbGVwYXRoLCBvciBVUkxcclxuICogQHJldHVybnMge1N0cmluZ30gVGhlIGZpbGVuYW1lIHdpdGhvdXQgdGhlIFVSTCwgZmlsZXBhdGgsIG9yIHF1ZXJ5IHN0cmluZ1xyXG4gKi9cclxuRlMuVXRpbGl0eS5nZXRGaWxlTmFtZSA9IGZ1bmN0aW9uIHV0aWxHZXRGaWxlTmFtZShuYW1lKSB7XHJcbiAgLy8gaW4gY2FzZSBpdCdzIGEgVVJMLCBzdHJpcCBvZmYgcG90ZW50aWFsIHF1ZXJ5IHN0cmluZ1xyXG4gIC8vIHNob3VsZCBoYXZlIG5vIGVmZmVjdCBvbiBmaWxlcGF0aFxyXG4gIG5hbWUgPSBuYW1lLnNwbGl0KCc/JylbMF07XHJcbiAgLy8gc3RyaXAgb2ZmIGJlZ2lubmluZyBwYXRoIG9yIHVybFxyXG4gIHZhciBsYXN0U2xhc2ggPSBuYW1lLmxhc3RJbmRleE9mKCcvJyk7XHJcbiAgaWYgKGxhc3RTbGFzaCAhPT0gLTEpIHtcclxuICAgIG5hbWUgPSBuYW1lLnNsaWNlKGxhc3RTbGFzaCArIDEpO1xyXG4gIH1cclxuICByZXR1cm4gbmFtZTtcclxufTtcclxuXHJcbi8qKlxyXG4gKiBAbWV0aG9kIEZTLlV0aWxpdHkuZ2V0RmlsZUV4dGVuc2lvblxyXG4gKiBAcHVibGljXHJcbiAqIEBwYXJhbSB7U3RyaW5nfSBuYW1lIC0gQSBmaWxlbmFtZSwgZmlsZXBhdGgsIG9yIFVSTCB0aGF0IG1heSBvciBtYXkgbm90IGhhdmUgYW4gZXh0ZW5zaW9uLlxyXG4gKiBAcmV0dXJucyB7U3RyaW5nfSBUaGUgZXh0ZW5zaW9uIG9yIGFuIGVtcHR5IHN0cmluZyBpZiBubyBleHRlbnNpb24gZm91bmQuXHJcbiAqL1xyXG5GUy5VdGlsaXR5LmdldEZpbGVFeHRlbnNpb24gPSBmdW5jdGlvbiB1dGlsR2V0RmlsZUV4dGVuc2lvbihuYW1lKSB7XHJcbiAgbmFtZSA9IEZTLlV0aWxpdHkuZ2V0RmlsZU5hbWUobmFtZSk7XHJcbiAgLy8gU2Vla291dCB0aGUgbGFzdCAnLicgaWYgZm91bmRcclxuICB2YXIgZm91bmQgPSBuYW1lLmxhc3RJbmRleE9mKCcuJyk7XHJcbiAgLy8gUmV0dXJuIHRoZSBleHRlbnNpb24gaWYgZm91bmQgZWxzZSAnJ1xyXG4gIC8vIElmIGZvdW5kIGlzIC0xLCB3ZSByZXR1cm4gJycgYmVjYXVzZSB0aGVyZSBpcyBubyBleHRlbnNpb25cclxuICAvLyBJZiBmb3VuZCBpcyAwLCB3ZSByZXR1cm4gJycgYmVjYXVzZSBpdCdzIGEgaGlkZGVuIGZpbGVcclxuICByZXR1cm4gKGZvdW5kID4gMCA/IG5hbWUuc2xpY2UoZm91bmQgKyAxKS50b0xvd2VyQ2FzZSgpIDogJycpO1xyXG59O1xyXG5cclxuLyoqXHJcbiAqIEBtZXRob2QgRlMuVXRpbGl0eS5zZXRGaWxlRXh0ZW5zaW9uXHJcbiAqIEBwdWJsaWNcclxuICogQHBhcmFtIHtTdHJpbmd9IG5hbWUgLSBBIGZpbGVuYW1lIHRoYXQgbWF5IG9yIG1heSBub3QgYWxyZWFkeSBoYXZlIGFuIGV4dGVuc2lvbi5cclxuICogQHBhcmFtIHtTdHJpbmd9IGV4dCAtIEFuIGV4dGVuc2lvbiB3aXRob3V0IGxlYWRpbmcgcGVyaW9kLCB3aGljaCB5b3Ugd2FudCB0byBiZSB0aGUgbmV3IGV4dGVuc2lvbiBvbiBgbmFtZWAuXHJcbiAqIEByZXR1cm5zIHtTdHJpbmd9IFRoZSBmaWxlbmFtZSB3aXRoIGNoYW5nZWQgZXh0ZW5zaW9uLlxyXG4gKi9cclxuRlMuVXRpbGl0eS5zZXRGaWxlRXh0ZW5zaW9uID0gZnVuY3Rpb24gdXRpbFNldEZpbGVFeHRlbnNpb24obmFtZSwgZXh0KSB7XHJcbiAgaWYgKCFuYW1lIHx8ICFuYW1lLmxlbmd0aCkge1xyXG4gICAgcmV0dXJuIG5hbWU7XHJcbiAgfVxyXG4gIHZhciBjdXJyZW50RXh0ID0gRlMuVXRpbGl0eS5nZXRGaWxlRXh0ZW5zaW9uKG5hbWUpO1xyXG4gIGlmIChjdXJyZW50RXh0Lmxlbmd0aCkge1xyXG4gICAgbmFtZSA9IG5hbWUuc2xpY2UoMCwgY3VycmVudEV4dC5sZW5ndGggKiAtMSkgKyBleHQ7XHJcbiAgfSBlbHNlIHtcclxuICAgIG5hbWUgPSBuYW1lICsgJy4nICsgZXh0O1xyXG4gIH1cclxuICByZXR1cm4gbmFtZTtcclxufTtcclxuXHJcbi8qXHJcbiAqIEJvcnJvd2VkIHRoZXNlIGZyb20gaHR0cCBwYWNrYWdlXHJcbiAqL1xyXG5GUy5VdGlsaXR5LmVuY29kZVBhcmFtcyA9IGZ1bmN0aW9uIGVuY29kZVBhcmFtcyhwYXJhbXMpIHtcclxuICB2YXIgYnVmID0gW107XHJcbiAgXy5lYWNoKHBhcmFtcywgZnVuY3Rpb24odmFsdWUsIGtleSkge1xyXG4gICAgaWYgKGJ1Zi5sZW5ndGgpXHJcbiAgICAgIGJ1Zi5wdXNoKCcmJyk7XHJcbiAgICBidWYucHVzaChGUy5VdGlsaXR5LmVuY29kZVN0cmluZyhrZXkpLCAnPScsIEZTLlV0aWxpdHkuZW5jb2RlU3RyaW5nKHZhbHVlKSk7XHJcbiAgfSk7XHJcbiAgcmV0dXJuIGJ1Zi5qb2luKCcnKS5yZXBsYWNlKC8lMjAvZywgJysnKTtcclxufTtcclxuXHJcbkZTLlV0aWxpdHkuZW5jb2RlU3RyaW5nID0gZnVuY3Rpb24gZW5jb2RlU3RyaW5nKHN0cikge1xyXG4gIHJldHVybiBlbmNvZGVVUklDb21wb25lbnQoc3RyKS5yZXBsYWNlKC9bIScoKV0vZywgZXNjYXBlKS5yZXBsYWNlKC9cXCovZywgXCIlMkFcIik7XHJcbn07XHJcblxyXG4vKlxyXG4gKiBidG9hIGFuZCBhdG9iIHNoaW1zIGZvciBjbGllbnQgYW5kIHNlcnZlclxyXG4gKi9cclxuXHJcbkZTLlV0aWxpdHkuX2J0b2EgPSBmdW5jdGlvbiBfZnNVdGlsaXR5X2J0b2Eoc3RyKSB7XHJcbiAgdmFyIGJ1ZmZlcjtcclxuXHJcbiAgaWYgKHN0ciBpbnN0YW5jZW9mIEJ1ZmZlcikge1xyXG4gICAgYnVmZmVyID0gc3RyO1xyXG4gIH0gZWxzZSB7XHJcbiAgICBidWZmZXIgPSBuZXcgQnVmZmVyKHN0ci50b1N0cmluZygpLCAnYmluYXJ5Jyk7XHJcbiAgfVxyXG5cclxuICByZXR1cm4gYnVmZmVyLnRvU3RyaW5nKCdiYXNlNjQnKTtcclxufTtcclxuXHJcbkZTLlV0aWxpdHkuYnRvYSA9IGZ1bmN0aW9uIGZzVXRpbGl0eV9idG9hKHN0cikge1xyXG4gIGlmICh0eXBlb2YgYnRvYSA9PT0gJ2Z1bmN0aW9uJykge1xyXG4gICAgLy8gQ2xpZW50XHJcbiAgICByZXR1cm4gYnRvYShzdHIpO1xyXG4gIH0gZWxzZSBpZiAodHlwZW9mIEJ1ZmZlciAhPT0gJ3VuZGVmaW5lZCcpIHtcclxuICAgIC8vIFNlcnZlclxyXG4gICAgcmV0dXJuIEZTLlV0aWxpdHkuX2J0b2Eoc3RyKTtcclxuICB9IGVsc2Uge1xyXG4gICAgdGhyb3cgbmV3IEVycm9yKCdGUy5VdGlsaXR5LmJ0b2E6IENhbm5vdCBiYXNlNjQgZW5jb2RlIG9uIHlvdXIgc3lzdGVtJyk7XHJcbiAgfVxyXG59O1xyXG5cclxuRlMuVXRpbGl0eS5fYXRvYiA9IGZ1bmN0aW9uIF9mc1V0aWxpdHlfYXRvYihzdHIpIHtcclxuICByZXR1cm4gbmV3IEJ1ZmZlcihzdHIsICdiYXNlNjQnKS50b1N0cmluZygnYmluYXJ5Jyk7XHJcbn07XHJcblxyXG5GUy5VdGlsaXR5LmF0b2IgPSBmdW5jdGlvbiBmc1V0aWxpdHlfYXRvYihzdHIpIHtcclxuICBpZiAodHlwZW9mIGF0b2IgPT09ICdmdW5jdGlvbicpIHtcclxuICAgIC8vIENsaWVudFxyXG4gICAgcmV0dXJuIGF0b2Ioc3RyKTtcclxuICB9IGVsc2UgaWYgKHR5cGVvZiBCdWZmZXIgIT09ICd1bmRlZmluZWQnKSB7XHJcbiAgICAvLyBTZXJ2ZXJcclxuICAgIHJldHVybiBGUy5VdGlsaXR5Ll9hdG9iKHN0cik7XHJcbiAgfSBlbHNlIHtcclxuICAgIHRocm93IG5ldyBFcnJvcignRlMuVXRpbGl0eS5hdG9iOiBDYW5ub3QgYmFzZTY0IGVuY29kZSBvbiB5b3VyIHN5c3RlbScpO1xyXG4gIH1cclxufTtcclxuXHJcbi8vIEFwaSB3cmFwIGZvciAzcGFydHkgbGlicyBsaWtlIHVuZGVyc2NvcmVcclxuRlMuVXRpbGl0eS5leHRlbmQgPSBfLmV4dGVuZDtcclxuXHJcbkZTLlV0aWxpdHkuZWFjaCA9IF8uZWFjaDtcclxuXHJcbkZTLlV0aWxpdHkuaXNFbXB0eSA9IF8uaXNFbXB0eTtcclxuXHJcbkZTLlV0aWxpdHkuaW5kZXhPZiA9IF8uaW5kZXhPZjtcclxuXHJcbkZTLlV0aWxpdHkuaXNBcnJheSA9IF8uaXNBcnJheTtcclxuXHJcbkZTLlV0aWxpdHkubWFwID0gXy5tYXA7XHJcblxyXG5GUy5VdGlsaXR5Lm9uY2UgPSBfLm9uY2U7XHJcblxyXG5GUy5VdGlsaXR5LmluY2x1ZGUgPSBfLmluY2x1ZGU7XHJcblxyXG5GUy5VdGlsaXR5LnNpemUgPSBfLnNpemU7XHJcbiIsIi8qKlxyXG4gKiBAbWV0aG9kIEZTLlV0aWxpdHkuYmluYXJ5VG9CdWZmZXJcclxuICogQHB1YmxpY1xyXG4gKiBAcGFyYW0ge1VpbnQ4QXJyYXl9IGRhdGFcclxuICogQHJldHVybnMge0J1ZmZlcn1cclxuICpcclxuICogQ29udmVydHMgYSBVaW50OEFycmF5IGluc3RhbmNlIHRvIGEgTm9kZSBCdWZmZXIgaW5zdGFuY2VcclxuICovXHJcbkZTLlV0aWxpdHkuYmluYXJ5VG9CdWZmZXIgPSBmdW5jdGlvbihkYXRhKSB7XHJcbiAgdmFyIGxlbiA9IGRhdGEubGVuZ3RoO1xyXG4gIHZhciBidWZmZXIgPSBuZXcgQnVmZmVyKGxlbik7XHJcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBsZW47IGkrKykge1xyXG4gICAgYnVmZmVyW2ldID0gZGF0YVtpXTtcclxuICB9XHJcbiAgcmV0dXJuIGJ1ZmZlcjtcclxufTtcclxuXHJcbi8qKlxyXG4gKiBAbWV0aG9kIEZTLlV0aWxpdHkuYnVmZmVyVG9CaW5hcnlcclxuICogQHB1YmxpY1xyXG4gKiBAcGFyYW0ge0J1ZmZlcn0gZGF0YVxyXG4gKiBAcmV0dXJucyB7VWludDhBcnJheX1cclxuICpcclxuICogQ29udmVydHMgYSBOb2RlIEJ1ZmZlciBpbnN0YW5jZSB0byBhIFVpbnQ4QXJyYXkgaW5zdGFuY2VcclxuICovXHJcbkZTLlV0aWxpdHkuYnVmZmVyVG9CaW5hcnkgPSBmdW5jdGlvbihkYXRhKSB7XHJcbiAgdmFyIGxlbiA9IGRhdGEubGVuZ3RoO1xyXG4gIHZhciBiaW5hcnkgPSBFSlNPTi5uZXdCaW5hcnkobGVuKTtcclxuICBmb3IgKHZhciBpID0gMDsgaSA8IGxlbjsgaSsrKSB7XHJcbiAgICBiaW5hcnlbaV0gPSBkYXRhW2ldO1xyXG4gIH1cclxuICByZXR1cm4gYmluYXJ5O1xyXG59O1xyXG5cclxuLyoqXHJcbiAqIEBtZXRob2QgRlMuVXRpbGl0eS5zYWZlQ2FsbGJhY2tcclxuICogQHB1YmxpY1xyXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBjYWxsYmFja1xyXG4gKiBAcmV0dXJucyB7RnVuY3Rpb259XHJcbiAqXHJcbiAqIE1ha2VzIGEgY2FsbGJhY2sgc2FmZSBmb3IgTWV0ZW9yIGNvZGVcclxuICovXHJcbkZTLlV0aWxpdHkuc2FmZUNhbGxiYWNrID0gZnVuY3Rpb24gKGNhbGxiYWNrKSB7XHJcbiAgcmV0dXJuIE1ldGVvci5iaW5kRW52aXJvbm1lbnQoY2FsbGJhY2ssIGZ1bmN0aW9uKGVycikgeyB0aHJvdyBlcnI7IH0pO1xyXG59O1xyXG5cclxuLyoqXHJcbiAqIEBtZXRob2QgRlMuVXRpbGl0eS5zYWZlU3RyZWFtXHJcbiAqIEBwdWJsaWNcclxuICogQHBhcmFtIHtTdHJlYW19IG5vZGVzdHJlYW1cclxuICogQHJldHVybnMge1N0cmVhbX1cclxuICpcclxuICogQWRkcyBgc2FmZU9uYCBhbmQgYHNhZmVPbmNlYCBtZXRob2RzIHRvIGEgTm9kZUpTIFN0cmVhbVxyXG4gKiBvYmplY3QuIFRoZXNlIGFyZSB0aGUgc2FtZSBhcyBgb25gIGFuZCBgb25jZWAsIGV4Y2VwdFxyXG4gKiB0aGF0IHRoZSBjYWxsYmFjayBpcyB3cmFwcGVkIGZvciB1c2UgaW4gTWV0ZW9yLlxyXG4gKi9cclxuRlMuVXRpbGl0eS5zYWZlU3RyZWFtID0gZnVuY3Rpb24obm9kZXN0cmVhbSkge1xyXG4gIGlmICghbm9kZXN0cmVhbSB8fCB0eXBlb2Ygbm9kZXN0cmVhbS5vbiAhPT0gJ2Z1bmN0aW9uJylcclxuICAgIHRocm93IG5ldyBFcnJvcignRlMuVXRpbGl0eS5zYWZlU3RyZWFtIHJlcXVpcmVzIGEgTm9kZUpTIFN0cmVhbScpO1xyXG5cclxuICAvLyBDcmVhdGUgTWV0ZW9yIHNhZmUgZXZlbnRzXHJcbiAgbm9kZXN0cmVhbS5zYWZlT24gPSBmdW5jdGlvbihuYW1lLCBjYWxsYmFjaykge1xyXG4gICAgcmV0dXJuIG5vZGVzdHJlYW0ub24obmFtZSwgRlMuVXRpbGl0eS5zYWZlQ2FsbGJhY2soY2FsbGJhY2spKTtcclxuICB9O1xyXG5cclxuICAvLyBDcmVhdGUgTWV0ZW9yIHNhZmUgZXZlbnRzXHJcbiAgbm9kZXN0cmVhbS5zYWZlT25jZSA9IGZ1bmN0aW9uKG5hbWUsIGNhbGxiYWNrKSB7XHJcbiAgICByZXR1cm4gbm9kZXN0cmVhbS5vbmNlKG5hbWUsIEZTLlV0aWxpdHkuc2FmZUNhbGxiYWNrKGNhbGxiYWNrKSk7XHJcbiAgfTtcclxuXHJcbiAgLy8gUmV0dXJuIHRoZSBtb2RpZmllZCBzdHJlYW0gLSBtb2RpZmllZCBhbnl3YXlcclxuICByZXR1cm4gbm9kZXN0cmVhbTtcclxufTtcclxuXHJcbi8qKlxyXG4gKiBAbWV0aG9kIEZTLlV0aWxpdHkuZWFjaEZpbGVGcm9tUGF0aFxyXG4gKiBAcHVibGljXHJcbiAqIEBwYXJhbSB7U3RyaW5nfSBwIC0gU2VydmVyIHBhdGhcclxuICogQHBhcmFtIHtGdW5jdGlvbn0gZiAtIEZ1bmN0aW9uIHRvIHJ1biBmb3IgZWFjaCBmaWxlIGZvdW5kIGluIHRoZSBwYXRoLlxyXG4gKiBAcmV0dXJucyB7dW5kZWZpbmVkfVxyXG4gKlxyXG4gKiBVdGlsaXR5IGZvciBpdGVyYXRpb24gb3ZlciBmaWxlcyBmcm9tIHBhdGggb24gc2VydmVyXHJcbiAqL1xyXG5GUy5VdGlsaXR5LmVhY2hGaWxlRnJvbVBhdGggPSBmdW5jdGlvbihwLCBmKSB7XHJcbiAgdmFyIGZzID0gcmVxdWlyZSgnZnMnKTtcclxuICB2YXIgcGF0aCA9IHJlcXVpcmUoJ3BhdGgnKTtcclxuICB2YXIgZmlsZXMgPSBmcy5yZWFkZGlyU3luYyhwKTtcclxuICBmaWxlcy5tYXAoZnVuY3Rpb24gKGZpbGUpIHtcclxuICAgIHJldHVybiBwYXRoLmpvaW4ocCwgZmlsZSk7XHJcbiAgfSkuZmlsdGVyKGZ1bmN0aW9uIChmaWxlUGF0aCkge1xyXG4gICAgcmV0dXJuIGZzLnN0YXRTeW5jKGZpbGVQYXRoKS5pc0ZpbGUoKSAmJiBwYXRoLmJhc2VuYW1lKGZpbGVQYXRoKVswXSAhPT0gJy4nO1xyXG4gIH0pLmZvckVhY2goZnVuY3Rpb24gKGZpbGVQYXRoKSB7XHJcbiAgICBmKGZpbGVQYXRoKTtcclxuICB9KTtcclxufTtcclxuIl19
