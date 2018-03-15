Creator.Objects.object_listviews = 
	name: "object_listviews"
	label: "列表视图"
	icon: "forecasts"
	fields: 
		name:
			label: "列表视图名称"
			type: "text"
			searchable:true
			index:true
			# required: true
		object_name: 
			label: "对象名称"
			type: "text"
			omit: true
		filter_scope:
			label: "过滤条件"
			type: "lookup"
			defaultValue: "space"
			required: true
			optionsFunction: ()->
				_options = [
					{label: "我的", value: "mine", icon: "user"},
					{label: "工作区", value: "space", icon: "groups"}
				]
				return _options
		columns:
			label: "选择要显示的字段"
			type: "lookup"
			multiple: true
			optionsFunction: ()->
				_options = []
				_object = Creator.getObject(Session.get("object_name"))
				fields = Creator.getFields(Session.get("object_name"))
				icon = _object.icon
				_.forEach fields, (f)->
					label = _object.fields[f].label
					_options.push {label: f.label || f, value: f, icon: icon}
				return _options
		shared:
			label: "共享视图到工作区"
			type: "boolean"
			hidden: true
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
		"before.insert.cilent.object_listviews": 
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
				if !doc.columns
					doc.columns = columns
			
				doc.filters = Session.get("cmDoc")?.filters || []
				console.log doc

		"before.insert.server.object_listviews":
			on: "server"
			when: "before.insert"
			todo: (userId, doc)->
				if !Steedos.isSpaceAdmin(doc.space, userId)
					doc.shared = false

		"before.remove.server.object_listviews":
			on: "server"
			when: "before.remove"
			todo: (userId, doc)->
				console.log "before.remove"
				if doc.owner != userId
					throw new Meteor.Error 403, "can only remove own list view"
				
	list_views:
		default:
			columns: ["name", "shared", "modified"]
		all:
			filter_scope: "space"

	permission_set:
		user:
			allowCreate: true
			allowDelete: true
			allowEdit: true
			allowRead: false
			modifyAllRecords: false
			viewAllRecords: false
		admin:
			allowCreate: true
			allowDelete: true
			allowEdit: true
			allowRead: false
			modifyAllRecords: false
			viewAllRecords: false
			readable_fields: ["name", "filter_scope", "columns", "shared", "owner"]
			editable_fields: ["name", "filter_scope", "columns", "shared", "owner"]