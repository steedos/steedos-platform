Template.odata_service.helpers


Template.odata_service.events


Template.odata_service.onRendered ()->
	$("#gridContainerOdata").dxDataGrid({
		dataSource: {
			store: {
				type: "odata",
				version: 4,
				url: 'http://127.0.0.1:5000/api/odata/v4/'+Steedos.spaceId()+'/archive_records',
				withCredentials: false,
				beforeSend: (request) ->
					request.headers['X-User-Id'] = 'JkXLBmvpAzwxvWjJT';
					request.headers['X-Space-Id'] = 'n9eLY4aFpnvGroHy6';
					request.headers['X-Auth-Token'] = 's2c3DVHBDS6vjaxDsd9MFZD7LbJW1UQSN00qw_oqZSf';
				onLoading: (loadOptions)->
					console.log loadOptions
					return

			},
			select: [
				"title",
				"year"
			]
		},
		paging:
			pageSize: 1
		pager:
			showPageSizeSelector: true
			allowedPageSizes: [
				1
				2
				3
			]
		columns: [
			'title'
			'year'
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
			sorting: true
			paging: true
			grouping: false
		groupPanel:
			visible: "auto"
		grouping:
			autoExpandAll: true
			contextMenuEnabled: true
			expandMode: "rowClick"
	});
