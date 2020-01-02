WorkflowManager = {}

WorkflowManager.getPositionsFilterByUsers = function (spaceId, orgId, roleId) {
	if (!spaceId || !orgId || !roleId)
		return []

	return db.flow_positions.find({
		space: spaceId,
		role: roleId,
		org: orgId
	}, {
		fields: {
			users: 1
		}
	}).fetch();
}

WorkflowManager.uniqUsers = function (users) {
	if (_.isEmpty(users))
		return []

	var users_str = [],
		users_obj = [];
	_.each(users, function (u) {
		users_str.push(JSON.stringify(u))
	})

	users_str = _.uniq(users_str);

	_.each(users_str, function (us) {
		users_obj.push(JSON.parse(us))
	})

	return users_obj
}

/*
 返回指定部门下的角色成员,如果指定部门没有找到对应的角色，则会继续找部门的上级部门直到找到为止。
 return [{spaceUser}]
 */
WorkflowManager.getRoleUsersbyOrgAndRole = function (spaceId, orgId, roleId) {
	var roleUsers = new Array();

	var orgPositions = WorkflowManager.getPositionsFilterByUsers(spaceId, orgId, roleId);

	orgPositions.forEach(function (orgPosition) {
		var roleUserIds = orgPosition.users;
		roleUsers = roleUsers.concat(WorkflowManager.getUsers(spaceId, roleUserIds, true));
	});

	if (orgPositions.length == 0) {
		var organization = WorkflowManager.getOrganization(orgId);
		if (organization && organization.parent != '')
			roleUsers = roleUsers.concat(WorkflowManager.getRoleUsersbyOrgAndRole(spaceId, organization.parent, roleId));
	}

	return roleUsers;
};

WorkflowManager.getRoleUsersByOrgAndRoles = function (spaceId, orgId, roleIds) {

	var roleUsers = new Array();

	roleIds.forEach(function (roleId) {
		roleUsers = roleUsers.concat(WorkflowManager.getRoleUsersbyOrgAndRole(spaceId, orgId, roleId));
	});

	return roleUsers;

};

WorkflowManager.getRoleUsersByOrgsAndRoles = function (spaceId, orgIds, roleIds) {
	var roleUsers = new Array();

	if (!orgIds || !roleIds)
		return roleUsers;

	orgIds.forEach(function (orgId) {
		roleUsers = roleUsers.concat(WorkflowManager.getRoleUsersByOrgAndRoles(spaceId, orgId, roleIds));
	});

	return roleUsers;
};

/*
 返回用户所在部门下的角色成员.
 return [{spaceUser}]
 */
WorkflowManager.getRoleUsersByUsersAndRoles = function (spaceId, userIds, roleIds) {

	var roleUsers = new Array();

	if (!userIds || !roleIds)
		return roleUsers;

	var users = WorkflowManager.getUsers(spaceId, userIds, true);

	users.forEach(function (user) {
		roleUsers = roleUsers.concat(WorkflowManager.getRoleUsersByOrgsAndRoles(spaceId, user.organizations, roleIds));
	});

	return roleUsers;
};

WorkflowManager.getSpaceRoles = function (spaceId) {
	if (!spaceId) {
		return;
	}

	return db.flow_roles.find({
		space: spaceId
	}).fetch();
};

WorkflowManager.getRole = function (spaceId, roleId) {

	if (!roleId || !spaceId) {
		return;
	}

	return db.flow_roles.findOne({
		_id: roleId,
		space: spaceId
	});
};

WorkflowManager.getSpacePositions = function (spaceId) {
	return db.flow_positions.find({
		space: spaceId
	}).fetch();
};

//获取用户岗位
WorkflowManager.getUserRoles = function (spaceId, orgId, userId) {

	var userRoles = new Array();

	// var spacePositions = WorkflowManager.getSpacePositions(spaceId);

	//orgRoles = spacePositions.filterProperty("org", orgId); ？？？
	// var userPositions = spacePositions.filterProperty("users", userId);

	var userPositions = db.flow_positions.find({
		space: spaceId,
		users: userId
	}, {
		fields: {
			role: 1
		}
	});

	userPositions.forEach(function (userPosition) {
		userRoles.push(WorkflowManager.getRole(spaceId, userPosition.role));
	});

	return userRoles;
};

