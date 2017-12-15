Package.describe({
	name: 'steedos:lightning-design-system',
	version: '0.0.1',
	summary: 'Steedos Saleforce',
	git: ''
});


Package.onUse(function(api) { 
	api.versionsFrom('METEOR@1.3');

	api.addFiles('client/styles/salesforce-lightning-design-system.css', 'client');

	api.addAssets('client/icons/action-sprite/symbols.svg', 'client');
	api.addAssets('client/icons/custom-sprite/symbols.svg', 'client');
	api.addAssets('client/icons/doctype-sprite/symbols.svg', 'client');
	api.addAssets('client/icons/standard-sprite/symbols.svg', 'client');
	api.addAssets('client/icons/utility-sprite/symbols.svg', 'client');
	api.addAssets('client/images/themes/oneSalesforce/banner-brand-default.png', 'client');
});

Package.onTest(function(api) {

});