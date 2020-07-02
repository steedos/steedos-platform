Creator.Objects.flows.actions.copy = {
	label: "复制流程"
	visible: true
	on: "record"
	todo: (object_name, record_id, fields)->
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

			Meteor.call "flow_copy", Steedos.spaceId(), record_id, reason, (error, result)->
				if error
					toastr.error 'error'
				else
					toastr.success t('workflow_copy_flow_success')
					sweetAlert.close();
}