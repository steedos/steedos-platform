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
var TAPi18next = Package['tap:i18n'].TAPi18next;
var TAPi18n = Package['tap:i18n'].TAPi18n;
var meteorInstall = Package.modules.meteorInstall;
var meteorBabelHelpers = Package['babel-runtime'].meteorBabelHelpers;
var Promise = Package.promise.Promise;

/* Package-scope variables */
var SMSQueue, __coffeescriptShare;

var require = meteorInstall({"node_modules":{"meteor":{"steedos:smsqueue":{"checkNpm.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/steedos_smsqueue/checkNpm.js                                                                              //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
let checkNpmVersions;
module.link("meteor/tmeasday:check-npm-versions", {
  checkNpmVersions(v) {
    checkNpmVersions = v;
  }

}, 0);

if (Meteor.settings && Meteor.settings.sms && Meteor.settings.sms.aliyun) {
  checkNpmVersions({
    "aliyun-sms-node": "^1.1.2"
  }, 'steedos:smsqueue');
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"lib":{"common":{"main.js":function(){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/steedos_smsqueue/lib/common/main.js                                                                       //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
SMSQueue = new EventState();
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"sms.js":function(){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/steedos_smsqueue/lib/common/sms.js                                                                        //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
SMSQueue.collection = new Mongo.Collection('_sms_queue');

var _validateDocument = function (sms) {
  check(sms, {
    sms: Object,
    sent: Match.Optional(Boolean),
    sending: Match.Optional(Match.Integer),
    createdAt: Date,
    createdBy: Match.OneOf(String, null)
  });
};

SMSQueue.send = function (options) {
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

  return SMSQueue.collection.insert(sms);
};
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}},"server":{"api.js":function(require){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/steedos_smsqueue/lib/server/api.js                                                                        //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
var isConfigured = false;

var sendWorker = function (task, interval) {
  if (SMSQueue.debug) {
    console.log('SMSQueue: Send worker started, using interval: ' + interval);
  }

  return Meteor.setInterval(function () {
    try {
      task();
    } catch (error) {
      if (SMSQueue.debug) {
        console.log('SMSQueue: Error while sending: ' + error.message);
      }
    }
  }, interval);
};
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


SMSQueue.Configure = function (options) {
  var self = this;
  options = _.extend({
    sendTimeout: 60000 // Timeout period for sms send

  }, options); // Block multiple calls

  if (isConfigured) {
    throw new Error('SMSQueue.Configure should not be called more than once!');
  }

  isConfigured = true; // Add debug info

  if (SMSQueue.debug) {
    console.log('SMSQueue.Configure', options);
  }

  var SMS = require('aliyun-sms-node'),
      smsSender;

  smsSender = new SMS({
    AccessKeyId: options.accessKeyId,
    AccessKeySecret: options.accessKeySecret
  });

  self.sendSMS = function (sms) {
    if (SMSQueue.debug) {
      console.log("sendSMS");
      console.log(sms);
    }

    smsSender.send(sms.sms).catch(err => {
      console.error(err);
    });
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
    SMSQueue.collection._ensureIndex({
      createdAt: 1
    });

    SMSQueue.collection._ensureIndex({
      sent: 1
    });

    SMSQueue.collection._ensureIndex({
      sending: 1
    });

    var sendSMS = function (sms) {
      // Reserve sms
      var now = +new Date();
      var timeoutAt = now + options.sendTimeout;
      var reserved = SMSQueue.collection.update({
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
        var result = SMSQueue.serverSend(sms);

        if (!options.keepSMS) {
          // Pr. Default we will remove sms
          SMSQueue.collection.remove({
            _id: sms._id
          });
        } else {
          // Update the sms
          SMSQueue.collection.update({
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

      var pendingSMS = SMSQueue.collection.find({
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
          if (SMSQueue.debug) {
            console.log('SMSQueue: Could not send sms id: "' + sms._id + '", Error: ' + error.message);
          }
        }
      }); // EO forEach
      // Remove the send fence

      isSending = false;
    }, options.sendInterval || 15000); // Default every 15th sec
  } else {
    if (SMSQueue.debug) {
      console.log('SMSQueue: Send server is disabled');
    }
  }
};
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}}},"server":{"startup.coffee":function(){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/steedos_smsqueue/server/startup.coffee                                                                    //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
Meteor.startup(function () {
  var ref, ref1;

  if ((ref = Meteor.settings.sms) != null ? (ref1 = ref.aliyun) != null ? ref1.smsqueue_interval : void 0 : void 0) {
    return SMSQueue.Configure({
      sendInterval: Meteor.settings.sms.aliyun.smsqueue_interval,
      sendBatchSize: 10,
      keepSMS: true,
      accessKeyId: Meteor.settings.sms.aliyun.accessKeyId,
      accessKeySecret: Meteor.settings.sms.aliyun.accessKeySecret
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

require("/node_modules/meteor/steedos:smsqueue/checkNpm.js");
require("/node_modules/meteor/steedos:smsqueue/lib/common/main.js");
require("/node_modules/meteor/steedos:smsqueue/lib/common/sms.js");
require("/node_modules/meteor/steedos:smsqueue/lib/server/api.js");
require("/node_modules/meteor/steedos:smsqueue/server/startup.coffee");

/* Exports */
Package._define("steedos:smsqueue", {
  SMSQueue: SMSQueue
});

})();

//# sourceURL=meteor://💻app/packages/steedos_smsqueue.js
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvczpzbXNxdWV1ZS9jaGVja05wbS5qcyIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvczpzbXNxdWV1ZS9saWIvY29tbW9uL21haW4uanMiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3M6c21zcXVldWUvbGliL2NvbW1vbi9zbXMuanMiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3M6c21zcXVldWUvbGliL3NlcnZlci9hcGkuanMiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3Nfc21zcXVldWUvc2VydmVyL3N0YXJ0dXAuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9zZXJ2ZXIvc3RhcnR1cC5jb2ZmZWUiXSwibmFtZXMiOlsiY2hlY2tOcG1WZXJzaW9ucyIsIm1vZHVsZSIsImxpbmsiLCJ2IiwiTWV0ZW9yIiwic2V0dGluZ3MiLCJzbXMiLCJhbGl5dW4iLCJTTVNRdWV1ZSIsIkV2ZW50U3RhdGUiLCJjb2xsZWN0aW9uIiwiTW9uZ28iLCJDb2xsZWN0aW9uIiwiX3ZhbGlkYXRlRG9jdW1lbnQiLCJjaGVjayIsIk9iamVjdCIsInNlbnQiLCJNYXRjaCIsIk9wdGlvbmFsIiwiQm9vbGVhbiIsInNlbmRpbmciLCJJbnRlZ2VyIiwiY3JlYXRlZEF0IiwiRGF0ZSIsImNyZWF0ZWRCeSIsIk9uZU9mIiwiU3RyaW5nIiwic2VuZCIsIm9wdGlvbnMiLCJjdXJyZW50VXNlciIsImlzQ2xpZW50IiwidXNlcklkIiwiaXNTZXJ2ZXIiLCJfIiwiZXh0ZW5kIiwidGVzdCIsInBpY2siLCJpbnNlcnQiLCJpc0NvbmZpZ3VyZWQiLCJzZW5kV29ya2VyIiwidGFzayIsImludGVydmFsIiwiZGVidWciLCJjb25zb2xlIiwibG9nIiwic2V0SW50ZXJ2YWwiLCJlcnJvciIsIm1lc3NhZ2UiLCJDb25maWd1cmUiLCJzZWxmIiwic2VuZFRpbWVvdXQiLCJFcnJvciIsIlNNUyIsInJlcXVpcmUiLCJzbXNTZW5kZXIiLCJBY2Nlc3NLZXlJZCIsImFjY2Vzc0tleUlkIiwiQWNjZXNzS2V5U2VjcmV0IiwiYWNjZXNzS2V5U2VjcmV0Iiwic2VuZFNNUyIsImNhdGNoIiwiZXJyIiwiX3F1ZXJ5U2VuZCIsIl9pZCIsInNlcnZlclNlbmQiLCJpc1NlbmRpbmciLCJzZW5kSW50ZXJ2YWwiLCJfZW5zdXJlSW5kZXgiLCJub3ciLCJ0aW1lb3V0QXQiLCJyZXNlcnZlZCIsInVwZGF0ZSIsIiRsdCIsIiRzZXQiLCJyZXN1bHQiLCJrZWVwU01TIiwicmVtb3ZlIiwic2VudEF0IiwiZW1pdCIsImJhdGNoU2l6ZSIsInNlbmRCYXRjaFNpemUiLCJwZW5kaW5nU01TIiwiZmluZCIsIiRhbmQiLCJzb3J0IiwibGltaXQiLCJmb3JFYWNoIiwic3RhcnR1cCIsInJlZiIsInJlZjEiLCJzbXNxdWV1ZV9pbnRlcnZhbCJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSxJQUFJQSxnQkFBSjtBQUFxQkMsTUFBTSxDQUFDQyxJQUFQLENBQVksb0NBQVosRUFBaUQ7QUFBQ0Ysa0JBQWdCLENBQUNHLENBQUQsRUFBRztBQUFDSCxvQkFBZ0IsR0FBQ0csQ0FBakI7QUFBbUI7O0FBQXhDLENBQWpELEVBQTJGLENBQTNGOztBQUlyQixJQUFJQyxNQUFNLENBQUNDLFFBQVAsSUFBbUJELE1BQU0sQ0FBQ0MsUUFBUCxDQUFnQkMsR0FBbkMsSUFBMENGLE1BQU0sQ0FBQ0MsUUFBUCxDQUFnQkMsR0FBaEIsQ0FBb0JDLE1BQWxFLEVBQTBFO0FBQ3pFUCxrQkFBZ0IsQ0FBQztBQUNoQix1QkFBbUI7QUFESCxHQUFELEVBRWIsa0JBRmEsQ0FBaEI7QUFHQSxDOzs7Ozs7Ozs7OztBQ1JEUSxRQUFRLEdBQUcsSUFBSUMsVUFBSixFQUFYLEM7Ozs7Ozs7Ozs7O0FDQUFELFFBQVEsQ0FBQ0UsVUFBVCxHQUFzQixJQUFJQyxLQUFLLENBQUNDLFVBQVYsQ0FBcUIsWUFBckIs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QUFnQkMsR0FBaEIsQ0FBb0JDLE1BQXBCLENBQTJCbUQ7QUFKNUMsS0FERCxDQ0NFO0FBT0Q7QURWSCxHIiwiZmlsZSI6Ii9wYWNrYWdlcy9zdGVlZG9zX3Ntc3F1ZXVlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtcclxuXHRjaGVja05wbVZlcnNpb25zXHJcbn0gZnJvbSAnbWV0ZW9yL3RtZWFzZGF5OmNoZWNrLW5wbS12ZXJzaW9ucyc7XHJcblxyXG5pZiAoTWV0ZW9yLnNldHRpbmdzICYmIE1ldGVvci5zZXR0aW5ncy5zbXMgJiYgTWV0ZW9yLnNldHRpbmdzLnNtcy5hbGl5dW4pIHtcclxuXHRjaGVja05wbVZlcnNpb25zKHtcclxuXHRcdFwiYWxpeXVuLXNtcy1ub2RlXCI6IFwiXjEuMS4yXCJcclxuXHR9LCAnc3RlZWRvczpzbXNxdWV1ZScpO1xyXG59IiwiU01TUXVldWUgPSBuZXcgRXZlbnRTdGF0ZSgpOyIsIlNNU1F1ZXVlLmNvbGxlY3Rpb24gPSBuZXcgTW9uZ28uQ29sbGVjdGlvbignX3Ntc19xdWV1ZScpO1xyXG5cclxudmFyIF92YWxpZGF0ZURvY3VtZW50ID0gZnVuY3Rpb24oc21zKSB7XHJcblxyXG5cdGNoZWNrKHNtcywge1xyXG5cdFx0c21zOiBPYmplY3QsXHJcblx0XHRzZW50OiBNYXRjaC5PcHRpb25hbChCb29sZWFuKSxcclxuXHRcdHNlbmRpbmc6IE1hdGNoLk9wdGlvbmFsKE1hdGNoLkludGVnZXIpLFxyXG5cdFx0Y3JlYXRlZEF0OiBEYXRlLFxyXG5cdFx0Y3JlYXRlZEJ5OiBNYXRjaC5PbmVPZihTdHJpbmcsIG51bGwpXHJcblx0fSk7XHJcblxyXG59O1xyXG5cclxuU01TUXVldWUuc2VuZCA9IGZ1bmN0aW9uKG9wdGlvbnMpIHtcclxuXHR2YXIgY3VycmVudFVzZXIgPSBNZXRlb3IuaXNDbGllbnQgJiYgTWV0ZW9yLnVzZXJJZCAmJiBNZXRlb3IudXNlcklkKCkgfHwgTWV0ZW9yLmlzU2VydmVyICYmIChvcHRpb25zLmNyZWF0ZWRCeSB8fCAnPFNFUlZFUj4nKSB8fCBudWxsXHJcblx0dmFyIHNtcyA9IF8uZXh0ZW5kKHtcclxuXHRcdGNyZWF0ZWRBdDogbmV3IERhdGUoKSxcclxuXHRcdGNyZWF0ZWRCeTogY3VycmVudFVzZXJcclxuXHR9KTtcclxuXHJcblx0aWYgKE1hdGNoLnRlc3Qob3B0aW9ucywgT2JqZWN0KSkge1xyXG5cdFx0c21zLnNtcyA9IF8ucGljayhvcHRpb25zLCAnRm9ybWF0JywgJ0FjdGlvbicsICdQYXJhbVN0cmluZycsICdSZWNOdW0nLCAnU2lnbk5hbWUnLCAnVGVtcGxhdGVDb2RlJywgJ21zZycpO1xyXG5cdH1cclxuXHJcblx0c21zLnNlbnQgPSBmYWxzZTtcclxuXHRzbXMuc2VuZGluZyA9IDA7XHJcblxyXG5cdF92YWxpZGF0ZURvY3VtZW50KHNtcyk7XHJcblxyXG5cdHJldHVybiBTTVNRdWV1ZS5jb2xsZWN0aW9uLmluc2VydChzbXMpO1xyXG59OyIsInZhciBpc0NvbmZpZ3VyZWQgPSBmYWxzZTtcclxudmFyIHNlbmRXb3JrZXIgPSBmdW5jdGlvbih0YXNrLCBpbnRlcnZhbCkge1xyXG5cclxuXHRpZiAoU01TUXVldWUuZGVidWcpIHtcclxuXHRcdGNvbnNvbGUubG9nKCdTTVNRdWV1ZTogU2VuZCB3b3JrZXIgc3RhcnRlZCwgdXNpbmcgaW50ZXJ2YWw6ICcgKyBpbnRlcnZhbCk7XHJcblx0fVxyXG5cclxuXHRyZXR1cm4gTWV0ZW9yLnNldEludGVydmFsKGZ1bmN0aW9uKCkge1xyXG5cdFx0dHJ5IHtcclxuXHRcdFx0dGFzaygpO1xyXG5cdFx0fSBjYXRjaCAoZXJyb3IpIHtcclxuXHRcdFx0aWYgKFNNU1F1ZXVlLmRlYnVnKSB7XHJcblx0XHRcdFx0Y29uc29sZS5sb2coJ1NNU1F1ZXVlOiBFcnJvciB3aGlsZSBzZW5kaW5nOiAnICsgZXJyb3IubWVzc2FnZSk7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHR9LCBpbnRlcnZhbCk7XHJcbn07XHJcblxyXG5cclxuXHJcbi8qXHJcblx0b3B0aW9uczoge1xyXG5cdFx0Ly8gQ29udHJvbHMgdGhlIHNlbmRpbmcgaW50ZXJ2YWxcclxuXHRcdHNlbmRJbnRlcnZhbDogTWF0Y2guT3B0aW9uYWwoTnVtYmVyKSxcclxuXHRcdC8vIENvbnRyb2xzIHRoZSBzZW5kaW5nIGJhdGNoIHNpemUgcGVyIGludGVydmFsXHJcblx0XHRzZW5kQmF0Y2hTaXplOiBNYXRjaC5PcHRpb25hbChOdW1iZXIpLFxyXG5cdFx0Ly8gQWxsb3cgb3B0aW9uYWwga2VlcGluZyBub3RpZmljYXRpb25zIGluIGNvbGxlY3Rpb25cclxuXHRcdGtlZXBTTVM6IE1hdGNoLk9wdGlvbmFsKEJvb2xlYW4pXHJcblx0fVxyXG4qL1xyXG5TTVNRdWV1ZS5Db25maWd1cmUgPSBmdW5jdGlvbihvcHRpb25zKSB7XHJcblx0dmFyIHNlbGYgPSB0aGlzO1xyXG5cdG9wdGlvbnMgPSBfLmV4dGVuZCh7XHJcblx0XHRzZW5kVGltZW91dDogNjAwMDAsIC8vIFRpbWVvdXQgcGVyaW9kIGZvciBzbXMgc2VuZFxyXG5cdH0sIG9wdGlvbnMpO1xyXG5cclxuXHQvLyBCbG9jayBtdWx0aXBsZSBjYWxsc1xyXG5cdGlmIChpc0NvbmZpZ3VyZWQpIHtcclxuXHRcdHRocm93IG5ldyBFcnJvcignU01TUXVldWUuQ29uZmlndXJlIHNob3VsZCBub3QgYmUgY2FsbGVkIG1vcmUgdGhhbiBvbmNlIScpO1xyXG5cdH1cclxuXHJcblx0aXNDb25maWd1cmVkID0gdHJ1ZTtcclxuXHJcblx0Ly8gQWRkIGRlYnVnIGluZm9cclxuXHRpZiAoU01TUXVldWUuZGVidWcpIHtcclxuXHRcdGNvbnNvbGUubG9nKCdTTVNRdWV1ZS5Db25maWd1cmUnLCBvcHRpb25zKTtcclxuXHR9XHJcblxyXG5cdHZhciBTTVMgPSByZXF1aXJlKCdhbGl5dW4tc21zLW5vZGUnKSxcclxuXHRzbXNTZW5kZXI7XHJcblxyXG5cdHNtc1NlbmRlciA9IG5ldyBTTVMoe1xyXG5cdFx0QWNjZXNzS2V5SWQ6IG9wdGlvbnMuYWNjZXNzS2V5SWQsXHJcblx0XHRBY2Nlc3NLZXlTZWNyZXQ6IG9wdGlvbnMuYWNjZXNzS2V5U2VjcmV0XHJcblx0fSk7XHJcblxyXG5cdHNlbGYuc2VuZFNNUyA9IGZ1bmN0aW9uKHNtcykge1xyXG5cdFx0aWYgKFNNU1F1ZXVlLmRlYnVnKSB7XHJcblx0XHRcdGNvbnNvbGUubG9nKFwic2VuZFNNU1wiKTtcclxuXHRcdFx0Y29uc29sZS5sb2coc21zKTtcclxuXHRcdH1cclxuXHJcblx0XHRzbXNTZW5kZXIuc2VuZChzbXMuc21zKS5jYXRjaChlcnIgPT4ge1xyXG5cdFx0XHRjb25zb2xlLmVycm9yKGVycilcclxuXHRcdH0pO1xyXG5cdH1cclxuXHJcblx0Ly8gVW5pdmVyc2FsIHNlbmQgZnVuY3Rpb25cclxuXHR2YXIgX3F1ZXJ5U2VuZCA9IGZ1bmN0aW9uKG9wdGlvbnMpIHtcclxuXHJcblx0XHRpZiAoc2VsZi5zZW5kU01TKSB7XHJcblx0XHRcdHNlbGYuc2VuZFNNUyhvcHRpb25zKTtcclxuXHRcdH1cclxuXHJcblx0XHRyZXR1cm4ge1xyXG5cdFx0XHRzbXM6IFtvcHRpb25zLl9pZF1cclxuXHRcdH07XHJcblx0fTtcclxuXHJcblx0c2VsZi5zZXJ2ZXJTZW5kID0gZnVuY3Rpb24ob3B0aW9ucykge1xyXG5cdFx0b3B0aW9ucyA9IG9wdGlvbnMgfHwge307XHJcblx0XHRyZXR1cm4gX3F1ZXJ5U2VuZChvcHRpb25zKTtcclxuXHR9O1xyXG5cclxuXHJcblx0Ly8gVGhpcyBpbnRlcnZhbCB3aWxsIGFsbG93IG9ubHkgb25lIHNtcyB0byBiZSBzZW50IGF0IGEgdGltZSwgaXRcclxuXHQvLyB3aWxsIGNoZWNrIGZvciBuZXcgc21zIGF0IGV2ZXJ5IGBvcHRpb25zLnNlbmRJbnRlcnZhbGBcclxuXHQvLyAoZGVmYXVsdCBpbnRlcnZhbCBpcyAxNTAwMCBtcylcclxuXHQvL1xyXG5cdC8vIEl0IGxvb2tzIGluIHNtcyBjb2xsZWN0aW9uIHRvIHNlZSBpZiB0aGVyZXMgYW55IHBlbmRpbmdcclxuXHQvLyBzbXMsIGlmIHNvIGl0IHdpbGwgdHJ5IHRvIHJlc2VydmUgdGhlIHBlbmRpbmcgc21zLlxyXG5cdC8vIElmIHN1Y2Nlc3NmdWxseSByZXNlcnZlZCB0aGUgc2VuZCBpcyBzdGFydGVkLlxyXG5cdC8vXHJcblx0Ly8gSWYgc21zLnF1ZXJ5IGlzIHR5cGUgc3RyaW5nLCBpdCdzIGFzc3VtZWQgdG8gYmUgYSBqc29uIHN0cmluZ1xyXG5cdC8vIHZlcnNpb24gb2YgdGhlIHF1ZXJ5IHNlbGVjdG9yLiBNYWtpbmcgaXQgYWJsZSB0byBjYXJyeSBgJGAgcHJvcGVydGllcyBpblxyXG5cdC8vIHRoZSBtb25nbyBjb2xsZWN0aW9uLlxyXG5cdC8vXHJcblx0Ly8gUHIuIGRlZmF1bHQgc21zIGFyZSByZW1vdmVkIGZyb20gdGhlIGNvbGxlY3Rpb24gYWZ0ZXIgc2VuZCBoYXZlXHJcblx0Ly8gY29tcGxldGVkLiBTZXR0aW5nIGBvcHRpb25zLmtlZXBTTVNgIHdpbGwgdXBkYXRlIGFuZCBrZWVwIHRoZVxyXG5cdC8vIHNtcyBlZy4gaWYgbmVlZGVkIGZvciBoaXN0b3JpY2FsIHJlYXNvbnMuXHJcblx0Ly9cclxuXHQvLyBBZnRlciB0aGUgc2VuZCBoYXZlIGNvbXBsZXRlZCBhIFwic2VuZFwiIGV2ZW50IHdpbGwgYmUgZW1pdHRlZCB3aXRoIGFcclxuXHQvLyBzdGF0dXMgb2JqZWN0IGNvbnRhaW5pbmcgc21zIGlkIGFuZCB0aGUgc2VuZCByZXN1bHQgb2JqZWN0LlxyXG5cdC8vXHJcblx0dmFyIGlzU2VuZGluZyA9IGZhbHNlO1xyXG5cclxuXHRpZiAob3B0aW9ucy5zZW5kSW50ZXJ2YWwgIT09IG51bGwpIHtcclxuXHJcblx0XHQvLyBUaGlzIHdpbGwgcmVxdWlyZSBpbmRleCBzaW5jZSB3ZSBzb3J0IHNtcyBieSBjcmVhdGVkQXRcclxuXHRcdFNNU1F1ZXVlLmNvbGxlY3Rpb24uX2Vuc3VyZUluZGV4KHtcclxuXHRcdFx0Y3JlYXRlZEF0OiAxXHJcblx0XHR9KTtcclxuXHRcdFNNU1F1ZXVlLmNvbGxlY3Rpb24uX2Vuc3VyZUluZGV4KHtcclxuXHRcdFx0c2VudDogMVxyXG5cdFx0fSk7XHJcblx0XHRTTVNRdWV1ZS5jb2xsZWN0aW9uLl9lbnN1cmVJbmRleCh7XHJcblx0XHRcdHNlbmRpbmc6IDFcclxuXHRcdH0pO1xyXG5cclxuXHJcblx0XHR2YXIgc2VuZFNNUyA9IGZ1bmN0aW9uKHNtcykge1xyXG5cdFx0XHQvLyBSZXNlcnZlIHNtc1xyXG5cdFx0XHR2YXIgbm93ID0gK25ldyBEYXRlKCk7XHJcblx0XHRcdHZhciB0aW1lb3V0QXQgPSBub3cgKyBvcHRpb25zLnNlbmRUaW1lb3V0O1xyXG5cdFx0XHR2YXIgcmVzZXJ2ZWQgPSBTTVNRdWV1ZS5jb2xsZWN0aW9uLnVwZGF0ZSh7XHJcblx0XHRcdFx0X2lkOiBzbXMuX2lkLFxyXG5cdFx0XHRcdHNlbnQ6IGZhbHNlLCAvLyB4eHg6IG5lZWQgdG8gbWFrZSBzdXJlIHRoaXMgaXMgc2V0IG9uIGNyZWF0ZVxyXG5cdFx0XHRcdHNlbmRpbmc6IHtcclxuXHRcdFx0XHRcdCRsdDogbm93XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9LCB7XHJcblx0XHRcdFx0JHNldDoge1xyXG5cdFx0XHRcdFx0c2VuZGluZzogdGltZW91dEF0LFxyXG5cdFx0XHRcdH1cclxuXHRcdFx0fSk7XHJcblxyXG5cdFx0XHQvLyBNYWtlIHN1cmUgd2Ugb25seSBoYW5kbGUgc21zIHJlc2VydmVkIGJ5IHRoaXNcclxuXHRcdFx0Ly8gaW5zdGFuY2VcclxuXHRcdFx0aWYgKHJlc2VydmVkKSB7XHJcblxyXG5cdFx0XHRcdC8vIFNlbmQgdGhlIHNtc1xyXG5cdFx0XHRcdHZhciByZXN1bHQgPSBTTVNRdWV1ZS5zZXJ2ZXJTZW5kKHNtcyk7XHJcblxyXG5cdFx0XHRcdGlmICghb3B0aW9ucy5rZWVwU01TKSB7XHJcblx0XHRcdFx0XHQvLyBQci4gRGVmYXVsdCB3ZSB3aWxsIHJlbW92ZSBzbXNcclxuXHRcdFx0XHRcdFNNU1F1ZXVlLmNvbGxlY3Rpb24ucmVtb3ZlKHtcclxuXHRcdFx0XHRcdFx0X2lkOiBzbXMuX2lkXHJcblx0XHRcdFx0XHR9KTtcclxuXHRcdFx0XHR9IGVsc2Uge1xyXG5cclxuXHRcdFx0XHRcdC8vIFVwZGF0ZSB0aGUgc21zXHJcblx0XHRcdFx0XHRTTVNRdWV1ZS5jb2xsZWN0aW9uLnVwZGF0ZSh7XHJcblx0XHRcdFx0XHRcdF9pZDogc21zLl9pZFxyXG5cdFx0XHRcdFx0fSwge1xyXG5cdFx0XHRcdFx0XHQkc2V0OiB7XHJcblx0XHRcdFx0XHRcdFx0Ly8gTWFyayBhcyBzZW50XHJcblx0XHRcdFx0XHRcdFx0c2VudDogdHJ1ZSxcclxuXHRcdFx0XHRcdFx0XHQvLyBTZXQgdGhlIHNlbnQgZGF0ZVxyXG5cdFx0XHRcdFx0XHRcdHNlbnRBdDogbmV3IERhdGUoKSxcclxuXHRcdFx0XHRcdFx0XHQvLyBOb3QgYmVpbmcgc2VudCBhbnltb3JlXHJcblx0XHRcdFx0XHRcdFx0c2VuZGluZzogMFxyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHR9KTtcclxuXHJcblx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHQvLyBFbWl0IHRoZSBzZW5kXHJcblx0XHRcdFx0c2VsZi5lbWl0KCdzZW5kJywge1xyXG5cdFx0XHRcdFx0c21zOiBzbXMuX2lkLFxyXG5cdFx0XHRcdFx0cmVzdWx0OiByZXN1bHRcclxuXHRcdFx0XHR9KTtcclxuXHJcblx0XHRcdH0gLy8gRWxzZSBjb3VsZCBub3QgcmVzZXJ2ZVxyXG5cdFx0fTsgLy8gRU8gc2VuZFNNU1xyXG5cclxuXHRcdHNlbmRXb3JrZXIoZnVuY3Rpb24oKSB7XHJcblxyXG5cdFx0XHRpZiAoaXNTZW5kaW5nKSB7XHJcblx0XHRcdFx0cmV0dXJuO1xyXG5cdFx0XHR9XHJcblx0XHRcdC8vIFNldCBzZW5kIGZlbmNlXHJcblx0XHRcdGlzU2VuZGluZyA9IHRydWU7XHJcblxyXG5cdFx0XHR2YXIgYmF0Y2hTaXplID0gb3B0aW9ucy5zZW5kQmF0Y2hTaXplIHx8IDE7XHJcblxyXG5cdFx0XHR2YXIgbm93ID0gK25ldyBEYXRlKCk7XHJcblxyXG5cdFx0XHQvLyBGaW5kIHNtcyB0aGF0IGFyZSBub3QgYmVpbmcgb3IgYWxyZWFkeSBzZW50XHJcblx0XHRcdHZhciBwZW5kaW5nU01TID0gU01TUXVldWUuY29sbGVjdGlvbi5maW5kKHtcclxuXHRcdFx0XHQkYW5kOiBbXHJcblx0XHRcdFx0XHQvLyBNZXNzYWdlIGlzIG5vdCBzZW50XHJcblx0XHRcdFx0XHR7XHJcblx0XHRcdFx0XHRcdHNlbnQ6IGZhbHNlXHJcblx0XHRcdFx0XHR9LFxyXG5cdFx0XHRcdFx0Ly8gQW5kIG5vdCBiZWluZyBzZW50IGJ5IG90aGVyIGluc3RhbmNlc1xyXG5cdFx0XHRcdFx0e1xyXG5cdFx0XHRcdFx0XHRzZW5kaW5nOiB7XHJcblx0XHRcdFx0XHRcdFx0JGx0OiBub3dcclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdF1cclxuXHRcdFx0fSwge1xyXG5cdFx0XHRcdC8vIFNvcnQgYnkgY3JlYXRlZCBkYXRlXHJcblx0XHRcdFx0c29ydDoge1xyXG5cdFx0XHRcdFx0Y3JlYXRlZEF0OiAxXHJcblx0XHRcdFx0fSxcclxuXHRcdFx0XHRsaW1pdDogYmF0Y2hTaXplXHJcblx0XHRcdH0pO1xyXG5cclxuXHRcdFx0cGVuZGluZ1NNUy5mb3JFYWNoKGZ1bmN0aW9uKHNtcykge1xyXG5cdFx0XHRcdHRyeSB7XHJcblx0XHRcdFx0XHRzZW5kU01TKHNtcyk7XHJcblx0XHRcdFx0fSBjYXRjaCAoZXJyb3IpIHtcclxuXHJcblx0XHRcdFx0XHRpZiAoU01TUXVldWUuZGVidWcpIHtcclxuXHRcdFx0XHRcdFx0Y29uc29sZS5sb2coJ1NNU1F1ZXVlOiBDb3VsZCBub3Qgc2VuZCBzbXMgaWQ6IFwiJyArIHNtcy5faWQgKyAnXCIsIEVycm9yOiAnICsgZXJyb3IubWVzc2FnZSk7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9KTsgLy8gRU8gZm9yRWFjaFxyXG5cclxuXHRcdFx0Ly8gUmVtb3ZlIHRoZSBzZW5kIGZlbmNlXHJcblx0XHRcdGlzU2VuZGluZyA9IGZhbHNlO1xyXG5cdFx0fSwgb3B0aW9ucy5zZW5kSW50ZXJ2YWwgfHwgMTUwMDApOyAvLyBEZWZhdWx0IGV2ZXJ5IDE1dGggc2VjXHJcblxyXG5cdH0gZWxzZSB7XHJcblx0XHRpZiAoU01TUXVldWUuZGVidWcpIHtcclxuXHRcdFx0Y29uc29sZS5sb2coJ1NNU1F1ZXVlOiBTZW5kIHNlcnZlciBpcyBkaXNhYmxlZCcpO1xyXG5cdFx0fVxyXG5cdH1cclxuXHJcbn07IiwiTWV0ZW9yLnN0YXJ0dXAgLT5cclxuXHRpZiBNZXRlb3Iuc2V0dGluZ3Muc21zPy5hbGl5dW4/LnNtc3F1ZXVlX2ludGVydmFsXHJcblx0XHRTTVNRdWV1ZS5Db25maWd1cmVcclxuXHRcdFx0c2VuZEludGVydmFsOiBNZXRlb3Iuc2V0dGluZ3Muc21zLmFsaXl1bi5zbXNxdWV1ZV9pbnRlcnZhbFxyXG5cdFx0XHRzZW5kQmF0Y2hTaXplOiAxMFxyXG5cdFx0XHRrZWVwU01TOiB0cnVlXHJcblx0XHRcdGFjY2Vzc0tleUlkOiBNZXRlb3Iuc2V0dGluZ3Muc21zLmFsaXl1bi5hY2Nlc3NLZXlJZFxyXG5cdFx0XHRhY2Nlc3NLZXlTZWNyZXQ6IE1ldGVvci5zZXR0aW5ncy5zbXMuYWxpeXVuLmFjY2Vzc0tleVNlY3JldFxyXG4iLCJNZXRlb3Iuc3RhcnR1cChmdW5jdGlvbigpIHtcbiAgdmFyIHJlZiwgcmVmMTtcbiAgaWYgKChyZWYgPSBNZXRlb3Iuc2V0dGluZ3Muc21zKSAhPSBudWxsID8gKHJlZjEgPSByZWYuYWxpeXVuKSAhPSBudWxsID8gcmVmMS5zbXNxdWV1ZV9pbnRlcnZhbCA6IHZvaWQgMCA6IHZvaWQgMCkge1xuICAgIHJldHVybiBTTVNRdWV1ZS5Db25maWd1cmUoe1xuICAgICAgc2VuZEludGVydmFsOiBNZXRlb3Iuc2V0dGluZ3Muc21zLmFsaXl1bi5zbXNxdWV1ZV9pbnRlcnZhbCxcbiAgICAgIHNlbmRCYXRjaFNpemU6IDEwLFxuICAgICAga2VlcFNNUzogdHJ1ZSxcbiAgICAgIGFjY2Vzc0tleUlkOiBNZXRlb3Iuc2V0dGluZ3Muc21zLmFsaXl1bi5hY2Nlc3NLZXlJZCxcbiAgICAgIGFjY2Vzc0tleVNlY3JldDogTWV0ZW9yLnNldHRpbmdzLnNtcy5hbGl5dW4uYWNjZXNzS2V5U2VjcmV0XG4gICAgfSk7XG4gIH1cbn0pO1xuIl19
