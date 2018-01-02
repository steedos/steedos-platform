initTrigger = (object_name, trigger)->
	collection = Creator.Collections[object_name]
	if !trigger.todo 
		return
	todoWrapper = ()->
		this.object_name = object_name
		return trigger.todo.apply(this,arguments)
	if trigger.when == "before.insert"
		collection.before.insert(todoWrapper)
	else if trigger.when == "before.update"
		collection.before.update(todoWrapper)
	else if trigger.when == "before.remove"
		collection.before.remove(todoWrapper)
	else if trigger.when == "after.insert"
		collection.after.insert(todoWrapper)
	else if trigger.when == "after.update"
		collection.after.update(todoWrapper)
	else if trigger.when == "after.remove"
		collection.after.remove(todoWrapper)


Creator.initTriggers = (object_name)->

	obj = Creator.getObject(object_name)
	_.each obj.triggers, (trigger, trigger_name)->
		if Meteor.isServer and trigger.on == "server" and trigger.todo and trigger.when
			initTrigger object_name, trigger
		if Meteor.isClient and trigger.on == "client" and trigger.todo and trigger.when
			initTrigger object_name, trigger
