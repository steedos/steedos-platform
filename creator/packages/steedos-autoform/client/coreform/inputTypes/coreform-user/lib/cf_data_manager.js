CFDataManager = {};

// DataManager.organizationRemote = new AjaxCollection("organizations");
// DataManager.spaceUserRemote = new AjaxCollection("space_users");
// DataManager.flowRoleRemote = new AjaxCollection("flow_roles");
/*
* options: {
* isSelf: 用于生成另外一个树, 用户所属单位
* isNeedtoSelDefault: 是否默认选中展开的节点， 因为有两棵树， 用户所属单位那棵树不应该默认选中
* rootOrg: 允许支持组织树上的根节点, 值为organization _id
* showCompanyOnly: 是否只显示公司级别的部门
* showLimitedCompanyOnly: 是否只显示本单位公司级别的部门
* }
* */
//TODO: 选人,选组控件中应该去掉 通讯录的权限限制功能
CFDataManager.getNode = function (spaceId, node, options) {
	var orgs,
		myContactsLimit = Steedos.my_contacts_limit,
		showCompanyOnly = options && options.showCompanyOnly;
		showLimitedCompanyOnly = options && options.showLimitedCompanyOnly;
	
	if (showCompanyOnly || showLimitedCompanyOnly) {
		// 只显示单位或限制显示本单位数据时，不考虑通讯录的权限限制功能逻辑
		myContactsLimit = null;
	}
	if (node.id == '#') {
		// 只显示单位或限制显示本单位数据时，第一棵树不显示
		var selfCompanys = (showCompanyOnly || showLimitedCompanyOnly) ? null : Steedos.selfCompanys();
		//第一棵树: 只显示顶部所属单位，可能是多个单位，之前是显示主部门
		if(options.isSelf){
			if (showCompanyOnly || showLimitedCompanyOnly) {
				console.error("只显示单位或限制显示本单位数据时，不应该加载顶部所属单位树")
				return
			}
			if (selfCompanys) {
				// 只显示顶部所属单位，强制showLimitedCompanyOnly为true调用getRoot，即可得到本单位组织
				orgs = CFDataManager.getRoot(spaceId, { showLimitedCompanyOnly: true });
				if (orgs.length) {
					orgs[0].open = true;
					orgs[0].select = true;
				}
			}
		}else{  //第二棵树: 组织机构

			if(options.rootOrg){
				// selfCompanys中已经显示了rootOrg时，不再显示第二次
				if (selfCompanys && selfCompanys.indexOf(options.rootOrg) > -1) {
					orgs = []
				}else{
					orgs = CFDataManager.getOrganizationsByIds([options.rootOrg])

					if(orgs.length > 0 ){
						orgs[0].open = true;
						orgs[0].select = true;
						if (selfCompanys) {
							orgs[0].open = false;
							orgs[0].select = false;
						}
					}

				}
			}else if (myContactsLimit && myContactsLimit.isLimit) {
				var query = {space: spaceId, users: Meteor.userId()};
				if(!Steedos.isSpaceAdmin()){
					query.hidden = {$ne: true}
				}
				var uOrgs = db.organizations.find(query).fetch();
				var _ids = uOrgs.getProperty("_id");
				var outsideOrganizations = myContactsLimit.outside_organizations;
				//当前用户所属组织自身存在的父子包含关系，及其与额外外部组织之间父子包含关系都要过滤掉
				//当前用户所属组织自身的排序在前端是可信的，因为后台相关发布publish做了排序
				_ids = _.union(_ids, outsideOrganizations);
				orgs = _.filter(uOrgs, function (org) {
					var parents = org.parents || [];
					return _.intersection(parents, _ids).length < 1;
				});
				_ids = orgs.getProperty("_id");
				if(outsideOrganizations.length){
					_ids = _.union(outsideOrganizations, _ids);
				}
				//主部门在第一个jstree(即selfCompanys)中已有显示，第二个jstree就应该过滤掉不显示
				_ids = _.difference(_ids, selfCompanys);
				// 这里故意重新抓取后台数据，因为前台无法正确排序
				orgs = CFDataManager.getOrganizationsByIds(_ids);
				if (orgs.length > 0) {
					orgs[0].open = true;
					orgs[0].select = true;
					// 有所属单位的时候不应该再选中根节点
					if (selfCompanys) {
						orgs[0].select = false;
					}
				}
			} else {
				orgs = CFDataManager.getRoot(spaceId, options);
				if(orgs.length){
					// 当没有限制查看本部门的时候，顶部有所属单位树时，根节点中应该排除掉所属单位树中已存在的组织Id
					// 只显示单位或限制显示本单位数据时，不加载selfCompanys
					if ((!showCompanyOnly && !showLimitedCompanyOnly) && selfCompanys){
						orgs = _.filter(orgs, function(n){
							return selfCompanys.indexOf(n._id) < 0;
						});
					}
					if(orgs.length){
						orgs[0].open = true;
						orgs[0].select = true;
						// 顶部有所属单位树时不应该再选中根节点，且所属单位可能自动展开，所以根节点也不应该再自动展开
						if (selfCompanys) {
							orgs[0].open = false;
							orgs[0].select = false;
						}
					}
				}
			}
		}

	}
	else{
		orgs = CFDataManager.getChild(spaceId || node.data.spaceId, node.id, options);
	}
	return handerOrg(orgs, node.id, options);
}


