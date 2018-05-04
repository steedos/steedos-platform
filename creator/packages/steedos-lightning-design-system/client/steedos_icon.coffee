helpers = 
	getSvgUrl: (source, name)->
		foo = name.split(".")
		if foo.length > 1
			source = foo[0]
			if !source?.endsWith("-sprite")
				source += "-sprite"
			name = foo[1]
		url = "/packages/steedos_lightning-design-system/client/icons/#{source}/symbols.svg##{name}"
		return Steedos.absoluteUrl(url)

	formatName: (name) ->
		foo = name.split(".")
		if foo.length > 1
			name = foo[1]
		return name?.replace(/_/ig, "-")

	getSourceName: (source, name)->
		foo = name.split(".")
		if foo.length > 1
			return foo[0]
		if source?.endsWith("-sprite")
			return source.substr(0, source.length-7)
		return source


Template.steedos_icon.helpers helpers

Template.steedos_button_icon.helpers helpers