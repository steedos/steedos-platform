Creator.getObjectSchema = (obj) ->
	schema = {}

	fieldsArr = []

	_.each obj.fields , (field, field_name)->
		if !_.has(field, "name")
			field.name = field_name
		fieldsArr.push field

	_.each _.sortBy(fieldsArr, "sort_no"), (field)->

		field_name = field.name

		fs = {}
		if field.regEx
			fs.regEx = field.regEx
		fs.autoform = {}
		fs.autoform.multiple = field.multiple

		autoform_type = field.autoform?.type

		if field.type == "text" or field.type == "phone"
			fs.type = String
			if field.multiple
				fs.type = [String]
				fs.autoform.type = "tags"
		else if field.type == "[text]" or field.type == "[phone]"
			fs.type = [String]
			fs.autoform.type = "tags"
		else if field.type == "textarea"
			fs.type = String
			fs.autoform.type = "textarea"
			fs.autoform.rows = field.rows || 3
		else if field.type == "date"
			fs.type = Date
			if Meteor.isClient
				if Steedos.isMobile() || Steedos.isPad()
					fs.autoform.type = 'date'
				else
					# 这里用afFieldInput而不直接用autoform的原因是当字段被hidden的时候去执行dateTimePickerOptions参数会报错
					fs.autoform.afFieldInput =
						type: "bootstrap-datetimepicker"
						timezoneId: "utc"
						dateTimePickerOptions:
							format: "YYYY-MM-DD"
							locale: Session.get("TAPi18n::loaded_lang")

		else if field.type == "datetime"
			fs.type = Date
			if Meteor.isClient
				if Steedos.isMobile() || Steedos.isPad()
					fs.autoform.type = 'datetime-local'
				else
					# 这里用afFieldInput而不直接用autoform的原因是当字段被hidden的时候去执行dateTimePickerOptions参数会报错
					fs.autoform.afFieldInput =
						type: "bootstrap-datetimepicker"
						dateTimePickerOptions:
							format: "YYYY-MM-DD HH:mm"
							locale: Session.get("TAPi18n::loaded_lang")
		else if field.type == "[Object]"
			fs.type = [Object]
		else if field.type == "html"
			fs.type = String
			fs.autoform.afFieldInput =
				type: "summernote"
				class: 'editor'
				settings:
					height: 200
					dialogsInBody: true
					toolbar:  [
						['font1', ['style']],
						['font2', ['bold', 'underline', 'italic', 'clear']],
						['font3', ['fontname']],
						['color', ['color']],
						['para', ['ul', 'ol', 'paragraph']],
						['table', ['table']],
						['insert', ['link', 'picture']],
						['view', ['codeview']]
					]
					fontNames: ['Arial', 'Comic Sans MS', 'Courier New', 'Helvetica', 'Impact', '宋体','黑体','微软雅黑','仿宋','楷体','隶书','幼圆']

		else if field.type == "lookup" or field.type == "master_detail"
			fs.type = String

			if field.multiple
				fs.type = [String]

			fs.autoform.filters = field.filters

			fs.autoform.dependOn = field.depend_on

			fs.filtersFunction = Creator.evaluateFilters

			if field.optionsFunction
				fs.optionsFunction = field.optionsFunction

			if field.reference_to

				if _.isBoolean(field.create)
					fs.autoform.create = field.create
				if Meteor.isClient
					if field.createFunction && _.isFunction(field.createFunction)
						fs.createFunction = field.createFunction
					else
						if _.isString(field.reference_to)
							_ref_obj = Creator.Objects[field.reference_to]
							if _ref_obj?.permissions?.allowCreate
								fs.autoform.create = true
								fs.createFunction = (lookup_field)->
									Modal.show("CreatorObjectModal", {
										collection: "Creator.Collections.#{field.reference_to}",
										formId: "new#{field.reference_to}",
										object_name: "#{field.reference_to}",
										operation: "insert",
										onSuccess: (operation, result)->
											object = Creator.getObject(result.object_name)
											if result.object_name == "objects"
												lookup_field.addItems([{label: result.value.label, value: result.value.name, icon: result.value.icon}], result.value.name)
											else
												lookup_field.addItems([{label: result.value[object.NAME_FIELD_KEY] || result.value.label || result.value.name, value: result._id}], result._id)
									})
							else
								fs.autoform.create = false

				if field.reference_sort
					fs.autoform.optionsSort = field.reference_sort

				if field.reference_to == "users"
					fs.autoform.type = "selectuser"
				else if field.reference_to == "organizations"
					fs.autoform.type = "selectorg"
				else
					fs.autoform.type = "steedosLookups"
					fs.autoform.optionsMethod = field.optionsMethod || "creator.object_options"

					if typeof(field.reference_to) == "function"
						_reference_to = field.reference_to()
					else
						_reference_to = field.reference_to

					if _.isArray(_reference_to)
						fs.type = Object
						fs.blackbox = true
						fs.autoform.objectSwitche = true

						schema[field_name + ".o"] = {
							type: String
							autoform: {omit: true}
						}

						schema[field_name + ".ids"] = {
							type: [String]
							autoform: {omit: true}
						}

					else
						_reference_to = [_reference_to]

					if Meteor.isClient

						fs.autoform.optionsMethodParams = ()->
							return {space: Session.get("spaceId")}

						fs.autoform.references = []

						_reference_to.forEach (_reference)->
							_object = Creator.Objects[_reference]

							if _object
								fs.autoform.references.push {
									object: _reference
									label: _object?.label
									icon: _object?.icon
									link: ()->
										return "/app/#{Session.get('app_id')}/#{_reference}/view/"
								}
							else
								throw new Meteor.Error("Creator.getObjectSchema", "#{obj.name}.#{field_name} reference_to #{_reference} Can not find.")
			else
				fs.autoform.type = "steedosLookups"
				fs.autoform.defaultIcon = field.defaultIcon

		else if field.type == "select"
			fs.type = String
			if field.multiple
				fs.type = [String]
				fs.autoform.type = "steedosLookups"
				fs.autoform.showIcon = false
				fs.autoform.options = field.options
			else
				fs.autoform.type = "select"
				fs.autoform.options = field.options
				fs.autoform.firstOption = ""
		else if field.type == "currency"
			fs.type = Number
		else if field.type == "number"
			fs.type = Number
			fs.autoform.type = "steedosNumber"
			fs.autoform.precision = field.precision || 18
			if field?.scale
				fs.autoform.scale = field.scale
				fs.decimal = true
		else if field.type == "boolean"
			fs.type = Boolean
			fs.autoform.type = "boolean-checkbox"
		else if field.type == "reference"
			fs.type = String
		else if field.type == "checkbox"
			fs.type = [String]
			fs.autoform.type = "select-checkbox"
			fs.autoform.options = field.options
		else if field.type == "file" and field.collection
			if field.multiple
				fs.type = [String]
				schema[field_name + ".$"] =
					autoform:
						type: 'fileUpload'
						collection: field.collection
			else
				fs.type = String
				fs.autoform.type = 'fileUpload'
				fs.autoform.collection = field.collection
		else if field.type == "filesize"
			fs.type = Number
			fs.autoform.type = 'filesize'
		else if field.type == "Object"
			fs.type = Object
		else if field.type == "grid"
			fs.type = Array
			fs.autoform.editable = true
			fs.autoform.type = "table"

			schema[field_name + ".$"] =
				type: Object
		else if field.type == "image"
			if field.multiple
				fs.type = [String]
				schema[field_name + ".$"] =
					autoform:
						type: 'fileUpload'
						collection: 'images'
						accept: 'image/*'
			else
				fs.type = String
				fs.autoform.type = 'fileUpload'
				fs.autoform.collection = 'images'
				fs.autoform.accept = 'image/*'
		else if field.type == "audio"
			if field.multiple
				fs.type = [String]
				schema[field_name + ".$"] =
					autoform:
						type: 'fileUpload'
						collection: 'audios'
						accept: 'audio/*'
			else
				fs.type = String
				fs.autoform.type = 'fileUpload'
				fs.autoform.collection = 'audios'
				fs.autoform.accept = 'audio/*'
		else if field.type == "video"
			if field.multiple
				fs.type = [String]
				schema[field_name + ".$"] =
					autoform:
						type: 'fileUpload'
						collection: 'videos'
						accept: 'video/*'
			else
				fs.type = String
				fs.autoform.type = 'fileUpload'
				fs.autoform.collection = 'videos'
				fs.autoform.accept = 'video/*'
		else if field.type == "location"
			fs.type = Object
			fs.autoform.type = "location"
			fs.autoform.system = field.system || "wgs84"
			fs.blackbox = true
		else
			fs.type = field.type

		if field.label
			fs.label = field.label

		if field.allowedValues
			fs.allowedValues = field.allowedValues

		if !field.required
			fs.optional = true

		if field.omit
			fs.autoform.omit = true

		if field.group
			fs.autoform.group = field.group

		if field.is_wide
			fs.autoform.is_wide = true

		if field.hidden
			fs.autoform.type = "hidden"

		if autoform_type
			fs.autoform.type = autoform_type

		if field.defaultValue
			if Meteor.isClient and Creator.Formular.checkFormula(field.defaultValue)
				fs.autoform.defaultValue = ()->
					return Creator.Formular.run(field.defaultValue)
			else
				fs.autoform.defaultValue = field.defaultValue

		if field.readonly
			fs.autoform.readonly = true

		if field.disabled
			fs.autoform.disabled = true

		if field.inlineHelpText
			fs.autoform.inlineHelpText = field.inlineHelpText

		if field.blackbox
			fs.blackbox = true

		if field.index
			fs.index = field.index
		else if field.sortable
			fs.index = true

		schema[field_name] = fs

	return schema


