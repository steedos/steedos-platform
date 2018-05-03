Meteor.methods
	init_statistics: (space, year, month) ->
		try
			userCostTime = new UserCostTime(space, year, month)
			userCostTime.startStat()
			return result
		catch e
			error = e
			return error
		