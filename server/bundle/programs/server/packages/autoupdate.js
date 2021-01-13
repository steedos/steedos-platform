(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var global = Package.meteor.global;
var meteorEnv = Package.meteor.meteorEnv;
var WebApp = Package.webapp.WebApp;
var WebAppInternals = Package.webapp.WebAppInternals;
var main = Package.webapp.main;
var check = Package.check.check;
var Match = Package.check.Match;
var ECMAScript = Package.ecmascript.ECMAScript;
var DDP = Package['ddp-client'].DDP;
var DDPServer = Package['ddp-server'].DDPServer;
var MongoInternals = Package.mongo.MongoInternals;
var Mongo = Package.mongo.Mongo;
var meteorInstall = Package.modules.meteorInstall;
var Promise = Package.promise.Promise;

/* Package-scope variables */
var Autoupdate;

var require = meteorInstall({"node_modules":{"meteor":{"autoupdate":{"autoupdate_server.js":function module(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/autoupdate/autoupdate_server.js                                                                            //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
let _objectSpread;

module.link("@babel/runtime/helpers/objectSpread2", {
  default(v) {
    _objectSpread = v;
  }

}, 0);
module.export({
  Autoupdate: () => Autoupdate
});
let onMessage;
module.link("meteor/inter-process-messaging", {
  onMessage(v) {
    onMessage = v;
  }

}, 0);

// Publish the current client versions for each client architecture
// (web.browser, web.browser.legacy, web.cordova). When a client observes
// a change in the versions associated with its client architecture,
// it will refresh itself, either by swapping out CSS assets or by
// reloading the page.
//
// There are three versions for any given client architecture: `version`,
// `versionRefreshable`, and `versionNonRefreshable`. The refreshable
// version is a hash of just the client resources that are refreshable,
// such as CSS, while the non-refreshable version is a hash of the rest of
// the client assets, excluding the refreshable ones: HTML, JS, and static
// files in the `public` directory. The `version` version is a combined
// hash of everything.
//
// If the environment variable `AUTOUPDATE_VERSION` is set, it will be
// used in place of all client versions. You can use this variable to
// control when the client reloads. For example, if you want to force a
// reload only after major changes, use a custom AUTOUPDATE_VERSION and
// change it only when something worth pushing to clients happens.
//
// The server publishes a `meteor_autoupdate_clientVersions` collection.
// The ID of each document is the client architecture, and the fields of
// the document are the versions described above.
var Future = Npm.require("fibers/future");

const Autoupdate = __meteor_runtime_config__.autoupdate = {
  // Map from client architectures (web.browser, web.browser.legacy,
  // web.cordova) to version fields { version, versionRefreshable,
  // versionNonRefreshable, refreshable } that will be stored in
  // ClientVersions documents (whose IDs are client architectures). This
  // data gets serialized into the boilerplate because it's stored in
  // __meteor_runtime_config__.autoupdate.versions.
  versions: {}
};
// The collection of acceptable client versions.
const ClientVersions = new Mongo.Collection("meteor_autoupdate_clientVersions", {
  connection: null
}); // The client hash includes __meteor_runtime_config__, so wait until
// all packages have loaded and have had a chance to populate the
// runtime config before using the client hash as our default auto
// update version id.
// Note: Tests allow people to override Autoupdate.autoupdateVersion before
// startup.

Autoupdate.autoupdateVersion = null;
Autoupdate.autoupdateVersionRefreshable = null;
Autoupdate.autoupdateVersionCordova = null;
Autoupdate.appId = __meteor_runtime_config__.appId = process.env.APP_ID;
var syncQueue = new Meteor._SynchronousQueue();

function updateVersions(shouldReloadClientProgram) {
  // Step 1: load the current client program on the server
  if (shouldReloadClientProgram) {
    WebAppInternals.reloadClientPrograms();
  }

  const {
    // If the AUTOUPDATE_VERSION environment variable is defined, it takes
    // precedence, but Autoupdate.autoupdateVersion is still supported as
    // a fallback. In most cases neither of these values will be defined.
    AUTOUPDATE_VERSION = Autoupdate.autoupdateVersion
  } = process.env; // Step 2: update __meteor_runtime_config__.autoupdate.versions.

  const clientArchs = Object.keys(WebApp.clientPrograms);
  clientArchs.forEach(arch => {
    Autoupdate.versions[arch] = {
      version: AUTOUPDATE_VERSION || WebApp.calculateClientHash(arch),
      versionRefreshable: AUTOUPDATE_VERSION || WebApp.calculateClientHashRefreshable(arch),
      versionNonRefreshable: AUTOUPDATE_VERSION || WebApp.calculateClientHashNonRefreshable(arch)
    };
  }); // Step 3: form the new client boilerplate which contains the updated
  // assets and __meteor_runtime_config__.

  if (shouldReloadClientProgram) {
    WebAppInternals.generateBoilerplate();
  } // Step 4: update the ClientVersions collection.
  // We use `onListening` here because we need to use
  // `WebApp.getRefreshableAssets`, which is only set after
  // `WebApp.generateBoilerplate` is called by `main` in webapp.


  WebApp.onListening(() => {
    clientArchs.forEach(arch => {
      const payload = _objectSpread({}, Autoupdate.versions[arch], {
        assets: WebApp.getRefreshableAssets(arch)
      });

      if (!ClientVersions.findOne({
        _id: arch
      })) {
        ClientVersions.insert(_objectSpread({
          _id: arch
        }, payload));
      } else {
        ClientVersions.update(arch, {
          $set: payload
        });
      }
    });
  });
}

Meteor.publish("meteor_autoupdate_clientVersions", function (appId) {
  // `null` happens when a client doesn't have an appId and passes
  // `undefined` to `Meteor.subscribe`. `undefined` is translated to
  // `null` as JSON doesn't have `undefined.
  check(appId, Match.OneOf(String, undefined, null)); // // Don't notify clients using wrong appId such as mobile apps built with a
  // // different server but pointing at the same local url
  // if (Autoupdate.appId && appId && Autoupdate.appId !== appId)
  //   return [];

  return ClientVersions.find();
}, {
  is_auto: true
});
Meteor.startup(function () {
  updateVersions(false); // Force any connected clients that are still looking for these older
  // document IDs to reload.

  ["version", "version-refreshable", "version-cordova"].forEach(_id => {
    ClientVersions.upsert(_id, {
      $set: {
        version: "outdated"
      }
    });
  });
});
var fut = new Future(); // We only want 'refresh' to trigger 'updateVersions' AFTER onListen,
// so we add a queued task that waits for onListen before 'refresh' can queue
// tasks. Note that the `onListening` callbacks do not fire until after
// Meteor.startup, so there is no concern that the 'updateVersions' calls from
// 'refresh' will overlap with the `updateVersions` call from Meteor.startup.

syncQueue.queueTask(function () {
  fut.wait();
});
WebApp.onListening(function () {
  fut.return();
});

function enqueueVersionsRefresh() {
  syncQueue.queueTask(function () {
    updateVersions(true);
  });
} // Listen for messages pertaining to the client-refresh topic.


onMessage("client-refresh", enqueueVersionsRefresh); // Another way to tell the process to refresh: send SIGHUP signal

process.on('SIGHUP', Meteor.bindEnvironment(function () {
  enqueueVersionsRefresh();
}, "handling SIGHUP signal for refresh"));
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}}}}},{
  "extensions": [
    ".js",
    ".json"
  ]
});

var exports = require("/node_modules/meteor/autoupdate/autoupdate_server.js");

/* Exports */
Package._define("autoupdate", exports, {
  Autoupdate: Autoupdate
});

})();

