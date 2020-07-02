Template.admin_categories.helpers
	selector: ->
		return {space: Session.get("spaceId")};

	updateButtonContent: ->
		return t("Update");

Template.admin_categories.events
	'click #editFlow': (event) ->
		dataTable = $(event.target).closest('table').DataTable();
		rowData = dataTable.row(event.currentTarget.parentNode.parentNode).data();
		if (rowData)
			Session.set 'cmDoc', rowData
			$('.btn.record-types-edit').click();

	'click .datatable-categories tr': (event) ->
		dataTable = $(event.target).closest('table').DataTable();
		rowData = dataTable.row(event.currentTarget).data()
		if rowData
			Session.set 'cmDoc', rowData
			$('.btn.record-types-edit').click();

	'click #categories-search-btn': (event) ->
		dataTable = $(".datatable-categories").DataTable()
		selector = $("input[name='categories-search-key']").val()
		dataTable.search(
			selector
		).draw();

	'keypress #categories-search-key': (event, template) ->
		if event.keyCode == 13
			dataTable = $(".datatable-categories").DataTable()
			selector = $("input[name='categories-search-key']").val()
			dataTable.search(
				selector
			).draw();
