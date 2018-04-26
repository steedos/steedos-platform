JsonRoutes.add 'post', '/api/workflow/drafts', (req, res, next) ->
	try
		current_user_info = uuflowManager.check_authorization(req)
		current_user_id = current_user_info._id

		hashData = req.body

		inserted_instances = new Array

		_.each hashData['Instances'], (instance_from_client) ->
			new_ins_id = uuflowManager.create_instance(instance_from_client, current_user_info)

			new_ins = Creator.Collections.instances.findOne({ _id: new_ins_id }, { fields: { space: 1, flow: 1, flow_version: 1, form: 1, form_version: 1 } })

			inserted_instances.push(new_ins)

		JsonRoutes.sendResult res, {
			code: 200
			data: { inserts: inserted_instances }
		}
	catch e
		console.error e.stack
		JsonRoutes.sendResult res, {
			code: 200
			data: { errors: [{ errorMessage: e.reason || e.message }] }
		}

