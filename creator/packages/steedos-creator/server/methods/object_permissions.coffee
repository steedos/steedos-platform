Meteor.methods
	# Calculate Permissions on Server
	"creator.object_permissions": (spaceId)->
		self = this
		object_permissions = {}
		_.each Creator.objectsByName, (object, object_name)->
			if Creator.isSpaceAdmin(spaceId, self.userId)
				object_permissions[object_name] = _.clone(object.permission_set.admin)
			else
				object_permissions[object_name] = _.clone(object.permission_set.user)
			sets = Creator.getCollection("permission_set").find({users: self.userId}, {fields: {_id: 1}}).fetch()
			if sets.length>=0
				set_ids = _.pluck sets, "_id"
				pos = Creator.getCollection("permission_objects").find({object_name: object_name, permission_set_id: {$in: set_ids}}).fetch()
				_.each pos, (po)->
					if po.allowRead
						object_permissions[object_name].allowRead = true
					if po.allowCreate
						object_permissions[object_name].allowCreate = true
					if po.allowEdit
						object_permissions[object_name].allowEdit = true
					if po.allowDelete
						object_permissions[object_name].allowDelete = true
					if po.modifyAllRecords
						object_permissions[object_name].modifyAllRecords = true
					if po.viewAllRecords
						object_permissions[object_name].viewAllRecords = true

		return object_permissions
