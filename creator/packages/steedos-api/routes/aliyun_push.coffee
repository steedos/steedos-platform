ALY = require('aliyun-sdk');
Xinge = require('xinge');
HwPush = require('huawei-push');
MiPush = require('xiaomi-push');

Aliyun_push = {};

Aliyun_push.sendMessage = (userTokens, notification, callback) ->
	if notification.title and notification.text
		if Push.debug
			console.log userTokens

		aliyunTokens = new Array
		xingeTokens = new Array
		huaweiTokens = new Array
		miTokens = new Array

		userTokens.forEach (userToken) ->
			arr = userToken.split(':')
			if arr[0] is "aliyun"
				aliyunTokens.push _.last(arr)
			else if arr[0] is "xinge"
				xingeTokens.push _.last(arr)
			else if arr[0] is "huawei"
				huaweiTokens.push _.last(arr)
			else if arr[0] is "mi"
				miTokens.push _.last(arr)

		if !_.isEmpty(aliyunTokens) and Meteor.settings.push?.aliyun
			if Push.debug
				console.log "aliyunTokens: #{aliyunTokens}"
			ALYPUSH = new (ALY.PUSH)(
				accessKeyId: Meteor.settings.push.aliyun.accessKeyId
				secretAccessKey: Meteor.settings.push.aliyun.secretAccessKey
				endpoint: Meteor.settings.push.aliyun.endpoint
				apiVersion: Meteor.settings.push.aliyun.apiVersion);

			data = 
				AppKey: Meteor.settings.push.aliyun.appKey
				Target: 'device'
				TargetValue: aliyunTokens.toString()
				Title: notification.title
				Summary: notification.text

			ALYPUSH.pushNoticeToAndroid data, callback

		if !_.isEmpty(xingeTokens) and Meteor.settings.push?.xinge
			if Push.debug
				console.log "xingeTokens: #{xingeTokens}"
			XingeApp = new Xinge.XingeApp(Meteor.settings.push.xinge.accessId, Meteor.settings.push.xinge.secretKey)
			
			androidMessage = new Xinge.AndroidMessage
			androidMessage.type = Xinge.MESSAGE_TYPE_NOTIFICATION
			androidMessage.title = notification.title
			androidMessage.content = notification.text
			androidMessage.style = new Xinge.Style
			androidMessage.action = new Xinge.ClickAction

			_.each xingeTokens, (t)->
				XingeApp.pushToSingleDevice t, androidMessage, callback

		if !_.isEmpty(huaweiTokens) and Meteor.settings.push?.huawei
			if Push.debug
				console.log "huaweiTokens: #{huaweiTokens}"
			# msg = new HwPush.Message
			# msg.title(notification.title).content(notification.text)
			# msg.extras(notification.payload)
			# notification = new HwPush.Notification(
			# 	appId: Meteor.settings.push.huawei.appId
			# 	appSecret: Meteor.settings.push.huawei.appSecret
			# )
			# _.each huaweiTokens, (t)->
			# 	notification.send t, msg, callback


			package_name = Meteor.settings.push.huawei.appPkgName
			tokenDataList = []
			_.each huaweiTokens, (t)->
				tokenDataList.push({'package_name': package_name, 'token': t})
			noti = {'android': {'title': notification.title, 'message': notification.text}, 'extras': notification.payload}

			HuaweiPush.config [{'package_name': package_name, 'client_id': Meteor.settings.push.huawei.appId, 'client_secret': Meteor.settings.push.huawei.appSecret}]
			
			HuaweiPush.sendMany noti, tokenDataList


		if !_.isEmpty(miTokens) and Meteor.settings.push?.mi
			if Push.debug
				console.log "miTokens: #{miTokens}"
			msg = new MiPush.Message
			msg.title(notification.title).description(notification.text)
			notification = new MiPush.Notification(
				production: Meteor.settings.push.mi.production
				appSecret: Meteor.settings.push.mi.appSecret
			)
			_.each miTokens, (regid)->
				notification.send regid, msg, callback


