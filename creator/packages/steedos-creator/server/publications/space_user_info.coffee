Meteor.publish 'space_user_info', (spaceId, userId)->
	return Creator.getCollection("space_users").find({space: spaceId, user: userId})