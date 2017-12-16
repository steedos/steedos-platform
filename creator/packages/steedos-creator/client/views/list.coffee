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
		list_view = Creator.getListView()
		if Session.get("spaceId")
			permissions = Creator.getPermissions()
			if permissions.viewAllRecords 
				if list_view.filter_scope == "all"
					return {space: Session.get("spaceId")}
				else if list_view.filter_scope == "mine"
					return {space: Session.get("spaceId"), owner: Meteor.userId()}
			else if permissions.allowRead and Meteor.userId()
				return {space: Session.get("spaceId"), owner: Meteor.userId()}
		return {_id: "nothing to return"}

	object: ()->
		return Creator.getObject()

	itmeCount: ()->
		collection = Session.get("object_name")
		return Creator.Collections[collection].find().count()


Template.creator_list.events
	# 'click .table-creator tr': (event) ->
	# 	dataTable = $(event.target).closest('table').DataTable();
	# 	rowData = dataTable.row(event.currentTarget).data()
	# 	if rowData
	# 		Session.set 'cmDoc', rowData
	# 		# $('.btn.creator-edit').click();
	# 		FlowRouter.go "/creator/app/" + FlowRouter.getParam("object_name") + "/view/" + rowData._id

	'click .add-creator': (event) ->
		$(".creator-add").click()