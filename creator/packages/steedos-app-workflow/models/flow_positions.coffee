# db.flow_positions = new Meteor.Collection('flow_positions')

# Creator.Objects.flow_positions =
# 	name: "flow_positions"
# 	icon: "metrics"
# 	label: "岗位成员"
# 	fields:
# 		role:
# 			type: "master_detail"
# 			label: "岗位"
# 			reference_to: "flow_roles"
# 			required: true
# 			# filtersFunction: (filters, context)->
# 			# 	selector = {}
# 			# 	companyId = Creator.getUserCompanyId()
# 			# 	if companyId
# 			# 		selector['company_id'] = companyId
# 			# 	return selector

# 		users:
# 			type: "lookup"
# 			label: "成员"
# 			reference_to: "users"
# 			multiple: true
# 			required: true

# 		org:
# 			type: "lookup"
# 			label: "管辖范围"
# 			reference_to: "organizations"
# 			required: true

# 		company_id:
# 			required: Meteor.settings?.public?.is_group_company
# 			omit: false
# 			hidden: false

# 	list_views:
# 		all:
# 			filter_scope: "space"
# 			columns: ["role", "org","users","company_id"]
# 			label: "所有"

# 	permission_set:
# 		user:
# 			allowCreate: false
# 			allowDelete: false
# 			allowEdit: false
# 			allowRead: true
# 			modifyAllRecords: false
# 			viewAllRecords: false
# 		admin:
# 			allowCreate: true
# 			allowDelete: true
# 			allowEdit: true
# 			allowRead: true
# 			modifyAllRecords: true
# 			viewAllRecords: true
# 		workflow_admin:
# 			allowCreate: true
# 			allowDelete: true
# 			allowEdit: true
# 			allowRead: true
# 			modifyAllRecords: false
# 			viewAllRecords: false
# 			modifyCompanyRecords: true
# 			viewCompanyRecords: true
# 			disabled_list_views: []
# 			disabled_actions: []
# 			unreadable_fields: []
# 			uneditable_fields: []
# 			unrelated_objects: []

# db.flow_positions.helpers

# 	role_name: ->
# 		role = db.flow_roles.findOne({_id: this.role}, {fields: {name: 1}});
# 		return role && role.name;

# 	org_name: ->
# 		org = db.organizations.findOne({_id: this.org}, {fields: {fullname: 1}});
# 		return org && org.fullname;

# 	users_name: ->
# 		if (!this.users instanceof Array)
# 			return ""
# 		users = db.space_users.find({space: this.space, user: {$in: this.users}}, {fields: {name:1}});
# 		names = []
# 		users.forEach (user) ->
# 			names.push(user.name)
# 		return names.toString();

# if Meteor.isServer

# 	db.flow_positions.allow
# 		insert: (userId, event) ->
# 			if (!Steedos.isSpaceAdmin(event.space, userId))
# 				return false
# 			else
# 				return true

# 		update: (userId, event) ->
# 			if (!Steedos.isSpaceAdmin(event.space, userId))
# 				return false
# 			else
# 				return true

# 		remove: (userId, event) ->
# 			if (!Steedos.isSpaceAdmin(event.space, userId))
# 				return false
# 			else
# 				return true

# 	db.flow_positions.before.insert (userId, doc) ->

# 		doc.created_by = userId;
# 		doc.created = new Date();

# 	db.flow_positions.before.update (userId, doc, fieldNames, modifier, options) ->

# 		modifier.$set = modifier.$set || {};

# 		modifier.$set.modified_by = userId;
# 		modifier.$set.modified = new Date();

# 	db.flow_positions._ensureIndex({
# 			"space": 1
# 	},{background: true})

# 	db.flow_positions._ensureIndex({
# 		"space": 1,
# 		"created": 1
# 	},{background: true})

# 	db.flow_positions._ensureIndex({
# 		"space": 1,
# 		"created": 1,
# 		"modified": 1
# 	},{background: true})

