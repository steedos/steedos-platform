# db.cms_unreads = new Meteor.Collection('cms_unreads')

# db.cms_unreads._simpleSchema = new SimpleSchema
# 	user: 
# 		type: String
# 		optional: false

# 	site: 
# 		type: String
# 		optional: false

# 	post: 
# 		type: String
# 		optional: false

# 	created:
# 		type: Date
# 		optional: false


# if Meteor.isClient
# 	db.cms_unreads._simpleSchema.i18n("cms_unreads")

# db.cms_unreads.attachSchema(db.cms_unreads._simpleSchema)

# if Meteor.isServer
# 	db.cms_unreads.before.insert (userId, doc) ->
# 		if !userId
# 			throw new Meteor.Error(400, "cms_error_login_required")

# 	db.cms_unreads.before.update (userId, doc, fieldNames, modifier, options) ->
# 		if !userId
# 			throw new Meteor.Error(400, "cms_error_login_required")

# if (Meteor.isServer) 
# 	db.cms_unreads.allow 
# 		remove: (userId, event) ->
# 			return true

# if (Meteor.isServer)
# 	Meteor.startup ->
# 	    db.cms_unreads._collection._ensureIndex({ user: 1,createdAt: 1 })