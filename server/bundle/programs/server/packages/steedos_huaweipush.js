(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var global = Package.meteor.global;
var meteorEnv = Package.meteor.meteorEnv;
var ECMAScript = Package.ecmascript.ECMAScript;
var check = Package.check.check;
var Match = Package.check.Match;
var _ = Package.underscore._;
var moment = Package['momentjs:moment'].moment;
var meteorInstall = Package.modules.meteorInstall;
var Promise = Package.promise.Promise;

/* Package-scope variables */
var HuaweiPush;

var require = meteorInstall({"node_modules":{"meteor":{"steedos:huaweipush":{"checkNpm.js":function module(require,exports,module){

///////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                   //
// packages/steedos_huaweipush/checkNpm.js                                                           //
//                                                                                                   //
///////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                     //
let checkNpmVersions;
module.link("meteor/tmeasday:check-npm-versions", {
  checkNpmVersions(v) {
    checkNpmVersions = v;
  }

}, 0);
///////////////////////////////////////////////////////////////////////////////////////////////////////

},"server":{"huaweiProvider.js":function module(require){

///////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                   //
// packages/steedos_huaweipush/server/huaweiProvider.js                                              //
//                                                                                                   //
///////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                     //
const request = require('requestretry');

const tokenUrl = "https://login.vmall.com/oauth2/token";
const apiUrl = "https://api.push.hicloud.com/pushsend.do";
const timeout = 5000;
HuaweiPush = {
  authInfo: {},
  default_package_name: undefined
};

HuaweiPush.config = function (config) {
  config.forEach(val => {
    if (this.authInfo[val.package_name]) return;
    this.authInfo[val.package_name] = val;
    val.access_token_expire = 0;

    if (!this.default_package_name) {
      this.default_package_name = val.package_name;
      if (HuaweiPush.debug) console.info('huawei default package name ', this.default_package_name);
    }
  });
};

HuaweiPush.sendMany = function (notification, tokenDataList, timeToLive) {
  if (notification.android.title) {
    const mapTokenData = {};

    for (const tokenData of tokenDataList) {
      const package_name = tokenData.package_name || this.default_package_name;

      if (!this.authInfo[package_name]) {
        console.error('huawei package name not supported: ', package_name);
        continue;
      }

      const tokenList = mapTokenData[package_name] || [];
      tokenList.push(tokenData.token);
      mapTokenData[package_name] = tokenList;
    }

    for (const package_name in mapTokenData) {
      this.doSendMany(notification, package_name, mapTokenData[package_name], timeToLive);
    }
  }
};

HuaweiPush.doSendMany = function (notification, package_name, tokens, timeToLive) {
  this.checkToken(package_name, tokenError => {
    if (!tokenError) {
      if (HuaweiPush.debug) console.log("sendMany ", notification, timeToLive);
      const postData = this.getPostData(notification, package_name, tokens, timeToLive);
      request.post({
        url: apiUrl,
        qs: {
          nsp_ctx: "{\"ver\":1,\"appId\":\"".concat(this.authInfo[package_name].client_id, "\"}")
        },
        form: postData,
        timeout: timeout,
        maxAttempts: 2,
        retryDelay: 5000,
        time: true,
        retryStrategy: request.RetryStrategies.NetworkError
      }, (error, response, body) => {
        if (HuaweiPush.debug) console.log("sendMany result", error, body);

        if (!error && response && response.statusCode == 200) {
          if (HuaweiPush.debug) console.log("TODO: callback");
        } else {
          error = error || 'unknown error';
        }
      });
    }
  });
};

HuaweiPush.getPostData = function (notification, package_name, tokens, timeToLive) {
  const postData = {
    access_token: this.authInfo[package_name].access_token,
    nsp_svc: "openpush.message.api.send",
    nsp_ts: Math.floor(Date.now() / 1000)
  };
  postData.payload = {
    hps: {
      msg: {
        type: 3,
        body: {
          content: notification.android.message,
          title: notification.android.title
        },
        action: {
          type: 3,
          param: {
            appPkgName: package_name
          }
        }
      },
      ext: {
        customize: this.extras(notification.extras)
      }
    }
  };
  postData.payload = JSON.stringify(postData.payload);
  postData.device_token_list = JSON.stringify(tokens);

  if (timeToLive > 0) {
    postData.expire_time = this.formatHuaweiDate(new Date(Date.now() + timeToLive));
    if (HuaweiPush.debug) console.log("postData.expire_time ", postData.expire_time);
  }

  return postData;
};

HuaweiPush.sendAll = function (notification, timeToLive) {
  if (notification.android.title) {
    for (const package_name in this.authInfo) {
      console.log("TODO: sendAll");
    }
  }
};

HuaweiPush.checkToken = function (package_name, callback) {
  const authInfo = this.authInfo[package_name];

  if (authInfo.access_token && Date.now() < authInfo.access_token_expire) {
    callback();
  } else {
    if (HuaweiPush.debug) console.info("request token ", package_name, this.authInfo[package_name]);
    request.post({
      url: tokenUrl,
      form: {
        grant_type: "client_credentials",
        client_id: authInfo.client_id,
        client_secret: authInfo.client_secret
      },
      timeout: timeout,
      maxAttempts: 2,
      retryDelay: 5000,
      retryStrategy: request.RetryStrategies.NetworkError
    }, (error, response, body) => {
      if (!error) {
        const data = JSON.parse(body);
        authInfo.access_token = data.access_token;
        authInfo.access_token_expire = Date.now() + data.expires_in * 1000 - 60 * 1000;
        if (HuaweiPush.debug) console.info("get access token success", data);
        callback();
      } else {
        console.error("get access token error", body);
        callback(error);
      }
    });
  }
};

HuaweiPush.formatHuaweiDate = function (date) {
  return moment(date).format("YYYY-MM-DDTHH:mm");
};
/*
 * 用户自定义 dict
 * "extras":{"season":"Spring", "weather":"raining"}]
 */


HuaweiPush.extras = function (extras) {
  if (Array.isArray(extras)) return extras;
  var extraArray = [];

  if (extras) {
    var keys = Object.keys(extras);
    keys.forEach(function (key) {
      var v = {};
      v[key] = extras[key];
      extraArray.push(v);
    });
    extras = extraArray;
  }

  return extraArray;
};
///////////////////////////////////////////////////////////////////////////////////////////////////////

}}}}}},{
  "extensions": [
    ".js",
    ".json"
  ]
});

require("/node_modules/meteor/steedos:huaweipush/checkNpm.js");
require("/node_modules/meteor/steedos:huaweipush/server/huaweiProvider.js");

/* Exports */
Package._define("steedos:huaweipush", {
  HuaweiPush: HuaweiPush
});

})();

