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
			object_listviews = result.object_listviews

			_.each Creator.Objects, (object, object_name)->
				_.extend object.list_views, object_listviews[object_name]
				Creator.loadObjects object, object_name

			Creator.Apps = result.apps

			apps = result.assigned_apps
			if apps.length
				_.each Creator.Apps, (app, key)->
					if apps.indexOf(key) > -1
						app.visible = true
					else
						app.visible = false

		if _.isFunction(callback)
			callback()

		Creator.isLoadingSpace.set(false)

Meteor.startup ->
	Tracker.autorun ->
		Creator.objects_initialized.set(false)
		Creator.bootstrap ()->
			Creator.objects_initialized.set(true)