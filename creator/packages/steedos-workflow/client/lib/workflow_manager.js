WorkflowManager = {
	instanceModified: new ReactiveVar(false)
};

if (Meteor.isClient) {
	WorkflowManager.remoteSpaceUsers = new AjaxCollection('space_users');
	WorkflowManager.remoteOrganizations = new AjaxCollection('organizations');
	WorkflowManager.remoteFlowRoles = new AjaxCollection('flow_roles');
}
/*-------------------data source------------------*/

WorkflowManager.getUrlForServiceName = function(serverName) {
	var serverUrls = {
		"s3": "https://s3ws.steedos.com",
		"workflow": "http://192.168.0.23"
	};
	return serverUrls[serverName];
};

WorkflowManager.getForm = function(formId) {
	return db.forms.findOne(formId);
}

WorkflowManager.getFlow = function(flowId) {
	return db.flows.findOne(flowId);
}

//获取space下的所有部门
WorkflowManager.getSpaceOrganizations = function(spaceId) {
	var orgs = new Array();
	var spaceOrgs = db.organizations.find();

	spaceOrgs.forEach(function(spaceOrg) {
		spaceOrg.id = spaceOrg._id
		orgs.push(spaceOrg);
	})

	return orgs;
};


//获取space下的所有用户
WorkflowManager.getSpaceUsers = function(spaceId) {

	var users = new Array();

	var spaceUsers = db.space_users.find({
		user_accepted: true
	}, {
		sort: {
			name: 1
		}
	});

	spaceUsers.forEach(function(spaceUser) {
		spaceUser.id = spaceUser.user;
		spaceUser.organization = WorkflowManager.getOrganization(spaceUser.organization);
		if (spaceUser.organization) {
			spaceUser.roles = WorkflowManager.getUserRoles(spaceId, spaceUser.organization.id, spaceUser.id);
			users.push(spaceUser);
		}
	})

	return users;
};

WorkflowManager.getSpacePositions = function(spaceId) {
	var positions = new Array();

	var spacePositions = db.flow_positions.find();

	spacePositions.forEach(function(spacePosition) {
		positions.push(spacePosition);
	});

	return positions;
};

WorkflowManager.getSpaceRoles = function(spaceId) {
	var roles = new Array();

	var spaceRoles = db.flow_roles.find();

	spaceRoles.forEach(function(spaceRole) {
		spaceRole.id = spaceRole._id;
		roles.push(spaceRole);
	});

	return roles;
};

WorkflowManager.getInstance = function() {
	return db.instances.findOne({
		_id: Session.get("instanceId")
	})
};


WorkflowManager.getInstanceFormVersion = function() {
	var form_fields = [],
		rev = null,
		instance = WorkflowManager.getInstance();

	if (instance) {
		var rev = db.form_versions.findOne({
			_id: instance.form_version,
			form: instance.form
		})

		if (!rev) {
			return;
		}

		field_permission = WorkflowManager.getInstanceFieldPermission();
		rev.fields.forEach(
			function(field) {
				field['permission'] = field_permission[field.code] == 'editable' ? 'editable' : 'readonly';
				if (field.type == 'table') {
					field['sfields'] = field['fields']
					if (field['sfields']) {
						field['sfields'].forEach(function(sf) {
							sf["permission"] = field_permission[sf.code] == 'editable' ? 'editable' : 'readonly';
							if (sf["permission"] == 'editable') {
								field['permission'] = 'editable';
							}
						});
					} else {
						console.error("子表：" + field.code + " 没有字段");
					}
					// 因为这个程序会傻傻的执行很多遍，所以不能删除
					delete field['fields']
				}

				if (field.type == 'section') {
					form_fields.push(field);
					if (field.fields) {
						field.fields.forEach(function(f) {
							f['permission'] = field_permission[f.code] == 'editable' ? 'editable' : 'readonly';
							form_fields.push(f);
						});
					}
				} else {
					form_fields.push(field);
				}
			}
		);

		rev.fields = form_fields;
	}

	return rev;
};

WorkflowManager.getInstanceFlowVersion = function() {
	var instance = WorkflowManager.getInstance();
	if (instance) {
		return db.flow_versions.findOne({
			_id: instance.flow_version,
			flow: instance.flow
		})
	}
};

