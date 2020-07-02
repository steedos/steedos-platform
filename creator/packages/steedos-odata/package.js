Package.describe({
	name: 'steedos:odata',
	version: '0.0.7',
	summary: 'Steedos odata libraries',
	git: '',
	documentation: null
});

Package.onUse(function(api) {
	api.versionsFrom("1.2.1");

	api.use('coffeescript');
	api.use('check');
	api.use('underscore');
	api.use('ecmascript');
	api.use('accounts-password@1.1.4');
	api.use('simple:json-routes@2.1.0');
	api.use('ddp-common');
	api.use(['webapp'], 'server');

	api.use('steedos:objects@0.0.9');

	api.addFiles('checkNpm.js', 'server');

	api.addFiles('lib/restivus/auth.coffee', 'server');
	api.addFiles('lib/restivus/iron-router-error-to-response.js', 'server');
	api.addFiles('lib/restivus/route.coffee', 'server');
	api.addFiles('lib/restivus/restivus.coffee', 'server');

	api.addFiles('server/objects.coffee', 'server');
	api.addFiles('server/odata.coffee', 'server');
	api.addFiles('server/middleware.coffee', 'server');
	api.addFiles('server/metadata.coffee', 'server');


	api.addFiles('core.coffee');
});

Package.onTest(function(api) {

});
