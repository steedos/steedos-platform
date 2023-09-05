Package.describe({
	name: 'steedos:records-qhd',
	version: '0.0.10',
	summary: 'Steedos libraries',
	git: ''
});

Npm.depends({
	'request'  : '2.81.0',
	'node-schedule' : '1.2.1',
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
	api.use('kadira:flow-router@2.10.1');
	api.use('kadira:blaze-layout@2.3.0');

	api.use('meteorhacks:ssr@2.2.0');
	api.use('tap:i18n@1.7.0');
	api.use('meteorhacks:subs-manager');

	api.use(['webapp'], 'server');

	api.use('momentjs:moment', 'client');
	api.use('mrt:moment-timezone', 'client');

	api.addFiles('client/views/sync_contracts.html', 'client');

	api.addFiles('client/views/sync_contracts.coffee', 'client');

	api.addFiles('client/views/sync_archive.html', 'client');

	api.addFiles('client/views/sync_archive.coffee', 'client');

	api.addFiles('client/views/sync_contracts.less', 'client');

	api.addFiles('client/router.coffee', 'client');

	api.addFiles('server/lib/steedos_request.coffee', 'server');

	api.addFiles('server/lib/instances_to_archive.coffee', 'server');

	api.addFiles('server/lib/instances_to_contracts.coffee', 'server');

	api.addFiles('server/lib/records_qhd.coffee', 'server');

	api.addFiles('server/methods/sync_contracts.coffee', 'server');
	api.addFiles('server/methods/sync_archive.coffee', 'server');

	api.addFiles('server/routes/sync_contracts.coffee', 'server');

	// api.export('db');

	api.export('steedosRequest');

	api.export('InstancesToArchive');

	api.export('InstancesToContracts');

	api.export('RecordsQHD');

});

Package.onTest(function (api) {

});