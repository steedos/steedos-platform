Package.describe({
	name: 'steedos:weixin-register',
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

	api.use('steedos:weixin-aes');

	api.addFiles('server/login.coffee', 'server');
	// api.addFiles('server/register.coffee', 'server');
});

Package.onTest(function(api) {

});
