Creator.Objects.organizations = 
	name: "organizations"
	label: "组织机构"
	icon: "team_member"
	enable_search: true
	enable_tree: true
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
			hidden: true

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
			hidden: true

		children:
			label: "下级组织"
			type: "lookup"
			reference_to: "organizations"
			multiple: true
			omit: true
			hidden: true

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
			label: "根组织"
			type: "boolean"
			omit: true
			index:true
			hidden: true
		
		is_subcompany:
			label: "公司级"
			type: "boolean"
			defaultValue: false
			index:true
		
		hidden:
			label: "隐藏"
			type: "boolean"

	list_views:
	
		all:
			columns: ["name", "sort_no", "admins", "hidden"]
			label: "所有部门"
			filter_scope: "space"
			sort : [ "field_name":"sort_no", "order":"asc"]

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


if Meteor.isServer
	Meteor.publish "subCompany", (space_id)->
		return Creator.Collections.organizations.find({space: space_id, $or: [{is_subcompany: true}, is_company: true]}, {fields: {_id: 1, name: 1, parent: 1, parents: 1, space: 1, is_subcompany: 1, is_company: 1}})