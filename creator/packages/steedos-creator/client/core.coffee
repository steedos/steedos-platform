Creator.getLayout = (app_id)->
	if !app_id
		app_id = Session.get("app_id")
	if app_id == "steedos"
		return "steedosLayout"
	else
		if Steedos.isMobile()
			return "creatorMobileLayout"
		else
			return "creatorLayout"

Creator.createObject = (object_name,object_data)->
	object = Creator.getObject(object_name)
	collection_name = "Creator.Collections."+object_name
	Session.set("action_collection",collection_name)
	Session.set("action_save_and_insert",true)
	Session.set("action_collection_name",object.label)
	Session.set('action_object_name',object_name)
	Session.set("action_fields",undefined)
	Session.set("cmDoc",object_data)
	Meteor.defer ->
		$(".creator-add").click()

Creator.editObject = (object_name,record_id)->
	object = Creator.getObject(object_name)
	collection_name = "Creator.Collections."+object_name
	Session.set("action_collection",collection_name)
	Session.set("action_save_and_insert",false)
	Session.set("action_collection_name",object.label)
	Session.set('action_object_name',object_name)
	Session.set("action_record_id",record_id)
	Session.set("action_fields",undefined)
	Meteor.call "object_record", object_name, record_id, (error, result)->
		if result
			Session.set 'cmDoc', result
			$(".btn.creator-edit").click()

if Meteor.isClient
	# 定义全局变量以Session.get("object_name")为key记录其选中的记录id集合
	Creator.TabularSelectedIds = {}
	Meteor.autorun ->
		list_view_id = Session.get("list_view_id")
		object_name = Session.get("object_name")
		if object_name
			Creator.TabularSelectedIds[object_name] = []
	
	Creator.remainCheckboxState = (container)->
		# 当Creator.TabularSelectedIds值，把container内的勾选框状态保持住
		checkboxAll = container.find(".select-all")
		unless checkboxAll.length
			return
		currentDataset = checkboxAll[0]?.dataset
		currentObjectName = currentDataset.objectName

		selectedIds = Creator.TabularSelectedIds[currentObjectName]
		unless selectedIds
			return

		checkboxs = container.find(".select-one")
		checkboxs.each (index,item)->
			checked = selectedIds.indexOf(item.dataset.id) > -1
			$(item).prop("checked",checked)

		selectedLength = selectedIds.length
		if selectedLength > 0 and checkboxs.length != selectedLength
			checkboxAll.prop("indeterminate",true)
		else
			checkboxAll.prop("indeterminate",false)
			if selectedLength == 0
				checkboxAll.prop("checked",false)
			else if selectedLength == checkboxs.length
				checkboxAll.prop("checked",true)
	
	### TO DO LIST
		1.支持$in操作符，实现recent视图
		$eq, $ne, $lt, $gt, $lte, $gte
	###
	Creator.getODataFilter = (list_view_id, object_name)->
		userId = Meteor.userId()
		spaceId = Session.get("spaceId")
		custom_list_view = Creator.Collections.object_listviews.findOne(list_view_id)
		selector = []
		if custom_list_view
			filter_scope = custom_list_view.filter_scope
			filters = custom_list_view.filters
			if filter_scope == "mine"
				selector.push ["owner", "=", Meteor.userId()]
#			else if filter_scope == "space"
#				selector.push ["space", "=", Steedos.spaceId()]

			if filters and filters.length > 0
				if selector.length > 0
					selector.push "and"
				filters = _.map filters, (obj)->
					return [obj.field, obj.operation, obj.value]
				
				filters = Creator.formatFiltersToDev(filters)
				_.each filters, (filter)->
					selector.push filter
		else
			if spaceId and userId
				list_view = Creator.getListView(object_name, list_view_id)
				unless list_view
					return ["_id", "=", -1]
