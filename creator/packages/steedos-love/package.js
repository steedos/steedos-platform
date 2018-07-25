Package.describe({
	name: 'steedos:love',
	version: '0.0.1',
	summary: 'love',
	git: '',
	documentation: null
});

Package.onUse(function(api) {
	api.use('coffeescript@1.11.1_4');
    api.use('steedos:creator@0.0.4');
    api.addFiles('models/love_answer.coffee');
    api.addFiles('models/love_hobby.coffee');
    api.addFiles('models/love_looking_for.coffee');

})