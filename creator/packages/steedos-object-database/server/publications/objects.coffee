Meteor.publish "creator_objects", (space)->
	Creator.getCollection("objects").find({space: {$in: [null, space]}})