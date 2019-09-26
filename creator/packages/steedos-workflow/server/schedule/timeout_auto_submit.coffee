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
	if Meteor.settings.cron?.timeout_auto_submit
		schedule = require('node-schedule')
		# 定时执行同步
		rule = Meteor.settings.cron.timeout_auto_submit
		go_next = true
		schedule.scheduleJob rule, Meteor.bindEnvironment ()->
			try
				if !go_next
					return
				go_next = false
				console.time 'timeout_auto_submit'

				uuflowManager.timeoutAutoSubmit()

				console.timeEnd 'timeout_auto_submit'
				go_next = true

			catch e
				console.error "AUTO TIMEOUT_AUTO_SUBMIT ERROR: "
				console.error e.stack
				go_next = true

		, ()->
			console.log 'Failed to bind environment'

Meteor.methods
	timeout_auto_submit: (ins_id)->
		uuflowManager.timeoutAutoSubmit(ins_id)
		return true


