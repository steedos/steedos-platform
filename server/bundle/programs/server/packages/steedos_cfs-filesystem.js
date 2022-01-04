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
var exists;

var require = meteorInstall({"node_modules":{"meteor":{"steedos:cfs-filesystem":{"checkNpm.js":function module(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                //
// packages/steedos_cfs-filesystem/checkNpm.js                                                                    //
//                                                                                                                //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                  //
let checkNpmVersions;
module.link("meteor/tmeasday:check-npm-versions", {
  checkNpmVersions(v) {
    checkNpmVersions = v;
  }

}, 0);
checkNpmVersions({
  mkdirp: "0.3.5"
}, 'steedos:cfs-filesystem');
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"filesystem.server.js":function module(require){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                //
// packages/steedos_cfs-filesystem/filesystem.server.js                                                           //
//                                                                                                                //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                  //
var fs = require('fs');

var path = require('path');

var mkdirp = require('mkdirp'); //var chokidar = require('chokidar');


FS.Store.FileSystem = function (name, options) {
  var self = this;
  if (!(self instanceof FS.Store.FileSystem)) throw new Error('FS.Store.FileSystem missing keyword "new"'); // We allow options to be string/path empty or options.path

  options = options !== '' + options ? options || {} : {
    path: options
  }; // Provide a default FS directory one level up from the build/bundle directory

  var pathname = options.path;

  if (!pathname && __meteor_bootstrap__ && __meteor_bootstrap__.serverDir) {
    pathname = path.join(__meteor_bootstrap__.serverDir, '../../../cfs/files/' + name);
  }

  if (!pathname) throw new Error('FS.Store.FileSystem unable to determine path'); // Check if we have '~/foo/bar'

  if (pathname.split(path.sep)[0] === '~') {
    var homepath = process.env.HOME || process.env.HOMEPATH || process.env.USERPROFILE;

    if (homepath) {
      pathname = pathname.replace('~', homepath);
    } else {
      throw new Error('FS.Store.FileSystem unable to resolve "~" in path');
    }
  } // Set absolute path


  var absolutePath = path.resolve(pathname); // Ensure the path exists

  mkdirp.sync(absolutePath);
  FS.debug && console.log(name + ' FileSystem mounted on: ' + absolutePath);
  return new FS.StorageAdapter(name, options, {
    typeName: 'storage.filesystem',
    fileKey: function (fileObj) {
      // Lookup the copy
      var store = fileObj && fileObj._getInfo(name); // If the store and key is found return the key


      if (store && store.key) return store.key;
      var filename = fileObj.name();
      var filenameInStore = fileObj.name({
        store: name
      }); // If no store key found we resolve / generate a key

      return fileObj.collectionName + '-' + fileObj._id + '-' + (filenameInStore || filename);
    },
    createReadStream: function (fileKey, options) {
      // this is the Storage adapter scope
      var filepath = path.join(absolutePath, fileKey);
      exists = fs.existsSync(filepath);
      if (!exists) throw new Meteor.Error(404, "Not Found", 'No file found'); // return the read stream - Options allow { start, end }

      return fs.createReadStream(filepath, options);
    },
    createWriteStream: function (fileKey, options) {
      options = options || {}; // this is the Storage adapter scope

      var filepath = path.join(absolutePath, fileKey); // Return the stream handle

      var writeStream = fs.createWriteStream(filepath, options); // The filesystem does not emit the "end" event only close - so we
      // manually send the end event

      writeStream.on('close', function () {
        if (FS.debug) console.log('SA FileSystem - DONE!! fileKey: "' + fileKey + '"'); // Get the exact size of the stored file, so that we can pass it to onEnd/onStored.
        // Since stream transforms might have altered the size, this is the best way to
        // ensure we update the fileObj.copies with the correct size.

        try {
          // Get the stats of the file
          var stats = fs.statSync(filepath); // Emit end and return the fileKey, size, and updated date

          writeStream.emit('stored', {
            fileKey: fileKey,
            size: stats.size,
            storedAt: stats.mtime
          });
        } catch (err) {
          // On error we emit the error on
          writeStream.emit('error', err);
        }
      });
      return writeStream;
    },
    remove: function (fileKey, callback) {
      // this is the Storage adapter scope
      var filepath = path.join(absolutePath, fileKey);
      var is_exists = fs.existsSync(filepath);

      if (is_exists) {
        // Call node unlink file
        fs.unlink(filepath, function (error, result) {
          if (error && error.errno === 34) {
            console.warn("SA FileSystem: Could not delete " + filepath + " because the file was not found.");
            callback && callback(null);
          } else {
            callback && callback(error, result);
          }
        });
      } else {
        callback && callback(null);
      }
    },
    stats: function (fileKey, callback) {
      // this is the Storage adapter scope
      var filepath = path.join(absolutePath, fileKey);

      if (typeof callback === 'function') {
        fs.stat(filepath, callback);
      } else {
        return fs.statSync(filepath);
      }
    } // Add this back and add the chokidar dependency back when we make this work eventually
    // watch: function(callback) {
    //   function fileKey(filePath) {
    //     return filePath.replace(absolutePath, "");
    //   }
    //   FS.debug && console.log('Watching ' + absolutePath);
    //   // chokidar seems to be most widely used and production ready watcher
    //   var watcher = chokidar.watch(absolutePath, {ignored: /\/\./, ignoreInitial: true});
    //   watcher.on('add', Meteor.bindEnvironment(function(filePath, stats) {
    //     callback("change", fileKey(filePath), {
    //       name: path.basename(filePath),
    //       type: null,
    //       size: stats.size,
    //       utime: stats.mtime
    //     });
    //   }, function(err) {
    //     throw err;
    //   }));
    //   watcher.on('change', Meteor.bindEnvironment(function(filePath, stats) {
    //     callback("change", fileKey(filePath), {
    //       name: path.basename(filePath),
    //       type: null,
    //       size: stats.size,
    //       utime: stats.mtime
    //     });
    //   }, function(err) {
    //     throw err;
    //   }));
    //   watcher.on('unlink', Meteor.bindEnvironment(function(filePath) {
    //     callback("remove", fileKey(filePath));
    //   }, function(err) {
    //     throw err;
    //   }));
    // }

  });
};
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}}}}},{
  "extensions": [
    ".js",
    ".json"
  ]
});

require("/node_modules/meteor/steedos:cfs-filesystem/checkNpm.js");
require("/node_modules/meteor/steedos:cfs-filesystem/filesystem.server.js");

/* Exports */
Package._define("steedos:cfs-filesystem");

})();

