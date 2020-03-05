Template.filter_option.helpers Creator.helpers

Template.filter_option.helpers 
	schema:() -> 
		object_name = Template.instance().data?.object_name
		unless object_name
			object_name = Session.get("object_name")
		template = Template.instance()

		schema_key = template.schema_key.get()
		object_fields = Creator.getObject(object_name).fields

		filter_field_type = object_fields[schema_key]?.type
		filedOptions = Creator.getObjectFilterFieldOptions object_name
		schema=
			is_default:
				type: Boolean
				autoform:
					type: "steedos-boolean-checkbox"
			field:
				type: String
				label: "field"
				autoform:
					type: "select"
					defaultValue: ()->
						# 默认取字段待选项列表中第一项
						return if filedOptions?.length then filedOptions[0].value else "name"
					firstOption: ""
					options: ()->
						return filedOptions
			operation:
				type: String
				label: "operation"
				autoform:
					type: "select"
					defaultValue: ()->
						return Creator.getFieldDefaultOperation(filter_field_type)
					firstOption: ""
					options: ()->
						if object_fields[schema_key]
							return Creator.getFieldOperation(filter_field_type)
						else
							return Creator.getFieldOperation("text")
		
		filter_item_operation = template.filter_item_operation.get()
		isBetweenOperation = Creator.isBetweenFilterOperation(filter_item_operation)
		betweenBuiltinValues = Creator.getBetweenBuiltinValues(filter_field_type)
		currentBuiltinValue = betweenBuiltinValues?[filter_item_operation]
		clone = require('clone')
		if isBetweenOperation
			schema.start_value = 
				type: ->
					return template.schema_obj.get()?.type || String
				label: "start_value"
				autoform:
					type: "text"
			
			schema.end_value = clone schema.start_value
			schema.end_value.label = "end_value"
		else
			schema.value = 
				type: ->
					return template.schema_obj.get()?.type || String
				label: "value"
				autoform:
					type: "text"

		if schema_key
			new_schema = new SimpleSchema(Creator.getObjectSchema(Creator.getObject(object_name)))
			obj_schema = new_schema._schema
			if isBetweenOperation
				schema.start_value = clone obj_schema[schema_key]
				if schema.start_value.autoform
					schema.start_value.autoform.readonly = false
					schema.start_value.autoform.disabled = false
					schema.start_value.autoform.omit = false
					if currentBuiltinValue
						# 如果是内置的运算符，则起止值控件只读，且显示出默认值
						schema.start_value.autoform.readonly = true
						schema.start_value.autoform.disabled = true
						schema.start_value.autoform.value = currentBuiltinValue.values[0]

				schema.end_value = clone schema.start_value
				schema.end_value.label = "end_value"
				if schema.start_value.autoform
					if currentBuiltinValue
						# 如果是内置的运算符，则起止值控件只读，且显示出默认值
						schema.end_value.autoform.value = currentBuiltinValue.values[1]
			else
				schema.value = clone obj_schema[schema_key]
				if ["lookup", "master_detail", "select", "checkbox"].includes(filter_field_type)
					schema.value.autoform.multiple = true
					schema.value.type = [String]

					_field = object_fields[schema_key]

					if _field.type == "select"
						schema.value.autoform.type = "steedosLookups"
						schema.value.autoform.showIcon = false

					if _field.type == 'lookup' || _field.type == 'master_detail'
						_reference_to = _field.reference_to
						if _.isFunction(_reference_to)
							_reference_to = _reference_to()
						if _.isArray(_reference_to)
							schema.value.type = Object
							schema.value.blackbox = true
						if !_.isEmpty(_reference_to)
							delete schema.value.optionsFunction

				if schema.value.autoform
					schema.value.autoform.readonly = false
					schema.value.autoform.disabled = false
					schema.value.autoform.omit = false
					delete schema.value.autoform.defaultValue
				delete schema.value.defaultValue

				if ["widearea", "textarea", "code"].includes(schema.value.autoform?.type)
					schema.value.autoform.type = 'text'

			# 参考【查找时，按日期类型字段来查 有问题 #896】未能实现outFormat功能
			if filter_field_type == "date"
				if isBetweenOperation
					if schema.start_value.autoform
						schema.start_value.autoform.outFormat = 'yyyy-MM-dd';
					if schema.end_value.autoform
						# 老的日期控件bootstrap-datetimepicker需要outFormat
						schema.end_value.autoform.outFormat = 'yyyy-MM-ddT23:59:59.000Z';
						if schema.end_value.autoform.afFieldInput?.dxDateBoxOptions
							# dx-date-box控件不支持outFormat，需要单独处理
							# 注意不可以用'yyyy-MM-ddT23:59:59Z'，因日期类型字段已经用timezoneId: "utc"处理了时区问题，后面带Z的话，会做时区转换
							schema.end_value.autoform.afFieldInput.dxDateBoxOptions.dateSerializationFormat = 'yyyy-MM-ddT23:59:59';
				else
					if schema.value.autoform
						schema.value.autoform.outFormat = 'yyyy-MM-dd';
			
			else if ["boolean"].includes(filter_field_type)
				schema.value.autoform.type = "boolean-select"
				schema.value.autoform.trueLabel = t("True")
				schema.value.autoform.falseLabel = t("False")
		delete schema.value?.min
		delete schema.value?.max
		delete schema.start_value?.min
		delete schema.start_value?.max
		delete schema.end_value?.min
		delete schema.end_value?.max
		new SimpleSchema(schema)

	filter_item: ()->
		# filter_item = Template.instance().data?.filter_item
		filter_item = Template.instance().filter_item?.get()
		return filter_item

	is_show_form: ()->
		filter_item = Template.instance().filter_item?.get()
		schema_key = Template.instance().schema_key?.get()
		if !filter_item.field
			return true
		else
			if schema_key
				return true
			else
				return false

	show_form: ()->
		return Template.instance().show_form.get()

	object_label: ()->
		object_name = Template.instance().data?.object_name
		unless object_name
			object_name = Session.get("object_name")
		return Creator.getObject(object_name).label

	is_scope_selected: (scope)->
		if scope == Session.get("filter_scope")
			return "checked"

	isBetweenOperation: ()->
		filter_item_operation = Template.instance().filter_item_operation.get()
		return Creator.isBetweenFilterOperation(filter_item_operation)

