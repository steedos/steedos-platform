Package.describe({
  name: 'steedos:cfs-ui',
  version: '0.1.3',
  summary: 'CollectionFS, provides UI helpers',
  git: 'https://github.com/CollectionFS/Meteor-cfs-ui.git'
});

Package.onUse(function(api) {
  api.versionsFrom(['1.0']);

  api.use([
    'steedos:cfs-base-package',
    'steedos:cfs-file',
    'blaze',
    'templating'
  ]);

  api.imply([
    'steedos:cfs-base-package'
  ]);

  api.addFiles([
    'ui.html',
    'ui.js'
  ], 'client');
});

// Package.on_test(function (api) {
//   api.use(['collectionfs', 'test-helpers', 'tinytest']);
//   api.add_files('tests/client-tests.js', 'client');
// });
