Package.describe({
	name: 'steedos:cors',
	version: '0.0.5',
	summary: 'Enable CORS',
	git: ''
});

Package.onUse(function(api) {
	api.versionsFrom('1.0');

	api.use([
		'coffeescript',
		'webapp'
	]);

	api.use('ecmascript');
	api.addFiles('cors.coffee', 'server');
});
