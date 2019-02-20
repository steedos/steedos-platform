Creator.Objects.projects =
	name: "projects"
	label: "问题分类"
	icon: "location"
	enable_search: true
	fields:
		name:
			label:'名称'
			type:'text'
			is_wide:true

		description: 
			label: '描述'
			type: 'textarea'
			is_wide: true

		# flow_role:
		# 	label: '审批岗位'
		# 	type: 'lookup'
		# 	reference_to: 'flow_roles'
		# 	required: true
		# 	filterable: true

	list_views:
		all:
			label: "所有"
			columns: ["name", "flow_roles", "created"]
			filter_scope: "space"


	permission_set:
		user:
			allowCreate: false
			allowDelete: false
			allowEdit: false
			allowRead: false
			modifyAllRecords: false
			viewAllRecords: true
		admin:
			allowCreate: true
			allowDelete: true
			allowEdit: true
			allowRead: true
			modifyAllRecords: true
			viewAllRecords: true