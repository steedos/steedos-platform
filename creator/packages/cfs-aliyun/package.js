Package.describe({
  name: 'iyyang:cfs-aliyun',
  version: '0.1.0',
  summary: 'Aliyun OSS storage adaptger for CollectionFS',
  git: 'https://github.com/yyang/cfs-aliyun.git',
  documentation: 'README.md'
});

Npm.depends({
  'aliyun-sdk': '1.9.2',
});

Package.onUse(function(api) {
  api.versionsFrom('1.0');

  api.use(['steedos:cfs-base-package', 'steedos:cfs-storage-adapter']);
  api.addFiles([
    'aliyun.server.js',
    'aliyun.stream.js',
    ], 'server');
  api.addFiles('aliyun.client.js', 'client');
});