WorkflowManager.getInstanceFields = function() {
	var instanceForm = WorkflowManager.getInstanceFormVersion();

	return instanceForm.fields;
}

WorkflowManager.getInstanceStep = function(stepId) {
	var flow = WorkflowManager.getInstanceFlowVersion();

	if (!flow)
		return null;

	var g_step;

	flow.steps.forEach(
		function(step) {
			if (step._id == stepId) {
				g_step = step;
				g_step.id = step._id;
				return;
			}
		}
	);

	return g_step;
};

WorkflowManager.getInstanceSteps = function() {
	var flow = WorkflowManager.getInstanceFlowVersion();

	if (!flow)
		return null;

	var steps = [];

	flow.steps.forEach(
		function(step) {
			step.id = step._id;
			steps.push(step);
		}
	);

	return steps;
};

WorkflowManager.getInstanceFieldPermission = function() {
	var instance = WorkflowManager.getInstance();

	if (!instance) {
		return {};
	}

	if (InstanceManager.isCC(instance)) {
		return {};
	}

	var current_stepId = "";
	if (instance.traces) {
		instance.traces.forEach(
			function(trace) {
				if (trace.is_finished == false) {
					current_stepId = trace.step;
					return;
				}
			}
		);
	}

	var step = WorkflowManager.getInstanceStep(current_stepId);
	if (!step) {
		return {}
	}
	return step.permissions || {};
};


WorkflowManager.getOrganizationChildrens = function(spaceId, orgId) {
	var spaceOrganizations = WorkflowManager.getSpaceOrganizations(spaceId);
	var chidrenOrgs = spaceOrganizations.filterProperty("parents", orgId);

	return chidrenOrgs;
};

WorkflowManager.getOrganizationsChildrens = function(spaceId, orgIds) {
	var chidrenOrgs = new Array();
	orgIds.forEach(function(orgId) {
		chidrenOrgs = chidrenOrgs.concat(WorkflowManager.getOrganizationChildrens(spaceId, orgId));
	});

	return chidrenOrgs;
};

WorkflowManager.getOrganizationsUsers = function(spaceId, orgs) {

	var spaceUsers = WorkflowManager.getSpaceUsers(spaceId);

	var orgUsers = new Array();

	orgs.forEach(function(org) {
		orgUsers = orgUsers.concat(WorkflowManager.getUsers(org.users));
	});

	return orgUsers;
}

WorkflowManager.getOrganization = function(orgId) {

	if (!orgId) {
		return;
	}

	var spaceOrg = WorkflowManager.remoteOrganizations.findOne(orgId);

	if (!spaceOrg) {
		return;
	}

	spaceOrg.id = spaceOrg._id;

	return spaceOrg;
};

WorkflowManager.getOrganizations = function(orgIds) {
	if (!orgIds) {
		return [];
	}

	if ("string" == typeof(orgIds)) {
		return [WorkflowManager.getOrganization(orgIds)]
	}

	return WorkflowManager.remoteOrganizations.find({
		_id: {
			$in: orgIds
		}
	});
};

WorkflowManager.getRoles = function(roleIds) {
	if (!roleIds || !(roleIds instanceof Array)) {
		return [];
	}

	var roles = new Array();

	roleIds.forEach(function(roleId) {
		roles.push(WorkflowManager.getRole(roleId));
	});

	return roles;
}

WorkflowManager.getRole = function(roleId) {

	if (!roleId) {
		return;
	}

	var spaceRoles = WorkflowManager.getSpaceRoles(),
		role = {};

	spaceRoles.forEach(function(spaceRole) {
		if (spaceRole.id == roleId) {
			role = spaceRole;
			return;
		}
	});

	return role;
};

WorkflowManager.getUser = function(userId, spaceId) {
	if (!userId) {
		return;
	}

	if (typeof userId != "string") {

		return WorkflowManager.getUsers(userId, spaceId);

	}

	var spaceUsers = UUflow_api.getSpaceUsers(spaceId || Session.get('spaceId'), userId);
	if (!spaceUsers) {
		return
	};

	var spaceUser = spaceUsers[0];
	if (!spaceUser) {
		return
	};

	return spaceUser;
};

