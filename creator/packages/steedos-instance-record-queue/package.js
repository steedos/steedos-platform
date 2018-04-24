Package.describe({
	name: 'steedos:instance-record-queue',
	version: '0.0.1',
	summary: '',
	git: ''
});


Package.onUse(function (api) {
	api.versionsFrom('1.0');

	api.use([
		'raix:eventstate@0.0.2',
		'check',
		'mongo',
		'underscore',
		'coffeescript'
	]);

	api.use('mongo', 'server');

	// Common api
	api.addFiles([
		'lib/common/main.js',
	], ['server']);

	// Common api
	api.addFiles([
		'lib/common/docs.js'
	], ['server']);

	// API's
	api.addFiles('lib/server/api.js', 'server');

	// STARTUP
	api.addFiles('server/startup.coffee', 'server');

	api.export('InstanceRecordQueue', ['server']);

});

Package.onTest(function (api) {

});