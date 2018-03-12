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
				if posAdmin.list_views?.length
					opsetAdmin.list_views = posAdmin.list_views
				if posAdmin.actions?.length
					opsetAdmin.actions = posAdmin.actions
				if posAdmin.fields?.length
					opsetAdmin.fields = posAdmin.fields
				if posAdmin.related_objects?.length
					opsetAdmin.related_objects = posAdmin.related_objects
				if posAdmin.readonly_fields?.length
					opsetAdmin.readonly_fields = posAdmin.readonly_fields
		if psetsUser
			posUser = Creator.getCollection("permission_objects").findOne({object_name: object_name, permission_set_id: psetsUser._id})
			if posUser
				opsetUser.allowCreate = posUser.allowCreate
				opsetUser.allowDelete = posUser.allowDelete
				opsetUser.allowEdit = posUser.allowEdit
				opsetUser.allowRead = posUser.allowRead
				opsetUser.modifyAllRecords = posUser.modifyAllRecords
				opsetUser.viewAllRecords = posUser.viewAllRecords
				if posUser.list_views?.length
					opsetUser.list_views = posUser.list_views
				if posUser.actions?.length
					opsetUser.actions = posUser.actions
				if posUser.fields?.length
					opsetUser.fields = posUser.fields
				if posUser.related_objects?.length
					opsetUser.related_objects = posUser.related_objects
				if posUser.readonly_fields?.length
					opsetUser.readonly_fields = posUser.readonly_fields

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
			if object_name == "contacts"
				console.log "pos:", pos
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
					permissions.allowCreate = true
					permissions.allowEdit = true
					permissions.allowDelete = true
				if po.viewAllRecords
					permissions.viewAllRecords = true
					permissions.allowRead = true

				permissions.list_views = unionPlus(permissions.list_views, po.list_views)
				permissions.actions = unionPlus(permissions.actions, po.actions)
				permissions.fields = unionPlus(permissions.fields,po.fields)
				permissions.related_objects = unionPlus(permissions.related_objects, po.related_objects)
				if po.readonly_fields?.length
					if permissions.readonly_fields
						permissions.readonly_fields = _.intersection(permissions.readonly_fields, po.readonly_fields)
					else
						permissions.readonly_fields = po.readonly_fields

		if object_name == "contacts"
			console.log "permissions:", permissions
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
