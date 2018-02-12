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

Template.related_object_list.helpers
	related_object_label: ()->
		return Creator.getObject(Session.get("related_object_name")).label