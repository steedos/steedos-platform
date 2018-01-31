Template.custom_data_source.helpers


Template.custom_data_source.events


Template.custom_data_source.onRendered ()->



	orders = new (DevExpress.data.CustomStore)(
		load: (loadOptions) ->
			deferred = $.Deferred()
			args = {}
			if loadOptions.sort
				args.orderby = loadOptions.sort[0].selector
				if loadOptions.sort[0].desc
					args.orderby += ' desc'
			args.skip = loadOptions.skip or 0
			args.take = loadOptions.take or 1
			filter = ''
			if loadOptions.filter
				filter = '&$filter=' + DevExpress.data.queryAdapters.odata.compileCriteria(loadOptions.filter,4,[])
			$.ajax
				url: 'http://127.0.0.1:5000/api/odata/v4/'+Steedos.spaceId()+'/archive_records?'+filter
				data: args
				beforeSend: (request) ->
					request.setRequestHeader 'X-User-Id', 'JkXLBmvpAzwxvWjJT'
					request.setRequestHeader 'X-Space-Id', 'n9eLY4aFpnvGroHy6'
					request.setRequestHeader 'X-Auth-Token', 's2c3DVHBDS6vjaxDsd9MFZD7LbJW1UQSN00qw_oqZSf'
					return
				success: (result) ->
					deferred.resolve result.data, totalCount: result.count
					return
				error: ->
					deferred.reject 'Data Loading Error'
					return
				timeout: 5000
			deferred.promise()
	)
	dataGrid = $('#gridContainer').dxDataGrid(
		dataSource:
			store: orders
		remoteOperations:
			sorting: true
			paging: true
		paging:
			pageSize: 1
		pager:
			showPageSizeSelector: true
			allowedPageSizes: [
				8
				12
				20
			]
		columns: [
			'title'
			'date'
		]
		columnsAutoWidth: true
		filterRow:
			visible: true,
			applyFilter: "auto"
		searchPanel:
			visible: true
			width: 240
			placeholder: "Search..."
		headerFilter:
			visible: true
		remoteOperations:
			filtering: true
	).dxDataGrid 'instance'


	applyFilterTypes = [{
		key: "auto",
		name: "Immediately"
	}, {
		key: "onClick",
		name: "On Button Click"
	}];

	applyFilterModeEditor = $("#useFilterApplyButton").dxSelectBox({
		items: applyFilterTypes,
		value: applyFilterTypes[0].key,
		valueExpr: "key",
		displayExpr: "name",
		onValueChanged: (data) ->
			dataGrid.option("filterRow.applyFilter", data.value);
	}).dxSelectBox("instance")

	$("#filterRow").dxCheckBox({
		text: "Filter Row",
		value: true,
		onValueChanged: (data) ->
			dataGrid.clearFilter()
			dataGrid.option("filterRow.visible", data.value)
			applyFilterModeEditor.option("disabled", !data.value)
	})

	$("#headerFilter").dxCheckBox({
		text: "Header Filter",
		value: true,
		onValueChanged: (data) ->
			dataGrid.clearFilter()
			dataGrid.option("headerFilter.visible", data.value)
	})

	getOrderDay = (rowData) ->
		return (new Date(rowData.OrderDate)).getDay()
