
if Meteor.isServer

	Meteor.publish 'contacts_view_limits', (spaceId)->

		unless this.userId
			return this.ready()

		unless spaceId
			return this.ready()

		selector =
			space: spaceId
			key: 'contacts_view_limits'

		return db.space_settings.find(selector)