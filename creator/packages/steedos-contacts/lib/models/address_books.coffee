db.address_books = new Meteor.Collection('address_books')

db.address_books._simpleSchema = new SimpleSchema

	owner:
		type: String,
		autoform:
			type: "hidden",
			defaultValue: ->
				return Meteor.userId();
	user:
		type: String,
		optional: true,
		autoform:
			type: "hidden",
	name:
		type: String,
	email:
		type: String,
		optional: true
	mobile:
		type: String,
		optional: true,
	company:
		type: String,
		optional: true
	group:
		type: String,
		optional: true,
		autoform:
			type: "select",
			options: ()->
				groups = db.address_groups.find().fetch();
				op = new Array();
				groups.forEach (g)->
					op.push({label: g.name, value: g._id})

				return op;
	created:
		type: Date,
		optional: true
	created_by:
		type: String,
		optional: true
	modified:
		type: Date,
		optional: true
	modified_by:
		type: String,
		optional: true


db.address_books.helpers
	group_name: ->
		group = db.address_groups.findOne({_id: this.group})
		return group?.name;

if Meteor.isClient

	db.address_books._simpleSchema.i18n("address_books")

if Meteor.isServer
	db.address_books.before.insert (userId, doc) ->
		if doc.email
			if not /^([A-Z0-9\.\-\_\+])*([A-Z0-9\+\-\_])+\@[A-Z0-9]+([\-][A-Z0-9]+)*([\.][A-Z0-9\-]+){1,8}$/i.test(doc.email)
				throw new Meteor.Error(400, "email_format_error");

			# 不能重复添加相同的email
			exists = db.address_books.find({owner: Meteor.userId(), group: doc.group, email: doc.email}).count()
			if exists > 0
				throw new Meteor.Error(400, "steedos_contacts_error_contact_exists")
			
	db.address_books.before.update (userId, doc, fieldNames, modifier, options) ->
		if modifier.$set.email
			if not /^([A-Z0-9\.\-\_\+])*([A-Z0-9\+\-\_])+\@[A-Z0-9]+([\-][A-Z0-9]+)*([\.][A-Z0-9\-]+){1,8}$/i.test(modifier.$set.email)
				throw new Meteor.Error(400, "email_format_error");


db.address_books.attachSchema(db.address_books._simpleSchema)

if Meteor.isServer
	db.address_books._ensureIndex({
		"owner": 1
	},{background: true})

	db.address_books._ensureIndex({
		"group": 1
	},{background: true})

	db.address_books._ensureIndex({
		"group": 1,
		"email": 1
	},{background: true})

	db.address_books._ensureIndex({
		"owner": 1,
		"group": 1,
		"email": 1
	},{background: true})