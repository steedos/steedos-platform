Package.describe({
	name: 'steedos:api',
	version: '0.0.1',
	summary: 'Steedos api libraries',
	git: ''
});

Npm.depends({
	'aliyun-sdk': '1.9.2',
	busboy: "0.2.13",
	cookies: "0.6.1",
	mime: "1.3.4",
	'csv': "1.1.0",
	'url': '0.11.0',
	'request': '2.40.0',
	'xinge': '1.1.3',
	'huawei-push': '0.0.6-0',
	'xiaomi-push': '0.4.5'
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

	api.use('cfs:standard-packages');
	api.use('raix:push');
	api.use('simple:json-routes@2.1.0');
	api.use('aldeed:tabular@1.6.1');
	api.use('steedos:base');

	api.addFiles('server/auth_by_access_token.coffee', 'server');
	api.addFiles('server/auth_by_auth_token.coffee', 'server');

	api.addFiles('routes_middleware_config.coffee', 'server');

	api.addFiles('lib/restivus/auth.coffee', 'server');
	api.addFiles('lib/restivus/iron-router-error-to-response.js', 'server');
	api.addFiles('lib/restivus/route.coffee', 'server');
	api.addFiles('lib/restivus/restivus.coffee', 'server');

	api.addFiles('core.coffee');

	api.addFiles('steedos/space_users.coffee', 'server');
	api.addFiles('steedos/organizations.coffee', 'server');

	api.addFiles('routes/s3.coffee', 'server');
	api.addFiles('routes/push.coffee', 'server');
	api.addFiles('routes/aliyun_push.coffee', 'server');
	api.addFiles('routes/import.coffee', 'server');
	api.addFiles('routes/proxy.coffee', 'server');

});

Package.onTest(function(api) {

});
