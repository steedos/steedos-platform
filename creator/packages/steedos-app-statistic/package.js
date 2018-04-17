Package.describe({
	name: 'steedos:app-statistic',
	version: '0.0.1',
	summary: 'Creator statistic',
	git: '',
	documentation: null
});

Package.onUse(function(api) {
	api.use('steedos:creator@0.0.3');
	api.use('coffeescript@1.11.1_4');
	api.addFiles('statistic.app.coffee');
	api.addFiles('models/statistic_instances.object.coffee');
})