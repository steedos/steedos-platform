Meteor.startup ()->

	_changeServerObjects = (document)->
#		console.log "change object" , document.name
		if _.size(document.fields) > 0
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
