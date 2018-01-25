Package.describe({
	name: 'steedos:odata',
	version: '0.0.1',
	summary: 'Steedos odata libraries',
	git: ''
});

Npm.depends({
	mongoose: '5.0.1'
});


Package.onUse(function(api) {
	api.versionsFrom("1.2.1");

	api.use('reactive-var');
	api.use('reactive-dict');
	api.use('coffeescript');
	api.use('random');
	api.use('check');
	api.use('ddp');
	api.use('ddp-common');
	api.use('ddp-rate-limiter');
	api.use('underscore');
	api.use('tracker');
	api.use('session');
	api.use('accounts-base');
	api.use('sha');
	api.use('webapp', 'server');
	api.use('ecmascript');

	api.addFiles('server/parser/countParser.js', 'server');
	api.addFiles('server/parser/filterParser.js', 'server');
	api.addFiles('server/parser/functionsParser.js', 'server');
	api.addFiles('server/parser/orderbyParser.js', 'server');
	api.addFiles('server/parser/selectParser.js', 'server');
	api.addFiles('server/parser/skipParser.js', 'server');
	api.addFiles('server/parser/topParser.js', 'server');

	api.addFiles('server/rest/list.js', 'server');
	api.addFiles('server/rest/index.js', 'server');

	api.export(['SteedosOdata'], ['server']);
});

Package.onTest(function(api) {

});
