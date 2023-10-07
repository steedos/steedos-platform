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
	object_name: ()->
		return Session.get("object_name");
	recordId: ()->
		return Session.get("recordId");
	title: ()->
		return "编辑";
	triggerLabel: ()->
		return "编辑";
	onAddFinish: ()->
		return (values)->
			result = values[0];
			app_id = Session.get("app_id")
			object_name = Session.get("object_name");
			record_id = result._id
			url = "/app/#{app_id}/#{object_name}/view/#{record_id}"
			FlowRouter.go url
			return true;
#			app_id = Session.get("app_id")
#			object_name = Session.get("object_name")
#			list_view_id = result._id
#			url = "/app/" + app_id + "/" + object_name + "/grid/" + list_view_id
#			FlowRouter.go url
	onEditFinish: ()->
		return ()->
			setTimeout(()->
				FlowRouter.reload()
			, 1);
			return true;


Template.creatorLayout.onRendered ->
	tabId = Session.get("pageApiName") || Session.get("object_name") || Session.get("tab_name");
	this.autorun ->
		Steedos.Page.Header.render(Session.get('app_id'), tabId)

	this.autorun ->
		Steedos.Page.Footer.render(Session.get('app_id'), tabId)
	# $(window).resize ->
	# 	Steedos.Page.Header.render(Session.get('app_id'), tabId)

	this.autorun ->
		tab_id = Session.get("pageApiName") || Session.get("object_name") || Session.get("tab_name");
		if window.SteedosUI
			amisScope = SteedosUI.refs.globalHeader;
			if amisScope
				Meteor.setTimeout ()->
					try
						amisScope.updateProps( {
							location: FlowRouter.current()
						}, ()->
							console.log("amisScope.updateProps callback.......")
						);
					catch e
				, 100
	this.autorun ->
		tab_id = Session.get("pageApiName") || Session.get("object_name") || Session.get("tab_name");
		if window.SteedosUI
			amisScope = SteedosUI.refs.globalFooter;
			if amisScope
				Meteor.setTimeout ()->
					try
						amisScope.updateProps( {
							location: FlowRouter.current()
						}, ()->
							console.log("amisScope.updateProps callback.......")
						);
					catch e
				, 100


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
		
		if this.docId and result.object_name
			recordUrl = Creator.getObjectUrl(result.object_name, this.docId)
			recordName = Creator.getObjectRecordName(this.updateDoc.$set, result.object_name)
			# recordName为空时不会更新TempNavLabel
			Creator.updateTempNavLabel(result.object_name, recordUrl, recordName)
,false

AutoForm.hooks creatorCellEditForm:
	onSuccess: (formType,result)->
		$('#afModal').modal 'hide'
		if this.docId and result.object_name
			recordUrl = Creator.getObjectUrl(result.object_name, this.docId)
			recordName = Creator.getObjectRecordName(this.updateDoc.$set, result.object_name)
			# recordName为空时不会更新TempNavLabel
			Creator.updateTempNavLabel(result.object_name, recordUrl, recordName)
,false

onSuccess = (formType,result)->
	if FlowRouter.current().route.path.endsWith("/:record_id")
		FlowRouter.reload();
	else
		window.refreshGrid();


AutoForm.hooks creatorAddRelatedForm:
	onSuccess: onSuccess
,false