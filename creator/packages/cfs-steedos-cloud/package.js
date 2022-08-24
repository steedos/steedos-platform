/*
 * @Author: sunhaolin@hotoa.com
 * @Date: 2021-08-13 22:02:02
 * @LastEditors: sunhaolin@hotoa.com
 * @LastEditTime: 2022-08-24 16:30:37
 * @Description: 
 */
Package.describe({
  name: 'steedos:cfs-steedos-cloud',
  version: '0.0.6',
  summary: "upload file to kong by aws-sdk",
  git: ""
});


Package.onUse(function(api) {
  api.versionsFrom('1.0');
  api.use('ecmascript@0.1.6');

  api.use(['steedos:cfs-base-package@0.0.30_1', 'steedos:cfs-storage-adapter@0.2.3_1']);
  api.addFiles([
    'checkNpm.js',
    's3.server.js',
    // 's3.indirect.streaming.js',
    // 's3.upload.stream.js',
    's3.upload.stream2.js',
    ], 'server');
  api.addFiles('s3.client.js', 'client');
});

Package.onTest(function(api) {
  api.use(['steedos:cfs-standard-packages@0.5.10_6', 'steedos:cfs-s3@0.1.4_4', 'test-helpers', 'tinytest'], 'server');
  // api.addFiles('tests/server-tests.js', 'server');
  // api.addFiles('tests/client-tests.js', 'client');
});
