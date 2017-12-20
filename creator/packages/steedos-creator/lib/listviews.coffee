@Listviews = {}


Listviews.getTabularColumns = (object_name, columns) ->
	cols = []
	_.each columns, (field_name)->
		field = Creator.getObjectField(object_name, field_name)
		if field?.type
			col = {}
			col.data = field_name
			col.render =  (val, type, doc) ->
				
			col.sTitle = '<div class="slds-truncate" title="">' + t("" + object_name + "_" + field_name.replace(/\./g,"_")); + '</div>'
			# col.createdCell = (node, cellData, rowData) ->
			# 	$(node).css()
			col.className = "slds-cell-edit cellContainer"
			col.createdCell = (cell, val, doc) ->
				$(cell).attr("data-label", field_name)
				Blaze.renderWithData(Template.creator_table_cell, {_id: doc._id, val: val, doc: doc, field: field, field_name: field_name, object_name:object_name}, cell);

			# col.tmpl = Meteor.isClient && Template.creator_table_cell
			# col.tmplContext = (rowData)->
			# 	return {
			# 		cell: rowData[field_name],
			# 		row: rowData
			# 		field_name: field_name
			# 	}

			cols.push(col)

	action_col = 
		title: '<div class="slds-th__action"></div>'
		data: "_id"
		width: '20px'
		createdCell: (node, cellData, rowData) ->
			$(node).attr("data-label", "Actions")
			$(node).html(Blaze.toHTMLWithData Template.creator_table_actions, {_id: cellData}, node)
	cols.push(action_col)
	return cols


Listviews.init = (object_name)->
	object = Creator.getObject(object_name)
	columns = ["name"]
	if object.list_views?.default?.columns
		columns = object.list_views.default.columns

	Creator.TabularTables[object_name] = new Tabular.Table
		name: "creator_" + object_name,
		collection: Creator.Collections[object_name],
		pub: "steedos_object_tabular",
		columns: Listviews.getTabularColumns(object_name, columns)
		dom: "tp"
		extraFields: ["_id"]
		lengthChange: false
		ordering: false
		pageLength: 20
		info: false
		searching: true
		autoWidth: true
		changeSelector: Creator.tabularChangeSelector

if Meteor.isClient
	Listviews.getRelatedList = (object_name, record_id)->
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
						Tabular.tablesByName[tabular_name].options?.columns = Listviews.getTabularColumns(related_object_name, columns);

						related =
							object_name: related_object_name
							columns: columns
							tabular_table: Tabular.tablesByName[tabular_name]
							tabular_selector: tabular_selector
							related_field_name: related_field_name

						list.push related

		return list
