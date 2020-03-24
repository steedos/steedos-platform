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
	api.use('aldeed:schema-index@1.1.0');
	api.use('aldeed:collection2@2.5.0');
	api.use('aldeed:tabular@1.6.1');
	api.use('meteorhacks:unblock@1.1.0');
	api.use('aldeed:autoform@5.8.0');
	api.use('matb33:collection-hooks@0.8.1');

	api.use('kadira:blaze-layout@2.3.0');
	api.use('kadira:flow-router@2.10.1');
	api.use('steedos:api');
	api.use('steedos:autoform-bs-datetimepicker@1.0.6');
	api.use('steedos:bootstrap3-datetimepicker@4.17.47');
	api.use('steedos:autoform-bs-minicolors@1.0.0');

	api.use('summernote:summernote@0.8.1');
	api.use('mpowaga:autoform-summernote@0.4.3');

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
	api.use('steedos:lightning-design-system@0.0.2');
	api.use('universe:i18n');
	api.use('steedos:app-base');

	api.addFiles('i18n/en.i18n.json');
	api.addFiles('i18n/zh-CN.i18n.json');

	api.addFiles('checkNpm.js', "server");

	api.addFiles('core.coffee');


	api.addFiles('lib/apps.coffee');
	// api.addFiles('lib/eval.js');
	// api.addFiles('lib/formula_engine.coffee');
	api.addFiles('lib/object_recent.coffee', 'client');
	api.addFiles('lib/filters_transform.coffee', 'client');
	api.addFiles('lib/form_manager.coffee', 'client');

	api.addFiles('server/methods/object_recent_viewed.coffee', 'server');
	api.addFiles('server/methods/object_recent_record.coffee', 'server');
	api.addFiles('server/methods/object_listviews_options.coffee', 'server');
	api.addFiles('server/methods/report_data.coffee', 'server');
	api.addFiles('server/methods/user_tabular_settings.coffee', 'server');
	api.addFiles('server/methods/object_export2xml.coffee', 'server');
	api.addFiles('server/methods/object_import_jobs.coffee', 'server');
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
	api.addFiles('server/lib/uuflow_manager.coffee', 'server');

	api.addFiles('server/routes/s3.coffee', 'server');
	api.addFiles('server/routes/api_workflow_drafts.coffee', 'server');

	api.addFiles('client/views/_helpers.coffee', 'client');

	api.addFiles('client/layout/sidebar_left.html', 'client');
	api.addFiles('client/layout/sidebar_left.less', 'client');
	api.addFiles('client/layout/sidebar_left.coffee', 'client');

	api.addFiles('client/layout/mobile_header.html', 'client');
	api.addFiles('client/layout/mobile_header.less', 'client');
	api.addFiles('client/layout/mobile_header.coffee', 'client');

	api.addFiles('client/layout/layout.html', 'client');
	api.addFiles('client/layout/layout.less', 'client');
	api.addFiles('client/layout/layout.coffee', 'client');
	api.addFiles('client/layout/header_search.html', 'client');
	api.addFiles('client/layout/header_search.less', 'client');
	api.addFiles('client/layout/header_search.coffee', 'client');
	api.addFiles('client/layout/header.html', 'client');
	api.addFiles('client/layout/header.coffee', 'client');
	api.addFiles('client/layout/header.less', 'client');
	api.addFiles('client/layout/navigation.html', 'client');
	api.addFiles('client/layout/navigation.coffee', 'client');
	api.addFiles('client/layout/sidebar.html', 'client');
	api.addFiles('client/layout/sidebar.coffee', 'client');
	api.addFiles('client/layout/sidebar.less', 'client');
	api.addFiles('client/layout/loading.html', 'client');
	api.addFiles('client/layout/loading.less', 'client');

	api.addFiles('client/layout/app_object_menu.html', 'client');
	api.addFiles('client/layout/app_object_menu.less', 'client');

	api.addFiles('client/layout/creator_app_list_modal.html', 'client');
	api.addFiles('client/layout/creator_app_list_modal.coffee', 'client');
	api.addFiles('client/layout/creator_app_list_modal.less', 'client');

	api.addFiles('client/mobile/admin.html', 'client');
	api.addFiles('client/mobile/admin.coffee', 'client');
	api.addFiles('client/mobile/admin.less', 'client');

	// api.addFiles('client/mobile/mobile_layout.html', 'client');
	// api.addFiles('client/mobile/mobile_layout.coffee', 'client');
	// api.addFiles('client/mobile/home.html', 'client');
	// api.addFiles('client/mobile/home.coffee', 'client');
	// api.addFiles('client/mobile/home.less', 'client');
	// api.addFiles('client/mobile/object_menu.html', 'client');
	// api.addFiles('client/mobile/object_menu.coffee', 'client');
	// api.addFiles('client/mobile/object_menu.less', 'client');
	// api.addFiles('client/mobile/common.less', 'client');
	// api.addFiles('client/mobile/list_switch.html', 'client');
	// api.addFiles('client/mobile/list_switch.less', 'client');
	// api.addFiles('client/mobile/list_switch.coffee', 'client');
	// api.addFiles('client/mobile/mobile_view.html', 'client');
	// api.addFiles('client/mobile/mobile_view.less', 'client');
	// api.addFiles('client/mobile/mobile_view.coffee', 'client');
	// api.addFiles('client/mobile/related_object_list.html', 'client');
	// api.addFiles('client/mobile/related_object_list.less', 'client');
	// api.addFiles('client/mobile/related_object_list.coffee', 'client');
	// api.addFiles('client/mobile/mobile_report.html', 'client');
	// api.addFiles('client/mobile/mobile_report.less', 'client');
	// api.addFiles('client/mobile/mobile_report.coffee', 'client');
	api.addFiles('client/mobile/switch_space.html', 'client');
	api.addFiles('client/mobile/switch_space.coffee', 'client');
	api.addFiles('client/mobile/apps_modal.html', 'client');
	api.addFiles('client/mobile/apps_modal.coffee', 'client');
	api.addFiles('client/mobile/apps_modal.less', 'client');

	api.addFiles('client/views/calendarNew.less', 'client');
	api.addFiles('client/views/calendarNew.html', 'client');
	api.addFiles('client/views/calendarNew.coffee', 'client');

	api.addFiles('client/core.coffee', 'client');
	api.addFiles('client/favorites.coffee', 'client');
	api.addFiles('client/router.coffee', 'client');
	api.addFiles('client/subscribe.coffee', 'client');

	api.addFiles('client/animate.css', 'client');
	api.addFiles('client/animate.js', 'client');
	api.addFiles('client/common_style.less', 'client');
	api.addFiles('client/colResizable-1.6.js', 'client');
	api.addFiles('client/jquery.ba-resize.js', 'client');

	api.addFiles('client/views/home.html', 'client');
	api.addFiles('client/views/home.coffee', 'client');
	api.addFiles('client/views/home.less', 'client');
	api.addFiles('client/views/list_tree.html', 'client');
	api.addFiles('client/views/list_tree.coffee', 'client');
	api.addFiles('client/views/list_tree_modal.html', 'client');
	api.addFiles('client/views/list_tree_modal.coffee', 'client');
	api.addFiles('client/views/list_wrapper.html', 'client');
	api.addFiles('client/views/list_wrapper.coffee', 'client');
	api.addFiles('client/views/list_wrapper.less', 'client');
	api.addFiles('client/views/grid.html', 'client');
	api.addFiles('client/views/grid.coffee', 'client');
	api.addFiles('client/views/grid.less', 'client');
	api.addFiles('client/views/view.html', 'client');
	api.addFiles('client/views/view.coffee', 'client');
	api.addFiles('client/views/view.less', 'client');
	api.addFiles('client/views/app_home.html', 'client');
	api.addFiles('client/views/app_home.coffee', 'client');
	api.addFiles('client/views/app_iframe.html', 'client');
	api.addFiles('client/views/app_iframe.coffee', 'client');
	api.addFiles('client/views/app_iframe.less', 'client');
	api.addFiles('client/views/grid_sidebar_organizations.html', 'client');
	api.addFiles('client/views/grid_sidebar_organizations.coffee', 'client');
	api.addFiles('client/views/grid_sidebar_organizations.less', 'client');
	api.addFiles('client/views/grid_sidebar_sites.html', 'client');
	api.addFiles('client/views/grid_sidebar_sites.coffee', 'client');
	api.addFiles('client/views/grid_sidebar_sites.less', 'client');

	api.addFiles('client/views/filter_logic.html', 'client');
	api.addFiles('client/views/filter_logic.coffee', 'client');
	api.addFiles('client/views/filter_logic.less', 'client');

	api.addFiles('client/views/report_content.html', 'client');
	api.addFiles('client/views/report_content.coffee', 'client');
	api.addFiles('client/views/report_content.less', 'client');

	api.addFiles('client/views/report.html', 'client');
	api.addFiles('client/views/report.coffee', 'client');
	api.addFiles('client/views/report.less', 'client');

	api.addFiles('client/views/report_settings.html', 'client');
	api.addFiles('client/views/report_settings.coffee', 'client');
	api.addFiles('client/views/report_settings.less', 'client');

	api.addFiles('client/views/reset_password.html', 'client');
	api.addFiles('client/views/reset_password.coffee', 'client');
	api.addFiles('client/views/reset_password.less', 'client');

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

	api.addFiles('client/views/calendar.html', 'client');
	api.addFiles('client/views/calendar.coffee', 'client');
	api.addFiles('client/views/calendar.less', 'client');
	
	api.addFiles('client/views/account_password.html', 'client');
	api.addFiles('client/views/account_password.coffee', 'client');
	api.addFiles('client/views/account_background.html', 'client');
	api.addFiles('client/views/account_background.coffee', 'client');
	api.addFiles('client/views/account_avatar.html', 'client');
	api.addFiles('client/views/account_avatar.coffee', 'client');
	api.addFiles('client/views/account_setting.html', 'client');
	api.addFiles('client/views/account_setting.coffee', 'client');
	api.addFiles('client/views/account_personal.html', 'client');
	api.addFiles('client/views/account_personal.coffee', 'client');
	api.addFiles('client/views/account_profile.less', 'client');

	api.addFiles('client/views/contacts_settings.html', 'client');
	api.addFiles('client/views/contacts_settings.coffee', 'client');
	api.addFiles('client/views/contacts_settings.less', 'client');
	api.addFiles('client/views/contacts_settings_hidden_modal.html', 'client');
	api.addFiles('client/views/contacts_settings_hidden_modal.coffee', 'client');
	api.addFiles('client/views/contacts_settings_limit_modal.html', 'client');
	api.addFiles('client/views/contacts_settings_limit_modal.coffee', 'client');
	api.addFiles('client/views/contacts_settings_no_force_phone_modal.html', 'client');
	api.addFiles('client/views/contacts_settings_no_force_phone_modal.coffee', 'client');

	api.addFiles('client/views/admin_template_wrap.html', 'client');
	api.addFiles('client/views/admin_template_wrap.coffee', 'client');
	api.addFiles('client/views/admin_template_wrap.less', 'client');
	
	api.addFiles('client/views/about.html', 'client');
	api.addFiles('client/views/about.coffee', 'client');
	api.addFiles('client/views/about.less', 'client');

	api.addFiles('client/views/about_content.html', 'client');
	api.addFiles('client/views/about_content.coffee', 'client');
	api.addFiles('client/views/about_content.less', 'client');

	api.addFiles('client/views/slds_illustration_preview.html', 'client');
	api.addFiles('client/views/slds_illustration_preview.coffee', 'client');
	api.addFiles('client/views/slds_illustration_preview.less', 'client');

	api.addFiles('client/title.coffee', 'client');

	api.addFiles('client/theme.less', 'client');
	api.addFiles('client/i18n.coffee', 'client');

	api.addAssets('assets/logo.png', 'client');
	api.addAssets('assets/logo-square.png', 'client');

	api.export(['permissionManagerForInitApproval', 'permissionManagerForInitApproval'], ['server']);

});