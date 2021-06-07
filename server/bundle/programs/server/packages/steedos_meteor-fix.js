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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvczptZXRlb3ItZml4L2xpYi9tZXRlb3JfZml4LmpzIl0sIm5hbWVzIjpbIk1vbmdvIiwibW9kdWxlIiwibGluayIsInYiLCJNZXRlb3IiLCJpc1NlcnZlciIsInByb2Nlc3MiLCJub0RlcHJlY2F0aW9uIiwibW9uZ29PcHRpb25zIiwidXNlVW5pZmllZFRvcG9sb2d5IiwiYXV0b1JlY29ubmVjdCIsInVuZGVmaW5lZCIsInJlY29ubmVjdFRyaWVzIiwibW9uZ29PcHRpb25TdHIiLCJlbnYiLCJNT05HT19PUFRJT05TIiwianNvbk1vbmdvT3B0aW9ucyIsIkpTT04iLCJwYXJzZSIsIk9iamVjdCIsImFzc2lnbiIsInNldENvbm5lY3Rpb25PcHRpb25zIiwiYXV0b3J1biIsIlRyYWNrZXIiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUEsSUFBSUEsS0FBSjtBQUFVQyxNQUFNLENBQUNDLElBQVAsQ0FBWSxjQUFaLEVBQTJCO0FBQUNGLE9BQUssQ0FBQ0csQ0FBRCxFQUFHO0FBQUNILFNBQUssR0FBQ0csQ0FBTjtBQUFROztBQUFsQixDQUEzQixFQUErQyxDQUEvQzs7QUFFVjtBQUNBO0FBQ0EsSUFBSUMsTUFBTSxDQUFDQyxRQUFYLEVBQXFCO0FBQ3BCQyxTQUFPLENBQUNDLGFBQVIsR0FBd0IsSUFBeEIsQ0FEb0IsQ0FDVTs7QUFDOUIsTUFBSUMsWUFBWSxHQUFHO0FBQ2xCQyxzQkFBa0IsRUFBRSxJQURGO0FBQ1E7QUFDMUJDLGlCQUFhLEVBQUVDLFNBRkc7QUFHbEJDLGtCQUFjLEVBQUVEO0FBSEUsR0FBbkI7QUFNQSxRQUFNRSxjQUFjLEdBQUdQLE9BQU8sQ0FBQ1EsR0FBUixDQUFZQyxhQUFuQzs7QUFDQSxNQUFJLE9BQU9GLGNBQVAsS0FBMEIsV0FBOUIsRUFBMkM7QUFDMUMsVUFBTUcsZ0JBQWdCLEdBQUdDLElBQUksQ0FBQ0MsS0FBTCxDQUFXTCxjQUFYLENBQXpCO0FBRUFMLGdCQUFZLEdBQUdXLE1BQU0sQ0FBQ0MsTUFBUCxDQUFjLEVBQWQsRUFBa0JaLFlBQWxCLEVBQWdDUSxnQkFBaEMsQ0FBZjtBQUNBOztBQUNEaEIsT0FBSyxDQUFDcUIsb0JBQU4sQ0FBMkJiLFlBQTNCO0FBQ0E7O0FBR0RKLE1BQU0sQ0FBQ2tCLE9BQVAsR0FBaUJDLE9BQU8sQ0FBQ0QsT0FBekIsQyIsImZpbGUiOiIvcGFja2FnZXMvc3RlZWRvc19tZXRlb3ItZml4LmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgTW9uZ28gfSBmcm9tICdtZXRlb3IvbW9uZ28nXG5cbi8vIFJldmVydCBjaGFuZ2UgZnJvbSBNZXRlb3IgMS42LjEgd2hvIHNldCBpZ25vcmVVbmRlZmluZWQ6IHRydWVcbi8vIG1vcmUgaW5mb3JtYXRpb24gaHR0cHM6Ly9naXRodWIuY29tL21ldGVvci9tZXRlb3IvcHVsbC85NDQ0XG5pZiAoTWV0ZW9yLmlzU2VydmVyKSB7XG5cdHByb2Nlc3Mubm9EZXByZWNhdGlvbiA9IHRydWU7IC8vIHNpbGVuY2UgZGVwcmVjYXRpb24gd2FybmluZ3MsIOebuOW9k+S6jiAtLW5vLWRlcHJlY2F0aW9uXG5cdGxldCBtb25nb09wdGlvbnMgPSB7XG5cdFx0dXNlVW5pZmllZFRvcG9sb2d5OiB0cnVlLCAvLyBSZXF1aXJlZCB0byBzaWxlbmNlIGRlcHJlY2F0aW9uIHdhcm5pbmdzXG5cdFx0YXV0b1JlY29ubmVjdDogdW5kZWZpbmVkLFxuXHRcdHJlY29ubmVjdFRyaWVzOiB1bmRlZmluZWRcblx0fTtcblxuXHRjb25zdCBtb25nb09wdGlvblN0ciA9IHByb2Nlc3MuZW52Lk1PTkdPX09QVElPTlM7XG5cdGlmICh0eXBlb2YgbW9uZ29PcHRpb25TdHIgIT09ICd1bmRlZmluZWQnKSB7XG5cdFx0Y29uc3QganNvbk1vbmdvT3B0aW9ucyA9IEpTT04ucGFyc2UobW9uZ29PcHRpb25TdHIpO1xuXG5cdFx0bW9uZ29PcHRpb25zID0gT2JqZWN0LmFzc2lnbih7fSwgbW9uZ29PcHRpb25zLCBqc29uTW9uZ29PcHRpb25zKTtcblx0fVxuXHRNb25nby5zZXRDb25uZWN0aW9uT3B0aW9ucyhtb25nb09wdGlvbnMpO1xufVxuXG5cbk1ldGVvci5hdXRvcnVuID0gVHJhY2tlci5hdXRvcnVuXG4iXX0=
