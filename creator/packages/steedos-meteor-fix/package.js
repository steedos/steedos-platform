Package.describe({
	name: 'steedos:meteor-fix',
	version: '0.0.1',
	summary: 'Steedos meteor-fix libraries',
	git: ''
});


Package.onUse(function (api) {
	api.versionsFrom("1.2.1");

	api.use('coffeescript');
	api.use('ecmascript');
	api.use('tracker');

	api.addFiles('lib/meteor_fix.js', ['client', 'server']);

});

Package.onTest(function (api) {

});