Creator.Objects.object_listviews = 
	name: "object_listviews"
	label: "视图"
	icon: "forecasts"
	fields: 
		name:
			type: "text"
		object_name: 
			type: "text"
		shared:
			type: "boolean"
		filters:
			type: [Object]
			omit: true
		filter_logic:
			type: "text"
			omit: true

	list_views:
		default:
			columns: ["name", "shared", "modified"]
		all:
			filter_scope: "space"
