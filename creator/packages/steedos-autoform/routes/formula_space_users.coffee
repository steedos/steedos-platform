Meteor.startup ->
	JsonRoutes.add "post", "/api/formula/space_users", (req, res, next) ->
		userIds = req.body.userIds
		spaceId = req.query.spaceId

		spaceUsers = []

		data = []

		if (userIds)

			if not userIds instanceof Array
				userIds = [userIds]

			query = {
				user: {
					$in: userIds
				}
			}

			if spaceId
				query.space = spaceId

			space_users = db.space_users.find(query).fetch();

			selected = []

			space_users.forEach (u)->
				if selected.indexOf(u.user) < 0
					fu = {}

					fu.id = u.user

					fu.name = u.name

					fu.sort_no = u.sort_no

					fu.mobile = u.mobile

					fu.work_phone = u.work_phone

					fu.position = u.position

					u_org = db.organizations.findOne({_id: u.organization}, {fields: {name: 1, fullname: 1}})

					u_orgs = db.organizations.find({_id: {$in: u.organizations}}, {fields: {name: 1, fullname: 1}}).fetch()


					fu.organization = {
						name: u_org?.name,
						fullname: u_org?.fullname
					}

					fu.organizations = {
						name: u_orgs?.getProperty("name"),
						fullname: u_orgs?.getProperty("fullname"),
					}

					fu.hr = u.hr || {}

					if db.flow_positions && db.flow_roles

						user_flow_positions = db.flow_positions.find({space: u.space, users: u.user}, {fields: {role: 1}}).fetch();

						user_role_ids = user_flow_positions.getProperty("role");

						user_roles = db.flow_roles.find({_id: {$in: user_role_ids}}, {fields: {name: 1}}).fetch();

						fu.roles = user_roles.getProperty("name")

					data.push fu

					selected.push u.user

			userIds.forEach (uId)->
				spaceUsers.push _.find(data, (su)-> return su.id == uId)


		JsonRoutes.sendResult(res, {
			code: 200,
			data: {
				'spaceUsers': spaceUsers
			}
		});

