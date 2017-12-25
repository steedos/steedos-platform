Creator.getLayout = (app_id)->
	if !app_id
		app_id = Session.get("app_id")
	if app_id == "steedos"
		return "steedosLayout"
	else
		return "creatorLayout"

if Meteor.isClient
	# 定义全局变量以Session.get("object_name")为key记录其选中的记录id集合
	Creator.TabularSelectedIds = {}
	Meteor.autorun ->
		list_view_id = Session.get("list_view_id")
		object_name = Session.get("object_name")
		if object_name
			Creator.TabularSelectedIds[object_name] = []

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
