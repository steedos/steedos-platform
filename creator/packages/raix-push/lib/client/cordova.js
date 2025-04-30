/* global device: false */
/* global PushNotification: false */
var getService = function() {
  if (/android/i.test(device.platform)) {
    return 'gcm';
  } else if (/ios/i.test(device.platform)) {
    return 'apn';
  } else if (/win/i.test(device.platform)) {
    return 'mpns';
  }

  return 'unknown';
};

/**
 * https://github.com/phonegap/phonegap-plugin-push#pushnotificationinitoptions
 */
class PushHandle extends EventState {
  constructor() {
    super();
    this.configured = false;
    this.debug = false;
    this.token = null;
  }
  log() {
    if (this.debug) {
      console.log(...arguments);
    }
  }
  setBadge(count) {
    this.once('ready', () => {
      if (/ios/i.test(device.platform)) {
        this.log('Push.setBadge:', count);
        // xxx: at the moment only supported on iOS
        this.push.setApplicationIconBadgeNumber(() => {
          this.log('Push.setBadge: was set to', count);
        }, (e) => {
          this.emit('error', {
            type: getService() + '.cordova',
            error: 'Push.setBadge Error: ' + e.message
          });
        }, count);

      }
    });
  }
  unregister(successHandler, errorHandler) {
    if (this.push) {
      this.push.unregister(successHandler, errorHandler);
    } else {
      errorHandler(new Error('Push.unregister, Error: "Push not configured"'));
    }
  }
  Configure(options = {}) {

    if (!this.configured) {
      this.log('Push.Configure:', options);

      this.configured = true;

      Meteor.startup(() => {

        if (typeof PushNotification !== 'undefined') {

          this.push = PushNotification.init(options);

          this.push.on('registration', (data) => {

            // xxx: we need to check that the token has changed before emitting
            // a new token state - sometimes this event is triggered twice
            if (data && data.registrationId && this.token !== data.registrationId) {
              this.token = data.registrationId;

              var token = {
                [getService()]: data.registrationId
              };
              this.log('Push.Token:', token);
              this.emitState('token', token);
            }

            this.emitState('registration', ...arguments);
          });

          this.push.on('notification', (data) => {
            this.log('Push.Notification:', data);
            // xxx: check ejson support on "additionalData" json object

            if (data.additionalData.ejson) {
              if (data.additionalData.ejson === ''+data.additionalData.ejson) {
                try {
                  data.payload = EJSON.parse(data.additionalData.ejson);
                  this.log('Push.Parsed.EJSON.Payload:', data.payload);
                } catch(err) {
                  this.log('Push.Parsed.EJSON.Payload.Error', err.message, data.payload);
                }
              } else {
                data.payload = EJSON.fromJSONValue(data.additionalData.ejson);
                this.log('Push.EJSON.Payload:', data.payload);
              }
            }

            // Emit alert event - this requires the app to be in forground
            if (data.message && data.additionalData.foreground) {
              this.emit('alert', data);
            }

            // Emit sound event
            if (data.sound) {
              this.emit('sound', data);
            }

            // Emit badge event
            if (typeof data.count !== 'undefined') {
              this.log('Push.SettingBadge:', data.count);
              this.setBadge(data.count);
              this.emit('badge', data);
            }

            if (data.additionalData.foreground) {
              this.log('Push.Message: Got message while app is open:', data);
              this.emit('message', data);
            } else {
              this.log('Push.Startup: Got message while app was closed/in background:', data);
              this.emitState('startup', data);
            }

            this.emitState();
          });

          this.push.on('error', (e) => {
            this.log('Push.Error:', e);
            this.emit('error', {
              type: getService() + '.cordova',
              error: e.message
            });
          });

          this.emitState('ready');
        }

      });

      initPushUpdates(options.appName);
    } else {
      this.log('Push.Error: "Push.Configure may only be called once"');
      throw new Error('Push.Configure may only be called once');
    }
  }
}

Push = new PushHandle();
