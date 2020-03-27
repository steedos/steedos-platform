Package.describe({
	name: 'steedos:workflow',
	version: '0.0.1',
	summary: 'Steedos workflow libraries',
	git: ''
});

Package.onUse(function(api) {
	api.versionsFrom('1.0');

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
	api.use('steedos:api');
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
	api.use('steedos:cfs-aliyun');
	api.use('steedos:cfs-s3');
	api.use('steedos:app-workflow');

	api.use('meteorhacks:ssr@2.2.0');
	api.use('meteorhacks:subs-manager');

	api.use(['webapp'], 'server');

	api.use('momentjs:moment', ['client', 'server']);
	api.use('mrt:moment-timezone', ['client', 'server']);

	api.use('steedos:autoform-modals');
	api.use('vazco:universe-autoform-select');

	api.use('steedos:autoform')
	api.use('steedos:base');
	// api.use('steedos:admin');

	api.use('steedos:mailqueue');
	api.use('steedos:webhookqueue');
	api.use('steedos:api-authenticate-user');
	api.use('steedos:slipjs');

	api.use('universe:i18n@1.13.0');
	tapi18nFiles = ['i18n/en.i18n.json', 'i18n/zh-CN.i18n.json'];

	api.addFiles('perfect-scrollbar.js', 'client');

	api.addFiles(tapi18nFiles, ['client', 'server']);

	api.addFiles('checkNpm.js', 'server');

	// api.addFiles('server/routes_middleware_config.coffee', 'server');

	api.addFiles('lib/URI.js');
	// COMMON
	api.addFiles('lib/collection_helpers.js');

	api.addFiles('lib/tapi18n.coffee');
	api.addFiles('lib/core.coffee');


	api.addFiles('lib/models/forms.coffee');
	api.addFiles('lib/models/flows.coffee');
	api.addFiles('lib/models/flow_roles.coffee');
	api.addFiles('lib/models/flow_positions.coffee');
	api.addFiles('lib/models/instances.coffee');
	api.addFiles('lib/models/categories.coffee');
	api.addFiles('lib/models/spaces.coffee');
	api.addFiles('lib/models/deleted_instances.coffee');
	api.addFiles('lib/models/auth_tokens.coffee');
	api.addFiles('lib/models/webhooks.coffee');
	api.addFiles('lib/models/space_user_signs.coffee');
	// api.addFiles('lib/models/instance_record_queue.coffee');
	api.addFiles('lib/models/space_users.coffee');

	api.addFiles('lib/cfs/instances.coffee');

	api.addFiles('client/api.js', 'client');

	api.addFiles('client/lib/traces_manager.coffee', 'client');

	api.addFiles('client/lib/instance_event.js', 'client');
	api.addFiles('client/lib/1_form_formula.js', 'client');
	api.addFiles('client/lib/2_steedos_data_format.js', 'client');
	api.addFiles('client/lib/approve_manager.js', 'client');
	api.addFiles('client/lib/instance_manager.js', 'client');
	api.addFiles('client/lib/uuflow_api.js', 'client');
	api.addFiles('client/lib/workflow_manager.js', ['client']);
	api.addFiles('client/lib/node_manager.js', 'client');
	api.addFiles('client/lib/instance_readonly_template.coffee', ['client', 'server']);
	api.addFiles('client/lib/template_manager.coffee', ['client', 'server']);
	api.addFiles('client/lib/office_online.js', 'client');
	api.addFiles('client/lib/instance_number_rules.coffee', 'client');
	api.addFiles('client/lib/instance_batch.coffee', 'client');

	api.addFiles('client/lib/instance_macro.coffee', 'client');

	api.addFiles('client/lib/next_step_user.coffee', 'client');

	api.addFiles('client/lib/workflow_layout.coffee', 'client');

	//add client file
	api.addFiles('client/layout/master_print.less', 'client');
	api.addFiles('client/layout/master_print.html', 'client');
	api.addFiles('client/layout/master_print.coffee', 'client');
	api.addFiles('client/views/instance/instance_print.html', 'client');
	api.addFiles('client/views/instance/instance_print.coffee', 'client');

	api.addFiles('client/coreform/inputTypes/coreform-checkbox/boolean-checkbox.html', 'client');
	api.addFiles('client/coreform/inputTypes/coreform-checkbox/boolean-checkbox.js', 'client');
	api.addFiles('client/coreform/inputTypes/coreform-datepicker/coreform-datepicker.js', 'client');
	api.addFiles('client/coreform/inputTypes/coreform-multiSelect/select-checkbox-inline.html', 'client');
	api.addFiles('client/coreform/inputTypes/coreform-multiSelect/select-checkbox-inline.js', 'client');
	api.addFiles('client/coreform/inputTypes/coreform-number/coreform-number.html', 'client');
	api.addFiles('client/coreform/inputTypes/coreform-number/coreform-number.js', 'client');
	api.addFiles('client/coreform/inputTypes/coreform-radio/select-radio-inline.html', 'client');
	api.addFiles('client/coreform/inputTypes/coreform-radio/select-radio-inline.js', 'client');
	api.addFiles('client/coreform/inputTypes/coreform-section/steedos-section.html', 'client');
	api.addFiles('client/coreform/inputTypes/coreform-section/steedos-section.js', 'client');
	api.addFiles('client/coreform/inputTypes/coreform-section/steedos-section.less', 'client');
	api.addFiles('client/coreform/inputTypes/coreform-table/steedos-table-modal.html', 'client');
	api.addFiles('client/coreform/inputTypes/coreform-table/steedos-table-modal.js', 'client');
	api.addFiles('client/coreform/inputTypes/coreform-table/steedos-table.html', 'client');
	api.addFiles('client/coreform/inputTypes/coreform-table/steedos-table.js', ['client', 'server']);
	api.addFiles('client/coreform/inputTypes/coreform-table/steedos-table.less', 'client');
	api.addFiles('client/coreform/inputTypes/coreform-textarea/coreform-textarea.html', 'client');
	api.addFiles('client/coreform/inputTypes/coreform-textarea/coreform-textarea.js', 'client');

	api.addFiles('client/coreform/inputTypes/coreform-selectize/coreform-selectize.html', 'client');
	api.addFiles('client/coreform/inputTypes/coreform-selectize/coreform-selectize.less', 'client');
	api.addFiles('client/coreform/inputTypes/coreform-selectize/coreform-selectize-pill.css', 'client');
	api.addFiles('client/coreform/inputTypes/coreform-selectize/coreform-selectize.coffee', 'client');
	api.addFiles('client/coreform/inputTypes/coreform-selectize/selectize_manager.coffee', 'client');

	api.addFiles('client/layout/master.html', 'client');
	api.addFiles('client/layout/master.coffee', 'client');
	api.addFiles('client/layout/master.less', 'client');
	api.addFiles('client/layout/sidebar.html', 'client');
	api.addFiles('client/layout/sidebar.coffee', 'client');
	api.addFiles('client/layout/sidebar.less', 'client');

	api.addFiles('client/views/instance/image_sign.html', 'client');
	api.addAssets('client/views/instance/image_sign.html', 'server');
	api.addFiles('client/views/instance/_image_sign.coffee', ['client', 'server']);
	api.addFiles('client/views/instance/image_sign.coffee', 'client');

	api.addFiles('client/views/instance/traces_handler.html', 'client');
	api.addAssets('client/views/instance/traces_handler.html', 'server');
	api.addFiles('client/views/instance/_traces_handler.coffee', ['client', 'server']);
	api.addFiles('client/views/instance/traces_handler.js', 'client');

	api.addFiles('client/views/instance/_instance_form.coffee', ['client', 'server']);

	api.addFiles('client/views/instance/instance_attachments.html', 'client');
	api.addAssets('client/views/instance/instance_attachments.html', 'server');

	api.addFiles('client/views/instance/_instance_attachments.js', ['client', 'server']);
	api.addFiles('client/views/instance/_instance_sign_text.coffee', ['client', 'server']);

	api.addFiles('client/views/instance/attachments.html', 'client');
	api.addFiles('client/views/instance/attachments.js', 'client');
	api.addFiles('client/views/instance/force_end_modal.html', 'client');
	api.addFiles('client/views/instance/force_end_modal.js', 'client');
	api.addFiles('client/views/instance/instance_button.html', 'client');
	api.addFiles('client/views/instance/instance_button.coffee', 'client');
	api.addFiles('client/views/instance/instance_form.html', 'client');
	api.addFiles('client/views/instance/instance_form.coffee', 'client');
	api.addFiles('client/views/instance/instance_form.less', 'client');
	api.addFiles('client/views/instance/instance_form_table.html', 'client');
	api.addFiles('client/views/instance/instance_form_table.coffee', 'client');

	api.addFiles('client/views/instance/instance_suggestion.html', 'client');
	api.addFiles('client/views/instance/instance_suggestion.coffee', 'client');
	api.addFiles('client/views/instance/instance_view.html', 'client');
	api.addFiles('client/views/instance/instance_view.coffee', 'client');

	api.addFiles('client/views/instance/reassign_modal.html', 'client');
	api.addFiles('client/views/instance/reassign_modal.js', 'client');
	api.addFiles('client/views/instance/relocate_modal.html', 'client');
	api.addFiles('client/views/instance/relocate_modal.js', 'client');
	api.addFiles('client/views/instance/_traces_help.coffee', ['client', 'server']);
	api.addFiles('client/views/instance/traces.html', 'client');
	api.addFiles('client/views/instance/traces.js', 'client');
	api.addFiles('client/views/instance/traces_table.html', 'client');
	api.addFiles('client/views/instance/traces_table.js', 'client');
	api.addFiles('client/views/instance/traces_table_modal.less', 'client');
	api.addFiles('client/views/instance/traces_table_modal.html', 'client');
	api.addFiles('client/views/instance/traces_table_modal.coffee', 'client');

	api.addAssets('client/views/instance/traces.html', 'server');
	api.addAssets('client/views/instance/traces_table.html', 'server');

	api.addFiles('client/views/instance/trace_detail_modal.html', 'client');
	api.addFiles('client/views/instance/trace_detail_modal.js', 'client');

	api.addFiles('client/views/instance/cc_modal.html', 'client');
	api.addFiles('client/views/instance/cc_modal.coffee', 'client');
	api.addFiles('client/views/instance/opinion_modal.html', 'client');
	api.addFiles('client/views/instance/opinion_modal.js', 'client');

	api.addFiles('client/views/instance/instance_sign_modal.html', 'client');
	api.addFiles('client/views/instance/instance_sign_modal.less', 'client');
	api.addFiles('client/views/instance/instance_sign_modal.coffee', 'client');

	api.addFiles('client/views/instance/history_sign_approve.html', 'client');
	api.addFiles('client/views/instance/history_sign_approve.coffee', 'client');
	api.addFiles('client/views/instance/history_sign_approve.less', 'client');


	api.addFiles('client/views/instance/pick_approve_users.less', 'client');
	api.addFiles('client/views/instance/pick_approve_users.html', 'client');
	api.addFiles('client/views/instance/pick_approve_users.coffee', 'client');

	api.addFiles('client/views/list/flow_list_box.html', 'client');
	api.addFiles('client/views/list/flow_list_box.coffee', 'client');
	api.addFiles('client/views/list/flow_list_box.less', 'client');

	api.addFiles('client/views/list/flow_list_box_modal.html', 'client');
	api.addFiles('client/views/list/flow_list_box_modal.coffee', 'client');

	api.addFiles('client/views/list/flow_list_box_org.html', 'client');
	api.addFiles('client/views/list/flow_list_box_org.coffee', 'client');
	api.addFiles('client/views/list/flow_list_box_org.less', 'client');

	api.addFiles('client/views/list/flow_list_box_org_tree.html', 'client');
	api.addFiles('client/views/list/flow_list_box_org_tree.coffee', 'client');

	api.addFiles('client/views/list/flow_list_box_org_modal.html', 'client');
	api.addFiles('client/views/list/flow_list_box_org_modal.coffee', 'client');
	api.addFiles('client/views/list/flow_list_box_org_modal.less', 'client');

	api.addFiles('client/views/list/forward_select_flow_modal.less', 'client');
	api.addFiles('client/views/list/forward_select_flow_modal.html', 'client');
	api.addFiles('client/views/list/forward_select_flow_modal.js', 'client');

	api.addFiles('client/views/list/attachments_upload_modal.html', 'client');
	api.addFiles('client/views/list/attachments_upload_modal.coffee', 'client');
	api.addFiles('client/views/list/attachments_sign_modal.html', 'client');
	api.addFiles('client/views/list/attachments_sign_modal.coffee', 'client');

	api.addFiles('client/views/list/instance_list_wrapper.less', 'client');
	api.addFiles('client/views/list/instance_list_wrapper.html', 'client');
	api.addFiles('client/views/list/instance_list_wrapper.coffee', 'client');

	api.addFiles('client/views/list/instance_list.less', 'client');
	api.addFiles('client/views/list/instance_list.html', 'client');
	api.addFiles('client/views/list/instance_list.coffee', 'client');

	api.addFiles('client/views/list/monitor.html', 'client');
	api.addFiles('client/views/list/monitor.js', 'client');

	api.addFiles('client/views/search/instance_more_search_modal.html', 'client');
	api.addFiles('client/views/search/instance_more_search_modal.js', 'client');

	api.addFiles('client/views/home.html', 'client');
	api.addFiles('client/views/home.coffee', 'client');


	api.addFiles('client/views/menu.html', 'client');
	api.addFiles('client/views/menu.coffee', 'client');
	api.addFiles('client/views/menu.less', 'client');

	api.addFiles('client/views/workflow_menu_by_flow.html', 'client');
	api.addFiles('client/views/workflow_menu_by_flow.coffee', 'client');
	api.addFiles('client/views/workflow_menu_by_flow.less', 'client');
	
	api.addFiles('client/views/workflow_tree_menu.html', 'client');
	api.addFiles('client/views/workflow_tree_menu.coffee', 'client');
	api.addFiles('client/views/workflow_tree_menu.less', 'client');

	api.addFiles('client/views/workflow_main.html', 'client');
	api.addFiles('client/views/workflow_main.coffee', 'client');
	api.addFiles('client/views/workflow_main.less', 'client');

	api.addFiles('client/admin_menu.coffee', 'client');
	api.addFiles('client/router.coffee', 'client');
	api.addFiles('client/subscribe.coffee', 'client');

	// api.addFiles('client/views/flow/distribute_edit_flow_modal.html', 'client');
	// api.addFiles('client/views/flow/distribute_edit_flow_modal.coffee', 'client');
	// api.addFiles('client/views/flow/distribute_edit_flow_modal.less', 'client');

	api.addFiles('client/views/flow/admin_flows.less', 'client');
	api.addFiles('client/views/flow/admin_flows.html', 'client');
	api.addFiles('client/views/flow/admin_flows.coffee', 'client');

	api.addFiles('client/views/flow/admin_categories.html', 'client');
	api.addFiles('client/views/flow/admin_categories.coffee', 'client');

	api.addFiles('client/views/list/admin_flow_modal.html', 'client');
	api.addFiles('client/views/list/admin_flow_modal.coffee', 'client');

	api.addFiles('client/views/list/admin_import_export_flows.html', 'client');
	api.addFiles('client/views/list/admin_import_export_flows.coffee', 'client');

	api.addFiles('client/views/list/admin_flows_roles.html', 'client');
	api.addFiles('client/views/list/admin_flows_roles.less', 'client');
	api.addFiles('client/views/list/admin_flows_roles.coffee', 'client');

	api.addFiles('client/views/list/admin_flows_roles_modal.html', 'client');
	api.addFiles('client/views/list/admin_flows_roles_modal.less', 'client');
	api.addFiles('client/views/list/admin_flows_roles_modal.coffee', 'client');

	api.addFiles('client/views/list/admin_flows_roles_detail_modal.html', 'client');
	api.addFiles('client/views/list/admin_flows_roles_detail_modal.less', 'client');
	api.addFiles('client/views/list/admin_flows_roles_detail_modal.coffee', 'client');

	api.addFiles('client/views/list/related_instances_list.html', 'client');
	api.addFiles('client/views/list/related_instances_list.coffee', 'client');
	api.addFiles('client/views/list/related_instances_modal.less', 'client');
	api.addFiles('client/views/list/related_instances_modal.html', 'client');
	api.addFiles('client/views/list/related_instances_modal.coffee', 'client');

	api.addFiles('client/views/instance/_related_instances.coffee', ['client', 'server']);
	api.addFiles('client/views/instance/_related_records.coffee', ['client', 'server']);

	api.addFiles('client/views/instance/related_instances.html', 'client');
	api.addAssets('client/views/instance/related_instances.html', 'server');
	api.addFiles('client/views/instance/related_instances.coffee', 'client');

	api.addFiles('client/views/instance/related_records.html', 'client');
	api.addFiles('client/views/instance/related_records.coffee', 'client');
	api.addAssets('client/views/instance/related_records.html', 'server');

	api.addFiles('client/views/instance/remind_modal.html', 'client');
	api.addFiles('client/views/instance/remind_modal.coffee', 'client');

	api.addFiles('client/views/list/admin_instance_number_rules.html', 'client');
	api.addFiles('client/views/list/admin_instance_number_rules.coffee', 'client');

	api.addFiles('client/views/list/admin_flow_positions.html', 'client');
	api.addFiles('client/views/list/admin_flow_positions.coffee', 'client');
	api.addFiles('client/views/list/admin_flow_positions.less', 'client');

	api.addFiles('client/views/list/tableau_introduction_modal.html', 'client');
	api.addFiles('client/views/list/tableau_introduction_modal.less', 'client');
	api.addFiles('client/views/list/tableau_introduction_modal.coffee', 'client');

	api.addFiles('client/views/list/batch_instances.html', 'client');
	api.addFiles('client/views/list/batch_instances.coffee', 'client');
	api.addFiles('client/views/list/batch_instances_modal.html', 'client');
	api.addFiles('client/views/list/batch_instances_modal.less', 'client');
	api.addFiles('client/views/list/batch_instances_modal.coffee', 'client');

	api.addFiles('client/views/list/cancel_distribute_modal.less', 'client');
	api.addFiles('client/views/list/cancel_distribute_modal.html', 'client');
	api.addFiles('client/views/list/cancel_distribute_modal.coffee', 'client');

	api.addFiles('client/views/list/webhooks.html', 'client');
	api.addFiles('client/views/list/webhooks.coffee', 'client');

	api.addFiles('client/views/list/admin_process_delegation_rules.html', 'client');
	api.addFiles('client/views/list/admin_process_delegation_rules.coffee', 'client');

	// app-workflow plugins
	// api.addFiles('plugins/flow_import_action.coffee', 'client');
	// api.addFiles('plugins/flow_state_action.coffee', 'client');
	// api.addFiles('plugins/flow_export_action.coffee', 'client');
	// api.addFiles('plugins/flow_copy_action.coffee', 'client');
	// api.addFiles('plugins/flow_export_template_action.coffee', 'client');

	api.addFiles('server/methods/set_instance_step_approve.coffee', 'server');
	//add server file
	api.addFiles('server/methods/get_instance_data.js', 'server');
	api.addFiles('server/methods/save_instance.js', 'server');
	api.addFiles('server/methods/trace_approve_cc.js', 'server');
	api.addFiles('server/methods/forward_instance.js', 'server');
	api.addFiles('server/methods/cfs_instances.js', 'server');
	api.addFiles('server/methods/instance_approve.coffee', 'server');
	api.addFiles('server/methods/instance_return.coffee', 'server');
	api.addFiles('server/methods/instance_remind.coffee', 'server');
	api.addFiles('server/methods/next_step_users_not_found.coffee', 'server');
	api.addFiles('server/methods/instance_number_rules.coffee', 'server');
	api.addFiles('server/methods/check_main_attach.coffee', 'server');
	api.addFiles('server/methods/related_instances.coffee', 'server');
	api.addFiles('server/methods/edit_flow_positions.coffee', 'server');
	api.addFiles('server/methods/start_flow.coffee', 'server');
	api.addFiles('server/methods/instance_traces.coffee', 'server');
	api.addFiles('server/methods/instance_batch.coffee', 'server');
	api.addFiles('server/methods/flow.coffee', 'server');
	api.addFiles('server/methods/distribute.coffee', 'server');
	api.addFiles('server/methods/hide_instance.coffee', 'server');
	api.addFiles('server/methods/instance_value.coffee', 'server');

	api.addFiles('server/routes/instance.coffee', 'server');
	api.addFiles('server/routes/steedos_css.coffee', 'server');

	api.addFiles('server/routes/instance_draft_view.coffee', 'server');

	// routes
	api.addFiles('routes/nextStepUsers.js', 'server');
	api.addFiles('routes/getSpaceUsers.js', 'server');
	api.addFiles('routes/getFormulaUserObjects.js', 'server');
	api.addFiles('routes/init_formula_values.js', 'server');
	api.addFiles('routes/getNameForUser.coffee', 'server');

	api.addFiles('routes/api_designer_startup.coffee', 'server');
	api.addFiles('routes/api_workflow_engine.coffee', 'server');
	api.addFiles('routes/api_workflow_drafts.coffee', 'server');
	api.addFiles('routes/api_workflow_remove.coffee', 'server');
	api.addFiles('routes/api_workflow_submit.coffee', 'server');
	api.addFiles('routes/api_workflow_terminate.coffee', 'server');
	api.addFiles('routes/api_workflow_reassign.coffee', 'server');
	api.addFiles('routes/api_workflow_relocate.coffee', 'server');
	api.addFiles('routes/api_workflow_archive.coffee', 'server');
	api.addFiles('routes/api_workflow_export.coffee', 'server');
	api.addFiles('routes/api_workflow_space_changeset.coffee', 'server');
	api.addFiles('routes/api_workflow_retrieve.coffee', 'server');
	api.addFiles('routes/api_workflow_forward.js', 'server');
	api.addFiles('routes/api_workflow_instance.coffee', 'server');
	api.addFiles('routes/api_workflow_open_pending.coffee', 'server');

	api.addFiles('routes/export_table_template.coffee', 'server');

	api.addFiles('routes/api_workflow_open_drafts.coffee', 'server');

	api.addFiles('routes/api_workflow_open_get.coffee', 'server');
	api.addFiles('routes/api_workflow_open_submit.coffee', 'server');
	api.addFiles('routes/api_workflow_open_save.coffee', 'server');
	api.addFiles('routes/api_workflow_open_get_by_stepname.coffee', 'server');
	api.addFiles('routes/api_workflow_open_cfs.coffee', 'server');

	api.addFiles('routes/api_workflow_forward_refill.coffee', 'server');

	api.addFiles('routes/api_workflow_forward_table_refill.coffee', 'server');
	api.addFiles('routes/api_sub_table_sort.coffee', 'server');

	api.addFiles('routes/test_webhook.coffee', 'server');

	api.addFiles('server/lib/1_form_formula.js', 'server');
	api.addFiles('server/lib/get_handlers_manager.coffee', 'server');
	api.addFiles('server/lib/permission_manager.coffee', 'server');
	api.addFiles('server/lib/approve_manager.coffee', 'server');
	api.addFiles('server/lib/flow_manager.coffee', 'server');
	api.addFiles('server/lib/form_manager.coffee', 'server');
	api.addFiles('server/lib/step_manager.coffee', 'server');

	api.addFiles('server/publications/categories.coffee', 'server');
	api.addFiles('server/publications/cfs_instances.coffee', 'server');
	api.addFiles('server/publications/flow_positions.coffee', 'server');
	api.addFiles('server/publications/flow_positions_tabular.coffee', 'server');
	api.addFiles('server/publications/flow_roles.coffee', 'server');
	api.addFiles('server/publications/flows.coffee', 'server');
	api.addFiles('server/publications/forms.coffee', 'server');
	api.addFiles('server/publications/instance_data.coffee', 'server');
	api.addFiles('server/publications/instance_list.coffee', 'server');
	api.addFiles('server/publications/instance_tabular.coffee', 'server');
	api.addFiles('server/publications/instance_draft.coffee', 'server');
	api.addFiles('server/publications/distributed_instances_state_by_ids.coffee', 'server');
	api.addFiles('server/publications/related_instaces.coffee', 'server');

	api.addFiles('server/publications/space_user_signs.coffee', 'server');
	api.addFiles('server/publications/user_inbox_instance.coffee', 'server');
	api.addFiles('server/publications/flow_main_attach_template.coffee', 'server');
	// api.addFiles('server/err_stack.coffee', 'server');

	// api.addFiles('server/lib/export.coffee', 'server');
	// api.addFiles('routes/export.coffee', 'server');
	// api.addFiles('server/lib/import.coffee', 'server');
	// api.addFiles('routes/import.coffee', 'server');
	// EJS
	api.addAssets('server/ejs/export_instances.ejs', 'server');

	api.addFiles('lib/admin.coffee');

	api.addFiles('related_instances_tabular.coffee');
	api.addFiles('tabular.coffee');

	api.addFiles('client/views/instance/instance_sign_text.html', 'client');
	api.addAssets('client/views/instance/instance_sign_text.html', 'server');
	api.addFiles('client/views/instance/instance_sign_text.coffee', 'client');

	api.addFiles('client/lib/formula_data.coffee', 'client');

	api.addFiles('routes/api_formula_users.coffee', 'server');
	api.addFiles('routes/api_formula_organizations.coffee', 'server');

	api.export("WorkflowManager", ['client']);
	api.export("InstanceManager");
	api.export("WorkflowManager_format");
	// EXPORT
	api.export('Workflow');
	api.export('SteedosTable');
	api.export('InstanceReadOnlyTemplate');
	api.export('TemplateManager');

	api.export('CoreForm');

	api.export('InstanceNumberRules');

	api.addFiles('server/flow-template/workflow_template.coffee', 'server');

	api.addFiles('server/startup.coffee', 'server');

	api.addFiles('server/lib/instance_manager.coffee', 'server');

	api.addFiles('server/schedule/auto_finish_process_delegation.coffee', 'server');
	api.addFiles('server/schedule/timeout_auto_submit.coffee', 'server');

	api.export(['getHandlersManager', 'permissionManager', 'workflowTemplate', 'InstanceManager', 'approveManager', 'stepManager', 'flowManager', 'formManager'], ['server']);
	// api.export(['uuflowManager', 'getHandlersManager', 'permissionManager', 'workflowTemplate', 'InstanceManager', 'approveManager', 'stepManager', 'flowManager', 'formManager'], ['server']);

});

Package.onTest(function(api) {

});