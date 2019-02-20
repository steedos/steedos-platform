db.space_settings = new Meteor.Collection('space_settings')

db.space_settings._simpleSchema = new SimpleSchema

# 工作区
	space:
		type: String
# key
	key:
		type: String

	value:
		type: Object
		blackbox: true

	is_public:
		type: Boolean


if Meteor.isServer

	db.space_settings.before.insert (userId, doc) ->
		if !doc.space
			throw new Meteor.Error(400, "space_settings_error_space_isRequired");

		if !_.isBoolean(doc.is_public)
			throw new Meteor.Error(400, "space_settings_error_public_isRequired");

	Meteor.publish 'space_settings', (spaceId)->

		unless this.userId
			return this.ready()

		unless spaceId
			return this.ready()

		selector =
			space: spaceId
			is_public: true

		return db.space_settings.find(selector)

	Meteor.methods
		'set_space_settings': (spaceId, key, values, is_public)->

			unless @userId
				throw new Meteor.Error(400, "space_settings_error_no_permission");

			space_user = db.space_users.findOne({space: spaceId, user: @userId})

			space = db.spaces.findOne({_id: spaceId})

			if !space_user || !space || space.admins.indexOf(@userId) < 0
				throw new Meteor.Error(400, "space_settings_error_no_permission");

			db.space_settings.upsert({space: spaceId, key: key}, {space: spaceId, key: key, values: values, is_public: is_public})

