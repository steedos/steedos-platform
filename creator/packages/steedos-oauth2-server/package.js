Package.describe({
	name: 'steedos:oauth2-server',
	version: '0.0.1',
	summary: 'Add oauth2 server support to your application.'
});

Npm.depends({
	"express": "4.13.4",
	"body-parser": "1.14.2",
	"oauth2-server": "2.4.1"
});

Package.onUse(function(api) {
	api.versionsFrom('1.0');
	api.use('coffeescript@1.11.1_4');
	api.use('random');
	api.use('blaze@2.1.9');
	api.use('templating@1.2.15');
	api.use('flemay:less-autoprefixer@1.2.0');
	api.use('tap:i18n@1.7.0');
	api.use('kadira:blaze-layout@2.3.0');
	api.use('kadira:flow-router@2.10.1');
	
	api.use('webapp', 'server');
	api.use('check', 'server');
	api.use('meteorhacks:async@1.0.0', 'server');
	api.use('simple:json-routes@2.1.0', 'server');

	api.use('meteorhacks:subs-manager@1.6.4');

	
	api.use('http');

	api.use('steedos:objects');

	api.addFiles('models/OAuth2Clients.coffee');

	// api.addFiles('lib/random.coffee', ['client', 'server']);

	api.addFiles('lib/common.js', ['client', 'server']);
	api.addFiles('lib/meteor-model.js', 'server');
	api.addFiles('lib/server.js', 'server');
	api.addFiles('lib/client.js', 'client');

	api.use('tap:i18n', ['client', 'server']);
	tapi18nFiles = ['i18n/en.i18n.json', 'i18n/zh-CN.i18n.json']
	api.addFiles(tapi18nFiles, ['client', 'server']);

	api.addFiles('client/oauth2authorize.html', 'client');
	api.addFiles('client/oauth2authorize.less', 'client');
	api.addFiles('client/oauth2authorize.coffee', 'client');
	
	api.addFiles('client/router.coffee', 'client');

	api.addFiles('client/subscribe.coffee', 'client');
	
	api.addFiles('server/rest.coffee', 'server');
	api.addFiles('server/publications/oauth2clients.coffee', 'server');
	api.addFiles('server/methods/oauth2authcodes.coffee', 'server');
	
	api.export('oAuth2Server', ['client', 'server']);

	api.export('Random', ['client', 'server']);
	
});

Package.onTest(function(api) {

});
