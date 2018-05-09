subs_objects = new SubsManager()

_changeClientApps = (document)->
	Creator.Apps[document._id] = document
	if Session.get("app_id") == document._id
		Creator.deps.app.changed();

_changeClientObjects = (document)->
	type = "added"

	if !_.isEmpty(_.findWhere(Creator.objectsByName, {_id: document._id}))
		type = "changed"

	_getObject document._id, type, (result)->
		if _.size(result.fields) > 0
			old_obj = Creator.Objects[result.name]
			if type != "added"
				result.permissions = old_obj?.permissions || {}
			Creator.Objects[result.name] = result
			Creator.loadObjects result
			if Session.get("object_name")
				Creator.deps.object.changed();

_removeClientObjects = (document)->
	_object = _.findWhere Creator.objectsByName, {_id: document._id}
	Creator.removeObject(_object?.name)
	Creator.removeCollection(_object?.name)
	if Session.get("object_name") == _object?.name
		FlowRouter.go(Creator.getRelativeUrl())
	Creator.deps.object.changed();

_removeClientApps = (document)->
	delete Creator.Apps[document._id]
	if Session.get("app_id") == document._id
		# FlowRouter.go(Creator.getRelativeUrl())
		FlowRouter.go("/")

#_loadObjectsPremissions = ()->
#	Creator.bootstrap()


_getObject = (objectId, type, callback)->
	if !objectId || !_.isString(objectId)
		return
	spaceId = Session.get("spaceId")
	$.ajax
		type: "get"
		url: Steedos.absoluteUrl "/api/creator/#{spaceId}/objects/#{objectId}?type=#{type}"
		dataType: "json"
		beforeSend: (request) ->
			request.setRequestHeader('X-User-Id', Meteor.userId())
			request.setRequestHeader('X-Auth-Token', Accounts._storedLoginToken())
		error: (jqXHR, textStatus, errorThrown) ->
			error = jqXHR.responseJSON
			console.error error
			if error?.reason
				toastr?.error?(TAPi18n.__(error.reason))
			else if error?.message
				toastr?.error?(TAPi18n.__(error.message))
			else
				toastr?.error?(error)
		success: (result) ->
			if _.isFunction(callback)
				callback(result)

Meteor.startup ()->
	Tracker.autorun (c)->
		spaceId = Session.get("spaceId")
		if spaceId
#			subs_objects.subscribe "creator_apps", spaceId
			subs_objects.subscribe "creator_objects", spaceId


	Tracker.autorun (c) ->
		if Creator.bootstrapLoaded.get()
			objects_observer_init = false
			Creator.getCollection("objects").find().observe {
#				added: (newDocument)->
#					if objects_observer_init
#						_changeClientObjects newDocument
				changed: (newDocument, oldDocument)->
					if objects_observer_init
						_changeClientObjects newDocument
				removed: (oldDocument)->
					if objects_observer_init
						console.log("removed oldDocument", oldDocument)
						_removeClientObjects oldDocument
			}
			objects_observer_init = true

			apps_observer_init = false
			Creator.getCollection("apps").find({is_creator: true}).observe {
				added: (newDocument)->
					if apps_observer_init
						_changeClientApps(newDocument)
				changed: (newDocument, oldDocument)->
					if apps_observer_init
						_changeClientApps(newDocument)
				removed: (oldDocument)->
					if apps_observer_init
						console.log("apps removed",oldDocument );
						_removeClientApps(oldDocument)
			}
			apps_observer_init = true

