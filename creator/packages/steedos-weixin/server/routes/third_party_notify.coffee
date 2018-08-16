WXBizMsgCrypt = Npm.require('wechat-crypto')

JsonRoutes.add 'post', '/api/weixin/thirdparty/notify', (req, res, next) ->
	console.log '====>/api/weixin/thirdparty/notify'
	try
		# console.log 'req.query: ', req.query
		query = req.query
		body = ""
		req.on('data', (chunk)->
			body += chunk
		)
		req.on('end', Meteor.bindEnvironment((()->
				xml2js = Npm.require('xml2js')
				parser = new xml2js.Parser({ trim:true, explicitArray:false, explicitRoot:false })
				parser.parseString(body, (err, result) ->
					# console.log result
					token = Meteor.settings.weixin?.thirdPartyPlatform?.token
					encodingAESKey = Meteor.settings.weixin?.thirdPartyPlatform?.encodingAESKey
					appId = Meteor.settings.weixin?.thirdPartyPlatform?.appId
					crypto = new WXBizMsgCrypt(token, encodingAESKey, appId)
					decryptContent = crypto.decrypt(result.Encrypt)
					# console.log decryptContent
					parser.parseString decryptContent.message, (err, content) ->
						# console.log content
						appId = content.AppId
						componentVerifyTicket = content.ComponentVerifyTicket
						Creator.getCollection('weixin_third_party_platforms').update(appId, { $set: { component_verify_ticket: componentVerifyTicket } })

				)
			), (err)->
				console.error err.stack
				console.log 'Failed to bind environment'
			)
		)


	catch e
		console.error e.stack


	res.end('success')