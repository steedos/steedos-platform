Creator.getPermissions = (object_name, spaceId, userId)->
	if Meteor.isClient
		if !object_name
			object_name = Session.get("object_name")
		obj = Creator.getObject(object_name)
		if !obj
			return
		return obj.permissions.get()
	else if Meteor.isServer
		Creator.getObjectPermissions(spaceId, userId, object_name)

Creator.getRecordPermissions = (object_name, record, userId, spaceId)->
	if !object_name and Meteor.isClient
		object_name = Session.get("object_name")

	permissions = _.clone(Creator.getPermissions(object_name))

	if record
		isOwner = record.owner == userId || record.owner?._id == userId
		if Meteor.isClient
			user_company_ids = Session.get("user_company_ids")
		else
			user_company_ids = Creator.getUserCompanyIds(userId, spaceId)
		record_company_id = record?.company_id
		if record_company_id and _.isObject(record_company_id) and record_company_id._id
			# 因record_company_id是lookup类型，有可能dx控件会把它映射转为对应的object，所以这里取出其_id值
			record_company_id = record_company_id._id
		if !permissions.modifyAllRecords and !isOwner and !permissions.modifyCompanyRecords
			permissions.allowEdit = false
			permissions.allowDelete = false
		else if permissions.modifyCompanyRecords
			if record_company_id and _.isString(record_company_id)
				if user_company_ids and user_company_ids.length
					if !_.include(user_company_ids, record_company_id)
						# 记录的company_id属性不在当前用户user_company_ids范围内时，认为无权修改
						permissions.allowEdit = false
						permissions.allowDelete = false
				else
					# 记录有company_id属性，但是当前用户user_company_ids为空时，认为无权修改
					permissions.allowEdit = false
					permissions.allowDelete = false
		
		if record.locked and !permissions.modifyAllRecords
			permissions.allowEdit = false
			permissions.allowDelete = false

		if !permissions.viewAllRecords and !isOwner and !permissions.viewCompanyRecords
			permissions.allowRead = false
		else if permissions.viewCompanyRecords
			if record_company_id and _.isString(record_company_id)
				if user_company_ids and user_company_ids.length
					if !_.include(user_company_ids, record_company_id)
						# 记录的company_id属性不在当前用户user_company_ids范围内时，认为无权查看
						permissions.allowRead = false
				else
					# 记录有company_id属性，但是当前用户user_company_ids为空时，认为无权查看
					permissions.allowRead = false

	return permissions

