initTrigger = (collection, trigger)->
	if trigger.when == "before.insert"
		collection.before.insert(trigger.action)
	else if trigger.when == "before.update"
		collection.before.update(trigger.action)
	else if trigger.when == "before.delete"
		collection.before.delete(trigger.action)
	else if trigger.when == "after.insert"
		collection.after.insert(trigger.action)
	else if trigger.when == "after.update"
		collection.after.update(trigger.action)
	else if trigger.when == "after.delete"
		collection.after.delete(trigger.action)


Creator.initTriggers = (object_name)->

	collection = Creator.Collections[object_name]

	obj = Creator.getObject(object_name)
	_.each obj.triggers, (trigger, trigger_name)->
		if Meteor.isServer and trigger.on == "server" and trigger.action and trigger.when
			initTrigger collection, trigger
		if Meteor.isClient and trigger.on == "client" and trigger.action and trigger.when
			initTrigger collection, trigger

	# 原则上 triggers 只在服务端执行
	if Meteor.isServer
		# 特例单独写，因为需要使用 object_name 变量
		collection.after.insert (userId, doc)->
			Meteor.call "object_recent_viewed", object_name, doc._id
