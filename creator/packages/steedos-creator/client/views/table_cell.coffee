# Variables
# - this.object_name
# - this.field_name
# - this.field
# - this.doc
# - this.id

Template.creator_table_cell.helpers
	cellData: ()->
		val = this.val
		if this.field.reference_to
			try
				val = (Creator.Collections[this.field.reference_to].findOne(this.val)?.name || "")
			catch e
				return

		if (val instanceof Date) 
			val =  moment(this.val).format('YYYY-MM-DD H:mm')
		else if (this.val == null)
			val =  ""

		return val

	cellHref: ()->

		if this.field.reference_to
			href = Creator.getObjectUrl(this.field.reference_to, this.val)

		else if this.field_name == "name"
			href = Creator.getObjectUrl(this.object_name, this._id)

		return href

	editable: ()->

		if this.field.reference_to or this.field.omit
			return false
		
		permission = Creator.getRecordPermissions(this.object_name, this.doc, Meteor.userId())
		if !permission.allowEdit
			return false

		return true