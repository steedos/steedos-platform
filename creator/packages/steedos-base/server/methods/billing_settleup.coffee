Meteor.methods
	billing_settleup: (accounting_month, space_id="")->
		check(accounting_month, String)
		check(space_id, String)

		user = db.users.findOne({_id: this.userId}, {fields: {is_cloudadmin: 1}})

		if not user.is_cloudadmin
			return

		console.time 'billing'
		spaces = []
		if space_id
			spaces = db.spaces.find({_id: space_id, is_paid: true}, {fields: {_id: 1}})
		else
			spaces = db.spaces.find({is_paid: true}, {fields: {_id: 1}})
		result = []
		spaces.forEach (s) ->
			try
				billingManager.caculate_by_accounting_month(accounting_month, s._id)
			catch err
				e = {}
				e._id = s._id
				e.name = s.name
				e.err = err
				result.push e
		if result.length > 0
			console.error result
			try
				Email = Package.email.Email
				Email.send
					to: 'support@steedos.com'
					from: Accounts.emailTemplates.from
					subject: 'billing settleup result'
					text: JSON.stringify('result': result)
			catch err
				console.error err
		console.timeEnd 'billing'