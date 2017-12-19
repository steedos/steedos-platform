Creator.Objects.instances = 
	name: "instances"
	icon: "contact"
	fields:
		name: 
			type: "text"
			defaultValue: ""
			description: ""
			inlineHelpText: ""
			required: true
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
		recent:
			filter_scope: "space"
		all:
			filter_scope: "space"
		mine:
			filter_scope: "mine"
