JsonRoutes.add 'get', '/api/creator/app_package/export/:space_id/:record_id', (req, res, next) ->
	try

		userId = Steedos.getUserIdFromAuthToken(req, res);

		if !userId
			JsonRoutes.sendResult res, {
				code: 401
				data: {errors: "Authentication is required and has not been provided."}
			}
			return

		record_id = req.params.record_id
		space_id = req.params.space_id

		if !Creator.isSpaceAdmin(space_id, userId)
			JsonRoutes.sendResult res, {
				code: 401
				data: {errors: "Permission denied"}
			}
			return

		record = Creator.getCollection("application_package").findOne({_id: record_id})

		if !record
			JsonRoutes.sendResult res, {
				code: 404
				data: {errors: "Collection not found for the segment #{record_id}"}
			}
			return

		space_user = Creator.getCollection("space_users").findOne({user: userId, space: record.space})

		if !space_user
			JsonRoutes.sendResult res, {
				code: 401
				data: {errors: "User does not have privileges to access the entity"}
			}
			return

		data = APTransform.export record

		data.dataSource = Meteor.absoluteUrl("api/creator/app_package/export/#{space_id}/#{record_id}")

		fileName = record.name || "application_package"

		res.setHeader('Content-type', 'application/x-msdownload');
		res.setHeader('Content-Disposition', 'attachment;filename='+encodeURI(fileName)+'.json');
		res.end(JSON.stringify(data, null, 4))
	catch e
		console.error e.stack
		JsonRoutes.sendResult res, {
			code: 200
			data: { errors: errorMessage: e.reason || e.message }
		}

