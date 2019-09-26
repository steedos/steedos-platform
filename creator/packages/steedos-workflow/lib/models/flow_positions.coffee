# Meteor.startup ()->
# 	db.flow_positions = new Meteor.Collection('flow_positions')

# 	db.flow_positions._simpleSchema = new SimpleSchema
# 		space:
# 			type: String,
# 			optional: true,
# 			autoform:
# 				type: "hidden",
# 				defaultValue: ->
# 					return Session.get("spaceId");
# 		role:
# 			type: String,
# 			foreign_key: true,
# 			references:
# 				collection: 'flow_roles',
# 				key: '_id',
# 				search_keys: ['name']
# 			autoform:
# 				type: "select",
# 				options: ->
# 					options = []
# 					selector = {}
# 					selector.space = Session.get('spaceId')
# 					objs = WorkflowManager.remoteFlowRoles.find(selector, {fields: {name:1} })
# 					objs.forEach (obj) ->
# 						options.push
# 							label: obj.name,
# 							value: obj._id
# 					return options

# 		users:
# 			type: [String],
# 			foreign_key: true,
# 			references:
# 				collection: 'space_users'
# 				key: 'user'
# 				search_keys: ['name', 'email']
# 			autoform:
# 				type: "selectuser"
# 				multiple: true

# 		org:
# 			type: String,
# 			foreign_key: true,
# 			references:
# 				collection: 'organizations'
# 				search_keys: ['name', 'fullname']
# 			autoform:
# 				type: "selectorg"
# 				defaultValue: ()->
# 					return SteedosDataManager.organizationRemote.findOne({
# 						is_company: true
# 						parent: null
# 					}, {
# 						fields: {
# 							_id: 1,
# 						}
# 					})?._id;


# 	if Meteor.isClient
# 		db.flow_positions._simpleSchema.i18n("flow_positions")

# 	db.flow_positions.attachSchema(db.flow_positions._simpleSchema)


# 	db.flow_positions.helpers

# 		role_name: ->
# 			role = db.flow_roles.findOne({_id: this.role}, {fields: {name: 1}});
# 			return role && role.name;

# 		org_name: ->
# 			org = db.organizations.findOne({_id: this.org}, {fields: {fullname: 1}});
# 			return org && org.fullname;

# 		users_name: ->
# 			if (!this.users instanceof Array)
# 				return ""
# 			users = db.space_users.find({space: this.space, user: {$in: this.users}}, {fields: {name:1}});
# 			names = []
# 			users.forEach (user) ->
# 				names.push(user.name)
# 			return names.toString();



# 	if Meteor.isServer

# 		db.flow_positions.allow
# 			insert: (userId, event) ->
# 				if (!Steedos.isSpaceAdmin(event.space, userId))
# 					return false
# 				else
# 					return true

# 			update: (userId, event) ->
# 				if (!Steedos.isSpaceAdmin(event.space, userId))
# 					return false
# 				else
# 					return true

# 			remove: (userId, event) ->
# 				if (!Steedos.isSpaceAdmin(event.space, userId))
# 					return false
# 				else
# 					return true

# 	if Meteor.isServer

# 		db.flow_positions.before.insert (userId, doc) ->

# 			doc.created_by = userId;
# 			doc.created = new Date();

# 			if (!Steedos.isSpaceAdmin(doc.space, userId))
# 				throw new Meteor.Error(400, "error_space_admins_only");

# 		db.flow_positions.before.update (userId, doc, fieldNames, modifier, options) ->

# 			modifier.$set = modifier.$set || {};

# 			modifier.$set.modified_by = userId;
# 			modifier.$set.modified = new Date();

# 			if (!Steedos.isSpaceAdmin(doc.space, userId))
# 				throw new Meteor.Error(400, "error_space_admins_only");

# 		db.flow_positions.before.remove (userId, doc) ->

# 			if (!Steedos.isSpaceAdmin(doc.space, userId))
# 				throw new Meteor.Error(400, "error_space_admins_only");

# 	if Meteor.isServer
# 		db.flow_positions._ensureIndex({
# 			"space": 1
# 		},{background: true})

