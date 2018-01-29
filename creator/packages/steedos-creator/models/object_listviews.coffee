Creator.Objects.object_listviews = 
	name: "object_listviews"
	label: "视图"
	icon: "forecasts"
	fields: 
		name:
			type: "text"
		object_name: 
			type: "text"
			omit: true
		shared:
			type: "boolean"
		filter_scope:
			type: "text"
			omit: true
		columns:
			type: "[text]"
			omit: true
		filters:
			type: "[Object]"
			omit: true
		"filters.$.field":
        	type: String
		"filters.$.operation":
        	type: String
		"filters.$.value":
        	# type: String
			blackbox: true
		filter_logic:
			type: String
			omit: true
	
	triggers:
		"before.insert.cilent.default": 
			on: "client"
			when: "before.insert"
			todo: (userId, doc)->
				object_name = Session.get("object_name")
				list_view = Creator.getListView(object_name, "default")
				filter_scope = list_view.filter_scope || "space"
				columns = list_view.columns
				if filter_scope == "spacex"
					filter_scope = "space"

				doc.object_name = object_name
				doc.filter_scope = filter_scope
				doc.columns = columns
			
				doc.filters = Session.get("cmDoc")?.filters || []
				console.log doc
				
	list_views:
		default:
			columns: ["name", "shared", "modified"]
		all:
			filter_scope: "space"
