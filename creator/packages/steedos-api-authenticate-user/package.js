Package.describe({
	name: 'steedos:api-authenticate-user',
	version: '1.0.0',

	// Brief, one-line summary of the package.
	summary: 'Authenticate user via auth access-token',

	// URL to the Git repository containing the source code for this package.
	git: '',

	// By default, Meteor will default to using README.md for documentation.
	// To avoid submitting documentation, set this field to null.
	documentation: 'README.md',
});

Package.onUse(function (api) {

	api.use('coffeescript');
	api.use('ecmascript');

	api.use([
		'accounts-base',
		'simple:json-routes@2.1.0',
	], 'server');
	
	api.addFiles('checkNpm.js', 'server');

	api.addFiles('auth_user.coffee', 'server');
	api.addFiles('routes_middleware_config.coffee', 'server');

});