# 		db.flow_positions._ensureIndex({
# 			"space": 1,
# 			"created": 1
# 		},{background: true})

# 		db.flow_positions._ensureIndex({
# 			"space": 1,
# 			"created": 1,
# 			"modified": 1
# 		},{background: true})

# 		db.flow_positions._ensureIndex({
# 			"role": 1,
# 			"org": 1,
# 			"space": 1
# 		},{background: true})

# 		db.flow_positions._ensureIndex({
# 			"space": 1,
# 			"users": 1
# 		},{background: true})

# 		db.flow_positions._ensureIndex({
# 			"space": 1,
# 			"role": 1
# 		},{background: true})

# 	new Tabular.Table
# 		name: "flow_positions",
# 		collection: db.flow_positions,
# 		pub: "flow_positions_tabular",
# 		columns: [
# 			{
# 				data: "role",
# 				width: "20%"
# 				render: (val, type, doc) ->
# 					role = db.flow_roles.findOne({_id: doc.role}, {fields: {name: 1}});
# 					return role && role.name;
# 			},
# 			{
# 				data: "users"
# 				width: "auto"
# 				render: (val, type, doc) ->
# 					if (!doc.users instanceof Array)
# 						return ""
# 					users = db.space_users.find({space: doc.space, user: {$in: doc.users}}, {fields: {name:1}});
# 					names = []
# 					users.forEach (user) ->
# 						names.push(user.name)
# 					return names.toString();
# 			},
# 			{
# 				data: "org",
# 				width: "20%"
# 				render: (val, type, doc) ->
# 					org = db.organizations.findOne({_id: doc.org}, {fields: {fullname: 1}});
# 					return org && org.fullname;
# 			}
# 		]
# 		dom: "tp"
# 		extraFields: ["space", "role", "org", "users"]
# 		lengthChange: false
# 		ordering: false
# 		pageLength: 10
# 		info: false
# 		searching: true
# 		autoWidth: false
# 		changeSelector: (selector, userId) ->
# 			unless userId
# 				return {_id: -1}
# 			space = selector.space
# 			unless space
# 				if selector?.$and?.length > 0
# 					space = selector.$and.getProperty('space')[0]
# 			unless space
# 				return {_id: -1}
# 			space_user = db.space_users.findOne({user: userId, space: space}, {fields: {_id: 1}})
# 			unless space_user
# 				return {_id: -1}
# 			return selector

# 	new Tabular.Table
# 		name: "admin_flow_positions",
# 		collection: db.flow_positions,
# 		pub: "flow_positions_tabular",
# 		drawCallback:(settings)->
# 			if $(this).hasClass("datatable-flows-roles") and !$(".datatable-flows-roles tfoot").length
# 				action = t("add_positions")
# 				tfoot = """
# 					<tfoot>
# 						<tr>
# 							<td colspan='2'>
# 								<div class="add-positions">
# 									<i class="ion ion-plus-round"></i>#{action}
# 								</div>
# 							</td>
# 						<tr>
# 					</tfoot>
# 				"""
# 				$(".datatable-flows-roles tbody").after(tfoot)

# 		columns: [
# 			{
# 				data: "users_name()"
# 				render: (val, type, doc) ->
# 					org = db.organizations.findOne({_id: doc.org}, {fields: {fullname: 1}});
# 					return """
# 						<div class="users-name">#{val}</div>
# 						<div class="org-fullname">#{org?.fullname}</div>
# 					"""
# 			}
# 		]
# 		extraFields: ["space", "role", "org", "users"]
# 		lengthChange: false
# 		ordering: false
# 		pageLength: 10
# 		info: false
# 		searching: true
# 		autoWidth: true
# 		changeSelector: (selector, userId) ->
# 			unless userId
# 				return {_id: -1}
# 			space = selector.space
# 			unless space
# 				if selector?.$and?.length > 0
# 					space = selector.$and.getProperty('space')[0]
# 			unless space
# 				return {_id: -1}
# 			space_user = db.space_users.findOne({user: userId, space: space}, {fields: {_id: 1}})
# 			unless space_user
# 				return {_id: -1}
# 			return selector