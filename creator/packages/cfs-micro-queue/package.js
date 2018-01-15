Package.describe({
  name: 'steedos:cfs-micro-queue',
  version: '0.0.6',
  summary: 'Micro-queue provides a small, fast queue/list built for Power-Queue',
  git: 'https://github.com/CollectionFS/Meteor-micro-queue.git'
});

Package.onUse(function (api) {
  api.versionsFrom('1.0');

  api.use('deps', ['client', 'server']);

  api.export('MicroQueue');
  api.addFiles(['micro-queue.js'], ['client', 'server']);
});

Package.onTest(function (api) {
  api.use('steedos:cfs-micro-queue');
  api.use('test-helpers', 'server');
  api.use('tinytest');

  api.addFiles('tests.js');
});
