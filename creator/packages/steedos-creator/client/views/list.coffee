Template.creator_list.helpers

	collectionName: ()->
		return FlowRouter.getParam("collection_name")

	collection: ()->
		return "Creator.Collections." + FlowRouter.getParam("collection_name")

	tabular_table: ()->
		return Creator.TabularTables[FlowRouter.getParam("collection_name")]

Template.creator_list.events
	'click .table-creator tr': (event) ->
		console.log("table-creator....")
		dataTable = $(event.target).closest('table').DataTable();
		rowData = dataTable.row(event.currentTarget).data()
		if rowData
			Session.set 'cmDoc', rowData
			$('.btn.creator-edit').click();