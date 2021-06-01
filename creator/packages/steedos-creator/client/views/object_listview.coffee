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

Template.object_listview.onCreated ->
	self = this
	self.list_view_id = Session.get("list_view_id")