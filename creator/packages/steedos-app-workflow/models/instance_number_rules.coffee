db.instance_number_rules = new Meteor.Collection('instance_number_rules')

Creator.Objects.instance_number_rules =
	name: "instance_number_rules"
	icon: "metrics"
	label: "流程编号规则"
	fields:
		name:
			type: "text"
			label: "名称"
			required: true

		year:
			type: "number",
			label: "年份"
			readonly: true
			defaultValue: ()->
				if Meteor.isClient
					return (new Date).getFullYear()

		first_number:
			type: "number"
			label: "起始序号"
			defaultValue: 1

		number:
			type: "number"
			label: "序号"
			defaultValue: 0

		rules:
			type: "text"
			label: "编号规则"
			required: true

		company_id:
			required: Meteor.settings?.public?.is_group_company
			omit: false
			hidden: false

	list_views:
		all:
			filter_scope: "space"
			columns: ["name", "year","first_number","number","rules"]
			label: "所有"

	permission_set:
		user:
			allowCreate: false
			allowDelete: false
			allowEdit: false
			allowRead: true
			modifyAllRecords: false
			viewAllRecords: false
		admin:
			allowCreate: true
			allowDelete: true
			allowEdit: true
			allowRead: true
			modifyAllRecords: true
			viewAllRecords: true
		workflow_admin:
			allowCreate: true
			allowDelete: true
			allowEdit: true
			allowRead: true
			modifyAllRecords: false
			viewAllRecords: false
			modifyCompanyRecords: true
			viewCompanyRecords: true
			disabled_list_views: []
			disabled_actions: []
			unreadable_fields: []
			uneditable_fields: []
			unrelated_objects: []

if Meteor.isServer

	db.instance_number_rules.allow
		insert: (userId, event) ->
			if (!Steedos.isSpaceAdmin(event.space, userId))
				return false
			else
				return true

		update: (userId, event) ->
			if (!Steedos.isSpaceAdmin(event.space, userId))
				return false
			else
				return true

		remove: (userId, event) ->
			if (!Steedos.isSpaceAdmin(event.space, userId))
				return false
			else
				return true

	db.instance_number_rules.before.insert (userId, doc) ->
		doc.created_by = userId;
		doc.created = new Date();

		rules = db.instance_number_rules.findOne({space: doc.space, "name": doc.name})

		if rules
			throw new Meteor.Error(400, "instance_number_rules_name_only");

		# if (!Steedos.isSpaceAdmin(doc.space, userId))
		# 	throw new Meteor.Error(400, "error_space_admins_only");

		console.log userId + "; insert instance_number_rules",  doc

	db.instance_number_rules.before.update (userId, doc, fieldNames, modifier, options) ->

		modifier.$set = modifier.$set || {};

		modifier.$set.modified_by = userId;
		modifier.$set.modified = new Date();

#		if (!Steedos.isSpaceAdmin(doc.space, userId))
#			throw new Meteor.Error(400, "error_space_admins_only");

		console.log userId + "; update instance_number_rules",  doc

	db.instance_number_rules.before.remove (userId, doc) ->

		# if (!Steedos.isSpaceAdmin(doc.space, userId))
		# 	throw new Meteor.Error(400, "error_space_admins_only");

		console.log userId + "; remove instance_number_rules",  doc

new Tabular.Table
	name: "instance_number_rules",
	collection: db.instance_number_rules,
	columns: [
		{data: "name", title: "name"},
		{data: "year", title: "year"},
		{data: "first_number", title: "first_number"},
		{data: "number", title: "number"},
		{data: "rules", title: "rules"}
	]
	dom: "tp"
	extraFields: ["space"]
	lengthChange: false
	ordering: false
	pageLength: 10
	info: false
	searching: true
	autoWidth: false

if Meteor.isServer
	db.instance_number_rules._ensureIndex({
		"space": 1,
		"name": 1
	},{background: true})