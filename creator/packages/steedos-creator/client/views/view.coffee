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
		permissions = Creator.Objects[Session.get("object_name")]?.permissions?.default
		if permissions
			return permissions[permissionName]

	related_list: ()->
		list = []
		_.each Creator.getObject()?.related_list, (list_view, related_object_name)->
			tabular_name = Session.get("object_name") + "_related_" + related_object_name
			related_object = Creator.Objects[related_object_name]
			related_field_name = ""
			_.each related_object.fields, (field, field_name)->
				if field.type == "master_detail" and field.reference_to == Session.get("object_name")
					related_field_name = field_name
			if related_field_name
				tabular_selector = {space: Session.get("spaceId")}
				tabular_selector[related_field_name] = Session.get("record_id")
				related =
					object_name: related_object_name
					columns: list_view.columns
					tabular_table: Creator.TabularTables[tabular_name]
					tabular_selector: tabular_selector
				list.push related
		return list

Template.creator_view.events