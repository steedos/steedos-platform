Template.detail_realted_object_list.helpers
	related_object_name: ()->
		return this.related_object_name
	name: ()->
		return "related_listview_" + this.object_name + '_' + this.related_object_name
	columnFields: ()->
		object_name = this.object_name
		relatedList = Creator.getRelatedList(this.object_name, this.record_id)
		related_object_name = this.related_object_name
		related_list_item_props = relatedList.find((item)-> return item.object_name == related_object_name)
		columnFields = [];
		_.each(related_list_item_props.columns, (fieldName)->
			columnFields.push({fieldName: fieldName})
		)
		return columnFields;
	filters: ()->
		object_name = this.object_name
		record_id = this.record_id
		related_object_name = this.related_object_name
		is_related = true;
		list_view_id = Creator.getListView(related_object_name, "all")?._id
		return Creator.getListViewFilters(object_name, list_view_id, is_related, related_object_name, record_id)
	onModelUpdated: ()->
		recordsTotal = this.recordsTotal
		related_object_name = this.related_object_name
		return (event)->
			if recordsTotal
				recordsTotalVal = recordsTotal.get();
				recordsTotalVal[related_object_name] = event.api.getDisplayedRowCount()
				recordsTotal.set recordsTotal
	pageSize: ()->
		return 5;
	onUpdated: ()->
		return ()->
			FlowRouter.reload();