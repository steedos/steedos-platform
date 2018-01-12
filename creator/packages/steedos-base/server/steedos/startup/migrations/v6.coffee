Meteor.startup ->
	Migrations.add
		version: 6
		name: '财务系统升级'
		up: ->
			console.log 'version 6 up'
			console.time 'billing upgrade'
			try
				# 清空modules表
				db.modules.remove({})

				db.modules.insert({
					"_id": "workflow.standard",
					"name_en": "Workflow Standard",
					"name": "workflow.standard",
					"name_zh": "审批王标准版",
					"listprice": 1.0,
					"listprice_rmb": 2
				})

				db.modules.insert({
					"_id": "workflow.professional",
					"name_en": "Workflow Professional",
					"name": "workflow.professional",
					"name_zh": "审批王专业版扩展包",
					"listprice": 3.0,
					"listprice_rmb": 18
				})

				db.modules.insert({
					"_id": "workflow.enterprise",
					"name_en": "Workflow Enterprise",
					"name": "workflow.enterprise",
					"name_zh": "审批王企业版扩展包",
					"listprice": 6.0,
					"listprice_rmb": 40
				})


				start_date = new Date(moment(new Date).format("YYYY-MM-DD"))
				db.spaces.find({is_paid: true, user_limit: {$exists: false}, modules: {$exists: true}}).forEach (s)->
					try
						set_obj = {}
						user_count = db.space_users.find({space: s._id, user_accepted: true}).count()
						set_obj.user_limit = user_count
						balance = s.balance
						if balance > 0
							months = 0
							listprices = 0
							_.each s.modules, (pm)->
								module = db.modules.findOne({name: pm})
								if module and module.listprice
									listprices += module.listprice
							months = parseInt((balance/(listprices*user_count)).toFixed()) + 1
							end_date = new Date
							end_date.setMonth(end_date.getMonth()+months)
							end_date = new Date(moment(end_date).format("YYYY-MM-DD"))
							set_obj.start_date = start_date
							set_obj.end_date = end_date

						else if balance <= 0
							set_obj.start_date = start_date
							set_obj.end_date = new Date

						s.modules.push("workflow.standard")
						set_obj.modules = _.uniq(s.modules)
						db.spaces.direct.update({_id: s._id}, {$set: set_obj})
					catch e
						console.error "billing space upgrade"
						console.error(s._id)
						console.error(set_obj)
						console.error e.stack

			catch e
				console.error "billing upgrade"
				console.error e.stack

			console.timeEnd 'billing upgrade'
		down: ->
			console.log 'version 6 down'
