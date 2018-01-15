Creator.permissionSetByName = 
	admin: 
		objects: {}
		fields: {}
	user: 
		objects: {}
		fields: {}

Creator.getPermissionSet = (name)->
	return Creator.permissionSetByName[name]



if Meteor.isServer

	Creator.getPermissions = (spaceId, userId)->
		permissions = 
			objects: {}
			assigned_apps: []
		psets = Creator.getCollection("permission_set").find({users: userId}).fetch()
		permissions.assigned_apps = _.pluck psets, "assigned_apps"
		_.each Creator.objectsByName, (object, object_name)->
			permissions.objects[object_name] = Creator.getObjectPermissions(spaceId, userId, object_name)
		return permissions

	Creator.getObjectPermissions = (spaceId, userId, object_name)->
		permissions = {}
		psets = Creator.getCollection("permission_set").find({users: userId}).fetch()
		object = Creator.getObject(object_name)
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
		
			permissions.fields = {}
			pfs = Creator.getCollection("permission_fields").find({object_name: object_name, permission_set_id: {$in: set_ids}}).fetch()
			_.each pfs, (pf)->
				permissions.fields[pf.field_name] = {}
				if !pf.allowRead
					permissions.fields[pf.field_name].hidden = true
				if !pf.allowEdit
					permissions.fields[pf.field_name].readonly = true
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
			return Creator.getPermissions(spaceId, this.userId)


if Meteor.isClient

	Tracker.autorun ->
		if Session.get("spaceId")
			Meteor.call "creator.object_permissions", Session.get("spaceId"), (error, result)->
				if error
					console.log error
				else
					_.each result.objects, (permissions, object_name)->
						object = Creator.getObject(object_name)
						unless object
							return
						object.permissions.set(permissions)
						_.each permissions.fields, (field, field_name)->
							f = object.fields[field_name]
							if f
								fs = object.schema._schema[field_name]
								if !fs.autoform
									fs.autoform = {}
								if field.readonly
									f.readonly = true
									fs.autoform.readonly = true
									fs.autoform.disabled = true
								if field.hidden
									f.hidden = true
									f.omit = true
									fs.autoform.omit = true
					_.each result.assigned_apps, (app_name)->
						Creator.Apps[app_name]?.visible = true