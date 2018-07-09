
JsonRoutes.add 'get', '/api/steedos/weixin/temp_token', (req, res, next) ->
	try
		userId = Steedos.getUserIdFromAuthToken(req, res);

		if !userId
			throw new Meteor.Error(500, "No permission")

		temp_token = WXMini.getTempToken(userId, Meteor.settings.weixin.invite.iv)

		JsonRoutes.sendResult res, {
			code: 200,
			data: {
				temp_token: temp_token
			}
		}
		return
	catch e
		console.error e.stack
		JsonRoutes.sendResult res, {
			code: e.error
			data: {errors: e.reason || e.message}
		}
