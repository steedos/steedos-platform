'use strict';

Package.describe({
    name: 'steedos:autoform-lookup',
    summary: '',
    version: '0.3.10',
    git: ''
});

Package.onUse(function (api) {
    api.versionsFrom('1.2.1');

    if (!api.addAssets) {
        api.addAssets = function (files, platform) {
            api.addFiles(files, platform, {isAsset: true});
        };
    }

    api.use(['ecmascript', 'templating', 'underscore'], 'client');
    api.use('aldeed:autoform@5.8.0');
    api.use('steedos:lookup@0.1.23', 'client');

    api.addFiles([
        'steedos-autoform-lookup.html',
        'steedos-autoform-lookup.js'
    ], 'client');
});
