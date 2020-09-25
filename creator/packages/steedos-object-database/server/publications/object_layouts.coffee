Meteor.publish "publish_object_layouts", (space)->
	userId = this.userId
	if !userId
		return
	spaceUser = Creator.getCollection("space_users").findOne({space: space, user: userId}, {fields: {profile: 1}})
	if spaceUser && spaceUser.profile
		Creator.getCollection("object_layouts").find({space: {$in: [null, space]}, profiles: spaceUser.profile}, {fields: {_id: 1, modified: 1, object_name: 1}})