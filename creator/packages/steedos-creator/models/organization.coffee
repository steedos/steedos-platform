Creator.Objects.organizations = 
	name: "organizations"
	label: "部门"
	icon: "team_member"
	enable_search: true
	fields:
		name: 
			label: "名称"
			type: "text"
			required: true
			searchable:true
			index:true
			sortable: true

		fullname: 
			label: "全路径"
			type: "text"
			omit: true

		parent:
			label: "上级组织"
			type: "lookup"
			reference_to: "organizations"
			sortable: true

		parents:
			label: "上级组织"
			type: "lookup"
			reference_to: "organizations"
			multiple: true
			omit: true

		children:
			label: "下级组织"
			type: "lookup"
			reference_to: "organizations"
			multiple: true
			omit: true

		sort_no:
			label: "排序号"
			type: "number"
			defaultValue: 100
			sortable: true

		users:
			label: "成员"
			type: "lookup"
			reference_to: "users"
			multiple: true

		admins:
			label: "组织管理员"
			type: "lookup"
			reference_to: "users"
			multiple: true

		is_company:
			label: "根部门"
			type: "boolean"
			omit: true
			index:true
		
		is_subcompany:
			label: "子公司"
			type: "boolean"
			defaultValue: false
			index:true
		
		hidden:
			label: "隐藏"
			type: "boolean"

	list_views:
	
		all:
			columns: ["name", "parent", "sort_no", "modified"]
			label: "所有部门"
			filter_scope: "space"

	permission_set:
		user:
			allowCreate: false
			allowDelete: false
			allowEdit: false
			allowRead: true
			modifyAllRecords: false
			viewAllRecords: true 
		admin:
			allowCreate: true
			allowDelete: true
			allowEdit: true
			allowRead: true
			modifyAllRecords: true
			viewAllRecords: true 