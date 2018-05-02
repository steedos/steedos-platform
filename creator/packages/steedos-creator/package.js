Package.describe({

	name: 'steedos:creator',
	version: '0.0.5',
	summary: 'Steedos Creator',
	git: ''
});

Npm.depends({
	busboy: "0.2.13",
	mkdirp: "0.3.5",
	"xml2js": "0.4.19",
	"node-xlsx":"0.12.0"
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
	api.use('blaze@2.1.9');
	api.use('templating@1.2.15');
	// api.use('modules');  //此package 不能移除，否则会导致eval执行异常
	api.use('flemay:less-autoprefixer@1.2.0');
	api.use('simple:json-routes@2.1.0');
	api.use('nimble:restivus@0.8.7');
	api.use('aldeed:simple-schema@1.3.3');
	api.use('aldeed:schema-index@1.1.0');
	api.use('aldeed:collection2@2.5.0');
	api.use('aldeed:tabular@1.6.1');
	api.use('meteorhacks:unblock@1.1.0');
	api.use('aldeed:autoform@5.8.0');
	api.use('matb33:collection-hooks@0.8.1');

	api.use('kadira:blaze-layout@2.3.0');
	api.use('kadira:flow-router@2.10.1');

	api.use('steedos:autoform-bs-datetimepicker@1.0.6');
	api.use('tsega:bootstrap3-datetimepicker@4.17.37');
	api.use('steedos:autoform-bs-minicolors@1.0.0');

	api.use('meteorhacks:ssr@2.2.0');
	api.use('tap:i18n@1.7.0');
	api.use('meteorhacks:subs-manager@1.6.4');

	api.use(['webapp@1.3.11'], 'server');

	api.use('momentjs:moment@2.14.1', 'client');


	api.use('es5-shim@4.6.15');
	api.use('simple:json-routes@2.1.0');
	api.use('steedos:fullcalendar@3.4.0_1');
	api.use('steedos:autoform-lookup@0.3.10');
	api.use('steedos:filesize@0.0.1');

	api.use('natestrauser:select2@4.0.3');
	api.use('aldeed:autoform-select2@1.0.5')

	api.use('steedos:cfs-standard-packages@0.5.10');
	api.use('steedos:cfs-s3@0.1.4');
	api.use('steedos:cfs-aliyun@0.1.0');
	api.use('steedos:autoform-file@0.4.2_1');


	api.use('steedos:sso@0.0.4')
	api.use('steedos:adminlte@2.3.12_3');
	api.use('steedos:base@0.0.73');
	api.use('steedos:accounts@0.0.31');
	api.use('steedos:theme@0.0.29');
	api.use('steedos:i18n@0.0.11');
	api.use('steedos:autoform@0.0.1');
	api.use('steedos:creator-autoform-modals@0.0.1');
	api.use('raix:push@3.0.2');

	// api.use('steedos:autoform-bs-datetimepicker');

	api.use('steedos:lightning-design-system@0.0.1');
	api.use('steedos:datatables-extensions@0.0.1');

	api.use('steedos:logger@0.0.2');

	api.use('tap:i18n@1.7.0');

	tapi18nFiles = ['i18n/en.i18n.json', 'i18n/zh-CN.i18n.json']
	api.addFiles(tapi18nFiles, ['client', 'server']);


	api.use('steedos:objects');

	api.addFiles('core.coffee');

	api.addFiles('lib/actions.coffee');
	api.addFiles('lib/listviews.coffee');
	api.addFiles('lib/apps.coffee');
	api.addFiles('lib/user_object_view.coffee', 'server');
	// api.addFiles('lib/eval.js');
	// api.addFiles('lib/formula_engine.coffee');
	api.addFiles('lib/object_recent.coffee', 'client');

	api.addFiles('models/object_recent_viewed.coffee');
	api.addFiles('models/object_listviews.coffee');
	api.addFiles('models/permission_set.coffee');
	api.addFiles('models/permission_objects.coffee');
	api.addFiles('models/permission_share.coffee');

	api.addFiles('models/app.coffee');
	api.addFiles('models/space.coffee');
	api.addFiles('models/user.coffee');
	api.addFiles('models/organization.coffee');
	api.addFiles('models/space_user.coffee');

	api.addFiles('models/cms_files.coffee');
	api.addFiles('models/cms_files_cfs.coffee');
	api.addFiles('models/cfs_files.coffee');

	api.addFiles('models/reports.coffee');
	api.addFiles('models/tasks.coffee');
	api.addFiles('models/notes.coffee');
	api.addFiles('models/queue_import.coffee');
	api.addFiles('models/settings.coffee');

	api.addFiles('models/object_workflows.coffee');

	api.addFiles('server/methods/bootstrap.coffee', 'server');

	api.addFiles('server/methods/object_options.coffee', 'server');
	api.addFiles('server/methods/object_recent_viewed.coffee', 'server');
	api.addFiles('server/methods/object_recent_record.coffee', 'server');
	api.addFiles('server/methods/object_listviews_options.coffee', 'server');
	api.addFiles('server/methods/report_data.coffee', 'server');
	api.addFiles('server/methods/user_tabular_settings.coffee', 'server');
	api.addFiles('server/methods/object_record.coffee', 'server');
	api.addFiles('server/methods/object_export2xml.coffee', 'server');
	api.addFiles('server/methods/object_import_jobs.coffee', 'server');
	api.addFiles('server/methods/related_objects_records.coffee', 'server');
	api.addFiles('server/methods/object_workflows.coffee', 'server');

	api.addFiles('server/publications/object.coffee', 'server');
	api.addFiles('server/publications/object_tabular.coffee', 'server');
	api.addFiles('server/publications/object_listviews.coffee', 'server');
	api.addFiles('server/publications/user_tabular_settings.coffee', 'server');
	api.addFiles('server/publications/related_objects_records.coffee', 'server');
	api.addFiles('server/publications/space_user_info.coffee', 'server');

	api.addFiles('server/lib/permission_manager.coffee', 'server');
	api.addFiles('server/lib/uuflow_manager.coffee', 'server');

	api.addFiles('server/routes/s3.coffee', 'server');
	api.addFiles('server/routes/api_workflow_drafts.coffee', 'server');

	api.addFiles('server/routes/bootstrap.coffee','server');
	api.addFiles('client/views/_helpers.coffee', 'client');

	api.addFiles('client/layout/layout.html', 'client');
	api.addFiles('client/layout/layout.less', 'client');
	api.addFiles('client/layout/layout.coffee', 'client');
	api.addFiles('client/layout/header_search.html', 'client');
	api.addFiles('client/layout/header_search.less', 'client');
	api.addFiles('client/layout/header_search.coffee', 'client');
	api.addFiles('client/layout/header.html', 'client');
	api.addFiles('client/layout/header.coffee', 'client');
	api.addFiles('client/layout/navigation.html', 'client');
	api.addFiles('client/layout/navigation.coffee', 'client');
	api.addFiles('client/layout/sidebar.html', 'client');
	api.addFiles('client/layout/sidebar.coffee', 'client');
	api.addFiles('client/layout/sidebar.less', 'client');

	api.addFiles('client/mobile/admin.html', 'client');
	api.addFiles('client/mobile/admin.coffee', 'client');
	api.addFiles('client/mobile/admin.less', 'client');
	api.addFiles('client/layout/creator_app_list_modal.html', 'client');
	api.addFiles('client/layout/creator_app_list_modal.coffee', 'client');
	api.addFiles('client/layout/creator_app_list_modal.less', 'client');
	api.addFiles('client/mobile/mobile_layout.html', 'client');
	api.addFiles('client/mobile/mobile_layout.coffee', 'client');
	api.addFiles('client/mobile/home.html', 'client');
	api.addFiles('client/mobile/home.coffee', 'client');
	api.addFiles('client/mobile/home.less', 'client');
	api.addFiles('client/mobile/object_menu.html', 'client');
	api.addFiles('client/mobile/object_menu.coffee', 'client');
	api.addFiles('client/mobile/object_menu.less', 'client');
	api.addFiles('client/mobile/common.less', 'client');
	api.addFiles('client/mobile/mobile_list.html', 'client');
	api.addFiles('client/mobile/mobile_list.less', 'client');
	api.addFiles('client/mobile/mobile_list.coffee', 'client');
	api.addFiles('client/mobile/list_switch.html', 'client');
	api.addFiles('client/mobile/list_switch.less', 'client');
	api.addFiles('client/mobile/list_switch.coffee', 'client');
	api.addFiles('client/mobile/mobile_view.html', 'client');
	api.addFiles('client/mobile/mobile_view.less', 'client');
	api.addFiles('client/mobile/mobile_view.coffee', 'client');
	api.addFiles('client/mobile/related_object_list.html', 'client');
	api.addFiles('client/mobile/related_object_list.less', 'client');
	api.addFiles('client/mobile/related_object_list.coffee', 'client');
	api.addFiles('client/mobile/mobile_report.html', 'client');
	api.addFiles('client/mobile/mobile_report.less', 'client');
	api.addFiles('client/mobile/mobile_report.coffee', 'client');
	api.addFiles('client/mobile/switch_space.html', 'client');
	api.addFiles('client/mobile/switch_space.coffee', 'client');



	api.addFiles('client/core.coffee', 'client');
	api.addFiles('client/router.coffee', 'client');
	api.addFiles('client/subscribe.coffee', 'client');
	api.addFiles('client/bootstrap.coffee', 'client');

	api.addFiles('client/animate.css', 'client');
	api.addFiles('client/animate.js', 'client');
	api.addFiles('client/common_style.less', 'client');
	api.addFiles('client/colResizable-1.6.js', 'client');
	api.addFiles('client/jquery.ba-resize.js', 'client');

	api.addFiles('client/views/home.html', 'client');
	api.addFiles('client/views/home.coffee', 'client');
	api.addFiles('client/views/home.less', 'client');
	api.addFiles('client/views/list_wrapper.html', 'client');
	api.addFiles('client/views/list_wrapper.coffee', 'client');
	api.addFiles('client/views/list_wrapper.less', 'client');
	api.addFiles('client/views/grid.html', 'client');
	api.addFiles('client/views/grid.coffee', 'client');
	api.addFiles('client/views/grid.less', 'client');
	api.addFiles('client/views/list.html', 'client');
	api.addFiles('client/views/list.coffee', 'client');
	api.addFiles('client/views/list.less', 'client');
	api.addFiles('client/views/view.html', 'client');
	api.addFiles('client/views/view.coffee', 'client');
	api.addFiles('client/views/view.less', 'client');
	api.addFiles('client/views/app_home.html', 'client');
	
	api.addFiles('client/views/filter_logic.html', 'client');
	api.addFiles('client/views/filter_logic.coffee', 'client');
	api.addFiles('client/views/filter_logic.less', 'client');

	api.addFiles('client/views/report_content.html', 'client');
	api.addFiles('client/views/report_content.coffee', 'client');

	api.addFiles('client/views/report.html', 'client');
	api.addFiles('client/views/report.coffee', 'client');
	api.addFiles('client/views/report.less', 'client');

	api.addFiles('client/views/report_settings.html', 'client');
	api.addFiles('client/views/report_settings.coffee', 'client');
	api.addFiles('client/views/report_settings.less', 'client');

	api.addFiles('client/views/table_cell.html', 'client');
	api.addFiles('client/views/table_cell.coffee', 'client');
	api.addFiles('client/views/table_cell.less', 'client');
	api.addFiles('client/views/table_actions.html', 'client');
	api.addFiles('client/views/table_actions.coffee', 'client');
	api.addFiles('client/views/table_actions.less', 'client');
	api.addFiles('client/views/table_checkbox.html', 'client');
	api.addFiles('client/views/table_checkbox.coffee', 'client');
	api.addFiles('client/views/table_checkbox.less', 'client');

	api.addFiles('client/views/filter_option_list.html', 'client');
	api.addFiles('client/views/filter_option_list.coffee', 'client');
	api.addFiles('client/views/filter_option.html', 'client');
	api.addFiles('client/views/filter_option.coffee', 'client');
	api.addFiles('client/views/filter_option.less', 'client');

	api.addFiles('client/views/record_search_list.html', 'client');
	api.addFiles('client/views/record_search_list.coffee', 'client');
	api.addFiles('client/views/record_search_list.less', 'client');

	api.addFiles('client/views/search_result_list.html', 'client');
	api.addFiles('client/views/search_result_list.coffee', 'client');
	api.addFiles('client/views/search_result_list.less', 'client');

	api.addFiles('client/views/related_object_list.html', 'client');
	api.addFiles('client/views/related_object_list.coffee', 'client');
	api.addFiles('client/views/related_object_list.less', 'client');

	api.addFiles('client/views/select_fields.html', 'client');
	api.addFiles('client/views/select_fields.coffee', 'client');
	api.addFiles('client/views/select_fields.less', 'client');

	api.addFiles('client/views/standard_query.html', 'client');
	api.addFiles('client/views/standard_query.coffee', 'client');
	api.addFiles('client/views/standard_query.less', 'client');

	api.addFiles('client/views/custom_data_source.html', 'client');
	api.addFiles('client/views/custom_data_source.coffee', 'client');
	api.addFiles('client/views/odata_service.html', 'client');
	api.addFiles('client/views/odata_service.coffee', 'client');

	api.addFiles('client/views/initiate_approval.html', 'client');
	api.addFiles('client/views/initiate_approval.coffee', 'client');

	api.addFiles('client/views/user.html', 'client');
	api.addFiles('client/views/user.coffee', 'client');
	api.addFiles('client/views/user.less', 'client');

	api.addFiles('client/theme.less', 'client');
	api.addFiles('client/i18n.coffee', 'client');

	api.addAssets('assets/logo.png', 'client');

	api.export(['uuflowManager', 'permissionManager'], ['server']);

});
