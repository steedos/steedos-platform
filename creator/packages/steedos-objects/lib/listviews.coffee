Creator.getInitWidthPercent = (object_name, columns) ->
	_schema = Creator.getSchema(object_name)?._schema
	column_num = 0
	if _schema
		_.each columns, (field_name) ->
			field = _.pick(_schema, field_name)
			is_wide = field[field_name]?.autoform?.is_wide
			if is_wide
				column_num += 2
			else
				column_num += 1

		init_width_percent = 100 / column_num
		return init_width_percent

Creator.getFieldIsWide = (object_name, field_name) ->
	_schema = Creator.getSchema(object_name)._schema
	if _schema
		field = _.pick(_schema, field_name)
		is_wide = field[field_name]?.autoform?.is_wide
		return is_wide

Creator.getTabularOrder = (object_name, list_view_id, columns) ->
	setting = Creator.Collections?.settings?.findOne({object_name: object_name, record_id: "object_listviews"})
	obj = Creator.getObject(object_name)
	columns = _.map columns, (column)->
		field = obj.fields[column]
		if field?.type and !field.hidden
			return column
		else
			return undefined
	columns = _.compact columns
	if setting and setting.settings
		sort = setting.settings[list_view_id]?.sort || []
		sort = _.map sort, (order)->
			key = order[0]
			index = _.indexOf(columns, key)
			order[0] = index + 1
			return order
		return sort
	return []


Creator.initListViews = (object_name)->
	object = Creator.getObject(object_name)
	columns = Creator.getObjectDefaultColumns(object_name) || ["name"]
	extra_columns = ["owner"]
	default_extra_columns = Creator.getObjectDefaultExtraColumns(object_name) || ["owner"]
	if default_extra_columns
		extra_columns = _.union extra_columns, default_extra_columns

	order = Creator.getObjectDefaultSort(object_name) || []
	if Meteor.isClient
		Creator.TabularSelectedIds?[object_name] = []

Creator.convertListView = (default_columens, list_view, list_view_name)->
	oitem = _.clone(list_view)
	if !_.has(oitem, "name")
		oitem.name = list_view_name
	if !oitem.columns
		if default_columens
			oitem.columns = default_columens
	if !oitem.columns
		oitem.columns = ["name"]
	if !oitem.filter_scope
		oitem.filter_scope = "mine"

	if !_.has(oitem, "_id")
		oitem._id = list_view_name
	else
		oitem.label = oitem.label || list_view.name

	_.forEach oitem.filters, (filter, _index)->
		if !_.isArray(filter) && _.isObject(filter)
			if Meteor.isServer
				if _.isFunction(filter?.value)
					filter._value = filter.value.toString()
			else
				if _.isString(filter?._value)
					filter.value = Creator.eval("(#{filter._value})")
	return oitem


if Meteor.isClient
	Creator.getRelatedList = (object_name)->
		list = []
		related_objects = Creator.getRelatedObjects(object_name)

		_.each related_objects, (related_object_item) ->
			related_object_name = related_object_item.object_name
			related_field_name = related_object_item.foreign_key
			related_object = Creator.getObject(related_object_name)
			unless related_object
				return
			columns = Creator.getObjectDefaultColumns(related_object_name) || ["name"]
			columns = _.without(columns, related_field_name)

			order = Creator.getObjectDefaultSort(related_object_name)
			tabular_order = Creator.transformSortToTabular(order, columns)

			if /\w+\.\$\.\w+/g.test(related_field_name)
				# object类型带子属性的related_field_name要去掉中间的美元符号，否则显示不出字段值
				related_field_name = related_field_name.replace(/\$\./,"")
			related =
				object_name: related_object_name
				columns: columns
				related_field_name: related_field_name
				is_file: related_object_name == "cms_files"

			list.push related

		return list

Creator.getObjectFirstListView = (object_name)->
	return _.first(Creator.getListViews(object_name))

### 
	取出list_view_id对应的视图，如果不存在或者没有权限，就返回第一个视图
	exac为true时，需要强制按list_view_id精确查找，不默认返回第一个视图