function handerOrg(orgs, parentId, options) {
	var isNeedtoSelDefault = options.isNeedtoSelDefault;
	var nodes = new Array();
	orgs.forEach(function (org) {

		var node = new Object();

		node.text = org.name;

		node.data = {};

		node.data.fullname = org.fullname;

		node.data.spaceId = org.space

		node.id = org._id;

		node.state = {};

		if (CFDataManager.getOrganizationModalValue().getProperty("id").includes(node.id)) {
			node.state.selected = true;
		}

		if (org.children && org.children.length > 0) {
			node.children = true;
		}else{
			node.children = false;
		}

		// node.children = true;

		if (org.open == true) {
			node.state.opened = true;
			if (isNeedtoSelDefault && org.select && CFDataManager.getOrganizationModalValue().length === 0){
				node.state.selected = true;
			}
		} else {
			// node.parent = parentId;
			// node.icon = false;
			// node.icon = "fa fa-users";
		}

		node.parent = parentId;

		node.icon = 'fa fa-sitemap';

		nodes.push(node);
	});
	return nodes;
}


CFDataManager.setContactModalValue = function (value) {
	$("#cf_contact_modal").data("values", value);
	if (value && value instanceof Array) {
		TabularTables.cf_tabular_space_user.customData.defaultValues = value.getProperty("id");
	}
}

CFDataManager.getContactModalValue = function () {
	var value = $("#cf_contact_modal").data("values");
	return value ? value : new Array();
}

CFDataManager.setOrganizationModalValue = function (value) {
	$("#cf_organization_modal").data("values", value);
}

CFDataManager.getOrganizationModalValue = function () {
	var value = $("#cf_organization_modal").data("values");
	return value ? value : new Array();
}

CFDataManager.getSelectedModalValue = function () {
	var val = new Array();
	var instance = $('#cf_organizations_tree').jstree(true);
	var checked = instance.get_selected();

	checked.forEach(function (id) {
		var node = instance.get_node(id);
		val.push({
			id: id,
			name: node.text
		});
	});

	instance = $('#cf_organizations_tree_self').jstree(true);
	checked = instance.get_selected();

	checked.forEach(function (id) {
		if(!_.findWhere(val, {id: id})){
			var node = instance.get_node(id);
			val.push({
				id: id,
				name: node.text
			});
		}
	});

	return val;
}


CFDataManager.getCheckedValues = function () {
	var values = new Array();
	$('[name=\'cf_contacts_ids\']').each(function () {
		if (this.checked) {
			values.push({
				id: this.value,
				name: this.dataset.name
			});
		}
	});

	return values;
}


