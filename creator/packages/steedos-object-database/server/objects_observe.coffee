Meteor.startup ()->

	_changeServerObjects = (document)->
		if _.size(document.fields) > 0
			Creator.Objects[document.name] = document
			Creator.loadObjects document

	_removeServerObjects = (document)->
		Creator.removeObject(document.name)

	Creator.getCollection("objects").find({is_enable: true}).observe {
		added: (newDocument)->
			_changeServerObjects newDocument
		changed: (newDocument, oldDocument)->
			_changeServerObjects newDocument
		removed: (oldDocument)->
			_removeServerObjects oldDocument
	}