Creator.getFieldDisplayValue = (object_name, field_name, field_value)->
	html = field_value
	object = Creator.getObject(object_name)
	if !object
		return ""
	field = object.fields(field_name)
	if !field
		return ""

	if field.type == "datetime"
		html = moment(this.val).format('YYYY-MM-DD H:mm')
	else if field.type == "date"
		html = moment(this.val).format('YYYY-MM-DD')

	return html


Creator.getFieldOperation = (field_type) ->
	# 日期类型: date, datetime  支持操作符: "=", "<>", "<", ">", "<=", ">="
	# 文本类型: text, textarea, html  支持操作符: "=", "<>", "contains", "notcontains", "startswith"
	# 选择类型: lookup, master_detail, select 支持操作符: "=", "<>"
	# 数值类型: currency, number  支持操作符: "=", "<>", "<", ">", "<=", ">="
	# 布尔类型: boolean  支持操作符: "=", "<>"
	# 数组类型: checkbox, [text]  支持操作符: "=", "<>"

	optionals = {
		equal: {label: t("creator_filter_operation_equal"), value: "="},
		unequal: {label: t("creator_filter_operation_unequal"), value: "<>"},
		less_than: {label: t("creator_filter_operation_less_than"), value: "<"},
		greater_than: {label: t("creator_filter_operation_greater_than"), value: ">"},
		less_or_equal: {label: t("creator_filter_operation_less_or_equal"), value: "<="},
		greater_or_equal: {label: t("creator_filter_operation_greater_or_equal"), value: ">="},
		contains: {label: t("creator_filter_operation_contains"), value: "contains"},
		not_contain: {label: t("creator_filter_operation_does_not_contain"), value: "notcontains"},
		starts_with: {label: t("creator_filter_operation_starts_with"), value: "startswith"},
	}

	if field_type == undefined
		return _.values(optionals)

	operations = []

	if field_type == "date" or field_type == "datetime"
		operations.push(optionals.equal, optionals.unequal, optionals.less_than, optionals.greater_than, optionals.less_or_equal, optionals.greater_or_equal)
	else if field_type == "text" or field_type == "textarea" or field_type == "html"
		operations.push(optionals.equal, optionals.unequal, optionals.contains, optionals.not_contain, optionals.starts_with)
	else if field_type == "lookup" or field_type == "master_detail" or field_type == "select"
		operations.push(optionals.equal, optionals.unequal)
	else if field_type == "currency" or field_type == "number"
		operations.push(optionals.equal, optionals.unequal, optionals.less_than, optionals.greater_than, optionals.less_or_equal, optionals.greater_or_equal)
	else if field_type == "boolean"
		operations.push(optionals.equal, optionals.unequal)
	else if field_type == "checkbox"
		operations.push(optionals.equal, optionals.unequal)
	else if field_type == "[text]"
		operations.push(optionals.equal, optionals.unequal)
	else
		operations.push(optionals.equal, optionals.unequal)

	return operations

###
    先按照有排序号的小的在前，大的在后
    再将没有排序号的显示在
###
Creator.getObjectFieldsName = (object_name)->
	fields = Creator.getObject(object_name)?.fields
	fieldsArr = []

	_.each fields, (field)->
		fieldsArr.push {name: field.name, sort_no: field.sort_no}

	fieldsName = []
	_.each _.sortBy(fieldsArr, "sort_no"), (field)->
		fieldsName.push(field.name)
	return fieldsName
