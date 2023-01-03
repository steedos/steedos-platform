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

var require = meteorInstall({"node_modules":{"meteor":{"steedos:cfs-filesystem":{"filesystem.server.js":function module(require){

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

require("/node_modules/meteor/steedos:cfs-filesystem/filesystem.server.js");

/* Exports */
Package._define("steedos:cfs-filesystem");

})();

//# sourceURL=meteor://💻app/packages/steedos_cfs-filesystem.js
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvczpjZnMtZmlsZXN5c3RlbS9maWxlc3lzdGVtLnNlcnZlci5qcyJdLCJuYW1lcyI6WyJmcyIsInJlcXVpcmUiLCJwYXRoIiwibWtkaXJwIiwiRlMiLCJTdG9yZSIsIkZpbGVTeXN0ZW0iLCJuYW1lIiwib3B0aW9ucyIsInNlbGYiLCJFcnJvciIsInBhdGhuYW1lIiwiX19tZXRlb3JfYm9vdHN0cmFwX18iLCJzZXJ2ZXJEaXIiLCJqb2luIiwic3BsaXQiLCJzZXAiLCJob21lcGF0aCIsInByb2Nlc3MiLCJlbnYiLCJIT01FIiwiSE9NRVBBVEgiLCJVU0VSUFJPRklMRSIsInJlcGxhY2UiLCJhYnNvbHV0ZVBhdGgiLCJyZXNvbHZlIiwic3luYyIsImRlYnVnIiwiY29uc29sZSIsImxvZyIsIlN0b3JhZ2VBZGFwdGVyIiwidHlwZU5hbWUiLCJmaWxlS2V5IiwiZmlsZU9iaiIsInN0b3JlIiwiX2dldEluZm8iLCJrZXkiLCJmaWxlbmFtZSIsImZpbGVuYW1lSW5TdG9yZSIsImNvbGxlY3Rpb25OYW1lIiwiX2lkIiwiY3JlYXRlUmVhZFN0cmVhbSIsImZpbGVwYXRoIiwiZXhpc3RzIiwiZXhpc3RzU3luYyIsIk1ldGVvciIsImNyZWF0ZVdyaXRlU3RyZWFtIiwid3JpdGVTdHJlYW0iLCJvbiIsInN0YXRzIiwic3RhdFN5bmMiLCJlbWl0Iiwic2l6ZSIsInN0b3JlZEF0IiwibXRpbWUiLCJlcnIiLCJyZW1vdmUiLCJjYWxsYmFjayIsImlzX2V4aXN0cyIsInVubGluayIsImVycm9yIiwicmVzdWx0IiwiZXJybm8iLCJ3YXJuIiwic3RhdCJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLElBQUlBLEVBQUUsR0FBR0MsT0FBTyxDQUFDLElBQUQsQ0FBaEI7O0FBQ0EsSUFBSUMsSUFBSSxHQUFHRCxPQUFPLENBQUMsTUFBRCxDQUFsQjs7QUFDQSxJQUFJRSxNQUFNLEdBQUdGLE9BQU8s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bEN6RCxVQUFFLENBQUNnRSxJQUFILENBQVF0QixRQUFSLEVBQWtCZSxRQUFsQjtBQUNELE9BRkQsTUFFTztBQUNMLGVBQU96RCxFQUFFLENBQUNrRCxRQUFILENBQVlSLFFBQVosQ0FBUDtBQUNEO0FBQ0YsS0F6RnVDLENBMEZ4QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUY7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUE3SDBDLEdBQXJDLENBQVA7QUErSEQsQ0FuS0QsQyIsImZpbGUiOiIvcGFja2FnZXMvc3RlZWRvc19jZnMtZmlsZXN5c3RlbS5qcyIsInNvdXJjZXNDb250ZW50IjpbInZhciBmcyA9IHJlcXVpcmUoJ2ZzJyk7XG52YXIgcGF0aCA9IHJlcXVpcmUoJ3BhdGgnKTtcbnZhciBta2RpcnAgPSByZXF1aXJlKCdta2RpcnAnKTtcbi8vdmFyIGNob2tpZGFyID0gcmVxdWlyZSgnY2hva2lkYXInKTtcblxuRlMuU3RvcmUuRmlsZVN5c3RlbSA9IGZ1bmN0aW9uKG5hbWUsIG9wdGlvbnMpIHtcbiAgdmFyIHNlbGYgPSB0aGlzO1xuICBpZiAoIShzZWxmIGluc3RhbmNlb2YgRlMuU3RvcmUuRmlsZVN5c3RlbSkpXG4gICAgdGhyb3cgbmV3IEVycm9yKCdGUy5TdG9yZS5GaWxlU3lzdGVtIG1pc3Npbmcga2V5d29yZCBcIm5ld1wiJyk7XG5cbiAgLy8gV2UgYWxsb3cgb3B0aW9ucyB0byBiZSBzdHJpbmcvcGF0aCBlbXB0eSBvciBvcHRpb25zLnBhdGhcbiAgb3B0aW9ucyA9IChvcHRpb25zICE9PSAnJyArIG9wdGlvbnMpID8gb3B0aW9ucyB8fCB7fSA6IHtcbiAgICBwYXRoOiBvcHRpb25zXG4gIH07XG5cbiAgLy8gUHJvdmlkZSBhIGRlZmF1bHQgRlMgZGlyZWN0b3J5IG9uZSBsZXZlbCB1cCBmcm9tIHRoZSBidWlsZC9idW5kbGUgZGlyZWN0b3J5XG4gIHZhciBwYXRobmFtZSA9IG9wdGlvbnMucGF0aDtcbiAgaWYgKCFwYXRobmFtZSAmJiBfX21ldGVvcl9ib290c3RyYXBfXyAmJiBfX21ldGVvcl9ib290c3RyYXBfXy5zZXJ2ZXJEaXIpIHtcbiAgICBwYXRobmFtZSA9IHBhdGguam9pbihfX21ldGVvcl9ib290c3RyYXBfXy5zZXJ2ZXJEaXIsICcuLi8uLi8uLi9jZnMvZmlsZXMvJyArIG5hbWUpO1xuICB9XG5cbiAgaWYgKCFwYXRobmFtZSlcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ0ZTLlN0b3JlLkZpbGVTeXN0ZW0gdW5hYmxlIHRvIGRldGVybWluZSBwYXRoJyk7XG5cbiAgLy8gQ2hlY2sgaWYgd2UgaGF2ZSAnfi9mb28vYmFyJ1xuICBpZiAocGF0aG5hbWUuc3BsaXQocGF0aC5zZXApWzBdID09PSAnficpIHtcbiAgICB2YXIgaG9tZXBhdGggPSBwcm9jZXNzLmVudi5IT01FIHx8IHByb2Nlc3MuZW52LkhPTUVQQVRIIHx8IHByb2Nlc3MuZW52LlVTRVJQUk9GSUxFO1xuICAgIGlmIChob21lcGF0aCkge1xuICAgICAgcGF0aG5hbWUgPSBwYXRobmFtZS5yZXBsYWNlKCd+JywgaG9tZXBhdGgpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ0ZTLlN0b3JlLkZpbGVTeXN0ZW0gdW5hYmxlIHRvIHJlc29sdmUgXCJ+XCIgaW4gcGF0aCcpO1xuICAgIH1cbiAgfVxuXG4gIC8vIFNldCBhYnNvbHV0ZSBwYXRoXG4gIHZhciBhYnNvbHV0ZVBhdGggPSBwYXRoLnJlc29sdmUocGF0aG5hbWUpO1xuXG4gIC8vIEVuc3VyZSB0aGUgcGF0aCBleGlzdHNcbiAgbWtkaXJwLnN5bmMoYWJzb2x1dGVQYXRoKTtcbiAgRlMuZGVidWcgJiYgY29uc29sZS5sb2cobmFtZSArICcgRmlsZVN5c3RlbSBtb3VudGVkIG9uOiAnICsgYWJzb2x1dGVQYXRoKTtcblxuICByZXR1cm4gbmV3IEZTLlN0b3JhZ2VBZGFwdGVyKG5hbWUsIG9wdGlvbnMsIHtcbiAgICB0eXBlTmFtZTogJ3N0b3JhZ2UuZmlsZXN5c3RlbScsXG4gICAgZmlsZUtleTogZnVuY3Rpb24oZmlsZU9iaikge1xuICAgICAgLy8gTG9va3VwIHRoZSBjb3B5XG4gICAgICB2YXIgc3RvcmUgPSBmaWxlT2JqICYmIGZpbGVPYmouX2dldEluZm8obmFtZSk7XG4gICAgICAvLyBJZiB0aGUgc3RvcmUgYW5kIGtleSBpcyBmb3VuZCByZXR1cm4gdGhlIGtleVxuICAgICAgaWYgKHN0b3JlICYmIHN0b3JlLmtleSkgcmV0dXJuIHN0b3JlLmtleTtcblxuICAgICAgdmFyIGZpbGVuYW1lID0gZmlsZU9iai5uYW1lKCk7XG4gICAgICB2YXIgZmlsZW5hbWVJblN0b3JlID0gZmlsZU9iai5uYW1lKHtcbiAgICAgICAgc3RvcmU6IG5hbWVcbiAgICAgIH0pO1xuXG4gICAgICAvLyBJZiBubyBzdG9yZSBrZXkgZm91bmQgd2UgcmVzb2x2ZSAvIGdlbmVyYXRlIGEga2V5XG4gICAgICByZXR1cm4gZmlsZU9iai5jb2xsZWN0aW9uTmFtZSArICctJyArIGZpbGVPYmouX2lkICsgJy0nICsgKGZpbGVuYW1lSW5TdG9yZSB8fCBmaWxlbmFtZSk7XG4gICAgfSxcbiAgICBjcmVhdGVSZWFkU3RyZWFtOiBmdW5jdGlvbihmaWxlS2V5LCBvcHRpb25zKSB7XG4gICAgICAvLyB0aGlzIGlzIHRoZSBTdG9yYWdlIGFkYXB0ZXIgc2NvcGVcbiAgICAgIHZhciBmaWxlcGF0aCA9IHBhdGguam9pbihhYnNvbHV0ZVBhdGgsIGZpbGVLZXkpO1xuXG4gICAgICBleGlzdHMgPSBmcy5leGlzdHNTeW5jKGZpbGVwYXRoKTtcbiAgICAgIGlmICghZXhpc3RzKVxuICAgICAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKDQwNCwgXCJOb3QgRm91bmRcIiwgJ05vIGZpbGUgZm91bmQnKTtcblxuICAgICAgLy8gcmV0dXJuIHRoZSByZWFkIHN0cmVhbSAtIE9wdGlvbnMgYWxsb3cgeyBzdGFydCwgZW5kIH1cbiAgICAgIHJldHVybiBmcy5jcmVhdGVSZWFkU3RyZWFtKGZpbGVwYXRoLCBvcHRpb25zKTtcbiAgICB9LFxuICAgIGNyZWF0ZVdyaXRlU3RyZWFtOiBmdW5jdGlvbihmaWxlS2V5LCBvcHRpb25zKSB7XG4gICAgICBvcHRpb25zID0gb3B0aW9ucyB8fCB7fTtcblxuICAgICAgLy8gdGhpcyBpcyB0aGUgU3RvcmFnZSBhZGFwdGVyIHNjb3BlXG4gICAgICB2YXIgZmlsZXBhdGggPSBwYXRoLmpvaW4oYWJzb2x1dGVQYXRoLCBmaWxlS2V5KTtcblxuICAgICAgLy8gUmV0dXJuIHRoZSBzdHJlYW0gaGFuZGxlXG4gICAgICB2YXIgd3JpdGVTdHJlYW0gPSBmcy5jcmVhdGVXcml0ZVN0cmVhbShmaWxlcGF0aCwgb3B0aW9ucyk7XG5cbiAgICAgIC8vIFRoZSBmaWxlc3lzdGVtIGRvZXMgbm90IGVtaXQgdGhlIFwiZW5kXCIgZXZlbnQgb25seSBjbG9zZSAtIHNvIHdlXG4gICAgICAvLyBtYW51YWxseSBzZW5kIHRoZSBlbmQgZXZlbnRcbiAgICAgIHdyaXRlU3RyZWFtLm9uKCdjbG9zZScsIGZ1bmN0aW9uKCkge1xuICAgICAgICBpZiAoRlMuZGVidWcpIGNvbnNvbGUubG9nKCdTQSBGaWxlU3lzdGVtIC0gRE9ORSEhIGZpbGVLZXk6IFwiJyArIGZpbGVLZXkgKyAnXCInKTtcblxuICAgICAgICAvLyBHZXQgdGhlIGV4YWN0IHNpemUgb2YgdGhlIHN0b3JlZCBmaWxlLCBzbyB0aGF0IHdlIGNhbiBwYXNzIGl0IHRvIG9uRW5kL29uU3RvcmVkLlxuICAgICAgICAvLyBTaW5jZSBzdHJlYW0gdHJhbnNmb3JtcyBtaWdodCBoYXZlIGFsdGVyZWQgdGhlIHNpemUsIHRoaXMgaXMgdGhlIGJlc3Qgd2F5IHRvXG4gICAgICAgIC8vIGVuc3VyZSB3ZSB1cGRhdGUgdGhlIGZpbGVPYmouY29waWVzIHdpdGggdGhlIGNvcnJlY3Qgc2l6ZS5cbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAvLyBHZXQgdGhlIHN0YXRzIG9mIHRoZSBmaWxlXG4gICAgICAgICAgdmFyIHN0YXRzID0gZnMuc3RhdFN5bmMoZmlsZXBhdGgpO1xuXG4gICAgICAgICAgLy8gRW1pdCBlbmQgYW5kIHJldHVybiB0aGUgZmlsZUtleSwgc2l6ZSwgYW5kIHVwZGF0ZWQgZGF0ZVxuICAgICAgICAgIHdyaXRlU3RyZWFtLmVtaXQoJ3N0b3JlZCcsIHtcbiAgICAgICAgICAgIGZpbGVLZXk6IGZpbGVLZXksXG4gICAgICAgICAgICBzaXplOiBzdGF0cy5zaXplLFxuICAgICAgICAgICAgc3RvcmVkQXQ6IHN0YXRzLm10aW1lXG4gICAgICAgICAgfSk7XG5cbiAgICAgICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgICAgLy8gT24gZXJyb3Igd2UgZW1pdCB0aGUgZXJyb3Igb25cbiAgICAgICAgICB3cml0ZVN0cmVhbS5lbWl0KCdlcnJvcicsIGVycik7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuXG4gICAgICByZXR1cm4gd3JpdGVTdHJlYW07XG4gICAgfSxcbiAgICByZW1vdmU6IGZ1bmN0aW9uKGZpbGVLZXksIGNhbGxiYWNrKSB7XG4gICAgICAvLyB0aGlzIGlzIHRoZSBTdG9yYWdlIGFkYXB0ZXIgc2NvcGVcbiAgICAgIHZhciBmaWxlcGF0aCA9IHBhdGguam9pbihhYnNvbHV0ZVBhdGgsIGZpbGVLZXkpO1xuICAgICAgdmFyIGlzX2V4aXN0cyA9IGZzLmV4aXN0c1N5bmMoZmlsZXBhdGgpO1xuICAgICAgaWYgKGlzX2V4aXN0cykge1xuICAgICAgICAvLyBDYWxsIG5vZGUgdW5saW5rIGZpbGVcbiAgICAgICAgZnMudW5saW5rKGZpbGVwYXRoLCBmdW5jdGlvbihlcnJvciwgcmVzdWx0KSB7XG4gICAgICAgICAgaWYgKGVycm9yICYmIGVycm9yLmVycm5vID09PSAzNCkge1xuICAgICAgICAgICAgY29uc29sZS53YXJuKFwiU0EgRmlsZVN5c3RlbTogQ291bGQgbm90IGRlbGV0ZSBcIiArIGZpbGVwYXRoICsgXCIgYmVjYXVzZSB0aGUgZmlsZSB3YXMgbm90IGZvdW5kLlwiKTtcbiAgICAgICAgICAgIGNhbGxiYWNrICYmIGNhbGxiYWNrKG51bGwpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjYWxsYmFjayAmJiBjYWxsYmFjayhlcnJvciwgcmVzdWx0KTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgY2FsbGJhY2sgJiYgY2FsbGJhY2sobnVsbCk7XG4gICAgICB9XG4gICAgfSxcbiAgICBzdGF0czogZnVuY3Rpb24oZmlsZUtleSwgY2FsbGJhY2spIHtcbiAgICAgICAgLy8gdGhpcyBpcyB0aGUgU3RvcmFnZSBhZGFwdGVyIHNjb3BlXG4gICAgICAgIHZhciBmaWxlcGF0aCA9IHBhdGguam9pbihhYnNvbHV0ZVBhdGgsIGZpbGVLZXkpO1xuICAgICAgICBpZiAodHlwZW9mIGNhbGxiYWNrID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgZnMuc3RhdChmaWxlcGF0aCwgY2FsbGJhY2spO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHJldHVybiBmcy5zdGF0U3luYyhmaWxlcGF0aCk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIC8vIEFkZCB0aGlzIGJhY2sgYW5kIGFkZCB0aGUgY2hva2lkYXIgZGVwZW5kZW5jeSBiYWNrIHdoZW4gd2UgbWFrZSB0aGlzIHdvcmsgZXZlbnR1YWxseVxuICAgICAgLy8gd2F0Y2g6IGZ1bmN0aW9uKGNhbGxiYWNrKSB7XG4gICAgICAvLyAgIGZ1bmN0aW9uIGZpbGVLZXkoZmlsZVBhdGgpIHtcbiAgICAgIC8vICAgICByZXR1cm4gZmlsZVBhdGgucmVwbGFjZShhYnNvbHV0ZVBhdGgsIFwiXCIpO1xuICAgICAgLy8gICB9XG5cbiAgICAvLyAgIEZTLmRlYnVnICYmIGNvbnNvbGUubG9nKCdXYXRjaGluZyAnICsgYWJzb2x1dGVQYXRoKTtcblxuICAgIC8vICAgLy8gY2hva2lkYXIgc2VlbXMgdG8gYmUgbW9zdCB3aWRlbHkgdXNlZCBhbmQgcHJvZHVjdGlvbiByZWFkeSB3YXRjaGVyXG4gICAgLy8gICB2YXIgd2F0Y2hlciA9IGNob2tpZGFyLndhdGNoKGFic29sdXRlUGF0aCwge2lnbm9yZWQ6IC9cXC9cXC4vLCBpZ25vcmVJbml0aWFsOiB0cnVlfSk7XG4gICAgLy8gICB3YXRjaGVyLm9uKCdhZGQnLCBNZXRlb3IuYmluZEVudmlyb25tZW50KGZ1bmN0aW9uKGZpbGVQYXRoLCBzdGF0cykge1xuICAgIC8vICAgICBjYWxsYmFjayhcImNoYW5nZVwiLCBmaWxlS2V5KGZpbGVQYXRoKSwge1xuICAgIC8vICAgICAgIG5hbWU6IHBhdGguYmFzZW5hbWUoZmlsZVBhdGgpLFxuICAgIC8vICAgICAgIHR5cGU6IG51bGwsXG4gICAgLy8gICAgICAgc2l6ZTogc3RhdHMuc2l6ZSxcbiAgICAvLyAgICAgICB1dGltZTogc3RhdHMubXRpbWVcbiAgICAvLyAgICAgfSk7XG4gICAgLy8gICB9LCBmdW5jdGlvbihlcnIpIHtcbiAgICAvLyAgICAgdGhyb3cgZXJyO1xuICAgIC8vICAgfSkpO1xuICAgIC8vICAgd2F0Y2hlci5vbignY2hhbmdlJywgTWV0ZW9yLmJpbmRFbnZpcm9ubWVudChmdW5jdGlvbihmaWxlUGF0aCwgc3RhdHMpIHtcbiAgICAvLyAgICAgY2FsbGJhY2soXCJjaGFuZ2VcIiwgZmlsZUtleShmaWxlUGF0aCksIHtcbiAgICAvLyAgICAgICBuYW1lOiBwYXRoLmJhc2VuYW1lKGZpbGVQYXRoKSxcbiAgICAvLyAgICAgICB0eXBlOiBudWxsLFxuICAgIC8vICAgICAgIHNpemU6IHN0YXRzLnNpemUsXG4gICAgLy8gICAgICAgdXRpbWU6IHN0YXRzLm10aW1lXG4gICAgLy8gICAgIH0pO1xuICAgIC8vICAgfSwgZnVuY3Rpb24oZXJyKSB7XG4gICAgLy8gICAgIHRocm93IGVycjtcbiAgICAvLyAgIH0pKTtcbiAgICAvLyAgIHdhdGNoZXIub24oJ3VubGluaycsIE1ldGVvci5iaW5kRW52aXJvbm1lbnQoZnVuY3Rpb24oZmlsZVBhdGgpIHtcbiAgICAvLyAgICAgY2FsbGJhY2soXCJyZW1vdmVcIiwgZmlsZUtleShmaWxlUGF0aCkpO1xuICAgIC8vICAgfSwgZnVuY3Rpb24oZXJyKSB7XG4gICAgLy8gICAgIHRocm93IGVycjtcbiAgICAvLyAgIH0pKTtcbiAgICAvLyB9XG4gIH0pO1xufTsiXX0=
