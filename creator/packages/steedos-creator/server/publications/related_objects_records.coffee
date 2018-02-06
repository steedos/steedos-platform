Meteor.publish "related_objects_records", (object_name, related_object_name, related_field_name, record_id, spaceId)->
	userId = this.userId
	if related_object_name == "cfs.files.filerecord"
		selector = {"metadata.space": spaceId}
	else
		selector = {space: spaceId}
	
	if related_object_name == "cms_files"
		# 附件的关联搜索条件是定死的
		selector["parent.o"] = object_name
		selector["parent.ids"] = [record_id]
	else
		selector[related_field_name] = record_id

	permissions = Creator.getPermissions(related_object_name, spaceId, userId)
	if !permissions.viewAllRecords and permissions.allowRead
		selector.owner = userId
	
	return Creator.Collections[related_object_name].find(selector)