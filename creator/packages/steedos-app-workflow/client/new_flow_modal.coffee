Template.new_flow_modal.helpers
	schema: ()->
		schema = {}
		object = Creator.getObject('flows')
		new_schema = new SimpleSchema(Creator.getObjectSchema(object))
		obj_schema = new_schema._schema
		_.each ['name', 'category'], (field)->
			schema[field] = obj_schema[field]
			if schema[field].autoform
				schema[field].autoform.readonly = false
				schema[field].autoform.disabled = false
		return new SimpleSchema(schema)

	fields: ()->
		return ['name', 'category']


Template.new_flow_modal.events
	'click .btn-confirm': (event, template)->
		event.currentTarget.disabled = true;
		if !AutoForm.validateField('newFlowForm')
			event.currentTarget.disabled = false;
			return false;

		doc = AutoForm.getFormValues("newFlowForm").insertDoc

		newFormId = Creator.getCollection("flows")._makeNewID();

		form = {
			id: newFormId,
			name: doc.name,
			space: Steedos.getSpaceId(),
			is_valid: true,
			app: "workflow",
			current: {
				id: Creator.getCollection("flows")._makeNewID(),
			}
		}

		if doc.category
			form.category = doc.category

		data = {
			"Forms": [form]
		}

		$.ajax
			type: 'post'
			url: '/am/forms?sync_token=' + (new Date()).getTime() / 1000
			data: JSON.stringify(data)
			dataType: 'json'
			contentType: "application/json"
			crossDomain: true,
			headers: {'x-user-id': Meteor.userId(), 'x-auth-token': Accounts._storedLoginToken()}
			beforeSend: (request) ->
				request.setRequestHeader 'X-User-Id', Meteor.userId()
				request.setRequestHeader 'X-Auth-Token', Accounts._storedLoginToken()
				request.setRequestHeader 'x-user-id', Meteor.userId()
				request.setRequestHeader 'x-auth-token', Accounts._storedLoginToken()
			success: (data) ->
				console.log(data);

				flows = data.ChangeSet.inserts.Flows;

				newFlow = _.find flows, (f)->
							return f.form == newFormId
				Workflow.openFlowDesign(Steedos.locale(), newFlow.space, newFlow._id)
				Modal.hide(template)

			error: (jqXHR, textStatus, errorThrown) ->
				event.currentTarget.disabled = false;
				console.error errorThrown

#		Modal.hide(template)
