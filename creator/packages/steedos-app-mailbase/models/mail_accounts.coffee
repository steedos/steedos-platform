db.mail_accounts = new Meteor.Collection('mail_accounts')

db.mail_accounts.allow
	update: (userId, doc, fields, modifier) ->
		return doc.owner == userId;

	insert: (userId, doc, fields, modifier) ->
		return doc.owner == userId;

# db.mail_accounts._simpleSchema = new SimpleSchema

Creator.Objects.mail_accounts = 
	name: "mail_accounts"
	label: "邮件账户"
	icon: "apps"
	fields:
		email: 
			label: "邮箱账户"
			type: "text"
			is_name:true
			required: true
			defaultValue: ->
				return Meteor.user().emails?[0]?.address
		
		password: 
			label: "邮箱密码"
			type: "password"
			required: true

	list_views:
		all:
			label: "所有"
			filter_scope: "space"
			columns: ["email", "modified"]
	
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
			modifyAllRecords: false
			viewAllRecords: false 


# if Meteor.isClient
# 	db.mail_accounts._simpleSchema.i18n("mail_accounts")

# db.mail_accounts.attachSchema(db.mail_accounts._simpleSchema)

if Meteor.isServer

	cryptIvForMail = "-mail-2016fzb2e8"

	db.mail_accounts.before.insert (userId, doc) ->
		doc.created_by = userId;
		doc.created = new Date();
		doc.modified_by = userId;
		doc.modified = new Date();

		if doc.password
			doc.password = Steedos.encrypt(doc.password, doc.email, cryptIvForMail);

	db.mail_accounts.before.update (userId, doc, fieldNames, modifier, options) ->
		email = doc.email;
		modifier.$set.modified_by = userId;
		modifier.$set.modified = new Date();

		if modifier.$set.email
			email = modifier.$set.email

		if modifier.$set.password
			modifier.$set.password = Steedos.encrypt(modifier.$set.password, email, cryptIvForMail);

	db.mail_accounts.after.findOne (userId, selector, options, doc)->
		if doc?.password
			doc.password = Steedos.decrypt(doc.password, doc.email, cryptIvForMail)

# db.mail_accounts.after.find (userId, selector, options, cursor)->
# 	cursor.forEach (item) ->
# 		item.password = mailDecrypt.decrypt(item.password, item.email)

if Meteor.isServer
    db.mail_accounts._ensureIndex({
        "owner": 1
    },{background: true})