Cookies = require("cookies")

importWorkflow = (jsonStr, uid, spaceId, company_id, flowId)->
	try
		form = JSON.parse(jsonStr)
	catch e
		throw new Meteor.Error('error', "无效的JSON文件");

	options = {}

	if flowId
		options.flowId = flowId
		options.upgrade = true
		flow = db.flows.findOne({_id: flowId, space: spaceId}, {fields: {form: 1}})
		if !flow
			throw new Meteor.Error("error", "无效的flowId")
		else
			options.formId = flow.form

	new_flowIds = steedosImport.workflow(uid, spaceId, form, false, company_id, options);
	return {new_flows: new_flowIds}


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

	flowId = req.query?.flowId;

	if flowId
		flow = db.flows.findOne({_id: flowId, space: spaceId}, {fields: {company_id: 1}})
		if flow
			company_id = flow.company_id

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
				files = req.files
				fail = {}
				success = {}
				multiple = false
				if files.length > 1
					multiple = true

				if flowId && files.length > 0
					files = [files[0]]

				_.each files, (file)->
					filename = file.filename
					try
						jsonData = file.data.toString("utf-8");
						success[filename] = importWorkflow(jsonData, uid, spaceId, company_id, flowId)
					catch e
						console.error e
						fail[filename] = e.reason || e.message
				if _.isEmpty(fail)
					res.statusCode = 200;
				else
					res.statusCode = 500;
				res.end(JSON.stringify({multiple: multiple, fail: fail, success: success}))
			catch e1
				msg = "无效的JSON文件"
				res.statusCode = 500;
				res.end(msg);
	catch e
		console.error(e)

