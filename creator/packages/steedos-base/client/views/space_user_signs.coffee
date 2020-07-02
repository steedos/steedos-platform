Template.space_user_signs.helpers
	selector: ()->
		spaceId = Steedos.spaceId()
		selector = {
			space: spaceId
		}
		return selector

	insertButtonContent: ()->
		return t("Create")


Template.space_user_signs.events
	'click #addUserSigns': (event) ->
		Session.set "cmDoc",{}
		$(".space-user-signs-insert").click()

	'click .datatable-space-user-signs tr': (event) ->
		dataTable = $(event.target).closest('table').DataTable();
		rowData = dataTable.row(event.currentTarget).data();
		if (rowData)
			Session.set 'cmDoc', rowData
			$('.space-user-signs-edit').click();

	'click #space-user-signs-search-btn': (event) ->
		dataTable = $(".datatable-space-user-signs").DataTable()
		selector = $("input[name='space-user-signs-search-key']").val()
		dataTable.search(
			selector
		).draw();

	'keypress #space-user-signs-search-key': (event, template) ->
		if event.keyCode == 13
			dataTable = $(".datatable-space-user-signs").DataTable()
			selector = $("input[name='space-user-signs-search-key']").val()
			dataTable.search(
				selector
			).draw();