Template.filter_option.events 
	'click .save-filter': (event, template) ->
		fields = Creator.getObject(template.data.object_name).fields
		filter = AutoForm.getFormValues("filter-option").insertDoc
		filter_field_type = fields[filter.field]?.type
		unless filter.operation
			toastr.error(t("creator_filter_operation_required_error"))
			return
		isBetweenOperation = Creator.isBetweenFilterOperation(filter.operation)
		if isBetweenOperation
			if filter.start_value > filter.end_value
				toastr.error(t("creator_filter_option_start_end_error"))
				return
			betweenBuiltinValues = Creator.getBetweenBuiltinValues(filter_field_type)
			currentBuiltinValue = betweenBuiltinValues?[filter.operation]
			if currentBuiltinValue
				filter.operation = "between"
				filter.value = currentBuiltinValue.key
			else
				filter.value = [filter.start_value, filter.end_value]
		index = this.index
		filter_items = Session.get("filter_items")
		filter_items[index] = filter

		Session.set("filter_items", filter_items)
		Meteor.defer ->
			Blaze.remove(template.view)

	'click .save-scope': (event, template) ->
		filter_scope = $("input[name='choose-filter-scope']:checked").val()
		Session.set("filter_scope", filter_scope)
		Meteor.defer ->
			Blaze.remove(template.view)

	'change select[name="field"]': (event, template) ->
		object_name = template.data?.object_name
		filter_item = template.filter_item.get()
		unless object_name
			object_name = Session.get("object_name")
		field = $(event.currentTarget).val()
		if field != filter_item?.field
			delete filter_item.operation
			filter_item.value = ""
			template.filter_item.set(filter_item)
		object_fields = Creator.getObject(object_name).fields
		filter_field_type = object_fields[field]?.type
		defaultOperation = Creator.getFieldDefaultOperation(filter_field_type)
		# 不能直接清除filter_item_operation，否则有默认值时，相关依赖的地方会出现异常
		if defaultOperation
			template.filter_item_operation.set(defaultOperation)
		else
			template.filter_item_operation.set(null)
		_schema = Creator.getSchema(object_name)._schema
		template.show_form.set(false)
		template.schema_key.set(field)
		template.schema_obj.set(_schema[field])
		Meteor.defer ->
			template.show_form.set(true)
	
	'change select[name="operation"]': (event, template) ->
		filter_item = template.filter_item.get()
		operation = $(event.currentTarget).val()
		if Creator.isBetweenFilterOperation(operation) || Creator.isBetweenFilterOperation(filter_item?.operation)
			template.filter_item_operation.set(operation)
			filter_item.operation = operation
			filter_item.value = ""
			template.filter_item.set(filter_item)

Template.filter_option.onCreated ->
	is_edit_scope = this.data.is_edit_scope
	unless is_edit_scope
		filter_item = this.data.filter_item
		object_name = this.data.object_name
		unless object_name
			object_name = Session.get("object_name")

		key = filter_item.field
		unless key
			# key不存在时取第一个key，否则界面中无法正常选中第一个字段及其操作符
			filedOptions = Creator.getObjectFilterFieldOptions object_name
			key = if filedOptions?.length then filedOptions[0].value else "name"
		
		key_obj = Creator.getSchema(object_name)._schema[key]
		object_fields = Creator.getObject(object_name).fields
		filter_field_type = object_fields[key]?.type

		unless filter_field_type
			filter_field_type = "text"

		operation = filter_item.operation
		unless operation
			# operation不存在时根据filter_field_type获取默认过滤器运算符
			operation = Creator.getFieldDefaultOperation(filter_field_type)
		
		if operation == "between"
			# 根据过滤器的过滤值，获取对应的内置运算符
			# 比如value为last_year，返回between_time_last_year
			builtinOperation = Creator.getBetweenBuiltinOperation(filter_field_type, filter_item.value)
			if builtinOperation
				operation = builtinOperation
				filter_item.operation = builtinOperation
		
		this.schema_key = new ReactiveVar(key)
		this.schema_obj = new ReactiveVar(key_obj)
		this.filter_item_operation = new ReactiveVar(operation)
		this.filter_item = new ReactiveVar(filter_item)

		this.show_form = new ReactiveVar(true)