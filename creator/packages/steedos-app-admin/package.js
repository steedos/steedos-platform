Package.describe({
	name: 'steedos:app-admin',
	version: '0.0.3',
	summary: 'Creator admin',
	git: '',
	documentation: null
});

Package.onUse(function(api) {
	api.use('reactive-var@1.0.10');
	api.use('reactive-dict@1.1.8');
	api.use('coffeescript@1.11.1_4');
	api.use('random@1.0.10');
	api.use('ddp@1.2.5');
	api.use('check@1.2.3');
	api.use('ddp-rate-limiter@1.0.5');
	api.use('underscore@1.0.10');
	api.use('tracker@1.1.0');
	api.use('session@1.1.6');
	api.use('blaze@2.1.9');
	api.use('templating@1.2.15');
	api.use('flemay:less-autoprefixer@1.2.0');

	api.use('steedos:objects@0.0.7');
	api.use('steedos:application-package@0.0.1');
	api.use('steedos:base@0.0.11');
	api.use('steedos:i18n@0.0.11');
	
	api.use('universe:i18n@1.13.0');

	api.addFiles('i18n/en.i18n.json');
	api.addFiles('i18n/zh-CN.i18n.json');
	
	api.addFiles('admin.app.coffee', "server");
	api.addFiles('models/OAuth2Clients.coffee','server');
	api.addFiles('models/OAuth2AccessTokens.coffee','server');
});