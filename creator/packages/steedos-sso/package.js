Package.describe({
	name: 'steedos:sso',
	version: '0.0.4',
	summary: 'Login to meteor apps with parameter or cookies',
	git: '',
	documentation: null
});

Package.onUse(function(api) {
	api.versionsFrom('METEOR@1.3');

	api.use('kadira:flow-router@2.10.1');
	api.use('coffeescript');
	api.use('chuangbo:cookie@1.1.0')

	api.addFiles('client/steedos_login.coffee', 'client');
	api.addFiles('client/router_triggers.coffee', 'client');
});