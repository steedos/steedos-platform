Package.describe({
  git: 'https://github.com/CollectionFS/Meteor-cfs-filesystem.git',
  name: 'steedos:cfs-filesystem',
  version: '0.1.2',
  summary: "Filesystem storage adapter for CollectionFS"
});

Npm.depends({
  //chokidar: "0.8.2",
  mkdirp: "0.3.5"
});

Package.onUse(function(api) {
  api.versionsFrom('1.0');

  api.use(['steedos:cfs-base-package', 'steedos:cfs-storage-adapter']);
  api.addFiles('filesystem.server.js', 'server');
  api.addFiles('filesystem.client.js', 'client');
});

Package.onTest(function(api) {
  api.use(['steedos:cfs-filesystem', 'test-helpers', 'tinytest'], 'server');
  api.addFiles('tests.js', 'server');
});
