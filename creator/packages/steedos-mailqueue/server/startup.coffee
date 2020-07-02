Meteor.startup ->
	if Meteor.settings.cron?.mailqueue_interval
		MailQueue.Configure
			sendInterval: Meteor.settings.cron.mailqueue_interval
			sendBatchSize: 10
			keepMails: false
