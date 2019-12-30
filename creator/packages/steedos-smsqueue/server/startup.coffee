Meteor.startup ->
	if Meteor.settings.sms?.webservice?.smsqueue_interval && (Meteor.settings.sms?.aliyun?.smsqueue_interval || Meteor.settings.sms?.qcloud?.smsqueue_interval)
		throw new Meteor.Error('sms.webservice cannot be configured with sms.aliyun or sms.qcloud');

	if Meteor.settings.sms?.aliyun?.smsqueue_interval
		SMSQueue.Configure
			sendInterval: Meteor.settings.sms.aliyun.smsqueue_interval
			sendBatchSize: 10
			keepSMS: true
			accessKeyId: Meteor.settings.sms.aliyun.accessKeyId
			accessKeySecret: Meteor.settings.sms.aliyun.accessKeySecret

	if Meteor.settings.sms?.webservice?.smsqueue_interval
		WebServiceSMSQueue.Configure
			sendInterval: Meteor.settings.sms.webservice.smsqueue_interval
			url: Meteor.settings.sms.webservice.url
			spaceToken: Meteor.settings.sms.webservice.space_token
			signname: Meteor.settings.sms.webservice.signname
			sendBatchSize: 10
			keepSMS: true



