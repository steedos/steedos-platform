Meteor.methods
	records_qhd_sync_contracts: (spaceId, submit_date_start, submit_date_end)->
		if submit_date_start
			submit_date_start = new Date(submit_date_start)

		if submit_date_end
			submit_date_end = new Date(submit_date_end)

		if !spaceId
			throw new Meteor.Error("Missing spaceId")

		if Steedos.isSpaceAdmin(spaceId, this.userId)
			try
				data = RecordsQHD.instanceToContracts submit_date_start, submit_date_end, [spaceId]
				return data
			catch  e
				throw new Meteor.Error(e.message)
		else
			throw new Meteor.Error("No permission")