Template.creator_view.helpers

	collection: ()->
		return "Creator.Collections." + Session.get("object_name")

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
		list = []
		_.each Creator.getObject()?.related_list, (list_view, related_object_name)->
			tabular_name = Session.get("object_name") + "_related_" + related_object_name
			related_object = Creator.Objects[related_object_name]
			related_field_name = ""
			_.each related_object.fields, (field, field_name)->
				if field?.reference_to == Session.get("object_name")
					related_field_name = field_name
			if related_field_name
				tabular_selector = {space: Session.get("spaceId")}
				tabular_selector[related_field_name] = Session.get("record_id")
				related =
					object_name: related_object_name
					columns: list_view.columns
					tabular_table: Creator.TabularTables[tabular_name]
					tabular_selector: tabular_selector
					related_field_name: related_field_name
				list.push related
		return list

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
				selecor.owner = Meteor.userId()
				return selector
		return {_id: "nothing to return"}

	appName: ()->
		app = db.apps.findOne(Session.get("app_id"))
		return app?.name


Template.creator_view.events
	'click .edit-creator': (event) ->
		$(".creator-edit").click()

	'click .delete-creator': (event) ->
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
