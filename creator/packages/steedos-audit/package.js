Package.describe({
	name: 'steedos:audit',
	version: '0.0.1',
	summary: 'Creator Base Modals',
	git: '',
	documentation: null
});

Package.onUse(function(api) {

	api.use('coffeescript@1.11.1_4');
	api.use('steedos:objects@0.0.7');

	api.addFiles('lib/audit_records.coffee', 'server');
	api.addFiles('models/audit_records.coffee');
	api.addFiles('models/audit_login.coffee');
})