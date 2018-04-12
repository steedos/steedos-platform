if Meteor.isServer

	Creator.getAllPermissions = (spaceId, userId) ->
		permissions =
			objects: {}
			assigned_apps: []
		psetsAdmin = Creator.getCollection("permission_set").findOne({space: spaceId, name: 'admin'}, {fields:{_id:1, assigned_apps:1}})
		psetsUser = Creator.getCollection("permission_set").findOne({space: spaceId, name: 'user'}, {fields:{_id:1, assigned_apps:1}})
		psetsCurrent = Creator.getCollection("permission_set").find({users: userId, space: spaceId}, {fields:{_id:1, assigned_apps:1}}).fetch()
		psets = { psetsAdmin, psetsUser, psetsCurrent }
		permissions.assigned_apps = Creator.getAssignedApps.bind(psets)(spaceId, userId)
		_.each Creator.objectsByName, (object, object_name)->
			permissions.objects[object_name] = Creator.Objects[object_name]
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
		psets =  this.psetsCurrent || Creator.getCollection("permission_set").find({users: userId, space: spaceId}, {fields:{_id:1, assigned_apps:1}}).fetch()
		apps = []
		if Creator.isSpaceAdmin(spaceId, userId)
			if psetsAdmin?.assigned_apps and psetsUser?.assigned_apps
				psetsAdmin?.assigned_apps = _.union(psetsAdmin?.assigned_apps,psetsUser?.assigned_apps)
				psetBase = psetsAdmin
			if !psetsUser?.assigned_apps
				psetBase = psetsUser
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

	Creator.getObjectPermissions = (spaceId, userId, object_name)->
		permissions = {}
		object = Creator.getObject(object_name)
		psetsAdmin = this.psetsAdmin || Creator.getCollection("permission_set").findOne({space: spaceId, name: 'admin'}, {fields:{_id:1}})
		psetsUser = this.psetsUser || Creator.getCollection("permission_set").findOne({space: spaceId, name: 'user'}, {fields:{_id:1}})
		psets =  this.psetsCurrent || Creator.getCollection("permission_set").find({users: userId, space: spaceId}, {fields:{_id:1}}).fetch()

		opsetAdmin = _.clone(object.permission_set.admin)
		opsetUser = _.clone(object.permission_set.user)

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
			posAdmin = Creator.getCollection("permission_objects").findOne({object_name: object_name, permission_set_id: psetsAdmin._id})
			if posAdmin
				opsetAdmin.allowCreate = posAdmin.allowCreate
				opsetAdmin.allowDelete = posAdmin.allowDelete
				opsetAdmin.allowEdit = posAdmin.allowEdit
				opsetAdmin.allowRead = posAdmin.allowRead
				opsetAdmin.modifyAllRecords = posAdmin.modifyAllRecords
				opsetAdmin.viewAllRecords = posAdmin.viewAllRecords
				opsetAdmin.disabled_list_views = posAdmin.disabled_list_views
				opsetAdmin.disabled_actions = posAdmin.disabled_actions
				opsetAdmin.unreadable_fields = posAdmin.unreadable_fields
				opsetAdmin.uneditable_fields = posAdmin.uneditable_fields
				opsetAdmin.unrelated_objects = posAdmin.unrelated_objects
		if psetsUser
			posUser = Creator.getCollection("permission_objects").findOne({object_name: object_name, permission_set_id: psetsUser._id})
			if posUser
				opsetUser.allowCreate = posUser.allowCreate
				opsetUser.allowDelete = posUser.allowDelete
				opsetUser.allowEdit = posUser.allowEdit
				opsetUser.allowRead = posUser.allowRead
				opsetUser.modifyAllRecords = posUser.modifyAllRecords
				opsetUser.viewAllRecords = posUser.viewAllRecords
				opsetUser.disabled_list_views = posUser.disabled_list_views
				opsetUser.disabled_actions = posUser.disabled_actions
				opsetUser.unreadable_fields = posUser.unreadable_fields
				opsetUser.uneditable_fields = posUser.uneditable_fields
				opsetUser.unrelated_objects = posUser.unrelated_objects

		if !userId
			permissions = opsetAdmin
		else
			if Creator.isSpaceAdmin(spaceId, userId)
				permissions = opsetAdmin
			else
				permissions = opsetUser
		
		if psets.length > 0
			set_ids = _.pluck psets, "_id"
			pos = Creator.getCollection("permission_objects").find({object_name: object_name, permission_set_id: {$in: set_ids}}).fetch()
			_.each pos, (po)->
				if po.permission_set_id == psetsAdmin?._id or po.permission_set_id == psetsUser?._id
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

				permissions.disabled_list_views = unionPlus(permissions.disabled_list_views, po.disabled_list_views)
				permissions.disabled_actions = unionPlus(permissions.disabled_actions, po.disabled_actions)
				permissions.unreadable_fields = unionPlus(permissions.unreadable_fields, po.unreadable_fields)
				permissions.uneditable_fields = unionPlus(permissions.uneditable_fields, po.uneditable_fields)
				permissions.unrelated_objects = unionPlus(permissions.unrelated_objects, po.unrelated_objects)

		if object.is_view
			permissions.allowCreate = false
			permissions.allowEdit = false
			permissions.allowDelete = false
			permissions.modifyAllRecords = false
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
