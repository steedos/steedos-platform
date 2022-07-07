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
var Promise = Package.promise.Promise;

/* Package-scope variables */
var QcloudSMSQueue, signname, __coffeescriptShare;

var require = meteorInstall({"node_modules":{"meteor":{"steedos:qcloud-smsqueue":{"checkNpm.js":function module(require,exports,module){

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
  "sha256": "^0.2.0"
}, 'steedos:qcloud-smsqueue');
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"lib":{"common":{"main.js":function module(){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/steedos_qcloud-smsqueue/lib/common/main.js                                                                //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
QcloudSMSQueue = new EventState();
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"sms.js":function module(){

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

}},"server":{"api.js":function module(require){

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


    sendTextMsg(sdkappid, appkey, sms.sms.RecNum, (sms.signname || signname) + sms.sms.msg);
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

}}},"server":{"startup.coffee":function module(){

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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvczpxY2xvdWQtc21zcXVldWUvY2hlY2tOcG0uanMiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3M6cWNsb3VkLXNtc3F1ZXVlL2xpYi9jb21tb24vbWFpbi5qcyIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvczpxY2xvdWQtc21zcXVldWUvbGliL2NvbW1vbi9zbXMuanMiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3M6cWNsb3VkLXNtc3F1ZXVlL2xpYi9zZXJ2ZXIvYXBpLmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zX3FjbG91ZC1zbXNxdWV1ZS9zZXJ2ZXIvc3RhcnR1cC5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3NlcnZlci9zdGFydHVwLmNvZmZlZSJdLCJuYW1lcyI6WyJjaGVja05wbVZlcnNpb25zIiwibW9kdWxlIiwibGluayIsInYiLCJRY2xvdWRTTVNRdWV1ZSIsIkV2ZW50U3RhdGUiLCJjb2xsZWN0aW9uIiwiU01TUXVldWUiLCJfdmFsaWRhdGVEb2N1bWVudCIsInNtcyIsImNoZWNrIiwiT2JqZWN0Iiwic2VudCIsIk1hdGNoIiwiT3B0aW9uYWwiLCJCb29sZWFuIiwic2VuZGluZyIsIkludGVnZXIiLCJjcmVhdGVkQXQiLCJEYXRlIiwiY3JlYXRlZEJ5IiwiT25lT2YiLCJTdHJpbmciLCJzZW5kIiwib3B0aW9ucyIsImN1cnJlbnRVc2VyIiwiTWV0ZW9yIiwiaXNDbGllbnQiLCJ1c2VySWQiLCJpc1NlcnZlciIsIl8iLCJleHRlbmQiLCJ0ZXN0IiwicGljayIsImluc2VydCIsImlzQ29uZmlndXJlZCIsInNlbmRXb3JrZXIiLCJ0YXNrIiwiaW50ZXJ2YWwiLCJkZWJ1ZyIsImNvbnNvbGUiLCJsb2ciLCJzZXRJbnRlcnZhbCIsImVycm9yIiwibWVzc2FnZSIsInNka2FwcGlkIiwiYXBwa2V5IiwicmVxdWVzdCIsInJlcXVpcmUiLCJzaGEyNTYiLCJnZXRSYW5kIiwiYml0IiwiTWF0aCIsInJvdW5kIiwicmFuZG9tIiwic2VuZFRleHRNc2ciLCJwaG9uZSIsIm1zZyIsInVybCIsInJhbmQiLCJ0aW1lIiwic2lnIiwiY29udGVudCIsInJlcGxhY2UiLCJwb3N0IiwiZW5kIiwiZXJyIiwicmVzIiwiQ29uZmlndXJlIiwic2VsZiIsInNlbmRUaW1lb3V0IiwiRXJyb3IiLCJzaWdubmFtZSIsInNlbmRTTVMiLCJSZWNOdW0iLCJfcXVlcnlTZW5kIiwiX2lkIiwic2VydmVyU2VuZCIsImlzU2VuZGluZyIsInNlbmRJbnRlcnZhbCIsIl9lbnN1cmVJbmRleCIsIm5vdyIsInRpbWVvdXRBdCIsInJlc2VydmVkIiwidXBkYXRlIiwiJGx0IiwiJHNldCIsInJlc3VsdCIsImtlZXBTTVMiLCJyZW1vdmUiLCJzZW50QXQiLCJlbWl0IiwiYmF0Y2hTaXplIiwic2VuZEJhdGNoU2l6ZSIsInBlbmRpbmdTTVMiLCJmaW5kIiwiJGFuZCIsInNvcnQiLCJsaW1pdCIsImZvckVhY2giLCJzdGFydHVwIiwicmVmIiwicmVmMSIsInNldHRpbmdzIiwicWNsb3VkIiwic21zcXVldWVfaW50ZXJ2YWwiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLElBQUlBLGdCQUFKO0FBQXFCQyxNQUFNLENBQUNDLElBQVAsQ0FBWSxvQ0FBWixFQUFpRDtBQUFDRixrQkFBZ0IsQ0FBQ0csQ0FBRCxFQUFHO0FBQUNILG9CQUFnQixHQUFDRyxDQUFqQjtBQUFtQjs7QUFBeEMsQ0FBakQsRUFBMkYsQ0FBM0Y7QUFDckJILGdCQUFnQixDQUFDO0FBQ2hCLFlBQVU7QUFETSxDQUFELEVBRWIseUJBRmEsQ0FBaEIsQzs7Ozs7Ozs7Ozs7QUNEQUksY0FBYyxHQUFHLElBQUlDLFVBQUosRUFBakIsQzs7Ozs7Ozs7Ozs7QUNBQUQsY0FBYyxDQUFDRSxVQUFmLEdBQTRCQyxRQUFRLENBQUNELFVBQXJDOztBQUVBLElBQUlF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Q0FBZTtBQUNkLE1BQUFDLEdBQUEsRUFBQUMsSUFBQTs7QUFBQSxPQUFBRCxNQUFBM0UsT0FBQTZFLFFBQUEsQ0FBQTlGLEdBQUEsYUFBQTZGLE9BQUFELElBQUFHLE1BQUEsWUFBQUYsS0FBZ0NHLGlCQUFoQyxHQUFnQyxNQUFoQyxHQUFnQyxNQUFoQztBQ0VHLFdEREZyRyxlQUFlZ0UsU0FBZixDQUNDO0FBQUFXLG9CQUFjckQsT0FBTzZFLFFBQVAsQ0FBZ0I5RixHQUFoQixDQUFvQitGLE1BQXBCLENBQTJCQyxpQkFBekM7QUFDQVoscUJBQWUsRUFEZjtBQUVBTCxlQUFTLElBRlQ7QUFHQTNDLGdCQUFVbkIsT0FBTzZFLFFBQVAsQ0FBZ0I5RixHQUFoQixDQUFvQitGLE1BQXBCLENBQTJCM0QsUUFIckM7QUFJQUMsY0FBUXBCLE9BQU82RSxRQUFQLENBQWdCOUYsR0FBaEIsQ0FBb0IrRixNQUFwQixDQUEyQjFELE1BSm5DO0FBS0EwQixnQkFBVTlDLE9BQU82RSxRQUFQLENBQWdCOUYsR0FBaEIsQ0FBb0IrRixNQUFwQixDQUEyQmhDO0FBTHJDLEtBREQsQ0NDRTtBQVFEO0FEWEgsRyIsImZpbGUiOiIvcGFja2FnZXMvc3RlZWRvc19xY2xvdWQtc21zcXVldWUuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBjaGVja05wbVZlcnNpb25zIH0gZnJvbSAnbWV0ZW9yL3RtZWFzZGF5OmNoZWNrLW5wbS12ZXJzaW9ucyc7XG5jaGVja05wbVZlcnNpb25zKHtcblx0XCJzaGEyNTZcIjogXCJeMC4yLjBcIlxufSwgJ3N0ZWVkb3M6cWNsb3VkLXNtc3F1ZXVlJyk7IiwiUWNsb3VkU01TUXVldWUgPSBuZXcgRXZlbnRTdGF0ZSgpOyIsIlFjbG91ZFNNU1F1ZXVlLmNvbGxlY3Rpb24gPSBTTVNRdWV1ZS5jb2xsZWN0aW9uO1xuXG52YXIgX3ZhbGlkYXRlRG9jdW1lbnQgPSBmdW5jdGlvbihzbXMpIHtcblxuXHRjaGVjayhzbXMsIHtcblx0XHRzbXM6IE9iamVjdCxcblx0XHRzZW50OiBNYXRjaC5PcHRpb25hbChCb29sZWFuKSxcblx0XHRzZW5kaW5nOiBNYXRjaC5PcHRpb25hbChNYXRjaC5JbnRlZ2VyKSxcblx0XHRjcmVhdGVkQXQ6IERhdGUsXG5cdFx0Y3JlYXRlZEJ5OiBNYXRjaC5PbmVPZihTdHJpbmcsIG51bGwpXG5cdH0pO1xuXG59O1xuXG5RY2xvdWRTTVNRdWV1ZS5zZW5kID0gZnVuY3Rpb24ob3B0aW9ucykge1xuXHR2YXIgY3VycmVudFVzZXIgPSBNZXRlb3IuaXNDbGllbnQgJiYgTWV0ZW9yLnVzZXJJZCAmJiBNZXRlb3IudXNlcklkKCkgfHwgTWV0ZW9yLmlzU2VydmVyICYmIChvcHRpb25zLmNyZWF0ZWRCeSB8fCAnPFNFUlZFUj4nKSB8fCBudWxsXG5cdHZhciBzbXMgPSBfLmV4dGVuZCh7XG5cdFx0Y3JlYXRlZEF0OiBuZXcgRGF0ZSgpLFxuXHRcdGNyZWF0ZWRCeTogY3VycmVudFVzZXJcblx0fSk7XG5cblx0aWYgKE1hdGNoLnRlc3Qob3B0aW9ucywgT2JqZWN0KSkge1xuXHRcdHNtcy5zbXMgPSBfLnBpY2sob3B0aW9ucywgJ0Zvcm1hdCcsICdBY3Rpb24nLCAnUGFyYW1TdHJpbmcnLCAnUmVjTnVtJywgJ1NpZ25OYW1lJywgJ1RlbXBsYXRlQ29kZScsICdtc2cnKTtcblx0fVxuXG5cdHNtcy5zZW50ID0gZmFsc2U7XG5cdHNtcy5zZW5kaW5nID0gMDtcblxuXHRfdmFsaWRhdGVEb2N1bWVudChzbXMpO1xuXG5cdHJldHVybiBRY2xvdWRTTVNRdWV1ZS5jb2xsZWN0aW9uLmluc2VydChzbXMpO1xufTsiLCJ2YXIgaXNDb25maWd1cmVkID0gZmFsc2U7XG52YXIgc2VuZFdvcmtlciA9IGZ1bmN0aW9uKHRhc2ssIGludGVydmFsKSB7XG5cblx0aWYgKFFjbG91ZFNNU1F1ZXVlLmRlYnVnKSB7XG5cdFx0Y29uc29sZS5sb2coJ1FjbG91ZFNNU1F1ZXVlOiBTZW5kIHdvcmtlciBzdGFydGVkLCB1c2luZyBpbnRlcnZhbDogJyArIGludGVydmFsKTtcblx0fVxuXG5cdHJldHVybiBNZXRlb3Iuc2V0SW50ZXJ2YWwoZnVuY3Rpb24oKSB7XG5cdFx0dHJ5IHtcblx0XHRcdHRhc2soKTtcblx0XHR9IGNhdGNoIChlcnJvcikge1xuXHRcdFx0aWYgKFFjbG91ZFNNU1F1ZXVlLmRlYnVnKSB7XG5cdFx0XHRcdGNvbnNvbGUubG9nKCdRY2xvdWRTTVNRdWV1ZTogRXJyb3Igd2hpbGUgc2VuZGluZzogJyArIGVycm9yLm1lc3NhZ2UpO1xuXHRcdFx0fVxuXHRcdH1cblx0fSwgaW50ZXJ2YWwpO1xufTtcblxuLy8gdmFyIFNNUyA9IHJlcXVpcmUoJ2FsaXl1bi1zbXMtbm9kZScpLFxuLy8gXHRzbXNTZW5kZXI7XG5cbnZhciBzZGthcHBpZCwgYXBwa2V5O1xuXG52YXIgcmVxdWVzdCA9IHJlcXVpcmUoJ3N1cGVyYWdlbnQnKSxcblx0c2hhMjU2ID0gcmVxdWlyZSgnc2hhMjU2Jyk7XG5cbmZ1bmN0aW9uIGdldFJhbmQoYml0KSB7XG5cblx0Yml0ID0gYml0IHx8IDEwMDAwMDAwO1xuXG5cdHJldHVybiBNYXRoLnJvdW5kKE1hdGgucmFuZG9tKCkgKiBiaXQpO1xufTtcblxuLy9zZW5kIHRleHQgbWVzc2FnZVxuZnVuY3Rpb24gc2VuZFRleHRNc2coc2RrYXBwaWQsIGFwcGtleSwgcGhvbmUsIG1zZykge1xuXG5cdGlmICghcGhvbmUgfHwgLzFcXGR7MTJ9Ly50ZXN0KHBob25lKSkge1xuXHRcdHJldHVybiBjb25zb2xlLmxvZygnaW52YWxpZCBwaG9uZSBudW1iZXInKTtcblx0fVxuXG5cdHZhciB1cmwgPSAnaHR0cHM6Ly95dW4udGltLnFxLmNvbS92NS90bHNzbXNzdnIvc2VuZHNtcz9zZGthcHBpZD17c2RrYXBwaWR9JnJhbmRvbT17cmFuZG9tfSc7XG5cblx0dmFyIHJhbmQgPSBnZXRSYW5kKCksXG5cdFx0dGltZSA9IE1hdGgucm91bmQoK25ldyBEYXRlKCkgLyAxMDAwKSxcblx0XHRzaWcgPSBzaGEyNTYoJ2FwcGtleT0nICsgYXBwa2V5ICsgJyZyYW5kb209JyArIHJhbmQgKyAnJnRpbWU9JyArIHRpbWUgKyAnJm1vYmlsZT0nICsgcGhvbmUpO1xuXG5cdHZhciBjb250ZW50ID0ge1xuXHRcdFwidGVsXCI6IHsgLy/lpoLpnIDkvb/nlKjlm73pmYXnlLXor53lj7fnoIHpgJrnlKjmoLzlvI/vvIzlpoLvvJpcIis4NjEzNzg4ODg4ODg4XCIg77yM6K+35L2/55Soc2VuZGlzbXPmjqXlj6Pop4HkuIvms6hcblx0XHRcdFwibmF0aW9uY29kZVwiOiBcIjg2XCIsIC8v5Zu95a6256CBXG5cdFx0XHRcIm1vYmlsZVwiOiBwaG9uZSAvL+aJi+acuuWPt+eggVxuXHRcdH0sXG5cdFx0XCJ0eXBlXCI6IDAsIC8vMDrmma7pgJrnn63kv6E7MTrokKXplIDnn63kv6HvvIjlvLrosIPvvJropoHmjInpnIDloavlgLzvvIzkuI3nhLbkvJrlvbHlk43liLDkuJrliqHnmoTmraPluLjkvb/nlKjvvIlcblx0XHRcIm1zZ1wiOiBtc2csIC8vdXRmOOe8lueggSBcblx0XHRcInNpZ1wiOiBzaWcsIC8vYXBw5Yet6K+B77yM5YW35L2T6K6h566X5pa55byP6KeB5LiL5rOoXG5cdFx0XCJ0aW1lXCI6IHRpbWUsIC8vdW5peOaXtumXtOaIs++8jOivt+axguWPkei1t+aXtumXtO+8jOWmguaenOWSjOezu+e7n+aXtumXtOebuOW3rui2hei/hzEw5YiG6ZKf5YiZ5Lya6L+U5Zue5aSx6LSlXG5cdFx0XCJleHRlbmRcIjogXCJcIiwgLy/pgJrpgZPmianlsZXnoIHvvIzlj6/pgInlrZfmrrXvvIzpu5jorqTmsqHmnInlvIDpgJoo6ZyA6KaB5aGr56m6KeOAglxuXHRcdC8v5Zyo55+t5L+h5Zue5aSN5Zy65pmv5Lit77yM6IW+6K6vc2VydmVy5Lya5Y6f5qC36L+U5Zue77yM5byA5Y+R6ICF5Y+v5L6d5q2k5Yy65YiG5piv5ZOq56eN57G75Z6L55qE5Zue5aSNXG5cdFx0XCJleHRcIjogXCJcIiAvL+eUqOaIt+eahHNlc3Npb27lhoXlrrnvvIzohb7orq9zZXJ2ZXLlm57ljIXkuK3kvJrljp/moLfov5Tlm57vvIzlj6/pgInlrZfmrrXvvIzkuI3pnIDopoHlsLHloavnqbrjgIJcblx0fTtcblx0dXJsID0gdXJsLnJlcGxhY2UoJ3tzZGthcHBpZH0nLCBzZGthcHBpZClcblx0XHQucmVwbGFjZSgne3JhbmRvbX0nLCByYW5kKTtcblx0cmVxdWVzdFxuXHRcdC5wb3N0KHVybClcblx0XHQuc2VuZChjb250ZW50KVxuXHRcdC5lbmQoZnVuY3Rpb24oZXJyLCByZXMpIHtcblx0XHRcdGlmIChlcnIpIHtcblx0XHRcdFx0cmV0dXJuIGNvbnNvbGUuZXJyb3IoZXJyKTtcblx0XHRcdH1cblx0XHR9KTtcbn07XG5cbi8qXG5cdG9wdGlvbnM6IHtcblx0XHQvLyBDb250cm9scyB0aGUgc2VuZGluZyBpbnRlcnZhbFxuXHRcdHNlbmRJbnRlcnZhbDogTWF0Y2guT3B0aW9uYWwoTnVtYmVyKSxcblx0XHQvLyBDb250cm9scyB0aGUgc2VuZGluZyBiYXRjaCBzaXplIHBlciBpbnRlcnZhbFxuXHRcdHNlbmRCYXRjaFNpemU6IE1hdGNoLk9wdGlvbmFsKE51bWJlciksXG5cdFx0Ly8gQWxsb3cgb3B0aW9uYWwga2VlcGluZyBub3RpZmljYXRpb25zIGluIGNvbGxlY3Rpb25cblx0XHRrZWVwU01TOiBNYXRjaC5PcHRpb25hbChCb29sZWFuKVxuXHR9XG4qL1xuUWNsb3VkU01TUXVldWUuQ29uZmlndXJlID0gZnVuY3Rpb24ob3B0aW9ucykge1xuXHR2YXIgc2VsZiA9IHRoaXM7XG5cdG9wdGlvbnMgPSBfLmV4dGVuZCh7XG5cdFx0c2VuZFRpbWVvdXQ6IDYwMDAwLCAvLyBUaW1lb3V0IHBlcmlvZCBmb3Igc21zIHNlbmRcblx0fSwgb3B0aW9ucyk7XG5cblx0Ly8gQmxvY2sgbXVsdGlwbGUgY2FsbHNcblx0aWYgKGlzQ29uZmlndXJlZCkge1xuXHRcdHRocm93IG5ldyBFcnJvcignUWNsb3VkU01TUXVldWUuQ29uZmlndXJlIHNob3VsZCBub3QgYmUgY2FsbGVkIG1vcmUgdGhhbiBvbmNlIScpO1xuXHR9XG5cblx0aXNDb25maWd1cmVkID0gdHJ1ZTtcblxuXHQvLyBBZGQgZGVidWcgaW5mb1xuXHRpZiAoUWNsb3VkU01TUXVldWUuZGVidWcpIHtcblx0XHRjb25zb2xlLmxvZygnUWNsb3VkU01TUXVldWUuQ29uZmlndXJlJywgb3B0aW9ucyk7XG5cdH1cblxuXHQvLyBzbXNTZW5kZXIgPSBuZXcgU01TKHtcblx0Ly8gXHRBY2Nlc3NLZXlJZDogb3B0aW9ucy5hY2Nlc3NLZXlJZCxcblx0Ly8gXHRBY2Nlc3NLZXlTZWNyZXQ6IG9wdGlvbnMuYWNjZXNzS2V5U2VjcmV0XG5cdC8vIH0pO1xuXG5cdHNka2FwcGlkID0gb3B0aW9ucy5zZGthcHBpZDtcblx0YXBwa2V5ID0gb3B0aW9ucy5hcHBrZXk7XG5cdHNpZ25uYW1lID0gb3B0aW9ucy5zaWdubmFtZSB8fCBcIlwiO1xuXG5cdHNlbGYuc2VuZFNNUyA9IGZ1bmN0aW9uKHNtcykge1xuXHRcdGlmIChRY2xvdWRTTVNRdWV1ZS5kZWJ1Zykge1xuXHRcdFx0Y29uc29sZS5sb2coXCJzZW5kU01TXCIpO1xuXHRcdFx0Y29uc29sZS5sb2coc21zKTtcblx0XHR9XG5cblx0XHQvLyBzbXNTZW5kZXIuc2VuZChzbXMuc21zKS5jYXRjaChlcnIgPT4ge1xuXHRcdC8vIFx0Y29uc29sZS5lcnJvcihlcnIpXG5cdFx0Ly8gfSk7XG5cblx0XHRzZW5kVGV4dE1zZyhzZGthcHBpZCwgYXBwa2V5LCBzbXMuc21zLlJlY051bSwgKHNtcy5zaWdubmFtZSB8fCBzaWdubmFtZSkgKyBzbXMuc21zLm1zZyk7XG5cdH1cblxuXHQvLyBVbml2ZXJzYWwgc2VuZCBmdW5jdGlvblxuXHR2YXIgX3F1ZXJ5U2VuZCA9IGZ1bmN0aW9uKG9wdGlvbnMpIHtcblxuXHRcdGlmIChzZWxmLnNlbmRTTVMpIHtcblx0XHRcdHNlbGYuc2VuZFNNUyhvcHRpb25zKTtcblx0XHR9XG5cblx0XHRyZXR1cm4ge1xuXHRcdFx0c21zOiBbb3B0aW9ucy5faWRdXG5cdFx0fTtcblx0fTtcblxuXHRzZWxmLnNlcnZlclNlbmQgPSBmdW5jdGlvbihvcHRpb25zKSB7XG5cdFx0b3B0aW9ucyA9IG9wdGlvbnMgfHwge307XG5cdFx0cmV0dXJuIF9xdWVyeVNlbmQob3B0aW9ucyk7XG5cdH07XG5cblxuXHQvLyBUaGlzIGludGVydmFsIHdpbGwgYWxsb3cgb25seSBvbmUgc21zIHRvIGJlIHNlbnQgYXQgYSB0aW1lLCBpdFxuXHQvLyB3aWxsIGNoZWNrIGZvciBuZXcgc21zIGF0IGV2ZXJ5IGBvcHRpb25zLnNlbmRJbnRlcnZhbGBcblx0Ly8gKGRlZmF1bHQgaW50ZXJ2YWwgaXMgMTUwMDAgbXMpXG5cdC8vXG5cdC8vIEl0IGxvb2tzIGluIHNtcyBjb2xsZWN0aW9uIHRvIHNlZSBpZiB0aGVyZXMgYW55IHBlbmRpbmdcblx0Ly8gc21zLCBpZiBzbyBpdCB3aWxsIHRyeSB0byByZXNlcnZlIHRoZSBwZW5kaW5nIHNtcy5cblx0Ly8gSWYgc3VjY2Vzc2Z1bGx5IHJlc2VydmVkIHRoZSBzZW5kIGlzIHN0YXJ0ZWQuXG5cdC8vXG5cdC8vIElmIHNtcy5xdWVyeSBpcyB0eXBlIHN0cmluZywgaXQncyBhc3N1bWVkIHRvIGJlIGEganNvbiBzdHJpbmdcblx0Ly8gdmVyc2lvbiBvZiB0aGUgcXVlcnkgc2VsZWN0b3IuIE1ha2luZyBpdCBhYmxlIHRvIGNhcnJ5IGAkYCBwcm9wZXJ0aWVzIGluXG5cdC8vIHRoZSBtb25nbyBjb2xsZWN0aW9uLlxuXHQvL1xuXHQvLyBQci4gZGVmYXVsdCBzbXMgYXJlIHJlbW92ZWQgZnJvbSB0aGUgY29sbGVjdGlvbiBhZnRlciBzZW5kIGhhdmVcblx0Ly8gY29tcGxldGVkLiBTZXR0aW5nIGBvcHRpb25zLmtlZXBTTVNgIHdpbGwgdXBkYXRlIGFuZCBrZWVwIHRoZVxuXHQvLyBzbXMgZWcuIGlmIG5lZWRlZCBmb3IgaGlzdG9yaWNhbCByZWFzb25zLlxuXHQvL1xuXHQvLyBBZnRlciB0aGUgc2VuZCBoYXZlIGNvbXBsZXRlZCBhIFwic2VuZFwiIGV2ZW50IHdpbGwgYmUgZW1pdHRlZCB3aXRoIGFcblx0Ly8gc3RhdHVzIG9iamVjdCBjb250YWluaW5nIHNtcyBpZCBhbmQgdGhlIHNlbmQgcmVzdWx0IG9iamVjdC5cblx0Ly9cblx0dmFyIGlzU2VuZGluZyA9IGZhbHNlO1xuXG5cdGlmIChvcHRpb25zLnNlbmRJbnRlcnZhbCAhPT0gbnVsbCkge1xuXG5cdFx0Ly8gVGhpcyB3aWxsIHJlcXVpcmUgaW5kZXggc2luY2Ugd2Ugc29ydCBzbXMgYnkgY3JlYXRlZEF0XG5cdFx0UWNsb3VkU01TUXVldWUuY29sbGVjdGlvbi5fZW5zdXJlSW5kZXgoe1xuXHRcdFx0Y3JlYXRlZEF0OiAxXG5cdFx0fSk7XG5cdFx0UWNsb3VkU01TUXVldWUuY29sbGVjdGlvbi5fZW5zdXJlSW5kZXgoe1xuXHRcdFx0c2VudDogMVxuXHRcdH0pO1xuXHRcdFFjbG91ZFNNU1F1ZXVlLmNvbGxlY3Rpb24uX2Vuc3VyZUluZGV4KHtcblx0XHRcdHNlbmRpbmc6IDFcblx0XHR9KTtcblxuXG5cdFx0dmFyIHNlbmRTTVMgPSBmdW5jdGlvbihzbXMpIHtcblx0XHRcdC8vIFJlc2VydmUgc21zXG5cdFx0XHR2YXIgbm93ID0gK25ldyBEYXRlKCk7XG5cdFx0XHR2YXIgdGltZW91dEF0ID0gbm93ICsgb3B0aW9ucy5zZW5kVGltZW91dDtcblx0XHRcdHZhciByZXNlcnZlZCA9IFFjbG91ZFNNU1F1ZXVlLmNvbGxlY3Rpb24udXBkYXRlKHtcblx0XHRcdFx0X2lkOiBzbXMuX2lkLFxuXHRcdFx0XHRzZW50OiBmYWxzZSwgLy8geHh4OiBuZWVkIHRvIG1ha2Ugc3VyZSB0aGlzIGlzIHNldCBvbiBjcmVhdGVcblx0XHRcdFx0c2VuZGluZzoge1xuXHRcdFx0XHRcdCRsdDogbm93XG5cdFx0XHRcdH1cblx0XHRcdH0sIHtcblx0XHRcdFx0JHNldDoge1xuXHRcdFx0XHRcdHNlbmRpbmc6IHRpbWVvdXRBdCxcblx0XHRcdFx0fVxuXHRcdFx0fSk7XG5cblx0XHRcdC8vIE1ha2Ugc3VyZSB3ZSBvbmx5IGhhbmRsZSBzbXMgcmVzZXJ2ZWQgYnkgdGhpc1xuXHRcdFx0Ly8gaW5zdGFuY2Vcblx0XHRcdGlmIChyZXNlcnZlZCkge1xuXG5cdFx0XHRcdC8vIFNlbmQgdGhlIHNtc1xuXHRcdFx0XHR2YXIgcmVzdWx0ID0gUWNsb3VkU01TUXVldWUuc2VydmVyU2VuZChzbXMpO1xuXG5cdFx0XHRcdGlmICghb3B0aW9ucy5rZWVwU01TKSB7XG5cdFx0XHRcdFx0Ly8gUHIuIERlZmF1bHQgd2Ugd2lsbCByZW1vdmUgc21zXG5cdFx0XHRcdFx0UWNsb3VkU01TUXVldWUuY29sbGVjdGlvbi5yZW1vdmUoe1xuXHRcdFx0XHRcdFx0X2lkOiBzbXMuX2lkXG5cdFx0XHRcdFx0fSk7XG5cdFx0XHRcdH0gZWxzZSB7XG5cblx0XHRcdFx0XHQvLyBVcGRhdGUgdGhlIHNtc1xuXHRcdFx0XHRcdFFjbG91ZFNNU1F1ZXVlLmNvbGxlY3Rpb24udXBkYXRlKHtcblx0XHRcdFx0XHRcdF9pZDogc21zLl9pZFxuXHRcdFx0XHRcdH0sIHtcblx0XHRcdFx0XHRcdCRzZXQ6IHtcblx0XHRcdFx0XHRcdFx0Ly8gTWFyayBhcyBzZW50XG5cdFx0XHRcdFx0XHRcdHNlbnQ6IHRydWUsXG5cdFx0XHRcdFx0XHRcdC8vIFNldCB0aGUgc2VudCBkYXRlXG5cdFx0XHRcdFx0XHRcdHNlbnRBdDogbmV3IERhdGUoKSxcblx0XHRcdFx0XHRcdFx0Ly8gTm90IGJlaW5nIHNlbnQgYW55bW9yZVxuXHRcdFx0XHRcdFx0XHRzZW5kaW5nOiAwXG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fSk7XG5cblx0XHRcdFx0fVxuXG5cdFx0XHRcdC8vIEVtaXQgdGhlIHNlbmRcblx0XHRcdFx0c2VsZi5lbWl0KCdzZW5kJywge1xuXHRcdFx0XHRcdHNtczogc21zLl9pZCxcblx0XHRcdFx0XHRyZXN1bHQ6IHJlc3VsdFxuXHRcdFx0XHR9KTtcblxuXHRcdFx0fSAvLyBFbHNlIGNvdWxkIG5vdCByZXNlcnZlXG5cdFx0fTsgLy8gRU8gc2VuZFNNU1xuXG5cdFx0c2VuZFdvcmtlcihmdW5jdGlvbigpIHtcblxuXHRcdFx0aWYgKGlzU2VuZGluZykge1xuXHRcdFx0XHRyZXR1cm47XG5cdFx0XHR9XG5cdFx0XHQvLyBTZXQgc2VuZCBmZW5jZVxuXHRcdFx0aXNTZW5kaW5nID0gdHJ1ZTtcblxuXHRcdFx0dmFyIGJhdGNoU2l6ZSA9IG9wdGlvbnMuc2VuZEJhdGNoU2l6ZSB8fCAxO1xuXG5cdFx0XHR2YXIgbm93ID0gK25ldyBEYXRlKCk7XG5cblx0XHRcdC8vIEZpbmQgc21zIHRoYXQgYXJlIG5vdCBiZWluZyBvciBhbHJlYWR5IHNlbnRcblx0XHRcdHZhciBwZW5kaW5nU01TID0gUWNsb3VkU01TUXVldWUuY29sbGVjdGlvbi5maW5kKHtcblx0XHRcdFx0JGFuZDogW1xuXHRcdFx0XHRcdC8vIE1lc3NhZ2UgaXMgbm90IHNlbnRcblx0XHRcdFx0XHR7XG5cdFx0XHRcdFx0XHRzZW50OiBmYWxzZVxuXHRcdFx0XHRcdH0sXG5cdFx0XHRcdFx0Ly8gQW5kIG5vdCBiZWluZyBzZW50IGJ5IG90aGVyIGluc3RhbmNlc1xuXHRcdFx0XHRcdHtcblx0XHRcdFx0XHRcdHNlbmRpbmc6IHtcblx0XHRcdFx0XHRcdFx0JGx0OiBub3dcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9XG5cdFx0XHRcdF1cblx0XHRcdH0sIHtcblx0XHRcdFx0Ly8gU29ydCBieSBjcmVhdGVkIGRhdGVcblx0XHRcdFx0c29ydDoge1xuXHRcdFx0XHRcdGNyZWF0ZWRBdDogMVxuXHRcdFx0XHR9LFxuXHRcdFx0XHRsaW1pdDogYmF0Y2hTaXplXG5cdFx0XHR9KTtcblxuXHRcdFx0cGVuZGluZ1NNUy5mb3JFYWNoKGZ1bmN0aW9uKHNtcykge1xuXHRcdFx0XHR0cnkge1xuXHRcdFx0XHRcdHNlbmRTTVMoc21zKTtcblx0XHRcdFx0fSBjYXRjaCAoZXJyb3IpIHtcblxuXHRcdFx0XHRcdGlmIChRY2xvdWRTTVNRdWV1ZS5kZWJ1Zykge1xuXHRcdFx0XHRcdFx0Y29uc29sZS5sb2coJ1FjbG91ZFNNU1F1ZXVlOiBDb3VsZCBub3Qgc2VuZCBzbXMgaWQ6IFwiJyArIHNtcy5faWQgKyAnXCIsIEVycm9yOiAnICsgZXJyb3IubWVzc2FnZSk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9KTsgLy8gRU8gZm9yRWFjaFxuXG5cdFx0XHQvLyBSZW1vdmUgdGhlIHNlbmQgZmVuY2Vcblx0XHRcdGlzU2VuZGluZyA9IGZhbHNlO1xuXHRcdH0sIG9wdGlvbnMuc2VuZEludGVydmFsIHx8IDE1MDAwKTsgLy8gRGVmYXVsdCBldmVyeSAxNXRoIHNlY1xuXG5cdH0gZWxzZSB7XG5cdFx0aWYgKFFjbG91ZFNNU1F1ZXVlLmRlYnVnKSB7XG5cdFx0XHRjb25zb2xlLmxvZygnUWNsb3VkU01TUXVldWU6IFNlbmQgc2VydmVyIGlzIGRpc2FibGVkJyk7XG5cdFx0fVxuXHR9XG5cbn07IiwiTWV0ZW9yLnN0YXJ0dXAgLT5cblx0aWYgTWV0ZW9yLnNldHRpbmdzLnNtcz8ucWNsb3VkPy5zbXNxdWV1ZV9pbnRlcnZhbFxuXHRcdFFjbG91ZFNNU1F1ZXVlLkNvbmZpZ3VyZVxuXHRcdFx0c2VuZEludGVydmFsOiBNZXRlb3Iuc2V0dGluZ3Muc21zLnFjbG91ZC5zbXNxdWV1ZV9pbnRlcnZhbFxuXHRcdFx0c2VuZEJhdGNoU2l6ZTogMTBcblx0XHRcdGtlZXBTTVM6IHRydWVcblx0XHRcdHNka2FwcGlkOiBNZXRlb3Iuc2V0dGluZ3Muc21zLnFjbG91ZC5zZGthcHBpZFxuXHRcdFx0YXBwa2V5OiBNZXRlb3Iuc2V0dGluZ3Muc21zLnFjbG91ZC5hcHBrZXlcblx0XHRcdHNpZ25uYW1lOiBNZXRlb3Iuc2V0dGluZ3Muc21zLnFjbG91ZC5zaWdubmFtZVxuIiwiTWV0ZW9yLnN0YXJ0dXAoZnVuY3Rpb24oKSB7XG4gIHZhciByZWYsIHJlZjE7XG4gIGlmICgocmVmID0gTWV0ZW9yLnNldHRpbmdzLnNtcykgIT0gbnVsbCA/IChyZWYxID0gcmVmLnFjbG91ZCkgIT0gbnVsbCA/IHJlZjEuc21zcXVldWVfaW50ZXJ2YWwgOiB2b2lkIDAgOiB2b2lkIDApIHtcbiAgICByZXR1cm4gUWNsb3VkU01TUXVldWUuQ29uZmlndXJlKHtcbiAgICAgIHNlbmRJbnRlcnZhbDogTWV0ZW9yLnNldHRpbmdzLnNtcy5xY2xvdWQuc21zcXVldWVfaW50ZXJ2YWwsXG4gICAgICBzZW5kQmF0Y2hTaXplOiAxMCxcbiAgICAgIGtlZXBTTVM6IHRydWUsXG4gICAgICBzZGthcHBpZDogTWV0ZW9yLnNldHRpbmdzLnNtcy5xY2xvdWQuc2RrYXBwaWQsXG4gICAgICBhcHBrZXk6IE1ldGVvci5zZXR0aW5ncy5zbXMucWNsb3VkLmFwcGtleSxcbiAgICAgIHNpZ25uYW1lOiBNZXRlb3Iuc2V0dGluZ3Muc21zLnFjbG91ZC5zaWdubmFtZVxuICAgIH0pO1xuICB9XG59KTtcbiJdfQ==
