(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var global = Package.meteor.global;
var meteorEnv = Package.meteor.meteorEnv;
var ECMAScript = Package.ecmascript.ECMAScript;
var _ = Package.underscore._;
var meteorInstall = Package.modules.meteorInstall;
var Promise = Package.promise.Promise;

/* Package-scope variables */
var WebAppHashing;

var require = meteorInstall({"node_modules":{"meteor":{"webapp-hashing":{"webapp-hashing.js":function module(require){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                         //
// packages/webapp-hashing/webapp-hashing.js                                                               //
//                                                                                                         //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                           //
var crypto = Npm.require("crypto");

WebAppHashing = {}; // Calculate a hash of all the client resources downloaded by the
// browser, including the application HTML, runtime config, code, and
// static files.
//
// This hash *must* change if any resources seen by the browser
// change, and ideally *doesn't* change for any server-only changes
// (but the second is a performance enhancement, not a hard
// requirement).

WebAppHashing.calculateClientHash = function (manifest, includeFilter, runtimeConfigOverride) {
  var hash = crypto.createHash('sha1'); // Omit the old hashed client values in the new hash. These may be
  // modified in the new boilerplate.

  var runtimeCfg = _.omit(__meteor_runtime_config__, ['autoupdateVersion', 'autoupdateVersionRefreshable', 'autoupdateVersionCordova']);

  if (runtimeConfigOverride) {
    runtimeCfg = runtimeConfigOverride;
  }

  hash.update(JSON.stringify(runtimeCfg, 'utf8'));

  _.each(manifest, function (resource) {
    if ((!includeFilter || includeFilter(resource.type)) && (resource.where === 'client' || resource.where === 'internal')) {
      hash.update(resource.path);
      hash.update(resource.hash);
    }
  });

  return hash.digest('hex');
};

WebAppHashing.calculateCordovaCompatibilityHash = function (platformVersion, pluginVersions) {
  const hash = crypto.createHash('sha1');
  hash.update(platformVersion); // Sort plugins first so iteration order doesn't affect the hash

  const plugins = Object.keys(pluginVersions).sort();

  for (let plugin of plugins) {
    const version = pluginVersions[plugin];
    hash.update(plugin);
    hash.update(version);
  }

  return hash.digest('hex');
};
/////////////////////////////////////////////////////////////////////////////////////////////////////////////

}}}}},{
  "extensions": [
    ".js",
    ".json"
  ]
});

require("/node_modules/meteor/webapp-hashing/webapp-hashing.js");

/* Exports */
Package._define("webapp-hashing", {
  WebAppHashing: WebAppHashing
});

})();

