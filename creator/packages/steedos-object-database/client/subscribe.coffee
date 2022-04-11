subs_objects = new SubsManager()
Creator._subApp = new ReactiveVar({});

lazyLoadAppsMenusId = null;
lazyLoadAppsMenus = ()->
	if lazyLoadAppsMenusId
		clearTimeout(lazyLoadAppsMenusId)

	lazyLoadAppsMenusId = setTimeout ()->
		Creator.loadAppsMenus();
		lazyLoadAppsMenusId = null;
	, 5000

lazyChangeClientObjectsId = null;
lazyChangeClientObjectsApiNames = [];
lazyChangeClientObjects = (objectApiName)->
	if lazyChangeClientObjectsId
		clearTimeout(lazyChangeClientObjectsId)
	lazyChangeClientObjectsApiNames.push(objectApiName)
	lazyChangeClientObjectsId = Meteor.setTimeout ()->
		_getObjects lazyChangeClientObjectsApiNames, (result)->
			if result && result.objects
				_.each(result.objects, (objectSchema)->
					if _.size(objectSchema.fields) > 0
						delete Creator._recordSafeObjectCache[objectSchema.name]
						try
							oldObject = Creator.getObject(objectSchema.name);
							if oldObject
								objectSchema = _.extend objectSchema, { list_views: oldObject.list_views }
						catch e
							console.error(e);
						Creator.Objects[objectSchema.name] = objectSchema
						Creator.loadObjects objectSchema
						Creator.deps.object.changed();
				)
	, 5000

_changeClientApps = (document)->
	lazyLoadAppsMenus();
	Creator.Apps[document.code] = document
	Creator._subApp.set(Object.assign(document ,{ _id: document.code}))
	if Session.get("app_id") == document._id
		Creator.deps.app.changed();

_changeClientObjects = (document, oldDocument)->
	if !Steedos.isSpaceAdmin() && !document.is_enable
		return ;

	if !Steedos.isSpaceAdmin() && document.in_development != '0'
		return ;

	SteedosUI.reloadObject document.name
	lazyLoadAppsMenus();

#	type = "added"
#	if !_.isEmpty(_.findWhere(Creator.objectsByName, {_id: document._id}))
#		type = "changed"
	lazyChangeClientObjects(document.name)

	try
		if oldDocument && document && oldDocument.name != document.name
			_removeClientObjects(oldDocument);
	catch e
		console.error(e);

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

reloadObject  = () ->
	Setup.bootstrap(Steedos.getSpaceId());
	Meteor.setTimeout ()->
		Creator.deps.object.changed()
	, 3000
_getObject = (objectId, callback)->
	if !objectId || !_.isString(objectId)
		return
	spaceId = Session.get("spaceId")
	$.ajax
		type: "get"
		url: Steedos.absoluteUrl "/api/bootstrap/#{spaceId}/#{objectId}"
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

_getObjects = (objectApiNames, callback)->
	objectApiNames = _.compact(_.uniq(objectApiNames))
	if !objectApiNames || !_.isArray(objectApiNames) || _.isEmpty(objectApiNames)
		return
	spaceId = Session.get("spaceId")
	$.ajax
		type: "get"
		url: Steedos.absoluteUrl "/api/bootstrap/#{spaceId}/#{objectApiNames.join(',')}"
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

# Meteor.startup ()->
# 	Tracker.autorun (c)->
# 		spaceId = Session.get("spaceId")
# 		if spaceId
# #			subs_objects.subscribe "creator_apps", spaceId
# 			subs_objects.subscribe "creator_objects", spaceId
# 			subs_objects.subscribe "creator_reload_object_logs", spaceId


	Tracker.autorun (c) ->
		if Creator.bootstrapLoaded.get()
# 			objects_observer_init = false
# 			Creator.getCollection("objects").find({is_deleted: {$ne: true}}).observe {
# #				added: (newDocument)->
# #					if objects_observer_init
# #						_changeClientObjects newDocument
# 				changed: (newDocument, oldDocument)->
# 					if objects_observer_init
# 						if !Steedos.isSpaceAdmin() && (newDocument.is_enable == false || newDocument.in_development != '0')
# 							_removeClientObjects newDocument
# 						else
# 							_changeClientObjects newDocument, oldDocument
# #							Meteor.setTimeout ()->
# #								_changeClientObjects newDocument
# #							, 5000
# 				removed: (oldDocument)->
# 					if objects_observer_init
# 						_removeClientObjects oldDocument
# 			}
# 			objects_observer_init = true

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

			# reload_objects_observer_init = false
			# Creator.getCollection("_object_reload_logs").find({}).observe {
			# 	added: (newDocument)->
			# 		if reload_objects_observer_init
			# 			_changeClientObjects({name: newDocument.object_name})
			# }
			# reload_objects_observer_init = true

# Meteor.startup ()->
# 	Tracker.autorun (c)->
# 		spaceId = Session.get("spaceId")
# 		if spaceId
# 			subs_objects.subscribe "publish_object_layouts", spaceId

# 	Tracker.autorun (c) ->
# 		if Creator.bootstrapLoaded.get()
# 			layouts_observer_init = false
# 			Creator.getCollection("object_layouts").find().observe {
# 				changed: (newDocument, oldDocument)->
# 					if layouts_observer_init
# 						_object = Creator.getObject(newDocument.object_name)
# 						if _object
# 							_changeClientObjects _object
# 				removed: (oldDocument)->
# 					if layouts_observer_init
# 						_object = Creator.getObject(oldDocument.object_name)
# 						if _object
# 							_changeClientObjects {_id: _object._id, name: oldDocument.object_name}
# 			}
# 			layouts_observer_init = true