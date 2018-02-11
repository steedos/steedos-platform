Meteor.methods

	"creator.bootstrap": (space_id)->
		
		# check if ths space exists
		space = Creator.Collections["spaces"].findOne(space_id)
		if !space
			space_id == null

		# if space_id not exists, get the first one.
		if !space_id
			su = Creator.Collections["space_users"].findOne({user: this.userId})
			if !su
				return null
			space_id = su.space
			space = Creator.Collections["spaces"].findOne(space_id)

		result = Creator.getAllPermissions(space_id, this.userId)
		result.space = space
		result.apps = Creator.Collections["apps"].find({space: space_id}).fetch()
		#result.objects = Creator.Collections["space_objects"].find({space: space_id}).fetch()

		return result;

