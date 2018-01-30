'use strict';

Package.describe({
    name: 'steedos:filesize',
    summary: 'Steedos Autoform filesize',
    version: '0.0.1',
    git: ''
});

Package.onUse(function(api) {
    api.versionsFrom('1.2.1');

    api.use(['ecmascript', 'templating', 'underscore', 'less', 'reactive-var'], 'client');
	api.use('coffeescript@1.11.1_4');
	api.use('aldeed:autoform@5.8.0');
    api.addFiles([
		'autoform-filesize.html',
        'autoform-filesize.coffee'
    ], 'client');
});
