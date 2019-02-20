Package.describe({
  name: 'steedos:cfs-aliyun',
  version: '0.1.0_2',
  summary: 'Aliyun OSS storage adaptger for CollectionFS',
  git: 'https://github.com/yyang/cfs-aliyun.git',
  documentation: 'README.md'
});


Package.onUse(function(api) {
  api.versionsFrom('1.3');
	api.use('ecmascript');

  api.use(['steedos:cfs-base-package@0.0.30', 'steedos:cfs-storage-adapter@0.2.3']);
  api.addFiles([
    'checkNpm.js',
    'aliyun.server.js',
    'aliyun.stream.js',
    ], 'server');
  api.addFiles('aliyun.client.js', 'client');
});
