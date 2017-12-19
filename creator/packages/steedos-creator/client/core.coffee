Creator.getLayout = (app_id)->
	if !app_id
		app_id = Session.get("app_id")
	if app_id == "steedos"
		return "steedosLayout"
	else
		return "creatorLayout"

# 切换工作区时，重置下拉框的选项
Tracker.autorun ()->
	if  Session.get("spaceId")
		_.each Creator.Objects, (obj, object_name)->
			if Creator.Collections[object_name]
				_.each obj.fields, (field, field_name)->
					if field.type == "master_detail" or field.type == "lookup"
						_schema = Creator.Collections[object_name]?._c2?._simpleSchema?._schema
						_schema?[field_name]?.autoform?.optionsMethodParams?.space = Session.get("spaceId")

