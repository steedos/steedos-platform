var assert = require("assert");
var fs = require("fs");
var path = require("path");
var _ = require('underscore');
var files = require('./mini-files.js');
var serverJson = require("./server-json.js");
var topLevelIdPattern = /^[^./]/;

function statOrNull(path) {
  try {
    return fs.statSync(path);
  } catch (e) {
    return null;
  }
}

function findAppDirHelper(absOSPath) {
  if (fs.statSync(absOSPath).isDirectory() &&
      statOrNull(path.join(absOSPath, ".meteor"))) {
    return absOSPath;
  }

  var parentDir = path.dirname(absOSPath);
  if (parentDir !== absOSPath) {
    return findAppDirHelper(parentDir);
  }

  throw new Error("Cannot find application root directory");
}

function findAppDir(absPath) {
  return files.convertToPosixPath(
    findAppDirHelper(files.convertToOSPath(absPath)));
}

// Map from virtual module identifiers for node_modules directories (like
// "/node_modules/meteor/blaze/node_modules") to the absolute paths of the
// read node_modules directories on disk. The npmRequire function below
// needs to look up absolute paths using virtual identifiers as input.
var nodeModulesRegistry = Object.create(null);

_.each(serverJson.load, function (fileInfo) {
  if (fileInfo.node_modules) {
    var match = /^(packages|app)\/(\S+)?\.js/.exec(fileInfo.path);
    if (match) {
      if (match[1] === "packages") {
        registerNodeModules(match[2], fileInfo.node_modules);
      } else if (match[1] === "app") {
        registerNodeModules(null, fileInfo.node_modules);
      }
    }
  }
});

function registerNodeModules(name, node_modules) {
  if (typeof node_modules === "string") {
    addByPath(node_modules);
  } else {
    Object.keys(node_modules).forEach(addByPath);
  }

  function addByPath(node_modules) {
    assert.strictEqual(typeof node_modules, "string");

    var parts = node_modules.split(files.pathSep);
    if (parts[0] === "") parts.shift();

    if (files.pathIsAbsolute(node_modules)) {
      if (! name) {
        var appDir = findAppDir(node_modules);
        var relPathWithinApp = files.pathRelative(appDir, node_modules);
        addByParts(relPathWithinApp.split(files.pathSep), node_modules);
        return;
      }

      parts.forEach(function (part, i) {
        if (part === "npm") {
          addByParts(parts.slice(i + 1), node_modules);

        } else if (part === ".npm") {
          if (name) {
            parts.unshift("node_modules", "meteor", name);
          }

          if (parts[i + 1] === "package") {
            addByParts(parts.slice(i + 2), node_modules);

          } else if (parts[i + 1] === "plugin") {
            assert.strictEqual(parts[i + 2], name);
            addByParts(parts.slice(i + 3), node_modules);
          }
        }
      });

    } else if (parts[0] === "npm") {
      var absPath = files.pathResolve(__dirname, parts.join(files.pathSep));
      addByParts(parts.slice(1), absPath);

    } else {
      throw new Error("unknown node_modules path: " + node_modules);
    }
  }

  function addByParts(parts, absPath) {
    assert.ok(parts.length > 0);
    assert.notEqual(parts[0], "");
    assert.notEqual(parts[0], "..");

    // Ensure a leading / character.
    if (parts[0].length > 0) {
      parts.unshift("");
    }

    nodeModulesRegistry[parts.join("/")] = absPath;
  }
}

function getRelID(id) {
  // assert.strictEqual(id.charAt(0), "/");
  // return "./npm" + id.replace(/:/g, "_");
  // move npm node modules to root
  return id.replace(/:/g, "_");
}

// Sort the keys in reverse alphabetical order so that longer paths will
// come before their prefixes.
var sortedNodeModulesPaths =
  Object.keys(nodeModulesRegistry).sort(function (a, b) {
    if (a < b) return 1;
    if (b < a) return -1;
    return 0;
  });

function npmRequire(id) {
  return require(resolve(id));
}

var resolveCache = Object.create(null);

function resolve(id) {
  if (__steedos_bootstrap__.verbose)
    console.log("npm-require.js resolve " + id);

  var res = resolveCache[id];

  if (typeof res === "string") {
    return res;
  }

  if (res === null) {
    var idParts = id.split("/");
    var meteorAddTip = "";
    // If it looks like `meteor/xxx`, the user may forgot to add the 
    // package before importing it.
    if (idParts.length === 2 &&
        idParts[0] === "meteor") {
          meteorAddTip = ". Try `meteor add " + idParts[1] + "` " +
          "as it looks like you tried to import it without adding " +
          "to the project.";
    }
    res = new Error("Cannot find module '" + id + "'" + meteorAddTip);
    res.code = "MODULE_NOT_FOUND";
    throw res;
  }

  resolveCache[id] =
    resolveInLocalBuild(id) ||
    resolveInProjectNodeModules(id) ||
    resolveInServerNodeModules(id) ||
    resolveInDevBundle(id) ||
    null;

  return resolve(id);
}

// resolve in steedos server bundled node_modules
function resolveInLocalBuild(id) {
  id = getRelID(id)
  id = path.join(__steedos_bootstrap__.serverDir, "npm", id);
  if (__steedos_bootstrap__.verbose)
    console.log("npm-require.js resolveInLocalBuild " + id);
  return tryResolve(id);
}

function resolveInServerNodeModules(id) {
  var ids = id.split("node_modules/")
  if (ids.length>1) {
    id = ids[ids.length-1];
  }
  var absId;
  absId = path.join(__steedos_bootstrap__.serverDir, "..", "..", "..", "node_modules", id);
  if (__steedos_bootstrap__.verbose)
    console.log("npm-require.js resolveInServerNodeModules " + absId);

  return absId && tryResolve(files.convertToOSPath(absId));
}

// resolve in project node_modules
function resolveInProjectNodeModules(id) {
  // move meteor package node modules to root
  // FOR EXAMPLE
  // src: /node_modules/meteor/{package_name}/node_modules/{module_name}/
  // dst: {module_name}/
  var ids = id.split("node_modules/")
  if (ids.length>1) {
    id = ids[ids.length-1];
  }
  var absId;
  absId = path.join(__steedos_bootstrap__.projectDir, "node_modules", id);
  if (__steedos_bootstrap__.verbose)
    console.log("npm-require.js resolveInProjectNodeModules " + absId);

  // sortedNodeModulesPaths.some(function (prefix) {
  //   var relId = files.pathRelative(
  //     files.pathJoin(".", prefix),
  //     files.pathJoin(".", id)
  //   );

  //   if (relId.slice(0, 2) !== "..") {
  //     return absId =
  //       files.pathJoin(nodeModulesRegistry[prefix], relId);
  //   }
  // });

  return absId && tryResolve(files.convertToOSPath(absId));
}

function resolveInDevBundle(id) {
  // Fall back to dev_bundle/lib/node_modules and built-in modules.
  return topLevelIdPattern.test(id) && tryResolve(id);
}

function tryResolve(id) {
  try {
    return require.resolve(id);
  } catch (e) {
    return null;
  }
}

exports.require = npmRequire;
exports.resolve = npmRequire.resolve = resolve;
