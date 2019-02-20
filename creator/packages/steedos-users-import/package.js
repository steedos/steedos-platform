Package.describe({
	name: 'steedos:users-import',
	version: '0.0.1',
	summary: 'Creator Users Import',
	git: '',
	documentation: null
});

Package.onUse(function(api) {
	api.use('reactive-var@1.0.10');
	api.use('reactive-dict@1.1.8');
	api.use('coffeescript@1.11.1_4');
	api.use('random@1.0.10');
	api.use('ddp@1.2.5');
	api.use('check@1.2.3');
	api.use('ddp-rate-limiter@1.0.5');
	api.use('underscore@1.0.10');
	api.use('ecmascript');
	api.use('tracker@1.1.0');
	api.use('session@1.1.6');
	api.use('blaze@2.1.9');
	api.use('templating@1.2.15');
	api.use('flemay:less-autoprefixer@1.2.0');

	api.use('steedos:objects@0.0.7');
	api.use('steedos:application-package@0.0.1');
	api.use('steedos:base');
	api.use('steedos:i18n@0.0.11');
	
	api.use('universe:i18n');

	api.addFiles('i18n/en.i18n.json');
	api.addFiles('i18n/zh-CN.i18n.json');

	api.addFiles('checkNpm.js', 'server');
	
	api.addFiles('space_users_actions.coffee');
	
	api.addFiles('client/views/import_users_modal.less', 'client');
	api.addFiles('client/views/import_users_modal.html', 'client');
	api.addFiles('client/views/import_users_modal.coffee', 'client');
	
	api.addFiles('server/methods/import_users.coffee', 'server');

	api.addAssets('assets/excel/steedos_import_users_simple.xls', 'client');

	api.addAssets('server/ejs/export_space_users.ejs', 'server');
	api.addFiles('routes/api_space_users_export.coffee', 'server');
});