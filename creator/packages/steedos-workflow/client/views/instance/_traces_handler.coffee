TracesHandler.helpers =
	showSignImage: (handler, is_finished, judge) ->
		if !is_finished
			return false
		if ['returned', 'terminated', 'retrieved'].includes(judge)
			return false
		spaceUserSign = ImageSign.helpers.spaceUserSign(handler)

		if spaceUserSign?.sign
			return true
		else
			return false