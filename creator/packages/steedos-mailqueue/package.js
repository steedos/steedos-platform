Package.describe({
	name: 'steedos:mailqueue',
	version: '0.0.1',
	summary: 'A MailQueue for nodejs',
	documentation: null,
	git: ''
});


Package.onUse(function(api) {
	api.versionsFrom('1.0');

	api.use('email');

	api.use([
		'raix:eventstate@0.0.2',
		'check',
		'mongo',
		'underscore',
		'ejson',
		'random', // The push it is created with Random.id()
		'coffeescript'
	]);

	api.use('mongo', 'server');

	// Common api
	api.addFiles([
		'lib/common/main.js',
	], ['server']);

	// Common api
	api.addFiles([
		'lib/common/mails.js'
	], ['server']);

	// API's
	api.addFiles('lib/server/api.js', 'server');

	// STARTUP
	api.addFiles('server/startup.coffee', 'server');

	api.export('MailQueue', ['server']);

});

Package.onTest(function(api) {

});