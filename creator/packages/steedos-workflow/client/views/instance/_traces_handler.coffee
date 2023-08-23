TracesHandler.helpers =
	showSignImage: (handler, is_finished, judge, traceShowSignImage) ->
		if traceShowSignImage == false
			return false
		if !is_finished
			return false
		if ['returned', 'terminated', 'retrieved'].includes(judge)
			return false
		spaceUserSign = ImageSign.helpers.spaceUserSign(handler)

		if spaceUserSign?.sign
			return true
		else
			return false

	objectUrl: (object_name, record_id, app_id)->
		return Creator.getObjectUrl(object_name, record_id, app_id)