Package.describe({
	name: 'steedos:app-mailbase',
	version: '0.0.1',
	summary: 'Creator Mailbase',
	git: '',
	documentation: null
});

Package.onUse(function(api) {

	api.use('steedos:creator@0.0.3');
	api.use('coffeescript@1.11.1_4');
	api.use('steedos:base');

	api.addFiles('mailbase.app.coffee');
	api.addFiles('models/mail_domains.coffee');
	api.addFiles('models/mail_accounts.coffee');
})