WorkflowManager.getUsers = function(userIds, spaceId) {

	if ("string" == typeof(userIds)) {
		return [WorkflowManager.getUser(userIds, spaceId)]
	}

	var users = new Array();
	if (userIds) {
		users = UUflow_api.getSpaceUsers(spaceId || Session.get('spaceId'), userIds);
	}

	return users;
};

//获取用户岗位
WorkflowManager.getUserRoles = function(spaceId, orgId, userId) {

	var userRoles = new Array();

	var spacePositions = WorkflowManager.getSpacePositions(spaceId);

	//orgRoles = spacePositions.filterProperty("org", orgId);
	var userPositions = spacePositions.filterProperty("users", userId);

	userPositions.forEach(function(userPosition) {
		userRoles.push(WorkflowManager.getRole(userPosition.role));
	});

	return userRoles;
};


/*
 返回指定部门下的角色成员,如果指定部门没有找到对应的角色，则会继续找部门的上级部门直到找到为止。
 return [{spaceUser}]
 */
WorkflowManager.getRoleUsersbyOrgAndRole = function(spaceId, orgId, roleId) {

	var roleUsers = new Array();

	var spaceRoles = WorkflowManager.getSpaceRoles(spaceId);

	var spacePositions = WorkflowManager.getSpacePositions(spaceId);

	var rolePositions = spacePositions.filterProperty("role", roleId);

	var orgPositions = rolePositions.filterProperty("org", orgId);

	orgPositions.forEach(function(orgPosition) {
		var roleUserIds = orgPosition.users;
		roleUsers = roleUsers.concat(WorkflowManager.getUsers(roleUserIds));
	});

	if (orgPositions.length == 0) {
		var organization = WorkflowManager.getOrganization(orgId);
		if (organization && organization.parent != '')
			roleUsers = roleUsers.concat(WorkflowManager.getRoleUsersbyOrgAndRole(spaceId, organization.parent, roleId));
	}

	return roleUsers;
};

WorkflowManager.getRoleUsersByOrgAndRoles = function(spaceId, orgId, roleIds) {

	var roleUsers = new Array();

	roleIds.forEach(function(roleId) {
		roleUsers = roleUsers.concat(WorkflowManager.getRoleUsersbyOrgAndRole(spaceId, orgId, roleId));
	});

	return roleUsers;

};

WorkflowManager.getRoleUsersByOrgsAndRoles = function(spaceId, orgIds, roleIds) {
	var roleUsers = new Array();

	if (!orgIds || !roleIds)
		return roleUsers;

	orgIds.forEach(function(orgId) {
		roleUsers = roleUsers.concat(WorkflowManager.getRoleUsersByOrgAndRoles(spaceId, orgId, roleIds));
	});

	return roleUsers;
};

/*
 返回用户所在部门下的角色成员.
 return [{spaceUser}]
 */
WorkflowManager.getRoleUsersByUsersAndRoles = function(spaceId, userIds, roleIds) {

	var roleUsers = new Array();

	if (!userIds || !roleIds)
		return roleUsers;

	var users = WorkflowManager.getUsers(userIds);

	users.forEach(function(user) {
		roleUsers = roleUsers.concat(WorkflowManager.getRoleUsersByOrgAndRoles(spaceId, user.organization.id, roleIds));
	});

	return roleUsers;
};

WorkflowManager.getFormulaUserObjects = function(userIds) {
	if (!userIds)
		return;
	return CFDataManager.getFormulaSpaceUser(userIds);
}

//return {name:'',organization:{fullname:'',name:''},roles:[]}
WorkflowManager.getFormulaUserObject = function(userId) {
	if (userId instanceof Array) {
		return SteedosDataManager.getFormulaUserObjects(Session.get('spaceId'), userId);
	} else {
		return SteedosDataManager.getFormulaUserObjects(Session.get('spaceId'), [userId])[0];
	}
};


WorkflowManager.getFormulaOrgObjects = function(orgIds) {
	if (!orgIds)
		return;
	return WorkflowManager.getFormulaOrgObject(orgIds);
}

