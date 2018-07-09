Meteor.startup ->
	if Meteor.settings.cron and Meteor.settings.cron.weixin_access_token
		schedule = Npm.require('node-schedule')
		# 定时执行同步
		rule = Meteor.settings.cron.weixin_access_token

		schedule.scheduleJob rule, Meteor.bindEnvironment((->
			oneHourAgo = new Date(new Date().getTime() - 3600*1000)

			apps = Creator.getCollection("vip_apps").find({ modified: { $lte: oneHourAgo } }, { limit: 100 }).fetch()

			apps.forEach (app) ->
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

		), (e) ->
			console.log 'Failed to bind environment'
			console.log e.stack
		)