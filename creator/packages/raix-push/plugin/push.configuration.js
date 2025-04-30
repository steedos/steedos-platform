/* global Plugin: false */
var stripComments = Npm.require('strip-json-comments');

// Check the config and log errors
var checkConfig = function(config) { // jshint ignore:line
  check(config, {
    apn: Match.Optional({
      passphrase: String,
      cert: String,
      key: String,
      // Web site config is optional
      webServiceUrl: Match.Optional(String),
      websitePushId: Match.Optional(String),
      // Production is optional, defaults to development
      production: Match.Optional(Boolean),
      gateway: Match.Optional(String),
    }),
    gcm: Match.Optional({
      apiKey: String,
      projectNumber: String
    }),
    // Allow optional production
    production: Match.Optional(Boolean),
    // Allow optional sound, badge, alert, vibrate
    sound: Match.Optional(Boolean),
    badge: Match.Optional(Boolean),
    alert: Match.Optional(Boolean),
    vibrate: Match.Optional(Boolean),
    // Support the old iframe Meteor cordova integration
    iframe: Match.Optional(String),
    // Controls the sending interval
    sendInterval: Match.Optional(Number),
    // Controls the sending batch size per interval
    sendBatchSize: Match.Optional(Number),
    // Allow optional keeping notifications in collection
    keepNotifications: Match.Optional(Boolean)
  });

  // Make sure at least one service is configured?
  if (!config.apn && !config.gcm) {
    console.warn('Push configuration: No push services configured');
  }

  // If apn webServiceUrl or websitePushId then make sure both are set
  if (config.apn && (config.apn.webServiceUrl || config.apn.websitePushId) && !(config.apn.webServiceUrl && config.apn.websitePushId)) { // jshint ignore:line
    throw new Error('Push configuration: Both "apn.webServiceUrl" and "apn.websitePushId" must be set');
  }
};

var clone = function(name, config, result) {
  if (typeof config[name] !== 'undefined') {
    result[name] = config[name];
  }
};

var cloneCommon = function(config, result) {
  clone('production', config, result);
  clone('sound', config, result);
  clone('badge', config, result);
  clone('alert', config, result);
  clone('vibrate', config, result);
  clone('sendInterval', config, result);
  clone('sendBatchSize', config, result);
  clone('keepNotifications', config, result);
};

var archConfig = {
  'web.browser': function(config) {
    var result = {};
    if (config.apn && config.apn.webServiceUrl) {
      // Make sure apn is set
      result.apn = {
        // Set apn web service
        webServiceUrl: config.apn.webServiceUrl,
        websitePushId: config.apn.websitePushId
      };
    }

    if (config.iframe) {
      // Set iframe
      result.iframe = config.iframe;
    }

    if (result) {
      cloneCommon(config, result);
    }

    return result;
  },
  'web.cordova': function(config) {
    var result = {};
    if (config.gcm) {
      // Map to the new cordova plugin
      result.android = {
        senderID: config.gcm.projectNumber,
        alert: Boolean(config.alert),
        badge: Boolean(config.badge),
        sound: Boolean(config.sound),
        vibrate: Boolean(config.vibrate),
        clearNotifications: (config.clearNotifications !== false)
      };

      if (config.icon) {
        result.android.icon = config.icon;
      }

      if (config.iconColor) {
        result.android.iconColor = config.iconColor;
      }
    }

    if (config.apn) {
      result.ios = {
        alert: Boolean(config.alert),
        badge: Boolean(config.badge),
        sound: Boolean(config.sound)
      };
    }

    if (result) {
      cloneCommon(config, result);
    }



    return result;
  },
  'os': function(config) {
    var result = {};
    if (config.apn) {
      // Make sure apn is set
      result.apn = {
        // Set apn web service
        key: config.apn.key,
        cert: config.apn.cert,
        passphrase: config.apn.passphrase
      };
    }

    // When in development mode we set apn-dev if found
    if (config['apn-dev'] && config.production === false) {
      // Make sure apn is set
      result.apn = {
        // Set apn web service
        key: config['apn-dev'].key,
        cert: config['apn-dev'].cert,
        passphrase: config['apn-dev'].passphrase,
        development: true
      };
    }

    if (config.gcm) {
      // Make sure gcm is set
      result.gcm = {
        // Set gcm web service
        apiKey: config.gcm.apiKey
      };
    }

    if (result) {
      cloneCommon(config, result);
    }

    return result;
  }
};

var configStringify = function(config) {
  var str = JSON.stringify(config, null, '\t');
  // We need to do some extra work for apn on the server - since we would
  // load certificates from the app private folder
  if (config.apn && config.apn.key && config.apn.cert) {
    str = str.replace('"key": "' + config.apn.key + '"', '"keyData": Assets.getText(\'' + config.apn.key + '\')');
    str = str.replace('"cert": "' + config.apn.cert + '"', '"certData": Assets.getText(\'' + config.apn.cert + '\')');
  }

  if (config.iframe) {
    str = str.replace('"iframe": "' + config.iframe + '"', 'iframe: ' + config.iframe);
  }

  return 'Meteor.startup(function() {\n\tPush.Configure(' + str + ');\n});';
};


Plugin.registerSourceHandler('push.json', function(compileStep) {
  console.warn('Push: "config.push.json" is deprecating - use the Push.Configure api instead');
  // Read the configuration
  var configString = stripComments(compileStep.read().toString('utf8'));

  try {
    // Try parsing the json
    var config = JSON.parse(configString);

    // Clone the relevant config
    var cloneConfig = archConfig[compileStep.arch];

    var cloned = cloneConfig(config);

    if (cloned) {

      // Serve the configuration
      compileStep.addJavaScript({
        path: 'push.config.' + compileStep.arch + '.js',
        sourcePath: 'push.config.' + compileStep.arch + '.js',
        data: configStringify(cloned),
        bare: /^web/.test(compileStep.arch)
      });

      // console.log(compileStep.arch, configStringify(cloned));

    // } else {
      // No configuration for architecture
    }

  } catch(err) {
    console.error('Push configuration "config.push.json", JSON Error:', err.message);
  }
  // compileStep.arch
});
