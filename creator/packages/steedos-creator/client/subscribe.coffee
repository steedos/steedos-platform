Steedos.subs["Creator"] = new SubsManager()


Meteor.startup ->
	Tracker.autorun (c)->
		if Session.get("object_name") and Session.get("record_id")
			Steedos.subs["Creator"].subscribe "creator_object", Session.get("object_name"), Session.get("record_id") 

