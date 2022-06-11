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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvczptZXRlb3ItZml4L2xpYi9hdXRvcnVuLmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zOm1ldGVvci1maXgvbGliL21ldGVvcl9maXguanMiXSwibmFtZXMiOlsiTWV0ZW9yIiwiYXV0b3J1biIsIlRyYWNrZXIiLCJNb25nbyIsIm1vZHVsZSIsImxpbmsiLCJ2IiwiaXNTZXJ2ZXIiLCJwcm9jZXNzIiwibm9EZXByZWNhdGlvbiIsIm1vbmdvT3B0aW9ucyIsInVzZVVuaWZpZWRUb3BvbG9neSIsImF1dG9SZWNvbm5lY3QiLCJ1bmRlZmluZWQiLCJyZWNvbm5lY3RUcmllcyIsIm1vbmdvT3B0aW9uU3RyIiwiZW52IiwiTU9OR09fT1BUSU9OUyIsImpzb25Nb25nb09wdGlvbnMiLCJKU09OIiwicGFyc2UiLCJPYmplY3QiLCJhc3NpZ24iLCJTVEVFRE9TX0NTRkxFX01BU1RFUl9LRVkiLCJTdGVlZG9zRmllbGRFbmNyeXB0aW9uU2hhcmVkQ29uc3RzIiwicmVxdWlyZSIsImtleVZhdWx0TmFtZXNwYWNlIiwiZ2V0S01TUHJvdmlkZXJzIiwia21zUHJvdmlkZXIiLCJlbmNyeXB0aW9uT3B0aW9ucyIsInVzZU5ld1VybFBhcnNlciIsIm1vbml0b3JDb21tYW5kcyIsImF1dG9FbmNyeXB0aW9uIiwia21zUHJvdmlkZXJzIiwiYnlwYXNzQXV0b0VuY3J5cHRpb24iLCJzZXRDb25uZWN0aW9uT3B0aW9ucyJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTs7Ozs7OztBQU9BQSxNQUFNLENBQUNDLE9BQVAsR0FBaUJDLE9BQU8sQ0FBQ0QsT0FBekIsQzs7Ozs7Ozs7Ozs7QUNQQSxJQUFJRSxLQUFKO0FBQVVDLE1BQU0sQ0FBQ0MsSUFBUCxDQUFZLGNBQVosRUFBMkI7QUFBQ0YsT0FBSyxDQUFDRyxDQUFELEVBQUc7QUFBQ0gsU0FBSyxHQUFDRyxDQUFOO0FBQVE7O0FBQWxCLENBQTNCLEVBQStDLENBQS9DOztBQVNWO0FBQ0E7QUFDQSxJQUFJTixNQUFNLENBQUNPLFFBQVgsRUFBcUI7QUFDcEJDLFNBQU8sQ0FBQ0MsYUFBUixHQUF3QixJQUF4QixDQURvQixDQUNVOztBQUM5QixNQUFJQyxZQUFZLEdBQUc7QUFDbEJDLHNCQUFrQixFQUFFLElBREY7QUFDUTtBQUMxQkMsaUJBQWEsRUFBRUMsU0FGRztBQUdsQkMsa0JBQWMsRUFBRUQ7QUFIRSxHQUFuQjtBQU1BLFFBQU1FLGNBQWMsR0FBR1AsT0FBTyxDQUFDUSxHQUFSLENBQVlDLGFBQW5DOztBQUNBLE1BQUksT0FBT0YsY0FBUCxLQUEwQixXQUE5QixFQUEyQztBQUMxQyxVQUFNRyxnQkFBZ0IsR0FBR0MsSUFBSSxDQUFDQyxLQUFMLENBQVdMLGNBQVgsQ0FBekI7QUFFQUwsZ0JBQVksR0FBR1csTUFBTSxDQUFDQyxNQUFQLENBQWMsRUFBZCxFQUFrQlosWUFBbEIsRUFBZ0NRLGdCQUFoQyxDQUFmO0FBQ0E7O0FBRUQsTUFBSVYsT0FBTyxDQUFDUSxHQUFSLENBQVlPLHdCQUFoQixFQUEwQztBQUN6QyxVQUFNO0FBQUVDO0FBQUYsUUFBeUNDLE9BQU8sQ0FBQyxtQkFBRCxDQUF0RDs7QUFDQSxVQUFNO0FBQUVDLHVCQUFGO0FBQXFCQztBQUFyQixRQUF5Q0gsa0NBQS9DO0FBQ0EsVUFBTUksV0FBVyxHQUFHRCxlQUFlLEVBQW5DO0FBQ0EsVUFBTUUsaUJBQWlCLEdBQUc7QUFDekJDLHFCQUFlLEVBQUUsSUFEUTtBQUV6Qm5CLHdCQUFrQixFQUFFLElBRks7QUFHekJvQixxQkFBZSxFQUFFLElBSFE7QUFJekJDLG9CQUFjLEVBQUU7QUFDZk4seUJBQWlCLEVBQUVBLGlCQURKO0FBRWZPLG9CQUFZLEVBQUVMLFdBRkM7QUFHZk0sNEJBQW9CLEVBQUU7QUFIUDtBQUpTLEtBQTFCO0FBVUF4QixnQkFBWSxHQUFHVyxNQUFNLENBQUNDLE1BQVAsQ0FBYyxFQUFkLEVBQWtCWixZQUFsQixFQUFnQ21CLGlCQUFoQyxDQUFmO0FBQ0E7O0FBRUQxQixPQUFLLENBQUNnQyxvQkFBTixDQUEyQnpCLFlBQTNCO0FBQ0EsQyIsImZpbGUiOiIvcGFja2FnZXMvc3RlZWRvc19tZXRlb3ItZml4LmpzIiwic291cmNlc0NvbnRlbnQiOlsiLypcbiAqIEBBdXRob3I6IGJhb3pob3V0YW9Ac3RlZWRvcy5jb21cbiAqIEBEYXRlOiAyMDIyLTA2LTExIDA5OjI5OjQyXG4gKiBATGFzdEVkaXRvcnM6IGJhb3pob3V0YW9Ac3RlZWRvcy5jb21cbiAqIEBMYXN0RWRpdFRpbWU6IDIwMjItMDYtMTEgMDk6Mjk6NDhcbiAqIEBEZXNjcmlwdGlvbjogXG4gKi9cbk1ldGVvci5hdXRvcnVuID0gVHJhY2tlci5hdXRvcnVuIiwiLypcbiAqIEBBdXRob3I6IHN1bmhhb2xpbkBob3RvYS5jb21cbiAqIEBEYXRlOiAyMDIxLTA1LTI0IDEyOjMyOjU2XG4gKiBATGFzdEVkaXRvcnM6IGJhb3pob3V0YW9Ac3RlZWRvcy5jb21cbiAqIEBMYXN0RWRpdFRpbWU6IDIwMjItMDYtMTEgMDk6Mjk6NTRcbiAqIEBEZXNjcmlwdGlvbjogXG4gKi9cbmltcG9ydCB7IE1vbmdvIH0gZnJvbSAnbWV0ZW9yL21vbmdvJ1xuXG4vLyBSZXZlcnQgY2hhbmdlIGZyb20gTWV0ZW9yIDEuNi4xIHdobyBzZXQgaWdub3JlVW5kZWZpbmVkOiB0cnVlXG4vLyBtb3JlIGluZm9ybWF0aW9uIGh0dHBzOi8vZ2l0aHViLmNvbS9tZXRlb3IvbWV0ZW9yL3B1bGwvOTQ0NFxuaWYgKE1ldGVvci5pc1NlcnZlcikge1xuXHRwcm9jZXNzLm5vRGVwcmVjYXRpb24gPSB0cnVlOyAvLyBzaWxlbmNlIGRlcHJlY2F0aW9uIHdhcm5pbmdzLCDnm7jlvZPkuo4gLS1uby1kZXByZWNhdGlvblxuXHRsZXQgbW9uZ29PcHRpb25zID0ge1xuXHRcdHVzZVVuaWZpZWRUb3BvbG9neTogdHJ1ZSwgLy8gUmVxdWlyZWQgdG8gc2lsZW5jZSBkZXByZWNhdGlvbiB3YXJuaW5nc1xuXHRcdGF1dG9SZWNvbm5lY3Q6IHVuZGVmaW5lZCxcblx0XHRyZWNvbm5lY3RUcmllczogdW5kZWZpbmVkXG5cdH07XG5cblx0Y29uc3QgbW9uZ29PcHRpb25TdHIgPSBwcm9jZXNzLmVudi5NT05HT19PUFRJT05TO1xuXHRpZiAodHlwZW9mIG1vbmdvT3B0aW9uU3RyICE9PSAndW5kZWZpbmVkJykge1xuXHRcdGNvbnN0IGpzb25Nb25nb09wdGlvbnMgPSBKU09OLnBhcnNlKG1vbmdvT3B0aW9uU3RyKTtcblxuXHRcdG1vbmdvT3B0aW9ucyA9IE9iamVjdC5hc3NpZ24oe30sIG1vbmdvT3B0aW9ucywganNvbk1vbmdvT3B0aW9ucyk7XG5cdH1cblxuXHRpZiAocHJvY2Vzcy5lbnYuU1RFRURPU19DU0ZMRV9NQVNURVJfS0VZKSB7XG5cdFx0Y29uc3QgeyBTdGVlZG9zRmllbGRFbmNyeXB0aW9uU2hhcmVkQ29uc3RzIH0gPSByZXF1aXJlKCdAc3RlZWRvcy9vYmplY3RxbCcpO1xuXHRcdGNvbnN0IHsga2V5VmF1bHROYW1lc3BhY2UsIGdldEtNU1Byb3ZpZGVycyB9ID0gU3RlZWRvc0ZpZWxkRW5jcnlwdGlvblNoYXJlZENvbnN0cztcblx0XHRjb25zdCBrbXNQcm92aWRlciA9IGdldEtNU1Byb3ZpZGVycygpO1xuXHRcdGNvbnN0IGVuY3J5cHRpb25PcHRpb25zID0ge1xuXHRcdFx0dXNlTmV3VXJsUGFyc2VyOiB0cnVlLFxuXHRcdFx0dXNlVW5pZmllZFRvcG9sb2d5OiB0cnVlLFxuXHRcdFx0bW9uaXRvckNvbW1hbmRzOiB0cnVlLFxuXHRcdFx0YXV0b0VuY3J5cHRpb246IHtcblx0XHRcdFx0a2V5VmF1bHROYW1lc3BhY2U6IGtleVZhdWx0TmFtZXNwYWNlLFxuXHRcdFx0XHRrbXNQcm92aWRlcnM6IGttc1Byb3ZpZGVyLFxuXHRcdFx0XHRieXBhc3NBdXRvRW5jcnlwdGlvbjogdHJ1ZSxcblx0XHRcdH1cblx0XHR9XG5cdFx0bW9uZ29PcHRpb25zID0gT2JqZWN0LmFzc2lnbih7fSwgbW9uZ29PcHRpb25zLCBlbmNyeXB0aW9uT3B0aW9ucyk7XG5cdH1cblxuXHRNb25nby5zZXRDb25uZWN0aW9uT3B0aW9ucyhtb25nb09wdGlvbnMpO1xufVxuIl19
