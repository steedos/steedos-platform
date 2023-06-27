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
var CollectionHooks = Package['matb33:collection-hooks'].CollectionHooks;
var meteorInstall = Package.modules.meteorInstall;
var Promise = Package.promise.Promise;

/* Package-scope variables */
var SMSQueue, WebServiceSMSQueue, __coffeescriptShare;

var require = meteorInstall({"node_modules":{"meteor":{"steedos:smsqueue":{"checkNpm.js":function module(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                //
// packages/steedos_smsqueue/checkNpm.js                                                                          //
//                                                                                                                //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
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
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"lib":{"common":{"main.js":function module(){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                //
// packages/steedos_smsqueue/lib/common/main.js                                                                   //
//                                                                                                                //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                  //
SMSQueue = new EventState();
WebServiceSMSQueue = new EventState();
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"sms.js":function module(){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                //
// packages/steedos_smsqueue/lib/common/sms.js                                                                    //
//                                                                                                                //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                  //
SMSQueue.collection = new Meteor.Collection('_sms_queue');
WebServiceSMSQueue.collection = SMSQueue.collection;

var _validateDocument = function (sms) {
  check(sms, {
    sms: Object,
    sent: Match.Optional(Boolean),
    sending: Match.Optional(Match.Integer),
    createdAt: Date,
    createdBy: Match.OneOf(String, null)
  });
};

SMSQueue.send = function (options, spaceId) {
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

  if (options.createdBy) {
    sms.owner = options.createdBy;
  }

  if (spaceId) {
    sms.space = spaceId;
  }

  return SMSQueue.collection.insert(sms);
};
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}},"server":{"api.js":function module(require){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                //
// packages/steedos_smsqueue/lib/server/api.js                                                                    //
//                                                                                                                //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                  //
const {
  t
} = require('@steedos/i18n');

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
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"webservice.js":function module(require){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                //
// packages/steedos_smsqueue/lib/server/webservice.js                                                             //
//                                                                                                                //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                  //
var isConfigured = false;

var request = require('superagent');

var sendWorker = function (task, interval) {
  if (WebServiceSMSQueue.debug) {
    console.log('WebServiceSMSQueue: Send worker started, using interval: ' + interval);
  }

  return Meteor.setInterval(function () {
    try {
      task();
    } catch (error) {
      if (WebServiceSMSQueue.debug) {
        console.log('WebServiceSMSQueue: Error while sending: ' + error.message);
      }
    }
  }, interval);
};

var sendToWebService = function (doc, url, spaceToken, signname) {
  var message = _.clone(doc);

  message.signname = signname;
  delete message._id;
  request.post(url).send(message).set('Authorization', 'Bearer ' + spaceToken).end(function (err, res) {
    if (err) {
      return console.error(err);
    }
  });
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


WebServiceSMSQueue.Configure = function (options) {
  var self = this;
  options = _.extend({
    sendTimeout: 60000 // Timeout period for sms send

  }, options); // Block multiple calls

  if (isConfigured) {
    throw new Error('WebServiceSMSQueue.Configure should not be called more than once!');
  }

  isConfigured = true; // Add debug info

  if (WebServiceSMSQueue.debug) {
    console.log('WebServiceSMSQueue.Configure', options);
  }

  var url = options.url;
  var spaceToken = options.spaceToken;
  var signname = options.signname;

  self.sendSMS = function (sms) {
    if (WebServiceSMSQueue.debug) {
      console.log("sendSMS");
      console.log(sms);
    }

    sendToWebService(sms, url, spaceToken, signname);
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
    WebServiceSMSQueue.collection._ensureIndex({
      createdAt: 1
    });

    WebServiceSMSQueue.collection._ensureIndex({
      sent: 1
    });

    WebServiceSMSQueue.collection._ensureIndex({
      sending: 1
    });

    var sendSMS = function (sms) {
      // Reserve sms
      var now = +new Date();
      var timeoutAt = now + options.sendTimeout;
      var reserved = WebServiceSMSQueue.collection.update({
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
        var result = WebServiceSMSQueue.serverSend(sms);

        if (!options.keepSMS) {
          // Pr. Default we will remove sms
          WebServiceSMSQueue.collection.remove({
            _id: sms._id
          });
        } else {
          // Update the sms
          WebServiceSMSQueue.collection.update({
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

      var pendingSMS = WebServiceSMSQueue.collection.find({
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
          if (WebServiceSMSQueue.debug) {
            console.log('WebServiceSMSQueue: Could not send sms id: "' + sms._id + '", Error: ' + error.message);
          }
        }
      }); // EO forEach
      // Remove the send fence

      isSending = false;
    }, options.sendInterval || 15000); // Default every 15th sec
  } else {
    if (WebServiceSMSQueue.debug) {
      console.log('WebServiceSMSQueue: Send server is disabled');
    }
  }
};
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}}},"server":{"startup.coffee":function module(){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                //
// packages/steedos_smsqueue/server/startup.coffee                                                                //
//                                                                                                                //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                  //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
Meteor.startup(function () {
  var ref, ref1, ref2, ref3, ref4, ref5, ref6, ref7, ref8, ref9;

  if (((ref = Meteor.settings.sms) != null ? (ref1 = ref.webservice) != null ? ref1.smsqueue_interval : void 0 : void 0) && (((ref2 = Meteor.settings.sms) != null ? (ref3 = ref2.aliyun) != null ? ref3.smsqueue_interval : void 0 : void 0) || ((ref4 = Meteor.settings.sms) != null ? (ref5 = ref4.qcloud) != null ? ref5.smsqueue_interval : void 0 : void 0))) {
    throw new Meteor.Error('sms.webservice cannot be configured with sms.aliyun or sms.qcloud');
  }

  if ((ref6 = Meteor.settings.sms) != null ? (ref7 = ref6.aliyun) != null ? ref7.smsqueue_interval : void 0 : void 0) {
    SMSQueue.Configure({
      sendInterval: Meteor.settings.sms.aliyun.smsqueue_interval,
      sendBatchSize: 10,
      keepSMS: true,
      accessKeyId: Meteor.settings.sms.aliyun.accessKeyId,
      accessKeySecret: Meteor.settings.sms.aliyun.accessKeySecret
    });
  }

  if ((ref8 = Meteor.settings.sms) != null ? (ref9 = ref8.webservice) != null ? ref9.smsqueue_interval : void 0 : void 0) {
    return WebServiceSMSQueue.Configure({
      sendInterval: Meteor.settings.sms.webservice.smsqueue_interval,
      url: Meteor.settings.sms.webservice.url,
      spaceToken: Meteor.settings.sms.webservice.space_token,
      signname: Meteor.settings.sms.webservice.signname,
      sendBatchSize: 10,
      keepSMS: true
    });
  }
});
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

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
require("/node_modules/meteor/steedos:smsqueue/lib/server/webservice.js");
require("/node_modules/meteor/steedos:smsqueue/server/startup.coffee");

/* Exports */
Package._define("steedos:smsqueue", {
  SMSQueue: SMSQueue
});

})();

//# sourceURL=meteor://💻app/packages/steedos_smsqueue.js
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvczpzbXNxdWV1ZS9jaGVja05wbS5qcyIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvczpzbXNxdWV1ZS9saWIvY29tbW9uL21haW4uanMiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3M6c21zcXVldWUvbGliL2NvbW1vbi9zbXMuanMiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3M6c21zcXVldWUvbGliL3NlcnZlci9hcGkuanMiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3M6c21zcXVldWUvbGliL3NlcnZlci93ZWJzZXJ2aWNlLmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zX3Ntc3F1ZXVlL3NlcnZlci9zdGFydHVwLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvc2VydmVyL3N0YXJ0dXAuY29mZmVlIl0sIm5hbWVzIjpbImNoZWNrTnBtVmVyc2lvbnMiLCJtb2R1bGUiLCJsaW5rIiwidiIsIk1ldGVvciIsInNldHRpbmdzIiwic21zIiwiYWxpeXVuIiwiU01TUXVldWUiLCJFdmVudFN0YXRlIiwiV2ViU2VydmljZVNNU1F1ZXVlIiwiY29sbGVjdGlvbiIsIkNvbGxlY3Rpb24iLCJfdmFsaWRhdGVEb2N1bWVudCIsImNoZWNrIiwiT2JqZWN0Iiwic2VudCIsIk1hdGNoIiwiT3B0aW9uYWwiLCJCb29sZWFuIiwic2VuZGluZyIsIkludGVnZXIiLCJjcmVhdGVkQXQiLCJEYXRlIiwiY3JlYXRlZEJ5IiwiT25lT2YiLCJTdHJpbmciLCJzZW5kIiwib3B0aW9ucyIsInNwYWNlSWQiLCJjdXJyZW50VXNlciIsImlzQ2xpZW50IiwidXNlcklkIiwiaXNTZXJ2ZXIiLCJfIiwiZXh0ZW5kIiwidGVzdCIsInBpY2siLCJvd25lciIsInNwYWNlIiwiaW5zZXJ0IiwidCIsInJlcXVpcmUiLCJpc0NvbmZpZ3VyZWQiLCJzZW5kV29ya2VyIiwidGFzayIsImludGVydmFsIiwiZGVidWciLCJjb25zb2xlIiwibG9nIiwic2V0SW50ZXJ2YWwiLCJlcnJvciIsIm1lc3NhZ2UiLCJDb25maWd1cmUiLCJzZWxmIiwic2VuZFRpbWVvdXQiLCJFcnJvciIsIlNNUyIsInNtc1NlbmRlciIsIkFjY2Vzc0tleUlkIiwiYWNjZXNzS2V5SWQiLCJBY2Nlc3NLZXlTZWNyZXQiLCJhY2Nlc3NLZXlTZWNyZXQiLCJzZW5kU01TIiwiY2F0Y2giLCJlcnIiLCJfcXVlcnlTZW5kIiwiX2lkIiwic2VydmVyU2VuZCIsImlzU2VuZGluZyIsInNlbmRJbnRlcnZhbCIsIl9lbnN1cmVJbmRleCIsIm5vdyIsInRpbWVvdXRBdCIsInJlc2VydmVkIiwidXBkYXRlIiwiJGx0IiwiJHNldCIsInJlc3VsdCIsImtlZXBTTVMiLCJyZW1vdmUiLCJzZW50QXQiLCJlbWl0IiwiYmF0Y2hTaXplIiwic2VuZEJhdGNoU2l6ZSIsInBlbmRpbmdTTVMiLCJmaW5kIiwiJGFuZCIsInNvcnQiLCJsaW1pdCIsImZvckVhY2giLCJyZXF1ZXN0Iiwic2VuZFRvV2ViU2VydmljZSIsImRvYyIsInVybCIsInNwYWNlVG9rZW4iLCJzaWdubmFtZSIsImNsb25lIiwicG9zdCIsInNldCIsImVuZCIsInJlcyIsInN0YXJ0dXAiLCJyZWYiLCJyZWYxIiwicmVmMiIsInJlZjMiLCJyZWY0IiwicmVmNSIsInJlZjYiLCJyZWY3IiwicmVmOCIsInJlZjkiLCJ3ZWJzZXJ2aWNlIiwic21zcXVldWVfaW50ZXJ2YWwiLCJxY2xvdWQiLCJzcGFjZV90b2tlbiJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUEsSUFBSUEsZ0JBQUo7QUFBcUJDLE1BQU0sQ0FBQ0MsSUFBUCxDQUFZLG9DQUFaLEVBQWlEO0FBQUNGLGtCQUFnQixDQUFDRyxDQUFELEVBQUc7QUFBQ0gsb0JBQWdCLEdBQUNHLENBQWpCO0FBQW1COztBQUF4QyxDQUFqRCxFQUEyRixDQUEzRjs7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Z0JDLEdBQWhCLENBQW9CQyxNQUFwQixDQUEyQnFELFdBSHhDO0FBSUFFLHVCQUFpQjFELE9BQU9DLFFBQVAsQ0FBZ0JDLEdBQWhCLENBQW9CQyxNQUFwQixDQUEyQnVEO0FBSjVDLEtBREQ7QUNRQzs7QURERixPQUFBaUQsT0FBQTNHLE9BQUFDLFFBQUEsQ0FBQUMsR0FBQSxhQUFBMEcsT0FBQUQsS0FBQUUsVUFBQSxZQUFBRCxLQUFvQ0UsaUJBQXBDLEdBQW9DLE1BQXBDLEdBQW9DLE1BQXBDO0FDR0csV0RGRnhHLG1CQUFtQjJDLFNBQW5CLENBQ0M7QUFBQWlCLG9CQUFjbEUsT0FBT0MsUUFBUCxDQUFnQkMsR0FBaEIsQ0FBb0IyRyxVQUFwQixDQUErQkMsaUJBQTdDO0FBQ0FwQixXQUFLMUYsT0FBT0MsUUFBUCxDQUFnQkMsR0FBaEIsQ0FBb0IyRyxVQUFwQixDQUErQm5CLEdBRHBDO0FBRUFDLGtCQUFZM0YsT0FBT0MsUUFBUCxDQUFnQkMsR0FBaEIsQ0FBb0IyRyxVQUFwQixDQUErQkcsV0FGM0M7QUFHQXBCLGdCQUFVNUYsT0FBT0MsUUFBUCxDQUFnQkMsR0FBaEIsQ0FBb0IyRyxVQUFwQixDQUErQmpCLFFBSHpDO0FBSUFaLHFCQUFlLEVBSmY7QUFLQUwsZUFBUztBQUxULEtBREQsQ0NFRTtBQVFEO0FEdkJILEciLCJmaWxlIjoiL3BhY2thZ2VzL3N0ZWVkb3Nfc21zcXVldWUuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge1xuXHRjaGVja05wbVZlcnNpb25zXG59IGZyb20gJ21ldGVvci90bWVhc2RheTpjaGVjay1ucG0tdmVyc2lvbnMnO1xuXG5pZiAoTWV0ZW9yLnNldHRpbmdzICYmIE1ldGVvci5zZXR0aW5ncy5zbXMgJiYgTWV0ZW9yLnNldHRpbmdzLnNtcy5hbGl5dW4pIHtcblx0Y2hlY2tOcG1WZXJzaW9ucyh7XG5cdFx0XCJhbGl5dW4tc21zLW5vZGVcIjogXCJeMS4xLjJcIlxuXHR9LCAnc3RlZWRvczpzbXNxdWV1ZScpO1xufSIsIlNNU1F1ZXVlID0gbmV3IEV2ZW50U3RhdGUoKTtcbldlYlNlcnZpY2VTTVNRdWV1ZSA9IG5ldyBFdmVudFN0YXRlKCk7IiwiU01TUXVldWUuY29sbGVjdGlvbiA9IG5ldyBNZXRlb3IuQ29sbGVjdGlvbignX3Ntc19xdWV1ZScpO1xuV2ViU2VydmljZVNNU1F1ZXVlLmNvbGxlY3Rpb24gPSBTTVNRdWV1ZS5jb2xsZWN0aW9uO1xudmFyIF92YWxpZGF0ZURvY3VtZW50ID0gZnVuY3Rpb24oc21zKSB7XG5cblx0Y2hlY2soc21zLCB7XG5cdFx0c21zOiBPYmplY3QsXG5cdFx0c2VudDogTWF0Y2guT3B0aW9uYWwoQm9vbGVhbiksXG5cdFx0c2VuZGluZzogTWF0Y2guT3B0aW9uYWwoTWF0Y2guSW50ZWdlciksXG5cdFx0Y3JlYXRlZEF0OiBEYXRlLFxuXHRcdGNyZWF0ZWRCeTogTWF0Y2guT25lT2YoU3RyaW5nLCBudWxsKVxuXHR9KTtcblxufTtcblxuU01TUXVldWUuc2VuZCA9IGZ1bmN0aW9uKG9wdGlvbnMsIHNwYWNlSWQpIHtcblx0dmFyIGN1cnJlbnRVc2VyID0gTWV0ZW9yLmlzQ2xpZW50ICYmIE1ldGVvci51c2VySWQgJiYgTWV0ZW9yLnVzZXJJZCgpIHx8IE1ldGVvci5pc1NlcnZlciAmJiAob3B0aW9ucy5jcmVhdGVkQnkgfHwgJzxTRVJWRVI+JykgfHwgbnVsbFxuXHR2YXIgc21zID0gXy5leHRlbmQoe1xuXHRcdGNyZWF0ZWRBdDogbmV3IERhdGUoKSxcblx0XHRjcmVhdGVkQnk6IGN1cnJlbnRVc2VyXG5cdH0pO1xuXG5cdGlmIChNYXRjaC50ZXN0KG9wdGlvbnMsIE9iamVjdCkpIHtcblx0XHRzbXMuc21zID0gXy5waWNrKG9wdGlvbnMsICdGb3JtYXQnLCAnQWN0aW9uJywgJ1BhcmFtU3RyaW5nJywgJ1JlY051bScsICdTaWduTmFtZScsICdUZW1wbGF0ZUNvZGUnLCAnbXNnJyk7XG5cdH1cblxuXHRzbXMuc2VudCA9IGZhbHNlO1xuXHRzbXMuc2VuZGluZyA9IDA7XG5cblx0X3ZhbGlkYXRlRG9jdW1lbnQoc21zKTtcblxuXHRpZihvcHRpb25zLmNyZWF0ZWRCeSl7XG5cdFx0c21zLm93bmVyID0gb3B0aW9ucy5jcmVhdGVkQnlcblx0fVxuXG5cdGlmKHNwYWNlSWQpe1xuXHRcdHNtcy5zcGFjZSA9IHNwYWNlSWRcblx0fVxuXG5cdHJldHVybiBTTVNRdWV1ZS5jb2xsZWN0aW9uLmluc2VydChzbXMpO1xufTsiLCJjb25zdCB7IHQgfSA9IHJlcXVpcmUoJ0BzdGVlZG9zL2kxOG4nKTtcblxudmFyIGlzQ29uZmlndXJlZCA9IGZhbHNlO1xudmFyIHNlbmRXb3JrZXIgPSBmdW5jdGlvbih0YXNrLCBpbnRlcnZhbCkge1xuXG5cdGlmIChTTVNRdWV1ZS5kZWJ1Zykge1xuXHRcdGNvbnNvbGUubG9nKCdTTVNRdWV1ZTogU2VuZCB3b3JrZXIgc3RhcnRlZCwgdXNpbmcgaW50ZXJ2YWw6ICcgKyBpbnRlcnZhbCk7XG5cdH1cblxuXHRyZXR1cm4gTWV0ZW9yLnNldEludGVydmFsKGZ1bmN0aW9uKCkge1xuXHRcdHRyeSB7XG5cdFx0XHR0YXNrKCk7XG5cdFx0fSBjYXRjaCAoZXJyb3IpIHtcblx0XHRcdGlmIChTTVNRdWV1ZS5kZWJ1Zykge1xuXHRcdFx0XHRjb25zb2xlLmxvZygnU01TUXVldWU6IEVycm9yIHdoaWxlIHNlbmRpbmc6ICcgKyBlcnJvci5tZXNzYWdlKTtcblx0XHRcdH1cblx0XHR9XG5cdH0sIGludGVydmFsKTtcbn07XG5cblxuXG4vKlxuXHRvcHRpb25zOiB7XG5cdFx0Ly8gQ29udHJvbHMgdGhlIHNlbmRpbmcgaW50ZXJ2YWxcblx0XHRzZW5kSW50ZXJ2YWw6IE1hdGNoLk9wdGlvbmFsKE51bWJlciksXG5cdFx0Ly8gQ29udHJvbHMgdGhlIHNlbmRpbmcgYmF0Y2ggc2l6ZSBwZXIgaW50ZXJ2YWxcblx0XHRzZW5kQmF0Y2hTaXplOiBNYXRjaC5PcHRpb25hbChOdW1iZXIpLFxuXHRcdC8vIEFsbG93IG9wdGlvbmFsIGtlZXBpbmcgbm90aWZpY2F0aW9ucyBpbiBjb2xsZWN0aW9uXG5cdFx0a2VlcFNNUzogTWF0Y2guT3B0aW9uYWwoQm9vbGVhbilcblx0fVxuKi9cblNNU1F1ZXVlLkNvbmZpZ3VyZSA9IGZ1bmN0aW9uKG9wdGlvbnMpIHtcblx0dmFyIHNlbGYgPSB0aGlzO1xuXHRvcHRpb25zID0gXy5leHRlbmQoe1xuXHRcdHNlbmRUaW1lb3V0OiA2MDAwMCwgLy8gVGltZW91dCBwZXJpb2QgZm9yIHNtcyBzZW5kXG5cdH0sIG9wdGlvbnMpO1xuXG5cdC8vIEJsb2NrIG11bHRpcGxlIGNhbGxzXG5cdGlmIChpc0NvbmZpZ3VyZWQpIHtcblx0XHR0aHJvdyBuZXcgRXJyb3IoJ1NNU1F1ZXVlLkNvbmZpZ3VyZSBzaG91bGQgbm90IGJlIGNhbGxlZCBtb3JlIHRoYW4gb25jZSEnKTtcblx0fVxuXG5cdGlzQ29uZmlndXJlZCA9IHRydWU7XG5cblx0Ly8gQWRkIGRlYnVnIGluZm9cblx0aWYgKFNNU1F1ZXVlLmRlYnVnKSB7XG5cdFx0Y29uc29sZS5sb2coJ1NNU1F1ZXVlLkNvbmZpZ3VyZScsIG9wdGlvbnMpO1xuXHR9XG5cblx0dmFyIFNNUyA9IHJlcXVpcmUoJ2FsaXl1bi1zbXMtbm9kZScpLFxuXHRzbXNTZW5kZXI7XG5cblx0c21zU2VuZGVyID0gbmV3IFNNUyh7XG5cdFx0QWNjZXNzS2V5SWQ6IG9wdGlvbnMuYWNjZXNzS2V5SWQsXG5cdFx0QWNjZXNzS2V5U2VjcmV0OiBvcHRpb25zLmFjY2Vzc0tleVNlY3JldFxuXHR9KTtcblxuXHRzZWxmLnNlbmRTTVMgPSBmdW5jdGlvbihzbXMpIHtcblx0XHRpZiAoU01TUXVldWUuZGVidWcpIHtcblx0XHRcdGNvbnNvbGUubG9nKFwic2VuZFNNU1wiKTtcblx0XHRcdGNvbnNvbGUubG9nKHNtcyk7XG5cdFx0fVxuXG5cdFx0c21zU2VuZGVyLnNlbmQoc21zLnNtcykuY2F0Y2goZXJyID0+IHtcblx0XHRcdGNvbnNvbGUuZXJyb3IoZXJyKVxuXHRcdH0pO1xuXHR9XG5cblx0Ly8gVW5pdmVyc2FsIHNlbmQgZnVuY3Rpb25cblx0dmFyIF9xdWVyeVNlbmQgPSBmdW5jdGlvbihvcHRpb25zKSB7XG5cblx0XHRpZiAoc2VsZi5zZW5kU01TKSB7XG5cdFx0XHRzZWxmLnNlbmRTTVMob3B0aW9ucyk7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIHtcblx0XHRcdHNtczogW29wdGlvbnMuX2lkXVxuXHRcdH07XG5cdH07XG5cblx0c2VsZi5zZXJ2ZXJTZW5kID0gZnVuY3Rpb24ob3B0aW9ucykge1xuXHRcdG9wdGlvbnMgPSBvcHRpb25zIHx8IHt9O1xuXHRcdHJldHVybiBfcXVlcnlTZW5kKG9wdGlvbnMpO1xuXHR9O1xuXG5cblx0Ly8gVGhpcyBpbnRlcnZhbCB3aWxsIGFsbG93IG9ubHkgb25lIHNtcyB0byBiZSBzZW50IGF0IGEgdGltZSwgaXRcblx0Ly8gd2lsbCBjaGVjayBmb3IgbmV3IHNtcyBhdCBldmVyeSBgb3B0aW9ucy5zZW5kSW50ZXJ2YWxgXG5cdC8vIChkZWZhdWx0IGludGVydmFsIGlzIDE1MDAwIG1zKVxuXHQvL1xuXHQvLyBJdCBsb29rcyBpbiBzbXMgY29sbGVjdGlvbiB0byBzZWUgaWYgdGhlcmVzIGFueSBwZW5kaW5nXG5cdC8vIHNtcywgaWYgc28gaXQgd2lsbCB0cnkgdG8gcmVzZXJ2ZSB0aGUgcGVuZGluZyBzbXMuXG5cdC8vIElmIHN1Y2Nlc3NmdWxseSByZXNlcnZlZCB0aGUgc2VuZCBpcyBzdGFydGVkLlxuXHQvL1xuXHQvLyBJZiBzbXMucXVlcnkgaXMgdHlwZSBzdHJpbmcsIGl0J3MgYXNzdW1lZCB0byBiZSBhIGpzb24gc3RyaW5nXG5cdC8vIHZlcnNpb24gb2YgdGhlIHF1ZXJ5IHNlbGVjdG9yLiBNYWtpbmcgaXQgYWJsZSB0byBjYXJyeSBgJGAgcHJvcGVydGllcyBpblxuXHQvLyB0aGUgbW9uZ28gY29sbGVjdGlvbi5cblx0Ly9cblx0Ly8gUHIuIGRlZmF1bHQgc21zIGFyZSByZW1vdmVkIGZyb20gdGhlIGNvbGxlY3Rpb24gYWZ0ZXIgc2VuZCBoYXZlXG5cdC8vIGNvbXBsZXRlZC4gU2V0dGluZyBgb3B0aW9ucy5rZWVwU01TYCB3aWxsIHVwZGF0ZSBhbmQga2VlcCB0aGVcblx0Ly8gc21zIGVnLiBpZiBuZWVkZWQgZm9yIGhpc3RvcmljYWwgcmVhc29ucy5cblx0Ly9cblx0Ly8gQWZ0ZXIgdGhlIHNlbmQgaGF2ZSBjb21wbGV0ZWQgYSBcInNlbmRcIiBldmVudCB3aWxsIGJlIGVtaXR0ZWQgd2l0aCBhXG5cdC8vIHN0YXR1cyBvYmplY3QgY29udGFpbmluZyBzbXMgaWQgYW5kIHRoZSBzZW5kIHJlc3VsdCBvYmplY3QuXG5cdC8vXG5cdHZhciBpc1NlbmRpbmcgPSBmYWxzZTtcblxuXHRpZiAob3B0aW9ucy5zZW5kSW50ZXJ2YWwgIT09IG51bGwpIHtcblxuXHRcdC8vIFRoaXMgd2lsbCByZXF1aXJlIGluZGV4IHNpbmNlIHdlIHNvcnQgc21zIGJ5IGNyZWF0ZWRBdFxuXHRcdFNNU1F1ZXVlLmNvbGxlY3Rpb24uX2Vuc3VyZUluZGV4KHtcblx0XHRcdGNyZWF0ZWRBdDogMVxuXHRcdH0pO1xuXHRcdFNNU1F1ZXVlLmNvbGxlY3Rpb24uX2Vuc3VyZUluZGV4KHtcblx0XHRcdHNlbnQ6IDFcblx0XHR9KTtcblx0XHRTTVNRdWV1ZS5jb2xsZWN0aW9uLl9lbnN1cmVJbmRleCh7XG5cdFx0XHRzZW5kaW5nOiAxXG5cdFx0fSk7XG5cblxuXHRcdHZhciBzZW5kU01TID0gZnVuY3Rpb24oc21zKSB7XG5cdFx0XHQvLyBSZXNlcnZlIHNtc1xuXHRcdFx0dmFyIG5vdyA9ICtuZXcgRGF0ZSgpO1xuXHRcdFx0dmFyIHRpbWVvdXRBdCA9IG5vdyArIG9wdGlvbnMuc2VuZFRpbWVvdXQ7XG5cdFx0XHR2YXIgcmVzZXJ2ZWQgPSBTTVNRdWV1ZS5jb2xsZWN0aW9uLnVwZGF0ZSh7XG5cdFx0XHRcdF9pZDogc21zLl9pZCxcblx0XHRcdFx0c2VudDogZmFsc2UsIC8vIHh4eDogbmVlZCB0byBtYWtlIHN1cmUgdGhpcyBpcyBzZXQgb24gY3JlYXRlXG5cdFx0XHRcdHNlbmRpbmc6IHtcblx0XHRcdFx0XHQkbHQ6IG5vd1xuXHRcdFx0XHR9XG5cdFx0XHR9LCB7XG5cdFx0XHRcdCRzZXQ6IHtcblx0XHRcdFx0XHRzZW5kaW5nOiB0aW1lb3V0QXQsXG5cdFx0XHRcdH1cblx0XHRcdH0pO1xuXG5cdFx0XHQvLyBNYWtlIHN1cmUgd2Ugb25seSBoYW5kbGUgc21zIHJlc2VydmVkIGJ5IHRoaXNcblx0XHRcdC8vIGluc3RhbmNlXG5cdFx0XHRpZiAocmVzZXJ2ZWQpIHtcblxuXHRcdFx0XHQvLyBTZW5kIHRoZSBzbXNcblx0XHRcdFx0dmFyIHJlc3VsdCA9IFNNU1F1ZXVlLnNlcnZlclNlbmQoc21zKTtcblxuXHRcdFx0XHRpZiAoIW9wdGlvbnMua2VlcFNNUykge1xuXHRcdFx0XHRcdC8vIFByLiBEZWZhdWx0IHdlIHdpbGwgcmVtb3ZlIHNtc1xuXHRcdFx0XHRcdFNNU1F1ZXVlLmNvbGxlY3Rpb24ucmVtb3ZlKHtcblx0XHRcdFx0XHRcdF9pZDogc21zLl9pZFxuXHRcdFx0XHRcdH0pO1xuXHRcdFx0XHR9IGVsc2Uge1xuXG5cdFx0XHRcdFx0Ly8gVXBkYXRlIHRoZSBzbXNcblx0XHRcdFx0XHRTTVNRdWV1ZS5jb2xsZWN0aW9uLnVwZGF0ZSh7XG5cdFx0XHRcdFx0XHRfaWQ6IHNtcy5faWRcblx0XHRcdFx0XHR9LCB7XG5cdFx0XHRcdFx0XHQkc2V0OiB7XG5cdFx0XHRcdFx0XHRcdC8vIE1hcmsgYXMgc2VudFxuXHRcdFx0XHRcdFx0XHRzZW50OiB0cnVlLFxuXHRcdFx0XHRcdFx0XHQvLyBTZXQgdGhlIHNlbnQgZGF0ZVxuXHRcdFx0XHRcdFx0XHRzZW50QXQ6IG5ldyBEYXRlKCksXG5cdFx0XHRcdFx0XHRcdC8vIE5vdCBiZWluZyBzZW50IGFueW1vcmVcblx0XHRcdFx0XHRcdFx0c2VuZGluZzogMFxuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH0pO1xuXG5cdFx0XHRcdH1cblxuXHRcdFx0XHQvLyBFbWl0IHRoZSBzZW5kXG5cdFx0XHRcdHNlbGYuZW1pdCgnc2VuZCcsIHtcblx0XHRcdFx0XHRzbXM6IHNtcy5faWQsXG5cdFx0XHRcdFx0cmVzdWx0OiByZXN1bHRcblx0XHRcdFx0fSk7XG5cblx0XHRcdH0gLy8gRWxzZSBjb3VsZCBub3QgcmVzZXJ2ZVxuXHRcdH07IC8vIEVPIHNlbmRTTVNcblxuXHRcdHNlbmRXb3JrZXIoZnVuY3Rpb24oKSB7XG5cblx0XHRcdGlmIChpc1NlbmRpbmcpIHtcblx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0fVxuXHRcdFx0Ly8gU2V0IHNlbmQgZmVuY2Vcblx0XHRcdGlzU2VuZGluZyA9IHRydWU7XG5cblx0XHRcdHZhciBiYXRjaFNpemUgPSBvcHRpb25zLnNlbmRCYXRjaFNpemUgfHwgMTtcblxuXHRcdFx0dmFyIG5vdyA9ICtuZXcgRGF0ZSgpO1xuXG5cdFx0XHQvLyBGaW5kIHNtcyB0aGF0IGFyZSBub3QgYmVpbmcgb3IgYWxyZWFkeSBzZW50XG5cdFx0XHR2YXIgcGVuZGluZ1NNUyA9IFNNU1F1ZXVlLmNvbGxlY3Rpb24uZmluZCh7XG5cdFx0XHRcdCRhbmQ6IFtcblx0XHRcdFx0XHQvLyBNZXNzYWdlIGlzIG5vdCBzZW50XG5cdFx0XHRcdFx0e1xuXHRcdFx0XHRcdFx0c2VudDogZmFsc2Vcblx0XHRcdFx0XHR9LFxuXHRcdFx0XHRcdC8vIEFuZCBub3QgYmVpbmcgc2VudCBieSBvdGhlciBpbnN0YW5jZXNcblx0XHRcdFx0XHR7XG5cdFx0XHRcdFx0XHRzZW5kaW5nOiB7XG5cdFx0XHRcdFx0XHRcdCRsdDogbm93XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRdXG5cdFx0XHR9LCB7XG5cdFx0XHRcdC8vIFNvcnQgYnkgY3JlYXRlZCBkYXRlXG5cdFx0XHRcdHNvcnQ6IHtcblx0XHRcdFx0XHRjcmVhdGVkQXQ6IDFcblx0XHRcdFx0fSxcblx0XHRcdFx0bGltaXQ6IGJhdGNoU2l6ZVxuXHRcdFx0fSk7XG5cblx0XHRcdHBlbmRpbmdTTVMuZm9yRWFjaChmdW5jdGlvbihzbXMpIHtcblx0XHRcdFx0dHJ5IHtcblx0XHRcdFx0XHRzZW5kU01TKHNtcyk7XG5cdFx0XHRcdH0gY2F0Y2ggKGVycm9yKSB7XG5cblx0XHRcdFx0XHRpZiAoU01TUXVldWUuZGVidWcpIHtcblx0XHRcdFx0XHRcdGNvbnNvbGUubG9nKCdTTVNRdWV1ZTogQ291bGQgbm90IHNlbmQgc21zIGlkOiBcIicgKyBzbXMuX2lkICsgJ1wiLCBFcnJvcjogJyArIGVycm9yLm1lc3NhZ2UpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fSk7IC8vIEVPIGZvckVhY2hcblxuXHRcdFx0Ly8gUmVtb3ZlIHRoZSBzZW5kIGZlbmNlXG5cdFx0XHRpc1NlbmRpbmcgPSBmYWxzZTtcblx0XHR9LCBvcHRpb25zLnNlbmRJbnRlcnZhbCB8fCAxNTAwMCk7IC8vIERlZmF1bHQgZXZlcnkgMTV0aCBzZWNcblxuXHR9IGVsc2Uge1xuXHRcdGlmIChTTVNRdWV1ZS5kZWJ1Zykge1xuXHRcdFx0Y29uc29sZS5sb2coJ1NNU1F1ZXVlOiBTZW5kIHNlcnZlciBpcyBkaXNhYmxlZCcpO1xuXHRcdH1cblx0fVxuXG59OyIsInZhciBpc0NvbmZpZ3VyZWQgPSBmYWxzZTtcbnZhciByZXF1ZXN0ID0gcmVxdWlyZSgnc3VwZXJhZ2VudCcpO1xuXG52YXIgc2VuZFdvcmtlciA9IGZ1bmN0aW9uKHRhc2ssIGludGVydmFsKSB7XG5cblx0aWYgKFdlYlNlcnZpY2VTTVNRdWV1ZS5kZWJ1Zykge1xuXHRcdGNvbnNvbGUubG9nKCdXZWJTZXJ2aWNlU01TUXVldWU6IFNlbmQgd29ya2VyIHN0YXJ0ZWQsIHVzaW5nIGludGVydmFsOiAnICsgaW50ZXJ2YWwpO1xuXHR9XG5cblx0cmV0dXJuIE1ldGVvci5zZXRJbnRlcnZhbChmdW5jdGlvbigpIHtcblx0XHR0cnkge1xuXHRcdFx0dGFzaygpO1xuXHRcdH0gY2F0Y2ggKGVycm9yKSB7XG5cdFx0XHRpZiAoV2ViU2VydmljZVNNU1F1ZXVlLmRlYnVnKSB7XG5cdFx0XHRcdGNvbnNvbGUubG9nKCdXZWJTZXJ2aWNlU01TUXVldWU6IEVycm9yIHdoaWxlIHNlbmRpbmc6ICcgKyBlcnJvci5tZXNzYWdlKTtcblx0XHRcdH1cblx0XHR9XG5cdH0sIGludGVydmFsKTtcbn07XG5cblxudmFyIHNlbmRUb1dlYlNlcnZpY2UgPSBmdW5jdGlvbihkb2MsIHVybCwgc3BhY2VUb2tlbiwgc2lnbm5hbWUpe1xuXHR2YXIgbWVzc2FnZSA9IF8uY2xvbmUoZG9jKTtcblx0bWVzc2FnZS5zaWdubmFtZSA9IHNpZ25uYW1lO1xuXHRkZWxldGUgbWVzc2FnZS5faWQ7XG5cdHJlcXVlc3Rcblx0XHQucG9zdCh1cmwpXG5cdFx0LnNlbmQobWVzc2FnZSlcblx0XHQuc2V0KCdBdXRob3JpemF0aW9uJywgJ0JlYXJlciAnICsgc3BhY2VUb2tlbilcblx0XHQuZW5kKGZ1bmN0aW9uKGVyciwgcmVzKSB7XG5cdFx0XHRpZiAoZXJyKSB7XG5cdFx0XHRcdHJldHVybiBjb25zb2xlLmVycm9yKGVycik7XG5cdFx0XHR9XG5cdFx0fSk7XG59XG5cbi8qXG5cdG9wdGlvbnM6IHtcblx0XHQvLyBDb250cm9scyB0aGUgc2VuZGluZyBpbnRlcnZhbFxuXHRcdHNlbmRJbnRlcnZhbDogTWF0Y2guT3B0aW9uYWwoTnVtYmVyKSxcblx0XHQvLyBDb250cm9scyB0aGUgc2VuZGluZyBiYXRjaCBzaXplIHBlciBpbnRlcnZhbFxuXHRcdHNlbmRCYXRjaFNpemU6IE1hdGNoLk9wdGlvbmFsKE51bWJlciksXG5cdFx0Ly8gQWxsb3cgb3B0aW9uYWwga2VlcGluZyBub3RpZmljYXRpb25zIGluIGNvbGxlY3Rpb25cblx0XHRrZWVwU01TOiBNYXRjaC5PcHRpb25hbChCb29sZWFuKVxuXHR9XG4qL1xuV2ViU2VydmljZVNNU1F1ZXVlLkNvbmZpZ3VyZSA9IGZ1bmN0aW9uKG9wdGlvbnMpIHtcblx0dmFyIHNlbGYgPSB0aGlzO1xuXHRvcHRpb25zID0gXy5leHRlbmQoe1xuXHRcdHNlbmRUaW1lb3V0OiA2MDAwMCwgLy8gVGltZW91dCBwZXJpb2QgZm9yIHNtcyBzZW5kXG5cdH0sIG9wdGlvbnMpO1xuXG5cdC8vIEJsb2NrIG11bHRpcGxlIGNhbGxzXG5cdGlmIChpc0NvbmZpZ3VyZWQpIHtcblx0XHR0aHJvdyBuZXcgRXJyb3IoJ1dlYlNlcnZpY2VTTVNRdWV1ZS5Db25maWd1cmUgc2hvdWxkIG5vdCBiZSBjYWxsZWQgbW9yZSB0aGFuIG9uY2UhJyk7XG5cdH1cblxuXHRpc0NvbmZpZ3VyZWQgPSB0cnVlO1xuXG5cdC8vIEFkZCBkZWJ1ZyBpbmZvXG5cdGlmIChXZWJTZXJ2aWNlU01TUXVldWUuZGVidWcpIHtcblx0XHRjb25zb2xlLmxvZygnV2ViU2VydmljZVNNU1F1ZXVlLkNvbmZpZ3VyZScsIG9wdGlvbnMpO1xuXHR9XG5cblx0dmFyIHVybCA9IG9wdGlvbnMudXJsO1xuXHR2YXIgc3BhY2VUb2tlbiA9IG9wdGlvbnMuc3BhY2VUb2tlbjtcblx0dmFyIHNpZ25uYW1lID0gb3B0aW9ucy5zaWdubmFtZTtcblxuXHRzZWxmLnNlbmRTTVMgPSBmdW5jdGlvbihzbXMpIHtcblx0XHRpZiAoV2ViU2VydmljZVNNU1F1ZXVlLmRlYnVnKSB7XG5cdFx0XHRjb25zb2xlLmxvZyhcInNlbmRTTVNcIik7XG5cdFx0XHRjb25zb2xlLmxvZyhzbXMpO1xuXHRcdH1cblx0XHRzZW5kVG9XZWJTZXJ2aWNlKHNtcywgdXJsLCBzcGFjZVRva2VuLCBzaWdubmFtZSlcblx0fVxuXG5cdC8vIFVuaXZlcnNhbCBzZW5kIGZ1bmN0aW9uXG5cdHZhciBfcXVlcnlTZW5kID0gZnVuY3Rpb24ob3B0aW9ucykge1xuXG5cdFx0aWYgKHNlbGYuc2VuZFNNUykge1xuXHRcdFx0c2VsZi5zZW5kU01TKG9wdGlvbnMpO1xuXHRcdH1cblxuXHRcdHJldHVybiB7XG5cdFx0XHRzbXM6IFtvcHRpb25zLl9pZF1cblx0XHR9O1xuXHR9O1xuXG5cdHNlbGYuc2VydmVyU2VuZCA9IGZ1bmN0aW9uKG9wdGlvbnMpIHtcblx0XHRvcHRpb25zID0gb3B0aW9ucyB8fCB7fTtcblx0XHRyZXR1cm4gX3F1ZXJ5U2VuZChvcHRpb25zKTtcblx0fTtcblxuXG5cdC8vIFRoaXMgaW50ZXJ2YWwgd2lsbCBhbGxvdyBvbmx5IG9uZSBzbXMgdG8gYmUgc2VudCBhdCBhIHRpbWUsIGl0XG5cdC8vIHdpbGwgY2hlY2sgZm9yIG5ldyBzbXMgYXQgZXZlcnkgYG9wdGlvbnMuc2VuZEludGVydmFsYFxuXHQvLyAoZGVmYXVsdCBpbnRlcnZhbCBpcyAxNTAwMCBtcylcblx0Ly9cblx0Ly8gSXQgbG9va3MgaW4gc21zIGNvbGxlY3Rpb24gdG8gc2VlIGlmIHRoZXJlcyBhbnkgcGVuZGluZ1xuXHQvLyBzbXMsIGlmIHNvIGl0IHdpbGwgdHJ5IHRvIHJlc2VydmUgdGhlIHBlbmRpbmcgc21zLlxuXHQvLyBJZiBzdWNjZXNzZnVsbHkgcmVzZXJ2ZWQgdGhlIHNlbmQgaXMgc3RhcnRlZC5cblx0Ly9cblx0Ly8gSWYgc21zLnF1ZXJ5IGlzIHR5cGUgc3RyaW5nLCBpdCdzIGFzc3VtZWQgdG8gYmUgYSBqc29uIHN0cmluZ1xuXHQvLyB2ZXJzaW9uIG9mIHRoZSBxdWVyeSBzZWxlY3Rvci4gTWFraW5nIGl0IGFibGUgdG8gY2FycnkgYCRgIHByb3BlcnRpZXMgaW5cblx0Ly8gdGhlIG1vbmdvIGNvbGxlY3Rpb24uXG5cdC8vXG5cdC8vIFByLiBkZWZhdWx0IHNtcyBhcmUgcmVtb3ZlZCBmcm9tIHRoZSBjb2xsZWN0aW9uIGFmdGVyIHNlbmQgaGF2ZVxuXHQvLyBjb21wbGV0ZWQuIFNldHRpbmcgYG9wdGlvbnMua2VlcFNNU2Agd2lsbCB1cGRhdGUgYW5kIGtlZXAgdGhlXG5cdC8vIHNtcyBlZy4gaWYgbmVlZGVkIGZvciBoaXN0b3JpY2FsIHJlYXNvbnMuXG5cdC8vXG5cdC8vIEFmdGVyIHRoZSBzZW5kIGhhdmUgY29tcGxldGVkIGEgXCJzZW5kXCIgZXZlbnQgd2lsbCBiZSBlbWl0dGVkIHdpdGggYVxuXHQvLyBzdGF0dXMgb2JqZWN0IGNvbnRhaW5pbmcgc21zIGlkIGFuZCB0aGUgc2VuZCByZXN1bHQgb2JqZWN0LlxuXHQvL1xuXHR2YXIgaXNTZW5kaW5nID0gZmFsc2U7XG5cblx0aWYgKG9wdGlvbnMuc2VuZEludGVydmFsICE9PSBudWxsKSB7XG5cblx0XHQvLyBUaGlzIHdpbGwgcmVxdWlyZSBpbmRleCBzaW5jZSB3ZSBzb3J0IHNtcyBieSBjcmVhdGVkQXRcblx0XHRXZWJTZXJ2aWNlU01TUXVldWUuY29sbGVjdGlvbi5fZW5zdXJlSW5kZXgoe1xuXHRcdFx0Y3JlYXRlZEF0OiAxXG5cdFx0fSk7XG5cdFx0V2ViU2VydmljZVNNU1F1ZXVlLmNvbGxlY3Rpb24uX2Vuc3VyZUluZGV4KHtcblx0XHRcdHNlbnQ6IDFcblx0XHR9KTtcblx0XHRXZWJTZXJ2aWNlU01TUXVldWUuY29sbGVjdGlvbi5fZW5zdXJlSW5kZXgoe1xuXHRcdFx0c2VuZGluZzogMVxuXHRcdH0pO1xuXG5cblx0XHR2YXIgc2VuZFNNUyA9IGZ1bmN0aW9uKHNtcykge1xuXHRcdFx0Ly8gUmVzZXJ2ZSBzbXNcblx0XHRcdHZhciBub3cgPSArbmV3IERhdGUoKTtcblx0XHRcdHZhciB0aW1lb3V0QXQgPSBub3cgKyBvcHRpb25zLnNlbmRUaW1lb3V0O1xuXHRcdFx0dmFyIHJlc2VydmVkID0gV2ViU2VydmljZVNNU1F1ZXVlLmNvbGxlY3Rpb24udXBkYXRlKHtcblx0XHRcdFx0X2lkOiBzbXMuX2lkLFxuXHRcdFx0XHRzZW50OiBmYWxzZSwgLy8geHh4OiBuZWVkIHRvIG1ha2Ugc3VyZSB0aGlzIGlzIHNldCBvbiBjcmVhdGVcblx0XHRcdFx0c2VuZGluZzoge1xuXHRcdFx0XHRcdCRsdDogbm93XG5cdFx0XHRcdH1cblx0XHRcdH0sIHtcblx0XHRcdFx0JHNldDoge1xuXHRcdFx0XHRcdHNlbmRpbmc6IHRpbWVvdXRBdCxcblx0XHRcdFx0fVxuXHRcdFx0fSk7XG5cblx0XHRcdC8vIE1ha2Ugc3VyZSB3ZSBvbmx5IGhhbmRsZSBzbXMgcmVzZXJ2ZWQgYnkgdGhpc1xuXHRcdFx0Ly8gaW5zdGFuY2Vcblx0XHRcdGlmIChyZXNlcnZlZCkge1xuXG5cdFx0XHRcdC8vIFNlbmQgdGhlIHNtc1xuXHRcdFx0XHR2YXIgcmVzdWx0ID0gV2ViU2VydmljZVNNU1F1ZXVlLnNlcnZlclNlbmQoc21zKTtcblxuXHRcdFx0XHRpZiAoIW9wdGlvbnMua2VlcFNNUykge1xuXHRcdFx0XHRcdC8vIFByLiBEZWZhdWx0IHdlIHdpbGwgcmVtb3ZlIHNtc1xuXHRcdFx0XHRcdFdlYlNlcnZpY2VTTVNRdWV1ZS5jb2xsZWN0aW9uLnJlbW92ZSh7XG5cdFx0XHRcdFx0XHRfaWQ6IHNtcy5faWRcblx0XHRcdFx0XHR9KTtcblx0XHRcdFx0fSBlbHNlIHtcblxuXHRcdFx0XHRcdC8vIFVwZGF0ZSB0aGUgc21zXG5cdFx0XHRcdFx0V2ViU2VydmljZVNNU1F1ZXVlLmNvbGxlY3Rpb24udXBkYXRlKHtcblx0XHRcdFx0XHRcdF9pZDogc21zLl9pZFxuXHRcdFx0XHRcdH0sIHtcblx0XHRcdFx0XHRcdCRzZXQ6IHtcblx0XHRcdFx0XHRcdFx0Ly8gTWFyayBhcyBzZW50XG5cdFx0XHRcdFx0XHRcdHNlbnQ6IHRydWUsXG5cdFx0XHRcdFx0XHRcdC8vIFNldCB0aGUgc2VudCBkYXRlXG5cdFx0XHRcdFx0XHRcdHNlbnRBdDogbmV3IERhdGUoKSxcblx0XHRcdFx0XHRcdFx0Ly8gTm90IGJlaW5nIHNlbnQgYW55bW9yZVxuXHRcdFx0XHRcdFx0XHRzZW5kaW5nOiAwXG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fSk7XG5cblx0XHRcdFx0fVxuXG5cdFx0XHRcdC8vIEVtaXQgdGhlIHNlbmRcblx0XHRcdFx0c2VsZi5lbWl0KCdzZW5kJywge1xuXHRcdFx0XHRcdHNtczogc21zLl9pZCxcblx0XHRcdFx0XHRyZXN1bHQ6IHJlc3VsdFxuXHRcdFx0XHR9KTtcblxuXHRcdFx0fSAvLyBFbHNlIGNvdWxkIG5vdCByZXNlcnZlXG5cdFx0fTsgLy8gRU8gc2VuZFNNU1xuXG5cdFx0c2VuZFdvcmtlcihmdW5jdGlvbigpIHtcblxuXHRcdFx0aWYgKGlzU2VuZGluZykge1xuXHRcdFx0XHRyZXR1cm47XG5cdFx0XHR9XG5cdFx0XHQvLyBTZXQgc2VuZCBmZW5jZVxuXHRcdFx0aXNTZW5kaW5nID0gdHJ1ZTtcblxuXHRcdFx0dmFyIGJhdGNoU2l6ZSA9IG9wdGlvbnMuc2VuZEJhdGNoU2l6ZSB8fCAxO1xuXG5cdFx0XHR2YXIgbm93ID0gK25ldyBEYXRlKCk7XG5cblx0XHRcdC8vIEZpbmQgc21zIHRoYXQgYXJlIG5vdCBiZWluZyBvciBhbHJlYWR5IHNlbnRcblx0XHRcdHZhciBwZW5kaW5nU01TID0gV2ViU2VydmljZVNNU1F1ZXVlLmNvbGxlY3Rpb24uZmluZCh7XG5cdFx0XHRcdCRhbmQ6IFtcblx0XHRcdFx0XHQvLyBNZXNzYWdlIGlzIG5vdCBzZW50XG5cdFx0XHRcdFx0e1xuXHRcdFx0XHRcdFx0c2VudDogZmFsc2Vcblx0XHRcdFx0XHR9LFxuXHRcdFx0XHRcdC8vIEFuZCBub3QgYmVpbmcgc2VudCBieSBvdGhlciBpbnN0YW5jZXNcblx0XHRcdFx0XHR7XG5cdFx0XHRcdFx0XHRzZW5kaW5nOiB7XG5cdFx0XHRcdFx0XHRcdCRsdDogbm93XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRdXG5cdFx0XHR9LCB7XG5cdFx0XHRcdC8vIFNvcnQgYnkgY3JlYXRlZCBkYXRlXG5cdFx0XHRcdHNvcnQ6IHtcblx0XHRcdFx0XHRjcmVhdGVkQXQ6IDFcblx0XHRcdFx0fSxcblx0XHRcdFx0bGltaXQ6IGJhdGNoU2l6ZVxuXHRcdFx0fSk7XG5cblx0XHRcdHBlbmRpbmdTTVMuZm9yRWFjaChmdW5jdGlvbihzbXMpIHtcblx0XHRcdFx0dHJ5IHtcblx0XHRcdFx0XHRzZW5kU01TKHNtcyk7XG5cdFx0XHRcdH0gY2F0Y2ggKGVycm9yKSB7XG5cblx0XHRcdFx0XHRpZiAoV2ViU2VydmljZVNNU1F1ZXVlLmRlYnVnKSB7XG5cdFx0XHRcdFx0XHRjb25zb2xlLmxvZygnV2ViU2VydmljZVNNU1F1ZXVlOiBDb3VsZCBub3Qgc2VuZCBzbXMgaWQ6IFwiJyArIHNtcy5faWQgKyAnXCIsIEVycm9yOiAnICsgZXJyb3IubWVzc2FnZSk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9KTsgLy8gRU8gZm9yRWFjaFxuXG5cdFx0XHQvLyBSZW1vdmUgdGhlIHNlbmQgZmVuY2Vcblx0XHRcdGlzU2VuZGluZyA9IGZhbHNlO1xuXHRcdH0sIG9wdGlvbnMuc2VuZEludGVydmFsIHx8IDE1MDAwKTsgLy8gRGVmYXVsdCBldmVyeSAxNXRoIHNlY1xuXG5cdH0gZWxzZSB7XG5cdFx0aWYgKFdlYlNlcnZpY2VTTVNRdWV1ZS5kZWJ1Zykge1xuXHRcdFx0Y29uc29sZS5sb2coJ1dlYlNlcnZpY2VTTVNRdWV1ZTogU2VuZCBzZXJ2ZXIgaXMgZGlzYWJsZWQnKTtcblx0XHR9XG5cdH1cblxufTsiLCJNZXRlb3Iuc3RhcnR1cCAtPlxuXHRpZiBNZXRlb3Iuc2V0dGluZ3Muc21zPy53ZWJzZXJ2aWNlPy5zbXNxdWV1ZV9pbnRlcnZhbCAmJiAoTWV0ZW9yLnNldHRpbmdzLnNtcz8uYWxpeXVuPy5zbXNxdWV1ZV9pbnRlcnZhbCB8fCBNZXRlb3Iuc2V0dGluZ3Muc21zPy5xY2xvdWQ/LnNtc3F1ZXVlX2ludGVydmFsKVxuXHRcdHRocm93IG5ldyBNZXRlb3IuRXJyb3IoJ3Ntcy53ZWJzZXJ2aWNlIGNhbm5vdCBiZSBjb25maWd1cmVkIHdpdGggc21zLmFsaXl1biBvciBzbXMucWNsb3VkJyk7XG5cblx0aWYgTWV0ZW9yLnNldHRpbmdzLnNtcz8uYWxpeXVuPy5zbXNxdWV1ZV9pbnRlcnZhbFxuXHRcdFNNU1F1ZXVlLkNvbmZpZ3VyZVxuXHRcdFx0c2VuZEludGVydmFsOiBNZXRlb3Iuc2V0dGluZ3Muc21zLmFsaXl1bi5zbXNxdWV1ZV9pbnRlcnZhbFxuXHRcdFx0c2VuZEJhdGNoU2l6ZTogMTBcblx0XHRcdGtlZXBTTVM6IHRydWVcblx0XHRcdGFjY2Vzc0tleUlkOiBNZXRlb3Iuc2V0dGluZ3Muc21zLmFsaXl1bi5hY2Nlc3NLZXlJZFxuXHRcdFx0YWNjZXNzS2V5U2VjcmV0OiBNZXRlb3Iuc2V0dGluZ3Muc21zLmFsaXl1bi5hY2Nlc3NLZXlTZWNyZXRcblxuXHRpZiBNZXRlb3Iuc2V0dGluZ3Muc21zPy53ZWJzZXJ2aWNlPy5zbXNxdWV1ZV9pbnRlcnZhbFxuXHRcdFdlYlNlcnZpY2VTTVNRdWV1ZS5Db25maWd1cmVcblx0XHRcdHNlbmRJbnRlcnZhbDogTWV0ZW9yLnNldHRpbmdzLnNtcy53ZWJzZXJ2aWNlLnNtc3F1ZXVlX2ludGVydmFsXG5cdFx0XHR1cmw6IE1ldGVvci5zZXR0aW5ncy5zbXMud2Vic2VydmljZS51cmxcblx0XHRcdHNwYWNlVG9rZW46IE1ldGVvci5zZXR0aW5ncy5zbXMud2Vic2VydmljZS5zcGFjZV90b2tlblxuXHRcdFx0c2lnbm5hbWU6IE1ldGVvci5zZXR0aW5ncy5zbXMud2Vic2VydmljZS5zaWdubmFtZVxuXHRcdFx0c2VuZEJhdGNoU2l6ZTogMTBcblx0XHRcdGtlZXBTTVM6IHRydWVcblxuXG5cbiIsIk1ldGVvci5zdGFydHVwKGZ1bmN0aW9uKCkge1xuICB2YXIgcmVmLCByZWYxLCByZWYyLCByZWYzLCByZWY0LCByZWY1LCByZWY2LCByZWY3LCByZWY4LCByZWY5O1xuICBpZiAoKChyZWYgPSBNZXRlb3Iuc2V0dGluZ3Muc21zKSAhPSBudWxsID8gKHJlZjEgPSByZWYud2Vic2VydmljZSkgIT0gbnVsbCA/IHJlZjEuc21zcXVldWVfaW50ZXJ2YWwgOiB2b2lkIDAgOiB2b2lkIDApICYmICgoKHJlZjIgPSBNZXRlb3Iuc2V0dGluZ3Muc21zKSAhPSBudWxsID8gKHJlZjMgPSByZWYyLmFsaXl1bikgIT0gbnVsbCA/IHJlZjMuc21zcXVldWVfaW50ZXJ2YWwgOiB2b2lkIDAgOiB2b2lkIDApIHx8ICgocmVmNCA9IE1ldGVvci5zZXR0aW5ncy5zbXMpICE9IG51bGwgPyAocmVmNSA9IHJlZjQucWNsb3VkKSAhPSBudWxsID8gcmVmNS5zbXNxdWV1ZV9pbnRlcnZhbCA6IHZvaWQgMCA6IHZvaWQgMCkpKSB7XG4gICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcignc21zLndlYnNlcnZpY2UgY2Fubm90IGJlIGNvbmZpZ3VyZWQgd2l0aCBzbXMuYWxpeXVuIG9yIHNtcy5xY2xvdWQnKTtcbiAgfVxuICBpZiAoKHJlZjYgPSBNZXRlb3Iuc2V0dGluZ3Muc21zKSAhPSBudWxsID8gKHJlZjcgPSByZWY2LmFsaXl1bikgIT0gbnVsbCA/IHJlZjcuc21zcXVldWVfaW50ZXJ2YWwgOiB2b2lkIDAgOiB2b2lkIDApIHtcbiAgICBTTVNRdWV1ZS5Db25maWd1cmUoe1xuICAgICAgc2VuZEludGVydmFsOiBNZXRlb3Iuc2V0dGluZ3Muc21zLmFsaXl1bi5zbXNxdWV1ZV9pbnRlcnZhbCxcbiAgICAgIHNlbmRCYXRjaFNpemU6IDEwLFxuICAgICAga2VlcFNNUzogdHJ1ZSxcbiAgICAgIGFjY2Vzc0tleUlkOiBNZXRlb3Iuc2V0dGluZ3Muc21zLmFsaXl1bi5hY2Nlc3NLZXlJZCxcbiAgICAgIGFjY2Vzc0tleVNlY3JldDogTWV0ZW9yLnNldHRpbmdzLnNtcy5hbGl5dW4uYWNjZXNzS2V5U2VjcmV0XG4gICAgfSk7XG4gIH1cbiAgaWYgKChyZWY4ID0gTWV0ZW9yLnNldHRpbmdzLnNtcykgIT0gbnVsbCA/IChyZWY5ID0gcmVmOC53ZWJzZXJ2aWNlKSAhPSBudWxsID8gcmVmOS5zbXNxdWV1ZV9pbnRlcnZhbCA6IHZvaWQgMCA6IHZvaWQgMCkge1xuICAgIHJldHVybiBXZWJTZXJ2aWNlU01TUXVldWUuQ29uZmlndXJlKHtcbiAgICAgIHNlbmRJbnRlcnZhbDogTWV0ZW9yLnNldHRpbmdzLnNtcy53ZWJzZXJ2aWNlLnNtc3F1ZXVlX2ludGVydmFsLFxuICAgICAgdXJsOiBNZXRlb3Iuc2V0dGluZ3Muc21zLndlYnNlcnZpY2UudXJsLFxuICAgICAgc3BhY2VUb2tlbjogTWV0ZW9yLnNldHRpbmdzLnNtcy53ZWJzZXJ2aWNlLnNwYWNlX3Rva2VuLFxuICAgICAgc2lnbm5hbWU6IE1ldGVvci5zZXR0aW5ncy5zbXMud2Vic2VydmljZS5zaWdubmFtZSxcbiAgICAgIHNlbmRCYXRjaFNpemU6IDEwLFxuICAgICAga2VlcFNNUzogdHJ1ZVxuICAgIH0pO1xuICB9XG59KTtcbiJdfQ==
