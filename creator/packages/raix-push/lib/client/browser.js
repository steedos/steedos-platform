/* global chrome: false */
var onNotification = function(notification) {
  // alert('onNotification' + JSON.stringify(notification));

  // Emit alert event - this requires the app to be in forground
  if (notification.message && notification.foreground) {
    Push.emit('alert', notification);
  }

  // Emit sound event
  if (notification.sound) {
    Push.emit('sound', notification);
  }

  // Emit badge event
  if (notification.badge) {
    Push.emit('badge', notification);
  }

  // If within thres
  if (notification.open) {
    Push.emit('startup', notification);
  } else {
    Push.emit('message', notification);
  }
};

Push.setBadge = function(/* count */) {
  // XXX: Not implemented
};

var isConfigured = false;

Push.Configure = function(options) {
  var self = this;

  options = options || {};

  // check(options, {
  //   gcm: Match.Optional(Match.ObjectIncluding({
  //     projectNumber: String
  //   })),
  //   apn: Match.Optional(Match.ObjectIncluding({
  //     webServiceUrl: String,
  //     websitePushId: String
  //   })),
  // });

  // Block multiple calls
  if (isConfigured) {
    throw new Error('Push.Configure should not be called more than once!');
  }

  isConfigured = true;

  // Add debug info
  if (Push.debug) {
    console.log('Push.Configure', options);
  }

  // Client-side security warnings
  checkClientSecurity(options);

  // Start token updates
  initPushUpdates(options.appName);

  // Add support for the raix:iframe push solution Deprecate this at some
  // point mid aug 2015
  if (options.iframe) {

    var coldstart = true;
    var startupTime = new Date();
    var startupThreshold = 1000; // ms

    var _atStartup = function() {
      // If startup time is less than startupThreshold ago then lets say this is
      // at startup.
      return (new Date() - startupTime < startupThreshold);
    };

    var _parsePayload = function(value) {
      // Android actually parses payload into an object - this is not the case with
      // iOS (here is it just a string)
      if (value !== ''+value) {
        value = JSON.stringify(value);
      }

      // Run the string through ejson
      try {
        return EJSON.parse(value);
      } catch(err) {
        return { error: err };
      }
    };

    // Rig iframe event listeners
    options.iframe.addEventListener('deviceready', function() {

      // Maintain properties

      // At initial startup set startup time
      startupTime = new Date();

      // Update flag if app coldstart
      options.iframe.addEventListener("pause", function() {
        coldstart = false;
      }, false);

      options.iframe.addEventListener('resume', function() {
        // Reset startup time at resume
        startupTime = new Date();
      });

      // EO Maintain properties

      options.iframe.addEventListener('pushLaunch', function(e) {

        if (e.event === 'message') {
          // Android event

          var sound = e.soundname || e.payload.sound;

          // Only prefix sound if actual text found
          if (sound && sound.length) {
            sound = '/android_asset/www/' + sound;
          }

          // XXX: Investigate if we need more defaults
          var unifiedMessage = {
            message: e.payload.message || e.msg || '',
            sound: sound,
            badge: e.payload.msgcnt,
            // Coldstart on android is a bit inconsistent - its only set when the
            // notification opens the app
            coldstart: (e.coldstart === Boolean(e.coldstart)) ? e.coldstart : coldstart,
            background: !e.foreground,
            foreground: !!e.foreground,
            // open: _atStartup(),  // This is the iOS implementation
            open: (e.coldstart === Boolean(e.coldstart)), // If set true / false its an open event
            type: 'gcm.cordova'
          };

          // If payload.ejson this is an object - we hand it over to parsePayload,
          // parsePayload will do the convertion for us
          if (e.payload.ejson) {
            unifiedMessage.payload = _parsePayload(e.payload.ejson);
          }

          // Trigger notification
          onNotification(unifiedMessage);

        } else {
          // iOS event
          var sound = e.sound; // jshint ignore: line

          // Only prefix sound if actual text found
          if (sound && sound.length) {
            sound = '' + sound;
          }

          // XXX: Investigate if we need more defaults
          var unifiedMessage = { // jshint ignore: line
            message: e.alert,
            sound: sound,
            badge: e.badge,
            coldstart: coldstart,
            background: !e.foreground,
            foreground: !!e.foreground,
            open: _atStartup(),
            type: 'apn.cordova'
          };

          // E.ejson should be a string - we send it directly to payload
          if (e.ejson) {
            unifiedMessage.payload = _parsePayload(e.ejson);
          }

          // Trigger notification
          onNotification(unifiedMessage);

        }

      });


      options.iframe.addEventListener('pushSuccess', function(evt) {
        // Reformat into new event
        self.emit('register', evt.success);
      });

      options.iframe.addEventListener('pushToken', function(evt) {
        if (evt.androidToken) {
          // Format the android token
          Push.emitState('token', { gcm: evt.androidToken });
        } else if (evt.iosToken) {
          // Format the ios token
          Push.emitState('token', { apn: evt.iosToken });
        }
      });

      options.iframe.addEventListener('pushError', function(evt) {
        Push.emit('error', { type: 'cordova.browser', error: evt.error || evt });
      });

    });
  } // EO options iframe

  if (typeof chrome !== 'undefined' && chrome.gcm) {
    // chrome.gcm api is supported!
    // https://developer.chrome.com/extensions/gcm

    // Set max message size
    // chrome.gcm.MAX_MESSAGE_SIZE = 4096;

    if (options.gcm.projectNumber) {
      chrome.gcm.register(options.gcm.projectNumber, function(token) {
        if (token) {
          self.emitState('token', { gcm: token });
        } else {
          // Error
          self.emit('error', { type: 'gcm.browser', error: 'Access denied' });
        }
      });
    }

  } else if ('safari' in window && 'pushNotification' in window.safari) {
    // https://developer.apple.com/library/mac/documentation/NetworkingInternet/Conceptual/NotificationProgrammingGuideForWebsites/PushNotifications/PushNotifications.html#//apple_ref/doc/uid/TP40013225-CH3-SW1

    if (options.apn) {

      Meteor.startup(function() {
        // Ensure that the user can receive Safari Push Notifications.
        var permissionData = window.safari.pushNotification.permission(options.apn.websitePushId);
        checkRemotePermission(permissionData);
      });

      var checkRemotePermission = function (permissionData) {
          if (permissionData.permission === 'default') {
              // This is a new web service URL and its validity is unknown.
              window.safari.pushNotification.requestPermission(
                  options.apn.webServiceUrl, // The web service URL.
                  options.apn.websitePushId, // The Website Push ID.
                  {}, // Data that you choose to send to your server to help you identify the user.
                  checkRemotePermission         // The callback function.
              );
          }
          else if (permissionData.permission === 'denied') {
              // alert('denied');
              // The user said no.
              self.emit('error', { type: 'apn.browser', error: 'Access denied' });
          }
          else if (permissionData.permission === 'granted') {
              // alert('granted');
              // The web service URL is a valid push provider, and the user said yes.
              // permissionData.deviceToken is now available to use.
              self.emitState('token', { apn: permissionData.deviceToken });
          }
      };

    }


  } else if (navigator && navigator.push && navigator.push.register && navigator.mozSetMessageHandler) {
    // check navigator.mozPush should be enough?
    // https://wiki.mozilla.org/WebAPI/SimplePush

    var channel = 'push';

    // Store the pushEndpoint
    var pushEndpoint;

    Meteor.startup(function() {
      setupAppRegistrations();
    });

    function setupAppRegistrations() { // jshint ignore: line
      // Issue a register() call
      // to register to listen for a notification,
      // you simply call push.register
      // Here, we'll register a channel for "email" updates.
      // Channels can be for anything the app would like to get notifications for.
      var requestAccess = navigator.push.register();

      requestAccess.onsuccess = function(e) {
        // Store the endpoint
        pushEndpoint = e.target.result;

        self.emitState('token', {
          SimplePush: {
            channel: channel,
            endPoint: pushEndpoint
          }
        });
      };

    }

    // Once we've registered, the AppServer can send version pings to the EndPoint.
    // This will trigger a 'push' message to be sent to this handler.
    navigator.mozSetMessageHandler('push', function(message) {
        if (message.pushEndpoint === pushEndpoint) {
          // Did we launch or were we already running?
          self.emit('startup', message);
        }
      });

    // // to unregister, you simply call..
    // AppFramework.addEventListener('user-logout', function() {
    //   navigator.push.unregister(pushEndpoint);
    // });

    // error recovery mechanism
    // will be called very rarely, but application
    // should register again when it is called
    navigator.mozSetMessageHandler('register', function(/* e */) {
      setupAppRegistrations();
    });



  }

};

/*
TODO:

add event listener api

*/