WorkflowManager.getOrganizationsUsers = function (spaceId, orgs) {

	var orgUsers = new Array();

	orgs.forEach(function (org) {
		orgUsers = orgUsers.concat(WorkflowManager.getUsers(spaceId, org.users, true));
	});

	return orgUsers;
}

//获取space下的所有部门
WorkflowManager.getSpaceOrganizations = function (spaceId) {
	return db.organizations.find({
		space: spaceId
	}).fetch();
};

WorkflowManager.getOrganizationChildrens = function (spaceId, orgId) {
	return db.organizations.find({
		space: spaceId,
		parents: orgId
	}).fetch();
};

WorkflowManager.getOrganizationsChildrens = function (spaceId, orgIds) {
	var chidrenOrgs = new Array();
	orgIds.forEach(function (orgId) {
		chidrenOrgs = chidrenOrgs.concat(WorkflowManager.getOrganizationChildrens(spaceId, orgId));
	});

	return chidrenOrgs;
};

WorkflowManager.getOrganization = function (orgId) {
	if (!orgId) {
		return;
	}

	return db.organizations.findOne(orgId, {fields: {created: 0, created_by: 0, modified: 0, modified_by: 0}});
};

WorkflowManager.getOrganizations = function (orgIds) {
	if (!orgIds) {
		return [];
	}

	if ("string" == typeof (orgIds)) {
		return [WorkflowManager.getOrganization(orgIds)]
	}

	return db.organizations.find({
		_id: {
			$in: orgIds
		}
	}, {fields: {created: 0, created_by: 0, modified: 0, modified_by: 0}}).fetch();
};

WorkflowManager.getCompany = function (companyId) {
	if (!companyId) {
		return {};
	}
	return Creator.getCollection("company").findOne(companyId, {fields: {created: 0, created_by: 0, modified: 0, modified_by: 0}}) || {};
}

WorkflowManager.getCompanys = function (companyIds) {
	if (!companyIds) {
		return [];
	}

	if ("string" == typeof (companyIds)) {
		return [WorkflowManager.getCompany(companyIds)]
	}
	return Creator.getCollection("company").find({
		_id: {
			$in: companyIds
		}
	}, {fields: {created: 0, created_by: 0, modified: 0, modified_by: 0}}).fetch();
};


WorkflowManager.getUser = function (spaceId, userId, notNeedDetails) {
	if (!userId || !spaceId) {
		return;
	}

	if (typeof userId != "string") {
		return WorkflowManager.getUsers(spaceId, userId);
	}

	var spaceUser = db.space_users.findOne({
		space: spaceId,
		user: userId
	}, {fields: {created: 0, created_by: 0, modified: 0, modified_by: 0}});

	if (!spaceUser) {
		return
	}

	if (notNeedDetails == true) {
		spaceUser.id = spaceUser.user;
	} else {
		spaceUser.id = spaceUser.user;
		spaceUser.organization = WorkflowManager.getOrganization(spaceUser.organization);
		if (!spaceUser.organization) {
			return;
		}

		spaceUser.company = WorkflowManager.getCompany(spaceUser.company_id);
		spaceUser.companys = WorkflowManager.getCompanys(spaceUser.company_ids);

		spaceUser.roles = WorkflowManager.getUserRoles(spaceId, spaceUser.organization.id, spaceUser.id);
	}

	return spaceUser;
};

