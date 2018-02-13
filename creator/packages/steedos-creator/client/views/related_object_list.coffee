dxDataGridInstance = null

initFilter = (object_name, related_object_name, record_id) ->
	spaceId = Steedos.spaceId()
	userId = Meteor.userId()
	related_lists = Creator.getRelatedList(object_name, record_id)
	related_field_name = ""
	selector = []
	_.each related_lists, (obj)->
		if obj.object_name == related_object_name
			related_field_name = obj.related_field_name
	
	related_field_name = related_field_name.replace(/\./g, "/")

	if related_object_name == "cfs.files.filerecord"
		selector.push(["metadata/space", "=", spaceId])
	else
		selector.push(["space", "=", spaceId])

	if related_object_name == "cms_files"
		selector.push("and", ["parent/o", "=", object_name])
		selector.push("and", ["parent/ids", "=", record_id])
	else
		selector.push("and", [related_field_name, "=", record_id])
	
	permissions = Creator.getPermissions(related_object_name, spaceId, userId)
	if !permissions.viewAllRecords and permissions.allowRead
		selector.push("and", ["owner", "and", userId])

	return selector

_fields = (related_object_name)->
	related_object = Creator.getObject(related_object)
	name_field_key = related_object.NAME_FIELD_KEY
	fields = [name_field_key]
	if related_object.list_views?.default?.columns
		fields = related_object.list_views.default.columns

	return fields

_columns = (related_object_name)->
	columns = _fields(related_object_name)
	return columns.map (column)->
		return {dataField: column, caption: column}

Template.related_object_list.onRendered ->
	self = this
	self.autorun ->
		if Steedos.spaceId()
			object_name = Session.get("object_name")
			related_object_name = Session.get("related_object_name")
			record_id = Session.get("record_id")
			url = "/api/odata/v4/#{Steedos.spaceId()}/#{related_object_name}"
			filter = initFilter(object_name, related_object_name, record_id)
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
					record_permissions = Creator.getRecordPermissions object_name, options.data, Meteor.userId()
					container.html(Blaze.toHTMLWithData Template.creator_table_actions, {_id: options.data._id, object_name: object_name, record_permissions: record_permissions, is_related: false}, container)
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
	"click .add-related-record": (event)->
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


Template.related_object_list.onCreated ->
	AutoForm.hooks creatorAddForm:
		onSuccess: (formType,result)->
			dxDataGridInstance.refresh()
	,true
	AutoForm.hooks creatorEditForm:
		onSuccess: (formType,result)->
			dxDataGridInstance.refresh()
	,true
	AutoForm.hooks creatorCellEditForm:
		onSuccess: (formType,result)->
			dxDataGridInstance.refresh()
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