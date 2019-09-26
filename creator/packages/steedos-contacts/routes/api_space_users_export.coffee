Meteor.startup ->
	WebApp.connectHandlers.use "/api/contacts/export/space_users", (req, res, next)->
		try
			current_user_info = uuflowManager.check_authorization(req)

			query = req.query
			space_id = query.space_id
			org_id = query.org_id
			user_id = query['X-User-Id']
			org = db.organizations.findOne({_id:org_id},{fields:{fullname:1}})
			users_to_xls = new Array
			now = new Date 
			if Steedos.isSpaceAdmin(space_id,user_id)
				users_to_xls = db.space_users.find({
					space: space_id
				}, {
					sort: {name: 1}
				}).fetch()
			else
				org_ids = []
				org_objs = db.organizations.find({_id:org_id,space:space_id},{fields:{_id:1,children:1}}).fetch()
				org_ids = _.pluck(org_objs,'_id')
				_.each org_objs,(org_obj)->
					org_ids = _.union(org_ids,org_obj?.children)
				_.uniq(org_ids)
				users_to_xls = db.space_users.find({space:space_id,organizations:{$in:org_ids}},{sort: {sort_no: -1,name:1}}).fetch()
			ejs = require('ejs')
			str = Assets.getText('server/ejs/export_space_users.ejs')
			
			# 检测是否有语法错误
			ejsLint = require('ejs-lint')
			error_obj = ejsLint.lint(str, {})
			if error_obj
				console.error "===/api/contacts/export/space_users:"
				console.error error_obj

			template = ejs.compile(str)

			lang = 'en'
			if current_user_info.locale is 'zh-cn'
				lang = 'zh-CN'

			orgName = if org then org.fullname else org_id
			fields = [{
					type: 'String',
					name:'name',
					width: 60,
					title: TAPi18n.__('space_users_name',{},lang)
				},{
					type: 'String',
					name:'mobile',
					width: 100,
					title: TAPi18n.__('space_users_mobile',{},lang)
				},{
					type: 'String',
					name:'work_phone',
					width: 100,
					title: TAPi18n.__('space_users_work_phone',{},lang)
				},{
					type: 'String',
					name:'email',
					width: 100,
					title: TAPi18n.__('space_users_email',{},lang)
				},{
					type: 'String',
					name:'company',
					width: 100,
					title: TAPi18n.__('space_users_company',{},lang)
				},{
					type: 'String',
					name:'position',
					width: 100,
					title: TAPi18n.__('space_users_position',{},lang)
				},{
					type: 'String',
					name:'organizations',
					width: 600,
					title: TAPi18n.__('space_users_organizations',{},lang),
					transform: (value)->
						orgNames = db.organizations.find({_id: {$in: value}},{fields: {fullname: 1}}).map((item,index)->
							return item.fullname
						)
						return orgNames.join(",")
				},{
					type: 'String',
					name:'manager',
					width: 60,
					title: TAPi18n.__('space_users_manager',{},lang)
					transform: (value)->
						user = db.users.findOne({_id: value},{fields: {name: 1}})
						return user?.name
				},{
					type: 'String',
					name:'user',
					width: 60,
					title: TAPi18n.__('users_username',{},lang)
					transform: (value)->
						user = db.users.findOne({_id: value},{fields: {username: 1}})
						return user?.username
				},{
					type: 'Number',
					name:'sort_no',
					width: 35,
					title: TAPi18n.__('space_users_sort_no',{},lang)
				},{
					type: 'String',
					name:'user_accepted',
					width: 35,
					title: TAPi18n.__('space_users_user_accepted',{},lang)
					transform: (value)->
						return if value then TAPi18n.__('space_users_user_accepted_yes',{},lang) else TAPi18n.__('space_users_user_accepted_no',{},lang)
				}]
			
			sheet_name = orgName?.replace(/\//g,"-") #不支持"/"符号
			ret = template({
				lang: lang,
				sheet_name: sheet_name,
				fields: fields,
				users_to_xls: users_to_xls
			})

			fileName = "SteedOSContacts_" + moment().format('YYYYMMDDHHmm') + ".xls"
			res.setHeader("Content-type", "application/octet-stream")
			res.setHeader("Content-Disposition", "attachment;filename="+encodeURI(fileName))
			res.end(ret)
		catch e
			console.error e.stack
			res.end(e.message)