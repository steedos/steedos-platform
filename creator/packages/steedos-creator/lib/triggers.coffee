initTrigger = (collection, trigger_name, trigger)->
	if trigger_name == "before.insert"
		collection.before.insert(trigger)
	else if trigger_name == "before.update"
		collection.before.update(trigger)
	else if trigger_name == "before.delete"
		collection.before.delete(trigger)
	else if trigger_name == "after.insert"
		collection.after.insert(trigger)
	else if trigger_name == "after.update"
		collection.after.update(trigger)
	else if trigger_name == "after.delete"
		collection.after.delete(trigger)


Creator.initTriggers = (object_name)->

	collection = Creator.Collections[object_name]

	# 原则上 triggers 只在服务端执行
	if Meteor.isServer

		obj = Creator.getObject(object_name)
		_.each obj.triggers_server, (trigger, trigger_name)->
			initTrigger collection, trigger_name, trigger

		# 特例单独写，因为需要使用 object_name 变量
		collection.after.insert (userId, doc)->
			Meteor.call "object_recent_viewed", object_name, doc._id

	if Meteor.isClient
		
		obj = Creator.getObject(object_name)
		_.each obj.triggers_client, (trigger, trigger_name)->
			initTrigger collection, trigger_name, trigger
