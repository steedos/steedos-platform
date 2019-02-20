Creator.Objects.project_responsibles =
	name: "project_responsibles"
	label: "责任部门"
	icon: "location"
	enable_search: false
	fields:
		category:
			label: '分类'
			type: 'lookup'
			reference_to: 'projects'
			required: true
			filterable: true

		company_id:
			label: '单位'
			required: true
			filterable: true
			omit: false
			hidden: false

		responsible_organization:
			label: '责任部门'
			type: 'lookup'
			reference_to: 'organizations'
			required: true

		responsible_user:
			label: '责任人'
			type: 'lookup'
			reference_to: 'users'
			required: true

	list_views:
		all:
			label: "所有"
			columns: ["category", "company_id", "responsible_organization", "responsible_user"]
			filter_scope: "space"
			filter_fields: ["category", "company_id"]

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