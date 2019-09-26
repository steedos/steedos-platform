###
*    *    *    *    *    *
┬    ┬    ┬    ┬    ┬    ┬
│    │    │    │    │    |
│    │    │    │    │    └ day of week (0 - 7) (0 or 7 is Sun)
│    │    │    │    └───── month (1 - 12)
│    │    │    └────────── day of month (1 - 31)
│    │    └─────────────── hour (0 - 23)
│    └──────────────────── minute (0 - 59)
└───────────────────────── second (0 - 59, OPTIONAL)
###
Meteor.startup ->
	if Meteor.settings.cron?.auto_finish_process_delegation
		schedule = require('node-schedule')
		# 定时执行同步
		rule = Meteor.settings.cron.auto_finish_process_delegation
		go_next = true
		schedule.scheduleJob rule, Meteor.bindEnvironment ()->
			try
				if !go_next
					return
				go_next = false
				console.time 'auto_finish_process_delegation'

				now = new Date

				# 将委托规则设置为不可用
				db.process_delegation_rules.update({ enabled: true, end_time: { $lte: now } }, { $set: { enabled: false } }, { multi :true })

				console.timeEnd 'auto_finish_process_delegation'
				go_next = true

			catch e
				console.error "AUTO AUTO_FINISH_PROCESS_DELEGATION ERROR: "
				console.error e.stack
				go_next = true

		, ()->
			console.log 'Failed to bind environment'
