Package.describe({
	name: 'steedos:app-workflow',
	version: '0.0.1',
	summary: 'Creator workflow',
	git: '',
	documentation: null
});

Package.onUse(function(api) {

	api.use('steedos:creator@0.0.5');
	api.use('coffeescript@1.11.1_4');
	api.addFiles('workflow.app.coffee');
	api.addFiles('models/Instances.coffee');
	api.addFiles('models/forms.coffee');
	api.addFiles('models/flows.coffee');
})