//# sourceURL=meteor://💻app/packages/steedos_huaweipush.js
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvczpodWF3ZWlwdXNoL2NoZWNrTnBtLmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zOmh1YXdlaXB1c2gvc2VydmVyL2h1YXdlaVByb3ZpZGVyLmpzIl0sIm5hbWVzIjpbImNoZWNrTnBtVmVyc2lvbnMiLCJtb2R1bGUiLCJsaW5rIiwidiIsInJlcXVlc3QiLCJyZXF1aXJlIiwidG9rZW5VcmwiLCJhcGlVcmwiLCJ0aW1lb3V0IiwiSHVhd2VpUHVzaCIsImF1dGhJbmZvIiwiZGVmYXVsdF9wYWNrYWdlX25hbWUiLCJ1bmRlZmluZWQiLCJjb25maWciLCJmb3JFYWNoIiwidmFsIiwicGFja2FnZV9uYW1lIiwiYWNjZXNzX3Rva2VuX2V4cGlyZSIsImRlYnVnIiwiY29uc29sZSIsImluZm8iLCJzZW5kTWFueSIsIm5vdGlmaWNhdGlvbiIsInRva2VuRGF0YUxpc3QiLCJ0aW1lVG9MaXZlIiwiYW5kcm9pZCIsInRpdGxlIiwibWFwVG9rZW5EYXRhIiwidG9rZW5EYXRhIiwiZXJyb3IiLCJ0b2tlbkxpc3QiLCJwdXNoIiwidG9rZW4iLCJkb1NlbmRNYW55IiwidG9rZW5zIiwiY2hlY2tUb2tlbiIsInRva2VuRXJyb3IiLCJsb2ciLCJwb3N0RGF0YSIsImdldFBvc3REYXRhIiwicG9zdCIsInVybCIsInFzIiwibnNwX2N0eCIsImNsaWVudF9pZCIsImZvcm0iLCJtYXhBdHRlbXB0cyIsInJldHJ5RGVsYXkiLCJ0aW1lIiwicmV0cnlTdHJhdGVneSIsIlJldHJ5U3RyYXRlZ2llcyIsIk5ldHdvcmtFcnJvciIsInJlc3BvbnNlIiwiYm9keSIsInN0YXR1c0NvZGUiLCJhY2Nlc3NfdG9rZW4iLCJuc3Bfc3ZjIiwibnNwX3RzIiwiTWF0aCIsImZsb29yIiwiRGF0ZSIsIm5vdyIsInBheWxvYWQiLCJocHMiLCJtc2ciLCJ0eXBlIiwiY29udGVudCIsIm1lc3NhZ2UiLCJhY3Rpb24iLCJwYXJhbSIsImFwcFBrZ05hbWUiLCJleHQiLCJjdXN0b21pemUiLCJleHRyYXMiLCJKU09OIiwic3RyaW5naWZ5IiwiZGV2aWNlX3Rva2VuX2xpc3QiLCJleHBpcmVfdGltZSIsImZvcm1hdEh1YXdlaURhdGUiLCJzZW5kQWxsIiwiY2FsbGJhY2siLCJncmFudF90eXBlIiwiY2xpZW50X3NlY3JldCIsImRhdGEiLCJwYXJzZSIsImV4cGlyZXNfaW4iLCJkYXRlIiwibW9tZW50IiwiZm9ybWF0IiwiQXJyYXkiLCJpc0FycmF5IiwiZXh0cmFBcnJheSIsImtleXMiLCJPYmplY3QiLCJrZXkiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSxJQUFJQSxnQkFBSjtBQUFxQkMsTUFBTSxDQUFDQyxJQUFQLENBQVksb0NBQVosRUFBaUQ7QUFBQ0Ysa0JBQWdCLENBQUNHLENBQUQsRUFBRztBQUFDSCxvQkFBZ0IsR0FBQ0csQ0FBakI7QUFBbUI7O0FBQXhDLENBQWpELEVBQTJGLENBQTNGLEU7Ozs7Ozs7Ozs7O0FDQXJCLE1BQU1DLE9BQU8sR0FBR0MsT0FBTyxDQUFDLGNBQUQsQ0FBdkI7O0FBQ0EsTUFBTUMsUUFBUSxHQUFHLHNDQUFqQjtBQUNBLE1BQU1DLE1BQU0sR0FBRywwQ0FBZjtBQUNBLE1BQU1DLE9BQU8sR0FBRyxJQUFoQjtBQUVBQyxVQUFVLEdBQUc7QUFDWkMsVUFBUSxFQUFFLEVBREU7QUFFWkMsc0JBQW9CLEVBQUVDO0FBRlYsQ0FBYjs7QUFLQUgsVUFBVSxDQUFDSSxNQUFYLEdBQW9CLFVBQVNBLE1BQVQsRUFBaUI7QUFDcENBLFFBQU0sQ0FBQ0MsT0FBUCxDQUFnQkMsR0FBRCxJQUFTO0FBQ3ZCLFFBQUksS0FBS0wsUUFBTCxDQUFjSyxHQUFHLENBQUNDLFlBQWxCLENBQUosRUFDQztBQUNELFNBQUtOLFFBQUwsQ0FBY0ssR0FBRyxDQUFDQyxZQUFsQixJQUFrQ0QsR0FBbEM7QUFDQUEsT0FBRyxDQUFDRSxtQkFBSixHQUEwQixDQUExQjs7QUFDQSxRQUFJLENBQUMs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LE1BQUosRUFBWTtBQUNYLFFBQUltQixJQUFJLEdBQUdDLE1BQU0sQ0FBQ0QsSUFBUCxDQUFZbkIsTUFBWixDQUFYO0FBQ0FtQixRQUFJLENBQUM5RSxPQUFMLENBQWEsVUFBU2dGLEdBQVQsRUFBYztBQUMxQixVQUFJM0YsQ0FBQyxHQUFHLEVBQVI7QUFDQUEsT0FBQyxDQUFDMkYsR0FBRCxDQUFELEdBQVNyQixNQUFNLENBQUNxQixHQUFELENBQWY7QUFDQUgsZ0JBQVUsQ0FBQzVELElBQVgsQ0FBZ0I1QixDQUFoQjtBQUNBLEtBSkQ7QUFLQXNFLFVBQU0sR0FBR2tCLFVBQVQ7QUFDQTs7QUFDRCxTQUFPQSxVQUFQO0FBQ0EsQ0FmRCxDIiwiZmlsZSI6Ii9wYWNrYWdlcy9zdGVlZG9zX2h1YXdlaXB1c2guanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBjaGVja05wbVZlcnNpb25zIH0gZnJvbSAnbWV0ZW9yL3RtZWFzZGF5OmNoZWNrLW5wbS12ZXJzaW9ucyc7XG4iLCJjb25zdCByZXF1ZXN0ID0gcmVxdWlyZSgncmVxdWVzdHJldHJ5Jyk7XG5jb25zdCB0b2tlblVybCA9IFwiaHR0cHM6Ly9sb2dpbi52bWFsbC5jb20vb2F1dGgyL3Rva2VuXCI7XG5jb25zdCBhcGlVcmwgPSBcImh0dHBzOi8vYXBpLnB1c2guaGljbG91ZC5jb20vcHVzaHNlbmQuZG9cIjtcbmNvbnN0IHRpbWVvdXQgPSA1MDAwO1xuXG5IdWF3ZWlQdXNoID0ge1xuXHRhdXRoSW5mbzoge30sXG5cdGRlZmF1bHRfcGFja2FnZV9uYW1lOiB1bmRlZmluZWRcbn07XG5cbkh1YXdlaVB1c2guY29uZmlnID0gZnVuY3Rpb24oY29uZmlnKSB7XG5cdGNvbmZpZy5mb3JFYWNoKCh2YWwpID0+IHtcblx0XHRpZiAodGhpcy5hdXRoSW5mb1t2YWwucGFja2FnZV9uYW1lXSlcblx0XHRcdHJldHVyblxuXHRcdHRoaXMuYXV0aEluZm9bdmFsLnBhY2thZ2VfbmFtZV0gPSB2YWw7XG5cdFx0dmFsLmFjY2Vzc190b2tlbl9leHBpcmUgPSAwO1xuXHRcdGlmICghdGhpcy5kZWZhdWx0X3BhY2thZ2VfbmFtZSkge1xuXHRcdFx0dGhpcy5kZWZhdWx0X3BhY2thZ2VfbmFtZSA9IHZhbC5wYWNrYWdlX25hbWU7XG5cdFx0XHRpZiAoSHVhd2VpUHVzaC5kZWJ1Zylcblx0XHRcdFx0Y29uc29sZS5pbmZvKCdodWF3ZWkgZGVmYXVsdCBwYWNrYWdlIG5hbWUgJywgdGhpcy5kZWZhdWx0X3BhY2thZ2VfbmFtZSk7XG5cdFx0fVxuXHR9KTtcbn1cblxuSHVhd2VpUHVzaC5zZW5kTWFueSA9IGZ1bmN0aW9uKG5vdGlmaWNhdGlvbiwgdG9rZW5EYXRhTGlzdCwgdGltZVRvTGl2ZSkge1xuXHRpZiAobm90aWZpY2F0aW9uLmFuZHJvaWQudGl0bGUpIHtcblx0XHRjb25zdCBtYXBUb2tlbkRhdGEgPSB7fTtcblx0XHRmb3IgKGNvbnN0IHRva2VuRGF0YSBvZiB0b2tlbkRhdGFMaXN0KSB7XG5cdFx0XHRjb25zdCBwYWNrYWdlX25hbWUgPSB0b2tlbkRhdGEucGFja2FnZV9uYW1lIHx8IHRoaXMuZGVmYXVsdF9wYWNrYWdlX25hbWU7XG5cdFx0XHRpZiAoIXRoaXMuYXV0aEluZm9bcGFja2FnZV9uYW1lXSkge1xuXHRcdFx0XHRjb25zb2xlLmVycm9yKCdodWF3ZWkgcGFja2FnZSBuYW1lIG5vdCBzdXBwb3J0ZWQ6ICcsIHBhY2thZ2VfbmFtZSk7XG5cdFx0XHRcdGNvbnRpbnVlO1xuXHRcdFx0fVxuXHRcdFx0Y29uc3QgdG9rZW5MaXN0ID0gbWFwVG9rZW5EYXRhW3BhY2thZ2VfbmFtZV0gfHwgW107XG5cdFx0XHR0b2tlbkxpc3QucHVzaCh0b2tlbkRhdGEudG9rZW4pO1xuXHRcdFx0bWFwVG9rZW5EYXRhW3BhY2thZ2VfbmFtZV0gPSB0b2tlbkxpc3Q7XG5cdFx0fVxuXG5cdFx0Zm9yIChjb25zdCBwYWNrYWdlX25hbWUgaW4gbWFwVG9rZW5EYXRhKSB7XG5cdFx0XHR0aGlzLmRvU2VuZE1hbnkobm90aWZpY2F0aW9uLCBwYWNrYWdlX25hbWUsIG1hcFRva2VuRGF0YVtwYWNrYWdlX25hbWVdLCB0aW1lVG9MaXZlKTtcblx0XHR9XG5cdH1cbn1cblxuSHVhd2VpUHVzaC5kb1NlbmRNYW55ID0gZnVuY3Rpb24obm90aWZpY2F0aW9uLCBwYWNrYWdlX25hbWUsIHRva2VucywgdGltZVRvTGl2ZSkge1xuXHR0aGlzLmNoZWNrVG9rZW4ocGFja2FnZV9uYW1lLCAodG9rZW5FcnJvcikgPT4ge1xuXHRcdGlmICghdG9rZW5FcnJvcikge1xuXHRcdFx0aWYgKEh1YXdlaVB1c2guZGVidWcpXG5cdFx0XHRcdGNvbnNvbGUubG9nKFwic2VuZE1hbnkgXCIsIG5vdGlmaWNhdGlvbiwgdGltZVRvTGl2ZSk7XG5cdFx0XHRjb25zdCBwb3N0RGF0YSA9IHRoaXMuZ2V0UG9zdERhdGEobm90aWZpY2F0aW9uLCBwYWNrYWdlX25hbWUsIHRva2VucywgdGltZVRvTGl2ZSk7XG5cdFx0XHRyZXF1ZXN0LnBvc3Qoe1xuXHRcdFx0XHR1cmw6IGFwaVVybCxcblx0XHRcdFx0cXM6IHtcblx0XHRcdFx0XHRuc3BfY3R4OiBge1widmVyXCI6MSxcImFwcElkXCI6XCIke3RoaXMuYXV0aEluZm9bcGFja2FnZV9uYW1lXS5jbGllbnRfaWR9XCJ9YFxuXHRcdFx0XHR9LFxuXHRcdFx0XHRmb3JtOiBwb3N0RGF0YSxcblx0XHRcdFx0dGltZW91dDogdGltZW91dCxcblx0XHRcdFx0bWF4QXR0ZW1wdHM6IDIsXG5cdFx0XHRcdHJldHJ5RGVsYXk6IDUwMDAsXG5cdFx0XHRcdHRpbWU6IHRydWUsXG5cdFx0XHRcdHJldHJ5U3RyYXRlZ3k6IHJlcXVlc3QuUmV0cnlTdHJhdGVnaWVzLk5ldHdvcmtFcnJvclxuXHRcdFx0fSwgKGVycm9yLCByZXNwb25zZSwgYm9keSkgPT4ge1xuXHRcdFx0XHRpZiAoSHVhd2VpUHVzaC5kZWJ1Zylcblx0XHRcdFx0XHRjb25zb2xlLmxvZyhcInNlbmRNYW55IHJlc3VsdFwiLCBlcnJvciwgYm9keSk7XG5cdFx0XHRcdGlmICghZXJyb3IgJiYgcmVzcG9uc2UgJiYgcmVzcG9uc2Uuc3RhdHVzQ29kZSA9PSAyMDApIHtcblx0XHRcdFx0XHRpZiAoSHVhd2VpUHVzaC5kZWJ1Zylcblx0XHRcdFx0XHRcdGNvbnNvbGUubG9nKFwiVE9ETzogY2FsbGJhY2tcIik7XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0ZXJyb3IgPSBlcnJvciB8fCAndW5rbm93biBlcnJvcic7XG5cdFx0XHRcdH1cblx0XHRcdH0pO1xuXHRcdH1cblx0fSk7XG59XG5cbkh1YXdlaVB1c2guZ2V0UG9zdERhdGEgPSBmdW5jdGlvbihub3RpZmljYXRpb24sIHBhY2thZ2VfbmFtZSwgdG9rZW5zLCB0aW1lVG9MaXZlKSB7XG5cdGNvbnN0IHBvc3REYXRhID0ge1xuXHRcdGFjY2Vzc190b2tlbjogdGhpcy5hdXRoSW5mb1twYWNrYWdlX25hbWVdLmFjY2Vzc190b2tlbixcblx0XHRuc3Bfc3ZjOiBcIm9wZW5wdXNoLm1lc3NhZ2UuYXBpLnNlbmRcIixcblx0XHRuc3BfdHM6IE1hdGguZmxvb3IoRGF0ZS5ub3coKSAvIDEwMDApXG5cdH07XG5cdHBvc3REYXRhLnBheWxvYWQgPSB7XG5cdFx0aHBzOiB7XG5cdFx0XHRtc2c6IHtcblx0XHRcdFx0dHlwZTogMyxcblx0XHRcdFx0Ym9keToge1xuXHRcdFx0XHRcdGNvbnRlbnQ6IG5vdGlmaWNhdGlvbi5hbmRyb2lkLm1lc3NhZ2UsXG5cdFx0XHRcdFx0dGl0bGU6IG5vdGlmaWNhdGlvbi5hbmRyb2lkLnRpdGxlXG5cdFx0XHRcdH0sXG5cdFx0XHRcdGFjdGlvbjoge1xuXHRcdFx0XHRcdHR5cGU6IDMsXG5cdFx0XHRcdFx0cGFyYW06IHtcblx0XHRcdFx0XHRcdGFwcFBrZ05hbWU6IHBhY2thZ2VfbmFtZVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fSxcblx0XHRcdGV4dDoge1xuXHRcdFx0XHRjdXN0b21pemU6IHRoaXMuZXh0cmFzKG5vdGlmaWNhdGlvbi5leHRyYXMpXG5cdFx0XHR9XG5cdFx0fVxuXHR9O1xuXHRwb3N0RGF0YS5wYXlsb2FkID0gSlNPTi5zdHJpbmdpZnkocG9zdERhdGEucGF5bG9hZCk7XG5cdHBvc3REYXRhLmRldmljZV90b2tlbl9saXN0ID0gSlNPTi5zdHJpbmdpZnkodG9rZW5zKTtcblxuXHRpZiAodGltZVRvTGl2ZSA+IDApIHtcblx0XHRwb3N0RGF0YS5leHBpcmVfdGltZSA9IHRoaXMuZm9ybWF0SHVhd2VpRGF0ZShuZXcgRGF0ZShEYXRlLm5vdygpICsgdGltZVRvTGl2ZSkpO1xuXHRcdGlmIChIdWF3ZWlQdXNoLmRlYnVnKVxuXHRcdFx0Y29uc29sZS5sb2coXCJwb3N0RGF0YS5leHBpcmVfdGltZSBcIiwgcG9zdERhdGEuZXhwaXJlX3RpbWUpO1xuXHR9XG5cdHJldHVybiBwb3N0RGF0YTtcbn1cblxuSHVhd2VpUHVzaC5zZW5kQWxsID0gZnVuY3Rpb24obm90aWZpY2F0aW9uLCB0aW1lVG9MaXZlKSB7XG5cdGlmIChub3RpZmljYXRpb24uYW5kcm9pZC50aXRsZSkge1xuXHRcdGZvciAoY29uc3QgcGFja2FnZV9uYW1lIGluIHRoaXMuYXV0aEluZm8pIHtcblx0XHRcdGNvbnNvbGUubG9nKFwiVE9ETzogc2VuZEFsbFwiKTtcblx0XHR9XG5cdH1cbn1cblxuSHVhd2VpUHVzaC5jaGVja1Rva2VuID0gZnVuY3Rpb24ocGFja2FnZV9uYW1lLCBjYWxsYmFjaykge1xuXHRjb25zdCBhdXRoSW5mbyA9IHRoaXMuYXV0aEluZm9bcGFja2FnZV9uYW1lXTtcblx0aWYgKGF1dGhJbmZvLmFjY2Vzc190b2tlbiAmJiBEYXRlLm5vdygpIDwgYXV0aEluZm8uYWNjZXNzX3Rva2VuX2V4cGlyZSkge1xuXHRcdGNhbGxiYWNrKCk7XG5cdH0gZWxzZSB7XG5cdFx0aWYgKEh1YXdlaVB1c2guZGVidWcpXG5cdFx0XHRjb25zb2xlLmluZm8oXCJyZXF1ZXN0IHRva2VuIFwiLCBwYWNrYWdlX25hbWUsIHRoaXMuYXV0aEluZm9bcGFja2FnZV9uYW1lXSk7XG5cdFx0cmVxdWVzdC5wb3N0KHtcblx0XHRcdHVybDogdG9rZW5VcmwsXG5cdFx0XHRmb3JtOiB7XG5cdFx0XHRcdGdyYW50X3R5cGU6IFwiY2xpZW50X2NyZWRlbnRpYWxzXCIsXG5cdFx0XHRcdGNsaWVudF9pZDogYXV0aEluZm8uY2xpZW50X2lkLFxuXHRcdFx0XHRjbGllbnRfc2VjcmV0OiBhdXRoSW5mby5jbGllbnRfc2VjcmV0XG5cdFx0XHR9LFxuXHRcdFx0dGltZW91dDogdGltZW91dCxcblx0XHRcdG1heEF0dGVtcHRzOiAyLFxuXHRcdFx0cmV0cnlEZWxheTogNTAwMCxcblx0XHRcdHJldHJ5U3RyYXRlZ3k6IHJlcXVlc3QuUmV0cnlTdHJhdGVnaWVzLk5ldHdvcmtFcnJvclxuXHRcdH0sIChlcnJvciwgcmVzcG9uc2UsIGJvZHkpID0+IHtcblx0XHRcdGlmICghZXJyb3IpIHtcblx0XHRcdFx0Y29uc3QgZGF0YSA9IEpTT04ucGFyc2UoYm9keSk7XG5cdFx0XHRcdGF1dGhJbmZvLmFjY2Vzc190b2tlbiA9IGRhdGEuYWNjZXNzX3Rva2VuO1xuXHRcdFx0XHRhdXRoSW5mby5hY2Nlc3NfdG9rZW5fZXhwaXJlID0gRGF0ZS5ub3coKSArIGRhdGEuZXhwaXJlc19pbiAqIDEwMDAgLSA2MCAqIDEwMDA7XG5cdFx0XHRcdGlmIChIdWF3ZWlQdXNoLmRlYnVnKVxuXHRcdFx0XHRcdGNvbnNvbGUuaW5mbyhcImdldCBhY2Nlc3MgdG9rZW4gc3VjY2Vzc1wiLCBkYXRhKTtcblx0XHRcdFx0Y2FsbGJhY2soKTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdGNvbnNvbGUuZXJyb3IoXCJnZXQgYWNjZXNzIHRva2VuIGVycm9yXCIsIGJvZHkpO1xuXHRcdFx0XHRjYWxsYmFjayhlcnJvcik7XG5cdFx0XHR9XG5cdFx0fSk7XG5cdH1cbn1cblxuSHVhd2VpUHVzaC5mb3JtYXRIdWF3ZWlEYXRlID0gZnVuY3Rpb24oZGF0ZSkge1xuXHRyZXR1cm4gbW9tZW50KGRhdGUpLmZvcm1hdChcIllZWVktTU0tRERUSEg6bW1cIik7XG59XG5cbi8qXG4gKiDnlKjmiLfoh6rlrprkuYkgZGljdFxuICogXCJleHRyYXNcIjp7XCJzZWFzb25cIjpcIlNwcmluZ1wiLCBcIndlYXRoZXJcIjpcInJhaW5pbmdcIn1dXG4gKi9cbkh1YXdlaVB1c2guZXh0cmFzID0gZnVuY3Rpb24oZXh0cmFzKSB7XG5cdGlmIChBcnJheS5pc0FycmF5KGV4dHJhcykpXG5cdFx0cmV0dXJuIGV4dHJhcztcblxuXHR2YXIgZXh0cmFBcnJheSA9IFtdO1xuXHRpZiAoZXh0cmFzKSB7XG5cdFx0dmFyIGtleXMgPSBPYmplY3Qua2V5cyhleHRyYXMpO1xuXHRcdGtleXMuZm9yRWFjaChmdW5jdGlvbihrZXkpIHtcblx0XHRcdHZhciB2ID0ge307XG5cdFx0XHR2W2tleV0gPSBleHRyYXNba2V5XTtcblx0XHRcdGV4dHJhQXJyYXkucHVzaCh2KVxuXHRcdH0pXG5cdFx0ZXh0cmFzID0gZXh0cmFBcnJheVxuXHR9XG5cdHJldHVybiBleHRyYUFycmF5O1xufTsiXX0=
