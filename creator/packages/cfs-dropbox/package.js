Package.describe({
  name: 'steedos:cfs-dropbox',
  version: '0.0.3',
  summary: 'Dropbox storage adapter for CollectionFS',
  git: 'https://github.com/CollectionFS/Meteor-CollectionFS/tree/master/packages/dropbox',
  documentation: 'README.md'
});

Npm.depends({
  'dropbox': '0.10.3',
  'stream-buffers': '2.1.0'
});

Package.onUse(function(api) {
  api.versionsFrom('1.0');

  api.use(['steedos:cfs-base-package', 'steedos:cfs-storage-adapter']);
  api.addFiles([
    'dropbox.server.js',
    'dropbox.upload.stream.js',
  ], 'server');
  api.addFiles('dropbox.client.js', 'client');
});

Package.onTest(function(api) {
  api.use(['steedos:cfs-standard-packages', 'steedos:cfs-dropbox', 'test-helpers', 'tinytest'], 'server');
  api.addFiles('tests/server-tests.js', 'server');
  api.addFiles('tests/client-tests.js', 'client');
});