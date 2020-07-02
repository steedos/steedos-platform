Template.headerRefresh.helpers
	isNode: ->
		return Steedos.isNode()


Template.headerRefresh.events
	'click .header-refresh' : (event) ->
		window.location.reload(true)