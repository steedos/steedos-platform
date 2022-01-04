Template.object_listview.helpers
	objectApiName: ()->
		return Template.instance().data.object_name;
	name: ()->
		return "listview_" + Template.instance().data.object_name + '_' + Template.instance().list_view_id
	listName: ()->
		list_view_id = Template.instance().list_view_id
		return list_view_id;
	filters: ()->
		object_name = Template.instance().data.object_name;
		list_view_id = Template.instance().list_view_id
		is_related = false
		related_object_name = null
		record_id = null
		return Creator.getListViewFilters(object_name, list_view_id, is_related, related_object_name, record_id)
	onModelUpdated: ()->
		self = this;
		return (event)->
			self.total.set(event.api.getDisplayedRowCount())
	sideBar: ()->
		return Template.instance().data.sideBar

Template.object_listview.onCreated ->
	self = this
	self.list_view_id = Session.get("list_view_id")
	self.creatorAddFormOnSuccess = (formType,result)->
		FlowRouter.reload();
	self.creatorEditFormOnSuccess = (formType,result)->
		FlowRouter.reload();
	self.creatorCellEditFormOnSuccess = (formType,result)->
		FlowRouter.reload();
	self.creatorAddRelatedFormOnSuccess = (formType,result)->
		FlowRouter.reload();
	AutoForm.hooks creatorAddForm:
		onSuccess: self.creatorAddFormOnSuccess
	,false
	AutoForm.hooks creatorEditForm:
		onSuccess: self.creatorEditFormOnSuccess
	,false
	AutoForm.hooks creatorCellEditForm:
		onSuccess: self.creatorCellEditFormOnSuccess
	,false
	AutoForm.hooks creatorAddRelatedForm:
		onSuccess: self.creatorAddRelatedFormOnSuccess
	,false

Template.object_listview.onDestroyed ->
	self = this
	_.each(AutoForm._hooks.creatorAddForm.onSuccess, (fn, index)->
		if fn == self.creatorAddFormOnSuccess
			delete AutoForm._hooks.creatorAddForm.onSuccess[index]
	)
	_.each(AutoForm._hooks.creatorEditForm.onSuccess, (fn, index)->
		if fn == self.creatorEditFormOnSuccess
			delete AutoForm._hooks.creatorEditForm.onSuccess[index]
	)
	_.each(AutoForm._hooks.creatorCellEditForm.onSuccess, (fn, index)->
		if fn == self.creatorCellEditFormOnSuccess
			delete AutoForm._hooks.creatorCellEditForm.onSuccess[index]
	)
	_.each(AutoForm._hooks.creatorAddRelatedForm.onSuccess, (fn, index)->
		if fn == self.creatorAddRelatedFormOnSuccess
			delete AutoForm._hooks.creatorAddRelatedForm.onSuccess[index]
	)