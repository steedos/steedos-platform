Package.describe({
	name: 'steedos:base',
	version: '0.0.85',
	summary: 'Steedos libraries',
	git: 'https://github.com/steedos/creator/tree/master/packages/steedos-base'
});

Npm.depends({
	"node-schedule": "1.1.1",
	cookies: "0.6.1",
	"weixin-pay": "1.1.7",
	"xml2js": "0.4.17",
	mkdirp: "0.3.5"
});

Package.onUse(function(api) {
	api.versionsFrom('METEOR@1.3');

	api.use('session');
	api.use('coffeescript');
	api.use('ecmascript');
	api.use('blaze-html-templates');
	api.use('underscore');
	api.use('underscorestring:underscore.string@3.3.4');
	api.use('reactive-var');
	api.use('reactive-dict');
	api.use('random');
	api.use('ddp');
	api.use('check');
	api.use('ddp-rate-limiter@1.0.5');
	api.use('steedos:useraccounts-bootstrap@1.14.2_8');
	api.use('tracker');
	api.use('reywood:publish-composite@1.4.2');
	api.use('percolate:migrations@0.9.8');

	api.use('aldeed:collection2@2.10.0');
	api.use('aldeed:tabular@1.6.1');
	api.use('aldeed:autoform@5.8.0');
	api.use('steedos:cfs-filesystem@0.1.2');
	api.use('steedos:cfs-standard-packages@0.5.10');
	api.use('steedos:cfs-aliyun@0.1.0');
	api.use('steedos:cfs-s3@0.1.4');



	api.use(['webapp'], 'server');

	// TAPi18n
	api.use('templating@1.2.15', 'client');


	api.use('accounts-base');

	api.use('matb33:collection-hooks@0.8.4');
	api.use('flemay:less-autoprefixer@1.2.0');
	api.use('kadira:flow-router@2.10.1');
	api.use('kadira:blaze-layout@2.3.0');
	api.use('meteorhacks:subs-manager@1.6.4');
	api.use('dburles:collection-helpers@1.0.4');

	api.use('momentjs:moment@2.14.1');

	api.use('tap:i18n@1.8.2');
	api.use('aldeed:simple-schema@1.5.3');
	api.use('aldeed:tabular@1.6.1');
	// api.use('momentjs:moment');
	api.use('simple:json-routes@2.1.0');

	api.use('steedos:ionicons@0.1.7');
	api.use('steedos:i18n@0.0.10');
	api.use('steedos:ui@0.0.1');
	api.use('steedos:theme@0.0.29');
	api.use('steedos:e164-phones-countries@1.0.3');
	api.use('steedos:i18n-iso-countries@3.3.0');

	api.addFiles('lib/steedos_util.js', ['client', 'server']);

	api.addFiles([
		'lib/core.coffee',
		'lib/tap-i18n.coffee'
	]);

	api.addFiles('lib/simple_schema_extend.js');

	api.addFiles('lib/models/apps.coffee');
	api.addFiles('lib/models/users.coffee');
	api.addFiles('lib/models/spaces.coffee');
	api.addFiles('lib/models/space_users.coffee');
	api.addFiles('lib/models/organizations.coffee');
	api.addFiles('lib/models/users_changelogs.coffee');
	api.addFiles('lib/models/steedos_keyvalue.coffee');
	api.addFiles('lib/models/steedos_statistics.coffee');
	api.addFiles('lib/models/audit_logs.coffee');
	api.addFiles('lib/models/billings.coffee');
	api.addFiles('lib/models/modules.coffee');
	api.addFiles('lib/models/modules_changelogs.coffee');
	api.addFiles('lib/models/billing_pay_records.coffee');
	api.addFiles('lib/models/space_settings.coffee');

	api.addFiles('routes/api_get_apps.coffee', 'server');

	api.addFiles('routes/collection.coffee', 'server');
	api.addFiles('routes/sso.coffee', 'server');

	api.addFiles('lib/ajax_collection.coffee', 'client');

	api.addFiles('lib/steedos_data_manager.js', 'client');

	api.addFiles('routes/avatar.coffee', 'server');
	api.addFiles('routes/access_token.coffee', 'server');

	api.addFiles('server/publications/apps.coffee', 'server');
	api.addFiles('server/publications/my_spaces.coffee', 'server');
	api.addFiles('server/publications/space_avatar.coffee', 'server');

	api.addFiles('server/publications/modules.coffee', 'server');
	api.addFiles('server/publications/weixin_pay_code_url.coffee', 'server');

	api.addFiles('server/routes/api_billing_recharge_notify.coffee', 'server');

	api.addFiles('server/methods/my_contacts_limit.coffee', 'server');

	api.addFiles('server/methods/setKeyValue.js', 'server');
	api.addFiles('server/methods/billing_settleup.coffee', 'server');
	api.addFiles('server/methods/setUsername.coffee', 'server');
	api.addFiles('server/methods/billing_recharge.coffee', 'server');
	api.addFiles('server/methods/get_space_user_count.coffee', 'server');
	api.addFiles('server/methods/user_secret.coffee', 'server');

	api.addFiles('server/methods/update_server_session.coffee', 'server');

	api.addFiles('server/lib/billing_manager.coffee', 'server');

	api.addFiles('client/lib/printThis/printThis.js', 'client');

	api.addFiles('lib/cfs/core.coffee');
	api.addFiles('lib/cfs/avatars.coffee');

	api.addFiles('lib/methods/apps_init.coffee', 'server');
	api.addFiles('lib/methods/utc_offset.coffee');
	api.addFiles('lib/methods/last_logon.coffee');
	api.addFiles('lib/methods/user_add_email.coffee');
	api.addFiles('lib/methods/user_avatar.coffee');

	api.addFiles('lib/steedos/push.coffee');

	api.addFiles('lib/methods/email_templates_reset.js');
	api.addFiles('lib/methods/upgrade_data.js', 'server');

	api.addFiles('lib/admin.coffee');
	api.addFiles('lib/array_includes.js');
	api.addFiles('lib/cfs.coffee', ['client', 'server']);
	api.addFiles('lib/cfs_fix.coffee', ['client', 'server']);
	api.addFiles('lib/settings.coffee', ['client', 'server']);

	api.addFiles('lib/server_session.js');
	api.export('ServerSession');

	api.addFiles('server/schedule/statistics.js', 'server');
	api.addFiles('server/schedule/billing.coffee', 'server');

	api.addFiles('server/steedos/startup/migrations/v1.coffee', 'server');
	api.addFiles('server/steedos/startup/migrations/v2.coffee', 'server');
	api.addFiles('server/steedos/startup/migrations/v3.coffee', 'server');
	api.addFiles('server/steedos/startup/migrations/v4.coffee', 'server');
	api.addFiles('server/steedos/startup/migrations/v5.coffee', 'server');
	api.addFiles('server/steedos/startup/migrations/v6.coffee', 'server');
	api.addFiles('server/steedos/startup/migrations/xrun.coffee', 'server');

	api.addFiles('tabular.coffee');

	api.addFiles([
		'client/base.less',
		'client/core.coffee',
		'client/swipe.coffee',
		'client/swipe.less',
		'client/admin_menu.coffee',
		'client/api.coffee',
		'client/helpers.coffee',
		'client/language.coffee',
		'client/tooltip.coffee',
		'client/router.coffee',
		'client/layout/main.html',
		'client/layout/main.less',
		'client/layout/main.coffee',
		'client/layout/layout.html',
		'client/layout/layout.less',
		'client/layout/content_wrapper_shadow.html',
		'client/layout/sidebar.html',
		'client/views/app_list_box_modal.html',
		'client/views/app_list_box_modal.coffee',
		'client/views/app_list_box_modal.less',
		'client/views/space_switcher.html',
		'client/views/space_switcher.coffee',
		'client/views/space_switcher.less',
		'client/subscribe.coffee',
		'client/views/loading.html',
		'client/views/loading.coffee',
		'client/views/loading.less',
		'client/views/space_switcher_modal.html',
		'client/views/space_switcher_modal.coffee',
		'client/views/sidebar_user_panel.html',
		'client/views/sidebar_user_panel.coffee',
		'client/views/sidebar_user_panel.less',
		'client/dataTables_bootstrap.less',
		'client/my_contacts_limit.coffee'
	], "client");

	api.addFiles([
		'client/layout/header/header_logo.html',
		'client/layout/header/header_logo.coffee',
		'client/layout/header/header_account.html',
		'client/layout/header/header_account.coffee',
		'client/layout/header/header_refresh.html',
		'client/layout/header/header_refresh.coffee',
		'client/layout/header/header_loading.html',
		'client/layout/header/header.html',
		'client/layout/header/header.coffee',
		'client/layout/header/header.less',
		'client/layout/header/steedosheader-account.html',
		'client/layout/header/steedosheader-account.coffee',
		'client/layout/header/steedosheader-account.less',
		'client/layout/header/header_workflow_badge.html',
		'client/layout/header/header_workflow_badge.coffee',
		'client/layout/header/header_cms_badge.html',
		'client/layout/header/header_cms_badge.coffee',
	], "client");

	api.addFiles('client/lib/jquery-touch-events/jquery.mobile-events.js', 'client');

	api.addFiles('client/momentjs/zh-cn.js', 'client');

	api.addFiles('client/bootstrap_3_modal.js', 'client');

	api.addFiles('client/steedos/router.coffee', 'client');
	api.addFiles('client/steedos/tap-i18n-fix.js', 'client');

	api.addFiles('client/steedos/css/adminlte.less', 'client');

	api.addFiles('client/steedos/views/animated.less', 'client');
	api.addFiles('client/steedos/views/404.less', 'client');
	api.addFiles('client/steedos/views/404.html', 'client');
	api.addFiles('client/steedos/views/404.coffee', 'client');

	api.addFiles('client/steedos/views/layouts/sidebar.html', 'client');
	api.addFiles('client/steedos/views/layouts/sidebar.coffee', 'client');

	api.addFiles('client/steedos/views/api/api.html', 'client');
	api.addFiles('client/steedos/views/api/api.less', 'client');
	api.addFiles('client/steedos/views/api/api.coffee', 'client');

	api.addFiles('client/steedos/views/login/login_layout.less', 'client');
	api.addFiles('client/steedos/views/login/login_layout.html', 'client');
	api.addFiles('client/steedos/views/login/login_layout.coffee', 'client');

	api.addFiles('client/steedos/views/profile/linked.html', 'client');
	api.addFiles('client/steedos/views/profile/linked.coffee', 'client');

	api.addFiles('client/steedos/views/profile/profile.less', 'client');
	api.addFiles('client/steedos/views/profile/profile.html', 'client');
	api.addFiles('client/steedos/views/profile/profile.coffee', 'client');

	api.addFiles('client/steedos/views/space/customize_apps.html', 'client');
	api.addFiles('client/steedos/views/space/customize_apps.coffee', 'client');

	api.addFiles('client/steedos/views/space/space_info.html', 'client');
	api.addFiles('client/steedos/views/space/space_info.coffee', 'client');

	api.addFiles('client/steedos/views/space/space_select.html', 'client');
	api.addFiles('client/steedos/views/space/space_select.coffee', 'client');

	api.addFiles('client/steedos/views/about/steedos_about.html', 'client');
	api.addFiles('client/steedos/views/about/steedos_about.coffee', 'client');
	api.addFiles('client/steedos/views/about/steedos_about.css', 'client');

	api.addFiles('client/steedos/views/billing/steedos_billing.html', 'client');
	api.addFiles('client/steedos/views/billing/steedos_billing.coffee', 'client');
	api.addFiles('client/steedos/views/billing/steedos_billing.less', 'client');
	api.addFiles('client/steedos/views/billing/space_recharge_modal.html', 'client');
	api.addFiles('client/steedos/views/billing/space_recharge_modal.coffee', 'client');
	api.addFiles('client/steedos/views/billing/space_recharge_qrcode_modal.html', 'client');
	api.addFiles('client/steedos/views/billing/space_recharge_qrcode_modal.coffee', 'client');

	api.addFiles('client/layout/login_layout.html', "client");
	api.addFiles('client/layout/login_layout.coffee', "client");
	api.addFiles('client/layout/login_layout.less', "client");
	api.addFiles('client/layout/tabbar.html', "client");
	api.addFiles('client/layout/tabbar.coffee', "client");
	api.addFiles('client/layout/tabbar.less', "client");
	api.addFiles('client/views/springboard.less', 'client');
	api.addFiles('client/views/springboard.html', 'client');
	api.addFiles('client/views/springboard.coffee', 'client');
	api.addAssets('client/images/default-avatar.png', 'client');
	api.addFiles('client/views/workbench.less', 'client');
	api.addFiles('client/views/workbench.html', 'client');
	api.addFiles('client/views/workbench.coffee', 'client');
	api.addFiles('client/views/manage_business.less', 'client');
	api.addFiles('client/views/manage_business.html', 'client');
	api.addFiles('client/views/manage_business.coffee', 'client');

	api.addFiles('client/views/space_user_signs.html', 'client');
	api.addFiles('client/views/space_user_signs.coffee', 'client');

	api.addFiles('client/layout/top_sidebar.html', 'client');
	api.addFiles('client/layout/top_sidebar.coffee', 'client');
	api.addFiles('client/layout/top_sidebar.less', 'client');

	api.addFiles('client/iframe/master.html', 'client');
	api.addFiles('client/iframe/master.coffee', 'client');
	api.addFiles('client/iframe/master.less', 'client');

	api.addFiles('client/loading.coffee', 'client');

	api.addFiles('client/layout/master.less', 'client');
	api.addFiles('client/layout/master.html', 'client');
	api.addFiles('client/layout/master.coffee', 'client');

	api.addFiles('client/layout/notFound_layout.html', 'client');
	api.addFiles('client/layout/notFound_layout.coffee', 'client');
	api.addFiles('client/layout/notFound_layout.less', 'client');

	api.addFiles('client/autoupdate_cordova.coffee', 'web.cordova');


	api.export('Selector');
	api.export('Steedos');
	api.export('db');

	api.export('AjaxCollection');
	api.export("SteedosDataManager");

	api.export('SteedosOffice');

	api.export(['billingManager'], ['server']);

	api.export('Modal', 'client');
});

Package.onTest(function(api) {

});