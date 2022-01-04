(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var global = Package.meteor.global;
var meteorEnv = Package.meteor.meteorEnv;
var ECMAScript = Package.ecmascript.ECMAScript;
var meteorInstall = Package.modules.meteorInstall;
var Promise = Package.promise.Promise;

var require = meteorInstall({"node_modules":{"meteor":{"tmeasday:check-npm-versions":{"check-npm-versions.js":function module(require,exports,module){

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                  //
// packages/tmeasday_check-npm-versions/check-npm-versions.js                                                       //
//                                                                                                                  //
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                    //
!function (module1) {
  module1.export({
    checkNpmVersions: () => checkNpmVersions
  });
  let semver;
  module1.link("semver", {
    default(v) {
      semver = v;
    }

  }, 0);

  // Returns:
  //   - true      if a version of the package in the range is installed
  //   - false     if no version is installed
  //   - version#  if incompatible version is installed
  const compatibleVersionIsInstalled = (name, range) => {
    try {
      const installedVersion = require("".concat(name, "/package.json")).version;

      if (semver.satisfies(installedVersion, range)) {
        return true;
      } else {
        return installedVersion;
      }
    } catch (e) {
      // XXX add something to the tool to make this more reliable
      const message = e.toString(); // One message comes out of the install npm package the other from npm directly

      if (message.match("Cannot find module") || message.match("Can't find npm module")) {
        return false;
      } else {
        throw e;
      }
    }
  };

  const checkNpmVersions = (packages, packageName) => {
    if (!process.env.CREATOR_NODE_ENV == 'development') {
      return;
    }

    const failures = {};
    Object.keys(packages).forEach(name => {
      const range = packages[name];
      const failure = compatibleVersionIsInstalled(name, range);

      if (failure !== true) {
        failures[name] = failure;
      }
    });

    if (Object.keys(failures).length === 0) {
      return true;
    }

    const errors = [];
    Object.keys(failures).forEach(name => {
      const installed = failures[name];
      const requirement = "".concat(name, "@").concat(packages[name]);

      if (installed) {
        errors.push(" - ".concat(name, "@").concat(installed, " installed, ").concat(requirement, " needed"));
      } else {
        errors.push(" - ".concat(name, "@").concat(packages[name], " not installed."));
      }
    });
    const qualifier = packageName ? "(for ".concat(packageName, ") ") : '';
    console.warn("WARNING: npm peer requirements ".concat(qualifier, "not installed:\n").concat(errors.join('\n'), "\n\nRead more about installing npm peer dependencies:\n  http://guide.meteor.com/using-packages.html#peer-npm-dependencies\n"));
  };
}.call(this, module);
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"node_modules":{"semver":{"package.json":function module(require,exports,module){

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                  //
// node_modules/meteor/tmeasday_check-npm-versions/node_modules/semver/package.json                                 //
//                                                                                                                  //
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                    //
module.exports = {
  "name": "semver",
  "version": "5.1.0",
  "main": "semver.js"
};

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"semver.js":function module(require,exports,module){

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                  //
// node_modules/meteor/tmeasday_check-npm-versions/node_modules/semver/semver.js                                    //
//                                                                                                                  //
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                    //
module.useNode();
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}}}}}}},{
  "extensions": [
    ".js",
    ".json"
  ]
});

var exports = require("/node_modules/meteor/tmeasday:check-npm-versions/check-npm-versions.js");

/* Exports */
Package._define("tmeasday:check-npm-versions", exports);

})();

//# sourceURL=meteor://💻app/packages/tmeasday_check-npm-versions.js
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvdG1lYXNkYXk6Y2hlY2stbnBtLXZlcnNpb25zL2NoZWNrLW5wbS12ZXJzaW9ucy5qcyJdLCJuYW1lcyI6WyJtb2R1bGUxIiwiZXhwb3J0IiwiY2hlY2tOcG1WZXJzaW9ucyIsInNlbXZlciIsImxpbmsiLCJkZWZhdWx0IiwidiIsImNvbXBhdGlibGVWZXJzaW9uSXNJbnN0YWxsZWQiLCJuYW1lIiwicmFuZ2UiLCJpbnN0YWxsZWRWZXJzaW9uIiwicmVxdWlyZSIsInZlcnNpb24iLCJzYXRpc2ZpZXMiLCJlIiwibWVzc2FnZSIsInRvU3RyaW5nIiwibWF0Y2giLCJwYWNrYWdlcyIsInBhY2thZ2VOYW1lIiwicHJvY2VzcyIsImVudiIsIkNSRUFUT1JfTk9ERV9FTlYiLCJmYWlsdXJlcyIsIk9iamVjdCIsImtleXMiLCJmb3JFYWNoIiwiZmFpbHVyZSIsImxlbmd0aCIsImVycm9ycyIsImluc3RhbGxlZCIsInJlcXVpcmVtZW50IiwicHVzaCIsInF1YWxpZmllciIsImNvbnNvbGUiLCJ3YXJuIiwiam9pbiJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBQSxTQUFPLENBQUNDLE1BQVIsQ0FBZTtBQUFDQyxvQkFBZ0IsRUFBQyxNQUFJQTtBQUF0QixHQUFmO0FBQXdELE1BQUlDLE1BQUo7QUFBV0gsU0FBTyxDQUFDSSxJQUFSLENBQWEsUUFBYixFQUFzQjtBQUFDQyxXQUFPLENBQUNDLENBQUQsRUFBRztBQUFDSCxZQUFNLEdBQUNHLENBQVA7QUFBUzs7QUFBckIsR0FBdEIsRUFBNkMsQ0FBN0M7O0FBRW5FO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsUUFBTUMsNEJBQTRCLEdBQUcsQ0FBQ0MsSUFBRCxFQUFPQyxLQUFQLEtBQWlCO0FBQ3BELFFBQUk7QUFDRixZQUFNQyxnQkFBZ0IsR0FBR0MsT0FBTyxXQUFJSCxJQUFKLG1CQUFQLENBQWdDSSxPQUF6RDs7QUFDQSxVQUFJVCxNQUFNLENBQUNVLFNBQVAsQ0FBaUJILGdCQUFqQixFQUFtQ0QsS0FBbkMsQ0FBSixFQUErQztBQUM3QyxlQUFPLElBQVA7QUFDRCxPQUZELE1BRU87QUFDTCxlQUFPQyxnQkFBUDtBQUNEO0FBQ0YsS0FQRCxDQU9FLE9BQU9JLENBQVAsRUFBVTtBQUNWO0FBQ0EsWUFBTUMsT0FBTyxHQUFHRCxDQUFDLENBQUNFLFFBQUYsRUFBaEIsQ0FGVSxDQUdWOztBQUNBLFVBQUlELE9BQU8sQ0FBQ0UsS0FBUixDQUFjLG9CQUFkLEtBQXVDRixPQUFPLENBQUNFLEtBQVIsQ0FBYyx1QkFBZCxDQUEzQyxFQUFtRjtBQUNqRixlQUFPLEtBQVA7QUFDRCxPQUZELE1BRU87QUFDTCxjQUFNSCxDQUFOO0FBQ0Q7QUFDRjtBQUNGLEdBbEJEOztBQW9CTyxRQUFNWixnQkFBZ0IsR0FBRyxDQUFDZ0IsUUFBRCxFQUFXQyxXQUFYLEtBQTJCO0FBQ3pELFFBQUksQ0FBQ0MsT0FBTyxDQUFDQyxHQUFSLENBQVlDLGdCQUFiLElBQWlDLGFBQXJDLEVBQW9EO0FBQ2xEO0FBQ0Q7O0FBQ0QsVUFBTUMsUUFBUSxHQUFHLEVBQWpCO0FBRUFDLFVBQU0sQ0FBQ0MsSUFBUCxDQUFZUCxRQUFaLEVBQXNCUSxPQUF0QixDQUErQmxCLElBQUQsSUFBVTtBQUN0QyxZQUFNQyxLQUFLLEdBQUdTLFFBQVEsQ0FBQ1YsSUFBRCxDQUF0QjtBQUNBLFlBQU1tQixPQUFPLEdBQUdwQiw0QkFBNEIsQ0FBQ0MsSUFBRCxFQUFPQyxLQUFQLENBQTVDOztBQUVBLFVBQUlrQixPQUFPLEtBQUssSUFBaEIsRUFBc0I7QUFDcEJKLGdCQUFRLENBQUNmLElBQUQsQ0FBUixHQUFpQm1CLE9BQWpCO0FBQ0Q7QUFDRixLQVBEOztBQVNBLFFBQUlILE1BQU0sQ0FBQ0MsSUFBUCxDQUFZRixRQUFaLEVBQXNCSyxNQUF0QixLQUFpQyxDQUFyQyxFQUF3QztBQUN0QyxhQUFPLElBQVA7QUFDRDs7QUFFRCxVQUFNQyxNQUFNLEdBQUcsRUFBZjtBQUVBTCxVQUFNLENBQUNDLElBQVAsQ0FBWUYsUUFBWixFQUFzQkcsT0FBdEIsQ0FBK0JsQixJQUFELElBQVU7QUFDdEMsWUFBTXNCLFNBQVMsR0FBR1AsUUFBUSxDQUFDZixJQUFELENBQTFCO0FBQ0EsWUFBTXVCLFdBQVcsYUFBTXZCLElBQU4sY0FBY1UsUUFBUSxDQUFDVixJQUFELENBQXRCLENBQWpCOztBQUVBLFVBQUlzQixTQUFKLEVBQWU7QUFDYkQsY0FBTSxDQUFDRyxJQUFQLGNBQWtCeEIsSUFBbEIsY0FBMEJzQixTQUExQix5QkFBa0RDLFdBQWxEO0FBQ0QsT0FGRCxNQUVPO0FBQ0xGLGNBQU0sQ0FBQ0csSUFBUCxjQUFrQnhCLElBQWxCLGNBQTBCVSxRQUFRLENBQUNWLElBQUQsQ0FBbEM7QUFDRDtBQUNGLEtBVEQ7QUFXQSxVQUFNeUIsU0FBUyxHQUFHZCxXQUFXLGtCQUFXQSxXQUFYLFVBQTZCLEVBQTFEO0FBQ0FlLFdBQU8sQ0FBQ0MsSUFBUiwwQ0FBK0NGLFNBQS9DLDZCQUNBSixNQUFNLENBQUNPLElBQVAsQ0FBWSxJQUFaLENBREE7QUFNRCxHQXZDTSIsImZpbGUiOiIvcGFja2FnZXMvdG1lYXNkYXlfY2hlY2stbnBtLXZlcnNpb25zLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHNlbXZlciBmcm9tICdzZW12ZXInO1xuXG4vLyBSZXR1cm5zOlxuLy8gICAtIHRydWUgICAgICBpZiBhIHZlcnNpb24gb2YgdGhlIHBhY2thZ2UgaW4gdGhlIHJhbmdlIGlzIGluc3RhbGxlZFxuLy8gICAtIGZhbHNlICAgICBpZiBubyB2ZXJzaW9uIGlzIGluc3RhbGxlZFxuLy8gICAtIHZlcnNpb24jICBpZiBpbmNvbXBhdGlibGUgdmVyc2lvbiBpcyBpbnN0YWxsZWRcbmNvbnN0IGNvbXBhdGlibGVWZXJzaW9uSXNJbnN0YWxsZWQgPSAobmFtZSwgcmFuZ2UpID0+IHtcbiAgdHJ5IHtcbiAgICBjb25zdCBpbnN0YWxsZWRWZXJzaW9uID0gcmVxdWlyZShgJHtuYW1lfS9wYWNrYWdlLmpzb25gKS52ZXJzaW9uO1xuICAgIGlmIChzZW12ZXIuc2F0aXNmaWVzKGluc3RhbGxlZFZlcnNpb24sIHJhbmdlKSkge1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBpbnN0YWxsZWRWZXJzaW9uO1xuICAgIH1cbiAgfSBjYXRjaCAoZSkge1xuICAgIC8vIFhYWCBhZGQgc29tZXRoaW5nIHRvIHRoZSB0b29sIHRvIG1ha2UgdGhpcyBtb3JlIHJlbGlhYmxlXG4gICAgY29uc3QgbWVzc2FnZSA9IGUudG9TdHJpbmcoKTtcbiAgICAvLyBPbmUgbWVzc2FnZSBjb21lcyBvdXQgb2YgdGhlIGluc3RhbGwgbnBtIHBhY2thZ2UgdGhlIG90aGVyIGZyb20gbnBtIGRpcmVjdGx5XG4gICAgaWYgKG1lc3NhZ2UubWF0Y2goXCJDYW5ub3QgZmluZCBtb2R1bGVcIikgfHwgbWVzc2FnZS5tYXRjaChcIkNhbid0IGZpbmQgbnBtIG1vZHVsZVwiKSkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aHJvdyBlO1xuICAgIH1cbiAgfVxufTtcblxuZXhwb3J0IGNvbnN0IGNoZWNrTnBtVmVyc2lvbnMgPSAocGFja2FnZXMsIHBhY2thZ2VOYW1lKSA9PiB7XG4gIGlmICghcHJvY2Vzcy5lbnYuQ1JFQVRPUl9OT0RFX0VOViA9PSAnZGV2ZWxvcG1lbnQnKSB7XG4gICAgcmV0dXJuO1xuICB9XG4gIGNvbnN0IGZhaWx1cmVzID0ge307XG5cbiAgT2JqZWN0LmtleXMocGFja2FnZXMpLmZvckVhY2goKG5hbWUpID0+IHtcbiAgICBjb25zdCByYW5nZSA9IHBhY2thZ2VzW25hbWVdO1xuICAgIGNvbnN0IGZhaWx1cmUgPSBjb21wYXRpYmxlVmVyc2lvbklzSW5zdGFsbGVkKG5hbWUsIHJhbmdlKTtcblxuICAgIGlmIChmYWlsdXJlICE9PSB0cnVlKSB7XG4gICAgICBmYWlsdXJlc1tuYW1lXSA9IGZhaWx1cmU7XG4gICAgfVxuICB9KTtcblxuICBpZiAoT2JqZWN0LmtleXMoZmFpbHVyZXMpLmxlbmd0aCA9PT0gMCkge1xuICAgIHJldHVybiB0cnVlO1xuICB9XG5cbiAgY29uc3QgZXJyb3JzID0gW107XG5cbiAgT2JqZWN0LmtleXMoZmFpbHVyZXMpLmZvckVhY2goKG5hbWUpID0+IHtcbiAgICBjb25zdCBpbnN0YWxsZWQgPSBmYWlsdXJlc1tuYW1lXTtcbiAgICBjb25zdCByZXF1aXJlbWVudCA9IGAke25hbWV9QCR7cGFja2FnZXNbbmFtZV19YDtcblxuICAgIGlmIChpbnN0YWxsZWQpIHtcbiAgICAgIGVycm9ycy5wdXNoKGAgLSAke25hbWV9QCR7aW5zdGFsbGVkfSBpbnN0YWxsZWQsICR7cmVxdWlyZW1lbnR9IG5lZWRlZGApO1xuICAgIH0gZWxzZSB7XG4gICAgICBlcnJvcnMucHVzaChgIC0gJHtuYW1lfUAke3BhY2thZ2VzW25hbWVdfSBub3QgaW5zdGFsbGVkLmApO1xuICAgIH1cbiAgfSk7XG5cbiAgY29uc3QgcXVhbGlmaWVyID0gcGFja2FnZU5hbWUgPyBgKGZvciAke3BhY2thZ2VOYW1lfSkgYCA6ICcnO1xuICBjb25zb2xlLndhcm4oYFdBUk5JTkc6IG5wbSBwZWVyIHJlcXVpcmVtZW50cyAke3F1YWxpZmllcn1ub3QgaW5zdGFsbGVkOlxuJHtlcnJvcnMuam9pbignXFxuJyl9XG5cblJlYWQgbW9yZSBhYm91dCBpbnN0YWxsaW5nIG5wbSBwZWVyIGRlcGVuZGVuY2llczpcbiAgaHR0cDovL2d1aWRlLm1ldGVvci5jb20vdXNpbmctcGFja2FnZXMuaHRtbCNwZWVyLW5wbS1kZXBlbmRlbmNpZXNcbmApO1xufTtcbiJdfQ==
