Template.creatorLayout.helpers Creator.helpers

Template.creatorLayout.helpers
	hiddenHeader: ()->
		if Session.get("hidden_header") and Session.get("hidden_header") == true
			return true
		else
			return false
	
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
		allowSaveAndInsert = Session.get("action_save_and_insert")
		if allowSaveAndInsert
			collectionName = Session.get("action_collection")
			objectName = collectionName.replace(/Creator.Collections./, "")
			# 只有有新建权限的情况下显示“保存并新建”按钮
			return Creator.getPermissions(objectName)?.allowCreate
		else
			return false

	split: ()->
		app = Creator.getApp()
		if app and app._id == "admin"
			reg = /\/app\/\w+\/search\//
			currentPath = Session.get("router-path")
			return !reg.test(currentPath)
		else
			return false

Template.creatorLayout.events
	'click .sidebar-show': (e, t)->
#		$("#sidebar-left").addClass('move--right')
#		$(".steedos").addClass('move--right')
		FlowRouter.go "/app/#{Session.get('app_id')}"

	'click .steedos.move--right': (e, t)->
		$("#sidebar-left").removeClass('move--right')
		$(".steedos").removeClass('move--right')


isCalendarView = ()->
	view = Creator.getListView(Session.get "object_name", Session.get("list_view_id"))
	return view?.type == 'calendar'

AutoForm.hooks creatorAddForm:
	onSuccess: (formType, result)->
		$('#afModal').modal 'hide'
		if FlowRouter._current.route.path == "/app/:app_id/:object_name/calendar/" || isCalendarView()
			return
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
		if isCalendarView()
			return;
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