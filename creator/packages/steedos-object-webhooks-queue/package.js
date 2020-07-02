Package.describe({
	name: 'steedos:object-webhooks-queue',
	version: '0.0.1',
	summary: 'Queue for objectwebhooks',
	git: '',
	documentation: null
});


Package.onUse(function(api) {
	api.versionsFrom('1.0');

	api.use([
		'raix:eventstate@0.0.2',
		'check',
		'mongo',
		'underscore',
		'ejson',
		'random',
		'coffeescript'
	]);

	api.use('mongo', 'server');


	// api.use('steedos:base@0.1.8');
	// api.use('steedos:smsqueue@0.0.2');

	// Common api
	api.addFiles([
		'lib/common/main.js',
	], ['server']);

	// Common api
	api.addFiles([
		'lib/common/webhooks.js'
	], ['server']);

	// API's
	api.addFiles('lib/server/api.js', 'server');

	// STARTUP
	api.addFiles('server/startup.coffee', 'server');

	api.export('ObjectWebhooksQueue', ['server']);

});

Package.onTest(function(api) {

});