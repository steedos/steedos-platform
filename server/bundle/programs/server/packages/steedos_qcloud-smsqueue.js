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
  "superagent": "^3.5.2",
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvczpxY2xvdWQtc21zcXVldWUvY2hlY2tOcG0uanMiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3M6cWNsb3VkLXNtc3F1ZXVlL2xpYi9jb21tb24vbWFpbi5qcyIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvczpxY2xvdWQtc21zcXVldWUvbGliL2NvbW1vbi9zbXMuanMiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3M6cWNsb3VkLXNtc3F1ZXVlL2xpYi9zZXJ2ZXIvYXBpLmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zX3FjbG91ZC1zbXNxdWV1ZS9zZXJ2ZXIvc3RhcnR1cC5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3NlcnZlci9zdGFydHVwLmNvZmZlZSJdLCJuYW1lcyI6WyJjaGVja05wbVZlcnNpb25zIiwibW9kdWxlIiwibGluayIsInYiLCJRY2xvdWRTTVNRdWV1ZSIsIkV2ZW50U3RhdGUiLCJjb2xsZWN0aW9uIiwiU01TUXVldWUiLCJfdmFsaWRhdGVEb2N1bWVudCIsInNtcyIsImNoZWNrIiwiT2JqZWN0Iiwic2VudCIsIk1hdGNoIiwiT3B0aW9uYWwiLCJCb29sZWFuIiwic2VuZGluZyIsIkludGVnZXIiLCJjcmVhdGVkQXQiLCJEYXRlIiwiY3JlYXRlZEJ5IiwiT25lT2YiLCJTdHJpbmciLCJzZW5kIiwib3B0aW9ucyIsImN1cnJlbnRVc2VyIiwiTWV0ZW9yIiwiaXNDbGllbnQiLCJ1c2VySWQiLCJpc1NlcnZlciIsIl8iLCJleHRlbmQiLCJ0ZXN0IiwicGljayIsImluc2VydCIsImlzQ29uZmlndXJlZCIsInNlbmRXb3JrZXIiLCJ0YXNrIiwiaW50ZXJ2YWwiLCJkZWJ1ZyIsImNvbnNvbGUiLCJsb2ciLCJzZXRJbnRlcnZhbCIsImVycm9yIiwibWVzc2FnZSIsInNka2FwcGlkIiwiYXBwa2V5IiwicmVxdWVzdCIsInJlcXVpcmUiLCJzaGEyNTYiLCJnZXRSYW5kIiwiYml0IiwiTWF0aCIsInJvdW5kIiwicmFuZG9tIiwic2VuZFRleHRNc2ciLCJwaG9uZSIsIm1zZyIsInVybCIsInJhbmQiLCJ0aW1lIiwic2lnIiwiY29udGVudCIsInJlcGxhY2UiLCJwb3N0IiwiZW5kIiwiZXJyIiwicmVzIiwiQ29uZmlndXJlIiwic2VsZiIsInNlbmRUaW1lb3V0IiwiRXJyb3IiLCJzaWdubmFtZSIsInNlbmRTTVMiLCJSZWNOdW0iLCJfcXVlcnlTZW5kIiwiX2lkIiwic2VydmVyU2VuZCIsImlzU2VuZGluZyIsInNlbmRJbnRlcnZhbCIsIl9lbnN1cmVJbmRleCIsIm5vdyIsInRpbWVvdXRBdCIsInJlc2VydmVkIiwidXBkYXRlIiwiJGx0IiwiJHNldCIsInJlc3VsdCIsImtlZXBTTVMiLCJyZW1vdmUiLCJzZW50QXQiLCJlbWl0IiwiYmF0Y2hTaXplIiwic2VuZEJhdGNoU2l6ZSIsInBlbmRpbmdTTVMiLCJmaW5kIiwiJGFuZCIsInNvcnQiLCJsaW1pdCIsImZvckVhY2giLCJzdGFydHVwIiwicmVmIiwicmVmMSIsInNldHRpbmdzIiwicWNsb3VkIiwic21zcXVldWVfaW50ZXJ2YWwiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLElBQUlBLGdCQUFKO0FBQXFCQyxNQUFNLENBQUNDLElBQVAsQ0FBWSxvQ0FBWixFQUFpRDtBQUFDRixrQkFBZ0IsQ0FBQ0csQ0FBRCxFQUFHO0FBQUNILG9CQUFnQixHQUFDRyxDQUFqQjtBQUFtQjs7QUFBeEMsQ0FBakQsRUFBMkYsQ0FBM0Y7QUFDckJILGdCQUFnQixDQUFDO0FBQ2hCLGdCQUFjLFFBREU7QUFFaEIsWUFBVTtBQUZNLENBQUQsRUFHYix5QkFIYSxDQUFoQixDOzs7Ozs7Ozs7OztBQ0RBSSxjQUFjLEdBQUcsSUFBSUMsVUFBSixFQUFqQixDOzs7Ozs7Ozs7OztBQ0FBRCxjQUFjLENBQUNFLFVBQWYsR0FBNEJDLFFBQVEsQ0FBQ0Qs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akZBZixPQUFPMEUsT0FBUCxDQUFlO0FBQ2QsTUFBQUMsR0FBQSxFQUFBQyxJQUFBOztBQUFBLE9BQUFELE1BQUEzRSxPQUFBNkUsUUFBQSxDQUFBOUYsR0FBQSxhQUFBNkYsT0FBQUQsSUFBQUcsTUFBQSxZQUFBRixLQUFnQ0csaUJBQWhDLEdBQWdDLE1BQWhDLEdBQWdDLE1BQWhDO0FDRUcsV0RERnJHLGVBQWVnRSxTQUFmLENBQ0M7QUFBQVcsb0JBQWNyRCxPQUFPNkUsUUFBUCxDQUFnQjlGLEdBQWhCLENBQW9CK0YsTUFBcEIsQ0FBMkJDLGlCQUF6QztBQUNBWixxQkFBZSxFQURmO0FBRUFMLGVBQVMsSUFGVDtBQUdBM0MsZ0JBQVVuQixPQUFPNkUsUUFBUCxDQUFnQjlGLEdBQWhCLENBQW9CK0YsTUFBcEIsQ0FBMkIzRCxRQUhyQztBQUlBQyxjQUFRcEIsT0FBTzZFLFFBQVAsQ0FBZ0I5RixHQUFoQixDQUFvQitGLE1BQXBCLENBQTJCMUQsTUFKbkM7QUFLQTBCLGdCQUFVOUMsT0FBTzZFLFFBQVAsQ0FBZ0I5RixHQUFoQixDQUFvQitGLE1BQXBCLENBQTJCaEM7QUFMckMsS0FERCxDQ0NFO0FBUUQ7QURYSCxHIiwiZmlsZSI6Ii9wYWNrYWdlcy9zdGVlZG9zX3FjbG91ZC1zbXNxdWV1ZS5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IGNoZWNrTnBtVmVyc2lvbnMgfSBmcm9tICdtZXRlb3IvdG1lYXNkYXk6Y2hlY2stbnBtLXZlcnNpb25zJztcclxuY2hlY2tOcG1WZXJzaW9ucyh7XHJcblx0XCJzdXBlcmFnZW50XCI6IFwiXjMuNS4yXCIsXHJcblx0XCJzaGEyNTZcIjogXCJeMC4yLjBcIlxyXG59LCAnc3RlZWRvczpxY2xvdWQtc21zcXVldWUnKTsiLCJRY2xvdWRTTVNRdWV1ZSA9IG5ldyBFdmVudFN0YXRlKCk7IiwiUWNsb3VkU01TUXVldWUuY29sbGVjdGlvbiA9IFNNU1F1ZXVlLmNvbGxlY3Rpb247XHJcblxyXG52YXIgX3ZhbGlkYXRlRG9jdW1lbnQgPSBmdW5jdGlvbihzbXMpIHtcclxuXHJcblx0Y2hlY2soc21zLCB7XHJcblx0XHRzbXM6IE9iamVjdCxcclxuXHRcdHNlbnQ6IE1hdGNoLk9wdGlvbmFsKEJvb2xlYW4pLFxyXG5cdFx0c2VuZGluZzogTWF0Y2guT3B0aW9uYWwoTWF0Y2guSW50ZWdlciksXHJcblx0XHRjcmVhdGVkQXQ6IERhdGUsXHJcblx0XHRjcmVhdGVkQnk6IE1hdGNoLk9uZU9mKFN0cmluZywgbnVsbClcclxuXHR9KTtcclxuXHJcbn07XHJcblxyXG5RY2xvdWRTTVNRdWV1ZS5zZW5kID0gZnVuY3Rpb24ob3B0aW9ucykge1xyXG5cdHZhciBjdXJyZW50VXNlciA9IE1ldGVvci5pc0NsaWVudCAmJiBNZXRlb3IudXNlcklkICYmIE1ldGVvci51c2VySWQoKSB8fCBNZXRlb3IuaXNTZXJ2ZXIgJiYgKG9wdGlvbnMuY3JlYXRlZEJ5IHx8ICc8U0VSVkVSPicpIHx8IG51bGxcclxuXHR2YXIgc21zID0gXy5leHRlbmQoe1xyXG5cdFx0Y3JlYXRlZEF0OiBuZXcgRGF0ZSgpLFxyXG5cdFx0Y3JlYXRlZEJ5OiBjdXJyZW50VXNlclxyXG5cdH0pO1xyXG5cclxuXHRpZiAoTWF0Y2gudGVzdChvcHRpb25zLCBPYmplY3QpKSB7XHJcblx0XHRzbXMuc21zID0gXy5waWNrKG9wdGlvbnMsICdGb3JtYXQnLCAnQWN0aW9uJywgJ1BhcmFtU3RyaW5nJywgJ1JlY051bScsICdTaWduTmFtZScsICdUZW1wbGF0ZUNvZGUnLCAnbXNnJyk7XHJcblx0fVxyXG5cclxuXHRzbXMuc2VudCA9IGZhbHNlO1xyXG5cdHNtcy5zZW5kaW5nID0gMDtcclxuXHJcblx0X3ZhbGlkYXRlRG9jdW1lbnQoc21zKTtcclxuXHJcblx0cmV0dXJuIFFjbG91ZFNNU1F1ZXVlLmNvbGxlY3Rpb24uaW5zZXJ0KHNtcyk7XHJcbn07IiwidmFyIGlzQ29uZmlndXJlZCA9IGZhbHNlO1xyXG52YXIgc2VuZFdvcmtlciA9IGZ1bmN0aW9uKHRhc2ssIGludGVydmFsKSB7XHJcblxyXG5cdGlmIChRY2xvdWRTTVNRdWV1ZS5kZWJ1Zykge1xyXG5cdFx0Y29uc29sZS5sb2coJ1FjbG91ZFNNU1F1ZXVlOiBTZW5kIHdvcmtlciBzdGFydGVkLCB1c2luZyBpbnRlcnZhbDogJyArIGludGVydmFsKTtcclxuXHR9XHJcblxyXG5cdHJldHVybiBNZXRlb3Iuc2V0SW50ZXJ2YWwoZnVuY3Rpb24oKSB7XHJcblx0XHR0cnkge1xyXG5cdFx0XHR0YXNrKCk7XHJcblx0XHR9IGNhdGNoIChlcnJvcikge1xyXG5cdFx0XHRpZiAoUWNsb3VkU01TUXVldWUuZGVidWcpIHtcclxuXHRcdFx0XHRjb25zb2xlLmxvZygnUWNsb3VkU01TUXVldWU6IEVycm9yIHdoaWxlIHNlbmRpbmc6ICcgKyBlcnJvci5tZXNzYWdlKTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdH0sIGludGVydmFsKTtcclxufTtcclxuXHJcbi8vIHZhciBTTVMgPSByZXF1aXJlKCdhbGl5dW4tc21zLW5vZGUnKSxcclxuLy8gXHRzbXNTZW5kZXI7XHJcblxyXG52YXIgc2RrYXBwaWQsIGFwcGtleTtcclxuXHJcbnZhciByZXF1ZXN0ID0gcmVxdWlyZSgnc3VwZXJhZ2VudCcpLFxyXG5cdHNoYTI1NiA9IHJlcXVpcmUoJ3NoYTI1NicpO1xyXG5cclxuZnVuY3Rpb24gZ2V0UmFuZChiaXQpIHtcclxuXHJcblx0Yml0ID0gYml0IHx8IDEwMDAwMDAwO1xyXG5cclxuXHRyZXR1cm4gTWF0aC5yb3VuZChNYXRoLnJhbmRvbSgpICogYml0KTtcclxufTtcclxuXHJcbi8vc2VuZCB0ZXh0IG1lc3NhZ2VcclxuZnVuY3Rpb24gc2VuZFRleHRNc2coc2RrYXBwaWQsIGFwcGtleSwgcGhvbmUsIG1zZykge1xyXG5cclxuXHRpZiAoIXBob25lIHx8IC8xXFxkezEyfS8udGVzdChwaG9uZSkpIHtcclxuXHRcdHJldHVybiBjb25zb2xlLmxvZygnaW52YWxpZCBwaG9uZSBudW1iZXInKTtcclxuXHR9XHJcblxyXG5cdHZhciB1cmwgPSAnaHR0cHM6Ly95dW4udGltLnFxLmNvbS92NS90bHNzbXNzdnIvc2VuZHNtcz9zZGthcHBpZD17c2RrYXBwaWR9JnJhbmRvbT17cmFuZG9tfSc7XHJcblxyXG5cdHZhciByYW5kID0gZ2V0UmFuZCgpLFxyXG5cdFx0dGltZSA9IE1hdGgucm91bmQoK25ldyBEYXRlKCkgLyAxMDAwKSxcclxuXHRcdHNpZyA9IHNoYTI1NignYXBwa2V5PScgKyBhcHBrZXkgKyAnJnJhbmRvbT0nICsgcmFuZCArICcmdGltZT0nICsgdGltZSArICcmbW9iaWxlPScgKyBwaG9uZSk7XHJcblxyXG5cdHZhciBjb250ZW50ID0ge1xyXG5cdFx0XCJ0ZWxcIjogeyAvL+WmgumcgOS9v+eUqOWbvemZheeUteivneWPt+eggemAmueUqOagvOW8j++8jOWmgu+8mlwiKzg2MTM3ODg4ODg4ODhcIiDvvIzor7fkvb/nlKhzZW5kaXNtc+aOpeWPo+ingeS4i+azqFxyXG5cdFx0XHRcIm5hdGlvbmNvZGVcIjogXCI4NlwiLCAvL+WbveWutueggVxyXG5cdFx0XHRcIm1vYmlsZVwiOiBwaG9uZSAvL+aJi+acuuWPt+eggVxyXG5cdFx0fSxcclxuXHRcdFwidHlwZVwiOiAwLCAvLzA65pmu6YCa55+t5L+hOzE66JCl6ZSA55+t5L+h77yI5by66LCD77ya6KaB5oyJ6ZyA5aGr5YC877yM5LiN54S25Lya5b2x5ZON5Yiw5Lia5Yqh55qE5q2j5bi45L2/55So77yJXHJcblx0XHRcIm1zZ1wiOiBtc2csIC8vdXRmOOe8lueggSBcclxuXHRcdFwic2lnXCI6IHNpZywgLy9hcHDlh63or4HvvIzlhbfkvZPorqHnrpfmlrnlvI/op4HkuIvms6hcclxuXHRcdFwidGltZVwiOiB0aW1lLCAvL3VuaXjml7bpl7TmiLPvvIzor7fmsYLlj5Hotbfml7bpl7TvvIzlpoLmnpzlkozns7vnu5/ml7bpl7Tnm7jlt67otoXov4cxMOWIhumSn+WImeS8mui/lOWbnuWksei0pVxyXG5cdFx0XCJleHRlbmRcIjogXCJcIiwgLy/pgJrpgZPmianlsZXnoIHvvIzlj6/pgInlrZfmrrXvvIzpu5jorqTmsqHmnInlvIDpgJoo6ZyA6KaB5aGr56m6KeOAglxyXG5cdFx0Ly/lnKjnn63kv6Hlm57lpI3lnLrmma/kuK3vvIzohb7orq9zZXJ2ZXLkvJrljp/moLfov5Tlm57vvIzlvIDlj5HogIXlj6/kvp3mraTljLrliIbmmK/lk6rnp43nsbvlnovnmoTlm57lpI1cclxuXHRcdFwiZXh0XCI6IFwiXCIgLy/nlKjmiLfnmoRzZXNzaW9u5YaF5a6577yM6IW+6K6vc2VydmVy5Zue5YyF5Lit5Lya5Y6f5qC36L+U5Zue77yM5Y+v6YCJ5a2X5q6177yM5LiN6ZyA6KaB5bCx5aGr56m644CCXHJcblx0fTtcclxuXHR1cmwgPSB1cmwucmVwbGFjZSgne3Nka2FwcGlkfScsIHNka2FwcGlkKVxyXG5cdFx0LnJlcGxhY2UoJ3tyYW5kb219JywgcmFuZCk7XHJcblx0cmVxdWVzdFxyXG5cdFx0LnBvc3QodXJsKVxyXG5cdFx0LnNlbmQoY29udGVudClcclxuXHRcdC5lbmQoZnVuY3Rpb24oZXJyLCByZXMpIHtcclxuXHRcdFx0aWYgKGVycikge1xyXG5cdFx0XHRcdHJldHVybiBjb25zb2xlLmVycm9yKGVycik7XHJcblx0XHRcdH1cclxuXHRcdH0pO1xyXG59O1xyXG5cclxuLypcclxuXHRvcHRpb25zOiB7XHJcblx0XHQvLyBDb250cm9scyB0aGUgc2VuZGluZyBpbnRlcnZhbFxyXG5cdFx0c2VuZEludGVydmFsOiBNYXRjaC5PcHRpb25hbChOdW1iZXIpLFxyXG5cdFx0Ly8gQ29udHJvbHMgdGhlIHNlbmRpbmcgYmF0Y2ggc2l6ZSBwZXIgaW50ZXJ2YWxcclxuXHRcdHNlbmRCYXRjaFNpemU6IE1hdGNoLk9wdGlvbmFsKE51bWJlciksXHJcblx0XHQvLyBBbGxvdyBvcHRpb25hbCBrZWVwaW5nIG5vdGlmaWNhdGlvbnMgaW4gY29sbGVjdGlvblxyXG5cdFx0a2VlcFNNUzogTWF0Y2guT3B0aW9uYWwoQm9vbGVhbilcclxuXHR9XHJcbiovXHJcblFjbG91ZFNNU1F1ZXVlLkNvbmZpZ3VyZSA9IGZ1bmN0aW9uKG9wdGlvbnMpIHtcclxuXHR2YXIgc2VsZiA9IHRoaXM7XHJcblx0b3B0aW9ucyA9IF8uZXh0ZW5kKHtcclxuXHRcdHNlbmRUaW1lb3V0OiA2MDAwMCwgLy8gVGltZW91dCBwZXJpb2QgZm9yIHNtcyBzZW5kXHJcblx0fSwgb3B0aW9ucyk7XHJcblxyXG5cdC8vIEJsb2NrIG11bHRpcGxlIGNhbGxzXHJcblx0aWYgKGlzQ29uZmlndXJlZCkge1xyXG5cdFx0dGhyb3cgbmV3IEVycm9yKCdRY2xvdWRTTVNRdWV1ZS5Db25maWd1cmUgc2hvdWxkIG5vdCBiZSBjYWxsZWQgbW9yZSB0aGFuIG9uY2UhJyk7XHJcblx0fVxyXG5cclxuXHRpc0NvbmZpZ3VyZWQgPSB0cnVlO1xyXG5cclxuXHQvLyBBZGQgZGVidWcgaW5mb1xyXG5cdGlmIChRY2xvdWRTTVNRdWV1ZS5kZWJ1Zykge1xyXG5cdFx0Y29uc29sZS5sb2coJ1FjbG91ZFNNU1F1ZXVlLkNvbmZpZ3VyZScsIG9wdGlvbnMpO1xyXG5cdH1cclxuXHJcblx0Ly8gc21zU2VuZGVyID0gbmV3IFNNUyh7XHJcblx0Ly8gXHRBY2Nlc3NLZXlJZDogb3B0aW9ucy5hY2Nlc3NLZXlJZCxcclxuXHQvLyBcdEFjY2Vzc0tleVNlY3JldDogb3B0aW9ucy5hY2Nlc3NLZXlTZWNyZXRcclxuXHQvLyB9KTtcclxuXHJcblx0c2RrYXBwaWQgPSBvcHRpb25zLnNka2FwcGlkO1xyXG5cdGFwcGtleSA9IG9wdGlvbnMuYXBwa2V5O1xyXG5cdHNpZ25uYW1lID0gb3B0aW9ucy5zaWdubmFtZSB8fCBcIlwiO1xyXG5cclxuXHRzZWxmLnNlbmRTTVMgPSBmdW5jdGlvbihzbXMpIHtcclxuXHRcdGlmIChRY2xvdWRTTVNRdWV1ZS5kZWJ1Zykge1xyXG5cdFx0XHRjb25zb2xlLmxvZyhcInNlbmRTTVNcIik7XHJcblx0XHRcdGNvbnNvbGUubG9nKHNtcyk7XHJcblx0XHR9XHJcblxyXG5cdFx0Ly8gc21zU2VuZGVyLnNlbmQoc21zLnNtcykuY2F0Y2goZXJyID0+IHtcclxuXHRcdC8vIFx0Y29uc29sZS5lcnJvcihlcnIpXHJcblx0XHQvLyB9KTtcclxuXHJcblx0XHRzZW5kVGV4dE1zZyhzZGthcHBpZCwgYXBwa2V5LCBzbXMuc21zLlJlY051bSwgKHNtcy5zaWdubmFtZSB8fCBzaWdubmFtZSkgKyBzbXMuc21zLm1zZyk7XHJcblx0fVxyXG5cclxuXHQvLyBVbml2ZXJzYWwgc2VuZCBmdW5jdGlvblxyXG5cdHZhciBfcXVlcnlTZW5kID0gZnVuY3Rpb24ob3B0aW9ucykge1xyXG5cclxuXHRcdGlmIChzZWxmLnNlbmRTTVMpIHtcclxuXHRcdFx0c2VsZi5zZW5kU01TKG9wdGlvbnMpO1xyXG5cdFx0fVxyXG5cclxuXHRcdHJldHVybiB7XHJcblx0XHRcdHNtczogW29wdGlvbnMuX2lkXVxyXG5cdFx0fTtcclxuXHR9O1xyXG5cclxuXHRzZWxmLnNlcnZlclNlbmQgPSBmdW5jdGlvbihvcHRpb25zKSB7XHJcblx0XHRvcHRpb25zID0gb3B0aW9ucyB8fCB7fTtcclxuXHRcdHJldHVybiBfcXVlcnlTZW5kKG9wdGlvbnMpO1xyXG5cdH07XHJcblxyXG5cclxuXHQvLyBUaGlzIGludGVydmFsIHdpbGwgYWxsb3cgb25seSBvbmUgc21zIHRvIGJlIHNlbnQgYXQgYSB0aW1lLCBpdFxyXG5cdC8vIHdpbGwgY2hlY2sgZm9yIG5ldyBzbXMgYXQgZXZlcnkgYG9wdGlvbnMuc2VuZEludGVydmFsYFxyXG5cdC8vIChkZWZhdWx0IGludGVydmFsIGlzIDE1MDAwIG1zKVxyXG5cdC8vXHJcblx0Ly8gSXQgbG9va3MgaW4gc21zIGNvbGxlY3Rpb24gdG8gc2VlIGlmIHRoZXJlcyBhbnkgcGVuZGluZ1xyXG5cdC8vIHNtcywgaWYgc28gaXQgd2lsbCB0cnkgdG8gcmVzZXJ2ZSB0aGUgcGVuZGluZyBzbXMuXHJcblx0Ly8gSWYgc3VjY2Vzc2Z1bGx5IHJlc2VydmVkIHRoZSBzZW5kIGlzIHN0YXJ0ZWQuXHJcblx0Ly9cclxuXHQvLyBJZiBzbXMucXVlcnkgaXMgdHlwZSBzdHJpbmcsIGl0J3MgYXNzdW1lZCB0byBiZSBhIGpzb24gc3RyaW5nXHJcblx0Ly8gdmVyc2lvbiBvZiB0aGUgcXVlcnkgc2VsZWN0b3IuIE1ha2luZyBpdCBhYmxlIHRvIGNhcnJ5IGAkYCBwcm9wZXJ0aWVzIGluXHJcblx0Ly8gdGhlIG1vbmdvIGNvbGxlY3Rpb24uXHJcblx0Ly9cclxuXHQvLyBQci4gZGVmYXVsdCBzbXMgYXJlIHJlbW92ZWQgZnJvbSB0aGUgY29sbGVjdGlvbiBhZnRlciBzZW5kIGhhdmVcclxuXHQvLyBjb21wbGV0ZWQuIFNldHRpbmcgYG9wdGlvbnMua2VlcFNNU2Agd2lsbCB1cGRhdGUgYW5kIGtlZXAgdGhlXHJcblx0Ly8gc21zIGVnLiBpZiBuZWVkZWQgZm9yIGhpc3RvcmljYWwgcmVhc29ucy5cclxuXHQvL1xyXG5cdC8vIEFmdGVyIHRoZSBzZW5kIGhhdmUgY29tcGxldGVkIGEgXCJzZW5kXCIgZXZlbnQgd2lsbCBiZSBlbWl0dGVkIHdpdGggYVxyXG5cdC8vIHN0YXR1cyBvYmplY3QgY29udGFpbmluZyBzbXMgaWQgYW5kIHRoZSBzZW5kIHJlc3VsdCBvYmplY3QuXHJcblx0Ly9cclxuXHR2YXIgaXNTZW5kaW5nID0gZmFsc2U7XHJcblxyXG5cdGlmIChvcHRpb25zLnNlbmRJbnRlcnZhbCAhPT0gbnVsbCkge1xyXG5cclxuXHRcdC8vIFRoaXMgd2lsbCByZXF1aXJlIGluZGV4IHNpbmNlIHdlIHNvcnQgc21zIGJ5IGNyZWF0ZWRBdFxyXG5cdFx0UWNsb3VkU01TUXVldWUuY29sbGVjdGlvbi5fZW5zdXJlSW5kZXgoe1xyXG5cdFx0XHRjcmVhdGVkQXQ6IDFcclxuXHRcdH0pO1xyXG5cdFx0UWNsb3VkU01TUXVldWUuY29sbGVjdGlvbi5fZW5zdXJlSW5kZXgoe1xyXG5cdFx0XHRzZW50OiAxXHJcblx0XHR9KTtcclxuXHRcdFFjbG91ZFNNU1F1ZXVlLmNvbGxlY3Rpb24uX2Vuc3VyZUluZGV4KHtcclxuXHRcdFx0c2VuZGluZzogMVxyXG5cdFx0fSk7XHJcblxyXG5cclxuXHRcdHZhciBzZW5kU01TID0gZnVuY3Rpb24oc21zKSB7XHJcblx0XHRcdC8vIFJlc2VydmUgc21zXHJcblx0XHRcdHZhciBub3cgPSArbmV3IERhdGUoKTtcclxuXHRcdFx0dmFyIHRpbWVvdXRBdCA9IG5vdyArIG9wdGlvbnMuc2VuZFRpbWVvdXQ7XHJcblx0XHRcdHZhciByZXNlcnZlZCA9IFFjbG91ZFNNU1F1ZXVlLmNvbGxlY3Rpb24udXBkYXRlKHtcclxuXHRcdFx0XHRfaWQ6IHNtcy5faWQsXHJcblx0XHRcdFx0c2VudDogZmFsc2UsIC8vIHh4eDogbmVlZCB0byBtYWtlIHN1cmUgdGhpcyBpcyBzZXQgb24gY3JlYXRlXHJcblx0XHRcdFx0c2VuZGluZzoge1xyXG5cdFx0XHRcdFx0JGx0OiBub3dcclxuXHRcdFx0XHR9XHJcblx0XHRcdH0sIHtcclxuXHRcdFx0XHQkc2V0OiB7XHJcblx0XHRcdFx0XHRzZW5kaW5nOiB0aW1lb3V0QXQsXHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9KTtcclxuXHJcblx0XHRcdC8vIE1ha2Ugc3VyZSB3ZSBvbmx5IGhhbmRsZSBzbXMgcmVzZXJ2ZWQgYnkgdGhpc1xyXG5cdFx0XHQvLyBpbnN0YW5jZVxyXG5cdFx0XHRpZiAocmVzZXJ2ZWQpIHtcclxuXHJcblx0XHRcdFx0Ly8gU2VuZCB0aGUgc21zXHJcblx0XHRcdFx0dmFyIHJlc3VsdCA9IFFjbG91ZFNNU1F1ZXVlLnNlcnZlclNlbmQoc21zKTtcclxuXHJcblx0XHRcdFx0aWYgKCFvcHRpb25zLmtlZXBTTVMpIHtcclxuXHRcdFx0XHRcdC8vIFByLiBEZWZhdWx0IHdlIHdpbGwgcmVtb3ZlIHNtc1xyXG5cdFx0XHRcdFx0UWNsb3VkU01TUXVldWUuY29sbGVjdGlvbi5yZW1vdmUoe1xyXG5cdFx0XHRcdFx0XHRfaWQ6IHNtcy5faWRcclxuXHRcdFx0XHRcdH0pO1xyXG5cdFx0XHRcdH0gZWxzZSB7XHJcblxyXG5cdFx0XHRcdFx0Ly8gVXBkYXRlIHRoZSBzbXNcclxuXHRcdFx0XHRcdFFjbG91ZFNNU1F1ZXVlLmNvbGxlY3Rpb24udXBkYXRlKHtcclxuXHRcdFx0XHRcdFx0X2lkOiBzbXMuX2lkXHJcblx0XHRcdFx0XHR9LCB7XHJcblx0XHRcdFx0XHRcdCRzZXQ6IHtcclxuXHRcdFx0XHRcdFx0XHQvLyBNYXJrIGFzIHNlbnRcclxuXHRcdFx0XHRcdFx0XHRzZW50OiB0cnVlLFxyXG5cdFx0XHRcdFx0XHRcdC8vIFNldCB0aGUgc2VudCBkYXRlXHJcblx0XHRcdFx0XHRcdFx0c2VudEF0OiBuZXcgRGF0ZSgpLFxyXG5cdFx0XHRcdFx0XHRcdC8vIE5vdCBiZWluZyBzZW50IGFueW1vcmVcclxuXHRcdFx0XHRcdFx0XHRzZW5kaW5nOiAwXHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdH0pO1xyXG5cclxuXHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdC8vIEVtaXQgdGhlIHNlbmRcclxuXHRcdFx0XHRzZWxmLmVtaXQoJ3NlbmQnLCB7XHJcblx0XHRcdFx0XHRzbXM6IHNtcy5faWQsXHJcblx0XHRcdFx0XHRyZXN1bHQ6IHJlc3VsdFxyXG5cdFx0XHRcdH0pO1xyXG5cclxuXHRcdFx0fSAvLyBFbHNlIGNvdWxkIG5vdCByZXNlcnZlXHJcblx0XHR9OyAvLyBFTyBzZW5kU01TXHJcblxyXG5cdFx0c2VuZFdvcmtlcihmdW5jdGlvbigpIHtcclxuXHJcblx0XHRcdGlmIChpc1NlbmRpbmcpIHtcclxuXHRcdFx0XHRyZXR1cm47XHJcblx0XHRcdH1cclxuXHRcdFx0Ly8gU2V0IHNlbmQgZmVuY2VcclxuXHRcdFx0aXNTZW5kaW5nID0gdHJ1ZTtcclxuXHJcblx0XHRcdHZhciBiYXRjaFNpemUgPSBvcHRpb25zLnNlbmRCYXRjaFNpemUgfHwgMTtcclxuXHJcblx0XHRcdHZhciBub3cgPSArbmV3IERhdGUoKTtcclxuXHJcblx0XHRcdC8vIEZpbmQgc21zIHRoYXQgYXJlIG5vdCBiZWluZyBvciBhbHJlYWR5IHNlbnRcclxuXHRcdFx0dmFyIHBlbmRpbmdTTVMgPSBRY2xvdWRTTVNRdWV1ZS5jb2xsZWN0aW9uLmZpbmQoe1xyXG5cdFx0XHRcdCRhbmQ6IFtcclxuXHRcdFx0XHRcdC8vIE1lc3NhZ2UgaXMgbm90IHNlbnRcclxuXHRcdFx0XHRcdHtcclxuXHRcdFx0XHRcdFx0c2VudDogZmFsc2VcclxuXHRcdFx0XHRcdH0sXHJcblx0XHRcdFx0XHQvLyBBbmQgbm90IGJlaW5nIHNlbnQgYnkgb3RoZXIgaW5zdGFuY2VzXHJcblx0XHRcdFx0XHR7XHJcblx0XHRcdFx0XHRcdHNlbmRpbmc6IHtcclxuXHRcdFx0XHRcdFx0XHQkbHQ6IG5vd1xyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XVxyXG5cdFx0XHR9LCB7XHJcblx0XHRcdFx0Ly8gU29ydCBieSBjcmVhdGVkIGRhdGVcclxuXHRcdFx0XHRzb3J0OiB7XHJcblx0XHRcdFx0XHRjcmVhdGVkQXQ6IDFcclxuXHRcdFx0XHR9LFxyXG5cdFx0XHRcdGxpbWl0OiBiYXRjaFNpemVcclxuXHRcdFx0fSk7XHJcblxyXG5cdFx0XHRwZW5kaW5nU01TLmZvckVhY2goZnVuY3Rpb24oc21zKSB7XHJcblx0XHRcdFx0dHJ5IHtcclxuXHRcdFx0XHRcdHNlbmRTTVMoc21zKTtcclxuXHRcdFx0XHR9IGNhdGNoIChlcnJvcikge1xyXG5cclxuXHRcdFx0XHRcdGlmIChRY2xvdWRTTVNRdWV1ZS5kZWJ1Zykge1xyXG5cdFx0XHRcdFx0XHRjb25zb2xlLmxvZygnUWNsb3VkU01TUXVldWU6IENvdWxkIG5vdCBzZW5kIHNtcyBpZDogXCInICsgc21zLl9pZCArICdcIiwgRXJyb3I6ICcgKyBlcnJvci5tZXNzYWdlKTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9XHJcblx0XHRcdH0pOyAvLyBFTyBmb3JFYWNoXHJcblxyXG5cdFx0XHQvLyBSZW1vdmUgdGhlIHNlbmQgZmVuY2VcclxuXHRcdFx0aXNTZW5kaW5nID0gZmFsc2U7XHJcblx0XHR9LCBvcHRpb25zLnNlbmRJbnRlcnZhbCB8fCAxNTAwMCk7IC8vIERlZmF1bHQgZXZlcnkgMTV0aCBzZWNcclxuXHJcblx0fSBlbHNlIHtcclxuXHRcdGlmIChRY2xvdWRTTVNRdWV1ZS5kZWJ1Zykge1xyXG5cdFx0XHRjb25zb2xlLmxvZygnUWNsb3VkU01TUXVldWU6IFNlbmQgc2VydmVyIGlzIGRpc2FibGVkJyk7XHJcblx0XHR9XHJcblx0fVxyXG5cclxufTsiLCJNZXRlb3Iuc3RhcnR1cCAtPlxyXG5cdGlmIE1ldGVvci5zZXR0aW5ncy5zbXM/LnFjbG91ZD8uc21zcXVldWVfaW50ZXJ2YWxcclxuXHRcdFFjbG91ZFNNU1F1ZXVlLkNvbmZpZ3VyZVxyXG5cdFx0XHRzZW5kSW50ZXJ2YWw6IE1ldGVvci5zZXR0aW5ncy5zbXMucWNsb3VkLnNtc3F1ZXVlX2ludGVydmFsXHJcblx0XHRcdHNlbmRCYXRjaFNpemU6IDEwXHJcblx0XHRcdGtlZXBTTVM6IHRydWVcclxuXHRcdFx0c2RrYXBwaWQ6IE1ldGVvci5zZXR0aW5ncy5zbXMucWNsb3VkLnNka2FwcGlkXHJcblx0XHRcdGFwcGtleTogTWV0ZW9yLnNldHRpbmdzLnNtcy5xY2xvdWQuYXBwa2V5XHJcblx0XHRcdHNpZ25uYW1lOiBNZXRlb3Iuc2V0dGluZ3Muc21zLnFjbG91ZC5zaWdubmFtZVxyXG4iLCJNZXRlb3Iuc3RhcnR1cChmdW5jdGlvbigpIHtcbiAgdmFyIHJlZiwgcmVmMTtcbiAgaWYgKChyZWYgPSBNZXRlb3Iuc2V0dGluZ3Muc21zKSAhPSBudWxsID8gKHJlZjEgPSByZWYucWNsb3VkKSAhPSBudWxsID8gcmVmMS5zbXNxdWV1ZV9pbnRlcnZhbCA6IHZvaWQgMCA6IHZvaWQgMCkge1xuICAgIHJldHVybiBRY2xvdWRTTVNRdWV1ZS5Db25maWd1cmUoe1xuICAgICAgc2VuZEludGVydmFsOiBNZXRlb3Iuc2V0dGluZ3Muc21zLnFjbG91ZC5zbXNxdWV1ZV9pbnRlcnZhbCxcbiAgICAgIHNlbmRCYXRjaFNpemU6IDEwLFxuICAgICAga2VlcFNNUzogdHJ1ZSxcbiAgICAgIHNka2FwcGlkOiBNZXRlb3Iuc2V0dGluZ3Muc21zLnFjbG91ZC5zZGthcHBpZCxcbiAgICAgIGFwcGtleTogTWV0ZW9yLnNldHRpbmdzLnNtcy5xY2xvdWQuYXBwa2V5LFxuICAgICAgc2lnbm5hbWU6IE1ldGVvci5zZXR0aW5ncy5zbXMucWNsb3VkLnNpZ25uYW1lXG4gICAgfSk7XG4gIH1cbn0pO1xuIl19
