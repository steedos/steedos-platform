Template.creator_view.onCreated ->
	this.edit_fields = new ReactiveVar()
	this.edit_collection = new ReactiveVar()
	this.related_collection = new ReactiveVar()

Template.creator_view.onRendered ->
	this.autorun ->
		record_id = Session.get("record_id")
		if record_id
			$(".creator-view-tabs-link").closest(".slds-tabs_default__item").removeClass("slds-is-active")
			$(".creator-view-tabs-link").attr("aria-selected", false)

			$(".creator-view-tabs-link[data-tab='creator-quick-form']").closest(".slds-tabs_default__item").addClass("slds-is-active")
			$(".creator-view-tabs-link[data-tab='creator-quick-form']").attr("aria-selected", false)

			$(".creator-view-tabs-content").removeClass("slds-show").addClass("slds-hide")
			$("#creator-quick-form").addClass("slds-show")

	this.autorun ->
		object_name = Session.get "object_name"
		record_id = Session.get "record_id"
		if object_name and record_id
			Creator.subs["Creator"].subscribe "steedos_object_tabular", "creator_" + object_name, [record_id], {}

Template.creator_view.helpers

	collection: ()->
		return "Creator.Collections." + Session.get("object_name")

	editFields: ()->
		return Template.instance()?.edit_fields?.get()

	editCollection: ()->
		return Template.instance()?.edit_collection?.get()

	schema: ()->
		return Creator.getSchema(Session.get("object_name"))

	schemaFields: ()->
		schema = Creator.getSchema(Session.get("object_name"))._schema
		firstLevelSchema = Creator.getSchema(Session.get("object_name"))._firstLevelSchemaKeys
		keys = []
		schemaFields = []
		i = 0
		_.each schema, (value, key) ->
			if (_.indexOf firstLevelSchema, key) > -1
				if !value.autoform?.omit
					keys.push key

		while i < keys.length

			sc_1 = _.pick(schema, keys[i])
			sc_2 = _.pick(schema, keys[i+1])

			is_wide_1 = false
			is_wide_2 = false

			_.each sc_1, (value) ->
				if value.autoform?.is_wide
					is_wide_1 = true

			_.each sc_2, (value) ->
				if value.autoform?.is_wide
					is_wide_2 = true

			if is_wide_1
				schemaFields.push keys.slice(i, i+1)
				i += 1
			else if !is_wide_1 and is_wide_2
				childKeys = keys.slice(i, i+1)
				childKeys.push undefined
				schemaFields.push childKeys
				i += 1
			else if !is_wide_1 and !is_wide_2
				childKeys = keys.slice(i, i+1)
				if keys[i+1]
					childKeys.push keys[i+1]
				else
					childKeys.push undefined
				schemaFields.push childKeys
				i += 2


		return schemaFields

	keyValue: (key) ->
		record = Creator.getObjectRecord()
		return record[key]

	keyField: (key) ->
		fields = Creator.getObject().fields
		return fields[key]

	label: (key) ->
		return AutoForm.getLabelForField(key)

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

	recordPerminssion: (permissionName)->
		object_name = Session.get "object_name"
		record_id = Session.get "record_id"
		record = Creator.Collections[object_name].findOne record_id
		recordPerminssion = Creator.getRecordPermissions object_name, record, Meteor.userId()
		if recordPerminssion
			return recordPerminssion[permissionName]


	object: ()->
		return Creator.getObject()

	object_name: ()->
		return Session.get "object_name"

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

	'dblclick .slds-table td': (event) ->
		$(".table-cell-edit", event.currentTarget).click();

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

	'click .slds-table td': (event)->
		$(".slds-table td").removeClass("slds-has-focus")
		$(event.currentTarget).addClass("slds-has-focus")

	'click #creator-quick-form .table-cell-edit': (event)->
		$(".creator-record-edit").click()

	# 'click .add-file': (event)->
	'change #ins_upload_normal_attach': (event, template)->
		files = event.target.files
		i = 0
		while i < files.length
			file = files[i]
			if !file.name
				continue
			fileName = file.name
			if [
					'image.jpg'
					'image.gif'
					'image.jpeg'
					'image.png'
				].includes(fileName.toLowerCase())
				fileName = 'image-' + moment(new Date).format('YYYYMMDDHHmmss') + '.' + fileName.split('.').pop()
			# Session.set 'filename', fileName
			# $('.loading-text').text TAPi18n.__('workflow_attachment_uploading') + fileName + '...'
			fd = new FormData
			fd.append 'Content-Type', cfs.getContentType(fileName)
			fd.append 'file', file
			fd.append 'record_id', Session.get("record_id")
			fd.append 'object_name', Session.get("object_name")
			fd.append 'space', Session.get('spaceId')
			fd.append 'owner', Meteor.userId()
			fd.append 'owner_name', Meteor.user().name
			# fd.append 'is_private', file.is_private or false
			# if isAddVersion
			# 	fd.append 'isAddVersion', isAddVersion
			# 	fd.append 'parent', Session.get('attach_parent_id')
			# if isMainAttach
			# 	fd.append 'main', isMainAttach
			$(document.body).addClass 'loading'
			$.ajax
				url: Steedos.absoluteUrl('s3/')
				type: 'POST'
				async: true
				data: fd
				dataType: 'json'
				processData: false
				contentType: false
				success: (responseText, status) ->
					fileObj = undefined
					$(document.body).removeClass 'loading'
					# $('.loading-text').text ''
					if responseText.errors
						responseText.errors.forEach (e) ->
							toastr.error e.errorMessage
							return
						return
					toastr.success TAPi18n.__('Attachment was added successfully')
					return
				error: (xhr, msg, ex) ->
					$(document.body).removeClass 'loading'
					# $('.loading-text').text ''
					toastr.error msg
					return
			i++

