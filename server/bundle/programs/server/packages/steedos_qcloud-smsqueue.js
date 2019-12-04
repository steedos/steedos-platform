(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var global = Package.meteor.global;
var meteorEnv = Package.meteor.meteorEnv;
var ECMAScript = Package.ecmascript.ECMAScript;
var EventState = Package['raix:eventstate'].EventState;
var check = Package.check.check;
var Match = Package.check.Match;
var MongoInternals = Package.mongo.MongoInternals;
var Mongo = Package.mongo.Mongo;
var _ = Package.underscore._;
var EJSON = Package.ejson.EJSON;
var Random = Package.random.Random;
var SMSQueue = Package['steedos:smsqueue'].SMSQueue;
var meteorInstall = Package.modules.meteorInstall;
var meteorBabelHelpers = Package['babel-runtime'].meteorBabelHelpers;
var Promise = Package.promise.Promise;

/* Package-scope variables */
var QcloudSMSQueue, signname, __coffeescriptShare;

var require = meteorInstall({"node_modules":{"meteor":{"steedos:qcloud-smsqueue":{"checkNpm.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/steedos_qcloud-smsqueue/checkNpm.js                                                                       //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
let checkNpmVersions;
module.link("meteor/tmeasday:check-npm-versions", {
  checkNpmVersions(v) {
    checkNpmVersions = v;
  }

}, 0);
checkNpmVersions({
  "superagent": "^3.5.2",
  "sha256": "^0.2.0"
}, 'steedos:qcloud-smsqueue');
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"lib":{"common":{"main.js":function(){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/steedos_qcloud-smsqueue/lib/common/main.js                                                                //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
QcloudSMSQueue = new EventState();
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"sms.js":function(){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/steedos_qcloud-smsqueue/lib/common/sms.js                                                                 //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
QcloudSMSQueue.collection = SMSQueue.collection;

var _validateDocument = function (sms) {
  check(sms, {
    sms: Object,
    sent: Match.Optional(Boolean),
    sending: Match.Optional(Match.Integer),
    createdAt: Date,
    createdBy: Match.OneOf(String, null)
  });
};

QcloudSMSQueue.send = function (options) {
  var currentUser = Meteor.isClient && Meteor.userId && Meteor.userId() || Meteor.isServer && (options.createdBy || '<SERVER>') || null;

  var sms = _.extend({
    createdAt: new Date(),
    createdBy: currentUser
  });

  if (Match.test(options, Object)) {
    sms.sms = _.pick(options, 'Format', 'Action', 'ParamString', 'RecNum', 'SignName', 'TemplateCode', 'msg');
  }

  sms.sent = false;
  sms.sending = 0;

  _validateDocument(sms);

  return QcloudSMSQueue.collection.insert(sms);
};
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}},"server":{"api.js":function(require){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/steedos_qcloud-smsqueue/lib/server/api.js                                                                 //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
var isConfigured = false;

var sendWorker = function (task, interval) {
  if (QcloudSMSQueue.debug) {
    console.log('QcloudSMSQueue: Send worker started, using interval: ' + interval);
  }

  return Meteor.setInterval(function () {
    try {
      task();
    } catch (error) {
      if (QcloudSMSQueue.debug) {
        console.log('QcloudSMSQueue: Error while sending: ' + error.message);
      }
    }
  }, interval);
}; // var SMS = require('aliyun-sms-node'),
// 	smsSender;


var sdkappid, appkey;

var request = require('superagent'),
    sha256 = require('sha256');

function getRand(bit) {
  bit = bit || 10000000;
  return Math.round(Math.random() * bit);
}

; //send text message

function sendTextMsg(sdkappid, appkey, phone, msg) {
  if (!phone || /1\d{12}/.test(phone)) {
    return console.log('invalid phone number');
  }

  var url = 'https://yun.tim.qq.com/v5/tlssmssvr/sendsms?sdkappid={sdkappid}&random={random}';
  var rand = getRand(),
      time = Math.round(+new Date() / 1000),
      sig = sha256('appkey=' + appkey + '&random=' + rand + '&time=' + time + '&mobile=' + phone);
  var content = {
    "tel": {
      //如需使用国际电话号码通用格式，如："+8613788888888" ，请使用sendisms接口见下注
      "nationcode": "86",
      //国家码
      "mobile": phone //手机号码

    },
    "type": 0,
    //0:普通短信;1:营销短信（强调：要按需填值，不然会影响到业务的正常使用）
    "msg": msg,
    //utf8编码 
    "sig": sig,
    //app凭证，具体计算方式见下注
    "time": time,
    //unix时间戳，请求发起时间，如果和系统时间相差超过10分钟则会返回失败
    "extend": "",
    //通道扩展码，可选字段，默认没有开通(需要填空)。
    //在短信回复场景中，腾讯server会原样返回，开发者可依此区分是哪种类型的回复
    "ext": "" //用户的session内容，腾讯server回包中会原样返回，可选字段，不需要就填空。

  };
  url = url.replace('{sdkappid}', sdkappid).replace('{random}', rand);
  request.post(url).send(content).end(function (err, res) {
    if (err) {
      return console.error(err);
    }
  });
}

;
/*
	options: {
		// Controls the sending interval
		sendInterval: Match.Optional(Number),
		// Controls the sending batch size per interval
		sendBatchSize: Match.Optional(Number),
		// Allow optional keeping notifications in collection
		keepSMS: Match.Optional(Boolean)
	}
*/

QcloudSMSQueue.Configure = function (options) {
  var self = this;
  options = _.extend({
    sendTimeout: 60000 // Timeout period for sms send

  }, options); // Block multiple calls

  if (isConfigured) {
    throw new Error('QcloudSMSQueue.Configure should not be called more than once!');
  }

  isConfigured = true; // Add debug info

  if (QcloudSMSQueue.debug) {
    console.log('QcloudSMSQueue.Configure', options);
  } // smsSender = new SMS({
  // 	AccessKeyId: options.accessKeyId,
  // 	AccessKeySecret: options.accessKeySecret
  // });


  sdkappid = options.sdkappid;
  appkey = options.appkey;
  signname = options.signname || "";

  self.sendSMS = function (sms) {
    if (QcloudSMSQueue.debug) {
      console.log("sendSMS");
      console.log(sms);
    } // smsSender.send(sms.sms).catch(err => {
    // 	console.error(err)
    // });


    sendTextMsg(sdkappid, appkey, sms.sms.RecNum, signname + sms.sms.msg);
  }; // Universal send function


  var _querySend = function (options) {
    if (self.sendSMS) {
      self.sendSMS(options);
    }

    return {
      sms: [options._id]
    };
  };

  self.serverSend = function (options) {
    options = options || {};
    return _querySend(options);
  }; // This interval will allow only one sms to be sent at a time, it
  // will check for new sms at every `options.sendInterval`
  // (default interval is 15000 ms)
  //
  // It looks in sms collection to see if theres any pending
  // sms, if so it will try to reserve the pending sms.
  // If successfully reserved the send is started.
  //
  // If sms.query is type string, it's assumed to be a json string
  // version of the query selector. Making it able to carry `$` properties in
  // the mongo collection.
  //
  // Pr. default sms are removed from the collection after send have
  // completed. Setting `options.keepSMS` will update and keep the
  // sms eg. if needed for historical reasons.
  //
  // After the send have completed a "send" event will be emitted with a
  // status object containing sms id and the send result object.
  //


  var isSending = false;

  if (options.sendInterval !== null) {
    // This will require index since we sort sms by createdAt
    QcloudSMSQueue.collection._ensureIndex({
      createdAt: 1
    });

    QcloudSMSQueue.collection._ensureIndex({
      sent: 1
    });

    QcloudSMSQueue.collection._ensureIndex({
      sending: 1
    });

    var sendSMS = function (sms) {
      // Reserve sms
      var now = +new Date();
      var timeoutAt = now + options.sendTimeout;
      var reserved = QcloudSMSQueue.collection.update({
        _id: sms._id,
        sent: false,
        // xxx: need to make sure this is set on create
        sending: {
          $lt: now
        }
      }, {
        $set: {
          sending: timeoutAt
        }
      }); // Make sure we only handle sms reserved by this
      // instance

      if (reserved) {
        // Send the sms
        var result = QcloudSMSQueue.serverSend(sms);

        if (!options.keepSMS) {
          // Pr. Default we will remove sms
          QcloudSMSQueue.collection.remove({
            _id: sms._id
          });
        } else {
          // Update the sms
          QcloudSMSQueue.collection.update({
            _id: sms._id
          }, {
            $set: {
              // Mark as sent
              sent: true,
              // Set the sent date
              sentAt: new Date(),
              // Not being sent anymore
              sending: 0
            }
          });
        } // Emit the send


        self.emit('send', {
          sms: sms._id,
          result: result
        });
      } // Else could not reserve

    }; // EO sendSMS


    sendWorker(function () {
      if (isSending) {
        return;
      } // Set send fence


      isSending = true;
      var batchSize = options.sendBatchSize || 1;
      var now = +new Date(); // Find sms that are not being or already sent

      var pendingSMS = QcloudSMSQueue.collection.find({
        $and: [// Message is not sent
        {
          sent: false
        }, // And not being sent by other instances
        {
          sending: {
            $lt: now
          }
        }]
      }, {
        // Sort by created date
        sort: {
          createdAt: 1
        },
        limit: batchSize
      });
      pendingSMS.forEach(function (sms) {
        try {
          sendSMS(sms);
        } catch (error) {
          if (QcloudSMSQueue.debug) {
            console.log('QcloudSMSQueue: Could not send sms id: "' + sms._id + '", Error: ' + error.message);
          }
        }
      }); // EO forEach
      // Remove the send fence

      isSending = false;
    }, options.sendInterval || 15000); // Default every 15th sec
  } else {
    if (QcloudSMSQueue.debug) {
      console.log('QcloudSMSQueue: Send server is disabled');
    }
  }
};
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}}},"server":{"startup.coffee":function(){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/steedos_qcloud-smsqueue/server/startup.coffee                                                             //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
Meteor.startup(function () {
  var ref, ref1;

  if ((ref = Meteor.settings.sms) != null ? (ref1 = ref.qcloud) != null ? ref1.smsqueue_interval : void 0 : void 0) {
    return QcloudSMSQueue.Configure({
      sendInterval: Meteor.settings.sms.qcloud.smsqueue_interval,
      sendBatchSize: 10,
      keepSMS: true,
      sdkappid: Meteor.settings.sms.qcloud.sdkappid,
      appkey: Meteor.settings.sms.qcloud.appkey,
      signname: Meteor.settings.sms.qcloud.signname
    });
  }
});
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}}}}}},{
  "extensions": [
    ".js",
    ".json",
    ".coffee"
  ]
});

require("/node_modules/meteor/steedos:qcloud-smsqueue/checkNpm.js");
require("/node_modules/meteor/steedos:qcloud-smsqueue/lib/common/main.js");
require("/node_modules/meteor/steedos:qcloud-smsqueue/lib/common/sms.js");
require("/node_modules/meteor/steedos:qcloud-smsqueue/lib/server/api.js");
require("/node_modules/meteor/steedos:qcloud-smsqueue/server/startup.coffee");

/* Exports */
Package._define("steedos:qcloud-smsqueue");

})();

