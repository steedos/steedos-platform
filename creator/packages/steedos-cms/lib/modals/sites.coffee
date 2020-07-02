# db.cms_sites = new Meteor.Collection('cms_sites')

# db.cms_sites._simpleSchema = new SimpleSchema
# 	space:
# 		type: String,
# 		autoform:
# 			type: "hidden",
# 			defaultValue: ->
# 				return Session.get("spaceId");

# #	space:
# #		type: String,
# #		autoform:
# #			type: "select"
# #			readonly: true
# #			defaultValue: ()->
# #				return Session.get("spaceId")
# #			options: ->
# #				spaces = db.spaces.find({"_id": Session.get("spaceId"), "admins":{$in:[Meteor.userId()]}}).fetch()
# #				return spaces.map (obj) ->
# #					return {
# #						label: obj.name,
# #						value: obj._id
# #					}



# # theme:
# # 	type: String,
# # 	autoform:
# # 		type: "select",
# # 		options: ->
# # 			options = []
# # 			objs = db.cms_themes.find()
# # 			objs.forEach (obj) ->
# # 				options.push
# # 					label: obj.name,
# # 					value: obj._id
# # 			return options
# 	type:
# 		type: String,
# 		defaultValue: "space",
# 		allowedValues: ["space", "user"]
# 		autoform:
# 			omit: true

# 	name:
# 		type: String

# 	description:
# 		type: String,
# 		optional: true,
# 		autoform:
# 			rows: 3

# 	owner:
# 		type: String,
# 		optional: false,
# 		autoform:
# 			type: "hidden"
# 			defaultValue: ->
# 				return Meteor.userId()

# 	# 站点可见性:private/team/public
# 	visibility:
# 		type: String,
# 		autoform:
# 			defaultValue: ->
# 				return "private";
# 			options: ->
# 				visibilitys = [
# 					# {label: t("cms_sites_visibility_private"), value: "private"}
# 					{label: t("cms_sites_visibility_team"), value: "team"}
# 					{label: t("cms_sites_visibility_public"), value: "public"}
# 				]
# 				return visibilitys

# 	admins:
# 		type: [String],
# 		optional: false,
# 		autoform:
# 			type: ()->
# 				userOption = Session.get "userOption"
# 				if userOption == "addSite"
# 					return "hidden"
# 				else if userOption == "editSite"
# 					return "selectuser"
# 			multiple: true
# 			defaultValue: ->
# 				return [Meteor.userId()]

# 	cover:
# 		type: String,
# 		optional: true,
# 		autoform:
# 			type: 'fileUpload'
# 			collection: 'avatars'
# 			accept: 'image/*'
# 	avatar:
# 		type: String,
# 		optional: true,
# 		autoform:
# 			type: 'fileUpload'
# 			collection: 'avatars'
# 			accept: 'image/*'
# 	order:
# 		type: Number,
# 		optional: true,

# 	layout:
# 		type: String,
# 		optional: true,
# 		autoform:
# 			rows: 10
# 			type: ()->
# 				spaceId = Session.get("spaceId")
# 				if spaceId
# 					space = db.spaces.findOne(spaceId)
# 					if space?.is_paid
# 						return "textarea"
# 				return "hidden"

# 	created:
# 		type: Date,
# 		optional: true
# 	created_by:
# 		type: String,
# 		optional: true
# 	modified:
# 		type: Date,
# 		optional: true
# 	modified_by:
# 		type: String,
# 		optional: true

# if Meteor.isClient
# 	db.cms_sites._simpleSchema.i18n("cms_sites")

# db.cms_sites.attachSchema(db.cms_sites._simpleSchema)

# if Meteor.isServer
# 	db.cms_sites.allow
# 		insert: (userId, event) ->
# 			if userId && event.space
# 				return Steedos.isSpaceAdmin(event.space, userId)
# 			else
# 				return false

# 		update: (userId, event) ->
# 			if userId && event.space
# 				return Steedos.isSpaceAdmin(event.space, userId)
# 			else
# 				return false

# 		remove: (userId, event) ->
# 			if userId && event.space
# 				return Steedos.isSpaceAdmin(event.space, userId)
# 			else
# 				return false

# 	db.cms_sites.before.insert (userId, doc) ->
# 		doc.created_by = userId
# 		doc.created = new Date()
# 		doc.modified_by = userId
# 		doc.modified = new Date()

# 		if !userId
# 			throw new Meteor.Error(400, "cms_sites_error_login_required");

# 		doc.owner = userId
# 		if !doc.admins
# 			doc.admins = [userId]
# 		if doc.admins.indexOf(userId) < 0
# 			doc.admins.push(userId)


# 	db.cms_sites.after.insert (userId, doc) ->


# 	db.cms_sites.before.update (userId, doc, fieldNames, modifier, options) ->
# 		modifier.$set = modifier.$set || {};

# 		# only site owner can modify site
# 		if doc.owner != userId
# 			throw new Meteor.Error(400, "cms_sites_error_site_owner_only");

# 		if modifier.$set.admins
# 			if modifier.$set.admins.indexOf(userId) < 0
# 				modifier.$set.admins.push(userId)

# 		modifier.$set.modified_by = userId;
# 		modifier.$set.modified = new Date();


# 	db.cms_sites.before.remove (userId, doc) ->
# 		category = db.cms_categories.findOne({site: doc._id})
# 		if category
# 			throw new Meteor.Error(400, "cms_sites_error_has_categories");
# 		post = db.cms_posts.findOne({site: doc._id})
# 		if post
# 			throw new Meteor.Error(400, "cms_sites_error_has_posts");

# if Meteor.isServer
# 	db.cms_sites._ensureIndex({
# 		"space": 1
# 	}, {background: true})
