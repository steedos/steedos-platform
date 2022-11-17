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
var meteorInstall = Package.modules.meteorInstall;
var Promise = Package.promise.Promise;

/* Package-scope variables */
var Push, checkClientSecurity, _matchToken, _replaceToken, _removeToken, initPushUpdates;

var require = meteorInstall({"node_modules":{"meteor":{"raix:push":{"lib":{"common":{"main.js":function module(){

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                   //
// packages/raix_push/lib/common/main.js                                                                             //
//                                                                                                                   //
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                     //
// The push object is an event emitter
Push = new EventState(); // Client-side security warnings, used to check options

checkClientSecurity = function (options) {
  // Warn if certificates or keys are added here on client. We dont allow the
  // user to do this for security reasons.
  if (options.apn && options.apn.certData) {
    throw new Error('Push.init: Dont add your APN certificate in client code!');
  }

  if (options.apn && options.apn.keyData) {
    throw new Error('Push.init: Dont add your APN key in client code!');
  }

  if (options.apn && options.apn.passphrase) {
    throw new Error('Push.init: Dont add your APN passphrase in client code!');
  }

  if (options.gcm && options.gcm.apiKey) {
    throw new Error('Push.init: Dont add your GCM api key in client code!');
  }
}; // DEPRECATED


Push.init = function () {
  console.warn('Push.init have been deprecated in favor of "config.push.json" please migrate');
};
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"notifications.js":function module(){

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                   //
// packages/raix_push/lib/common/notifications.js                                                                    //
//                                                                                                                   //
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                     //
// This is the match pattern for tokens
_matchToken = Match.OneOf({
  apn: String
}, {
  gcm: String
}); // Notifications collection

Push.notifications = new Mongo.Collection('_raix_push_notifications'); // This is a general function to validate that the data added to notifications
// is in the correct format. If not this function will throw errors

var _validateDocument = function (notification) {
  // Check the general notification
  check(notification, {
    from: String,
    title: String,
    text: String,
    sent: Match.Optional(Boolean),
    sending: Match.Optional(Match.Integer),
    badge: Match.Optional(Match.Integer),
    sound: Match.Optional(String),
    notId: Match.Optional(Match.Integer),
    contentAvailable: Match.Optional(Match.Integer),
    forceStart: Match.Optional(Match.Integer),
    apn: Match.Optional({
      from: Match.Optional(String),
      title: Match.Optional(String),
      text: Match.Optional(String),
      badge: Match.Optional(Match.Integer),
      sound: Match.Optional(String),
      notId: Match.Optional(Match.Integer),
      category: Match.Optional(String)
    }),
    gcm: Match.Optional({
      from: Match.Optional(String),
      title: Match.Optional(String),
      text: Match.Optional(String),
      image: Match.Optional(String),
      style: Match.Optional(String),
      summaryText: Match.Optional(String),
      picture: Match.Optional(String),
      badge: Match.Optional(Match.Integer),
      sound: Match.Optional(String),
      notId: Match.Optional(Match.Integer),
      actions: Match.Optional([Match.Any])
    }),
    query: Match.Optional(String),
    token: Match.Optional(_matchToken),
    tokens: Match.Optional([_matchToken]),
    payload: Match.Optional(Object),
    delayUntil: Match.Optional(Date),
    createdAt: Date,
    createdBy: Match.OneOf(String, null)
  }); // Make sure a token selector or query have been set

  if (!notification.token && !notification.tokens && !notification.query) {
    throw new Error('No token selector or query found');
  } // If tokens array is set it should not be empty


  if (notification.tokens && !notification.tokens.length) {
    throw new Error('No tokens in array');
  }
};

Push.send = function (options) {
  // If on the client we set the user id - on the server we need an option
  // set or we default to "<SERVER>" as the creator of the notification
  // If current user not set see if we can set it to the logged in user
  // this will only run on the client if Meteor.userId is available
  var currentUser = Meteor.isClient && Meteor.userId && Meteor.userId() || Meteor.isServer && (options.createdBy || '<SERVER>') || null; // Rig the notification object

  var notification = _.extend({
    createdAt: new Date(),
    createdBy: currentUser
  }, _.pick(options, 'from', 'title', 'text')); // Add extra


  _.extend(notification, _.pick(options, 'payload', 'badge', 'sound', 'notId', 'delayUntil'));

  if (Match.test(options.apn, Object)) {
    notification.apn = _.pick(options.apn, 'from', 'title', 'text', 'badge', 'sound', 'notId', 'category');
  }

  if (Match.test(options.gcm, Object)) {
    notification.gcm = _.pick(options.gcm, 'image', 'style', 'summaryText', 'picture', 'from', 'title', 'text', 'badge', 'sound', 'notId', 'actions');
  } // Set one token selector, this can be token, array of tokens or query


  if (options.query) {
    // Set query to the json string version fixing #43 and #39
    notification.query = JSON.stringify(options.query);
  } else if (options.token) {
    // Set token
    notification.token = options.token;
  } else if (options.tokens) {
    // Set tokens
    notification.tokens = options.tokens;
  } //console.log(options);


  if (typeof options.contentAvailable !== 'undefined') {
    notification.contentAvailable = options.contentAvailable;
  }

  if (typeof options.forceStart !== 'undefined') {
    notification.forceStart = options.forceStart;
  }

  notification.sent = false;
  notification.sending = 0; // Validate the notification

  _validateDocument(notification); // Try to add the notification to send, we return an id to keep track


  return Push.notifications.insert(notification);
};

Push.allow = function (rules) {
  if (rules.send) {
    Push.notifications.allow({
      'insert': function (userId, notification) {
        // Validate the notification
        _validateDocument(notification); // Set the user defined "send" rules


        return rules.send.apply(this, [userId, notification]);
      }
    });
  }
};

Push.deny = function (rules) {
  if (rules.send) {
    Push.notifications.deny({
      'insert': function (userId, notification) {
        // Validate the notification
        _validateDocument(notification); // Set the user defined "send" rules


        return rules.send.apply(this, [userId, notification]);
      }
    });
  }
};
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}},"server":{"push.api.js":function module(require){

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                   //
// packages/raix_push/lib/server/push.api.js                                                                         //
//                                                                                                                   //
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                     //
/*
  A general purpose user CordovaPush
  ios, android, mail, twitter?, facebook?, sms?, snailMail? :)

  Phonegap generic :
  https://github.com/phonegap-build/PushPlugin
 */
// getText / getBinary
Push.setBadge = function ()
/* id, count */
{// throw new Error('Push.setBadge not implemented on the server');
};

var isConfigured = false;

var sendWorker = function (task, interval) {
  if (typeof Push.Log === 'function') {
    Push.Log('Push: Send worker started, using interval:', interval);
  }

  if (Push.debug) {
    console.log('Push: Send worker started, using interval: ' + interval);
  }

  return Meteor.setInterval(function () {
    // xxx: add exponential backoff on error
    try {
      task();
    } catch (error) {
      if (typeof Push.Log === 'function') {
        Push.Log('Push: Error while sending:', error.message);
      }

      if (Push.debug) {
        console.log('Push: Error while sending: ' + error.message);
      }
    }
  }, interval);
};

Push.Configure = function (options) {
  var self = this;
  options = _.extend({
    sendTimeout: 60000 // Timeout period for notification send

  }, options); // https://npmjs.org/package/apn
  // After requesting the certificate from Apple, export your private key as
  // a .p12 file anddownload the .cer file from the iOS Provisioning Portal.
  // gateway.push.apple.com, port 2195
  // gateway.sandbox.push.apple.com, port 2195
  // Now, in the directory containing cert.cer and key.p12 execute the
  // following commands to generate your .pem files:
  // $ openssl x509 -in cert.cer -inform DER -outform PEM -out cert.pem
  // $ openssl pkcs12 -in key.p12 -out key.pem -nodes
  // Block multiple calls

  if (isConfigured) {
    throw new Error('Push.Configure should not be called more than once!');
  }

  isConfigured = true; // Add debug info

  if (Push.debug) {
    console.log('Push.Configure', options);
  } // This function is called when a token is replaced on a device - normally
  // this should not happen, but if it does we should take action on it


  _replaceToken = function (currentToken, newToken) {
    // console.log('Replace token: ' + currentToken + ' -- ' + newToken);
    // If the server gets a token event its passing in the current token and
    // the new value - if new value is undefined this empty the token
    self.emitState('token', currentToken, newToken);
  }; // Rig the removeToken callback


  _removeToken = function (token) {
    // console.log('Remove token: ' + token);
    // Invalidate the token
    self.emitState('token', token, null);
  };

  if (options.apn) {
    if (Push.debug) {
      console.log('Push: APN configured');
    } // Allow production to be a general option for push notifications


    if (options.production === Boolean(options.production)) {
      options.apn.production = options.production;
    } // Give the user warnings about development settings


    if (options.apn.development) {
      // This flag is normally set by the configuration file
      console.warn('WARNING: Push APN is using development key and certificate');
    } else {
      // We check the apn gateway i the options, we could risk shipping
      // server into production while using the production configuration.
      // On the other hand we could be in development but using the production
      // configuration. And finally we could have configured an unknown apn
      // gateway (this could change in the future - but a warning about typos
      // can save hours of debugging)
      //
      // Warn about gateway configurations - it's more a guide
      if (options.apn.gateway) {
        if (options.apn.gateway === 'gateway.sandbox.push.apple.com') {
          // Using the development sandbox
          console.warn('WARNING: Push APN is in development mode');
        } else if (options.apn.gateway === 'gateway.push.apple.com') {
          // In production - but warn if we are running on localhost
          if (/http:\/\/localhost/.test(Meteor.absoluteUrl())) {
            console.warn('WARNING: Push APN is configured to production mode - but server is running' + ' from localhost');
          }
        } else {
          // Warn about gateways we dont know about
          console.warn('WARNING: Push APN unkown gateway "' + options.apn.gateway + '"');
        }
      } else {
        if (options.apn.production) {
          if (/http:\/\/localhost/.test(Meteor.absoluteUrl())) {
            console.warn('WARNING: Push APN is configured to production mode - but server is running' + ' from localhost');
          }
        } else {
          console.warn('WARNING: Push APN is in development mode');
        }
      }
    } // Check certificate data


    if (!options.apn.certData || !options.apn.certData.length) {
      console.error('ERROR: Push server could not find certData');
    } // Check key data


    if (!options.apn.keyData || !options.apn.keyData.length) {
      console.error('ERROR: Push server could not find keyData');
    } // Rig apn connection


    var apn = Npm.require('apn');

    var apnConnection = new apn.Connection(options.apn); // Listen to transmission errors - should handle the same way as feedback.

    apnConnection.on('transmissionError', Meteor.bindEnvironment(function (errCode, notification, recipient) {
      if (Push.debug) {
        console.log('Got error code %d for token %s', errCode, notification.token);
      }

      if ([2, 5, 8].indexOf(errCode) >= 0) {
        // Invalid token errors...
        _removeToken({
          apn: notification.token
        });
      }
    })); // XXX: should we do a test of the connection? It would be nice to know
    // That the server/certificates/network are correct configured
    // apnConnection.connect().then(function() {
    //     console.info('CHECK: Push APN connection OK');
    // }, function(err) {
    //     console.warn('CHECK: Push APN connection FAILURE');
    // });
    // Note: the above code spoils the connection - investigate how to
    // shutdown/close it.

    self.sendAPN = function (userToken, notification) {
      if (Match.test(notification.apn, Object)) {
        notification = _.extend({}, notification, notification.apn);
      } // console.log('sendAPN', notification.from, userToken, notification.title, notification.text,
      // notification.badge, notification.priority);


      var priority = notification.priority || notification.priority === 0 ? notification.priority : 10;
      var myDevice = new apn.Device(userToken);
      var note = new apn.Notification();
      note.expiry = Math.floor(Date.now() / 1000) + 3600; // Expires 1 hour from now.

      if (typeof notification.badge !== 'undefined') {
        note.badge = notification.badge;
      }

      if (typeof notification.sound !== 'undefined') {
        note.sound = notification.sound;
      } //console.log(notification.contentAvailable);
      //console.log("lala2");
      //console.log(notification);


      if (typeof notification.contentAvailable !== 'undefined') {
        //console.log("lala");
        note.setContentAvailable(notification.contentAvailable); //console.log(note);
      } // adds category support for iOS8 custom actions as described here:
      // https://developer.apple.com/library/ios/documentation/NetworkingInternet/Conceptual/
      // RemoteNotificationsPG/Chapters/IPhoneOSClientImp.html#//apple_ref/doc/uid/TP40008194-CH103-SW36


      if (typeof notification.category !== 'undefined') {
        note.category = notification.category;
      }

      note.alert = {
        body: notification.text
      };

      if (typeof notification.title !== 'undefined') {
        note.alert.title = notification.title;
      } // Allow the user to set payload data


      note.payload = notification.payload ? {
        ejson: EJSON.stringify(notification.payload)
      } : {};
      note.payload.messageFrom = notification.from;
      note.priority = priority; // Store the token on the note so we can reference it if there was an error

      note.token = userToken; // console.log('I:Send message to: ' + userToken + ' count=' + count);

      apnConnection.pushNotification(note, myDevice);
    };

    var initFeedback = function () {
      var apn = Npm.require('apn'); // console.log('Init feedback');


      var feedbackOptions = {
        'batchFeedback': true,
        // Time in SECONDS
        'interval': 5,
        production: !options.apn.development,
        cert: options.certData,
        key: options.keyData,
        passphrase: options.passphrase
      };
      var feedback = new apn.Feedback(feedbackOptions);
      feedback.on('feedback', function (devices) {
        devices.forEach(function (item) {
          // Do something with item.device and item.time;
          // console.log('A:PUSH FEEDBACK ' + item.device + ' - ' + item.time);
          // The app is most likely removed from the device, we should
          // remove the token
          _removeToken({
            apn: item.device
          });
        });
      });
      feedback.start();
    }; // Init feedback from apn server
    // This will help keep the appCollection up-to-date, it will help update
    // and remove token from appCollection.


    initFeedback();
  } // EO ios notification


  if (options.gcm && options.gcm.apiKey) {
    if (Push.debug) {
      console.log('GCM configured');
    } //self.sendGCM = function(options.from, userTokens, options.title, options.text, options.badge, options.priority) {


    self.sendGCM = function (userTokens, notification) {
      if (Match.test(notification.gcm, Object)) {
        notification = _.extend({}, notification, notification.gcm);
      } // Make sure userTokens are an array of strings


      if (userTokens === '' + userTokens) {
        userTokens = [userTokens];
      } // Check if any tokens in there to send


      if (!userTokens.length) {
        if (Push.debug) {
          console.log('sendGCM no push tokens found');
        }

        return;
      }

      if (Push.debug) {
        console.log('sendGCM', userTokens, notification);
      }

      var gcm = Npm.require('node-gcm');

      var Fiber = Npm.require('fibers'); // Allow user to set payload


      var data = notification.payload ? {
        ejson: EJSON.stringify(notification.payload)
      } : {};
      data.title = notification.title;
      data.message = notification.text; // Set image

      if (typeof notification.image !== 'undefined') {
        data.image = notification.image;
      } // Set extra details


      if (typeof notification.badge !== 'undefined') {
        data.msgcnt = notification.badge;
      }

      if (typeof notification.sound !== 'undefined') {
        data.soundname = notification.sound;
      }

      if (typeof notification.notId !== 'undefined') {
        data.notId = notification.notId;
      }

      if (typeof notification.style !== 'undefined') {
        data.style = notification.style;
      }

      if (typeof notification.summaryText !== 'undefined') {
        data.summaryText = notification.summaryText;
      }

      if (typeof notification.picture !== 'undefined') {
        data.picture = notification.picture;
      } //Action Buttons


      if (typeof notification.actions !== 'undefined') {
        data.actions = notification.actions;
      } //Force Start


      if (typeof notification.forceStart !== 'undefined') {
        data['force-start'] = notification.forceStart;
      }

      if (typeof notification.contentAvailable !== 'undefined') {
        data['content-available'] = notification.contentAvailable;
      } //var message = new gcm.Message();


      var message = new gcm.Message({
        collapseKey: notification.from,
        //    delayWhileIdle: true,
        //    timeToLive: 4,
        //    restricted_package_name: 'dk.gi2.app'
        data: data
      });

      if (Push.debug) {
        console.log('Create GCM Sender using "' + options.gcm.apiKey + '"');
      }

      var sender = new gcm.Sender(options.gcm.apiKey);

      _.each(userTokens, function (value
      /*, key */
      ) {
        if (Push.debug) {
          console.log('A:Send message to: ' + value);
        }
      });
      /*message.addData('title', title);
      message.addData('message', text);
      message.addData('msgcnt', '1');
      message.collapseKey = 'sitDrift';
      message.delayWhileIdle = true;
      message.timeToLive = 3;*/
      // /**
      //  * Parameters: message-literal, userTokens-array, No. of retries, callback-function
      //  */


      var userToken = userTokens.length === 1 ? userTokens[0] : null;
      sender.send(message, userTokens, 5, function (err, result) {
        if (err) {
          if (Push.debug) {
            console.log('ANDROID ERROR: result of sender: ' + result);
          }
        } else {
          if (result === null) {
            if (Push.debug) {
              console.log('ANDROID: Result of sender is null');
            }

            return;
          }

          if (Push.debug) {
            console.log('ANDROID: Result of sender: ' + JSON.stringify(result));
          }

          if (result.canonical_ids === 1 && userToken) {
            // jshint ignore:line
            // This is an old device, token is replaced
            Fiber(function (self) {
              // Run in fiber
              try {
                self.callback(self.oldToken, self.newToken);
              } catch (err) {}
            }).run({
              oldToken: {
                gcm: userToken
              },
              newToken: {
                gcm: result.results[0].registration_id
              },
              // jshint ignore:line
              callback: _replaceToken
            }); //_replaceToken({ gcm: userToken }, { gcm: result.results[0].registration_id });
          } // We cant send to that token - might not be registred
          // ask the user to remove the token from the list


          if (result.failure !== 0 && userToken) {
            // This is an old device, token is replaced
            Fiber(function (self) {
              // Run in fiber
              try {
                self.callback(self.token);
              } catch (err) {}
            }).run({
              token: {
                gcm: userToken
              },
              callback: _removeToken
            }); //_replaceToken({ gcm: userToken }, { gcm: result.results[0].registration_id });
          }
        }
      }); // /** Use the following line if you want to send the message without retries
      // sender.sendNoRetry(message, userTokens, function (result) {
      //     console.log('ANDROID: ' + JSON.stringify(result));
      // });
      // **/
    }; // EO sendAndroid

  } // EO Android
  // Universal send function


  var _querySend = function (query, options) {
    var countApn = [];
    var countGcm = [];
    Push.appCollection.find(query).forEach(function (app) {
      if (Push.debug) {
        console.log('send to token', app.token);
      }

      if (app.token.apn) {
        countApn.push(app._id); // Send to APN

        if (self.sendAPN) {
          self.sendAPN(app.token.apn, options);
        }
      } else if (app.token.gcm) {
        countGcm.push(app._id); // Send to GCM
        // We do support multiple here - so we should construct an array
        // and send it bulk - Investigate limit count of id's

        if (self.sendGCM) {
          self.sendGCM(app.token.gcm, options);
        }
      } else {
        throw new Error('Push.send got a faulty query');
      }
    });

    if (Push.debug) {
      console.log('Push: Sent message "' + options.title + '" to ' + countApn.length + ' ios apps ' + countGcm.length + ' android apps'); // Add some verbosity about the send result, making sure the developer
      // understands what just happened.

      if (!countApn.length && !countGcm.length) {
        if (Push.appCollection.find().count() === 0) {
          console.log('Push, GUIDE: The "Push.appCollection" is empty -' + ' No clients have registred on the server yet...');
        }
      } else if (!countApn.length) {
        if (Push.appCollection.find({
          'token.apn': {
            $exists: true
          }
        }).count() === 0) {
          console.log('Push, GUIDE: The "Push.appCollection" - No APN clients have registred on the server yet...');
        }
      } else if (!countGcm.length) {
        if (Push.appCollection.find({
          'token.gcm': {
            $exists: true
          }
        }).count() === 0) {
          console.log('Push, GUIDE: The "Push.appCollection" - No GCM clients have registred on the server yet...');
        }
      }
    }

    return {
      apn: countApn,
      gcm: countGcm
    };
  };

  self.serverSend = function (options) {
    options = options || {
      badge: 0
    };
    var query; // Check basic options

    if (options.from !== '' + options.from) {
      throw new Error('Push.send: option "from" not a string');
    }

    if (options.title !== '' + options.title) {
      throw new Error('Push.send: option "title" not a string');
    }

    if (options.text !== '' + options.text) {
      throw new Error('Push.send: option "text" not a string');
    }

    if (options.token || options.tokens) {
      // The user set one token or array of tokens
      var tokenList = options.token ? [options.token] : options.tokens;

      if (Push.debug) {
        console.log('Push: Send message "' + options.title + '" via token(s)', tokenList);
      }

      query = {
        $or: [// XXX: Test this query: can we hand in a list of push tokens?
        {
          $and: [{
            token: {
              $in: tokenList
            }
          }, // And is not disabled
          {
            enabled: {
              $ne: false
            }
          }]
        }, // XXX: Test this query: does this work on app id?
        {
          $and: [{
            _id: {
              $in: tokenList
            }
          }, // one of the app ids
          {
            $or: [{
              'token.apn': {
                $exists: true
              }
            }, // got apn token
            {
              'token.gcm': {
                $exists: true
              }
            } // got gcm token
            ]
          }, // And is not disabled
          {
            enabled: {
              $ne: false
            }
          }]
        }]
      };
    } else if (options.query) {
      if (Push.debug) {
        console.log('Push: Send message "' + options.title + '" via query', options.query);
      }

      query = {
        $and: [options.query, // query object
        {
          $or: [{
            'token.apn': {
              $exists: true
            }
          }, // got apn token
          {
            'token.gcm': {
              $exists: true
            }
          } // got gcm token
          ]
        }, // And is not disabled
        {
          enabled: {
            $ne: false
          }
        }]
      };
    }

    if (query) {
      // Convert to querySend and return status
      return _querySend(query, options);
    } else {
      throw new Error('Push.send: please set option "token"/"tokens" or "query"');
    }
  }; // This interval will allow only one notification to be sent at a time, it
  // will check for new notifications at every `options.sendInterval`
  // (default interval is 15000 ms)
  //
  // It looks in notifications collection to see if theres any pending
  // notifications, if so it will try to reserve the pending notification.
  // If successfully reserved the send is started.
  //
  // If notification.query is type string, it's assumed to be a json string
  // version of the query selector. Making it able to carry `$` properties in
  // the mongo collection.
  //
  // Pr. default notifications are removed from the collection after send have
  // completed. Setting `options.keepNotifications` will update and keep the
  // notification eg. if needed for historical reasons.
  //
  // After the send have completed a "send" event will be emitted with a
  // status object containing notification id and the send result object.
  //


  var isSendingNotification = false;

  if (options.sendInterval !== null) {
    // This will require index since we sort notifications by createdAt
    Push.notifications._ensureIndex({
      createdAt: 1
    });

    Push.notifications._ensureIndex({
      sent: 1
    });

    Push.notifications._ensureIndex({
      sending: 1
    });

    Push.notifications._ensureIndex({
      delayUntil: 1
    });

    var sendNotification = function (notification) {
      // Reserve notification
      var now = +new Date();
      var timeoutAt = now + options.sendTimeout;
      var reserved = Push.notifications.update({
        _id: notification._id,
        sent: false,
        // xxx: need to make sure this is set on create
        sending: {
          $lt: now
        }
      }, {
        $set: {
          sending: timeoutAt
        }
      }); // Make sure we only handle notifications reserved by this
      // instance

      if (reserved) {
        // Check if query is set and is type String
        if (notification.query && notification.query === '' + notification.query) {
          try {
            // The query is in string json format - we need to parse it
            notification.query = JSON.parse(notification.query);
          } catch (err) {
            // Did the user tamper with this??
            throw new Error('Push: Error while parsing query string, Error: ' + err.message);
          }
        } // Send the notification


        var result = Push.serverSend(notification);

        if (!options.keepNotifications) {
          // Pr. Default we will remove notifications
          Push.notifications.remove({
            _id: notification._id
          });
        } else {
          // Update the notification
          Push.notifications.update({
            _id: notification._id
          }, {
            $set: {
              // Mark as sent
              sent: true,
              // Set the sent date
              sentAt: new Date(),
              // Count
              count: result,
              // Not being sent anymore
              sending: 0
            }
          });
        } // Emit the send


        self.emit('send', {
          notification: notification._id,
          result: result
        });
      } // Else could not reserve

    }; // EO sendNotification


    sendWorker(function () {
      if (isSendingNotification) {
        return;
      }

      try {
        // Set send fence
        isSendingNotification = true; // var countSent = 0;

        var batchSize = options.sendBatchSize || 1;
        var now = +new Date(); // Find notifications that are not being or already sent

        var pendingNotifications = Push.notifications.find({
          $and: [// Message is not sent
          {
            sent: false
          }, // And not being sent by other instances
          {
            sending: {
              $lt: now
            }
          }, // And not queued for future
          {
            $or: [{
              delayUntil: {
                $exists: false
              }
            }, {
              delayUntil: {
                $lte: new Date()
              }
            }]
          }]
        }, {
          // Sort by created date
          sort: {
            createdAt: 1
          },
          limit: batchSize
        });
        pendingNotifications.forEach(function (notification) {
          try {
            sendNotification(notification);
          } catch (error) {
            if (typeof Push.Log === 'function') {
              Push.Log('Push: Could not send notification id: "' + notification._id + '", Error:', error.message);
            }

            if (Push.debug) {
              console.log('Push: Could not send notification id: "' + notification._id + '", Error: ' + error.message);
            }
          }
        }); // EO forEach
      } finally {
        // Remove the send fence
        isSendingNotification = false;
      }
    }, options.sendInterval || 15000); // Default every 15th sec
  } else {
    if (Push.debug) {
      console.log('Push: Send server is disabled');
    }
  }
};
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"server.js":function module(){

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                   //
// packages/raix_push/lib/server/server.js                                                                           //
//                                                                                                                   //
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                     //
Push.appCollection = new Mongo.Collection('_raix_push_app_tokens');

Push.appCollection._ensureIndex({
  userId: 1
});

Push.addListener('token', function (currentToken, value) {
  if (value) {
    // Update the token for app
    Push.appCollection.update({
      token: currentToken
    }, {
      $set: {
        token: value
      }
    }, {
      multi: true
    });
  } else if (value === null) {
    // Remove the token for app
    Push.appCollection.update({
      token: currentToken
    }, {
      $unset: {
        token: true
      }
    }, {
      multi: true
    });
  }
});
Meteor.methods({
  'raix:push-update': function (options) {
    if (Push.debug) {
      console.log('Push: Got push token from app:', options);
    }

    check(options, {
      id: Match.Optional(String),
      token: _matchToken,
      appName: String,
      userId: Match.OneOf(String, null),
      metadata: Match.Optional(Object)
    }); // The if user id is set then user id should match on client and connection

    if (options.userId && options.userId !== this.userId) {
      throw new Meteor.Error(403, 'Forbidden access');
    }

    var doc; // lookup app by id if one was included

    if (options.id) {
      doc = Push.appCollection.findOne({
        _id: options.id
      });
    } else if (options.userId) {
      doc = Push.appCollection.findOne({
        userId: options.userId
      });
    } // No doc was found - we check the database to see if
    // we can find a match for the app via token and appName


    if (!doc) {
      doc = Push.appCollection.findOne({
        $and: [{
          token: options.token
        }, // Match token
        {
          appName: options.appName
        }, // Match appName
        {
          token: {
            $exists: true
          }
        } // Make sure token exists
        ]
      });
    } // if we could not find the id or token then create it


    if (!doc) {
      // Rig default doc
      doc = {
        token: options.token,
        appName: options.appName,
        userId: options.userId,
        enabled: true,
        createdAt: new Date(),
        updatedAt: new Date()
      }; // XXX: We might want to check the id - Why isnt there a match for id
      // in the Meteor check... Normal length 17 (could be larger), and
      // numbers+letters are used in Random.id() with exception of 0 and 1

      doc._id = options.id || Random.id(); // The user wanted us to use a specific id, we didn't find this while
      // searching. The client could depend on the id eg. as reference so
      // we respect this and try to create a document with the selected id;

      Push.appCollection._collection.insert(doc);
    } else {
      // We found the app so update the updatedAt and set the token
      Push.appCollection.update({
        _id: doc._id
      }, {
        $set: {
          updatedAt: new Date(),
          token: options.token
        }
      });
    }

    if (doc) {
      // xxx: Hack
      // Clean up mech making sure tokens are uniq - android sometimes generate
      // new tokens resulting in duplicates
      var removed = Push.appCollection.remove({
        $and: [{
          _id: {
            $ne: doc._id
          }
        }, {
          token: doc.token
        }, // Match token
        {
          appName: doc.appName
        }, // Match appName
        {
          token: {
            $exists: true
          }
        } // Make sure token exists
        ]
      });

      if (removed && Push.debug) {
        console.log('Push: Removed ' + removed + ' existing app items');
      }
    }

    if (doc && Push.debug) {
      console.log('Push: updated', doc);
    }

    if (!doc) {
      throw new Meteor.Error(500, 'setPushToken could not create record');
    } // Return the doc we want to use


    return doc;
  },
  'raix:push-setuser': function (id) {
    check(id, String);

    if (Push.debug) {
      console.log('Push: Settings userId "' + this.userId + '" for app:', id);
    } // We update the appCollection id setting the Meteor.userId


    var found = Push.appCollection.update({
      _id: id
    }, {
      $set: {
        userId: this.userId
      }
    }); // Note that the app id might not exist because no token is set yet.
    // We do create the new app id for the user since we might store additional
    // metadata for the app / user
    // If id not found then create it?
    // We dont, its better to wait until the user wants to
    // store metadata or token - We could end up with unused data in the
    // collection at every app re-install / update
    //
    // The user could store some metadata in appCollectin but only if they
    // have created the app and provided a token.
    // If not the metadata should be set via ground:db

    return !!found;
  },
  'raix:push-metadata': function (data) {
    check(data, {
      id: String,
      metadata: Object
    }); // Set the metadata

    var found = Push.appCollection.update({
      _id: data.id
    }, {
      $set: {
        metadata: data.metadata
      }
    });
    return !!found;
  },
  'raix:push-enable': function (data) {
    check(data, {
      id: String,
      enabled: Boolean
    });

    if (Push.debug) {
      console.log('Push: Setting enabled to "' + data.enabled + '" for app:', data.id);
    }

    var found = Push.appCollection.update({
      _id: data.id
    }, {
      $set: {
        enabled: data.enabled
      }
    });
    return !!found;
  }
});
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}}}}}}},{
  "extensions": [
    ".js",
    ".json"
  ]
});

require("/node_modules/meteor/raix:push/lib/common/main.js");
require("/node_modules/meteor/raix:push/lib/common/notifications.js");
require("/node_modules/meteor/raix:push/lib/server/push.api.js");
require("/node_modules/meteor/raix:push/lib/server/server.js");

/* Exports */
Package._define("raix:push", {
  Push: Push,
  _matchToken: _matchToken,
  checkClientSecurity: checkClientSecurity,
  initPushUpdates: initPushUpdates,
  _replaceToken: _replaceToken,
  _removeToken: _removeToken
});

})();

