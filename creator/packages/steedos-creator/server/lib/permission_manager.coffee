permissionManagerForInitApproval = {}

permissionManagerForInitApproval.getFlowPermissions = (flow_id, user_id) ->
	# 根据:flow_id查到对应的flow
	flow = uuflowManagerForInitApproval.getFlow(flow_id)
	space_id = flow.space
	# 根据space_id和:user_id到organizations表中查到用户所属所有的org_id（包括上级组ID）
	org_ids = new Array
	organizations = db.organizations.find({
		space: space_id, users: user_id }, { fields: { parents: 1 } }).fetch()
	_.each(organizations, (org) ->
		org_ids.push(org._id)
		if org.parents
			_.each(org.parents, (parent_id) ->
				org_ids.push(parent_id)
			)
	)
	org_ids = _.uniq(org_ids)
	my_permissions = new Array
	if flow.perms
		# 判断flow.perms.users_can_admin中是否包含当前用户，
		# 或者flow.perms.orgs_can_add是否包含4步得到的org_id数组中的任何一个，
		# 若是，则在返回的数组中加上add
		if flow.perms.users_can_add
			users_can_add = flow.perms.users_can_add
			if users_can_add.includes(user_id)
				my_permissions.push("add")

		if flow.perms.orgs_can_add
			orgs_can_add = flow.perms.orgs_can_add
			_.each(org_ids, (org_id) ->
				if orgs_can_add.includes(org_id)
					my_permissions.push("add")
			)
		# 判断flow.perms.users_can_monitor中是否包含当前用户，
		# 或者flow.perms.orgs_can_monitor是否包含4步得到的org_id数组中的任何一个，
		# 若是，则在返回的数组中加上monitor
		if flow.perms.users_can_monitor
			users_can_monitor = flow.perms.users_can_monitor
			if users_can_monitor.includes(user_id)
				my_permissions.push("monitor")

		if flow.perms.orgs_can_monitor
			orgs_can_monitor = flow.perms.orgs_can_monitor
			_.each(org_ids, (org_id) ->
				if orgs_can_monitor.includes(org_id)
					my_permissions.push("monitor")
			)
		# 判断flow.perms.users_can_admin中是否包含当前用户，
		# 或者flow.perms.orgs_can_admin是否包含4步得到的org_id数组中的任何一个，
		# 若是，则在返回的数组中加上admin
		if flow.perms.users_can_admin
			users_can_admin = flow.perms.users_can_admin
			if users_can_admin.includes(user_id)
				my_permissions.push("admin")

		if flow.perms.orgs_can_admin
			orgs_can_admin = flow.perms.orgs_can_admin
			_.each(org_ids, (org_id) ->
				if orgs_can_admin.includes(org_id)
					my_permissions.push("admin")
			)

	my_permissions = _.uniq(my_permissions)
	return my_permissions