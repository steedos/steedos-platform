Meteor.methods
	get_space_user_count: (space_id)->
		check space_id, String
		user_count_info = new Object
		user_count_info.total_user_count = db.space_users.find({space: space_id}).count()
		user_count_info.accepted_user_count = db.space_users.find({space: space_id, user_accepted: true}).count()
		return user_count_info