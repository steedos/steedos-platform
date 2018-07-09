Meteor.startup ->
	if Meteor.settings.cron?.weixin_template_message_queue_interval
		WeixinTemplateMessageQueue.Configure
			sendInterval: Meteor.settings.cron.weixin_template_message_queue_interval
			sendBatchSize: 10
			keepDocs: false
