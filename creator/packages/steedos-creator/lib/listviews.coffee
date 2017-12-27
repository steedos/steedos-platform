Creator.getTabularColumns = (object_name, columns) ->
	obj = Creator.getObject(object_name)
	cols = []
	_.each columns, (field_name)->
		field = obj.fields[field_name]
		if field?.type
			col = {}
			col.data = field_name
			#col.sTitle = null
			# col.titleFn = ()->
			# 	return "<a class='slds-th__action slds-text-link_reset' href='javascript:void(0);' role='button' tabindex='-1'>
			# 				<span class='slds-assistive-text'>Sort by: </span>
			# 				<span class='slds-truncate' title='Name'>" +  field.label + "</span>
			# 				<div class='slds-icon_container'>
			# 					<svg class='slds-icon slds-icon_x-small slds-icon-text-default slds-is-sortable__icon' aria-hidden='true'>
			# 						<use xmlns:xlink='http://www.w3.org/1999/xlink' xlink:href='/packages/steedos_lightning-design-system/client/icons/utility-sprite/symbols.svg#arrowdown'>'
			# 						</use>
			# 					</svg>
			# 				</div>
			# 			</a>"
				
			col.sTitle = "<a class='slds-th__action slds-text-link_reset' href='javascript:void(0);' role='button' tabindex='-1'>
							<span class='slds-assistive-text'>Sort by: </span>
							<span class='slds-truncate' title='Name'>" +  field.label + "</span>
							<div class='slds-icon_container'>
								<svg class='slds-icon slds-icon_x-small slds-icon-text-default slds-is-sortable__icon' aria-hidden='true'>
									<use xmlns:xlink='http://www.w3.org/1999/xlink' xlink:href='/packages/steedos_lightning-design-system/client/icons/utility-sprite/symbols.svg#arrowdown'>
									</use>
								</svg>
							</div>
						</a>"
			col.className = "slds-cell-edit cellContainer"
			if field.sortable
				col.className = col.className + " slds-is-sortable"
			else
				col.orderable = false
			col.render =  (val, type, doc) ->
				return
			col.createdCell = (cell, val, doc) ->
				$(cell).attr("data-label", field_name)
				Blaze.renderWithData(Template.creator_table_cell, {_id: doc._id, val: val, doc: doc, field: field, field_name: field_name, object_name:object_name}, cell);

			cols.push(col)

	action_col = 
		title: '<div class="slds-th__action"></div>'
		data: "_id"
		width: '20px'
		createdCell: (node, cellData, rowData) ->
			record = rowData
			userId = Meteor.userId()
			record_permissions = Creator.getRecordPermissions object_name, record, Meteor.userId()
			if record_permissions.allowEdit or record_permissions.allowDelete
				$(node).attr("data-label", "Actions")
				$(node).html(Blaze.toHTMLWithData Template.creator_table_actions, {_id: cellData, object_name: object_name, record_permissions: record_permissions}, node)
			else
				$(node).html("")
	cols.push(action_col)

	checkbox_col = 
		title: '<div class="slds-th__action"></div>'
		data: "_id"
		width: '20px'
		className: "slds-cell-edit cellContainer"
		createdCell: (node, cellData, rowData) ->
			$(node).attr("data-label", "Checkbox")
			$(node).html(Blaze.toHTMLWithData Template.creator_table_checkbox, {_id: cellData, object_name: object_name}, node)
	cols.splice(0, 0, checkbox_col)
	
	return cols


Creator.initListViews = (object_name)->
	object = Creator.getObject(object_name)
	columns = ["name"]
	if object.list_views?.default?.columns
		columns = object.list_views.default.columns

	if Meteor.isClient
		Creator.TabularSelectedIds[object_name] = []

	new Tabular.Table
		name: "creator_" + object_name,
		collection: Creator.Collections[object_name],
		pub: "steedos_object_tabular",
		columns: Creator.getTabularColumns(object_name, columns)
		headerCallback: ( thead, data, start, end, display )->
			$(thead).find('th').eq(0).css("width","32px").html(Blaze.toHTMLWithData Template.creator_table_checkbox, {_id: "#", object_name: object_name})
		drawCallback:(settings)->
			self = this
			# 当数据库数据变化时会重新生成datatable，需要重新把勾选框状态保持住
			Tracker.nonreactive ->
				currentDataset = self.find(".select-all")[0]?.dataset
				currentObjectName = currentDataset.objectName

				selectedIds = Creator.TabularSelectedIds[currentObjectName]
				unless selectedIds
					return

				checkboxs = self.find(".select-one")
				checkboxs.each (index,item)->
					checked = selectedIds.indexOf(item.dataset.id) > -1
					$(item).prop("checked",checked)

				checkboxAll = self.find(".select-all")
				selectedLength = selectedIds.length
				if selectedLength > 0 and checkboxs.length != selectedLength
					checkboxAll.prop("indeterminate",true)
				else
					checkboxAll.prop("indeterminate",false)
					if selectedLength == 0
						checkboxAll.prop("checked",false)
					else if selectedLength == checkboxs.length
						checkboxAll.prop("checked",true)

		dom: "tp"
		extraFields: ["owner"]
		lengthChange: false
		ordering: true
		pageLength: 20
		info: false
		searching: true
		autoWidth: false
		changeSelector: (selector, userId)->
			if !selector.space and !selector._id
				selector = 
					_id: "nothing"
			return selector

if Meteor.isClient
	Creator.getRelatedList = (object_name, record_id)->
		list = []

		_.each Creator.Objects, (related_object, related_object_name)->

			_.each related_object.fields, (related_field, related_field_name)->
				if related_field.type=="master_detail" and related_field.reference_to and related_field.reference_to == object_name
					tabular_name = "creator_" + related_object_name
					if Tabular.tablesByName[tabular_name]
						tabular_selector = {space: Session.get("spaceId")}
						tabular_selector[related_field_name] = record_id
						columns = ["name"]
						if related_object.list_views?.default?.columns
							columns = related_object.list_views.default.columns
						columns = _.without(columns, related_field_name)
						Tabular.tablesByName[tabular_name].options?.columns = Creator.getTabularColumns(related_object_name, columns);

						related =
							object_name: related_object_name
							columns: columns
							tabular_table: Tabular.tablesByName[tabular_name]
							tabular_selector: tabular_selector
							related_field_name: related_field_name

						list.push related

		return list



Creator.getListViews = (object_name)->
	if !object_name 
		object_name = Session.get("object_name")

	object = Creator.getObject(object_name)
	list_views = []
	_.each object.list_views, (item, item_name)->
		if item_name != "default"
			list_views.push item
	return list_views


Creator.getListView = (object_name, list_view_id)->

	object = Creator.getObject(object_name)
	if object.list_views
		if object.list_views[list_view_id]
			list_view = object.list_views[list_view_id]
		else
			view_ids = _.keys(object.list_views) 
			view_ids = _.without(view_ids, "default")
			list_view = object.list_views[view_ids[0]]
		
		Creator.getTable(object_name)?.options.columns = Creator.getTabularColumns(object_name, list_view.columns);

	return list_view