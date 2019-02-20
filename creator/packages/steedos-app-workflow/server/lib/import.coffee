steedosImport = {}

steedosImport.workflow = (uid, spaceId, form, enabled, company_id)->

	if _.isEmpty(form)
		throw new Meteor.Error('error', "无效的json data")

	if company_id
		if db.organizations.find({ _id: company_id, space: spaceId }).count() == 0
			throw new Meteor.Error('error', "无效的字段: company_id")

	new_form_ids = new Array()

	new_flow_ids = new Array()
	try
		if form?.category_name
			category = db.categories.findOne({space: spaceId, name: form.category_name}, {fields: {_id: 1}})

			if _.isEmpty(category)
				category_id = new Mongo.ObjectID()._str;
				new_category = {
					_id: category_id,
					name: form.category_name,
					space: spaceId,
					created: new Date,
					created_by: uid,
					modified: new Date,
					modified_by: uid,
					owner: uid
				}
				if company_id
					new_category.company_id = company_id
				db.categories.direct.insert(new_category);
				form.category = category_id
			else
				form.category = category._id

			delete form.category_name

		if form?.instance_number_rules
			form.instance_number_rules.forEach (nr)->
				try
					rules = db.instance_number_rules.findOne({space: spaceId, "name": nr.name})

					if !rules
						nr.space = spaceId
						nr._id = new Mongo.ObjectID()._str
						nr.created = new Date
						nr.created_by = uid
						nr.modified = new Date
						nr.modified_by = uid
						if company_id
							nr.company_id = company_id
						db.instance_number_rules.direct.insert(nr)
				catch e
					console.log "steedosImport.workflow", e

			delete form.instance_number_rules

		form_id = new Mongo.ObjectID()._str

		flows = form.flows

		delete form.flows

		form._id = form_id

		form.space = spaceId
		if enabled
			form.state = 'enabled'
			form.is_valid = true #直接启用的表单设置is valid值为true
		else
			form.state = 'disabled' #设置状态为 未启用
			form.is_valid = true #设置已验证为 true , 简化用户操作

		form.created = new Date()

		form.created_by = uid

		form.modified = form.created

		form.modified_by = uid

		form.historys = []

		form.current._id = new Mongo.ObjectID()._str

		form.current._rev = 1 #重置版本号

		form.current.form = form_id

		form.current.created = new Date()

		form.current.created_by = uid

		form.current.modified = new Date()

		form.current.modified_by = uid

		delete form.company_id
		if company_id
			form.company_id = company_id

		form.import = true

		form.owner = uid

		db.forms.direct.insert(form)

		new_form_ids.push(form_id)

		flows.forEach (flow)->
			flow_id = new Mongo.ObjectID()._str

			flow._id = flow_id

			flow.form = form_id

			if enabled
				flow.state = 'enabled'
				flow.is_valid = true #直接启用的流程设置is valid值为true
			else
				flow.state = 'disabled' #设置状态为 未启用
				flow.is_valid = true

			flow.current_no = 0 #重置编号起始为0

			flow.created = new Date()

			flow.created_by = uid

			flow.modified = flow.created

			flow.modified_by = uid

			delete flow.company_id
			if company_id
				flow.company_id = company_id
			#跨工作区导入时，重置流程权限perms
			if !flow.perms || flow.space !=  spaceId || company_id
				orgs_can_add = []
				if company_id
					orgs_can_add = [company_id]
				else
					orgs_can_add = db.organizations.find({
						space: spaceId,
						is_company: true,
						parent: null
					}, {fields: {_id: 1}}).fetch().getProperty("_id")
				#设置提交部门为：全公司
				perms = {
					_id: new Mongo.ObjectID()._str
					users_can_add: []
					orgs_can_add: orgs_can_add
					users_can_monitor: []
					orgs_can_monitor: []
					users_can_admin: []
					orgs_can_admin: []
				}

				flow.perms = perms

			flow.space = spaceId

			flow.current._id = new Mongo.ObjectID()._str

			flow.current.flow = flow_id

			flow.current._rev = 1 #重置版本

			flow.current.form_version = form.current._id

			flow.current.created = new Date()

			flow.current.created_by = uid

			flow.current.modified = new Date()

			flow.current.modified_by = uid

			flow.current?.steps.forEach (step)->
				if _.isEmpty(step.approver_roles_name)
					delete step.approver_roles_name
					if _.isEmpty(step.approver_roles)
						step.approver_roles = []
				else
					approve_roles = new Array()
					step.approver_roles_name.forEach (role_name) ->

						flow_role_query = {space: spaceId, name: role_name}

						if company_id
							flow_role_query.company_id = company_id

						role = db.flow_roles.findOne(flow_role_query, {fields: {_id: 1}})
						if _.isEmpty(role)
							role_id = db.flow_roles._makeNewID()
							role = {
								_id: role_id
								name: role_name
								space: spaceId
								created: new Date
								created_by: uid
								owner: uid
							}

							if company_id
								role.company_id = company_id

							db.flow_roles.direct.insert(role)

							approve_roles.push(role_id)
						else
							approve_roles.push(role._id)

					step.approver_roles = approve_roles

					delete step.approver_roles_name

			flow.import = true

			flow.owner = uid

			db.flows.direct.insert(flow)

			new_flow_ids.push(flow_id)

		return new_flow_ids;
	catch e
		new_form_ids.forEach (id)->
			db.forms.direct.remove(id)

		new_flow_ids.forEach (id)->
			db.flows.direct.remove(id)
		throw  e





