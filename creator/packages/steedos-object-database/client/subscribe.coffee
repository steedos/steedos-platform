subs_objects = new SubsManager()

Meteor.startup ()->
	Tracker.autorun (c)->
		spaceId = Session.get("spaceId")
		if spaceId
			console.log "subscribe -> creator_objects"
			subs_objects.subscribe "creator_objects", spaceId

	Tracker.autorun (c)->
		spaceId = Session.get("spaceId")
		if subs_objects.ready() && spaceId
			console.log "subs_objects.ready。。。"
			_objects = Creator.getCollection("objects").find({space: {$in: [null, spaceId]}})
			_objects.forEach (doc)->
				Creator.Objects[doc.name] = doc
				if _.size(doc.fields) > 0

					doc.list_views = {
						default: {
							columns: ["name", "description", "modified"]
						}
						all: {
							filter_scope: "space"
						}
					}

					Creator.loadObjects doc
					console.log 'loadObject', doc

			if _objects.count() > 0
				Creator.bootstrap()