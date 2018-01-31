Package.describe({
	name: 'steedos:devexpress',
	version: '0.0.1',
	summary: 'Devexpress for Steedos Creator',
	git: '',
	documentation: null
});

Package.onUse(function (api) {
	api.addAssets([
		'client/css/icons/dxicons.ttf',
		'client/css/icons/dxicons.woff',
		'client/css/icons/dxiconsios.ttf',
		'client/css/icons/dxiconsios.woff'
	], 'client');

	api.addFiles('client/jszip/jszip.js', 'client');
	api.addFiles('client/css/dx.spa.css', 'client');
	api.addFiles('client/css/dx.common.css', 'client');
	api.addFiles('client/css/dx.light.css', 'client');
	api.addFiles('client/js/dx.all.js', 'client');
	api.addFiles('client/js/dx.messages.zh.js', 'client');
})