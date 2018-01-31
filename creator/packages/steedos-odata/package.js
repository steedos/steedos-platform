Package.describe({
	name: 'steedos:odata',
	version: '0.0.1',
	summary: 'Steedos odata libraries',
	git: ''
});

Npm.depends({
	'odata-v4-parser': "git+https://github.com/steedos/odata-v4-parser#master",
	'odata-v4-mongodb': "git+https://github.com/steedos/odata-v4-mongodb#master"
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
	api.use('npm-bcrypt');
	api.use('webapp', 'server');
	api.use('accounts-password@1.1.4');

	api.use('simple:json-routes@2.1.0');
	api.use('aldeed:tabular@1.6.1');

	api.use('steedos:creator');

	api.addFiles('lib/restivus/auth.coffee', 'server');
	api.addFiles('lib/restivus/iron-router-error-to-response.js', 'server');
	api.addFiles('lib/restivus/route.coffee', 'server');
	api.addFiles('lib/restivus/restivus.coffee', 'server');

	api.addFiles('server/odata.coffee', 'server');

	api.addFiles('core.coffee');

});

Package.onTest(function(api) {

});
