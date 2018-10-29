Package.describe({
	name: 'steedos:app-chat',
	version: '0.0.1',
	summary: 'Creator chat',
	git: '',
	documentation: null
});

Npm.depends({
	'socket.io': '1.4.8',
	'socket.io-client': "1.4.8",
});

Package.onUse(function(api) {
	api.versionsFrom('METEOR@1.2.0.1');
	api.use('coffeescript@1.11.1_4');
	api.use('steedos:creator@0.0.3');
	api.use('blaze@2.1.9');
	api.use('templating@1.2.15');
	api.use('steedos:base@0.0.79');

	api.use('tap:i18n@1.8.2');


	api.addFiles('app.chat.coffee','server');
	api.addFiles('models/chat_subscriptions.coffee','server');
	api.addFiles('models/chat_messages.coffee','server');
	api.addFiles('models/chat_rooms.coffee','server');

	api.addFiles('server/chat.socket.coffee','server');
})