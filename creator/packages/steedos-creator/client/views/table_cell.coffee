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
		reference_to = this.field.reference_to

		if reference_to

			if !_.isArray(this.val)
				val = [val]
			try
				values = Creator.Collections[reference_to].find({_id: {$in: val}}, {fields: {name: 1, _id: 1}, sort: {name: -1}})
				values.forEach (v)->
					href = Creator.getObjectUrl(reference_to, v._id)
					data.push {reference_to: reference_to, rid: v._id, value: v.name, href: href}
			catch e
				console.error(e)
				return
		else
			if (val instanceof Date)
				if this.field.type == "datetime"
					val = moment(this.val).format('YYYY-MM-DD H:mm')
				else if this.field.type == "date"
					val = moment(this.val).format('YYYY-MM-DD')
			else if (this.val == null)
				val = ""

			if this.field_name == "name" || this.field.is_name
				href = Creator.getObjectUrl(this.object_name, this._id)

			data.push({value: val, href: href})

		return data;

	editable: ()->
		if this.field.reference_to or this.field.omit
			return false

		permission = Creator.getRecordPermissions(this.object_name, this.doc, Meteor.userId())
		if !permission.allowEdit
			return false

		return true
