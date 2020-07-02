TracesHandler.helpers =
	showSignImage: (handler, is_finished) ->
		if !is_finished
			return false
		spaceUserSign = ImageSign.helpers.spaceUserSign(handler);

		if spaceUserSign?.sign
			return true
		else
			return false