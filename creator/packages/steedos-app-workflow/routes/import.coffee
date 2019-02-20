Cookies = require("cookies")

JsonRoutes.add "post", "/api/workflow/import/form", (req, res, next) ->
	cookies = new Cookies( req, res );

	msg = ""
	# first check request body
	if req.body
		uid = req.body["X-User-Id"]
		authToken = req.body["X-Auth-Token"]

	# then check cookie
	if !uid or !authToken
		uid = cookies.get("X-User-Id")
		authToken = cookies.get("X-Auth-Token")

	if !(uid and authToken)
		res.writeHead(401);
		res.end JSON.stringify({
			"error": "Validate Request -- Missing X-Auth-Token",
			"success": false
		})
		return ;

	spaceId = req.query?.space;

	company_id = req.query?.company_id;

	space = db.spaces.findOne(spaceId, { fields: { is_paid: 1 } })

	if !space?.is_paid
		JsonRoutes.sendResult res,
			code: 404,
			data:
				"error": "Validate Request -- Non-paid space.",
				"success": false
		return;

	if !WorkflowCore.checkCreatePermissions(spaceId, uid, company_id)
		res.writeHead(401);
		res.end JSON.stringify({
			"error": "Validate Request -- No permission",
			"success": false
		})
		return

	try
		JsonRoutes.parseFiles req, res, ()->
			try
				if req.files and req.files[0]

					jsonData = req.files[0].data.toString("utf-8")
					try
						form = JSON.parse(jsonData)
						new_flowIds = steedosImport.workflow(uid, spaceId, form, false, company_id);
						msg = JSON.stringify({new_flows: new_flowIds})
						res.statusCode = 200;
					catch e
						console.error e
						msg = e.reason
						res.statusCode = 500;
					res.end(msg)
					return
				else
					msg = "无效的附件"
					res.statusCode = 500;
					res.end(msg);
			catch e1
				msg = "无效的JSON文件"
				res.statusCode = 500;
				res.end(msg);
	catch e
		console.log(e)

