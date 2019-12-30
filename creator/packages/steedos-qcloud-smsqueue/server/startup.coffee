Meteor.startup ->
	if Meteor.settings.sms?.qcloud?.smsqueue_interval
		QcloudSMSQueue.Configure
			sendInterval: Meteor.settings.sms.qcloud.smsqueue_interval
			sendBatchSize: 10
			keepSMS: true
			sdkappid: Meteor.settings.sms.qcloud.sdkappid
			appkey: Meteor.settings.sms.qcloud.appkey
			signname: Meteor.settings.sms.qcloud.signname
