# db.forms = new Meteor.Collection('forms')

# if Meteor.isServer
# 	db.forms.before.insert (userId, doc) ->
# 		doc.created_by = userId;
# 		doc.created = new Date();
# 		if doc.current
# 			doc.current.created_by = userId;
# 			doc.current.created = new Date();
# 			doc.current.modified_by = userId;
# 			doc.current.modified = new Date();

# 		if (!Steedos.isSpaceAdmin(doc.space, userId))
# 			throw new Meteor.Error(400, "error_space_admins_only");

# 	db.forms.before.update (userId, doc, fieldNames, modifier, options) ->

# 		modifier.$set = modifier.$set || {};

# 		modifier.$set.modified_by = userId;
# 		modifier.$set.modified = new Date();

# 		if (!Steedos.isSpaceAdmin(doc.space, userId))
# 			throw new Meteor.Error(400, "error_space_admins_only");

# 	db.forms.before.remove (userId, doc) ->

# 		if (!Steedos.isSpaceAdmin(doc.space, userId))
# 			throw new Meteor.Error(400, "error_space_admins_only");

# if Meteor.isServer
# 	db.forms._ensureIndex({
# 		"is_deleted": 1
# 	},{background: true})

# 	db.forms._ensureIndex({
# 		"space": 1
# 	},{background: true})

# 	db.forms._ensureIndex({
# 		"space": 1,
# 		"is_deleted": 1
# 	},{background: true})

# 	db.forms._ensureIndex({
# 		"space": 1,
# 		"app": 1,
# 		"created": 1
# 	},{background: true})

# 	db.forms._ensureIndex({
# 		"space": 1,
# 		"app": 1,
# 		"created": 1,
# 		"current.modified": 1
# 	},{background: true})

# 	db.forms._ensureIndex({
# 		"name": 1,
# 		"space": 1
# 	},{background: true})

# 	db.forms._ensureIndex({
# 		"_id": 1,
# 		"space": 1
# 	},{background: true})

# 	db.forms._ensureIndex({
# 		"space": 1,
# 		"state": 1
# 	},{background: true})