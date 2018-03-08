subs_objects = new SubsManager()

_changeClientObjects = ()->
	console.log "_changeClientObjects run.."
	_objects = Creator.getCollection("objects").find({space: {$in: [null, Session.get("spaceId")]}})
	_objects.forEach (doc)->
		if _.size(doc.fields) > 0
			#TODO list views
			doc.list_views = {
				default: {
					columns: ["name", "description", "modified"]
				}
				all: {
					filter_scope: "space"
				}
			}

			_.forEach doc.actions, (action, key)->
				_todo = action?.todo
				if _todo
					action.todo = ()->
						#TODO 控制可使用的变量
						Creator.evalInContext(_todo)


			Creator.Objects[doc.name] = doc
			Creator.loadObjects doc
	if _objects.count() > 0
		Creator.bootstrap()

Meteor.startup ()->
	Tracker.autorun (c)->
		spaceId = Session.get("spaceId")
		if spaceId
			console.log "subscribe -> creator_objects"
			subs_objects.subscribe "creator_objects", spaceId

	Tracker.autorun (c)->
		spaceId = Session.get("spaceId")
		console.log("spaceId", spaceId)
		if subs_objects.ready() && spaceId
			Tracker.nonreactive _changeClientObjects
