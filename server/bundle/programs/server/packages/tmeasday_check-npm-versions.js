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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvdG1lYXNkYXk6Y2hlY2stbnBtLXZlcnNpb25zL2NoZWNrLW5wbS12ZXJzaW9ucy5qcyJdLCJuYW1lcyI6WyJtb2R1bGUxIiwiZXhwb3J0IiwiY2hlY2tOcG1WZXJzaW9ucyIsInNlbXZlciIsImxpbmsiLCJkZWZhdWx0IiwidiIsImNvbXBhdGlibGVWZXJzaW9uSXNJbnN0YWxsZWQiLCJuYW1lIiwicmFuZ2UiLCJpbnN0YWxsZWRWZXJzaW9uIiwicmVxdWlyZSIsInZlcnNpb24iLCJzYXRpc2ZpZXMiLCJlIiwibWVzc2FnZSIsInRvU3RyaW5nIiwibWF0Y2giLCJwYWNrYWdlcyIsInBhY2thZ2VOYW1lIiwicHJvY2VzcyIsImVudiIsIkNSRUFUT1JfTk9ERV9FTlYiLCJmYWlsdXJlcyIsIk9iamVjdCIsImtleXMiLCJmb3JFYWNoIiwiZmFpbHVyZSIsImxlbmd0aCIsImVycm9ycyIsImluc3RhbGxlZCIsInJlcXVpcmVtZW50IiwicHVzaCIsInF1YWxpZmllciIsImNvbnNvbGUiLCJ3YXJuIiwiam9pbiJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBQSxTQUFPLENBQUNDLE1BQVIsQ0FBZTtBQUFDQyxvQkFBZ0IsRUFBQyxNQUFJQTtBQUF0QixHQUFmO0FBQXdELE1BQUlDLE1BQUo7QUFBV0gsU0FBTyxDQUFDSSxJQUFSLENBQWEsUUFBYixFQUFzQjtBQUFDQyxXQUFPLENBQUNDLENBQUQsRUFBRztBQUFDSCxZQUFNLEdBQUNHLENBQVA7QUFBUzs7QUFBckIsR0FBdEIsRUFBNkMsQ0FBN0M7O0FBRW5FO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsUUFBTUMsNEJBQTRCLEdBQUcsQ0FBQ0MsSUFBRCxFQUFPQyxLQUFQLEtBQWlCO0FBQ3BELFFBQUk7QUFDRixZQUFNQyxnQkFBZ0IsR0FBR0MsT0FBTyxXQUFJSCxJQUFKLG1CQUFQLENBQWdDSSxPQUF6RDs7QUFDQSxVQUFJVCxNQUFNLENBQUNVLFNBQVAsQ0FBaUJILGdCQUFqQixFQUFtQ0QsS0FBbkMsQ0FBSixFQUErQztBQUM3QyxlQUFPLElBQVA7QUFDRCxPQUZELE1BRU87QUFDTCxlQUFPQyxnQkFBUDtBQUNEO0FBQ0YsS0FQRCxDQU9FLE9BQU9JLENBQVAsRUFBVTtBQUNWO0FBQ0EsWUFBTUMsT0FBTyxHQUFHRCxDQUFDLENBQUNFLFFBQUYsRUFBaEIsQ0FGVSxDQUdWOztBQUNBLFVBQUlELE9BQU8sQ0FBQ0UsS0FBUixDQUFjLG9CQUFkLEtBQXVDRixPQUFPLENBQUNFLEtBQVIsQ0FBYyx1QkFBZCxDQUEzQyxFQUFtRjtBQUNqRixlQUFPLEtBQVA7QUFDRCxPQUZELE1BRU87QUFDTCxjQUFNSCxDQUFOO0FBQ0Q7QUFDRjtBQUNGLEdBbEJEOztBQW9CTyxRQUFNWixnQkFBZ0IsR0FBRyxDQUFDZ0IsUUFBRCxFQUFXQyxXQUFYLEtBQTJCO0FBQ3pELFFBQUksQ0FBQ0MsT0FBTyxDQUFDQyxHQUFSLENBQVlDLGdCQUFiLElBQWlDLGFBQXJDLEVBQW9EO0FBQ2xEO0FBQ0Q7O0FBQ0QsVUFBTUMsUUFBUSxHQUFHLEVBQWpCO0FBRUFDLFVBQU0sQ0FBQ0MsSUFBUCxDQUFZUCxRQUFaLEVBQXNCUSxPQUF0QixDQUErQmxCLElBQUQsSUFBVTtBQUN0QyxZQUFNQyxLQUFLLEdBQUdTLFFBQVEsQ0FBQ1YsSUFBRCxDQUF0QjtBQUNBLFlBQU1tQixPQUFPLEdBQUdwQiw0QkFBNEIsQ0FBQ0MsSUFBRCxFQUFPQyxLQUFQLENBQTVDOztBQUVBLFVBQUlrQixPQUFPLEtBQUssSUFBaEIsRUFBc0I7QUFDcEJKLGdCQUFRLENBQUNmLElBQUQsQ0FBUixHQUFpQm1CLE9BQWpCO0FBQ0Q7QUFDRixLQVBEOztBQVNBLFFBQUlILE1BQU0sQ0FBQ0MsSUFBUCxDQUFZRixRQUFaLEVBQXNCSyxNQUF0QixLQUFpQyxDQUFyQyxFQUF3QztBQUN0QyxhQUFPLElBQVA7QUFDRDs7QUFFRCxVQUFNQyxNQUFNLEdBQUcsRUFBZjtBQUVBTCxVQUFNLENBQUNDLElBQVAsQ0FBWUYsUUFBWixFQUFzQkcsT0FBdEIsQ0FBK0JsQixJQUFELElBQVU7QUFDdEMsWUFBTXNCLFNBQVMsR0FBR1AsUUFBUSxDQUFDZixJQUFELENBQTFCO0FBQ0EsWUFBTXVCLFdBQVcsYUFBTXZCLElBQU4sY0FBY1UsUUFBUSxDQUFDVixJQUFELENBQXRCLENBQWpCOztBQUVBLFVBQUlzQixTQUFKLEVBQWU7QUFDYkQsY0FBTSxDQUFDRyxJQUFQLGNBQWtCeEIsSUFBbEIsY0FBMEJzQixTQUExQix5QkFBa0RDLFdBQWxEO0FBQ0QsT0FGRCxNQUVPO0FBQ0xGLGNBQU0sQ0FBQ0csSUFBUCxjQUFrQnhCLElBQWxCLGNBQTBCVSxRQUFRLENBQUNWLElBQUQsQ0FBbEM7QUFDRDtBQUNGLEtBVEQ7QUFXQSxVQUFNeUIsU0FBUyxHQUFHZCxXQUFXLGtCQUFXQSxXQUFYLFVBQTZCLEVBQTFEO0FBQ0FlLFdBQU8sQ0FBQ0MsSUFBUiwwQ0FBK0NGLFNBQS9DLDZCQUNBSixNQUFNLENBQUNPLElBQVAsQ0FBWSxJQUFaLENBREE7QUFNRCxHQXZDTSIsImZpbGUiOiIvcGFja2FnZXMvdG1lYXNkYXlfY2hlY2stbnBtLXZlcnNpb25zLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHNlbXZlciBmcm9tICdzZW12ZXInO1xyXG5cclxuLy8gUmV0dXJuczpcclxuLy8gICAtIHRydWUgICAgICBpZiBhIHZlcnNpb24gb2YgdGhlIHBhY2thZ2UgaW4gdGhlIHJhbmdlIGlzIGluc3RhbGxlZFxyXG4vLyAgIC0gZmFsc2UgICAgIGlmIG5vIHZlcnNpb24gaXMgaW5zdGFsbGVkXHJcbi8vICAgLSB2ZXJzaW9uIyAgaWYgaW5jb21wYXRpYmxlIHZlcnNpb24gaXMgaW5zdGFsbGVkXHJcbmNvbnN0IGNvbXBhdGlibGVWZXJzaW9uSXNJbnN0YWxsZWQgPSAobmFtZSwgcmFuZ2UpID0+IHtcclxuICB0cnkge1xyXG4gICAgY29uc3QgaW5zdGFsbGVkVmVyc2lvbiA9IHJlcXVpcmUoYCR7bmFtZX0vcGFja2FnZS5qc29uYCkudmVyc2lvbjtcclxuICAgIGlmIChzZW12ZXIuc2F0aXNmaWVzKGluc3RhbGxlZFZlcnNpb24sIHJhbmdlKSkge1xyXG4gICAgICByZXR1cm4gdHJ1ZTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHJldHVybiBpbnN0YWxsZWRWZXJzaW9uO1xyXG4gICAgfVxyXG4gIH0gY2F0Y2ggKGUpIHtcclxuICAgIC8vIFhYWCBhZGQgc29tZXRoaW5nIHRvIHRoZSB0b29sIHRvIG1ha2UgdGhpcyBtb3JlIHJlbGlhYmxlXHJcbiAgICBjb25zdCBtZXNzYWdlID0gZS50b1N0cmluZygpO1xyXG4gICAgLy8gT25lIG1lc3NhZ2UgY29tZXMgb3V0IG9mIHRoZSBpbnN0YWxsIG5wbSBwYWNrYWdlIHRoZSBvdGhlciBmcm9tIG5wbSBkaXJlY3RseVxyXG4gICAgaWYgKG1lc3NhZ2UubWF0Y2goXCJDYW5ub3QgZmluZCBtb2R1bGVcIikgfHwgbWVzc2FnZS5tYXRjaChcIkNhbid0IGZpbmQgbnBtIG1vZHVsZVwiKSkge1xyXG4gICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICB0aHJvdyBlO1xyXG4gICAgfVxyXG4gIH1cclxufTtcclxuXHJcbmV4cG9ydCBjb25zdCBjaGVja05wbVZlcnNpb25zID0gKHBhY2thZ2VzLCBwYWNrYWdlTmFtZSkgPT4ge1xyXG4gIGlmICghcHJvY2Vzcy5lbnYuQ1JFQVRPUl9OT0RFX0VOViA9PSAnZGV2ZWxvcG1lbnQnKSB7XHJcbiAgICByZXR1cm47XHJcbiAgfVxyXG4gIGNvbnN0IGZhaWx1cmVzID0ge307XHJcblxyXG4gIE9iamVjdC5rZXlzKHBhY2thZ2VzKS5mb3JFYWNoKChuYW1lKSA9PiB7XHJcbiAgICBjb25zdCByYW5nZSA9IHBhY2thZ2VzW25hbWVdO1xyXG4gICAgY29uc3QgZmFpbHVyZSA9IGNvbXBhdGlibGVWZXJzaW9uSXNJbnN0YWxsZWQobmFtZSwgcmFuZ2UpO1xyXG5cclxuICAgIGlmIChmYWlsdXJlICE9PSB0cnVlKSB7XHJcbiAgICAgIGZhaWx1cmVzW25hbWVdID0gZmFpbHVyZTtcclxuICAgIH1cclxuICB9KTtcclxuXHJcbiAgaWYgKE9iamVjdC5rZXlzKGZhaWx1cmVzKS5sZW5ndGggPT09IDApIHtcclxuICAgIHJldHVybiB0cnVlO1xyXG4gIH1cclxuXHJcbiAgY29uc3QgZXJyb3JzID0gW107XHJcblxyXG4gIE9iamVjdC5rZXlzKGZhaWx1cmVzKS5mb3JFYWNoKChuYW1lKSA9PiB7XHJcbiAgICBjb25zdCBpbnN0YWxsZWQgPSBmYWlsdXJlc1tuYW1lXTtcclxuICAgIGNvbnN0IHJlcXVpcmVtZW50ID0gYCR7bmFtZX1AJHtwYWNrYWdlc1tuYW1lXX1gO1xyXG5cclxuICAgIGlmIChpbnN0YWxsZWQpIHtcclxuICAgICAgZXJyb3JzLnB1c2goYCAtICR7bmFtZX1AJHtpbnN0YWxsZWR9IGluc3RhbGxlZCwgJHtyZXF1aXJlbWVudH0gbmVlZGVkYCk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBlcnJvcnMucHVzaChgIC0gJHtuYW1lfUAke3BhY2thZ2VzW25hbWVdfSBub3QgaW5zdGFsbGVkLmApO1xyXG4gICAgfVxyXG4gIH0pO1xyXG5cclxuICBjb25zdCBxdWFsaWZpZXIgPSBwYWNrYWdlTmFtZSA/IGAoZm9yICR7cGFja2FnZU5hbWV9KSBgIDogJyc7XHJcbiAgY29uc29sZS53YXJuKGBXQVJOSU5HOiBucG0gcGVlciByZXF1aXJlbWVudHMgJHtxdWFsaWZpZXJ9bm90IGluc3RhbGxlZDpcclxuJHtlcnJvcnMuam9pbignXFxuJyl9XHJcblxyXG5SZWFkIG1vcmUgYWJvdXQgaW5zdGFsbGluZyBucG0gcGVlciBkZXBlbmRlbmNpZXM6XHJcbiAgaHR0cDovL2d1aWRlLm1ldGVvci5jb20vdXNpbmctcGFja2FnZXMuaHRtbCNwZWVyLW5wbS1kZXBlbmRlbmNpZXNcclxuYCk7XHJcbn07XHJcbiJdfQ==
