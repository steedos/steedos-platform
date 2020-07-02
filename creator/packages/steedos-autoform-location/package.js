'use strict';

Package.describe({
    name: 'steedos:autoform-location',
    summary: 'Steedos Autoform location',
    version: '0.0.1',
    git: '',
    documentation: null
});

Package.onUse(function(api) {
    api.versionsFrom('1.2.1');

    api.use(['ecmascript', 'templating', 'underscore', 'less'], 'client');
	api.use('coffeescript@1.11.1_4');
	api.use('aldeed:autoform@5.8.0');
    api.addFiles([
		'autoform-location.html',
        'autoform-location.coffee'
    ], 'client');
});
