Package.describe({
	name: 'steedos:love',
	version: '0.0.1',
	summary: 'love',
	git: '',
	documentation: null
});

Npm.depends({
	"node-schedule": "1.2.1"
});

Package.onUse(function(api) {
	api.use('coffeescript@1.11.1_4');
	api.use('steedos:creator@0.0.4');
	api.addFiles('love-app.coffee');
	api.addFiles('models/love_answer.coffee');
	api.addFiles('models/love_answer2.coffee');
	api.addFiles('models/love_hobby.coffee');
	api.addFiles('models/love_looking_for.coffee');
	api.addFiles('models/love_invite_codes.coffee');
	api.addFiles('models/love_about_me.coffee');
	api.addFiles('models/love_result.coffee');
	api.addFiles('models/love_friends.coffee');
	api.addFiles('models/love_work_experience.coffee');
	api.addFiles('models/love_educational_experience.coffee');
	api.addFiles('models/love_recommend.coffee');
	api.addFiles('models/love_recommend_history.coffee');
	// api.addFiles('models/love_city.coffee');

	api.addFiles('server/lib/love_manager.coffee', 'server');
	api.addFiles('server/schedule.coffee', 'server');
	api.addFiles('test/generator.coffee');

	api.export(['LoveManager'], ['server']);
})