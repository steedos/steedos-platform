_syncToObject = (doc) ->
	object_fields = Creator.getCollection("object_fields").find({object: doc.object}, {
		fields: {
			created: 0,
			modified: 0,
			owner: 0,
			created_by: 0,
			modified_by: 0
		}
	}).fetch()

	fields = {}

	table_fields = {}

	_.forEach object_fields, (f)->
		if /^[a-zA-Z_]\w*(\.\$\.\w+){1}[a-zA-Z0-9]*$/.test(f.name)
			cf_arr = f.name.split(".$.")
			child_fields = {}
			child_fields[cf_arr[1]] = f
			if !_.size(table_fields[cf_arr[0]])
				table_fields[cf_arr[0]] = {}
			_.extend(table_fields[cf_arr[0]], child_fields)
		else
			fields[f.name] = f

	_.each table_fields, (f, k)->
		if fields[k].type == "grid"
			if !_.size(fields[k].fields)
				fields[k].fields = {}
			_.extend(fields[k].fields, f)

	Creator.getCollection("objects").update({name: doc.object}, {
		$set:
			fields: fields
	})

isRepeatedName = (doc, name)->
	other = Creator.getCollection("object_fields").find({object: doc.object, _id: {$ne: doc._id}, name: name || doc.name}, {fields:{_id: 1}})
	if other.count() > 0
		return true
	return false

Creator.Objects.object_fields =
	name: "object_fields"
	icon: "orders"
	enable_api: true
	label:"字段"
	fields:
		name:
			type: "text"
			searchable: true
			index: true
			required: true
			regEx: SimpleSchema.RegEx.field
		label:
			type: "text"
		object:
			type: "master_detail"
			reference_to: "objects"
			required: true
			optionsFunction: ()->
				_options = []
				_.forEach Creator.objectsByName, (o, k)->
					_options.push {label: o.label, value: k, icon: o.icon}
				return _options
		type:
			type: "select"
			required: true
			options:
				text: "文本",
				textarea: "长文本"
				html: "Html文本",
				select: "选择框",
				boolean: "Checkbox"
				date: "日期"
				datetime: "日期时间"
				number: "数值"
				currency: "金额"
				lookup: "相关表"
				master_detail: "主表/子表"
				grid: "表格"
		sort_no:
			label: "排序号"
			type: "number"
			defaultValue: 100
			scale: 0
			sortable: true

		group:
			type: "text"

		defaultValue:
			type: "text"

		allowedValues:
			type: "text"
			multiple: true

		multiple:
			type: "boolean"

		required:
			type: "boolean"

		is_wide:
			type: "boolean"

		readonly:
			type: "boolean"

#		disabled:
#			type: "boolean"
		hidden:
			type: "boolean"
		#TODO 将此功能开放给用户时，需要关闭此属性
		omit:
			type: "boolean"

		index:
			type: "boolean"

		searchable:
			type: "boolean"

		sortable:
			type: "boolean"

		precision:
			type: "currency"
			defaultValue: 18

		scale:
			type: "currency"
			defaultValue: 2

		reference_to: #在服务端处理此字段值，如果小于2个，则存储为字符串，否则存储为数组
			type: "lookup"
			optionsFunction: ()->
				_options = []
				_.forEach Creator.Objects, (o, k)->
					_options.push {label: o.label, value: k, icon: o.icon}
				return _options
#			multiple: true #先修改为单选

		rows:
			type: "currency"

		options:
			type: "textarea"
			is_wide: true

		description:
			label: "Description"
			type: "text"
			is_wide: true

	list_views:
		all:
			columns: ["name", "label", "type", "object", "sort_no", "modified"]
			sort: [{field_name: "sort_no", order: "asc"}]
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

	triggers:				
		"after.insert.server.object_fields":
			on: "server"
			when: "after.insert"
			todo: (userId, doc)->
				_syncToObject(doc)
		"after.update.server.object_fields":
			on: "server"
			when: "after.update"
			todo: (userId, doc)->
				_syncToObject(doc)
		"after.remove.server.object_fields":
			on: "server"
			when: "after.remove"
			todo: (userId, doc)->
				_syncToObject(doc)
		"before.update.server.object_fields":
			on: "server"
			when: "before.update"
			todo: (userId, doc, fieldNames, modifier, options)->
				if doc.name == 'name' && modifier?.$set?.name && doc.name != modifier.$set.name
					throw new Meteor.Error 500, "不能修改此纪录的name属性"
				if modifier?.$set?.name && isRepeatedName(doc, modifier.$set.name)
					throw new Meteor.Error 500, "对象名称不能重复"

				if modifier?.$set?.reference_to
					if modifier.$set.reference_to.length == 1
						_reference_to = modifier.$set.reference_to[0]
					else
						_reference_to = modifier.$set.reference_to
				if modifier?.$set?.index and (modifier?.$set?.type == 'textarea' or modifier?.$set?.type == 'html')
					throw new Meteor.Error 500, "多行文本不支持建立索引"
				object = Creator.getCollection("objects").findOne({_id: doc.object}, {fields: {name: 1, label: 1}})

				if object

					object_documents = Creator.getCollection(object.name).find()
					if modifier?.$set?.reference_to && doc.reference_to != _reference_to && object_documents.count() > 0
						throw new Meteor.Error 500, "对象#{object.label}中已经有记录，不能修改reference_to字段"

					if modifier?.$unset?.reference_to && doc.reference_to != _reference_to && object_documents.count() > 0
						throw new Meteor.Error 500, "对象#{object.label}中已经有记录，不能修改reference_to字段"
#					if modifier?.$set?.reference_to
#						if modifier.$set.reference_to.length == 1
#							modifier.$set.reference_to = modifier.$set.reference_to[0]

		"before.insert.server.object_fields":
			on: "server"
			when: "before.insert"
			todo: (userId, doc)->

#				if doc.reference_to?.length == 1
#					doc.reference_to = doc.reference_to[0]

				if isRepeatedName(doc)
					throw new Meteor.Error 500, "对象名称不能重复"
				if doc?.index and (doc?.type == 'textarea' or doc?.type == 'html')
					throw new Meteor.Error 500,'多行文本不支持建立索引'
		"before.remove.server.object_fields":
			on: "server"
			when: "before.remove"
			todo: (userId, doc)->
				if doc.name == "name"
					throw new Meteor.Error 500, "不能删除此纪录"


