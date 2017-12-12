Template.creator_list.helpers

	collectionName: ()->
		return FlowRouter.getParam("object_name")

	collection: ()->
		return "Creator.Collections." + FlowRouter.getParam("object_name")

	tabular_table: ()->
		return Creator.TabularTables[FlowRouter.getParam("object_name")]

	hasPermission: (permissionName)->
		permissions = Creator.Objects[FlowRouter.getParam("object_name")]?.permissions?.default
		if permissions
			return permissions[permissionName]


Template.creator_list.events
	'click .table-creator tr': (event) ->
		dataTable = $(event.target).closest('table').DataTable();
		rowData = dataTable.row(event.currentTarget).data()
		if rowData
			Session.set 'cmDoc', rowData
			$('.btn.creator-edit').click();