//# sourceURL=meteor://💻app/packages/webapp-hashing.js
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvd2ViYXBwLWhhc2hpbmcvd2ViYXBwLWhhc2hpbmcuanMiXSwibmFtZXMiOlsiY3J5cHRvIiwiTnBtIiwicmVxdWlyZSIsIldlYkFwcEhhc2hpbmciLCJjYWxjdWxhdGVDbGllbnRIYXNoIiwibWFuaWZlc3QiLCJpbmNsdWRlRmlsdGVyIiwicnVudGltZUNvbmZpZ092ZXJyaWRlIiwiaGFzaCIsImNyZWF0ZUhhc2giLCJydW50aW1lQ2ZnIiwiXyIsIm9taXQiLCJfX21ldGVvcl9ydW50aW1lX2NvbmZpZ19fIiwidXBkYXRlIiwiSlNPTiIsInN0cmluZ2lmeSIsImVhY2giLCJyZXNvdXJjZSIsInR5cGUiLCJ3aGVyZSIsInBhdGgiLCJkaWdlc3QiLCJjYWxjdWxhdGVDb3Jkb3ZhQ29tcGF0aWJpbGl0eUhhc2giLCJwbGF0Zm9ybVZlcnNpb24iLCJwbHVnaW5WZXJzaW9ucyIsInBsdWdpbnMiLCJPYmplY3QiLCJrZXlzIiwic29ydCIsInBsdWdpbiIsInZlcnNpb24iXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSxJQUFJQSxNQUFNLEdBQUdDLEdBQUcsQ0FBQ0MsT0FBSixDQUFZLFFBQVosQ0FBYjs7QUFFQUMsYUFBYSxHQUFHLEVBQWhCLEMsQ0FFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBQSxhQUFhLENBQUNDLG1CQUFkLEdBQ0UsVUFBVUMsUUFBVixFQUFvQkMsYUFBcEIsRUFBbUNDLHFCQUFuQyxFQUEwRDtBQUMxRCxNQUFJQyxJQUFJLEdBQUdSLE1BQU0sQ0FBQ1MsVUFBUCxDQUFrQixNQUFsQixDQUFYLENBRDBELENBRzFEO0FBQ0E7O0FBQ0EsTUFBSUMsVUFBVSxHQUFHQyxDQUFDLENBQUNDLElBQUYsQ0FBT0MseUJBQVAsRUFDZixDQUFDLG1CQUFELEVBQXNCLDhCQUF0QixFQUNDLDBCQURELENBRGUsQ0FBakI7O0FBSUEsTUFBSU4scUJBQUosRUFBMkI7QUFDekJHLGNBQVUsR0FBR0gscUJBQWI7QUFDRDs7QUFFREMsTUFBSSxDQUFDTSxNQUFMLENBQVlDLElBQUksQ0FBQ0MsU0FBTCxDQUFlTixVQUFmLEVBQTJCLE1BQTNCLENBQVo7O0FBRUFDLEdBQUMsQ0FBQ00sSUFBRixDQUFPWixRQUFQLEVBQWlCLFVBQVVhLFFBQVYsRUFBb0I7QUFDakMsUUFBSSxDQUFDLENBQUVaLGFBQUYsSUFBbUJBLGFBQWEsQ0FBQ1ksUUFBUSxDQUFDQyxJQUFWLENBQWpDLE1BQ0NELFFBQVEsQ0FBQ0UsS0FBVCxLQUFtQixRQUFuQixJQUErQkYsUUFBUSxDQUFDRSxLQUFULEtBQW1CLFVBRG5ELENBQUosRUFDb0U7QUFDcEVaLFVBQUksQ0FBQ00sTUFBTCxDQUFZSSxRQUFRLENBQUNHLElBQXJCO0FBQ0FiLFVBQUksQ0FBQ00sTUFBTCxDQUFZSSxRQUFRLENBQUNWLElBQXJCO0FBQ0Q7QUFDRixHQU5EOztBQU9BLFNBQU9BLElBQUksQ0FBQ2MsTUFBTCxDQUFZLEtBQVosQ0FBUDtBQUNELENBeEJEOztBQTBCQW5CLGFBQWEsQ0FBQ29CLGlDQUFkLEdBQ0UsVUFBU0MsZUFBVCxFQUEwQkMsY0FBMUIsRUFBMEM7QUFDMUMsUUFBTWpCLElBQUksR0FBR1IsTUFBTSxDQUFDUyxVQUFQLENBQWtCLE1BQWxCLENBQWI7QUFFQUQsTUFBSSxDQUFDTSxNQUFMLENBQVlVLGVBQVosRUFIMEMsQ0FLMUM7O0FBQ0EsUUFBTUUsT0FBTyxHQUFHQyxNQUFNLENBQUNDLElBQVAsQ0FBWUgsY0FBWixFQUE0QkksSUFBNUIsRUFBaEI7O0FBQ0EsT0FBSyxJQUFJQyxNQUFULElBQW1CSixPQUFuQixFQUE0QjtBQUMxQixVQUFNSyxPQUFPLEdBQUdOLGNBQWMsQ0FBQ0ssTUFBRCxDQUE5QjtBQUNBdEIsUUFBSSxDQUFDTSxNQUFMLENBQVlnQixNQUFaO0FBQ0F0QixRQUFJLENBQUNNLE1BQUwsQ0FBWWlCLE9BQVo7QUFDRDs7QUFFRCxTQUFPdkIsSUFBSSxDQUFDYyxNQUFMLENBQVksS0FBWixDQUFQO0FBQ0QsQ0FmRCxDIiwiZmlsZSI6Ii9wYWNrYWdlcy93ZWJhcHAtaGFzaGluZy5qcyIsInNvdXJjZXNDb250ZW50IjpbInZhciBjcnlwdG8gPSBOcG0ucmVxdWlyZShcImNyeXB0b1wiKTtcblxuV2ViQXBwSGFzaGluZyA9IHt9O1xuXG4vLyBDYWxjdWxhdGUgYSBoYXNoIG9mIGFsbCB0aGUgY2xpZW50IHJlc291cmNlcyBkb3dubG9hZGVkIGJ5IHRoZVxuLy8gYnJvd3NlciwgaW5jbHVkaW5nIHRoZSBhcHBsaWNhdGlvbiBIVE1MLCBydW50aW1lIGNvbmZpZywgY29kZSwgYW5kXG4vLyBzdGF0aWMgZmlsZXMuXG4vL1xuLy8gVGhpcyBoYXNoICptdXN0KiBjaGFuZ2UgaWYgYW55IHJlc291cmNlcyBzZWVuIGJ5IHRoZSBicm93c2VyXG4vLyBjaGFuZ2UsIGFuZCBpZGVhbGx5ICpkb2Vzbid0KiBjaGFuZ2UgZm9yIGFueSBzZXJ2ZXItb25seSBjaGFuZ2VzXG4vLyAoYnV0IHRoZSBzZWNvbmQgaXMgYSBwZXJmb3JtYW5jZSBlbmhhbmNlbWVudCwgbm90IGEgaGFyZFxuLy8gcmVxdWlyZW1lbnQpLlxuXG5XZWJBcHBIYXNoaW5nLmNhbGN1bGF0ZUNsaWVudEhhc2ggPVxuICBmdW5jdGlvbiAobWFuaWZlc3QsIGluY2x1ZGVGaWx0ZXIsIHJ1bnRpbWVDb25maWdPdmVycmlkZSkge1xuICB2YXIgaGFzaCA9IGNyeXB0by5jcmVhdGVIYXNoKCdzaGExJyk7XG5cbiAgLy8gT21pdCB0aGUgb2xkIGhhc2hlZCBjbGllbnQgdmFsdWVzIGluIHRoZSBuZXcgaGFzaC4gVGhlc2UgbWF5IGJlXG4gIC8vIG1vZGlmaWVkIGluIHRoZSBuZXcgYm9pbGVycGxhdGUuXG4gIHZhciBydW50aW1lQ2ZnID0gXy5vbWl0KF9fbWV0ZW9yX3J1bnRpbWVfY29uZmlnX18sXG4gICAgWydhdXRvdXBkYXRlVmVyc2lvbicsICdhdXRvdXBkYXRlVmVyc2lvblJlZnJlc2hhYmxlJyxcbiAgICAgJ2F1dG91cGRhdGVWZXJzaW9uQ29yZG92YSddKTtcblxuICBpZiAocnVudGltZUNvbmZpZ092ZXJyaWRlKSB7XG4gICAgcnVudGltZUNmZyA9IHJ1bnRpbWVDb25maWdPdmVycmlkZTtcbiAgfVxuXG4gIGhhc2gudXBkYXRlKEpTT04uc3RyaW5naWZ5KHJ1bnRpbWVDZmcsICd1dGY4JykpO1xuXG4gIF8uZWFjaChtYW5pZmVzdCwgZnVuY3Rpb24gKHJlc291cmNlKSB7XG4gICAgICBpZiAoKCEgaW5jbHVkZUZpbHRlciB8fCBpbmNsdWRlRmlsdGVyKHJlc291cmNlLnR5cGUpKSAmJlxuICAgICAgICAgIChyZXNvdXJjZS53aGVyZSA9PT0gJ2NsaWVudCcgfHwgcmVzb3VyY2Uud2hlcmUgPT09ICdpbnRlcm5hbCcpKSB7XG4gICAgICBoYXNoLnVwZGF0ZShyZXNvdXJjZS5wYXRoKTtcbiAgICAgIGhhc2gudXBkYXRlKHJlc291cmNlLmhhc2gpO1xuICAgIH1cbiAgfSk7XG4gIHJldHVybiBoYXNoLmRpZ2VzdCgnaGV4Jyk7XG59O1xuXG5XZWJBcHBIYXNoaW5nLmNhbGN1bGF0ZUNvcmRvdmFDb21wYXRpYmlsaXR5SGFzaCA9XG4gIGZ1bmN0aW9uKHBsYXRmb3JtVmVyc2lvbiwgcGx1Z2luVmVyc2lvbnMpIHtcbiAgY29uc3QgaGFzaCA9IGNyeXB0by5jcmVhdGVIYXNoKCdzaGExJyk7XG5cbiAgaGFzaC51cGRhdGUocGxhdGZvcm1WZXJzaW9uKTtcblxuICAvLyBTb3J0IHBsdWdpbnMgZmlyc3Qgc28gaXRlcmF0aW9uIG9yZGVyIGRvZXNuJ3QgYWZmZWN0IHRoZSBoYXNoXG4gIGNvbnN0IHBsdWdpbnMgPSBPYmplY3Qua2V5cyhwbHVnaW5WZXJzaW9ucykuc29ydCgpO1xuICBmb3IgKGxldCBwbHVnaW4gb2YgcGx1Z2lucykge1xuICAgIGNvbnN0IHZlcnNpb24gPSBwbHVnaW5WZXJzaW9uc1twbHVnaW5dO1xuICAgIGhhc2gudXBkYXRlKHBsdWdpbik7XG4gICAgaGFzaC51cGRhdGUodmVyc2lvbik7XG4gIH1cblxuICByZXR1cm4gaGFzaC5kaWdlc3QoJ2hleCcpO1xufTtcbiJdfQ==
