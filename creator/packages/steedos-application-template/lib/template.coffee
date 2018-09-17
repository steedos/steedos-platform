Creator.AppTemplate = {}

Creator.AppTemplate.getAppObject = (object_name) ->
	object = Creator._TEMPLATE.Objects[object_name]

	if !object
		object = Creator.Objects[object_name]

	return object;
