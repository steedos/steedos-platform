Package.describe({
	name: 'steedos:objects-billing',
	version: '0.0.1',
	summary: 'Creator billing objects',
	git: '',
	documentation: null
});

Package.onUse(function(api) {
	api.versionsFrom('METEOR@1.3');
	
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
	api.use('templating@1.2.15');
	api.use('ecmascript');

	api.use('aldeed:simple-schema@1.3.3');
	api.use('steedos:cfs-standard-packages@0.5.10');
	api.use('steedos:cfs-s3@0.1.4');
	api.use('steedos:cfs-aliyun@0.1.0');
	api.use('universe:i18n@1.13.0');
	
	api.use('steedos:objects@0.0.7');

	
	api.addFiles('models/billings.coffee');
	api.addFiles('models/billing_pay_records.coffee');
	api.addFiles('models/modules.coffee');
	api.addFiles('models/modules_changelogs.coffee');
	api.addFiles('models/users_changelogs.coffee');
	api.addFiles('models/steedos_statistics.coffee');
	
});