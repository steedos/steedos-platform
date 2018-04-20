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
			required: true
		permission_set_id: 
			label: "权限组",
			type: "master_detail"
			required: true
			reference_to: "permission_set"
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
		allowRead: 
			type: "boolean"
			label: "允许查看",
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
		disabled_list_views:
			type: "lookup"
			label:'禁用列表视图'
			multiple: true
			depend_on: ["object_name"]
			defaultIcon: "lead_list"
			optionsFunction: (values)->
				_options = []
				_object = Creator.getObject(values.object_name)
				list_views = _object.list_views
				_.forEach list_views, (f, k)->
					if k != "default" and (!_.has(f, "shared") || f.shared)
						_options.push {label: f.label || f.name || k, value: f._id}
				return _options
		disabled_actions:
			type: "lookup"
			label:'禁用操作'
			multiple: true
			depend_on: ["object_name"]
			defaultIcon: "marketing_actions"
			optionsFunction: (values)->
				_options = []
				_object = Creator.getObject(values.object_name)
				actions = _object.actions
				_.forEach actions, (f, k)->
					if ["standard_new", "standard_edit", "standard_delete"].indexOf(k) < 0
						_options.push {label: f.label || k, value: k}
				return _options
		unreadable_fields:
			type: "lookup"
			label:'不可见字段'
			multiple: true
			depend_on: ["object_name"]
			optionsFunction: (values)->
				object_name = values.object_name
				unless object_name
					return []
				_options = []
				_object = Creator.getObject(object_name)
				fields = _object.fields
				icon = _object.icon
				_.forEach fields, (f, k)->
					_options.push {label: f.label || k, value: k, icon: icon}
				return _options
		uneditable_fields:
			type: "lookup"
			label:'不可编辑字段'
			multiple: true
			depend_on: ["object_name", "unreadable_fields"]
			optionsFunction: (values)->
				object_name = values.object_name
				unless object_name
					return []
				_options = []
				_object = Creator.getObject(object_name)
				fields = _object.fields
				icon = _object.icon
				_.forEach fields, (f, k)->
					unless f.omit
						if _.indexOf(values.unreadable_fields, k) < 0 
							_options.push {label: f.label || k, value: k, icon: icon}
				return _options
		unrelated_objects:
			type: "lookup"
			label:'禁用关联对象'
			multiple: true
			depend_on: ["object_name"]
			optionsFunction: (values)->
				_options = []
				related_objects = Creator.getObject(values.object_name).related_objects
				related_object_names = _.uniq(_.pluck(related_objects, "object_name"))
				_.forEach related_object_names, (i)->
					_object = Creator.getObject(i)
					_options.push {label: _object.label || i, value: i, icon: _object.icon}
				return _options

	list_views:		
		all:
			label:"所有对象权限"
			columns: ["name", "permission_set_id", "object_name", "allowCreate", "allowDelete", "allowEdit", "allowRead", "modifyAllRecords", "viewAllRecords"]
			filter_scope: "space"

	triggers:
		"before.insert.server.process": 
			on: "server"
			when: "before.insert"
			todo: (userId, doc)->
				Creator.processPermissions doc
				
		"before.update.server.process": 
			on: "server"
			when: "before.update"
			todo: (userId, doc, fieldNames, modifier, options)->
				Creator.processPermissions modifier.$set

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