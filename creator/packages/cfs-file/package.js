Package.describe({
  git: 'https://github.com/CollectionFS/Meteor-cfs-file.git',
  name: 'steedos:cfs-file',
  version: '0.1.17',
  summary: 'CollectionFS, FS.File object'
});

Npm.depends({
  temp: "0.7.0" // for tests only
});

Package.onUse(function(api) {
  api.versionsFrom('1.0');

  // This imply is needed for tests, and is technically probably correct anyway.
  api.imply([
    'steedos:cfs-base-package'
  ]);

  api.use([
    'steedos:cfs-base-package',
    'steedos:cfs-storage-adapter',
    'tracker',
    'check',
    'ddp',
    'mongo',
    'http',
    'steedos:cfs-data-man',
    'raix:eventemitter@0.1.1'
  ]);

  api.addFiles([
    'fsFile-common.js'
  ], 'client');

  api.addFiles([
    'fsFile-common.js',
    'fsFile-server.js'
  ], 'server');
});

Package.onTest(function (api) {
  api.use([
    'steedos:cfs-standard-packages',
    'steedos:cfs-gridfs',
    'tinytest@1.0.0',
    'http@1.0.0',
    'test-helpers@1.0.0',
    'steedos:cfs-http-methods'
  ]);

  api.addFiles([
    'tests/file-tests.js'
  ]);
});
