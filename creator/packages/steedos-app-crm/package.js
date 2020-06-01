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
	api.use('blaze@2.1.9');
	api.use('templating@1.2.15');

	api.use('universe:i18n');

	api.addFiles('models/Accounts.coffee','server');
	api.addFiles('models/Contacts.coffee','server');
	api.addFiles('models/Contracts.coffee','server');
	api.addFiles('models/contract_type.coffee','server');
	api.addFiles('models/contract_acceptance.coffee','server');
	api.addFiles('models/Payments.coffee','server');
	api.addFiles('models/Receipts.coffee','server');
	api.addFiles('reports/company.coffee','server');
	api.addFiles('reports/contact.coffee','server');

	api.addFiles('crm.coffee','server');
})