Package.describe({
	name: 'steedos:app-contract',
	version: '0.0.1',
	summary: 'Creator contract',
	git: ''
});

Package.onUse(function(api) {
	api.use('steedos:creator@0.0.5');
	api.use('coffeescript@1.11.1_4');

	api.use('steedos:logger@0.0.2');

	api.addFiles('core.coffee');	
	api.addFiles('client/core.coffee','client');
	api.addFiles('client/archive.css','client');


	// 合同管理
	api.addFiles('contract_manage.coffee');
	api.addFiles('models/contract_manage/contracts.coffee');
	

	// 合同维护
	api.addFiles('contract_setting.coffee');
	api.addFiles('models/contract_setting/contract_company_type.coffee');
	api.addFiles('models/contract_setting/contract_company.coffee');
	api.addFiles('models/contract_setting/contract_file_uploadMessage.coffee');
	api.addFiles('models/contract_setting/contract_rate.coffee');
	api.addFiles('models/contract_setting/contract_state.coffee');
	api.addFiles('models/contract_setting/contract_type.coffee');
	api.addFiles('models/contract_setting/contract_othercompany.coffee');

	
	// 方法
})