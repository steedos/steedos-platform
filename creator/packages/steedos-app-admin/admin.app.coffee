Creator.Apps.admin =
	url: "/app/admin"
	name: "设置"
	description: "系统管理员可以设置组织结构、人员、应用、权限等全局参数。"
	icon: "ion-ios-people-outline"
	icon_slds: "custom"
	is_creator:true
	objects: []

	# Menu 支持两种类型的参数
	# - template_name 指向 Meteor Template, url=/app/admin/page/{template_name}/
	# - object_name 指向对象, url=/app/admin/{object_name}/grid/all/	
	admin_menus: [
		{ _id: 'account', name: '我的账户', permission_sets: ["user"], expanded: false },
		# { _id: 'account_personal', name: '个人信息', permission_sets: ["user"], template_name: "account_personal", parent: 'account' },
		{ _id: 'account_avatar', name: '头像', permission_sets: ["user"], template_name: "account_avatar", parent: 'account' },
		{ _id: 'account_setting', name: '账户', permission_sets: ["user"], template_name: "account_setting", parent: 'account' },
		{ _id: 'account_password', name: '密码', permission_sets: ["user"], template_name: "account_password", parent: 'account' },
		{ _id: 'account_background', name: '背景图', permission_sets: ["user"], template_name: "account_background", parent: 'account' }

		{ _id: 'menu_users', name: '用户', permission_sets: ["admin", "organization_admin"], expanded: false },
		{ _id: 'organizations', name: '部门', permission_sets: ["admin", "organization_admin"], object_name: "organizations", parent: 'menu_users' },
		{ _id: 'space_users', name: '用户', permission_sets: ["admin", "organization_admin"], object_name: "space_users", parent: 'menu_users' },
		{ _id: 'permission_set', name: '权限组', permission_sets: ["admin"], object_name: "permission_set", parent: 'menu_users' },
		{ _id: 'spaces', name: '公司信息', permission_sets: ["admin"], object_name: "spaces", parent: 'menu_users' },
		{ _id: 'contacts_limit', name: '通讯录权限', permission_sets: ["admin"], template_name: "contacts_settings", parent: 'menu_users' },
		
		{ _id: 'menu_objects', name: '应用', permission_sets: ["admin"], expanded: false },
		{ _id: 'apps', name: '应用', permission_sets: ["admin"], object_name: "apps", parent: 'menu_objects' },
		{ _id: 'objects', name: '对象', permission_sets: ["admin"], object_name: "objects", parent: 'menu_objects' },
		{ _id: 'permission_objects', name: '对象权限', permission_sets: ["admin"], object_name: "permission_objects", parent: 'menu_objects' },
		{ _id: 'permission_shares', name: '共享规则', permission_sets: ["admin"], object_name: "permission_shares", parent: 'menu_objects' },
		{ _id: 'object_workflows', name: '对象流程', permission_sets: ["admin"], object_name: "object_workflows", parent: 'menu_objects' },

		{ _id: 'menu_advanced', name: '高级', permission_sets: ["admin"], expanded: false },
		{ _id: 'audit_records', name: '审计记录', permission_sets: ["admin"], object_name: "audit_records", parent: 'menu_advanced' },
		{ _id: 'application_package', name: '软件包', permission_sets: ["admin"], object_name: "application_package", parent: 'menu_advanced' },
		{ _id: 'queue_import', name: '数据导入', permission_sets: ["admin"], object_name: "queue_import", parent: 'menu_advanced' },
		{ _id: 'OAuth2Clients', name: 'OAuth2 应用', permission_sets: ["admin"], object_name: "OAuth2Clients", parent: 'menu_advanced' },
		{ _id: 'OAuth2AccessTokens', name: 'OAuth2 Token', permission_sets: ["admin"], object_name: "OAuth2AccessTokens", parent: 'menu_advanced' },
		
		{ _id: 'about', name: '关于', permission_sets: ["user"], template_name: "creator_about" }
	]
		
