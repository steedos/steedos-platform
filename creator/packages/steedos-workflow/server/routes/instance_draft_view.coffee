JsonRoutes.add "get", "/api/workflow/space/:space/view/draft/:flow", (req, res, next) ->
	if !Steedos.APIAuthenticationCheck(req, res)
		return

	user_id = req.userId

	user = db.users.findOne({ _id: user_id })

	spaceId = req.params.space

	flowId = req.params.flow

	space = db.spaces.findOne({ _id: spaceId })

	flow = db.flows.findOne({ _id: flowId }, { fields: { name: 1, 'current._id': 1, form: 1 } })

	form = db.forms.findOne({ _id: flow.form }, { fields: { 'current._id': 1 } })

	options = {
		showTrace: false,
		showAttachments: false,
		templateName: "default",
		editable: true,
		width: "100%",
		instance_style: "instance-default",
		plugins: """

			<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1" />
			<meta name="format-detection" content="telephone=no">
			<meta http-equiv="x-rim-auto-match" content="none">
			<title>#{flow.name}</title>
			<meta content='width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0' name='viewport' />
			<meta name="viewport" content="width=device-width" />

			<link rel="stylesheet" type="text/css" href="/plugins/bootstrap-datetimepicker/css/bootstrap-datetimepicker.min.css">

			<script src="/plugins/bootstrap-datetimepicker/js/bootstrap-datetimepicker.min.js" type="text/javascript"></script>

			<script src="/plugins/bootstrap-datetimepicker/js/locales/bootstrap-datetimepicker.zh-CN.js" type="text/javascript" charset="UTF-8"></script>

			<link rel="stylesheet" type="text/css" href="/plugins/toastr/toastr.min.css">
			<script src="/plugins/toastr/toastr.min.js" type="text/javascript"></script>
			<link rel="stylesheet" type="text/css" href="/js/workflow_client.css">
			<script src="/js/workflow_client.js" type="text/javascript"></script>
		"""
	}

	instance = {
		flow: flow._id,
		flow_version: flow.current._id,
		form: form._id,
		form_version: form.current._id,
		values: {},
		name: flow.name,
		space: spaceId
	}

	html = InstanceReadOnlyTemplate.getInstanceHtml(user, space, instance, options)

	dataBuf = new Buffer(html)

	res.setHeader('content-length', dataBuf.length)

	res.setHeader('content-range', "bytes 0-#{dataBuf.length - 1}/#{dataBuf.length}")

	res.statusCode = 200

	res.end(html)