//# sourceURL=meteor://💻app/packages/steedos_qcloud-smsqueue.js
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvczpxY2xvdWQtc21zcXVldWUvY2hlY2tOcG0uanMiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3M6cWNsb3VkLXNtc3F1ZXVlL2xpYi9jb21tb24vbWFpbi5qcyIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvczpxY2xvdWQtc21zcXVldWUvbGliL2NvbW1vbi9zbXMuanMiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3M6cWNsb3VkLXNtc3F1ZXVlL2xpYi9zZXJ2ZXIvYXBpLmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zX3FjbG91ZC1zbXNxdWV1ZS9zZXJ2ZXIvc3RhcnR1cC5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3NlcnZlci9zdGFydHVwLmNvZmZlZSJdLCJuYW1lcyI6WyJjaGVja05wbVZlcnNpb25zIiwibW9kdWxlIiwibGluayIsInYiLCJRY2xvdWRTTVNRdWV1ZSIsIkV2ZW50U3RhdGUiLCJjb2xsZWN0aW9uIiwiU01TUXVldWUiLCJfdmFsaWRhdGVEb2N1bWVudCIsInNtcyIsImNoZWNrIiwiT2JqZWN0Iiwic2VudCIsIk1hdGNoIiwiT3B0aW9uYWwiLCJCb29sZWFuIiwic2VuZGluZyIsIkludGVnZXIiLCJjcmVhdGVkQXQiLCJEYXRlIiwiY3JlYXRlZEJ5IiwiT25lT2YiLCJTdHJpbmciLCJzZW5kIiwib3B0aW9ucyIsImN1cnJlbnRVc2VyIiwiTWV0ZW9yIiwiaXNDbGllbnQiLCJ1c2VySWQiLCJpc1NlcnZlciIsIl8iLCJleHRlbmQiLCJ0ZXN0IiwicGljayIsImluc2VydCIsImlzQ29uZmlndXJlZCIsInNlbmRXb3JrZXIiLCJ0YXNrIiwiaW50ZXJ2YWwiLCJkZWJ1ZyIsImNvbnNvbGUiLCJsb2ciLCJzZXRJbnRlcnZhbCIsImVycm9yIiwibWVzc2FnZSIsInNka2FwcGlkIiwiYXBwa2V5IiwicmVxdWVzdCIsInJlcXVpcmUiLCJzaGEyNTYiLCJnZXRSYW5kIiwiYml0IiwiTWF0aCIsInJvdW5kIiwicmFuZG9tIiwic2VuZFRleHRNc2ciLCJwaG9uZSIsIm1zZyIsInVybCIsInJhbmQiLCJ0aW1lIiwic2lnIiwiY29udGVudCIsInJlcGxhY2UiLCJwb3N0IiwiZW5kIiwiZXJyIiwicmVzIiwiQ29uZmlndXJlIiwic2VsZiIsInNlbmRUaW1lb3V0IiwiRXJyb3IiLCJzaWdubmFtZSIsInNlbmRTTVMiLCJSZWNOdW0iLCJfcXVlcnlTZW5kIiwiX2lkIiwic2VydmVyU2VuZCIsImlzU2VuZGluZyIsInNlbmRJbnRlcnZhbCIsIl9lbnN1cmVJbmRleCIsIm5vdyIsInRpbWVvdXRBdCIsInJlc2VydmVkIiwidXBkYXRlIiwiJGx0IiwiJHNldCIsInJlc3VsdCIsImtlZXBTTVMiLCJyZW1vdmUiLCJzZW50QXQiLCJlbWl0IiwiYmF0Y2hTaXplIiwic2VuZEJhdGNoU2l6ZSIsInBlbmRpbmdTTVMiLCJmaW5kIiwiJGFuZCIsInNvcnQiLCJsaW1pdCIsImZvckVhY2giLCJzdGFydHVwIiwicmVmIiwicmVmMSIsInNldHRpbmdzIiwicWNsb3VkIiwic21zcXVldWVfaW50ZXJ2YWwiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSxJQUFJQSxnQkFBSjtBQUFxQkMsTUFBTSxDQUFDQyxJQUFQLENBQVksb0NBQVosRUFBaUQ7QUFBQ0Ysa0JBQWdCLENBQUNHLENBQUQsRUFBRztBQUFDSCxvQkFBZ0IsR0FBQ0csQ0FBakI7QUFBbUI7O0FBQXhDLENBQWpELEVBQTJGLENBQTNGO0FBQ3JCSCxnQkFBZ0IsQ0FBQztBQUNoQixnQkFBYyxRQURFO0FBRWhCLFlBQVU7QUFGTSxDQUFELEVBR2IseUJBSGEsQ0FBaEIsQzs7Ozs7Ozs7Ozs7QUNEQUksY0FBYyxHQUFHLElBQUlDLFVBQUosRUFBakIsQzs7Ozs7Ozs7Ozs7QUNBQUQsY0FBYyxDQUFDRSxVQUFmLEdBQTRCQyxRQUFRLENBQUNE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QyxHQUFBLEVBQUFDLElBQUE7O0FBQUEsT0FBQUQsTUFBQTNFLE9BQUE2RSxRQUFBLENBQUE5RixHQUFBLGFBQUE2RixPQUFBRCxJQUFBRyxNQUFBLFlBQUFGLEtBQWdDRyxpQkFBaEMsR0FBZ0MsTUFBaEMsR0FBZ0MsTUFBaEM7QUNFRyxXRERGckcsZUFBZWdFLFNBQWYsQ0FDQztBQUFBVyxvQkFBY3JELE9BQU82RSxRQUFQLENBQWdCOUYsR0FBaEIsQ0FBb0IrRixNQUFwQixDQUEyQkMsaUJBQXpDO0FBQ0FaLHFCQUFlLEVBRGY7QUFFQUwsZUFBUyxJQUZUO0FBR0EzQyxnQkFBVW5CLE9BQU82RSxRQUFQLENBQWdCOUYsR0FBaEIsQ0FBb0IrRixNQUFwQixDQUEyQjNELFFBSHJDO0FBSUFDLGNBQVFwQixPQUFPNkUsUUFBUCxDQUFnQjlGLEdBQWhCLENBQW9CK0YsTUFBcEIsQ0FBMkIxRCxNQUpuQztBQUtBMEIsZ0JBQVU5QyxPQUFPNkUsUUFBUCxDQUFnQjlGLEdBQWhCLENBQW9CK0YsTUFBcEIsQ0FBMkJoQztBQUxyQyxLQURELENDQ0U7QUFRRDtBRFhILEciLCJmaWxlIjoiL3BhY2thZ2VzL3N0ZWVkb3NfcWNsb3VkLXNtc3F1ZXVlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgY2hlY2tOcG1WZXJzaW9ucyB9IGZyb20gJ21ldGVvci90bWVhc2RheTpjaGVjay1ucG0tdmVyc2lvbnMnO1xyXG5jaGVja05wbVZlcnNpb25zKHtcclxuXHRcInN1cGVyYWdlbnRcIjogXCJeMy41LjJcIixcclxuXHRcInNoYTI1NlwiOiBcIl4wLjIuMFwiXHJcbn0sICdzdGVlZG9zOnFjbG91ZC1zbXNxdWV1ZScpOyIsIlFjbG91ZFNNU1F1ZXVlID0gbmV3IEV2ZW50U3RhdGUoKTsiLCJRY2xvdWRTTVNRdWV1ZS5jb2xsZWN0aW9uID0gU01TUXVldWUuY29sbGVjdGlvbjtcclxuXHJcbnZhciBfdmFsaWRhdGVEb2N1bWVudCA9IGZ1bmN0aW9uKHNtcykge1xyXG5cclxuXHRjaGVjayhzbXMsIHtcclxuXHRcdHNtczogT2JqZWN0LFxyXG5cdFx0c2VudDogTWF0Y2guT3B0aW9uYWwoQm9vbGVhbiksXHJcblx0XHRzZW5kaW5nOiBNYXRjaC5PcHRpb25hbChNYXRjaC5JbnRlZ2VyKSxcclxuXHRcdGNyZWF0ZWRBdDogRGF0ZSxcclxuXHRcdGNyZWF0ZWRCeTogTWF0Y2guT25lT2YoU3RyaW5nLCBudWxsKVxyXG5cdH0pO1xyXG5cclxufTtcclxuXHJcblFjbG91ZFNNU1F1ZXVlLnNlbmQgPSBmdW5jdGlvbihvcHRpb25zKSB7XHJcblx0dmFyIGN1cnJlbnRVc2VyID0gTWV0ZW9yLmlzQ2xpZW50ICYmIE1ldGVvci51c2VySWQgJiYgTWV0ZW9yLnVzZXJJZCgpIHx8IE1ldGVvci5pc1NlcnZlciAmJiAob3B0aW9ucy5jcmVhdGVkQnkgfHwgJzxTRVJWRVI+JykgfHwgbnVsbFxyXG5cdHZhciBzbXMgPSBfLmV4dGVuZCh7XHJcblx0XHRjcmVhdGVkQXQ6IG5ldyBEYXRlKCksXHJcblx0XHRjcmVhdGVkQnk6IGN1cnJlbnRVc2VyXHJcblx0fSk7XHJcblxyXG5cdGlmIChNYXRjaC50ZXN0KG9wdGlvbnMsIE9iamVjdCkpIHtcclxuXHRcdHNtcy5zbXMgPSBfLnBpY2sob3B0aW9ucywgJ0Zvcm1hdCcsICdBY3Rpb24nLCAnUGFyYW1TdHJpbmcnLCAnUmVjTnVtJywgJ1NpZ25OYW1lJywgJ1RlbXBsYXRlQ29kZScsICdtc2cnKTtcclxuXHR9XHJcblxyXG5cdHNtcy5zZW50ID0gZmFsc2U7XHJcblx0c21zLnNlbmRpbmcgPSAwO1xyXG5cclxuXHRfdmFsaWRhdGVEb2N1bWVudChzbXMpO1xyXG5cclxuXHRyZXR1cm4gUWNsb3VkU01TUXVldWUuY29sbGVjdGlvbi5pbnNlcnQoc21zKTtcclxufTsiLCJ2YXIgaXNDb25maWd1cmVkID0gZmFsc2U7XHJcbnZhciBzZW5kV29ya2VyID0gZnVuY3Rpb24odGFzaywgaW50ZXJ2YWwpIHtcclxuXHJcblx0aWYgKFFjbG91ZFNNU1F1ZXVlLmRlYnVnKSB7XHJcblx0XHRjb25zb2xlLmxvZygnUWNsb3VkU01TUXVldWU6IFNlbmQgd29ya2VyIHN0YXJ0ZWQsIHVzaW5nIGludGVydmFsOiAnICsgaW50ZXJ2YWwpO1xyXG5cdH1cclxuXHJcblx0cmV0dXJuIE1ldGVvci5zZXRJbnRlcnZhbChmdW5jdGlvbigpIHtcclxuXHRcdHRyeSB7XHJcblx0XHRcdHRhc2soKTtcclxuXHRcdH0gY2F0Y2ggKGVycm9yKSB7XHJcblx0XHRcdGlmIChRY2xvdWRTTVNRdWV1ZS5kZWJ1Zykge1xyXG5cdFx0XHRcdGNvbnNvbGUubG9nKCdRY2xvdWRTTVNRdWV1ZTogRXJyb3Igd2hpbGUgc2VuZGluZzogJyArIGVycm9yLm1lc3NhZ2UpO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0fSwgaW50ZXJ2YWwpO1xyXG59O1xyXG5cclxuLy8gdmFyIFNNUyA9IHJlcXVpcmUoJ2FsaXl1bi1zbXMtbm9kZScpLFxyXG4vLyBcdHNtc1NlbmRlcjtcclxuXHJcbnZhciBzZGthcHBpZCwgYXBwa2V5O1xyXG5cclxudmFyIHJlcXVlc3QgPSByZXF1aXJlKCdzdXBlcmFnZW50JyksXHJcblx0c2hhMjU2ID0gcmVxdWlyZSgnc2hhMjU2Jyk7XHJcblxyXG5mdW5jdGlvbiBnZXRSYW5kKGJpdCkge1xyXG5cclxuXHRiaXQgPSBiaXQgfHwgMTAwMDAwMDA7XHJcblxyXG5cdHJldHVybiBNYXRoLnJvdW5kKE1hdGgucmFuZG9tKCkgKiBiaXQpO1xyXG59O1xyXG5cclxuLy9zZW5kIHRleHQgbWVzc2FnZVxyXG5mdW5jdGlvbiBzZW5kVGV4dE1zZyhzZGthcHBpZCwgYXBwa2V5LCBwaG9uZSwgbXNnKSB7XHJcblxyXG5cdGlmICghcGhvbmUgfHwgLzFcXGR7MTJ9Ly50ZXN0KHBob25lKSkge1xyXG5cdFx0cmV0dXJuIGNvbnNvbGUubG9nKCdpbnZhbGlkIHBob25lIG51bWJlcicpO1xyXG5cdH1cclxuXHJcblx0dmFyIHVybCA9ICdodHRwczovL3l1bi50aW0ucXEuY29tL3Y1L3Rsc3Ntc3N2ci9zZW5kc21zP3Nka2FwcGlkPXtzZGthcHBpZH0mcmFuZG9tPXtyYW5kb219JztcclxuXHJcblx0dmFyIHJhbmQgPSBnZXRSYW5kKCksXHJcblx0XHR0aW1lID0gTWF0aC5yb3VuZCgrbmV3IERhdGUoKSAvIDEwMDApLFxyXG5cdFx0c2lnID0gc2hhMjU2KCdhcHBrZXk9JyArIGFwcGtleSArICcmcmFuZG9tPScgKyByYW5kICsgJyZ0aW1lPScgKyB0aW1lICsgJyZtb2JpbGU9JyArIHBob25lKTtcclxuXHJcblx0dmFyIGNvbnRlbnQgPSB7XHJcblx0XHRcInRlbFwiOiB7IC8v5aaC6ZyA5L2/55So5Zu96ZmF55S16K+d5Y+356CB6YCa55So5qC85byP77yM5aaC77yaXCIrODYxMzc4ODg4ODg4OFwiIO+8jOivt+S9v+eUqHNlbmRpc21z5o6l5Y+j6KeB5LiL5rOoXHJcblx0XHRcdFwibmF0aW9uY29kZVwiOiBcIjg2XCIsIC8v5Zu95a6256CBXHJcblx0XHRcdFwibW9iaWxlXCI6IHBob25lIC8v5omL5py65Y+356CBXHJcblx0XHR9LFxyXG5cdFx0XCJ0eXBlXCI6IDAsIC8vMDrmma7pgJrnn63kv6E7MTrokKXplIDnn63kv6HvvIjlvLrosIPvvJropoHmjInpnIDloavlgLzvvIzkuI3nhLbkvJrlvbHlk43liLDkuJrliqHnmoTmraPluLjkvb/nlKjvvIlcclxuXHRcdFwibXNnXCI6IG1zZywgLy91dGY457yW56CBIFxyXG5cdFx0XCJzaWdcIjogc2lnLCAvL2FwcOWHreivge+8jOWFt+S9k+iuoeeul+aWueW8j+ingeS4i+azqFxyXG5cdFx0XCJ0aW1lXCI6IHRpbWUsIC8vdW5peOaXtumXtOaIs++8jOivt+axguWPkei1t+aXtumXtO+8jOWmguaenOWSjOezu+e7n+aXtumXtOebuOW3rui2hei/hzEw5YiG6ZKf5YiZ5Lya6L+U5Zue5aSx6LSlXHJcblx0XHRcImV4dGVuZFwiOiBcIlwiLCAvL+mAmumBk+aJqeWxleegge+8jOWPr+mAieWtl+aute+8jOm7mOiupOayoeacieW8gOmAmijpnIDopoHloavnqbop44CCXHJcblx0XHQvL+WcqOefreS/oeWbnuWkjeWcuuaZr+S4re+8jOiFvuiur3NlcnZlcuS8muWOn+agt+i/lOWbnu+8jOW8gOWPkeiAheWPr+S+neatpOWMuuWIhuaYr+WTquenjeexu+Wei+eahOWbnuWkjVxyXG5cdFx0XCJleHRcIjogXCJcIiAvL+eUqOaIt+eahHNlc3Npb27lhoXlrrnvvIzohb7orq9zZXJ2ZXLlm57ljIXkuK3kvJrljp/moLfov5Tlm57vvIzlj6/pgInlrZfmrrXvvIzkuI3pnIDopoHlsLHloavnqbrjgIJcclxuXHR9O1xyXG5cdHVybCA9IHVybC5yZXBsYWNlKCd7c2RrYXBwaWR9Jywgc2RrYXBwaWQpXHJcblx0XHQucmVwbGFjZSgne3JhbmRvbX0nLCByYW5kKTtcclxuXHJcblx0cmVxdWVzdFxyXG5cdFx0LnBvc3QodXJsKVxyXG5cdFx0LnNlbmQoY29udGVudClcclxuXHRcdC5lbmQoZnVuY3Rpb24oZXJyLCByZXMpIHtcclxuXHRcdFx0aWYgKGVycikge1xyXG5cdFx0XHRcdHJldHVybiBjb25zb2xlLmVycm9yKGVycik7XHJcblx0XHRcdH1cclxuXHRcdH0pO1xyXG59O1xyXG5cclxuLypcclxuXHRvcHRpb25zOiB7XHJcblx0XHQvLyBDb250cm9scyB0aGUgc2VuZGluZyBpbnRlcnZhbFxyXG5cdFx0c2VuZEludGVydmFsOiBNYXRjaC5PcHRpb25hbChOdW1iZXIpLFxyXG5cdFx0Ly8gQ29udHJvbHMgdGhlIHNlbmRpbmcgYmF0Y2ggc2l6ZSBwZXIgaW50ZXJ2YWxcclxuXHRcdHNlbmRCYXRjaFNpemU6IE1hdGNoLk9wdGlvbmFsKE51bWJlciksXHJcblx0XHQvLyBBbGxvdyBvcHRpb25hbCBrZWVwaW5nIG5vdGlmaWNhdGlvbnMgaW4gY29sbGVjdGlvblxyXG5cdFx0a2VlcFNNUzogTWF0Y2guT3B0aW9uYWwoQm9vbGVhbilcclxuXHR9XHJcbiovXHJcblFjbG91ZFNNU1F1ZXVlLkNvbmZpZ3VyZSA9IGZ1bmN0aW9uKG9wdGlvbnMpIHtcclxuXHR2YXIgc2VsZiA9IHRoaXM7XHJcblx0b3B0aW9ucyA9IF8uZXh0ZW5kKHtcclxuXHRcdHNlbmRUaW1lb3V0OiA2MDAwMCwgLy8gVGltZW91dCBwZXJpb2QgZm9yIHNtcyBzZW5kXHJcblx0fSwgb3B0aW9ucyk7XHJcblxyXG5cdC8vIEJsb2NrIG11bHRpcGxlIGNhbGxzXHJcblx0aWYgKGlzQ29uZmlndXJlZCkge1xyXG5cdFx0dGhyb3cgbmV3IEVycm9yKCdRY2xvdWRTTVNRdWV1ZS5Db25maWd1cmUgc2hvdWxkIG5vdCBiZSBjYWxsZWQgbW9yZSB0aGFuIG9uY2UhJyk7XHJcblx0fVxyXG5cclxuXHRpc0NvbmZpZ3VyZWQgPSB0cnVlO1xyXG5cclxuXHQvLyBBZGQgZGVidWcgaW5mb1xyXG5cdGlmIChRY2xvdWRTTVNRdWV1ZS5kZWJ1Zykge1xyXG5cdFx0Y29uc29sZS5sb2coJ1FjbG91ZFNNU1F1ZXVlLkNvbmZpZ3VyZScsIG9wdGlvbnMpO1xyXG5cdH1cclxuXHJcblx0Ly8gc21zU2VuZGVyID0gbmV3IFNNUyh7XHJcblx0Ly8gXHRBY2Nlc3NLZXlJZDogb3B0aW9ucy5hY2Nlc3NLZXlJZCxcclxuXHQvLyBcdEFjY2Vzc0tleVNlY3JldDogb3B0aW9ucy5hY2Nlc3NLZXlTZWNyZXRcclxuXHQvLyB9KTtcclxuXHJcblx0c2RrYXBwaWQgPSBvcHRpb25zLnNka2FwcGlkO1xyXG5cdGFwcGtleSA9IG9wdGlvbnMuYXBwa2V5O1xyXG5cdHNpZ25uYW1lID0gb3B0aW9ucy5zaWdubmFtZSB8fCBcIlwiO1xyXG5cclxuXHRzZWxmLnNlbmRTTVMgPSBmdW5jdGlvbihzbXMpIHtcclxuXHRcdGlmIChRY2xvdWRTTVNRdWV1ZS5kZWJ1Zykge1xyXG5cdFx0XHRjb25zb2xlLmxvZyhcInNlbmRTTVNcIik7XHJcblx0XHRcdGNvbnNvbGUubG9nKHNtcyk7XHJcblx0XHR9XHJcblxyXG5cdFx0Ly8gc21zU2VuZGVyLnNlbmQoc21zLnNtcykuY2F0Y2goZXJyID0+IHtcclxuXHRcdC8vIFx0Y29uc29sZS5lcnJvcihlcnIpXHJcblx0XHQvLyB9KTtcclxuXHJcblx0XHRzZW5kVGV4dE1zZyhzZGthcHBpZCwgYXBwa2V5LCBzbXMuc21zLlJlY051bSwgc2lnbm5hbWUgKyBzbXMuc21zLm1zZyk7XHJcblx0fVxyXG5cclxuXHQvLyBVbml2ZXJzYWwgc2VuZCBmdW5jdGlvblxyXG5cdHZhciBfcXVlcnlTZW5kID0gZnVuY3Rpb24ob3B0aW9ucykge1xyXG5cclxuXHRcdGlmIChzZWxmLnNlbmRTTVMpIHtcclxuXHRcdFx0c2VsZi5zZW5kU01TKG9wdGlvbnMpO1xyXG5cdFx0fVxyXG5cclxuXHRcdHJldHVybiB7XHJcblx0XHRcdHNtczogW29wdGlvbnMuX2lkXVxyXG5cdFx0fTtcclxuXHR9O1xyXG5cclxuXHRzZWxmLnNlcnZlclNlbmQgPSBmdW5jdGlvbihvcHRpb25zKSB7XHJcblx0XHRvcHRpb25zID0gb3B0aW9ucyB8fCB7fTtcclxuXHRcdHJldHVybiBfcXVlcnlTZW5kKG9wdGlvbnMpO1xyXG5cdH07XHJcblxyXG5cclxuXHQvLyBUaGlzIGludGVydmFsIHdpbGwgYWxsb3cgb25seSBvbmUgc21zIHRvIGJlIHNlbnQgYXQgYSB0aW1lLCBpdFxyXG5cdC8vIHdpbGwgY2hlY2sgZm9yIG5ldyBzbXMgYXQgZXZlcnkgYG9wdGlvbnMuc2VuZEludGVydmFsYFxyXG5cdC8vIChkZWZhdWx0IGludGVydmFsIGlzIDE1MDAwIG1zKVxyXG5cdC8vXHJcblx0Ly8gSXQgbG9va3MgaW4gc21zIGNvbGxlY3Rpb24gdG8gc2VlIGlmIHRoZXJlcyBhbnkgcGVuZGluZ1xyXG5cdC8vIHNtcywgaWYgc28gaXQgd2lsbCB0cnkgdG8gcmVzZXJ2ZSB0aGUgcGVuZGluZyBzbXMuXHJcblx0Ly8gSWYgc3VjY2Vzc2Z1bGx5IHJlc2VydmVkIHRoZSBzZW5kIGlzIHN0YXJ0ZWQuXHJcblx0Ly9cclxuXHQvLyBJZiBzbXMucXVlcnkgaXMgdHlwZSBzdHJpbmcsIGl0J3MgYXNzdW1lZCB0byBiZSBhIGpzb24gc3RyaW5nXHJcblx0Ly8gdmVyc2lvbiBvZiB0aGUgcXVlcnkgc2VsZWN0b3IuIE1ha2luZyBpdCBhYmxlIHRvIGNhcnJ5IGAkYCBwcm9wZXJ0aWVzIGluXHJcblx0Ly8gdGhlIG1vbmdvIGNvbGxlY3Rpb24uXHJcblx0Ly9cclxuXHQvLyBQci4gZGVmYXVsdCBzbXMgYXJlIHJlbW92ZWQgZnJvbSB0aGUgY29sbGVjdGlvbiBhZnRlciBzZW5kIGhhdmVcclxuXHQvLyBjb21wbGV0ZWQuIFNldHRpbmcgYG9wdGlvbnMua2VlcFNNU2Agd2lsbCB1cGRhdGUgYW5kIGtlZXAgdGhlXHJcblx0Ly8gc21zIGVnLiBpZiBuZWVkZWQgZm9yIGhpc3RvcmljYWwgcmVhc29ucy5cclxuXHQvL1xyXG5cdC8vIEFmdGVyIHRoZSBzZW5kIGhhdmUgY29tcGxldGVkIGEgXCJzZW5kXCIgZXZlbnQgd2lsbCBiZSBlbWl0dGVkIHdpdGggYVxyXG5cdC8vIHN0YXR1cyBvYmplY3QgY29udGFpbmluZyBzbXMgaWQgYW5kIHRoZSBzZW5kIHJlc3VsdCBvYmplY3QuXHJcblx0Ly9cclxuXHR2YXIgaXNTZW5kaW5nID0gZmFsc2U7XHJcblxyXG5cdGlmIChvcHRpb25zLnNlbmRJbnRlcnZhbCAhPT0gbnVsbCkge1xyXG5cclxuXHRcdC8vIFRoaXMgd2lsbCByZXF1aXJlIGluZGV4IHNpbmNlIHdlIHNvcnQgc21zIGJ5IGNyZWF0ZWRBdFxyXG5cdFx0UWNsb3VkU01TUXVldWUuY29sbGVjdGlvbi5fZW5zdXJlSW5kZXgoe1xyXG5cdFx0XHRjcmVhdGVkQXQ6IDFcclxuXHRcdH0pO1xyXG5cdFx0UWNsb3VkU01TUXVldWUuY29sbGVjdGlvbi5fZW5zdXJlSW5kZXgoe1xyXG5cdFx0XHRzZW50OiAxXHJcblx0XHR9KTtcclxuXHRcdFFjbG91ZFNNU1F1ZXVlLmNvbGxlY3Rpb24uX2Vuc3VyZUluZGV4KHtcclxuXHRcdFx0c2VuZGluZzogMVxyXG5cdFx0fSk7XHJcblxyXG5cclxuXHRcdHZhciBzZW5kU01TID0gZnVuY3Rpb24oc21zKSB7XHJcblx0XHRcdC8vIFJlc2VydmUgc21zXHJcblx0XHRcdHZhciBub3cgPSArbmV3IERhdGUoKTtcclxuXHRcdFx0dmFyIHRpbWVvdXRBdCA9IG5vdyArIG9wdGlvbnMuc2VuZFRpbWVvdXQ7XHJcblx0XHRcdHZhciByZXNlcnZlZCA9IFFjbG91ZFNNU1F1ZXVlLmNvbGxlY3Rpb24udXBkYXRlKHtcclxuXHRcdFx0XHRfaWQ6IHNtcy5faWQsXHJcblx0XHRcdFx0c2VudDogZmFsc2UsIC8vIHh4eDogbmVlZCB0byBtYWtlIHN1cmUgdGhpcyBpcyBzZXQgb24gY3JlYXRlXHJcblx0XHRcdFx0c2VuZGluZzoge1xyXG5cdFx0XHRcdFx0JGx0OiBub3dcclxuXHRcdFx0XHR9XHJcblx0XHRcdH0sIHtcclxuXHRcdFx0XHQkc2V0OiB7XHJcblx0XHRcdFx0XHRzZW5kaW5nOiB0aW1lb3V0QXQsXHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9KTtcclxuXHJcblx0XHRcdC8vIE1ha2Ugc3VyZSB3ZSBvbmx5IGhhbmRsZSBzbXMgcmVzZXJ2ZWQgYnkgdGhpc1xyXG5cdFx0XHQvLyBpbnN0YW5jZVxyXG5cdFx0XHRpZiAocmVzZXJ2ZWQpIHtcclxuXHJcblx0XHRcdFx0Ly8gU2VuZCB0aGUgc21zXHJcblx0XHRcdFx0dmFyIHJlc3VsdCA9IFFjbG91ZFNNU1F1ZXVlLnNlcnZlclNlbmQoc21zKTtcclxuXHJcblx0XHRcdFx0aWYgKCFvcHRpb25zLmtlZXBTTVMpIHtcclxuXHRcdFx0XHRcdC8vIFByLiBEZWZhdWx0IHdlIHdpbGwgcmVtb3ZlIHNtc1xyXG5cdFx0XHRcdFx0UWNsb3VkU01TUXVldWUuY29sbGVjdGlvbi5yZW1vdmUoe1xyXG5cdFx0XHRcdFx0XHRfaWQ6IHNtcy5faWRcclxuXHRcdFx0XHRcdH0pO1xyXG5cdFx0XHRcdH0gZWxzZSB7XHJcblxyXG5cdFx0XHRcdFx0Ly8gVXBkYXRlIHRoZSBzbXNcclxuXHRcdFx0XHRcdFFjbG91ZFNNU1F1ZXVlLmNvbGxlY3Rpb24udXBkYXRlKHtcclxuXHRcdFx0XHRcdFx0X2lkOiBzbXMuX2lkXHJcblx0XHRcdFx0XHR9LCB7XHJcblx0XHRcdFx0XHRcdCRzZXQ6IHtcclxuXHRcdFx0XHRcdFx0XHQvLyBNYXJrIGFzIHNlbnRcclxuXHRcdFx0XHRcdFx0XHRzZW50OiB0cnVlLFxyXG5cdFx0XHRcdFx0XHRcdC8vIFNldCB0aGUgc2VudCBkYXRlXHJcblx0XHRcdFx0XHRcdFx0c2VudEF0OiBuZXcgRGF0ZSgpLFxyXG5cdFx0XHRcdFx0XHRcdC8vIE5vdCBiZWluZyBzZW50IGFueW1vcmVcclxuXHRcdFx0XHRcdFx0XHRzZW5kaW5nOiAwXHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdH0pO1xyXG5cclxuXHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdC8vIEVtaXQgdGhlIHNlbmRcclxuXHRcdFx0XHRzZWxmLmVtaXQoJ3NlbmQnLCB7XHJcblx0XHRcdFx0XHRzbXM6IHNtcy5faWQsXHJcblx0XHRcdFx0XHRyZXN1bHQ6IHJlc3VsdFxyXG5cdFx0XHRcdH0pO1xyXG5cclxuXHRcdFx0fSAvLyBFbHNlIGNvdWxkIG5vdCByZXNlcnZlXHJcblx0XHR9OyAvLyBFTyBzZW5kU01TXHJcblxyXG5cdFx0c2VuZFdvcmtlcihmdW5jdGlvbigpIHtcclxuXHJcblx0XHRcdGlmIChpc1NlbmRpbmcpIHtcclxuXHRcdFx0XHRyZXR1cm47XHJcblx0XHRcdH1cclxuXHRcdFx0Ly8gU2V0IHNlbmQgZmVuY2VcclxuXHRcdFx0aXNTZW5kaW5nID0gdHJ1ZTtcclxuXHJcblx0XHRcdHZhciBiYXRjaFNpemUgPSBvcHRpb25zLnNlbmRCYXRjaFNpemUgfHwgMTtcclxuXHJcblx0XHRcdHZhciBub3cgPSArbmV3IERhdGUoKTtcclxuXHJcblx0XHRcdC8vIEZpbmQgc21zIHRoYXQgYXJlIG5vdCBiZWluZyBvciBhbHJlYWR5IHNlbnRcclxuXHRcdFx0dmFyIHBlbmRpbmdTTVMgPSBRY2xvdWRTTVNRdWV1ZS5jb2xsZWN0aW9uLmZpbmQoe1xyXG5cdFx0XHRcdCRhbmQ6IFtcclxuXHRcdFx0XHRcdC8vIE1lc3NhZ2UgaXMgbm90IHNlbnRcclxuXHRcdFx0XHRcdHtcclxuXHRcdFx0XHRcdFx0c2VudDogZmFsc2VcclxuXHRcdFx0XHRcdH0sXHJcblx0XHRcdFx0XHQvLyBBbmQgbm90IGJlaW5nIHNlbnQgYnkgb3RoZXIgaW5zdGFuY2VzXHJcblx0XHRcdFx0XHR7XHJcblx0XHRcdFx0XHRcdHNlbmRpbmc6IHtcclxuXHRcdFx0XHRcdFx0XHQkbHQ6IG5vd1xyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XVxyXG5cdFx0XHR9LCB7XHJcblx0XHRcdFx0Ly8gU29ydCBieSBjcmVhdGVkIGRhdGVcclxuXHRcdFx0XHRzb3J0OiB7XHJcblx0XHRcdFx0XHRjcmVhdGVkQXQ6IDFcclxuXHRcdFx0XHR9LFxyXG5cdFx0XHRcdGxpbWl0OiBiYXRjaFNpemVcclxuXHRcdFx0fSk7XHJcblxyXG5cdFx0XHRwZW5kaW5nU01TLmZvckVhY2goZnVuY3Rpb24oc21zKSB7XHJcblx0XHRcdFx0dHJ5IHtcclxuXHRcdFx0XHRcdHNlbmRTTVMoc21zKTtcclxuXHRcdFx0XHR9IGNhdGNoIChlcnJvcikge1xyXG5cclxuXHRcdFx0XHRcdGlmIChRY2xvdWRTTVNRdWV1ZS5kZWJ1Zykge1xyXG5cdFx0XHRcdFx0XHRjb25zb2xlLmxvZygnUWNsb3VkU01TUXVldWU6IENvdWxkIG5vdCBzZW5kIHNtcyBpZDogXCInICsgc21zLl9pZCArICdcIiwgRXJyb3I6ICcgKyBlcnJvci5tZXNzYWdlKTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9XHJcblx0XHRcdH0pOyAvLyBFTyBmb3JFYWNoXHJcblxyXG5cdFx0XHQvLyBSZW1vdmUgdGhlIHNlbmQgZmVuY2VcclxuXHRcdFx0aXNTZW5kaW5nID0gZmFsc2U7XHJcblx0XHR9LCBvcHRpb25zLnNlbmRJbnRlcnZhbCB8fCAxNTAwMCk7IC8vIERlZmF1bHQgZXZlcnkgMTV0aCBzZWNcclxuXHJcblx0fSBlbHNlIHtcclxuXHRcdGlmIChRY2xvdWRTTVNRdWV1ZS5kZWJ1Zykge1xyXG5cdFx0XHRjb25zb2xlLmxvZygnUWNsb3VkU01TUXVldWU6IFNlbmQgc2VydmVyIGlzIGRpc2FibGVkJyk7XHJcblx0XHR9XHJcblx0fVxyXG5cclxufTsiLCJNZXRlb3Iuc3RhcnR1cCAtPlxyXG5cdGlmIE1ldGVvci5zZXR0aW5ncy5zbXM/LnFjbG91ZD8uc21zcXVldWVfaW50ZXJ2YWxcclxuXHRcdFFjbG91ZFNNU1F1ZXVlLkNvbmZpZ3VyZVxyXG5cdFx0XHRzZW5kSW50ZXJ2YWw6IE1ldGVvci5zZXR0aW5ncy5zbXMucWNsb3VkLnNtc3F1ZXVlX2ludGVydmFsXHJcblx0XHRcdHNlbmRCYXRjaFNpemU6IDEwXHJcblx0XHRcdGtlZXBTTVM6IHRydWVcclxuXHRcdFx0c2RrYXBwaWQ6IE1ldGVvci5zZXR0aW5ncy5zbXMucWNsb3VkLnNka2FwcGlkXHJcblx0XHRcdGFwcGtleTogTWV0ZW9yLnNldHRpbmdzLnNtcy5xY2xvdWQuYXBwa2V5XHJcblx0XHRcdHNpZ25uYW1lOiBNZXRlb3Iuc2V0dGluZ3Muc21zLnFjbG91ZC5zaWdubmFtZVxyXG4iLCJNZXRlb3Iuc3RhcnR1cChmdW5jdGlvbigpIHtcbiAgdmFyIHJlZiwgcmVmMTtcbiAgaWYgKChyZWYgPSBNZXRlb3Iuc2V0dGluZ3Muc21zKSAhPSBudWxsID8gKHJlZjEgPSByZWYucWNsb3VkKSAhPSBudWxsID8gcmVmMS5zbXNxdWV1ZV9pbnRlcnZhbCA6IHZvaWQgMCA6IHZvaWQgMCkge1xuICAgIHJldHVybiBRY2xvdWRTTVNRdWV1ZS5Db25maWd1cmUoe1xuICAgICAgc2VuZEludGVydmFsOiBNZXRlb3Iuc2V0dGluZ3Muc21zLnFjbG91ZC5zbXNxdWV1ZV9pbnRlcnZhbCxcbiAgICAgIHNlbmRCYXRjaFNpemU6IDEwLFxuICAgICAga2VlcFNNUzogdHJ1ZSxcbiAgICAgIHNka2FwcGlkOiBNZXRlb3Iuc2V0dGluZ3Muc21zLnFjbG91ZC5zZGthcHBpZCxcbiAgICAgIGFwcGtleTogTWV0ZW9yLnNldHRpbmdzLnNtcy5xY2xvdWQuYXBwa2V5LFxuICAgICAgc2lnbm5hbWU6IE1ldGVvci5zZXR0aW5ncy5zbXMucWNsb3VkLnNpZ25uYW1lXG4gICAgfSk7XG4gIH1cbn0pO1xuIl19
