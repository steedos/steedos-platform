Package.describe({
	name: 'steedos:weixin',
	version: '0.0.1',
	summary: 'Steedos weixin Decryption data',
	git: ''
});

Npm.depends({
	'request': '2.81.0',
	'base-64': '0.1.0',
	"node-schedule": "1.1.1",
	"wechat-auth": "1.1.2",
	"xml2js": "0.4.17",
	"wechat-crypto": "0.0.2"
});

Package.onUse(function (api) {
	api.versionsFrom("1.2.1");
	api.use('simple:json-routes@2.1.0');
	api.use('coffeescript@1.11.1_4');

	api.use('steedos:objects');
	api.use('steedos:weixin-aes');

	api.use(['webapp'], 'server');

	api.addFiles('models/weixin_third_party_platforms.coffee');

	api.addFiles('lib/wx_mini.coffee', 'server');
	api.addFiles('server/routes/mini-sso.coffee', 'server');
	// api.addFiles('server/routes/login.coffee', 'server');
	api.addFiles('server/routes/getPhoneNumber.coffee', 'server');
	api.addFiles('server/routes/card/activate.coffee', 'server');
	api.addFiles('server/routes/card/card_init.coffee', 'server');
	api.addFiles('server/routes/card/getUserCards.coffee', 'server');
	api.addFiles('server/routes/card/space_register.coffee', 'server');
	api.addFiles('server/routes/store/qr_code.coffee', 'server');
	api.addFiles('server/routes/update_user.coffee', 'server');
	api.addFiles('server/routes/phone_login.coffee', 'server');

	api.addFiles('server/routes/temp_token.coffee', 'server');
	// api.addFiles('server/routes/invite_admin.coffee', 'server');
	api.addFiles('server/routes/invite_user.coffee', 'server');

	api.addFiles('server/routes/refresh_access_token.coffee', 'server');
	api.addFiles('server/schedule/refresh_access_token.coffee', 'server');

	api.addFiles('server/routes/third_party_notify.coffee', 'server');
	api.addFiles('server/routes/third_party_push.coffee', 'server');

	api.addFiles('server/weixin_auth_init.coffee', 'server');

	api.addFiles('server/routes/account_binding.coffee', 'server');
	api.addFiles('server/routes/account_binding_use_phone.coffee', 'server');

	api.export(['wxAuth'], ['server']);
});

Package.onTest(function (api) {

});