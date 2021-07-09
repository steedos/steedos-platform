(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var global = Package.meteor.global;
var meteorEnv = Package.meteor.meteorEnv;
var ECMAScript = Package.ecmascript.ECMAScript;
var Tracker = Package.tracker.Tracker;
var Deps = Package.tracker.Deps;
var Promise = Package.promise.Promise;
var meteorInstall = Package.modules.meteorInstall;

var require = meteorInstall({"node_modules":{"meteor":{"steedos:meteor-fix":{"lib":{"meteor_fix.js":function module(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////
//                                                                                    //
// packages/steedos_meteor-fix/lib/meteor_fix.js                                      //
//                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////
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
  process.noDeprecation = true; // silence deprecation warnings, 相当于 --no-deprecation

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
////////////////////////////////////////////////////////////////////////////////////////

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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvczptZXRlb3ItZml4L2xpYi9tZXRlb3JfZml4LmpzIl0sIm5hbWVzIjpbIk1vbmdvIiwibW9kdWxlIiwibGluayIsInYiLCJNZXRlb3IiLCJpc1NlcnZlciIsInByb2Nlc3MiLCJub0RlcHJlY2F0aW9uIiwibW9uZ29PcHRpb25zIiwidXNlVW5pZmllZFRvcG9sb2d5IiwiYXV0b1JlY29ubmVjdCIsInVuZGVmaW5lZCIsInJlY29ubmVjdFRyaWVzIiwibW9uZ29PcHRpb25TdHIiLCJlbnYiLCJNT05HT19PUFRJT05TIiwianNvbk1vbmdvT3B0aW9ucyIsIkpTT04iLCJwYXJzZSIsIk9iamVjdCIsImFzc2lnbiIsInNldENvbm5lY3Rpb25PcHRpb25zIiwiYXV0b3J1biIsIlRyYWNrZXIiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUEsSUFBSUEsS0FBSjtBQUFVQyxNQUFNLENBQUNDLElBQVAsQ0FBWSxjQUFaLEVBQTJCO0FBQUNGLE9BQUssQ0FBQ0csQ0FBRCxFQUFHO0FBQUNILFNBQUssR0FBQ0csQ0FBTjtBQUFROztBQUFsQixDQUEzQixFQUErQyxDQUEvQzs7QUFFVjtBQUNBO0FBQ0EsSUFBSUMsTUFBTSxDQUFDQyxRQUFYLEVBQXFCO0FBQ3BCQyxTQUFPLENBQUNDLGFBQVIsR0FBd0IsSUFBeEIsQ0FEb0IsQ0FDVTs7QUFDOUIsTUFBSUMsWUFBWSxHQUFHO0FBQ2xCQyxzQkFBa0IsRUFBRSxJQURGO0FBQ1E7QUFDMUJDLGlCQUFhLEVBQUVDLFNBRkc7QUFHbEJDLGtCQUFjLEVBQUVEO0FBSEUsR0FBbkI7QUFNQSxRQUFNRSxjQUFjLEdBQUdQLE9BQU8sQ0FBQ1EsR0FBUixDQUFZQyxhQUFuQzs7QUFDQSxNQUFJLE9BQU9GLGNBQVAsS0FBMEIsV0FBOUIsRUFBMkM7QUFDMUMsVUFBTUcsZ0JBQWdCLEdBQUdDLElBQUksQ0FBQ0MsS0FBTCxDQUFXTCxjQUFYLENBQXpCO0FBRUFMLGdCQUFZLEdBQUdXLE1BQU0sQ0FBQ0MsTUFBUCxDQUFjLEVBQWQsRUFBa0JaLFlBQWxCLEVBQWdDUSxnQkFBaEMsQ0FBZjtBQUNBOztBQUNEaEIsT0FBSyxDQUFDcUIsb0JBQU4sQ0FBMkJiLFlBQTNCO0FBQ0E7O0FBR0RKLE1BQU0sQ0FBQ2tCLE9BQVAsR0FBaUJDLE9BQU8sQ0FBQ0QsT0FBekIsQyIsImZpbGUiOiIvcGFja2FnZXMvc3RlZWRvc19tZXRlb3ItZml4LmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgTW9uZ28gfSBmcm9tICdtZXRlb3IvbW9uZ28nXHJcblxyXG4vLyBSZXZlcnQgY2hhbmdlIGZyb20gTWV0ZW9yIDEuNi4xIHdobyBzZXQgaWdub3JlVW5kZWZpbmVkOiB0cnVlXHJcbi8vIG1vcmUgaW5mb3JtYXRpb24gaHR0cHM6Ly9naXRodWIuY29tL21ldGVvci9tZXRlb3IvcHVsbC85NDQ0XHJcbmlmIChNZXRlb3IuaXNTZXJ2ZXIpIHtcclxuXHRwcm9jZXNzLm5vRGVwcmVjYXRpb24gPSB0cnVlOyAvLyBzaWxlbmNlIGRlcHJlY2F0aW9uIHdhcm5pbmdzLCDnm7jlvZPkuo4gLS1uby1kZXByZWNhdGlvblxyXG5cdGxldCBtb25nb09wdGlvbnMgPSB7XHJcblx0XHR1c2VVbmlmaWVkVG9wb2xvZ3k6IHRydWUsIC8vIFJlcXVpcmVkIHRvIHNpbGVuY2UgZGVwcmVjYXRpb24gd2FybmluZ3NcclxuXHRcdGF1dG9SZWNvbm5lY3Q6IHVuZGVmaW5lZCxcclxuXHRcdHJlY29ubmVjdFRyaWVzOiB1bmRlZmluZWRcclxuXHR9O1xyXG5cclxuXHRjb25zdCBtb25nb09wdGlvblN0ciA9IHByb2Nlc3MuZW52Lk1PTkdPX09QVElPTlM7XHJcblx0aWYgKHR5cGVvZiBtb25nb09wdGlvblN0ciAhPT0gJ3VuZGVmaW5lZCcpIHtcclxuXHRcdGNvbnN0IGpzb25Nb25nb09wdGlvbnMgPSBKU09OLnBhcnNlKG1vbmdvT3B0aW9uU3RyKTtcclxuXHJcblx0XHRtb25nb09wdGlvbnMgPSBPYmplY3QuYXNzaWduKHt9LCBtb25nb09wdGlvbnMsIGpzb25Nb25nb09wdGlvbnMpO1xyXG5cdH1cclxuXHRNb25nby5zZXRDb25uZWN0aW9uT3B0aW9ucyhtb25nb09wdGlvbnMpO1xyXG59XHJcblxyXG5cclxuTWV0ZW9yLmF1dG9ydW4gPSBUcmFja2VyLmF1dG9ydW5cclxuIl19
