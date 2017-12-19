'use strict';

Package.describe({
    name: 'steedos:lookup',
    summary: '',
    version: '0.1.23',
    git: ''
});

Package.onUse(function(api) {
    api.versionsFrom('1.2.1');

    if (!api.addAssets) {
        api.addAssets = function (files, platform) {
            api.addFiles(files, platform, {isAsset: true});
        };
    }

    api.use(['ecmascript', 'templating', 'underscore', 'less', 'reactive-var'], 'client');

    api.addFiles([
        'slds-lookup.html',
        'slds-lookup.js',
        'stylesheets/selectize.default.less',
        'stylesheets/universe-selectize.less',
		'stylesheets/steedos-lookups.less'
    ], 'client');

    api.addAssets('img/loading.gif', 'client');

    api.export(['UniSelectize'], 'client');
});
