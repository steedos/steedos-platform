Template.creator_list.helpers

	object_name: ()->
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
		selector = {}
		if Session.get("spaceId") and Meteor.userId()
			if list_view.filter_scope == "spacex"
				selector.space = 
					$in: [null,Session.get("spaceId")]
			else
				selector.space = Session.get("spaceId")
			if Session.get("list_view_id") == "recent"
				viewed = Creator.Collections.object_recent_viewed.find().fetch();
				selector._id = 
					"$in": _.pluck viewed, "record_id"
			if list_view.filters
				try 
					filters = list_view.filters
					filters = filters.replace "{{userId}}", '"' + Meteor.userId() + '"'
					filters = filters.replace "{{spaceId}}", '"' + Session.get("spaceId") + '"'
					filters = "filters="+filters
					filters_obj = eval(filters)
					# selector = ["$and": [selector, filters_obj]]
					selector = _.extend selector, filters_obj
					return selector
				catch e
					console.log e
					return
			else
				permissions = Creator.getPermissions()
				if permissions.viewAllRecords 
					if list_view.filter_scope == "mine"
						selector.owner = Meteor.userId()
					return selector
				else if permissions.allowRead
					selector.owner = Meteor.userId()
					return selector
		return {_id: "nothing"}

	object: ()->
		return Creator.getObject()

	itemCount: ()->
		collection = Session.get("object_name")
		info = Tabular.tableRecords.findOne("creator_" + collection)
		return info?.recordsTotal

	list_view_id: ()->
		return Session.get("list_view_id")

	list_views: ()->
		return Creator.getListViews()

	list_view_label: (list_view_id)->
		return t("list_view_" + list_view_id)

	list_view: ()->
		list_view_id = Session.get("list_view_id")
		return Creator.getListView(Session.get("object_name"), list_view_id)

	list_view_visible: ()->
		return Session.get("list_view_visible")

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

	'click .list-view-switch': (event)->
		Session.set("list_view_visible", false)
		list_view_id = String(this)
		Tracker.afterFlush ()->
			list_view = Creator.getListView(Session.get("object_name"), list_view_id)
			Creator.TabularTables[Session.get("object_name")].options.columns = Creator.getTabularColumns(Session.get("object_name"), list_view.columns);
			Session.set("list_view_id", list_view_id)
			Session.set("list_view_visible", true)

	'click .item-edit-action': (event) ->
		_id = event.currentTarget.dataset?.id
		object_name = Session.get("object_name")

		if _id
			record = Creator.Collections[object_name].findOne _id
			console.log record
			Session.set 'cmDoc', record
			$(".btn.creator-edit").click()

	'click .item-delete-action': (event) ->
		object_name = Session.get('object_name')
		_id = event.currentTarget.dataset?.id
		record = Creator.Collections[object_name].findOne _id

		swal
			title: "删除#{t(object_name)}"
			text: "<div class='delete-creator-warning'>是否确定要删除此#{t(object_name)}？</div>"
			html: true
			showCancelButton:true
			confirmButtonText: t('Delete')
			cancelButtonText: t('Cancel')
			(option) ->
				if option
					Creator.Collections[object_name].remove {_id: _id}, (error, result) ->
						if error
							toastr.error error.reason
						else
							info = t(object_name) + '"' + record.name + '"' + "已删除"
							toastr.success info