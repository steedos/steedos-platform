Template.creator_list.helpers

	collectionName: ()->
		return Session.get("object_name")

	collection: ()->
		return "Creator.Collections." + Session.get("object_name")

	tabular_table: ()->
		return Creator.TabularTables[Session.get("object_name")]

	hasPermission: (permissionName)->
		permissions = Creator.getPermissions()
		if permissions
			return permissions[permissionName]

	selector: ()->
		if Session.get("spaceId")
			permissions = Creator.getPermissions()
			if permissions.viewAllRecords 
				return {space: Session.get("spaceId")}
			else if permissions.allowRead and Meteor.userId()
				return {space: Session.get("spaceId"), owner: Meteor.userId()}
		return {_id: "nothing to return"}


Template.creator_list.events
	# 'click .table-creator tr': (event) ->
	# 	dataTable = $(event.target).closest('table').DataTable();
	# 	rowData = dataTable.row(event.currentTarget).data()
	# 	if rowData
	# 		Session.set 'cmDoc', rowData
	# 		# $('.btn.creator-edit').click();
	# 		FlowRouter.go "/creator/app/" + FlowRouter.getParam("object_name") + "/view/" + rowData._id