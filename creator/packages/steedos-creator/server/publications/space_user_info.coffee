Meteor.publish 'space_user_info', (spaceId, userId)->
	console.log Creator.getCollection("space_users").findOne({space: spaceId, user: userId})
	return Creator.getCollection("space_users").find({space: spaceId, user: userId})