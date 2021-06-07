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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvYXV0b3VwZGF0ZS9hdXRvdXBkYXRlX3NlcnZlci5qcyJdLCJuYW1lcyI6WyJfb2JqZWN0U3ByZWFkIiwibW9kdWxlIiwibGluayIsImRlZmF1bHQiLCJ2IiwiZXhwb3J0IiwiQXV0b3VwZGF0ZSIsIm9uTWVzc2FnZSIsIkZ1dHVyZSIsIk5wbSIsInJlcXVpcmUiLCJfX21ldGVvcl9ydW50aW1lX2NvbmZpZ19fIiwiYXV0b3VwZGF0ZSIsInZlcnNpb25zIiwiQ2xpZW50VmVyc2lvbnMiLCJNb25nbyIsIkNvbGxlY3Rpb24iLCJjb25uZWN0aW9uIiwiYXV0b3VwZGF0ZVZlcnNpb24iLCJhdXRvdXBkYXRlVmVyc2lvblJlZnJlc2hhYmxlIiwiYXV0b3VwZGF0ZVZlcnNpb25Db3Jkb3ZhIiwiYXBwSWQiLCJwcm9jZXNzIiwiZW52IiwiQVBQX0lEIiwic3luY1F1ZXVlIiwiTWV0ZW9yIiwiX1N5bmNocm9ub3VzUXVldWUiLCJ1cGRhdGVWZXJzaW9ucyIsInNob3VsZFJlbG9hZENsaWVudFByb2dyYW0iLCJXZWJBcHBJbnRlcm5hbHMiLCJyZWxvYWRDbGllbnRQcm9ncmFtcyIsIkFVVE9VUERBVEVfVkVSU0lPTiIsImNsaWVudEFyY2hzIiwiT2JqZWN0Iiwia2V5cyIsIldlYkFwcCIsImNsaWVudFByb2dyYW1zIiwiZm9yRWFjaCIsImFyY2giLCJ2ZXJzaW9uIiwiY2FsY3VsYXRlQ2xpZW50SGFzaCIsInZlcnNpb25SZWZyZXNoYWJsZSIsImNhbGN1bGF0ZUNsaWVudEhhc2hSZWZyZXNoYWJsZSIsInZlcnNpb25Ob25SZWZyZXNoYWJsZSIsImNhbGN1bGF0ZUNsaWVudEhhc2hOb25SZWZyZXNoYWJsZSIsImdlbmVyYXRlQm9pbGVycGxhdGUiLCJvbkxpc3RlbmluZyIsInBheWxvYWQiLCJhc3NldHMiLCJnZXRSZWZyZXNoYWJsZUFzc2V0cyIsImZpbmRPbmUiLCJfaWQiLCJpbnNlcnQiLCJ1cGRhdGUiLCIkc2V0IiwicHVibGlzaCIsImNoZWNrIiwiTWF0Y2giLCJPbmVPZiIsIlN0cmluZyIsInVuZGVmaW5lZCIsImZpbmQiLCJpc19hdXRvIiwic3RhcnR1cCIsInVwc2VydCIsImZ1dCIsInF1ZXVlVGFzayIsIndhaXQiLCJyZXR1cm4iLCJlbnF1ZXVlVmVyc2lvbnNSZWZyZXNoIiwib24iLCJiaW5kRW52aXJvbm1lbnQiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLElBQUlBLGFBQUo7O0FBQWtCQyxNQUFNLENBQUNDLElBQVAsQ0FBWSxzQ0FBWixFQUFtRDtBQUFDQyxTQUFPLENBQUNDLENBQUQsRUFBRztBQUFDSixpQkFBYSxHQUFDSSxDQUFkO0FBQWdCOztBQUE1QixDQUFuRCxFQUFpRixDQUFqRjtBQUFsQkgsTUFBTSxDQUFDSSxNQUFQLENBQWM7QUFBQ0MsWUFBVSxFQUFDLE1BQUlBO0FBQWhCLENBQWQ7QUFBMkMsSUFBSUMsU0FBSjtBQUFjTixNQUFNLENBQUNDLElBQVAsQ0FBWSxnQ0FBWixFQUE2QztBQUFDSyxXQUFTLENBQUNILENBQUQsRUFBRztBQUFDRyxhQUFTLEdBQUNILENBQVY7QUFBWTs7QUFBMUIsQ0FBN0MsRUFBeUUsQ0FBekU7O0FBQXpEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQSxJQUFJSSxNQUFNLEdBQUdDLEdBQUcsQ0FBQ0MsT0FBSixDQUFZLGVBQVosQ0FBYjs7QUFFTyxNQUFNSixVQUFVLEdBQUdLLHlCQUF5QixDQUFDQyxVQUExQixHQUF1QztBQUMvRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQUMsVUFBUSxFQUFFO0FBUHFELENBQTFEO0FBVVA7QUFDQSxNQUFNQyxjQUFjLEdBQ2xCLElBQUlDLEtBQUssQ0FBQ0MsVUFBVixDQUFxQixrQ0FBckIsRUFBeUQ7QUFDdkRD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RUFFQyxpQkFGRCxFQUdFVSxPQUhGLENBR1VjLEdBQUcsSUFBSTtBQUNmdEMsa0JBQWMsQ0FBQ21ELE1BQWYsQ0FBc0JiLEdBQXRCLEVBQTJCO0FBQ3pCRyxVQUFJLEVBQUU7QUFBRWYsZUFBTyxFQUFFO0FBQVg7QUFEbUIsS0FBM0I7QUFHRCxHQVBEO0FBUUQsQ0FiRDtBQWVBLElBQUkwQixHQUFHLEdBQUcsSUFBSTFELE1BQUosRUFBVixDLENBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQWlCLFNBQVMsQ0FBQzBDLFNBQVYsQ0FBb0IsWUFBWTtBQUM5QkQsS0FBRyxDQUFDRSxJQUFKO0FBQ0QsQ0FGRDtBQUlBaEMsTUFBTSxDQUFDVyxXQUFQLENBQW1CLFlBQVk7QUFDN0JtQixLQUFHLENBQUNHLE1BQUo7QUFDRCxDQUZEOztBQUlBLFNBQVNDLHNCQUFULEdBQWtDO0FBQ2hDN0MsV0FBUyxDQUFDMEMsU0FBVixDQUFvQixZQUFZO0FBQzlCdkMsa0JBQWMsQ0FBQyxJQUFELENBQWQ7QUFDRCxHQUZEO0FBR0QsQyxDQUVEOzs7QUFFQXJCLFNBQVMsQ0FBQyxnQkFBRCxFQUFtQitELHNCQUFuQixDQUFULEMsQ0FFQTs7QUFDQWhELE9BQU8sQ0FBQ2lELEVBQVIsQ0FBVyxRQUFYLEVBQXFCN0MsTUFBTSxDQUFDOEMsZUFBUCxDQUF1QixZQUFZO0FBQ3RERix3QkFBc0I7QUFDdkIsQ0FGb0IsRUFFbEIsb0NBRmtCLENBQXJCLEUiLCJmaWxlIjoiL3BhY2thZ2VzL2F1dG91cGRhdGUuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBQdWJsaXNoIHRoZSBjdXJyZW50IGNsaWVudCB2ZXJzaW9ucyBmb3IgZWFjaCBjbGllbnQgYXJjaGl0ZWN0dXJlXG4vLyAod2ViLmJyb3dzZXIsIHdlYi5icm93c2VyLmxlZ2FjeSwgd2ViLmNvcmRvdmEpLiBXaGVuIGEgY2xpZW50IG9ic2VydmVzXG4vLyBhIGNoYW5nZSBpbiB0aGUgdmVyc2lvbnMgYXNzb2NpYXRlZCB3aXRoIGl0cyBjbGllbnQgYXJjaGl0ZWN0dXJlLFxuLy8gaXQgd2lsbCByZWZyZXNoIGl0c2VsZiwgZWl0aGVyIGJ5IHN3YXBwaW5nIG91dCBDU1MgYXNzZXRzIG9yIGJ5XG4vLyByZWxvYWRpbmcgdGhlIHBhZ2UuXG4vL1xuLy8gVGhlcmUgYXJlIHRocmVlIHZlcnNpb25zIGZvciBhbnkgZ2l2ZW4gY2xpZW50IGFyY2hpdGVjdHVyZTogYHZlcnNpb25gLFxuLy8gYHZlcnNpb25SZWZyZXNoYWJsZWAsIGFuZCBgdmVyc2lvbk5vblJlZnJlc2hhYmxlYC4gVGhlIHJlZnJlc2hhYmxlXG4vLyB2ZXJzaW9uIGlzIGEgaGFzaCBvZiBqdXN0IHRoZSBjbGllbnQgcmVzb3VyY2VzIHRoYXQgYXJlIHJlZnJlc2hhYmxlLFxuLy8gc3VjaCBhcyBDU1MsIHdoaWxlIHRoZSBub24tcmVmcmVzaGFibGUgdmVyc2lvbiBpcyBhIGhhc2ggb2YgdGhlIHJlc3Qgb2Zcbi8vIHRoZSBjbGllbnQgYXNzZXRzLCBleGNsdWRpbmcgdGhlIHJlZnJlc2hhYmxlIG9uZXM6IEhUTUwsIEpTLCBhbmQgc3RhdGljXG4vLyBmaWxlcyBpbiB0aGUgYHB1YmxpY2AgZGlyZWN0b3J5LiBUaGUgYHZlcnNpb25gIHZlcnNpb24gaXMgYSBjb21iaW5lZFxuLy8gaGFzaCBvZiBldmVyeXRoaW5nLlxuLy9cbi8vIElmIHRoZSBlbnZpcm9ubWVudCB2YXJpYWJsZSBgQVVUT1VQREFURV9WRVJTSU9OYCBpcyBzZXQsIGl0IHdpbGwgYmVcbi8vIHVzZWQgaW4gcGxhY2Ugb2YgYWxsIGNsaWVudCB2ZXJzaW9ucy4gWW91IGNhbiB1c2UgdGhpcyB2YXJpYWJsZSB0b1xuLy8gY29udHJvbCB3aGVuIHRoZSBjbGllbnQgcmVsb2Fkcy4gRm9yIGV4YW1wbGUsIGlmIHlvdSB3YW50IHRvIGZvcmNlIGFcbi8vIHJlbG9hZCBvbmx5IGFmdGVyIG1ham9yIGNoYW5nZXMsIHVzZSBhIGN1c3RvbSBBVVRPVVBEQVRFX1ZFUlNJT04gYW5kXG4vLyBjaGFuZ2UgaXQgb25seSB3aGVuIHNvbWV0aGluZyB3b3J0aCBwdXNoaW5nIHRvIGNsaWVudHMgaGFwcGVucy5cbi8vXG4vLyBUaGUgc2VydmVyIHB1Ymxpc2hlcyBhIGBtZXRlb3JfYXV0b3VwZGF0ZV9jbGllbnRWZXJzaW9uc2AgY29sbGVjdGlvbi5cbi8vIFRoZSBJRCBvZiBlYWNoIGRvY3VtZW50IGlzIHRoZSBjbGllbnQgYXJjaGl0ZWN0dXJlLCBhbmQgdGhlIGZpZWxkcyBvZlxuLy8gdGhlIGRvY3VtZW50IGFyZSB0aGUgdmVyc2lvbnMgZGVzY3JpYmVkIGFib3ZlLlxuXG52YXIgRnV0dXJlID0gTnBtLnJlcXVpcmUoXCJmaWJlcnMvZnV0dXJlXCIpO1xuXG5leHBvcnQgY29uc3QgQXV0b3VwZGF0ZSA9IF9fbWV0ZW9yX3J1bnRpbWVfY29uZmlnX18uYXV0b3VwZGF0ZSA9IHtcbiAgLy8gTWFwIGZyb20gY2xpZW50IGFyY2hpdGVjdHVyZXMgKHdlYi5icm93c2VyLCB3ZWIuYnJvd3Nlci5sZWdhY3ksXG4gIC8vIHdlYi5jb3Jkb3ZhKSB0byB2ZXJzaW9uIGZpZWxkcyB7IHZlcnNpb24sIHZlcnNpb25SZWZyZXNoYWJsZSxcbiAgLy8gdmVyc2lvbk5vblJlZnJlc2hhYmxlLCByZWZyZXNoYWJsZSB9IHRoYXQgd2lsbCBiZSBzdG9yZWQgaW5cbiAgLy8gQ2xpZW50VmVyc2lvbnMgZG9jdW1lbnRzICh3aG9zZSBJRHMgYXJlIGNsaWVudCBhcmNoaXRlY3R1cmVzKS4gVGhpc1xuICAvLyBkYXRhIGdldHMgc2VyaWFsaXplZCBpbnRvIHRoZSBib2lsZXJwbGF0ZSBiZWNhdXNlIGl0J3Mgc3RvcmVkIGluXG4gIC8vIF9fbWV0ZW9yX3J1bnRpbWVfY29uZmlnX18uYXV0b3VwZGF0ZS52ZXJzaW9ucy5cbiAgdmVyc2lvbnM6IHt9XG59O1xuXG4vLyBUaGUgY29sbGVjdGlvbiBvZiBhY2NlcHRhYmxlIGNsaWVudCB2ZXJzaW9ucy5cbmNvbnN0IENsaWVudFZlcnNpb25zID1cbiAgbmV3IE1vbmdvLkNvbGxlY3Rpb24oXCJtZXRlb3JfYXV0b3VwZGF0ZV9jbGllbnRWZXJzaW9uc1wiLCB7XG4gICAgY29ubmVjdGlvbjogbnVsbFxuICB9KTtcblxuLy8gVGhlIGNsaWVudCBoYXNoIGluY2x1ZGVzIF9fbWV0ZW9yX3J1bnRpbWVfY29uZmlnX18sIHNvIHdhaXQgdW50aWxcbi8vIGFsbCBwYWNrYWdlcyBoYXZlIGxvYWRlZCBhbmQgaGF2ZSBoYWQgYSBjaGFuY2UgdG8gcG9wdWxhdGUgdGhlXG4vLyBydW50aW1lIGNvbmZpZyBiZWZvcmUgdXNpbmcgdGhlIGNsaWVudCBoYXNoIGFzIG91ciBkZWZhdWx0IGF1dG9cbi8vIHVwZGF0ZSB2ZXJzaW9uIGlkLlxuXG4vLyBOb3RlOiBUZXN0cyBhbGxvdyBwZW9wbGUgdG8gb3ZlcnJpZGUgQXV0b3VwZGF0ZS5hdXRvdXBkYXRlVmVyc2lvbiBiZWZvcmVcbi8vIHN0YXJ0dXAuXG5BdXRvdXBkYXRlLmF1dG91cGRhdGVWZXJzaW9uID0gbnVsbDtcbkF1dG91cGRhdGUuYXV0b3VwZGF0ZVZlcnNpb25SZWZyZXNoYWJsZSA9IG51bGw7XG5BdXRvdXBkYXRlLmF1dG91cGRhdGVWZXJzaW9uQ29yZG92YSA9IG51bGw7XG5BdXRvdXBkYXRlLmFwcElkID0gX19tZXRlb3JfcnVudGltZV9jb25maWdfXy5hcHBJZCA9IHByb2Nlc3MuZW52LkFQUF9JRDtcblxudmFyIHN5bmNRdWV1ZSA9IG5ldyBNZXRlb3IuX1N5bmNocm9ub3VzUXVldWUoKTtcblxuZnVuY3Rpb24gdXBkYXRlVmVyc2lvbnMoc2hvdWxkUmVsb2FkQ2xpZW50UHJvZ3JhbSkge1xuICAvLyBTdGVwIDE6IGxvYWQgdGhlIGN1cnJlbnQgY2xpZW50IHByb2dyYW0gb24gdGhlIHNlcnZlclxuICBpZiAoc2hvdWxkUmVsb2FkQ2xpZW50UHJvZ3JhbSkge1xuICAgIFdlYkFwcEludGVybmFscy5yZWxvYWRDbGllbnRQcm9ncmFtcygpO1xuICB9XG5cbiAgY29uc3Qge1xuICAgIC8vIElmIHRoZSBBVVRPVVBEQVRFX1ZFUlNJT04gZW52aXJvbm1lbnQgdmFyaWFibGUgaXMgZGVmaW5lZCwgaXQgdGFrZXNcbiAgICAvLyBwcmVjZWRlbmNlLCBidXQgQXV0b3VwZGF0ZS5hdXRvdXBkYXRlVmVyc2lvbiBpcyBzdGlsbCBzdXBwb3J0ZWQgYXNcbiAgICAvLyBhIGZhbGxiYWNrLiBJbiBtb3N0IGNhc2VzIG5laXRoZXIgb2YgdGhlc2UgdmFsdWVzIHdpbGwgYmUgZGVmaW5lZC5cbiAgICBBVVRPVVBEQVRFX1ZFUlNJT04gPSBBdXRvdXBkYXRlLmF1dG91cGRhdGVWZXJzaW9uXG4gIH0gPSBwcm9jZXNzLmVudjtcblxuICAvLyBTdGVwIDI6IHVwZGF0ZSBfX21ldGVvcl9ydW50aW1lX2NvbmZpZ19fLmF1dG91cGRhdGUudmVyc2lvbnMuXG4gIGNvbnN0IGNsaWVudEFyY2hzID0gT2JqZWN0LmtleXMoV2ViQXBwLmNsaWVudFByb2dyYW1zKTtcbiAgY2xpZW50QXJjaHMuZm9yRWFjaChhcmNoID0+IHtcbiAgICBBdXRvdXBkYXRlLnZlcnNpb25zW2FyY2hdID0ge1xuICAgICAgdmVyc2lvbjogQVVUT1VQREFURV9WRVJTSU9OIHx8XG4gICAgICAgIFdlYkFwcC5jYWxjdWxhdGVDbGllbnRIYXNoKGFyY2gpLFxuICAgICAgdmVyc2lvblJlZnJlc2hhYmxlOiBBVVRPVVBEQVRFX1ZFUlNJT04gfHxcbiAgICAgICAgV2ViQXBwLmNhbGN1bGF0ZUNsaWVudEhhc2hSZWZyZXNoYWJsZShhcmNoKSxcbiAgICAgIHZlcnNpb25Ob25SZWZyZXNoYWJsZTogQVVUT1VQREFURV9WRVJTSU9OIHx8XG4gICAgICAgIFdlYkFwcC5jYWxjdWxhdGVDbGllbnRIYXNoTm9uUmVmcmVzaGFibGUoYXJjaCksXG4gICAgfTtcbiAgfSk7XG5cbiAgLy8gU3RlcCAzOiBmb3JtIHRoZSBuZXcgY2xpZW50IGJvaWxlcnBsYXRlIHdoaWNoIGNvbnRhaW5zIHRoZSB1cGRhdGVkXG4gIC8vIGFzc2V0cyBhbmQgX19tZXRlb3JfcnVudGltZV9jb25maWdfXy5cbiAgaWYgKHNob3VsZFJlbG9hZENsaWVudFByb2dyYW0pIHtcbiAgICBXZWJBcHBJbnRlcm5hbHMuZ2VuZXJhdGVCb2lsZXJwbGF0ZSgpO1xuICB9XG5cbiAgLy8gU3RlcCA0OiB1cGRhdGUgdGhlIENsaWVudFZlcnNpb25zIGNvbGxlY3Rpb24uXG4gIC8vIFdlIHVzZSBgb25MaXN0ZW5pbmdgIGhlcmUgYmVjYXVzZSB3ZSBuZWVkIHRvIHVzZVxuICAvLyBgV2ViQXBwLmdldFJlZnJlc2hhYmxlQXNzZXRzYCwgd2hpY2ggaXMgb25seSBzZXQgYWZ0ZXJcbiAgLy8gYFdlYkFwcC5nZW5lcmF0ZUJvaWxlcnBsYXRlYCBpcyBjYWxsZWQgYnkgYG1haW5gIGluIHdlYmFwcC5cbiAgV2ViQXBwLm9uTGlzdGVuaW5nKCgpID0+IHtcbiAgICBjbGllbnRBcmNocy5mb3JFYWNoKGFyY2ggPT4ge1xuICAgICAgY29uc3QgcGF5bG9hZCA9IHtcbiAgICAgICAgLi4uQXV0b3VwZGF0ZS52ZXJzaW9uc1thcmNoXSxcbiAgICAgICAgYXNzZXRzOiBXZWJBcHAuZ2V0UmVmcmVzaGFibGVBc3NldHMoYXJjaCksXG4gICAgICB9O1xuICAgICAgaWYgKCEgQ2xpZW50VmVyc2lvbnMuZmluZE9uZSh7IF9pZDogYXJjaCB9KSkge1xuICAgICAgICBDbGllbnRWZXJzaW9ucy5pbnNlcnQoeyBfaWQ6IGFyY2gsIC4uLnBheWxvYWQgfSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBDbGllbnRWZXJzaW9ucy51cGRhdGUoYXJjaCwgeyAkc2V0OiBwYXlsb2FkIH0pO1xuICAgICAgfVxuICAgIH0pO1xuICB9KTtcbn1cblxuTWV0ZW9yLnB1Ymxpc2goXG4gIFwibWV0ZW9yX2F1dG91cGRhdGVfY2xpZW50VmVyc2lvbnNcIixcbiAgZnVuY3Rpb24gKGFwcElkKSB7XG4gICAgLy8gYG51bGxgIGhhcHBlbnMgd2hlbiBhIGNsaWVudCBkb2Vzbid0IGhhdmUgYW4gYXBwSWQgYW5kIHBhc3Nlc1xuICAgIC8vIGB1bmRlZmluZWRgIHRvIGBNZXRlb3Iuc3Vic2NyaWJlYC4gYHVuZGVmaW5lZGAgaXMgdHJhbnNsYXRlZCB0b1xuICAgIC8vIGBudWxsYCBhcyBKU09OIGRvZXNuJ3QgaGF2ZSBgdW5kZWZpbmVkLlxuICAgIGNoZWNrKGFwcElkLCBNYXRjaC5PbmVPZihTdHJpbmcsIHVuZGVmaW5lZCwgbnVsbCkpO1xuXG4gICAgLy8gLy8gRG9uJ3Qgbm90aWZ5IGNsaWVudHMgdXNpbmcgd3JvbmcgYXBwSWQgc3VjaCBhcyBtb2JpbGUgYXBwcyBidWlsdCB3aXRoIGFcbiAgICAvLyAvLyBkaWZmZXJlbnQgc2VydmVyIGJ1dCBwb2ludGluZyBhdCB0aGUgc2FtZSBsb2NhbCB1cmxcbiAgICAvLyBpZiAoQXV0b3VwZGF0ZS5hcHBJZCAmJiBhcHBJZCAmJiBBdXRvdXBkYXRlLmFwcElkICE9PSBhcHBJZClcbiAgICAvLyAgIHJldHVybiBbXTtcblxuICAgIHJldHVybiBDbGllbnRWZXJzaW9ucy5maW5kKCk7XG4gIH0sXG4gIHtpc19hdXRvOiB0cnVlfVxuKTtcblxuTWV0ZW9yLnN0YXJ0dXAoZnVuY3Rpb24gKCkge1xuICB1cGRhdGVWZXJzaW9ucyhmYWxzZSk7XG5cbiAgLy8gRm9yY2UgYW55IGNvbm5lY3RlZCBjbGllbnRzIHRoYXQgYXJlIHN0aWxsIGxvb2tpbmcgZm9yIHRoZXNlIG9sZGVyXG4gIC8vIGRvY3VtZW50IElEcyB0byByZWxvYWQuXG4gIFtcInZlcnNpb25cIixcbiAgIFwidmVyc2lvbi1yZWZyZXNoYWJsZVwiLFxuICAgXCJ2ZXJzaW9uLWNvcmRvdmFcIixcbiAgXS5mb3JFYWNoKF9pZCA9PiB7XG4gICAgQ2xpZW50VmVyc2lvbnMudXBzZXJ0KF9pZCwge1xuICAgICAgJHNldDogeyB2ZXJzaW9uOiBcIm91dGRhdGVkXCIgfVxuICAgIH0pO1xuICB9KTtcbn0pO1xuXG52YXIgZnV0ID0gbmV3IEZ1dHVyZSgpO1xuXG4vLyBXZSBvbmx5IHdhbnQgJ3JlZnJlc2gnIHRvIHRyaWdnZXIgJ3VwZGF0ZVZlcnNpb25zJyBBRlRFUiBvbkxpc3Rlbixcbi8vIHNvIHdlIGFkZCBhIHF1ZXVlZCB0YXNrIHRoYXQgd2FpdHMgZm9yIG9uTGlzdGVuIGJlZm9yZSAncmVmcmVzaCcgY2FuIHF1ZXVlXG4vLyB0YXNrcy4gTm90ZSB0aGF0IHRoZSBgb25MaXN0ZW5pbmdgIGNhbGxiYWNrcyBkbyBub3QgZmlyZSB1bnRpbCBhZnRlclxuLy8gTWV0ZW9yLnN0YXJ0dXAsIHNvIHRoZXJlIGlzIG5vIGNvbmNlcm4gdGhhdCB0aGUgJ3VwZGF0ZVZlcnNpb25zJyBjYWxscyBmcm9tXG4vLyAncmVmcmVzaCcgd2lsbCBvdmVybGFwIHdpdGggdGhlIGB1cGRhdGVWZXJzaW9uc2AgY2FsbCBmcm9tIE1ldGVvci5zdGFydHVwLlxuXG5zeW5jUXVldWUucXVldWVUYXNrKGZ1bmN0aW9uICgpIHtcbiAgZnV0LndhaXQoKTtcbn0pO1xuXG5XZWJBcHAub25MaXN0ZW5pbmcoZnVuY3Rpb24gKCkge1xuICBmdXQucmV0dXJuKCk7XG59KTtcblxuZnVuY3Rpb24gZW5xdWV1ZVZlcnNpb25zUmVmcmVzaCgpIHtcbiAgc3luY1F1ZXVlLnF1ZXVlVGFzayhmdW5jdGlvbiAoKSB7XG4gICAgdXBkYXRlVmVyc2lvbnModHJ1ZSk7XG4gIH0pO1xufVxuXG4vLyBMaXN0ZW4gZm9yIG1lc3NhZ2VzIHBlcnRhaW5pbmcgdG8gdGhlIGNsaWVudC1yZWZyZXNoIHRvcGljLlxuaW1wb3J0IHsgb25NZXNzYWdlIH0gZnJvbSBcIm1ldGVvci9pbnRlci1wcm9jZXNzLW1lc3NhZ2luZ1wiO1xub25NZXNzYWdlKFwiY2xpZW50LXJlZnJlc2hcIiwgZW5xdWV1ZVZlcnNpb25zUmVmcmVzaCk7XG5cbi8vIEFub3RoZXIgd2F5IHRvIHRlbGwgdGhlIHByb2Nlc3MgdG8gcmVmcmVzaDogc2VuZCBTSUdIVVAgc2lnbmFsXG5wcm9jZXNzLm9uKCdTSUdIVVAnLCBNZXRlb3IuYmluZEVudmlyb25tZW50KGZ1bmN0aW9uICgpIHtcbiAgZW5xdWV1ZVZlcnNpb25zUmVmcmVzaCgpO1xufSwgXCJoYW5kbGluZyBTSUdIVVAgc2lnbmFsIGZvciByZWZyZXNoXCIpKTtcbiJdfQ==
