Meteor.startup ()->

	_changeServerObjects = (document)->
#		console.log "change object" , document.name
		if _.size(document.fields) > 0
#
#			all_viewlist = Creator.getCollection("object_listviews").findOne({space: document.space, object_name: document.name, shared: true, name: "all"})
#
#			if all_viewlist
#
#				if !document.list_views
#					document.list_views = {}
#
#				if !document.list_views.all
#					document.list_views.all = all_viewlist
			Creator.Objects[document.name] = document
			Creator.loadObjects document

	_removeServerObjects = (document)->
		Creator.removeObject(document.name)

	Creator.getCollection("objects").find().observe {
		added: (newDocument)->
			_changeServerObjects newDocument
		changed: (newDocument, oldDocument)->
			_changeServerObjects newDocument
		removed: (oldDocument)->
			_removeServerObjects oldDocument
	}
