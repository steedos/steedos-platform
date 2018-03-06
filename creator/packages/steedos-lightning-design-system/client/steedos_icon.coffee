Template.steedos_icon.onCreated ->

Template.steedos_icon.helpers
	getSvgUrl: (source, name)->
		url = "/packages/steedos_lightning-design-system/client/icons/#{source}/symbols.svg##{name}"
		return Steedos.absoluteUrl(url)
	
	formatName: (name) ->
		return name?.replace(/_/ig, "-")