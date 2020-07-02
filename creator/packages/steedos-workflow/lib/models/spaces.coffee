# if Meteor.isServer
# 	Meteor.startup ()->

# 		db.spaces.createTemplateFormAndFlow = (space_id) ->

# 			if db.forms.find({ space: space_id }).count() > 0
# 				return false

# 			space = db.spaces.findOne(space_id, { fields: { owner: 1 } })
# 			if !space
# 				return false
# 			owner_id = space.owner

# 			user = db.users.findOne(space.owner, { fields: { locale: 1 } })
# 			if !user
# 				reurn false

# 			root_org = db.organizations.findOne({ space: space_id, parent: null })
# 			if !root_org
# 				return false

# 			if db.forms.find({ space: space_id }).count() > 0
# 				return

# 			template_forms = []

# 			if user.locale == "zh-cn"
# 				template_forms = EJSON.clone(workflowTemplate["zh-CN"])
# 			else
# 				template_forms = EJSON.clone(workflowTemplate["en"])

# 			if template_forms && template_forms instanceof Array
# 				template_forms.forEach (form) ->
# 					steedosImport.workflow(owner_id, space_id, form, true)

		# 根据locale和模板创建表单流程
#		template_space_id = null
#		if user.locale == "zh-cn"
#			template_space_id = "526621803349041651000a1a"
#		else
#			template_space_id = "526785fb3349041651000a75"
#
#		db.forms.find({"space": template_space_id, "state": "enabled"}, {fields: {_id: 1}}).forEach (template_form) ->
#		now = new Date
#		db.forms.find({"space": template_space_id, "state": "enabled"}).forEach (template_form) ->
#			# Form
#			new_form = {}
#			new_form._id = db.forms._makeNewID()
#			new_form.name = template_form.name
#			new_form.state = "enabled"
#			new_form.is_deleted = false
#			new_form.is_valid = template_form.is_valid
#			new_form.space = space_id
#			new_form.description = template_form.description
#			new_form.help_text = template_form.help_text
#			new_form.error_message = template_form.error_message
#			new_form.created_by = owner_id
#			new_form.created = now
#
#			current = {}
#			current._id = new Mongo.ObjectID()._str
#			current.form = new_form._id
#			current._rev = 1
#			current.start_date = now
#			current.fields = template_form.current.fields
#			current.created_by = owner_id
#			current.created = now
#			current.modified_by = owner_id
#			current.modified = now
#			new_form.current = current
#			new_form.historys = []
#			new_form_id = db.forms.direct.insert(new_form)
#
#			db.flows.find({"space": template_space_id, "form": template_form._id, "state": "enabled"}).forEach (template_flow) ->
#				# flow
#				new_flow = {}
#				new_flow._id = db.flows._makeNewID()
#				new_flow.space = space_id
#				new_flow.form = new_form_id
#				new_flow.name = template_flow.name
#				new_flow.name_formula = template_flow.name_formula
#				new_flow.code_formula = template_flow.code_formula
#				new_flow.flowtype = template_flow.flowtype
#				new_flow.state = "enabled"
#				new_flow.description = template_flow.description
#				new_flow.help_text = template_flow.help_text
#				new_flow.error_message = template_flow.error_message
#				new_flow.app = template_flow.app
#				new_flow.current_no = 0
#				new_flow.is_deleted = false
#				new_flow.is_valid = true
#				new_flow.error_message = template_flow.error_message
#				new_flow.created_by = owner_id
#				new_flow.created = now
#
#				new_current = {}
#				new_current._id = new Mongo.ObjectID()._str
#				new_current._rev = 1
#				new_current.flow = new_flow._id
#				new_current.form_version = new_form.current._id
#				new_current.start_date = now
#				new_current.steps = template_flow.current.steps
#				new_current.created_by = owner_id
#				new_current.created = now
#				new_current.modified_by = owner_id
#				new_current.modified = now
#
#				new_perms = {}
#				new_perms._id = new Mongo.ObjectID()._str
#				new_perms.orgs_can_add = [root_org._id]
#
#				new_flow.perms = new_perms
#				new_flow.current = new_current
#				new_flow.historys = []
#
#				db.flows.direct.insert(new_flow)


