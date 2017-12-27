Creator.getObjectSchema = (obj) ->
	schema = {}
	_.each obj.fields, (field, field_name)->

		fs = {}
		fs.autoform = {}
		fs.autoform.multiple = field.multiple
		if field.type == "text"
			fs.type = String
		else if field.type == "[text]"
			fs.type = [String]
		else if field.type == "textarea"
			fs.type = String
			fs.autoform.type = "textarea"
			fs.autoform.rows = 3
		else if field.type == "date"
			fs.type = Date
			fs.autoform.type = "bootstrap-datetimepicker"
			fs.autoform.dateTimePickerOptions =
				format: "YYYY-MM-DD"
		else if field.type == "datetime"
			fs.type = Date
			fs.autoform.type = "bootstrap-datetimepicker"
			fs.autoform.dateTimePickerOptions =
				format: "YYYY-MM-DD HH:mm"
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

			if field.reference_to == "users"
				fs.autoform.type = "selectuser"
			else if field.reference_to == "organizations"
				fs.autoform.type = "selectorg"
			else
				fs.autoform.type = "steedosLookups"
				fs.autoform.optionsMethod = "creator.object_options"
				
				if typeof(field.reference_to) == "function"
					_reference_to = field.reference_to()

				if _.isArray(_reference_to)
					fs.type = Object
					fs.blackbox = true
					fs.autoform.objectSwitche = true

					schema[field_name + ".o"] = {
						type: String
					}

					schema[field_name + ".ids"] = {
						type: [String]
					}

				else
					_reference_to = [_reference_to]

				if Meteor.isClient

					fs.autoform.optionsMethodParams = ()->
						return {space: Session.get("spaceId")}

					fs.autoform.references = []

					_reference_to.forEach (_reference)->
						_object = Creator.Objects[_reference]
						fs.autoform.references.push {
							object: _reference
							label: _object?.label
							icon: _object?.icon
							link: ()->
								return "/app/#{Session.get('app_id')}/#{_reference}/view/"
						}
		else if field.type == "select"
			fs.type = String
			if field.multiple
				fs.type = [String]
			fs.autoform.type = "select"
			fs.autoform.options = field.options
			fs.autoform.firstOption = ""
		else if field.type == "currency"
			fs.type = Number
		else if field.type == "number"
			fs.type = Number
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

		if field.defaultValue
			fs.autoform.defaultValue = ()->
				return Creator.evaluateFormula(field.defaultValue)

		if field.readonly
			fs.autoform.readonly = true
			
		if field.disabled
			fs.autoform.disabled = true

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