# 	db.flow_positions._ensureIndex({
# 		"role": 1,
# 		"org": 1,
# 		"space": 1
# 	},{background: true})

# 	db.flow_positions._ensureIndex({
# 		"space": 1,
# 		"users": 1
# 	},{background: true})

# 	db.flow_positions._ensureIndex({
# 		"space": 1,
# 		"role": 1
# 	},{background: true})


# new Tabular.Table
# 	name: "flow_positions",
# 	collection: db.flow_positions,
# 	pub: "flow_positions_tabular",
# 	columns: [
# 		{
# 			data: "role",
# 			width: "20%"
# 			render: (val, type, doc) ->
# 				role = db.flow_roles.findOne({_id: doc.role}, {fields: {name: 1}});
# 				return role && role.name;
# 		},
# 		{
# 			data: "users"
# 			width: "auto"
# 			render: (val, type, doc) ->
# 				if (!doc.users instanceof Array)
# 					return ""
# 				users = db.space_users.find({space: doc.space, user: {$in: doc.users}}, {fields: {name:1}});
# 				names = []
# 				users.forEach (user) ->
# 					names.push(user.name)
# 				return names.toString();
# 		},
# 		{
# 			data: "org",
# 			width: "20%"
# 			render: (val, type, doc) ->
# 				org = db.organizations.findOne({_id: doc.org}, {fields: {fullname: 1}});
# 				return org && org.fullname;
# 		}
# 	]
# 	dom: "tp"
# 	extraFields: ["space", "role", "org", "users"]
# 	lengthChange: false
# 	ordering: false
# 	pageLength: 10
# 	info: false
# 	searching: true
# 	autoWidth: false
# 	changeSelector: (selector, userId) ->
# 		unless userId
# 			return {_id: -1}
# 		space = selector.space
# 		unless space
# 			if selector?.$and?.length > 0
# 				space = selector.$and.getProperty('space')[0]
# 		unless space
# 			return {_id: -1}
# 		space_user = db.space_users.findOne({user: userId, space: space}, {fields: {_id: 1}})
# 		unless space_user
# 			return {_id: -1}
# 		return selector

# new Tabular.Table
# 	name: "admin_flow_positions",
# 	collection: db.flow_positions,
# 	pub: "flow_positions_tabular",
# 	drawCallback:(settings)->
# 		if $(this).hasClass("datatable-flows-roles") and !$(".datatable-flows-roles tfoot").length
# 			action = t("add_positions")
# 			tfoot = """
# 				<tfoot>
# 					<tr>
# 						<td colspan='2'>
# 							<div class="add-positions">
# 								<i class="ion ion-plus-round"></i>#{action}
# 							</div>
# 						</td>
# 					<tr>
# 				</tfoot>
# 			"""
# 			$(".datatable-flows-roles tbody").after(tfoot)

# 	columns: [
# 		{
# 			data: "users_name()"
# 			render: (val, type, doc) ->
# 				org = db.organizations.findOne({_id: doc.org}, {fields: {fullname: 1}});
# 				return """
# 					<div class="users-name">#{val}</div>
# 					<div class="org-fullname">#{org?.fullname}</div>
# 				"""
# 		}
# 	]
# 	extraFields: ["space", "role", "org", "users"]
# 	lengthChange: false
# 	ordering: false
# 	pageLength: 10
# 	info: false
# 	searching: true
# 	autoWidth: true
# 	changeSelector: (selector, userId) ->
# 		unless userId
# 			return {_id: -1}
# 		space = selector.space
# 		unless space
# 			if selector?.$and?.length > 0
# 				space = selector.$and.getProperty('space')[0]
# 		unless space
# 			return {_id: -1}
# 		space_user = db.space_users.findOne({user: userId, space: space}, {fields: {_id: 1}})
# 		unless space_user
# 			return {_id: -1}
# 		return selector