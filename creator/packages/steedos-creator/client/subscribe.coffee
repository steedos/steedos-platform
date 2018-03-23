Creator.subs["Creator"] = new SubsManager()
Creator.subs["CreatorListViews"] = new SubsManager()
Creator.subs["TabularSetting"] = new SubsManager()
Creator.subs["CreatorRecord"] = new SubsManager()
Creator.subs["CreatorActionRecord"] = new SubsManager()
Creator.subs["objectRecentViewed"] = new SubsManager()

Meteor.startup ->
	
	# Tracker.autorun (c)->
	# 	if Session.get("object_name")
	# 		Creator.subs["objectRecentViewed"].subscribe "object_recent_viewed", Session.get("object_name")

	Tracker.autorun (c)->
		if Session.get("object_name") and Session.get("spaceId")
			Creator.subs["CreatorListViews"].subscribe "object_listviews", Session.get("object_name"), Session.get("spaceId")

	Tracker.autorun (c)->
		if Creator.subs["CreatorListViews"].ready() && Creator.objects_initialized.get()
			object_listViews = Creator.getCollection("object_listviews").find({space: Session.get("spaceId"), object_name: Session.get("object_name")})
			list_views = Creator.Objects[Session.get("object_name")].list_views
			list_views_byname = Creator.getObject(Session.get("object_name")).list_views
			object_listViews.forEach (listview)->
				_list_view = Creator.convertListView(list_views.default?.columns, listview, listview.name)
				_key = listview._id
				if listview.is_default
					_key = "all"
				list_views[_key] = _list_view
				list_views_byname[_key] = _list_view

			Session.set("change_list_views", Random.id())

			Creator.getCollection("object_listviews").find().observe {
				removed: (oldDocument) ->
					# if oldDocument.name == "recent"
					# 	key = oldDocument.name
					# else
					# 	key = oldDocument._id
					key = oldDocument._id
					delete Creator.Objects[Session.get("object_name")].list_views[key]
					delete Creator.getObject(Session.get("object_name")).list_views[key]
			}


Meteor.startup ->
	Tracker.autorun (c)->
		object_name = Session.get("object_name")
		related_object_name = Session.get("related_object_name")
		if object_name or related_object_name
			object_a = [object_name, related_object_name]
			object_a = _.compact(object_a)
			Creator.subs["TabularSetting"].subscribe "user_tabular_settings", object_a
			
Meteor.startup ->
	Tracker.autorun (c)->
		if Session.get("object_name") and Session.get("record_id")
			Creator.subs["CreatorRecord"].subscribe "creator_object_record", Session.get("object_name"), Session.get("record_id") 

	Tracker.autorun (c)->
		if Session.get("action_object_name") and Session.get("action_record_id")
			Creator.subs["CreatorActionRecord"].subscribe "creator_object_record", Session.get("action_object_name"), Session.get("action_record_id")


