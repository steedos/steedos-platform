 Package.describe({
  git: 'https://github.com/CollectionFS/Meteor-cfs-tempstore.git',
  name: 'steedos:cfs-tempstore',
  version: '0.1.5',
  summary: 'CollectionFS, temporary storage'
});

Npm.depends({
  'combined-stream': '0.0.4'
});

Package.onUse(function(api) {
  api.versionsFrom('1.0');

  api.use(['steedos:cfs-base-package', 'steedos:cfs-file']);

  api.use('steedos:cfs-filesystem', { weak: true });
  api.use('steedos:cfs-gridfs', { weak: true });

  api.use('mongo');

  api.addFiles([
    'tempStore.js'
  ], 'server');
});

// Package.on_test(function (api) {
//   api.use('collectionfs');
//   api.use('test-helpers', 'server');
//   api.use(['tinytest', 'underscore', 'ejson', 'ordered-dict',
//            'random', 'deps']);

//   api.addFiles('tests/server-tests.js', 'server');
// });
