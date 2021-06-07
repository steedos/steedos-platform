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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvczpzbXNxdWV1ZS9jaGVja05wbS5qcyIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvczpzbXNxdWV1ZS9saWIvY29tbW9uL21haW4uanMiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3M6c21zcXVldWUvbGliL2NvbW1vbi9zbXMuanMiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3M6c21zcXVldWUvbGliL3NlcnZlci9hcGkuanMiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3M6c21zcXVldWUvbGliL3NlcnZlci93ZWJzZXJ2aWNlLmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zX3Ntc3F1ZXVlL3NlcnZlci9zdGFydHVwLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvc2VydmVyL3N0YXJ0dXAuY29mZmVlIl0sIm5hbWVzIjpbImNoZWNrTnBtVmVyc2lvbnMiLCJtb2R1bGUiLCJsaW5rIiwidiIsIk1ldGVvciIsInNldHRpbmdzIiwic21zIiwiYWxpeXVuIiwiU01TUXVldWUiLCJFdmVudFN0YXRlIiwiV2ViU2VydmljZVNNU1F1ZXVlIiwiY29sbGVjdGlvbiIsIkNvbGxlY3Rpb24iLCJfdmFsaWRhdGVEb2N1bWVudCIsImNoZWNrIiwiT2JqZWN0Iiwic2VudCIsIk1hdGNoIiwiT3B0aW9uYWwiLCJCb29sZWFuIiwic2VuZGluZyIsIkludGVnZXIiLCJjcmVhdGVkQXQiLCJEYXRlIiwiY3JlYXRlZEJ5IiwiT25lT2YiLCJTdHJpbmciLCJzZW5kIiwib3B0aW9ucyIsInNwYWNlSWQiLCJjdXJyZW50VXNlciIsImlzQ2xpZW50IiwidXNlcklkIiwiaXNTZXJ2ZXIiLCJfIiwiZXh0ZW5kIiwidGVzdCIsInBpY2siLCJvd25lciIsInNwYWNlIiwiaW5zZXJ0IiwiaXNDb25maWd1cmVkIiwic2VuZFdvcmtlciIsInRhc2siLCJpbnRlcnZhbCIsImRlYnVnIiwiY29uc29sZSIsImxvZyIsInNldEludGVydmFsIiwiZXJyb3IiLCJtZXNzYWdlIiwiQ29uZmlndXJlIiwic2VsZiIsInNlbmRUaW1lb3V0IiwiRXJyb3IiLCJTTVMiLCJyZXF1aXJlIiwic21zU2VuZGVyIiwiQWNjZXNzS2V5SWQiLCJhY2Nlc3NLZXlJZCIsIkFjY2Vzc0tleVNlY3JldCIsImFjY2Vzc0tleVNlY3JldCIsInNlbmRTTVMiLCJjYXRjaCIsImVyciIsIl9xdWVyeVNlbmQiLCJfaWQiLCJzZXJ2ZXJTZW5kIiwiaXNTZW5kaW5nIiwic2VuZEludGVydmFsIiwiX2Vuc3VyZUluZGV4Iiwibm93IiwidGltZW91dEF0IiwicmVzZXJ2ZWQiLCJ1cGRhdGUiLCIkbHQiLCIkc2V0IiwicmVzdWx0Iiwia2VlcFNNUyIsInJlbW92ZSIsInNlbnRBdCIsImVtaXQiLCJiYXRjaFNpemUiLCJzZW5kQmF0Y2hTaXplIiwicGVuZGluZ1NNUyIsImZpbmQiLCIkYW5kIiwic29ydCIsImxpbWl0IiwiZm9yRWFjaCIsInJlcXVlc3QiLCJzZW5kVG9XZWJTZXJ2aWNlIiwiZG9jIiwidXJsIiwic3BhY2VUb2tlbiIsInNpZ25uYW1lIiwiY2xvbmUiLCJwb3N0Iiwic2V0IiwiZW5kIiwicmVzIiwic3RhcnR1cCIsInJlZiIsInJlZjEiLCJyZWYyIiwicmVmMyIsInJlZjQiLCJyZWY1IiwicmVmNiIsInJlZjciLCJyZWY4IiwicmVmOSIsIndlYnNlcnZpY2UiLCJzbXNxdWV1ZV9pbnRlcnZhbCIsInFjbG91ZCIsInNwYWNlX3Rva2VuIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSxJQUFJQSxnQkFBSjtBQUFxQkMsTUFBTSxDQUFDQyxJQUFQLENBQVksb0NBQVosRUFBaUQ7QUFBQ0Ysa0JBQWdCLENBQUNHLENBQUQsRUFBRztBQUFDSCxvQkFBZ0IsR0FBQ0csQ0FBakI7QUFBbUI7O0FBQXhDLENBQWpELEVBQTJGLENBQTNGOztBQUly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QUFPQyxRQUFQLENBQWdCQyxHQUFoQixDQUFvQkMsTUFBcEIsQ0FBMkJzRDtBQUo1QyxLQUREO0FDUUM7O0FEREYsT0FBQWlELE9BQUExRyxPQUFBQyxRQUFBLENBQUFDLEdBQUEsYUFBQXlHLE9BQUFELEtBQUFFLFVBQUEsWUFBQUQsS0FBb0NFLGlCQUFwQyxHQUFvQyxNQUFwQyxHQUFvQyxNQUFwQztBQ0dHLFdERkZ2RyxtQkFBbUJ5QyxTQUFuQixDQUNDO0FBQUFrQixvQkFBY2pFLE9BQU9DLFFBQVAsQ0FBZ0JDLEdBQWhCLENBQW9CMEcsVUFBcEIsQ0FBK0JDLGlCQUE3QztBQUNBcEIsV0FBS3pGLE9BQU9DLFFBQVAsQ0FBZ0JDLEdBQWhCLENBQW9CMEcsVUFBcEIsQ0FBK0JuQixHQURwQztBQUVBQyxrQkFBWTFGLE9BQU9DLFFBQVAsQ0FBZ0JDLEdBQWhCLENBQW9CMEcsVUFBcEIsQ0FBK0JHLFdBRjNDO0FBR0FwQixnQkFBVTNGLE9BQU9DLFFBQVAsQ0FBZ0JDLEdBQWhCLENBQW9CMEcsVUFBcEIsQ0FBK0JqQixRQUh6QztBQUlBWixxQkFBZSxFQUpmO0FBS0FMLGVBQVM7QUFMVCxLQURELENDRUU7QUFRRDtBRHZCSCxHIiwiZmlsZSI6Ii9wYWNrYWdlcy9zdGVlZG9zX3Ntc3F1ZXVlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtcblx0Y2hlY2tOcG1WZXJzaW9uc1xufSBmcm9tICdtZXRlb3IvdG1lYXNkYXk6Y2hlY2stbnBtLXZlcnNpb25zJztcblxuaWYgKE1ldGVvci5zZXR0aW5ncyAmJiBNZXRlb3Iuc2V0dGluZ3Muc21zICYmIE1ldGVvci5zZXR0aW5ncy5zbXMuYWxpeXVuKSB7XG5cdGNoZWNrTnBtVmVyc2lvbnMoe1xuXHRcdFwiYWxpeXVuLXNtcy1ub2RlXCI6IFwiXjEuMS4yXCJcblx0fSwgJ3N0ZWVkb3M6c21zcXVldWUnKTtcbn0iLCJTTVNRdWV1ZSA9IG5ldyBFdmVudFN0YXRlKCk7XG5XZWJTZXJ2aWNlU01TUXVldWUgPSBuZXcgRXZlbnRTdGF0ZSgpOyIsIlNNU1F1ZXVlLmNvbGxlY3Rpb24gPSBuZXcgTWV0ZW9yLkNvbGxlY3Rpb24oJ19zbXNfcXVldWUnKTtcbldlYlNlcnZpY2VTTVNRdWV1ZS5jb2xsZWN0aW9uID0gU01TUXVldWUuY29sbGVjdGlvbjtcbnZhciBfdmFsaWRhdGVEb2N1bWVudCA9IGZ1bmN0aW9uKHNtcykge1xuXG5cdGNoZWNrKHNtcywge1xuXHRcdHNtczogT2JqZWN0LFxuXHRcdHNlbnQ6IE1hdGNoLk9wdGlvbmFsKEJvb2xlYW4pLFxuXHRcdHNlbmRpbmc6IE1hdGNoLk9wdGlvbmFsKE1hdGNoLkludGVnZXIpLFxuXHRcdGNyZWF0ZWRBdDogRGF0ZSxcblx0XHRjcmVhdGVkQnk6IE1hdGNoLk9uZU9mKFN0cmluZywgbnVsbClcblx0fSk7XG5cbn07XG5cblNNU1F1ZXVlLnNlbmQgPSBmdW5jdGlvbihvcHRpb25zLCBzcGFjZUlkKSB7XG5cdHZhciBjdXJyZW50VXNlciA9IE1ldGVvci5pc0NsaWVudCAmJiBNZXRlb3IudXNlcklkICYmIE1ldGVvci51c2VySWQoKSB8fCBNZXRlb3IuaXNTZXJ2ZXIgJiYgKG9wdGlvbnMuY3JlYXRlZEJ5IHx8ICc8U0VSVkVSPicpIHx8IG51bGxcblx0dmFyIHNtcyA9IF8uZXh0ZW5kKHtcblx0XHRjcmVhdGVkQXQ6IG5ldyBEYXRlKCksXG5cdFx0Y3JlYXRlZEJ5OiBjdXJyZW50VXNlclxuXHR9KTtcblxuXHRpZiAoTWF0Y2gudGVzdChvcHRpb25zLCBPYmplY3QpKSB7XG5cdFx0c21zLnNtcyA9IF8ucGljayhvcHRpb25zLCAnRm9ybWF0JywgJ0FjdGlvbicsICdQYXJhbVN0cmluZycsICdSZWNOdW0nLCAnU2lnbk5hbWUnLCAnVGVtcGxhdGVDb2RlJywgJ21zZycpO1xuXHR9XG5cblx0c21zLnNlbnQgPSBmYWxzZTtcblx0c21zLnNlbmRpbmcgPSAwO1xuXG5cdF92YWxpZGF0ZURvY3VtZW50KHNtcyk7XG5cblx0aWYob3B0aW9ucy5jcmVhdGVkQnkpe1xuXHRcdHNtcy5vd25lciA9IG9wdGlvbnMuY3JlYXRlZEJ5XG5cdH1cblxuXHRpZihzcGFjZUlkKXtcblx0XHRzbXMuc3BhY2UgPSBzcGFjZUlkXG5cdH1cblxuXHRyZXR1cm4gU01TUXVldWUuY29sbGVjdGlvbi5pbnNlcnQoc21zKTtcbn07IiwidmFyIGlzQ29uZmlndXJlZCA9IGZhbHNlO1xudmFyIHNlbmRXb3JrZXIgPSBmdW5jdGlvbih0YXNrLCBpbnRlcnZhbCkge1xuXG5cdGlmIChTTVNRdWV1ZS5kZWJ1Zykge1xuXHRcdGNvbnNvbGUubG9nKCdTTVNRdWV1ZTogU2VuZCB3b3JrZXIgc3RhcnRlZCwgdXNpbmcgaW50ZXJ2YWw6ICcgKyBpbnRlcnZhbCk7XG5cdH1cblxuXHRyZXR1cm4gTWV0ZW9yLnNldEludGVydmFsKGZ1bmN0aW9uKCkge1xuXHRcdHRyeSB7XG5cdFx0XHR0YXNrKCk7XG5cdFx0fSBjYXRjaCAoZXJyb3IpIHtcblx0XHRcdGlmIChTTVNRdWV1ZS5kZWJ1Zykge1xuXHRcdFx0XHRjb25zb2xlLmxvZygnU01TUXVldWU6IEVycm9yIHdoaWxlIHNlbmRpbmc6ICcgKyBlcnJvci5tZXNzYWdlKTtcblx0XHRcdH1cblx0XHR9XG5cdH0sIGludGVydmFsKTtcbn07XG5cblxuXG4vKlxuXHRvcHRpb25zOiB7XG5cdFx0Ly8gQ29udHJvbHMgdGhlIHNlbmRpbmcgaW50ZXJ2YWxcblx0XHRzZW5kSW50ZXJ2YWw6IE1hdGNoLk9wdGlvbmFsKE51bWJlciksXG5cdFx0Ly8gQ29udHJvbHMgdGhlIHNlbmRpbmcgYmF0Y2ggc2l6ZSBwZXIgaW50ZXJ2YWxcblx0XHRzZW5kQmF0Y2hTaXplOiBNYXRjaC5PcHRpb25hbChOdW1iZXIpLFxuXHRcdC8vIEFsbG93IG9wdGlvbmFsIGtlZXBpbmcgbm90aWZpY2F0aW9ucyBpbiBjb2xsZWN0aW9uXG5cdFx0a2VlcFNNUzogTWF0Y2guT3B0aW9uYWwoQm9vbGVhbilcblx0fVxuKi9cblNNU1F1ZXVlLkNvbmZpZ3VyZSA9IGZ1bmN0aW9uKG9wdGlvbnMpIHtcblx0dmFyIHNlbGYgPSB0aGlzO1xuXHRvcHRpb25zID0gXy5leHRlbmQoe1xuXHRcdHNlbmRUaW1lb3V0OiA2MDAwMCwgLy8gVGltZW91dCBwZXJpb2QgZm9yIHNtcyBzZW5kXG5cdH0sIG9wdGlvbnMpO1xuXG5cdC8vIEJsb2NrIG11bHRpcGxlIGNhbGxzXG5cdGlmIChpc0NvbmZpZ3VyZWQpIHtcblx0XHR0aHJvdyBuZXcgRXJyb3IoJ1NNU1F1ZXVlLkNvbmZpZ3VyZSBzaG91bGQgbm90IGJlIGNhbGxlZCBtb3JlIHRoYW4gb25jZSEnKTtcblx0fVxuXG5cdGlzQ29uZmlndXJlZCA9IHRydWU7XG5cblx0Ly8gQWRkIGRlYnVnIGluZm9cblx0aWYgKFNNU1F1ZXVlLmRlYnVnKSB7XG5cdFx0Y29uc29sZS5sb2coJ1NNU1F1ZXVlLkNvbmZpZ3VyZScsIG9wdGlvbnMpO1xuXHR9XG5cblx0dmFyIFNNUyA9IHJlcXVpcmUoJ2FsaXl1bi1zbXMtbm9kZScpLFxuXHRzbXNTZW5kZXI7XG5cblx0c21zU2VuZGVyID0gbmV3IFNNUyh7XG5cdFx0QWNjZXNzS2V5SWQ6IG9wdGlvbnMuYWNjZXNzS2V5SWQsXG5cdFx0QWNjZXNzS2V5U2VjcmV0OiBvcHRpb25zLmFjY2Vzc0tleVNlY3JldFxuXHR9KTtcblxuXHRzZWxmLnNlbmRTTVMgPSBmdW5jdGlvbihzbXMpIHtcblx0XHRpZiAoU01TUXVldWUuZGVidWcpIHtcblx0XHRcdGNvbnNvbGUubG9nKFwic2VuZFNNU1wiKTtcblx0XHRcdGNvbnNvbGUubG9nKHNtcyk7XG5cdFx0fVxuXG5cdFx0c21zU2VuZGVyLnNlbmQoc21zLnNtcykuY2F0Y2goZXJyID0+IHtcblx0XHRcdGNvbnNvbGUuZXJyb3IoZXJyKVxuXHRcdH0pO1xuXHR9XG5cblx0Ly8gVW5pdmVyc2FsIHNlbmQgZnVuY3Rpb25cblx0dmFyIF9xdWVyeVNlbmQgPSBmdW5jdGlvbihvcHRpb25zKSB7XG5cblx0XHRpZiAoc2VsZi5zZW5kU01TKSB7XG5cdFx0XHRzZWxmLnNlbmRTTVMob3B0aW9ucyk7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIHtcblx0XHRcdHNtczogW29wdGlvbnMuX2lkXVxuXHRcdH07XG5cdH07XG5cblx0c2VsZi5zZXJ2ZXJTZW5kID0gZnVuY3Rpb24ob3B0aW9ucykge1xuXHRcdG9wdGlvbnMgPSBvcHRpb25zIHx8IHt9O1xuXHRcdHJldHVybiBfcXVlcnlTZW5kKG9wdGlvbnMpO1xuXHR9O1xuXG5cblx0Ly8gVGhpcyBpbnRlcnZhbCB3aWxsIGFsbG93IG9ubHkgb25lIHNtcyB0byBiZSBzZW50IGF0IGEgdGltZSwgaXRcblx0Ly8gd2lsbCBjaGVjayBmb3IgbmV3IHNtcyBhdCBldmVyeSBgb3B0aW9ucy5zZW5kSW50ZXJ2YWxgXG5cdC8vIChkZWZhdWx0IGludGVydmFsIGlzIDE1MDAwIG1zKVxuXHQvL1xuXHQvLyBJdCBsb29rcyBpbiBzbXMgY29sbGVjdGlvbiB0byBzZWUgaWYgdGhlcmVzIGFueSBwZW5kaW5nXG5cdC8vIHNtcywgaWYgc28gaXQgd2lsbCB0cnkgdG8gcmVzZXJ2ZSB0aGUgcGVuZGluZyBzbXMuXG5cdC8vIElmIHN1Y2Nlc3NmdWxseSByZXNlcnZlZCB0aGUgc2VuZCBpcyBzdGFydGVkLlxuXHQvL1xuXHQvLyBJZiBzbXMucXVlcnkgaXMgdHlwZSBzdHJpbmcsIGl0J3MgYXNzdW1lZCB0byBiZSBhIGpzb24gc3RyaW5nXG5cdC8vIHZlcnNpb24gb2YgdGhlIHF1ZXJ5IHNlbGVjdG9yLiBNYWtpbmcgaXQgYWJsZSB0byBjYXJyeSBgJGAgcHJvcGVydGllcyBpblxuXHQvLyB0aGUgbW9uZ28gY29sbGVjdGlvbi5cblx0Ly9cblx0Ly8gUHIuIGRlZmF1bHQgc21zIGFyZSByZW1vdmVkIGZyb20gdGhlIGNvbGxlY3Rpb24gYWZ0ZXIgc2VuZCBoYXZlXG5cdC8vIGNvbXBsZXRlZC4gU2V0dGluZyBgb3B0aW9ucy5rZWVwU01TYCB3aWxsIHVwZGF0ZSBhbmQga2VlcCB0aGVcblx0Ly8gc21zIGVnLiBpZiBuZWVkZWQgZm9yIGhpc3RvcmljYWwgcmVhc29ucy5cblx0Ly9cblx0Ly8gQWZ0ZXIgdGhlIHNlbmQgaGF2ZSBjb21wbGV0ZWQgYSBcInNlbmRcIiBldmVudCB3aWxsIGJlIGVtaXR0ZWQgd2l0aCBhXG5cdC8vIHN0YXR1cyBvYmplY3QgY29udGFpbmluZyBzbXMgaWQgYW5kIHRoZSBzZW5kIHJlc3VsdCBvYmplY3QuXG5cdC8vXG5cdHZhciBpc1NlbmRpbmcgPSBmYWxzZTtcblxuXHRpZiAob3B0aW9ucy5zZW5kSW50ZXJ2YWwgIT09IG51bGwpIHtcblxuXHRcdC8vIFRoaXMgd2lsbCByZXF1aXJlIGluZGV4IHNpbmNlIHdlIHNvcnQgc21zIGJ5IGNyZWF0ZWRBdFxuXHRcdFNNU1F1ZXVlLmNvbGxlY3Rpb24uX2Vuc3VyZUluZGV4KHtcblx0XHRcdGNyZWF0ZWRBdDogMVxuXHRcdH0pO1xuXHRcdFNNU1F1ZXVlLmNvbGxlY3Rpb24uX2Vuc3VyZUluZGV4KHtcblx0XHRcdHNlbnQ6IDFcblx0XHR9KTtcblx0XHRTTVNRdWV1ZS5jb2xsZWN0aW9uLl9lbnN1cmVJbmRleCh7XG5cdFx0XHRzZW5kaW5nOiAxXG5cdFx0fSk7XG5cblxuXHRcdHZhciBzZW5kU01TID0gZnVuY3Rpb24oc21zKSB7XG5cdFx0XHQvLyBSZXNlcnZlIHNtc1xuXHRcdFx0dmFyIG5vdyA9ICtuZXcgRGF0ZSgpO1xuXHRcdFx0dmFyIHRpbWVvdXRBdCA9IG5vdyArIG9wdGlvbnMuc2VuZFRpbWVvdXQ7XG5cdFx0XHR2YXIgcmVzZXJ2ZWQgPSBTTVNRdWV1ZS5jb2xsZWN0aW9uLnVwZGF0ZSh7XG5cdFx0XHRcdF9pZDogc21zLl9pZCxcblx0XHRcdFx0c2VudDogZmFsc2UsIC8vIHh4eDogbmVlZCB0byBtYWtlIHN1cmUgdGhpcyBpcyBzZXQgb24gY3JlYXRlXG5cdFx0XHRcdHNlbmRpbmc6IHtcblx0XHRcdFx0XHQkbHQ6IG5vd1xuXHRcdFx0XHR9XG5cdFx0XHR9LCB7XG5cdFx0XHRcdCRzZXQ6IHtcblx0XHRcdFx0XHRzZW5kaW5nOiB0aW1lb3V0QXQsXG5cdFx0XHRcdH1cblx0XHRcdH0pO1xuXG5cdFx0XHQvLyBNYWtlIHN1cmUgd2Ugb25seSBoYW5kbGUgc21zIHJlc2VydmVkIGJ5IHRoaXNcblx0XHRcdC8vIGluc3RhbmNlXG5cdFx0XHRpZiAocmVzZXJ2ZWQpIHtcblxuXHRcdFx0XHQvLyBTZW5kIHRoZSBzbXNcblx0XHRcdFx0dmFyIHJlc3VsdCA9IFNNU1F1ZXVlLnNlcnZlclNlbmQoc21zKTtcblxuXHRcdFx0XHRpZiAoIW9wdGlvbnMua2VlcFNNUykge1xuXHRcdFx0XHRcdC8vIFByLiBEZWZhdWx0IHdlIHdpbGwgcmVtb3ZlIHNtc1xuXHRcdFx0XHRcdFNNU1F1ZXVlLmNvbGxlY3Rpb24ucmVtb3ZlKHtcblx0XHRcdFx0XHRcdF9pZDogc21zLl9pZFxuXHRcdFx0XHRcdH0pO1xuXHRcdFx0XHR9IGVsc2Uge1xuXG5cdFx0XHRcdFx0Ly8gVXBkYXRlIHRoZSBzbXNcblx0XHRcdFx0XHRTTVNRdWV1ZS5jb2xsZWN0aW9uLnVwZGF0ZSh7XG5cdFx0XHRcdFx0XHRfaWQ6IHNtcy5faWRcblx0XHRcdFx0XHR9LCB7XG5cdFx0XHRcdFx0XHQkc2V0OiB7XG5cdFx0XHRcdFx0XHRcdC8vIE1hcmsgYXMgc2VudFxuXHRcdFx0XHRcdFx0XHRzZW50OiB0cnVlLFxuXHRcdFx0XHRcdFx0XHQvLyBTZXQgdGhlIHNlbnQgZGF0ZVxuXHRcdFx0XHRcdFx0XHRzZW50QXQ6IG5ldyBEYXRlKCksXG5cdFx0XHRcdFx0XHRcdC8vIE5vdCBiZWluZyBzZW50IGFueW1vcmVcblx0XHRcdFx0XHRcdFx0c2VuZGluZzogMFxuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH0pO1xuXG5cdFx0XHRcdH1cblxuXHRcdFx0XHQvLyBFbWl0IHRoZSBzZW5kXG5cdFx0XHRcdHNlbGYuZW1pdCgnc2VuZCcsIHtcblx0XHRcdFx0XHRzbXM6IHNtcy5faWQsXG5cdFx0XHRcdFx0cmVzdWx0OiByZXN1bHRcblx0XHRcdFx0fSk7XG5cblx0XHRcdH0gLy8gRWxzZSBjb3VsZCBub3QgcmVzZXJ2ZVxuXHRcdH07IC8vIEVPIHNlbmRTTVNcblxuXHRcdHNlbmRXb3JrZXIoZnVuY3Rpb24oKSB7XG5cblx0XHRcdGlmIChpc1NlbmRpbmcpIHtcblx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0fVxuXHRcdFx0Ly8gU2V0IHNlbmQgZmVuY2Vcblx0XHRcdGlzU2VuZGluZyA9IHRydWU7XG5cblx0XHRcdHZhciBiYXRjaFNpemUgPSBvcHRpb25zLnNlbmRCYXRjaFNpemUgfHwgMTtcblxuXHRcdFx0dmFyIG5vdyA9ICtuZXcgRGF0ZSgpO1xuXG5cdFx0XHQvLyBGaW5kIHNtcyB0aGF0IGFyZSBub3QgYmVpbmcgb3IgYWxyZWFkeSBzZW50XG5cdFx0XHR2YXIgcGVuZGluZ1NNUyA9IFNNU1F1ZXVlLmNvbGxlY3Rpb24uZmluZCh7XG5cdFx0XHRcdCRhbmQ6IFtcblx0XHRcdFx0XHQvLyBNZXNzYWdlIGlzIG5vdCBzZW50XG5cdFx0XHRcdFx0e1xuXHRcdFx0XHRcdFx0c2VudDogZmFsc2Vcblx0XHRcdFx0XHR9LFxuXHRcdFx0XHRcdC8vIEFuZCBub3QgYmVpbmcgc2VudCBieSBvdGhlciBpbnN0YW5jZXNcblx0XHRcdFx0XHR7XG5cdFx0XHRcdFx0XHRzZW5kaW5nOiB7XG5cdFx0XHRcdFx0XHRcdCRsdDogbm93XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRdXG5cdFx0XHR9LCB7XG5cdFx0XHRcdC8vIFNvcnQgYnkgY3JlYXRlZCBkYXRlXG5cdFx0XHRcdHNvcnQ6IHtcblx0XHRcdFx0XHRjcmVhdGVkQXQ6IDFcblx0XHRcdFx0fSxcblx0XHRcdFx0bGltaXQ6IGJhdGNoU2l6ZVxuXHRcdFx0fSk7XG5cblx0XHRcdHBlbmRpbmdTTVMuZm9yRWFjaChmdW5jdGlvbihzbXMpIHtcblx0XHRcdFx0dHJ5IHtcblx0XHRcdFx0XHRzZW5kU01TKHNtcyk7XG5cdFx0XHRcdH0gY2F0Y2ggKGVycm9yKSB7XG5cblx0XHRcdFx0XHRpZiAoU01TUXVldWUuZGVidWcpIHtcblx0XHRcdFx0XHRcdGNvbnNvbGUubG9nKCdTTVNRdWV1ZTogQ291bGQgbm90IHNlbmQgc21zIGlkOiBcIicgKyBzbXMuX2lkICsgJ1wiLCBFcnJvcjogJyArIGVycm9yLm1lc3NhZ2UpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fSk7IC8vIEVPIGZvckVhY2hcblxuXHRcdFx0Ly8gUmVtb3ZlIHRoZSBzZW5kIGZlbmNlXG5cdFx0XHRpc1NlbmRpbmcgPSBmYWxzZTtcblx0XHR9LCBvcHRpb25zLnNlbmRJbnRlcnZhbCB8fCAxNTAwMCk7IC8vIERlZmF1bHQgZXZlcnkgMTV0aCBzZWNcblxuXHR9IGVsc2Uge1xuXHRcdGlmIChTTVNRdWV1ZS5kZWJ1Zykge1xuXHRcdFx0Y29uc29sZS5sb2coJ1NNU1F1ZXVlOiBTZW5kIHNlcnZlciBpcyBkaXNhYmxlZCcpO1xuXHRcdH1cblx0fVxuXG59OyIsInZhciBpc0NvbmZpZ3VyZWQgPSBmYWxzZTtcbnZhciByZXF1ZXN0ID0gcmVxdWlyZSgnc3VwZXJhZ2VudCcpO1xuXG52YXIgc2VuZFdvcmtlciA9IGZ1bmN0aW9uKHRhc2ssIGludGVydmFsKSB7XG5cblx0aWYgKFdlYlNlcnZpY2VTTVNRdWV1ZS5kZWJ1Zykge1xuXHRcdGNvbnNvbGUubG9nKCdXZWJTZXJ2aWNlU01TUXVldWU6IFNlbmQgd29ya2VyIHN0YXJ0ZWQsIHVzaW5nIGludGVydmFsOiAnICsgaW50ZXJ2YWwpO1xuXHR9XG5cblx0cmV0dXJuIE1ldGVvci5zZXRJbnRlcnZhbChmdW5jdGlvbigpIHtcblx0XHR0cnkge1xuXHRcdFx0dGFzaygpO1xuXHRcdH0gY2F0Y2ggKGVycm9yKSB7XG5cdFx0XHRpZiAoV2ViU2VydmljZVNNU1F1ZXVlLmRlYnVnKSB7XG5cdFx0XHRcdGNvbnNvbGUubG9nKCdXZWJTZXJ2aWNlU01TUXVldWU6IEVycm9yIHdoaWxlIHNlbmRpbmc6ICcgKyBlcnJvci5tZXNzYWdlKTtcblx0XHRcdH1cblx0XHR9XG5cdH0sIGludGVydmFsKTtcbn07XG5cblxudmFyIHNlbmRUb1dlYlNlcnZpY2UgPSBmdW5jdGlvbihkb2MsIHVybCwgc3BhY2VUb2tlbiwgc2lnbm5hbWUpe1xuXHR2YXIgbWVzc2FnZSA9IF8uY2xvbmUoZG9jKTtcblx0bWVzc2FnZS5zaWdubmFtZSA9IHNpZ25uYW1lO1xuXHRkZWxldGUgbWVzc2FnZS5faWQ7XG5cdHJlcXVlc3Rcblx0XHQucG9zdCh1cmwpXG5cdFx0LnNlbmQobWVzc2FnZSlcblx0XHQuc2V0KCdBdXRob3JpemF0aW9uJywgJ0JlYXJlciAnICsgc3BhY2VUb2tlbilcblx0XHQuZW5kKGZ1bmN0aW9uKGVyciwgcmVzKSB7XG5cdFx0XHRpZiAoZXJyKSB7XG5cdFx0XHRcdHJldHVybiBjb25zb2xlLmVycm9yKGVycik7XG5cdFx0XHR9XG5cdFx0fSk7XG59XG5cbi8qXG5cdG9wdGlvbnM6IHtcblx0XHQvLyBDb250cm9scyB0aGUgc2VuZGluZyBpbnRlcnZhbFxuXHRcdHNlbmRJbnRlcnZhbDogTWF0Y2guT3B0aW9uYWwoTnVtYmVyKSxcblx0XHQvLyBDb250cm9scyB0aGUgc2VuZGluZyBiYXRjaCBzaXplIHBlciBpbnRlcnZhbFxuXHRcdHNlbmRCYXRjaFNpemU6IE1hdGNoLk9wdGlvbmFsKE51bWJlciksXG5cdFx0Ly8gQWxsb3cgb3B0aW9uYWwga2VlcGluZyBub3RpZmljYXRpb25zIGluIGNvbGxlY3Rpb25cblx0XHRrZWVwU01TOiBNYXRjaC5PcHRpb25hbChCb29sZWFuKVxuXHR9XG4qL1xuV2ViU2VydmljZVNNU1F1ZXVlLkNvbmZpZ3VyZSA9IGZ1bmN0aW9uKG9wdGlvbnMpIHtcblx0dmFyIHNlbGYgPSB0aGlzO1xuXHRvcHRpb25zID0gXy5leHRlbmQoe1xuXHRcdHNlbmRUaW1lb3V0OiA2MDAwMCwgLy8gVGltZW91dCBwZXJpb2QgZm9yIHNtcyBzZW5kXG5cdH0sIG9wdGlvbnMpO1xuXG5cdC8vIEJsb2NrIG11bHRpcGxlIGNhbGxzXG5cdGlmIChpc0NvbmZpZ3VyZWQpIHtcblx0XHR0aHJvdyBuZXcgRXJyb3IoJ1dlYlNlcnZpY2VTTVNRdWV1ZS5Db25maWd1cmUgc2hvdWxkIG5vdCBiZSBjYWxsZWQgbW9yZSB0aGFuIG9uY2UhJyk7XG5cdH1cblxuXHRpc0NvbmZpZ3VyZWQgPSB0cnVlO1xuXG5cdC8vIEFkZCBkZWJ1ZyBpbmZvXG5cdGlmIChXZWJTZXJ2aWNlU01TUXVldWUuZGVidWcpIHtcblx0XHRjb25zb2xlLmxvZygnV2ViU2VydmljZVNNU1F1ZXVlLkNvbmZpZ3VyZScsIG9wdGlvbnMpO1xuXHR9XG5cblx0dmFyIHVybCA9IG9wdGlvbnMudXJsO1xuXHR2YXIgc3BhY2VUb2tlbiA9IG9wdGlvbnMuc3BhY2VUb2tlbjtcblx0dmFyIHNpZ25uYW1lID0gb3B0aW9ucy5zaWdubmFtZTtcblxuXHRzZWxmLnNlbmRTTVMgPSBmdW5jdGlvbihzbXMpIHtcblx0XHRpZiAoV2ViU2VydmljZVNNU1F1ZXVlLmRlYnVnKSB7XG5cdFx0XHRjb25zb2xlLmxvZyhcInNlbmRTTVNcIik7XG5cdFx0XHRjb25zb2xlLmxvZyhzbXMpO1xuXHRcdH1cblx0XHRzZW5kVG9XZWJTZXJ2aWNlKHNtcywgdXJsLCBzcGFjZVRva2VuLCBzaWdubmFtZSlcblx0fVxuXG5cdC8vIFVuaXZlcnNhbCBzZW5kIGZ1bmN0aW9uXG5cdHZhciBfcXVlcnlTZW5kID0gZnVuY3Rpb24ob3B0aW9ucykge1xuXG5cdFx0aWYgKHNlbGYuc2VuZFNNUykge1xuXHRcdFx0c2VsZi5zZW5kU01TKG9wdGlvbnMpO1xuXHRcdH1cblxuXHRcdHJldHVybiB7XG5cdFx0XHRzbXM6IFtvcHRpb25zLl9pZF1cblx0XHR9O1xuXHR9O1xuXG5cdHNlbGYuc2VydmVyU2VuZCA9IGZ1bmN0aW9uKG9wdGlvbnMpIHtcblx0XHRvcHRpb25zID0gb3B0aW9ucyB8fCB7fTtcblx0XHRyZXR1cm4gX3F1ZXJ5U2VuZChvcHRpb25zKTtcblx0fTtcblxuXG5cdC8vIFRoaXMgaW50ZXJ2YWwgd2lsbCBhbGxvdyBvbmx5IG9uZSBzbXMgdG8gYmUgc2VudCBhdCBhIHRpbWUsIGl0XG5cdC8vIHdpbGwgY2hlY2sgZm9yIG5ldyBzbXMgYXQgZXZlcnkgYG9wdGlvbnMuc2VuZEludGVydmFsYFxuXHQvLyAoZGVmYXVsdCBpbnRlcnZhbCBpcyAxNTAwMCBtcylcblx0Ly9cblx0Ly8gSXQgbG9va3MgaW4gc21zIGNvbGxlY3Rpb24gdG8gc2VlIGlmIHRoZXJlcyBhbnkgcGVuZGluZ1xuXHQvLyBzbXMsIGlmIHNvIGl0IHdpbGwgdHJ5IHRvIHJlc2VydmUgdGhlIHBlbmRpbmcgc21zLlxuXHQvLyBJZiBzdWNjZXNzZnVsbHkgcmVzZXJ2ZWQgdGhlIHNlbmQgaXMgc3RhcnRlZC5cblx0Ly9cblx0Ly8gSWYgc21zLnF1ZXJ5IGlzIHR5cGUgc3RyaW5nLCBpdCdzIGFzc3VtZWQgdG8gYmUgYSBqc29uIHN0cmluZ1xuXHQvLyB2ZXJzaW9uIG9mIHRoZSBxdWVyeSBzZWxlY3Rvci4gTWFraW5nIGl0IGFibGUgdG8gY2FycnkgYCRgIHByb3BlcnRpZXMgaW5cblx0Ly8gdGhlIG1vbmdvIGNvbGxlY3Rpb24uXG5cdC8vXG5cdC8vIFByLiBkZWZhdWx0IHNtcyBhcmUgcmVtb3ZlZCBmcm9tIHRoZSBjb2xsZWN0aW9uIGFmdGVyIHNlbmQgaGF2ZVxuXHQvLyBjb21wbGV0ZWQuIFNldHRpbmcgYG9wdGlvbnMua2VlcFNNU2Agd2lsbCB1cGRhdGUgYW5kIGtlZXAgdGhlXG5cdC8vIHNtcyBlZy4gaWYgbmVlZGVkIGZvciBoaXN0b3JpY2FsIHJlYXNvbnMuXG5cdC8vXG5cdC8vIEFmdGVyIHRoZSBzZW5kIGhhdmUgY29tcGxldGVkIGEgXCJzZW5kXCIgZXZlbnQgd2lsbCBiZSBlbWl0dGVkIHdpdGggYVxuXHQvLyBzdGF0dXMgb2JqZWN0IGNvbnRhaW5pbmcgc21zIGlkIGFuZCB0aGUgc2VuZCByZXN1bHQgb2JqZWN0LlxuXHQvL1xuXHR2YXIgaXNTZW5kaW5nID0gZmFsc2U7XG5cblx0aWYgKG9wdGlvbnMuc2VuZEludGVydmFsICE9PSBudWxsKSB7XG5cblx0XHQvLyBUaGlzIHdpbGwgcmVxdWlyZSBpbmRleCBzaW5jZSB3ZSBzb3J0IHNtcyBieSBjcmVhdGVkQXRcblx0XHRXZWJTZXJ2aWNlU01TUXVldWUuY29sbGVjdGlvbi5fZW5zdXJlSW5kZXgoe1xuXHRcdFx0Y3JlYXRlZEF0OiAxXG5cdFx0fSk7XG5cdFx0V2ViU2VydmljZVNNU1F1ZXVlLmNvbGxlY3Rpb24uX2Vuc3VyZUluZGV4KHtcblx0XHRcdHNlbnQ6IDFcblx0XHR9KTtcblx0XHRXZWJTZXJ2aWNlU01TUXVldWUuY29sbGVjdGlvbi5fZW5zdXJlSW5kZXgoe1xuXHRcdFx0c2VuZGluZzogMVxuXHRcdH0pO1xuXG5cblx0XHR2YXIgc2VuZFNNUyA9IGZ1bmN0aW9uKHNtcykge1xuXHRcdFx0Ly8gUmVzZXJ2ZSBzbXNcblx0XHRcdHZhciBub3cgPSArbmV3IERhdGUoKTtcblx0XHRcdHZhciB0aW1lb3V0QXQgPSBub3cgKyBvcHRpb25zLnNlbmRUaW1lb3V0O1xuXHRcdFx0dmFyIHJlc2VydmVkID0gV2ViU2VydmljZVNNU1F1ZXVlLmNvbGxlY3Rpb24udXBkYXRlKHtcblx0XHRcdFx0X2lkOiBzbXMuX2lkLFxuXHRcdFx0XHRzZW50OiBmYWxzZSwgLy8geHh4OiBuZWVkIHRvIG1ha2Ugc3VyZSB0aGlzIGlzIHNldCBvbiBjcmVhdGVcblx0XHRcdFx0c2VuZGluZzoge1xuXHRcdFx0XHRcdCRsdDogbm93XG5cdFx0XHRcdH1cblx0XHRcdH0sIHtcblx0XHRcdFx0JHNldDoge1xuXHRcdFx0XHRcdHNlbmRpbmc6IHRpbWVvdXRBdCxcblx0XHRcdFx0fVxuXHRcdFx0fSk7XG5cblx0XHRcdC8vIE1ha2Ugc3VyZSB3ZSBvbmx5IGhhbmRsZSBzbXMgcmVzZXJ2ZWQgYnkgdGhpc1xuXHRcdFx0Ly8gaW5zdGFuY2Vcblx0XHRcdGlmIChyZXNlcnZlZCkge1xuXG5cdFx0XHRcdC8vIFNlbmQgdGhlIHNtc1xuXHRcdFx0XHR2YXIgcmVzdWx0ID0gV2ViU2VydmljZVNNU1F1ZXVlLnNlcnZlclNlbmQoc21zKTtcblxuXHRcdFx0XHRpZiAoIW9wdGlvbnMua2VlcFNNUykge1xuXHRcdFx0XHRcdC8vIFByLiBEZWZhdWx0IHdlIHdpbGwgcmVtb3ZlIHNtc1xuXHRcdFx0XHRcdFdlYlNlcnZpY2VTTVNRdWV1ZS5jb2xsZWN0aW9uLnJlbW92ZSh7XG5cdFx0XHRcdFx0XHRfaWQ6IHNtcy5faWRcblx0XHRcdFx0XHR9KTtcblx0XHRcdFx0fSBlbHNlIHtcblxuXHRcdFx0XHRcdC8vIFVwZGF0ZSB0aGUgc21zXG5cdFx0XHRcdFx0V2ViU2VydmljZVNNU1F1ZXVlLmNvbGxlY3Rpb24udXBkYXRlKHtcblx0XHRcdFx0XHRcdF9pZDogc21zLl9pZFxuXHRcdFx0XHRcdH0sIHtcblx0XHRcdFx0XHRcdCRzZXQ6IHtcblx0XHRcdFx0XHRcdFx0Ly8gTWFyayBhcyBzZW50XG5cdFx0XHRcdFx0XHRcdHNlbnQ6IHRydWUsXG5cdFx0XHRcdFx0XHRcdC8vIFNldCB0aGUgc2VudCBkYXRlXG5cdFx0XHRcdFx0XHRcdHNlbnRBdDogbmV3IERhdGUoKSxcblx0XHRcdFx0XHRcdFx0Ly8gTm90IGJlaW5nIHNlbnQgYW55bW9yZVxuXHRcdFx0XHRcdFx0XHRzZW5kaW5nOiAwXG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fSk7XG5cblx0XHRcdFx0fVxuXG5cdFx0XHRcdC8vIEVtaXQgdGhlIHNlbmRcblx0XHRcdFx0c2VsZi5lbWl0KCdzZW5kJywge1xuXHRcdFx0XHRcdHNtczogc21zLl9pZCxcblx0XHRcdFx0XHRyZXN1bHQ6IHJlc3VsdFxuXHRcdFx0XHR9KTtcblxuXHRcdFx0fSAvLyBFbHNlIGNvdWxkIG5vdCByZXNlcnZlXG5cdFx0fTsgLy8gRU8gc2VuZFNNU1xuXG5cdFx0c2VuZFdvcmtlcihmdW5jdGlvbigpIHtcblxuXHRcdFx0aWYgKGlzU2VuZGluZykge1xuXHRcdFx0XHRyZXR1cm47XG5cdFx0XHR9XG5cdFx0XHQvLyBTZXQgc2VuZCBmZW5jZVxuXHRcdFx0aXNTZW5kaW5nID0gdHJ1ZTtcblxuXHRcdFx0dmFyIGJhdGNoU2l6ZSA9IG9wdGlvbnMuc2VuZEJhdGNoU2l6ZSB8fCAxO1xuXG5cdFx0XHR2YXIgbm93ID0gK25ldyBEYXRlKCk7XG5cblx0XHRcdC8vIEZpbmQgc21zIHRoYXQgYXJlIG5vdCBiZWluZyBvciBhbHJlYWR5IHNlbnRcblx0XHRcdHZhciBwZW5kaW5nU01TID0gV2ViU2VydmljZVNNU1F1ZXVlLmNvbGxlY3Rpb24uZmluZCh7XG5cdFx0XHRcdCRhbmQ6IFtcblx0XHRcdFx0XHQvLyBNZXNzYWdlIGlzIG5vdCBzZW50XG5cdFx0XHRcdFx0e1xuXHRcdFx0XHRcdFx0c2VudDogZmFsc2Vcblx0XHRcdFx0XHR9LFxuXHRcdFx0XHRcdC8vIEFuZCBub3QgYmVpbmcgc2VudCBieSBvdGhlciBpbnN0YW5jZXNcblx0XHRcdFx0XHR7XG5cdFx0XHRcdFx0XHRzZW5kaW5nOiB7XG5cdFx0XHRcdFx0XHRcdCRsdDogbm93XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRdXG5cdFx0XHR9LCB7XG5cdFx0XHRcdC8vIFNvcnQgYnkgY3JlYXRlZCBkYXRlXG5cdFx0XHRcdHNvcnQ6IHtcblx0XHRcdFx0XHRjcmVhdGVkQXQ6IDFcblx0XHRcdFx0fSxcblx0XHRcdFx0bGltaXQ6IGJhdGNoU2l6ZVxuXHRcdFx0fSk7XG5cblx0XHRcdHBlbmRpbmdTTVMuZm9yRWFjaChmdW5jdGlvbihzbXMpIHtcblx0XHRcdFx0dHJ5IHtcblx0XHRcdFx0XHRzZW5kU01TKHNtcyk7XG5cdFx0XHRcdH0gY2F0Y2ggKGVycm9yKSB7XG5cblx0XHRcdFx0XHRpZiAoV2ViU2VydmljZVNNU1F1ZXVlLmRlYnVnKSB7XG5cdFx0XHRcdFx0XHRjb25zb2xlLmxvZygnV2ViU2VydmljZVNNU1F1ZXVlOiBDb3VsZCBub3Qgc2VuZCBzbXMgaWQ6IFwiJyArIHNtcy5faWQgKyAnXCIsIEVycm9yOiAnICsgZXJyb3IubWVzc2FnZSk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9KTsgLy8gRU8gZm9yRWFjaFxuXG5cdFx0XHQvLyBSZW1vdmUgdGhlIHNlbmQgZmVuY2Vcblx0XHRcdGlzU2VuZGluZyA9IGZhbHNlO1xuXHRcdH0sIG9wdGlvbnMuc2VuZEludGVydmFsIHx8IDE1MDAwKTsgLy8gRGVmYXVsdCBldmVyeSAxNXRoIHNlY1xuXG5cdH0gZWxzZSB7XG5cdFx0aWYgKFdlYlNlcnZpY2VTTVNRdWV1ZS5kZWJ1Zykge1xuXHRcdFx0Y29uc29sZS5sb2coJ1dlYlNlcnZpY2VTTVNRdWV1ZTogU2VuZCBzZXJ2ZXIgaXMgZGlzYWJsZWQnKTtcblx0XHR9XG5cdH1cblxufTsiLCJNZXRlb3Iuc3RhcnR1cCAtPlxuXHRpZiBNZXRlb3Iuc2V0dGluZ3Muc21zPy53ZWJzZXJ2aWNlPy5zbXNxdWV1ZV9pbnRlcnZhbCAmJiAoTWV0ZW9yLnNldHRpbmdzLnNtcz8uYWxpeXVuPy5zbXNxdWV1ZV9pbnRlcnZhbCB8fCBNZXRlb3Iuc2V0dGluZ3Muc21zPy5xY2xvdWQ/LnNtc3F1ZXVlX2ludGVydmFsKVxuXHRcdHRocm93IG5ldyBNZXRlb3IuRXJyb3IoJ3Ntcy53ZWJzZXJ2aWNlIGNhbm5vdCBiZSBjb25maWd1cmVkIHdpdGggc21zLmFsaXl1biBvciBzbXMucWNsb3VkJyk7XG5cblx0aWYgTWV0ZW9yLnNldHRpbmdzLnNtcz8uYWxpeXVuPy5zbXNxdWV1ZV9pbnRlcnZhbFxuXHRcdFNNU1F1ZXVlLkNvbmZpZ3VyZVxuXHRcdFx0c2VuZEludGVydmFsOiBNZXRlb3Iuc2V0dGluZ3Muc21zLmFsaXl1bi5zbXNxdWV1ZV9pbnRlcnZhbFxuXHRcdFx0c2VuZEJhdGNoU2l6ZTogMTBcblx0XHRcdGtlZXBTTVM6IHRydWVcblx0XHRcdGFjY2Vzc0tleUlkOiBNZXRlb3Iuc2V0dGluZ3Muc21zLmFsaXl1bi5hY2Nlc3NLZXlJZFxuXHRcdFx0YWNjZXNzS2V5U2VjcmV0OiBNZXRlb3Iuc2V0dGluZ3Muc21zLmFsaXl1bi5hY2Nlc3NLZXlTZWNyZXRcblxuXHRpZiBNZXRlb3Iuc2V0dGluZ3Muc21zPy53ZWJzZXJ2aWNlPy5zbXNxdWV1ZV9pbnRlcnZhbFxuXHRcdFdlYlNlcnZpY2VTTVNRdWV1ZS5Db25maWd1cmVcblx0XHRcdHNlbmRJbnRlcnZhbDogTWV0ZW9yLnNldHRpbmdzLnNtcy53ZWJzZXJ2aWNlLnNtc3F1ZXVlX2ludGVydmFsXG5cdFx0XHR1cmw6IE1ldGVvci5zZXR0aW5ncy5zbXMud2Vic2VydmljZS51cmxcblx0XHRcdHNwYWNlVG9rZW46IE1ldGVvci5zZXR0aW5ncy5zbXMud2Vic2VydmljZS5zcGFjZV90b2tlblxuXHRcdFx0c2lnbm5hbWU6IE1ldGVvci5zZXR0aW5ncy5zbXMud2Vic2VydmljZS5zaWdubmFtZVxuXHRcdFx0c2VuZEJhdGNoU2l6ZTogMTBcblx0XHRcdGtlZXBTTVM6IHRydWVcblxuXG5cbiIsIk1ldGVvci5zdGFydHVwKGZ1bmN0aW9uKCkge1xuICB2YXIgcmVmLCByZWYxLCByZWYyLCByZWYzLCByZWY0LCByZWY1LCByZWY2LCByZWY3LCByZWY4LCByZWY5O1xuICBpZiAoKChyZWYgPSBNZXRlb3Iuc2V0dGluZ3Muc21zKSAhPSBudWxsID8gKHJlZjEgPSByZWYud2Vic2VydmljZSkgIT0gbnVsbCA/IHJlZjEuc21zcXVldWVfaW50ZXJ2YWwgOiB2b2lkIDAgOiB2b2lkIDApICYmICgoKHJlZjIgPSBNZXRlb3Iuc2V0dGluZ3Muc21zKSAhPSBudWxsID8gKHJlZjMgPSByZWYyLmFsaXl1bikgIT0gbnVsbCA/IHJlZjMuc21zcXVldWVfaW50ZXJ2YWwgOiB2b2lkIDAgOiB2b2lkIDApIHx8ICgocmVmNCA9IE1ldGVvci5zZXR0aW5ncy5zbXMpICE9IG51bGwgPyAocmVmNSA9IHJlZjQucWNsb3VkKSAhPSBudWxsID8gcmVmNS5zbXNxdWV1ZV9pbnRlcnZhbCA6IHZvaWQgMCA6IHZvaWQgMCkpKSB7XG4gICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcignc21zLndlYnNlcnZpY2UgY2Fubm90IGJlIGNvbmZpZ3VyZWQgd2l0aCBzbXMuYWxpeXVuIG9yIHNtcy5xY2xvdWQnKTtcbiAgfVxuICBpZiAoKHJlZjYgPSBNZXRlb3Iuc2V0dGluZ3Muc21zKSAhPSBudWxsID8gKHJlZjcgPSByZWY2LmFsaXl1bikgIT0gbnVsbCA/IHJlZjcuc21zcXVldWVfaW50ZXJ2YWwgOiB2b2lkIDAgOiB2b2lkIDApIHtcbiAgICBTTVNRdWV1ZS5Db25maWd1cmUoe1xuICAgICAgc2VuZEludGVydmFsOiBNZXRlb3Iuc2V0dGluZ3Muc21zLmFsaXl1bi5zbXNxdWV1ZV9pbnRlcnZhbCxcbiAgICAgIHNlbmRCYXRjaFNpemU6IDEwLFxuICAgICAga2VlcFNNUzogdHJ1ZSxcbiAgICAgIGFjY2Vzc0tleUlkOiBNZXRlb3Iuc2V0dGluZ3Muc21zLmFsaXl1bi5hY2Nlc3NLZXlJZCxcbiAgICAgIGFjY2Vzc0tleVNlY3JldDogTWV0ZW9yLnNldHRpbmdzLnNtcy5hbGl5dW4uYWNjZXNzS2V5U2VjcmV0XG4gICAgfSk7XG4gIH1cbiAgaWYgKChyZWY4ID0gTWV0ZW9yLnNldHRpbmdzLnNtcykgIT0gbnVsbCA/IChyZWY5ID0gcmVmOC53ZWJzZXJ2aWNlKSAhPSBudWxsID8gcmVmOS5zbXNxdWV1ZV9pbnRlcnZhbCA6IHZvaWQgMCA6IHZvaWQgMCkge1xuICAgIHJldHVybiBXZWJTZXJ2aWNlU01TUXVldWUuQ29uZmlndXJlKHtcbiAgICAgIHNlbmRJbnRlcnZhbDogTWV0ZW9yLnNldHRpbmdzLnNtcy53ZWJzZXJ2aWNlLnNtc3F1ZXVlX2ludGVydmFsLFxuICAgICAgdXJsOiBNZXRlb3Iuc2V0dGluZ3Muc21zLndlYnNlcnZpY2UudXJsLFxuICAgICAgc3BhY2VUb2tlbjogTWV0ZW9yLnNldHRpbmdzLnNtcy53ZWJzZXJ2aWNlLnNwYWNlX3Rva2VuLFxuICAgICAgc2lnbm5hbWU6IE1ldGVvci5zZXR0aW5ncy5zbXMud2Vic2VydmljZS5zaWdubmFtZSxcbiAgICAgIHNlbmRCYXRjaFNpemU6IDEwLFxuICAgICAga2VlcFNNUzogdHJ1ZVxuICAgIH0pO1xuICB9XG59KTtcbiJdfQ==