WorkflowManager.getFormulaOrgObject = function(orgId) {

	if (orgId instanceof Array) {
		var orgArray = new Array();
		var orgs = WorkflowManager.getOrganizations(orgId);
		orgs.forEach(function(org) {
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

WorkflowManager.getSpaceCategories = function(spaceId, _ids) {

	var query = {
		space: spaceId
	};

	if(!_.isEmpty(_ids)){
		query._id = {$in: _ids}
	}

	return db.categories.find(query, {
		sort: {
			sort_no: -1
		}
	}).fetch();
};


WorkflowManager.getCategoriesForms = function(categorieId) {

	return db.forms.find({
		category: categorieId,
		state: "enabled"
	}).fetch();
};

WorkflowManager.getUnCategoriesForms = function() {
	if(!Session.get("workflow_categories")){
		return forms = db.forms.find({
			category: {
				$in: [null, ""]
			},
			state: "enabled"
		}).fetch();
	}else{
		return []
	}
};

WorkflowManager.getFormFlows = function(formId) {

	return db.flows.find({
		form: formId,
		state: "enabled"
	}).fetch();
};

WorkflowManager.getCompanyFlows = function (companyId, space_id) {
	var spaceId = space_id ? space_id : Session.get('spaceId');

	return db.flows.find({
		space: spaceId,
		company_id: companyId,
		state: "enabled"
	}).fetch();
};

WorkflowManager.getSpaceFlows = function(spaceId) {

	return db.flows.find({
		space: spaceId
	}).fetch();
};

WorkflowManager.canAdd = function(fl, curSpaceUser, organizations) {
	var perms = fl.perms;
	var hasAddRight = false;
	if (perms) {
		if (perms.users_can_add && perms.users_can_add.includes(Meteor.userId())) {
			hasAddRight = true;
		} else if (perms.orgs_can_add && perms.orgs_can_add.length > 0) {
			if (curSpaceUser && curSpaceUser.organizations && _.intersection(curSpaceUser.organizations, perms.orgs_can_add).length > 0) {
				hasAddRight = true;
			} else {
				if (organizations) {
					hasAddRight = _.some(organizations, function(org) {
						return org.parents && _.intersection(org.parents, perms.orgs_can_add).length > 0;
					});
				}
			}
		}
	}
	return hasAddRight;
};


WorkflowManager.canAdmin = function(fl, curSpaceUser, organizations) {
	var perms = fl.perms;
	var hasAdminRight = false;
	if (perms) {
		if (perms.users_can_admin && perms.users_can_admin.includes(Meteor.userId())) {
			hasAdminRight = true;
		} else if (perms.orgs_can_admin && perms.orgs_can_admin.length > 0) {
			if (curSpaceUser && curSpaceUser.organizations && _.intersection(curSpaceUser.organizations, perms.orgs_can_admin).length > 0) {
				hasAdminRight = true;
			} else {
				if (organizations) {

					hasAdminRight = _.some(organizations, function(org) {
						return org.parents && _.intersection(org.parents, perms.orgs_can_admin).length > 0;
					});
				}
			}
		}
	}
	return hasAdminRight;
};

WorkflowManager.canMonitor = function(fl, curSpaceUser, organizations) {
	var perms = fl.perms;
	var hasMonitorRight = false;
	if (perms) {
		if (perms.users_can_monitor && perms.users_can_monitor.includes(Meteor.userId())) {
			hasMonitorRight = true;
		} else if (perms.orgs_can_monitor && perms.orgs_can_monitor.length > 0) {
			if (curSpaceUser && curSpaceUser.organizations && _.intersection(curSpaceUser.organizations, perms.orgs_can_monitor).length > 0) {
				hasMonitorRight = true;
			} else {
				if (organizations) {

					hasMonitorRight = _.some(organizations, function(org) {
						return org.parents && _.intersection(org.parents, perms.orgs_can_monitor).length > 0;
					});
				}
			}
		}
	}
	return hasMonitorRight;
};


WorkflowManager.getMyAdminOrMonitorFlows = function() {
	var flows, flow_ids = [],
		curSpaceUser, organization;
	curSpaceUser = db.space_users.findOne({
		space: Session.get('spaceId'),
		'user': Meteor.userId()
	});
	if (curSpaceUser) {
		organizations = db.organizations.find({
			_id: {
				$in: curSpaceUser.organizations
			}
		}).fetch();
		flows = db.flows.find();
		flows.forEach(function(fl) {
			if (WorkflowManager.canMonitor(fl, curSpaceUser, organizations) || WorkflowManager.canAdmin(fl, curSpaceUser, organizations)) {
				flow_ids.push(fl._id);
			}
		})
	}
	return flow_ids;
};

WorkflowManager.getMyCanAddFlows = function() {
	var flows, flow_ids = [],
		curSpaceUser, organization;
	curSpaceUser = db.space_users.findOne({
		space: Session.get('spaceId'),
		'user': Meteor.userId()
	});
	organizations = db.organizations.find({
		_id: {
			$in: curSpaceUser.organizations
		}
	}).fetch();
	flows = db.flows.find();
	flows.forEach(function(fl) {
		if (WorkflowManager.canAdd(fl, curSpaceUser, organizations)) {
			flow_ids.push(fl._id);
		}
	})
	return flow_ids;
};

WorkflowManager.getCompanyFlowListData = function (company_id, show_type, space_id) {
	if(!company_id){
		console.error("WorkflowManager.getCompanyFlowListData 未传入company_id");
		return [];
	}
	var spaceId = space_id ? space_id : Session.get('spaceId');

	var curUserId = Meteor.userId();
	var curSpaceUser = db.space_users.findOne({
		space: spaceId,
		'user': curUserId
	});
	var organizations = db.organizations.find({
		_id: {
			$in: curSpaceUser.organizations
		}
	}).fetch();

	var re = {};
	var distribute_optional_flows = [];
	if (show_type == "distribute") {
		// 如果设置了当前步骤可以分发的流程范围则使用此范围
		var current_step = InstanceManager.getDistributeStep();
		if (current_step && current_step.allowDistribute == true) {
			distribute_optional_flows = current_step.distribute_optional_flows || [];
		}
	}

	if (distribute_optional_flows.length > 0) {
		re.distribute_optional_flows = db.flows.find({
			_id: {
				$in: distribute_optional_flows
			},
			company_id: company_id,
			state: "enabled"
		}).fetch();
	} else {
		var isSpaceAdmin = Steedos.isSpaceAdmin();
		var flows = WorkflowManager.getCompanyFlows(company_id, space_id);
		flows.sortByName();
		re.flows = new Array();
		flows.forEach(function (fl) {
			if (WorkflowManager.canAdd(fl, curSpaceUser, organizations)) {
				re.flows.push(fl);
			} else if (show_type == 'show') {
				if (isSpaceAdmin) {
					re.flows.push(fl);
				} else if (WorkflowManager.canMonitor(fl, curSpaceUser, organizations)) {
					re.flows.push(fl);
				} else if (WorkflowManager.canAdmin(fl, curSpaceUser, organizations)) {
					re.flows.push(fl);
				}
			}
		});
	}

	return re;
};

WorkflowManager.getFlowListData = function(show_type, space_id) {
	//{categories:[],uncategories:[]}
	var spaceId = space_id ? space_id : Session.get('spaceId');

	var curUserId = Meteor.userId();
	var curSpaceUser = db.space_users.findOne({
		space: spaceId,
		'user': curUserId
	});
	var organizations = db.organizations.find({
		_id: {
			$in: curSpaceUser.organizations
		}
	}).fetch();

	var re = {};
	var distribute_optional_flows = [];
	if (show_type == "distribute") {
		// 如果设置了当前步骤可以分发的流程范围则使用此范围
		var current_step = InstanceManager.getDistributeStep();
		if (current_step && current_step.allowDistribute == true) {
			distribute_optional_flows = current_step.distribute_optional_flows || [];
		}
	}

	if (distribute_optional_flows.length > 0) {
		re.distribute_optional_flows = db.flows.find({
			_id: {
				$in: distribute_optional_flows
			},
			state: "enabled"
		}).fetch();
	} else {
		re.categories = new Array();

		var categories = WorkflowManager.getSpaceCategories(spaceId, Session.get("workflow_categories"));

		// categories.sortByName();

		var isSpaceAdmin = Steedos.isSpaceAdmin();

		categories.forEach(function(c) {
			var forms = WorkflowManager.getCategoriesForms(c._id);
			forms.forEach(function(f) {
				var flows = WorkflowManager.getFormFlows(f._id);
				flows.sortByName();
				f.flows = new Array();
				flows.forEach(function(fl) {
					f.sort_no = fl.sort_no;
					f.name = fl.name;
					if (WorkflowManager.canAdd(fl, curSpaceUser, organizations)) {
						f.flows.push(fl);
					} else if (show_type == 'show') {
						if (isSpaceAdmin) {
							f.flows.push(fl);
						} else if (WorkflowManager.canMonitor(fl, curSpaceUser, organizations)) {
							f.flows.push(fl);
						} else if (WorkflowManager.canAdmin(fl, curSpaceUser, organizations)) {
							f.flows.push(fl);
						}
					}
				});
			});
			forms.sortByName();
			c.forms = forms;
		});

		var unCategorieForms = WorkflowManager.getUnCategoriesForms();

		unCategorieForms.sortByName();

		unCategorieForms.forEach(function(f) {
			var flows = WorkflowManager.getFormFlows(f._id);
			flows.sortByName();
			f.flows = new Array();
			flows.forEach(function(fl) {
				if (WorkflowManager.canAdd(fl, curSpaceUser, organizations)) {
					f.flows.push(fl);
				} else if (show_type == 'show') {
					if (isSpaceAdmin) {
						f.flows.push(fl);
					} else if (WorkflowManager.canMonitor(fl, curSpaceUser, organizations)) {
						f.flows.push(fl);
					} else if (WorkflowManager.canAdmin(fl, curSpaceUser, organizations)) {
						f.flows.push(fl);
					}
				}
			});
		});

		categories = _.filter(categories, function(categorie) {

			var flows = 0;

			categorie.forms.forEach(function(form) {
				flows += form.flows.length
			})

			return flows > 0
		})

		re.categories = categories;

		var unCategorieFlows = 0

		unCategorieForms.forEach(function(form) {
			unCategorieFlows += form.flows.length
		})

		if (unCategorieFlows > 0)
			re.categories.push({
				name: TAPi18n.__('workflow_no_category'),
				_id: '',
				forms: unCategorieForms
			});
	}

	return re;
};


WorkflowManager.getSpaceForms = function(spaceId) {
	var re = new Array();

	var r = db.forms.find();

	r.forEach(function(c) {
		re.push(c);
	});

	return re;
};

WorkflowManager.isPaidSpace = function(spaceId) {
	var is_paid = false;
	var s = db.spaces.findOne({
		'_id': spaceId
	});
	if (s) {
		is_paid = s.is_paid;
	}
	return is_paid;
};
// 判断是否为欠费工作区
WorkflowManager.isArrearageSpace = function() {
	var spaceId = Session.get("spaceId");
	var space = db.spaces.findOne({
		'_id': spaceId
	});
	if (space) {
		if (space.is_paid) {

			return space.end_date <= new Date ? true : false;

		} else {
			return false;
		}
	}
	return true;
}
if (Meteor.isClient) {
	WorkflowManager.getStepDealTypeName = function(step) {
		var reName = "";
		switch (step.deal_type) {
			case 'pickupAtRuntime':
				reName = '审批时指定人员';
				break;
			case 'specifyUser':
				reName = '指定人员';
				break;
			case 'applicantRole':
				reName = '指定审批岗位';
				break;
			case 'applicantSuperior':
				reName = '提交人上级';
				break;
			case 'applicant':
				reName = '提交人';
				break;
			case 'orgField':
				reName = '指定部门';
				break;
		}
		return reName;
	}
}

// 工作区管理员和流程管理员拥有流程的管理权限
WorkflowManager.hasFlowAdminPermission = function(flow_id, space_id, user_id) {
	var space = db.spaces.findOne(space_id);

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

/***
 * options:
 *  title: 标题
 *  subTitle: 子标题
 *  helpUrl: 帮助链接
 *  clearable: 允许清除选项
 *  categorie: 打开窗口时自动展开该分类栏
 *  flow: 打开窗口时自动高亮显示该流程项为选中状态
 *  callBack(args): 回调函数
 *    args:
 *      flow:选中流程id
 *      categorie:选中流程的分类id
 *      organization:选中流程的公司id
 */
WorkflowManager.alertFlowListModel = function (options) {
	var template_name = "flow_list_box_modal";
	if (Meteor.settings.public && Meteor.settings.public.is_group_company) {
		// 集团直接调用新的带组织机构的流程列表窗口
		// template_name = "flow_list_box_org_modal";
		// 流程不多，暂时先显示合并后的非集团模式的弹窗
		template_name = "flow_list_box_modal";
	}
	Modal.show(template_name, options)
}