Template.registerHelper 'getSVG', (source, name)->
	return "/assets/icons/#{source}/svg/symbols.svg##{name}"