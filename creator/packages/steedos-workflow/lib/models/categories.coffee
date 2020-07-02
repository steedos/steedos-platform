# db.categories = new Meteor.Collection('categories')


# db.categories._simpleSchema = new SimpleSchema
# 	name:
# 		type: String

# 	sort_no:
# 		type: Number,
# 		optional: true,

# 	space:
# 		type: String,
# 		autoform:
# 			type: "hidden",
# 			defaultValue: ->
# 				return Session.get("spaceId");

# 	created:
# 		type: Date
# 		optional: true
# 		autoform:
# 			omit: true

# 	created_by:
# 		type: String
# 		optional: true
# 		autoform:
# 			omit: true

# 	modified:
# 		type: Date
# 		optional: true
# 		autoform:
# 			omit: true

# 	modified_by:
# 		type: String
# 		optional: true
# 		autoform:
# 			omit: true

# if Meteor.isClient
# 	db.categories._simpleSchema.i18n("categories")

# db.categories.attachSchema(db.categories._simpleSchema)

# if Meteor.isServer

# 	db.categories.allow
# 		insert: (userId, event) ->
# 			return false

# 		update: (userId, event) ->
# 			if (!Steedos.isSpaceAdmin(event.space, userId))
# 				return false
# 			else
# 				return true

# 		remove: (userId, event) ->
# 			return false

# 	db.categories.before.insert (userId, doc) ->
# 		doc.created_by = userId;
# 		doc.created = new Date();

# 		if (!Steedos.isSpaceAdmin(doc.space, userId))
# 			throw new Meteor.Error(400, "error_space_admins_only");

# 	db.categories.before.update (userId, doc, fieldNames, modifier, options) ->

# 		modifier.$set = modifier.$set || {};

# 		modifier.$set.modified_by = userId;
# 		modifier.$set.modified = new Date();

# 		if (!Steedos.isSpaceAdmin(doc.space, userId))
# 			throw new Meteor.Error(400, "error_space_admins_only");

# 	db.categories.before.remove (userId, doc) ->

# 		if (!Steedos.isSpaceAdmin(doc.space, userId))
# 			throw new Meteor.Error(400, "error_space_admins_only");

# new Tabular.Table
# 	name: "Categories",
# 	collection: db.categories,
# 	columns: [
# 		{data: "name", title: "name", orderable: false},
# 		{data: "sort_no", title: "sort_no",orderable: false},
# 		{data: "sort_no", title: "sort_no", visible: false}
# 	]
# 	dom: "tp"
# 	order: [2, "desc"]
# 	extraFields: []
# 	lengthChange: false
# 	pageLength: 10
# 	info: false
# 	searching: true
# 	autoWidth: false