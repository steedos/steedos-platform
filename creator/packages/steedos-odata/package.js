Package.describe({
	name: 'steedos:odata',
	version: '0.0.1',
	summary: 'Steedos odata libraries',
	git: ''
});

Npm.depends({
	'basic-auth': '2.0.0',
	'odata-v4-service-metadata': "0.1.6",
	"odata-v4-service-document": "0.0.3",
	'odata-v4-parser': "git+https://github.com/steedos/odata-v4-parser#master",
	'odata-v4-mongodb': "git+https://github.com/steedos/odata-v4-mongodb#master"
});


Package.onUse(function(api) {
	api.versionsFrom("1.2.1");

	api.use('coffeescript');
	api.use('check');
	api.use('underscore');
	api.use('accounts-password@1.1.4');
	api.use('simple:json-routes@2.1.0');
	api.use('ddp-common');
	api.use(['webapp'], 'server');

	api.use('steedos:objects');

	api.addFiles('lib/restivus/auth.coffee', 'server');
	api.addFiles('lib/restivus/iron-router-error-to-response.js', 'server');
	api.addFiles('lib/restivus/route.coffee', 'server');
	api.addFiles('lib/restivus/restivus.coffee', 'server');

	api.addFiles('server/objects.coffee', 'server');
	api.addFiles('server/odata.coffee', 'server');
	api.addFiles('server/middleware.coffee', 'server');
	api.addFiles('server/metadata.coffee', 'server');


	//api.addFiles('server/routes/metadata.coffee', 'server');
	api.addFiles('client/core.coffee','client');
	api.addFiles('core.coffee');
	api.use('tap:i18n@1.7.0');
	tapi18nFiles = ['i18n/zh-CN.i18n.json','i18n/en.i18n.json'];
	api.addFiles(tapi18nFiles, ['client', 'server']);
});

Package.onTest(function(api) {

});
