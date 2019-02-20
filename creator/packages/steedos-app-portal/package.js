Package.describe({
	name: 'steedos:app-portal',
	version: '0.0.1',
	summary: 'Creator Portal',
	git: '',
	documentation: null
});

Package.onUse(function(api) {

	api.use('steedos:creator@0.0.3');
	api.use('coffeescript@1.11.1_4');
	api.use('steedos:base');

	api.addFiles('portal.app.coffee');
	api.addFiles('models/portal_dashboards.coffee');
	api.addFiles('models/apps_auths.coffee');
	api.addFiles('models/apps_auth_users.coffee');
})