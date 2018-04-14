Creator.bootstrapLoaded = new ReactiveVar(false)

Creator.bootstrap = (spaceId, callback)->
	Creator.bootstrapLoaded.set(false)
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

			_.each Creator.Apps, (app, key) ->
				if !app._id
					app._id = key

			apps = result.assigned_apps
			if apps.length
				_.each Creator.Apps, (app, key)->
					if apps.indexOf(key) > -1
						app.visible = true
					else
						app.visible = false

		if _.isFunction(callback)
			callback()

		Creator.bootstrapLoaded.set(true)

Meteor.startup ->
	Tracker.autorun ->
		spaceId = Session.get("spaceId")
		Creator.bootstrap spaceId, ()->
			return
