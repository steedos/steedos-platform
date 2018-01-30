Package.describe({
	name: 'steedos:app-crm',
	version: '0.0.1',
	summary: 'Creator crm',
	git: '',
	documentation: null
});

Package.onUse(function(api) {
	api.versionsFrom('METEOR@1.2.0.1');
	api.use('coffeescript@1.11.1_4');
	api.use('steedos:creator@0.0.3');
	api.addFiles('models/Companies.coffee');
	api.addFiles('models/Contacts.coffee');
	api.addFiles('models/Contracts.coffee');
	api.addFiles('crm.coffee','client');
	api.addFiles('reports/company.coffee');
	api.addFiles('reports/contact.coffee');
})