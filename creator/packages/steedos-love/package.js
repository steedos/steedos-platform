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
	api.use('simple:json-routes@2.1.0');

	api.addFiles('love-app.coffee');
	api.addFiles('models/love_answer.coffee');
	api.addFiles('models/love_answer2.coffee');
	api.addFiles('models/love_test.coffee');
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
	api.addFiles('test/generator.coffee', 'server');

	api.addFiles('server/routes/api_friend_answered.coffee', 'server');
	api.addFiles('server/routes/api_love_enemy.coffee', 'server');
	api.addFiles('server/routes/api_match_result.coffee', 'server');

	api.export(['LoveManager'], ['server']);
})