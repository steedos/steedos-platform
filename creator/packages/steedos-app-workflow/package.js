Package.describe({
	name: 'steedos:app-workflow',
	version: '0.0.1',
	summary: 'Creator workflow',
	git: '',
	documentation: null
});

Npm.depends({
	mkdirp: "0.3.5"
});

Package.onUse(function(api) {
	api.use('reactive-var');
	api.use('reactive-dict');
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
	api.use('steedos:creator@0.0.5');
	api.use('coffeescript@1.11.1_4');

	api.use('steedos:cfs-standard-packages@0.5.10');
	api.use('steedos:cfs-s3@0.1.4');
	api.use('steedos:cfs-aliyun@0.1.0');

	api.addFiles('core.coffee', 'client');
	api.addFiles('client/new_flow_modal.less', 'client');
	api.addFiles('client/new_flow_modal.html', 'client');
	api.addFiles('client/new_flow_modal.coffee', 'client');

	api.addFiles('workflow.app.coffee');
	api.addFiles('models/Instances.coffee');
	api.addFiles('models/forms.coffee');
	api.addFiles('models/flows.coffee');
	api.addFiles('models/statistic_instance.coffee');
	api.addFiles('models/categories.coffee');

	api.addFiles('cfs/instances.coffee', 'server');
})