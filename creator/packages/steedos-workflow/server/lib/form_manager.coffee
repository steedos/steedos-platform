formManager = {}

formManager.getCategoriesForms = (spaceId, categorieId, fields)->
	if fields
		_fields = {fields: fields}

	return db.forms.find({space: spaceId, category: categorieId, state: "enabled"}, _fields)

formManager.getUnCategoriesForms = (spaceId, fields) ->
	if fields
		_fields = {fields: fields}
	return db.forms.find({space: spaceId, category: {$in: [null, ""]}, state: "enabled"}, _fields)
