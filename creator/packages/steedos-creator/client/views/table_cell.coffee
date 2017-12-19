Template.creator_table_cell.helpers
	cellData: ()->

		if this.field.reference_to
			try
				this.val = (Creator.Collections[this.field.reference_to].findOne(this.val)?.name || "")
			catch e
				return

		if (this.val instanceof Date) 
			this.val =  moment(this.val).format('YYYY-MM-DD H:mm')
		else if (this.val == null)
			this.val =  ""

		return this.val

	cellHref: ()->
		if this.field.reference_to
			href = Creator.getObjectUrl(this.field.reference_to, this.val)

		else if this.field_name == "name"
			href = Creator.getObjectUrl(this.object_name, this._id)

		return href

	editable: ()->
		if this.field.reference_to or this.field.omit
			return false
		else
			return true