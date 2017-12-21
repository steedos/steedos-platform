Meteor.startup ->
	
	Creator.subs["Creator"] = new SubsManager()
	Tracker.autorun (c)->
		if Session.get("object_name")
			Creator.subs["Creator"].subscribe "object_recent_viewed", Session.get("object_name")
			
Meteor.startup ->

	Tracker.autorun (c)->
		if Session.get("object_name") and Session.get("record_id")
			Creator.subs["Creator"].subscribe "creator_object_record", Session.get("object_name"), Session.get("record_id") 

	Tracker.autorun (c)->
		if Session.get("related_object_name") and Session.get("related_record_id")
			Creator.subs["Creator"].subscribe "creator_object_record", Session.get("related_object_name"), Session.get("related_record_id") 

