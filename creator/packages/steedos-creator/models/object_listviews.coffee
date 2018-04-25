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
			required: true
		label:
			label: "显示名称"
		object_name:
			label: "对象",
			type: "master_detail"
			reference_to: "objects"
			required: true
			optionsFunction: ()->
				_options = []
				_.forEach Creator.objectsByName, (o, k)->
					_options.push {label: o.label, value: k, icon: o.icon}
				return _options
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
					if !_object.fields[f].hidden and !_object.fields[f].omit
						label = _object.fields[f].label
						_options.push {label:label || f, value: f, icon: icon}
				return _options
		sort:
			label: "默认排序规则"
			type: "grid"

		"sort.$":
			blackbox: true
			type: "Object"

		"sort.$.field_name":
			label: "字段"
			type: "lookup"
			optionsFunction: (values)->
				_options = []
				_object = Creator.getObject()
				fields = _object.fields
				icon = _object.icon
				_.forEach fields, (f, k)->
					_options.push {label: f.label || k, value: k, icon: icon}
				return _options

		"sort.$.order":
			label: "顺序"
			type: "select"
			defaultValue: "asc"
			options: "正序:asc,倒序:desc"
		shared:
			label: "共享视图到工作区"
			type: "boolean"
			# hidden: true
		filters:
			type: "[Object]"
			omit: true
		"filters.$":
			blackbox: true
			omit: true
		filter_logic:
			type: String
			omit: true

		is_default:
			type: "boolean"
			omit: true
			defaultValue: false
	
	triggers:
		"before.insert.cilent.object_listviews": 
			on: "client"
			when: "before.insert"
			todo: (userId, doc)->
				object_name = Session.get("object_name")
				list_view = Creator.getObjectDefaultView(object_name)
				filter_scope = list_view?.filter_scope || "space"
				columns = list_view?.columns
				if filter_scope == "spacex"
					filter_scope = "space"
				if !doc.object_name
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
				return

		"before.remove.server.object_listviews":
			on: "server"
			when: "before.remove"
			todo: (userId, doc)->
				console.log "before.remove"
				if doc.owner != userId
					throw new Meteor.Error 403, "can only remove own list view"

				if doc.is_default
					throw new Meteor.Error 403, "can not remove default list view"
				
	list_views:
		all:
			columns: ["name", "shared", "modified"]
			label:'全部列表视图'
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
			# readable_fields: ["name", "filter_scope", "columns", "shared", "owner"]
			# editable_fields: ["name", "filter_scope", "columns", "shared", "owner"]