WorkflowManager.getUsers = function (spaceId, userIds, notNeedDetails) {

	if ("string" == typeof (userIds)) {
		return [WorkflowManager.getUser(spaceId, userIds, notNeedDetails)]
	}

	var users = new Array();
	if (userIds && spaceId) {
		var spaceUsers = db.space_users.find({
			space: spaceId,
			user: {
				$in: userIds
			}
		}, {fields: {created: 0, created_by: 0, modified: 0, modified_by: 0}});

		if (notNeedDetails == true) {
			spaceUsers.forEach(function (spaceUser) {
				spaceUser.id = spaceUser.user;
				users.push(spaceUser);
			})
		} else {
			spaceUsers.forEach(function (spaceUser) {
				spaceUser.id = spaceUser.user;

				spaceUser.organization = WorkflowManager.getOrganization(spaceUser.organization);

				spaceUser.organizations = WorkflowManager.getOrganizations(spaceUser.organizations);

				spaceUser.company = WorkflowManager.getCompany(spaceUser.company_id);
				spaceUser.companys = WorkflowManager.getCompanys(spaceUser.company_ids);

				if (spaceUser.organization) {
					spaceUser.roles = WorkflowManager.getUserRoles(spaceId, spaceUser.organization.id, spaceUser.id);
					users.push(spaceUser);
				}
			})
		}

	}

	return users;
};

WorkflowManager.getHrRolesUsers = function(spaceId, hrRoleIds){
	var hrRolesUsers = [];

	if(!_.isArray(hrRoleIds)){
		return [];
	}
	var hrRoles = db.roles.find({space: spaceId, _id: {$in: hrRoleIds}}).fetch();
	_.each(hrRoles, function(hrRole){
		hrRolesUsers = hrRolesUsers.concat(hrRole.users || [])
	});

	var spaceUsers = db.space_users.find({
		space: spaceId,
		user: {$in: hrRolesUsers}
	}, {fields: {created: 0, created_by: 0, modified: 0, modified_by: 0}}).fetch();

	_.each(spaceUsers, function(spaceUser){
		spaceUser.id = spaceUser.user
	});
	return spaceUsers
}

WorkflowManager.getFormulaUsers = function (spaceId, userIds) {
	var spaceUsers = [];
	var users = WorkflowManager.getUsers(spaceId, userIds);
	users.forEach(function (user) {
		var userObject = {};
		userObject['id'] = user.id;
		userObject['name'] = user.name;
		userObject['organization'] = {
			'id': user.organization._id,
			'name': user.organization.name,
			'fullname': user.organization.fullname
		};

		userObject["organizations"] = {
			'id': user.organizations.getProperty("_id"),
			'name': user.organizations.getProperty("name"),
			'fullname': user.organizations.getProperty("fullname")
		}

		userObject['company'] = {
			'id': user.company._id,
			'name': user.company.name,
			'code': user.company.code,
		}

		userObject['companys'] = {
			'id': user.companys.getProperty("_id"),
			'name': user.companys.getProperty("name"),
			'code': user.companys.getProperty("code"),
		}

		userObject.hr = {}

		if (user.hr) {
			userObject.hr = user.hr;
		}

		userObject.sort_no = user.sort_no

		userObject.mobile = user.mobile

		userObject.work_phone = user.work_phone

		userObject.position = user.position

		userObject["roles"] = user.roles ? user.roles.getProperty('name') : [];
		spaceUsers.push(userObject);
	})

	return spaceUsers;
}

WorkflowManager.getFormulaUserObjects = function (spaceId, userIds) {
	if (!userIds)
		return {
			organization: {},
			hr: {}
		};
	return WorkflowManager.getFormulaUserObject(spaceId, userIds);
}

WorkflowManager.getFormulaUserObject = function (spaceId, userId) {

	if (!userId)
		return {
			organization: {},
			hr: {}
		};

	if (userId instanceof Array) {
		return WorkflowManager.getFormulaUsers(spaceId, userId);
	} else {
		return WorkflowManager.getFormulaUsers(spaceId, [userId])[0];
	}
};


WorkflowManager.getFormulaOrgObjects = function (orgIds) {
	if (!orgIds)
		return;
	return WorkflowManager.getFormulaOrgObject(orgIds);
}

