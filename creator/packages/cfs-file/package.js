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
    'steedos:cfs-base-package@0.0.30'
  ]);

  api.use([
    'steedos:cfs-base-package@0.0.30',
    'steedos:cfs-storage-adapter@0.2.1',
    'tracker',
    'check',
    'ddp',
    'mongo',
    'http',
    'steedos:cfs-data-man@0.0.6',
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
    'steedos:cfs-standard-packages@0.0.0',
    'steedos:cfs-gridfs@0.0.0',
    'tinytest@1.0.0',
    'http@1.0.0',
    'test-helpers@1.0.0',
    'cfs:http-methods@0.0.29'
  ]);

  api.addFiles([
    'tests/file-tests.js'
  ]);
});
