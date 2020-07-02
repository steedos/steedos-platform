Template.admin_instance_number_rules.helpers
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

Template.admin_instance_number_rules.events
	'click #create': (event)->
		$('.btn.record-types-create').click();

	'click #copy': (event)->
		dataTable = $(event.target).closest('table').DataTable();
		rowData = dataTable.row(event.currentTarget.parentNode.parentNode).data();
		if (rowData)
			Session.set 'cmDoc', rowData
			$('.btn.record-types-copy').click();

	'click #edit': (event) ->
		dataTable = $(event.target).closest('table').DataTable();
		rowData = dataTable.row(event.currentTarget.parentNode.parentNode).data();
		if (rowData)
			Session.set 'cmDoc', rowData
			$('.btn.record-types-edit').click();

	'click #remove': (event) ->
		dataTable = $(event.target).closest('table').DataTable();
		rowData = dataTable.row(event.currentTarget.parentNode.parentNode).data();
		if (rowData)
			Session.set 'cmDoc', rowData
			$('.btn.record-types-remove').click();

	'click #instance-number-rules-search-btn': (event) ->
		dataTable = $(".datatable-instance-number-rules").DataTable()
		selector = $("input[name='instance-number-rules-search-key']").val()
		dataTable.search(
			selector
		).draw();

	'keypress #instance-number-rules-search-key': (event, template) ->
		if event.keyCode == 13
			dataTable = $(".datatable-instance-number-rules").DataTable()
			selector = $("input[name='instance-number-rules-search-key']").val()
			dataTable.search(
				selector
			).draw();

	'click .datatable-instance-number-rules tr': (event) ->
		dataTable = $(event.target).closest('table').DataTable();
		rowData = dataTable.row(event.currentTarget).data();
		if rowData
			Session.set 'cmDoc', rowData
			$('.btn.record-types-edit').click();

Template.admin_instance_number_rules.onRendered ()->

	$('[data-toggle="tooltip"]').tooltip()

	if !Steedos.isPaidSpace()
		Steedos.spaceUpgradedModal()
		FlowRouter.go("/admin/home")

