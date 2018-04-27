Creator.Objects.instances =
	name: "instances"
	icon: "task"
	label: "申请单"
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
		flow_version:
			type: "string"
		form:
			type: "master_detail"
			reference_to: "forms"
			readonly: true
		form_version:
			type: "string"
		submitter:
			type: "master_detail"
			reference_to: "users"
			readonly: true
		submitter_name:
			type: "string"
		applicant:
			type: "lookup",
			reference_to: "users"
		applicant_name:
			type: "string"
		applicant_organization:
			type: "lookup",
			reference_to: "organizations"
		applicant_organization_name:
			type: "string"
		applicant_organization_fullname:
			type: "string"
		submit_date:
			type: "datetime"
		code:
			type: "string"
		is_archived:
			type: "boolean"
		is_deleted:
			type: "boolean"
		values:
			blackbox: true
			omit: true
		inbox_users:
			type: [String]
		outbox_users:
			type: [String]
		traces:
			type: [Object]
			blackbox: true
			omit: true
		attachments:
			type: [Object]
			blackbox: true
			omit: true
		flow_name:
			type: "string"
		category_name:
			type: "string"
		related_instances:
			type: [String]
		state:
			type: "string"

		record_ids:
			type: "grid"
			omit: true

		"record_ids.$.o":
			type: "text"

		"record_ids.$.ids":
			type: "[text]"

	list_views:
		all:
			label:'所有'
			columns: ["name", "applicant", "applicant_organization", "modified"]
		inbox:
			label: "待办文件"
			filter_scope: "space"
			filters: [["inbox_users", "=", "{userId}"]]
		outbox:
			label: "已办文件"
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