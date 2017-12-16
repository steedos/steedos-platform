Creator.baseObject = 
	fields: 
		owner:
			type: "lookup",
			reference_to: "users"
		space:
			type: "text",
			omit: true
		created:
			type: "datetime",
			omit: true
		created_by:
			type: "text",
			omit: true
		modified:
			type: "datetime",
			omit: true
		modified_by:
			type: "text",
			omit: true
		last_activity: 
			type: "datetime",
			omit: true
		last_viewed: 
			type: "datetime",
			omit: true
		last_referenced: 
			type: "datetime",
			omit: true
		is_deleted:
			type: "boolean"
			omit: true

	list_views:
		default:
			columns: ["name"]
			filter_scope: "all"
		recent:
			filter_scope: "recent"