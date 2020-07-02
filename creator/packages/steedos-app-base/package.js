Package.describe({
	name: 'steedos:app-base',
	version: '0.0.1',
	summary: 'Creator Base Modals',
	git: '',
	documentation: null
});

Package.onUse(function(api) {

	api.use('coffeescript@1.11.1_4');
	api.use('steedos:objects@0.0.7');

	api.addFiles('models/events.coffee');
	api.addFiles('models/tasks.coffee');
	api.addFiles('models/notes.coffee');
})