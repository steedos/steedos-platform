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

var require = meteorInstall({"node_modules":{"meteor":{"steedos:meteor-fix":{"lib":{"autorun.js":function module(){

////////////////////////////////////////////////////////////////////////////////////////
//                                                                                    //
// packages/steedos_meteor-fix/lib/autorun.js                                         //
//                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////
                                                                                      //
/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-06-11 09:29:42
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2022-06-11 09:29:48
 * @Description: 
 */
Meteor.autorun = Tracker.autorun;
////////////////////////////////////////////////////////////////////////////////////////

},"meteor_fix.js":function module(require,exports,module){

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
      getMongoFieldEncryptionConsts
    } = require('@steedos/objectql');

    const {
      keyVaultNamespace,
      getKMSProviders
    } = getMongoFieldEncryptionConsts();
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
////////////////////////////////////////////////////////////////////////////////////////

}}}}}},{
  "extensions": [
    ".js",
    ".json"
  ]
});

require("/node_modules/meteor/steedos:meteor-fix/lib/autorun.js");
require("/node_modules/meteor/steedos:meteor-fix/lib/meteor_fix.js");

/* Exports */
Package._define("steedos:meteor-fix");

})();

//# sourceURL=meteor://💻app/packages/steedos_meteor-fix.js
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvczptZXRlb3ItZml4L2xpYi9hdXRvcnVuLmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zOm1ldGVvci1maXgvbGliL21ldGVvcl9maXguanMiXSwibmFtZXMiOlsiTWV0ZW9yIiwiYXV0b3J1biIsIlRyYWNrZXIiLCJNb25nbyIsIm1vZHVsZSIsImxpbmsiLCJ2IiwiaXNTZXJ2ZXIiLCJwcm9jZXNzIiwibm9EZXByZWNhdGlvbiIsIm1vbmdvT3B0aW9ucyIsInVzZVVuaWZpZWRUb3BvbG9neSIsImF1dG9SZWNvbm5lY3QiLCJ1bmRlZmluZWQiLCJyZWNvbm5lY3RUcmllcyIsIm1vbmdvT3B0aW9uU3RyIiwiZW52IiwiTU9OR09fT1BUSU9OUyIsImpzb25Nb25nb09wdGlvbnMiLCJKU09OIiwicGFyc2UiLCJPYmplY3QiLCJhc3NpZ24iLCJTVEVFRE9TX0NTRkxFX01BU1RFUl9LRVkiLCJnZXRNb25nb0ZpZWxkRW5jcnlwdGlvbkNvbnN0cyIsInJlcXVpcmUiLCJrZXlWYXVsdE5hbWVzcGFjZSIsImdldEtNU1Byb3ZpZGVycyIsImttc1Byb3ZpZGVyIiwiZW5jcnlwdGlvbk9wdGlvbnMiLCJ1c2VOZXdVcmxQYXJzZXIiLCJtb25pdG9yQ29tbWFuZHMiLCJhdXRvRW5jcnlwdGlvbiIsImttc1Byb3ZpZGVycyIsImJ5cGFzc0F1dG9FbmNyeXB0aW9uIiwic2V0Q29ubmVjdGlvbk9wdGlvbnMiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7Ozs7Ozs7QUFPQUEsTUFBTSxDQUFDQyxPQUFQLEdBQWlCQyxPQUFPLENBQUNELE9BQXpCLEM7Ozs7Ozs7Ozs7O0FDUEEsSUFBSUUsS0FBSjtBQUFVQyxNQUFNLENBQUNDLElBQVAsQ0FBWSxjQUFaLEVBQTJCO0FBQUNGLE9BQUssQ0FBQ0csQ0FBRCxFQUFHO0FBQUNILFNBQUssR0FBQ0csQ0FBTjtBQUFROztBQUFsQixDQUEzQixFQUErQyxDQUEvQzs7QUFTVjtBQUNBO0FBQ0EsSUFBSU4sTUFBTSxDQUFDTyxRQUFYLEVBQXFCO0FBQ3BCQyxTQUFPLENBQUNDLGFBQVIsR0FBd0IsSUFBeEIsQ0FEb0IsQ0FDVTs7QUFDOUIsTUFBSUMsWUFBWSxHQUFHO0FBQ2xCQyxzQkFBa0IsRUFBRSxJQURGO0FBQ1E7QUFDMUJDLGlCQUFhLEVBQUVDLFNBRkc7QUFHbEJDLGtCQUFjLEVBQUVEO0FBSEUsR0FBbkI7QUFNQSxRQUFNRSxjQUFjLEdBQUdQLE9BQU8sQ0FBQ1EsR0FBUixDQUFZQyxhQUFuQzs7QUFDQSxNQUFJLE9BQU9GLGNBQVAsS0FBMEIsV0FBOUIsRUFBMkM7QUFDMUMsVUFBTUcsZ0JBQWdCLEdBQUdDLElBQUksQ0FBQ0MsS0FBTCxDQUFXTCxjQUFYLENBQXpCO0FBRUFMLGdCQUFZLEdBQUdXLE1BQU0sQ0FBQ0MsTUFBUCxDQUFjLEVBQWQsRUFBa0JaLFlBQWxCLEVBQWdDUSxnQkFBaEMsQ0FBZjtBQUNBOztBQUVELE1BQUlWLE9BQU8sQ0FBQ1EsR0FBUixDQUFZTyx3QkFBaEIsRUFBMEM7QUFDekMsVUFBTTtBQUFFQztBQUFGLFFBQW9DQyxPQUFPLENBQUMsbUJBQUQsQ0FBakQ7O0FBQ0EsVUFBTTtBQUFFQyx1QkFBRjtBQUFxQkM7QUFBckIsUUFBeUNILDZCQUE2QixFQUE1RTtBQUNBLFVBQU1JLFdBQVcsR0FBR0QsZUFBZSxFQUFuQztBQUNBLFVBQU1FLGlCQUFpQixHQUFHO0FBQ3pCQyxxQkFBZSxFQUFFLElBRFE7QUFFekJuQix3QkFBa0IsRUFBRSxJQUZLO0FBR3pCb0IscUJBQWUsRUFBRSxJQUhRO0FBSXpCQyxvQkFBYyxFQUFFO0FBQ2ZOLHlCQUFpQixFQUFFQSxpQkFESjtBQUVmTyxvQkFBWSxFQUFFTCxXQUZDO0FBR2ZNLDRCQUFvQixFQUFFO0FBSFA7QUFKUyxLQUExQjtBQVVBeEIsZ0JBQVksR0FBR1csTUFBTSxDQUFDQyxNQUFQLENBQWMsRUFBZCxFQUFrQlosWUFBbEIsRUFBZ0NtQixpQkFBaEMsQ0FBZjtBQUNBOztBQUVEMUIsT0FBSyxDQUFDZ0Msb0JBQU4sQ0FBMkJ6QixZQUEzQjtBQUNBLEMiLCJmaWxlIjoiL3BhY2thZ2VzL3N0ZWVkb3NfbWV0ZW9yLWZpeC5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qXG4gKiBAQXV0aG9yOiBiYW96aG91dGFvQHN0ZWVkb3MuY29tXG4gKiBARGF0ZTogMjAyMi0wNi0xMSAwOToyOTo0MlxuICogQExhc3RFZGl0b3JzOiBiYW96aG91dGFvQHN0ZWVkb3MuY29tXG4gKiBATGFzdEVkaXRUaW1lOiAyMDIyLTA2LTExIDA5OjI5OjQ4XG4gKiBARGVzY3JpcHRpb246IFxuICovXG5NZXRlb3IuYXV0b3J1biA9IFRyYWNrZXIuYXV0b3J1biIsIi8qXG4gKiBAQXV0aG9yOiBzdW5oYW9saW5AaG90b2EuY29tXG4gKiBARGF0ZTogMjAyMS0wNS0yNCAxMjozMjo1NlxuICogQExhc3RFZGl0b3JzOiBzdW5oYW9saW5AaG90b2EuY29tXG4gKiBATGFzdEVkaXRUaW1lOiAyMDIyLTA2LTIxIDE1OjMzOjUzXG4gKiBARGVzY3JpcHRpb246IFxuICovXG5pbXBvcnQgeyBNb25nbyB9IGZyb20gJ21ldGVvci9tb25nbydcblxuLy8gUmV2ZXJ0IGNoYW5nZSBmcm9tIE1ldGVvciAxLjYuMSB3aG8gc2V0IGlnbm9yZVVuZGVmaW5lZDogdHJ1ZVxuLy8gbW9yZSBpbmZvcm1hdGlvbiBodHRwczovL2dpdGh1Yi5jb20vbWV0ZW9yL21ldGVvci9wdWxsLzk0NDRcbmlmIChNZXRlb3IuaXNTZXJ2ZXIpIHtcblx0cHJvY2Vzcy5ub0RlcHJlY2F0aW9uID0gdHJ1ZTsgLy8gc2lsZW5jZSBkZXByZWNhdGlvbiB3YXJuaW5ncywg55u45b2T5LqOIC0tbm8tZGVwcmVjYXRpb25cblx0bGV0IG1vbmdvT3B0aW9ucyA9IHtcblx0XHR1c2VVbmlmaWVkVG9wb2xvZ3k6IHRydWUsIC8vIFJlcXVpcmVkIHRvIHNpbGVuY2UgZGVwcmVjYXRpb24gd2FybmluZ3Ncblx0XHRhdXRvUmVjb25uZWN0OiB1bmRlZmluZWQsXG5cdFx0cmVjb25uZWN0VHJpZXM6IHVuZGVmaW5lZFxuXHR9O1xuXG5cdGNvbnN0IG1vbmdvT3B0aW9uU3RyID0gcHJvY2Vzcy5lbnYuTU9OR09fT1BUSU9OUztcblx0aWYgKHR5cGVvZiBtb25nb09wdGlvblN0ciAhPT0gJ3VuZGVmaW5lZCcpIHtcblx0XHRjb25zdCBqc29uTW9uZ29PcHRpb25zID0gSlNPTi5wYXJzZShtb25nb09wdGlvblN0cik7XG5cblx0XHRtb25nb09wdGlvbnMgPSBPYmplY3QuYXNzaWduKHt9LCBtb25nb09wdGlvbnMsIGpzb25Nb25nb09wdGlvbnMpO1xuXHR9XG5cblx0aWYgKHByb2Nlc3MuZW52LlNURUVET1NfQ1NGTEVfTUFTVEVSX0tFWSkge1xuXHRcdGNvbnN0IHsgZ2V0TW9uZ29GaWVsZEVuY3J5cHRpb25Db25zdHMgfSA9IHJlcXVpcmUoJ0BzdGVlZG9zL29iamVjdHFsJyk7XG5cdFx0Y29uc3QgeyBrZXlWYXVsdE5hbWVzcGFjZSwgZ2V0S01TUHJvdmlkZXJzIH0gPSBnZXRNb25nb0ZpZWxkRW5jcnlwdGlvbkNvbnN0cygpO1xuXHRcdGNvbnN0IGttc1Byb3ZpZGVyID0gZ2V0S01TUHJvdmlkZXJzKCk7XG5cdFx0Y29uc3QgZW5jcnlwdGlvbk9wdGlvbnMgPSB7XG5cdFx0XHR1c2VOZXdVcmxQYXJzZXI6IHRydWUsXG5cdFx0XHR1c2VVbmlmaWVkVG9wb2xvZ3k6IHRydWUsXG5cdFx0XHRtb25pdG9yQ29tbWFuZHM6IHRydWUsXG5cdFx0XHRhdXRvRW5jcnlwdGlvbjoge1xuXHRcdFx0XHRrZXlWYXVsdE5hbWVzcGFjZToga2V5VmF1bHROYW1lc3BhY2UsXG5cdFx0XHRcdGttc1Byb3ZpZGVyczoga21zUHJvdmlkZXIsXG5cdFx0XHRcdGJ5cGFzc0F1dG9FbmNyeXB0aW9uOiB0cnVlLFxuXHRcdFx0fVxuXHRcdH1cblx0XHRtb25nb09wdGlvbnMgPSBPYmplY3QuYXNzaWduKHt9LCBtb25nb09wdGlvbnMsIGVuY3J5cHRpb25PcHRpb25zKTtcblx0fVxuXG5cdE1vbmdvLnNldENvbm5lY3Rpb25PcHRpb25zKG1vbmdvT3B0aW9ucyk7XG59XG4iXX0=
