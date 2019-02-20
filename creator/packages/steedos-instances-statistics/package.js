Package.describe({
	name: 'steedos:instances-statistics',
	version: '0.0.1',
	summary: 'Steedos records system',
	git: ''
});

Npm.depends({
	'request':'2.40.0',
	'node-schedule' : '1.2.1'
});

Package.onUse(function(api) {
	api.versionsFrom('1.0');
	api.use('coffeescript');
	api.use('random');
	api.use('blaze@2.1.9');
	api.use('templating@1.2.15');
	api.use('flemay:less-autoprefixer@1.2.0');
	api.use('kadira:blaze-layout@2.3.0');
	api.use('kadira:flow-router@2.10.1');
	
	api.use('webapp', 'server');
	api.use('check', 'server');
	api.use('meteorhacks:async@1.0.0', 'server');
	api.use('simple:json-routes@2.1.0', 'server');

	api.use('meteorhacks:subs-manager@1.6.4');

	api.use('mongo', ['client', 'server'])

	
	api.use('http');

	api.use('steedos:logger');
	api.use('steedos:base');

	api.addFiles('client/methods/call_statistics.coffee', 'client');	

	api.addFiles('server/lib/instances_stat.coffee', 'server');
	api.addFiles('server/methods/init_statistics.coffee', 'server');	
	api.addFiles('server/methods/user_cost_time.coffee', 'server');

	// api.addFiles('server/models/models.coffee');
	api.addFiles('server/models/instances_statistic.coffee');
	

	api.export('InstancesStat');
	api.export('UserCostTime');

});
