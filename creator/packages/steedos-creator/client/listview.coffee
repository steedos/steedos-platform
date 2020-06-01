_listViewColumns = (object_name, listView, use_mobile_columns)->
	columns = listView?.columns
	if use_mobile_columns
		# 手机上优先取当前视图mobile_columns，其次取默认视图mobile_columns，最后才取当前视图columns前4个
		if listView.mobile_columns
			columns = listView.mobile_columns
		else
			defaultView = Creator.getObjectDefaultView(object_name)
			if defaultView.mobile_columns
				columns = defaultView.mobile_columns
			else if columns
				columns = columns.slice(0,4)
	unless columns
		defaultColumns = Creator.getObjectDefaultColumns(object_name, use_mobile_columns)
		if defaultColumns
			columns = defaultColumns
	return columns

_fields = (object_name, list_view_id, use_mobile_columns)->
	object = Creator.getObject(object_name)
	name_field_key = object.NAME_FIELD_KEY
	if object.name == "organizations"
		# 显示组织列表时，特殊处理name_field_key为name字段
		name_field_key = "name"
	fields = [name_field_key]
	listView = Creator.getCollection("object_listviews").findOne(list_view_id)
	if listView
		fields = _listViewColumns(object_name, listView, use_mobile_columns)
	else if object.list_views
		objectListView = object.list_views[list_view_id]
		fields = _listViewColumns(object_name, objectListView, use_mobile_columns)

	fields = fields.map (field)->
		if _.isObject(field)
			n = field.field
		else
			n = field
		if object.fields[n]?.type # and !object.fields[n].hidden
			# 对于a.b类型的字段，不应该替换字段名
			#return n.split(".")[0]
			return n
		else
			return undefined

	if Creator.isCommonSpace(Session.get("spaceId")) && fields.indexOf("space") < 0
		fields.push('space')

	fields = _.compact(fields)
	fieldsName = Creator.getObjectFieldsName(object_name)
	# 注意这里intersection函数中两个参数次序不能换，否则字段的先后显示次序就错了
	return _.intersection(fields, fieldsName)

_removeCurrentRelatedFields = (curObjectName, columns, object_name, is_related)->
	# 移除主键字段，即columns中的reference_to等于object_name的字段
	unless object_name
		return columns
	fields = Creator.getObject(curObjectName).fields
	if is_related
		columns = columns.filter (n)->
			if fields[n]?.type == "master_detail"
				if fields[n].multiple
					# 多选字段不移除
					return true
				if fields[n].reference_to
					ref = fields[n].reference_to
					if _.isFunction(ref)
						ref = ref()
				else
					ref = fields[n].optionsFunction({}).getProperty("value")
				if _.isArray(ref)
					return true
				else
					return ref != object_name
			else
				return true
	return columns

_depandOnFields = (object_name, columns)->
	fields = Creator.getObject(object_name).fields
	depandOnFields = []
	_.each columns, (column)->
		if fields[column]?.depend_on
			depandOnFields = _.union(fields[column].depend_on)
	return depandOnFields

_getExtraColumns = (curObject, object_name, is_related) ->
	extra_columns = _.intersection(["owner", "company_id", "company_ids", "locked"], _.keys(curObject.fields));
	if !is_related and curObject.enable_tree
		extra_columns.push("parent")
		extra_columns.push("children")
	# object = Creator.getObject(curObjectName)
	defaultExtraColumns = Creator.getObjectDefaultExtraColumns(curObject.name)
	if defaultExtraColumns
		extra_columns = _.union extra_columns, defaultExtraColumns
	return extra_columns

Creator.unionSelectColumnsWithExtraAndDepandOn = (selectColumns, curObject, object_name, is_related)->
	# extra_columns不需要显示在表格上
	curObjectName = curObject.name
	extra_columns = _getExtraColumns(curObject, object_name, is_related)
	selectColumns = _.union(selectColumns, extra_columns)
	selectColumns = _.union(selectColumns, _depandOnFields(curObjectName, selectColumns))
	return selectColumns

