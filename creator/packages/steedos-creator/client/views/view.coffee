Template.creator_view.onCreated ->
	this.edit_fields = new ReactiveVar()
	this.edit_collection = new ReactiveVar()
	this.related_collection = new ReactiveVar()

Template.creator_view.helpers

	collection: ()->
		return "Creator.Collections." + Session.get("object_name")

	editFields: ()->
		return Template.instance()?.edit_fields?.get()

	editCollection: ()->
		return Template.instance()?.edit_collection?.get()

	schema: ()->
		return Creator.getSchema(Session.get("object_name"))
	
	hasPermission: (permissionName)->
		permissions = Creator.getObject()?.permissions?.default
		if permissions
			return permissions[permissionName]

	record: ()->
		return Creator.getObjectRecord()

	backUrl: ()->
		return Creator.getObjectUrl(Session.get("object_name"), null)

	showForm: ()->
		if Creator.getObjectRecord()
			return true

	hasPermission: (permissionName)->
		permissions = Creator.getPermissions()
		if permissions
			return permissions[permissionName]

	object: ()->
		return Creator.getObject()
		
	related_list: ()->
		return Creator.getRelatedList(Session.get("object_name"), Session.get("record_id"))

	related_list_count: ()->
		info = Tabular.tableRecords.findOne("creator_" + this.object_name)
		return info?.recordsTotal
		
	related_selector: (object_name, related_field_name)->
		object_name = this.object_name
		related_field_name = this.related_field_name
		if object_name and related_field_name and Session.get("spaceId")
			selector = {space: Session.get("spaceId")}
			selector[related_field_name] = Session.get("record_id")
			permissions = Creator.getPermissions(object_name)
			if permissions.viewAllRecords 
				return selector
			else if permissions.allowRead and Meteor.userId()
				selector.owner = Meteor.userId()
				return selector
		return {_id: "nothing to return"}

	appName: ()->
		app = Creator.getApp()
		return app?.name

	related_object: ()->
		return Creator.Objects[this.object_name]

	related_collection: ()->
		return Template.instance()?.related_collection?.get()

	allowCreate: ()->
		return Creator.getPermissions(this.object_name).allowCreate

	detail_info_visible: ()->
		return Session.get("detail_info_visible")

	doc: ()->
		return Session.get("editing_record_id")

	actions: ()->
		obj = Creator.getObject()
		actions = _.values(obj.actions) 
		actions = _.where(actions, {on: "record", visible: true})
		return actions

Template.creator_view.events

	'click .list-action-custom': (event) ->
		Creator.executeAction Session.get("object_name"), this

	'click .record-action-edit': (event) ->
		$(".creator-record-edit").click()

	'click .record-action-delete': (event) ->
		object_name = Session.get('object_name')
		record = Creator.getObjectRecord()

		swal
			title: "删除#{t(object_name)}"
			text: "<div class='delete-creator-warning'>是否确定要删除此#{t(object_name)}？</div>"
			html: true
			showCancelButton:true
			confirmButtonText: t('Delete')
			cancelButtonText: t('Cancel')
			(option) ->
				if option
					Creator.Collections[object_name].remove {_id: record._id}, (error, result) ->
						if error
							toastr.error error.reason
						else
							info = t(object_name) + '"' + record.name + '"' + "已删除"
							toastr.success info

							appid = Session.get("app_id")
							FlowRouter.go "/app/#{appid}/#{object_name}/list"


	'click .creator-view-tabs-link': (event) ->
		$(".creator-view-tabs-link").closest(".slds-tabs_default__item").removeClass("slds-is-active")
		$(".creator-view-tabs-link").attr("aria-selected", false)

		$(event.currentTarget).closest(".slds-tabs_default__item").addClass("slds-is-active")
		$(event.currentTarget).attr("aria-selected", true)

		tab = "#" + event.currentTarget.dataset.tab
		$(".creator-view-tabs-content").removeClass("slds-show").addClass("slds-hide")
		$(tab).removeClass("slds-hide").addClass("slds-show")


	'click .slds-truncate > a': (event) ->
		Session.set("detail_info_visible", false)
		Tracker.afterFlush ()->
			Session.set("detail_info_visible", true)

	'click .table-cell-edit': (event, template) ->
		field = this.field_name
		object_name = this.object_name

		dataTable = $(event.currentTarget).closest('table').DataTable()
		tr = $(event.currentTarget).closest("tr")
		rowData = dataTable.row(tr).data()

		if rowData
			template.edit_fields.set(field)
			template.edit_collection.set("Creator.Collections.#{object_name}" )
			Session.set 'cmDoc', rowData

			setTimeout ()->
				$(".related-object-cell-edit").click()
			, 1

	'click .add-related-object-record': (event, template) ->
		object_name = event.currentTarget.dataset.objectName
		collection = "Creator.Collections.#{object_name}"

		relatedKey = ""
		relatedValue = Session.get("record_id")
		Creator.getRelatedList(Session.get("object_name"), Session.get("record_id")).forEach (related_obj) ->
			if object_name == related_obj.object_name
				relatedKey = related_obj.related_field_name

		Session.set 'cmDoc', {"#{relatedKey}": relatedValue}

		template.related_collection.set(collection)
		setTimeout ->
			$(".related-object-new").click()
		, 1

	'click .item-edit-action': (event, template) ->
		dataTable = $(event.currentTarget).closest('table').DataTable()
		tr = $(event.currentTarget).closest("tr")
		record_id = dataTable.row(tr).data()._id

		if record_id
			object_name = event.currentTarget.dataset.objectName
			Session.set 'editing_object_name', object_name
			Session.set 'editing_record_id', record_id

			collection = "Creator.Collections.#{object_name}"
			template.edit_collection.set(collection)
			setTimeout ->
				$(".related-object-row-edit").click()
			, 1