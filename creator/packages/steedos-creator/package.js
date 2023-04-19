Package.describe({

	name: 'steedos:creator',
	version: '0.0.9',
	summary: 'Steedos Creator',
	git: '',
	documentation: null
});

Package.onUse(function (api) {
	api.versionsFrom('1.0');

	api.use('reactive-var@1.0.10');
	api.use('reactive-dict@1.1.8');
	api.use('coffeescript@1.11.1_4');
	api.use('ecmascript');
	api.use('random@1.0.10');
	api.use('ddp@1.2.5');
	api.use('check@1.2.3');
	api.use('ddp-rate-limiter@1.0.5');
	api.use('underscore@1.0.10');
	api.use('tracker@1.1.0');
	api.use('session@1.1.6');
	api.use('blaze@2.1.9');
	api.use('templating@1.2.15');

	api.use('flemay:less-autoprefixer@1.2.0');
	api.use('simple:json-routes@2.1.0');
	api.use('nimble:restivus@0.8.7');
	api.use('aldeed:simple-schema@1.3.3');
	api.use('aldeed:collection2@2.5.0');
	api.use('aldeed:tabular@1.6.1');
	api.use('lamhieu:unblock@1.0.0');
	api.use('aldeed:autoform@5.8.0');
	api.use('matb33:collection-hooks@0.8.1');

	api.use('kadira:blaze-layout@2.3.0');
	api.use('kadira:flow-router@2.10.1');
	api.use('steedos:api');
	api.use('steedos:autoform-bs-datetimepicker@1.0.6');
	api.use('steedos:autoform-bs-minicolors@1.0.0');

	// api.use('summernote:summernote@0.8.1');
	// api.use('mpowaga:autoform-summernote@0.4.3');

	api.use('meteorhacks:ssr@2.2.0');
	api.use('meteorhacks:subs-manager@1.6.4');

	api.use(['webapp@1.3.11'], 'server');

	api.use('momentjs:moment@2.14.1', 'client');


	api.use('es5-shim@4.6.15');
	api.use('simple:json-routes@2.1.0');
	api.use('steedos:autoform-filesize@0.0.1');
	api.use('steedos:autoform-location@0.0.1');

	api.use('steedos:autoform-lookup@0.3.11');

	api.use('steedos:cfs-standard-packages@0.5.10');
	api.use('steedos:cfs-s3@0.1.4');
	api.use('steedos:cfs-aliyun@0.1.0');
	api.use('steedos:autoform-file@0.4.2_2');


	api.use('accounts-base@1.3.4');
	api.use('steedos:sso@0.0.4');
	api.use('steedos:adminlte@2.3.12_3');
	api.use('steedos:base@0.0.79');
	// api.use('steedos:accounts@0.0.40');
	api.use('steedos:theme@0.0.29');
	api.use('steedos:i18n@0.0.11');
	api.use('steedos:autoform@0.0.13');
	api.use('steedos:creator-autoform-modals@0.0.1');
	api.use('raix:push@3.0.2');

	// api.use('steedos:autoform-bs-datetimepicker');

	api.use('steedos:datatables-extensions@0.0.1');

	api.use('steedos:logger@0.0.2');

	api.use('steedos:devexpress@18.1.4');
	api.use('steedos:odata@0.0.3');
	api.use('blaze-html-templates@1.1.2');
	// api.use('steedos:lightning-design-system@0.0.2');
	api.use('universe:i18n');

	api.addFiles('checkNpm.js', "server");

	api.addFiles('core.coffee');


	api.addFiles('lib/apps.coffee');
	// api.addFiles('lib/eval.js');
	// api.addFiles('lib/formula_engine.coffee');
	api.addFiles('lib/object_recent.coffee', 'client');
	api.addFiles('lib/filters_transform.coffee', 'client');
	api.addFiles('lib/form_manager.coffee', 'client');
	api.addFiles('lib/grid_export.coffee', 'client');

	api.addFiles('server/methods/object_recent_viewed.coffee', 'server');
	api.addFiles('server/methods/object_recent_record.coffee', 'server');
	api.addFiles('server/methods/object_listviews_options.coffee', 'server');
	api.addFiles('server/methods/report_data.coffee', 'server');
	api.addFiles('server/methods/user_tabular_settings.coffee', 'server');
	api.addFiles('server/methods/object_export2xml.coffee', 'server');
	api.addFiles('server/methods/related_objects_records.coffee', 'server');
	api.addFiles('server/methods/pending_space.coffee', 'server');

	api.addFiles('server/publications/object.coffee', 'server');
	api.addFiles('server/publications/object_tabular.coffee', 'server');
	api.addFiles('server/publications/object_listviews.coffee', 'server');
	api.addFiles('server/publications/user_tabular_settings.coffee', 'server');
	api.addFiles('server/publications/related_objects_records.coffee', 'server');
	api.addFiles('server/publications/space_user_info.coffee', 'server');

	api.addFiles('server/publications/contacts_view_limits.coffee', 'server');
	api.addFiles('server/publications/contacts_no_force_phone_users.coffee', 'server');
	api.addFiles('server/publications/space_need_to_confirm.coffee', 'server');

	api.addFiles('server/lib/permission_manager.coffee', 'server');
	api.addFiles('server/lib/uuflowManagerForInitApproval.coffee', 'server');

	// api.addFiles('server/routes/s3.coffee', 'server');
	api.addFiles('server/routes/api_workflow_drafts.coffee', 'server');

	api.addFiles('client/listview.coffee', "client");

	api.addFiles('client/views/_helpers.coffee', 'client');

	api.addFiles('client/layout/layout.html', 'client');
	api.addFiles('client/layout/layout.less', 'client');
	api.addFiles('client/layout/layout.coffee', 'client');
	api.addFiles('client/layout/loading.html', 'client');
	api.addFiles('client/layout/loading.less', 'client');

	api.addFiles('client/mobile/admin.html', 'client');
	api.addFiles('client/mobile/admin.coffee', 'client');
	api.addFiles('client/mobile/admin.less', 'client');

	api.addFiles('client/mobile/switch_space.html', 'client');
	api.addFiles('client/mobile/switch_space.coffee', 'client');

	api.addFiles('client/views/page_template.html', 'client');
	api.addFiles('client/views/page_template.coffee', 'client');

	api.addFiles('client/core.coffee', 'client');
	api.addFiles('client/colors.coffee', 'client');
	api.addFiles('client/temp_navs.coffee', 'client');
	// api.addFiles('client/favorites.coffee', 'client');
	api.addFiles('client/router.coffee', 'client');
	// api.addFiles('client/subscribe.coffee', 'client');
	api.addFiles('client/tenant.coffee', 'client');

	api.addFiles('client/animate.css', 'client');
	api.addFiles('client/animate.js', 'client');
	api.addFiles('client/common_style.less', 'client');
	api.addFiles('client/colResizable-1.6.js', 'client');
	api.addFiles('client/jquery.ba-resize.js', 'client');

	api.addFiles('client/views/page_object.html', 'client');
	api.addFiles('client/views/page_object.coffee', 'client');

	api.addFiles('client/views/page_record_view.html', 'client');
	api.addFiles('client/views/page_record_view.coffee', 'client');

	api.addFiles('client/views/page_list_view.html', 'client');
	api.addFiles('client/views/page_list_view.coffee', 'client');

	api.addFiles('client/views/page_related_list_view.html', 'client');
	api.addFiles('client/views/page_related_list_view.coffee', 'client');

	api.addFiles('client/views/app_home.html', 'client');
	api.addFiles('client/views/app_home.coffee', 'client');
	api.addFiles('client/views/app_iframe.html', 'client');
	api.addFiles('client/views/app_iframe.coffee', 'client');
	api.addFiles('client/views/app_iframe.less', 'client');

	api.addFiles('client/views/initiate_approval.html', 'client');
	api.addFiles('client/views/initiate_approval.coffee', 'client');

	api.addFiles('client/title.coffee', 'client');

	api.addFiles('client/theme.less', 'client');
	api.addFiles('client/i18n.coffee', 'client');

	api.addFiles('client/views/amis_action.html', 'client');
	api.addFiles('client/views/amis_action.js', 'client');
	api.addFiles('client/views/amis_action.less', 'client');

	api.export(['permissionManagerForInitApproval', 'uuflowManagerForInitApproval'], ['server']);

});