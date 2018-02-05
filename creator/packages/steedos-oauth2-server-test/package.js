Package.describe({
	name: 'steedos:oauth2-server-test',
	version: '0.0.1',
	summary: 'Add oauth2 server support to your application.'
});

Package.onUse(function(api) {
	api.versionsFrom('1.0');
	api.use('coffeescript@1.11.1_4');
	api.use('simple:json-routes@2.1.0');

	api.addFiles('server/methods.coffee', 'server');
	api.addFiles('server/rest.coffee', 'server');
});


Package.onTest(function(api) {

});
