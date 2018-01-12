Package.describe({
  git: 'https://github.com/CollectionFS/Meteor-cfs-worker.git',
  name: 'steedos:cfs-worker',
  version: '0.1.4',
  summary: 'CollectionFS, file worker - handles file copies/versions'
});

Package.onUse(function(api) {
  api.versionsFrom('1.0');

  api.use([
    'steedos:cfs-base-package',
    'steedos:cfs-tempstore',
    'steedos:cfs-storage-adapter'
  ]);

  api.use([
    'livedata',
    'mongo-livedata',
    'steedos:cfs-power-queue'
  ]);

  api.addFiles([
    'fileWorker.js'
  ], 'server');
});

// Package.on_test(function (api) {
//   api.use('steedos:cfs-standard-packages@0.0.0');

//   api.use('test-helpers', 'server');
//   api.use(['tinytest', 'underscore', 'ejson', 'ordered-dict', 'random']);

//   api.addFiles('tests/client-tests.js', 'client');
//   api.addFiles('tests/server-tests.js', 'server');
// });
