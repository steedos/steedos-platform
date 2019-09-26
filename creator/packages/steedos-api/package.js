Package.describe({
	name: 'steedos:api',
	version: '0.0.1',
	summary: 'Steedos api libraries',
	git: ''
});


Package.onUse(function(api) {
	api.versionsFrom("1.2.1");

	api.use('reactive-var');
	api.use('reactive-dict');
	api.use('coffeescript');
	api.use('ecmascript');
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

	api.use('steedos:cfs-standard-packages');
	api.use('raix:push');
	api.use('simple:json-routes@2.1.0');
	api.use('aldeed:tabular@1.6.1');
	api.use('steedos:base');
	api.use('steedos:api-authenticate-user');

	api.addFiles('checkNpm.js', 'server');

	// api.addFiles('routes_middleware_config.coffee', 'server');

	api.addFiles('lib/restivus/auth.coffee', 'server');
	api.addFiles('lib/restivus/iron-router-error-to-response.js', 'server');
	api.addFiles('lib/restivus/route.coffee', 'server');
	api.addFiles('lib/restivus/restivus.coffee', 'server');

	api.addFiles('core.coffee');

	// api.addFiles('steedos/space_users.coffee', 'server');
	// api.addFiles('steedos/organizations.coffee', 'server');

	api.addFiles('routes/s3.coffee', 'server');
	api.addFiles('routes/push.coffee', 'server');
	// api.addFiles('routes/aliyun_push.coffee', 'server');
	// api.addFiles('routes/import.coffee', 'server');
	// api.addFiles('routes/proxy.coffee', 'server');

});

Package.onTest(function(api) {

});