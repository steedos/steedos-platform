
if Meteor.isServer

	Meteor.publish 'contacts_no_force_phone_users', (spaceId)->

		unless this.userId
			return this.ready()

		unless spaceId
			return this.ready()

		selector =
			space: spaceId
			key: 'contacts_no_force_phone_users'

		return db.space_settings.find(selector)