subs_objects = new SubsManager()

#_changeClientObjects = ()->
#	console.log "_changeClientObjects run.."
#	_objects = Creator.getCollection("objects").find({space: {$in: [null, Session.get("spaceId")]}})
#	_objects.forEach (doc)->
#		if _.size(doc.fields) > 0
#			#TODO list views
#			doc.list_views = {
#				default: {
#					columns: ["name", "description", "modified"]
#				}
#				all: {
#					filter_scope: "space"
#				}
#			}
#			Creator.convertObject(doc)
#			Creator.Objects[doc.name] = doc
#			Creator.loadObjects doc

_changeClientObjects = (document)->

	Meteor.setTimeout ()->
		console.log("document.name", document.name)
		if _.size(document.fields) > 0
			#TODO list views
			document.list_views = {
				default: {
					columns: ["name", "description", "modified"]
				}
				all: {
					filter_scope: "space"
				}
			}
			Creator.convertObject(document)
			Creator.Objects[document.name] = document
			Creator.loadObjects document
			#TODO 更新object permissions
	, 1

_removeClientObjects = (document)->
	Creator.removeObject(document.name)
	Creator.removeCollection(document.name)

_loadObjectsPremissions = ()->
	console.log "Creator.bootstrap....................."
	Creator.bootstrap()

Meteor.startup ()->
	Tracker.autorun (c)->
		spaceId = Session.get("spaceId")
		if spaceId
			console.log "subscribe -> creator_objects"
			subs_objects.subscribe "creator_objects", spaceId

#	Tracker.autorun (c)->
#		spaceId = Session.get("spaceId")
#		console.log("spaceId", spaceId)
#		console.log "subs_objects.ready()", subs_objects.ready()
#		if subs_objects.ready() && spaceId
#			Tracker.nonreactive _changeClientObjects

	tid = 0

	Creator.getCollection("objects").find().observe {
		added: (newDocument)->
			_changeClientObjects newDocument
			Meteor.clearTimeout(tid)
			tid = Meteor.setTimeout(_loadObjectsPremissions, 2000)
		changed: (newDocument, oldDocument)->
			_changeClientObjects newDocument
		removed: (oldDocument)->
			_removeClientObjects oldDocument
	}