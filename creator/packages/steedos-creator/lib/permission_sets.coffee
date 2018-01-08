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

	Meteor.methods
		# Calculate Permissions on Server
		"creator.object_permissions": (spaceId)->
			self = this
			permissions = 
				objects: {}
				assigned_apps: []
			psets = Creator.getCollection("permission_set").find({users: self.userId}).fetch()
			permissions.assigned_apps = _.pluck psets, "assigned_apps"
			_.each Creator.objectsByName, (object, object_name)->
				if Creator.isSpaceAdmin(spaceId, self.userId)
					permissions.objects[object_name] = _.clone(object.permission_set.admin)
				else
					permissions.objects[object_name] = _.clone(object.permission_set.user)
				if psets.length>=0
					set_ids = _.pluck psets, "_id"
					pos = Creator.getCollection("permission_objects").find({object_name: object_name, permission_set_id: {$in: set_ids}}).fetch()
					_.each pos, (po)->
						if po.allowRead
							permissions.objects[object_name].allowRead = true
						if po.allowCreate
							permissions.objects[object_name].allowCreate = true
						if po.allowEdit
							permissions.objects[object_name].allowEdit = true
						if po.allowDelete
							permissions.objects[object_name].allowDelete = true
						if po.modifyAllRecords
							permissions.objects[object_name].modifyAllRecords = true
						if po.viewAllRecords
							permissions.objects[object_name].viewAllRecords = true

				
					permissions.objects[object_name].fields = {}
					pfs = Creator.getCollection("permission_fields").find({object_name: object_name, permission_set_id: {$in: set_ids}}).fetch()
					_.each pfs, (pf)->
						permissions.objects[object_name].fields[pf.field_name] = {}
						if !pf.allowRead
							permissions.objects[object_name].fields[pf.field_name].hidden = true
						if !pf.allowEdit
							permissions.objects[object_name].fields[pf.field_name].readonly = true

			return permissions


if Meteor.isClient

	Tracker.autorun ->
		if Session.get("spaceId")
			Meteor.call "creator.object_permissions", Session.get("spaceId"), (error, result)->
				if error
					console.log error
				else
					_.each result.objects, (permissions, object_name)->
						Creator.getObject(object_name).permissions.set(permissions)
						_.each permissions.fields, (field, field_name)->
							f = Creator.getObject(object_name).fields[field_name]
							if f
								fs = Creator.getObject(object_name).schema._schema[field_name]
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