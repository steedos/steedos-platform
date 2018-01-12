onResume = ()->
	setTimeout (->
		# TODO: do your thing!
		if Autoupdate and Autoupdate._retrySubscription
			Autoupdate._retrySubscription()
		return
	), 0
	return

document.addEventListener 'resume', onResume, false