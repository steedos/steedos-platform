TracesHandler.helpers =
	showSignImage: (handler) ->
		spaceUserSign = ImageSign.helpers.spaceUserSign(handler);

		if spaceUserSign?.sign
			return true
		else
			return false