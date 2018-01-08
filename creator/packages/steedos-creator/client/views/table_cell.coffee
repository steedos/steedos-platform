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

		reference_to = this.field?.reference_to

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
				if this.field.type == "datetime"
					val = moment(this.val).format('YYYY-MM-DD H:mm')
				else if this.field.type == "date"
					val = moment(this.val).format('YYYY-MM-DD')
			else if (this.val == null)
				val = ""

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
