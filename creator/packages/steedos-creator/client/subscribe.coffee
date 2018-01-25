Meteor.startup ->
	
	Creator.subs["Creator"] = new SubsManager()
	Tracker.autorun (c)->
		if Session.get("object_name")
			Creator.subs["Creator"].subscribe "object_recent_viewed", Session.get("object_name")

	Tracker.autorun (c)->
		if Session.get("object_name")
			Creator.subs["Creator"].subscribe "object_listviews", Session.get("object_name")


Meteor.startup ->
	Creator.subs["TabularSetting"] = new SubsManager()
	Tracker.autorun (c)->
		object_name = Session.get("object_name")
		if object_name
			Creator.subs["TabularSetting"].subscribe "user_tabular_settings", object_name
			
Meteor.startup ->
	Creator.subs["CreatorRecord"] = new SubsManager()
	Tracker.autorun (c)->
		if Session.get("object_name") and Session.get("record_id")
			Creator.subs["CreatorRecord"].subscribe "creator_object_record", Session.get("object_name"), Session.get("record_id") 

	Creator.subs["CreatorActionRecord"] = new SubsManager()
	Tracker.autorun (c)->
		if Session.get("action_object_name") and Session.get("action_record_id")
			Creator.subs["CreatorActionRecord"].subscribe "creator_object_record", Session.get("action_object_name"), Session.get("action_record_id")


