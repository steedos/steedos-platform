Package.describe({
	name: 'steedos:app-example',
	version: '0.0.1',
	summary: 'Creator example',
	git: '',
	documentation: null
});

Package.onUse(function(api) {

	api.use('coffeescript@1.11.1_4');
	api.use('steedos:creator@0.0.4');
	api.addFiles('example.coffee','client');
	api.addFiles('models/steedos-lookups.coffee');
	api.addFiles('models/steedos-user-org.coffee');
})