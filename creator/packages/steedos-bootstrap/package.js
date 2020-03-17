Package.describe({
	name: 'twbs:bootstrap',
	version: '3.3.7',
	summary: 'Bootstrap for steedos',
	git: '',
	documentation: null
});

Package.onUse(function (api) {

    api.versionsFrom('1.3');
    api.use("less");
	api.use("ecmascript");

	var assets = [
		'dist/fonts/glyphicons-halflings-regular.eot',
		'dist/fonts/glyphicons-halflings-regular.svg',
		'dist/fonts/glyphicons-halflings-regular.ttf',
		'dist/fonts/glyphicons-halflings-regular.woff',
		'dist/fonts/glyphicons-halflings-regular.woff2'
	];
	if (api.addAssets) {
		api.addAssets(assets, 'client');
	} else {
		api.addFiles(assets, 'client', { isAsset: true });
	}

	api.addFiles([
		'dist/css/bootstrap-glyphicons.css',
	], 'client');

	api.addFiles('bootstrap.js', 'client');
	api.addFiles('bootstrap.less', 'client');
})