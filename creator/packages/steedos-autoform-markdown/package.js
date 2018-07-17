'use strict';

Package.describe({
    name: 'steedos:markdown',
    summary: 'Steedos Autoform Markdown',
    version: '0.0.1',
    git: ''
});

Package.onUse(function(api) {
    api.versionsFrom('1.2.1');

    api.use(['ecmascript', 'templating', 'underscore', 'less'], 'client');
	api.use('coffeescript@1.11.1_4');
	api.use('aldeed:autoform@5.8.0');
	api.use('q42:autoform-markdown@1.0.0')
    api.addFiles([
		'autoform-markdown.less',
		'autoform-markdown.html',
        'autoform-markdown.coffee'
    ], 'client');
});
