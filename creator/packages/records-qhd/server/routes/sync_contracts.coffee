Cookies = Npm.require("cookies")

JsonRoutes.add "post", "/api/records/sync_contracts", (req, res, next) ->

	user = Steedos.getAPILoginUser(req, res)

	if !user
		JsonRoutes.sendResult res,
			code: 401,
			data:
				"error": "Validate Request -- Missing X-Auth-Token,X-User-Id",
				"success": false
		return;

	spaceId = req.body?.spaceId

	if !spaceId
		JsonRoutes.sendResult res,
			code: 401,
			data:
				"error": "Validate Request -- Missing spaceId",
				"success": false
		return;


	submit_date_start = req.body?.submit_date_start

	submit_date_end = req.body?.submit_date_end

	if submit_date_start
		submit_date_start = new Date(submit_date_start)

	if submit_date_end
		submit_date_end = new Date(submit_date_end)


	if Steedos.isSpaceAdmin(spaceId, user._id)
		console.log req.body

		data = RecordsQHD.instanceToContracts submit_date_start, submit_date_end, [spaceId]

		JsonRoutes.sendResult res,
			code: 200,
			data:
				"status": "success",
				"data": data

	else
		JsonRoutes.sendResult res,
			code: 401,
			data:
				"error": "Validate Request -- No permission",
				"success": false
		return;
	return;
