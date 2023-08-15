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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvczpodWF3ZWlwdXNoL2NoZWNrTnBtLmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zOmh1YXdlaXB1c2gvc2VydmVyL2h1YXdlaVByb3ZpZGVyLmpzIl0sIm5hbWVzIjpbImNoZWNrTnBtVmVyc2lvbnMiLCJtb2R1bGUiLCJsaW5rIiwidiIsInJlcXVlc3QiLCJyZXF1aXJlIiwidG9rZW5VcmwiLCJhcGlVcmwiLCJ0aW1lb3V0IiwiSHVhd2VpUHVzaCIsImF1dGhJbmZvIiwiZGVmYXVsdF9wYWNrYWdlX25hbWUiLCJ1bmRlZmluZWQiLCJkZWJ1ZyIsIk1ldGVvciIsInNldHRpbmdzIiwicHVzaCIsImh1YXdlaSIsImNvbmZpZyIsImZvckVhY2giLCJ2YWwiLCJwYWNrYWdlX25hbWUiLCJhY2Nlc3NfdG9rZW5fZXhwaXJlIiwiY29uc29sZSIsImluZm8iLCJzZW5kTWFueSIsIm5vdGlmaWNhdGlvbiIsInRva2VuRGF0YUxpc3QiLCJ0aW1lVG9MaXZlIiwiYW5kcm9pZCIsInRpdGxlIiwibWFwVG9rZW5EYXRhIiwidG9rZW5EYXRhIiwiZXJyb3IiLCJ0b2tlbkxpc3QiLCJ0b2tlbiIsImRvU2VuZE1hbnkiLCJ0b2tlbnMiLCJjaGVja1Rva2VuIiwidG9rZW5FcnJvciIsImxvZyIsInBvc3REYXRhIiwiZ2V0UG9zdERhdGEiLCJwb3N0IiwidXJsIiwicXMiLCJuc3BfY3R4IiwiY2xpZW50X2lkIiwiZm9ybSIsIm1heEF0dGVtcHRzIiwicmV0cnlEZWxheSIsInRpbWUiLCJyZXRyeVN0cmF0ZWd5IiwiUmV0cnlTdHJhdGVnaWVzIiwiTmV0d29ya0Vycm9yIiwicmVzcG9uc2UiLCJib2R5Iiwic3RhdHVzQ29kZSIsImFjY2Vzc190b2tlbiIsIm5zcF9zdmMiLCJuc3BfdHMiLCJNYXRoIiwiZmxvb3IiLCJEYXRlIiwibm93IiwicGF5bG9hZCIsImhwcyIsIm1zZyIsInR5cGUiLCJjb250ZW50IiwibWVzc2FnZSIsImFjdGlvbiIsInBhcmFtIiwiYXBwUGtnTmFtZSIsImV4dCIsImN1c3RvbWl6ZSIsImV4dHJhcyIsIkpTT04iLCJzdHJpbmdpZnkiLCJkZXZpY2VfdG9rZW5fbGlzdCIsImV4cGlyZV90aW1lIiwiZm9ybWF0SHVhd2VpRGF0ZSIsInNlbmRBbGwiLCJjYWxsYmFjayIsImdyYW50X3R5cGUiLCJjbGllbnRfc2VjcmV0IiwiZGF0YSIsInBhcnNlIiwiZXhwaXJlc19pbiIsImRhdGUiLCJtb21lbnQiLCJmb3JtYXQiLCJBcnJheSIsImlzQXJyYXkiLCJleHRyYUFycmF5Iiwia2V5cyIsIk9iamVjdCIsImtleSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLElBQUlBLGdCQUFKO0FBQXFCQyxNQUFNLENBQUNDLElBQVAsQ0FBWSxvQ0FBWixFQUFpRDtBQUFDRixrQkFBZ0IsQ0FBQ0csQ0FBRCxFQUFHO0FBQUNILG9CQUFnQixHQUFDRyxDQUFqQjtBQUFtQjs7QUFBeEMsQ0FBakQsRUFBMkYsQ0FBM0YsRTs7Ozs7Ozs7Ozs7QUNBckIsTUFBTUMsT0FBTyxHQUFHQyxPQUFPLENBQUMsY0FBRCxDQUF2Qjs7QUFDQSxNQUFNQyxRQUFRLEdBQUcsc0NBQWpCO0FBQ0EsTUFBTUMsTUFBTSxHQUFHLDBDQUFmO0FBQ0EsTUFBTUMsT0FBTyxHQUFHLElBQWhCO0FBRUFDLFVBQVUsR0FBRztBQUNaQyxVQUFRLEVBQUUsRUFERTtBQUVaQyxzQkFBb0IsRUFBRUMsU0FGVjtBQUdaQyxPQUFLLEVBQUVDLE1BQU0sQ0FBQ0MsUUFBUCxDQUFnQkMsSUFBaEIsSUFBd0JGLE1BQU0sQ0FBQ0MsUUFBUCxDQUFnQkMsSUFBaEIsQ0FBcUJDLE1BQTdDLElBQXVESCxNQUFNLENBQUNDLFFBQVAsQ0FBZ0JDLElBQWhCLENBQXFCQyxNQUFyQixDQUE0Qko7QUFIOUUsQ0FBYjs7QUFNQUosVUFBVSxDQUFDUyxNQUFYLEdBQW9CLFVBQVNBLE1BQVQsRUFBaUI7QUFDcENBLFFBQU0s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TUFBYixDQUFvQixrQkFBcEIsQ0FBUDtBQUNBLENBRkQ7QUFJQTs7Ozs7O0FBSUFsRixVQUFVLENBQUNtRSxNQUFYLEdBQW9CLFVBQVNBLE1BQVQsRUFBaUI7QUFDcEMsTUFBSWdCLEtBQUssQ0FBQ0MsT0FBTixDQUFjakIsTUFBZCxDQUFKLEVBQ0MsT0FBT0EsTUFBUDtBQUVELE1BQUlrQixVQUFVLEdBQUcsRUFBakI7O0FBQ0EsTUFBSWxCLE1BQUosRUFBWTtBQUNYLFFBQUltQixJQUFJLEdBQUdDLE1BQU0sQ0FBQ0QsSUFBUCxDQUFZbkIsTUFBWixDQUFYO0FBQ0FtQixRQUFJLENBQUM1RSxPQUFMLENBQWEsVUFBUzhFLEdBQVQsRUFBYztBQUMxQixVQUFJOUYsQ0FBQyxHQUFHLEVBQVI7QUFDQUEsT0FBQyxDQUFDOEYsR0FBRCxDQUFELEdBQVNyQixNQUFNLENBQUNxQixHQUFELENBQWY7QUFDQUgsZ0JBQVUsQ0FBQzlFLElBQVgsQ0FBZ0JiLENBQWhCO0FBQ0EsS0FKRDtBQUtBeUUsVUFBTSxHQUFHa0IsVUFBVDtBQUNBOztBQUNELFNBQU9BLFVBQVA7QUFDQSxDQWZELEMiLCJmaWxlIjoiL3BhY2thZ2VzL3N0ZWVkb3NfaHVhd2VpcHVzaC5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IGNoZWNrTnBtVmVyc2lvbnMgfSBmcm9tICdtZXRlb3IvdG1lYXNkYXk6Y2hlY2stbnBtLXZlcnNpb25zJztcbiIsImNvbnN0IHJlcXVlc3QgPSByZXF1aXJlKCdyZXF1ZXN0cmV0cnknKTtcbmNvbnN0IHRva2VuVXJsID0gXCJodHRwczovL2xvZ2luLnZtYWxsLmNvbS9vYXV0aDIvdG9rZW5cIjtcbmNvbnN0IGFwaVVybCA9IFwiaHR0cHM6Ly9hcGkucHVzaC5oaWNsb3VkLmNvbS9wdXNoc2VuZC5kb1wiO1xuY29uc3QgdGltZW91dCA9IDUwMDA7XG5cbkh1YXdlaVB1c2ggPSB7XG5cdGF1dGhJbmZvOiB7fSxcblx0ZGVmYXVsdF9wYWNrYWdlX25hbWU6IHVuZGVmaW5lZCxcblx0ZGVidWc6IE1ldGVvci5zZXR0aW5ncy5wdXNoICYmIE1ldGVvci5zZXR0aW5ncy5wdXNoLmh1YXdlaSAmJiBNZXRlb3Iuc2V0dGluZ3MucHVzaC5odWF3ZWkuZGVidWdcbn07XG5cbkh1YXdlaVB1c2guY29uZmlnID0gZnVuY3Rpb24oY29uZmlnKSB7XG5cdGNvbmZpZy5mb3JFYWNoKCh2YWwpID0+IHtcblx0XHRpZiAodGhpcy5hdXRoSW5mb1t2YWwucGFja2FnZV9uYW1lXSlcblx0XHRcdHJldHVyblxuXHRcdHRoaXMuYXV0aEluZm9bdmFsLnBhY2thZ2VfbmFtZV0gPSB2YWw7XG5cdFx0dmFsLmFjY2Vzc190b2tlbl9leHBpcmUgPSAwO1xuXHRcdGlmICghdGhpcy5kZWZhdWx0X3BhY2thZ2VfbmFtZSkge1xuXHRcdFx0dGhpcy5kZWZhdWx0X3BhY2thZ2VfbmFtZSA9IHZhbC5wYWNrYWdlX25hbWU7XG5cdFx0XHRpZiAoSHVhd2VpUHVzaC5kZWJ1Zylcblx0XHRcdFx0Y29uc29sZS5pbmZvKCdodWF3ZWkgZGVmYXVsdCBwYWNrYWdlIG5hbWUgJywgdGhpcy5kZWZhdWx0X3BhY2thZ2VfbmFtZSk7XG5cdFx0fVxuXHR9KTtcbn1cblxuSHVhd2VpUHVzaC5zZW5kTWFueSA9IGZ1bmN0aW9uKG5vdGlmaWNhdGlvbiwgdG9rZW5EYXRhTGlzdCwgdGltZVRvTGl2ZSkge1xuXHRpZiAobm90aWZpY2F0aW9uLmFuZHJvaWQudGl0bGUpIHtcblx0XHRjb25zdCBtYXBUb2tlbkRhdGEgPSB7fTtcblx0XHRmb3IgKGNvbnN0IHRva2VuRGF0YSBvZiB0b2tlbkRhdGFMaXN0KSB7XG5cdFx0XHRjb25zdCBwYWNrYWdlX25hbWUgPSB0b2tlbkRhdGEucGFja2FnZV9uYW1lIHx8IHRoaXMuZGVmYXVsdF9wYWNrYWdlX25hbWU7XG5cdFx0XHRpZiAoIXRoaXMuYXV0aEluZm9bcGFja2FnZV9uYW1lXSkge1xuXHRcdFx0XHRjb25zb2xlLmVycm9yKCdodWF3ZWkgcGFja2FnZSBuYW1lIG5vdCBzdXBwb3J0ZWQ6ICcsIHBhY2thZ2VfbmFtZSk7XG5cdFx0XHRcdGNvbnRpbnVlO1xuXHRcdFx0fVxuXHRcdFx0Y29uc3QgdG9rZW5MaXN0ID0gbWFwVG9rZW5EYXRhW3BhY2thZ2VfbmFtZV0gfHwgW107XG5cdFx0XHR0b2tlbkxpc3QucHVzaCh0b2tlbkRhdGEudG9rZW4pO1xuXHRcdFx0bWFwVG9rZW5EYXRhW3BhY2thZ2VfbmFtZV0gPSB0b2tlbkxpc3Q7XG5cdFx0fVxuXG5cdFx0Zm9yIChjb25zdCBwYWNrYWdlX25hbWUgaW4gbWFwVG9rZW5EYXRhKSB7XG5cdFx0XHR0aGlzLmRvU2VuZE1hbnkobm90aWZpY2F0aW9uLCBwYWNrYWdlX25hbWUsIG1hcFRva2VuRGF0YVtwYWNrYWdlX25hbWVdLCB0aW1lVG9MaXZlKTtcblx0XHR9XG5cdH1cbn1cblxuSHVhd2VpUHVzaC5kb1NlbmRNYW55ID0gZnVuY3Rpb24obm90aWZpY2F0aW9uLCBwYWNrYWdlX25hbWUsIHRva2VucywgdGltZVRvTGl2ZSkge1xuXHR0aGlzLmNoZWNrVG9rZW4ocGFja2FnZV9uYW1lLCAodG9rZW5FcnJvcikgPT4ge1xuXHRcdGlmICghdG9rZW5FcnJvcikge1xuXHRcdFx0aWYgKEh1YXdlaVB1c2guZGVidWcpXG5cdFx0XHRcdGNvbnNvbGUubG9nKFwic2VuZE1hbnkgXCIsIG5vdGlmaWNhdGlvbiwgdGltZVRvTGl2ZSk7XG5cdFx0XHRjb25zdCBwb3N0RGF0YSA9IHRoaXMuZ2V0UG9zdERhdGEobm90aWZpY2F0aW9uLCBwYWNrYWdlX25hbWUsIHRva2VucywgdGltZVRvTGl2ZSk7XG5cdFx0XHRyZXF1ZXN0LnBvc3Qoe1xuXHRcdFx0XHR1cmw6IGFwaVVybCxcblx0XHRcdFx0cXM6IHtcblx0XHRcdFx0XHRuc3BfY3R4OiBge1widmVyXCI6MSxcImFwcElkXCI6XCIke3RoaXMuYXV0aEluZm9bcGFja2FnZV9uYW1lXS5jbGllbnRfaWR9XCJ9YFxuXHRcdFx0XHR9LFxuXHRcdFx0XHRmb3JtOiBwb3N0RGF0YSxcblx0XHRcdFx0dGltZW91dDogdGltZW91dCxcblx0XHRcdFx0bWF4QXR0ZW1wdHM6IDIsXG5cdFx0XHRcdHJldHJ5RGVsYXk6IDUwMDAsXG5cdFx0XHRcdHRpbWU6IHRydWUsXG5cdFx0XHRcdHJldHJ5U3RyYXRlZ3k6IHJlcXVlc3QuUmV0cnlTdHJhdGVnaWVzLk5ldHdvcmtFcnJvclxuXHRcdFx0fSwgKGVycm9yLCByZXNwb25zZSwgYm9keSkgPT4ge1xuXHRcdFx0XHRpZiAoSHVhd2VpUHVzaC5kZWJ1Zylcblx0XHRcdFx0XHRjb25zb2xlLmxvZyhcInNlbmRNYW55IHJlc3VsdFwiLCBlcnJvciwgYm9keSk7XG5cdFx0XHRcdGlmICghZXJyb3IgJiYgcmVzcG9uc2UgJiYgcmVzcG9uc2Uuc3RhdHVzQ29kZSA9PSAyMDApIHtcblx0XHRcdFx0XHRpZiAoSHVhd2VpUHVzaC5kZWJ1Zylcblx0XHRcdFx0XHRcdGNvbnNvbGUubG9nKFwiVE9ETzogY2FsbGJhY2tcIik7XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0ZXJyb3IgPSBlcnJvciB8fCAndW5rbm93biBlcnJvcic7XG5cdFx0XHRcdH1cblx0XHRcdH0pO1xuXHRcdH1cblx0fSk7XG59XG5cbkh1YXdlaVB1c2guZ2V0UG9zdERhdGEgPSBmdW5jdGlvbihub3RpZmljYXRpb24sIHBhY2thZ2VfbmFtZSwgdG9rZW5zLCB0aW1lVG9MaXZlKSB7XG5cdGNvbnN0IHBvc3REYXRhID0ge1xuXHRcdGFjY2Vzc190b2tlbjogdGhpcy5hdXRoSW5mb1twYWNrYWdlX25hbWVdLmFjY2Vzc190b2tlbixcblx0XHRuc3Bfc3ZjOiBcIm9wZW5wdXNoLm1lc3NhZ2UuYXBpLnNlbmRcIixcblx0XHRuc3BfdHM6IE1hdGguZmxvb3IoRGF0ZS5ub3coKSAvIDEwMDApXG5cdH07XG5cdHBvc3REYXRhLnBheWxvYWQgPSB7XG5cdFx0aHBzOiB7XG5cdFx0XHRtc2c6IHtcblx0XHRcdFx0dHlwZTogMyxcblx0XHRcdFx0Ym9keToge1xuXHRcdFx0XHRcdGNvbnRlbnQ6IG5vdGlmaWNhdGlvbi5hbmRyb2lkLm1lc3NhZ2UsXG5cdFx0XHRcdFx0dGl0bGU6IG5vdGlmaWNhdGlvbi5hbmRyb2lkLnRpdGxlXG5cdFx0XHRcdH0sXG5cdFx0XHRcdGFjdGlvbjoge1xuXHRcdFx0XHRcdHR5cGU6IDMsXG5cdFx0XHRcdFx0cGFyYW06IHtcblx0XHRcdFx0XHRcdGFwcFBrZ05hbWU6IHBhY2thZ2VfbmFtZVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fSxcblx0XHRcdGV4dDoge1xuXHRcdFx0XHRjdXN0b21pemU6IHRoaXMuZXh0cmFzKG5vdGlmaWNhdGlvbi5leHRyYXMpXG5cdFx0XHR9XG5cdFx0fVxuXHR9O1xuXHRwb3N0RGF0YS5wYXlsb2FkID0gSlNPTi5zdHJpbmdpZnkocG9zdERhdGEucGF5bG9hZCk7XG5cdHBvc3REYXRhLmRldmljZV90b2tlbl9saXN0ID0gSlNPTi5zdHJpbmdpZnkodG9rZW5zKTtcblxuXHRpZiAodGltZVRvTGl2ZSA+IDApIHtcblx0XHRwb3N0RGF0YS5leHBpcmVfdGltZSA9IHRoaXMuZm9ybWF0SHVhd2VpRGF0ZShuZXcgRGF0ZShEYXRlLm5vdygpICsgdGltZVRvTGl2ZSkpO1xuXHRcdGlmIChIdWF3ZWlQdXNoLmRlYnVnKVxuXHRcdFx0Y29uc29sZS5sb2coXCJwb3N0RGF0YS5leHBpcmVfdGltZSBcIiwgcG9zdERhdGEuZXhwaXJlX3RpbWUpO1xuXHR9XG5cdHJldHVybiBwb3N0RGF0YTtcbn1cblxuSHVhd2VpUHVzaC5zZW5kQWxsID0gZnVuY3Rpb24obm90aWZpY2F0aW9uLCB0aW1lVG9MaXZlKSB7XG5cdGlmIChub3RpZmljYXRpb24uYW5kcm9pZC50aXRsZSkge1xuXHRcdGZvciAoY29uc3QgcGFja2FnZV9uYW1lIGluIHRoaXMuYXV0aEluZm8pIHtcblx0XHRcdGNvbnNvbGUubG9nKFwiVE9ETzogc2VuZEFsbFwiKTtcblx0XHR9XG5cdH1cbn1cblxuSHVhd2VpUHVzaC5jaGVja1Rva2VuID0gZnVuY3Rpb24ocGFja2FnZV9uYW1lLCBjYWxsYmFjaykge1xuXHRjb25zdCBhdXRoSW5mbyA9IHRoaXMuYXV0aEluZm9bcGFja2FnZV9uYW1lXTtcblx0aWYgKGF1dGhJbmZvLmFjY2Vzc190b2tlbiAmJiBEYXRlLm5vdygpIDwgYXV0aEluZm8uYWNjZXNzX3Rva2VuX2V4cGlyZSkge1xuXHRcdGNhbGxiYWNrKCk7XG5cdH0gZWxzZSB7XG5cdFx0aWYgKEh1YXdlaVB1c2guZGVidWcpXG5cdFx0XHRjb25zb2xlLmluZm8oXCJyZXF1ZXN0IHRva2VuIFwiLCBwYWNrYWdlX25hbWUsIHRoaXMuYXV0aEluZm9bcGFja2FnZV9uYW1lXSk7XG5cdFx0cmVxdWVzdC5wb3N0KHtcblx0XHRcdHVybDogdG9rZW5VcmwsXG5cdFx0XHRmb3JtOiB7XG5cdFx0XHRcdGdyYW50X3R5cGU6IFwiY2xpZW50X2NyZWRlbnRpYWxzXCIsXG5cdFx0XHRcdGNsaWVudF9pZDogYXV0aEluZm8uY2xpZW50X2lkLFxuXHRcdFx0XHRjbGllbnRfc2VjcmV0OiBhdXRoSW5mby5jbGllbnRfc2VjcmV0XG5cdFx0XHR9LFxuXHRcdFx0dGltZW91dDogdGltZW91dCxcblx0XHRcdG1heEF0dGVtcHRzOiAyLFxuXHRcdFx0cmV0cnlEZWxheTogNTAwMCxcblx0XHRcdHJldHJ5U3RyYXRlZ3k6IHJlcXVlc3QuUmV0cnlTdHJhdGVnaWVzLk5ldHdvcmtFcnJvclxuXHRcdH0sIChlcnJvciwgcmVzcG9uc2UsIGJvZHkpID0+IHtcblx0XHRcdGlmICghZXJyb3IpIHtcblx0XHRcdFx0Y29uc3QgZGF0YSA9IEpTT04ucGFyc2UoYm9keSk7XG5cdFx0XHRcdGF1dGhJbmZvLmFjY2Vzc190b2tlbiA9IGRhdGEuYWNjZXNzX3Rva2VuO1xuXHRcdFx0XHRhdXRoSW5mby5hY2Nlc3NfdG9rZW5fZXhwaXJlID0gRGF0ZS5ub3coKSArIGRhdGEuZXhwaXJlc19pbiAqIDEwMDAgLSA2MCAqIDEwMDA7XG5cdFx0XHRcdGlmIChIdWF3ZWlQdXNoLmRlYnVnKVxuXHRcdFx0XHRcdGNvbnNvbGUuaW5mbyhcImdldCBhY2Nlc3MgdG9rZW4gc3VjY2Vzc1wiLCBkYXRhKTtcblx0XHRcdFx0Y2FsbGJhY2soKTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdGNvbnNvbGUuZXJyb3IoXCJnZXQgYWNjZXNzIHRva2VuIGVycm9yXCIsIGJvZHkpO1xuXHRcdFx0XHRjYWxsYmFjayhlcnJvcik7XG5cdFx0XHR9XG5cdFx0fSk7XG5cdH1cbn1cblxuSHVhd2VpUHVzaC5mb3JtYXRIdWF3ZWlEYXRlID0gZnVuY3Rpb24oZGF0ZSkge1xuXHRyZXR1cm4gbW9tZW50KGRhdGUpLmZvcm1hdChcIllZWVktTU0tRERUSEg6bW1cIik7XG59XG5cbi8qXG4gKiDnlKjmiLfoh6rlrprkuYkgZGljdFxuICogXCJleHRyYXNcIjp7XCJzZWFzb25cIjpcIlNwcmluZ1wiLCBcIndlYXRoZXJcIjpcInJhaW5pbmdcIn1dXG4gKi9cbkh1YXdlaVB1c2guZXh0cmFzID0gZnVuY3Rpb24oZXh0cmFzKSB7XG5cdGlmIChBcnJheS5pc0FycmF5KGV4dHJhcykpXG5cdFx0cmV0dXJuIGV4dHJhcztcblxuXHR2YXIgZXh0cmFBcnJheSA9IFtdO1xuXHRpZiAoZXh0cmFzKSB7XG5cdFx0dmFyIGtleXMgPSBPYmplY3Qua2V5cyhleHRyYXMpO1xuXHRcdGtleXMuZm9yRWFjaChmdW5jdGlvbihrZXkpIHtcblx0XHRcdHZhciB2ID0ge307XG5cdFx0XHR2W2tleV0gPSBleHRyYXNba2V5XTtcblx0XHRcdGV4dHJhQXJyYXkucHVzaCh2KVxuXHRcdH0pXG5cdFx0ZXh0cmFzID0gZXh0cmFBcnJheVxuXHR9XG5cdHJldHVybiBleHRyYUFycmF5O1xufTsiXX0=
