Creator.Objects.audit_login =
	name: "audit_login"
	label: "登录日志"
	icon: "record"
	fields:
		username:
			label: "用户名"
			type: "text"
			is_name: true

		login_time:
			label:"登录时间"

		source_ip:
			label: "IP地址"
			type: "text"

		location:
			label:"位置"
			type: "text"

		login_type:
			label: "登录方式"
			type: "text"

		status:
			label: "状态"
			type: "text"

		browser:
			label: "浏览器"
			type: "text"

		platform:
			label: "系统"
			type: "text"

		application:
			label: "应用"
			type: "text"

		client_version:
			label: "客户端版本"
			type: "text"

		api_type:
			label: "api类型"
			type: "text"

		api_version:
			label: "api版本"
			type: "text"

		login_url:
			label: "登录URL"
			type: "text"

	list_views:
		all:
			label: "全部"
			filter_scope: "space"
			columns: ["username", "login_time", "source_ip", "location", "login_type", "status", "browser", "platform", "application", "client_version", "api_type", "api_version", "login_url"]
		recent:
			label: "最近查看"
			filter_scope: "space"

	permission_set:
		user:
			allowCreate: false
			allowDelete: false
			allowEdit: false
			allowRead: true
			modifyAllRecords: false
			viewAllRecords: false
		admin:
			allowCreate: false
			allowDelete: false
			allowEdit: false
			allowRead: true
			modifyAllRecords: false
			viewAllRecords: true