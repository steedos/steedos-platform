
_editFlow = (template, _id, fields)->

	template.edit_fields.set(fields)

	Session.set 'cmDoc', db.flows.findOne(_id)

	setTimeout ()->
		$('.btn.record-types-edit').click();
	, 1

Template.admin_flows.onCreated ()->
	this.edit_fields = new ReactiveVar()

Template.admin_flows.onRendered ()->
	if !Steedos.isPaidSpace()
		Steedos.spaceUpgradedModal()
		FlowRouter.go("/admin/home")

Template.admin_flows.helpers
	selector: ->

		query = {space: Session.get("spaceId"), is_deleted: false}

		if !_.isEmpty(Session.get("filter_state"))
			query.state = {$in: Session.get("filter_state")}

		return query;

	updateButtonContent: ->
		return t("Update");

	fields: ->
		return Template.instance()?.edit_fields.get()


Template.admin_flows.events
	'click #editFlow': (event, template) ->
		_id = event.currentTarget.dataset.id

		if _id
			_editFlow(template, _id, 'name, description')

	'click #editFlow_template': (event, template)->
		_id = event.currentTarget.dataset.id

		if _id
			_editFlow(template, _id, 'instance_template, print_template')

	'click #editFlow_events': (event, template)->
		_id = event.currentTarget.dataset.id

		if _id
			_editFlow(template, _id, 'events')

	'click #editFlow_fieldsMap': (event, template)->
		_id = event.currentTarget.dataset.id
		if _id
			_editFlow(template, _id, 'field_map')

	'click #editFlow_distribute': (event, template)->
		_id = event.currentTarget.dataset.id
		Modal.show("distribute_edit_flow_modal", {flow: db.flows.findOne(_id)})

	'click #importFlow': (event)->
		Modal.show("admin_import_flow_modal");

	'click #copyFlow': (event)->

		_id = event.currentTarget.dataset.id

		swal {
			title: t("workflow_copy_flow"),
			text: t("workflow_copy_flow_text"),
			type: "input",
			confirmButtonText: t('OK'),
			cancelButtonText: t('Cancel'),
			showCancelButton: true,
			closeOnConfirm: false
		}, (reason) ->
			if (reason == false)
				return false;

			if (reason == "")
				swal.showInputError(t("workflow_copy_flow_error_reason_required"));
				return false;

			Meteor.call "flow_copy", Steedos.spaceId(), _id, reason, (error, result)->
				if error
					toastr.error 'error'
				else
					toastr.success t('workflow_copy_flow_success')
					sweetAlert.close();

	'click .flow-switch-input': (event)->
		_id = event.currentTarget.dataset.id

		FLOW_STATE_API = "/am/flows/state"

		flow = db.flows.findOne(_id)

		if flow

			state = if flow.state == 'enabled' then 'disabled' else 'enabled'

			data = [{id: flow._id , form: flow.form, space: flow.space, state: state}]

			Meteor.call "change_flow_state", data, (error, result)->
				if error
					toastr.error error.reason

	'click #flow-list-search-btn': (event) ->
		dataTable = $(".flow-list").DataTable()
		selector = $("input[name='flow-list-search-key']").val()
		dataTable.search(
			selector
		).draw();

	'keypress #flow-list-search-key': (event, template) ->
		if event.keyCode == 13
			dataTable = $(".flow-list").DataTable()
			selector = $("input[name='flow-list-search-key']").val()
			dataTable.search(
				selector
			).draw();

#	'click input[name="filter_state"]': (event)->
#
#		filter = $("." + event.currentTarget.dataset.col)
#
#		filter_state = []
#
#		$('input[name="filter_state"]').each ()->
#			if $(this).is(":checked")
#				filter_state.push($(this).val())
#
#		Session.set("filter_state", filter_state)
#
#		if filter_state.length > 0
#			filter.addClass("enabled")
#		else
#			filter.removeClass("enabled")

	'click .flow-switch-input-enable-auto-remind': (event)->
		# 自动催办是企业版功能
		if Steedos.isLegalVersion('',"workflow.enterprise")
			db.flows.update({_id:event.currentTarget.dataset.id},{$set:{auto_remind: event.currentTarget.checked}})
		else
			event.currentTarget.checked = false
			Steedos.spaceUpgradedModal()

	'click .flow-switch-input-upload-after-being-distributed': (event)->
		# 自动催办是企业版功能
		if Steedos.isLegalVersion('',"workflow.enterprise")
			db.flows.update({ _id:event.currentTarget.dataset.id },{ $set: { upload_after_being_distributed: event.currentTarget.checked } })
		else
			event.currentTarget.checked = false
			Steedos.spaceUpgradedModal()

	'click #designFlow': (event)->
		_id = event.currentTarget.dataset.id
		Steedos.openWindow Steedos.absoluteUrl("/packages/steedos_admin/assets/designer/index.html?locale=#{Steedos.locale()}&space=#{Steedos.spaceId()}&flow=#{_id}")

Template.admin_flows.onDestroyed ->
	Session.set("filter_state", null)
