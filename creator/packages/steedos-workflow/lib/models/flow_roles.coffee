# db.flow_roles = new Meteor.Collection('flow_roles')


# db.flow_roles._simpleSchema = new SimpleSchema
# 	space:
# 		type: String,
# 		optional: true,
# 		autoform:
# 			type: "hidden",
# 			defaultValue: ->
# 				return Session.get("spaceId");
# 	name:
# 		type: String,
# 		max: 200


# if Meteor.isClient
# 	db.flow_roles._simpleSchema.i18n("flow_roles")

# db.flow_roles.attachSchema(db.flow_roles._simpleSchema)


# if Meteor.isServer
# 	db.flow_roles.allow
# 		insert: (userId, event) ->
# 			if (!Steedos.isSpaceAdmin(event.space, userId))
# 				return false
# 			else
# 				return true

# 		remove: (userId, event) ->
# 			if (!Steedos.isSpaceAdmin(event.space, userId))
# 				return false
# 			else
# 				return true

# 	db.flow_roles.before.insert (userId, doc) ->

# 		doc.created_by = userId;
# 		doc.created = new Date();

# 		if (!Steedos.isSpaceAdmin(doc.space, userId))
# 			throw new Meteor.Error(400, "error_space_admins_only");


# 	db.flow_roles.before.update (userId, doc, fieldNames, modifier, options) ->

# 		modifier.$set = modifier.$set || {};

# 		modifier.$set.modified_by = userId;
# 		modifier.$set.modified = new Date();

# 		if (!Steedos.isSpaceAdmin(doc.space, userId))
# 			throw new Meteor.Error(400, "error_space_admins_only");

# 	db.flow_roles.before.remove (userId, doc) ->

# 		if (!Steedos.isSpaceAdmin(doc.space, userId))
# 			throw new Meteor.Error(400, "error_space_admins_only");

# 		if db.flow_positions.find({role: doc._id}).count()>0
# 			throw new Meteor.Error(400, "flow_roles_error_positions_exists");

# 		# 如果岗位被流程引用，应该禁止删除 #1289
# 		flowNames = []
# 		roleId = doc._id
# 		_.each db.flows.find({space: doc.space}, {fields: {name: 1, 'current.steps': 1}}).fetch(), (f)->
# 			_.each f.current.steps, (s)->
# 				if s.deal_type is 'applicantRole' and s.approver_roles.includes(roleId)
# 					flowNames.push f.name

# 		if not _.isEmpty(flowNames)
# 			throw new Meteor.Error 400, "flow_roles_error_flows_used", {names: _.uniq(flowNames).join(',')}


# if Meteor.isClient

# 	db.flow_roles._sortFunction = (doc1, doc2) ->
# 		return doc1.name?.localeCompare(doc2.name);

# 	db.flow_roles.before.find (userId, selector, options) ->
# 		if !options
# 			options = {}
# 		options.sort = db.flow_roles._sortFunction

# if Meteor.isServer
# 	db.flow_roles._ensureIndex({
# 		"space": 1
# 	},{background: true})

# 	db.flow_roles._ensureIndex({
# 		"space": 1,
# 		"created": 1
# 	},{background: true})

# 	db.flow_roles._ensureIndex({
# 		"space": 1,
# 		"created": 1,
# 		"modified": 1
# 	},{background: true})


# new Tabular.Table
# 	name: "flow_roles",
# 	collection: db.flow_roles,
# 	columns: [
# 		{
# 			data: "name"
# 		}
# 	]
# 	dom: "tp"
# 	lengthChange: false
# 	ordering: false
# 	pageLength: 10
# 	info: false
# 	extraFields: ["space","_id"]
# 	searching: true
# 	autoWidth: false
# 	changeSelector: (selector, userId) ->
# 		unless userId
# 			return {_id: -1}
# 		return selector
