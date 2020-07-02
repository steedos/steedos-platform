Meteor.startup ->
	if Steedos.isMobile()
		return
	setInterval ->
		$('[data-toggle="tooltip"]').tooltip()
	,2000