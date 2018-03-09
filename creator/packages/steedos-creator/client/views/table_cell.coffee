# Variables
# - this.object_name
# - this.field_name
# - this.field
# - this.doc
# - this.id

formatFileSize = (filesize)->
	rev = filesize / 1024.00
	unit = 'KB'

	if rev > 1024.00
		rev = rev / 1024.00
		unit = 'MB'


	if rev > 1024.00
		rev = rev / 1024.00
		unit = 'GB'

	return rev.toFixed(2) + unit

Template.creator_table_cell.helpers Creator.helpers

Template.creator_table_cell.helpers
	cellData: ()->
		data = []

		val = this.val

		this_object = Creator.getObject(this.object_name)

		this_name_field_key = this_object.NAME_FIELD_KEY

		_field = this.field

		if !_field
			return

		reference_to = this.field?.reference_to

		if _.isFunction(reference_to)
			reference_to = reference_to()

		if (_field.type == "lookup" || _field.type == "master_detail") && reference_to && !_.isEmpty(val)

			if _.isFunction(_field.optionsFunction)
					_values = this.doc || {}
					_val = val
					if _val
						if !_.isArray(_val)
							_val = [_val]
						selectedOptions = _.filter _field.optionsFunction(_values), (_o)->
							return _val.indexOf(_o.value) > -1
						if selectedOptions
							val = selectedOptions.getProperty("label")

					data.push {value: val, id: this._id}

			else

				if this.agreement == "odata"
					if !_.isArray(val)
						val = if val then [val] else []
					
					_.each val, (v)->
						reference_to = v["reference_to.o"] || reference_to
						reference_to_object_name_field_key = Creator.getObject(reference_to).NAME_FIELD_KEY
						href = Creator.getObjectUrl(reference_to, v._id)
						data.push {reference_to: reference_to, rid: v._id, value: v[reference_to_object_name_field_key], href: href, id: this._id}
					
				else
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
							data.push {reference_to: reference_to, rid: v._id, value: v[reference_to_object_name_field_key], href: href, id: this._id}
					catch e
						console.error(reference_to, e)
						return
		else
			if (val instanceof Date)
				if this.agreement == "odata"
					if _field.type == "datetime"
						utcOffset = moment().utcOffset() / 60
						val = moment(this.val).add(utcOffset, "hours").format('YYYY-MM-DD H:mm')
					else if _field.type == "date"
						val = moment(this.val).add(utcOffset, "hours").format('YYYY-MM-DD')
				else
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
					_values = this.doc || {}
					_val = val
					if _val
						if !_.isArray(_val)
							_val = [_val]
						selectedOptions = _.filter _field.optionsFunction(_values), (_o)->
							return _val.indexOf(_o.value) > -1
						if selectedOptions
							val = selectedOptions.getProperty("label")
			else if _field.type == "filesize"
				val = formatFileSize(val)
			else if _field.type == "number" && val
				val = Number(val).toFixed(_field.scale)

			if this.parent_view != 'record_details' && this.field_name == this_name_field_key
				href = Creator.getObjectUrl(this.object_name, this._id)

			data.push({value: val, href: href, id: this._id})

		return data;

	editable: ()->
		if !this.field
			return false

		if this.field.omit or this.field.readonly
			return false

		if this.field.type == "filesize"
			return false

		permission = Creator.getRecordPermissions(this.object_name, this.doc, Meteor.userId())
		if !permission.allowEdit
			return false

		return true
