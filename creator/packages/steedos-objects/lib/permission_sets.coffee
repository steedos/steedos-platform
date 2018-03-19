if Meteor.isServer

	Creator.getAllPermissions = (spaceId, userId)->
		permissions = 
			objects: {}
			assigned_apps: []
		psets = Creator.getCollection("permission_set").find({users: userId}).fetch()
		permissions.assigned_apps = _.pluck psets, "assigned_apps"
		_.each Creator.objectsByName, (object, object_name)->
			permissions.objects[object_name] = Creator.Objects[object_name]
			permissions.objects[object_name]["permissions"] = Creator.getObjectPermissions(spaceId, userId, object_name)
		return permissions

	unionPlus = (array,other)->
		if !array and !other
			return undefined
		if !array
			array = []
		if !other
			other = []
		return _.union(array,other)

	Creator.getObjectPermissions = (spaceId, userId, object_name)->
		permissions = {}
		object = Creator.getObject(object_name)
		psetsAdmin = Creator.getCollection("permission_set").findOne({space: spaceId, name: 'admin'}, {fields:{_id:1}})
		psetsUser = Creator.getCollection("permission_set").findOne({space: spaceId, name: 'user'}, {fields:{_id:1}})
		opsetAdmin = _.clone(object.permission_set.admin)
		opsetUser = _.clone(object.permission_set.user)

		sharedListViews = Creator.getCollection('object_listviews').find({space: spaceId, object_name: object_name, shared: true}, {fields:{_id:1}}).fetch()
		sharedListViews = _.pluck(sharedListViews,"_id")
		if sharedListViews.length
			unless opsetAdmin.list_views
				opsetAdmin.list_views = []
			opsetAdmin.list_views = _.union opsetAdmin.list_views, sharedListViews
			unless opsetUser.list_views
				opsetUser.list_views = []
			opsetUser.list_views = _.union opsetUser.list_views, sharedListViews


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
				opsetAdmin.list_views = posAdmin.list_views
				opsetAdmin.actions = posAdmin.actions
				opsetAdmin.readable_fields = posAdmin.readable_fields
				opsetAdmin.editable_fields = posAdmin.editable_fields
				opsetAdmin.related_objects = posAdmin.related_objects
		if psetsUser
			posUser = Creator.getCollection("permission_objects").findOne({object_name: object_name, permission_set_id: psetsUser._id})
			if posUser
				opsetUser.allowCreate = posUser.allowCreate
				opsetUser.allowDelete = posUser.allowDelete
				opsetUser.allowEdit = posUser.allowEdit
				opsetUser.allowRead = posUser.allowRead
				opsetUser.modifyAllRecords = posUser.modifyAllRecords
				opsetUser.viewAllRecords = posUser.viewAllRecords
				opsetUser.list_views = posUser.list_views
				opsetUser.actions = posUser.actions
				opsetUser.readable_fields = posUser.readable_fields
				opsetUser.editable_fields = posUser.editable_fields
				opsetUser.related_objects = posUser.related_objects

		if !userId
			permissions = opsetAdmin
		else
			if Creator.isSpaceAdmin(spaceId, userId)
				permissions = opsetAdmin
			else
				permissions = opsetUser
		
		psets = Creator.getCollection("permission_set").find({users: userId, space: spaceId}, {fields:{_id:1}}).fetch()
		
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

				permissions.list_views = unionPlus(permissions.list_views, po.list_views)
				permissions.actions = unionPlus(permissions.actions, po.actions)
				permissions.readable_fields = unionPlus(permissions.readable_fields,po.readable_fields)
				permissions.editable_fields = unionPlus(permissions.editable_fields,po.editable_fields)
				permissions.related_objects = unionPlus(permissions.related_objects, po.related_objects)

		if object.is_view
			permissions.allowCreate = false
			permissions.allowEdit = false
			permissions.allowDelete = false
			permissions.modifyAllRecords = false
			permissions.actions = []

		Creator.processPermissions permissions

		return permissions


	Creator.initPermissions = (object_name)->

		# 应该把计算出来的
		Creator.Collections[object_name].allow
			insert: (userId, doc) ->
				if !userId 
					return false
				if !doc.space
					return false
				permissions = Creator.getObjectPermissions(doc.space, userId, object_name)
				if !permissions.allowCreate
					return false

				return true
			update: (userId, doc) ->
				if !userId 
					return false
				if !doc.space
					return false
				permissions = Creator.getObjectPermissions(doc.space, userId, object_name)
				if !permissions.allowEdit
					return false
				return true
			remove: (userId, doc) ->
				if !userId 
					return false
				if !doc.space
					return false
				permissions = Creator.getObjectPermissions(doc.space, userId, object_name)
				if !permissions.allowDelete
					return false
				return true

	Meteor.methods
		# Calculate Permissions on Server
		"creator.object_permissions": (spaceId)->
			return Creator.getAllPermissions(spaceId, this.userId)
