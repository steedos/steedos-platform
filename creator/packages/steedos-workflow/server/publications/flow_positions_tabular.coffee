Meteor.publishComposite 'flow_positions_tabular', (tableName, ids, fields)->
	check(tableName, String);
	check(ids, Array);
	check(fields, Match.Optional(Object));

	unless this.userId
		return this.ready()

	this.unblock()

	find: ->
		this.unblock()
		db.flow_positions.find {_id: {$in: ids}}, fields: fields

	children: [
		{
			find: (position) ->
				@unblock()
				# Publish the related flow_roles
				db.flow_roles.find { _id: position.role }, fields: name: 1
		}
		{
			find: (position) ->
				@unblock()
				# Publish the related organizations
				db.organizations.find { _id: position.org }, fields: fullname: 1
		}
		{
			find: (position) ->
				@unblock()
				# Publish the related user
				db.space_users.find {
					space: position.space
					user: $in: position.users
				}, fields:
					space: 1
					user: 1
					name: 1
		}
	]