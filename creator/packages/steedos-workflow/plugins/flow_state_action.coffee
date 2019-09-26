Creator.Objects.flows.actions.enabled = {
	label: "启用"
	visible: true
	on: "record"
	sort: 1
	todo: (object_name, record_id, fields)->
		flow = Creator.getCollection(object_name).findOne(record_id)
		if flow

			data = [{id: flow._id , form: flow.form, space: flow.space, state: "enabled"}]

			Meteor.call "change_flow_state", data, (error, result)->
				if error
					toastr.error 'error'
}

Creator.Objects.flows.actions.disabled = {
	label: "停用"
	visible: true
	on: "record"
	sort: 2
	todo: (object_name, record_id, fields)->
		flow = Creator.getCollection(object_name).findOne(record_id)
		if flow

			data = [{id: flow._id , form: flow.form, space: flow.space, state: "disabled"}]

			Meteor.call "change_flow_state", data, (error, result)->
				if error
					toastr.error 'error'
}