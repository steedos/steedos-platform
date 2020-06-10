(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var global = Package.meteor.global;
var meteorEnv = Package.meteor.meteorEnv;
var ECMAScript = Package.ecmascript.ECMAScript;
var Tracker = Package.tracker.Tracker;
var Deps = Package.tracker.Deps;
var meteorBabelHelpers = Package['babel-runtime'].meteorBabelHelpers;
var Promise = Package.promise.Promise;
var meteorInstall = Package.modules.meteorInstall;

var require = meteorInstall({"node_modules":{"meteor":{"steedos:meteor-fix":{"lib":{"meteor_fix.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////
//                                                                    //
// packages/steedos_meteor-fix/lib/meteor_fix.js                      //
//                                                                    //
////////////////////////////////////////////////////////////////////////
                                                                      //
let Mongo;
module.link("meteor/mongo", {
  Mongo(v) {
    Mongo = v;
  }

}, 0);

// Revert change from Meteor 1.6.1 who set ignoreUndefined: true
// more information https://github.com/meteor/meteor/pull/9444
if (Meteor.isServer) {
  let mongoOptions = {
    useUnifiedTopology: true,
    // Required to silence deprecation warnings
    autoReconnect: undefined,
    reconnectTries: undefined
  };
  const mongoOptionStr = process.env.MONGO_OPTIONS;

  if (typeof mongoOptionStr !== 'undefined') {
    const jsonMongoOptions = JSON.parse(mongoOptionStr);
    mongoOptions = Object.assign({}, mongoOptions, jsonMongoOptions);
  }

  Mongo.setConnectionOptions(mongoOptions);
}

Meteor.autorun = Tracker.autorun;
////////////////////////////////////////////////////////////////////////

}}}}}},{
  "extensions": [
    ".js",
    ".json"
  ]
});

require("/node_modules/meteor/steedos:meteor-fix/lib/meteor_fix.js");

/* Exports */
Package._define("steedos:meteor-fix");

})();

//# sourceURL=meteor://💻app/packages/steedos_meteor-fix.js
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvczptZXRlb3ItZml4L2xpYi9tZXRlb3JfZml4LmpzIl0sIm5hbWVzIjpbIk1vbmdvIiwibW9kdWxlIiwibGluayIsInYiLCJNZXRlb3IiLCJpc1NlcnZlciIsIm1vbmdvT3B0aW9ucyIsInVzZVVuaWZpZWRUb3BvbG9neSIsImF1dG9SZWNvbm5lY3QiLCJ1bmRlZmluZWQiLCJyZWNvbm5lY3RUcmllcyIsIm1vbmdvT3B0aW9uU3RyIiwicHJvY2VzcyIsImVudiIsIk1PTkdPX09QVElPTlMiLCJqc29uTW9uZ29PcHRpb25zIiwiSlNPTiIsInBhcnNlIiwiT2JqZWN0IiwiYXNzaWduIiwic2V0Q29ubmVjdGlvbk9wdGlvbnMiLCJhdXRvcnVuIiwiVHJhY2tlciJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUEsSUFBSUEsS0FBSjtBQUFVQyxNQUFNLENBQUNDLElBQVAsQ0FBWSxjQUFaLEVBQTJCO0FBQUNGLE9BQUssQ0FBQ0csQ0FBRCxFQUFHO0FBQUNILFNBQUssR0FBQ0csQ0FBTjtBQUFROztBQUFsQixDQUEzQixFQUErQyxDQUEvQzs7QUFFVjtBQUNBO0FBQ0EsSUFBSUMsTUFBTSxDQUFDQyxRQUFYLEVBQXFCO0FBRXBCLE1BQUlDLFlBQVksR0FBRztBQUNsQkMsc0JBQWtCLEVBQUUsSUFERjtBQUNRO0FBQzFCQyxpQkFBYSxFQUFFQyxTQUZHO0FBR2xCQyxrQkFBYyxFQUFFRDtBQUhFLEdBQW5CO0FBTUEsUUFBTUUsY0FBYyxHQUFHQyxPQUFPLENBQUNDLEdBQVIsQ0FBWUMsYUFBbkM7O0FBQ0EsTUFBSSxPQUFPSCxjQUFQLEtBQTBCLFdBQTlCLEVBQTJDO0FBQzFDLFVBQU1JLGdCQUFnQixHQUFHQyxJQUFJLENBQUNDLEtBQUwsQ0FBV04sY0FBWCxDQUF6QjtBQUVBTCxnQkFBWSxHQUFHWSxNQUFNLENBQUNDLE1BQVAsQ0FBYyxFQUFkLEVBQWtCYixZQUFsQixFQUFnQ1MsZ0JBQWhDLENBQWY7QUFDQTs7QUFDRGYsT0FBSyxDQUFDb0Isb0JBQU4sQ0FBMkJkLFlBQTNCO0FBQ0E7O0FBR0RGLE1BQU0sQ0FBQ2lCLE9BQVAsR0FBaUJDLE9BQU8sQ0FBQ0QsT0FBekIsQyIsImZpbGUiOiIvcGFja2FnZXMvc3RlZWRvc19tZXRlb3ItZml4LmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgTW9uZ28gfSBmcm9tICdtZXRlb3IvbW9uZ28nXHJcblxyXG4vLyBSZXZlcnQgY2hhbmdlIGZyb20gTWV0ZW9yIDEuNi4xIHdobyBzZXQgaWdub3JlVW5kZWZpbmVkOiB0cnVlXHJcbi8vIG1vcmUgaW5mb3JtYXRpb24gaHR0cHM6Ly9naXRodWIuY29tL21ldGVvci9tZXRlb3IvcHVsbC85NDQ0XHJcbmlmIChNZXRlb3IuaXNTZXJ2ZXIpIHtcclxuXHJcblx0bGV0IG1vbmdvT3B0aW9ucyA9IHtcclxuXHRcdHVzZVVuaWZpZWRUb3BvbG9neTogdHJ1ZSwgLy8gUmVxdWlyZWQgdG8gc2lsZW5jZSBkZXByZWNhdGlvbiB3YXJuaW5nc1xyXG5cdFx0YXV0b1JlY29ubmVjdDogdW5kZWZpbmVkLFxyXG5cdFx0cmVjb25uZWN0VHJpZXM6IHVuZGVmaW5lZFxyXG5cdH07XHJcblxyXG5cdGNvbnN0IG1vbmdvT3B0aW9uU3RyID0gcHJvY2Vzcy5lbnYuTU9OR09fT1BUSU9OUztcclxuXHRpZiAodHlwZW9mIG1vbmdvT3B0aW9uU3RyICE9PSAndW5kZWZpbmVkJykge1xyXG5cdFx0Y29uc3QganNvbk1vbmdvT3B0aW9ucyA9IEpTT04ucGFyc2UobW9uZ29PcHRpb25TdHIpO1xyXG5cclxuXHRcdG1vbmdvT3B0aW9ucyA9IE9iamVjdC5hc3NpZ24oe30sIG1vbmdvT3B0aW9ucywganNvbk1vbmdvT3B0aW9ucyk7XHJcblx0fVxyXG5cdE1vbmdvLnNldENvbm5lY3Rpb25PcHRpb25zKG1vbmdvT3B0aW9ucyk7XHJcbn1cclxuXHJcblxyXG5NZXRlb3IuYXV0b3J1biA9IFRyYWNrZXIuYXV0b3J1blxyXG4iXX0=