WorkflowManager.getFormulaOrgObject = function (orgId) {

	if (orgId instanceof Array) {
		var orgArray = new Array();
		var orgs = WorkflowManager.getOrganizations(orgId);
		orgs.forEach(function (org) {
			var orgObject = {};
			orgObject['id'] = org._id;
			orgObject['name'] = org.name;
			orgObject['fullname'] = org.fullname;
			orgArray.push(orgObject);
		});

		return orgArray;
	} else {
		var orgObject = {};
		var org = WorkflowManager.getOrganization(orgId);
		if (!org)
			return null;

		orgObject['id'] = orgId;
		orgObject['name'] = org.name;
		orgObject['fullname'] = org.fullname;

		return orgObject;
	}

}

WorkflowManager.getInstanceFormVersion = function () {

	var instance = Template.instance().view.template.steedosData.instance

	var form, form_fields, form_version;
	form = db.forms.findOne(instance.form);
	form_version = {};
	form_fields = [];
	if (form.current._id === instance.form_version) {
		form_version = form.current;
	} else {
		form_version = _.where(form.historys, {
			_id: instance.form_version
		})[0];
	}
	form_version.fields.forEach(function (field) {
		if (field.type === 'section') {
			form_fields.push(field);
			if (field.fields) {
				return field.fields.forEach(function (f) {
					return form_fields.push(f);
				});
			}
		} else if (field.type === 'table') {
			field['sfields'] = field['fields'];
			delete field['fields'];
			return form_fields.push(field);
		} else {
			return form_fields.push(field);
		}
	});
	form_version.fields = form_fields;
	return form_version;
};

WorkflowManager.getFormVersion = function (id, versionId) {
	var form = db.forms.findOne({
		_id: id
	});

	var form_version = form.current

	if (form_version._id != versionId) {
		form_version = form.historys.findPropertyByPK("_id", versionId)
	}

	var form_fields = [];

	form_version.fields.forEach(function (field) {
		if (field.type == 'section') {
			form_fields.push(field);
			if (field.fields) {
				field.fields.forEach(function (f) {
					form_fields.push(f);
				});
			}
		} else {
			form_fields.push(field);
		}
	});

	form_version.fields = form_fields;

	return form_version;
}

WorkflowManager.getInstanceFlowVersion = function (instance) {
	if (!instance) {
		instance = Template.instance().view.template.steedosData.instance;
	}

	var flow, flow_version;
	flow = db.flows.findOne(instance.flow);
	flow_version = {};
	if (flow.current._id === instance.flow_version) {
		flow_version = flow.current;
	} else {
		flow_version = _.where(flow.historys, {
			_id: instance.flow_version
		})[0];
	}
	return flow_version;
};

WorkflowManager.getInstanceStep = function (stepId) {
	flow = WorkflowManager.getInstanceFlowVersion();

	if (!flow)
		return null;

	var g_step;

	flow.steps.forEach(
		function (step) {
			if (step._id == stepId) {
				g_step = step;
				g_step.id = step._id;
				return;
			}
		}
	);

	return g_step;
};


WorkflowManager.canAdmin = function (fl, curSpaceUser, organizations) {
	var perms = fl.perms;
	var hasAdminRight = false;
	if (perms) {
		if (perms.users_can_admin && perms.users_can_admin.includes(curSpaceUser.user)) {
			hasAdminRight = true;
		} else if (perms.orgs_can_admin && perms.orgs_can_admin.length > 0) {
			if (curSpaceUser && curSpaceUser.organizations && _.intersection(curSpaceUser.organizations, perms.orgs_can_admin).length > 0) {
				hasAdminRight = true;
			} else {
				if (organizations) {

					hasAdminRight = _.some(organizations, function (org) {
						return org.parents && _.intersection(org.parents, perms.orgs_can_admin).length > 0;
					});
				}
			}
		}
	}
	return hasAdminRight;
};

