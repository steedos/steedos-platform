Template.creatorLayout.helpers
	subsReady: ->
		return true #Creator.subs["Creator"].ready()

	collection: ()->
		# return "Creator.Collections." + Session.get("object_name")
		return Session.get("action_collection")

	fields: ->
		# return Template.instance()?.edit_fields.get()
		return Session.get("action_fields")

	# editCollection: ()->
	# 	# return Template.instance()?.edit_collection?.get() || Session.get("action_editing_collection")
	# 	return Session.get("action_editing_collection")

	collectionName: ()->
		# return Template.instance().collection_name?.get()
		return Session.get("action_collection_name")

	# related_collection: ()->
	# 	return Session.get("action_adding_collection")
	# 	# return Template.instance()?.related_collection?.get()

	# editFields: ()->
	# 	return Session.get("action_editing_fields")
	# 	# return Template.instance()?.edit_fields?.get()

	doc: ()->
		return Session.get("action_record_id")

	saveAndInsert: ()->
		return Session.get("action_save_and_insert")