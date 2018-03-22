_filter = (record_ids) ->
	filter = []
	_.each record_ids, (id)->
		if filter.length > 0
			filter.push "or"
		filter.push ["_id", "=", id]
	return filter

_select = (object_name) ->
	obj = Creator.getObject(object_name)
	if !obj
		return
	default_columns = obj.list_views?.default.columns || [obj.NAME_FIELD_KEY]
	fields = obj.fields
	default_columns = _.map default_columns, (column) ->
		if fields[column].type and !fields[column].hidden
			return column
		else
			return undefined
	default_columns = _.compact(default_columns)
	return default_columns

_columns = (object_name, columns)->
	object = Creator.getObject(object_name)
	return columns.map (n,i)->
		field = object.fields[n]
		columnItem = 
			cssClass: "slds-cell-edit"
			caption: field.label || TAPi18n.__(object.schema.label(n))
			dataField: n
			alignment: "left"
			cellTemplate: (container, options) ->
				field_name = n
				if /\w+\.\$\.\w+/g.test(field_name)
					# object类型带子属性的field_name要去掉中间的美元符号，否则显示不出字段值
					field_name = n.replace(/\$\./,"")
				cellOption = {_id: options.data._id, val: options.data[n], doc: options.data, field: field, field_name: field_name, object_name:object_name, agreement: "odata"}
				Blaze.renderWithData Template.creator_table_cell, cellOption, container[0]
		return columnItem

Template.search_result_list.onRendered -> 
	object_name = Template.instance().data.object_name
	record_ids = Template.instance().data.record_ids

	url = "/api/odata/v4/#{Steedos.spaceId()}/#{object_name}"
	filter = _filter(record_ids)
	select = _select(object_name)
	console.log "filter", filter
	columns = _columns(object_name, select)

	dxOptions = 
		paging: 
			pageSize: 10
		pager: 
			showPageSizeSelector: true,
			allowedPageSizes: [10,25, 50, 100],
			showInfo: false,
			showNavigationButtons: true
		showColumnLines: false
		allowColumnReordering: true
		allowColumnResizing: true
		columnResizingMode: "widget"
		showRowLines: true
		dataSource: 
			store: 
				type: "odata"
				version: 4
				url: Steedos.absoluteUrl(url)
				withCredentials: false
				beforeSend: (request) ->
					request.headers['X-User-Id'] = Meteor.userId()
					request.headers['X-Space-Id'] = Steedos.spaceId()
					request.headers['X-Auth-Token'] = Accounts._storedLoginToken()
				errorHandler: (error) ->
					if error.httpStatus == 404 || error.httpStatus == 400
						error.message = t "creator_odata_api_not_found"
			select: select
			filter: filter
		columns: columns
	

	self.$(".search-gridContainer-#{object_name}").dxDataGrid(dxOptions)

Template.search_result_list.helpers 
	object_name: ->
		return Template.instance().data.object_name
		 
	rendered: -> 
		 
	destroyed: -> 
		 

Template.search_result_list.events 
	"click #foo": (event, template) -> 
		 
