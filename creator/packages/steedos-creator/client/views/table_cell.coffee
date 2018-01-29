# Variables
# - this.object_name
# - this.field_name
# - this.field
# - this.doc
# - this.id

Template.creator_table_cell.helpers
	cellData: ()->
		data = []

		val = this.val

		this_object = Creator.getObject(this.object_name)

		this_name_field_key = this_object.NAME_FIELD_KEY

		_field = this.field

		reference_to = this.field?.reference_to

		if _.isFunction(reference_to)
			reference_to = reference_to()

		if reference_to && !_.isEmpty(val)

			if _.isArray(reference_to) && _.isObject(val)
				reference_to = val.o
				val = val.ids

			if !_.isArray(val)
				val = if val then [val] else []
			try

				reference_to_object = Creator.getObject(reference_to)

				reference_to_object_name_field_key = reference_to_object.NAME_FIELD_KEY

				reference_to_fields = {_id: 1}
				reference_to_fields[reference_to_object_name_field_key] = 1

				reference_to_sort = {}
				reference_to_sort[reference_to_object_name_field_key] = -1


				values = Creator.Collections[reference_to].find({_id: {$in: val}}, {fields: reference_to_fields, sort: reference_to_sort})
				values.forEach (v)->
					href = Creator.getObjectUrl(reference_to, v._id)
					data.push {reference_to: reference_to, rid: v._id, value: v[reference_to_object_name_field_key], href: href}
			catch e
				console.error(reference_to, e)
				return
		else
			if (val instanceof Date)
				if _field.type == "datetime"
					val = moment(this.val).format('YYYY-MM-DD H:mm')
				else if _field.type == "date"
					val = moment(this.val).format('YYYY-MM-DD')
			else if (this.val == null)
				val = ""
			else if _field.type == "boolean"
				if this.val
					val = "是"
				else
					val = "否"
			else if _field.type == "select"
				val = _.findWhere(_field.options, {value: this.val})?.label
				unless val
					val = this.val
			else if _field.type == "lookup"
				if _.isFunction(_field.optionsFunction)
					_values = Creator.getObjectRecord()
					_val = val
					if _val && !_.isArray(_val)
						_val = [_val]

					selectedOptions = _.filter _field.optionsFunction(_values), (_o)->
						return _val.indexOf(_o.value) > -1
					if selectedOptions
						val = selectedOptions.getProperty("label")

			if this.field_name == this_name_field_key
				href = Creator.getObjectUrl(this.object_name, this._id)

			data.push({value: val, href: href})

		return data;

	editable: ()->
		if !this.field
			return false

		if this.field.omit or this.field.readonly
			return false

		permission = Creator.getRecordPermissions(this.object_name, this.doc, Meteor.userId())
		if !permission.allowEdit
			return false

		return true
