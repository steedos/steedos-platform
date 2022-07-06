/*
 * @Author: sunhaolin@hotoa.com
 * @Date: 2021-07-15 17:30:38
 * @LastEditors: sunhaolin@hotoa.com
 * @LastEditTime: 2022-07-06 10:04:36
 * @Description: 
 */
Package.describe({
  git: 'https://github.com/CollectionFS/Meteor-cfs-storage-adapter.git',
  name: 'steedos:cfs-storage-adapter',
  version: '0.2.3_1',
  summary: 'CollectionFS, Class for creating Storage adapters'
});


Package.onUse(function(api) {
  api.versionsFrom('1.0');
  api.use('ecmascript@0.1.6');

  api.use([
    // CFS
    'steedos:cfs-base-package@0.0.30_1',
    // Core
    'deps',
    'check',
    'livedata',
    'mongo-livedata',
    'ejson',
    // Other
    'raix:eventemitter@0.1.1'
  ]);

  // We want to make sure that its added to scope for now if installed.
  // We have set a deprecation warning on the transform scope
  api.use('steedos:cfs-graphicsmagick@0.0.18_1', 'server', { weak: true });

  api.addFiles([
    'storageAdapter.client.js'
  ], 'client');

  api.addFiles([
    'storageAdapter.server.js',
    'transform.server.js'
  ], 'server');
});

Package.onTest(function (api) {
  api.use('steedos:cfs-storage-adapter@0.2.3_1');
  api.use('test-helpers', 'server');
  api.use(['tinytest', 'underscore', 'ejson', 'ordered-dict',
           'random', 'deps']);

  api.addFiles('tests/server-tests.js', 'server');
  api.addFiles('tests/client-tests.js', 'client');
});
