Meteor.startup ()->

	convertTriggersTODOToFunction = (object)->
		_.forEach object.triggers, (trigger, k)->
			_todo = trigger.todo
			if _todo
				#只有update时， fieldNames, modifier, options 才有值
				trigger.todo = (userId, doc, fieldNames, modifier, options)->
					#TODO 控制可使用的变量，尤其是Collection
					Creator.evalInContext(_todo)

	Creator.getCollection("objects").find().observe {
		added: (newDocument)->
			if _.size(newDocument.fields) > 0
				convertTriggersTODOToFunction(newDocument)
				Creator.loadObjects newDocument
		changed: (newDocument, oldDocument)->
			if _.size(newDocument.fields) > 0
				convertTriggersTODOToFunction(newDocument)
				Creator.loadObjects newDocument
		removed: (oldDocument)->
			if _.size(oldDocument.fields) > 0
				Creator.loadObjects oldDocument #TODO removeObject
	}
