subs_objects = new SubsManager()
Creator._subApp = new ReactiveVar({});
_changeClientApps = (document)->
	Creator.Apps[document.code] = document
	Creator._subApp.set(Object.assign(document ,{ _id: document.code}))
	if Session.get("app_id") == document._id
		Creator.deps.app.changed();

_changeClientObjects = (document)->
	if !Steedos.isSpaceAdmin() && !document.is_enable
		return ;

	if !Steedos.isSpaceAdmin() && document.in_development != '0'
		return ;

	type = "added"
	if !_.isEmpty(_.findWhere(Creator.objectsByName, {_id: document._id}))
		type = "changed"

	_getObject document._id, type, (result)->
		if _.size(result.fields) > 0
			old_obj = Creator.Objects[result.name]
			if type != "added"
				result.permissions = old_obj?.permissions || {}
			delete Creator._recordSafeObjectCache[result.name]
			Creator.Objects[result.name] = result
			Creator.loadObjects result
#			if Session.get("object_name")
			Creator.deps.object.changed();

_removeClientObjects = (document)->
	_object = _.findWhere Creator.objectsByName, {_id: document._id}
	Creator.removeObject(_object?.name)
#	Creator.removeCollection(_object?.name)
	if Session.get("object_name") == _object?.name
		FlowRouter.go("/")
	Creator.deps.object.changed();

_removeClientApps = (document)->
	delete Creator.Apps[document.code]
	Creator._subApp.set(Object.assign({}, document, {visible: false, _id: document.code}))
	if Session.get("app_id") == document.code || Session.get("app_id") == document._id
		Session.set("app_id", null)
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
			Creator.getCollection("objects").find({is_deleted: {$ne: true}}).observe {
#				added: (newDocument)->
#					if objects_observer_init
#						_changeClientObjects newDocument
				changed: (newDocument, oldDocument)->
					if objects_observer_init
						if !Steedos.isSpaceAdmin() && (newDocument.is_enable == false || newDocument.in_development != '0')
							_removeClientObjects newDocument
						else
							Meteor.setTimeout ()->
								_changeClientObjects newDocument
							, 5000
				removed: (oldDocument)->
					if objects_observer_init
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
						_removeClientApps(oldDocument)
			}
			apps_observer_init = true

Meteor.startup ()->
	Tracker.autorun (c)->
		spaceId = Session.get("spaceId")
		if spaceId
			subs_objects.subscribe "publish_object_layouts", spaceId

	Tracker.autorun (c) ->
		if Creator.bootstrapLoaded.get()
			layouts_observer_init = false
			Creator.getCollection("object_layouts").find().observe {
				changed: (newDocument, oldDocument)->
					if layouts_observer_init
						_object = Creator.getObject(newDocument.object_name)
						if _object
							_changeClientObjects _object
				removed: (oldDocument)->
					if layouts_observer_init
						_object = Creator.getObject(oldDocument.object_name)
						if _object
							_changeClientObjects {_id: _object._id}
			}
			layouts_observer_init = true