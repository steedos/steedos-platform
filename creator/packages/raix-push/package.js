Package.describe({
  name: 'raix:push',
  version: '3.4.1',
  summary: 'Isomorphic Push notifications for APN and GCM',
  git: 'https://github.com/raix/push.git'
});

// Server-side push deps
Npm.depends({
  'apn' : '1.6.2', // '1.7.4', // working: 1.6.2
  'node-gcm' : '0.14.4', // previously: 0.9.6
});

Cordova.depends({
  'phonegap-plugin-push': '1.9.0', // previously 1.8.4
  'cordova-plugin-device': '1.1.3', // previously 1.1.1
});

Package.registerBuildPlugin({
  name: 'configuration',
  use: [
    'check'
  ],
  sources: [
    'plugin/push.configuration.js'
  ],
  npmDependencies: {
    'strip-json-comments': '1.0.4'
  }
});

Package.onUse(function(api) {
  api.versionsFrom('1.2');
  api.use(['ecmascript']);


  api.use([
    'tracker', // Push.id() is reactive
  ], 'client');

  // Keep track of users in the appCollection
  api.use([
    'accounts-base'
  ], ['client', 'server'], { weak: true });

  api.use([
    'raix:eventstate@0.0.2',
    'check',
    'mongo',
    'underscore',
    'ejson',
    'random',   // The push it is created with Random.id()
  ], ['client', 'server']);

  api.use('mongo', 'server');

  // API
  api.addFiles('lib/client/cordova.js', 'web.cordova');

  // Common api
  api.addFiles([
    'lib/common/main.js',
  ], ['web.browser', 'server']);

  // Common api
  api.addFiles([
    'lib/common/notifications.js'
  ], ['client', 'server']);

  // API's
  api.addFiles('lib/client/browser.js', 'web.browser');
  api.addFiles('lib/server/push.api.js', 'server');

  // // Unified api
  api.addFiles('lib/client/client.js', 'client');
  api.addFiles('lib/server/server.js', 'server');

  api.export('Push');

  api.export('_matchToken', { testOnly: true });
  api.export('checkClientSecurity', { testOnly: true });
  api.export('initPushUpdates', { testOnly: true });
  api.export('_replaceToken', { testOnly: true });
  api.export('_removeToken', { testOnly: true });

});
