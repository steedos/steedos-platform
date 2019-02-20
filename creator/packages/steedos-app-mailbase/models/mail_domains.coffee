db.mail_domains = new Meteor.Collection('mail_domains')


# db.mail_domains._simpleSchema = new SimpleSchema

Creator.Objects.mail_domains = 
	name: "mail_domains"
	label: "邮件域"
	icon: "apps"
	fields:
		domain: 
			label: "邮件域名"
			type: "text"
			is_name:true
			required: true
		
		smtp_server: 
			label: "SMTP服务器"
			type: "text"
			required: true
		
		smtp_ssl: 
			label: "SMTP加密"
			type: "boolean"
			required: true
			defaultValue: false
		
		smtp_port: 
			label: "SMTP端口"
			type: "number"
			required: true
			defaultValue: "25"
		
		imap_server: 
			label: "IMAP服务器"
			type: "text"
			required: true
		
		imap_ssl: 
			label: "IMAP加密"
			type: "boolean"
			required: true
			defaultValue: false
		
		imap_port: 
			label: "IMAP端口"
			type: "number"
			required: true
			defaultValue: "143"
		
		sensitive_keywords_alert: 
			label: "警告关键字"
			type: "textarea"
			rows: 6
			is_wide: true
		
		sensitive_keywords_forbidden: 
			label: "禁止关键字"
			type: "textarea"
			rows: 6
			is_wide: true
		
		before_send: 
			label: "发送验证"
			type: "textarea"
			rows: 12
			is_wide: true
		
		before_save: 
			label: "暂存验证"
			type: "textarea"
			rows: 12
			is_wide: true

	list_views:
		all:
			label: "所有"
			filter_scope: "space"
			columns: ["domain", "modified"]
	
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
# 	db.mail_domains._simpleSchema.i18n("mail_domains")

# db.mail_domains.attachSchema(db.mail_domains._simpleSchema)


if Meteor.isServer
    db.mail_domains._ensureIndex({
        "domain": 1
    },{background: true})