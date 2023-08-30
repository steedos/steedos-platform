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
  default_package_name: undefined,
  debug: Meteor.settings.push && Meteor.settings.push.huawei && Meteor.settings.push.huawei.debug
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
        },
        category: 'WORK' // 工作事项提醒

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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvczpodWF3ZWlwdXNoL2NoZWNrTnBtLmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zOmh1YXdlaXB1c2gvc2VydmVyL2h1YXdlaVByb3ZpZGVyLmpzIl0sIm5hbWVzIjpbImNoZWNrTnBtVmVyc2lvbnMiLCJtb2R1bGUiLCJsaW5rIiwidiIsInJlcXVlc3QiLCJyZXF1aXJlIiwidG9rZW5VcmwiLCJhcGlVcmwiLCJ0aW1lb3V0IiwiSHVhd2VpUHVzaCIsImF1dGhJbmZvIiwiZGVmYXVsdF9wYWNrYWdlX25hbWUiLCJ1bmRlZmluZWQiLCJkZWJ1ZyIsIk1ldGVvciIsInNldHRpbmdzIiwicHVzaCIsImh1YXdlaSIsImNvbmZpZyIsImZvckVhY2giLCJ2YWwiLCJwYWNrYWdlX25hbWUiLCJhY2Nlc3NfdG9rZW5fZXhwaXJlIiwiY29uc29sZSIsImluZm8iLCJzZW5kTWFueSIsIm5vdGlmaWNhdGlvbiIsInRva2VuRGF0YUxpc3QiLCJ0aW1lVG9MaXZlIiwiYW5kcm9pZCIsInRpdGxlIiwibWFwVG9rZW5EYXRhIiwidG9rZW5EYXRhIiwiZXJyb3IiLCJ0b2tlbkxpc3QiLCJ0b2tlbiIsImRvU2VuZE1hbnkiLCJ0b2tlbnMiLCJjaGVja1Rva2VuIiwidG9rZW5FcnJvciIsImxvZyIsInBvc3REYXRhIiwiZ2V0UG9zdERhdGEiLCJwb3N0IiwidXJsIiwicXMiLCJuc3BfY3R4IiwiY2xpZW50X2lkIiwiZm9ybSIsIm1heEF0dGVtcHRzIiwicmV0cnlEZWxheSIsInRpbWUiLCJyZXRyeVN0cmF0ZWd5IiwiUmV0cnlTdHJhdGVnaWVzIiwiTmV0d29ya0Vycm9yIiwicmVzcG9uc2UiLCJib2R5Iiwic3RhdHVzQ29kZSIsImFjY2Vzc190b2tlbiIsIm5zcF9zdmMiLCJuc3BfdHMiLCJNYXRoIiwiZmxvb3IiLCJEYXRlIiwibm93IiwicGF5bG9hZCIsImhwcyIsIm1zZyIsInR5cGUiLCJjb250ZW50IiwibWVzc2FnZSIsImFjdGlvbiIsInBhcmFtIiwiYXBwUGtnTmFtZSIsImNhdGVnb3J5IiwiZXh0IiwiY3VzdG9taXplIiwiZXh0cmFzIiwiSlNPTiIsInN0cmluZ2lmeSIsImRldmljZV90b2tlbl9saXN0IiwiZXhwaXJlX3RpbWUiLCJmb3JtYXRIdWF3ZWlEYXRlIiwic2VuZEFsbCIsImNhbGxiYWNrIiwiZ3JhbnRfdHlwZSIsImNsaWVudF9zZWNyZXQiLCJkYXRhIiwicGFyc2UiLCJleHBpcmVzX2luIiwiZGF0ZSIsIm1vbWVudCIsImZvcm1hdCIsIkFycmF5IiwiaXNBcnJheSIsImV4dHJhQXJyYXkiLCJrZXlzIiwiT2JqZWN0Iiwia2V5Il0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUEsSUFBSUEsZ0JBQUo7QUFBcUJDLE1BQU0sQ0FBQ0MsSUFBUCxDQUFZLG9DQUFaLEVBQWlEO0FBQUNGLGtCQUFnQixDQUFDRyxDQUFELEVBQUc7QUFBQ0gsb0JBQWdCLEdBQUNHLENBQWpCO0FBQW1COztBQUF4QyxDQUFqRCxFQUEyRixDQUEzRixFOzs7Ozs7Ozs7OztBQ0FyQixNQUFNQyxPQUFPLEdBQUdDLE9BQU8sQ0FBQyxjQUFELENBQXZCOztBQUNBLE1BQU1DLFFBQVEsR0FBRyxzQ0FBakI7QUFDQSxNQUFNQyxNQUFNLEdBQUcsMENBQWY7QUFDQSxNQUFNQyxPQUFPLEdBQUcsSUFBaEI7QUFFQUMsVUFBVSxHQUFHO0FBQ1pDLFVBQVEsRUFBRSxFQURFO0FBRVpDLHNCQUFvQixFQUFFQyxTQUZWO0FBR1pDLE9BQUssRUFBRUMsTUFBTSxDQUFDQyxRQUFQLENBQWdCQyxJQUFoQixJQUF3QkYsTUFBTSxDQUFDQyxRQUFQLENBQWdCQyxJQUFoQixDQUFxQkMsTUFBN0MsSUFBdURILE1BQU0sQ0FBQ0MsUUFBUCxDQUFnQkMsSUFBaEIsQ0FBcUJDLE1BQXJCLENBQTRCSjtBQUg5RSxDQUFiOztBQU1BSixVQUFVLENBQUNTLE1BQVgsR0FBb0IsVUFBU0EsTUFBVCxFQUFpQjtB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RUFBZTtBQUM1QyxTQUFPQyxNQUFNLENBQUNELElBQUQsQ0FBTixDQUFhRSxNQUFiLENBQW9CLGtCQUFwQixDQUFQO0FBQ0EsQ0FGRDtBQUlBOzs7Ozs7QUFJQW5GLFVBQVUsQ0FBQ29FLE1BQVgsR0FBb0IsVUFBU0EsTUFBVCxFQUFpQjtBQUNwQyxNQUFJZ0IsS0FBSyxDQUFDQyxPQUFOLENBQWNqQixNQUFkLENBQUosRUFDQyxPQUFPQSxNQUFQO0FBRUQsTUFBSWtCLFVBQVUsR0FBRyxFQUFqQjs7QUFDQSxNQUFJbEIsTUFBSixFQUFZO0FBQ1gsUUFBSW1CLElBQUksR0FBR0MsTUFBTSxDQUFDRCxJQUFQLENBQVluQixNQUFaLENBQVg7QUFDQW1CLFFBQUksQ0FBQzdFLE9BQUwsQ0FBYSxVQUFTK0UsR0FBVCxFQUFjO0FBQzFCLFVBQUkvRixDQUFDLEdBQUcsRUFBUjtBQUNBQSxPQUFDLENBQUMrRixHQUFELENBQUQsR0FBU3JCLE1BQU0sQ0FBQ3FCLEdBQUQsQ0FBZjtBQUNBSCxnQkFBVSxDQUFDL0UsSUFBWCxDQUFnQmIsQ0FBaEI7QUFDQSxLQUpEO0FBS0EwRSxVQUFNLEdBQUdrQixVQUFUO0FBQ0E7O0FBQ0QsU0FBT0EsVUFBUDtBQUNBLENBZkQsQyIsImZpbGUiOiIvcGFja2FnZXMvc3RlZWRvc19odWF3ZWlwdXNoLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgY2hlY2tOcG1WZXJzaW9ucyB9IGZyb20gJ21ldGVvci90bWVhc2RheTpjaGVjay1ucG0tdmVyc2lvbnMnO1xuIiwiY29uc3QgcmVxdWVzdCA9IHJlcXVpcmUoJ3JlcXVlc3RyZXRyeScpO1xuY29uc3QgdG9rZW5VcmwgPSBcImh0dHBzOi8vbG9naW4udm1hbGwuY29tL29hdXRoMi90b2tlblwiO1xuY29uc3QgYXBpVXJsID0gXCJodHRwczovL2FwaS5wdXNoLmhpY2xvdWQuY29tL3B1c2hzZW5kLmRvXCI7XG5jb25zdCB0aW1lb3V0ID0gNTAwMDtcblxuSHVhd2VpUHVzaCA9IHtcblx0YXV0aEluZm86IHt9LFxuXHRkZWZhdWx0X3BhY2thZ2VfbmFtZTogdW5kZWZpbmVkLFxuXHRkZWJ1ZzogTWV0ZW9yLnNldHRpbmdzLnB1c2ggJiYgTWV0ZW9yLnNldHRpbmdzLnB1c2guaHVhd2VpICYmIE1ldGVvci5zZXR0aW5ncy5wdXNoLmh1YXdlaS5kZWJ1Z1xufTtcblxuSHVhd2VpUHVzaC5jb25maWcgPSBmdW5jdGlvbihjb25maWcpIHtcblx0Y29uZmlnLmZvckVhY2goKHZhbCkgPT4ge1xuXHRcdGlmICh0aGlzLmF1dGhJbmZvW3ZhbC5wYWNrYWdlX25hbWVdKVxuXHRcdFx0cmV0dXJuXG5cdFx0dGhpcy5hdXRoSW5mb1t2YWwucGFja2FnZV9uYW1lXSA9IHZhbDtcblx0XHR2YWwuYWNjZXNzX3Rva2VuX2V4cGlyZSA9IDA7XG5cdFx0aWYgKCF0aGlzLmRlZmF1bHRfcGFja2FnZV9uYW1lKSB7XG5cdFx0XHR0aGlzLmRlZmF1bHRfcGFja2FnZV9uYW1lID0gdmFsLnBhY2thZ2VfbmFtZTtcblx0XHRcdGlmIChIdWF3ZWlQdXNoLmRlYnVnKVxuXHRcdFx0XHRjb25zb2xlLmluZm8oJ2h1YXdlaSBkZWZhdWx0IHBhY2thZ2UgbmFtZSAnLCB0aGlzLmRlZmF1bHRfcGFja2FnZV9uYW1lKTtcblx0XHR9XG5cdH0pO1xufVxuXG5IdWF3ZWlQdXNoLnNlbmRNYW55ID0gZnVuY3Rpb24obm90aWZpY2F0aW9uLCB0b2tlbkRhdGFMaXN0LCB0aW1lVG9MaXZlKSB7XG5cdGlmIChub3RpZmljYXRpb24uYW5kcm9pZC50aXRsZSkge1xuXHRcdGNvbnN0IG1hcFRva2VuRGF0YSA9IHt9O1xuXHRcdGZvciAoY29uc3QgdG9rZW5EYXRhIG9mIHRva2VuRGF0YUxpc3QpIHtcblx0XHRcdGNvbnN0IHBhY2thZ2VfbmFtZSA9IHRva2VuRGF0YS5wYWNrYWdlX25hbWUgfHwgdGhpcy5kZWZhdWx0X3BhY2thZ2VfbmFtZTtcblx0XHRcdGlmICghdGhpcy5hdXRoSW5mb1twYWNrYWdlX25hbWVdKSB7XG5cdFx0XHRcdGNvbnNvbGUuZXJyb3IoJ2h1YXdlaSBwYWNrYWdlIG5hbWUgbm90IHN1cHBvcnRlZDogJywgcGFja2FnZV9uYW1lKTtcblx0XHRcdFx0Y29udGludWU7XG5cdFx0XHR9XG5cdFx0XHRjb25zdCB0b2tlbkxpc3QgPSBtYXBUb2tlbkRhdGFbcGFja2FnZV9uYW1lXSB8fCBbXTtcblx0XHRcdHRva2VuTGlzdC5wdXNoKHRva2VuRGF0YS50b2tlbik7XG5cdFx0XHRtYXBUb2tlbkRhdGFbcGFja2FnZV9uYW1lXSA9IHRva2VuTGlzdDtcblx0XHR9XG5cblx0XHRmb3IgKGNvbnN0IHBhY2thZ2VfbmFtZSBpbiBtYXBUb2tlbkRhdGEpIHtcblx0XHRcdHRoaXMuZG9TZW5kTWFueShub3RpZmljYXRpb24sIHBhY2thZ2VfbmFtZSwgbWFwVG9rZW5EYXRhW3BhY2thZ2VfbmFtZV0sIHRpbWVUb0xpdmUpO1xuXHRcdH1cblx0fVxufVxuXG5IdWF3ZWlQdXNoLmRvU2VuZE1hbnkgPSBmdW5jdGlvbihub3RpZmljYXRpb24sIHBhY2thZ2VfbmFtZSwgdG9rZW5zLCB0aW1lVG9MaXZlKSB7XG5cdHRoaXMuY2hlY2tUb2tlbihwYWNrYWdlX25hbWUsICh0b2tlbkVycm9yKSA9PiB7XG5cdFx0aWYgKCF0b2tlbkVycm9yKSB7XG5cdFx0XHRpZiAoSHVhd2VpUHVzaC5kZWJ1Zylcblx0XHRcdFx0Y29uc29sZS5sb2coXCJzZW5kTWFueSBcIiwgbm90aWZpY2F0aW9uLCB0aW1lVG9MaXZlKTtcblx0XHRcdGNvbnN0IHBvc3REYXRhID0gdGhpcy5nZXRQb3N0RGF0YShub3RpZmljYXRpb24sIHBhY2thZ2VfbmFtZSwgdG9rZW5zLCB0aW1lVG9MaXZlKTtcblx0XHRcdHJlcXVlc3QucG9zdCh7XG5cdFx0XHRcdHVybDogYXBpVXJsLFxuXHRcdFx0XHRxczoge1xuXHRcdFx0XHRcdG5zcF9jdHg6IGB7XCJ2ZXJcIjoxLFwiYXBwSWRcIjpcIiR7dGhpcy5hdXRoSW5mb1twYWNrYWdlX25hbWVdLmNsaWVudF9pZH1cIn1gXG5cdFx0XHRcdH0sXG5cdFx0XHRcdGZvcm06IHBvc3REYXRhLFxuXHRcdFx0XHR0aW1lb3V0OiB0aW1lb3V0LFxuXHRcdFx0XHRtYXhBdHRlbXB0czogMixcblx0XHRcdFx0cmV0cnlEZWxheTogNTAwMCxcblx0XHRcdFx0dGltZTogdHJ1ZSxcblx0XHRcdFx0cmV0cnlTdHJhdGVneTogcmVxdWVzdC5SZXRyeVN0cmF0ZWdpZXMuTmV0d29ya0Vycm9yXG5cdFx0XHR9LCAoZXJyb3IsIHJlc3BvbnNlLCBib2R5KSA9PiB7XG5cdFx0XHRcdGlmIChIdWF3ZWlQdXNoLmRlYnVnKVxuXHRcdFx0XHRcdGNvbnNvbGUubG9nKFwic2VuZE1hbnkgcmVzdWx0XCIsIGVycm9yLCBib2R5KTtcblx0XHRcdFx0aWYgKCFlcnJvciAmJiByZXNwb25zZSAmJiByZXNwb25zZS5zdGF0dXNDb2RlID09IDIwMCkge1xuXHRcdFx0XHRcdGlmIChIdWF3ZWlQdXNoLmRlYnVnKVxuXHRcdFx0XHRcdFx0Y29uc29sZS5sb2coXCJUT0RPOiBjYWxsYmFja1wiKTtcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRlcnJvciA9IGVycm9yIHx8ICd1bmtub3duIGVycm9yJztcblx0XHRcdFx0fVxuXHRcdFx0fSk7XG5cdFx0fVxuXHR9KTtcbn1cblxuSHVhd2VpUHVzaC5nZXRQb3N0RGF0YSA9IGZ1bmN0aW9uKG5vdGlmaWNhdGlvbiwgcGFja2FnZV9uYW1lLCB0b2tlbnMsIHRpbWVUb0xpdmUpIHtcblx0Y29uc3QgcG9zdERhdGEgPSB7XG5cdFx0YWNjZXNzX3Rva2VuOiB0aGlzLmF1dGhJbmZvW3BhY2thZ2VfbmFtZV0uYWNjZXNzX3Rva2VuLFxuXHRcdG5zcF9zdmM6IFwib3BlbnB1c2gubWVzc2FnZS5hcGkuc2VuZFwiLFxuXHRcdG5zcF90czogTWF0aC5mbG9vcihEYXRlLm5vdygpIC8gMTAwMClcblx0fTtcblx0cG9zdERhdGEucGF5bG9hZCA9IHtcblx0XHRocHM6IHtcblx0XHRcdG1zZzoge1xuXHRcdFx0XHR0eXBlOiAzLFxuXHRcdFx0XHRib2R5OiB7XG5cdFx0XHRcdFx0Y29udGVudDogbm90aWZpY2F0aW9uLmFuZHJvaWQubWVzc2FnZSxcblx0XHRcdFx0XHR0aXRsZTogbm90aWZpY2F0aW9uLmFuZHJvaWQudGl0bGVcblx0XHRcdFx0fSxcblx0XHRcdFx0YWN0aW9uOiB7XG5cdFx0XHRcdFx0dHlwZTogMyxcblx0XHRcdFx0XHRwYXJhbToge1xuXHRcdFx0XHRcdFx0YXBwUGtnTmFtZTogcGFja2FnZV9uYW1lXG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9LFxuXHRcdFx0XHRjYXRlZ29yeTogJ1dPUksnIC8vIOW3peS9nOS6i+mhueaPkOmGklxuXHRcdFx0fSxcblx0XHRcdGV4dDoge1xuXHRcdFx0XHRjdXN0b21pemU6IHRoaXMuZXh0cmFzKG5vdGlmaWNhdGlvbi5leHRyYXMpXG5cdFx0XHR9XG5cdFx0fVxuXHR9O1xuXHRwb3N0RGF0YS5wYXlsb2FkID0gSlNPTi5zdHJpbmdpZnkocG9zdERhdGEucGF5bG9hZCk7XG5cdHBvc3REYXRhLmRldmljZV90b2tlbl9saXN0ID0gSlNPTi5zdHJpbmdpZnkodG9rZW5zKTtcblxuXHRpZiAodGltZVRvTGl2ZSA+IDApIHtcblx0XHRwb3N0RGF0YS5leHBpcmVfdGltZSA9IHRoaXMuZm9ybWF0SHVhd2VpRGF0ZShuZXcgRGF0ZShEYXRlLm5vdygpICsgdGltZVRvTGl2ZSkpO1xuXHRcdGlmIChIdWF3ZWlQdXNoLmRlYnVnKVxuXHRcdFx0Y29uc29sZS5sb2coXCJwb3N0RGF0YS5leHBpcmVfdGltZSBcIiwgcG9zdERhdGEuZXhwaXJlX3RpbWUpO1xuXHR9XG5cdHJldHVybiBwb3N0RGF0YTtcbn1cblxuSHVhd2VpUHVzaC5zZW5kQWxsID0gZnVuY3Rpb24obm90aWZpY2F0aW9uLCB0aW1lVG9MaXZlKSB7XG5cdGlmIChub3RpZmljYXRpb24uYW5kcm9pZC50aXRsZSkge1xuXHRcdGZvciAoY29uc3QgcGFja2FnZV9uYW1lIGluIHRoaXMuYXV0aEluZm8pIHtcblx0XHRcdGNvbnNvbGUubG9nKFwiVE9ETzogc2VuZEFsbFwiKTtcblx0XHR9XG5cdH1cbn1cblxuSHVhd2VpUHVzaC5jaGVja1Rva2VuID0gZnVuY3Rpb24ocGFja2FnZV9uYW1lLCBjYWxsYmFjaykge1xuXHRjb25zdCBhdXRoSW5mbyA9IHRoaXMuYXV0aEluZm9bcGFja2FnZV9uYW1lXTtcblx0aWYgKGF1dGhJbmZvLmFjY2Vzc190b2tlbiAmJiBEYXRlLm5vdygpIDwgYXV0aEluZm8uYWNjZXNzX3Rva2VuX2V4cGlyZSkge1xuXHRcdGNhbGxiYWNrKCk7XG5cdH0gZWxzZSB7XG5cdFx0aWYgKEh1YXdlaVB1c2guZGVidWcpXG5cdFx0XHRjb25zb2xlLmluZm8oXCJyZXF1ZXN0IHRva2VuIFwiLCBwYWNrYWdlX25hbWUsIHRoaXMuYXV0aEluZm9bcGFja2FnZV9uYW1lXSk7XG5cdFx0cmVxdWVzdC5wb3N0KHtcblx0XHRcdHVybDogdG9rZW5VcmwsXG5cdFx0XHRmb3JtOiB7XG5cdFx0XHRcdGdyYW50X3R5cGU6IFwiY2xpZW50X2NyZWRlbnRpYWxzXCIsXG5cdFx0XHRcdGNsaWVudF9pZDogYXV0aEluZm8uY2xpZW50X2lkLFxuXHRcdFx0XHRjbGllbnRfc2VjcmV0OiBhdXRoSW5mby5jbGllbnRfc2VjcmV0XG5cdFx0XHR9LFxuXHRcdFx0dGltZW91dDogdGltZW91dCxcblx0XHRcdG1heEF0dGVtcHRzOiAyLFxuXHRcdFx0cmV0cnlEZWxheTogNTAwMCxcblx0XHRcdHJldHJ5U3RyYXRlZ3k6IHJlcXVlc3QuUmV0cnlTdHJhdGVnaWVzLk5ldHdvcmtFcnJvclxuXHRcdH0sIChlcnJvciwgcmVzcG9uc2UsIGJvZHkpID0+IHtcblx0XHRcdGlmICghZXJyb3IpIHtcblx0XHRcdFx0Y29uc3QgZGF0YSA9IEpTT04ucGFyc2UoYm9keSk7XG5cdFx0XHRcdGF1dGhJbmZvLmFjY2Vzc190b2tlbiA9IGRhdGEuYWNjZXNzX3Rva2VuO1xuXHRcdFx0XHRhdXRoSW5mby5hY2Nlc3NfdG9rZW5fZXhwaXJlID0gRGF0ZS5ub3coKSArIGRhdGEuZXhwaXJlc19pbiAqIDEwMDAgLSA2MCAqIDEwMDA7XG5cdFx0XHRcdGlmIChIdWF3ZWlQdXNoLmRlYnVnKVxuXHRcdFx0XHRcdGNvbnNvbGUuaW5mbyhcImdldCBhY2Nlc3MgdG9rZW4gc3VjY2Vzc1wiLCBkYXRhKTtcblx0XHRcdFx0Y2FsbGJhY2soKTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdGNvbnNvbGUuZXJyb3IoXCJnZXQgYWNjZXNzIHRva2VuIGVycm9yXCIsIGJvZHkpO1xuXHRcdFx0XHRjYWxsYmFjayhlcnJvcik7XG5cdFx0XHR9XG5cdFx0fSk7XG5cdH1cbn1cblxuSHVhd2VpUHVzaC5mb3JtYXRIdWF3ZWlEYXRlID0gZnVuY3Rpb24oZGF0ZSkge1xuXHRyZXR1cm4gbW9tZW50KGRhdGUpLmZvcm1hdChcIllZWVktTU0tRERUSEg6bW1cIik7XG59XG5cbi8qXG4gKiDnlKjmiLfoh6rlrprkuYkgZGljdFxuICogXCJleHRyYXNcIjp7XCJzZWFzb25cIjpcIlNwcmluZ1wiLCBcIndlYXRoZXJcIjpcInJhaW5pbmdcIn1dXG4gKi9cbkh1YXdlaVB1c2guZXh0cmFzID0gZnVuY3Rpb24oZXh0cmFzKSB7XG5cdGlmIChBcnJheS5pc0FycmF5KGV4dHJhcykpXG5cdFx0cmV0dXJuIGV4dHJhcztcblxuXHR2YXIgZXh0cmFBcnJheSA9IFtdO1xuXHRpZiAoZXh0cmFzKSB7XG5cdFx0dmFyIGtleXMgPSBPYmplY3Qua2V5cyhleHRyYXMpO1xuXHRcdGtleXMuZm9yRWFjaChmdW5jdGlvbihrZXkpIHtcblx0XHRcdHZhciB2ID0ge307XG5cdFx0XHR2W2tleV0gPSBleHRyYXNba2V5XTtcblx0XHRcdGV4dHJhQXJyYXkucHVzaCh2KVxuXHRcdH0pXG5cdFx0ZXh0cmFzID0gZXh0cmFBcnJheVxuXHR9XG5cdHJldHVybiBleHRyYUFycmF5O1xufTsiXX0=
