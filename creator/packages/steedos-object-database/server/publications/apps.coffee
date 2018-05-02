Meteor.publish "creator_apps", (space)->
	Creator.getCollection("objects").find({space: {$in: [null, space]}, is_creator: true}, {fields: {_id: 1, modified: 1}})