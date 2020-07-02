Template.admin_import_export_flows.helpers
	selector: ->
		return {space: Session.get("spaceId"), is_deleted: false};
	updateButtonContent: ->
		return t("Update");

Template.admin_import_export_flows.events
	'click #importFlow': (event)->
		Modal.show("admin_import_flow_modal");

	'click #ioe-flows-search-btn': (event) ->
		dataTable = $(".datatable-ioe-flows").DataTable()
		selector = $("input[name='ioe-flows-search-key']").val()
		dataTable.search(
			selector
		).draw();

	'keypress #ioe-flows-search-key': (event, template) ->
		if event.keyCode == 13
			dataTable = $(".datatable-ioe-flows").DataTable()
			selector = $("input[name='ioe-flows-search-key']").val()
			dataTable.search(
				selector
			).draw();
