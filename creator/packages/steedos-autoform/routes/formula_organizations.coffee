Meteor.startup ->
	JsonRoutes.add "post", "/api/formula/organizations", (req, res, next) ->

		res_orgs = []

		data = []

		orgIds = req.body.orgIds

		spaceId = req.query.spaceId

		if orgIds
			if not orgIds instanceof Array
				orgIds = [orgIds]

			query = {_id: {$in: orgIds}}

			if spaceId
				query.space = spaceId

			orgs = db.organizations.find(query, {fields: {name: 1, fullname: 1}}).fetch();

			orgs.forEach (org)->
				data.push {id: org._id, name: org.name, fullname: org.fullname}

			orgIds.forEach (oId)->
				res_orgs.push _.find(data, (o)-> return o.id == oId)



		JsonRoutes.sendResult(res, {
			code: 200,
			data: {
				'orgs': res_orgs
			}
		});

