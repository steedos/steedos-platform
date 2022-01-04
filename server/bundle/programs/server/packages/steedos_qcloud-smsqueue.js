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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvczpxY2xvdWQtc21zcXVldWUvY2hlY2tOcG0uanMiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3M6cWNsb3VkLXNtc3F1ZXVlL2xpYi9jb21tb24vbWFpbi5qcyIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvczpxY2xvdWQtc21zcXVldWUvbGliL2NvbW1vbi9zbXMuanMiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3M6cWNsb3VkLXNtc3F1ZXVlL2xpYi9zZXJ2ZXIvYXBpLmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zX3FjbG91ZC1zbXNxdWV1ZS9zZXJ2ZXIvc3RhcnR1cC5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3NlcnZlci9zdGFydHVwLmNvZmZlZSJdLCJuYW1lcyI6WyJjaGVja05wbVZlcnNpb25zIiwibW9kdWxlIiwibGluayIsInYiLCJRY2xvdWRTTVNRdWV1ZSIsIkV2ZW50U3RhdGUiLCJjb2xsZWN0aW9uIiwiU01TUXVldWUiLCJfdmFsaWRhdGVEb2N1bWVudCIsInNtcyIsImNoZWNrIiwiT2JqZWN0Iiwic2VudCIsIk1hdGNoIiwiT3B0aW9uYWwiLCJCb29sZWFuIiwic2VuZGluZyIsIkludGVnZXIiLCJjcmVhdGVkQXQiLCJEYXRlIiwiY3JlYXRlZEJ5IiwiT25lT2YiLCJTdHJpbmciLCJzZW5kIiwib3B0aW9ucyIsImN1cnJlbnRVc2VyIiwiTWV0ZW9yIiwiaXNDbGllbnQiLCJ1c2VySWQiLCJpc1NlcnZlciIsIl8iLCJleHRlbmQiLCJ0ZXN0IiwicGljayIsImluc2VydCIsImlzQ29uZmlndXJlZCIsInNlbmRXb3JrZXIiLCJ0YXNrIiwiaW50ZXJ2YWwiLCJkZWJ1ZyIsImNvbnNvbGUiLCJsb2ciLCJzZXRJbnRlcnZhbCIsImVycm9yIiwibWVzc2FnZSIsInNka2FwcGlkIiwiYXBwa2V5IiwicmVxdWVzdCIsInJlcXVpcmUiLCJzaGEyNTYiLCJnZXRSYW5kIiwiYml0IiwiTWF0aCIsInJvdW5kIiwicmFuZG9tIiwic2VuZFRleHRNc2ciLCJwaG9uZSIsIm1zZyIsInVybCIsInJhbmQiLCJ0aW1lIiwic2lnIiwiY29udGVudCIsInJlcGxhY2UiLCJwb3N0IiwiZW5kIiwiZXJyIiwicmVzIiwiQ29uZmlndXJlIiwic2VsZiIsInNlbmRUaW1lb3V0IiwiRXJyb3IiLCJzaWdubmFtZSIsInNlbmRTTVMiLCJSZWNOdW0iLCJfcXVlcnlTZW5kIiwiX2lkIiwic2VydmVyU2VuZCIsImlzU2VuZGluZyIsInNlbmRJbnRlcnZhbCIsIl9lbnN1cmVJbmRleCIsIm5vdyIsInRpbWVvdXRBdCIsInJlc2VydmVkIiwidXBkYXRlIiwiJGx0IiwiJHNldCIsInJlc3VsdCIsImtlZXBTTVMiLCJyZW1vdmUiLCJzZW50QXQiLCJlbWl0IiwiYmF0Y2hTaXplIiwic2VuZEJhdGNoU2l6ZSIsInBlbmRpbmdTTVMiLCJmaW5kIiwiJGFuZCIsInNvcnQiLCJsaW1pdCIsImZvckVhY2giLCJzdGFydHVwIiwicmVmIiwicmVmMSIsInNldHRpbmdzIiwicWNsb3VkIiwic21zcXVldWVfaW50ZXJ2YWwiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLElBQUlBLGdCQUFKO0FBQXFCQyxNQUFNLENBQUNDLElBQVAsQ0FBWSxvQ0FBWixFQUFpRDtBQUFDRixrQkFBZ0IsQ0FBQ0csQ0FBRCxFQUFHO0FBQUNILG9CQUFnQixHQUFDRyxDQUFqQjtBQUFtQjs7QUFBeEMsQ0FBakQsRUFBMkYsQ0FBM0Y7QUFDckJILGdCQUFnQixDQUFDO0FBQ2hCLGdCQUFjLFFBREU7QUFFaEIsWUFBVTtBQUZNLENBQUQsRUFHYix5QkFIYSxDQUFoQixDOzs7Ozs7Ozs7OztBQ0RBSSxjQUFjLEdBQUcsSUFBSUMsVUFBSixFQUFqQixDOzs7Ozs7Ozs7OztBQ0FBRCxjQUFjLENBQUNFLFVBQWYsR0FBNEJDLFFBQVEsQ0FBQ0QsVUFBckM7O0FBRUEsSUFBSUUsaUJBQWlCLEdBQUcsVUFBU0MsR0FBVCxFQUFjO0FBRXJDQyxPQUFLLENBQUNELEdBQUQsRUFBTTtBQUNWQSxPQUFHLEVBQUVFLE1BREs7QUFFVkMsUUFBSSxFQUFFQyxLQUFLLENBQUNDLFFBQU4sQ0FBZUMsT0FBZixDQUZJO0FBR1ZDLFdBQU8sRUFBRUgsS0FBSyxDQUFDQyxRQUFOLENBQWVELEtBQUssQ0FBQ0ksT0FBckIsQ0FIQztBQUlWQyxhQUFTLEVBQUVDLElBSkQ7QUFLVkMsYUFBUyxFQUFFUCxLQUFLLENBQUNRLEtBQU4sQ0FBWUMsTUFBWixFQUFvQixJQUFwQjtBQUxELEdBQU4sQ0FBTDtBQVFBLENBVkQ7O0FBWUFsQixjQUFjLENBQUNtQixJQUFmLEdBQXNCLFVBQVNDLE9BQVQsRUFBa0I7QUFDdkMsTUFBSUMsV0FBVyxHQUFHQyxNQUFNLENBQUNDLFFBQVAsSUFBbUJELE1BQU0sQ0FBQ0UsTUFBMUIsSUFBb0NGLE1BQU0sQ0FBQ0UsTUFBUCxFQUFwQyxJQUF1REYsTUFBTSxDQUFDRyxRQUFQLEtBQW9CTCxPQUFPLENBQUNKLFNBQVIsSUFBcUIsVUFBekMsQ0FBdkQsSUFBK0csSUFBakk7O0FBQ0EsTUFBSVgsR0FBRyxHQUFHcUIsQ0FBQyxDQUFDQyxNQUFGLENBQVM7QUFDbEJiLGFBQVMsRUFBRSxJQUFJQyxJQUFKLEVBRE87QUFFbEJDLGFBQVMsRUFBRUs7QUFGTyxHQUFULENBQVY7O0FBS0EsTUFBSVosS0FBSyxDQUFDbUIsSUFBTixDQUFXUixPQUFYLEVBQW9CYixNQUFwQixDQUFKLEVBQWlDO0FBQ2hDRixPQUFHLENBQUNBLEdBQUosR0FBVXFCLENBQUMsQ0FBQ0csSUFBRixDQUFPVCxPQUFQLEVBQWdCLFFBQWhCLEVBQTBCLFFBQTFCLEVBQW9DLGFBQXBDLEVBQW1ELFFBQW5ELEVBQTZELFVBQTdELEVBQXlFLGNBQXpFLEVBQXlGLEtBQXpGLENBQVY7QUFDQTs7QUFFRGYsS0FBRyxDQUFDRyxJQUFKLEdBQVcsS0FBWDtBQUNBSCxLQUFHLENBQUNPLE9BQUosR0FBYyxDQUFkOztBQUVBUixtQkFBaUIsQ0FBQ0MsR0FBRCxDQUFqQjs7QUFFQSxTQUFPTCxjQUFjLENBQUNFLFVBQWYsQ0FBMEI0QixNQUExQixDQUFpQ3pCLEdBQWpDLENBQVA7QUFDQSxDQWpCRCxDOzs7Ozs7Ozs7OztBQ2RBLElBQUkwQixZQUFZLEdBQUcsS0FBbkI7O0FBQ0EsSUFBSUMsVUFBVSxHQUFHLFVBQVNDLElBQVQsRUFBZUMsUUFBZixFQUF5QjtBQUV6QyxNQUFJbEMsY0FBYyxDQUFDbUMsS0FBbkIsRUFBMEI7QUFDekJDLFdBQU8sQ0FBQ0MsR0FBUixDQUFZLDBEQUEwREgsUUFBdEU7QUFDQTs7QUFFRCxTQUFPWixNQUFNLENBQUNnQixXQUFQLENBQW1CLFlBQVc7QUFDcEMsUUFBSTtBQUNITCxVQUFJO0FBQ0osS0FGRCxDQUVFLE9BQU9NLEtBQVAsRUFBYztBQUNmLFVBQUl2QyxjQUFjLENBQUNtQyxLQUFuQixFQUEwQjtBQUN6QkMsZUFBTyxDQUFDQyxHQUFSLENBQVksMENBQTBDRSxLQUFLLENBQUNDLE9BQTVEO0FBQ0E7QUFDRDtBQUNELEdBUk0sRUFRSk4sUUFSSSxDQUFQO0FBU0EsQ0FmRCxDLENBaUJBO0FBQ0E7OztBQUVBLElBQUlPLFFBQUosRUFBY0MsTUFBZDs7QUFFQSxJQUFJQyxPQUFPLEdBQUdDLE9BQU8sQ0FBQyxZQUFELENBQXJCO0FBQUEsSUFDQ0MsTUFBTSxHQUFHRCxPQUFPLENBQUMsUUFBRCxDQURqQjs7QUFHQSxTQUFTRSxPQUFULENBQWlCQyxHQUFqQixFQUFzQjtBQUVyQkEsS0FBRyxHQUFHQSxHQUFHLElBQUksUUFBYjtBQUVBLFNBQU9DLElBQUksQ0FBQ0MsS0FBTCxDQUFXRCxJQUFJLENBQUNFLE1BQUwsS0FBZ0JILEdBQTNCLENBQVA7QUFDQTs7QUFBQSxDLENBRUQ7O0FBQ0EsU0FBU0ksV0FBVCxDQUFxQlYsUUFBckIsRUFBK0JDLE1BQS9CLEVBQXVDVSxLQUF2QyxFQUE4Q0MsR0FBOUMsRUFBbUQ7QUFFbEQsTUFBSSxDQUFDRCxLQUFELElBQVUsVUFBVXhCLElBQVYsQ0FBZXdCLEtBQWYsQ0FBZCxFQUFxQztBQUNwQyxXQUFPaEIsT0FBTyxDQUFDQyxHQUFSLENBQVksc0JBQVosQ0FBUDtBQUNBOztBQUVELE1BQUlpQixHQUFHLEdBQUcsaUZBQVY7QUFFQSxNQUFJQyxJQUFJLEdBQUdULE9BQU8sRUFBbEI7QUFBQSxNQUNDVSxJQUFJLEdBQUdSLElBQUksQ0FBQ0MsS0FBTCxDQUFXLENBQUMsSUFBSWxDLElBQUosRUFBRCxHQUFjLElBQXpCLENBRFI7QUFBQSxNQUVDMEMsR0FBRyxHQUFHWixNQUFNLENBQUMsWUFBWUgsTUFBWixHQUFxQixVQUFyQixHQUFrQ2EsSUFBbEMsR0FBeUMsUUFBekMsR0FBb0RDLElBQXBELEdBQTJELFVBQTNELEdBQXdFSixLQUF6RSxDQUZiO0FBSUEsTUFBSU0sT0FBTyxHQUFHO0FBQ2IsV0FBTztBQUFFO0FBQ1Isb0JBQWMsSUFEUjtBQUNjO0FBQ3BCLGdCQUFVTixLQUZKLENBRVU7O0FBRlYsS0FETTtBQUtiLFlBQVEsQ0FMSztBQUtGO0FBQ1gsV0FBT0MsR0FOTTtBQU1EO0FBQ1osV0FBT0ksR0FQTTtBQU9EO0FBQ1osWUFBUUQsSUFSSztBQVFDO0FBQ2QsY0FBVSxFQVRHO0FBU0M7QUFDZDtBQUNBLFdBQU8sRUFYTSxDQVdIOztBQVhHLEdBQWQ7QUFhQUYsS0FBRyxHQUFHQSxHQUFHLENBQUNLLE9BQUosQ0FBWSxZQUFaLEVBQTBCbEIsUUFBMUIsRUFDSmtCLE9BREksQ0FDSSxVQURKLEVBQ2dCSixJQURoQixDQUFOO0FBRUFaLFNBQU8sQ0FDTGlCLElBREYsQ0FDT04sR0FEUCxFQUVFbkMsSUFGRixDQUVPdUMsT0FGUCxFQUdFRyxHQUhGLENBR00sVUFBU0MsR0FBVCxFQUFjQyxHQUFkLEVBQW1CO0FBQ3ZCLFFBQUlELEdBQUosRUFBUztBQUNSLGFBQU8xQixPQUFPLENBQUNHLEtBQVIsQ0FBY3VCLEdBQWQsQ0FBUDtBQUNBO0FBQ0QsR0FQRjtBQVFBOztBQUFBO0FBRUQ7Ozs7Ozs7Ozs7O0FBVUE5RCxjQUFjLENBQUNnRSxTQUFmLEdBQTJCLFVBQVM1QyxPQUFULEVBQWtCO0FBQzVDLE1BQUk2QyxJQUFJLEdBQUcsSUFBWDtBQUNBN0MsU0FBTyxHQUFHTSxDQUFDLENBQUNDLE1BQUYsQ0FBUztBQUNsQnVDLGVBQVcsRUFBRSxLQURLLENBQ0U7O0FBREYsR0FBVCxFQUVQOUMsT0FGTyxDQUFWLENBRjRDLENBTTVDOztBQUNBLE1BQUlXLFlBQUosRUFBa0I7QUFDakIsVUFBTSxJQUFJb0MsS0FBSixDQUFVLCtEQUFWLENBQU47QUFDQTs7QUFFRHBDLGNBQVksR0FBRyxJQUFmLENBWDRDLENBYTVDOztBQUNBLE1BQUkvQixjQUFjLENBQUNtQyxLQUFuQixFQUEwQjtBQUN6QkMsV0FBTyxDQUFDQyxHQUFSLENBQVksMEJBQVosRUFBd0NqQixPQUF4QztBQUNBLEdBaEIyQyxDQWtCNUM7QUFDQTtBQUNBO0FBQ0E7OztBQUVBcUIsVUFBUSxHQUFHckIsT0FBTyxDQUFDcUIsUUFBbkI7QUFDQUMsUUFBTSxHQUFHdEIsT0FBTyxDQUFDc0IsTUFBakI7QUFDQTBCLFVBQVEsR0FBR2hELE9BQU8sQ0FBQ2dELFFBQVIsSUFBb0IsRUFBL0I7O0FBRUFILE1BQUksQ0FBQ0ksT0FBTCxHQUFlLFVBQVNoRSxHQUFULEVBQWM7QUFDNUIsUUFBSUwsY0FBYyxDQUFDbUMsS0FBbkIsRUFBMEI7QUFDekJDLGFBQU8sQ0FBQ0MsR0FBUixDQUFZLFNBQVo7QUFDQUQsYUFBTyxDQUFDQyxHQUFSLENBQVloQyxHQUFaO0FBQ0EsS0FKMkIsQ0FNNUI7QUFDQTtBQUNBOzs7QUFFQThDLGVBQVcsQ0FBQ1YsUUFBRCxFQUFXQyxNQUFYLEVBQW1CckMsR0FBRyxDQUFDQSxHQUFKLENBQVFpRSxNQUEzQixFQUFtQyxDQUFDakUsR0FBRyxDQUFDK0QsUUFBSixJQUFnQkEsUUFBakIsSUFBNkIvRCxHQUFHLENBQUNBLEdBQUosQ0FBUWdELEdBQXhFLENBQVg7QUFDQSxHQVhELENBM0I0QyxDQXdDNUM7OztBQUNBLE1BQUlrQixVQUFVLEdBQUcsVUFBU25ELE9BQVQsRUFBa0I7QUFFbEMsUUFBSTZDLElBQUksQ0FBQ0ksT0FBVCxFQUFrQjtBQUNqQkosVUFBSSxDQUFDSSxPQUFMLENBQWFqRCxPQUFiO0FBQ0E7O0FBRUQsV0FBTztBQUNOZixTQUFHLEVBQUUsQ0FBQ2UsT0FBTyxDQUFDb0QsR0FBVDtBQURDLEtBQVA7QUFHQSxHQVREOztBQVdBUCxNQUFJLENBQUNRLFVBQUwsR0FBa0IsVUFBU3JELE9BQVQsRUFBa0I7QUFDbkNBLFdBQU8sR0FBR0EsT0FBTyxJQUFJLEVBQXJCO0FBQ0EsV0FBT21ELFVBQVUsQ0FBQ25ELE9BQUQsQ0FBakI7QUFDQSxHQUhELENBcEQ0QyxDQTBENUM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUNBLE1BQUlzRCxTQUFTLEdBQUcsS0FBaEI7O0FBRUEsTUFBSXRELE9BQU8sQ0FBQ3VELFlBQVIsS0FBeUIsSUFBN0IsRUFBbUM7QUFFbEM7QUFDQTNFLGtCQUFjLENBQUNFLFVBQWYsQ0FBMEIwRSxZQUExQixDQUF1QztBQUN0QzlELGVBQVMsRUFBRTtBQUQyQixLQUF2Qzs7QUFHQWQsa0JBQWMsQ0FBQ0UsVUFBZixDQUEwQjBFLFlBQTFCLENBQXVDO0FBQ3RDcEUsVUFBSSxFQUFFO0FBRGdDLEtBQXZDOztBQUdBUixrQkFBYyxDQUFDRSxVQUFmLENBQTBCMEUsWUFBMUIsQ0FBdUM7QUFDdENoRSxhQUFPLEVBQUU7QUFENkIsS0FBdkM7O0FBS0EsUUFBSXlELE9BQU8sR0FBRyxVQUFTaEUsR0FBVCxFQUFjO0FBQzNCO0FBQ0EsVUFBSXdFLEdBQUcsR0FBRyxDQUFDLElBQUk5RCxJQUFKLEVBQVg7QUFDQSxVQUFJK0QsU0FBUyxHQUFHRCxHQUFHLEdBQUd6RCxPQUFPLENBQUM4QyxXQUE5QjtBQUNBLFVBQUlhLFFBQVEsR0FBRy9FLGNBQWMsQ0FBQ0UsVUFBZixDQUEwQjhFLE1BQTFCLENBQWlDO0FBQy9DUixXQUFHLEVBQUVuRSxHQUFHLENBQUNtRSxHQURzQztBQUUvQ2hFLFlBQUksRUFBRSxLQUZ5QztBQUVsQztBQUNiSSxlQUFPLEVBQUU7QUFDUnFFLGFBQUcsRUFBRUo7QUFERztBQUhzQyxPQUFqQyxFQU1aO0FBQ0ZLLFlBQUksRUFBRTtBQUNMdEUsaUJBQU8sRUFBRWtFO0FBREo7QUFESixPQU5ZLENBQWYsQ0FKMkIsQ0FnQjNCO0FBQ0E7O0FBQ0EsVUFBSUMsUUFBSixFQUFjO0FBRWI7QUFDQSxZQUFJSSxNQUFNLEdBQUduRixjQUFjLENBQUN5RSxVQUFmLENBQTBCcEUsR0FBMUIsQ0FBYjs7QUFFQSxZQUFJLENBQUNlLE9BQU8sQ0FBQ2dFLE9BQWIsRUFBc0I7QUFDckI7QUFDQXBGLHdCQUFjLENBQUNFLFVBQWYsQ0FBMEJtRixNQUExQixDQUFpQztBQUNoQ2IsZUFBRyxFQUFFbkUsR0FBRyxDQUFDbUU7QUFEdUIsV0FBakM7QUFHQSxTQUxELE1BS087QUFFTjtBQUNBeEUsd0JBQWMsQ0FBQ0UsVUFBZixDQUEwQjhFLE1BQTFCLENBQWlDO0FBQ2hDUixlQUFHLEVBQUVuRSxHQUFHLENBQUNtRTtBQUR1QixXQUFqQyxFQUVHO0FBQ0ZVLGdCQUFJLEVBQUU7QUFDTDtBQUNBMUUsa0JBQUksRUFBRSxJQUZEO0FBR0w7QUFDQThFLG9CQUFNLEVBQUUsSUFBSXZFLElBQUosRUFKSDtBQUtMO0FBQ0FILHFCQUFPLEVBQUU7QUFOSjtBQURKLFdBRkg7QUFhQSxTQTFCWSxDQTRCYjs7O0FBQ0FxRCxZQUFJLENBQUNzQixJQUFMLENBQVUsTUFBVixFQUFrQjtBQUNqQmxGLGFBQUcsRUFBRUEsR0FBRyxDQUFDbUUsR0FEUTtBQUVqQlcsZ0JBQU0sRUFBRUE7QUFGUyxTQUFsQjtBQUtBLE9BcEQwQixDQW9EekI7O0FBQ0YsS0FyREQsQ0Fka0MsQ0FtRS9COzs7QUFFSG5ELGNBQVUsQ0FBQyxZQUFXO0FBRXJCLFVBQUkwQyxTQUFKLEVBQWU7QUFDZDtBQUNBLE9BSm9CLENBS3JCOzs7QUFDQUEsZUFBUyxHQUFHLElBQVo7QUFFQSxVQUFJYyxTQUFTLEdBQUdwRSxPQUFPLENBQUNxRSxhQUFSLElBQXlCLENBQXpDO0FBRUEsVUFBSVosR0FBRyxHQUFHLENBQUMsSUFBSTlELElBQUosRUFBWCxDQVZxQixDQVlyQjs7QUFDQSxVQUFJMkUsVUFBVSxHQUFHMUYsY0FBYyxDQUFDRSxVQUFmLENBQTBCeUYsSUFBMUIsQ0FBK0I7QUFDL0NDLFlBQUksRUFBRSxDQUNMO0FBQ0E7QUFDQ3BGLGNBQUksRUFBRTtBQURQLFNBRkssRUFLTDtBQUNBO0FBQ0NJLGlCQUFPLEVBQUU7QUFDUnFFLGVBQUcsRUFBRUo7QUFERztBQURWLFNBTks7QUFEeUMsT0FBL0IsRUFhZDtBQUNGO0FBQ0FnQixZQUFJLEVBQUU7QUFDTC9FLG1CQUFTLEVBQUU7QUFETixTQUZKO0FBS0ZnRixhQUFLLEVBQUVOO0FBTEwsT0FiYyxDQUFqQjtBQXFCQUUsZ0JBQVUsQ0FBQ0ssT0FBWCxDQUFtQixVQUFTMUYsR0FBVCxFQUFjO0FBQ2hDLFlBQUk7QUFDSGdFLGlCQUFPLENBQUNoRSxHQUFELENBQVA7QUFDQSxTQUZELENBRUUsT0FBT2tDLEtBQVAsRUFBYztBQUVmLGNBQUl2QyxjQUFjLENBQUNtQyxLQUFuQixFQUEwQjtBQUN6QkMsbUJBQU8sQ0FBQ0MsR0FBUixDQUFZLDZDQUE2Q2hDLEdBQUcsQ0FBQ21FLEdBQWpELEdBQXVELFlBQXZELEdBQXNFakMsS0FBSyxDQUFDQyxPQUF4RjtBQUNBO0FBQ0Q7QUFDRCxPQVRELEVBbENxQixDQTJDakI7QUFFSjs7QUFDQWtDLGVBQVMsR0FBRyxLQUFaO0FBQ0EsS0EvQ1MsRUErQ1B0RCxPQUFPLENBQUN1RCxZQUFSLElBQXdCLEtBL0NqQixDQUFWLENBckVrQyxDQW9IQztBQUVuQyxHQXRIRCxNQXNITztBQUNOLFFBQUkzRSxjQUFjLENBQUNtQyxLQUFuQixFQUEwQjtBQUN6QkMsYUFBTyxDQUFDQyxHQUFSLENBQVkseUNBQVo7QUFDQTtBQUNEO0FBRUQsQ0EzTUQsQzs7Ozs7Ozs7Ozs7O0FDakZBZixPQUFPMEUsT0FBUCxDQUFlO0FBQ2QsTUFBQUMsR0FBQSxFQUFBQyxJQUFBOztBQUFBLE9BQUFELE1BQUEzRSxPQUFBNkUsUUFBQSxDQUFBOUYsR0FBQSxhQUFBNkYsT0FBQUQsSUFBQUcsTUFBQSxZQUFBRixLQUFnQ0csaUJBQWhDLEdBQWdDLE1BQWhDLEdBQWdDLE1BQWhDO0FDRUcsV0RERnJHLGVBQWVnRSxTQUFmLENBQ0M7QUFBQVcsb0JBQWNyRCxPQUFPNkUsUUFBUCxDQUFnQjlGLEdBQWhCLENBQW9CK0YsTUFBcEIsQ0FBMkJDLGlCQUF6QztBQUNBWixxQkFBZSxFQURmO0FBRUFMLGVBQVMsSUFGVDtBQUdBM0MsZ0JBQVVuQixPQUFPNkUsUUFBUCxDQUFnQjlGLEdBQWhCLENBQW9CK0YsTUFBcEIsQ0FBMkIzRCxRQUhyQztBQUlBQyxjQUFRcEIsT0FBTzZFLFFBQVAsQ0FBZ0I5RixHQUFoQixDQUFvQitGLE1BQXBCLENBQTJCMUQsTUFKbkM7QUFLQTBCLGdCQUFVOUMsT0FBTzZFLFFBQVAsQ0FBZ0I5RixHQUFoQixDQUFvQitGLE1BQXBCLENBQTJCaEM7QUFMckMsS0FERCxDQ0NFO0FBUUQ7QURYSCxHIiwiZmlsZSI6Ii9wYWNrYWdlcy9zdGVlZG9zX3FjbG91ZC1zbXNxdWV1ZS5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IGNoZWNrTnBtVmVyc2lvbnMgfSBmcm9tICdtZXRlb3IvdG1lYXNkYXk6Y2hlY2stbnBtLXZlcnNpb25zJztcbmNoZWNrTnBtVmVyc2lvbnMoe1xuXHRcInN1cGVyYWdlbnRcIjogXCJeMy41LjJcIixcblx0XCJzaGEyNTZcIjogXCJeMC4yLjBcIlxufSwgJ3N0ZWVkb3M6cWNsb3VkLXNtc3F1ZXVlJyk7IiwiUWNsb3VkU01TUXVldWUgPSBuZXcgRXZlbnRTdGF0ZSgpOyIsIlFjbG91ZFNNU1F1ZXVlLmNvbGxlY3Rpb24gPSBTTVNRdWV1ZS5jb2xsZWN0aW9uO1xuXG52YXIgX3ZhbGlkYXRlRG9jdW1lbnQgPSBmdW5jdGlvbihzbXMpIHtcblxuXHRjaGVjayhzbXMsIHtcblx0XHRzbXM6IE9iamVjdCxcblx0XHRzZW50OiBNYXRjaC5PcHRpb25hbChCb29sZWFuKSxcblx0XHRzZW5kaW5nOiBNYXRjaC5PcHRpb25hbChNYXRjaC5JbnRlZ2VyKSxcblx0XHRjcmVhdGVkQXQ6IERhdGUsXG5cdFx0Y3JlYXRlZEJ5OiBNYXRjaC5PbmVPZihTdHJpbmcsIG51bGwpXG5cdH0pO1xuXG59O1xuXG5RY2xvdWRTTVNRdWV1ZS5zZW5kID0gZnVuY3Rpb24ob3B0aW9ucykge1xuXHR2YXIgY3VycmVudFVzZXIgPSBNZXRlb3IuaXNDbGllbnQgJiYgTWV0ZW9yLnVzZXJJZCAmJiBNZXRlb3IudXNlcklkKCkgfHwgTWV0ZW9yLmlzU2VydmVyICYmIChvcHRpb25zLmNyZWF0ZWRCeSB8fCAnPFNFUlZFUj4nKSB8fCBudWxsXG5cdHZhciBzbXMgPSBfLmV4dGVuZCh7XG5cdFx0Y3JlYXRlZEF0OiBuZXcgRGF0ZSgpLFxuXHRcdGNyZWF0ZWRCeTogY3VycmVudFVzZXJcblx0fSk7XG5cblx0aWYgKE1hdGNoLnRlc3Qob3B0aW9ucywgT2JqZWN0KSkge1xuXHRcdHNtcy5zbXMgPSBfLnBpY2sob3B0aW9ucywgJ0Zvcm1hdCcsICdBY3Rpb24nLCAnUGFyYW1TdHJpbmcnLCAnUmVjTnVtJywgJ1NpZ25OYW1lJywgJ1RlbXBsYXRlQ29kZScsICdtc2cnKTtcblx0fVxuXG5cdHNtcy5zZW50ID0gZmFsc2U7XG5cdHNtcy5zZW5kaW5nID0gMDtcblxuXHRfdmFsaWRhdGVEb2N1bWVudChzbXMpO1xuXG5cdHJldHVybiBRY2xvdWRTTVNRdWV1ZS5jb2xsZWN0aW9uLmluc2VydChzbXMpO1xufTsiLCJ2YXIgaXNDb25maWd1cmVkID0gZmFsc2U7XG52YXIgc2VuZFdvcmtlciA9IGZ1bmN0aW9uKHRhc2ssIGludGVydmFsKSB7XG5cblx0aWYgKFFjbG91ZFNNU1F1ZXVlLmRlYnVnKSB7XG5cdFx0Y29uc29sZS5sb2coJ1FjbG91ZFNNU1F1ZXVlOiBTZW5kIHdvcmtlciBzdGFydGVkLCB1c2luZyBpbnRlcnZhbDogJyArIGludGVydmFsKTtcblx0fVxuXG5cdHJldHVybiBNZXRlb3Iuc2V0SW50ZXJ2YWwoZnVuY3Rpb24oKSB7XG5cdFx0dHJ5IHtcblx0XHRcdHRhc2soKTtcblx0XHR9IGNhdGNoIChlcnJvcikge1xuXHRcdFx0aWYgKFFjbG91ZFNNU1F1ZXVlLmRlYnVnKSB7XG5cdFx0XHRcdGNvbnNvbGUubG9nKCdRY2xvdWRTTVNRdWV1ZTogRXJyb3Igd2hpbGUgc2VuZGluZzogJyArIGVycm9yLm1lc3NhZ2UpO1xuXHRcdFx0fVxuXHRcdH1cblx0fSwgaW50ZXJ2YWwpO1xufTtcblxuLy8gdmFyIFNNUyA9IHJlcXVpcmUoJ2FsaXl1bi1zbXMtbm9kZScpLFxuLy8gXHRzbXNTZW5kZXI7XG5cbnZhciBzZGthcHBpZCwgYXBwa2V5O1xuXG52YXIgcmVxdWVzdCA9IHJlcXVpcmUoJ3N1cGVyYWdlbnQnKSxcblx0c2hhMjU2ID0gcmVxdWlyZSgnc2hhMjU2Jyk7XG5cbmZ1bmN0aW9uIGdldFJhbmQoYml0KSB7XG5cblx0Yml0ID0gYml0IHx8IDEwMDAwMDAwO1xuXG5cdHJldHVybiBNYXRoLnJvdW5kKE1hdGgucmFuZG9tKCkgKiBiaXQpO1xufTtcblxuLy9zZW5kIHRleHQgbWVzc2FnZVxuZnVuY3Rpb24gc2VuZFRleHRNc2coc2RrYXBwaWQsIGFwcGtleSwgcGhvbmUsIG1zZykge1xuXG5cdGlmICghcGhvbmUgfHwgLzFcXGR7MTJ9Ly50ZXN0KHBob25lKSkge1xuXHRcdHJldHVybiBjb25zb2xlLmxvZygnaW52YWxpZCBwaG9uZSBudW1iZXInKTtcblx0fVxuXG5cdHZhciB1cmwgPSAnaHR0cHM6Ly95dW4udGltLnFxLmNvbS92NS90bHNzbXNzdnIvc2VuZHNtcz9zZGthcHBpZD17c2RrYXBwaWR9JnJhbmRvbT17cmFuZG9tfSc7XG5cblx0dmFyIHJhbmQgPSBnZXRSYW5kKCksXG5cdFx0dGltZSA9IE1hdGgucm91bmQoK25ldyBEYXRlKCkgLyAxMDAwKSxcblx0XHRzaWcgPSBzaGEyNTYoJ2FwcGtleT0nICsgYXBwa2V5ICsgJyZyYW5kb209JyArIHJhbmQgKyAnJnRpbWU9JyArIHRpbWUgKyAnJm1vYmlsZT0nICsgcGhvbmUpO1xuXG5cdHZhciBjb250ZW50ID0ge1xuXHRcdFwidGVsXCI6IHsgLy/lpoLpnIDkvb/nlKjlm73pmYXnlLXor53lj7fnoIHpgJrnlKjmoLzlvI/vvIzlpoLvvJpcIis4NjEzNzg4ODg4ODg4XCIg77yM6K+35L2/55Soc2VuZGlzbXPmjqXlj6Pop4HkuIvms6hcblx0XHRcdFwibmF0aW9uY29kZVwiOiBcIjg2XCIsIC8v5Zu95a6256CBXG5cdFx0XHRcIm1vYmlsZVwiOiBwaG9uZSAvL+aJi+acuuWPt+eggVxuXHRcdH0sXG5cdFx0XCJ0eXBlXCI6IDAsIC8vMDrmma7pgJrnn63kv6E7MTrokKXplIDnn63kv6HvvIjlvLrosIPvvJropoHmjInpnIDloavlgLzvvIzkuI3nhLbkvJrlvbHlk43liLDkuJrliqHnmoTmraPluLjkvb/nlKjvvIlcblx0XHRcIm1zZ1wiOiBtc2csIC8vdXRmOOe8lueggSBcblx0XHRcInNpZ1wiOiBzaWcsIC8vYXBw5Yet6K+B77yM5YW35L2T6K6h566X5pa55byP6KeB5LiL5rOoXG5cdFx0XCJ0aW1lXCI6IHRpbWUsIC8vdW5peOaXtumXtOaIs++8jOivt+axguWPkei1t+aXtumXtO+8jOWmguaenOWSjOezu+e7n+aXtumXtOebuOW3rui2hei/hzEw5YiG6ZKf5YiZ5Lya6L+U5Zue5aSx6LSlXG5cdFx0XCJleHRlbmRcIjogXCJcIiwgLy/pgJrpgZPmianlsZXnoIHvvIzlj6/pgInlrZfmrrXvvIzpu5jorqTmsqHmnInlvIDpgJoo6ZyA6KaB5aGr56m6KeOAglxuXHRcdC8v5Zyo55+t5L+h5Zue5aSN5Zy65pmv5Lit77yM6IW+6K6vc2VydmVy5Lya5Y6f5qC36L+U5Zue77yM5byA5Y+R6ICF5Y+v5L6d5q2k5Yy65YiG5piv5ZOq56eN57G75Z6L55qE5Zue5aSNXG5cdFx0XCJleHRcIjogXCJcIiAvL+eUqOaIt+eahHNlc3Npb27lhoXlrrnvvIzohb7orq9zZXJ2ZXLlm57ljIXkuK3kvJrljp/moLfov5Tlm57vvIzlj6/pgInlrZfmrrXvvIzkuI3pnIDopoHlsLHloavnqbrjgIJcblx0fTtcblx0dXJsID0gdXJsLnJlcGxhY2UoJ3tzZGthcHBpZH0nLCBzZGthcHBpZClcblx0XHQucmVwbGFjZSgne3JhbmRvbX0nLCByYW5kKTtcblx0cmVxdWVzdFxuXHRcdC5wb3N0KHVybClcblx0XHQuc2VuZChjb250ZW50KVxuXHRcdC5lbmQoZnVuY3Rpb24oZXJyLCByZXMpIHtcblx0XHRcdGlmIChlcnIpIHtcblx0XHRcdFx0cmV0dXJuIGNvbnNvbGUuZXJyb3IoZXJyKTtcblx0XHRcdH1cblx0XHR9KTtcbn07XG5cbi8qXG5cdG9wdGlvbnM6IHtcblx0XHQvLyBDb250cm9scyB0aGUgc2VuZGluZyBpbnRlcnZhbFxuXHRcdHNlbmRJbnRlcnZhbDogTWF0Y2guT3B0aW9uYWwoTnVtYmVyKSxcblx0XHQvLyBDb250cm9scyB0aGUgc2VuZGluZyBiYXRjaCBzaXplIHBlciBpbnRlcnZhbFxuXHRcdHNlbmRCYXRjaFNpemU6IE1hdGNoLk9wdGlvbmFsKE51bWJlciksXG5cdFx0Ly8gQWxsb3cgb3B0aW9uYWwga2VlcGluZyBub3RpZmljYXRpb25zIGluIGNvbGxlY3Rpb25cblx0XHRrZWVwU01TOiBNYXRjaC5PcHRpb25hbChCb29sZWFuKVxuXHR9XG4qL1xuUWNsb3VkU01TUXVldWUuQ29uZmlndXJlID0gZnVuY3Rpb24ob3B0aW9ucykge1xuXHR2YXIgc2VsZiA9IHRoaXM7XG5cdG9wdGlvbnMgPSBfLmV4dGVuZCh7XG5cdFx0c2VuZFRpbWVvdXQ6IDYwMDAwLCAvLyBUaW1lb3V0IHBlcmlvZCBmb3Igc21zIHNlbmRcblx0fSwgb3B0aW9ucyk7XG5cblx0Ly8gQmxvY2sgbXVsdGlwbGUgY2FsbHNcblx0aWYgKGlzQ29uZmlndXJlZCkge1xuXHRcdHRocm93IG5ldyBFcnJvcignUWNsb3VkU01TUXVldWUuQ29uZmlndXJlIHNob3VsZCBub3QgYmUgY2FsbGVkIG1vcmUgdGhhbiBvbmNlIScpO1xuXHR9XG5cblx0aXNDb25maWd1cmVkID0gdHJ1ZTtcblxuXHQvLyBBZGQgZGVidWcgaW5mb1xuXHRpZiAoUWNsb3VkU01TUXVldWUuZGVidWcpIHtcblx0XHRjb25zb2xlLmxvZygnUWNsb3VkU01TUXVldWUuQ29uZmlndXJlJywgb3B0aW9ucyk7XG5cdH1cblxuXHQvLyBzbXNTZW5kZXIgPSBuZXcgU01TKHtcblx0Ly8gXHRBY2Nlc3NLZXlJZDogb3B0aW9ucy5hY2Nlc3NLZXlJZCxcblx0Ly8gXHRBY2Nlc3NLZXlTZWNyZXQ6IG9wdGlvbnMuYWNjZXNzS2V5U2VjcmV0XG5cdC8vIH0pO1xuXG5cdHNka2FwcGlkID0gb3B0aW9ucy5zZGthcHBpZDtcblx0YXBwa2V5ID0gb3B0aW9ucy5hcHBrZXk7XG5cdHNpZ25uYW1lID0gb3B0aW9ucy5zaWdubmFtZSB8fCBcIlwiO1xuXG5cdHNlbGYuc2VuZFNNUyA9IGZ1bmN0aW9uKHNtcykge1xuXHRcdGlmIChRY2xvdWRTTVNRdWV1ZS5kZWJ1Zykge1xuXHRcdFx0Y29uc29sZS5sb2coXCJzZW5kU01TXCIpO1xuXHRcdFx0Y29uc29sZS5sb2coc21zKTtcblx0XHR9XG5cblx0XHQvLyBzbXNTZW5kZXIuc2VuZChzbXMuc21zKS5jYXRjaChlcnIgPT4ge1xuXHRcdC8vIFx0Y29uc29sZS5lcnJvcihlcnIpXG5cdFx0Ly8gfSk7XG5cblx0XHRzZW5kVGV4dE1zZyhzZGthcHBpZCwgYXBwa2V5LCBzbXMuc21zLlJlY051bSwgKHNtcy5zaWdubmFtZSB8fCBzaWdubmFtZSkgKyBzbXMuc21zLm1zZyk7XG5cdH1cblxuXHQvLyBVbml2ZXJzYWwgc2VuZCBmdW5jdGlvblxuXHR2YXIgX3F1ZXJ5U2VuZCA9IGZ1bmN0aW9uKG9wdGlvbnMpIHtcblxuXHRcdGlmIChzZWxmLnNlbmRTTVMpIHtcblx0XHRcdHNlbGYuc2VuZFNNUyhvcHRpb25zKTtcblx0XHR9XG5cblx0XHRyZXR1cm4ge1xuXHRcdFx0c21zOiBbb3B0aW9ucy5faWRdXG5cdFx0fTtcblx0fTtcblxuXHRzZWxmLnNlcnZlclNlbmQgPSBmdW5jdGlvbihvcHRpb25zKSB7XG5cdFx0b3B0aW9ucyA9IG9wdGlvbnMgfHwge307XG5cdFx0cmV0dXJuIF9xdWVyeVNlbmQob3B0aW9ucyk7XG5cdH07XG5cblxuXHQvLyBUaGlzIGludGVydmFsIHdpbGwgYWxsb3cgb25seSBvbmUgc21zIHRvIGJlIHNlbnQgYXQgYSB0aW1lLCBpdFxuXHQvLyB3aWxsIGNoZWNrIGZvciBuZXcgc21zIGF0IGV2ZXJ5IGBvcHRpb25zLnNlbmRJbnRlcnZhbGBcblx0Ly8gKGRlZmF1bHQgaW50ZXJ2YWwgaXMgMTUwMDAgbXMpXG5cdC8vXG5cdC8vIEl0IGxvb2tzIGluIHNtcyBjb2xsZWN0aW9uIHRvIHNlZSBpZiB0aGVyZXMgYW55IHBlbmRpbmdcblx0Ly8gc21zLCBpZiBzbyBpdCB3aWxsIHRyeSB0byByZXNlcnZlIHRoZSBwZW5kaW5nIHNtcy5cblx0Ly8gSWYgc3VjY2Vzc2Z1bGx5IHJlc2VydmVkIHRoZSBzZW5kIGlzIHN0YXJ0ZWQuXG5cdC8vXG5cdC8vIElmIHNtcy5xdWVyeSBpcyB0eXBlIHN0cmluZywgaXQncyBhc3N1bWVkIHRvIGJlIGEganNvbiBzdHJpbmdcblx0Ly8gdmVyc2lvbiBvZiB0aGUgcXVlcnkgc2VsZWN0b3IuIE1ha2luZyBpdCBhYmxlIHRvIGNhcnJ5IGAkYCBwcm9wZXJ0aWVzIGluXG5cdC8vIHRoZSBtb25nbyBjb2xsZWN0aW9uLlxuXHQvL1xuXHQvLyBQci4gZGVmYXVsdCBzbXMgYXJlIHJlbW92ZWQgZnJvbSB0aGUgY29sbGVjdGlvbiBhZnRlciBzZW5kIGhhdmVcblx0Ly8gY29tcGxldGVkLiBTZXR0aW5nIGBvcHRpb25zLmtlZXBTTVNgIHdpbGwgdXBkYXRlIGFuZCBrZWVwIHRoZVxuXHQvLyBzbXMgZWcuIGlmIG5lZWRlZCBmb3IgaGlzdG9yaWNhbCByZWFzb25zLlxuXHQvL1xuXHQvLyBBZnRlciB0aGUgc2VuZCBoYXZlIGNvbXBsZXRlZCBhIFwic2VuZFwiIGV2ZW50IHdpbGwgYmUgZW1pdHRlZCB3aXRoIGFcblx0Ly8gc3RhdHVzIG9iamVjdCBjb250YWluaW5nIHNtcyBpZCBhbmQgdGhlIHNlbmQgcmVzdWx0IG9iamVjdC5cblx0Ly9cblx0dmFyIGlzU2VuZGluZyA9IGZhbHNlO1xuXG5cdGlmIChvcHRpb25zLnNlbmRJbnRlcnZhbCAhPT0gbnVsbCkge1xuXG5cdFx0Ly8gVGhpcyB3aWxsIHJlcXVpcmUgaW5kZXggc2luY2Ugd2Ugc29ydCBzbXMgYnkgY3JlYXRlZEF0XG5cdFx0UWNsb3VkU01TUXVldWUuY29sbGVjdGlvbi5fZW5zdXJlSW5kZXgoe1xuXHRcdFx0Y3JlYXRlZEF0OiAxXG5cdFx0fSk7XG5cdFx0UWNsb3VkU01TUXVldWUuY29sbGVjdGlvbi5fZW5zdXJlSW5kZXgoe1xuXHRcdFx0c2VudDogMVxuXHRcdH0pO1xuXHRcdFFjbG91ZFNNU1F1ZXVlLmNvbGxlY3Rpb24uX2Vuc3VyZUluZGV4KHtcblx0XHRcdHNlbmRpbmc6IDFcblx0XHR9KTtcblxuXG5cdFx0dmFyIHNlbmRTTVMgPSBmdW5jdGlvbihzbXMpIHtcblx0XHRcdC8vIFJlc2VydmUgc21zXG5cdFx0XHR2YXIgbm93ID0gK25ldyBEYXRlKCk7XG5cdFx0XHR2YXIgdGltZW91dEF0ID0gbm93ICsgb3B0aW9ucy5zZW5kVGltZW91dDtcblx0XHRcdHZhciByZXNlcnZlZCA9IFFjbG91ZFNNU1F1ZXVlLmNvbGxlY3Rpb24udXBkYXRlKHtcblx0XHRcdFx0X2lkOiBzbXMuX2lkLFxuXHRcdFx0XHRzZW50OiBmYWxzZSwgLy8geHh4OiBuZWVkIHRvIG1ha2Ugc3VyZSB0aGlzIGlzIHNldCBvbiBjcmVhdGVcblx0XHRcdFx0c2VuZGluZzoge1xuXHRcdFx0XHRcdCRsdDogbm93XG5cdFx0XHRcdH1cblx0XHRcdH0sIHtcblx0XHRcdFx0JHNldDoge1xuXHRcdFx0XHRcdHNlbmRpbmc6IHRpbWVvdXRBdCxcblx0XHRcdFx0fVxuXHRcdFx0fSk7XG5cblx0XHRcdC8vIE1ha2Ugc3VyZSB3ZSBvbmx5IGhhbmRsZSBzbXMgcmVzZXJ2ZWQgYnkgdGhpc1xuXHRcdFx0Ly8gaW5zdGFuY2Vcblx0XHRcdGlmIChyZXNlcnZlZCkge1xuXG5cdFx0XHRcdC8vIFNlbmQgdGhlIHNtc1xuXHRcdFx0XHR2YXIgcmVzdWx0ID0gUWNsb3VkU01TUXVldWUuc2VydmVyU2VuZChzbXMpO1xuXG5cdFx0XHRcdGlmICghb3B0aW9ucy5rZWVwU01TKSB7XG5cdFx0XHRcdFx0Ly8gUHIuIERlZmF1bHQgd2Ugd2lsbCByZW1vdmUgc21zXG5cdFx0XHRcdFx0UWNsb3VkU01TUXVldWUuY29sbGVjdGlvbi5yZW1vdmUoe1xuXHRcdFx0XHRcdFx0X2lkOiBzbXMuX2lkXG5cdFx0XHRcdFx0fSk7XG5cdFx0XHRcdH0gZWxzZSB7XG5cblx0XHRcdFx0XHQvLyBVcGRhdGUgdGhlIHNtc1xuXHRcdFx0XHRcdFFjbG91ZFNNU1F1ZXVlLmNvbGxlY3Rpb24udXBkYXRlKHtcblx0XHRcdFx0XHRcdF9pZDogc21zLl9pZFxuXHRcdFx0XHRcdH0sIHtcblx0XHRcdFx0XHRcdCRzZXQ6IHtcblx0XHRcdFx0XHRcdFx0Ly8gTWFyayBhcyBzZW50XG5cdFx0XHRcdFx0XHRcdHNlbnQ6IHRydWUsXG5cdFx0XHRcdFx0XHRcdC8vIFNldCB0aGUgc2VudCBkYXRlXG5cdFx0XHRcdFx0XHRcdHNlbnRBdDogbmV3IERhdGUoKSxcblx0XHRcdFx0XHRcdFx0Ly8gTm90IGJlaW5nIHNlbnQgYW55bW9yZVxuXHRcdFx0XHRcdFx0XHRzZW5kaW5nOiAwXG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fSk7XG5cblx0XHRcdFx0fVxuXG5cdFx0XHRcdC8vIEVtaXQgdGhlIHNlbmRcblx0XHRcdFx0c2VsZi5lbWl0KCdzZW5kJywge1xuXHRcdFx0XHRcdHNtczogc21zLl9pZCxcblx0XHRcdFx0XHRyZXN1bHQ6IHJlc3VsdFxuXHRcdFx0XHR9KTtcblxuXHRcdFx0fSAvLyBFbHNlIGNvdWxkIG5vdCByZXNlcnZlXG5cdFx0fTsgLy8gRU8gc2VuZFNNU1xuXG5cdFx0c2VuZFdvcmtlcihmdW5jdGlvbigpIHtcblxuXHRcdFx0aWYgKGlzU2VuZGluZykge1xuXHRcdFx0XHRyZXR1cm47XG5cdFx0XHR9XG5cdFx0XHQvLyBTZXQgc2VuZCBmZW5jZVxuXHRcdFx0aXNTZW5kaW5nID0gdHJ1ZTtcblxuXHRcdFx0dmFyIGJhdGNoU2l6ZSA9IG9wdGlvbnMuc2VuZEJhdGNoU2l6ZSB8fCAxO1xuXG5cdFx0XHR2YXIgbm93ID0gK25ldyBEYXRlKCk7XG5cblx0XHRcdC8vIEZpbmQgc21zIHRoYXQgYXJlIG5vdCBiZWluZyBvciBhbHJlYWR5IHNlbnRcblx0XHRcdHZhciBwZW5kaW5nU01TID0gUWNsb3VkU01TUXVldWUuY29sbGVjdGlvbi5maW5kKHtcblx0XHRcdFx0JGFuZDogW1xuXHRcdFx0XHRcdC8vIE1lc3NhZ2UgaXMgbm90IHNlbnRcblx0XHRcdFx0XHR7XG5cdFx0XHRcdFx0XHRzZW50OiBmYWxzZVxuXHRcdFx0XHRcdH0sXG5cdFx0XHRcdFx0Ly8gQW5kIG5vdCBiZWluZyBzZW50IGJ5IG90aGVyIGluc3RhbmNlc1xuXHRcdFx0XHRcdHtcblx0XHRcdFx0XHRcdHNlbmRpbmc6IHtcblx0XHRcdFx0XHRcdFx0JGx0OiBub3dcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9XG5cdFx0XHRcdF1cblx0XHRcdH0sIHtcblx0XHRcdFx0Ly8gU29ydCBieSBjcmVhdGVkIGRhdGVcblx0XHRcdFx0c29ydDoge1xuXHRcdFx0XHRcdGNyZWF0ZWRBdDogMVxuXHRcdFx0XHR9LFxuXHRcdFx0XHRsaW1pdDogYmF0Y2hTaXplXG5cdFx0XHR9KTtcblxuXHRcdFx0cGVuZGluZ1NNUy5mb3JFYWNoKGZ1bmN0aW9uKHNtcykge1xuXHRcdFx0XHR0cnkge1xuXHRcdFx0XHRcdHNlbmRTTVMoc21zKTtcblx0XHRcdFx0fSBjYXRjaCAoZXJyb3IpIHtcblxuXHRcdFx0XHRcdGlmIChRY2xvdWRTTVNRdWV1ZS5kZWJ1Zykge1xuXHRcdFx0XHRcdFx0Y29uc29sZS5sb2coJ1FjbG91ZFNNU1F1ZXVlOiBDb3VsZCBub3Qgc2VuZCBzbXMgaWQ6IFwiJyArIHNtcy5faWQgKyAnXCIsIEVycm9yOiAnICsgZXJyb3IubWVzc2FnZSk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9KTsgLy8gRU8gZm9yRWFjaFxuXG5cdFx0XHQvLyBSZW1vdmUgdGhlIHNlbmQgZmVuY2Vcblx0XHRcdGlzU2VuZGluZyA9IGZhbHNlO1xuXHRcdH0sIG9wdGlvbnMuc2VuZEludGVydmFsIHx8IDE1MDAwKTsgLy8gRGVmYXVsdCBldmVyeSAxNXRoIHNlY1xuXG5cdH0gZWxzZSB7XG5cdFx0aWYgKFFjbG91ZFNNU1F1ZXVlLmRlYnVnKSB7XG5cdFx0XHRjb25zb2xlLmxvZygnUWNsb3VkU01TUXVldWU6IFNlbmQgc2VydmVyIGlzIGRpc2FibGVkJyk7XG5cdFx0fVxuXHR9XG5cbn07IiwiTWV0ZW9yLnN0YXJ0dXAgLT5cblx0aWYgTWV0ZW9yLnNldHRpbmdzLnNtcz8ucWNsb3VkPy5zbXNxdWV1ZV9pbnRlcnZhbFxuXHRcdFFjbG91ZFNNU1F1ZXVlLkNvbmZpZ3VyZVxuXHRcdFx0c2VuZEludGVydmFsOiBNZXRlb3Iuc2V0dGluZ3Muc21zLnFjbG91ZC5zbXNxdWV1ZV9pbnRlcnZhbFxuXHRcdFx0c2VuZEJhdGNoU2l6ZTogMTBcblx0XHRcdGtlZXBTTVM6IHRydWVcblx0XHRcdHNka2FwcGlkOiBNZXRlb3Iuc2V0dGluZ3Muc21zLnFjbG91ZC5zZGthcHBpZFxuXHRcdFx0YXBwa2V5OiBNZXRlb3Iuc2V0dGluZ3Muc21zLnFjbG91ZC5hcHBrZXlcblx0XHRcdHNpZ25uYW1lOiBNZXRlb3Iuc2V0dGluZ3Muc21zLnFjbG91ZC5zaWdubmFtZVxuIiwiTWV0ZW9yLnN0YXJ0dXAoZnVuY3Rpb24oKSB7XG4gIHZhciByZWYsIHJlZjE7XG4gIGlmICgocmVmID0gTWV0ZW9yLnNldHRpbmdzLnNtcykgIT0gbnVsbCA/IChyZWYxID0gcmVmLnFjbG91ZCkgIT0gbnVsbCA/IHJlZjEuc21zcXVldWVfaW50ZXJ2YWwgOiB2b2lkIDAgOiB2b2lkIDApIHtcbiAgICByZXR1cm4gUWNsb3VkU01TUXVldWUuQ29uZmlndXJlKHtcbiAgICAgIHNlbmRJbnRlcnZhbDogTWV0ZW9yLnNldHRpbmdzLnNtcy5xY2xvdWQuc21zcXVldWVfaW50ZXJ2YWwsXG4gICAgICBzZW5kQmF0Y2hTaXplOiAxMCxcbiAgICAgIGtlZXBTTVM6IHRydWUsXG4gICAgICBzZGthcHBpZDogTWV0ZW9yLnNldHRpbmdzLnNtcy5xY2xvdWQuc2RrYXBwaWQsXG4gICAgICBhcHBrZXk6IE1ldGVvci5zZXR0aW5ncy5zbXMucWNsb3VkLmFwcGtleSxcbiAgICAgIHNpZ25uYW1lOiBNZXRlb3Iuc2V0dGluZ3Muc21zLnFjbG91ZC5zaWdubmFtZVxuICAgIH0pO1xuICB9XG59KTtcbiJdfQ==
