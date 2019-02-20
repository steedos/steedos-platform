db.space_user_signs = new Meteor.Collection('space_user_signs')

Creator.Objects.space_user_signs =
	name: "space_user_signs"
	icon: "metrics"
	label: "图片签名"
	fields:
		user:
			type: "lookup"
			label: "用户"
			reference_to: "users"
			required: true
			is_name: true

		sign:
			type: "avatar"
			label: "签名"

		company_id:
			required: Meteor.settings?.public?.is_group_company
			omit: false
			hidden: false

	list_views:
		all:
			filter_scope: "space"
			columns: ["user", "sign", "company_id"]
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

	db.space_user_signs.allow
		insert: (userId, doc) ->
			if (!Steedos.isSpaceAdmin(doc.space, userId))
				return false
			else
				return true

		update: (userId, doc) ->
			if (!Steedos.isSpaceAdmin(doc.space, userId))
				return false
			else
				return true

		remove: (userId, doc) ->
			if (!Steedos.isSpaceAdmin(doc.space, userId))
				return false
			else
				return true

	db.space_user_signs.before.insert (userId, doc) ->
		if (!Steedos.isLegalVersion(doc.space,"workflow.professional"))
			throw new Meteor.Error(400, "space_paid_info_title");
		doc.created_by = userId;
		doc.created = new Date();
		doc.modified_by = userId;
		doc.modified = new Date();

		userSign = db.space_user_signs.findOne({space: doc.space, user: doc.user});

		if userSign
			throw new Meteor.Error(400, "spaceUserSigns_error_user_sign_exists");


	db.space_user_signs.before.update (userId, doc, fieldNames, modifier, options) ->

		modifier.$set.modified_by = userId;
		modifier.$set.modified = new Date();
		if (!Steedos.isLegalVersion(doc.space,"workflow.professional"))
			throw new Meteor.Error(400, "space_paid_info_title");
		if modifier.$set.user
			userSign = db.space_user_signs.findOne({space: doc.space, user: modifier.$set.user, _id:{$ne: doc._id}});

			if userSign
				throw new Meteor.Error(400, "spaceUserSigns_error_user_sign_exists");

	db.space_user_signs._ensureIndex({
		"space": 1
	},{background: true})

	db.space_user_signs._ensureIndex({
		"space": 1,
		"user": 1
	},{background: true})

db.space_user_signs.adminConfig =
	icon: "globe"
	color: "blue"
	tableColumns: [
		{name: "userName()"},
		{name: "signImage()"}
	]
	extraFields: ["space", "user", 'sign']
	routerAdmin: "/admin"
	selector: Selector.selectorCheckSpaceAdmin

db.space_user_signs.helpers
	signImage: ()->
		return "<img style='max-width: 120px;max-height: 80px;' src='" + Steedos.absoluteUrl("api/files/avatars/" + this.sign) + "' />"

	userName:()->
		user =  SteedosDataManager.spaceUserRemote.findOne({
					space: this.space,
					user: this.user
				}, {
					fields: {
						name: 1
					}
				})
		return user?.name

new Tabular.Table
	name: "SpaceUserSigns",
	collection: db.space_user_signs,
	columns: [
		{
			data: "user"
			render: (val, type, doc) ->
				user =  SteedosDataManager.spaceUserRemote.findOne({
					space: doc.space,
					user: doc.user
				}, {
					fields: {
						name: 1
					}
				})
				return user?.name
		}
		{
			data: "sign"
			render: (val, type, doc) ->
				return "<img style='max-width: 120px;max-height: 80px;' src='" + Steedos.absoluteUrl("api/files/avatars/" + doc.sign) + "' />"
		}
	]
	dom: "tp"
	lengthChange: false
	ordering: false
	pageLength: 10
	info: false
	extraFields: ["space", "user", 'sign']
	searching: true
	autoWidth: false
	changeSelector: (selector, userId) ->
		unless userId
			return {_id: -1}
		return selector