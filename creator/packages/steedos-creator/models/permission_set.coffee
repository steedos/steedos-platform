Creator.Objects.permission_set = 
	name: "permission_set"
	label: "Permission Set"
	fields: 
		name:
			type: "text",
		users:
			type: "lookup"
			reference_to: "users"

	list_views:
		default:
			columns: ["name", "users"]
		all:
			filter_scope: "space"
