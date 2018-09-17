Package.describe({
	name: 'steedos:app-sales',
	version: '0.0.1',
	summary: 'Creator Sales',
	git: '',
	documentation: null
});

Package.onUse(function(api) {

	api.use('steedos:creator@0.0.5');
	api.use('coffeescript@1.11.1_4');

	api.addFiles('sales.app.coffee'); //, 'server'
	api.addFiles('models/annual_task.coffee'); //, 'server'
	api.addFiles('models/month_task.coffee'); //, 'server'
})