JsonRoutes.add 'post', '/api/weixin/thirdparty/:appId/push', (req, res, next) ->
	console.log '===>/api/weixin/thirdparty/:appId/push'
	try
		body = ""
		req.on('data', (chunk)->
			body += chunk
		)
		req.on('end', Meteor.bindEnvironment((()->
				xml2js = Npm.require('xml2js')
				parser = new xml2js.Parser({ trim:true, explicitArray:false, explicitRoot:false })
				parser.parseString(body, (err, result) ->
					console.log result
					# TODO

				)
			), (err)->
				console.error err.stack
				console.log 'Failed to bind environment'
			)
		)


	catch e
		console.error e.stack


	res.end('success')