Meteor.startup ->
	
	if not Meteor.settings.cron?.push_interval
		return

	config = {
		debug: true
		keepNotifications: false
		sendInterval: Meteor.settings.cron.push_interval
		sendBatchSize: 10
		production: true
	}

	if !_.isEmpty(Meteor.settings.push?.apn)
		config.apn = {
			keyData: Meteor.settings.push.apn.keyData
			certData: Meteor.settings.push.apn.certData
		}
	if !_.isEmpty(Meteor.settings.push?.gcm)
		config.gcm = {
			projectNumber: Meteor.settings.push.gcm.projectNumber
			apiKey: Meteor.settings.push.gcm.apiKey
		}

	Push.Configure config
	
	if (Meteor.settings.push?.aliyun or Meteor.settings.push?.xinge or Meteor.settings.push?.huawei or Meteor.settings.push?.mi) and Push and typeof Push.sendGCM == 'function'
		
		Push.old_sendGCM = Push.sendGCM;

		Push.sendAliyun = (userTokens, notification) ->
			if Push.debug
				console.log 'sendAliyun', userTokens, notification

			if Match.test(notification.gcm, Object)
				notification = _.extend({}, notification, notification.gcm)
			# Make sure userTokens are an array of strings
			if userTokens == '' + userTokens
				userTokens = [ userTokens ]
			# Check if any tokens in there to send
			if !userTokens.length
				console.log 'sendGCM no push tokens found'
				return
			if Push.debug
				console.log 'sendAliyun', userTokens, notification

			Fiber = require('fibers')
	  
			userToken = if userTokens.length == 1 then userTokens[0] else null
			Aliyun_push.sendMessage userTokens, notification, (err, result) ->
				if err
					console.log 'ANDROID ERROR: result of sender: ' + result
				else
					if result == null
						console.log 'ANDROID: Result of sender is null'
					return

					if Push.debug
						console.log 'ANDROID: Result of sender: ' + JSON.stringify(result)

					if result.canonical_ids == 1 and userToken
						Fiber((self) ->
							try
								self.callback self.oldToken, self.newToken
							catch err
						).run
							oldToken: gcm: userToken
							newToken: gcm: "aliyun:" + result.results[0].registration_id
							callback: _replaceToken
					if result.failure != 0 and userToken
						Fiber((self) ->
							try
								self.callback self.token
							catch err
						).run
							token: gcm: userToken
							callback: _removeToken



		Push.sendGCM = (userTokens, notification) ->
			if Push.debug
				console.log 'sendGCM from aliyun-> Push.sendGCM'
			if Match.test(notification.gcm, Object)
				notification = _.extend({}, notification, notification.gcm)
			# Make sure userTokens are an array of strings
			if userTokens == '' + userTokens
				userTokens = [ userTokens ]
			# Check if any tokens in there to send
			if !userTokens.length
				console.log 'sendGCM no push tokens found'
				return
			if Push.debug
				console.log 'sendGCM', userTokens, notification

			aliyunTokens = userTokens.filter((item) ->
								item.indexOf('aliyun:') > -1 or item.indexOf('xinge:') > -1 or item.indexOf('huawei:') > -1 or item.indexOf('mi:') > -1
							)
			if Push.debug
				console.log 'aliyunTokens is ', aliyunTokens.toString()

			gcmTokens = userTokens.filter((item) ->
								item.indexOf("aliyun:") < 0 and item.indexOf("xinge:") < 0 and item.indexOf("huawei:") < 0 and item.indexOf("mi:") < 0
							)
			if Push.debug
				console.log 'gcmTokens is ' , gcmTokens.toString();

			Push.sendAliyun(aliyunTokens, notification);

			Push.old_sendGCM(gcmTokens, notification);

		Push.old_sendAPN = Push.sendAPN
		Push.sendAPN = (userToken, notification) ->
			if notification.title and notification.text
				noti = _.clone(notification)
				noti.text = noti.title + " " + noti.text
				noti.title = ""
				Push.old_sendAPN(userToken, noti)
			else
				Push.old_sendAPN(userToken, notification)
