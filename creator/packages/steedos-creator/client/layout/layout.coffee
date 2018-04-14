Template.creatorLayout.helpers Creator.helpers

Template.creatorLayout.helpers
	
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

AutoForm.hooks creatorAddForm:
	onSuccess: (formType, result)->
		$('#afModal').modal 'hide'
		if result.type == "post"
			app_id = Session.get("app_id")
			object_name = result.object_name
			record_id = result._id
			url = "/app/#{app_id}/#{object_name}/view/#{record_id}"
			FlowRouter.go url
,false

AutoForm.hooks creatorEditForm:
	onSuccess: (formType, result)->
		$('#afModal').modal 'hide'
		if result.type == "post"
			app_id = Session.get("app_id")
			object_name = result.object_name
			record_id = result._id
			url = "/app/#{app_id}/#{object_name}/view/#{record_id}"
			FlowRouter.go url
,false

AutoForm.hooks creatorCellEditForm:
	onSuccess: ()->
		$('#afModal').modal 'hide'
,false