#				if list_view.filter_scope == "spacex"
#					selector.push ["space", "=", null], "or", ["space", "=", spaceId]
				if object_name == "users"
					selector.push ["_id", "=", userId]
#				else if object_name == "spaces"
#					selector.push ["_id", "=", spaceId]
#				else
#					selector.push ["space", "=", spaceId]

				# if Creator.getListViewIsRecent(object_name, list_view)
				# 	viewed = Creator.Collections.object_recent_viewed.find({object_name: object_name}).fetch()
				# 	record_ids = _.pluck(viewed, "record_id")
				# 	record_ids = _.uniq(record_ids)
				# 	record_ids = record_ids.join(",or,").split(",")
				# 	id_selector = _.map record_ids, (_id)->
				# 		if _id != "or"
				# 			return ["_id", "=", _id]
				# 		else
				# 			return _id
				# 	if selector.length > 0
				# 		selector.push "and"
				# 	selector.push id_selector

				# $eq, $ne, $lt, $gt, $lte, $gte
				# [["is_received", "$eq", true],["destroy_date","$lte",new Date()],["is_destroyed", "$eq", false]]
				if list_view.filters
					filters = Creator.formatFiltersToDev(list_view.filters)
					if filters and filters.length > 0
						if selector.length > 0
							selector.push "and"
						_.each filters, (filter)->
							if object_name != 'spaces' || (filter.length > 0 && filter[0] != "_id")
								selector.push filter

					if list_view.filter_scope == "mine"
						if selector.length > 0
							selector.push "and"
						selector.push ["owner", "=", userId]
				else
					permissions = Creator.getPermissions(object_name)
					if permissions.viewAllRecords
						if list_view.filter_scope == "mine"
							if selector.length > 0
								selector.push "and"
							selector.push ["owner", "=", userId]
					else if permissions.allowRead
						if selector.length > 0
							selector.push "and"
						selector.push ["owner", "=", userId]

		if selector.length == 0
			return undefined
		return selector

	Creator.getODataRelatedFilter = (object_name, related_object_name, record_id)->
		spaceId = Steedos.spaceId()
		userId = Meteor.userId()
		related_lists = Creator.getRelatedList(object_name, record_id)
		related_field_name = ""
		selector = []
		_.each related_lists, (obj)->
			if obj.object_name == related_object_name
				related_field_name = obj.related_field_name
		
		related_field_name = related_field_name.replace(/\./g, "/")

		if related_object_name == "cfs.files.filerecord"
			selector.push(["metadata/space", "=", spaceId])
		else
			selector.push(["space", "=", spaceId])

		if related_object_name == "cms_files"
			selector.push("and", ["parent/o", "=", object_name])
			selector.push("and", ["parent/ids", "=", record_id])
		else
			selector.push("and", [related_field_name, "=", record_id])
		
		permissions = Creator.getPermissions(related_object_name, spaceId, userId)
		if !permissions.viewAllRecords and permissions.allowRead
			selector.push("and", ["owner", "and", userId])

		return selector

# 切换工作区时，重置下拉框的选项
Tracker.autorun ()->
	if Session.get("spaceId")
		_.each Creator.Objects, (obj, object_name)->
			if Creator.Collections[object_name]
				_.each obj.fields, (field, field_name)->
					if field.type == "master_detail" or field.type == "lookup"
						_schema = Creator.Collections[object_name]?._c2?._simpleSchema?._schema
						_schema?[field_name]?.autoform?.optionsMethodParams?.space = Session.get("spaceId")


Meteor.startup ->
	$(document).on "click", (e)->
		if $(e.target).closest(".slds-table td").length < 1
			$(".slds-table").addClass("slds-no-cell-focus")
		else
			$(".slds-table").removeClass("slds-no-cell-focus")


	$(window).resize ->
		if $(".list-table-container table.dataTable").length
			$(".list-table-container table.dataTable thead th").each ->
				width = $(this).outerWidth()
				$(".slds-th__action", this).css("width", "#{width}px")
