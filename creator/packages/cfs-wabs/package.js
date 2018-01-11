Package.describe({
  name: 'steedos:cfs-wabs',
  version: '0.1.0',
  summary: "Windows Azure Blob Storage (WABS) adapter for CollectionFS",
  git: "https://github.com/CollectionFS/Meteor-CollectionFS/tree/master/packages/wabs"
});

Npm.depends({
  'azure-storage': "0.7.0"
});

Package.onUse(function(api) {
  api.versionsFrom('1.0');

  api.use(['steedos:cfs-base-package@0.0.30', 'steedos:cfs-storage-adapter@0.2.1']);
  api.addFiles([
    'wabs.server.js',
    ], 'server');
  api.addFiles('wabs.client.js', 'client');
});

Package.onTest(function(api) {
  api.use(['steedos:cfs-standard-packages', 'cfs:wabs', 'test-helpers', 'tinytest'], 'server');
  api.addFiles('tests/server-tests.js', 'server');
  api.addFiles('tests/client-tests.js', 'client');
});
