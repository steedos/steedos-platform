Template.detail_realted_object_list.helpers
	related_object_name: ()->
		return this.related_object_name
	name: ()->
		related_list = this.related_list_item_props
		related_field_name = related_list.related_field_name
		return "related_listview_" + this.object_name + '_' + this.related_object_name + '_' + related_field_name
	columnFields: ()->
#		object_name = this.object_name
#		relatedList = Creator.getRelatedList(this.object_name, this.record_id)
#		related_object_name = this.related_object_name
#		related_list_item_props = relatedList.find((item)-> return item.object_name == related_object_name)
		related_list_item_props = this.related_list_item_props
		related_field_name = related_list_item_props?.related_field_name
		columnFields = [];
		_.each(related_list_item_props?.columns, (fieldName)->
			if _.isObject(fieldName)
				if fieldName.field != related_field_name
					columnFields.push(Object.assign({}, fieldName, {fieldName: fieldName.field}))
			else if related_field_name != fieldName
				columnFields.push({fieldName: fieldName})
		)
		return columnFields;
	extraColumnFields: ()->
		# 子表列表始终从接口抓取主子表关联字段
		related_list = this.related_list_item_props
		related_field_name = related_list.related_field_name
		return [related_field_name]
	treeRootFilters: ()->
		object_name = this.object_name
		related_object_name = this.related_object_name
		record_id = this.record_id
		relatedObject = Creator.getObject(related_object_name)
		isSelfTreeRelated = related_object_name == object_name and relatedObject?.enable_tree
		if isSelfTreeRelated
			parentField = relatedObject?.parent_field || "parent"
			return [parentField, "=", record_id]
	filters: ()->
		object_name = this.object_name
		record_id = this.record_id
		related_object_name = this.related_object_name
		related_list = this.related_list_item_props
		is_related = true;
		list_view_id = Creator.getListView(related_object_name, "all")?._id
		return Creator.getListViewFilters(object_name, list_view_id, is_related, related_object_name, record_id, related_list)
	onModelUpdated: ()->
		recordsTotal = this.recordsTotal
		related_object_name = this.related_object_name
		related_list = this.related_list_item_props
		related_field_name = related_list.related_field_name
		return (event)->
			if recordsTotal
				recordsTotalVal = recordsTotal.get();
				if related_field_name
					recordsTotalVal[related_object_name + '/' + related_field_name] = event.api.getDisplayedRowCount()
				else
					recordsTotalVal[related_object_name] = event.api.getDisplayedRowCount()
				recordsTotal.set recordsTotal
	pageSize: ()->
		return this.related_list_item_props?.page_size || 5;
	sort: ()->
		return this.related_list_item_props?.sort
	onUpdated: ()->
		return (objectApiName, ids)->
			if FlowRouter.current().route.path.endsWith("/:record_id")
				params = FlowRouter.current().params;
				if params.object_name != objectApiName
					# ObjectForm有缓存，修改子表记录可能会有主表记录的汇总字段变更，需要刷新表单数据
					SteedosUI.reloadRecord(params.object_name, params.record_id)
			FlowRouter.reload();