Creator.getListViewFilters = (object_name, list_view_id, is_related, related_object_name, record_id)->
	creator_obj = Creator.getObject(object_name)
	if is_related
		# 因为有权限判断需求，所以最近查看也需要调用过虑条件逻辑，而不应该设置为undefined
		filter = Creator.getODataRelatedFilter(object_name, related_object_name, record_id, list_view_id)
	else
		filter_logic = Session.get("filter_logic")
		filter_scope = Session.get("filter_scope")

		filter_items = Session.get("filter_items")
		_objFields = creator_obj.fields

		_filters = []
		_.forEach filter_items, (fi)->
			if fi.value == undefined
				# value为undefined时不应该生成过滤条件，dev过滤器不支持
				return
			_f = _objFields[fi?.field]
			if ["text", "textarea", "html", "code"].includes(_f?.type)
				if _.isString(fi.value)
					vals = fi.value.trim().split(" ")
					query_or = []
					vals.forEach (val_item)->
						val_item = encodeURIComponent(Creator.convertSpecialCharacter(val_item))
						query_or.push([fi.field, fi.operation, val_item])
					if query_or.length > 0
						is_logic_or = false
						if ['<>','notcontains'].includes(fi.operation)
							is_logic_or = false
						_filters.push Creator.formatFiltersToDev(query_or, object_name, {is_logic_or: is_logic_or})
			else if ["lookup", "master_detail"].includes(_f?.type)
				_reference_to = _f?.reference_to
				if _.isFunction(_reference_to)
					_reference_to = _reference_to()
				if _.isArray(_reference_to)
					if fi.value?.ids
						_filters.push {
							field: fi.field+".ids"
							operation: fi.operation
							value: fi.value?.ids
						}
					if fi.value?.o
						_ro = Creator.getObject(fi.value?.o)
						_filters.push {
							field: fi.field+".o"
							operation: fi.operation
							value: _ro._collection_name
						}
				else
					_filters.push fi
			else
				_filters.push fi

		if _filters.length > 0
			# 支持直接把过虑器变更的过虑条件应用到grid列表，而不是非得先保存到视图中才生效
			filters_set =
				filter_logic: filter_logic
				filter_scope: filter_scope
				filters: _filters
		# 因为有权限判断需求，所以最近查看也需要调用过虑条件逻辑，而不应该设置为undefined
		filter = Creator.getODataFilter(list_view_id, object_name, filters_set)
		standardQuery = Creator.getStandardQuery(object_name, Session.get("standard_query"))
		if standardQuery and standardQuery.length
			if filter
				filter = [filter, "and", standardQuery]
			else
				filter = standardQuery

		unless is_related
			# 左侧sidebar有grid列表时，应该过虑左侧选中值相关数据，相关项列表不支持sidebar
			sidebarFilter = Session.get("grid_sidebar_filters")
			if sidebarFilter and sidebarFilter.length
				if filter
					filter = [ filter, "and", sidebarFilter ]
				else
					filter = sidebarFilter

	if !filter
		# filter 为undefined时要设置为空，否则dxDataGrid控件会使用上次使用过的filter
		filter = null
	console.log("filter=======", filter);
	return filter

Creator.getODataEndpointUrl = (object_name, list_view_id, is_related, related_object_name) ->
	if is_related
		_obj_name = Creator.formatObjectName(related_object_name)
		if Creator.getListViewIsRecent(object_name, list_view_id)
			#url = "#{Creator.getObjectODataRouterPrefix(Creator.getObject(related_object_name))}/#{Steedos.spaceId()}/#{_obj_name}/recent"
			url = "/api/v4/#{_obj_name}/recent"
		else
			#url = "#{Creator.getObjectODataRouterPrefix(Creator.getObject(related_object_name))}/#{Steedos.spaceId()}/#{_obj_name}"
			url = "/api/v4/#{_obj_name}"
	else
		_obj_name = Creator.formatObjectName(object_name)
		if Creator.getListViewIsRecent(object_name, list_view_id)
			#url = "#{Creator.getObjectODataRouterPrefix(creator_obj)}/#{Steedos.spaceId()}/#{_obj_name}/recent"
			url = "/api/v4/#{_obj_name}/recent"
		else
			#url = "#{Creator.getObjectODataRouterPrefix(creator_obj)}/#{Steedos.spaceId()}/#{_obj_name}"
			url = "/api/v4/#{_obj_name}"
	return Steedos.absoluteUrl(url)

Creator.getListviewColumns = (curObject, object_name, is_related, list_view_id, related_list_item_props, use_mobile_columns)->
	curObjectName = curObject.name
	selectColumns = Tracker.nonreactive ()->
		# grid_settings = Creator.Collections.settings.findOne({object_name: curObjectName, record_id: "object_gridviews"})
		# if grid_settings and grid_settings.settings and grid_settings.settings[list_view_id] and grid_settings.settings[list_view_id].column_width
		# 	settingColumns = _.keys(grid_settings.settings[list_view_id].column_width)
		# if settingColumns
		# 	defaultColumns = _fields(curObjectName, list_view_id)
		# 	selectColumns = _.intersection(settingColumns, defaultColumns)
		# 	selectColumns = _.union(selectColumns, defaultColumns)
		# else
		# 	selectColumns = _fields(curObjectName, list_view_id)
		return _fields(curObjectName, list_view_id, use_mobile_columns)
	if related_list_item_props.customRelatedListObject && related_list_item_props.columns
		selectColumns = related_list_item_props.columns
		selectColumns = selectColumns.map (field)->
			if _.isObject field
				return field.field
			else if _.isString field
				return field
			else
				return undefined
		selectColumns = _.uniq(_.compact(selectColumns))
	selectColumns = _removeCurrentRelatedFields(curObjectName, selectColumns, object_name, is_related)
	return selectColumns

# Creator.getListviewColumnsWithExtraAndDepandOn = (curObject, object_name, is_related, list_view_id)->
# 	selectColumns = Creator.getListviewColumns(curObject, object_name, is_related, list_view_id)
# 	selectColumns = Creator.unionSelectColumnsWithExtraAndDepandOn(selectColumns, curObject, object_name, is_related)
# 	return selectColumns;
