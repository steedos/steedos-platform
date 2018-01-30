Package.describe({
	name: 'steedos:app-informations',
	version: '0.0.1',
	summary: 'Creator informations',
	git: '',
	documentation: null
});

Package.onUse(function(api) {

	api.use('coffeescript@1.11.1_4');
	api.use('steedos:creator@0.0.4');
	api.addFiles('qhd_information_app.coffee','client');
	api.addFiles('models/qhd_informations.coffee');
})