(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var global = Package.meteor.global;
var meteorEnv = Package.meteor.meteorEnv;
var ECMAScript = Package.ecmascript.ECMAScript;
var EJSON = Package.ejson.EJSON;
var meteorInstall = Package.modules.meteorInstall;
var Promise = Package.promise.Promise;

/* Package-scope variables */
var DataMan;

var require = meteorInstall({"node_modules":{"meteor":{"steedos:cfs-data-man":{"checkNpm.js":function module(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/steedos_cfs-data-man/checkNpm.js                                                                           //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
let checkNpmVersions;
module.link("meteor/tmeasday:check-npm-versions", {
  checkNpmVersions(v) {
    checkNpmVersions = v;
  }

}, 0);

// fix warning: xxx not installed
require("mime/package.json");

require("temp/package.json");

checkNpmVersions({
  mime: "^2.0.2",
  'buffer-stream-reader': "0.1.1",
  //request: "2.44.0",
  // We use a specific commit from a fork of "request" package for now; we need fix for
  // https://github.com/mikeal/request/issues/887 (https://github.com/CollectionFS/Meteor-CollectionFS/issues/347)
  request: "^2.81.0",
  temp: "0.7.0" // for tests only

}, 'steedos:cfs-data-man');
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"server":{"data-man-api.js":function module(require){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/steedos_cfs-data-man/server/data-man-api.js                                                                //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
/* global DataMan:true, Buffer */
var fs = require("fs");

var Readable = require('stream').Readable;
/**
 * @method DataMan
 * @public
 * @constructor
 * @param {Buffer|ArrayBuffer|Uint8Array|String} data The data that you want to manipulate.
 * @param {String} [type] The data content (MIME) type, if known. Required if the first argument is a Buffer, ArrayBuffer, Uint8Array, or URL
 * @param {Object} [options] Currently used only to pass options for the GET request when `data` is a URL.
 */


DataMan = function DataMan(data, type, options) {
  var self = this,
      buffer;

  if (!data) {
    throw new Error("DataMan constructor requires a data argument");
  } // The end result of all this is that we will have this.source set to a correct
  // data type handler. We are simply detecting what the data arg is.
  //
  // Unless we already have in-memory data, we don't load anything into memory
  // and instead rely on obtaining a read stream when the time comes.


  if (typeof Buffer !== "undefined" && data instanceof Buffer) {
    if (!type) {
      throw new Error("DataMan constructor requires a type argument when passed a Buffer");
    }

    self.source = new DataMan.Buffer(data, type);
  } else if (typeof ArrayBuffer !== "undefined" && data instanceof ArrayBuffer) {
    if (typeof Buffer === "undefined") {
      throw new Error("Buffer support required to handle an ArrayBuffer");
    }

    if (!type) {
      throw new Error("DataMan constructor requires a type argument when passed an ArrayBuffer");
    }

    buffer = new Buffer(new Uint8Array(data));
    self.source = new DataMan.Buffer(buffer, type);
  } else if (EJSON.isBinary(data)) {
    if (typeof Buffer === "undefined") {
      throw new Error("Buffer support required to handle an ArrayBuffer");
    }

    if (!type) {
      throw new Error("DataMan constructor requires a type argument when passed a Uint8Array");
    }

    buffer = new Buffer(data);
    self.source = new DataMan.Buffer(buffer, type);
  } else if (typeof Readable !== "undefined" && data instanceof Readable) {
    if (!type) {
      throw new Error("DataMan constructor requires a type argument when passed a stream.Readable");
    }

    self.source = new DataMan.ReadStream(data, type);
  } else if (typeof data === "string") {
    if (data.slice(0, 5) === "data:") {
      self.source = new DataMan.DataURI(data);
    } else if (data.slice(0, 5) === "http:" || data.slice(0, 6) === "https:") {
      if (!type) {
        throw new Error("DataMan constructor requires a type argument when passed a URL");
      }

      self.source = new DataMan.URL(data, type, options);
    } else {
      // assume it's a filepath
      self.source = new DataMan.FilePath(data, type);
    }
  } else {
    throw new Error("DataMan constructor received data that it doesn't support");
  }
};
/**
 * @method DataMan.prototype.getBuffer
 * @public
 * @param {function} [callback] callback(err, buffer)
 * @returns {Buffer|undefined}
 *
 * Returns a Buffer representing this data, or passes the Buffer to a callback.
 */


DataMan.prototype.getBuffer = function dataManGetBuffer(callback) {
  var self = this;
  return callback ? self.source.getBuffer(callback) : Meteor.wrapAsync(bind(self.source.getBuffer, self.source))();
};

function _saveToFile(readStream, filePath, callback) {
  var writeStream = fs.createWriteStream(filePath);
  writeStream.on('close', Meteor.bindEnvironment(function () {
    callback();
  }, function (error) {
    callback(error);
  }));
  writeStream.on('error', Meteor.bindEnvironment(function (error) {
    callback(error);
  }, function (error) {
    callback(error);
  }));
  readStream.pipe(writeStream);
}
/**
 * @method DataMan.prototype.saveToFile
 * @public
 * @param {String} filePath
 * @param {Function} callback
 * @returns {undefined}
 *
 * Saves this data to a filepath on the local filesystem.
 */


DataMan.prototype.saveToFile = function dataManSaveToFile(filePath, callback) {
  var readStream = this.createReadStream();
  return callback ? _saveToFile(readStream, filePath, callback) : Meteor.wrapAsync(_saveToFile)(readStream, filePath);
};
/**
 * @method DataMan.prototype.getDataUri
 * @public
 * @param {function} [callback] callback(err, dataUri)
 *
 * If no callback, returns the data URI.
 */


DataMan.prototype.getDataUri = function dataManGetDataUri(callback) {
  var self = this;
  return callback ? self.source.getDataUri(callback) : Meteor.wrapAsync(bind(self.source.getDataUri, self.source))();
};
/**
 * @method DataMan.prototype.createReadStream
 * @public
 *
 * Returns a read stream for the data.
 */


DataMan.prototype.createReadStream = function dataManCreateReadStream() {
  return this.source.createReadStream();
};
/**
 * @method DataMan.prototype.size
 * @public
 * @param {function} [callback] callback(err, size)
 *
 * If no callback, returns the size in bytes of the data.
 */


DataMan.prototype.size = function dataManSize(callback) {
  var self = this;
  return callback ? self.source.size(callback) : Meteor.wrapAsync(bind(self.source.size, self.source))();
};
/**
 * @method DataMan.prototype.type
 * @public
 *
 * Returns the type of the data.
 */


DataMan.prototype.type = function dataManType() {
  return this.source.type();
};
/*
 * "bind" shim; from underscorejs, but we avoid a dependency
 */


var slice = Array.prototype.slice;
var nativeBind = Function.prototype.bind;

var ctor = function () {};

function isFunction(obj) {
  return Object.prototype.toString.call(obj) == '[object Function]';
}

function bind(func, context) {
  var args, bound;
  if (nativeBind && func.bind === nativeBind) return nativeBind.apply(func, slice.call(arguments, 1));
  if (!isFunction(func)) throw new TypeError();
  args = slice.call(arguments, 2);
  return bound = function () {
    if (!(this instanceof bound)) return func.apply(context, args.concat(slice.call(arguments)));
    ctor.prototype = func.prototype;
    var self = new ctor();
    ctor.prototype = null;
    var result = func.apply(self, args.concat(slice.call(arguments)));
    if (Object(result) === result) return result;
    return self;
  };
}
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"data-man-buffer.js":function module(require){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/steedos_cfs-data-man/server/data-man-buffer.js                                                             //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
var bufferStreamReader = require('buffer-stream-reader');
/**
 * @method DataMan.Buffer
 * @public
 * @constructor
 * @param {Buffer} buffer
 * @param {String} type The data content (MIME) type.
 */


DataMan.Buffer = function DataManBuffer(buffer, type) {
  var self = this;
  self.buffer = buffer;
  self._type = type;
};
/**
 * @method DataMan.Buffer.prototype.getBuffer
 * @private
 * @param {function} callback callback(err, buffer)
 * @returns {Buffer|undefined}
 *
 * Passes a Buffer representing the data to a callback.
 */


DataMan.Buffer.prototype.getBuffer = function dataManBufferGetBuffer(callback) {
  callback(null, this.buffer);
};
/**
 * @method DataMan.Buffer.prototype.getDataUri
 * @private
 * @param {function} callback callback(err, dataUri)
 *
 * Passes a data URI representing the data in the buffer to a callback.
 */


DataMan.Buffer.prototype.getDataUri = function dataManBufferGetDataUri(callback) {
  var self = this;

  if (!self._type) {
    callback(new Error("DataMan.getDataUri couldn't get a contentType"));
  } else {
    var dataUri = "data:" + self._type + ";base64," + self.buffer.toString("base64");
    callback(null, dataUri);
  }
};
/**
 * @method DataMan.Buffer.prototype.createReadStream
 * @private
 *
 * Returns a read stream for the data.
 */


DataMan.Buffer.prototype.createReadStream = function dataManBufferCreateReadStream() {
  return new bufferStreamReader(this.buffer);
};
/**
 * @method DataMan.Buffer.prototype.size
 * @param {function} callback callback(err, size)
 * @private
 *
 * Passes the size in bytes of the data in the buffer to a callback.
 */


DataMan.Buffer.prototype.size = function dataManBufferSize(callback) {
  var self = this;

  if (typeof self._size === "number") {
    callback(null, self._size);
    return;
  }

  self._size = self.buffer.length;
  callback(null, self._size);
};
/**
 * @method DataMan.Buffer.prototype.type
 * @private
 *
 * Returns the type of the data.
 */


DataMan.Buffer.prototype.type = function dataManBufferType() {
  return this._type;
};
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"data-man-datauri.js":function module(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/steedos_cfs-data-man/server/data-man-datauri.js                                                            //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
/**
 * @method DataMan.DataURI
 * @public
 * @constructor
 * @param {String} dataUri
 */
DataMan.DataURI = function DataManDataURI(dataUri) {
  var self = this;
  var pieces = dataUri.match(/^data:(.*);base64,(.*)$/);
  var buffer = new Buffer(pieces[2], 'base64');
  return new DataMan.Buffer(buffer, pieces[1]);
};

DataMan.DataURI.prototype = DataMan.Buffer.prototype;
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"data-man-filepath.js":function module(require){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/steedos_cfs-data-man/server/data-man-filepath.js                                                           //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
var mime = require('mime');

var fs = require("fs");
/**
 * @method DataMan.FilePath
 * @public
 * @constructor
 * @param {String} filepath
 * @param {String} [type] The data content (MIME) type. Will lookup from file if not passed.
 */


DataMan.FilePath = function DataManFilePath(filepath, type) {
  var self = this;
  self.filepath = filepath;
  self._type = type || mime.lookup(filepath);
};
/**
 * @method DataMan.FilePath.prototype.getBuffer
 * @private
 * @param {function} callback callback(err, buffer)
 * @returns {Buffer|undefined}
 *
 * Passes a Buffer representing the data to a callback.
 */


DataMan.FilePath.prototype.getBuffer = function dataManFilePathGetBuffer(callback) {
  var self = this; // Call node readFile

  fs.readFile(self.filepath, Meteor.bindEnvironment(function (err, buffer) {
    callback(err, buffer);
  }, function (err) {
    callback(err);
  }));
};
/**
 * @method DataMan.FilePath.prototype.getDataUri
 * @private
 * @param {function} callback callback(err, dataUri)
 *
 * Passes a data URI representing the data to a callback.
 */


DataMan.FilePath.prototype.getDataUri = function dataManFilePathGetDataUri(callback) {
  var self = this;
  self.getBuffer(function (error, buffer) {
    if (error) {
      callback(error);
    } else {
      if (!self._type) {
        callback(new Error("DataMan.getDataUri couldn't get a contentType"));
      } else {
        var dataUri = "data:" + self._type + ";base64," + buffer.toString("base64");
        buffer = null;
        callback(null, dataUri);
      }
    }
  });
};
/**
 * @method DataMan.FilePath.prototype.createReadStream
 * @private
 *
 * Returns a read stream for the data.
 */


DataMan.FilePath.prototype.createReadStream = function dataManFilePathCreateReadStream() {
  // Stream from filesystem
  return fs.createReadStream(this.filepath);
};
/**
 * @method DataMan.FilePath.prototype.size
 * @param {function} callback callback(err, size)
 * @private
 *
 * Passes the size in bytes of the data to a callback.
 */


DataMan.FilePath.prototype.size = function dataManFilePathSize(callback) {
  var self = this;

  if (typeof self._size === "number") {
    callback(null, self._size);
    return;
  } // We can get the size without buffering


  fs.stat(self.filepath, Meteor.bindEnvironment(function (error, stats) {
    if (stats && typeof stats.size === "number") {
      self._size = stats.size;
      callback(null, self._size);
    } else {
      callback(error);
    }
  }, function (error) {
    callback(error);
  }));
};
/**
 * @method DataMan.FilePath.prototype.type
 * @private
 *
 * Returns the type of the data.
 */


DataMan.FilePath.prototype.type = function dataManFilePathType() {
  return this._type;
};
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"data-man-url.js":function module(require){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/steedos_cfs-data-man/server/data-man-url.js                                                                //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
var request = require("request");
/**
 * @method DataMan.URL
 * @public
 * @constructor
 * @param {String} url
 * @param {String} type The data content (MIME) type.
 */


DataMan.URL = function DataManURL(url, type, options) {
  var self = this;
  options = options || {};
  self.url = url;
  self._type = type; // This is some code borrowed from the http package. Hopefully
  // we can eventually use HTTP pkg directly instead of 'request'
  // once it supports streams and buffers and such. (`request` takes
  // and `auth` option, too, but not of the same form as `HTTP`.)

  if (options.auth) {
    if (options.auth.indexOf(':') < 0) throw new Error('auth option should be of the form "username:password"');
    options.headers = options.headers || {};
    options.headers['Authorization'] = "Basic " + new Buffer(options.auth, "ascii").toString("base64");
    delete options.auth;
  }

  self.urlOpts = options;
};
/**
 * @method DataMan.URL.prototype.getBuffer
 * @private
 * @param {function} callback callback(err, buffer)
 * @returns {Buffer|undefined}
 *
 * Passes a Buffer representing the data at the URL to a callback.
 */


DataMan.URL.prototype.getBuffer = function dataManUrlGetBuffer(callback) {
  var self = this;
  request(_.extend({
    url: self.url,
    method: "GET",
    encoding: null,
    jar: false
  }, self.urlOpts), Meteor.bindEnvironment(function (err, res, body) {
    if (err) {
      callback(err);
    } else {
      self._type = res.headers['content-type'];
      callback(null, body);
    }
  }, function (err) {
    callback(err);
  }));
};
/**
 * @method DataMan.URL.prototype.getDataUri
 * @private
 * @param {function} callback callback(err, dataUri)
 *
 * Passes a data URI representing the data at the URL to a callback.
 */


DataMan.URL.prototype.getDataUri = function dataManUrlGetDataUri(callback) {
  var self = this;
  self.getBuffer(function (error, buffer) {
    if (error) {
      callback(error);
    } else {
      if (!self._type) {
        callback(new Error("DataMan.getDataUri couldn't get a contentType"));
      } else {
        var dataUri = "data:" + self._type + ";base64," + buffer.toString("base64");
        callback(null, dataUri);
      }
    }
  });
};
/**
 * @method DataMan.URL.prototype.createReadStream
 * @private
 *
 * Returns a read stream for the data.
 */


DataMan.URL.prototype.createReadStream = function dataManUrlCreateReadStream() {
  var self = this; // Stream from URL

  return request(_.extend({
    url: self.url,
    method: "GET"
  }, self.urlOpts));
};
/**
 * @method DataMan.URL.prototype.size
 * @param {function} callback callback(err, size)
 * @private
 *
 * Returns the size in bytes of the data at the URL.
 */


DataMan.URL.prototype.size = function dataManUrlSize(callback) {
  var self = this;

  if (typeof self._size === "number") {
    callback(null, self._size);
    return;
  }

  self.getBuffer(function (error, buffer) {
    if (error) {
      callback(error);
    } else {
      self._size = buffer.length;
      callback(null, self._size);
    }
  });
};
/**
 * @method DataMan.URL.prototype.type
 * @private
 *
 * Returns the type of the data.
 */


DataMan.URL.prototype.type = function dataManUrlType() {
  return this._type;
};
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"data-man-readstream.js":function module(require){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/steedos_cfs-data-man/server/data-man-readstream.js                                                         //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
/* global DataMan */
var PassThrough = require('stream').PassThrough;
/**
 * @method DataMan.ReadStream
 * @public
 * @constructor
 * @param {ReadStream} stream
 * @param {String} type The data content (MIME) type.
 */


DataMan.ReadStream = function DataManBuffer(stream, type) {
  var self = this; // Create a bufferable / paused new stream...

  var pt = new PassThrough(); // Pipe provided read stream into pass-through stream

  stream.pipe(pt); // Set pass-through stream reference

  self.stream = pt; // Set type as provided

  self._type = type;
};
/**
 * @method DataMan.ReadStream.prototype.getBuffer
 * @private
 * @param {function} callback callback(err, buffer)
 * @returns {undefined}
 *
 * Passes a Buffer representing the data to a callback.
 */


DataMan.ReadStream.prototype.getBuffer = function dataManReadStreamGetBuffer()
/*callback*/
{// TODO implement as passthrough stream?
};
/**
 * @method DataMan.ReadStream.prototype.getDataUri
 * @private
 * @param {function} callback callback(err, dataUri)
 *
 * Passes a data URI representing the data in the stream to a callback.
 */


DataMan.ReadStream.prototype.getDataUri = function dataManReadStreamGetDataUri()
/*callback*/
{// TODO implement as passthrough stream?
};
/**
 * @method DataMan.ReadStream.prototype.createReadStream
 * @private
 *
 * Returns a read stream for the data.
 */


DataMan.ReadStream.prototype.createReadStream = function dataManReadStreamCreateReadStream() {
  return this.stream;
};
/**
 * @method DataMan.ReadStream.prototype.size
 * @param {function} callback callback(err, size)
 * @private
 *
 * Passes the size in bytes of the data in the stream to a callback.
 */


DataMan.ReadStream.prototype.size = function dataManReadStreamSize(callback) {
  callback(0); // will determine from stream later
};
/**
 * @method DataMan.ReadStream.prototype.type
 * @private
 *
 * Returns the type of the data.
 */


DataMan.ReadStream.prototype.type = function dataManReadStreamType() {
  return this._type;
};
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}}}}}},{
  "extensions": [
    ".js",
    ".json"
  ]
});

require("/node_modules/meteor/steedos:cfs-data-man/checkNpm.js");
require("/node_modules/meteor/steedos:cfs-data-man/server/data-man-api.js");
require("/node_modules/meteor/steedos:cfs-data-man/server/data-man-buffer.js");
require("/node_modules/meteor/steedos:cfs-data-man/server/data-man-datauri.js");
require("/node_modules/meteor/steedos:cfs-data-man/server/data-man-filepath.js");
require("/node_modules/meteor/steedos:cfs-data-man/server/data-man-url.js");
require("/node_modules/meteor/steedos:cfs-data-man/server/data-man-readstream.js");

/* Exports */
Package._define("steedos:cfs-data-man", {
  DataMan: DataMan
});

})();

//# sourceURL=meteor://💻app/packages/steedos_cfs-data-man.js
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvczpjZnMtZGF0YS1tYW4vY2hlY2tOcG0uanMiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3M6Y2ZzLWRhdGEtbWFuL3NlcnZlci9kYXRhLW1hbi1hcGkuanMiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3M6Y2ZzLWRhdGEtbWFuL3NlcnZlci9kYXRhLW1hbi1idWZmZXIuanMiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3M6Y2ZzLWRhdGEtbWFuL3NlcnZlci9kYXRhLW1hbi1kYXRhdXJpLmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zOmNmcy1kYXRhLW1hbi9zZXJ2ZXIvZGF0YS1tYW4tZmlsZXBhdGguanMiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3M6Y2ZzLWRhdGEtbWFuL3NlcnZlci9kYXRhLW1hbi11cmwuanMiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3M6Y2ZzLWRhdGEtbWFuL3NlcnZlci9kYXRhLW1hbi1yZWFkc3RyZWFtLmpzIl0sIm5hbWVzIjpbImNoZWNrTnBtVmVyc2lvbnMiLCJtb2R1bGUiLCJsaW5rIiwidiIsInJlcXVpcmUiLCJtaW1lIiwicmVxdWVzdCIsInRlbXAiLCJmcyIsIlJlYWRhYmxlIiwiRGF0YU1hbiIsImRhdGEiLCJ0eXBlIiwib3B0aW9ucyIsInNlbGYiLCJidWZmZXIiLCJFcnJvciIsIkJ1ZmZlciIsInNvdXJjZSIsIkFycmF5QnVmZmVyIiwiVWludDhBcnJheSIsIkVKU09OIiwiaXNCaW5hcnkiLCJSZWFkU3RyZWFtIiwic2xpY2UiLCJEYXRhVVJJIiwiVVJMIiwiRmlsZVBhdGgiLCJwcm90b3R5cGUiLCJnZXRCdWZmZXIiLCJkYXRhTWFuR2V0QnVmZmVyIiwiY2FsbGJhY2siLCJNZXRlb3IiLCJ3cmFwQXN5bmMiLCJiaW5kIiwiX3NhdmVUb0ZpbGUiLCJyZWFkU3RyZWFtIiwiZmlsZVBhdGgiLCJ3cml0ZVN0cmVhbSIsImNyZWF0ZVdyaXRlU3RyZWFtIiwib24iLCJiaW5kRW52aXJvbm1lbnQiLCJlcnJvciIsInBpcGUiLCJzYXZlVG9GaWxlIiwiZGF0YU1hblNhdmVUb0ZpbGUiLCJjcmVhdGVSZWFkU3RyZWFtIiwiZ2V0RGF0YVVyaSIsImRhdGFNYW5HZXREYXRhVXJpIiwiZGF0YU1hbkNyZWF0ZVJlYWRTdHJlYW0iLCJzaXplIiwiZGF0YU1hblNpemUiLCJkYXRhTWFuVHlwZSIsIkFycmF5IiwibmF0aXZlQmluZCIsIkZ1bmN0aW9uIiwiY3RvciIsImlzRnVuY3Rpb24iLCJvYmoiLCJPYmplY3QiLCJ0b1N0cmluZyIsImNhbGwiLCJmdW5jIiwiY29udGV4dCIsImFyZ3MiLCJib3VuZCIsImFwcGx5IiwiYXJndW1lbnRzIiwiVHlwZUVycm9yIiwiY29uY2F0IiwicmVzdWx0IiwiYnVmZmVyU3RyZWFtUmVhZGVyIiwiRGF0YU1hbkJ1ZmZlciIsIl90eXBlIiwiZGF0YU1hbkJ1ZmZlckdldEJ1ZmZlciIsImRhdGFNYW5CdWZmZXJHZXREYXRhVXJpIiwiZGF0YVVyaSIsImRhdGFNYW5CdWZmZXJDcmVhdGVSZWFkU3RyZWFtIiwiZGF0YU1hbkJ1ZmZlclNpemUiLCJfc2l6ZSIsImxlbmd0aCIsImRhdGFNYW5CdWZmZXJUeXBlIiwiRGF0YU1hbkRhdGFVUkkiLCJwaWVjZXMiLCJtYXRjaCIsIkRhdGFNYW5GaWxlUGF0aCIsImZpbGVwYXRoIiwibG9va3VwIiwiZGF0YU1hbkZpbGVQYXRoR2V0QnVmZmVyIiwicmVhZEZpbGUiLCJlcnIiLCJkYXRhTWFuRmlsZVBhdGhHZXREYXRhVXJpIiwiZGF0YU1hbkZpbGVQYXRoQ3JlYXRlUmVhZFN0cmVhbSIsImRhdGFNYW5GaWxlUGF0aFNpemUiLCJzdGF0Iiwic3RhdHMiLCJkYXRhTWFuRmlsZVBhdGhUeXBlIiwiRGF0YU1hblVSTCIsInVybCIsImF1dGgiLCJpbmRleE9mIiwiaGVhZGVycyIsInVybE9wdHMiLCJkYXRhTWFuVXJsR2V0QnVmZmVyIiwiXyIsImV4dGVuZCIsIm1ldGhvZCIsImVuY29kaW5nIiwiamFyIiwicmVzIiwiYm9keSIsImRhdGFNYW5VcmxHZXREYXRhVXJpIiwiZGF0YU1hblVybENyZWF0ZVJlYWRTdHJlYW0iLCJkYXRhTWFuVXJsU2l6ZSIsImRhdGFNYW5VcmxUeXBlIiwiUGFzc1Rocm91Z2giLCJzdHJlYW0iLCJwdCIsImRhdGFNYW5SZWFkU3RyZWFtR2V0QnVmZmVyIiwiZGF0YU1hblJlYWRTdHJlYW1HZXREYXRhVXJpIiwiZGF0YU1hblJlYWRTdHJlYW1DcmVhdGVSZWFkU3RyZWFtIiwiZGF0YU1hblJlYWRTdHJlYW1TaXplIiwiZGF0YU1hblJlYWRTdHJlYW1UeXBlIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUEsSUFBSUEsZ0JBQUo7QUFBcUJDLE1BQU0sQ0FBQ0MsSUFBUCxDQUFZLG9DQUFaLEVBQWlEO0FBQUNGLGtCQUFnQixDQUFDRyxDQUFELEVBQUc7QUFBQ0gsb0JBQWdCLEdBQUNHLENBQWpCO0FBQW1COztBQUF4QyxDQUFqRCxFQUEyRixDQUEzRjs7QUFBckI7QUFDQUMsT0FBTyxDQUFDLG1CQUFELENBQVA7O0FBQ0FBLE9BQU8sQ0FBQyxtQkFBRCxDQUFQOztBQUdBSixnQkFBZ0IsQ0FBQztBQUNoQkssTUFBSSxFQUFFLFFBRFU7QUFFaEIsMEJBQXdCLE9BRlI7QUFHaEI7QUFDQTtBQUNBO0FBQ0FDLFNBQU8sRUFBRSxTQU5PO0FBT2hCQyxNQUFJLEVBQUUsT0FQVSxDQU9GOztBQVBFLENBQUQsRUFRYixzQkFSYSxDQUFoQixDOzs7Ozs7Ozs7OztBQ0xBO0FBRUEsSUFBSUMsRUFBRSxHQUFHSixPQUFPLENBQUMsSUFBRCxDQUFoQjs7QUFDQSxJQUFJSyxRQUFRLEdBQUdMLE9BQU8sQ0FBQyxRQUFELENBQVAsQ0FBa0JLLFFBQWpDO0FBRUE7Ozs7Ozs7Ozs7QUFRQUMsT0FBTyxHQUFHLFNBQVNBLE9BQVQsQ0FBaUJDLElBQWpCLEVBQXVCQyxJQUF2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QUFULEdBQTZDO0FBQzNGLFNBQU8sS0FBS0osTUFBWjtBQUNELENBRkQ7QUFJQTs7Ozs7Ozs7O0FBT0ExRyxPQUFPLENBQUNhLFVBQVIsQ0FBbUJLLFNBQW5CLENBQTZCc0IsSUFBN0IsR0FBb0MsU0FBU3VFLHFCQUFULENBQStCMUYsUUFBL0IsRUFBeUM7QUFDM0VBLFVBQVEsQ0FBQyxDQUFELENBQVIsQ0FEMkUsQ0FDOUQ7QUFDZCxDQUZEO0FBSUE7Ozs7Ozs7O0FBTUFyQixPQUFPLENBQUNhLFVBQVIsQ0FBbUJLLFNBQW5CLENBQTZCaEIsSUFBN0IsR0FBb0MsU0FBUzhHLHFCQUFULEdBQWlDO0FBQ25FLFNBQU8sS0FBS2pELEtBQVo7QUFDRCxDQUZELEMiLCJmaWxlIjoiL3BhY2thZ2VzL3N0ZWVkb3NfY2ZzLWRhdGEtbWFuLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLy8gZml4IHdhcm5pbmc6IHh4eCBub3QgaW5zdGFsbGVkXHJcbnJlcXVpcmUoXCJtaW1lL3BhY2thZ2UuanNvblwiKTtcclxucmVxdWlyZShcInRlbXAvcGFja2FnZS5qc29uXCIpO1xyXG5cclxuaW1wb3J0IHsgY2hlY2tOcG1WZXJzaW9ucyB9IGZyb20gJ21ldGVvci90bWVhc2RheTpjaGVjay1ucG0tdmVyc2lvbnMnO1xyXG5jaGVja05wbVZlcnNpb25zKHtcclxuXHRtaW1lOiBcIl4yLjAuMlwiLFxyXG5cdCdidWZmZXItc3RyZWFtLXJlYWRlcic6IFwiMC4xLjFcIixcclxuXHQvL3JlcXVlc3Q6IFwiMi40NC4wXCIsXHJcblx0Ly8gV2UgdXNlIGEgc3BlY2lmaWMgY29tbWl0IGZyb20gYSBmb3JrIG9mIFwicmVxdWVzdFwiIHBhY2thZ2UgZm9yIG5vdzsgd2UgbmVlZCBmaXggZm9yXHJcblx0Ly8gaHR0cHM6Ly9naXRodWIuY29tL21pa2VhbC9yZXF1ZXN0L2lzc3Vlcy84ODcgKGh0dHBzOi8vZ2l0aHViLmNvbS9Db2xsZWN0aW9uRlMvTWV0ZW9yLUNvbGxlY3Rpb25GUy9pc3N1ZXMvMzQ3KVxyXG5cdHJlcXVlc3Q6IFwiXjIuODEuMFwiLFxyXG5cdHRlbXA6IFwiMC43LjBcIiAvLyBmb3IgdGVzdHMgb25seVxyXG59LCAnc3RlZWRvczpjZnMtZGF0YS1tYW4nKTsiLCIvKiBnbG9iYWwgRGF0YU1hbjp0cnVlLCBCdWZmZXIgKi9cclxuXHJcbnZhciBmcyA9IHJlcXVpcmUoXCJmc1wiKTtcclxudmFyIFJlYWRhYmxlID0gcmVxdWlyZSgnc3RyZWFtJykuUmVhZGFibGU7XHJcblxyXG4vKipcclxuICogQG1ldGhvZCBEYXRhTWFuXHJcbiAqIEBwdWJsaWNcclxuICogQGNvbnN0cnVjdG9yXHJcbiAqIEBwYXJhbSB7QnVmZmVyfEFycmF5QnVmZmVyfFVpbnQ4QXJyYXl8U3RyaW5nfSBkYXRhIFRoZSBkYXRhIHRoYXQgeW91IHdhbnQgdG8gbWFuaXB1bGF0ZS5cclxuICogQHBhcmFtIHtTdHJpbmd9IFt0eXBlXSBUaGUgZGF0YSBjb250ZW50IChNSU1FKSB0eXBlLCBpZiBrbm93bi4gUmVxdWlyZWQgaWYgdGhlIGZpcnN0IGFyZ3VtZW50IGlzIGEgQnVmZmVyLCBBcnJheUJ1ZmZlciwgVWludDhBcnJheSwgb3IgVVJMXHJcbiAqIEBwYXJhbSB7T2JqZWN0fSBbb3B0aW9uc10gQ3VycmVudGx5IHVzZWQgb25seSB0byBwYXNzIG9wdGlvbnMgZm9yIHRoZSBHRVQgcmVxdWVzdCB3aGVuIGBkYXRhYCBpcyBhIFVSTC5cclxuICovXHJcbkRhdGFNYW4gPSBmdW5jdGlvbiBEYXRhTWFuKGRhdGEsIHR5cGUsIG9wdGlvbnMpIHtcclxuICB2YXIgc2VsZiA9IHRoaXMsIGJ1ZmZlcjtcclxuXHJcbiAgaWYgKCFkYXRhKSB7XHJcbiAgICB0aHJvdyBuZXcgRXJyb3IoXCJEYXRhTWFuIGNvbnN0cnVjdG9yIHJlcXVpcmVzIGEgZGF0YSBhcmd1bWVudFwiKTtcclxuICB9XHJcblxyXG4gIC8vIFRoZSBlbmQgcmVzdWx0IG9mIGFsbCB0aGlzIGlzIHRoYXQgd2Ugd2lsbCBoYXZlIHRoaXMuc291cmNlIHNldCB0byBhIGNvcnJlY3RcclxuICAvLyBkYXRhIHR5cGUgaGFuZGxlci4gV2UgYXJlIHNpbXBseSBkZXRlY3Rpbmcgd2hhdCB0aGUgZGF0YSBhcmcgaXMuXHJcbiAgLy9cclxuICAvLyBVbmxlc3Mgd2UgYWxyZWFkeSBoYXZlIGluLW1lbW9yeSBkYXRhLCB3ZSBkb24ndCBsb2FkIGFueXRoaW5nIGludG8gbWVtb3J5XHJcbiAgLy8gYW5kIGluc3RlYWQgcmVseSBvbiBvYnRhaW5pbmcgYSByZWFkIHN0cmVhbSB3aGVuIHRoZSB0aW1lIGNvbWVzLlxyXG4gIGlmICh0eXBlb2YgQnVmZmVyICE9PSBcInVuZGVmaW5lZFwiICYmIGRhdGEgaW5zdGFuY2VvZiBCdWZmZXIpIHtcclxuICAgIGlmICghdHlwZSkge1xyXG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXCJEYXRhTWFuIGNvbnN0cnVjdG9yIHJlcXVpcmVzIGEgdHlwZSBhcmd1bWVudCB3aGVuIHBhc3NlZCBhIEJ1ZmZlclwiKTtcclxuICAgIH1cclxuICAgIHNlbGYuc291cmNlID0gbmV3IERhdGFNYW4uQnVmZmVyKGRhdGEsIHR5cGUpO1xyXG4gIH0gZWxzZSBpZiAodHlwZW9mIEFycmF5QnVmZmVyICE9PSBcInVuZGVmaW5lZFwiICYmIGRhdGEgaW5zdGFuY2VvZiBBcnJheUJ1ZmZlcikge1xyXG4gICAgaWYgKHR5cGVvZiBCdWZmZXIgPT09IFwidW5kZWZpbmVkXCIpIHtcclxuICAgICAgdGhyb3cgbmV3IEVycm9yKFwiQnVmZmVyIHN1cHBvcnQgcmVxdWlyZWQgdG8gaGFuZGxlIGFuIEFycmF5QnVmZmVyXCIpO1xyXG4gICAgfVxyXG4gICAgaWYgKCF0eXBlKSB7XHJcbiAgICAgIHRocm93IG5ldyBFcnJvcihcIkRhdGFNYW4gY29uc3RydWN0b3IgcmVxdWlyZXMgYSB0eXBlIGFyZ3VtZW50IHdoZW4gcGFzc2VkIGFuIEFycmF5QnVmZmVyXCIpO1xyXG4gICAgfVxyXG4gICAgYnVmZmVyID0gbmV3IEJ1ZmZlcihuZXcgVWludDhBcnJheShkYXRhKSk7XHJcbiAgICBzZWxmLnNvdXJjZSA9IG5ldyBEYXRhTWFuLkJ1ZmZlcihidWZmZXIsIHR5cGUpO1xyXG4gIH0gZWxzZSBpZiAoRUpTT04uaXNCaW5hcnkoZGF0YSkpIHtcclxuICAgIGlmICh0eXBlb2YgQnVmZmVyID09PSBcInVuZGVmaW5lZFwiKSB7XHJcbiAgICAgIHRocm93IG5ldyBFcnJvcihcIkJ1ZmZlciBzdXBwb3J0IHJlcXVpcmVkIHRvIGhhbmRsZSBhbiBBcnJheUJ1ZmZlclwiKTtcclxuICAgIH1cclxuICAgIGlmICghdHlwZSkge1xyXG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXCJEYXRhTWFuIGNvbnN0cnVjdG9yIHJlcXVpcmVzIGEgdHlwZSBhcmd1bWVudCB3aGVuIHBhc3NlZCBhIFVpbnQ4QXJyYXlcIik7XHJcbiAgICB9XHJcbiAgICBidWZmZXIgPSBuZXcgQnVmZmVyKGRhdGEpO1xyXG4gICAgc2VsZi5zb3VyY2UgPSBuZXcgRGF0YU1hbi5CdWZmZXIoYnVmZmVyLCB0eXBlKTtcclxuICB9IGVsc2UgaWYgKHR5cGVvZiBSZWFkYWJsZSAhPT0gXCJ1bmRlZmluZWRcIiAmJiBkYXRhIGluc3RhbmNlb2YgUmVhZGFibGUpIHtcclxuICAgIGlmICghdHlwZSkge1xyXG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXCJEYXRhTWFuIGNvbnN0cnVjdG9yIHJlcXVpcmVzIGEgdHlwZSBhcmd1bWVudCB3aGVuIHBhc3NlZCBhIHN0cmVhbS5SZWFkYWJsZVwiKTtcclxuICAgIH1cclxuICAgIHNlbGYuc291cmNlID0gbmV3IERhdGFNYW4uUmVhZFN0cmVhbShkYXRhLCB0eXBlKTtcclxuICB9IGVsc2UgaWYgKHR5cGVvZiBkYXRhID09PSBcInN0cmluZ1wiKSB7XHJcbiAgICBpZiAoZGF0YS5zbGljZSgwLCA1KSA9PT0gXCJkYXRhOlwiKSB7XHJcbiAgICAgIHNlbGYuc291cmNlID0gbmV3IERhdGFNYW4uRGF0YVVSSShkYXRhKTtcclxuICAgIH0gZWxzZSBpZiAoZGF0YS5zbGljZSgwLCA1KSA9PT0gXCJodHRwOlwiIHx8IGRhdGEuc2xpY2UoMCwgNikgPT09IFwiaHR0cHM6XCIpIHtcclxuICAgICAgaWYgKCF0eXBlKSB7XHJcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiRGF0YU1hbiBjb25zdHJ1Y3RvciByZXF1aXJlcyBhIHR5cGUgYXJndW1lbnQgd2hlbiBwYXNzZWQgYSBVUkxcIik7XHJcbiAgICAgIH1cclxuICAgICAgc2VsZi5zb3VyY2UgPSBuZXcgRGF0YU1hbi5VUkwoZGF0YSwgdHlwZSwgb3B0aW9ucyk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICAvLyBhc3N1bWUgaXQncyBhIGZpbGVwYXRoXHJcbiAgICAgIHNlbGYuc291cmNlID0gbmV3IERhdGFNYW4uRmlsZVBhdGgoZGF0YSwgdHlwZSk7XHJcbiAgICB9XHJcbiAgfSBlbHNlIHtcclxuICAgIHRocm93IG5ldyBFcnJvcihcIkRhdGFNYW4gY29uc3RydWN0b3IgcmVjZWl2ZWQgZGF0YSB0aGF0IGl0IGRvZXNuJ3Qgc3VwcG9ydFwiKTtcclxuICB9XHJcbn07XHJcblxyXG4vKipcclxuICogQG1ldGhvZCBEYXRhTWFuLnByb3RvdHlwZS5nZXRCdWZmZXJcclxuICogQHB1YmxpY1xyXG4gKiBAcGFyYW0ge2Z1bmN0aW9ufSBbY2FsbGJhY2tdIGNhbGxiYWNrKGVyciwgYnVmZmVyKVxyXG4gKiBAcmV0dXJucyB7QnVmZmVyfHVuZGVmaW5lZH1cclxuICpcclxuICogUmV0dXJucyBhIEJ1ZmZlciByZXByZXNlbnRpbmcgdGhpcyBkYXRhLCBvciBwYXNzZXMgdGhlIEJ1ZmZlciB0byBhIGNhbGxiYWNrLlxyXG4gKi9cclxuRGF0YU1hbi5wcm90b3R5cGUuZ2V0QnVmZmVyID0gZnVuY3Rpb24gZGF0YU1hbkdldEJ1ZmZlcihjYWxsYmFjaykge1xyXG4gIHZhciBzZWxmID0gdGhpcztcclxuICByZXR1cm4gY2FsbGJhY2sgPyBzZWxmLnNvdXJjZS5nZXRCdWZmZXIoY2FsbGJhY2spIDogTWV0ZW9yLndyYXBBc3luYyhiaW5kKHNlbGYuc291cmNlLmdldEJ1ZmZlciwgc2VsZi5zb3VyY2UpKSgpO1xyXG59O1xyXG5cclxuZnVuY3Rpb24gX3NhdmVUb0ZpbGUocmVhZFN0cmVhbSwgZmlsZVBhdGgsIGNhbGxiYWNrKSB7XHJcbiAgdmFyIHdyaXRlU3RyZWFtID0gZnMuY3JlYXRlV3JpdGVTdHJlYW0oZmlsZVBhdGgpO1xyXG4gIHdyaXRlU3RyZWFtLm9uKCdjbG9zZScsIE1ldGVvci5iaW5kRW52aXJvbm1lbnQoZnVuY3Rpb24gKCkge1xyXG4gICAgY2FsbGJhY2soKTtcclxuICB9LCBmdW5jdGlvbiAoZXJyb3IpIHsgY2FsbGJhY2soZXJyb3IpOyB9KSk7XHJcbiAgd3JpdGVTdHJlYW0ub24oJ2Vycm9yJywgTWV0ZW9yLmJpbmRFbnZpcm9ubWVudChmdW5jdGlvbiAoZXJyb3IpIHtcclxuICAgIGNhbGxiYWNrKGVycm9yKTtcclxuICB9LCBmdW5jdGlvbiAoZXJyb3IpIHsgY2FsbGJhY2soZXJyb3IpOyB9KSk7XHJcbiAgcmVhZFN0cmVhbS5waXBlKHdyaXRlU3RyZWFtKTtcclxufVxyXG5cclxuLyoqXHJcbiAqIEBtZXRob2QgRGF0YU1hbi5wcm90b3R5cGUuc2F2ZVRvRmlsZVxyXG4gKiBAcHVibGljXHJcbiAqIEBwYXJhbSB7U3RyaW5nfSBmaWxlUGF0aFxyXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBjYWxsYmFja1xyXG4gKiBAcmV0dXJucyB7dW5kZWZpbmVkfVxyXG4gKlxyXG4gKiBTYXZlcyB0aGlzIGRhdGEgdG8gYSBmaWxlcGF0aCBvbiB0aGUgbG9jYWwgZmlsZXN5c3RlbS5cclxuICovXHJcbkRhdGFNYW4ucHJvdG90eXBlLnNhdmVUb0ZpbGUgPSBmdW5jdGlvbiBkYXRhTWFuU2F2ZVRvRmlsZShmaWxlUGF0aCwgY2FsbGJhY2spIHtcclxuICB2YXIgcmVhZFN0cmVhbSA9IHRoaXMuY3JlYXRlUmVhZFN0cmVhbSgpO1xyXG4gIHJldHVybiBjYWxsYmFjayA/IF9zYXZlVG9GaWxlKHJlYWRTdHJlYW0sIGZpbGVQYXRoLCBjYWxsYmFjaykgOiBNZXRlb3Iud3JhcEFzeW5jKF9zYXZlVG9GaWxlKShyZWFkU3RyZWFtLCBmaWxlUGF0aCk7XHJcbn07XHJcblxyXG4vKipcclxuICogQG1ldGhvZCBEYXRhTWFuLnByb3RvdHlwZS5nZXREYXRhVXJpXHJcbiAqIEBwdWJsaWNcclxuICogQHBhcmFtIHtmdW5jdGlvbn0gW2NhbGxiYWNrXSBjYWxsYmFjayhlcnIsIGRhdGFVcmkpXHJcbiAqXHJcbiAqIElmIG5vIGNhbGxiYWNrLCByZXR1cm5zIHRoZSBkYXRhIFVSSS5cclxuICovXHJcbkRhdGFNYW4ucHJvdG90eXBlLmdldERhdGFVcmkgPSBmdW5jdGlvbiBkYXRhTWFuR2V0RGF0YVVyaShjYWxsYmFjaykge1xyXG4gIHZhciBzZWxmID0gdGhpcztcclxuICByZXR1cm4gY2FsbGJhY2sgPyBzZWxmLnNvdXJjZS5nZXREYXRhVXJpKGNhbGxiYWNrKSA6IE1ldGVvci53cmFwQXN5bmMoYmluZChzZWxmLnNvdXJjZS5nZXREYXRhVXJpLCBzZWxmLnNvdXJjZSkpKCk7XHJcbn07XHJcblxyXG4vKipcclxuICogQG1ldGhvZCBEYXRhTWFuLnByb3RvdHlwZS5jcmVhdGVSZWFkU3RyZWFtXHJcbiAqIEBwdWJsaWNcclxuICpcclxuICogUmV0dXJucyBhIHJlYWQgc3RyZWFtIGZvciB0aGUgZGF0YS5cclxuICovXHJcbkRhdGFNYW4ucHJvdG90eXBlLmNyZWF0ZVJlYWRTdHJlYW0gPSBmdW5jdGlvbiBkYXRhTWFuQ3JlYXRlUmVhZFN0cmVhbSgpIHtcclxuICByZXR1cm4gdGhpcy5zb3VyY2UuY3JlYXRlUmVhZFN0cmVhbSgpO1xyXG59O1xyXG5cclxuLyoqXHJcbiAqIEBtZXRob2QgRGF0YU1hbi5wcm90b3R5cGUuc2l6ZVxyXG4gKiBAcHVibGljXHJcbiAqIEBwYXJhbSB7ZnVuY3Rpb259IFtjYWxsYmFja10gY2FsbGJhY2soZXJyLCBzaXplKVxyXG4gKlxyXG4gKiBJZiBubyBjYWxsYmFjaywgcmV0dXJucyB0aGUgc2l6ZSBpbiBieXRlcyBvZiB0aGUgZGF0YS5cclxuICovXHJcbkRhdGFNYW4ucHJvdG90eXBlLnNpemUgPSBmdW5jdGlvbiBkYXRhTWFuU2l6ZShjYWxsYmFjaykge1xyXG4gIHZhciBzZWxmID0gdGhpcztcclxuICByZXR1cm4gY2FsbGJhY2sgPyBzZWxmLnNvdXJjZS5zaXplKGNhbGxiYWNrKSA6IE1ldGVvci53cmFwQXN5bmMoYmluZChzZWxmLnNvdXJjZS5zaXplLCBzZWxmLnNvdXJjZSkpKCk7XHJcbn07XHJcblxyXG4vKipcclxuICogQG1ldGhvZCBEYXRhTWFuLnByb3RvdHlwZS50eXBlXHJcbiAqIEBwdWJsaWNcclxuICpcclxuICogUmV0dXJucyB0aGUgdHlwZSBvZiB0aGUgZGF0YS5cclxuICovXHJcbkRhdGFNYW4ucHJvdG90eXBlLnR5cGUgPSBmdW5jdGlvbiBkYXRhTWFuVHlwZSgpIHtcclxuICByZXR1cm4gdGhpcy5zb3VyY2UudHlwZSgpO1xyXG59O1xyXG5cclxuLypcclxuICogXCJiaW5kXCIgc2hpbTsgZnJvbSB1bmRlcnNjb3JlanMsIGJ1dCB3ZSBhdm9pZCBhIGRlcGVuZGVuY3lcclxuICovXHJcbnZhciBzbGljZSA9IEFycmF5LnByb3RvdHlwZS5zbGljZTtcclxudmFyIG5hdGl2ZUJpbmQgPSBGdW5jdGlvbi5wcm90b3R5cGUuYmluZDtcclxudmFyIGN0b3IgPSBmdW5jdGlvbigpe307XHJcbmZ1bmN0aW9uIGlzRnVuY3Rpb24ob2JqKSB7XHJcbiAgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbChvYmopID09ICdbb2JqZWN0IEZ1bmN0aW9uXSc7XHJcbn1cclxuZnVuY3Rpb24gYmluZChmdW5jLCBjb250ZXh0KSB7XHJcbiAgdmFyIGFyZ3MsIGJvdW5kO1xyXG4gIGlmIChuYXRpdmVCaW5kICYmIGZ1bmMuYmluZCA9PT0gbmF0aXZlQmluZCkgcmV0dXJuIG5hdGl2ZUJpbmQuYXBwbHkoZnVuYywgc2xpY2UuY2FsbChhcmd1bWVudHMsIDEpKTtcclxuICBpZiAoIWlzRnVuY3Rpb24oZnVuYykpIHRocm93IG5ldyBUeXBlRXJyb3I7XHJcbiAgYXJncyA9IHNsaWNlLmNhbGwoYXJndW1lbnRzLCAyKTtcclxuICByZXR1cm4gYm91bmQgPSBmdW5jdGlvbigpIHtcclxuICAgIGlmICghKHRoaXMgaW5zdGFuY2VvZiBib3VuZCkpIHJldHVybiBmdW5jLmFwcGx5KGNvbnRleHQsIGFyZ3MuY29uY2F0KHNsaWNlLmNhbGwoYXJndW1lbnRzKSkpO1xyXG4gICAgY3Rvci5wcm90b3R5cGUgPSBmdW5jLnByb3RvdHlwZTtcclxuICAgIHZhciBzZWxmID0gbmV3IGN0b3I7XHJcbiAgICBjdG9yLnByb3RvdHlwZSA9IG51bGw7XHJcbiAgICB2YXIgcmVzdWx0ID0gZnVuYy5hcHBseShzZWxmLCBhcmdzLmNvbmNhdChzbGljZS5jYWxsKGFyZ3VtZW50cykpKTtcclxuICAgIGlmIChPYmplY3QocmVzdWx0KSA9PT0gcmVzdWx0KSByZXR1cm4gcmVzdWx0O1xyXG4gICAgcmV0dXJuIHNlbGY7XHJcbiAgfTtcclxufVxyXG4iLCJ2YXIgYnVmZmVyU3RyZWFtUmVhZGVyID0gcmVxdWlyZSgnYnVmZmVyLXN0cmVhbS1yZWFkZXInKTtcclxuXHJcbi8qKlxyXG4gKiBAbWV0aG9kIERhdGFNYW4uQnVmZmVyXHJcbiAqIEBwdWJsaWNcclxuICogQGNvbnN0cnVjdG9yXHJcbiAqIEBwYXJhbSB7QnVmZmVyfSBidWZmZXJcclxuICogQHBhcmFtIHtTdHJpbmd9IHR5cGUgVGhlIGRhdGEgY29udGVudCAoTUlNRSkgdHlwZS5cclxuICovXHJcbkRhdGFNYW4uQnVmZmVyID0gZnVuY3Rpb24gRGF0YU1hbkJ1ZmZlcihidWZmZXIsIHR5cGUpIHtcclxuICB2YXIgc2VsZiA9IHRoaXM7XHJcbiAgc2VsZi5idWZmZXIgPSBidWZmZXI7XHJcbiAgc2VsZi5fdHlwZSA9IHR5cGU7XHJcbn07XHJcblxyXG4vKipcclxuICogQG1ldGhvZCBEYXRhTWFuLkJ1ZmZlci5wcm90b3R5cGUuZ2V0QnVmZmVyXHJcbiAqIEBwcml2YXRlXHJcbiAqIEBwYXJhbSB7ZnVuY3Rpb259IGNhbGxiYWNrIGNhbGxiYWNrKGVyciwgYnVmZmVyKVxyXG4gKiBAcmV0dXJucyB7QnVmZmVyfHVuZGVmaW5lZH1cclxuICpcclxuICogUGFzc2VzIGEgQnVmZmVyIHJlcHJlc2VudGluZyB0aGUgZGF0YSB0byBhIGNhbGxiYWNrLlxyXG4gKi9cclxuRGF0YU1hbi5CdWZmZXIucHJvdG90eXBlLmdldEJ1ZmZlciA9IGZ1bmN0aW9uIGRhdGFNYW5CdWZmZXJHZXRCdWZmZXIoY2FsbGJhY2spIHtcclxuICBjYWxsYmFjayhudWxsLCB0aGlzLmJ1ZmZlcik7XHJcbn07XHJcblxyXG4vKipcclxuICogQG1ldGhvZCBEYXRhTWFuLkJ1ZmZlci5wcm90b3R5cGUuZ2V0RGF0YVVyaVxyXG4gKiBAcHJpdmF0ZVxyXG4gKiBAcGFyYW0ge2Z1bmN0aW9ufSBjYWxsYmFjayBjYWxsYmFjayhlcnIsIGRhdGFVcmkpXHJcbiAqXHJcbiAqIFBhc3NlcyBhIGRhdGEgVVJJIHJlcHJlc2VudGluZyB0aGUgZGF0YSBpbiB0aGUgYnVmZmVyIHRvIGEgY2FsbGJhY2suXHJcbiAqL1xyXG5EYXRhTWFuLkJ1ZmZlci5wcm90b3R5cGUuZ2V0RGF0YVVyaSA9IGZ1bmN0aW9uIGRhdGFNYW5CdWZmZXJHZXREYXRhVXJpKGNhbGxiYWNrKSB7XHJcbiAgdmFyIHNlbGYgPSB0aGlzO1xyXG4gIGlmICghc2VsZi5fdHlwZSkge1xyXG4gICAgY2FsbGJhY2sobmV3IEVycm9yKFwiRGF0YU1hbi5nZXREYXRhVXJpIGNvdWxkbid0IGdldCBhIGNvbnRlbnRUeXBlXCIpKTtcclxuICB9IGVsc2Uge1xyXG4gICAgdmFyIGRhdGFVcmkgPSBcImRhdGE6XCIgKyBzZWxmLl90eXBlICsgXCI7YmFzZTY0LFwiICsgc2VsZi5idWZmZXIudG9TdHJpbmcoXCJiYXNlNjRcIik7XHJcbiAgICBjYWxsYmFjayhudWxsLCBkYXRhVXJpKTtcclxuICB9XHJcbn07XHJcblxyXG4vKipcclxuICogQG1ldGhvZCBEYXRhTWFuLkJ1ZmZlci5wcm90b3R5cGUuY3JlYXRlUmVhZFN0cmVhbVxyXG4gKiBAcHJpdmF0ZVxyXG4gKlxyXG4gKiBSZXR1cm5zIGEgcmVhZCBzdHJlYW0gZm9yIHRoZSBkYXRhLlxyXG4gKi9cclxuRGF0YU1hbi5CdWZmZXIucHJvdG90eXBlLmNyZWF0ZVJlYWRTdHJlYW0gPSBmdW5jdGlvbiBkYXRhTWFuQnVmZmVyQ3JlYXRlUmVhZFN0cmVhbSgpIHtcclxuICByZXR1cm4gbmV3IGJ1ZmZlclN0cmVhbVJlYWRlcih0aGlzLmJ1ZmZlcik7XHJcbn07XHJcblxyXG4vKipcclxuICogQG1ldGhvZCBEYXRhTWFuLkJ1ZmZlci5wcm90b3R5cGUuc2l6ZVxyXG4gKiBAcGFyYW0ge2Z1bmN0aW9ufSBjYWxsYmFjayBjYWxsYmFjayhlcnIsIHNpemUpXHJcbiAqIEBwcml2YXRlXHJcbiAqXHJcbiAqIFBhc3NlcyB0aGUgc2l6ZSBpbiBieXRlcyBvZiB0aGUgZGF0YSBpbiB0aGUgYnVmZmVyIHRvIGEgY2FsbGJhY2suXHJcbiAqL1xyXG5EYXRhTWFuLkJ1ZmZlci5wcm90b3R5cGUuc2l6ZSA9IGZ1bmN0aW9uIGRhdGFNYW5CdWZmZXJTaXplKGNhbGxiYWNrKSB7XHJcbiAgdmFyIHNlbGYgPSB0aGlzO1xyXG5cclxuICBpZiAodHlwZW9mIHNlbGYuX3NpemUgPT09IFwibnVtYmVyXCIpIHtcclxuICAgIGNhbGxiYWNrKG51bGwsIHNlbGYuX3NpemUpO1xyXG4gICAgcmV0dXJuO1xyXG4gIH1cclxuXHJcbiAgc2VsZi5fc2l6ZSA9IHNlbGYuYnVmZmVyLmxlbmd0aDtcclxuICBjYWxsYmFjayhudWxsLCBzZWxmLl9zaXplKTtcclxufTtcclxuXHJcbi8qKlxyXG4gKiBAbWV0aG9kIERhdGFNYW4uQnVmZmVyLnByb3RvdHlwZS50eXBlXHJcbiAqIEBwcml2YXRlXHJcbiAqXHJcbiAqIFJldHVybnMgdGhlIHR5cGUgb2YgdGhlIGRhdGEuXHJcbiAqL1xyXG5EYXRhTWFuLkJ1ZmZlci5wcm90b3R5cGUudHlwZSA9IGZ1bmN0aW9uIGRhdGFNYW5CdWZmZXJUeXBlKCkge1xyXG4gIHJldHVybiB0aGlzLl90eXBlO1xyXG59O1xyXG4iLCIvKipcclxuICogQG1ldGhvZCBEYXRhTWFuLkRhdGFVUklcclxuICogQHB1YmxpY1xyXG4gKiBAY29uc3RydWN0b3JcclxuICogQHBhcmFtIHtTdHJpbmd9IGRhdGFVcmlcclxuICovXHJcbkRhdGFNYW4uRGF0YVVSSSA9IGZ1bmN0aW9uIERhdGFNYW5EYXRhVVJJKGRhdGFVcmkpIHtcclxuICB2YXIgc2VsZiA9IHRoaXM7XHJcbiAgdmFyIHBpZWNlcyA9IGRhdGFVcmkubWF0Y2goL15kYXRhOiguKik7YmFzZTY0LCguKikkLyk7XHJcbiAgdmFyIGJ1ZmZlciA9IG5ldyBCdWZmZXIocGllY2VzWzJdLCAnYmFzZTY0Jyk7XHJcbiAgcmV0dXJuIG5ldyBEYXRhTWFuLkJ1ZmZlcihidWZmZXIsIHBpZWNlc1sxXSk7XHJcbn07XHJcblxyXG5EYXRhTWFuLkRhdGFVUkkucHJvdG90eXBlID0gRGF0YU1hbi5CdWZmZXIucHJvdG90eXBlO1xyXG4iLCJ2YXIgbWltZSA9IHJlcXVpcmUoJ21pbWUnKTtcclxudmFyIGZzID0gcmVxdWlyZShcImZzXCIpO1xyXG5cclxuLyoqXHJcbiAqIEBtZXRob2QgRGF0YU1hbi5GaWxlUGF0aFxyXG4gKiBAcHVibGljXHJcbiAqIEBjb25zdHJ1Y3RvclxyXG4gKiBAcGFyYW0ge1N0cmluZ30gZmlsZXBhdGhcclxuICogQHBhcmFtIHtTdHJpbmd9IFt0eXBlXSBUaGUgZGF0YSBjb250ZW50IChNSU1FKSB0eXBlLiBXaWxsIGxvb2t1cCBmcm9tIGZpbGUgaWYgbm90IHBhc3NlZC5cclxuICovXHJcbkRhdGFNYW4uRmlsZVBhdGggPSBmdW5jdGlvbiBEYXRhTWFuRmlsZVBhdGgoZmlsZXBhdGgsIHR5cGUpIHtcclxuICB2YXIgc2VsZiA9IHRoaXM7XHJcbiAgc2VsZi5maWxlcGF0aCA9IGZpbGVwYXRoO1xyXG4gIHNlbGYuX3R5cGUgPSB0eXBlIHx8IG1pbWUubG9va3VwKGZpbGVwYXRoKTtcclxufTtcclxuXHJcbi8qKlxyXG4gKiBAbWV0aG9kIERhdGFNYW4uRmlsZVBhdGgucHJvdG90eXBlLmdldEJ1ZmZlclxyXG4gKiBAcHJpdmF0ZVxyXG4gKiBAcGFyYW0ge2Z1bmN0aW9ufSBjYWxsYmFjayBjYWxsYmFjayhlcnIsIGJ1ZmZlcilcclxuICogQHJldHVybnMge0J1ZmZlcnx1bmRlZmluZWR9XHJcbiAqXHJcbiAqIFBhc3NlcyBhIEJ1ZmZlciByZXByZXNlbnRpbmcgdGhlIGRhdGEgdG8gYSBjYWxsYmFjay5cclxuICovXHJcbkRhdGFNYW4uRmlsZVBhdGgucHJvdG90eXBlLmdldEJ1ZmZlciA9IGZ1bmN0aW9uIGRhdGFNYW5GaWxlUGF0aEdldEJ1ZmZlcihjYWxsYmFjaykge1xyXG4gIHZhciBzZWxmID0gdGhpcztcclxuXHJcbiAgLy8gQ2FsbCBub2RlIHJlYWRGaWxlXHJcbiAgZnMucmVhZEZpbGUoc2VsZi5maWxlcGF0aCwgTWV0ZW9yLmJpbmRFbnZpcm9ubWVudChmdW5jdGlvbihlcnIsIGJ1ZmZlcikge1xyXG4gICAgY2FsbGJhY2soZXJyLCBidWZmZXIpO1xyXG4gIH0sIGZ1bmN0aW9uKGVycikge1xyXG4gICAgY2FsbGJhY2soZXJyKTtcclxuICB9KSk7XHJcbn07XHJcblxyXG4vKipcclxuICogQG1ldGhvZCBEYXRhTWFuLkZpbGVQYXRoLnByb3RvdHlwZS5nZXREYXRhVXJpXHJcbiAqIEBwcml2YXRlXHJcbiAqIEBwYXJhbSB7ZnVuY3Rpb259IGNhbGxiYWNrIGNhbGxiYWNrKGVyciwgZGF0YVVyaSlcclxuICpcclxuICogUGFzc2VzIGEgZGF0YSBVUkkgcmVwcmVzZW50aW5nIHRoZSBkYXRhIHRvIGEgY2FsbGJhY2suXHJcbiAqL1xyXG5EYXRhTWFuLkZpbGVQYXRoLnByb3RvdHlwZS5nZXREYXRhVXJpID0gZnVuY3Rpb24gZGF0YU1hbkZpbGVQYXRoR2V0RGF0YVVyaShjYWxsYmFjaykge1xyXG4gIHZhciBzZWxmID0gdGhpcztcclxuXHJcbiAgc2VsZi5nZXRCdWZmZXIoZnVuY3Rpb24gKGVycm9yLCBidWZmZXIpIHtcclxuICAgIGlmIChlcnJvcikge1xyXG4gICAgICBjYWxsYmFjayhlcnJvcik7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBpZiAoIXNlbGYuX3R5cGUpIHtcclxuICAgICAgICBjYWxsYmFjayhuZXcgRXJyb3IoXCJEYXRhTWFuLmdldERhdGFVcmkgY291bGRuJ3QgZ2V0IGEgY29udGVudFR5cGVcIikpO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIHZhciBkYXRhVXJpID0gXCJkYXRhOlwiICsgc2VsZi5fdHlwZSArIFwiO2Jhc2U2NCxcIiArIGJ1ZmZlci50b1N0cmluZyhcImJhc2U2NFwiKTtcclxuICAgICAgICBidWZmZXIgPSBudWxsO1xyXG4gICAgICAgIGNhbGxiYWNrKG51bGwsIGRhdGFVcmkpO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfSk7XHJcbn07XHJcblxyXG4vKipcclxuICogQG1ldGhvZCBEYXRhTWFuLkZpbGVQYXRoLnByb3RvdHlwZS5jcmVhdGVSZWFkU3RyZWFtXHJcbiAqIEBwcml2YXRlXHJcbiAqXHJcbiAqIFJldHVybnMgYSByZWFkIHN0cmVhbSBmb3IgdGhlIGRhdGEuXHJcbiAqL1xyXG5EYXRhTWFuLkZpbGVQYXRoLnByb3RvdHlwZS5jcmVhdGVSZWFkU3RyZWFtID0gZnVuY3Rpb24gZGF0YU1hbkZpbGVQYXRoQ3JlYXRlUmVhZFN0cmVhbSgpIHtcclxuICAvLyBTdHJlYW0gZnJvbSBmaWxlc3lzdGVtXHJcbiAgcmV0dXJuIGZzLmNyZWF0ZVJlYWRTdHJlYW0odGhpcy5maWxlcGF0aCk7XHJcbn07XHJcblxyXG4vKipcclxuICogQG1ldGhvZCBEYXRhTWFuLkZpbGVQYXRoLnByb3RvdHlwZS5zaXplXHJcbiAqIEBwYXJhbSB7ZnVuY3Rpb259IGNhbGxiYWNrIGNhbGxiYWNrKGVyciwgc2l6ZSlcclxuICogQHByaXZhdGVcclxuICpcclxuICogUGFzc2VzIHRoZSBzaXplIGluIGJ5dGVzIG9mIHRoZSBkYXRhIHRvIGEgY2FsbGJhY2suXHJcbiAqL1xyXG5EYXRhTWFuLkZpbGVQYXRoLnByb3RvdHlwZS5zaXplID0gZnVuY3Rpb24gZGF0YU1hbkZpbGVQYXRoU2l6ZShjYWxsYmFjaykge1xyXG4gIHZhciBzZWxmID0gdGhpcztcclxuXHJcbiAgaWYgKHR5cGVvZiBzZWxmLl9zaXplID09PSBcIm51bWJlclwiKSB7XHJcbiAgICBjYWxsYmFjayhudWxsLCBzZWxmLl9zaXplKTtcclxuICAgIHJldHVybjtcclxuICB9XHJcblxyXG4gIC8vIFdlIGNhbiBnZXQgdGhlIHNpemUgd2l0aG91dCBidWZmZXJpbmdcclxuICBmcy5zdGF0KHNlbGYuZmlsZXBhdGgsIE1ldGVvci5iaW5kRW52aXJvbm1lbnQoZnVuY3Rpb24gKGVycm9yLCBzdGF0cykge1xyXG4gICAgaWYgKHN0YXRzICYmIHR5cGVvZiBzdGF0cy5zaXplID09PSBcIm51bWJlclwiKSB7XHJcbiAgICAgIHNlbGYuX3NpemUgPSBzdGF0cy5zaXplO1xyXG4gICAgICBjYWxsYmFjayhudWxsLCBzZWxmLl9zaXplKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIGNhbGxiYWNrKGVycm9yKTtcclxuICAgIH1cclxuICB9LCBmdW5jdGlvbiAoZXJyb3IpIHtcclxuICAgIGNhbGxiYWNrKGVycm9yKTtcclxuICB9KSk7XHJcbn07XHJcblxyXG4vKipcclxuICogQG1ldGhvZCBEYXRhTWFuLkZpbGVQYXRoLnByb3RvdHlwZS50eXBlXHJcbiAqIEBwcml2YXRlXHJcbiAqXHJcbiAqIFJldHVybnMgdGhlIHR5cGUgb2YgdGhlIGRhdGEuXHJcbiAqL1xyXG5EYXRhTWFuLkZpbGVQYXRoLnByb3RvdHlwZS50eXBlID0gZnVuY3Rpb24gZGF0YU1hbkZpbGVQYXRoVHlwZSgpIHtcclxuICByZXR1cm4gdGhpcy5fdHlwZTtcclxufTtcclxuIiwidmFyIHJlcXVlc3QgPSByZXF1aXJlKFwicmVxdWVzdFwiKTtcclxuXHJcbi8qKlxyXG4gKiBAbWV0aG9kIERhdGFNYW4uVVJMXHJcbiAqIEBwdWJsaWNcclxuICogQGNvbnN0cnVjdG9yXHJcbiAqIEBwYXJhbSB7U3RyaW5nfSB1cmxcclxuICogQHBhcmFtIHtTdHJpbmd9IHR5cGUgVGhlIGRhdGEgY29udGVudCAoTUlNRSkgdHlwZS5cclxuICovXHJcbkRhdGFNYW4uVVJMID0gZnVuY3Rpb24gRGF0YU1hblVSTCh1cmwsIHR5cGUsIG9wdGlvbnMpIHtcclxuICB2YXIgc2VsZiA9IHRoaXM7XHJcbiAgb3B0aW9ucyA9IG9wdGlvbnMgfHwge307XHJcblxyXG4gIHNlbGYudXJsID0gdXJsO1xyXG4gIHNlbGYuX3R5cGUgPSB0eXBlO1xyXG5cclxuICAvLyBUaGlzIGlzIHNvbWUgY29kZSBib3Jyb3dlZCBmcm9tIHRoZSBodHRwIHBhY2thZ2UuIEhvcGVmdWxseVxyXG4gIC8vIHdlIGNhbiBldmVudHVhbGx5IHVzZSBIVFRQIHBrZyBkaXJlY3RseSBpbnN0ZWFkIG9mICdyZXF1ZXN0J1xyXG4gIC8vIG9uY2UgaXQgc3VwcG9ydHMgc3RyZWFtcyBhbmQgYnVmZmVycyBhbmQgc3VjaC4gKGByZXF1ZXN0YCB0YWtlc1xyXG4gIC8vIGFuZCBgYXV0aGAgb3B0aW9uLCB0b28sIGJ1dCBub3Qgb2YgdGhlIHNhbWUgZm9ybSBhcyBgSFRUUGAuKVxyXG4gIGlmIChvcHRpb25zLmF1dGgpIHtcclxuICAgIGlmIChvcHRpb25zLmF1dGguaW5kZXhPZignOicpIDwgMClcclxuICAgICAgdGhyb3cgbmV3IEVycm9yKCdhdXRoIG9wdGlvbiBzaG91bGQgYmUgb2YgdGhlIGZvcm0gXCJ1c2VybmFtZTpwYXNzd29yZFwiJyk7XHJcbiAgICBvcHRpb25zLmhlYWRlcnMgPSBvcHRpb25zLmhlYWRlcnMgfHwge307XHJcbiAgICBvcHRpb25zLmhlYWRlcnNbJ0F1dGhvcml6YXRpb24nXSA9IFwiQmFzaWMgXCIrXHJcbiAgICAgIChuZXcgQnVmZmVyKG9wdGlvbnMuYXV0aCwgXCJhc2NpaVwiKSkudG9TdHJpbmcoXCJiYXNlNjRcIik7XHJcbiAgICBkZWxldGUgb3B0aW9ucy5hdXRoO1xyXG4gIH1cclxuXHJcbiAgc2VsZi51cmxPcHRzID0gb3B0aW9ucztcclxufTtcclxuXHJcbi8qKlxyXG4gKiBAbWV0aG9kIERhdGFNYW4uVVJMLnByb3RvdHlwZS5nZXRCdWZmZXJcclxuICogQHByaXZhdGVcclxuICogQHBhcmFtIHtmdW5jdGlvbn0gY2FsbGJhY2sgY2FsbGJhY2soZXJyLCBidWZmZXIpXHJcbiAqIEByZXR1cm5zIHtCdWZmZXJ8dW5kZWZpbmVkfVxyXG4gKlxyXG4gKiBQYXNzZXMgYSBCdWZmZXIgcmVwcmVzZW50aW5nIHRoZSBkYXRhIGF0IHRoZSBVUkwgdG8gYSBjYWxsYmFjay5cclxuICovXHJcbkRhdGFNYW4uVVJMLnByb3RvdHlwZS5nZXRCdWZmZXIgPSBmdW5jdGlvbiBkYXRhTWFuVXJsR2V0QnVmZmVyKGNhbGxiYWNrKSB7XHJcbiAgdmFyIHNlbGYgPSB0aGlzO1xyXG5cclxuICByZXF1ZXN0KF8uZXh0ZW5kKHtcclxuICAgIHVybDogc2VsZi51cmwsXHJcbiAgICBtZXRob2Q6IFwiR0VUXCIsXHJcbiAgICBlbmNvZGluZzogbnVsbCxcclxuICAgIGphcjogZmFsc2VcclxuICB9LCBzZWxmLnVybE9wdHMpLCBNZXRlb3IuYmluZEVudmlyb25tZW50KGZ1bmN0aW9uKGVyciwgcmVzLCBib2R5KSB7XHJcbiAgICBpZiAoZXJyKSB7XHJcbiAgICAgIGNhbGxiYWNrKGVycik7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBzZWxmLl90eXBlID0gcmVzLmhlYWRlcnNbJ2NvbnRlbnQtdHlwZSddO1xyXG4gICAgICBjYWxsYmFjayhudWxsLCBib2R5KTtcclxuICAgIH1cclxuICB9LCBmdW5jdGlvbihlcnIpIHtcclxuICAgIGNhbGxiYWNrKGVycik7XHJcbiAgfSkpO1xyXG59O1xyXG5cclxuLyoqXHJcbiAqIEBtZXRob2QgRGF0YU1hbi5VUkwucHJvdG90eXBlLmdldERhdGFVcmlcclxuICogQHByaXZhdGVcclxuICogQHBhcmFtIHtmdW5jdGlvbn0gY2FsbGJhY2sgY2FsbGJhY2soZXJyLCBkYXRhVXJpKVxyXG4gKlxyXG4gKiBQYXNzZXMgYSBkYXRhIFVSSSByZXByZXNlbnRpbmcgdGhlIGRhdGEgYXQgdGhlIFVSTCB0byBhIGNhbGxiYWNrLlxyXG4gKi9cclxuRGF0YU1hbi5VUkwucHJvdG90eXBlLmdldERhdGFVcmkgPSBmdW5jdGlvbiBkYXRhTWFuVXJsR2V0RGF0YVVyaShjYWxsYmFjaykge1xyXG4gIHZhciBzZWxmID0gdGhpcztcclxuXHJcbiAgc2VsZi5nZXRCdWZmZXIoZnVuY3Rpb24gKGVycm9yLCBidWZmZXIpIHtcclxuICAgIGlmIChlcnJvcikge1xyXG4gICAgICBjYWxsYmFjayhlcnJvcik7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBpZiAoIXNlbGYuX3R5cGUpIHtcclxuICAgICAgICBjYWxsYmFjayhuZXcgRXJyb3IoXCJEYXRhTWFuLmdldERhdGFVcmkgY291bGRuJ3QgZ2V0IGEgY29udGVudFR5cGVcIikpO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIHZhciBkYXRhVXJpID0gXCJkYXRhOlwiICsgc2VsZi5fdHlwZSArIFwiO2Jhc2U2NCxcIiArIGJ1ZmZlci50b1N0cmluZyhcImJhc2U2NFwiKTtcclxuICAgICAgICBjYWxsYmFjayhudWxsLCBkYXRhVXJpKTtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH0pO1xyXG59O1xyXG5cclxuLyoqXHJcbiAqIEBtZXRob2QgRGF0YU1hbi5VUkwucHJvdG90eXBlLmNyZWF0ZVJlYWRTdHJlYW1cclxuICogQHByaXZhdGVcclxuICpcclxuICogUmV0dXJucyBhIHJlYWQgc3RyZWFtIGZvciB0aGUgZGF0YS5cclxuICovXHJcbkRhdGFNYW4uVVJMLnByb3RvdHlwZS5jcmVhdGVSZWFkU3RyZWFtID0gZnVuY3Rpb24gZGF0YU1hblVybENyZWF0ZVJlYWRTdHJlYW0oKSB7XHJcbiAgdmFyIHNlbGYgPSB0aGlzO1xyXG4gIC8vIFN0cmVhbSBmcm9tIFVSTFxyXG4gIHJldHVybiByZXF1ZXN0KF8uZXh0ZW5kKHtcclxuICAgIHVybDogc2VsZi51cmwsXHJcbiAgICBtZXRob2Q6IFwiR0VUXCJcclxuICB9LCBzZWxmLnVybE9wdHMpKTtcclxufTtcclxuXHJcbi8qKlxyXG4gKiBAbWV0aG9kIERhdGFNYW4uVVJMLnByb3RvdHlwZS5zaXplXHJcbiAqIEBwYXJhbSB7ZnVuY3Rpb259IGNhbGxiYWNrIGNhbGxiYWNrKGVyciwgc2l6ZSlcclxuICogQHByaXZhdGVcclxuICpcclxuICogUmV0dXJucyB0aGUgc2l6ZSBpbiBieXRlcyBvZiB0aGUgZGF0YSBhdCB0aGUgVVJMLlxyXG4gKi9cclxuRGF0YU1hbi5VUkwucHJvdG90eXBlLnNpemUgPSBmdW5jdGlvbiBkYXRhTWFuVXJsU2l6ZShjYWxsYmFjaykge1xyXG4gIHZhciBzZWxmID0gdGhpcztcclxuXHJcbiAgaWYgKHR5cGVvZiBzZWxmLl9zaXplID09PSBcIm51bWJlclwiKSB7XHJcbiAgICBjYWxsYmFjayhudWxsLCBzZWxmLl9zaXplKTtcclxuICAgIHJldHVybjtcclxuICB9XHJcblxyXG4gIHNlbGYuZ2V0QnVmZmVyKGZ1bmN0aW9uIChlcnJvciwgYnVmZmVyKSB7XHJcbiAgICBpZiAoZXJyb3IpIHtcclxuICAgICAgY2FsbGJhY2soZXJyb3IpO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgc2VsZi5fc2l6ZSA9IGJ1ZmZlci5sZW5ndGg7XHJcbiAgICAgIGNhbGxiYWNrKG51bGwsIHNlbGYuX3NpemUpO1xyXG4gICAgfVxyXG4gIH0pO1xyXG59O1xyXG5cclxuLyoqXHJcbiAqIEBtZXRob2QgRGF0YU1hbi5VUkwucHJvdG90eXBlLnR5cGVcclxuICogQHByaXZhdGVcclxuICpcclxuICogUmV0dXJucyB0aGUgdHlwZSBvZiB0aGUgZGF0YS5cclxuICovXHJcbkRhdGFNYW4uVVJMLnByb3RvdHlwZS50eXBlID0gZnVuY3Rpb24gZGF0YU1hblVybFR5cGUoKSB7XHJcbiAgcmV0dXJuIHRoaXMuX3R5cGU7XHJcbn07XHJcbiIsIi8qIGdsb2JhbCBEYXRhTWFuICovXHJcblxyXG52YXIgUGFzc1Rocm91Z2ggPSByZXF1aXJlKCdzdHJlYW0nKS5QYXNzVGhyb3VnaDtcclxuXHJcbi8qKlxyXG4gKiBAbWV0aG9kIERhdGFNYW4uUmVhZFN0cmVhbVxyXG4gKiBAcHVibGljXHJcbiAqIEBjb25zdHJ1Y3RvclxyXG4gKiBAcGFyYW0ge1JlYWRTdHJlYW19IHN0cmVhbVxyXG4gKiBAcGFyYW0ge1N0cmluZ30gdHlwZSBUaGUgZGF0YSBjb250ZW50IChNSU1FKSB0eXBlLlxyXG4gKi9cclxuRGF0YU1hbi5SZWFkU3RyZWFtID0gZnVuY3Rpb24gRGF0YU1hbkJ1ZmZlcihzdHJlYW0sIHR5cGUpIHtcclxuICB2YXIgc2VsZiA9IHRoaXM7XHJcblxyXG4gIC8vIENyZWF0ZSBhIGJ1ZmZlcmFibGUgLyBwYXVzZWQgbmV3IHN0cmVhbS4uLlxyXG4gIHZhciBwdCA9IG5ldyBQYXNzVGhyb3VnaCgpO1xyXG5cclxuICAvLyBQaXBlIHByb3ZpZGVkIHJlYWQgc3RyZWFtIGludG8gcGFzcy10aHJvdWdoIHN0cmVhbVxyXG4gIHN0cmVhbS5waXBlKHB0KTtcclxuXHJcbiAgLy8gU2V0IHBhc3MtdGhyb3VnaCBzdHJlYW0gcmVmZXJlbmNlXHJcbiAgc2VsZi5zdHJlYW0gPSBwdDtcclxuXHJcbiAgLy8gU2V0IHR5cGUgYXMgcHJvdmlkZWRcclxuICBzZWxmLl90eXBlID0gdHlwZTtcclxufTtcclxuXHJcbi8qKlxyXG4gKiBAbWV0aG9kIERhdGFNYW4uUmVhZFN0cmVhbS5wcm90b3R5cGUuZ2V0QnVmZmVyXHJcbiAqIEBwcml2YXRlXHJcbiAqIEBwYXJhbSB7ZnVuY3Rpb259IGNhbGxiYWNrIGNhbGxiYWNrKGVyciwgYnVmZmVyKVxyXG4gKiBAcmV0dXJucyB7dW5kZWZpbmVkfVxyXG4gKlxyXG4gKiBQYXNzZXMgYSBCdWZmZXIgcmVwcmVzZW50aW5nIHRoZSBkYXRhIHRvIGEgY2FsbGJhY2suXHJcbiAqL1xyXG5EYXRhTWFuLlJlYWRTdHJlYW0ucHJvdG90eXBlLmdldEJ1ZmZlciA9IGZ1bmN0aW9uIGRhdGFNYW5SZWFkU3RyZWFtR2V0QnVmZmVyKC8qY2FsbGJhY2sqLykge1xyXG4gIC8vIFRPRE8gaW1wbGVtZW50IGFzIHBhc3N0aHJvdWdoIHN0cmVhbT9cclxufTtcclxuXHJcbi8qKlxyXG4gKiBAbWV0aG9kIERhdGFNYW4uUmVhZFN0cmVhbS5wcm90b3R5cGUuZ2V0RGF0YVVyaVxyXG4gKiBAcHJpdmF0ZVxyXG4gKiBAcGFyYW0ge2Z1bmN0aW9ufSBjYWxsYmFjayBjYWxsYmFjayhlcnIsIGRhdGFVcmkpXHJcbiAqXHJcbiAqIFBhc3NlcyBhIGRhdGEgVVJJIHJlcHJlc2VudGluZyB0aGUgZGF0YSBpbiB0aGUgc3RyZWFtIHRvIGEgY2FsbGJhY2suXHJcbiAqL1xyXG5EYXRhTWFuLlJlYWRTdHJlYW0ucHJvdG90eXBlLmdldERhdGFVcmkgPSBmdW5jdGlvbiBkYXRhTWFuUmVhZFN0cmVhbUdldERhdGFVcmkoLypjYWxsYmFjayovKSB7XHJcbiAgLy8gVE9ETyBpbXBsZW1lbnQgYXMgcGFzc3Rocm91Z2ggc3RyZWFtP1xyXG59O1xyXG5cclxuLyoqXHJcbiAqIEBtZXRob2QgRGF0YU1hbi5SZWFkU3RyZWFtLnByb3RvdHlwZS5jcmVhdGVSZWFkU3RyZWFtXHJcbiAqIEBwcml2YXRlXHJcbiAqXHJcbiAqIFJldHVybnMgYSByZWFkIHN0cmVhbSBmb3IgdGhlIGRhdGEuXHJcbiAqL1xyXG5EYXRhTWFuLlJlYWRTdHJlYW0ucHJvdG90eXBlLmNyZWF0ZVJlYWRTdHJlYW0gPSBmdW5jdGlvbiBkYXRhTWFuUmVhZFN0cmVhbUNyZWF0ZVJlYWRTdHJlYW0oKSB7XHJcbiAgcmV0dXJuIHRoaXMuc3RyZWFtO1xyXG59O1xyXG5cclxuLyoqXHJcbiAqIEBtZXRob2QgRGF0YU1hbi5SZWFkU3RyZWFtLnByb3RvdHlwZS5zaXplXHJcbiAqIEBwYXJhbSB7ZnVuY3Rpb259IGNhbGxiYWNrIGNhbGxiYWNrKGVyciwgc2l6ZSlcclxuICogQHByaXZhdGVcclxuICpcclxuICogUGFzc2VzIHRoZSBzaXplIGluIGJ5dGVzIG9mIHRoZSBkYXRhIGluIHRoZSBzdHJlYW0gdG8gYSBjYWxsYmFjay5cclxuICovXHJcbkRhdGFNYW4uUmVhZFN0cmVhbS5wcm90b3R5cGUuc2l6ZSA9IGZ1bmN0aW9uIGRhdGFNYW5SZWFkU3RyZWFtU2l6ZShjYWxsYmFjaykge1xyXG4gIGNhbGxiYWNrKDApOyAvLyB3aWxsIGRldGVybWluZSBmcm9tIHN0cmVhbSBsYXRlclxyXG59O1xyXG5cclxuLyoqXHJcbiAqIEBtZXRob2QgRGF0YU1hbi5SZWFkU3RyZWFtLnByb3RvdHlwZS50eXBlXHJcbiAqIEBwcml2YXRlXHJcbiAqXHJcbiAqIFJldHVybnMgdGhlIHR5cGUgb2YgdGhlIGRhdGEuXHJcbiAqL1xyXG5EYXRhTWFuLlJlYWRTdHJlYW0ucHJvdG90eXBlLnR5cGUgPSBmdW5jdGlvbiBkYXRhTWFuUmVhZFN0cmVhbVR5cGUoKSB7XHJcbiAgcmV0dXJuIHRoaXMuX3R5cGU7XHJcbn07XHJcbiJdfQ==
