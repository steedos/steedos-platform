Creator.Objects.instances = 
	name: "instances"
	icon: "task"
	label: "Instances"
	fields:
		name: 
			type: "text"
			defaultValue: ""
			description: ""
			inlineHelpText: ""
			required: true
			searchable:true
			#index:true
		flow:
			type: "master_detail"
			reference_to: "flows"
			readonly: true
		applicant:
			type: "lookup",
			reference_to: "users"
		applicant_organization:
			type: "lookup",
			reference_to: "organizations"
		state:
			type: "string"

	list_views:
		default:
			columns: ["name", "applicant", "applicant_organization", "modified"]
		inbox:
			filter_scope: "space"
			filters: [["inbox_users", "=", "{userId}"]]
		outbox:
			filter_scope: "space"
			filters: [["outbox_users", "=", "{userId}"]]

	permission_set:
		user:
			allowCreate: false
			allowDelete: false
			allowEdit: false
			allowRead: true
			modifyAllRecords: false
			viewAllRecords: true 
		admin:
			allowCreate: false
			allowDelete: false
			allowEdit: false
			allowRead: true
			modifyAllRecords: false
			viewAllRecords: true 