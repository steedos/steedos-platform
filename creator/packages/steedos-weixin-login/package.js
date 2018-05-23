Package.describe({
	name: 'steedos:weixin-login',
	version: '0.0.1',
	summary: 'Steedos weixin Decryption data',
	git: ''
});

Npm.depends({
	'request': '2.81.0',
});


Package.onUse(function(api) {
	api.versionsFrom("1.2.1");
	api.use('simple:json-routes@2.1.0');
	api.use('coffeescript@1.11.1_4');

	api.use('steedos:objects');
	api.use('steedos:weixin-aes');

	api.addFiles('lib/wx_mini.coffee', 'server');
	api.addFiles('server/routes/login.coffee', 'server');
	api.addFiles('server/routes/getPhoneNumber.coffee', 'server');
	api.addFiles('server/routes/card/activate.coffee', 'server');
	api.addFiles('server/routes/card/getUserCards.coffee', 'server');
});

Package.onTest(function(api) {

});
