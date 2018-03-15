Creator.Objects.permission_objects = 
	name: "permission_objects"
	label: "对象权限"
	icon: "user"
	fields: 
		name:
			label: "名称",
			type: "text",
			searchable:true
			index:true
		permission_set_id: 
			label: "权限组",
			type: "master_detail"
			reference_to: "permission_set"
		object_name:
			label: "对象",
			type: "lookup"
			optionsFunction: ()->
				_options = []
				_.forEach Creator.Objects, (o, k)->
					_options.push {label: o.label, value: k, icon: o.icon}
				return _options

		allowRead: 
			type: "boolean"
			label: "查看我的记录",
		allowCreate: 
			label: "允许创建",
			type: "boolean"
		allowEdit: 
			label: "允许编辑",
			type: "boolean"
		allowDelete: 
			label: "允许删除",
			type: "boolean"
		viewAllRecords: 
			type: "boolean"
			label: "查看所有记录",
		modifyAllRecords: 
			type: "boolean"
			label: "修改所有记录",
		list_views:
			type: "lookup"
			multiple: true
			depend_on: ["object_name"]
			defaultIcon: "lead_list"
			optionsFunction: (values)->
				_options = []
				_object = Creator.getObject(values.object_name)
				list_views = _object.list_views
				_.forEach list_views, (f, k)->
					if !_.has(f, "shared") || f.shared
						_options.push {label: f.label || f.name || k, value: f._id}
				return _options
		actions:
			type: "lookup"
			multiple: true
			depend_on: ["object_name"]
			defaultIcon: "marketing_actions"
			optionsFunction: (values)->
				_options = []
				_object = Creator.getObject(values.object_name)
				actions = _object.actions
				_.forEach actions, (f, k)->
					_options.push {label: f.label || k, value: k}
				return _options
		readable_fields:
			type: "lookup"
			multiple: true
			depend_on: ["object_name"]
			optionsFunction: (values)->
				_options = []
				_object = Creator.getObject(values.object_name)
				fields = _object.fields
				icon = _object.icon
				_.forEach fields, (f, k)->
					_options.push {label: f.label || k, value: k, icon: icon}
				return _options
		editable_fields:
			type: "lookup"
			multiple: true
			depend_on: ["object_name"]
			optionsFunction: (values)->
				_options = []
				_object = Creator.getObject(values.object_name)
				fields = _object.fields
				icon = _object.icon
				_.forEach fields, (f, k)->
					_options.push {label: f.label || k, value: k, icon: icon}
				return _options
		related_objects:
			type: "lookup"
			multiple: true
			depend_on: ["object_name"]
			optionsFunction: (values)->
				_options = []
				related_object_names = Creator.getRelatedObjectNames(values.object_name)
				_.forEach related_object_names, (i)->
					_object = Creator.getObject(i)
					_options.push {label: _object.label || i, value: i, icon: _object.icon}
				return _options

	list_views:
		default:
			columns: ["name", "permission_set_id", "object_name", "allowCreate", "allowDelete", "allowEdit", "allowRead", "modifyAllRecords", "viewAllRecords"]
		all:
			filter_scope: "space"

	permission_set:
		user:
			allowCreate: false
			allowDelete: false
			allowEdit: false
			allowRead: false
			modifyAllRecords: false
			viewAllRecords: false 
		admin:
			allowCreate: true
			allowDelete: true
			allowEdit: true
			allowRead: true
			modifyAllRecords: true
			viewAllRecords: true 