CFDataManager.handerContactModalValueLabel = function () {

	var values = CFDataManager.getContactModalValue();
	var modal = $(".cf_contact_modal");

	var confirmButton, html = '',
		valueLabel, valueLabel_div;

	confirmButton = $('#confirm', modal);

	valueLabel = $('#valueLabel', modal);

	valueLabel_div = $('#valueLabel_div', modal);

	valueLabel_ui = $('#valueLabel_ui', modal);

	if (values.length > 0) {

		values.forEach(function (v) {
			return html = html + '\u000d\n<li data-value="' + v.id + '" data-name="' + v.name + '"><span>' + v.name + '</span><a href="#" class="js-remove value-label-remove" tabindex="-1" data-value="' + v.id + '">×</a></li>';
		});
		valueLabel.html(html);
		valueLabel_ui.css("white-space", "initial");
		valueLabel_ui = $('#valueLabel_ui', $(".cf_contact_modal"));

		change_valueLabel_ui = function(){
			if (valueLabel_ui.height() > 46 || valueLabel_ui.height() < 0) {
				valueLabel_ui.css("white-space", "nowrap");
			} else {
				valueLabel_ui.css("white-space", "initial");
			}
		};

		change_valueLabel_ui()

		setTimeout(change_valueLabel_ui, 30);

		var selectUsersList = Sortable.create(valueLabel[0], {
			group: 'words',
			animation: 150,
			filter: '.js-remove',
			onFilter: function (evt) {
				var el = selectUsersList.closest(evt.item)

				var val = CFDataManager.getContactModalValue();

				var index = val.getProperty("id").indexOf(el.dataset.value)

				if (index >= 0) {
					if ($("#" + el.dataset.value).val()) {

						$("#" + el.dataset.value).click()

					} else {

						val.remove(index)

						CFDataManager.setContactModalValue(val);

						CFDataManager.handerContactModalValueLabel();
					}

				}
			},
			onEnd: function (event) {
				var labelValues;
				labelValues = [];
				$('#valueLabel li').each(function () {
					return labelValues.push({
						id: this.dataset.value,
						name: this.dataset.name
					});
				});
				CFDataManager.setContactModalValue(labelValues);
			}
		});

		valueLabel_div.show();
		confirmButton.html(confirmButton.prop("title") + "(" + values.length + ")");
	} else {
		confirmButton.html(confirmButton.prop("title"));
		valueLabel_div.hide();
	}
}

CFDataManager.handerOrganizationModalValueLabel = function () {

	var values = CFDataManager.getOrganizationModalValue();
	var modal = $(".cf_organization_modal");

	var confirmButton, html = '',
		valueLabel, valueLabel_div;

	confirmButton = $('#confirm', modal);

	valueLabel = $('#valueLabel', modal);

	valueLabel_div = $('#valueLabel_div', modal);

	valueLabel_ui = $('#valueLabel_ui', modal);

	if (values.length > 0) {
		values.forEach(function (v) {
			return html = html + '\u000d\n<li data-value="' + v.id + '" data-name="' + v.name + '" data-fullname="' + v.fullname + '"><span>' + v.name + '</span><a href="#" class="js-remove value-label-remove" tabindex="-1" data-value="' + v.id + '">×</a></li>';
		});
		valueLabel.html(html);
		valueLabel_ui.css("white-space", "initial");
		valueLabel_ui = $('#valueLabel_ui', $(".cf_organization_modal"));

		if (valueLabel_ui.height() > 46 || valueLabel_ui.height() < 0) {
			valueLabel_ui.css("white-space", "nowrap");
		} else {
			valueLabel_ui.css("white-space", "initial");
		}

		var selectOrgsList = Sortable.create(valueLabel[0], {
			group: 'words',
			animation: 150,
			filter: '.js-remove',
			onFilter: function (evt) {
				var el = selectOrgsList.closest(evt.item)

				var val = CFDataManager.getOrganizationModalValue();

				var index = val.getProperty("id").indexOf(el.dataset.value)

				if (index >= 0) {
					var cf_org_jstree = $("#cf_organizations_tree").jstree();
					var cf_org_jstree_self = $("#cf_organizations_tree_self").jstree();

					var org_node = cf_org_jstree.get_node(el.dataset.value);
					var org_node_self = cf_org_jstree_self.get_node ? cf_org_jstree_self.get_node(el.dataset.value) : null;

					if(org_node || org_node_self){
						if(org_node && org_node.state.selected){
							Template.cf_organization.conditionalselect(org_node);
							$("#cf_organizations_tree").jstree("uncheck_node", org_node.id);
						}
						if(org_node_self && org_node_self.state.selected){
							Template.cf_organization.conditionalselect(org_node_self);
							$("#cf_organizations_tree_self").jstree("uncheck_node", org_node_self.id);
						}
					}
					else{
						val.remove(index);
						CFDataManager.setOrganizationModalValue(val);
						CFDataManager.handerOrganizationModalValueLabel();
					}
				}
			},
			onEnd: function (event) {
				var labelValues;
				labelValues = [];
				$('#valueLabel li').each(function () {
					return labelValues.push({
						id: this.dataset.value,
						name: this.dataset.name,
						fullname: this.dataset.fullname
					});
				});
				CFDataManager.setOrganizationModalValue(labelValues);
			}
		});

		valueLabel_div.show();
		confirmButton.html(confirmButton.prop("title") + "(" + values.length + ")");
	} else {
		confirmButton.html(confirmButton.prop("title"));
		valueLabel_div.hide();
	}
}


