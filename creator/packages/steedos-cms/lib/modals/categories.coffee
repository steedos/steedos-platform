# db.cms_categories = new Mongo.Collection("cms_categories");

# db.cms_categories._simpleSchema = new SimpleSchema
# 	site: 
# 		type: String,
# 		autoform: 
# 			type: "hidden",
# 			defaultValue: ->
# 				return Session.get("siteId");
# 	name: 
# 		type: String,

# 	description: 
# 		type: String,
# 		optional: true,
# 		autoform: 
# 			rows: 3
# 	# tags:
# 	# 	type: [String],
# 	# 	optional: true,
# 	# 	autoform: 
# 	# 		type: 'tags'
# 	# slug: 
# 	# 	type: String,
# 	# 	optional: true,
# 	# image:
# 	# 	type: String,
# 	# 	optional: true,

# 	parent: 
# 		type: String,
# 		optional: true,
# 		autoform: 
# 			type: ()->
# 				if db.cms_categories.find({site:Session.get("siteId")}).count()
# 					return "select"
# 				return "hidden"
# 			options:  () ->
# 				categories = db.cms_categories.find({site:Session.get("siteId")}).map (category) ->
# 					return {
# 						value: category._id,
# 						label: category.name
# 					}
# 				return categories;

# 	parents: 
# 		type: [String],
# 		optional: true,
# 		autoform: 
# 			omit: true

# 	# disable category admins
# 	# admins: 
# 	# 	type: [String],
# 	# 	optional: true,
# 	# 	autoform:
# 	# 		type: "selectuser"
# 	# 		multiple: true
# 	# 		defaultValue: ->
# 	# 			return []
				
# 	order: 
# 		type: Number,
# 		optional: true,

# 	# show post list on website homepage
# 	featured: 
# 		type: Boolean,
# 		optional: true,
# 		defaultValue: true,
# 		autoform:
# 			type: "hidden"
		

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
# 	db.cms_categories._simpleSchema.i18n("cms_categories")
# 	db.cms_categories._sortFunction = (doc1, doc2) ->
# 		if (doc1.order == doc2.order)
# 			return doc1.name?.localeCompare(doc2.name); 
# 		else if (doc1.order > doc2.order)
# 			return -1
# 		else
# 			return 1

# db.cms_categories.attachSchema(db.cms_categories._simpleSchema)


# db.cms_categories.helpers

# 	calculateParents: ->
# 		parents = [];
# 		if (!this.parent)
# 			return parents
# 		parentId = this.parent;
# 		while (parentId)
# 			parents.push(parentId)
# 			parentObj = db.cms_categories.findOne({_id: parentId}, {parent: 1, name: 1});
# 			if parentObj and parentObj.parent and !parents.includes(parentObj.parent)
# 				parentId = parentObj.parent
# 			else
# 				parentId = null
# 		return parents

# 	calculateChildren: ->
# 		children = []
# 		childrenObjs = db.cms_categories.find({parent: this._id}, {fields: {_id:1}});
# 		childrenObjs.forEach (child) ->
# 			children.push(child._id);
# 		return children;

# if Meteor.isServer

# 	db.cms_categories.before.insert (userId, doc) ->

# 		doc.created_by = userId
# 		doc.created = new Date()
# 		doc.modified_by = userId
# 		doc.modified = new Date()


# 	db.cms_categories.before.update (userId, doc, fieldNames, modifier, options) ->
# 		modifier.$set = modifier.$set || {};

# 		if modifier.$set.parent == doc._id
# 			throw new Meteor.Error(400, "cms_categories_error_deny_set_self");

# 		modifier.$set.modified_by = userId;
# 		modifier.$set.modified = new Date();


# 	db.cms_categories.before.remove (userId, doc) ->
# 		child = db.cms_categories.findOne({parent:doc._id})
# 		if child
# 			throw new Meteor.Error(400, "cms_categories_error_has_children");
# 		post = db.cms_posts.findOne({category:doc._id})
# 		if post
# 			throw new Meteor.Error(400, "cms_categories_error_has_posts");

# if Meteor.isServer
# 	db.cms_categories._ensureIndex({
# 		"site": 1,
# 		"parent": 1
# 	},{background: true})

# 	db.cms_categories._ensureIndex({
# 		"site": 1
# 	},{background: true})

# 	db.cms_categories._ensureIndex({
# 		"parent": 1
# 	},{background: true})