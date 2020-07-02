Package.describe({
	name: 'steedos:smsqueue',
	version: '0.0.4',
	summary: 'steedos smsqueue',
	documentation: null,
	git: ''
});

Package.onUse(function(api) {
	api.versionsFrom('1.0');
	api.use('ecmascript@0.1.6');
	api.use([
		'raix:eventstate@0.0.2',
		'check',
		'mongo',
		'underscore',
		'ejson',
		'random',
		'coffeescript'
	]);
	api.use('matb33:collection-hooks@0.8.4');
	api.use('mongo', 'server');

	api.addFiles('checkNpm.js', 'server');

	// Common api
	api.addFiles([
		'lib/common/main.js',
	], ['server']);

	// Common api
	api.addFiles([
		'lib/common/sms.js'
	], ['server']);

	// API's
	api.addFiles('lib/server/api.js', 'server');
	api.addFiles('lib/server/webservice.js', 'server');
	// STARTUP
	api.addFiles('server/startup.coffee', 'server');

	api.export('SMSQueue', ['server']);

});

Package.onTest(function(api) {

});