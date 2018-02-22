dxDataGridInstance = null

_fields = (related_object_name)->
	related_object = Creator.getObject(related_object)
	name_field_key = related_object.NAME_FIELD_KEY
	fields = [name_field_key]
	if related_object.list_views?.default?.columns
		fields = related_object.list_views.default.columns

	return fields

_columns = (related_object_name)->
	columns = _fields(related_object_name)
	object = Creator.getObject(related_object_name)
	return columns.map (n,i)->
		columnItem = 
			dataField: n
			cellTemplate: (container, options) ->
				field = object.fields[n]
				field_name = n
				if /\w+\.\$\.\w+/g.test(field_name)
					# object类型带子属性的field_name要去掉中间的美元符号，否则显示不出字段值
					field_name = n.replace(/\$\./,"")
				cellOption = {_id: options.data._id, val: options.data[n], doc: options.data, field: field, field_name: field_name, object_name:related_object_name}
				Blaze.renderWithData Template.creator_table_cell, cellOption, container[0]
		return columnItem

Template.related_object_list.onRendered ->
	self = this
	self.autorun ->
		if Steedos.spaceId()
			object_name = Session.get("object_name")
			related_object_name = Session.get("related_object_name")
			record_id = Session.get("record_id")
			url = "/api/odata/v4/#{Steedos.spaceId()}/#{related_object_name}"
			filter = Creator.getODataRelatedFilter(object_name, related_object_name, record_id)
			fields = _fields(related_object_name)
			columns = _columns(related_object_name)
			columns.push
				dataField: "_id"
				width: 60
				allowSorting: false
				headerCellTemplate: (container) ->
					return ""
				cellTemplate: (container, options) ->
					container.css("overflow", "visible")
					record_permissions = Creator.getRecordPermissions related_object_name, options.data, Meteor.userId()
					container.html(Blaze.toHTMLWithData Template.creator_table_actions, {_id: options.data._id, object_name: related_object_name, record_permissions: record_permissions, is_related: false}, container)

			columns.splice 0, 0, 
				dataField: "_id"
				width: 80
				allowSorting: false
				headerCellTemplate: (container) ->
					Blaze.renderWithData Template.creator_table_checkbox, {_id: "#", object_name: related_object_name}, container[0]
				cellTemplate: (container, options) ->
					Blaze.renderWithData Template.creator_table_checkbox, {_id: options.data._id, object_name: related_object_name}, container[0]
			self.$("#gridContainer").dxDataGrid({
				dataSource: {
					store: {
						type: "odata",
						version: 4,
						url: Steedos.absoluteUrl(url)
						withCredentials: false,
						beforeSend: (request) ->
							request.headers['X-User-Id'] = Meteor.userId()
							request.headers['X-Space-Id'] = Steedos.spaceId()
							request.headers['X-Auth-Token'] = Accounts._storedLoginToken()
						onLoading: (loadOptions)->
							console.log loadOptions
							return

					},
					select: fields
					filter: filter
				},
				columns: columns
			});
			dxDataGridInstance = self.$("#gridContainer").dxDataGrid('instance')

Template.related_object_list.helpers
	related_object_label: ()->
		return Creator.getObject(Session.get("related_object_name")).label

	object_label: ()->
		object_name = Session.get "object_name"
		return Creator.getObject(object_name).label
	
	record_name: ()->
		object_name = Session.get "object_name"
		record_id = Session.get "record_id"
		name_field_key = Creator.getObject(object_name).NAME_FIELD_KEY
		if Creator.Collections[object_name].findOne(record_id)
			return Creator.Collections[object_name].findOne(record_id)[name_field_key]

	record_url: ()->
		object_name = Session.get "object_name"
		record_id = Session.get "record_id"
		return Creator.getObjectUrl(object_name, record_id)

	allow_create: ()->
		related_object_name = Session.get "related_object_name"
		return Creator.getPermissions(related_object_name).allowCreate

