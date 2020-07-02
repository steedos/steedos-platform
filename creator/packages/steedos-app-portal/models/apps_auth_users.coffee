db.apps_auth_users = new Meteor.Collection('apps_auth_users')

# db.apps_auth_users._simpleSchema = new SimpleSchema

Creator.Objects.apps_auth_users = 
	name: "apps_auth_users"
	label: "域账户"
	icon: "apps"
	fields:
		auth_name: 
			label: "域名称"
			type: "text"
			is_name:true
			required: true

		user:
			label: "关联用户"
			type: "lookup"
			reference_to: "users"
			required: true
			defaultValue: ()->
				if Meteor.isClient
					return Meteor.userId()
		
		user_name: 
			label: "用户名称"
			type: "text"
			omit: true
			hidden: true
		
		login_name: 
			label: "登录名"
			type: "text"
			required: true
		
		login_password: 
			label: "登录密码"
			type: "password"
			required: true
		
		is_encrypted: 
			label: "密码加密"
			type: "boolean"
			omit: true
			

	list_views:
		all:
			label: "所有"
			filter_scope: "space"
			columns: ["auth_name", "user_name", "login_name", "modified"]
	
	permission_set:
		user:
			allowCreate: true
			allowDelete: true
			allowEdit: true
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

# if Meteor.isClient
# 	db.apps_auth_users._simpleSchema.i18n("apps_auth_users")

# db.apps_auth_users.attachSchema(db.apps_auth_users._simpleSchema)



if Meteor.isServer

	cryptIvForAuthUsers = "-auth-user201702"
	
	db.apps_auth_users.before.insert (userId, doc) ->
		if !userId
			throw new Meteor.Error(400, t("portal_dashboards_error_login_required"));
		# check space exists
		space = db.spaces.findOne(doc.space)
		if !space
			throw new Meteor.Error(400, t("portal_dashboards_error_space_not_found"));

		doc.user_name = db.users.findOne(doc.user).name

		if doc.login_password
			doc.login_password = Steedos.encrypt(doc.login_password, doc.login_name, cryptIvForAuthUsers);
			doc.is_encrypted = true

		doc.created_by = userId
		doc.created = new Date()
		doc.modified_by = userId
		doc.modified = new Date()
		

	db.apps_auth_users.before.update (userId, doc, fieldNames, modifier, options) ->
		if !userId
			throw new Meteor.Error(400, t("portal_dashboards_error_login_required"));
		# check space exists
		space = db.spaces.findOne(doc.space)
		if !space
			throw new Meteor.Error(400, t("portal_dashboards_error_space_not_found"));

		# only seft can edit
		if space.admins.indexOf(userId) < 0 and userId != doc.user
			throw new Meteor.Error(400, t("apps_auth_users_error_self_edit_only"));

		modifier.$set = modifier.$set || {};

		modifier.$set.user_name = db.users.findOne(doc.user).name;

		login_name = doc.login_name

		if modifier.$set.login_name
			login_name = modifier.$set.login_name

		if modifier.$set.login_password
			modifier.$set.login_password = Steedos.encrypt(modifier.$set.login_password, login_name, cryptIvForAuthUsers);
			modifier.$set.is_encrypted = true

		modifier.$set.modified_by = userId;
		modifier.$set.modified = new Date();


	db.apps_auth_users.before.remove (userId, doc) ->
		if !userId
			throw new Meteor.Error(400, t("portal_dashboards_error_login_required"));
		# check space exists
		space = db.spaces.findOne(doc.space)
		if !space
			throw new Meteor.Error(400, t("portal_dashboards_error_space_not_found"));
		# only seft can remove
		if space.admins.indexOf(userId) < 0 and userId != doc.user
			throw new Meteor.Error(400, t("apps_auth_users_error_self_remove_only"));


	db.apps_auth_users.after.findOne (userId, selector, options, doc)->
		if doc?.login_password and doc?.is_encrypted
			doc.login_password = Steedos.decrypt(doc.login_password, doc.login_name, cryptIvForAuthUsers)
