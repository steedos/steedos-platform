fields = ['category', 'name', 'company_id']
Template.new_flow_modal.helpers
	schema: ()->
		schema = {}
		object = Creator.getObject('flows')
		new_schema = new SimpleSchema(Creator.getObjectSchema(object))
		obj_schema = new_schema._schema
		_.each fields, (field)->
			schema[field] = obj_schema[field]
			if schema[field].autoform
				schema[field].autoform.readonly = false
				schema[field].autoform.disabled = false
		return new SimpleSchema(schema)

	fields: ()->
		return fields


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

		companyId = doc.company_id
		if companyId
			form.company_id = companyId

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
				WorkflowCore.openFlowDesign(Steedos.locale(), newFlow.space, newFlow._id, Creator.getUserCompanyId())
				FlowRouter.go("/app/admin/flows/view/#{newFlow._id}")
				Modal.hide(template)

			error: (jqXHR, textStatus, errorThrown) ->
				event.currentTarget.disabled = false;
				console.error errorThrown

#		Modal.hide(template)
