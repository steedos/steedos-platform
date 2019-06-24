Meteor.startup ->
	if Meteor.settings.cron?.objectwebhooksqueue_interval
		ObjectWebhooksQueue.Configure
			sendInterval: Meteor.settings.cron.objectwebhooksqueue_interval
			sendBatchSize: 10
			keepWebhooks: false