CFDataManager.getRoot = function (spaceId, options) {

	var query = {is_company: true, parent: null}

	if(spaceId){
		query.space = spaceId
	}else{
		user_spaces = db.spaces.find().fetch().getProperty("_id")

		query.space = {$in: user_spaces}
	}

	var showLimitedCompanyOnly = options && options.showLimitedCompanyOnly;
	if(showLimitedCompanyOnly){
		user_company_ids = Session.get("user_company_ids");
		if (user_company_ids && user_company_ids.length) {
			query._id = {
				$in: user_company_ids
			};
			delete query.parent;
		}
		else{
			query._id = "-1";
			toastr.error("您的单位信息未设置，请联系系统管理员。");
			console.error("只显示本单位的部门时要求当前用户的company_ids不为空，请联系管理员修正相关数据");
		}
	}

	return SteedosDataManager.organizationRemote.find(query, {
		fields: {
			_id: 1,
			name: 1,
			space: 1,
			fullname: 1,
			parent: 1,
			children: 1,
			childrens: 1,
			is_company: 1,
		}
	});
};

CFDataManager.getOrganizationsByIds = function(ids) {
	var query = {
		_id: {$in: ids}
	};
	if(!Steedos.isSpaceAdmin()){
		query.hidden = {$ne: true}
	}
	var childs = SteedosDataManager.organizationRemote.find(query, {
		fields: {
			_id: 1,
			name: 1,
			fullname: 1,
			parent: 1,
			children: 1,
			childrens: 1,
			hidden: 1,
			sort_no: 1,
			admins: 1
		},
		sort: {
			sort_no: -1,
			name: 1
		}
	});
	return childs;
}

CFDataManager.getChild = function (spaceId, parentId, options) {

	var query = {
		parent: parentId,
		space: spaceId
	};
	var showCompanyOnly = options && options.showCompanyOnly
	if (showCompanyOnly) {
		query.is_company = true;
	}
	var showLimitedCompanyOnly = options && options.showLimitedCompanyOnly
	if (showLimitedCompanyOnly) {
		user_company_ids = Session.get("user_company_ids");
		if (user_company_ids && user_company_ids.length) {
			// 限制本单位范围时，如果要显示普通组织，而不是只显示公司级，则不能加query._id = user_company_ids过滤
			// 因为query._id = user_company_ids条件只需要在根组织过滤一次就行了，这里显示根组织下的子组织只需要默认的parent过滤条件
			if (showCompanyOnly) {
				query._id = {
					$in: user_company_ids
				};
			}
		} else {
			query._id = "-1";
			toastr.error("您的单位信息未设置，请联系系统管理员。");
			console.error("只显示本单位的部门时要求当前用户的company_ids不为空，请联系管理员修正相关数据");
		}
	}

	if (!Steedos.isSpaceAdmin()) {
		query.hidden = {
			$ne: true
		};
	}

	var childs = SteedosDataManager.organizationRemote.find(query, {
		fields: {
			_id: 1,
			space: 1,
			name: 1,
			fullname: 1,
			parent: 1,
			children: 1,
			childrens: 1,
			sort_no: 1
		},
		sort: {
			sort_no: -1,
			name: 1
		}
	});


	// childs.sort(function (p1, p2) {
	//     if (p1.sort_no == p2.sort_no) {
	//         return p1.name.localeCompare(p2.name);
	//     } else {
	//         if (p1.sort_no < p2.sort_no) {
	//             return 1
	//         } else {
	//             return -1;
	//         }
	//     }
	// });

	return childs;
}


