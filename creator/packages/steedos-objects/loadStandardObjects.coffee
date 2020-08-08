try
	if Meteor.isDevelopment
		steedosCore = require('@steedos/core')
		objectql = require('@steedos/objectql')
		Meteor.startup ->
			try
				objectql.wrapAsync(steedosCore.init)
			catch ex
				console.error("error:",ex)
catch e
	console.error("error:",e)