Package.describe({
	name: 'steedos:application-template',
	version: '0.0.1',
	summary: 'Steedos Application template',
	git: ''
});

Package.onUse(function(api) {
	api.versionsFrom('1.0');
	api.use('reactive-var@1.0.10');
	api.use('reactive-dict@1.1.8');
	api.use('coffeescript@1.11.1_4');
	api.use('random@1.0.10');
	api.use('ddp@1.2.5');
	api.use('check@1.2.3');
	api.use('ddp-rate-limiter@1.0.5');
	api.use('underscore@1.0.10');
	api.use('tracker@1.1.0');
	api.use('session@1.1.6');
	api.use('simple:json-routes@2.1.0');
	api.use('nimble:restivus@0.8.7');
	api.use('aldeed:simple-schema@1.3.3');
	api.use('aldeed:schema-index@1.1.0');
	api.use('aldeed:collection2@2.5.0');
	api.use('aldeed:tabular@1.6.1');
	api.use('matb33:collection-hooks@0.8.1');
	api.use('meteorhacks:subs-manager@1.6.4');
	api.use('gwendall:simple-schema-i18n');
	api.use('steedos:creator');
	api.use('steedos:application-package');
	api.use('flemay:less-autoprefixer@1.2.0');

	api.use('tap:i18n@1.7.0');
	// tapi18nFiles = ['i18n/en.i18n.json', 'i18n/zh-CN.i18n.json'];
	// api.addFiles(tapi18nFiles, ['client', 'server']);
	// api.addFiles('package.app.coffee');

	api.addFiles('client/template_apps_list_modal.less', 'client');
	api.addFiles('client/template_apps_list_modal.html', 'client');
	api.addFiles('client/template_apps_list_modal.coffee', 'client');

	api.addFiles('lib/template.coffee', 'server');

	api.addFiles('server/methods/installTemplate.coffee', 'server');
	api.addFiles('server/methods/upgradeTemplate.coffee', 'server');
	api.addFiles('server/methods/uninstallTemplate.coffee', 'server');
});
