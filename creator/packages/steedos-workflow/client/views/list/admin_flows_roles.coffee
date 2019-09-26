Template.admin_flow_roles.helpers
	selector: ->
		spaceId = Steedos.spaceId()
		selector = 
			space: spaceId

		return selector

	insertButtonContent: () ->
		return t("admin_flow_roles_create")

Template.admin_flow_roles.events
	'click .role-help': () ->
		Steedos.openWindow("https://www.steedos.com/cn/help/workflow/admin_positions.html")

	'click #create': (event,template) ->
		Session.set "cmDoc",{}
		$(".admin-roles-add").click()

	'click .dataTale-flow-roles tr': (event, template) ->
		dataTable = $(event.target).closest('table').DataTable();
		rowData = dataTable.row(event.currentTarget).data();
		if rowData
			Modal.show("admin_flows_roles_modal", rowData)


	'click #flow-roles-search-btn': (event) ->
		dataTable = $(".dataTale-flow-roles").DataTable()
		selector = $("input[name='flow-roles-search-key']").val()
		dataTable.search(
			selector
		).draw();

	'keypress #flow-roles-search-key': (event, template) ->
		if event.keyCode == 13
			dataTable = $(".dataTale-flow-roles").DataTable()
			selector = $("input[name='flow-roles-search-key']").val()
			dataTable.search(
				selector
			).draw();