Template.related_object_list.helpers
	related_object_label: ()->
		return Creator.getObject(Session.get("related_object_name")).label

	object_label: ()->
		object_name = Session.get "object_name"
		return Creator.getObject(object_name).label
	
	record_name: ()->
		object_name = Session.get "object_name"
		record_id = Session.get "record_id"
		name_field_key = Creator.getObject(object_name).NAME_FIELD_KEY
		if Creator.getCollection(object_name).findOne(record_id)
			return Creator.getCollection(object_name).findOne(record_id)[name_field_key]

	record_url: ()->
		object_name = Session.get "object_name"
		record_id = Session.get "record_id"
		return Creator.getObjectUrl(object_name, record_id)

	allow_create: ()->
		related_object_name = Session.get "related_object_name"
		return Creator.getPermissions(related_object_name).allowCreate

	recordsTotalCount: ()->
		return Template.instance().recordsTotal.get()
		
	list_data: ()->
		return {total: Template.instance().recordsTotal, is_related: true}


Template.related_object_list.events
	"click .add-related-record": (event, template)->
		related_object_name = Session.get "related_object_name"
		object_name = Session.get "object_name"
		record_id = Session.get "record_id"
		action_collection_name = Creator.getObject(related_object_name).label
		related_lists = Creator.getRelatedList(object_name, record_id)
		related_field_name = _.findWhere(related_lists, {object_name: related_object_name}).related_field_name
		if related_field_name
			Session.set 'cmDoc', {"#{related_field_name}": record_id}
		Session.set "action_collection", "Creator.Collections.#{related_object_name}"
		Session.set "action_collection_name", action_collection_name
		Meteor.defer ->
			$(".creator-add").click()

	'click .btn-refresh': (event, template)->
		Template.creator_grid.refresh()


Template.related_object_list.onCreated ->
	this.recordsTotal = new ReactiveVar(0)