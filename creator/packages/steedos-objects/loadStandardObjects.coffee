try
	steedosCore = require('@steedos/core')
	if Meteor.isDevelopment
		Meteor.startup ->
			try
				steedosCore.init()
			catch ex
				console.log(ex)
catch e
	console.log(e)