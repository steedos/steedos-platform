Package.describe({
	name: 'steedos:app-tableau',
	version: '0.0.10',
	summary: 'Steedos tableau',
	git: ''
});

Npm.depends({
	cookies: "0.6.1",
});

Package.onUse(function (api) {
	api.versionsFrom('1.0');

	api.use('reactive-var');
	api.use('reactive-dict');
	api.use('coffeescript');
	api.use('random');
	api.use('ddp');
	api.use('check');
	api.use('ddp-rate-limiter');
	api.use('underscore');
	api.use('tracker');
	api.use('session');
	api.use('blaze');
	api.use('templating');
	api.use('flemay:less-autoprefixer@1.2.0');
	api.use('simple:json-routes@2.1.0');
	api.use('nimble:restivus@0.8.7');
	api.use('aldeed:simple-schema@1.3.3');
	api.use('aldeed:collection2@2.5.0');
	api.use('aldeed:tabular@1.6.1');
	api.use('aldeed:autoform@5.8.0');
	api.use('matb33:collection-hooks@0.8.1');
	api.use('steedos:cfs-standard-packages');
	api.use('kadira:blaze-layout@2.3.0');
	api.use('kadira:flow-router@2.10.1');

	api.use('meteorhacks:ssr@2.2.0');
	api.use('meteorhacks:subs-manager');

	api.use(['webapp'], 'server');

	api.use('momentjs:moment', 'client');
	api.use('mrt:moment-timezone', 'client');

	api.use('universe:i18n');

	tapi18nFiles = ['i18n/en.i18n.json', 'i18n/zh-CN.i18n.json']
	api.addFiles(tapi18nFiles, ['client', 'server']);

	api.addFiles('client/steedos_tableau.less', 'client');
	api.addFiles('client/tableau_info.html', 'client');
	api.addFiles('client/tableau_info.coffee', 'client');
	api.addFiles('client/workflow/tableau_flow_list.html', 'client');
	api.addFiles('client/workflow/tableau_flow_list.coffee', 'client');

	api.addFiles('lib/steedos_tableau.coffee');

	api.addFiles('tabulars/flows.coffee');

	api.export("CreatorTableau");
});

Package.onTest(function (api) {

});