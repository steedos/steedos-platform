# Meteor.publish 'cms_unreads', ()->

# 	unless this.userId
# 		return this.ready()

# 	return db.cms_unreads.find({user: this.userId})