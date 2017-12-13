Template.creator_view.helpers

	collection: ()->
		return "Creator.Collections." + Session.get("object_name")

	hasPermission: (permissionName)->
		permissions = Creator.getObject()?.permissions?.default
		if permissions
			return permissions[permissionName]

	record: ()->
		return Creator.getObjectRecord()

	backUrl: ()->
		return Creator.getObjectUrl()

	showForm: ()->
		if Creator.getObjectRecord()
			return true

	hasPermission: (permissionName)->
		permissions = Creator.Objects[Session.get("object_name")]?.permissions?.default
		if permissions
			return permissions[permissionName]

Template.creator_view.events