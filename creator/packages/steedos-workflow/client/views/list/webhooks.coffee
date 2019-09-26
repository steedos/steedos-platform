Template.webhooks.helpers
	selector: ()->
		spaceId = Steedos.spaceId()
		selector = {
			space: spaceId
		}
		return selector

	insertButtonContent: ()->
		return t("Create")


Template.webhooks.events
	'click #addWebhooks': (event) ->
		Session.set "cmDoc",{}
		$(".webhooks-insert").click()

	'click .datatable-webhooks tr': (event) ->
		dataTable = $(event.target).closest('table').DataTable();
		rowData = dataTable.row(event.currentTarget).data();
		if (rowData)
			Session.set 'cmDoc', rowData
			$('.webhooks-edit').click();

	'click #webhooks-search-btn': (event) ->
		dataTable = $(".datatable-webhooks").DataTable()
		selector = $("input[name='webhooks-search-key']").val()
		dataTable.search(
			selector
		).draw();

	'keypress #webhooks-search-key': (event, template) ->
		if event.keyCode == 13
			dataTable = $(".datatable-webhooks").DataTable()
			selector = $("input[name='webhooks-search-key']").val()
			dataTable.search(
				selector
			).draw();
