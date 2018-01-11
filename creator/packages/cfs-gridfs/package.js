Package.describe({
  name: 'steedos:cfs-gridfs',
  version: '0.0.34',
  summary: 'GridFS storage adapter for CollectionFS',
  git: 'https://github.com/CollectionFS/Meteor-cfs-gridfs.git'
});

Npm.depends({
  mongodb: '2.2.4',
  'gridfs-stream': '1.1.1'
  //'gridfs-locking-stream': '0.0.3'
});

Package.onUse(function(api) {
  api.versionsFrom('1.4');

  api.use(['steedos:cfs-base-package@0.0.30', 'steedos:cfs-storage-adapter@0.2.1']);
  api.addFiles('gridfs.server.js', 'server');
  api.addFiles('gridfs.client.js', 'client');
});

Package.onTest(function(api) {
  api.use(['steedos:cfs-gridfs', 'test-helpers', 'tinytest'], 'server');
  api.addFiles('tests/server-tests.js', 'server');
  api.addFiles('tests/client-tests.js', 'client');
});