//# sourceURL=meteor://💻app/packages/raix_push.js
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvcmFpeDpwdXNoL2xpYi9jb21tb24vbWFpbi5qcyIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvcmFpeDpwdXNoL2xpYi9jb21tb24vbm90aWZpY2F0aW9ucy5qcyIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvcmFpeDpwdXNoL2xpYi9zZXJ2ZXIvcHVzaC5hcGkuanMiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3JhaXg6cHVzaC9saWIvc2VydmVyL3NlcnZlci5qcyJdLCJuYW1lcyI6WyJQdXNoIiwiRXZlbnRTdGF0ZSIsImNoZWNrQ2xpZW50U2VjdXJpdHkiLCJvcHRpb25zIiwiYXBuIiwiY2VydERhdGEiLCJFcnJvciIsImtleURhdGEiLCJwYXNzcGhyYXNlIiwiZ2NtIiwiYXBpS2V5IiwiaW5pdCIsImNvbnNvbGUiLCJ3YXJuIiwiX21hdGNoVG9rZW4iLCJNYXRjaCIsIk9uZU9mIiwiU3RyaW5nIiwibm90aWZpY2F0aW9ucyIsIk1vbmdvIiwiQ29sbGVjdGlvbiIsIl92YWxpZGF0ZURvY3VtZW50Iiwibm90aWZpY2F0aW9uIiwiY2hlY2siLCJmcm9tIiwidGl0bGUiLCJ0ZXh0Iiwic2VudCIsIk9wdGlvbmFsIiwiQm9vbGVhbiIsInNlbmRpbmciLCJJbnRlZ2VyIiwiYmFkZ2UiLCJzb3VuZCIsIm5vdElkIiwiY29udGVudEF2YWlsYWJsZSIsImZvcmNlU3RhcnQiLCJjYXRlZ29yeSIsImltYWdlIiwic3R5bGUiLCJzdW1tYXJ5VGV4dCIsInBpY3R1cmUiLCJhY3Rpb25zIiwiQW55IiwicXVlcnkiLCJ0b2tlbiIsInRva2VucyIsInBheWxvYWQiLCJPYmplY3QiLCJkZWxheVVudGlsIiwiRGF0ZSIsImNyZWF0ZWRBdCIsImNyZWF0ZWRCeSIsImxlbmd0aCIsInNlbmQiLCJjdXJyZW50VXNlciIsIk1ldGVvciIsImlzQ2xpZW50IiwidXNlcklkIiwiaXNTZXJ2ZXIiLCJfIiwiZXh0ZW5kIiwicGljayIsInRlc3QiLCJKU09OIiwic3RyaW5naWZ5IiwiaW5zZXJ0IiwiYWxsb3ciLCJydWxlcyIsImFwcGx5IiwiZGVueSIsInNldEJhZGdlIiwiaXNDb25maWd1cmVkIiwic2VuZFdvcmtlciIsInRhc2siLCJpbnRlcnZhbCIsIkxvZyIsImRlYnVnIiwibG9nIiwic2V0SW50ZXJ2YWwiLCJlcnJvciIsIm1lc3NhZ2UiLCJDb25maWd1cmUiLCJzZWxmIiwic2VuZFRpbWVvdXQiLCJfcmVwbGFjZVRva2VuIiwiY3VycmVudFRva2VuIiwibmV3VG9rZW4iLCJlbWl0U3RhdGUiLCJfcmVtb3ZlVG9rZW4iLCJwcm9kdWN0aW9uIiwiZGV2ZWxvcG1lbnQiLCJnYXRld2F5IiwiYWJzb2x1dGVVcmwiLCJOcG0iLCJyZXF1aXJlIiwiYXBuQ29ubmVjdGlvbiIsIkNvbm5lY3Rpb24iLCJvbiIsImJpbmRFbnZpcm9ubWVudCIsImVyckNvZGUiLCJyZWNpcGllbnQiLCJpbmRleE9mIiwic2VuZEFQTiIsInVzZXJUb2tlbiIsInByaW9yaXR5IiwibXlEZXZpY2UiLCJEZXZpY2UiLCJub3RlIiwiTm90aWZpY2F0aW9uIiwiZXhwaXJ5IiwiTWF0aCIsImZsb29yIiwibm93Iiwic2V0Q29udGVudEF2YWlsYWJsZSIsImFsZXJ0IiwiYm9keSIsImVqc29uIiwiRUpTT04iLCJtZXNzYWdlRnJvbSIsInB1c2hOb3RpZmljYXRpb24iLCJpbml0RmVlZGJhY2siLCJmZWVkYmFja09wdGlvbnMiLCJjZXJ0Iiwia2V5IiwiZmVlZGJhY2siLCJGZWVkYmFjayIsImRldmljZXMiLCJmb3JFYWNoIiwiaXRlbSIsImRldmljZSIsInN0YXJ0Iiwic2VuZEdDTSIsInVzZXJUb2tlbnMiLCJGaWJlciIsImRhdGEiLCJtc2djbnQiLCJzb3VuZG5hbWUiLCJNZXNzYWdlIiwiY29sbGFwc2VLZXkiLCJzZW5kZXIiLCJTZW5kZXIiLCJlYWNoIiwidmFsdWUiLCJlcnIiLCJyZXN1bHQiLCJjYW5vbmljYWxfaWRzIiwiY2FsbGJhY2siLCJvbGRUb2tlbiIsInJ1biIsInJlc3VsdHMiLCJyZWdpc3RyYXRpb25faWQiLCJmYWlsdXJlIiwiX3F1ZXJ5U2VuZCIsImNvdW50QXBuIiwiY291bnRHY20iLCJhcHBDb2xsZWN0aW9uIiwiZmluZCIsImFwcCIsInB1c2giLCJfaWQiLCJjb3VudCIsIiRleGlzdHMiLCJzZXJ2ZXJTZW5kIiwidG9rZW5MaXN0IiwiJG9yIiwiJGFuZCIsIiRpbiIsImVuYWJsZWQiLCIkbmUiLCJpc1NlbmRpbmdOb3RpZmljYXRpb24iLCJzZW5kSW50ZXJ2YWwiLCJfZW5zdXJlSW5kZXgiLCJzZW5kTm90aWZpY2F0aW9uIiwidGltZW91dEF0IiwicmVzZXJ2ZWQiLCJ1cGRhdGUiLCIkbHQiLCIkc2V0IiwicGFyc2UiLCJrZWVwTm90aWZpY2F0aW9ucyIsInJlbW92ZSIsInNlbnRBdCIsImVtaXQiLCJiYXRjaFNpemUiLCJzZW5kQmF0Y2hTaXplIiwicGVuZGluZ05vdGlmaWNhdGlvbnMiLCIkbHRlIiwic29ydCIsImxpbWl0IiwiYWRkTGlzdGVuZXIiLCJtdWx0aSIsIiR1bnNldCIsIm1ldGhvZHMiLCJpZCIsImFwcE5hbWUiLCJtZXRhZGF0YSIsImRvYyIsImZpbmRPbmUiLCJ1cGRhdGVkQXQiLCJSYW5kb20iLCJfY29sbGVjdGlvbiIsInJlbW92ZWQiLCJmb3VuZCJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTtBQUNBQSxJQUFJLEdBQUcsSUFBSUMsVUFBSixFQUFQLEMsQ0FHQTs7QUFDQUMsbUJBQW1CLEdBQUcsVUFBU0MsT0FBVCxFQUFrQjtBQUV0QztBQUNBO0FBQ0EsTUFBSUEsT0FBTyxDQUFDQyxHQUFSLElBQWVELE9BQU8sQ0FBQ0MsR0FBUixDQUFZQyxRQUEvQixFQUF5QztBQUN2QyxVQUFNLElBQUlDLEtBQUosQ0FBVSwwREFBVixDQUFOO0FBQ0Q7O0FBRUQsTUFBSUgsT0FBTyxDQUFDQyxHQUFSLElBQWVELE9BQU8sQ0FBQ0MsR0FBUixDQUFZRyxPQUEvQixFQUF3QztBQUN0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O0FBRVZtTCxjQUFRLEVBQUVwSjtBQUZBLEtBQVAsQ0FBTCxDQURtQyxDQU1uQzs7QUFDQSxRQUFJMkosS0FBSyxHQUFHM00sSUFBSSxDQUFDNEosYUFBTCxDQUFtQm9CLE1BQW5CLENBQTBCO0FBQUVoQixTQUFHLEVBQUV6QixJQUFJLENBQUMyRDtBQUFaLEtBQTFCLEVBQTRDO0FBQUVoQixVQUFJLEVBQUU7QUFBRWtCLGdCQUFRLEVBQUU3RCxJQUFJLENBQUM2RDtBQUFqQjtBQUFSLEtBQTVDLENBQVo7QUFFQSxXQUFPLENBQUMsQ0FBQ08sS0FBVDtBQUNELEdBcElZO0FBcUliLHNCQUFvQixVQUFTcEUsSUFBVCxFQUFlO0FBQ2pDaEgsU0FBSyxDQUFDZ0gsSUFBRCxFQUFPO0FBQ1YyRCxRQUFFLEVBQUVqTCxNQURNO0FBRVZ1SixhQUFPLEVBQUUzSTtBQUZDLEtBQVAsQ0FBTDs7QUFLQSxRQUFJN0IsSUFBSSxDQUFDNkUsS0FBVCxFQUFnQjtBQUNkakUsYUFBTyxDQUFDa0UsR0FBUixDQUFZLCtCQUErQnlELElBQUksQ0FBQ2lDLE9BQXBDLEdBQThDLFlBQTFELEVBQXdFakMsSUFBSSxDQUFDMkQsRUFBN0U7QUFDRDs7QUFFRCxRQUFJUyxLQUFLLEdBQUczTSxJQUFJLENBQUM0SixhQUFMLENBQW1Cb0IsTUFBbkIsQ0FBMEI7QUFBRWhCLFNBQUcsRUFBRXpCLElBQUksQ0FBQzJEO0FBQVosS0FBMUIsRUFBNEM7QUFBRWhCLFVBQUksRUFBRTtBQUFFVixlQUFPLEVBQUVqQyxJQUFJLENBQUNpQztBQUFoQjtBQUFSLEtBQTVDLENBQVo7QUFFQSxXQUFPLENBQUMsQ0FBQ21DLEtBQVQ7QUFDRDtBQWxKWSxDQUFmLEUiLCJmaWxlIjoiL3BhY2thZ2VzL3JhaXhfcHVzaC5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8vIFRoZSBwdXNoIG9iamVjdCBpcyBhbiBldmVudCBlbWl0dGVyXG5QdXNoID0gbmV3IEV2ZW50U3RhdGUoKTtcblxuXG4vLyBDbGllbnQtc2lkZSBzZWN1cml0eSB3YXJuaW5ncywgdXNlZCB0byBjaGVjayBvcHRpb25zXG5jaGVja0NsaWVudFNlY3VyaXR5ID0gZnVuY3Rpb24ob3B0aW9ucykge1xuXG4gIC8vIFdhcm4gaWYgY2VydGlmaWNhdGVzIG9yIGtleXMgYXJlIGFkZGVkIGhlcmUgb24gY2xpZW50LiBXZSBkb250IGFsbG93IHRoZVxuICAvLyB1c2VyIHRvIGRvIHRoaXMgZm9yIHNlY3VyaXR5IHJlYXNvbnMuXG4gIGlmIChvcHRpb25zLmFwbiAmJiBvcHRpb25zLmFwbi5jZXJ0RGF0YSkge1xuICAgIHRocm93IG5ldyBFcnJvcignUHVzaC5pbml0OiBEb250IGFkZCB5b3VyIEFQTiBjZXJ0aWZpY2F0ZSBpbiBjbGllbnQgY29kZSEnKTtcbiAgfVxuXG4gIGlmIChvcHRpb25zLmFwbiAmJiBvcHRpb25zLmFwbi5rZXlEYXRhKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdQdXNoLmluaXQ6IERvbnQgYWRkIHlvdXIgQVBOIGtleSBpbiBjbGllbnQgY29kZSEnKTtcbiAgfVxuXG4gIGlmIChvcHRpb25zLmFwbiAmJiBvcHRpb25zLmFwbi5wYXNzcGhyYXNlKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdQdXNoLmluaXQ6IERvbnQgYWRkIHlvdXIgQVBOIHBhc3NwaHJhc2UgaW4gY2xpZW50IGNvZGUhJyk7XG4gIH1cblxuICBpZiAob3B0aW9ucy5nY20gJiYgb3B0aW9ucy5nY20uYXBpS2V5KSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdQdXNoLmluaXQ6IERvbnQgYWRkIHlvdXIgR0NNIGFwaSBrZXkgaW4gY2xpZW50IGNvZGUhJyk7XG4gIH1cbn07XG5cbi8vIERFUFJFQ0FURURcblB1c2guaW5pdCA9IGZ1bmN0aW9uKCkge1xuICBjb25zb2xlLndhcm4oJ1B1c2guaW5pdCBoYXZlIGJlZW4gZGVwcmVjYXRlZCBpbiBmYXZvciBvZiBcImNvbmZpZy5wdXNoLmpzb25cIiBwbGVhc2UgbWlncmF0ZScpO1xufTtcbiIsIi8vIFRoaXMgaXMgdGhlIG1hdGNoIHBhdHRlcm4gZm9yIHRva2Vuc1xuX21hdGNoVG9rZW4gPSBNYXRjaC5PbmVPZih7IGFwbjogU3RyaW5nIH0sIHsgZ2NtOiBTdHJpbmcgfSk7XG5cbi8vIE5vdGlmaWNhdGlvbnMgY29sbGVjdGlvblxuUHVzaC5ub3RpZmljYXRpb25zID0gbmV3IE1vbmdvLkNvbGxlY3Rpb24oJ19yYWl4X3B1c2hfbm90aWZpY2F0aW9ucycpO1xuXG4vLyBUaGlzIGlzIGEgZ2VuZXJhbCBmdW5jdGlvbiB0byB2YWxpZGF0ZSB0aGF0IHRoZSBkYXRhIGFkZGVkIHRvIG5vdGlmaWNhdGlvbnNcbi8vIGlzIGluIHRoZSBjb3JyZWN0IGZvcm1hdC4gSWYgbm90IHRoaXMgZnVuY3Rpb24gd2lsbCB0aHJvdyBlcnJvcnNcbnZhciBfdmFsaWRhdGVEb2N1bWVudCA9IGZ1bmN0aW9uKG5vdGlmaWNhdGlvbikge1xuXG4gIC8vIENoZWNrIHRoZSBnZW5lcmFsIG5vdGlmaWNhdGlvblxuICBjaGVjayhub3RpZmljYXRpb24sIHtcbiAgICBmcm9tOiBTdHJpbmcsXG4gICAgdGl0bGU6IFN0cmluZyxcbiAgICB0ZXh0OiBTdHJpbmcsXG4gICAgc2VudDogTWF0Y2guT3B0aW9uYWwoQm9vbGVhbiksXG4gICAgc2VuZGluZzogTWF0Y2guT3B0aW9uYWwoTWF0Y2guSW50ZWdlciksXG4gICAgYmFkZ2U6IE1hdGNoLk9wdGlvbmFsKE1hdGNoLkludGVnZXIpLFxuICAgIHNvdW5kOiBNYXRjaC5PcHRpb25hbChTdHJpbmcpLFxuICAgIG5vdElkOiBNYXRjaC5PcHRpb25hbChNYXRjaC5JbnRlZ2VyKSxcbiAgICBjb250ZW50QXZhaWxhYmxlOiBNYXRjaC5PcHRpb25hbChNYXRjaC5JbnRlZ2VyKSxcbiAgICBmb3JjZVN0YXJ0OiBNYXRjaC5PcHRpb25hbChNYXRjaC5JbnRlZ2VyKSxcbiAgICBhcG46IE1hdGNoLk9wdGlvbmFsKHtcbiAgICAgIGZyb206IE1hdGNoLk9wdGlvbmFsKFN0cmluZyksXG4gICAgICB0aXRsZTogTWF0Y2guT3B0aW9uYWwoU3RyaW5nKSxcbiAgICAgIHRleHQ6IE1hdGNoLk9wdGlvbmFsKFN0cmluZyksXG4gICAgICBiYWRnZTogTWF0Y2guT3B0aW9uYWwoTWF0Y2guSW50ZWdlciksXG4gICAgICBzb3VuZDogTWF0Y2guT3B0aW9uYWwoU3RyaW5nKSxcbiAgICAgIG5vdElkOiBNYXRjaC5PcHRpb25hbChNYXRjaC5JbnRlZ2VyKSxcbiAgICAgIGNhdGVnb3J5OiBNYXRjaC5PcHRpb25hbChTdHJpbmcpXG4gICAgfSksXG4gICAgZ2NtOiBNYXRjaC5PcHRpb25hbCh7XG4gICAgICBmcm9tOiBNYXRjaC5PcHRpb25hbChTdHJpbmcpLFxuICAgICAgdGl0bGU6IE1hdGNoLk9wdGlvbmFsKFN0cmluZyksXG4gICAgICB0ZXh0OiBNYXRjaC5PcHRpb25hbChTdHJpbmcpLFxuICAgICAgaW1hZ2U6IE1hdGNoLk9wdGlvbmFsKFN0cmluZyksXG4gICAgICBzdHlsZTogTWF0Y2guT3B0aW9uYWwoU3RyaW5nKSxcbiAgICAgIHN1bW1hcnlUZXh0OiBNYXRjaC5PcHRpb25hbChTdHJpbmcpLFxuICAgICAgcGljdHVyZTogTWF0Y2guT3B0aW9uYWwoU3RyaW5nKSxcbiAgICAgIGJhZGdlOiBNYXRjaC5PcHRpb25hbChNYXRjaC5JbnRlZ2VyKSxcbiAgICAgIHNvdW5kOiBNYXRjaC5PcHRpb25hbChTdHJpbmcpLFxuICAgICAgbm90SWQ6IE1hdGNoLk9wdGlvbmFsKE1hdGNoLkludGVnZXIpLFxuICAgICAgYWN0aW9uczogTWF0Y2guT3B0aW9uYWwoW01hdGNoLkFueV0pXG4gICAgfSksXG4gICAgcXVlcnk6IE1hdGNoLk9wdGlvbmFsKFN0cmluZyksXG4gICAgdG9rZW46IE1hdGNoLk9wdGlvbmFsKF9tYXRjaFRva2VuKSxcbiAgICB0b2tlbnM6IE1hdGNoLk9wdGlvbmFsKFtfbWF0Y2hUb2tlbl0pLFxuICAgIHBheWxvYWQ6IE1hdGNoLk9wdGlvbmFsKE9iamVjdCksXG4gICAgZGVsYXlVbnRpbDogTWF0Y2guT3B0aW9uYWwoRGF0ZSksXG4gICAgY3JlYXRlZEF0OiBEYXRlLFxuICAgIGNyZWF0ZWRCeTogTWF0Y2guT25lT2YoU3RyaW5nLCBudWxsKVxuICB9KTtcblxuICAvLyBNYWtlIHN1cmUgYSB0b2tlbiBzZWxlY3RvciBvciBxdWVyeSBoYXZlIGJlZW4gc2V0XG4gIGlmICghbm90aWZpY2F0aW9uLnRva2VuICYmICFub3RpZmljYXRpb24udG9rZW5zICYmICFub3RpZmljYXRpb24ucXVlcnkpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ05vIHRva2VuIHNlbGVjdG9yIG9yIHF1ZXJ5IGZvdW5kJyk7XG4gIH1cblxuICAvLyBJZiB0b2tlbnMgYXJyYXkgaXMgc2V0IGl0IHNob3VsZCBub3QgYmUgZW1wdHlcbiAgaWYgKG5vdGlmaWNhdGlvbi50b2tlbnMgJiYgIW5vdGlmaWNhdGlvbi50b2tlbnMubGVuZ3RoKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdObyB0b2tlbnMgaW4gYXJyYXknKTtcbiAgfVxufTtcblxuUHVzaC5zZW5kID0gZnVuY3Rpb24ob3B0aW9ucykge1xuICAvLyBJZiBvbiB0aGUgY2xpZW50IHdlIHNldCB0aGUgdXNlciBpZCAtIG9uIHRoZSBzZXJ2ZXIgd2UgbmVlZCBhbiBvcHRpb25cbiAgLy8gc2V0IG9yIHdlIGRlZmF1bHQgdG8gXCI8U0VSVkVSPlwiIGFzIHRoZSBjcmVhdG9yIG9mIHRoZSBub3RpZmljYXRpb25cbiAgLy8gSWYgY3VycmVudCB1c2VyIG5vdCBzZXQgc2VlIGlmIHdlIGNhbiBzZXQgaXQgdG8gdGhlIGxvZ2dlZCBpbiB1c2VyXG4gIC8vIHRoaXMgd2lsbCBvbmx5IHJ1biBvbiB0aGUgY2xpZW50IGlmIE1ldGVvci51c2VySWQgaXMgYXZhaWxhYmxlXG4gIHZhciBjdXJyZW50VXNlciA9IE1ldGVvci5pc0NsaWVudCAmJiBNZXRlb3IudXNlcklkICYmIE1ldGVvci51c2VySWQoKSB8fFxuICAgICAgICAgIE1ldGVvci5pc1NlcnZlciAmJiAob3B0aW9ucy5jcmVhdGVkQnkgfHwgJzxTRVJWRVI+JykgfHwgbnVsbDtcblxuICAvLyBSaWcgdGhlIG5vdGlmaWNhdGlvbiBvYmplY3RcbiAgIHZhciBub3RpZmljYXRpb24gPSBfLmV4dGVuZCh7XG4gICAgY3JlYXRlZEF0OiBuZXcgRGF0ZSgpLFxuICAgIGNyZWF0ZWRCeTogY3VycmVudFVzZXJcbiAgfSwgXy5waWNrKG9wdGlvbnMsICdmcm9tJywgJ3RpdGxlJywgJ3RleHQnKSk7XG5cbiAgIC8vIEFkZCBleHRyYVxuICAgXy5leHRlbmQobm90aWZpY2F0aW9uLCBfLnBpY2sob3B0aW9ucywgJ3BheWxvYWQnLCAnYmFkZ2UnLCAnc291bmQnLCAnbm90SWQnLCAnZGVsYXlVbnRpbCcpKTtcblxuICBpZiAoTWF0Y2gudGVzdChvcHRpb25zLmFwbiwgT2JqZWN0KSkge1xuICAgIG5vdGlmaWNhdGlvbi5hcG4gPSBfLnBpY2sob3B0aW9ucy5hcG4sICdmcm9tJywgJ3RpdGxlJywgJ3RleHQnLCAnYmFkZ2UnLCAnc291bmQnLCAnbm90SWQnLCAnY2F0ZWdvcnknKTtcbiAgfVxuXG4gIGlmIChNYXRjaC50ZXN0KG9wdGlvbnMuZ2NtLCBPYmplY3QpKSB7XG4gICAgbm90aWZpY2F0aW9uLmdjbSA9IF8ucGljayhvcHRpb25zLmdjbSwgJ2ltYWdlJywgJ3N0eWxlJywgJ3N1bW1hcnlUZXh0JywgJ3BpY3R1cmUnLCAnZnJvbScsICd0aXRsZScsICd0ZXh0JywgJ2JhZGdlJywgJ3NvdW5kJywgJ25vdElkJywgJ2FjdGlvbnMnKTtcbiAgfVxuXG4gIC8vIFNldCBvbmUgdG9rZW4gc2VsZWN0b3IsIHRoaXMgY2FuIGJlIHRva2VuLCBhcnJheSBvZiB0b2tlbnMgb3IgcXVlcnlcbiAgaWYgKG9wdGlvbnMucXVlcnkpIHtcbiAgICAvLyBTZXQgcXVlcnkgdG8gdGhlIGpzb24gc3RyaW5nIHZlcnNpb24gZml4aW5nICM0MyBhbmQgIzM5XG4gICAgbm90aWZpY2F0aW9uLnF1ZXJ5ID0gSlNPTi5zdHJpbmdpZnkob3B0aW9ucy5xdWVyeSk7XG4gIH0gZWxzZSBpZiAob3B0aW9ucy50b2tlbikge1xuICAgIC8vIFNldCB0b2tlblxuICAgIG5vdGlmaWNhdGlvbi50b2tlbiA9IG9wdGlvbnMudG9rZW47XG4gIH0gZWxzZSBpZiAob3B0aW9ucy50b2tlbnMpIHtcbiAgICAvLyBTZXQgdG9rZW5zXG4gICAgbm90aWZpY2F0aW9uLnRva2VucyA9IG9wdGlvbnMudG9rZW5zO1xuICB9XG4gIC8vY29uc29sZS5sb2cob3B0aW9ucyk7XG4gIGlmICh0eXBlb2Ygb3B0aW9ucy5jb250ZW50QXZhaWxhYmxlICE9PSAndW5kZWZpbmVkJykge1xuICAgIG5vdGlmaWNhdGlvbi5jb250ZW50QXZhaWxhYmxlID0gb3B0aW9ucy5jb250ZW50QXZhaWxhYmxlO1xuICB9XG5cbiAgaWYgKHR5cGVvZiBvcHRpb25zLmZvcmNlU3RhcnQgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgbm90aWZpY2F0aW9uLmZvcmNlU3RhcnQgPSBvcHRpb25zLmZvcmNlU3RhcnQ7XG4gIH1cbiAgXG4gIG5vdGlmaWNhdGlvbi5zZW50ID0gZmFsc2U7XG4gIG5vdGlmaWNhdGlvbi5zZW5kaW5nID0gMDtcblxuICAvLyBWYWxpZGF0ZSB0aGUgbm90aWZpY2F0aW9uXG4gIF92YWxpZGF0ZURvY3VtZW50KG5vdGlmaWNhdGlvbik7XG5cbiAgLy8gVHJ5IHRvIGFkZCB0aGUgbm90aWZpY2F0aW9uIHRvIHNlbmQsIHdlIHJldHVybiBhbiBpZCB0byBrZWVwIHRyYWNrXG4gIHJldHVybiBQdXNoLm5vdGlmaWNhdGlvbnMuaW5zZXJ0KG5vdGlmaWNhdGlvbik7XG59O1xuXG5QdXNoLmFsbG93ID0gZnVuY3Rpb24ocnVsZXMpIHtcbiAgaWYgKHJ1bGVzLnNlbmQpIHtcbiAgICBQdXNoLm5vdGlmaWNhdGlvbnMuYWxsb3coe1xuICAgICAgJ2luc2VydCc6IGZ1bmN0aW9uKHVzZXJJZCwgbm90aWZpY2F0aW9uKSB7XG4gICAgICAgIC8vIFZhbGlkYXRlIHRoZSBub3RpZmljYXRpb25cbiAgICAgICAgX3ZhbGlkYXRlRG9jdW1lbnQobm90aWZpY2F0aW9uKTtcbiAgICAgICAgLy8gU2V0IHRoZSB1c2VyIGRlZmluZWQgXCJzZW5kXCIgcnVsZXNcbiAgICAgICAgcmV0dXJuIHJ1bGVzLnNlbmQuYXBwbHkodGhpcywgW3VzZXJJZCwgbm90aWZpY2F0aW9uXSk7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cbn07XG5cblB1c2guZGVueSA9IGZ1bmN0aW9uKHJ1bGVzKSB7XG4gIGlmIChydWxlcy5zZW5kKSB7XG4gICAgUHVzaC5ub3RpZmljYXRpb25zLmRlbnkoe1xuICAgICAgJ2luc2VydCc6IGZ1bmN0aW9uKHVzZXJJZCwgbm90aWZpY2F0aW9uKSB7XG4gICAgICAgIC8vIFZhbGlkYXRlIHRoZSBub3RpZmljYXRpb25cbiAgICAgICAgX3ZhbGlkYXRlRG9jdW1lbnQobm90aWZpY2F0aW9uKTtcbiAgICAgICAgLy8gU2V0IHRoZSB1c2VyIGRlZmluZWQgXCJzZW5kXCIgcnVsZXNcbiAgICAgICAgcmV0dXJuIHJ1bGVzLnNlbmQuYXBwbHkodGhpcywgW3VzZXJJZCwgbm90aWZpY2F0aW9uXSk7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cbn07XG4iLCIvKlxuICBBIGdlbmVyYWwgcHVycG9zZSB1c2VyIENvcmRvdmFQdXNoXG4gIGlvcywgYW5kcm9pZCwgbWFpbCwgdHdpdHRlcj8sIGZhY2Vib29rPywgc21zPywgc25haWxNYWlsPyA6KVxuXG4gIFBob25lZ2FwIGdlbmVyaWMgOlxuICBodHRwczovL2dpdGh1Yi5jb20vcGhvbmVnYXAtYnVpbGQvUHVzaFBsdWdpblxuICovXG5cbi8vIGdldFRleHQgLyBnZXRCaW5hcnlcblxuUHVzaC5zZXRCYWRnZSA9IGZ1bmN0aW9uKC8qIGlkLCBjb3VudCAqLykge1xuICAgIC8vIHRocm93IG5ldyBFcnJvcignUHVzaC5zZXRCYWRnZSBub3QgaW1wbGVtZW50ZWQgb24gdGhlIHNlcnZlcicpO1xufTtcblxudmFyIGlzQ29uZmlndXJlZCA9IGZhbHNlO1xuXG52YXIgc2VuZFdvcmtlciA9IGZ1bmN0aW9uKHRhc2ssIGludGVydmFsKSB7XG4gIGlmICh0eXBlb2YgUHVzaC5Mb2cgPT09ICdmdW5jdGlvbicpIHtcbiAgICBQdXNoLkxvZygnUHVzaDogU2VuZCB3b3JrZXIgc3RhcnRlZCwgdXNpbmcgaW50ZXJ2YWw6JywgaW50ZXJ2YWwpO1xuICB9XG4gIGlmIChQdXNoLmRlYnVnKSB7XG4gICAgY29uc29sZS5sb2coJ1B1c2g6IFNlbmQgd29ya2VyIHN0YXJ0ZWQsIHVzaW5nIGludGVydmFsOiAnICsgaW50ZXJ2YWwpO1xuICB9XG5cbiAgcmV0dXJuIE1ldGVvci5zZXRJbnRlcnZhbChmdW5jdGlvbigpIHtcbiAgICAvLyB4eHg6IGFkZCBleHBvbmVudGlhbCBiYWNrb2ZmIG9uIGVycm9yXG4gICAgdHJ5IHtcbiAgICAgIHRhc2soKTtcbiAgICB9IGNhdGNoKGVycm9yKSB7XG4gICAgICBpZiAodHlwZW9mIFB1c2guTG9nID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgIFB1c2guTG9nKCdQdXNoOiBFcnJvciB3aGlsZSBzZW5kaW5nOicsIGVycm9yLm1lc3NhZ2UpO1xuICAgICAgfVxuICAgICAgaWYgKFB1c2guZGVidWcpIHtcbiAgICAgICAgY29uc29sZS5sb2coJ1B1c2g6IEVycm9yIHdoaWxlIHNlbmRpbmc6ICcgKyBlcnJvci5tZXNzYWdlKTtcbiAgICAgIH1cbiAgICB9XG4gIH0sIGludGVydmFsKTtcbn07XG5cblB1c2guQ29uZmlndXJlID0gZnVuY3Rpb24ob3B0aW9ucykge1xuICAgIHZhciBzZWxmID0gdGhpcztcbiAgICBvcHRpb25zID0gXy5leHRlbmQoe1xuICAgICAgc2VuZFRpbWVvdXQ6IDYwMDAwLCAvLyBUaW1lb3V0IHBlcmlvZCBmb3Igbm90aWZpY2F0aW9uIHNlbmRcbiAgICB9LCBvcHRpb25zKTtcbiAgICAvLyBodHRwczovL25wbWpzLm9yZy9wYWNrYWdlL2FwblxuXG4gICAgLy8gQWZ0ZXIgcmVxdWVzdGluZyB0aGUgY2VydGlmaWNhdGUgZnJvbSBBcHBsZSwgZXhwb3J0IHlvdXIgcHJpdmF0ZSBrZXkgYXNcbiAgICAvLyBhIC5wMTIgZmlsZSBhbmRkb3dubG9hZCB0aGUgLmNlciBmaWxlIGZyb20gdGhlIGlPUyBQcm92aXNpb25pbmcgUG9ydGFsLlxuXG4gICAgLy8gZ2F0ZXdheS5wdXNoLmFwcGxlLmNvbSwgcG9ydCAyMTk1XG4gICAgLy8gZ2F0ZXdheS5zYW5kYm94LnB1c2guYXBwbGUuY29tLCBwb3J0IDIxOTVcblxuICAgIC8vIE5vdywgaW4gdGhlIGRpcmVjdG9yeSBjb250YWluaW5nIGNlcnQuY2VyIGFuZCBrZXkucDEyIGV4ZWN1dGUgdGhlXG4gICAgLy8gZm9sbG93aW5nIGNvbW1hbmRzIHRvIGdlbmVyYXRlIHlvdXIgLnBlbSBmaWxlczpcbiAgICAvLyAkIG9wZW5zc2wgeDUwOSAtaW4gY2VydC5jZXIgLWluZm9ybSBERVIgLW91dGZvcm0gUEVNIC1vdXQgY2VydC5wZW1cbiAgICAvLyAkIG9wZW5zc2wgcGtjczEyIC1pbiBrZXkucDEyIC1vdXQga2V5LnBlbSAtbm9kZXNcblxuICAgIC8vIEJsb2NrIG11bHRpcGxlIGNhbGxzXG4gICAgaWYgKGlzQ29uZmlndXJlZCkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdQdXNoLkNvbmZpZ3VyZSBzaG91bGQgbm90IGJlIGNhbGxlZCBtb3JlIHRoYW4gb25jZSEnKTtcbiAgICB9XG5cbiAgICBpc0NvbmZpZ3VyZWQgPSB0cnVlO1xuXG4gICAgLy8gQWRkIGRlYnVnIGluZm9cbiAgICBpZiAoUHVzaC5kZWJ1Zykge1xuICAgICAgY29uc29sZS5sb2coJ1B1c2guQ29uZmlndXJlJywgb3B0aW9ucyk7XG4gICAgfVxuXG4gICAgLy8gVGhpcyBmdW5jdGlvbiBpcyBjYWxsZWQgd2hlbiBhIHRva2VuIGlzIHJlcGxhY2VkIG9uIGEgZGV2aWNlIC0gbm9ybWFsbHlcbiAgICAvLyB0aGlzIHNob3VsZCBub3QgaGFwcGVuLCBidXQgaWYgaXQgZG9lcyB3ZSBzaG91bGQgdGFrZSBhY3Rpb24gb24gaXRcbiAgICBfcmVwbGFjZVRva2VuID0gZnVuY3Rpb24oY3VycmVudFRva2VuLCBuZXdUb2tlbikge1xuICAgICAgICAvLyBjb25zb2xlLmxvZygnUmVwbGFjZSB0b2tlbjogJyArIGN1cnJlbnRUb2tlbiArICcgLS0gJyArIG5ld1Rva2VuKTtcbiAgICAgICAgLy8gSWYgdGhlIHNlcnZlciBnZXRzIGEgdG9rZW4gZXZlbnQgaXRzIHBhc3NpbmcgaW4gdGhlIGN1cnJlbnQgdG9rZW4gYW5kXG4gICAgICAgIC8vIHRoZSBuZXcgdmFsdWUgLSBpZiBuZXcgdmFsdWUgaXMgdW5kZWZpbmVkIHRoaXMgZW1wdHkgdGhlIHRva2VuXG4gICAgICAgIHNlbGYuZW1pdFN0YXRlKCd0b2tlbicsIGN1cnJlbnRUb2tlbiwgbmV3VG9rZW4pO1xuICAgIH07XG5cbiAgICAvLyBSaWcgdGhlIHJlbW92ZVRva2VuIGNhbGxiYWNrXG4gICAgX3JlbW92ZVRva2VuID0gZnVuY3Rpb24odG9rZW4pIHtcbiAgICAgICAgLy8gY29uc29sZS5sb2coJ1JlbW92ZSB0b2tlbjogJyArIHRva2VuKTtcbiAgICAgICAgLy8gSW52YWxpZGF0ZSB0aGUgdG9rZW5cbiAgICAgICAgc2VsZi5lbWl0U3RhdGUoJ3Rva2VuJywgdG9rZW4sIG51bGwpO1xuICAgIH07XG5cblxuICAgIGlmIChvcHRpb25zLmFwbikge1xuICAgICAgICBpZiAoUHVzaC5kZWJ1Zykge1xuICAgICAgICAgIGNvbnNvbGUubG9nKCdQdXNoOiBBUE4gY29uZmlndXJlZCcpO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gQWxsb3cgcHJvZHVjdGlvbiB0byBiZSBhIGdlbmVyYWwgb3B0aW9uIGZvciBwdXNoIG5vdGlmaWNhdGlvbnNcbiAgICAgICAgaWYgKG9wdGlvbnMucHJvZHVjdGlvbiA9PT0gQm9vbGVhbihvcHRpb25zLnByb2R1Y3Rpb24pKSB7XG4gICAgICAgICAgb3B0aW9ucy5hcG4ucHJvZHVjdGlvbiA9IG9wdGlvbnMucHJvZHVjdGlvbjtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIEdpdmUgdGhlIHVzZXIgd2FybmluZ3MgYWJvdXQgZGV2ZWxvcG1lbnQgc2V0dGluZ3NcbiAgICAgICAgaWYgKG9wdGlvbnMuYXBuLmRldmVsb3BtZW50KSB7XG4gICAgICAgICAgLy8gVGhpcyBmbGFnIGlzIG5vcm1hbGx5IHNldCBieSB0aGUgY29uZmlndXJhdGlvbiBmaWxlXG4gICAgICAgICAgY29uc29sZS53YXJuKCdXQVJOSU5HOiBQdXNoIEFQTiBpcyB1c2luZyBkZXZlbG9wbWVudCBrZXkgYW5kIGNlcnRpZmljYXRlJyk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgLy8gV2UgY2hlY2sgdGhlIGFwbiBnYXRld2F5IGkgdGhlIG9wdGlvbnMsIHdlIGNvdWxkIHJpc2sgc2hpcHBpbmdcbiAgICAgICAgICAvLyBzZXJ2ZXIgaW50byBwcm9kdWN0aW9uIHdoaWxlIHVzaW5nIHRoZSBwcm9kdWN0aW9uIGNvbmZpZ3VyYXRpb24uXG4gICAgICAgICAgLy8gT24gdGhlIG90aGVyIGhhbmQgd2UgY291bGQgYmUgaW4gZGV2ZWxvcG1lbnQgYnV0IHVzaW5nIHRoZSBwcm9kdWN0aW9uXG4gICAgICAgICAgLy8gY29uZmlndXJhdGlvbi4gQW5kIGZpbmFsbHkgd2UgY291bGQgaGF2ZSBjb25maWd1cmVkIGFuIHVua25vd24gYXBuXG4gICAgICAgICAgLy8gZ2F0ZXdheSAodGhpcyBjb3VsZCBjaGFuZ2UgaW4gdGhlIGZ1dHVyZSAtIGJ1dCBhIHdhcm5pbmcgYWJvdXQgdHlwb3NcbiAgICAgICAgICAvLyBjYW4gc2F2ZSBob3VycyBvZiBkZWJ1Z2dpbmcpXG4gICAgICAgICAgLy9cbiAgICAgICAgICAvLyBXYXJuIGFib3V0IGdhdGV3YXkgY29uZmlndXJhdGlvbnMgLSBpdCdzIG1vcmUgYSBndWlkZVxuICAgICAgICAgIGlmIChvcHRpb25zLmFwbi5nYXRld2F5KSB7XG5cbiAgICAgICAgICAgICAgaWYgKG9wdGlvbnMuYXBuLmdhdGV3YXkgPT09ICdnYXRld2F5LnNhbmRib3gucHVzaC5hcHBsZS5jb20nKSB7XG4gICAgICAgICAgICAgICAgICAvLyBVc2luZyB0aGUgZGV2ZWxvcG1lbnQgc2FuZGJveFxuICAgICAgICAgICAgICAgICAgY29uc29sZS53YXJuKCdXQVJOSU5HOiBQdXNoIEFQTiBpcyBpbiBkZXZlbG9wbWVudCBtb2RlJyk7XG4gICAgICAgICAgICAgIH0gZWxzZSBpZiAob3B0aW9ucy5hcG4uZ2F0ZXdheSA9PT0gJ2dhdGV3YXkucHVzaC5hcHBsZS5jb20nKSB7XG4gICAgICAgICAgICAgICAgICAvLyBJbiBwcm9kdWN0aW9uIC0gYnV0IHdhcm4gaWYgd2UgYXJlIHJ1bm5pbmcgb24gbG9jYWxob3N0XG4gICAgICAgICAgICAgICAgICBpZiAoL2h0dHA6XFwvXFwvbG9jYWxob3N0Ly50ZXN0KE1ldGVvci5hYnNvbHV0ZVVybCgpKSkge1xuICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUud2FybignV0FSTklORzogUHVzaCBBUE4gaXMgY29uZmlndXJlZCB0byBwcm9kdWN0aW9uIG1vZGUgLSBidXQgc2VydmVyIGlzIHJ1bm5pbmcnICtcbiAgICAgICAgICAgICAgICAgICAgICAgICcgZnJvbSBsb2NhbGhvc3QnKTtcbiAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgIC8vIFdhcm4gYWJvdXQgZ2F0ZXdheXMgd2UgZG9udCBrbm93IGFib3V0XG4gICAgICAgICAgICAgICAgICBjb25zb2xlLndhcm4oJ1dBUk5JTkc6IFB1c2ggQVBOIHVua293biBnYXRld2F5IFwiJyArIG9wdGlvbnMuYXBuLmdhdGV3YXkgKyAnXCInKTtcbiAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgaWYgKG9wdGlvbnMuYXBuLnByb2R1Y3Rpb24pIHtcbiAgICAgICAgICAgICAgICAgIGlmICgvaHR0cDpcXC9cXC9sb2NhbGhvc3QvLnRlc3QoTWV0ZW9yLmFic29sdXRlVXJsKCkpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgY29uc29sZS53YXJuKCdXQVJOSU5HOiBQdXNoIEFQTiBpcyBjb25maWd1cmVkIHRvIHByb2R1Y3Rpb24gbW9kZSAtIGJ1dCBzZXJ2ZXIgaXMgcnVubmluZycgK1xuICAgICAgICAgICAgICAgICAgICAgICAgJyBmcm9tIGxvY2FsaG9zdCcpO1xuICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgY29uc29sZS53YXJuKCdXQVJOSU5HOiBQdXNoIEFQTiBpcyBpbiBkZXZlbG9wbWVudCBtb2RlJyk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG5cbiAgICAgICAgfVxuXG4gICAgICAgIC8vIENoZWNrIGNlcnRpZmljYXRlIGRhdGFcbiAgICAgICAgaWYgKCFvcHRpb25zLmFwbi5jZXJ0RGF0YSB8fCAhb3B0aW9ucy5hcG4uY2VydERhdGEubGVuZ3RoKSB7XG4gICAgICAgICAgY29uc29sZS5lcnJvcignRVJST1I6IFB1c2ggc2VydmVyIGNvdWxkIG5vdCBmaW5kIGNlcnREYXRhJyk7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBDaGVjayBrZXkgZGF0YVxuICAgICAgICBpZiAoIW9wdGlvbnMuYXBuLmtleURhdGEgfHwgIW9wdGlvbnMuYXBuLmtleURhdGEubGVuZ3RoKSB7XG4gICAgICAgICAgY29uc29sZS5lcnJvcignRVJST1I6IFB1c2ggc2VydmVyIGNvdWxkIG5vdCBmaW5kIGtleURhdGEnKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIFJpZyBhcG4gY29ubmVjdGlvblxuICAgICAgICB2YXIgYXBuID0gTnBtLnJlcXVpcmUoJ2FwbicpO1xuICAgICAgICB2YXIgYXBuQ29ubmVjdGlvbiA9IG5ldyBhcG4uQ29ubmVjdGlvbiggb3B0aW9ucy5hcG4gKTtcblxuICAgICAgICAvLyBMaXN0ZW4gdG8gdHJhbnNtaXNzaW9uIGVycm9ycyAtIHNob3VsZCBoYW5kbGUgdGhlIHNhbWUgd2F5IGFzIGZlZWRiYWNrLlxuICAgICAgICBhcG5Db25uZWN0aW9uLm9uKCd0cmFuc21pc3Npb25FcnJvcicsIE1ldGVvci5iaW5kRW52aXJvbm1lbnQoZnVuY3Rpb24gKGVyckNvZGUsIG5vdGlmaWNhdGlvbiwgcmVjaXBpZW50KSB7XG4gICAgICAgICAgaWYgKFB1c2guZGVidWcpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCdHb3QgZXJyb3IgY29kZSAlZCBmb3IgdG9rZW4gJXMnLCBlcnJDb2RlLCBub3RpZmljYXRpb24udG9rZW4pO1xuICAgICAgICAgIH1cbiAgICAgICAgICBpZiAoWzIsIDUsIDhdLmluZGV4T2YoZXJyQ29kZSkgPj0gMCkge1xuXG5cbiAgICAgICAgICAgIC8vIEludmFsaWQgdG9rZW4gZXJyb3JzLi4uXG4gICAgICAgICAgICBfcmVtb3ZlVG9rZW4oe1xuICAgICAgICAgICAgICBhcG46IG5vdGlmaWNhdGlvbi50b2tlblxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgfVxuICAgICAgICB9KSk7XG4gICAgICAgIC8vIFhYWDogc2hvdWxkIHdlIGRvIGEgdGVzdCBvZiB0aGUgY29ubmVjdGlvbj8gSXQgd291bGQgYmUgbmljZSB0byBrbm93XG4gICAgICAgIC8vIFRoYXQgdGhlIHNlcnZlci9jZXJ0aWZpY2F0ZXMvbmV0d29yayBhcmUgY29ycmVjdCBjb25maWd1cmVkXG5cbiAgICAgICAgLy8gYXBuQ29ubmVjdGlvbi5jb25uZWN0KCkudGhlbihmdW5jdGlvbigpIHtcbiAgICAgICAgLy8gICAgIGNvbnNvbGUuaW5mbygnQ0hFQ0s6IFB1c2ggQVBOIGNvbm5lY3Rpb24gT0snKTtcbiAgICAgICAgLy8gfSwgZnVuY3Rpb24oZXJyKSB7XG4gICAgICAgIC8vICAgICBjb25zb2xlLndhcm4oJ0NIRUNLOiBQdXNoIEFQTiBjb25uZWN0aW9uIEZBSUxVUkUnKTtcbiAgICAgICAgLy8gfSk7XG4gICAgICAgIC8vIE5vdGU6IHRoZSBhYm92ZSBjb2RlIHNwb2lscyB0aGUgY29ubmVjdGlvbiAtIGludmVzdGlnYXRlIGhvdyB0b1xuICAgICAgICAvLyBzaHV0ZG93bi9jbG9zZSBpdC5cblxuICAgICAgICBzZWxmLnNlbmRBUE4gPSBmdW5jdGlvbih1c2VyVG9rZW4sIG5vdGlmaWNhdGlvbikge1xuICAgICAgICAgICAgaWYgKE1hdGNoLnRlc3Qobm90aWZpY2F0aW9uLmFwbiwgT2JqZWN0KSkge1xuICAgICAgICAgICAgICBub3RpZmljYXRpb24gPSBfLmV4dGVuZCh7fSwgbm90aWZpY2F0aW9uLCBub3RpZmljYXRpb24uYXBuKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gY29uc29sZS5sb2coJ3NlbmRBUE4nLCBub3RpZmljYXRpb24uZnJvbSwgdXNlclRva2VuLCBub3RpZmljYXRpb24udGl0bGUsIG5vdGlmaWNhdGlvbi50ZXh0LFxuICAgICAgICAgICAgLy8gbm90aWZpY2F0aW9uLmJhZGdlLCBub3RpZmljYXRpb24ucHJpb3JpdHkpO1xuICAgICAgICAgICAgdmFyIHByaW9yaXR5ID0gKG5vdGlmaWNhdGlvbi5wcmlvcml0eSB8fCBub3RpZmljYXRpb24ucHJpb3JpdHkgPT09IDApPyBub3RpZmljYXRpb24ucHJpb3JpdHkgOiAxMDtcblxuICAgICAgICAgICAgdmFyIG15RGV2aWNlID0gbmV3IGFwbi5EZXZpY2UodXNlclRva2VuKTtcblxuICAgICAgICAgICAgdmFyIG5vdGUgPSBuZXcgYXBuLk5vdGlmaWNhdGlvbigpO1xuXG4gICAgICAgICAgICBub3RlLmV4cGlyeSA9IE1hdGguZmxvb3IoRGF0ZS5ub3coKSAvIDEwMDApICsgMzYwMDsgLy8gRXhwaXJlcyAxIGhvdXIgZnJvbSBub3cuXG4gICAgICAgICAgICBpZiAodHlwZW9mIG5vdGlmaWNhdGlvbi5iYWRnZSAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICAgICAgbm90ZS5iYWRnZSA9IG5vdGlmaWNhdGlvbi5iYWRnZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICh0eXBlb2Ygbm90aWZpY2F0aW9uLnNvdW5kICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgICAgICBub3RlLnNvdW5kID0gbm90aWZpY2F0aW9uLnNvdW5kO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy9jb25zb2xlLmxvZyhub3RpZmljYXRpb24uY29udGVudEF2YWlsYWJsZSk7XG4gICAgICAgICAgICAvL2NvbnNvbGUubG9nKFwibGFsYTJcIik7XG4gICAgICAgICAgICAvL2NvbnNvbGUubG9nKG5vdGlmaWNhdGlvbik7XG4gICAgICAgICAgICBpZiAodHlwZW9mIG5vdGlmaWNhdGlvbi5jb250ZW50QXZhaWxhYmxlICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgICAgICAvL2NvbnNvbGUubG9nKFwibGFsYVwiKTtcbiAgICAgICAgICAgICAgbm90ZS5zZXRDb250ZW50QXZhaWxhYmxlKG5vdGlmaWNhdGlvbi5jb250ZW50QXZhaWxhYmxlKTtcbiAgICAgICAgICAgICAgLy9jb25zb2xlLmxvZyhub3RlKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgIC8vIGFkZHMgY2F0ZWdvcnkgc3VwcG9ydCBmb3IgaU9TOCBjdXN0b20gYWN0aW9ucyBhcyBkZXNjcmliZWQgaGVyZTpcbiAgICAgICAgICAgIC8vIGh0dHBzOi8vZGV2ZWxvcGVyLmFwcGxlLmNvbS9saWJyYXJ5L2lvcy9kb2N1bWVudGF0aW9uL05ldHdvcmtpbmdJbnRlcm5ldC9Db25jZXB0dWFsL1xuICAgICAgICAgICAgLy8gUmVtb3RlTm90aWZpY2F0aW9uc1BHL0NoYXB0ZXJzL0lQaG9uZU9TQ2xpZW50SW1wLmh0bWwjLy9hcHBsZV9yZWYvZG9jL3VpZC9UUDQwMDA4MTk0LUNIMTAzLVNXMzZcbiAgICAgICAgICAgIGlmICh0eXBlb2Ygbm90aWZpY2F0aW9uLmNhdGVnb3J5ICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgICAgICBub3RlLmNhdGVnb3J5ID0gbm90aWZpY2F0aW9uLmNhdGVnb3J5O1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBub3RlLmFsZXJ0ID0ge1xuICAgICAgICAgICAgICBib2R5OiBub3RpZmljYXRpb24udGV4dFxuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgaWYgKHR5cGVvZiBub3RpZmljYXRpb24udGl0bGUgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgICAgIG5vdGUuYWxlcnQudGl0bGUgPSBub3RpZmljYXRpb24udGl0bGU7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIEFsbG93IHRoZSB1c2VyIHRvIHNldCBwYXlsb2FkIGRhdGFcbiAgICAgICAgICAgIG5vdGUucGF5bG9hZCA9IChub3RpZmljYXRpb24ucGF5bG9hZCkgPyB7IGVqc29uOiBFSlNPTi5zdHJpbmdpZnkobm90aWZpY2F0aW9uLnBheWxvYWQpIH0gOiB7fTtcblxuICAgICAgICAgICAgbm90ZS5wYXlsb2FkLm1lc3NhZ2VGcm9tID0gbm90aWZpY2F0aW9uLmZyb207XG4gICAgICAgICAgICBub3RlLnByaW9yaXR5ID0gcHJpb3JpdHk7XG5cblxuICAgICAgICAgICAgLy8gU3RvcmUgdGhlIHRva2VuIG9uIHRoZSBub3RlIHNvIHdlIGNhbiByZWZlcmVuY2UgaXQgaWYgdGhlcmUgd2FzIGFuIGVycm9yXG4gICAgICAgICAgICBub3RlLnRva2VuID0gdXNlclRva2VuO1xuXG4gICAgICAgICAgICAvLyBjb25zb2xlLmxvZygnSTpTZW5kIG1lc3NhZ2UgdG86ICcgKyB1c2VyVG9rZW4gKyAnIGNvdW50PScgKyBjb3VudCk7XG5cbiAgICAgICAgICAgIGFwbkNvbm5lY3Rpb24ucHVzaE5vdGlmaWNhdGlvbihub3RlLCBteURldmljZSk7XG5cbiAgICAgICAgfTtcblxuXG4gICAgICAgIHZhciBpbml0RmVlZGJhY2sgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB2YXIgYXBuID0gTnBtLnJlcXVpcmUoJ2FwbicpO1xuICAgICAgICAgICAgLy8gY29uc29sZS5sb2coJ0luaXQgZmVlZGJhY2snKTtcbiAgICAgICAgICAgIHZhciBmZWVkYmFja09wdGlvbnMgPSB7XG4gICAgICAgICAgICAgICAgJ2JhdGNoRmVlZGJhY2snOiB0cnVlLFxuXG4gICAgICAgICAgICAgICAgLy8gVGltZSBpbiBTRUNPTkRTXG4gICAgICAgICAgICAgICAgJ2ludGVydmFsJzogNSxcbiAgICAgICAgICAgICAgICBwcm9kdWN0aW9uOiAhb3B0aW9ucy5hcG4uZGV2ZWxvcG1lbnQsXG4gICAgICAgICAgICAgICAgY2VydDogb3B0aW9ucy5jZXJ0RGF0YSxcbiAgICAgICAgICAgICAgICBrZXk6IG9wdGlvbnMua2V5RGF0YSxcbiAgICAgICAgICAgICAgICBwYXNzcGhyYXNlOiBvcHRpb25zLnBhc3NwaHJhc2VcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIHZhciBmZWVkYmFjayA9IG5ldyBhcG4uRmVlZGJhY2soZmVlZGJhY2tPcHRpb25zKTtcbiAgICAgICAgICAgIGZlZWRiYWNrLm9uKCdmZWVkYmFjaycsIGZ1bmN0aW9uIChkZXZpY2VzKSB7XG4gICAgICAgICAgICAgICAgZGV2aWNlcy5mb3JFYWNoKGZ1bmN0aW9uIChpdGVtKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIERvIHNvbWV0aGluZyB3aXRoIGl0ZW0uZGV2aWNlIGFuZCBpdGVtLnRpbWU7XG4gICAgICAgICAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKCdBOlBVU0ggRkVFREJBQ0sgJyArIGl0ZW0uZGV2aWNlICsgJyAtICcgKyBpdGVtLnRpbWUpO1xuICAgICAgICAgICAgICAgICAgICAvLyBUaGUgYXBwIGlzIG1vc3QgbGlrZWx5IHJlbW92ZWQgZnJvbSB0aGUgZGV2aWNlLCB3ZSBzaG91bGRcbiAgICAgICAgICAgICAgICAgICAgLy8gcmVtb3ZlIHRoZSB0b2tlblxuICAgICAgICAgICAgICAgICAgICBfcmVtb3ZlVG9rZW4oe1xuICAgICAgICAgICAgICAgICAgICAgICAgYXBuOiBpdGVtLmRldmljZVxuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICBmZWVkYmFjay5zdGFydCgpO1xuICAgICAgICB9O1xuXG4gICAgICAgIC8vIEluaXQgZmVlZGJhY2sgZnJvbSBhcG4gc2VydmVyXG4gICAgICAgIC8vIFRoaXMgd2lsbCBoZWxwIGtlZXAgdGhlIGFwcENvbGxlY3Rpb24gdXAtdG8tZGF0ZSwgaXQgd2lsbCBoZWxwIHVwZGF0ZVxuICAgICAgICAvLyBhbmQgcmVtb3ZlIHRva2VuIGZyb20gYXBwQ29sbGVjdGlvbi5cbiAgICAgICAgaW5pdEZlZWRiYWNrKCk7XG5cbiAgICB9IC8vIEVPIGlvcyBub3RpZmljYXRpb25cblxuICAgIGlmIChvcHRpb25zLmdjbSAmJiBvcHRpb25zLmdjbS5hcGlLZXkpIHtcbiAgICAgICAgaWYgKFB1c2guZGVidWcpIHtcbiAgICAgICAgICBjb25zb2xlLmxvZygnR0NNIGNvbmZpZ3VyZWQnKTtcbiAgICAgICAgfVxuICAgICAgICAvL3NlbGYuc2VuZEdDTSA9IGZ1bmN0aW9uKG9wdGlvbnMuZnJvbSwgdXNlclRva2Vucywgb3B0aW9ucy50aXRsZSwgb3B0aW9ucy50ZXh0LCBvcHRpb25zLmJhZGdlLCBvcHRpb25zLnByaW9yaXR5KSB7XG4gICAgICAgIHNlbGYuc2VuZEdDTSA9IGZ1bmN0aW9uKHVzZXJUb2tlbnMsIG5vdGlmaWNhdGlvbikge1xuICAgICAgICAgICAgaWYgKE1hdGNoLnRlc3Qobm90aWZpY2F0aW9uLmdjbSwgT2JqZWN0KSkge1xuICAgICAgICAgICAgICBub3RpZmljYXRpb24gPSBfLmV4dGVuZCh7fSwgbm90aWZpY2F0aW9uLCBub3RpZmljYXRpb24uZ2NtKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gTWFrZSBzdXJlIHVzZXJUb2tlbnMgYXJlIGFuIGFycmF5IG9mIHN0cmluZ3NcbiAgICAgICAgICAgIGlmICh1c2VyVG9rZW5zID09PSAnJyt1c2VyVG9rZW5zKSB7XG4gICAgICAgICAgICAgIHVzZXJUb2tlbnMgPSBbdXNlclRva2Vuc107XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIENoZWNrIGlmIGFueSB0b2tlbnMgaW4gdGhlcmUgdG8gc2VuZFxuICAgICAgICAgICAgaWYgKCF1c2VyVG9rZW5zLmxlbmd0aCkge1xuICAgICAgICAgICAgICAgIGlmIChQdXNoLmRlYnVnKSB7XG4gICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnc2VuZEdDTSBubyBwdXNoIHRva2VucyBmb3VuZCcpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChQdXNoLmRlYnVnKSB7XG4gICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdzZW5kR0NNJywgdXNlclRva2Vucywgbm90aWZpY2F0aW9uKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdmFyIGdjbSA9IE5wbS5yZXF1aXJlKCdub2RlLWdjbScpO1xuICAgICAgICAgICAgdmFyIEZpYmVyID0gTnBtLnJlcXVpcmUoJ2ZpYmVycycpO1xuXG4gICAgICAgICAgICAvLyBBbGxvdyB1c2VyIHRvIHNldCBwYXlsb2FkXG4gICAgICAgICAgICB2YXIgZGF0YSA9IChub3RpZmljYXRpb24ucGF5bG9hZCkgPyB7IGVqc29uOiBFSlNPTi5zdHJpbmdpZnkobm90aWZpY2F0aW9uLnBheWxvYWQpIH0gOiB7fTtcblxuICAgICAgICAgICAgZGF0YS50aXRsZSA9IG5vdGlmaWNhdGlvbi50aXRsZTtcbiAgICAgICAgICAgIGRhdGEubWVzc2FnZSA9IG5vdGlmaWNhdGlvbi50ZXh0O1xuXG4gICAgICAgICAgICAvLyBTZXQgaW1hZ2VcbiAgICAgICAgICAgIGlmKHR5cGVvZiBub3RpZmljYXRpb24uaW1hZ2UgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgICAgIGRhdGEuaW1hZ2UgPSBub3RpZmljYXRpb24uaW1hZ2U7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIFNldCBleHRyYSBkZXRhaWxzXG4gICAgICAgICAgICBpZiAodHlwZW9mIG5vdGlmaWNhdGlvbi5iYWRnZSAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICAgICAgZGF0YS5tc2djbnQgPSBub3RpZmljYXRpb24uYmFkZ2U7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAodHlwZW9mIG5vdGlmaWNhdGlvbi5zb3VuZCAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICAgICAgZGF0YS5zb3VuZG5hbWUgPSBub3RpZmljYXRpb24uc291bmQ7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAodHlwZW9mIG5vdGlmaWNhdGlvbi5ub3RJZCAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICAgICAgZGF0YS5ub3RJZCA9IG5vdGlmaWNhdGlvbi5ub3RJZDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmKHR5cGVvZiBub3RpZmljYXRpb24uc3R5bGUgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgICAgIGRhdGEuc3R5bGUgPSBub3RpZmljYXRpb24uc3R5bGU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZih0eXBlb2Ygbm90aWZpY2F0aW9uLnN1bW1hcnlUZXh0ICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgICAgICBkYXRhLnN1bW1hcnlUZXh0ID0gbm90aWZpY2F0aW9uLnN1bW1hcnlUZXh0O1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYodHlwZW9mIG5vdGlmaWNhdGlvbi5waWN0dXJlICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgICAgICBkYXRhLnBpY3R1cmUgPSBub3RpZmljYXRpb24ucGljdHVyZTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy9BY3Rpb24gQnV0dG9uc1xuICAgICAgICAgICAgaWYodHlwZW9mIG5vdGlmaWNhdGlvbi5hY3Rpb25zICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgICAgICBkYXRhLmFjdGlvbnMgPSBub3RpZmljYXRpb24uYWN0aW9ucztcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy9Gb3JjZSBTdGFydFxuICAgICAgICAgICAgaWYodHlwZW9mIG5vdGlmaWNhdGlvbi5mb3JjZVN0YXJ0ICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgICAgICBkYXRhWydmb3JjZS1zdGFydCddID0gbm90aWZpY2F0aW9uLmZvcmNlU3RhcnQ7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZih0eXBlb2Ygbm90aWZpY2F0aW9uLmNvbnRlbnRBdmFpbGFibGUgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgICAgIGRhdGFbJ2NvbnRlbnQtYXZhaWxhYmxlJ10gPSBub3RpZmljYXRpb24uY29udGVudEF2YWlsYWJsZTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy92YXIgbWVzc2FnZSA9IG5ldyBnY20uTWVzc2FnZSgpO1xuICAgICAgICAgICAgdmFyIG1lc3NhZ2UgPSBuZXcgZ2NtLk1lc3NhZ2Uoe1xuICAgICAgICAgICAgICAgIGNvbGxhcHNlS2V5OiBub3RpZmljYXRpb24uZnJvbSxcbiAgICAgICAgICAgIC8vICAgIGRlbGF5V2hpbGVJZGxlOiB0cnVlLFxuICAgICAgICAgICAgLy8gICAgdGltZVRvTGl2ZTogNCxcbiAgICAgICAgICAgIC8vICAgIHJlc3RyaWN0ZWRfcGFja2FnZV9uYW1lOiAnZGsuZ2kyLmFwcCdcbiAgICAgICAgICAgICAgICBkYXRhOiBkYXRhXG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgaWYgKFB1c2guZGVidWcpIHtcbiAgICAgICAgICAgICAgY29uc29sZS5sb2coJ0NyZWF0ZSBHQ00gU2VuZGVyIHVzaW5nIFwiJyArIG9wdGlvbnMuZ2NtLmFwaUtleSArICdcIicpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdmFyIHNlbmRlciA9IG5ldyBnY20uU2VuZGVyKG9wdGlvbnMuZ2NtLmFwaUtleSk7XG5cbiAgICAgICAgICAgIF8uZWFjaCh1c2VyVG9rZW5zLCBmdW5jdGlvbih2YWx1ZSAvKiwga2V5ICovKSB7XG4gICAgICAgICAgICAgICAgaWYgKFB1c2guZGVidWcpIHtcbiAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdBOlNlbmQgbWVzc2FnZSB0bzogJyArIHZhbHVlKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgLyptZXNzYWdlLmFkZERhdGEoJ3RpdGxlJywgdGl0bGUpO1xuICAgICAgICAgICAgbWVzc2FnZS5hZGREYXRhKCdtZXNzYWdlJywgdGV4dCk7XG4gICAgICAgICAgICBtZXNzYWdlLmFkZERhdGEoJ21zZ2NudCcsICcxJyk7XG4gICAgICAgICAgICBtZXNzYWdlLmNvbGxhcHNlS2V5ID0gJ3NpdERyaWZ0JztcbiAgICAgICAgICAgIG1lc3NhZ2UuZGVsYXlXaGlsZUlkbGUgPSB0cnVlO1xuICAgICAgICAgICAgbWVzc2FnZS50aW1lVG9MaXZlID0gMzsqL1xuXG4gICAgICAgICAgICAvLyAvKipcbiAgICAgICAgICAgIC8vICAqIFBhcmFtZXRlcnM6IG1lc3NhZ2UtbGl0ZXJhbCwgdXNlclRva2Vucy1hcnJheSwgTm8uIG9mIHJldHJpZXMsIGNhbGxiYWNrLWZ1bmN0aW9uXG4gICAgICAgICAgICAvLyAgKi9cblxuICAgICAgICAgICAgdmFyIHVzZXJUb2tlbiA9ICh1c2VyVG9rZW5zLmxlbmd0aCA9PT0gMSk/dXNlclRva2Vuc1swXTpudWxsO1xuXG4gICAgICAgICAgICBzZW5kZXIuc2VuZChtZXNzYWdlLCB1c2VyVG9rZW5zLCA1LCBmdW5jdGlvbiAoZXJyLCByZXN1bHQpIHtcbiAgICAgICAgICAgICAgICBpZiAoZXJyKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChQdXNoLmRlYnVnKSB7XG4gICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ0FORFJPSUQgRVJST1I6IHJlc3VsdCBvZiBzZW5kZXI6ICcgKyByZXN1bHQpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHJlc3VsdCA9PT0gbnVsbCkge1xuICAgICAgICAgICAgICAgICAgICAgIGlmIChQdXNoLmRlYnVnKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnQU5EUk9JRDogUmVzdWx0IG9mIHNlbmRlciBpcyBudWxsJyk7XG4gICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBpZiAoUHVzaC5kZWJ1Zykge1xuICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdBTkRST0lEOiBSZXN1bHQgb2Ygc2VuZGVyOiAnICsgSlNPTi5zdHJpbmdpZnkocmVzdWx0KSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgaWYgKHJlc3VsdC5jYW5vbmljYWxfaWRzID09PSAxICYmIHVzZXJUb2tlbikgeyAvLyBqc2hpbnQgaWdub3JlOmxpbmVcblxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gVGhpcyBpcyBhbiBvbGQgZGV2aWNlLCB0b2tlbiBpcyByZXBsYWNlZFxuICAgICAgICAgICAgICAgICAgICAgICAgRmliZXIoZnVuY3Rpb24oc2VsZikge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIFJ1biBpbiBmaWJlclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNlbGYuY2FsbGJhY2soc2VsZi5vbGRUb2tlbiwgc2VsZi5uZXdUb2tlbik7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBjYXRjaChlcnIpIHtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAgICAgfSkucnVuKHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBvbGRUb2tlbjogeyBnY206IHVzZXJUb2tlbiB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5ld1Rva2VuOiB7IGdjbTogcmVzdWx0LnJlc3VsdHNbMF0ucmVnaXN0cmF0aW9uX2lkIH0sIC8vIGpzaGludCBpZ25vcmU6bGluZVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhbGxiYWNrOiBfcmVwbGFjZVRva2VuXG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vX3JlcGxhY2VUb2tlbih7IGdjbTogdXNlclRva2VuIH0sIHsgZ2NtOiByZXN1bHQucmVzdWx0c1swXS5yZWdpc3RyYXRpb25faWQgfSk7XG5cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAvLyBXZSBjYW50IHNlbmQgdG8gdGhhdCB0b2tlbiAtIG1pZ2h0IG5vdCBiZSByZWdpc3RyZWRcbiAgICAgICAgICAgICAgICAgICAgLy8gYXNrIHRoZSB1c2VyIHRvIHJlbW92ZSB0aGUgdG9rZW4gZnJvbSB0aGUgbGlzdFxuICAgICAgICAgICAgICAgICAgICBpZiAocmVzdWx0LmZhaWx1cmUgIT09IDAgJiYgdXNlclRva2VuKSB7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIFRoaXMgaXMgYW4gb2xkIGRldmljZSwgdG9rZW4gaXMgcmVwbGFjZWRcbiAgICAgICAgICAgICAgICAgICAgICAgIEZpYmVyKGZ1bmN0aW9uKHNlbGYpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBSdW4gaW4gZmliZXJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZWxmLmNhbGxiYWNrKHNlbGYudG9rZW4pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gY2F0Y2goZXJyKSB7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIH0pLnJ1bih7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdG9rZW46IHsgZ2NtOiB1c2VyVG9rZW4gfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYWxsYmFjazogX3JlbW92ZVRva2VuXG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vX3JlcGxhY2VUb2tlbih7IGdjbTogdXNlclRva2VuIH0sIHsgZ2NtOiByZXN1bHQucmVzdWx0c1swXS5yZWdpc3RyYXRpb25faWQgfSk7XG5cbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAvLyAvKiogVXNlIHRoZSBmb2xsb3dpbmcgbGluZSBpZiB5b3Ugd2FudCB0byBzZW5kIHRoZSBtZXNzYWdlIHdpdGhvdXQgcmV0cmllc1xuICAgICAgICAgICAgLy8gc2VuZGVyLnNlbmROb1JldHJ5KG1lc3NhZ2UsIHVzZXJUb2tlbnMsIGZ1bmN0aW9uIChyZXN1bHQpIHtcbiAgICAgICAgICAgIC8vICAgICBjb25zb2xlLmxvZygnQU5EUk9JRDogJyArIEpTT04uc3RyaW5naWZ5KHJlc3VsdCkpO1xuICAgICAgICAgICAgLy8gfSk7XG4gICAgICAgICAgICAvLyAqKi9cbiAgICAgICAgfTsgLy8gRU8gc2VuZEFuZHJvaWRcblxuICAgIH0gLy8gRU8gQW5kcm9pZFxuXG4gICAgLy8gVW5pdmVyc2FsIHNlbmQgZnVuY3Rpb25cbiAgICB2YXIgX3F1ZXJ5U2VuZCA9IGZ1bmN0aW9uKHF1ZXJ5LCBvcHRpb25zKSB7XG5cbiAgICAgIHZhciBjb3VudEFwbiA9IFtdO1xuICAgICAgdmFyIGNvdW50R2NtID0gW107XG5cbiAgICAgICAgUHVzaC5hcHBDb2xsZWN0aW9uLmZpbmQocXVlcnkpLmZvckVhY2goZnVuY3Rpb24oYXBwKSB7XG5cbiAgICAgICAgICBpZiAoUHVzaC5kZWJ1Zykge1xuICAgICAgICAgICAgY29uc29sZS5sb2coJ3NlbmQgdG8gdG9rZW4nLCBhcHAudG9rZW4pO1xuICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKGFwcC50b2tlbi5hcG4pIHtcbiAgICAgICAgICAgICAgY291bnRBcG4ucHVzaChhcHAuX2lkKTtcbiAgICAgICAgICAgICAgICAvLyBTZW5kIHRvIEFQTlxuICAgICAgICAgICAgICAgIGlmIChzZWxmLnNlbmRBUE4pIHtcbiAgICAgICAgICAgICAgICAgIHNlbGYuc2VuZEFQTihhcHAudG9rZW4uYXBuLCBvcHRpb25zKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIH0gZWxzZSBpZiAoYXBwLnRva2VuLmdjbSkge1xuICAgICAgICAgICAgICBjb3VudEdjbS5wdXNoKGFwcC5faWQpO1xuXG4gICAgICAgICAgICAgICAgLy8gU2VuZCB0byBHQ01cbiAgICAgICAgICAgICAgICAvLyBXZSBkbyBzdXBwb3J0IG11bHRpcGxlIGhlcmUgLSBzbyB3ZSBzaG91bGQgY29uc3RydWN0IGFuIGFycmF5XG4gICAgICAgICAgICAgICAgLy8gYW5kIHNlbmQgaXQgYnVsayAtIEludmVzdGlnYXRlIGxpbWl0IGNvdW50IG9mIGlkJ3NcbiAgICAgICAgICAgICAgICBpZiAoc2VsZi5zZW5kR0NNKSB7XG4gICAgICAgICAgICAgICAgICBzZWxmLnNlbmRHQ00oYXBwLnRva2VuLmdjbSwgb3B0aW9ucyk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignUHVzaC5zZW5kIGdvdCBhIGZhdWx0eSBxdWVyeScpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgIH0pO1xuXG4gICAgICAgIGlmIChQdXNoLmRlYnVnKSB7XG5cbiAgICAgICAgICBjb25zb2xlLmxvZygnUHVzaDogU2VudCBtZXNzYWdlIFwiJyArIG9wdGlvbnMudGl0bGUgKyAnXCIgdG8gJyArIGNvdW50QXBuLmxlbmd0aCArICcgaW9zIGFwcHMgJyArXG4gICAgICAgICAgICBjb3VudEdjbS5sZW5ndGggKyAnIGFuZHJvaWQgYXBwcycpO1xuXG4gICAgICAgICAgLy8gQWRkIHNvbWUgdmVyYm9zaXR5IGFib3V0IHRoZSBzZW5kIHJlc3VsdCwgbWFraW5nIHN1cmUgdGhlIGRldmVsb3BlclxuICAgICAgICAgIC8vIHVuZGVyc3RhbmRzIHdoYXQganVzdCBoYXBwZW5lZC5cbiAgICAgICAgICBpZiAoIWNvdW50QXBuLmxlbmd0aCAmJiAhY291bnRHY20ubGVuZ3RoKSB7XG4gICAgICAgICAgICBpZiAoUHVzaC5hcHBDb2xsZWN0aW9uLmZpbmQoKS5jb3VudCgpID09PSAwKSB7XG4gICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdQdXNoLCBHVUlERTogVGhlIFwiUHVzaC5hcHBDb2xsZWN0aW9uXCIgaXMgZW1wdHkgLScgK1xuICAgICAgICAgICAgICAgICcgTm8gY2xpZW50cyBoYXZlIHJlZ2lzdHJlZCBvbiB0aGUgc2VydmVyIHlldC4uLicpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0gZWxzZSBpZiAoIWNvdW50QXBuLmxlbmd0aCkge1xuICAgICAgICAgICAgaWYgKFB1c2guYXBwQ29sbGVjdGlvbi5maW5kKHsgJ3Rva2VuLmFwbic6IHsgJGV4aXN0czogdHJ1ZSB9IH0pLmNvdW50KCkgPT09IDApIHtcbiAgICAgICAgICAgICAgY29uc29sZS5sb2coJ1B1c2gsIEdVSURFOiBUaGUgXCJQdXNoLmFwcENvbGxlY3Rpb25cIiAtIE5vIEFQTiBjbGllbnRzIGhhdmUgcmVnaXN0cmVkIG9uIHRoZSBzZXJ2ZXIgeWV0Li4uJyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSBlbHNlIGlmICghY291bnRHY20ubGVuZ3RoKSB7XG4gICAgICAgICAgICBpZiAoUHVzaC5hcHBDb2xsZWN0aW9uLmZpbmQoeyAndG9rZW4uZ2NtJzogeyAkZXhpc3RzOiB0cnVlIH0gfSkuY291bnQoKSA9PT0gMCkge1xuICAgICAgICAgICAgICBjb25zb2xlLmxvZygnUHVzaCwgR1VJREU6IFRoZSBcIlB1c2guYXBwQ29sbGVjdGlvblwiIC0gTm8gR0NNIGNsaWVudHMgaGF2ZSByZWdpc3RyZWQgb24gdGhlIHNlcnZlciB5ZXQuLi4nKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG5cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgYXBuOiBjb3VudEFwbixcbiAgICAgICAgICBnY206IGNvdW50R2NtXG4gICAgICAgIH07XG4gICAgfTtcblxuICAgIHNlbGYuc2VydmVyU2VuZCA9IGZ1bmN0aW9uKG9wdGlvbnMpIHtcbiAgICAgIG9wdGlvbnMgPSBvcHRpb25zIHx8IHsgYmFkZ2U6IDAgfTtcbiAgICAgIHZhciBxdWVyeTtcblxuICAgICAgLy8gQ2hlY2sgYmFzaWMgb3B0aW9uc1xuICAgICAgaWYgKG9wdGlvbnMuZnJvbSAhPT0gJycrb3B0aW9ucy5mcm9tKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcignUHVzaC5zZW5kOiBvcHRpb24gXCJmcm9tXCIgbm90IGEgc3RyaW5nJyk7XG4gICAgICB9XG5cbiAgICAgIGlmIChvcHRpb25zLnRpdGxlICE9PSAnJytvcHRpb25zLnRpdGxlKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcignUHVzaC5zZW5kOiBvcHRpb24gXCJ0aXRsZVwiIG5vdCBhIHN0cmluZycpO1xuICAgICAgfVxuXG4gICAgICBpZiAob3B0aW9ucy50ZXh0ICE9PSAnJytvcHRpb25zLnRleHQpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdQdXNoLnNlbmQ6IG9wdGlvbiBcInRleHRcIiBub3QgYSBzdHJpbmcnKTtcbiAgICAgIH1cblxuICAgICAgaWYgKG9wdGlvbnMudG9rZW4gfHwgb3B0aW9ucy50b2tlbnMpIHtcblxuICAgICAgICAvLyBUaGUgdXNlciBzZXQgb25lIHRva2VuIG9yIGFycmF5IG9mIHRva2Vuc1xuICAgICAgICB2YXIgdG9rZW5MaXN0ID0gKG9wdGlvbnMudG9rZW4pPyBbb3B0aW9ucy50b2tlbl0gOiBvcHRpb25zLnRva2VucztcblxuICAgICAgICBpZiAoUHVzaC5kZWJ1Zykge1xuICAgICAgICAgIGNvbnNvbGUubG9nKCdQdXNoOiBTZW5kIG1lc3NhZ2UgXCInICsgb3B0aW9ucy50aXRsZSArICdcIiB2aWEgdG9rZW4ocyknLCB0b2tlbkxpc3QpO1xuICAgICAgICB9XG5cbiAgICAgICAgcXVlcnkgPSB7XG4gICAgICAgICAgJG9yOiBbXG4gICAgICAgICAgICAgIC8vIFhYWDogVGVzdCB0aGlzIHF1ZXJ5OiBjYW4gd2UgaGFuZCBpbiBhIGxpc3Qgb2YgcHVzaCB0b2tlbnM/XG4gICAgICAgICAgICAgIHsgJGFuZDogW1xuICAgICAgICAgICAgICAgICAgeyB0b2tlbjogeyAkaW46IHRva2VuTGlzdCB9IH0sXG4gICAgICAgICAgICAgICAgICAvLyBBbmQgaXMgbm90IGRpc2FibGVkXG4gICAgICAgICAgICAgICAgICB7IGVuYWJsZWQ6IHsgJG5lOiBmYWxzZSB9fVxuICAgICAgICAgICAgICAgIF1cbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgLy8gWFhYOiBUZXN0IHRoaXMgcXVlcnk6IGRvZXMgdGhpcyB3b3JrIG9uIGFwcCBpZD9cbiAgICAgICAgICAgICAgeyAkYW5kOiBbXG4gICAgICAgICAgICAgICAgICB7IF9pZDogeyAkaW46IHRva2VuTGlzdCB9IH0sIC8vIG9uZSBvZiB0aGUgYXBwIGlkc1xuICAgICAgICAgICAgICAgICAgeyAkb3I6IFtcbiAgICAgICAgICAgICAgICAgICAgICB7ICd0b2tlbi5hcG4nOiB7ICRleGlzdHM6IHRydWUgfSAgfSwgLy8gZ290IGFwbiB0b2tlblxuICAgICAgICAgICAgICAgICAgICAgIHsgJ3Rva2VuLmdjbSc6IHsgJGV4aXN0czogdHJ1ZSB9ICB9ICAvLyBnb3QgZ2NtIHRva2VuXG4gICAgICAgICAgICAgICAgICBdfSxcbiAgICAgICAgICAgICAgICAgIC8vIEFuZCBpcyBub3QgZGlzYWJsZWRcbiAgICAgICAgICAgICAgICAgIHsgZW5hYmxlZDogeyAkbmU6IGZhbHNlIH19XG4gICAgICAgICAgICAgICAgXVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgXVxuICAgICAgICB9O1xuXG4gICAgICB9IGVsc2UgaWYgKG9wdGlvbnMucXVlcnkpIHtcblxuICAgICAgICBpZiAoUHVzaC5kZWJ1Zykge1xuICAgICAgICAgIGNvbnNvbGUubG9nKCdQdXNoOiBTZW5kIG1lc3NhZ2UgXCInICsgb3B0aW9ucy50aXRsZSArICdcIiB2aWEgcXVlcnknLCBvcHRpb25zLnF1ZXJ5KTtcbiAgICAgICAgfVxuXG4gICAgICAgIHF1ZXJ5ID0ge1xuICAgICAgICAgICRhbmQ6IFtcbiAgICAgICAgICAgICAgb3B0aW9ucy5xdWVyeSwgLy8gcXVlcnkgb2JqZWN0XG4gICAgICAgICAgICAgIHsgJG9yOiBbXG4gICAgICAgICAgICAgICAgICB7ICd0b2tlbi5hcG4nOiB7ICRleGlzdHM6IHRydWUgfSAgfSwgLy8gZ290IGFwbiB0b2tlblxuICAgICAgICAgICAgICAgICAgeyAndG9rZW4uZ2NtJzogeyAkZXhpc3RzOiB0cnVlIH0gIH0gIC8vIGdvdCBnY20gdG9rZW5cbiAgICAgICAgICAgICAgXX0sXG4gICAgICAgICAgICAgIC8vIEFuZCBpcyBub3QgZGlzYWJsZWRcbiAgICAgICAgICAgICAgeyBlbmFibGVkOiB7ICRuZTogZmFsc2UgfX1cbiAgICAgICAgICBdXG4gICAgICAgIH07XG4gICAgICB9XG5cblxuICAgICAgaWYgKHF1ZXJ5KSB7XG5cbiAgICAgICAgLy8gQ29udmVydCB0byBxdWVyeVNlbmQgYW5kIHJldHVybiBzdGF0dXNcbiAgICAgICAgcmV0dXJuIF9xdWVyeVNlbmQocXVlcnksIG9wdGlvbnMpO1xuXG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ1B1c2guc2VuZDogcGxlYXNlIHNldCBvcHRpb24gXCJ0b2tlblwiL1widG9rZW5zXCIgb3IgXCJxdWVyeVwiJyk7XG4gICAgICB9XG5cbiAgICB9O1xuXG5cbiAgICAvLyBUaGlzIGludGVydmFsIHdpbGwgYWxsb3cgb25seSBvbmUgbm90aWZpY2F0aW9uIHRvIGJlIHNlbnQgYXQgYSB0aW1lLCBpdFxuICAgIC8vIHdpbGwgY2hlY2sgZm9yIG5ldyBub3RpZmljYXRpb25zIGF0IGV2ZXJ5IGBvcHRpb25zLnNlbmRJbnRlcnZhbGBcbiAgICAvLyAoZGVmYXVsdCBpbnRlcnZhbCBpcyAxNTAwMCBtcylcbiAgICAvL1xuICAgIC8vIEl0IGxvb2tzIGluIG5vdGlmaWNhdGlvbnMgY29sbGVjdGlvbiB0byBzZWUgaWYgdGhlcmVzIGFueSBwZW5kaW5nXG4gICAgLy8gbm90aWZpY2F0aW9ucywgaWYgc28gaXQgd2lsbCB0cnkgdG8gcmVzZXJ2ZSB0aGUgcGVuZGluZyBub3RpZmljYXRpb24uXG4gICAgLy8gSWYgc3VjY2Vzc2Z1bGx5IHJlc2VydmVkIHRoZSBzZW5kIGlzIHN0YXJ0ZWQuXG4gICAgLy9cbiAgICAvLyBJZiBub3RpZmljYXRpb24ucXVlcnkgaXMgdHlwZSBzdHJpbmcsIGl0J3MgYXNzdW1lZCB0byBiZSBhIGpzb24gc3RyaW5nXG4gICAgLy8gdmVyc2lvbiBvZiB0aGUgcXVlcnkgc2VsZWN0b3IuIE1ha2luZyBpdCBhYmxlIHRvIGNhcnJ5IGAkYCBwcm9wZXJ0aWVzIGluXG4gICAgLy8gdGhlIG1vbmdvIGNvbGxlY3Rpb24uXG4gICAgLy9cbiAgICAvLyBQci4gZGVmYXVsdCBub3RpZmljYXRpb25zIGFyZSByZW1vdmVkIGZyb20gdGhlIGNvbGxlY3Rpb24gYWZ0ZXIgc2VuZCBoYXZlXG4gICAgLy8gY29tcGxldGVkLiBTZXR0aW5nIGBvcHRpb25zLmtlZXBOb3RpZmljYXRpb25zYCB3aWxsIHVwZGF0ZSBhbmQga2VlcCB0aGVcbiAgICAvLyBub3RpZmljYXRpb24gZWcuIGlmIG5lZWRlZCBmb3IgaGlzdG9yaWNhbCByZWFzb25zLlxuICAgIC8vXG4gICAgLy8gQWZ0ZXIgdGhlIHNlbmQgaGF2ZSBjb21wbGV0ZWQgYSBcInNlbmRcIiBldmVudCB3aWxsIGJlIGVtaXR0ZWQgd2l0aCBhXG4gICAgLy8gc3RhdHVzIG9iamVjdCBjb250YWluaW5nIG5vdGlmaWNhdGlvbiBpZCBhbmQgdGhlIHNlbmQgcmVzdWx0IG9iamVjdC5cbiAgICAvL1xuICAgIHZhciBpc1NlbmRpbmdOb3RpZmljYXRpb24gPSBmYWxzZTtcblxuICAgIGlmIChvcHRpb25zLnNlbmRJbnRlcnZhbCAhPT0gbnVsbCkge1xuXG4gICAgICAvLyBUaGlzIHdpbGwgcmVxdWlyZSBpbmRleCBzaW5jZSB3ZSBzb3J0IG5vdGlmaWNhdGlvbnMgYnkgY3JlYXRlZEF0XG4gICAgICBQdXNoLm5vdGlmaWNhdGlvbnMuX2Vuc3VyZUluZGV4KHsgY3JlYXRlZEF0OiAxIH0pO1xuICAgICAgUHVzaC5ub3RpZmljYXRpb25zLl9lbnN1cmVJbmRleCh7IHNlbnQ6IDEgfSk7XG4gICAgICBQdXNoLm5vdGlmaWNhdGlvbnMuX2Vuc3VyZUluZGV4KHsgc2VuZGluZzogMSB9KTtcbiAgICAgIFB1c2gubm90aWZpY2F0aW9ucy5fZW5zdXJlSW5kZXgoeyBkZWxheVVudGlsOiAxIH0pO1xuXG4gICAgICB2YXIgc2VuZE5vdGlmaWNhdGlvbiA9IGZ1bmN0aW9uKG5vdGlmaWNhdGlvbikge1xuICAgICAgICAvLyBSZXNlcnZlIG5vdGlmaWNhdGlvblxuICAgICAgICB2YXIgbm93ID0gK25ldyBEYXRlKCk7XG4gICAgICAgIHZhciB0aW1lb3V0QXQgPSBub3cgKyBvcHRpb25zLnNlbmRUaW1lb3V0O1xuICAgICAgICB2YXIgcmVzZXJ2ZWQgPSBQdXNoLm5vdGlmaWNhdGlvbnMudXBkYXRlKHtcbiAgICAgICAgICBfaWQ6IG5vdGlmaWNhdGlvbi5faWQsXG4gICAgICAgICAgc2VudDogZmFsc2UsIC8vIHh4eDogbmVlZCB0byBtYWtlIHN1cmUgdGhpcyBpcyBzZXQgb24gY3JlYXRlXG4gICAgICAgICAgc2VuZGluZzogeyAkbHQ6IG5vdyB9LFxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgJHNldDoge1xuICAgICAgICAgICAgc2VuZGluZzogdGltZW91dEF0LFxuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG5cbiAgICAgICAgLy8gTWFrZSBzdXJlIHdlIG9ubHkgaGFuZGxlIG5vdGlmaWNhdGlvbnMgcmVzZXJ2ZWQgYnkgdGhpc1xuICAgICAgICAvLyBpbnN0YW5jZVxuICAgICAgICBpZiAocmVzZXJ2ZWQpIHtcblxuICAgICAgICAgIC8vIENoZWNrIGlmIHF1ZXJ5IGlzIHNldCBhbmQgaXMgdHlwZSBTdHJpbmdcbiAgICAgICAgICBpZiAobm90aWZpY2F0aW9uLnF1ZXJ5ICYmIG5vdGlmaWNhdGlvbi5xdWVyeSA9PT0gJycrbm90aWZpY2F0aW9uLnF1ZXJ5KSB7XG4gICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAvLyBUaGUgcXVlcnkgaXMgaW4gc3RyaW5nIGpzb24gZm9ybWF0IC0gd2UgbmVlZCB0byBwYXJzZSBpdFxuICAgICAgICAgICAgICBub3RpZmljYXRpb24ucXVlcnkgPSBKU09OLnBhcnNlKG5vdGlmaWNhdGlvbi5xdWVyeSk7XG4gICAgICAgICAgICB9IGNhdGNoKGVycikge1xuICAgICAgICAgICAgICAvLyBEaWQgdGhlIHVzZXIgdGFtcGVyIHdpdGggdGhpcz8/XG4gICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignUHVzaDogRXJyb3Igd2hpbGUgcGFyc2luZyBxdWVyeSBzdHJpbmcsIEVycm9yOiAnICsgZXJyLm1lc3NhZ2UpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cblxuICAgICAgICAgIC8vIFNlbmQgdGhlIG5vdGlmaWNhdGlvblxuICAgICAgICAgIHZhciByZXN1bHQgPSBQdXNoLnNlcnZlclNlbmQobm90aWZpY2F0aW9uKTtcblxuICAgICAgICAgIGlmICghb3B0aW9ucy5rZWVwTm90aWZpY2F0aW9ucykge1xuICAgICAgICAgICAgICAvLyBQci4gRGVmYXVsdCB3ZSB3aWxsIHJlbW92ZSBub3RpZmljYXRpb25zXG4gICAgICAgICAgICAgIFB1c2gubm90aWZpY2F0aW9ucy5yZW1vdmUoeyBfaWQ6IG5vdGlmaWNhdGlvbi5faWQgfSk7XG4gICAgICAgICAgfSBlbHNlIHtcblxuICAgICAgICAgICAgICAvLyBVcGRhdGUgdGhlIG5vdGlmaWNhdGlvblxuICAgICAgICAgICAgICBQdXNoLm5vdGlmaWNhdGlvbnMudXBkYXRlKHsgX2lkOiBub3RpZmljYXRpb24uX2lkIH0sIHtcbiAgICAgICAgICAgICAgICAgICRzZXQ6IHtcbiAgICAgICAgICAgICAgICAgICAgLy8gTWFyayBhcyBzZW50XG4gICAgICAgICAgICAgICAgICAgIHNlbnQ6IHRydWUsXG4gICAgICAgICAgICAgICAgICAgIC8vIFNldCB0aGUgc2VudCBkYXRlXG4gICAgICAgICAgICAgICAgICAgIHNlbnRBdDogbmV3IERhdGUoKSxcbiAgICAgICAgICAgICAgICAgICAgLy8gQ291bnRcbiAgICAgICAgICAgICAgICAgICAgY291bnQ6IHJlc3VsdCxcbiAgICAgICAgICAgICAgICAgICAgLy8gTm90IGJlaW5nIHNlbnQgYW55bW9yZVxuICAgICAgICAgICAgICAgICAgICBzZW5kaW5nOiAwXG4gICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgfVxuXG4gICAgICAgICAgLy8gRW1pdCB0aGUgc2VuZFxuICAgICAgICAgIHNlbGYuZW1pdCgnc2VuZCcsIHsgbm90aWZpY2F0aW9uOiBub3RpZmljYXRpb24uX2lkLCByZXN1bHQ6IHJlc3VsdCB9KTtcblxuICAgICAgICB9IC8vIEVsc2UgY291bGQgbm90IHJlc2VydmVcbiAgICAgIH07IC8vIEVPIHNlbmROb3RpZmljYXRpb25cblxuICAgICAgc2VuZFdvcmtlcihmdW5jdGlvbigpIHtcblxuICAgICAgICAgIGlmIChpc1NlbmRpbmdOb3RpZmljYXRpb24pIHtcbiAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIHRyeSB7XG5cbiAgICAgICAgICAgIC8vIFNldCBzZW5kIGZlbmNlXG4gICAgICAgICAgICBpc1NlbmRpbmdOb3RpZmljYXRpb24gPSB0cnVlO1xuXG4gICAgICAgICAgICAvLyB2YXIgY291bnRTZW50ID0gMDtcbiAgICAgICAgICAgIHZhciBiYXRjaFNpemUgPSBvcHRpb25zLnNlbmRCYXRjaFNpemUgfHwgMTtcblxuICAgICAgICAgICAgdmFyIG5vdyA9ICtuZXcgRGF0ZSgpO1xuXG4gICAgICAgICAgICAvLyBGaW5kIG5vdGlmaWNhdGlvbnMgdGhhdCBhcmUgbm90IGJlaW5nIG9yIGFscmVhZHkgc2VudFxuICAgICAgICAgICAgdmFyIHBlbmRpbmdOb3RpZmljYXRpb25zID0gUHVzaC5ub3RpZmljYXRpb25zLmZpbmQoeyAkYW5kOiBbXG4gICAgICAgICAgICAgICAgICAvLyBNZXNzYWdlIGlzIG5vdCBzZW50XG4gICAgICAgICAgICAgICAgICB7IHNlbnQgOiBmYWxzZSB9LFxuICAgICAgICAgICAgICAgICAgLy8gQW5kIG5vdCBiZWluZyBzZW50IGJ5IG90aGVyIGluc3RhbmNlc1xuICAgICAgICAgICAgICAgICAgeyBzZW5kaW5nOiB7ICRsdDogbm93IH0gfSxcbiAgICAgICAgICAgICAgICAgIC8vIEFuZCBub3QgcXVldWVkIGZvciBmdXR1cmVcbiAgICAgICAgICAgICAgICAgIHsgJG9yOiBbXG4gICAgICAgICAgICAgICAgICAgICAgeyBkZWxheVVudGlsOiB7ICRleGlzdHM6IGZhbHNlIH0gfSxcbiAgICAgICAgICAgICAgICAgICAgICB7IGRlbGF5VW50aWw6ICB7ICRsdGU6IG5ldyBEYXRlKCkgfSB9XG4gICAgICAgICAgICAgICAgICAgIF1cbiAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgXX0sIHtcbiAgICAgICAgICAgICAgICAvLyBTb3J0IGJ5IGNyZWF0ZWQgZGF0ZVxuICAgICAgICAgICAgICAgIHNvcnQ6IHsgY3JlYXRlZEF0OiAxIH0sXG4gICAgICAgICAgICAgICAgbGltaXQ6IGJhdGNoU2l6ZVxuICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgcGVuZGluZ05vdGlmaWNhdGlvbnMuZm9yRWFjaChmdW5jdGlvbihub3RpZmljYXRpb24pIHtcbiAgICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICBzZW5kTm90aWZpY2F0aW9uKG5vdGlmaWNhdGlvbik7XG4gICAgICAgICAgICAgIH0gY2F0Y2goZXJyb3IpIHtcbiAgICAgICAgICAgICAgICBpZiAodHlwZW9mIFB1c2guTG9nID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgICAgICAgICBQdXNoLkxvZygnUHVzaDogQ291bGQgbm90IHNlbmQgbm90aWZpY2F0aW9uIGlkOiBcIicgKyBub3RpZmljYXRpb24uX2lkICsgJ1wiLCBFcnJvcjonLCBlcnJvci5tZXNzYWdlKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKFB1c2guZGVidWcpIHtcbiAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdQdXNoOiBDb3VsZCBub3Qgc2VuZCBub3RpZmljYXRpb24gaWQ6IFwiJyArIG5vdGlmaWNhdGlvbi5faWQgKyAnXCIsIEVycm9yOiAnICsgZXJyb3IubWVzc2FnZSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTsgLy8gRU8gZm9yRWFjaFxuICAgICAgICAgIH0gZmluYWxseSB7XG5cbiAgICAgICAgICAgIC8vIFJlbW92ZSB0aGUgc2VuZCBmZW5jZVxuICAgICAgICAgICAgaXNTZW5kaW5nTm90aWZpY2F0aW9uID0gZmFsc2U7XG4gICAgICAgICAgfVxuICAgICAgfSwgb3B0aW9ucy5zZW5kSW50ZXJ2YWwgfHwgMTUwMDApOyAvLyBEZWZhdWx0IGV2ZXJ5IDE1dGggc2VjXG5cbiAgICB9IGVsc2Uge1xuICAgICAgaWYgKFB1c2guZGVidWcpIHtcbiAgICAgICAgY29uc29sZS5sb2coJ1B1c2g6IFNlbmQgc2VydmVyIGlzIGRpc2FibGVkJyk7XG4gICAgICB9XG4gICAgfVxuXG59O1xuIiwiUHVzaC5hcHBDb2xsZWN0aW9uID0gbmV3IE1vbmdvLkNvbGxlY3Rpb24oJ19yYWl4X3B1c2hfYXBwX3Rva2VucycpO1xuUHVzaC5hcHBDb2xsZWN0aW9uLl9lbnN1cmVJbmRleCh7IHVzZXJJZDogMSB9KTtcblxuUHVzaC5hZGRMaXN0ZW5lcigndG9rZW4nLCBmdW5jdGlvbihjdXJyZW50VG9rZW4sIHZhbHVlKSB7XG4gIGlmICh2YWx1ZSkge1xuICAgIC8vIFVwZGF0ZSB0aGUgdG9rZW4gZm9yIGFwcFxuICAgIFB1c2guYXBwQ29sbGVjdGlvbi51cGRhdGUoeyB0b2tlbjogY3VycmVudFRva2VuIH0sIHsgJHNldDogeyB0b2tlbjogdmFsdWUgfSB9LCB7IG11bHRpOiB0cnVlIH0pO1xuICB9IGVsc2UgaWYgKHZhbHVlID09PSBudWxsKSB7XG4gICAgLy8gUmVtb3ZlIHRoZSB0b2tlbiBmb3IgYXBwXG4gICAgUHVzaC5hcHBDb2xsZWN0aW9uLnVwZGF0ZSh7IHRva2VuOiBjdXJyZW50VG9rZW4gfSwgeyAkdW5zZXQ6IHsgdG9rZW46IHRydWUgfSB9LCB7IG11bHRpOiB0cnVlIH0pO1xuICB9XG59KTtcblxuTWV0ZW9yLm1ldGhvZHMoe1xuICAncmFpeDpwdXNoLXVwZGF0ZSc6IGZ1bmN0aW9uKG9wdGlvbnMpIHtcbiAgICBpZiAoUHVzaC5kZWJ1Zykge1xuICAgICAgY29uc29sZS5sb2coJ1B1c2g6IEdvdCBwdXNoIHRva2VuIGZyb20gYXBwOicsIG9wdGlvbnMpO1xuICAgIH1cblxuICAgIGNoZWNrKG9wdGlvbnMsIHtcbiAgICAgIGlkOiBNYXRjaC5PcHRpb25hbChTdHJpbmcpLFxuICAgICAgdG9rZW46IF9tYXRjaFRva2VuLFxuICAgICAgYXBwTmFtZTogU3RyaW5nLFxuICAgICAgdXNlcklkOiBNYXRjaC5PbmVPZihTdHJpbmcsIG51bGwpLFxuICAgICAgbWV0YWRhdGE6IE1hdGNoLk9wdGlvbmFsKE9iamVjdClcbiAgICB9KTtcblxuICAgIC8vIFRoZSBpZiB1c2VyIGlkIGlzIHNldCB0aGVuIHVzZXIgaWQgc2hvdWxkIG1hdGNoIG9uIGNsaWVudCBhbmQgY29ubmVjdGlvblxuICAgIGlmIChvcHRpb25zLnVzZXJJZCAmJiBvcHRpb25zLnVzZXJJZCAhPT0gdGhpcy51c2VySWQpIHtcbiAgICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoNDAzLCAnRm9yYmlkZGVuIGFjY2VzcycpO1xuICAgIH1cblxuICAgIHZhciBkb2M7XG5cbiAgICAvLyBsb29rdXAgYXBwIGJ5IGlkIGlmIG9uZSB3YXMgaW5jbHVkZWRcbiAgICBpZiAob3B0aW9ucy5pZCkge1xuICAgICAgZG9jID0gUHVzaC5hcHBDb2xsZWN0aW9uLmZpbmRPbmUoe19pZDogb3B0aW9ucy5pZH0pO1xuICAgIH0gZWxzZSBpZiAob3B0aW9ucy51c2VySWQpIHtcbiAgICAgIGRvYyA9IFB1c2guYXBwQ29sbGVjdGlvbi5maW5kT25lKHt1c2VySWQ6IG9wdGlvbnMudXNlcklkfSk7XG4gICAgfVxuXG4gICAgLy8gTm8gZG9jIHdhcyBmb3VuZCAtIHdlIGNoZWNrIHRoZSBkYXRhYmFzZSB0byBzZWUgaWZcbiAgICAvLyB3ZSBjYW4gZmluZCBhIG1hdGNoIGZvciB0aGUgYXBwIHZpYSB0b2tlbiBhbmQgYXBwTmFtZVxuICAgIGlmICghZG9jKSB7XG4gICAgICBkb2MgPSBQdXNoLmFwcENvbGxlY3Rpb24uZmluZE9uZSh7XG4gICAgICAgICRhbmQ6IFtcbiAgICAgICAgICB7IHRva2VuOiBvcHRpb25zLnRva2VuIH0sICAgICAvLyBNYXRjaCB0b2tlblxuICAgICAgICAgIHsgYXBwTmFtZTogb3B0aW9ucy5hcHBOYW1lIH0sIC8vIE1hdGNoIGFwcE5hbWVcbiAgICAgICAgICB7IHRva2VuOiB7ICRleGlzdHM6IHRydWUgfSB9ICAvLyBNYWtlIHN1cmUgdG9rZW4gZXhpc3RzXG4gICAgICAgIF1cbiAgICAgIH0pO1xuICAgIH1cblxuICAgIC8vIGlmIHdlIGNvdWxkIG5vdCBmaW5kIHRoZSBpZCBvciB0b2tlbiB0aGVuIGNyZWF0ZSBpdFxuICAgIGlmICghZG9jKSB7XG4gICAgICAvLyBSaWcgZGVmYXVsdCBkb2NcbiAgICAgIGRvYyA9IHtcbiAgICAgICAgdG9rZW46IG9wdGlvbnMudG9rZW4sXG4gICAgICAgIGFwcE5hbWU6IG9wdGlvbnMuYXBwTmFtZSxcbiAgICAgICAgdXNlcklkOiBvcHRpb25zLnVzZXJJZCxcbiAgICAgICAgZW5hYmxlZDogdHJ1ZSxcbiAgICAgICAgY3JlYXRlZEF0OiBuZXcgRGF0ZSgpLFxuICAgICAgICB1cGRhdGVkQXQ6IG5ldyBEYXRlKClcbiAgICAgIH07XG5cbiAgICAgIC8vIFhYWDogV2UgbWlnaHQgd2FudCB0byBjaGVjayB0aGUgaWQgLSBXaHkgaXNudCB0aGVyZSBhIG1hdGNoIGZvciBpZFxuICAgICAgLy8gaW4gdGhlIE1ldGVvciBjaGVjay4uLiBOb3JtYWwgbGVuZ3RoIDE3IChjb3VsZCBiZSBsYXJnZXIpLCBhbmRcbiAgICAgIC8vIG51bWJlcnMrbGV0dGVycyBhcmUgdXNlZCBpbiBSYW5kb20uaWQoKSB3aXRoIGV4Y2VwdGlvbiBvZiAwIGFuZCAxXG4gICAgICBkb2MuX2lkID0gb3B0aW9ucy5pZCB8fCBSYW5kb20uaWQoKTtcbiAgICAgIC8vIFRoZSB1c2VyIHdhbnRlZCB1cyB0byB1c2UgYSBzcGVjaWZpYyBpZCwgd2UgZGlkbid0IGZpbmQgdGhpcyB3aGlsZVxuICAgICAgLy8gc2VhcmNoaW5nLiBUaGUgY2xpZW50IGNvdWxkIGRlcGVuZCBvbiB0aGUgaWQgZWcuIGFzIHJlZmVyZW5jZSBzb1xuICAgICAgLy8gd2UgcmVzcGVjdCB0aGlzIGFuZCB0cnkgdG8gY3JlYXRlIGEgZG9jdW1lbnQgd2l0aCB0aGUgc2VsZWN0ZWQgaWQ7XG4gICAgICBQdXNoLmFwcENvbGxlY3Rpb24uX2NvbGxlY3Rpb24uaW5zZXJ0KGRvYyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIFdlIGZvdW5kIHRoZSBhcHAgc28gdXBkYXRlIHRoZSB1cGRhdGVkQXQgYW5kIHNldCB0aGUgdG9rZW5cbiAgICAgIFB1c2guYXBwQ29sbGVjdGlvbi51cGRhdGUoeyBfaWQ6IGRvYy5faWQgfSwge1xuICAgICAgICAkc2V0OiB7XG4gICAgICAgICAgdXBkYXRlZEF0OiBuZXcgRGF0ZSgpLFxuICAgICAgICAgIHRva2VuOiBvcHRpb25zLnRva2VuXG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH1cblxuICAgIGlmIChkb2MpIHtcbiAgICAgIC8vIHh4eDogSGFja1xuICAgICAgLy8gQ2xlYW4gdXAgbWVjaCBtYWtpbmcgc3VyZSB0b2tlbnMgYXJlIHVuaXEgLSBhbmRyb2lkIHNvbWV0aW1lcyBnZW5lcmF0ZVxuICAgICAgLy8gbmV3IHRva2VucyByZXN1bHRpbmcgaW4gZHVwbGljYXRlc1xuICAgICAgdmFyIHJlbW92ZWQgPSBQdXNoLmFwcENvbGxlY3Rpb24ucmVtb3ZlKHtcbiAgICAgICAgJGFuZDogW1xuICAgICAgICAgIHsgX2lkOiB7ICRuZTogZG9jLl9pZCB9IH0sXG4gICAgICAgICAgeyB0b2tlbjogZG9jLnRva2VuIH0sICAgICAvLyBNYXRjaCB0b2tlblxuICAgICAgICAgIHsgYXBwTmFtZTogZG9jLmFwcE5hbWUgfSwgLy8gTWF0Y2ggYXBwTmFtZVxuICAgICAgICAgIHsgdG9rZW46IHsgJGV4aXN0czogdHJ1ZSB9IH0gIC8vIE1ha2Ugc3VyZSB0b2tlbiBleGlzdHNcbiAgICAgICAgXVxuICAgICAgfSk7XG5cbiAgICAgIGlmIChyZW1vdmVkICYmIFB1c2guZGVidWcpIHtcbiAgICAgICAgY29uc29sZS5sb2coJ1B1c2g6IFJlbW92ZWQgJyArIHJlbW92ZWQgKyAnIGV4aXN0aW5nIGFwcCBpdGVtcycpO1xuICAgICAgfVxuICAgIH1cblxuICAgIGlmIChkb2MgJiYgUHVzaC5kZWJ1Zykge1xuICAgICAgY29uc29sZS5sb2coJ1B1c2g6IHVwZGF0ZWQnLCBkb2MpO1xuICAgIH1cblxuICAgIGlmICghZG9jKSB7XG4gICAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKDUwMCwgJ3NldFB1c2hUb2tlbiBjb3VsZCBub3QgY3JlYXRlIHJlY29yZCcpO1xuICAgIH1cbiAgICAvLyBSZXR1cm4gdGhlIGRvYyB3ZSB3YW50IHRvIHVzZVxuICAgIHJldHVybiBkb2M7XG4gIH0sXG4gICdyYWl4OnB1c2gtc2V0dXNlcic6IGZ1bmN0aW9uKGlkKSB7XG4gICAgY2hlY2soaWQsIFN0cmluZyk7XG5cbiAgICBpZiAoUHVzaC5kZWJ1Zykge1xuICAgICAgY29uc29sZS5sb2coJ1B1c2g6IFNldHRpbmdzIHVzZXJJZCBcIicgKyB0aGlzLnVzZXJJZCArICdcIiBmb3IgYXBwOicsIGlkKTtcbiAgICB9XG4gICAgLy8gV2UgdXBkYXRlIHRoZSBhcHBDb2xsZWN0aW9uIGlkIHNldHRpbmcgdGhlIE1ldGVvci51c2VySWRcbiAgICB2YXIgZm91bmQgPSBQdXNoLmFwcENvbGxlY3Rpb24udXBkYXRlKHsgX2lkOiBpZCB9LCB7ICRzZXQ6IHsgdXNlcklkOiB0aGlzLnVzZXJJZCB9IH0pO1xuXG4gICAgLy8gTm90ZSB0aGF0IHRoZSBhcHAgaWQgbWlnaHQgbm90IGV4aXN0IGJlY2F1c2Ugbm8gdG9rZW4gaXMgc2V0IHlldC5cbiAgICAvLyBXZSBkbyBjcmVhdGUgdGhlIG5ldyBhcHAgaWQgZm9yIHRoZSB1c2VyIHNpbmNlIHdlIG1pZ2h0IHN0b3JlIGFkZGl0aW9uYWxcbiAgICAvLyBtZXRhZGF0YSBmb3IgdGhlIGFwcCAvIHVzZXJcblxuICAgIC8vIElmIGlkIG5vdCBmb3VuZCB0aGVuIGNyZWF0ZSBpdD9cbiAgICAvLyBXZSBkb250LCBpdHMgYmV0dGVyIHRvIHdhaXQgdW50aWwgdGhlIHVzZXIgd2FudHMgdG9cbiAgICAvLyBzdG9yZSBtZXRhZGF0YSBvciB0b2tlbiAtIFdlIGNvdWxkIGVuZCB1cCB3aXRoIHVudXNlZCBkYXRhIGluIHRoZVxuICAgIC8vIGNvbGxlY3Rpb24gYXQgZXZlcnkgYXBwIHJlLWluc3RhbGwgLyB1cGRhdGVcbiAgICAvL1xuICAgIC8vIFRoZSB1c2VyIGNvdWxkIHN0b3JlIHNvbWUgbWV0YWRhdGEgaW4gYXBwQ29sbGVjdGluIGJ1dCBvbmx5IGlmIHRoZXlcbiAgICAvLyBoYXZlIGNyZWF0ZWQgdGhlIGFwcCBhbmQgcHJvdmlkZWQgYSB0b2tlbi5cbiAgICAvLyBJZiBub3QgdGhlIG1ldGFkYXRhIHNob3VsZCBiZSBzZXQgdmlhIGdyb3VuZDpkYlxuXG4gICAgcmV0dXJuICEhZm91bmQ7XG4gIH0sXG4gICdyYWl4OnB1c2gtbWV0YWRhdGEnOiBmdW5jdGlvbihkYXRhKSB7XG4gICAgY2hlY2soZGF0YSwge1xuICAgICAgaWQ6IFN0cmluZyxcbiAgICAgIG1ldGFkYXRhOiBPYmplY3RcbiAgICB9KTtcblxuICAgIC8vIFNldCB0aGUgbWV0YWRhdGFcbiAgICB2YXIgZm91bmQgPSBQdXNoLmFwcENvbGxlY3Rpb24udXBkYXRlKHsgX2lkOiBkYXRhLmlkIH0sIHsgJHNldDogeyBtZXRhZGF0YTogZGF0YS5tZXRhZGF0YSB9IH0pO1xuXG4gICAgcmV0dXJuICEhZm91bmQ7XG4gIH0sXG4gICdyYWl4OnB1c2gtZW5hYmxlJzogZnVuY3Rpb24oZGF0YSkge1xuICAgIGNoZWNrKGRhdGEsIHtcbiAgICAgIGlkOiBTdHJpbmcsXG4gICAgICBlbmFibGVkOiBCb29sZWFuXG4gICAgfSk7XG5cbiAgICBpZiAoUHVzaC5kZWJ1Zykge1xuICAgICAgY29uc29sZS5sb2coJ1B1c2g6IFNldHRpbmcgZW5hYmxlZCB0byBcIicgKyBkYXRhLmVuYWJsZWQgKyAnXCIgZm9yIGFwcDonLCBkYXRhLmlkKTtcbiAgICB9XG5cbiAgICB2YXIgZm91bmQgPSBQdXNoLmFwcENvbGxlY3Rpb24udXBkYXRlKHsgX2lkOiBkYXRhLmlkIH0sIHsgJHNldDogeyBlbmFibGVkOiBkYXRhLmVuYWJsZWQgfSB9KTtcblxuICAgIHJldHVybiAhIWZvdW5kO1xuICB9XG59KTtcblxuIl19
