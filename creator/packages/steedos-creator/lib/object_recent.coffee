@ObjectRecent = {}

# spaceId: 取自doc.space
ObjectRecent.insert = (object_name, recentId, callback)->
	Meteor.call "object_recent_viewed", object_name, recentId, ()->
		if callback && _.isFunction(callback)
			callback()

