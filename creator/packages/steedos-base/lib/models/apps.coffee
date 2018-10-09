db.apps = new Meteor.Collection('apps')

db.apps._simpleSchema = new SimpleSchema
	space: 
		type: String,
		optional: true,
		autoform: 
			type: "hidden",
			defaultValue: ->
				return Session.get("spaceId")
	name:
		type: String
		max: 200
	url:
		type: String
		max: 200
	icon:
		type: String
		max: 200
		autoform:
			defaultValue: "ion-ios-color-filter-outline"
	auth_name:
		type: String
		optional: true
		max: 200
		autoform:
			type: "hidden"
	sort:
		type: Number
		optional: true
		defaultValue: 9000
#		autoform:
#			omit: true
#	space_sort:
#		type: Number
#		optional: true
	secret:
		type: String
		max: 16
		min: 16
		optional: true
	# internal:
	# 	type: Boolean
	# 	optional: true
	# 	autoform: 
	# 		omit: true
	mobile:
		type: Boolean
		optional: true
	is_use_ie: 
		type: Boolean
		optional: true
		autoform: 
			defaultValue: false
	is_use_iframe: 
		type: Boolean
		optional: true
		autoform: 
			defaultValue: false
	is_new_window:
		type: Boolean
		optional: true
		autoform:
			defaultValue: false
	on_click:
		type: String
		optional: true
		autoform:
			rows: 10
			type: "hidden"
		optional: true

	members:
		type: Object,
		optional: true

	"members.users": 
		type: [String],
		optional: true,
		autoform:
			type: "selectuser"
			multiple: true


	"members.organizations": 
		type: [String],
		optional: true,
		autoform:
			type: "selectorg"
			multiple: true


if Meteor.isClient
	db.apps._simpleSchema.i18n("apps")

db.apps.attachSchema db.apps._simpleSchema;

db.apps.isInternalApp = (url) ->
	if url and db.apps.INTERNAL_APPS
		for app_url in db.apps.INTERNAL_APPS
			if url.startsWith(app_url)
				return true
	return false

if Meteor.isServer
	db.apps.allow 
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

if Meteor.isServer

	# db.apps.before.insert (userId, doc) ->
	# 	doc.internal = db.apps.isInternalApp(doc.url)
	# 	return

	db.apps.before.update (userId, doc, fieldNames, modifier, options) ->
		modifier.$set = modifier.$set || {};
		# modifier.$unset = modifier.$unset || {};

		# if modifier.$set.url
		# 	modifier.$set.internal = db.apps.isInternalApp(modifier.$set.url)
		# 	delete modifier.$unset.internal

