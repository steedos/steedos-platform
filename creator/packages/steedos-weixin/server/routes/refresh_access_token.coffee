
JsonRoutes.add 'get', '/api/steedos/weixin/refresh/token/:appId', (req, res, next) ->
	try
		userId = Steedos.getUserIdFromAuthToken(req, res)

		if !userId
			throw new Meteor.Error(500, "No permission")

		appId = req.params.appId

		app = Creator.getCollection("vip_apps").findOne(appId)

		if not app
			throw new Meteor.Error(500, "App not found")

		result = {}

		newToken = WXMini.getNewAccessTokenSync(app._id, app.secret)
		if newToken
			Creator.getCollection("vip_apps").update(app._id, { $set: { access_token: newToken } })
		else
			try
				Email = Package.email.Email
				if Email and process.env.MAIL_URL
					Email.send
						to: 'support@steedos.com'
						from: 'Steedos <noreply@message.steedos.com>'
						subject: 'weixin_access_token update failed'
						text: JSON.stringify({'appId': app._id})
			catch err
				console.error err

		JsonRoutes.sendResult res, {
			code: 200,
			data: result
		}
		return
	catch e
		console.error e.stack
		JsonRoutes.sendResult res, {
			code: e.error
			data: {errors: e.reason || e.message}
		}