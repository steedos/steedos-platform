Meteor.methods
	start_exportxml: (spaces, record_ids) ->
		try
			console.log "space, record_ids========",spaces, record_ids
			if spaces and record_ids
				exportToXML = new ExportToXML(spaces, record_ids)
				exportToXML.DoExport()
				return result
		catch e
			error = e
			return error
		