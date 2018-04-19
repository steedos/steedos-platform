Creator.getUserObjectsListViews = (userId, spaceId, objects)->
	listViews = {}

	_.forEach objects, (o, key)->
		list_view = Creator.getUserObjectListViews userId, spaceId, key
		if !_.isEmpty(list_view)
			listViews[key] = list_view
	return listViews


Creator.getUserObjectListViews = (userId, spaceId, object_name)->
	_user_object_list_views = {}

	object_listview = Creator.getCollection("object_listviews").find({
		object_name: object_name,
		space: spaceId,
		"$or": [{owner: userId}, {shared: true}]
	}, {
		fields: {
			created: 0,
			modified: 0,
			created_by: 0,
			modified_by: 0
		}
	})

	object_listview.forEach (listview)->
		_user_object_list_views[listview._id] = listview

	return _user_object_list_views




