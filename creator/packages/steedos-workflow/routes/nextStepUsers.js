JsonRoutes.add("post", "/api/workflow/nextStepUsers", function(req, res, next) {
	var
		deal_type = req.query.deal_type,
		spaceId = req.query.spaceId,
		error = "";

	if (!deal_type || !spaceId) {
		JsonRoutes.sendResult(res, {
			code: 200,
			data: {
				'errors': '缺少参数'
			}
		});
	}

	var
		body = req.body,
		nextStepUsers = [];


	switch (deal_type) {
		case 'specifyUser':
			var specifyUserIds = body.specifyUserIds;

			nextStepUsers = WorkflowManager.getUsers(spaceId, specifyUserIds);
			break;
		case 'applicantRole':
			var
				applicantId = body.applicantId,
				approveRoleIds = body.approveRoleIds;
			var applicant = WorkflowManager.getUser(spaceId, applicantId);

			if (applicant)
				nextStepUsers = WorkflowManager.getRoleUsersByOrgsAndRoles(spaceId, applicant.organizations, approveRoleIds);
			break;
		case 'applicantSuperior':
			var applicantId = body.applicantId;
			var applicant = WorkflowManager.getUser(spaceId, applicantId);
			if (applicant.manager) {
				nextStepUsers = WorkflowManager.getUsers(spaceId, applicant.manager);
			}
			break;
		case 'applicant':
			var applicantId = body.applicantId;
			nextStepUsers = WorkflowManager.getUsers(spaceId, applicantId);
			break;
		case 'userField':
			var
				userField = body.userField,
				userFieldValue = body.userFieldValue;
			if (userField.is_multiselect) { //如果多选，以userFieldValue值为Array
				nextStepUsers = WorkflowManager.getUsers(spaceId, userFieldValue);
			} else {
				nextStepUsers.push(WorkflowManager.getUser(spaceId, userFieldValue));
			}
			break;
		case 'orgField':
			var
				orgs,
				orgChildrens,
				orgField = body.orgField,
				orgFieldValue = body.orgFieldValue;
			if (orgFieldValue) {
				if (orgField.is_multiselect) { //如果多选，以orgFieldValue值为Array
					orgs = WorkflowManager.getOrganizations(orgFieldValue);
					orgChildrens = WorkflowManager.getOrganizationsChildrens(spaceId, orgFieldValue);
				} else {
					orgs = [WorkflowManager.getOrganization(orgFieldValue)];
					orgChildrens = WorkflowManager.getOrganizationChildrens(spaceId, orgFieldValue);
				}
				nextStepUsers = WorkflowManager.getOrganizationsUsers(spaceId, orgChildrens);

				orgFieldUsers = WorkflowManager.getOrganizationsUsers(spaceId, orgs);

				nextStepUsers = nextStepUsers.concat(orgFieldUsers);

				if (!nextStepUsers || nextStepUsers.length < 1) {
					error = "ORG_NO_MEMBERS";
				}
			} else {
				error = "FIELD_VALUE_EMPTY";
			}

			break;
		case 'specifyOrg':
			var specifyOrgIds = body.specifyOrgIds;
			var specifyOrgs = WorkflowManager.getOrganizations(specifyOrgIds);
			var specifyOrgChildrens = WorkflowManager.getOrganizationsChildrens(spaceId, specifyOrgIds);

			nextStepUsers = WorkflowManager.getOrganizationsUsers(spaceId, specifyOrgs);
			nextStepUsers = nextStepUsers.concat(WorkflowManager.getOrganizationsUsers(spaceId, specifyOrgChildrens));
			break;
		case 'userFieldRole':
			var
				userField = body.userField,
				userFieldValue = body.userFieldValue,
				approverRoleIds = body.approverRoleIds;
			if (userFieldValue) {
				if (userField.is_multiselect) { //如果多选，以userFieldValue值为Array
					nextStepUsers = WorkflowManager.getRoleUsersByUsersAndRoles(spaceId, userFieldValue, approverRoleIds);
				} else {
					nextStepUsers = WorkflowManager.getRoleUsersByUsersAndRoles(spaceId, [userFieldValue], approverRoleIds);
				}

				if (!nextStepUsers || nextStepUsers.length < 1) {
					error = "ROLE_NO_MEMBERS";
				}
			} else {
				error = "FIELD_VALUE_EMPTY";
			}


			break;
		case 'orgFieldRole':
			var
				orgField = body.orgField,
				orgFieldValue = body.orgFieldValue,
				approverRoleIds = body.approverRoleIds;

			if (orgFieldValue) {
				if (orgField.is_multiselect) { //如果多选，以orgFieldValue值为Array
					nextStepUsers = WorkflowManager.getRoleUsersByOrgsAndRoles(spaceId, orgFieldValue, approverRoleIds);
				} else {
					nextStepUsers = WorkflowManager.getRoleUsersByOrgsAndRoles(spaceId, [orgFieldValue], approverRoleIds);
				}

				if (!nextStepUsers || nextStepUsers.length < 1) {
					error = "ROLE_NO_MEMBERS";
				}
			} else {
				error = "FIELD_VALUE_EMPTY";
			}
			break;
		default:
			break;
	}

	var result = [];

	nextStepUsers.forEach(function(su) {
		var o = {
			id: su.id,
			name: su.name
		};
		result.push(o);
	})

	JsonRoutes.sendResult(res, {
		code: 200,
		data: {
			'nextStepUsers': WorkflowManager.uniqUsers(result),
			'error': error
		}
	});
})