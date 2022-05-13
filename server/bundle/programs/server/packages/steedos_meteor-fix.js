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

  if (process.env.STEEDOS_CSFLE_MASTER_KEY) {
    const {
      SteedosFieldEncryptionSharedConsts
    } = require('@steedos/objectql');

    const {
      keyVaultNamespace,
      getKMSProviders
    } = SteedosFieldEncryptionSharedConsts;
    const kmsProvider = getKMSProviders();
    const encryptionOptions = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      monitorCommands: true,
      autoEncryption: {
        keyVaultNamespace: keyVaultNamespace,
        kmsProviders: kmsProvider,
        bypassAutoEncryption: true
      }
    };
    mongoOptions = Object.assign({}, mongoOptions, encryptionOptions);
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvczptZXRlb3ItZml4L2xpYi9tZXRlb3JfZml4LmpzIl0sIm5hbWVzIjpbIk1vbmdvIiwibW9kdWxlIiwibGluayIsInYiLCJNZXRlb3IiLCJpc1NlcnZlciIsInByb2Nlc3MiLCJub0RlcHJlY2F0aW9uIiwibW9uZ29PcHRpb25zIiwidXNlVW5pZmllZFRvcG9sb2d5IiwiYXV0b1JlY29ubmVjdCIsInVuZGVmaW5lZCIsInJlY29ubmVjdFRyaWVzIiwibW9uZ29PcHRpb25TdHIiLCJlbnYiLCJNT05HT19PUFRJT05TIiwianNvbk1vbmdvT3B0aW9ucyIsIkpTT04iLCJwYXJzZSIsIk9iamVjdCIsImFzc2lnbiIsIlNURUVET1NfQ1NGTEVfTUFTVEVSX0tFWSIsIlN0ZWVkb3NGaWVsZEVuY3J5cHRpb25TaGFyZWRDb25zdHMiLCJyZXF1aXJlIiwia2V5VmF1bHROYW1lc3BhY2UiLCJnZXRLTVNQcm92aWRlcnMiLCJrbXNQcm92aWRlciIsImVuY3J5cHRpb25PcHRpb25zIiwidXNlTmV3VXJsUGFyc2VyIiwibW9uaXRvckNvbW1hbmRzIiwiYXV0b0VuY3J5cHRpb24iLCJrbXNQcm92aWRlcnMiLCJieXBhc3NBdXRvRW5jcnlwdGlvbiIsInNldENvbm5lY3Rpb25PcHRpb25zIiwiYXV0b3J1biIsIlRyYWNrZXIiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUEsSUFBSUEsS0FBSjtBQUFVQyxNQUFNLENBQUNDLElBQVAsQ0FBWSxjQUFaLEVBQTJCO0FBQUNGLE9BQUssQ0FBQ0csQ0FBRCxFQUFHO0FBQUNILFNBQUssR0FBQ0csQ0FBTjtBQUFROztBQUFsQixDQUEzQixFQUErQyxDQUEvQzs7QUFTVjtBQUNBO0FBQ0EsSUFBSUMsTUFBTSxDQUFDQyxRQUFYLEVBQXFCO0FBQ3BCQyxTQUFPLENBQUNDLGFBQVIsR0FBd0IsSUFBeEIsQ0FEb0IsQ0FDVTs7QUFDOUIsTUFBSUMsWUFBWSxHQUFHO0FBQ2xCQyxzQkFBa0IsRUFBRSxJQURGO0FBQ1E7QUFDMUJDLGlCQUFhLEVBQUVDLFNBRkc7QUFHbEJDLGtCQUFjLEVBQUVEO0FBSEUsR0FBbkI7QUFNQSxRQUFNRSxjQUFjLEdBQUdQLE9BQU8sQ0FBQ1EsR0FBUixDQUFZQyxhQUFuQzs7QUFDQSxNQUFJLE9BQU9GLGNBQVAsS0FBMEIsV0FBOUIsRUFBMkM7QUFDMUMsVUFBTUcsZ0JBQWdCLEdBQUdDLElBQUksQ0FBQ0MsS0FBTCxDQUFXTCxjQUFYLENBQXpCO0FBRUFMLGdCQUFZLEdBQUdXLE1BQU0sQ0FBQ0MsTUFBUCxDQUFjLEVBQWQsRUFBa0JaLFlBQWxCLEVBQWdDUSxnQkFBaEMsQ0FBZjtBQUNBOztBQUVELE1BQUlWLE9BQU8sQ0FBQ1EsR0FBUixDQUFZTyx3QkFBaEIsRUFBMEM7QUFDekMsVUFBTTtBQUFFQztBQUFGLFFBQXlDQyxPQUFPLENBQUMsbUJBQUQsQ0FBdEQ7O0FBQ0EsVUFBTTtBQUFFQyx1QkFBRjtBQUFxQkM7QUFBckIsUUFBeUNILGtDQUEvQztBQUNBLFVBQU1JLFdBQVcsR0FBR0QsZUFBZSxFQUFuQztBQUNBLFVBQU1FLGlCQUFpQixHQUFHO0FBQ3pCQyxxQkFBZSxFQUFFLElBRFE7QUFFekJuQix3QkFBa0IsRUFBRSxJQUZLO0FBR3pCb0IscUJBQWUsRUFBRSxJQUhRO0FBSXpCQyxvQkFBYyxFQUFFO0FBQ2ZOLHlCQUFpQixFQUFFQSxpQkFESjtBQUVmTyxvQkFBWSxFQUFFTCxXQUZDO0FBR2ZNLDRCQUFvQixFQUFFO0FBSFA7QUFKUyxLQUExQjtBQVVBeEIsZ0JBQVksR0FBR1csTUFBTSxDQUFDQyxNQUFQLENBQWMsRUFBZCxFQUFrQlosWUFBbEIsRUFBZ0NtQixpQkFBaEMsQ0FBZjtBQUNBOztBQUVEM0IsT0FBSyxDQUFDaUMsb0JBQU4sQ0FBMkJ6QixZQUEzQjtBQUNBOztBQUdESixNQUFNLENBQUM4QixPQUFQLEdBQWlCQyxPQUFPLENBQUNELE9BQXpCLEMiLCJmaWxlIjoiL3BhY2thZ2VzL3N0ZWVkb3NfbWV0ZW9yLWZpeC5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qXG4gKiBAQXV0aG9yOiBzdW5oYW9saW5AaG90b2EuY29tXG4gKiBARGF0ZTogMjAyMS0wNS0yNCAxMjozMjo1NlxuICogQExhc3RFZGl0b3JzOiBzdW5oYW9saW5AaG90b2EuY29tXG4gKiBATGFzdEVkaXRUaW1lOiAyMDIyLTA1LTEzIDE0OjU1OjM3XG4gKiBARGVzY3JpcHRpb246IFxuICovXG5pbXBvcnQgeyBNb25nbyB9IGZyb20gJ21ldGVvci9tb25nbydcblxuLy8gUmV2ZXJ0IGNoYW5nZSBmcm9tIE1ldGVvciAxLjYuMSB3aG8gc2V0IGlnbm9yZVVuZGVmaW5lZDogdHJ1ZVxuLy8gbW9yZSBpbmZvcm1hdGlvbiBodHRwczovL2dpdGh1Yi5jb20vbWV0ZW9yL21ldGVvci9wdWxsLzk0NDRcbmlmIChNZXRlb3IuaXNTZXJ2ZXIpIHtcblx0cHJvY2Vzcy5ub0RlcHJlY2F0aW9uID0gdHJ1ZTsgLy8gc2lsZW5jZSBkZXByZWNhdGlvbiB3YXJuaW5ncywg55u45b2T5LqOIC0tbm8tZGVwcmVjYXRpb25cblx0bGV0IG1vbmdvT3B0aW9ucyA9IHtcblx0XHR1c2VVbmlmaWVkVG9wb2xvZ3k6IHRydWUsIC8vIFJlcXVpcmVkIHRvIHNpbGVuY2UgZGVwcmVjYXRpb24gd2FybmluZ3Ncblx0XHRhdXRvUmVjb25uZWN0OiB1bmRlZmluZWQsXG5cdFx0cmVjb25uZWN0VHJpZXM6IHVuZGVmaW5lZFxuXHR9O1xuXG5cdGNvbnN0IG1vbmdvT3B0aW9uU3RyID0gcHJvY2Vzcy5lbnYuTU9OR09fT1BUSU9OUztcblx0aWYgKHR5cGVvZiBtb25nb09wdGlvblN0ciAhPT0gJ3VuZGVmaW5lZCcpIHtcblx0XHRjb25zdCBqc29uTW9uZ29PcHRpb25zID0gSlNPTi5wYXJzZShtb25nb09wdGlvblN0cik7XG5cblx0XHRtb25nb09wdGlvbnMgPSBPYmplY3QuYXNzaWduKHt9LCBtb25nb09wdGlvbnMsIGpzb25Nb25nb09wdGlvbnMpO1xuXHR9XG5cblx0aWYgKHByb2Nlc3MuZW52LlNURUVET1NfQ1NGTEVfTUFTVEVSX0tFWSkge1xuXHRcdGNvbnN0IHsgU3RlZWRvc0ZpZWxkRW5jcnlwdGlvblNoYXJlZENvbnN0cyB9ID0gcmVxdWlyZSgnQHN0ZWVkb3Mvb2JqZWN0cWwnKTtcblx0XHRjb25zdCB7IGtleVZhdWx0TmFtZXNwYWNlLCBnZXRLTVNQcm92aWRlcnMgfSA9IFN0ZWVkb3NGaWVsZEVuY3J5cHRpb25TaGFyZWRDb25zdHM7XG5cdFx0Y29uc3Qga21zUHJvdmlkZXIgPSBnZXRLTVNQcm92aWRlcnMoKTtcblx0XHRjb25zdCBlbmNyeXB0aW9uT3B0aW9ucyA9IHtcblx0XHRcdHVzZU5ld1VybFBhcnNlcjogdHJ1ZSxcblx0XHRcdHVzZVVuaWZpZWRUb3BvbG9neTogdHJ1ZSxcblx0XHRcdG1vbml0b3JDb21tYW5kczogdHJ1ZSxcblx0XHRcdGF1dG9FbmNyeXB0aW9uOiB7XG5cdFx0XHRcdGtleVZhdWx0TmFtZXNwYWNlOiBrZXlWYXVsdE5hbWVzcGFjZSxcblx0XHRcdFx0a21zUHJvdmlkZXJzOiBrbXNQcm92aWRlcixcblx0XHRcdFx0YnlwYXNzQXV0b0VuY3J5cHRpb246IHRydWUsXG5cdFx0XHR9XG5cdFx0fVxuXHRcdG1vbmdvT3B0aW9ucyA9IE9iamVjdC5hc3NpZ24oe30sIG1vbmdvT3B0aW9ucywgZW5jcnlwdGlvbk9wdGlvbnMpO1xuXHR9XG5cblx0TW9uZ28uc2V0Q29ubmVjdGlvbk9wdGlvbnMobW9uZ29PcHRpb25zKTtcbn1cblxuXG5NZXRlb3IuYXV0b3J1biA9IFRyYWNrZXIuYXV0b3J1blxuIl19
