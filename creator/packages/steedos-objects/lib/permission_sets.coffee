if Meteor.isServer

	Creator.getAllPermissions = (spaceId, userId)->
		permissions = 
			objects: {}
			assigned_apps: []
		psets = Creator.getCollection("permission_set").find({users: userId}).fetch()
		permissions.assigned_apps = _.pluck psets, "assigned_apps"
		_.each Creator.objectsByName, (object, object_name)->
			permissions.objects[object_name] = Creator.getObjectPermissions(spaceId, userId, object_name)
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
		psets = Creator.getCollection("permission_set").find({users: userId, space: spaceId}).fetch()
		object = Creator.getObject(object_name)
		if !userId
			permissions = _.clone(object.permission_set.admin)
		else
			if Creator.isSpaceAdmin(spaceId, userId)
				permissions = _.clone(object.permission_set.admin)
			else
				permissions = _.clone(object.permission_set.user)

		if psets.length>=0
			set_ids = _.pluck psets, "_id"
			pos = Creator.getCollection("permission_objects").find({object_name: object_name, permission_set_id: {$in: set_ids}}).fetch()
			_.each pos, (po)->
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
