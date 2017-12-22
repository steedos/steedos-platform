Template.creator_list.onCreated ->
	this.edit_fields = new ReactiveVar()

Template.creator_list.helpers

	object_name: ()->
		return Session.get("object_name")

	collection: ()->
		return "Creator.Collections." + Session.get("object_name")

	tabular_table: ()->
		return Creator.getTable(Session.get("object_name"))

	hasPermission: (permissionName)->
		permissions = Creator.getPermissions()
		if permissions
			return permissions[permissionName]


	fields: ->
		return Template.instance()?.edit_fields.get()


	selector: ()->
		object_name = Session.get("object_name")
		list_view = Creator.getListView()
		selector = {}
		if Session.get("spaceId") and Meteor.userId()
			if list_view.filter_scope == "spacex"
				selector.space = 
					$in: [null,Session.get("spaceId")]
			else if object_name == "users"
				selector.space = 
					"$exists": false
			else
				selector.space = Session.get("spaceId")
			if Session.get("list_view_id") == "recent"
				record_ids = Creator.Collections.object_recent_viewed.find({object_name: object_name}).fetch()[0]?.record_ids;
				if !record_ids
					record_ids = ["nothing"]
				selector._id = 
					"$in": record_ids
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

	doc: ()->
		return Session.get("editing_record_id")

	actions: ()->
		obj = Creator.getObject()
		actions = _.values(obj.actions) 
		actions = _.where(actions, {on: "list", visible: true})
		return actions

Template.creator_list.events
	# 'click .table-creator tr': (event) ->
	# 	dataTable = $(event.target).closest('table').DataTable();
	# 	rowData = dataTable.row(event.currentTarget).data()
	# 	if rowData
	# 		Session.set 'cmDoc', rowData
	# 		# $('.btn.creator-edit').click();
	# 		FlowRouter.go "/creator/app/" + FlowRouter.getParam("object_name") + "/view/" + rowData._id

	'click .list-action-add': (event) ->
		$(".creator-add").click()

	'click .list-action-custom': (event) ->
		Creator.executeAction Session.get("object_name"), this

	'click .list-view-switch': (event)->
		Session.set("list_view_visible", false)
		list_view_id = String(this)
		Tracker.afterFlush ()->
			list_view = Creator.getListView(Session.get("object_name"), list_view_id)
			Creator.getTable(Session.get("object_name"))?.options.columns = Creator.getTabularColumns(Session.get("object_name"), list_view.columns);
			Session.set("list_view_id", list_view_id)
			Session.set("list_view_visible", true)

	'click .item-edit-action': (event) ->
		record_id = event.currentTarget.dataset?.id
		object_name = Session.get("object_name")

		if record_id
			Session.set 'editing_object_name', object_name
			Session.set 'editing_record_id', record_id
			$(".btn.creator-edit").click()

	'click .table-cell-edit': (event, template) ->
		field = this.field_name

		dataTable = $(event.currentTarget).closest('table').DataTable()
		tr = $(event.currentTarget).closest("tr")
		rowData = dataTable.row(tr).data()

		if rowData
			template.edit_fields.set(field)
			Session.set 'cmDoc', rowData

			setTimeout ()->
				$(".edit-list-table-cell").click()
			, 1

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

	'change .slds-table .select-one': (event)->
		currentDataset = event.currentTarget.dataset
		currentId = currentDataset.id
		currentObjectName = currentDataset.objectName

		tabular_selected_ids = Session.get "tabular_selected_ids"
		unless tabular_selected_ids
			tabular_selected_ids = {}
		unless tabular_selected_ids[currentObjectName]
			tabular_selected_ids[currentObjectName] = []
		
		currentIndex = tabular_selected_ids[currentObjectName].indexOf currentId
		if $(event.currentTarget).is(":checked")
			if currentIndex < 0
				tabular_selected_ids[currentObjectName].push currentId
		else
			unless currentIndex < 0
				tabular_selected_ids[currentObjectName].splice(currentIndex, 1)
		Session.set "tabular_selected_ids", tabular_selected_ids
		
		checkboxs = $(".slds-table .select-one[data-object-name=#{currentObjectName}]")
		selectedLength = tabular_selected_ids[currentObjectName].length
		if selectedLength > 0 and checkboxs.length != selectedLength
			$(".slds-table .select-all[data-object-name=#{currentObjectName}]").prop("indeterminate",true)
		else
			$(".slds-table .select-all[data-object-name=#{currentObjectName}]").prop("indeterminate",false)

	'change .slds-table .select-all': (event)->
		currentDataset = event.currentTarget.dataset
		currentObjectName = currentDataset.objectName
		isSelectedAll = $(event.currentTarget).is(":checked")
		tabular_selected_ids = Session.get "tabular_selected_ids"
		unless tabular_selected_ids
			tabular_selected_ids = {}
		tabular_selected_ids[currentObjectName] = []
		checkboxs = $(".slds-table .select-one[data-object-name=#{currentObjectName}]")
		if isSelectedAll
			checkboxs.each (i,n)->
				tabular_selected_ids[currentObjectName].push n.dataset.id
		Session.set "tabular_selected_ids", tabular_selected_ids
		checkboxs.prop("checked",isSelectedAll)