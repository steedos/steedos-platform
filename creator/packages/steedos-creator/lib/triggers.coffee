@Triggers = {}

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


Triggers.init = (object_name)->
	collection = Creator.Collections[object_name]

	obj = Creator.getObject(object_name)
	if Triggers.default
		_.each Triggers.default, (trigger, trigger_name)->
			initTrigger collection, trigger_name, trigger

	if obj.triggers
		_.each obj.triggers, (trigger, trigger_name)->
			initTrigger collection, trigger_name, trigger

	if Meteor.isServer
		# 需要使用 object_name 变量
		collection.after.insert (userId, doc)->
			Meteor.call "object_recent_viewed", object_name, doc._id

if Meteor.isServer

	Triggers.default = 

		"before.insert": (userId, doc)->
			doc.owner = userId
			doc.created_by = userId;
			doc.created = new Date();
			doc.modified_by = userId;
			doc.modified = new Date();

		"before.update": (userId, doc, fieldNames, modifier, options)->
			modifier.$set = modifier.$set || {};
			modifier.$set.modified_by = userId
			modifier.$set.modified = new Date();


if Meteor.isClient

	Triggers.default = 

		"before.insert": (userId, doc)->
			doc.space = Session.get("spaceId")