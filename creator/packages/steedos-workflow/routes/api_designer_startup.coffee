JsonRoutes.add 'get', '/api/designer/startup', (req, res, next) ->
	try
		current_user_info = uuflowManager.check_authorization(req)
		current_user = current_user_info._id

		companyId = req.query?.companyId || ''

		spacesQuery = { admins: current_user }

		if companyId
			org = db.organizations.findOne(companyId, { fields: { space:1 } })
			if not org
				throw new Meteor.Error('error', 'companyId is invalid')

			spacesQuery = { _id: org.space }

		spaces = db.spaces.find(spacesQuery).fetch()

		spaceIds = _.pluck spaces, '_id'

		query = { space: { $in: spaceIds } }
		if companyId
			query.company_id = companyId

		spaceUsers = db.space_users.find(query).fetch()

		forms = db.forms.find(query, { fields: { name:1, state:1, is_deleted:1, is_valid:1, space:1, description:1, help_text:1,
		created:1, created_by:1, current:1, category:1, instance_style:1, company_id:1 } }).fetch()

		flows = db.flows.find(query, { fields: { name:1, name_formula:1, code_formula:1, space:1, description:1, is_valid:1, form:1,
		flowtype:1, state:1, is_deleted:1, created:1, created_by:1, help_text:1, current_no:1, current:1, perms:1, error_message:1, distribute_optional_users:1, company_id:1 } }).fetch()

		roles = db.flow_roles.find(query).fetch()

		organizations = db.organizations.find(query).fetch()

		positions = db.flow_positions.find(query).fetch()

		categories = db.categories.find({ space: { $in: spaceIds } }).fetch()

		userIds = _.pluck spaceUsers, 'user'
		users = db.users.find({ _id: { $in: userIds } }, { fields: { name: 1 } }).fetch()

		result = {}
		result.SpaceUsers = spaceUsers
		result.Users = users
		result.Forms = forms
		result.Flows = flows
		result.Organizations = organizations
		result.Positions = positions
		result.Roles = roles
		result.Categories = categories
		result.Spaces = spaces

		JsonRoutes.sendResult res,
				code: 200
				data: result
	catch e
		console.error e.stack
		JsonRoutes.sendResult res,
			code: 200
			data: { errors: [{errorMessage: e.message}] }

