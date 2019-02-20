'use strict';

Package.describe({
    name: 'steedos:autoform-lookup',
    summary: 'Steedos Autoform Lookup',
    version: '0.3.11',
    git: '',
    documentation: null
});

Package.onUse(function(api) {
    api.versionsFrom('1.2.1');

    if (!api.addAssets) {
        api.addAssets = function (files, platform) {
            api.addFiles(files, platform, {isAsset: true});
        };
    }
	api.use('coffeescript@1.11.1_4', 'client');
    api.use(['ecmascript', 'templating', 'underscore', 'less', 'reactive-var'], 'client');
	api.use('aldeed:autoform@5.8.0');
	api.use('rubaxa:sortable@1.3.0', 'client');
    api.addFiles([
		'uni-selectize.js',
        'slds-lookup.html',
        'slds-lookup.js',
        'stylesheets/selectize.default.less',
        'stylesheets/universe-selectize.less',
		'stylesheets/steedos-lookups.less'
    ], 'client');

    api.addFiles('data-source.coffee', 'client');

    api.addAssets('img/loading.gif', 'client');

    api.export(['UniSelectize'], 'client');
});
