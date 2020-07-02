Meteor.methods
	updateFlowPosition: (data) ->
		db.flow_positions.update { _id: data._id }, $set:
			role: data.role
			users: data.users
			org: data.org

	updateFlowRole: (data) ->
		console.log data._id
		console.log data.name
		db.flow_roles.update { _id: data._id }, $set:
			name: data.name