Meteor.methods
	uninstallAppTemplate: (space_id, unique_id, appVersion)->
		userId = this.userId

		if !userId
			throw new Meteor.Error("401", "Authentication is required and has not been provided.")

		if !Creator.isSpaceAdmin(space_id, userId)
			throw new Meteor.Error("401", "Permission denied.")

		Creator.getCollection("objects").remove({space: space_id, app_unique_id: unique_id.toString()})

		Creator.getCollection("apps").remove({space: space_id, unique_id: unique_id})