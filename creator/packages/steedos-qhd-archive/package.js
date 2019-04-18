Package.describe({
	name: 'steedos:qhd-archive',
	version: '0.0.5',
	summary: 'Creator archive',
	git: ''
});

Package.onUse(function(api) {
	api.use('steedos:creator@0.0.5');
	api.use('coffeescript@1.11.1_4');

	api.use('steedos:logger@0.0.2');

	api.addFiles('core.coffee');	
	api.addFiles('client/core.coffee','client');
	api.addFiles('client/archive.css','client');


	// 档案管理
	api.addFiles('archive_manage.coffee');
	api.addFiles('models/archive_manage/archive_chuantong.coffee');
	api.addFiles('models/archive_manage/archive_dianzi.coffee');
	api.addFiles('models/archive_manage/archive_dichan.coffee');
	api.addFiles('models/archive_manage/archive_hetong.coffee');
	api.addFiles('models/archive_manage/archive_keji.coffee');
	api.addFiles('models/archive_manage/archive_kejiditu.coffee');
	api.addFiles('models/archive_manage/archive_kuaiji.coffee');
	api.addFiles('models/archive_manage/archive_renshi.coffee');
	api.addFiles('models/archive_manage/archive_rongyu.coffee');
	api.addFiles('models/archive_manage/archive_shengxiang.coffee');
	api.addFiles('models/archive_manage/archive_shenji.coffee');
	api.addFiles('models/archive_manage/archive_tongji.coffee');
	api.addFiles('models/archive_manage/archive_wenshu.coffee');
	api.addFiles('models/archive_manage/archive_wuzi.coffee');
	api.addFiles('models/archive_manage/archive_yinjian.coffee');
	
	// 档案借阅
	api.addFiles('archive_borrow.coffee');
	api.addFiles('models/archive_borrow/archive_borrow.coffee');

	// 档案销毁
	api.addFiles('archive_destroy.coffee');
	api.addFiles('models/archive_destroy/archive_destroy.coffee');

	// 档案移交
	api.addFiles('archive_transfer.coffee');
	api.addFiles('models/archive_transfer/archive_transfer.coffee');

	// 档案统计
	api.addFiles('archive_statistics.coffee');

	// 档案维护
	api.addFiles('archive_setting.coffee');
	api.addFiles('models/archive_setting/archive_fonds.coffee');
	api.addFiles('models/archive_setting/archive_organization.coffee');
	api.addFiles('models/archive_setting/archive_retention.coffee');
	api.addFiles('models/archive_setting/archive_classification.coffee');
	api.addFiles('models/archive_setting/archive_audit.coffee');
	api.addFiles('models/archive_setting/archive_entity_relation.coffee');
	api.addFiles('models/archive_setting/archive_rules.coffee');

	
	// 方法
	api.addFiles('server/methods/archive_borrow.coffee', 'server');
	api.addFiles('server/methods/archive_destroy.coffee', 'server');
	api.addFiles('server/methods/archive_export.coffee', 'server');
	api.addFiles('server/methods/archive_new_audit.coffee', 'server');
	api.addFiles('server/methods/archive_receive.coffee', 'server');
	api.addFiles('server/methods/archive_transfer.coffee', 'server');

	//同步用户 space_user表的company字段
	api.export('SyncSpaceUserOrganizationCompany');
	api.addFiles('server/methods/start_SyncSpaceUserOrganizationCompany.coffee', 'server');
	api.addFiles('server/lib/syncSpaceUserOrganizationCompany.coffee', 'server');

	api.addFiles('client/methods/call_syncSpaceUserOrganizationCompany.coffee', 'client');	
})