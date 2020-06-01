Template.standard_query_modal.onCreated ->
	this.modalValue = new ReactiveVar()
#	standard_query = Session.get("standard_query")
#	if standard_query and standard_query.object_name == Session.get("object_name")
#		standard_query.query = {}
#		Session.set "standard_query", standard_query
	#this.modalValue.set(Session.get("standard_query")?.query)

Template.standard_query_modal.onRendered ->
	this.$("input[type='number']").val("")

	# 设置dxOverlay的zIndex值，解决dxOverlay弹出窗口被modal窗口覆盖的问题
	# 比如弹出的时间、日期控件，popup控件等
	# 因modal的z-index值为2000，所以这里要比它大
	DevExpress.ui.dxOverlay.baseZIndex(2100)

Template.standard_query_modal.onDestroyed ->
	# 还原dxOverlay原来默认的zIndex值
	DevExpress.ui.dxOverlay.baseZIndex(1500)


Template.standard_query_modal.helpers
	isNotMobile: ()->
		return !Steedos.isMobile();

	value: ()->
		return Template.instance().modalValue?.get()

	object_name: ()->
		return Session.get("object_name");

	schema: ()->
		object_name = Session.get("object_name")
		object = Creator.getObject(object_name)
			
		new_schema = new SimpleSchema(Creator.getObjectSchema(object))
		obj_schema = new_schema._schema
		first_level_keys = new_schema._firstLevelSchemaKeys
		object_fields = object.fields
		searchable_fields = []
		canSearchFields = []
		clone = require('clone')
		_.each object_fields, (field, key)->
			if !field.hidden and !["grid", "image", "avatar"].includes(field.type)
				canSearchFields.push(key)
		schema = {}
		canSearchFields = _.intersection(first_level_keys, canSearchFields)
		_.each canSearchFields, (field)->
			schema[field] = obj_schema[field]
			delete schema[field].min
			delete schema[field].max
			if !(object_fields[field].searchable || object_fields[field].filterable)
				schema[field].autoform.group = t "standard_query_more"
			if object_fields[field].searchable || object_fields[field].filterable
				delete schema[field].autoform.group
			if ["lookup", "master_detail", "select", "checkbox"].includes(object_fields[field].type)
				schema[field].autoform.multiple = true
				schema[field].type = [String]
				if schema[field].autoform.create
					delete schema[field].autoform.create

				_field = object_fields[field]

				if _field.type == "select"
					schema[field].autoform.type = "steedosLookups"
					schema[field].autoform.showIcon = false

				if _field.type == 'lookup' || _field.type == 'master_detail'
					_reference_to = _field.reference_to
					if _.isFunction(_reference_to)
						_reference_to = _reference_to()
					if _.isArray(_reference_to)
						schema[field].type = Object
						schema[field].blackbox = true
					if !_.isEmpty(_reference_to)
						delete schema[field].optionsFunction

			if Creator.checkFieldTypeSupportBetweenQuery(object_fields[field].type)
				schema[field + "_endLine"] =  clone(obj_schema[field])
				obj_schema[field].autoform.is_range = true
				if schema[field + "_endLine"].defaultValue
					delete schema[field + "_endLine"].defaultValue
				if schema[field + "_endLine"].autoform
					schema[field + "_endLine"].autoform.readonly = false
					schema[field + "_endLine"].autoform.disabled = false
					schema[field + "_endLine"].autoform.omit = false
					schema[field + "_endLine"].autoform.is_range = false
					schema[field + "_endLine"].autoform.label = '至'
					delete schema[field + "_endLine"].autoform.defaultValue
					if object_fields[field].type == 'date'
						schema[field + "_endLine"].autoform.outFormat = 'yyyy-MM-ddT23:59:59.000Z';
						schema[field + "_endLine"].autoform.outFormat = 'yyyy-MM-ddT23:59:59.000Z';
						if schema[field + "_endLine"].autoform.afFieldInput?.dxDateBoxOptions
							# dx-date-box控件不支持outFormat，需要单独处理
							# 注意不可以用'yyyy-MM-ddT23:59:59Z'，因日期类型字段已经用timezoneId: "utc"处理了时区问题，后面带Z的话，会做时区转换
							schema[field + "_endLine"].autoform.afFieldInput.dxDateBoxOptions.dateSerializationFormat = 'yyyy-MM-ddT23:59:59';
			if ["boolean"].includes(object_fields[field].type)
				group = schema[field].autoform?.group
				schema[field].autoform = {group: group}
				schema[field].autoform.type = "boolean-select"
				schema[field].autoform.trueLabel = t("True")
				schema[field].autoform.falseLabel = t("False")

			if ["code", "textarea"].includes(object_fields[field].type)
				group = schema[field].autoform?.group
				schema[field].autoform = {group: group}
				schema[field].autoform.type = "text"
			
			if ["html"].includes(object_fields[field].type)
				schema[field].autoform.type = "textarea"
				delete schema[field].autoform.afFieldInput

			if schema[field].autoform
				schema[field].autoform.readonly = false
				schema[field].autoform.disabled = false
				schema[field].autoform.omit = false
				delete schema[field].autoform.defaultValue

			if schema[field].defaultValue
				delete schema[field].defaultValue

			obj = _.pick(obj_schema, field + ".$")
			_.extend(schema, obj)
		return new SimpleSchema(schema)

	fields: ()->
		object_name = Session.get("object_name")
		object = Creator.getObject(object_name)
		first_level_keys = Creator.getSchema(object_name)._firstLevelSchemaKeys

		object_fields = object.fields
		searchable_fields = []
		_.each object_fields, (field, key)->
			if !field.hidden and !["grid", "image", "avatar"].includes(field.type) and first_level_keys.includes(key)
				if ["date", "datetime", "currency", "number"].includes(field.type)
					searchable_fields.push([key, key + "_endLine"])
				else
					searchable_fields.push(key)

		return searchable_fields

	label: (name)->
		return AutoForm.getLabelForField(name)

	isArray: (val)->
		return _.isArray(val)

	isContainerVis: (fields)->
		# 为了时间控件能够正常显示
		if fields.length < 4
			return true

Template.standard_query_modal.events
	'click .btn-reset': (event, template)->
		template.modalValue.set()
		$("body").addClass("loading")
		AutoForm.resetForm("standardQueryForm")
		Meteor.setTimeout ->
			template.$("input[type='number']").val("")
			$("body").removeClass("loading")
		, 300
	
	'click .btn-confirm': (event, template)->
		query = AutoForm.getFormValues("standardQueryForm").insertDoc
		object_name = Session.get("object_name")
		Session.set("filter_items", FiltersTransform.queryToFilters({object_name: object_name, query: query, is_mini: false}))
#		$(".btn-filter-list").toggleClass("slds-is-selected", true)
#		$(".filter-list-container").toggleClass("slds-hide", false)
#		Session.set 'standard_query', {object_name: object_name, query: query, is_mini: false}
		Modal.hide(template)

		unless Steedos.isMobile()
			isFiltering = Creator.getIsFiltering()
			if isFiltering
				$(".filter-list-container").removeClass("slds-hide")

