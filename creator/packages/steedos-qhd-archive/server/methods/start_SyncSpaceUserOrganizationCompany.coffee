Meteor.methods
	syncSpaceUserOrganizationCompany: (spaceId, user_ids) ->
		try
			console.log "spaceId, user_ids========",spaceId, user_ids
			if spaceId and user_ids
				syncSpaceUserOrganizationCompany = new SyncSpaceUserOrganizationCompany(spaceId, user_ids)
				syncSpaceUserOrganizationCompany.DoSync()
				return result
			else
                return 'No spaceid or userids!'
		catch e
			error = e
			return error
		