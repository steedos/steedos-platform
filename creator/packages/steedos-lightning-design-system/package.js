Package.describe({
	name: 'steedos:lightning-design-system',
	version: '0.0.1',
	summary: 'Steedos Saleforce',
	git: ''
});


Package.onUse(function(api) { 
	api.versionsFrom('METEOR@1.3');
	api.use('templating@1.2.15');
	api.use('coffeescript@1.11.1_4');

	api.addFiles('client/styles/salesforce-lightning-design-system.css', 'client');
	api.addFiles('client/helpers.coffee', 'client');
	api.addFiles('client/steedos_icon.html','client');
	api.addFiles('client/steedos_icon.coffee','client');

	api.addAssets('client/icons/action-sprite/symbols.svg', 'client');
	api.addAssets('client/icons/custom-sprite/symbols.svg', 'client');
	api.addAssets('client/icons/doctype-sprite/symbols.svg', 'client');
	api.addAssets('client/icons/standard-sprite/symbols.svg', 'client');
	api.addAssets('client/icons/utility-sprite/symbols.svg', 'client');

	api.addAssets('client/images/themes/oneSalesforce/banner-brand-default.png', 'client');
	api.addAssets('client/images/themes/oneSalesforce/lightning_lite_profile_avatar_96.png', 'client')
});

Package.onTest(function(api) {

});