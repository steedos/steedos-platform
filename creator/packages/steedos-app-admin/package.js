Package.describe({
	name: 'steedos:app-admin',
	version: '0.0.1',
	summary: 'Creator admin',
	git: '',
	documentation: null
});

Package.onUse(function(api) {

	api.use('steedos:creator@0.0.3');
	api.use('steedos:object-database@0.0.1');
	api.use('steedos:application-package@0.0.1')
	api.use('coffeescript@1.11.1_4');
	api.addFiles('admin.app.coffee');
	api.addFiles('models/OAuth2Clients.coffee','server');
	api.addFiles('models/OAuth2AccessTokens.coffee','server');
});