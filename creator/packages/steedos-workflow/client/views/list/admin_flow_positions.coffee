Template.admin_flow_positions.helpers
	selector: ->
		return {space: Session.get("spaceId")};

	updateButtonContent: ->
		return t("Update");

	insertButtonContent: ->
		return t("Create")

	removeButtonContent: ->
		return t("Delete")

	removePrompt: ->
		return t("ConfirmDeletion?");

Template.admin_flow_positions.events
	'click #create': (event)->
		$('.btn.record-types-create').click();

	'click #copy': (event) ->
		dataTable = $(event.target).closest('table').DataTable();
		rowData = dataTable.row(event.currentTarget.parentNode.parentNode).data();
		if (rowData)
			Session.set 'cmDoc', rowData
			$('.btn.record-types-copy').click();

	'click .datatable-flow-positions tr': (event) ->
		dataTable = $(".datatable-flow-positions").DataTable()
		rowData = dataTable.row(event.currentTarget).data()
		if rowData
			Session.set 'cmDoc', rowData
			$('.btn.record-types-edit').click();

	'click #flow-position-search-btn': (event) ->
		dataTable = $(".datatable-flow-positions").DataTable()
		selector = $("input[name='flow-position-search-key']").val()
		dataTable.search(
			selector
		).draw();

	'keypress #flow-position-search-key': (event, template) ->
		if event.keyCode == 13
			dataTable = $(".datatable-flow-positions").DataTable()
			selector = $("input[name='flow-position-search-key']").val()
			dataTable.search(
				selector
			).draw();


Template.admin_flow_positions.onRendered ->
	$('[data-toggle="tooltip"]').tooltip()