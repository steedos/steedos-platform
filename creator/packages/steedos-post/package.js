Package.describe({
	name: 'steedos:vip-post',
	version: '0.0.1',
	summary: 'vip post',
	git: '',
	documentation: null
});

Package.onUse(function(api) {

	api.use('coffeescript@1.11.1_4');
	api.use('steedos:creator@0.0.4');
    api.addFiles('models/post.coffee');
	api.addFiles('models/post_comments.coffee');
	api.addFiles('models/post_category.coffee');
})