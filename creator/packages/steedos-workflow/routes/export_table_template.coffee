Cookies = require("cookies")

Meteor.startup ->
	WebApp.connectHandlers.use "/api/workflow/export/talbe_template", (req, res, next)->
		cookies = new Cookies( req, res );
		# first check request body
		if req.body
			userId = req.body["X-User-Id"]
			authToken = req.body["X-Auth-Token"]

		# then check cookie
		if !userId or !authToken
			userId = cookies.get("X-User-Id")
			authToken = cookies.get("X-Auth-Token")

		if !(userId and authToken)
			res.writeHead(401);
			res.end JSON.stringify({
				"error": "Validate Request -- Missing X-Auth-Token",
				"success": false
			})
			return ;

		flowId = req.query?.flow;

		flow = db.flows.findOne({_id: flowId}, {fields: {space: 1, form: 1, name: 1}})

		form = db.forms.findOne({_id: flow.form}, {fields: {space: 1, "current._id": 1}})

		if _.isEmpty(flow)
			res.writeHead(401);
			res.end JSON.stringify({
				"error": "Validate Request -- Invalid formId",
				"success": false
			})
			return ;
		else
			if !Steedos.isSpaceAdmin(flow.space, userId)
				res.writeHead(401);
				res.end JSON.stringify({
					"error": "Validate Request -- No permission",
					"success": false
				})
				return;

			space = db.spaces.findOne(flow.space, { fields: { is_paid: 1 } })
			if !space?.is_paid
				JsonRoutes.sendResult res,
					code: 404,
					data:
						"error": "Validate Request -- Non-paid space.",
						"success": false
				return;

		data = TemplateManager.handleTableTemplate({form: flow.form, form_version: form?.current?._id}, true);

		fileName = flow.name

		res.setHeader('Content-type', 'application/x-msdownload');
		res.setHeader('Content-Disposition', 'attachment;filename='+encodeURI(fileName)+'.html');
		res.end(data)