if Meteor.isServer

	Creator.getAllPermissions = (spaceId, userId) ->
		permissions =
			objects: {}
			assigned_apps: []
		psetsAdmin = Creator.getCollection("permission_set").findOne({space: spaceId, name: 'admin'}, {fields:{_id:1, assigned_apps:1}}) || null
		psetsUser = Creator.getCollection("permission_set").findOne({space: spaceId, name: 'user'}, {fields:{_id:1, assigned_apps:1}}) || null
		psetsMember = Creator.getCollection("permission_set").findOne({space: spaceId, name: 'member'}, {fields:{_id:1, assigned_apps:1}}) || null
		psetsGuest = Creator.getCollection("permission_set").findOne({space: spaceId, name: 'guest'}, {fields:{_id:1, assigned_apps:1}}) || null
		psetsWorkflowAdmin = Creator.getCollection("permission_set").findOne({space: spaceId, name: 'workflow_admin'}, {fields:{_id:1, assigned_apps:1, users:1}}) || null
		psetsOrganizationAdmin = Creator.getCollection("permission_set").findOne({space: spaceId, name: 'organization_admin'}, {fields:{_id:1, assigned_apps:1, users:1}}) || null
		psetsCurrent = Creator.getCollection("permission_set").find({users: userId, space: spaceId}, {fields:{_id:1, assigned_apps:1, name:1}}).fetch()

		psetsAdmin_pos = null
		psetsUser_pos = null
		psetsMember_pos = null
		psetsGuest_pos = null
		psetsWorkflowAdmin_pos = null
		psetsOrganizationAdmin_pos = null
		psetsCurrent_pos = null

		if psetsAdmin?._id
			psetsAdmin_pos = Creator.getCollection("permission_objects").find({permission_set_id: psetsAdmin._id}, {fields: {created: 0, modified: 0, created_by: 0, modified_by: 0}}).fetch()
		if psetsUser?._id
			psetsUser_pos = Creator.getCollection("permission_objects").find({permission_set_id: psetsUser._id}, {fields: {created: 0, modified: 0, created_by: 0, modified_by: 0}}).fetch()
		if psetsMember?._id
			psetsMember_pos = Creator.getCollection("permission_objects").find({permission_set_id: psetsMember._id}, {fields: {created: 0, modified: 0, created_by: 0, modified_by: 0}}).fetch()
		if psetsGuest?._id
			psetsGuest_pos = Creator.getCollection("permission_objects").find({permission_set_id: psetsGuest._id}, {fields: {created: 0, modified: 0, created_by: 0, modified_by: 0}}).fetch()
		if psetsWorkflowAdmin?._id
			psetsWorkflowAdmin_pos = Creator.getCollection("permission_objects").find({permission_set_id: psetsWorkflowAdmin._id}, {fields: {created: 0, modified: 0, created_by: 0, modified_by: 0}}).fetch()
		if psetsOrganizationAdmin?._id
			psetsOrganizationAdmin_pos = Creator.getCollection("permission_objects").find({permission_set_id: psetsOrganizationAdmin._id}, {fields: {created: 0, modified: 0, created_by: 0, modified_by: 0}}).fetch()
		if psetsCurrent.length > 0
			set_ids = _.pluck psetsCurrent, "_id"
			psetsCurrent_pos = Creator.getCollection("permission_objects").find({permission_set_id: {$in: set_ids}}).fetch()
			psetsCurrentNames = _.pluck psetsCurrent, "name"
		isSpaceAdmin = false
		spaceUser = null
		if userId
			isSpaceAdmin = Creator.isSpaceAdmin(spaceId, userId)
			isWorkflowAdmin = psetsWorkflowAdmin?.users?.includes(userId)
			isOrganizationAdmin = psetsOrganizationAdmin?.users?.includes(userId)
			spaceUser = Creator.getCollection("space_users").findOne({ space: spaceId, user: userId }, { fields: { profile: 1 } })

		psets = { 
			psetsAdmin, 
			psetsUser, 
			psetsCurrent, 
			psetsMember, 
			psetsGuest, 
			psetsWorkflowAdmin, 
			psetsOrganizationAdmin, 
			isSpaceAdmin, 
			isWorkflowAdmin,
			isOrganizationAdmin,
			spaceUser, 
			psetsAdmin_pos, 
			psetsUser_pos, 
			psetsMember_pos, 
			psetsGuest_pos, 
			psetsWorkflowAdmin_pos, 
			psetsOrganizationAdmin_pos, 
			psetsCurrent_pos
		}
		permissions.assigned_apps = Creator.getAssignedApps.bind(psets)(spaceId, userId)
		permissions.assigned_menus = Creator.getAssignedMenus.bind(psets)(spaceId, userId)
		permissions.user_permission_sets = psetsCurrentNames
		_i = 0
		_.each Creator.objectsByName, (object, object_name)->
			_i++
			if !_.has(object, 'space') || !object.space || object.space == spaceId
				permissions.objects[object_name] = _.clone Creator.Objects[object_name]
				permissions.objects[object_name]["permissions"] = Creator.getObjectPermissions.bind(psets)(spaceId, userId, object_name)
		return permissions

	unionPlus = (array, other) ->
		if !array and !other
			return undefined
		if !array
			array = []
		if !other
			other = []
		return _.union(array, other)

	Creator.getAssignedApps = (spaceId, userId)->
		psetsAdmin = this.psetsAdmin || Creator.getCollection("permission_set").findOne({space: spaceId, name: 'admin'}, {fields:{_id:1, assigned_apps:1}})
		psetsUser = this.psetsUser || Creator.getCollection("permission_set").findOne({space: spaceId, name: 'user'}, {fields:{_id:1, assigned_apps:1}})
		# psetsMember = this.psetsMember || Creator.getCollection("permission_set").findOne({space: spaceId, name: 'member'}, {fields:{_id:1, assigned_apps:1}})
		# psetsGuest = this.psetsGuest || Creator.getCollection("permission_set").findOne({space: spaceId, name: 'guest'}, {fields:{_id:1, assigned_apps:1}})
		psets =  this.psetsCurrent || Creator.getCollection("permission_set").find({users: userId, space: spaceId}, {fields:{_id:1, assigned_apps:1}}).fetch()
		isSpaceAdmin = if _.isBoolean(this.isSpaceAdmin) then this.isSpaceAdmin else Creator.isSpaceAdmin(spaceId, userId)
		apps = []
		if isSpaceAdmin
			return []
		else
			psetBase = psetsUser
			if psetBase?.assigned_apps
				apps = _.union apps, psetBase.assigned_apps
			_.each psets, (pset)->
				if !pset.assigned_apps
					return
				if pset.name == "admin" ||  pset.name == "user"
					return
				apps = _.union apps, pset.assigned_apps
			return _.without(_.uniq(apps),undefined,null)

	Creator.getAssignedMenus = (spaceId, userId)->
		psets =  this.psetsCurrent || Creator.getCollection("permission_set").find({users: userId, space: spaceId}, {fields:{_id:1, name:1}}).fetch()
		isSpaceAdmin = if _.isBoolean(this.isSpaceAdmin) then this.isSpaceAdmin else Creator.isSpaceAdmin(spaceId, userId)
		adminMenus = Creator.Apps.admin?.admin_menus
		# 如果没有admin菜单说明不需要相关功能，直接返回空
		unless adminMenus
			return []
		aboutMenu = adminMenus.find (n) ->
			n._id == 'about'
		adminMenus = adminMenus.filter (n) ->
			n._id != 'about'
		otherMenuApps = _.sortBy _.filter(_.values(Creator.Apps), (n) ->
			return n.admin_menus and n._id != 'admin'
		), 'sort'
		otherMenus = _.flatten(_.pluck(otherMenuApps, "admin_menus"))
		# 菜单有三部分组成设置APP菜单、其他APP菜单以及about菜单
		allMenus = _.union(adminMenus, otherMenus, [aboutMenu])
		if isSpaceAdmin
			# 工作区管理员有全部菜单功能
			return allMenus
		else
			currentPsetNames = psets.map (n) ->
				return n.name
			menus = allMenus.filter (menu)->
				psetsMenu = menu.permission_sets
				# 如果普通用户有权限，则直接返回true
				if psetsMenu.indexOf("user") > -1
					return true
				# 否则取当前用户的权限集与menu菜单要求的权限集对比，如果交集大于1个则返回true
				return _.intersection(currentPsetNames, psetsMenu).length
			return menus

	findOne_permission_object = (permission_objects, object_name, permission_set_id)->

		if _.isNull(permission_objects)
			return null
		if _.isArray(permission_objects)
			return _.find permission_objects, (po)->
					return po.object_name == object_name
		return Creator.getCollection("permission_objects").findOne({object_name: object_name, permission_set_id: permission_set_id})

	find_permission_object = (permission_objects, object_name, permission_set_ids)->
		if _.isNull(permission_objects)
			return null
		if _.isArray(permission_objects)
			return _.filter permission_objects, (po)->
				return po.object_name == object_name
		Creator.getCollection("permission_objects").find({object_name: object_name, permission_set_id: {$in: permission_set_ids}}).fetch()

	Creator.getObjectPermissions = (spaceId, userId, object_name)->
		permissions = {}
		object = Creator.getObject(object_name, spaceId)

		if spaceId is 'guest' || object_name == "users"
			permissions = _.clone(object.permission_set.guest) || {}
			Creator.processPermissions permissions
			return permissions
		psetsAdmin = if _.isNull(this.psetsAdmin) or this.psetsAdmin then this.psetsAdmin else Creator.getCollection("permission_set").findOne({space: spaceId, name: 'admin'}, {fields:{_id:1}})
		psetsUser = if _.isNull(this.psetsUser) or this.psetsUser then this.psetsUser else Creator.getCollection("permission_set").findOne({space: spaceId, name: 'user'}, {fields:{_id:1}})
		psetsMember = if _.isNull(this.psetsMember) or this.psetsMember then this.psetsMember else Creator.getCollection("permission_set").findOne({space: spaceId, name: 'member'}, {fields:{_id:1}})
		psetsGuest = if _.isNull(this.psetsGuest) or this.psetsGuest then this.psetsGuest else Creator.getCollection("permission_set").findOne({space: spaceId, name: 'guest'}, {fields:{_id:1}})
		psetsWorkflowAdmin = if _.isNull(this.psetsWorkflowAdmin) or this.psetsWorkflowAdmin then this.psetsWorkflowAdmin else Creator.getCollection("permission_set").findOne({space: spaceId, name: 'workflow_admin'}, {fields:{_id:1, users:1}})
		psetsOrganizationAdmin = if _.isNull(this.psetsOrganizationAdmin) or this.psetsOrganizationAdmin then this.psetsOrganizationAdmin else Creator.getCollection("permission_set").findOne({space: spaceId, name: 'organization_admin'}, {fields:{_id:1, users:1}})
		psets =  this.psetsCurrent || Creator.getCollection("permission_set").find({users: userId, space: spaceId}, {fields:{_id:1}}).fetch()
		isSpaceAdmin = if _.isBoolean(this.isSpaceAdmin) then this.isSpaceAdmin else Creator.isSpaceAdmin(spaceId, userId)
		isWorkflowAdmin = if _.isBoolean(this.isWorkflowAdmin) then this.isWorkflowAdmin else psetsWorkflowAdmin?.users?.includes(userId)
		isOrganizationAdmin = if _.isBoolean(this.isOrganizationAdmin) then this.isOrganizationAdmin else psetsOrganizationAdmin?.users?.includes(userId)

		psetsAdmin_pos = this.psetsAdmin_pos
		psetsUser_pos = this.psetsUser_pos
		psetsMember_pos = this.psetsMember_pos
		psetsGuest_pos = this.psetsGuest_pos
		psetsWorkflowAdmin_pos = this.psetsWorkflowAdmin_pos
		psetsOrganizationAdmin_pos = this.psetsOrganizationAdmin_pos
		psetsCurrent_pos = this.psetsCurrent_pos

		opsetAdmin = _.clone(object.permission_set.admin) || {}
		opsetUser = _.clone(object.permission_set.user) || {}
		opsetMember = _.clone(object.permission_set.member) || {}
		opsetGuest = _.clone(object.permission_set.guest) || {}
		opsetWorkflowAdmin = _.clone(object.permission_set.workflow_admin) || {}
		opsetOrganizationAdmin = _.clone(object.permission_set.organization_admin) || {}
		# sharedListViews = Creator.getCollection('object_listviews').find({space: spaceId, object_name: object_name, shared: true}, {fields:{_id:1}}).fetch()
		# sharedListViews = _.pluck(sharedListViews,"_id")
		# if sharedListViews.length
		# 	unless opsetAdmin.list_views
		# 		opsetAdmin.list_views = []
		# 	opsetAdmin.list_views = _.union opsetAdmin.list_views, sharedListViews
		# 	unless opsetUser.list_views
		# 		opsetUser.list_views = []
		# 	opsetUser.list_views = _.union opsetUser.list_views, sharedListViews
		# 数据库中如果配置了默认的admin/user权限集设置，应该覆盖代码中admin/user的权限集设置
		if psetsAdmin
			posAdmin = findOne_permission_object(psetsAdmin_pos, object_name, psetsAdmin._id)
			if posAdmin
				opsetAdmin.allowCreate = posAdmin.allowCreate
				opsetAdmin.allowDelete = posAdmin.allowDelete
				opsetAdmin.allowEdit = posAdmin.allowEdit
				opsetAdmin.allowRead = posAdmin.allowRead
				opsetAdmin.modifyAllRecords = posAdmin.modifyAllRecords
				opsetAdmin.viewAllRecords = posAdmin.viewAllRecords
				opsetAdmin.modifyCompanyRecords = posAdmin.modifyCompanyRecords
				opsetAdmin.viewCompanyRecords = posAdmin.viewCompanyRecords
				opsetAdmin.disabled_list_views = posAdmin.disabled_list_views
				opsetAdmin.disabled_actions = posAdmin.disabled_actions
				opsetAdmin.unreadable_fields = posAdmin.unreadable_fields
				opsetAdmin.uneditable_fields = posAdmin.uneditable_fields
				opsetAdmin.unrelated_objects = posAdmin.unrelated_objects
		if psetsUser
			posUser = findOne_permission_object(psetsUser_pos, object_name, psetsUser._id)
			if posUser
				opsetUser.allowCreate = posUser.allowCreate
				opsetUser.allowDelete = posUser.allowDelete
				opsetUser.allowEdit = posUser.allowEdit
				opsetUser.allowRead = posUser.allowRead
				opsetUser.modifyAllRecords = posUser.modifyAllRecords
				opsetUser.viewAllRecords = posUser.viewAllRecords
				opsetUser.modifyCompanyRecords = posUser.modifyCompanyRecords
				opsetUser.viewCompanyRecords = posUser.viewCompanyRecords
				opsetUser.disabled_list_views = posUser.disabled_list_views
				opsetUser.disabled_actions = posUser.disabled_actions
				opsetUser.unreadable_fields = posUser.unreadable_fields
				opsetUser.uneditable_fields = posUser.uneditable_fields
				opsetUser.unrelated_objects = posUser.unrelated_objects
		if psetsMember
			posMember = findOne_permission_object(psetsMember_pos, object_name, psetsMember._id)
			if posMember
				opsetMember.allowCreate = posMember.allowCreate
				opsetMember.allowDelete = posMember.allowDelete
				opsetMember.allowEdit = posMember.allowEdit
				opsetMember.allowRead = posMember.allowRead
				opsetMember.modifyAllRecords = posMember.modifyAllRecords
				opsetMember.viewAllRecords = posMember.viewAllRecords
				opsetMember.modifyCompanyRecords = posMember.modifyCompanyRecords
				opsetMember.viewCompanyRecords = posMember.viewCompanyRecords
				opsetMember.disabled_list_views = posMember.disabled_list_views
				opsetMember.disabled_actions = posMember.disabled_actions
				opsetMember.unreadable_fields = posMember.unreadable_fields
				opsetMember.uneditable_fields = posMember.uneditable_fields
				opsetMember.unrelated_objects = posMember.unrelated_objects
		if psetsGuest
			posGuest = findOne_permission_object(psetsGuest_pos, object_name, psetsGuest._id)
			if posGuest
				opsetGuest.allowCreate = posGuest.allowCreate
				opsetGuest.allowDelete = posGuest.allowDelete
				opsetGuest.allowEdit = posGuest.allowEdit
				opsetGuest.allowRead = posGuest.allowRead
				opsetGuest.modifyAllRecords = posGuest.modifyAllRecords
				opsetGuest.viewAllRecords = posGuest.viewAllRecords
				opsetGuest.modifyCompanyRecords = posGuest.modifyCompanyRecords
				opsetGuest.viewCompanyRecords = posGuest.viewCompanyRecords
				opsetGuest.disabled_list_views = posGuest.disabled_list_views
				opsetGuest.disabled_actions = posGuest.disabled_actions
				opsetGuest.unreadable_fields = posGuest.unreadable_fields
				opsetGuest.uneditable_fields = posGuest.uneditable_fields
				opsetGuest.unrelated_objects = posGuest.unrelated_objects
		if psetsWorkflowAdmin
			posWorkflowAdmin = findOne_permission_object(psetsWorkflowAdmin_pos, object_name, psetsWorkflowAdmin._id)
			if posWorkflowAdmin
				opsetWorkflowAdmin.allowCreate = posWorkflowAdmin.allowCreate
				opsetWorkflowAdmin.allowDelete = posWorkflowAdmin.allowDelete
				opsetWorkflowAdmin.allowEdit = posWorkflowAdmin.allowEdit
				opsetWorkflowAdmin.allowRead = posWorkflowAdmin.allowRead
				opsetWorkflowAdmin.modifyAllRecords = posWorkflowAdmin.modifyAllRecords
				opsetWorkflowAdmin.viewAllRecords = posWorkflowAdmin.viewAllRecords
				opsetWorkflowAdmin.modifyCompanyRecords = posWorkflowAdmin.modifyCompanyRecords
				opsetWorkflowAdmin.viewCompanyRecords = posWorkflowAdmin.viewCompanyRecords
				opsetWorkflowAdmin.disabled_list_views = posWorkflowAdmin.disabled_list_views
				opsetWorkflowAdmin.disabled_actions = posWorkflowAdmin.disabled_actions
				opsetWorkflowAdmin.unreadable_fields = posWorkflowAdmin.unreadable_fields
				opsetWorkflowAdmin.uneditable_fields = posWorkflowAdmin.uneditable_fields
				opsetWorkflowAdmin.unrelated_objects = posWorkflowAdmin.unrelated_objects
		if psetsOrganizationAdmin
			posOrganizationAdmin = findOne_permission_object(psetsOrganizationAdmin_pos, object_name, psetsOrganizationAdmin._id)
			if posOrganizationAdmin
				opsetOrganizationAdmin.allowCreate = posOrganizationAdmin.allowCreate
				opsetOrganizationAdmin.allowDelete = posOrganizationAdmin.allowDelete
				opsetOrganizationAdmin.allowEdit = posOrganizationAdmin.allowEdit
				opsetOrganizationAdmin.allowRead = posOrganizationAdmin.allowRead
				opsetOrganizationAdmin.modifyAllRecords = posOrganizationAdmin.modifyAllRecords
				opsetOrganizationAdmin.viewAllRecords = posOrganizationAdmin.viewAllRecords
				opsetOrganizationAdmin.modifyCompanyRecords = posOrganizationAdmin.modifyCompanyRecords
				opsetOrganizationAdmin.viewCompanyRecords = posOrganizationAdmin.viewCompanyRecords
				opsetOrganizationAdmin.disabled_list_views = posOrganizationAdmin.disabled_list_views
				opsetOrganizationAdmin.disabled_actions = posOrganizationAdmin.disabled_actions
				opsetOrganizationAdmin.unreadable_fields = posOrganizationAdmin.unreadable_fields
				opsetOrganizationAdmin.uneditable_fields = posOrganizationAdmin.uneditable_fields
				opsetOrganizationAdmin.unrelated_objects = posOrganizationAdmin.unrelated_objects
		if !userId
			permissions = opsetAdmin
		else
			if isSpaceAdmin
				permissions = opsetAdmin
			else
				if spaceId is 'common'
					permissions = opsetUser
				else
					spaceUser = if _.isNull(this.spaceUser) or this.spaceUser then this.spaceUser else Creator.getCollection("space_users").findOne({ space: spaceId, user: userId }, { fields: { profile: 1 } })
					if spaceUser
						prof = spaceUser.profile
						if prof
							if prof is 'user'
								permissions = opsetUser
							else if prof is 'member'
								permissions = opsetMember
							else if prof is 'guest'
								permissions = opsetGuest
						else # 没有profile则认为是user权限
							permissions = opsetUser
					else
						permissions = opsetGuest

		if psets.length > 0
			set_ids = _.pluck psets, "_id"
			pos = find_permission_object(psetsCurrent_pos, object_name, set_ids)
			_.each pos, (po)->
				if po.permission_set_id == psetsAdmin?._id or 
				po.permission_set_id == psetsUser?._id or 
				po.permission_set_id == psetsMember?._id or 
				po.permission_set_id == psetsGuest?._id or 
				po.permission_set_id == psetsWorkflowAdmin?._id or 
				po.permission_set_id == psetsOrganizationAdmin?._id
					# 默认的admin/user权限值只实行上面的默认值覆盖，不做算法判断
					return
				if po.allowRead
					permissions.allowRead = true
				if po.allowCreate
					permissions.allowCreate = true
				if po.allowEdit
					permissions.allowEdit = true
				if po.allowDelete
					permissions.allowDelete = true
				if po.modifyAllRecords
					permissions.modifyAllRecords = true
				if po.viewAllRecords
					permissions.viewAllRecords = true
				if po.modifyCompanyRecords
					permissions.modifyCompanyRecords = true
				if po.viewCompanyRecords
					permissions.viewCompanyRecords = true

				permissions.disabled_list_views = unionPlus(permissions.disabled_list_views, po.disabled_list_views)
				permissions.disabled_actions = unionPlus(permissions.disabled_actions, po.disabled_actions)
				permissions.unreadable_fields = unionPlus(permissions.unreadable_fields, po.unreadable_fields)
				permissions.uneditable_fields = unionPlus(permissions.uneditable_fields, po.uneditable_fields)
				permissions.unrelated_objects = unionPlus(permissions.unrelated_objects, po.unrelated_objects)

			if isWorkflowAdmin
				if opsetWorkflowAdmin.allowRead
					permissions.allowRead = true
				if opsetWorkflowAdmin.allowCreate
					permissions.allowCreate = true
				if opsetWorkflowAdmin.allowEdit
					permissions.allowEdit = true
				if opsetWorkflowAdmin.allowDelete
					permissions.allowDelete = true
				if opsetWorkflowAdmin.modifyAllRecords
					permissions.modifyAllRecords = true
				if opsetWorkflowAdmin.viewAllRecords
					permissions.viewAllRecords = true
				if opsetWorkflowAdmin.modifyCompanyRecords
					permissions.modifyCompanyRecords = true
				if opsetWorkflowAdmin.viewCompanyRecords
					permissions.viewCompanyRecords = true

				permissions.disabled_list_views = unionPlus(permissions.disabled_list_views, opsetWorkflowAdmin.disabled_list_views)
				permissions.disabled_actions = unionPlus(permissions.disabled_actions, opsetWorkflowAdmin.disabled_actions)
				permissions.unreadable_fields = unionPlus(permissions.unreadable_fields, opsetWorkflowAdmin.unreadable_fields)
				permissions.uneditable_fields = unionPlus(permissions.uneditable_fields, opsetWorkflowAdmin.uneditable_fields)
				permissions.unrelated_objects = unionPlus(permissions.unrelated_objects, opsetWorkflowAdmin.unrelated_objects)

			if isOrganizationAdmin
				if opsetOrganizationAdmin.allowRead
					permissions.allowRead = true
				if opsetOrganizationAdmin.allowCreate
					permissions.allowCreate = true
				if opsetOrganizationAdmin.allowEdit
					permissions.allowEdit = true
				if opsetOrganizationAdmin.allowDelete
					permissions.allowDelete = true
				if opsetOrganizationAdmin.modifyAllRecords
					permissions.modifyAllRecords = true
				if opsetOrganizationAdmin.viewAllRecords
					permissions.viewAllRecords = true
				if opsetOrganizationAdmin.modifyCompanyRecords
					permissions.modifyCompanyRecords = true
				if opsetOrganizationAdmin.viewCompanyRecords
					permissions.viewCompanyRecords = true

				permissions.disabled_list_views = unionPlus(permissions.disabled_list_views, opsetOrganizationAdmin.disabled_list_views)
				permissions.disabled_actions = unionPlus(permissions.disabled_actions, opsetOrganizationAdmin.disabled_actions)
				permissions.unreadable_fields = unionPlus(permissions.unreadable_fields, opsetOrganizationAdmin.unreadable_fields)
				permissions.uneditable_fields = unionPlus(permissions.uneditable_fields, opsetOrganizationAdmin.uneditable_fields)
				permissions.unrelated_objects = unionPlus(permissions.unrelated_objects, opsetOrganizationAdmin.unrelated_objects)
		
		if object.is_view
			permissions.allowCreate = false
			permissions.allowEdit = false
			permissions.allowDelete = false
			permissions.modifyAllRecords = false
			permissions.modifyCompanyRecords = false
			permissions.disabled_actions = []
		Creator.processPermissions permissions
		return permissions


	# Creator.initPermissions = (object_name) ->

		# # 应该把计算出来的
		# Creator.Collections[object_name].allow
		# 	insert: (userId, doc) ->
		# 		if !userId
		# 			return false
		# 		if !doc.space
		# 			return false
	    	# 		permissions = Creator.getObjectPermissions(doc.space, userId, object_name)
		# 		if !permissions.allowCreate
		# 			return false

		# 		return true
		# 	update: (userId, doc) ->
		# 		if !userId
		# 			return false
		# 		if !doc.space
		# 			return false
		# 		permissions = Creator.getObjectPermissions(doc.space, userId, object_name)
		# 		if !permissions.allowEdit
		# 			return false
		# 		return true
		# 	remove: (userId, doc) ->
		# 		if !userId
		# 			return false
		# 		if !doc.space
		# 			return false
		# 		permissions = Creator.getObjectPermissions(doc.space, userId, object_name)
		# 		if !permissions.allowDelete
		# 			return false
		# 		return true

	Meteor.methods
		# Calculate Permissions on Server
		"creator.object_permissions": (spaceId)->
			return Creator.getAllPermissions(spaceId, this.userId)
