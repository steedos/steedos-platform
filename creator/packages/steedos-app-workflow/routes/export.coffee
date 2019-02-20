Cookies = require("cookies")

Meteor.startup ->
	WebApp.connectHandlers.use "/api/workflow/export/form", (req, res, next)->
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

		formId = req.query?.form;

		form = db.forms.findOne({_id: formId}, {fields: {space: 1}})

		if _.isEmpty(form)
			res.writeHead(401);
			res.end JSON.stringify({
				"error": "Validate Request -- Invalid formId",
				"success": false
			})
			return ;
		else
#			if !Steedos.isSpaceAdmin(form.space, userId)
#				res.writeHead(401);
#				res.end JSON.stringify({
#					"error": "Validate Request -- No permission",
#					"success": false
#				})
#				return;

			space = db.spaces.findOne(form.space, { fields: { is_paid: 1 } })
			if !space?.is_paid
				JsonRoutes.sendResult res,
					code: 404,
					data:
						"error": "Validate Request -- Non-paid space.",
						"success": false
				return;

		data = steedosExport.form(formId);

		if _.isEmpty(data)
			fileName = 'null'
		else
			fileName = data.name

		res.setHeader('Content-type', 'application/x-msdownload');
		res.setHeader('Content-Disposition', 'attachment;filename='+encodeURI(fileName)+'.json');
		res.end(JSON.stringify(data))