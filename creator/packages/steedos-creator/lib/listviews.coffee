Creator.getTabularColumns = (object_name, columns, is_related) ->
	obj = Creator.getObject(object_name)
	cols = []
	_.each columns, (field_name)->
		field = obj.fields[field_name]
		if field?.type and !field.hidden
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
			col.className = "slds-cell-edit cellContainer slds-is-resizable"
			if field.sortable
				col.className = col.className + " slds-is-sortable"
			else
				col.orderable = false
			col.render =  (val, type, doc) ->
				return
			col.createdCell = (cell, val, doc) ->
				$(cell).attr("data-label", field.label)
				Blaze.renderWithData(Template.creator_table_cell, {_id: doc._id, val: val, doc: doc, field: field, field_name: field_name, object_name:object_name}, cell);

			cols.push(col)

	action_col = 
		title: '<div class="slds-th__action"></div>'
		data: "_id"
		width: '20px'
		orderable: false
		createdCell: (node, cellData, rowData) ->
			record = rowData
			userId = Meteor.userId()
			record_permissions = Creator.getRecordPermissions object_name, record, Meteor.userId()
			$(node).attr("data-label", "Actions")
			$(node).html(Blaze.toHTMLWithData Template.creator_table_actions, {_id: cellData, object_name: object_name, record_permissions: record_permissions, is_related: is_related}, node)
	cols.push(action_col)

	checkbox_col = 
		title: '<div class="slds-th__action"></div>'
		data: "_id"
		width: '20px'
		className: "slds-cell-edit cellContainer"
		orderable: false
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
	extra_columns = ["owner"]
	if object.list_views?.default?.extra_columns
		extra_columns = _.union extra_columns, object.list_views.default.extra_columns

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
			if self.closest(".list-table-container").length
				$("th", self).each ->
					width = $(this).outerWidth()
					$(".slds-th__action", this).css({"width": "#{width}px"})

					$(this).off "resize"
					$(this).on "resize", (e)->
						width = $(this).outerWidth()
						$(".slds-th__action", this).css("width", "#{width}px")

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
		extraFields: extra_columns
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
						columns = ["name"]
						if related_object.list_views?.default?.columns
							columns = related_object.list_views.default.columns
						columns = _.without(columns, related_field_name)
						Tabular.tablesByName[tabular_name].options?.columns = Creator.getTabularColumns(related_object_name, columns, true);

						related =
							object_name: related_object_name
							columns: columns
							tabular_table: Tabular.tablesByName[tabular_name]
							related_field_name: related_field_name

						list.push related

		if Creator.Objects[object_name]?.enable_files
			file_object_name = "cms_files"
			file_tabular_name = "creator_" + file_object_name
			file_related_field_name = "parent"
			file_related_object = Creator.Objects[file_object_name]
			
			if Tabular.tablesByName[file_tabular_name]
				columns = ["name"]
				if file_related_object.list_views?.default?.columns
					columns = file_related_object.list_views.default.columns
				columns = _.without(columns, file_related_field_name)
				Tabular.tablesByName[file_tabular_name].options?.columns = Creator.getTabularColumns(file_object_name, columns, true);

				file_related =
					object_name: file_object_name
					columns: columns
					tabular_table: Tabular.tablesByName[file_tabular_name]
					related_field_name: file_related_field_name
					is_file: true

				list.push file_related

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
		Creator.getTable(object_name)?.options.language.zeroRecords = t("list_view_no_records")
	return list_view