CFDataManager.getSpaceUser = function (userId) {
	if (!userId) {
		return;
	}

	if (typeof userId != "string") {

		return this.getSpaceUsers(userId);

	}

	var spaceUsers = SteedosDataManager.getSpaceUsers(Session.get('spaceId'), userId);
	if (!spaceUsers) {
		return
	}
	;

	var spaceUser = spaceUsers[0];
	if (!spaceUser) {
		return
	}
	;

	return spaceUser;
};

CFDataManager.getSpaceUsers = function (userIds) {

	if ("string" == typeof(userIds)) {
		return [CFDataManager.getSpaceUser(userIds)]
	}

	var users = new Array();
	if (userIds) {
		users = SteedosDataManager.getSpaceUsers(Session.get('spaceId'), userIds);
	}

	return users;
};

CFDataManager.getFormulaSpaceUsers = function (userIds, space) {
	if (!userIds)
		return;
	return CFDataManager.getFormulaSpaceUser(userIds, space);
}

//return {name:'',organization:{fullname:'',name:''},roles:[]}
CFDataManager.getFormulaSpaceUser = function (userId, space) {
	if (userId) {

		var spaceId = Session.get('spaceId');

		if(space === false || true){
			spaceId = null;
		}

		if (userId instanceof Array) {
			return SteedosDataManager.getFormulaUserObjects(spaceId, userId);
		} else {
			return SteedosDataManager.getFormulaUserObjects(spaceId, [userId])[0];
		}
	}
};

CFDataManager.getOrgAndChild = function (node, orgId) {

	var query ={
		space: node.data.spaceId,
		parent: orgId
	}

	if(!Steedos.isSpaceAdmin()){
		query.hidden = {$ne: true}
	}

	var childrens = SteedosDataManager.organizationRemote.find(query, {
		fields: {
			_id: 1
		}
	});
	orgs = childrens.getProperty("_id");
	orgs.push(orgId);
	return orgs;
}


CFDataManager.getFormulaOrganizations = function (orgIds, space) {
	if (!orgIds)
		return;
	var orgs = new Array();
	if (orgIds instanceof Array) {
		return SteedosDataManager.getFormulaOrganizations(orgIds, space)
	} else {
		orgs = CFDataManager.getFormulaOrganization(orgIds, space);
	}

	return orgs;
}

CFDataManager.getFormulaOrganization = function (orgId, space) {
	return _.first(SteedosDataManager.getFormulaOrganizations([orgId]), space)
}

CFDataManager.formatFiltersToMongo = function(filters) {
	var selector;
	if (!filters.length) {
		return;
	}
	if (!(filters[0] instanceof Array)) {
		filters = _.map(filters, function(obj) {
			return [obj.field, obj.operation, obj.value];
		});
	}
	selector = [];
	_.each(filters, function(filter) {
		var field, option, reg, sub_selector, value;
		field = filter[0];
		option = filter[1];
		value =  filter[2];
		sub_selector = {};
		sub_selector[field] = {};
		if (option === "=") {
			sub_selector[field]["$eq"] = value;
		} else if (option === "<>") {
			sub_selector[field]["$ne"] = value;
		} else if (option === ">") {
			sub_selector[field]["$gt"] = value;
		} else if (option === ">=") {
			sub_selector[field]["$gte"] = value;
		} else if (option === "<") {
			sub_selector[field]["$lt"] = value;
		} else if (option === "<=") {
			sub_selector[field]["$lte"] = value;
		} else if (option === "startswith") {
			reg = new RegExp("^" + value, "i");
			sub_selector[field]["$regex"] = reg;
		} else if (option === "contains") {
			reg = new RegExp(value, "i");
			sub_selector[field]["$regex"] = reg;
		} else if (option === "notcontains") {
			reg = new RegExp("^((?!" + value + ").)*$", "i");
			sub_selector[field]["$regex"] = reg;
		}
		return selector.push(sub_selector);
	});
	return selector;
};