//# sourceURL=meteor://💻app/packages/steedos_cfs-filesystem.js
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvczpjZnMtZmlsZXN5c3RlbS9jaGVja05wbS5qcyIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvczpjZnMtZmlsZXN5c3RlbS9maWxlc3lzdGVtLnNlcnZlci5qcyJdLCJuYW1lcyI6WyJjaGVja05wbVZlcnNpb25zIiwibW9kdWxlIiwibGluayIsInYiLCJta2RpcnAiLCJmcyIsInJlcXVpcmUiLCJwYXRoIiwiRlMiLCJTdG9yZSIsIkZpbGVTeXN0ZW0iLCJuYW1lIiwib3B0aW9ucyIsInNlbGYiLCJFcnJvciIsInBhdGhuYW1lIiwiX19tZXRlb3JfYm9vdHN0cmFwX18iLCJzZXJ2ZXJEaXIiLCJqb2luIiwic3BsaXQiLCJzZXAiLCJob21lcGF0aCIsInByb2Nlc3MiLCJlbnYiLCJIT01FIiwiSE9NRVBBVEgiLCJVU0VSUFJPRklMRSIsInJlcGxhY2UiLCJhYnNvbHV0ZVBhdGgiLCJyZXNvbHZlIiwic3luYyIsImRlYnVnIiwiY29uc29sZSIsImxvZyIsIlN0b3JhZ2VBZGFwdGVyIiwidHlwZU5hbWUiLCJmaWxlS2V5IiwiZmlsZU9iaiIsInN0b3JlIiwiX2dldEluZm8iLCJrZXkiLCJmaWxlbmFtZSIsImZpbGVuYW1lSW5TdG9yZSIsImNvbGxlY3Rpb25OYW1lIiwiX2lkIiwiY3JlYXRlUmVhZFN0cmVhbSIsImZpbGVwYXRoIiwiZXhpc3RzIiwiZXhpc3RzU3luYyIsIk1ldGVvciIsImNyZWF0ZVdyaXRlU3RyZWFtIiwid3JpdGVTdHJlYW0iLCJvbiIsInN0YXRzIiwic3RhdFN5bmMiLCJlbWl0Iiwic2l6ZSIsInN0b3JlZEF0IiwibXRpbWUiLCJlcnIiLCJyZW1vdmUiLCJjYWxsYmFjayIsImlzX2V4aXN0cyIsInVubGluayIsImVycm9yIiwicmVzdWx0IiwiZXJybm8iLCJ3YXJuIiwic3RhdCJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLElBQUlBLGdC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QUNELFdBSEQsTUFHTztBQUNMQSxvQkFBUSxJQUFJQSxRQUFRLENBQUNHLEtBQUQsRUFBUUMsTUFBUixDQUFwQjtBQUNEO0FBQ0YsU0FQRDtBQVFELE9BVkQsTUFVTztBQUNMSixnQkFBUSxJQUFJQSxRQUFRLENBQUMsSUFBRCxDQUFwQjtBQUNEO0FBQ0YsS0FoRnlDO0FBaUYxQ1IsU0FBSyxFQUFFLFVBQVNqQixPQUFULEVBQWtCeUIsUUFBbEIsRUFBNEI7QUFDL0I7QUFDQSxVQUFJZixRQUFRLEdBQUd2QyxJQUFJLENBQUNXLElBQUwsQ0FBVVUsWUFBVixFQUF3QlEsT0FBeEIsQ0FBZjs7QUFDQSxVQUFJLE9BQU95QixRQUFQLEtBQW9CLFVBQXhCLEVBQW9DO0FBQ2xDeEQsVUFBRSxDQUFDK0QsSUFBSCxDQUFRdEIsUUFBUixFQUFrQmUsUUFBbEI7QUFDRCxPQUZELE1BRU87QUFDTCxlQUFPeEQsRUFBRSxDQUFDaUQsUUFBSCxDQUFZUixRQUFaLENBQVA7QUFDRDtBQUNGLEtBekZ1QyxDQTBGeEM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVGO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBN0gwQyxHQUFyQyxDQUFQO0FBK0hELENBbktELEMiLCJmaWxlIjoiL3BhY2thZ2VzL3N0ZWVkb3NfY2ZzLWZpbGVzeXN0ZW0uanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBjaGVja05wbVZlcnNpb25zIH0gZnJvbSAnbWV0ZW9yL3RtZWFzZGF5OmNoZWNrLW5wbS12ZXJzaW9ucyc7XHJcbmNoZWNrTnBtVmVyc2lvbnMoe1xyXG5cdG1rZGlycDogXCIwLjMuNVwiXHJcbn0sICdzdGVlZG9zOmNmcy1maWxlc3lzdGVtJyk7IiwidmFyIGZzID0gcmVxdWlyZSgnZnMnKTtcclxudmFyIHBhdGggPSByZXF1aXJlKCdwYXRoJyk7XHJcbnZhciBta2RpcnAgPSByZXF1aXJlKCdta2RpcnAnKTtcclxuLy92YXIgY2hva2lkYXIgPSByZXF1aXJlKCdjaG9raWRhcicpO1xyXG5cclxuRlMuU3RvcmUuRmlsZVN5c3RlbSA9IGZ1bmN0aW9uKG5hbWUsIG9wdGlvbnMpIHtcclxuICB2YXIgc2VsZiA9IHRoaXM7XHJcbiAgaWYgKCEoc2VsZiBpbnN0YW5jZW9mIEZTLlN0b3JlLkZpbGVTeXN0ZW0pKVxyXG4gICAgdGhyb3cgbmV3IEVycm9yKCdGUy5TdG9yZS5GaWxlU3lzdGVtIG1pc3Npbmcga2V5d29yZCBcIm5ld1wiJyk7XHJcblxyXG4gIC8vIFdlIGFsbG93IG9wdGlvbnMgdG8gYmUgc3RyaW5nL3BhdGggZW1wdHkgb3Igb3B0aW9ucy5wYXRoXHJcbiAgb3B0aW9ucyA9IChvcHRpb25zICE9PSAnJyArIG9wdGlvbnMpID8gb3B0aW9ucyB8fCB7fSA6IHtcclxuICAgIHBhdGg6IG9wdGlvbnNcclxuICB9O1xyXG5cclxuICAvLyBQcm92aWRlIGEgZGVmYXVsdCBGUyBkaXJlY3Rvcnkgb25lIGxldmVsIHVwIGZyb20gdGhlIGJ1aWxkL2J1bmRsZSBkaXJlY3RvcnlcclxuICB2YXIgcGF0aG5hbWUgPSBvcHRpb25zLnBhdGg7XHJcbiAgaWYgKCFwYXRobmFtZSAmJiBfX21ldGVvcl9ib290c3RyYXBfXyAmJiBfX21ldGVvcl9ib290c3RyYXBfXy5zZXJ2ZXJEaXIpIHtcclxuICAgIHBhdGhuYW1lID0gcGF0aC5qb2luKF9fbWV0ZW9yX2Jvb3RzdHJhcF9fLnNlcnZlckRpciwgJy4uLy4uLy4uL2Nmcy9maWxlcy8nICsgbmFtZSk7XHJcbiAgfVxyXG5cclxuICBpZiAoIXBhdGhuYW1lKVxyXG4gICAgdGhyb3cgbmV3IEVycm9yKCdGUy5TdG9yZS5GaWxlU3lzdGVtIHVuYWJsZSB0byBkZXRlcm1pbmUgcGF0aCcpO1xyXG5cclxuICAvLyBDaGVjayBpZiB3ZSBoYXZlICd+L2Zvby9iYXInXHJcbiAgaWYgKHBhdGhuYW1lLnNwbGl0KHBhdGguc2VwKVswXSA9PT0gJ34nKSB7XHJcbiAgICB2YXIgaG9tZXBhdGggPSBwcm9jZXNzLmVudi5IT01FIHx8IHByb2Nlc3MuZW52LkhPTUVQQVRIIHx8IHByb2Nlc3MuZW52LlVTRVJQUk9GSUxFO1xyXG4gICAgaWYgKGhvbWVwYXRoKSB7XHJcbiAgICAgIHBhdGhuYW1lID0gcGF0aG5hbWUucmVwbGFjZSgnficsIGhvbWVwYXRoKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHRocm93IG5ldyBFcnJvcignRlMuU3RvcmUuRmlsZVN5c3RlbSB1bmFibGUgdG8gcmVzb2x2ZSBcIn5cIiBpbiBwYXRoJyk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICAvLyBTZXQgYWJzb2x1dGUgcGF0aFxyXG4gIHZhciBhYnNvbHV0ZVBhdGggPSBwYXRoLnJlc29sdmUocGF0aG5hbWUpO1xyXG5cclxuICAvLyBFbnN1cmUgdGhlIHBhdGggZXhpc3RzXHJcbiAgbWtkaXJwLnN5bmMoYWJzb2x1dGVQYXRoKTtcclxuICBGUy5kZWJ1ZyAmJiBjb25zb2xlLmxvZyhuYW1lICsgJyBGaWxlU3lzdGVtIG1vdW50ZWQgb246ICcgKyBhYnNvbHV0ZVBhdGgpO1xyXG5cclxuICByZXR1cm4gbmV3IEZTLlN0b3JhZ2VBZGFwdGVyKG5hbWUsIG9wdGlvbnMsIHtcclxuICAgIHR5cGVOYW1lOiAnc3RvcmFnZS5maWxlc3lzdGVtJyxcclxuICAgIGZpbGVLZXk6IGZ1bmN0aW9uKGZpbGVPYmopIHtcclxuICAgICAgLy8gTG9va3VwIHRoZSBjb3B5XHJcbiAgICAgIHZhciBzdG9yZSA9IGZpbGVPYmogJiYgZmlsZU9iai5fZ2V0SW5mbyhuYW1lKTtcclxuICAgICAgLy8gSWYgdGhlIHN0b3JlIGFuZCBrZXkgaXMgZm91bmQgcmV0dXJuIHRoZSBrZXlcclxuICAgICAgaWYgKHN0b3JlICYmIHN0b3JlLmtleSkgcmV0dXJuIHN0b3JlLmtleTtcclxuXHJcbiAgICAgIHZhciBmaWxlbmFtZSA9IGZpbGVPYmoubmFtZSgpO1xyXG4gICAgICB2YXIgZmlsZW5hbWVJblN0b3JlID0gZmlsZU9iai5uYW1lKHtcclxuICAgICAgICBzdG9yZTogbmFtZVxyXG4gICAgICB9KTtcclxuXHJcbiAgICAgIC8vIElmIG5vIHN0b3JlIGtleSBmb3VuZCB3ZSByZXNvbHZlIC8gZ2VuZXJhdGUgYSBrZXlcclxuICAgICAgcmV0dXJuIGZpbGVPYmouY29sbGVjdGlvbk5hbWUgKyAnLScgKyBmaWxlT2JqLl9pZCArICctJyArIChmaWxlbmFtZUluU3RvcmUgfHwgZmlsZW5hbWUpO1xyXG4gICAgfSxcclxuICAgIGNyZWF0ZVJlYWRTdHJlYW06IGZ1bmN0aW9uKGZpbGVLZXksIG9wdGlvbnMpIHtcclxuICAgICAgLy8gdGhpcyBpcyB0aGUgU3RvcmFnZSBhZGFwdGVyIHNjb3BlXHJcbiAgICAgIHZhciBmaWxlcGF0aCA9IHBhdGguam9pbihhYnNvbHV0ZVBhdGgsIGZpbGVLZXkpO1xyXG5cclxuICAgICAgZXhpc3RzID0gZnMuZXhpc3RzU3luYyhmaWxlcGF0aCk7XHJcbiAgICAgIGlmICghZXhpc3RzKVxyXG4gICAgICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoNDA0LCBcIk5vdCBGb3VuZFwiLCAnTm8gZmlsZSBmb3VuZCcpO1xyXG5cclxuICAgICAgLy8gcmV0dXJuIHRoZSByZWFkIHN0cmVhbSAtIE9wdGlvbnMgYWxsb3cgeyBzdGFydCwgZW5kIH1cclxuICAgICAgcmV0dXJuIGZzLmNyZWF0ZVJlYWRTdHJlYW0oZmlsZXBhdGgsIG9wdGlvbnMpO1xyXG4gICAgfSxcclxuICAgIGNyZWF0ZVdyaXRlU3RyZWFtOiBmdW5jdGlvbihmaWxlS2V5LCBvcHRpb25zKSB7XHJcbiAgICAgIG9wdGlvbnMgPSBvcHRpb25zIHx8IHt9O1xyXG5cclxuICAgICAgLy8gdGhpcyBpcyB0aGUgU3RvcmFnZSBhZGFwdGVyIHNjb3BlXHJcbiAgICAgIHZhciBmaWxlcGF0aCA9IHBhdGguam9pbihhYnNvbHV0ZVBhdGgsIGZpbGVLZXkpO1xyXG5cclxuICAgICAgLy8gUmV0dXJuIHRoZSBzdHJlYW0gaGFuZGxlXHJcbiAgICAgIHZhciB3cml0ZVN0cmVhbSA9IGZzLmNyZWF0ZVdyaXRlU3RyZWFtKGZpbGVwYXRoLCBvcHRpb25zKTtcclxuXHJcbiAgICAgIC8vIFRoZSBmaWxlc3lzdGVtIGRvZXMgbm90IGVtaXQgdGhlIFwiZW5kXCIgZXZlbnQgb25seSBjbG9zZSAtIHNvIHdlXHJcbiAgICAgIC8vIG1hbnVhbGx5IHNlbmQgdGhlIGVuZCBldmVudFxyXG4gICAgICB3cml0ZVN0cmVhbS5vbignY2xvc2UnLCBmdW5jdGlvbigpIHtcclxuICAgICAgICBpZiAoRlMuZGVidWcpIGNvbnNvbGUubG9nKCdTQSBGaWxlU3lzdGVtIC0gRE9ORSEhIGZpbGVLZXk6IFwiJyArIGZpbGVLZXkgKyAnXCInKTtcclxuXHJcbiAgICAgICAgLy8gR2V0IHRoZSBleGFjdCBzaXplIG9mIHRoZSBzdG9yZWQgZmlsZSwgc28gdGhhdCB3ZSBjYW4gcGFzcyBpdCB0byBvbkVuZC9vblN0b3JlZC5cclxuICAgICAgICAvLyBTaW5jZSBzdHJlYW0gdHJhbnNmb3JtcyBtaWdodCBoYXZlIGFsdGVyZWQgdGhlIHNpemUsIHRoaXMgaXMgdGhlIGJlc3Qgd2F5IHRvXHJcbiAgICAgICAgLy8gZW5zdXJlIHdlIHVwZGF0ZSB0aGUgZmlsZU9iai5jb3BpZXMgd2l0aCB0aGUgY29ycmVjdCBzaXplLlxyXG4gICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAvLyBHZXQgdGhlIHN0YXRzIG9mIHRoZSBmaWxlXHJcbiAgICAgICAgICB2YXIgc3RhdHMgPSBmcy5zdGF0U3luYyhmaWxlcGF0aCk7XHJcblxyXG4gICAgICAgICAgLy8gRW1pdCBlbmQgYW5kIHJldHVybiB0aGUgZmlsZUtleSwgc2l6ZSwgYW5kIHVwZGF0ZWQgZGF0ZVxyXG4gICAgICAgICAgd3JpdGVTdHJlYW0uZW1pdCgnc3RvcmVkJywge1xyXG4gICAgICAgICAgICBmaWxlS2V5OiBmaWxlS2V5LFxyXG4gICAgICAgICAgICBzaXplOiBzdGF0cy5zaXplLFxyXG4gICAgICAgICAgICBzdG9yZWRBdDogc3RhdHMubXRpbWVcclxuICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICB9IGNhdGNoIChlcnIpIHtcclxuICAgICAgICAgIC8vIE9uIGVycm9yIHdlIGVtaXQgdGhlIGVycm9yIG9uXHJcbiAgICAgICAgICB3cml0ZVN0cmVhbS5lbWl0KCdlcnJvcicsIGVycik7XHJcbiAgICAgICAgfVxyXG4gICAgICB9KTtcclxuXHJcbiAgICAgIHJldHVybiB3cml0ZVN0cmVhbTtcclxuICAgIH0sXHJcbiAgICByZW1vdmU6IGZ1bmN0aW9uKGZpbGVLZXksIGNhbGxiYWNrKSB7XHJcbiAgICAgIC8vIHRoaXMgaXMgdGhlIFN0b3JhZ2UgYWRhcHRlciBzY29wZVxyXG4gICAgICB2YXIgZmlsZXBhdGggPSBwYXRoLmpvaW4oYWJzb2x1dGVQYXRoLCBmaWxlS2V5KTtcclxuICAgICAgdmFyIGlzX2V4aXN0cyA9IGZzLmV4aXN0c1N5bmMoZmlsZXBhdGgpO1xyXG4gICAgICBpZiAoaXNfZXhpc3RzKSB7XHJcbiAgICAgICAgLy8gQ2FsbCBub2RlIHVubGluayBmaWxlXHJcbiAgICAgICAgZnMudW5saW5rKGZpbGVwYXRoLCBmdW5jdGlvbihlcnJvciwgcmVzdWx0KSB7XHJcbiAgICAgICAgICBpZiAoZXJyb3IgJiYgZXJyb3IuZXJybm8gPT09IDM0KSB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUud2FybihcIlNBIEZpbGVTeXN0ZW06IENvdWxkIG5vdCBkZWxldGUgXCIgKyBmaWxlcGF0aCArIFwiIGJlY2F1c2UgdGhlIGZpbGUgd2FzIG5vdCBmb3VuZC5cIik7XHJcbiAgICAgICAgICAgIGNhbGxiYWNrICYmIGNhbGxiYWNrKG51bGwpO1xyXG4gICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgY2FsbGJhY2sgJiYgY2FsbGJhY2soZXJyb3IsIHJlc3VsdCk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgY2FsbGJhY2sgJiYgY2FsbGJhY2sobnVsbCk7XHJcbiAgICAgIH1cclxuICAgIH0sXHJcbiAgICBzdGF0czogZnVuY3Rpb24oZmlsZUtleSwgY2FsbGJhY2spIHtcclxuICAgICAgICAvLyB0aGlzIGlzIHRoZSBTdG9yYWdlIGFkYXB0ZXIgc2NvcGVcclxuICAgICAgICB2YXIgZmlsZXBhdGggPSBwYXRoLmpvaW4oYWJzb2x1dGVQYXRoLCBmaWxlS2V5KTtcclxuICAgICAgICBpZiAodHlwZW9mIGNhbGxiYWNrID09PSAnZnVuY3Rpb24nKSB7XHJcbiAgICAgICAgICBmcy5zdGF0KGZpbGVwYXRoLCBjYWxsYmFjayk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIHJldHVybiBmcy5zdGF0U3luYyhmaWxlcGF0aCk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICAgIC8vIEFkZCB0aGlzIGJhY2sgYW5kIGFkZCB0aGUgY2hva2lkYXIgZGVwZW5kZW5jeSBiYWNrIHdoZW4gd2UgbWFrZSB0aGlzIHdvcmsgZXZlbnR1YWxseVxyXG4gICAgICAvLyB3YXRjaDogZnVuY3Rpb24oY2FsbGJhY2spIHtcclxuICAgICAgLy8gICBmdW5jdGlvbiBmaWxlS2V5KGZpbGVQYXRoKSB7XHJcbiAgICAgIC8vICAgICByZXR1cm4gZmlsZVBhdGgucmVwbGFjZShhYnNvbHV0ZVBhdGgsIFwiXCIpO1xyXG4gICAgICAvLyAgIH1cclxuXHJcbiAgICAvLyAgIEZTLmRlYnVnICYmIGNvbnNvbGUubG9nKCdXYXRjaGluZyAnICsgYWJzb2x1dGVQYXRoKTtcclxuXHJcbiAgICAvLyAgIC8vIGNob2tpZGFyIHNlZW1zIHRvIGJlIG1vc3Qgd2lkZWx5IHVzZWQgYW5kIHByb2R1Y3Rpb24gcmVhZHkgd2F0Y2hlclxyXG4gICAgLy8gICB2YXIgd2F0Y2hlciA9IGNob2tpZGFyLndhdGNoKGFic29sdXRlUGF0aCwge2lnbm9yZWQ6IC9cXC9cXC4vLCBpZ25vcmVJbml0aWFsOiB0cnVlfSk7XHJcbiAgICAvLyAgIHdhdGNoZXIub24oJ2FkZCcsIE1ldGVvci5iaW5kRW52aXJvbm1lbnQoZnVuY3Rpb24oZmlsZVBhdGgsIHN0YXRzKSB7XHJcbiAgICAvLyAgICAgY2FsbGJhY2soXCJjaGFuZ2VcIiwgZmlsZUtleShmaWxlUGF0aCksIHtcclxuICAgIC8vICAgICAgIG5hbWU6IHBhdGguYmFzZW5hbWUoZmlsZVBhdGgpLFxyXG4gICAgLy8gICAgICAgdHlwZTogbnVsbCxcclxuICAgIC8vICAgICAgIHNpemU6IHN0YXRzLnNpemUsXHJcbiAgICAvLyAgICAgICB1dGltZTogc3RhdHMubXRpbWVcclxuICAgIC8vICAgICB9KTtcclxuICAgIC8vICAgfSwgZnVuY3Rpb24oZXJyKSB7XHJcbiAgICAvLyAgICAgdGhyb3cgZXJyO1xyXG4gICAgLy8gICB9KSk7XHJcbiAgICAvLyAgIHdhdGNoZXIub24oJ2NoYW5nZScsIE1ldGVvci5iaW5kRW52aXJvbm1lbnQoZnVuY3Rpb24oZmlsZVBhdGgsIHN0YXRzKSB7XHJcbiAgICAvLyAgICAgY2FsbGJhY2soXCJjaGFuZ2VcIiwgZmlsZUtleShmaWxlUGF0aCksIHtcclxuICAgIC8vICAgICAgIG5hbWU6IHBhdGguYmFzZW5hbWUoZmlsZVBhdGgpLFxyXG4gICAgLy8gICAgICAgdHlwZTogbnVsbCxcclxuICAgIC8vICAgICAgIHNpemU6IHN0YXRzLnNpemUsXHJcbiAgICAvLyAgICAgICB1dGltZTogc3RhdHMubXRpbWVcclxuICAgIC8vICAgICB9KTtcclxuICAgIC8vICAgfSwgZnVuY3Rpb24oZXJyKSB7XHJcbiAgICAvLyAgICAgdGhyb3cgZXJyO1xyXG4gICAgLy8gICB9KSk7XHJcbiAgICAvLyAgIHdhdGNoZXIub24oJ3VubGluaycsIE1ldGVvci5iaW5kRW52aXJvbm1lbnQoZnVuY3Rpb24oZmlsZVBhdGgpIHtcclxuICAgIC8vICAgICBjYWxsYmFjayhcInJlbW92ZVwiLCBmaWxlS2V5KGZpbGVQYXRoKSk7XHJcbiAgICAvLyAgIH0sIGZ1bmN0aW9uKGVycikge1xyXG4gICAgLy8gICAgIHRocm93IGVycjtcclxuICAgIC8vICAgfSkpO1xyXG4gICAgLy8gfVxyXG4gIH0pO1xyXG59OyJdfQ==
