Package.describe({
	name: 'steedos:qhd-records',
	version: '0.0.1',
	summary: 'Steedos libraries',
	git: ''
});

Npm.depends({
	'request'  : '2.81.0',
	'node-schedule' : '1.2.1',
	"eval": "0.1.2",
	cookies: "0.6.1",
	mkdirp: "0.3.5"
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
	api.use('cfs:standard-packages@0.5.9');
	api.use('kadira:blaze-layout@2.3.0');
	api.use('kadira:flow-router@2.10.1');
	api.use('iyyang:cfs-aliyun')
	api.use('cfs:s3');

	api.use('meteorhacks:ssr@2.2.0');
	api.use('tap:i18n@1.7.0');
	api.use('meteorhacks:subs-manager');

	api.use(['webapp'], 'server');

	api.use('momentjs:moment');
	api.use('mrt:moment-timezone');
	api.use('steedos:base@0.0.70');
	api.use('steedos:accounts@0.0.23');
	api.use('steedos:theme@0.0.29');

	// api.addFiles('lib/models/archives.coffee', 'server');

	api.addFiles('server/lib/instances_to_archive.coffee', 'server');

	api.addFiles('server/lib/records_qhd.coffee', 'server');

	// api.export('db');

	api.export('steedosRequest');

	api.export('InstancesToArchive');

	api.export('InstancesToContracts');

	api.export('RecordsQHD');

});

Package.onTest(function (api) {

});