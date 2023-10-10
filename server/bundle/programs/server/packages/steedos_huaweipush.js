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

const tokenUrl = "https://oauth-login.cloud.huawei.com/oauth2/v3/token";
const apiUrl = "https://push-api.cloud.huawei.com/v1/[clientid]/messages:send";
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
        url: apiUrl.replace('[clientid]', this.authInfo[package_name].client_id),
        body: JSON.stringify(postData),
        'headers': {
          'Authorization': 'Bearer ' + this.authInfo[package_name].access_token
        },
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
    "validate_only": false,
    "message": {
      "android": {
        "notification": {
          "title": notification.android.title,
          "body": notification.android.message,
          "click_action": {
            "type": 3
          }
        },
        "category": "WORK"
      },
      "token": tokens,
      "data": JSON.stringify(notification.extras)
    }
  };
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvczpodWF3ZWlwdXNoL2NoZWNrTnBtLmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zOmh1YXdlaXB1c2gvc2VydmVyL2h1YXdlaVByb3ZpZGVyLmpzIl0sIm5hbWVzIjpbImNoZWNrTnBtVmVyc2lvbnMiLCJtb2R1bGUiLCJsaW5rIiwidiIsInJlcXVlc3QiLCJyZXF1aXJlIiwidG9rZW5VcmwiLCJhcGlVcmwiLCJ0aW1lb3V0IiwiSHVhd2VpUHVzaCIsImF1dGhJbmZvIiwiZGVmYXVsdF9wYWNrYWdlX25hbWUiLCJ1bmRlZmluZWQiLCJkZWJ1ZyIsIk1ldGVvciIsInNldHRpbmdzIiwicHVzaCIsImh1YXdlaSIsImNvbmZpZyIsImZvckVhY2giLCJ2YWwiLCJwYWNrYWdlX25hbWUiLCJhY2Nlc3NfdG9rZW5fZXhwaXJlIiwiY29uc29sZSIsImluZm8iLCJzZW5kTWFueSIsIm5vdGlmaWNhdGlvbiIsInRva2VuRGF0YUxpc3QiLCJ0aW1lVG9MaXZlIiwiYW5kcm9pZCIsInRpdGxlIiwibWFwVG9rZW5EYXRhIiwidG9rZW5EYXRhIiwiZXJyb3IiLCJ0b2tlbkxpc3QiLCJ0b2tlbiIsImRvU2VuZE1hbnkiLCJ0b2tlbnMiLCJjaGVja1Rva2VuIiwidG9rZW5FcnJvciIsImxvZyIsInBvc3REYXRhIiwiZ2V0UG9zdERhdGEiLCJwb3N0IiwidXJsIiwicmVwbGFjZSIsImNsaWVudF9pZCIsImJvZHkiLCJKU09OIiwic3RyaW5naWZ5IiwiYWNjZXNzX3Rva2VuIiwibWF4QXR0ZW1wdHMiLCJyZXRyeURlbGF5IiwidGltZSIsInJldHJ5U3RyYXRlZ3kiLCJSZXRyeVN0cmF0ZWdpZXMiLCJOZXR3b3JrRXJyb3IiLCJyZXNwb25zZSIsInN0YXR1c0NvZGUiLCJtZXNzYWdlIiwiZXh0cmFzIiwic2VuZEFsbCIsImNhbGxiYWNrIiwiRGF0ZSIsIm5vdyIsImZvcm0iLCJncmFudF90eXBlIiwiY2xpZW50X3NlY3JldCIsImRhdGEiLCJwYXJzZSIsImV4cGlyZXNfaW4iLCJmb3JtYXRIdWF3ZWlEYXRlIiwiZGF0ZSIsIm1vbWVudCIsImZvcm1hdCIsIkFycmF5IiwiaXNBcnJheSIsImV4dHJhQXJyYXkiLCJrZXlzIiwiT2JqZWN0Iiwia2V5Il0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUEsSUFBSUEsZ0JBQUo7QUFBcUJDLE1BQU0sQ0FBQ0MsSUFBUCxDQUFZLG9DQUFaLEVBQWlEO0FBQUNGLGtCQUFnQixDQUFDRyxDQUFELEVBQUc7QUFBQ0gsb0JBQWdCLEdBQUNHLENBQWpCO0FBQW1COztBQUF4QyxDQUFqRCxFQUEyRixDQUEzRixFOzs7Ozs7Ozs7OztBQ0FyQixNQUFNQyxPQUFPLEdBQUdDLE9BQU8sQ0FBQyxjQUFELENBQXZCOztBQUNBLE1BQU1DLFFBQVEsR0FBRyxzREFBakI7QUFDQSxNQUFNQyxNQUFNLEdBQUcsK0RBQWY7QUFDQSxNQUFNQyxPQUFPLEdBQUcsSUFBaEI7QUFFQUMsVUFBVSxHQUFHO0FBQ1pDLFVBQVEsRUFBRSxFQURFO0FBRVpDLHNCQUFvQixFQUFFQyxTQUZWO0FBR1pDLE9BQUssRUFBRUMsTUFBTSxDQUFDQyxRQUFQLENBQWdCQyxJQUFoQixJQUF3QkYsTUFBTSxDQUFDQyxRQUFQLENBQWdCQyxJQUFoQixDQUFxQkMsTUFBN0MsSUFBdURILE1BQU0sQ0FBQ0MsUUFBUCxDQUFnQkMsSUFBaEIsQ0FBcUJDLE1BQXJCLENBQTRCSjtBQUg5RSxDQUFiOztBQU1BSixVQUFVLENBQUNTLE1BQVgsR0FBb0IsVUFBU0EsTUFBVCxFQUFpQjtBQUNwQ0EsUUFBTSxDQUFDQyxPQUFQLENBQWdCQyxHQUFELElBQVM7QUFDdkIsUUFBSSxLQUFLVixRQUFMLENBQWNVLEdBQUcsQ0FBQ0MsWUFBbEIsQ0FBSixFQUNDO0FBQ0QsU0FBS1gsUUFBTCxDQUFjVSxHQUFHLENBQUNDLFlBQWxCLElBQWtDRCxHQUFsQztBQUNBQSxPQUFHLENBQUNFLG1CQUFKLEdB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UixDQUFjLHdCQUFkLEVBQXdDYyxJQUF4QztBQUNBZSxnQkFBUSxDQUFDN0IsS0FBRCxDQUFSO0FBQ0E7QUFDRCxLQXZCRDtBQXdCQTtBQUNELENBaENEOztBQWtDQXhCLFVBQVUsQ0FBQzhELGdCQUFYLEdBQThCLFVBQVNDLElBQVQsRUFBZTtBQUM1QyxTQUFPQyxNQUFNLENBQUNELElBQUQsQ0FBTixDQUFhRSxNQUFiLENBQW9CLGtCQUFwQixDQUFQO0FBQ0EsQ0FGRDtBQUlBOzs7Ozs7QUFJQWpFLFVBQVUsQ0FBQ21ELE1BQVgsR0FBb0IsVUFBU0EsTUFBVCxFQUFpQjtBQUNwQyxNQUFJZSxLQUFLLENBQUNDLE9BQU4sQ0FBY2hCLE1BQWQsQ0FBSixFQUNDLE9BQU9BLE1BQVA7QUFFRCxNQUFJaUIsVUFBVSxHQUFHLEVBQWpCOztBQUNBLE1BQUlqQixNQUFKLEVBQVk7QUFDWCxRQUFJa0IsSUFBSSxHQUFHQyxNQUFNLENBQUNELElBQVAsQ0FBWWxCLE1BQVosQ0FBWDtBQUNBa0IsUUFBSSxDQUFDM0QsT0FBTCxDQUFhLFVBQVM2RCxHQUFULEVBQWM7QUFDMUIsVUFBSTdFLENBQUMsR0FBRyxFQUFSO0FBQ0FBLE9BQUMsQ0FBQzZFLEdBQUQsQ0FBRCxHQUFTcEIsTUFBTSxDQUFDb0IsR0FBRCxDQUFmO0FBQ0FILGdCQUFVLENBQUM3RCxJQUFYLENBQWdCYixDQUFoQjtBQUNBLEtBSkQ7QUFLQXlELFVBQU0sR0FBR2lCLFVBQVQ7QUFDQTs7QUFDRCxTQUFPQSxVQUFQO0FBQ0EsQ0FmRCxDIiwiZmlsZSI6Ii9wYWNrYWdlcy9zdGVlZG9zX2h1YXdlaXB1c2guanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBjaGVja05wbVZlcnNpb25zIH0gZnJvbSAnbWV0ZW9yL3RtZWFzZGF5OmNoZWNrLW5wbS12ZXJzaW9ucyc7XG4iLCJjb25zdCByZXF1ZXN0ID0gcmVxdWlyZSgncmVxdWVzdHJldHJ5Jyk7XG5jb25zdCB0b2tlblVybCA9IFwiaHR0cHM6Ly9vYXV0aC1sb2dpbi5jbG91ZC5odWF3ZWkuY29tL29hdXRoMi92My90b2tlblwiO1xuY29uc3QgYXBpVXJsID0gXCJodHRwczovL3B1c2gtYXBpLmNsb3VkLmh1YXdlaS5jb20vdjEvW2NsaWVudGlkXS9tZXNzYWdlczpzZW5kXCI7XG5jb25zdCB0aW1lb3V0ID0gNTAwMDtcblxuSHVhd2VpUHVzaCA9IHtcblx0YXV0aEluZm86IHt9LFxuXHRkZWZhdWx0X3BhY2thZ2VfbmFtZTogdW5kZWZpbmVkLFxuXHRkZWJ1ZzogTWV0ZW9yLnNldHRpbmdzLnB1c2ggJiYgTWV0ZW9yLnNldHRpbmdzLnB1c2guaHVhd2VpICYmIE1ldGVvci5zZXR0aW5ncy5wdXNoLmh1YXdlaS5kZWJ1Z1xufTtcblxuSHVhd2VpUHVzaC5jb25maWcgPSBmdW5jdGlvbihjb25maWcpIHtcblx0Y29uZmlnLmZvckVhY2goKHZhbCkgPT4ge1xuXHRcdGlmICh0aGlzLmF1dGhJbmZvW3ZhbC5wYWNrYWdlX25hbWVdKVxuXHRcdFx0cmV0dXJuXG5cdFx0dGhpcy5hdXRoSW5mb1t2YWwucGFja2FnZV9uYW1lXSA9IHZhbDtcblx0XHR2YWwuYWNjZXNzX3Rva2VuX2V4cGlyZSA9IDA7XG5cdFx0aWYgKCF0aGlzLmRlZmF1bHRfcGFja2FnZV9uYW1lKSB7XG5cdFx0XHR0aGlzLmRlZmF1bHRfcGFja2FnZV9uYW1lID0gdmFsLnBhY2thZ2VfbmFtZTtcblx0XHRcdGlmIChIdWF3ZWlQdXNoLmRlYnVnKVxuXHRcdFx0XHRjb25zb2xlLmluZm8oJ2h1YXdlaSBkZWZhdWx0IHBhY2thZ2UgbmFtZSAnLCB0aGlzLmRlZmF1bHRfcGFja2FnZV9uYW1lKTtcblx0XHR9XG5cdH0pO1xufVxuXG5IdWF3ZWlQdXNoLnNlbmRNYW55ID0gZnVuY3Rpb24obm90aWZpY2F0aW9uLCB0b2tlbkRhdGFMaXN0LCB0aW1lVG9MaXZlKSB7XG5cdGlmIChub3RpZmljYXRpb24uYW5kcm9pZC50aXRsZSkge1xuXHRcdGNvbnN0IG1hcFRva2VuRGF0YSA9IHt9O1xuXHRcdGZvciAoY29uc3QgdG9rZW5EYXRhIG9mIHRva2VuRGF0YUxpc3QpIHtcblx0XHRcdGNvbnN0IHBhY2thZ2VfbmFtZSA9IHRva2VuRGF0YS5wYWNrYWdlX25hbWUgfHwgdGhpcy5kZWZhdWx0X3BhY2thZ2VfbmFtZTtcblx0XHRcdGlmICghdGhpcy5hdXRoSW5mb1twYWNrYWdlX25hbWVdKSB7XG5cdFx0XHRcdGNvbnNvbGUuZXJyb3IoJ2h1YXdlaSBwYWNrYWdlIG5hbWUgbm90IHN1cHBvcnRlZDogJywgcGFja2FnZV9uYW1lKTtcblx0XHRcdFx0Y29udGludWU7XG5cdFx0XHR9XG5cdFx0XHRjb25zdCB0b2tlbkxpc3QgPSBtYXBUb2tlbkRhdGFbcGFja2FnZV9uYW1lXSB8fCBbXTtcblx0XHRcdHRva2VuTGlzdC5wdXNoKHRva2VuRGF0YS50b2tlbik7XG5cdFx0XHRtYXBUb2tlbkRhdGFbcGFja2FnZV9uYW1lXSA9IHRva2VuTGlzdDtcblx0XHR9XG5cblx0XHRmb3IgKGNvbnN0IHBhY2thZ2VfbmFtZSBpbiBtYXBUb2tlbkRhdGEpIHtcblx0XHRcdHRoaXMuZG9TZW5kTWFueShub3RpZmljYXRpb24sIHBhY2thZ2VfbmFtZSwgbWFwVG9rZW5EYXRhW3BhY2thZ2VfbmFtZV0sIHRpbWVUb0xpdmUpO1xuXHRcdH1cblx0fVxufVxuXG5IdWF3ZWlQdXNoLmRvU2VuZE1hbnkgPSBmdW5jdGlvbihub3RpZmljYXRpb24sIHBhY2thZ2VfbmFtZSwgdG9rZW5zLCB0aW1lVG9MaXZlKSB7XG5cdHRoaXMuY2hlY2tUb2tlbihwYWNrYWdlX25hbWUsICh0b2tlbkVycm9yKSA9PiB7XG5cdFx0aWYgKCF0b2tlbkVycm9yKSB7XG5cdFx0XHRpZiAoSHVhd2VpUHVzaC5kZWJ1Zylcblx0XHRcdFx0Y29uc29sZS5sb2coXCJzZW5kTWFueSBcIiwgbm90aWZpY2F0aW9uLCB0aW1lVG9MaXZlKTtcblx0XHRcdGNvbnN0IHBvc3REYXRhID0gdGhpcy5nZXRQb3N0RGF0YShub3RpZmljYXRpb24sIHBhY2thZ2VfbmFtZSwgdG9rZW5zLCB0aW1lVG9MaXZlKTtcblx0XHRcdHJlcXVlc3QucG9zdCh7XG5cdFx0XHRcdHVybDogYXBpVXJsLnJlcGxhY2UoJ1tjbGllbnRpZF0nLCB0aGlzLmF1dGhJbmZvW3BhY2thZ2VfbmFtZV0uY2xpZW50X2lkKSxcblx0XHRcdFx0Ym9keTogSlNPTi5zdHJpbmdpZnkocG9zdERhdGEpLFxuXHRcdFx0XHQnaGVhZGVycyc6IHtcblx0XHRcdFx0XHQnQXV0aG9yaXphdGlvbic6ICdCZWFyZXIgJysgdGhpcy5hdXRoSW5mb1twYWNrYWdlX25hbWVdLmFjY2Vzc190b2tlblxuXHRcdFx0XHR9LFxuXHRcdFx0XHR0aW1lb3V0OiB0aW1lb3V0LFxuXHRcdFx0XHRtYXhBdHRlbXB0czogMixcblx0XHRcdFx0cmV0cnlEZWxheTogNTAwMCxcblx0XHRcdFx0dGltZTogdHJ1ZSxcblx0XHRcdFx0cmV0cnlTdHJhdGVneTogcmVxdWVzdC5SZXRyeVN0cmF0ZWdpZXMuTmV0d29ya0Vycm9yXG5cdFx0XHR9LCAoZXJyb3IsIHJlc3BvbnNlLCBib2R5KSA9PiB7XG5cdFx0XHRcdGlmIChIdWF3ZWlQdXNoLmRlYnVnKVxuXHRcdFx0XHRcdGNvbnNvbGUubG9nKFwic2VuZE1hbnkgcmVzdWx0XCIsIGVycm9yLCBib2R5KTtcblx0XHRcdFx0aWYgKCFlcnJvciAmJiByZXNwb25zZSAmJiByZXNwb25zZS5zdGF0dXNDb2RlID09IDIwMCkge1xuXHRcdFx0XHRcdGlmIChIdWF3ZWlQdXNoLmRlYnVnKVxuXHRcdFx0XHRcdFx0Y29uc29sZS5sb2coXCJUT0RPOiBjYWxsYmFja1wiKTtcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRlcnJvciA9IGVycm9yIHx8ICd1bmtub3duIGVycm9yJztcblx0XHRcdFx0fVxuXHRcdFx0fSk7XG5cdFx0fVxuXHR9KTtcbn1cblxuSHVhd2VpUHVzaC5nZXRQb3N0RGF0YSA9IGZ1bmN0aW9uKG5vdGlmaWNhdGlvbiwgcGFja2FnZV9uYW1lLCB0b2tlbnMsIHRpbWVUb0xpdmUpIHtcblx0Y29uc3QgcG9zdERhdGEgPSB7XG5cdFx0XCJ2YWxpZGF0ZV9vbmx5XCI6IGZhbHNlLFxuXHRcdFwibWVzc2FnZVwiOiB7XG5cdFx0XHRcImFuZHJvaWRcIjoge1xuXHRcdFx0XHRcIm5vdGlmaWNhdGlvblwiOiB7XG5cdFx0XHRcdFx0XCJ0aXRsZVwiOiBub3RpZmljYXRpb24uYW5kcm9pZC50aXRsZSxcblx0XHRcdFx0XHRcImJvZHlcIjogbm90aWZpY2F0aW9uLmFuZHJvaWQubWVzc2FnZSxcblx0XHRcdFx0XHRcImNsaWNrX2FjdGlvblwiOiB7XG5cdFx0XHRcdFx0XHRcInR5cGVcIjogM1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSxcblx0XHRcdFx0XCJjYXRlZ29yeVwiOiBcIldPUktcIlxuXHRcdFx0fSxcblx0XHRcdFwidG9rZW5cIjogdG9rZW5zLFxuXHRcdFx0XCJkYXRhXCI6IEpTT04uc3RyaW5naWZ5KG5vdGlmaWNhdGlvbi5leHRyYXMpXG5cdFx0fVxuXHQgIH1cblx0cmV0dXJuIHBvc3REYXRhO1xufVxuXG5IdWF3ZWlQdXNoLnNlbmRBbGwgPSBmdW5jdGlvbihub3RpZmljYXRpb24sIHRpbWVUb0xpdmUpIHtcblx0aWYgKG5vdGlmaWNhdGlvbi5hbmRyb2lkLnRpdGxlKSB7XG5cdFx0Zm9yIChjb25zdCBwYWNrYWdlX25hbWUgaW4gdGhpcy5hdXRoSW5mbykge1xuXHRcdFx0Y29uc29sZS5sb2coXCJUT0RPOiBzZW5kQWxsXCIpO1xuXHRcdH1cblx0fVxufVxuXG5IdWF3ZWlQdXNoLmNoZWNrVG9rZW4gPSBmdW5jdGlvbihwYWNrYWdlX25hbWUsIGNhbGxiYWNrKSB7XG5cdGNvbnN0IGF1dGhJbmZvID0gdGhpcy5hdXRoSW5mb1twYWNrYWdlX25hbWVdO1xuXHRpZiAoYXV0aEluZm8uYWNjZXNzX3Rva2VuICYmIERhdGUubm93KCkgPCBhdXRoSW5mby5hY2Nlc3NfdG9rZW5fZXhwaXJlKSB7XG5cdFx0Y2FsbGJhY2soKTtcblx0fSBlbHNlIHtcblx0XHRpZiAoSHVhd2VpUHVzaC5kZWJ1Zylcblx0XHRcdGNvbnNvbGUuaW5mbyhcInJlcXVlc3QgdG9rZW4gXCIsIHBhY2thZ2VfbmFtZSwgdGhpcy5hdXRoSW5mb1twYWNrYWdlX25hbWVdKTtcblx0XHRyZXF1ZXN0LnBvc3Qoe1xuXHRcdFx0dXJsOiB0b2tlblVybCxcblx0XHRcdGZvcm06IHtcblx0XHRcdFx0Z3JhbnRfdHlwZTogXCJjbGllbnRfY3JlZGVudGlhbHNcIixcblx0XHRcdFx0Y2xpZW50X2lkOiBhdXRoSW5mby5jbGllbnRfaWQsXG5cdFx0XHRcdGNsaWVudF9zZWNyZXQ6IGF1dGhJbmZvLmNsaWVudF9zZWNyZXRcblx0XHRcdH0sXG5cdFx0XHR0aW1lb3V0OiB0aW1lb3V0LFxuXHRcdFx0bWF4QXR0ZW1wdHM6IDIsXG5cdFx0XHRyZXRyeURlbGF5OiA1MDAwLFxuXHRcdFx0cmV0cnlTdHJhdGVneTogcmVxdWVzdC5SZXRyeVN0cmF0ZWdpZXMuTmV0d29ya0Vycm9yXG5cdFx0fSwgKGVycm9yLCByZXNwb25zZSwgYm9keSkgPT4ge1xuXHRcdFx0aWYgKCFlcnJvcikge1xuXHRcdFx0XHRjb25zdCBkYXRhID0gSlNPTi5wYXJzZShib2R5KTtcblx0XHRcdFx0YXV0aEluZm8uYWNjZXNzX3Rva2VuID0gZGF0YS5hY2Nlc3NfdG9rZW47XG5cdFx0XHRcdGF1dGhJbmZvLmFjY2Vzc190b2tlbl9leHBpcmUgPSBEYXRlLm5vdygpICsgZGF0YS5leHBpcmVzX2luICogMTAwMCAtIDYwICogMTAwMDtcblx0XHRcdFx0aWYgKEh1YXdlaVB1c2guZGVidWcpXG5cdFx0XHRcdFx0Y29uc29sZS5pbmZvKFwiZ2V0IGFjY2VzcyB0b2tlbiBzdWNjZXNzXCIsIGRhdGEpO1xuXHRcdFx0XHRjYWxsYmFjaygpO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0Y29uc29sZS5lcnJvcihcImdldCBhY2Nlc3MgdG9rZW4gZXJyb3JcIiwgYm9keSk7XG5cdFx0XHRcdGNhbGxiYWNrKGVycm9yKTtcblx0XHRcdH1cblx0XHR9KTtcblx0fVxufVxuXG5IdWF3ZWlQdXNoLmZvcm1hdEh1YXdlaURhdGUgPSBmdW5jdGlvbihkYXRlKSB7XG5cdHJldHVybiBtb21lbnQoZGF0ZSkuZm9ybWF0KFwiWVlZWS1NTS1ERFRISDptbVwiKTtcbn1cblxuLypcbiAqIOeUqOaIt+iHquWumuS5iSBkaWN0XG4gKiBcImV4dHJhc1wiOntcInNlYXNvblwiOlwiU3ByaW5nXCIsIFwid2VhdGhlclwiOlwicmFpbmluZ1wifV1cbiAqL1xuSHVhd2VpUHVzaC5leHRyYXMgPSBmdW5jdGlvbihleHRyYXMpIHtcblx0aWYgKEFycmF5LmlzQXJyYXkoZXh0cmFzKSlcblx0XHRyZXR1cm4gZXh0cmFzO1xuXG5cdHZhciBleHRyYUFycmF5ID0gW107XG5cdGlmIChleHRyYXMpIHtcblx0XHR2YXIga2V5cyA9IE9iamVjdC5rZXlzKGV4dHJhcyk7XG5cdFx0a2V5cy5mb3JFYWNoKGZ1bmN0aW9uKGtleSkge1xuXHRcdFx0dmFyIHYgPSB7fTtcblx0XHRcdHZba2V5XSA9IGV4dHJhc1trZXldO1xuXHRcdFx0ZXh0cmFBcnJheS5wdXNoKHYpXG5cdFx0fSlcblx0XHRleHRyYXMgPSBleHRyYUFycmF5XG5cdH1cblx0cmV0dXJuIGV4dHJhQXJyYXk7XG59OyJdfQ==
