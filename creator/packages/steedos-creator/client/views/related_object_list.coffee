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
		if related_object_name == "cms_files"
			# 附件列表及相关列表的新建按钮应该去掉 #940，先去掉，以后有需要可以再改为上传附件功能
			return false
		return Creator.getPermissions(related_object_name).allowCreate

	recordsTotalCount: ()->
		return Template.instance().recordsTotal.get()
		
	list_data: ()->
		object_name = Session.get "object_name"
		related_object_name = Session.get("related_object_name")
		return {related_object_name:related_object_name, object_name: object_name, total: Template.instance().recordsTotal, is_related: true}


Template.related_object_list.events
	"click .add-related-record": (event, template)->
		related_object_name = Session.get "related_object_name"
		object_name = Session.get "object_name"
		record_id = Session.get "record_id"
		action_collection_name = Creator.getObject(related_object_name).label
		
		ids = Creator.TabularSelectedIds[related_object_name]
		if ids?.length
			# 列表有选中项时，取第一个选中项，复制其内容到新建窗口中
			# 这的第一个指的是第一次勾选的选中项，而不是列表中已勾选的第一项
			record_id = ids[0]
			doc = Creator.odata.get(related_object_name, record_id)
			Session.set 'cmDoc', doc
			# “保存并新建”操作中自动打开的新窗口中需要再次复制最新的doc内容到新窗口中
			Session.set 'cmShowAgainDuplicated', true
		else 
			related_lists = Creator.getRelatedList(object_name, record_id)
			related_field_name = _.findWhere(related_lists, {object_name: related_object_name}).related_field_name
			if related_field_name
				Session.set 'cmDoc', {"#{related_field_name}": record_id}
		
		Session.set "action_collection", "Creator.Collections.#{related_object_name}"
		Session.set "action_collection_name", action_collection_name
		Meteor.defer ->
			$(".creator-add").click()

	'click .btn-refresh': (event, template)->
		dxDataGridInstance = $(event.currentTarget).closest(".related_object_list").find(".gridContainer").dxDataGrid().dxDataGrid('instance')
		Template.creator_grid.refresh(dxDataGridInstance)


Template.related_object_list.onCreated ->
	this.recordsTotal = new ReactiveVar(0)