db.portal_dashboards = new Meteor.Collection('portal_dashboards')

# db.portal_dashboards._simpleSchema = new SimpleSchema

Creator.Objects.portal_dashboards = 
	name: "portal_dashboards"
	label: "面板"
	icon: "apps"
	fields:
		name: 
			label: "名称"
			type: "text"
			defaultValue: ""
			description: ""
			inlineHelpText: ""
			required: true
			index:true

		freeboard: 
			label: "排版设置"
			type: "textarea"
			is_wide: true
			defaultValue: ""
			rows: 20
			description: "freeboard脚本"
			inlineHelpText: "请将排版设置的freeboard脚本COPY输入"
			required: true
		
		description:
			label: "描述"
			type: "textarea"
			is_wide: true

	list_views:
		all:
			label: "所有"
			filter_scope: "space"
			columns: ["name", "modified"]
	
	permission_set:
		user:
			allowCreate: false
			allowDelete: false
			allowEdit: false
			allowRead: false
			modifyAllRecords: false
			viewAllRecords: false 
		admin:
			allowCreate: true
			allowDelete: true
			allowEdit: true
			allowRead: true
			modifyAllRecords: true
			viewAllRecords: true

# if Meteor.isClient
# 	db.portal_dashboards._simpleSchema.i18n("portal_dashboards")

# db.portal_dashboards.attachSchema(db.portal_dashboards._simpleSchema)


if Meteor.isServer
	
	db.portal_dashboards.before.insert (userId, doc) ->
		if !userId
			throw new Meteor.Error(400, t("portal_dashboards_error_login_required"));
		# check space exists
		space = db.spaces.findOne(doc.space)
		if !space
			throw new Meteor.Error(400, t("portal_dashboards_error_space_not_found"));
		# only space admin can add
		if space.admins.indexOf(userId) < 0
			throw new Meteor.Error(400, t("portal_dashboards_error_space_admins_only"));

		doc.created_by = userId
		doc.created = new Date()
		doc.modified_by = userId
		doc.modified = new Date()
		

	db.portal_dashboards.before.update (userId, doc, fieldNames, modifier, options) ->
		if !userId
			throw new Meteor.Error(400, t("portal_dashboards_error_login_required"));
		# check space exists
		space = db.spaces.findOne(doc.space)
		if !space
			throw new Meteor.Error(400, t("portal_dashboards_error_space_not_found"));
		# only space admin can edit
		if space.admins.indexOf(userId) < 0
			throw new Meteor.Error(400, t("portal_dashboards_error_space_admins_only"));

		modifier.$set = modifier.$set || {};

		modifier.$set.modified_by = userId;
		modifier.$set.modified = new Date();


	db.portal_dashboards.before.remove (userId, doc) ->
		if !userId
			throw new Meteor.Error(400, t("portal_dashboards_error_login_required"));
		# check space exists
		space = db.spaces.findOne(doc.space)
		if !space
			throw new Meteor.Error(400, t("portal_dashboards_error_space_not_found"));
		# only space admin can remove
		if space.admins.indexOf(userId) < 0
			throw new Meteor.Error(400, t("portal_dashboards_error_space_admins_only"));



