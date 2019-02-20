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

	api.addFiles('bootstrap.js', 'client');
	api.addFiles('bootstrap.less', 'client');
})