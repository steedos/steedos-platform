Creator.isLoadingSpace = new ReactiveVar(true)

Creator.bootstrap = (callback)->
	Creator.isLoadingSpace.set(true)
	spaceId = Session.get("spaceId")
	unless spaceId
		return
	Meteor.call "creator.bootstrap", spaceId, (error, result)->
		if error or !result
			console.log error
		else
			if result.space._id != spaceId
				Steedos.setSpaceId(result.space._id)

			Creator.Objects = result.objects

			_.each Creator.Objects, (object, object_name)->
				Creator.loadObjects object, object_name

			_.each result.assigned_apps, (app_name)->
				Creator.Apps[app_name]?.visible = true

		if _.isFunction(callback)
			callback()

		Creator.isLoadingSpace.set(false)

Meteor.startup ->
	Tracker.autorun ->
		Creator.objects_initialized.set(false)
		Creator.bootstrap ()->
			Creator.objects_initialized.set(true)