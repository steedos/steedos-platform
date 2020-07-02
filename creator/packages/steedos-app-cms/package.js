Package.describe({
	name: 'steedos:app-cms',
	version: '0.0.1',
	summary: 'Creator cms',
	git: '',
	documentation: null
});

Package.onUse(function(api) {

	api.use('steedos:creator@0.0.3');
	api.use('coffeescript@1.11.1_4');
	api.addFiles('cms.app.coffee');
	api.addFiles('models/cms_categories.object.coffee');
	api.addFiles('models/cms_posts.object.coffee');
	api.addFiles('models/cms_sites.object.coffee');
})