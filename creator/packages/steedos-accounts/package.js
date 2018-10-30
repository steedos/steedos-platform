Package.describe({
	name: 'steedos:accounts',
	version: '0.0.34',
	summary: 'Steedos Accounts',
	git: '',
	documentation: null
});

Npm.depends({
	cookies: "0.6.1",
	phone: "1.0.3",
	sha256: "0.2.0"
});

Package.onUse(function(api) {
	api.versionsFrom("1.2.1");

	api.use('coffeescript');
	api.use('check');
	api.use('tracker');
	api.use('session');
	api.use('underscore');
	api.use('blaze');
	api.use('templating');
	api.use('npm-bcrypt@0.9.1');

	api.use('flemay:less-autoprefixer@1.2.0');
	api.use('simple:json-routes@2.1.0');
	api.use('kadira:blaze-layout@2.3.0');
	api.use('kadira:flow-router@2.10.1');

	api.use('tap:i18n@1.7.0');

	api.use('accounts-password@1.3.0');

	api.use('steedos:e164-phones-countries@1.0.3');
	api.use('steedos:i18n-iso-countries@3.3.0');
	api.use('steedos:accounts-t9n@1.14.2_7');
	api.use('steedos:useraccounts-bootstrap@1.14.2_8');
	api.use('steedos:useraccounts-core@1.14.2_6');
	api.use('steedos:useraccounts-flow-routing@1.14.2_4');
	api.use('steedos:accounts-phone@0.0.4');

	api.use('steedos:base@0.0.80');



	//api.add_files("package-tap.i18n", ["client", "server"]);
	tapi18nFiles = ['i18n/en.i18n.json', 'i18n/zh-CN.i18n.json']
	api.addFiles(tapi18nFiles, ['client', 'server']);

	api.addFiles('lib/URI.js');
	api.addFiles('lib/core.coffee');
	api.addFiles('lib/force_bind_phone.coffee');
	api.addFiles('lib/accounts.coffee');

	api.addFiles('routes/setup.coffee', 'server');
	
    api.addFiles('password_server.js', 'server');
    api.addFiles('password_client.js', 'client');

	api.addFiles('server/methods/update_phone.coffee', 'server');
	api.addFiles('server/methods/disable_phone.coffee', 'server');
	api.addFiles('server/methods/join_space_from_login.coffee', 'server');
	api.addFiles('server/methods/check_user.coffee', 'server');

	api.addFiles('client/views/accounts_phone.html', 'client');
	api.addFiles('client/views/accounts_phone.coffee', 'client');

	api.addFiles('client/views/accounts_space.html', 'client');
	api.addFiles('client/views/accounts_space.coffee', 'client');

	api.addFiles('client/views/accounts_phone_verify.html', 'client');
	api.addFiles('client/views/accounts_phone_verify.coffee', 'client');

	api.addFiles('client/views/accounts_phone_password_code.html', 'client');
	api.addFiles('client/views/accounts_phone_password_code.coffee', 'client');

	api.addFiles('client/views/forgot_password_token.html', 'client');
	api.addFiles('client/views/forgot_password_token.coffee', 'client');

	api.addFiles('client/views/accounts_admin_register.html', 'client');
	api.addFiles('client/views/accounts_admin_register.coffee', 'client');
	api.addFiles('client/views/accounts_admin_register.less', 'client');

	api.addFiles('client/views/at_form.coffee', "client");
	api.addFiles('client/views/at_form.less', "client");

	api.addFiles('client/views/accounts.less', 'client');

	api.addFiles('client/router.coffee', 'client');

	api.addFiles('client/admin_menu.coffee', 'client');

	api.addFiles('client/subscribe.coffee', 'client');

	api.addFiles('client/accounts_client.coffee', 'client');

	// EXPORT
	// api.export('FSSH');



});

Package.onTest(function(api) {

});