//# sourceURL=meteor://💻app/packages/autoupdate.js
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvYXV0b3VwZGF0ZS9hdXRvdXBkYXRlX3NlcnZlci5qcyJdLCJuYW1lcyI6WyJfb2JqZWN0U3ByZWFkIiwibW9kdWxlIiwibGluayIsImRlZmF1bHQiLCJ2IiwiZXhwb3J0IiwiQXV0b3VwZGF0ZSIsIm9uTWVzc2FnZSIsIkZ1dHVyZSIsIk5wbSIsInJlcXVpcmUiLCJfX21ldGVvcl9ydW50aW1lX2NvbmZpZ19fIiwiYXV0b3VwZGF0ZSIsInZlcnNpb25zIiwiQ2xpZW50VmVyc2lvbnMiLCJNb25nbyIsIkNvbGxlY3Rpb24iLCJjb25uZWN0aW9uIiwiYXV0b3VwZGF0ZVZlcnNpb24iLCJhdXRvdXBkYXRlVmVyc2lvblJlZnJlc2hhYmxlIiwiYXV0b3VwZGF0ZVZlcnNpb25Db3Jkb3ZhIiwiYXBwSWQiLCJwcm9jZXNzIiwiZW52IiwiQVBQX0lEIiwic3luY1F1ZXVlIiwiTWV0ZW9yIiwiX1N5bmNocm9ub3VzUXVldWUiLCJ1cGRhdGVWZXJzaW9ucyIsInNob3VsZFJlbG9hZENsaWVudFByb2dyYW0iLCJXZWJBcHBJbnRlcm5hbHMiLCJyZWxvYWRDbGllbnRQcm9ncmFtcyIsIkFVVE9VUERBVEVfVkVSU0lPTiIsImNsaWVudEFyY2hzIiwiT2JqZWN0Iiwia2V5cyIsIldlYkFwcCIsImNsaWVudFByb2dyYW1zIiwiZm9yRWFjaCIsImFyY2giLCJ2ZXJzaW9uIiwiY2FsY3VsYXRlQ2xpZW50SGFzaCIsInZlcnNpb25SZWZyZXNoYWJsZSIsImNhbGN1bGF0ZUNsaWVudEhhc2hSZWZyZXNoYWJsZSIsInZlcnNpb25Ob25SZWZyZXNoYWJsZSIsImNhbGN1bGF0ZUNsaWVudEhhc2hOb25SZWZyZXNoYWJsZSIsImdlbmVyYXRlQm9pbGVycGxhdGUiLCJvbkxpc3RlbmluZyIsInBheWxvYWQiLCJhc3NldHMiLCJnZXRSZWZyZXNoYWJsZUFzc2V0cyIsImZpbmRPbmUiLCJfaWQiLCJpbnNlcnQiLCJ1cGRhdGUiLCIkc2V0IiwicHVibGlzaCIsImNoZWNrIiwiTWF0Y2giLCJPbmVPZiIsIlN0cmluZyIsInVuZGVmaW5lZCIsImZpbmQiLCJpc19hdXRvIiwic3RhcnR1cCIsInVwc2VydCIsImZ1dCIsInF1ZXVlVGFzayIsIndhaXQiLCJyZXR1cm4iLCJlbnF1ZXVlVmVyc2lvbnNSZWZyZXNoIiwib24iLCJiaW5kRW52aXJvbm1lbnQiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLElBQUlBLGFBQUo7O0FBQWtCQyxNQUFNLENBQUNDLElBQVAsQ0FBWSxzQ0FBWixFQUFtRDtBQUFDQyxTQUFPLENBQUNDLENBQUQsRUFBRztBQUFDSixpQkFBYSxHQUFDSSxDQUFkO0FBQWdCOztBQUE1QixDQUFuRCxFQUFpRixDQUFqRjtBQUFsQkgsTUFBTSxDQUFDSSxNQUFQLENBQWM7QUFBQ0MsWUFBVSxFQUFDLE1BQUlBO0FBQWhCLENBQWQ7QUFBMkMsSUFBSUMsU0FBSjtBQUFjTixNQUFNLENBQUNDLElBQVAsQ0FBWSxnQ0FBWixFQUE2QztBQUFDSyxXQUFTLENBQUNILENBQUQsRUFBRztBQUFDRyxhQUFTLEdBQUNILENBQVY7QUFBWTs7QUFBMUIsQ0FBN0MsRUFBeUUsQ0FBekU7O0FBQXpEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQSxJQUFJSSxNQUFNLEdBQUdDLEdBQUcsQ0FBQ0MsT0FBSixDQUFZLGVBQVosQ0FBYjs7QUFFTyxNQUFNSixVQUFVLEdBQUdLLHlCQUF5QixDQUFDQyxVQUExQixHQUF1QztBQUMvRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQUMsVUFBUSxFQUFFO0FBUHFELENBQTFEO0FBVVA7QUFDQSxNQUFNQyxjQUFjLEdBQ2xCLElBQUlDLEtBQUssQ0FBQ0MsVUFBVixDQUFxQixrQ0FBckIsRUFBeUQ7QUFDdkRD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RUFFQyxpQkFGRCxFQUdFVSxPQUhGLENBR1VjLEdBQUcsSUFBSTtBQUNmdEMsa0JBQWMsQ0FBQ21ELE1BQWYsQ0FBc0JiLEdBQXRCLEVBQTJCO0FBQ3pCRyxVQUFJLEVBQUU7QUFBRWYsZUFBTyxFQUFFO0FBQVg7QUFEbUIsS0FBM0I7QUFHRCxHQVBEO0FBUUQsQ0FiRDtBQWVBLElBQUkwQixHQUFHLEdBQUcsSUFBSTFELE1BQUosRUFBVixDLENBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQWlCLFNBQVMsQ0FBQzBDLFNBQVYsQ0FBb0IsWUFBWTtBQUM5QkQsS0FBRyxDQUFDRSxJQUFKO0FBQ0QsQ0FGRDtBQUlBaEMsTUFBTSxDQUFDVyxXQUFQLENBQW1CLFlBQVk7QUFDN0JtQixLQUFHLENBQUNHLE1BQUo7QUFDRCxDQUZEOztBQUlBLFNBQVNDLHNCQUFULEdBQWtDO0FBQ2hDN0MsV0FBUyxDQUFDMEMsU0FBVixDQUFvQixZQUFZO0FBQzlCdkMsa0JBQWMsQ0FBQyxJQUFELENBQWQ7QUFDRCxHQUZEO0FBR0QsQyxDQUVEOzs7QUFFQXJCLFNBQVMsQ0FBQyxnQkFBRCxFQUFtQitELHNCQUFuQixDQUFULEMsQ0FFQTs7QUFDQWhELE9BQU8sQ0FBQ2lELEVBQVIsQ0FBVyxRQUFYLEVBQXFCN0MsTUFBTSxDQUFDOEMsZUFBUCxDQUF1QixZQUFZO0FBQ3RERix3QkFBc0I7QUFDdkIsQ0FGb0IsRUFFbEIsb0NBRmtCLENBQXJCLEUiLCJmaWxlIjoiL3BhY2thZ2VzL2F1dG91cGRhdGUuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBQdWJsaXNoIHRoZSBjdXJyZW50IGNsaWVudCB2ZXJzaW9ucyBmb3IgZWFjaCBjbGllbnQgYXJjaGl0ZWN0dXJlXHJcbi8vICh3ZWIuYnJvd3Nlciwgd2ViLmJyb3dzZXIubGVnYWN5LCB3ZWIuY29yZG92YSkuIFdoZW4gYSBjbGllbnQgb2JzZXJ2ZXNcclxuLy8gYSBjaGFuZ2UgaW4gdGhlIHZlcnNpb25zIGFzc29jaWF0ZWQgd2l0aCBpdHMgY2xpZW50IGFyY2hpdGVjdHVyZSxcclxuLy8gaXQgd2lsbCByZWZyZXNoIGl0c2VsZiwgZWl0aGVyIGJ5IHN3YXBwaW5nIG91dCBDU1MgYXNzZXRzIG9yIGJ5XHJcbi8vIHJlbG9hZGluZyB0aGUgcGFnZS5cclxuLy9cclxuLy8gVGhlcmUgYXJlIHRocmVlIHZlcnNpb25zIGZvciBhbnkgZ2l2ZW4gY2xpZW50IGFyY2hpdGVjdHVyZTogYHZlcnNpb25gLFxyXG4vLyBgdmVyc2lvblJlZnJlc2hhYmxlYCwgYW5kIGB2ZXJzaW9uTm9uUmVmcmVzaGFibGVgLiBUaGUgcmVmcmVzaGFibGVcclxuLy8gdmVyc2lvbiBpcyBhIGhhc2ggb2YganVzdCB0aGUgY2xpZW50IHJlc291cmNlcyB0aGF0IGFyZSByZWZyZXNoYWJsZSxcclxuLy8gc3VjaCBhcyBDU1MsIHdoaWxlIHRoZSBub24tcmVmcmVzaGFibGUgdmVyc2lvbiBpcyBhIGhhc2ggb2YgdGhlIHJlc3Qgb2ZcclxuLy8gdGhlIGNsaWVudCBhc3NldHMsIGV4Y2x1ZGluZyB0aGUgcmVmcmVzaGFibGUgb25lczogSFRNTCwgSlMsIGFuZCBzdGF0aWNcclxuLy8gZmlsZXMgaW4gdGhlIGBwdWJsaWNgIGRpcmVjdG9yeS4gVGhlIGB2ZXJzaW9uYCB2ZXJzaW9uIGlzIGEgY29tYmluZWRcclxuLy8gaGFzaCBvZiBldmVyeXRoaW5nLlxyXG4vL1xyXG4vLyBJZiB0aGUgZW52aXJvbm1lbnQgdmFyaWFibGUgYEFVVE9VUERBVEVfVkVSU0lPTmAgaXMgc2V0LCBpdCB3aWxsIGJlXHJcbi8vIHVzZWQgaW4gcGxhY2Ugb2YgYWxsIGNsaWVudCB2ZXJzaW9ucy4gWW91IGNhbiB1c2UgdGhpcyB2YXJpYWJsZSB0b1xyXG4vLyBjb250cm9sIHdoZW4gdGhlIGNsaWVudCByZWxvYWRzLiBGb3IgZXhhbXBsZSwgaWYgeW91IHdhbnQgdG8gZm9yY2UgYVxyXG4vLyByZWxvYWQgb25seSBhZnRlciBtYWpvciBjaGFuZ2VzLCB1c2UgYSBjdXN0b20gQVVUT1VQREFURV9WRVJTSU9OIGFuZFxyXG4vLyBjaGFuZ2UgaXQgb25seSB3aGVuIHNvbWV0aGluZyB3b3J0aCBwdXNoaW5nIHRvIGNsaWVudHMgaGFwcGVucy5cclxuLy9cclxuLy8gVGhlIHNlcnZlciBwdWJsaXNoZXMgYSBgbWV0ZW9yX2F1dG91cGRhdGVfY2xpZW50VmVyc2lvbnNgIGNvbGxlY3Rpb24uXHJcbi8vIFRoZSBJRCBvZiBlYWNoIGRvY3VtZW50IGlzIHRoZSBjbGllbnQgYXJjaGl0ZWN0dXJlLCBhbmQgdGhlIGZpZWxkcyBvZlxyXG4vLyB0aGUgZG9jdW1lbnQgYXJlIHRoZSB2ZXJzaW9ucyBkZXNjcmliZWQgYWJvdmUuXHJcblxyXG52YXIgRnV0dXJlID0gTnBtLnJlcXVpcmUoXCJmaWJlcnMvZnV0dXJlXCIpO1xyXG5cclxuZXhwb3J0IGNvbnN0IEF1dG91cGRhdGUgPSBfX21ldGVvcl9ydW50aW1lX2NvbmZpZ19fLmF1dG91cGRhdGUgPSB7XHJcbiAgLy8gTWFwIGZyb20gY2xpZW50IGFyY2hpdGVjdHVyZXMgKHdlYi5icm93c2VyLCB3ZWIuYnJvd3Nlci5sZWdhY3ksXHJcbiAgLy8gd2ViLmNvcmRvdmEpIHRvIHZlcnNpb24gZmllbGRzIHsgdmVyc2lvbiwgdmVyc2lvblJlZnJlc2hhYmxlLFxyXG4gIC8vIHZlcnNpb25Ob25SZWZyZXNoYWJsZSwgcmVmcmVzaGFibGUgfSB0aGF0IHdpbGwgYmUgc3RvcmVkIGluXHJcbiAgLy8gQ2xpZW50VmVyc2lvbnMgZG9jdW1lbnRzICh3aG9zZSBJRHMgYXJlIGNsaWVudCBhcmNoaXRlY3R1cmVzKS4gVGhpc1xyXG4gIC8vIGRhdGEgZ2V0cyBzZXJpYWxpemVkIGludG8gdGhlIGJvaWxlcnBsYXRlIGJlY2F1c2UgaXQncyBzdG9yZWQgaW5cclxuICAvLyBfX21ldGVvcl9ydW50aW1lX2NvbmZpZ19fLmF1dG91cGRhdGUudmVyc2lvbnMuXHJcbiAgdmVyc2lvbnM6IHt9XHJcbn07XHJcblxyXG4vLyBUaGUgY29sbGVjdGlvbiBvZiBhY2NlcHRhYmxlIGNsaWVudCB2ZXJzaW9ucy5cclxuY29uc3QgQ2xpZW50VmVyc2lvbnMgPVxyXG4gIG5ldyBNb25nby5Db2xsZWN0aW9uKFwibWV0ZW9yX2F1dG91cGRhdGVfY2xpZW50VmVyc2lvbnNcIiwge1xyXG4gICAgY29ubmVjdGlvbjogbnVsbFxyXG4gIH0pO1xyXG5cclxuLy8gVGhlIGNsaWVudCBoYXNoIGluY2x1ZGVzIF9fbWV0ZW9yX3J1bnRpbWVfY29uZmlnX18sIHNvIHdhaXQgdW50aWxcclxuLy8gYWxsIHBhY2thZ2VzIGhhdmUgbG9hZGVkIGFuZCBoYXZlIGhhZCBhIGNoYW5jZSB0byBwb3B1bGF0ZSB0aGVcclxuLy8gcnVudGltZSBjb25maWcgYmVmb3JlIHVzaW5nIHRoZSBjbGllbnQgaGFzaCBhcyBvdXIgZGVmYXVsdCBhdXRvXHJcbi8vIHVwZGF0ZSB2ZXJzaW9uIGlkLlxyXG5cclxuLy8gTm90ZTogVGVzdHMgYWxsb3cgcGVvcGxlIHRvIG92ZXJyaWRlIEF1dG91cGRhdGUuYXV0b3VwZGF0ZVZlcnNpb24gYmVmb3JlXHJcbi8vIHN0YXJ0dXAuXHJcbkF1dG91cGRhdGUuYXV0b3VwZGF0ZVZlcnNpb24gPSBudWxsO1xyXG5BdXRvdXBkYXRlLmF1dG91cGRhdGVWZXJzaW9uUmVmcmVzaGFibGUgPSBudWxsO1xyXG5BdXRvdXBkYXRlLmF1dG91cGRhdGVWZXJzaW9uQ29yZG92YSA9IG51bGw7XHJcbkF1dG91cGRhdGUuYXBwSWQgPSBfX21ldGVvcl9ydW50aW1lX2NvbmZpZ19fLmFwcElkID0gcHJvY2Vzcy5lbnYuQVBQX0lEO1xyXG5cclxudmFyIHN5bmNRdWV1ZSA9IG5ldyBNZXRlb3IuX1N5bmNocm9ub3VzUXVldWUoKTtcclxuXHJcbmZ1bmN0aW9uIHVwZGF0ZVZlcnNpb25zKHNob3VsZFJlbG9hZENsaWVudFByb2dyYW0pIHtcclxuICAvLyBTdGVwIDE6IGxvYWQgdGhlIGN1cnJlbnQgY2xpZW50IHByb2dyYW0gb24gdGhlIHNlcnZlclxyXG4gIGlmIChzaG91bGRSZWxvYWRDbGllbnRQcm9ncmFtKSB7XHJcbiAgICBXZWJBcHBJbnRlcm5hbHMucmVsb2FkQ2xpZW50UHJvZ3JhbXMoKTtcclxuICB9XHJcblxyXG4gIGNvbnN0IHtcclxuICAgIC8vIElmIHRoZSBBVVRPVVBEQVRFX1ZFUlNJT04gZW52aXJvbm1lbnQgdmFyaWFibGUgaXMgZGVmaW5lZCwgaXQgdGFrZXNcclxuICAgIC8vIHByZWNlZGVuY2UsIGJ1dCBBdXRvdXBkYXRlLmF1dG91cGRhdGVWZXJzaW9uIGlzIHN0aWxsIHN1cHBvcnRlZCBhc1xyXG4gICAgLy8gYSBmYWxsYmFjay4gSW4gbW9zdCBjYXNlcyBuZWl0aGVyIG9mIHRoZXNlIHZhbHVlcyB3aWxsIGJlIGRlZmluZWQuXHJcbiAgICBBVVRPVVBEQVRFX1ZFUlNJT04gPSBBdXRvdXBkYXRlLmF1dG91cGRhdGVWZXJzaW9uXHJcbiAgfSA9IHByb2Nlc3MuZW52O1xyXG5cclxuICAvLyBTdGVwIDI6IHVwZGF0ZSBfX21ldGVvcl9ydW50aW1lX2NvbmZpZ19fLmF1dG91cGRhdGUudmVyc2lvbnMuXHJcbiAgY29uc3QgY2xpZW50QXJjaHMgPSBPYmplY3Qua2V5cyhXZWJBcHAuY2xpZW50UHJvZ3JhbXMpO1xyXG4gIGNsaWVudEFyY2hzLmZvckVhY2goYXJjaCA9PiB7XHJcbiAgICBBdXRvdXBkYXRlLnZlcnNpb25zW2FyY2hdID0ge1xyXG4gICAgICB2ZXJzaW9uOiBBVVRPVVBEQVRFX1ZFUlNJT04gfHxcclxuICAgICAgICBXZWJBcHAuY2FsY3VsYXRlQ2xpZW50SGFzaChhcmNoKSxcclxuICAgICAgdmVyc2lvblJlZnJlc2hhYmxlOiBBVVRPVVBEQVRFX1ZFUlNJT04gfHxcclxuICAgICAgICBXZWJBcHAuY2FsY3VsYXRlQ2xpZW50SGFzaFJlZnJlc2hhYmxlKGFyY2gpLFxyXG4gICAgICB2ZXJzaW9uTm9uUmVmcmVzaGFibGU6IEFVVE9VUERBVEVfVkVSU0lPTiB8fFxyXG4gICAgICAgIFdlYkFwcC5jYWxjdWxhdGVDbGllbnRIYXNoTm9uUmVmcmVzaGFibGUoYXJjaCksXHJcbiAgICB9O1xyXG4gIH0pO1xyXG5cclxuICAvLyBTdGVwIDM6IGZvcm0gdGhlIG5ldyBjbGllbnQgYm9pbGVycGxhdGUgd2hpY2ggY29udGFpbnMgdGhlIHVwZGF0ZWRcclxuICAvLyBhc3NldHMgYW5kIF9fbWV0ZW9yX3J1bnRpbWVfY29uZmlnX18uXHJcbiAgaWYgKHNob3VsZFJlbG9hZENsaWVudFByb2dyYW0pIHtcclxuICAgIFdlYkFwcEludGVybmFscy5nZW5lcmF0ZUJvaWxlcnBsYXRlKCk7XHJcbiAgfVxyXG5cclxuICAvLyBTdGVwIDQ6IHVwZGF0ZSB0aGUgQ2xpZW50VmVyc2lvbnMgY29sbGVjdGlvbi5cclxuICAvLyBXZSB1c2UgYG9uTGlzdGVuaW5nYCBoZXJlIGJlY2F1c2Ugd2UgbmVlZCB0byB1c2VcclxuICAvLyBgV2ViQXBwLmdldFJlZnJlc2hhYmxlQXNzZXRzYCwgd2hpY2ggaXMgb25seSBzZXQgYWZ0ZXJcclxuICAvLyBgV2ViQXBwLmdlbmVyYXRlQm9pbGVycGxhdGVgIGlzIGNhbGxlZCBieSBgbWFpbmAgaW4gd2ViYXBwLlxyXG4gIFdlYkFwcC5vbkxpc3RlbmluZygoKSA9PiB7XHJcbiAgICBjbGllbnRBcmNocy5mb3JFYWNoKGFyY2ggPT4ge1xyXG4gICAgICBjb25zdCBwYXlsb2FkID0ge1xyXG4gICAgICAgIC4uLkF1dG91cGRhdGUudmVyc2lvbnNbYXJjaF0sXHJcbiAgICAgICAgYXNzZXRzOiBXZWJBcHAuZ2V0UmVmcmVzaGFibGVBc3NldHMoYXJjaCksXHJcbiAgICAgIH07XHJcbiAgICAgIGlmICghIENsaWVudFZlcnNpb25zLmZpbmRPbmUoeyBfaWQ6IGFyY2ggfSkpIHtcclxuICAgICAgICBDbGllbnRWZXJzaW9ucy5pbnNlcnQoeyBfaWQ6IGFyY2gsIC4uLnBheWxvYWQgfSk7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgQ2xpZW50VmVyc2lvbnMudXBkYXRlKGFyY2gsIHsgJHNldDogcGF5bG9hZCB9KTtcclxuICAgICAgfVxyXG4gICAgfSk7XHJcbiAgfSk7XHJcbn1cclxuXHJcbk1ldGVvci5wdWJsaXNoKFxyXG4gIFwibWV0ZW9yX2F1dG91cGRhdGVfY2xpZW50VmVyc2lvbnNcIixcclxuICBmdW5jdGlvbiAoYXBwSWQpIHtcclxuICAgIC8vIGBudWxsYCBoYXBwZW5zIHdoZW4gYSBjbGllbnQgZG9lc24ndCBoYXZlIGFuIGFwcElkIGFuZCBwYXNzZXNcclxuICAgIC8vIGB1bmRlZmluZWRgIHRvIGBNZXRlb3Iuc3Vic2NyaWJlYC4gYHVuZGVmaW5lZGAgaXMgdHJhbnNsYXRlZCB0b1xyXG4gICAgLy8gYG51bGxgIGFzIEpTT04gZG9lc24ndCBoYXZlIGB1bmRlZmluZWQuXHJcbiAgICBjaGVjayhhcHBJZCwgTWF0Y2guT25lT2YoU3RyaW5nLCB1bmRlZmluZWQsIG51bGwpKTtcclxuXHJcbiAgICAvLyAvLyBEb24ndCBub3RpZnkgY2xpZW50cyB1c2luZyB3cm9uZyBhcHBJZCBzdWNoIGFzIG1vYmlsZSBhcHBzIGJ1aWx0IHdpdGggYVxyXG4gICAgLy8gLy8gZGlmZmVyZW50IHNlcnZlciBidXQgcG9pbnRpbmcgYXQgdGhlIHNhbWUgbG9jYWwgdXJsXHJcbiAgICAvLyBpZiAoQXV0b3VwZGF0ZS5hcHBJZCAmJiBhcHBJZCAmJiBBdXRvdXBkYXRlLmFwcElkICE9PSBhcHBJZClcclxuICAgIC8vICAgcmV0dXJuIFtdO1xyXG5cclxuICAgIHJldHVybiBDbGllbnRWZXJzaW9ucy5maW5kKCk7XHJcbiAgfSxcclxuICB7aXNfYXV0bzogdHJ1ZX1cclxuKTtcclxuXHJcbk1ldGVvci5zdGFydHVwKGZ1bmN0aW9uICgpIHtcclxuICB1cGRhdGVWZXJzaW9ucyhmYWxzZSk7XHJcblxyXG4gIC8vIEZvcmNlIGFueSBjb25uZWN0ZWQgY2xpZW50cyB0aGF0IGFyZSBzdGlsbCBsb29raW5nIGZvciB0aGVzZSBvbGRlclxyXG4gIC8vIGRvY3VtZW50IElEcyB0byByZWxvYWQuXHJcbiAgW1widmVyc2lvblwiLFxyXG4gICBcInZlcnNpb24tcmVmcmVzaGFibGVcIixcclxuICAgXCJ2ZXJzaW9uLWNvcmRvdmFcIixcclxuICBdLmZvckVhY2goX2lkID0+IHtcclxuICAgIENsaWVudFZlcnNpb25zLnVwc2VydChfaWQsIHtcclxuICAgICAgJHNldDogeyB2ZXJzaW9uOiBcIm91dGRhdGVkXCIgfVxyXG4gICAgfSk7XHJcbiAgfSk7XHJcbn0pO1xyXG5cclxudmFyIGZ1dCA9IG5ldyBGdXR1cmUoKTtcclxuXHJcbi8vIFdlIG9ubHkgd2FudCAncmVmcmVzaCcgdG8gdHJpZ2dlciAndXBkYXRlVmVyc2lvbnMnIEFGVEVSIG9uTGlzdGVuLFxyXG4vLyBzbyB3ZSBhZGQgYSBxdWV1ZWQgdGFzayB0aGF0IHdhaXRzIGZvciBvbkxpc3RlbiBiZWZvcmUgJ3JlZnJlc2gnIGNhbiBxdWV1ZVxyXG4vLyB0YXNrcy4gTm90ZSB0aGF0IHRoZSBgb25MaXN0ZW5pbmdgIGNhbGxiYWNrcyBkbyBub3QgZmlyZSB1bnRpbCBhZnRlclxyXG4vLyBNZXRlb3Iuc3RhcnR1cCwgc28gdGhlcmUgaXMgbm8gY29uY2VybiB0aGF0IHRoZSAndXBkYXRlVmVyc2lvbnMnIGNhbGxzIGZyb21cclxuLy8gJ3JlZnJlc2gnIHdpbGwgb3ZlcmxhcCB3aXRoIHRoZSBgdXBkYXRlVmVyc2lvbnNgIGNhbGwgZnJvbSBNZXRlb3Iuc3RhcnR1cC5cclxuXHJcbnN5bmNRdWV1ZS5xdWV1ZVRhc2soZnVuY3Rpb24gKCkge1xyXG4gIGZ1dC53YWl0KCk7XHJcbn0pO1xyXG5cclxuV2ViQXBwLm9uTGlzdGVuaW5nKGZ1bmN0aW9uICgpIHtcclxuICBmdXQucmV0dXJuKCk7XHJcbn0pO1xyXG5cclxuZnVuY3Rpb24gZW5xdWV1ZVZlcnNpb25zUmVmcmVzaCgpIHtcclxuICBzeW5jUXVldWUucXVldWVUYXNrKGZ1bmN0aW9uICgpIHtcclxuICAgIHVwZGF0ZVZlcnNpb25zKHRydWUpO1xyXG4gIH0pO1xyXG59XHJcblxyXG4vLyBMaXN0ZW4gZm9yIG1lc3NhZ2VzIHBlcnRhaW5pbmcgdG8gdGhlIGNsaWVudC1yZWZyZXNoIHRvcGljLlxyXG5pbXBvcnQgeyBvbk1lc3NhZ2UgfSBmcm9tIFwibWV0ZW9yL2ludGVyLXByb2Nlc3MtbWVzc2FnaW5nXCI7XHJcbm9uTWVzc2FnZShcImNsaWVudC1yZWZyZXNoXCIsIGVucXVldWVWZXJzaW9uc1JlZnJlc2gpO1xyXG5cclxuLy8gQW5vdGhlciB3YXkgdG8gdGVsbCB0aGUgcHJvY2VzcyB0byByZWZyZXNoOiBzZW5kIFNJR0hVUCBzaWduYWxcclxucHJvY2Vzcy5vbignU0lHSFVQJywgTWV0ZW9yLmJpbmRFbnZpcm9ubWVudChmdW5jdGlvbiAoKSB7XHJcbiAgZW5xdWV1ZVZlcnNpb25zUmVmcmVzaCgpO1xyXG59LCBcImhhbmRsaW5nIFNJR0hVUCBzaWduYWwgZm9yIHJlZnJlc2hcIikpO1xyXG4iXX0=