Template.related_object_list.events
	"click .add-related-record": (event, template)->
		related_object_name = Session.get "related_object_name"
		object_name = Session.get "object_name"
		record_id = Session.get "record_id"
		action_collection_name = Creator.getObject(related_object_name).label
		related_lists = Creator.getRelatedList(object_name, record_id)
		related_field_name = _.findWhere(related_lists, {object_name: related_object_name}).related_field_name
		if related_field_name
			Session.set 'cmDoc', {"#{related_field_name}": record_id}
		Session.set "action_collection", "Creator.Collections.#{related_object_name}"
		Session.set "action_collection_name", action_collection_name
		Meteor.defer ->
			$(".creator-add").click()

	"click .list-item-action": (event, template)->
		actionKey = event.currentTarget.dataset.actionKey
		objectName = event.currentTarget.dataset.objectName
		recordId = event.currentTarget.dataset.recordId
		object = Creator.getObject(objectName)
		action = object.actions[actionKey]
		collection_name = object.label
		if action.todo == "standard_delete"
			action_record_title = template.$(".list-item-link-"+ recordId).attr("title")
			swal
				title: "删除#{object.label}"
				text: "<div class='delete-creator-warning'>是否确定要删除此#{object.label}？</div>"
				html: true
				showCancelButton:true
				confirmButtonText: t('Delete')
				cancelButtonText: t('Cancel')
				(option) ->
					if option
						Creator.Collections[objectName].remove {_id: recordId}, (error, result) ->
							if error
								toastr.error error.reason
							else
								info = object.label + "\"#{action_record_title}\"" + "已删除"
								toastr.success info
								dxDataGridInstance.refresh()
		else
			Session.set("action_fields", undefined)
			Session.set("action_collection", "Creator.Collections.#{objectName}")
			Session.set("action_collection_name", collection_name)
			Session.set("action_save_and_insert", true)
			Creator.executeAction objectName, action, recordId

	'click .table-cell-edit': (event, template) ->
		field = this.field_name

		if this.field.depend_on && _.isArray(this.field.depend_on)
			field = _.clone(this.field.depend_on)
			field.push(this.field_name)
			field = field.join(",")

		objectName = Session.get("related_object_name")
		collection_name = Creator.getObject(objectName).label
		rowData = this.doc

		if rowData
			Session.set("action_fields", field)
			Session.set("action_collection", "Creator.Collections.#{objectName}")
			Session.set("action_collection_name", collection_name)
			Session.set("action_save_and_insert", false)
			Session.set 'cmDoc', rowData
			Session.set 'cmIsMultipleUpdate', true
			Session.set 'cmTargetIds', Creator.TabularSelectedIds?[objectName]
			Meteor.defer ()->
				$(".btn.creator-cell-edit").click()

	'dblclick #gridContainer td': (event) ->
		$(".table-cell-edit", event.currentTarget).click()


Template.related_object_list.onCreated ->
	AutoForm.hooks creatorAddForm:
		onSuccess: (formType,result)->
			dxDataGridInstance.refresh()
			dxDataGridInstance.refresh().done (result)->
				Creator.remainCheckboxState(dxDataGridInstance.$element())
	,true
	AutoForm.hooks creatorEditForm:
		onSuccess: (formType,result)->
			dxDataGridInstance.refresh()
			dxDataGridInstance.refresh().done (result)->
				Creator.remainCheckboxState(dxDataGridInstance.$element())
	,true
	AutoForm.hooks creatorCellEditForm:
		onSuccess: (formType,result)->
			dxDataGridInstance.refresh()
			dxDataGridInstance.refresh().done (result)->
				Creator.remainCheckboxState(dxDataGridInstance.$element())
	,true

Template.creator_grid.onDestroyed ->
	object_name = Session.get("object_name")
	#离开界面时，清除hooks为空函数
	AutoForm.hooks creatorAddForm:
		onSuccess: undefined
	,true
	AutoForm.hooks creatorEditForm:
		onSuccess: undefined
	,true
	AutoForm.hooks creatorCellEditForm:
		onSuccess: undefined
	,true