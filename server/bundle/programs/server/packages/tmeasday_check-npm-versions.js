(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var global = Package.meteor.global;
var meteorEnv = Package.meteor.meteorEnv;
var ECMAScript = Package.ecmascript.ECMAScript;
var meteorInstall = Package.modules.meteorInstall;
var meteorBabelHelpers = Package['babel-runtime'].meteorBabelHelpers;
var Promise = Package.promise.Promise;

var require = meteorInstall({"node_modules":{"meteor":{"tmeasday:check-npm-versions":{"check-npm-versions.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                //
// packages/tmeasday_check-npm-versions/check-npm-versions.js                                                     //
//                                                                                                                //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                  //
const module1 = module;
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
    const installedVersion = require(`${name}/package.json`).version;

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
    const requirement = `${name}@${packages[name]}`;

    if (installed) {
      errors.push(` - ${name}@${installed} installed, ${requirement} needed`);
    } else {
      errors.push(` - ${name}@${packages[name]} not installed.`);
    }
  });
  const qualifier = packageName ? `(for ${packageName}) ` : '';
  console.warn(`WARNING: npm peer requirements ${qualifier}not installed:
${errors.join('\n')}

Read more about installing npm peer dependencies:
  http://guide.meteor.com/using-packages.html#peer-npm-dependencies
`);
};
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"node_modules":{"semver":{"package.json":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                //
// node_modules/meteor/tmeasday_check-npm-versions/node_modules/semver/package.json                               //
//                                                                                                                //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                  //
module.exports = {
  "name": "semver",
  "version": "5.1.0",
  "main": "semver.js"
};

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"semver.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                //
// node_modules/meteor/tmeasday_check-npm-versions/node_modules/semver/semver.js                                  //
//                                                                                                                //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                  //
module.useNode();
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvdG1lYXNkYXk6Y2hlY2stbnBtLXZlcnNpb25zL2NoZWNrLW5wbS12ZXJzaW9ucy5qcyJdLCJuYW1lcyI6WyJtb2R1bGUxIiwibW9kdWxlIiwiZXhwb3J0IiwiY2hlY2tOcG1WZXJzaW9ucyIsInNlbXZlciIsImxpbmsiLCJkZWZhdWx0IiwidiIsImNvbXBhdGlibGVWZXJzaW9uSXNJbnN0YWxsZWQiLCJuYW1lIiwicmFuZ2UiLCJpbnN0YWxsZWRWZXJzaW9uIiwicmVxdWlyZSIsInZlcnNpb24iLCJzYXRpc2ZpZXMiLCJlIiwibWVzc2FnZSIsInRvU3RyaW5nIiwibWF0Y2giLCJwYWNrYWdlcyIsInBhY2thZ2VOYW1lIiwiZmFpbHVyZXMiLCJPYmplY3QiLCJrZXlzIiwiZm9yRWFjaCIsImZhaWx1cmUiLCJsZW5ndGgiLCJlcnJvcnMiLCJpbnN0YWxsZWQiLCJyZXF1aXJlbWVudCIsInB1c2giLCJxdWFsaWZpZXIiLCJjb25zb2xlIiwid2FybiIsImpvaW4iXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSxNQUFNQSxPQUFPLEdBQUNDLE1BQWQ7QUFBcUJELE9BQU8sQ0FBQ0UsTUFBUixDQUFlO0FBQUNDLGtCQUFnQixFQUFDLE1BQUlBO0FBQXRCLENBQWY7QUFBd0QsSUFBSUMsTUFBSjtBQUFXSixPQUFPLENBQUNLLElBQVIsQ0FBYSxRQUFiLEVBQXNCO0FBQUNDLFNBQU8sQ0FBQ0MsQ0FBRCxFQUFHO0FBQUNILFVBQU0sR0FBQ0csQ0FBUDtBQUFTOztBQUFyQixDQUF0QixFQUE2QyxDQUE3Qzs7QUFFeEY7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFNQyw0QkFBNEIsR0FBRyxDQUFDQyxJQUFELEVBQU9DLEtBQVAsS0FBaUI7QUFDcEQsTUFBSTtBQUNGLFVBQU1DLGdCQUFnQixHQUFHQyxPQUFPLENBQUUsR0FBRUgsSUFBSyxlQUFULENBQVAsQ0FBZ0NJLE9BQXpEOztBQUNBLFFBQUlULE1BQU0sQ0FBQ1UsU0FBUCxDQUFpQkgsZ0JBQWpCLEVBQW1DRCxLQUFuQyxDQUFKLEVBQStDO0FBQzdDLGFBQU8sSUFBUDtBQUNELEtBRkQsTUFFTztBQUNMLGFBQU9DLGdCQUFQO0FBQ0Q7QUFDRixHQVBELENBT0UsT0FBT0ksQ0FBUCxFQUFVO0FBQ1Y7QUFDQSxVQUFNQyxPQUFPLEdBQUdELENBQUMsQ0FBQ0UsUUFBRixFQUFoQixDQUZVLENBR1Y7O0FBQ0EsUUFBSUQsT0FBTyxDQUFDRSxLQUFSLENBQWMsb0JBQWQsS0FBdUNGLE9BQU8sQ0FBQ0UsS0FBUixDQUFjLHVCQUFkLENBQTNDLEVBQW1GO0FBQ2pGLGFBQU8sS0FBUDtBQUNELEtBRkQsTUFFTztBQUNMLFlBQU1ILENBQU47QUFDRDtBQUNGO0FBQ0YsQ0FsQkQ7O0FBb0JPLE1BQU1aLGdCQUFnQixHQUFHLENBQUNnQixRQUFELEVBQVdDLFdBQVgsS0FBMkI7QUFDekQsUUFBTUMsUUFBUSxHQUFHLEVBQWpCO0FBRUFDLFFBQU0sQ0FBQ0MsSUFBUCxDQUFZSixRQUFaLEVBQXNCSyxPQUF0QixDQUErQmYsSUFBRCxJQUFVO0FBQ3RDLFVBQU1DLEtBQUssR0FBR1MsUUFBUSxDQUFDVixJQUFELENBQXRCO0FBQ0EsVUFBTWdCLE9BQU8sR0FBR2pCLDRCQUE0QixDQUFDQyxJQUFELEVBQU9DLEtBQVAsQ0FBNUM7O0FBRUEsUUFBSWUsT0FBTyxLQUFLLElBQWhCLEVBQXNCO0FBQ3BCSixjQUFRLENBQUNaLElBQUQsQ0FBUixHQUFpQmdCLE9BQWpCO0FBQ0Q7QUFDRixHQVBEOztBQVNBLE1BQUlILE1BQU0sQ0FBQ0MsSUFBUCxDQUFZRixRQUFaLEVBQXNCSyxNQUF0QixLQUFpQyxDQUFyQyxFQUF3QztBQUN0QyxXQUFPLElBQVA7QUFDRDs7QUFFRCxRQUFNQyxNQUFNLEdBQUcsRUFBZjtBQUVBTCxRQUFNLENBQUNDLElBQVAsQ0FBWUYsUUFBWixFQUFzQkcsT0FBdEIsQ0FBK0JmLElBQUQsSUFBVTtBQUN0QyxVQUFNbUIsU0FBUyxHQUFHUCxRQUFRLENBQUNaLElBQUQsQ0FBMUI7QUFDQSxVQUFNb0IsV0FBVyxHQUFJLEdBQUVwQixJQUFLLElBQUdVLFFBQVEsQ0FBQ1YsSUFBRCxDQUFPLEVBQTlDOztBQUVBLFFBQUltQixTQUFKLEVBQWU7QUFDYkQsWUFBTSxDQUFDRyxJQUFQLENBQWEsTUFBS3JCLElBQUssSUFBR21CLFNBQVUsZUFBY0MsV0FBWSxTQUE5RDtBQUNELEtBRkQsTUFFTztBQUNMRixZQUFNLENBQUNHLElBQVAsQ0FBYSxNQUFLckIsSUFBSyxJQUFHVSxRQUFRLENBQUNWLElBQUQsQ0FBTyxpQkFBekM7QUFDRDtBQUNGLEdBVEQ7QUFXQSxRQUFNc0IsU0FBUyxHQUFHWCxXQUFXLEdBQUksUUFBT0EsV0FBWSxJQUF2QixHQUE2QixFQUExRDtBQUNBWSxTQUFPLENBQUNDLElBQVIsQ0FBYyxrQ0FBaUNGLFNBQVU7RUFDekRKLE1BQU0sQ0FBQ08sSUFBUCxDQUFZLElBQVosQ0FBa0I7Ozs7Q0FEbEI7QUFNRCxDQXBDTSxDIiwiZmlsZSI6Ii9wYWNrYWdlcy90bWVhc2RheV9jaGVjay1ucG0tdmVyc2lvbnMuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgc2VtdmVyIGZyb20gJ3NlbXZlcic7XG5cbi8vIFJldHVybnM6XG4vLyAgIC0gdHJ1ZSAgICAgIGlmIGEgdmVyc2lvbiBvZiB0aGUgcGFja2FnZSBpbiB0aGUgcmFuZ2UgaXMgaW5zdGFsbGVkXG4vLyAgIC0gZmFsc2UgICAgIGlmIG5vIHZlcnNpb24gaXMgaW5zdGFsbGVkXG4vLyAgIC0gdmVyc2lvbiMgIGlmIGluY29tcGF0aWJsZSB2ZXJzaW9uIGlzIGluc3RhbGxlZFxuY29uc3QgY29tcGF0aWJsZVZlcnNpb25Jc0luc3RhbGxlZCA9IChuYW1lLCByYW5nZSkgPT4ge1xuICB0cnkge1xuICAgIGNvbnN0IGluc3RhbGxlZFZlcnNpb24gPSByZXF1aXJlKGAke25hbWV9L3BhY2thZ2UuanNvbmApLnZlcnNpb247XG4gICAgaWYgKHNlbXZlci5zYXRpc2ZpZXMoaW5zdGFsbGVkVmVyc2lvbiwgcmFuZ2UpKSB7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIGluc3RhbGxlZFZlcnNpb247XG4gICAgfVxuICB9IGNhdGNoIChlKSB7XG4gICAgLy8gWFhYIGFkZCBzb21ldGhpbmcgdG8gdGhlIHRvb2wgdG8gbWFrZSB0aGlzIG1vcmUgcmVsaWFibGVcbiAgICBjb25zdCBtZXNzYWdlID0gZS50b1N0cmluZygpO1xuICAgIC8vIE9uZSBtZXNzYWdlIGNvbWVzIG91dCBvZiB0aGUgaW5zdGFsbCBucG0gcGFja2FnZSB0aGUgb3RoZXIgZnJvbSBucG0gZGlyZWN0bHlcbiAgICBpZiAobWVzc2FnZS5tYXRjaChcIkNhbm5vdCBmaW5kIG1vZHVsZVwiKSB8fCBtZXNzYWdlLm1hdGNoKFwiQ2FuJ3QgZmluZCBucG0gbW9kdWxlXCIpKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRocm93IGU7XG4gICAgfVxuICB9XG59O1xuXG5leHBvcnQgY29uc3QgY2hlY2tOcG1WZXJzaW9ucyA9IChwYWNrYWdlcywgcGFja2FnZU5hbWUpID0+IHtcbiAgY29uc3QgZmFpbHVyZXMgPSB7fTtcblxuICBPYmplY3Qua2V5cyhwYWNrYWdlcykuZm9yRWFjaCgobmFtZSkgPT4ge1xuICAgIGNvbnN0IHJhbmdlID0gcGFja2FnZXNbbmFtZV07XG4gICAgY29uc3QgZmFpbHVyZSA9IGNvbXBhdGlibGVWZXJzaW9uSXNJbnN0YWxsZWQobmFtZSwgcmFuZ2UpO1xuXG4gICAgaWYgKGZhaWx1cmUgIT09IHRydWUpIHtcbiAgICAgIGZhaWx1cmVzW25hbWVdID0gZmFpbHVyZTtcbiAgICB9XG4gIH0pO1xuXG4gIGlmIChPYmplY3Qua2V5cyhmYWlsdXJlcykubGVuZ3RoID09PSAwKSB7XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cblxuICBjb25zdCBlcnJvcnMgPSBbXTtcblxuICBPYmplY3Qua2V5cyhmYWlsdXJlcykuZm9yRWFjaCgobmFtZSkgPT4ge1xuICAgIGNvbnN0IGluc3RhbGxlZCA9IGZhaWx1cmVzW25hbWVdO1xuICAgIGNvbnN0IHJlcXVpcmVtZW50ID0gYCR7bmFtZX1AJHtwYWNrYWdlc1tuYW1lXX1gO1xuXG4gICAgaWYgKGluc3RhbGxlZCkge1xuICAgICAgZXJyb3JzLnB1c2goYCAtICR7bmFtZX1AJHtpbnN0YWxsZWR9IGluc3RhbGxlZCwgJHtyZXF1aXJlbWVudH0gbmVlZGVkYCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGVycm9ycy5wdXNoKGAgLSAke25hbWV9QCR7cGFja2FnZXNbbmFtZV19IG5vdCBpbnN0YWxsZWQuYCk7XG4gICAgfVxuICB9KTtcblxuICBjb25zdCBxdWFsaWZpZXIgPSBwYWNrYWdlTmFtZSA/IGAoZm9yICR7cGFja2FnZU5hbWV9KSBgIDogJyc7XG4gIGNvbnNvbGUud2FybihgV0FSTklORzogbnBtIHBlZXIgcmVxdWlyZW1lbnRzICR7cXVhbGlmaWVyfW5vdCBpbnN0YWxsZWQ6XG4ke2Vycm9ycy5qb2luKCdcXG4nKX1cblxuUmVhZCBtb3JlIGFib3V0IGluc3RhbGxpbmcgbnBtIHBlZXIgZGVwZW5kZW5jaWVzOlxuICBodHRwOi8vZ3VpZGUubWV0ZW9yLmNvbS91c2luZy1wYWNrYWdlcy5odG1sI3BlZXItbnBtLWRlcGVuZGVuY2llc1xuYCk7XG59O1xuIl19
