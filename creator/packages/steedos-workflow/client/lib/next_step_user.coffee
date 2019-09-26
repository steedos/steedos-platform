@NextStepUser = {}

NextStepUser.handleException = (e)->

	step = WorkflowManager.getInstanceStep(Session.get("next_step_id"))

	_fieldEmpty = (fieldname)->
		fields = WorkflowManager.getInstanceFields()
		field = fields.findPropertyByPK('_id', step[fieldname])
		if field
#			$field = $("[name='" + field.code + "']")
#			toastr.warning("请选择" + (field.name || field.code));
#			$field.parent().addClass('has-error')
#			$field.click();
			swal({
				title: t('not_found_user'),
				text: t('next_step_users_not_found.field_value_empty', {field_name: (field.name || field.code)}),
				html: true,
				showCancelButton: false,
				closeOnConfirm: false,
				cancelButtonText: t('Cancel')
				confirmButtonText: t('OK'),
			});
		else
			console.error('_fieldEmpty', 'not find field, _id is ' + step[fieldname])

	_swal_guide = (text, confirmButtonText, guide_url, next_title)->
		if(Steedos.isSpaceAdmin(Session.get("spaceId"), Meteor.userId()))
			swal({
				title: t('not_found_user'),
				text: text,
				html: true,
				showCancelButton: true,
				closeOnConfirm: false,
				confirmButtonText: confirmButtonText,
				cancelButtonText: t('Cancel'),
				showLoaderOnConfirm: false
			}, (inputValue) ->
				if inputValue == false
					swal.close();
				else
					Steedos.openWindow(Steedos.absoluteUrl(guide_url))
					swal({
						title: next_title,
						type: "warning",
						confirmButtonText: t("OK"),
						closeOnConfirm: true
					}, ()->
						Session.set("instance_next_user_recalculate", Random.id())
						swal.close();
					)
			);
		else
			swal({
				title: t('not_found_user'),
				text: text,
				html: true,
				showCancelButton: false,
				closeOnConfirm: false,
				cancelButtonText: t('Cancel')
				confirmButtonText: t('OK'),
			});


	switch e.error
		when 'applicantRole'
			_swal_guide(e.reason, t('instanc_set_applicant_role_text'), 'admin/workflow/flow_roles', t('instance_role_set_is_complete'))
		when 'applicantSuperior'
			_swal_guide(e.reason, t('instanc_set_applicant_role_text'), 'admin/organizations', t('instance_set_is_complete'))
		when 'userField'
			_fieldEmpty('approver_user_field')
		when 'orgField'
			if e.error_code == 'ORG_NO_MEMBERS'

				orgField = InstanceManager.getFormField(step.approver_org_field);

				orgFieldValue = InstanceManager.getFormFieldValue(orgField.code);

				_swal_guide( t('next_step_users_not_found.org_no_members', {org_name: WorkflowManager.getOrganization(orgFieldValue)?.fullname}), t('instanc_set_applicant_role_text'), 'admin/organizations', t('instance_set_is_complete'))
			else
				_fieldEmpty('approver_org_field')
		when 'specifyOrg'

			_swal_guide(e.reason, t('instanc_set_applicant_role_text'), 'admin/organizations', t('instance_set_is_complete'))

		when 'userFieldRole'
			if e.error_code == 'ROLE_NO_MEMBERS'
				roles = WorkflowManager.remoteFlowRoles.find({_id: {$in: step.approver_roles}}, {fields: {name:1} });
				roles_name = _.pluck(roles, 'name').toString();
				text = TAPi18n.__('next_step_users_not_found.applicant_role', {step_name: step.name, role_name: roles_name});
				_swal_guide(text, t('instanc_set_applicant_role_text'), 'admin/workflow/flow_roles', t('instance_set_is_complete'))
			else
				_fieldEmpty('approver_user_field')
		when 'orgFieldRole'
			if e.error_code == 'ROLE_NO_MEMBERS'
				roles = WorkflowManager.remoteFlowRoles.find({_id: {$in: step.approver_roles}}, {fields: {name:1} });
				roles_name = _.pluck(roles, 'name').toString();
				text = TAPi18n.__('next_step_users_not_found.applicant_role', {step_name: step.name, role_name: roles_name});
				_swal_guide(text, t('instanc_set_applicant_role_text'), 'admin/workflow/flow_roles', t('instance_set_is_complete'))
			else
				_fieldEmpty('approver_org_field')
		else
			break