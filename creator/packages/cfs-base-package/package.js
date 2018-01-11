Package.describe({
  version: '0.0.30',
  name: 'steedos:cfs-base-package',
  summary: 'CollectionFS, Base package',
  git: 'https://github.com/CollectionFS/Meteor-cfs-base-package.git'
});

Package.onUse(function(api) {
  api.versionsFrom('1.0');

  api.use(['deps', 'underscore', 'ejson']);

  if (api.export) {
    api.export('FS');
    api.export('_Utility', { testOnly: true });
  }

  api.addFiles([
    'base-common.js',
    'base-server.js'
  ], 'server');

  api.addFiles([
    'polyfill.base64.js',
    'base-common.js',
    'base-client.js'
  ], 'client');
});

// Package.on_test(function (api) {
//   api.use(['cfs:base-package', 'cfs-file']);
//   api.use('test-helpers', 'server');
//   api.use(['tinytest', 'underscore', 'ejson', 'ordered-dict',
//            'random', 'deps']);

//   api.add_files('tests/common-tests.js', ['client', 'server']);
// });
