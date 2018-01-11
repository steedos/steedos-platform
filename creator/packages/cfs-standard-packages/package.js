Package.describe({
  git: 'https://github.com/CollectionFS/Meteor-CollectionFS.git',
  name: 'steedos:cfs-standard-packages',
  version: '0.5.9',
  summary: 'Filesystem for Meteor, collectionFS'
});

Package.onUse(function(api) {
  api.versionsFrom('1.0');

  // Rig the collectionFS package v2
  api.imply([
    // Base util rigs the basis for the FS scope and some general helper mehtods
    'steedos:cfs-base-package@0.0.30',
    // Want to make use of the file object and its api, yes!
    'steedos:cfs-file@0.1.17',
    // Add the FS.Collection to keep track of everything
    'steedos:cfs-collection@0.5.5',
    // Support filters for easy rules about what may be inserted
    'steedos:cfs-collection-filters@0.2.4',
    // Add the option to have ddp and http access point
    'steedos:cfs-access-point@0.1.49',
    // We might also want to have the server create copies of our files?
    'steedos:cfs-worker@0.1.4',
    // By default we want to support uploads over HTTP
    'steedos:cfs-upload-http@0.0.20',
  ]);

});

Package.onTest(function (api) {
  api.use('cfs:standard-packages');
  api.use('test-helpers@1.0.0', 'server');
  api.use([
    'tinytest@1.0.0',
    'underscore@1.0.0',
    'ejson@1.0.0',
    'ordered-dict@1.0.0',
    'random@1.0.0',
    'tracker@1.0.3'
  ]);

  api.addFiles('tests/server-tests.js', 'server');
  api.addFiles('tests/client-tests.js', 'client');
});
