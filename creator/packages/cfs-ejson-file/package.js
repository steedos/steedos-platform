Package.describe({
  git: 'https://github.com/CollectionFS/Meteor-cfs-ejson-file.git',
  name: 'steedos:cfs-ejson-file',
  version: '0.1.4',
  summary: 'CollectionFS, FS.File as EJSON type'
});

Package.onUse(function(api) {
  api.versionsFrom('1.0');

  api.use([
    // CFS
    'steedos:cfs-base-package',
    'steedos:cfs-file',
    // Core
    'ejson'
  ]);

  api.addFiles([
    'fsFile-ejson.js',
  ], 'client');

  api.addFiles([
    'fsFile-ejson.js',
  ], 'server');
});

Package.onTest(function (api) {
  api.use('steedos:cfs-ejson-file');
  api.use('test-helpers', 'server');
  api.use(['tinytest', 'underscore', 'ejson', 'ordered-dict',
           'random', 'deps']);

  api.addFiles('tests/client-tests.js', 'client');
  api.addFiles('tests/server-tests.js', 'server');
});
