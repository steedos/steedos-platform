Package.describe({
  name: 'steedos:cfs-collection',
  version: '0.5.5',
  summary: 'CollectionFS, FS.Collection object',
  git: 'https://github.com/CollectionFS/Meteor-cfs-collection.git'
});

Package.onUse(function(api) {
  api.versionsFrom('1.0');

  api.use([
    // CFS
    'steedos:cfs-base-package',
    'steedos:cfs-tempstore',
    // Core
    'deps',
    'check',
    'livedata',
    'mongo-livedata',
    // Other
    'raix:eventemitter@0.1.1'
  ]);

  // Weak dependencies for uploaders
  api.use(['steedos:cfs-upload-http', 'steedos:cfs-upload-ddp'], { weak: true });

  api.addFiles([
    'common.js',
    'api.common.js'
  ], 'client');

  api.addFiles([
    'common.js',
    'api.common.js'
  ], 'server');
});

Package.onTest(function (api) {
  api.use(['steedos:cfs-standard-packages', 'steedos:cfs-gridfs', 'tinytest', 'underscore', 'test-helpers']);

  api.addFiles('tests/server-tests.js', 'server');
  api.addFiles('tests/client-tests.js', 'client');
});
