Template.creatorLayout.helpers Creator.helpers

Template.creatorLayout.helpers
	subsReady: ->
		return true #Creator.subs["Creator"].ready()
	
	isloading: ->
		return Creator.isloading()

	collection: ()->
		return Session.get("action_collection")

	fields: ->
		return Session.get("action_fields")

	collectionName: ()->
		return Session.get("action_collection_name")

	doc: ()->
		return Session.get("action_record_id")

	saveAndInsert: ()->
		return Session.get("action_save_and_insert")