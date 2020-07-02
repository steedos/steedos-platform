Meteor.startup ->
	if Meteor.settings.cron?.instancerecordqueue_interval
		InstanceRecordQueue.Configure
			sendInterval: Meteor.settings.cron.instancerecordqueue_interval
			sendBatchSize: 10
			keepDocs: true
