# Meteor.startup ->
# 	if Meteor.settings.cron and Meteor.settings.cron.billing
# 		schedule = require('node-schedule')
# 		# 定时执行同步
# 		rule = Meteor.settings.cron.billing

# 		schedule.scheduleJob rule, Meteor.bindEnvironment((->
# 			console.time 'billing'
# 			spaces = db.spaces.find({is_paid: true}, {fields: {_id: 1}})
# 			result = []
# 			spaces.forEach (s) ->
# 				try
# 					d = new Date
# 					accounting_month = moment(new Date(d.getFullYear(), d.getMonth(), 0).getTime()).format("YYYYMM")
# 					billingManager.caculate_by_accounting_month(accounting_month, s._id)
# 				catch err
# 					e = {}
# 					e._id = s._id
# 					e.name = s.name
# 					e.err = err
# 					result.push e
# 			if result.length > 0
# 				console.error result
# 				try
# 					Email = Package.email.Email
# 					Email.send
# 						to: 'support@steedos.com'
# 						from: Accounts.emailTemplates.from
# 						subject: 'billing settleup result'
# 						text: JSON.stringify('result': result)
# 				catch err
# 					console.error err
# 			console.timeEnd 'billing'
# 		), ->
# 			console.log 'Failed to bind environment'
# 		)