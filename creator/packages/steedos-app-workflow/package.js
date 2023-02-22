/*
 * @Author: sunhaolin@hotoa.com
 * @Date: 2021-05-24 12:32:56
 * @LastEditors: sunhaolin@hotoa.com
 * @LastEditTime: 2023-01-17 16:50:50
 * @Description: 
 */
Package.describe({
	name: 'steedos:app-workflow',
	version: '0.0.15',
	summary: 'Creator workflow',
	git: '',
	documentation: null
});

Package.onUse(function(api) {
	api.versionsFrom('METEOR@1.3');

	api.use('reactive-var');
	api.use('reactive-dict');
	api.use('coffeescript');
	api.use('ecmascript');
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
	api.use('aldeed:simple-schema@1.3.3');
	api.use('aldeed:collection2@2.5.0');
	api.use('kadira:flow-router@2.10.1');
	api.use('aldeed:tabular@1.6.1');
	api.use('meteorhacks:ssr@2.2.0');

	api.use('steedos:cfs-standard-packages@0.5.10');
	api.use('steedos:cfs-s3@0.1.4');
	api.use('steedos:cfs-aliyun@0.1.0');
	api.use('steedos:cfs-steedos-cloud@0.0.4');


	api.use('steedos:base@0.0.90');
	api.use('steedos:webhookqueue@0.0.1');

	api.use('universe:i18n@1.13.0');

	api.addFiles('checkNpm.js', 'server');

	api.addFiles('core.coffee');
	api.addFiles('client/new_flow_modal.less', 'client');
	api.addFiles('client/new_flow_modal.html', 'client');
	api.addFiles('client/new_flow_modal.coffee', 'client');

	api.addFiles('client/design/form_design.html', 'client');
	api.addFiles('client/design/form_design.coffee', 'client');

	api.addFiles('server/methods/flow_copy.coffee', 'server');

	api.addFiles('workflow.app.coffee', "server");

	api.addFiles('cfs/instances.coffee');

	api.addFiles('client/admin_import_flow_modal.html', 'client');
	api.addFiles('client/admin_import_flow_modal.coffee', 'client');

	api.addFiles('client/copy_flow_modal.html', 'client');
	api.addFiles('client/copy_flow_modal.coffee', 'client');

	api.addFiles('client/views/flow/distribute_edit_flow_modal.html', 'client');
	api.addFiles('client/views/flow/distribute_edit_flow_modal.coffee', 'client');
	api.addFiles('client/views/flow/distribute_edit_flow_modal.less', 'client');
	api.addFiles('server/methods/distribute.coffee', 'server');


	api.export(['Template'], ['server'])
})