WorkflowManager.canMonitor = function (fl, curSpaceUser, organizations) {
	var perms = fl.perms;
	var hasMonitorRight = false;
	if (perms) {
		if (perms.users_can_monitor && perms.users_can_monitor.includes(curSpaceUser.user)) {
			hasMonitorRight = true;
		} else if (perms.orgs_can_monitor && perms.orgs_can_monitor.length > 0) {
			if (curSpaceUser && curSpaceUser.organizations && _.intersection(curSpaceUser.organizations, perms.orgs_can_monitor).length > 0) {
				hasMonitorRight = true;
			} else {
				if (organizations) {

					hasMonitorRight = _.some(organizations, function (org) {
						return org.parents && _.intersection(org.parents, perms.orgs_can_monitor).length > 0;
					});
				}
			}
		}
	}
	return hasMonitorRight;
};

//校验user是否对instance有查看权限：
// 1 工作区管理员则返回true
// 2 用户在submitter、applicant、outbox_users、inbox_users、cc_users、created_by、modified_by 中：return true;
// 3 用户是流程管理员，监控员：return true;
// 4 否则：return false;
WorkflowManager.hasInstancePermissions = function (user, instance) {

	if (user && instance) {
		var space = db.spaces.findOne({
			_id: instance.space
		}, {
			fields: {
				admins: 1
			}
		});
		if (space && space.admins && space.admins.includes(user._id)) {
			return true;
		}
	}

	var approvedUsers = _.union(instance.outbox_users, instance.inbox_users, instance.cc_users, [instance.submitter], [instance.applicant], [instance.created_by], [instance.modified_by]);

	if (approvedUsers.includes(user._id)) {
		return true;
	}

	//被那些instance关联
	var originalInstances = db.instances.find({
		related_instances: {
			$all: [instance._id]
		}
	}, {
		fields: {
			outbox_users: 1,
			inbox_users: 1,
			cc_users: 1,
			submitter: 1,
			applicant: 1
		}
	})
	console.log("originalInstances size is " + originalInstances.count());
	if (originalInstances.count() > 0) {
		var hasPermission = false;
		_.some(originalInstances.fetch(), function (ins) {
			console.log(ins)
			havePermissionUsers = _.union(ins.outbox_users, ins.inbox_users, ins.cc_users, [ins.submitter], [ins.applicant]);
			console.log(havePermissionUsers)
			if (havePermissionUsers.includes(user._id)) {
				hasPermission = true;
				return true;
			}
		})
		if (hasPermission) {
			return true;
		}
	}

	spaceUser = db.space_users.findOne({
		space: instance.space,
		user: user._id
	})

	if (spaceUser) {
		organizations = db.organizations.find({
			_id: {
				$in: spaceUser.organizations
			}
		}).fetch();

		flow = db.flows.findOne({
			_id: instance.flow
		});

		if (flow) {
			return WorkflowManager.canMonitor(flow, spaceUser, organizations) || WorkflowManager.canAdmin(flow, spaceUser, organizations)
		}
		return false;
	}
	return false;

}

WorkflowManager.getNameForUser = function (userId) {
	check(userId, String);
	return db.users.findOne({
		_id: userId
	}, {
		fields: {
			name: 1
		}
	});
}

// 工作区管理员和流程管理员拥有流程的管理权限
WorkflowManager.hasFlowAdminPermission = function (flow_id, space_id, user_id) {
	var space = db.spaces.findOne({
		_id: space_id
	}, {
		fields: {
			admins: 1
		}
	});

	if (!space)
		return false;

	if (space.admins && space.admins.includes(user_id))
		return true;

	var hasPermission = false;

	var space_user = db.space_users.findOne({
		space: space_id,
		user: user_id
	}, {
		fields: {
			organizations: 1,
			user: 1
		}
	})
	if (space_user) {
		var organizations = db.organizations.find({
			_id: {
				$in: space_user.organizations
			}
		}, {
			fields: {
				parents: 1
			}
		}).fetch()

		var fl = db.flows.findOne({
			_id: flow_id
		}, {
			fields: {
				perms: 1
			}
		})

		if (fl && organizations) {
			hasPermission = WorkflowManager.canAdmin(fl, space_user, organizations);
		}
	}

	return hasPermission;

}