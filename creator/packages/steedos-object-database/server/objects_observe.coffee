Meteor.startup ()->
	Creator.getCollection("objects").find().observe {
		added: (newDocument)->
			if _.size(newDocument.fields) > 0
				Creator.loadObjects newDocument
		changed: (newDocument, oldDocument)->
			if _.size(newDocument.fields) > 0
				Creator.loadObjects newDocument
		removed: (oldDocument)->
			if _.size(oldDocument.fields) > 0
				Creator.loadObjects oldDocument #TODO removeObject
	}