###
Creator.getListView = (object_name, list_view_id, exac)->
	if Meteor.isClient
		if !object_name
			object_name = Session.get("object_name")
		if !list_view_id
			list_view_id = Session.get("list_view_id")
	object = Creator.getObject(object_name)
	if !object
		return
	listViews = Creator.getListViews(object_name)
	unless listViews?.length
		return
	list_view = _.findWhere(listViews,{"_id":list_view_id})
	unless list_view
		# 如果不需要强制按list_view_id精确查找，则默认返回第一个视图，反之返回空
		if exac
			return
		else
			list_view = listViews[0]
	return list_view

#获取list_view_id对应的视图是否是最近查看视图
Creator.getListViewIsRecent = (object_name, list_view_id)->
	if Meteor.isClient
		if !object_name
			object_name = Session.get("object_name")
		if !list_view_id
			list_view_id = Session.get("list_view_id")
	if typeof(list_view_id) == "string"
		object = Creator.getObject(object_name)
		if !object
			return
		listView = _.findWhere(object.list_views,{_id: list_view_id})
	else
		listView = list_view_id
	return listView?.name == "recent"


###
    获取默认视图
###
Creator.getObjectDefaultView = (object_name)->
	object = Creator.getObject(object_name)
	if !object
		object = Creator.Objects[object_name]
	if object?.list_views?.default
		#TODO 此代码只是暂时兼容以前code中定义的default视图，待code中的default清理完成后，需要删除此代码
		defaultView = object.list_views.default
	else
		_.each object?.list_views, (list_view, key)->
			if list_view.name == "all" || key == "all"
				defaultView = list_view
	return defaultView;

###
    获取对象的列表默认显示字段
###
Creator.getObjectDefaultColumns = (object_name)->
	defaultView = Creator.getObjectDefaultView(object_name)
	return defaultView?.columns

###
	获取对象的列表默认额外加载的字段
###
Creator.getObjectDefaultExtraColumns = (object_name)->
	defaultView = Creator.getObjectDefaultView(object_name)
	return defaultView?.extra_columns

###
	获取对象的默认排序
###
Creator.getObjectDefaultSort = (object_name)->
	defaultView = Creator.getObjectDefaultView(object_name)
	if defaultView
		if defaultView.sort
			return defaultView.sort
		else
			return [["created", "desc"]]


###
    判断是否All view
###
Creator.isAllView = (list_view)->
	return list_view?.name == "all"

###
    判断是否最近查看 view
###
Creator.isRecentView = (list_view)->
	return list_view?.name == "recent"

###
    将sort转换为Tabular控件所需要的格式
###
Creator.transformSortToTabular = (sort, tabularColumns)->
	tabular_sort = []
	_.each sort, (item)->
		if _.isArray(item)
			# 兼容旧的数据格式[["field_name", "order"]]
			if item.length == 1
				column_index = tabularColumns.indexOf(item[0])
				if column_index > -1
					tabular_sort.push [column_index, "asc"]
			else if item.length == 2
				column_index = tabularColumns.indexOf(item[0])
				if column_index > -1
					tabular_sort.push [column_index, item[1]]
		else if _.isObject(item)
			#新数据格式：[{field_name: , order: }]
			field_name = item.field_name
			order = item.order
			if field_name && order
				column_index = tabularColumns.indexOf(field_name)
				if column_index > -1
					tabular_sort.push [column_index, order]

	return tabular_sort

###
    将sort转换为DevExpress控件所需要的格式
###
Creator.transformSortToDX = (sort)->
	dx_sort = []
	_.each sort, (item)->
		if _.isArray(item)
			#兼容旧格式：[["field_name", "order"]]
			dx_sort.push(item)
		else if _.isObject(item)
			#新数据格式：[{field_name: , order: }]
			field_name = item.field_name
			order = item.order
			if field_name && order
				dx_sort.push [field_name, order]

	return dx_sort
