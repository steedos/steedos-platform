Package.describe({
  name: 'steedos:cfs-filesaver',
  version: '0.0.6',
  summary: 'CollectionFS, FileSaver by Eli Grey, http://eligrey.com',
  git: 'https://github.com/CollectionFS/Meteor-cfs-filesaver.git'
});

Package.onUse(function(api) {
  api.versionsFrom('1.0');

  api.addFiles([
    'FileSaver.js'
  ], 'client');

});

Package.onTest(function (api) {
  api.use('steedos:cfs-filesaver');
  api.use('test-helpers', 'server');
  api.use(['tinytest', 'underscore', 'ejson', 'ordered-dict',
           'random', 'deps']);

  api.addFiles('tests/client-tests.js', 'server');
  api.addFiles('tests/server-tests.js', 'client');
});
