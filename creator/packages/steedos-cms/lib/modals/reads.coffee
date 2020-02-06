db.cms_reads = new Meteor.Collection('cms_reads')

db.cms_reads._simpleSchema = new SimpleSchema
	user: 
		type: String
		optional: false

	site: 
		type: String
		optional: false

	post: 
		type: String
		optional: false

	created:
		type: Date
		optional: false

	modified:
		type: Date
		optional: false

if Meteor.isClient
	db.cms_reads._simpleSchema.i18n("cms_reads")

db.cms_reads.attachSchema(db.cms_reads._simpleSchema)

if Meteor.isServer
	
	db.cms_reads.before.insert (userId, doc) ->

		doc.created = new Date()
		doc.modified = new Date()
		
		if !userId
			throw new Meteor.Error(400, "cms_error_login_required")

	db.cms_reads.before.update (userId, doc, fieldNames, modifier, options) ->
		modifier.$set = modifier.$set || {}

		modifier.$set.modified = new Date()
		
		if !userId
			throw new Meteor.Error(400, "cms_error_login_required")


if Meteor.isServer
	db.cms_reads._ensureIndex({
		"user": 1,
		"post": 1
	},{background: true})



