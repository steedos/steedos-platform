Creator.Objects.spaces = 
	name: "spaces"
	label: "工作区"
	icon: "groups"
	fields:
		name: 
			label: "名称"
			type: "text"
			defaultValue: ""
			description: ""
			inlineHelpText: ""
			required: true
			searchable:true
			index:true
		owner:
			label: "所有者"
			type: "lookup"
			reference_to: "users"
			disabled: true
			omit: false
		admins: 
			label: "管理员"
			type: "lookup"
			reference_to: "users"
			multiple: true
		apps: 
			label: "应用"
			type: "lookup"
			reference_to: "apps"
			multiple: true

	list_views:		
		all:
			label:"所有"
			columns: ["name"]
			filter_scope: "all"
			filters: [["_id", "=", "{spaceId}"]]
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
			viewAllRecords: false 