renderTree = (container,isSelf)->
	templateData = Template.instance().data
	spaceId = Template.instance().data.spaceId
	rootOrg = Template.instance().data.rootOrg
	showLimitedCompanyOnly = templateData.showLimitedCompanyOnly
	$(container).on('select_node.jstree', (e, data) ->
		if(container == "#cf_organizations_tree_self")
			$("#cf_organizations_tree").jstree().deselect_all?()
		else
			$("#cf_organizations_tree_self").jstree().deselect_all?()
	).on('changed.jstree', (e, data) ->
		if data.selected.length
			Session.set("cf_selectOrgId", data.selected[0]);
			node = $(container).jstree('get_node', data.selected[0]);
			if node
				Session.set("cf_space", node?.data.spaceId);
				Session.set("cf_orgAndChild", CFDataManager.getOrgAndChild(node, Session.get("cf_selectOrgId")));
			if data?.node?.parent == "#" && data?.node?.state?.opened
				return;
			$(container).jstree('toggle_node', data.selected[0]);
		return
	).jstree
		core:
			themes: {"stripes": true, "variant": "large"},
			three_state: false,
			data: (node, cb) ->
				cb(CFDataManager.getNode(spaceId, node, {isSelf: isSelf, isNeedtoSelDefault: true, rootOrg: rootOrg, showLimitedCompanyOnly: showLimitedCompanyOnly}));

				# if node.id != '#'
					# Session.set("cf_selectOrgId", node.id);
					# Session.set("cf_space", node.data.spaceId);
					# Session.set("cf_orgAndChild", CFDataManager.getOrgAndChild(node, Session.get("cf_selectOrgId")));
		plugins: ["wholerow"]


Template.cf_organization_list.helpers


Template.cf_organization_list.onRendered ->
	templateData = Template.instance().data
	showLimitedCompanyOnly = templateData.showLimitedCompanyOnly
	if !showLimitedCompanyOnly
		renderTree "#cf_organizations_tree_self", true
	renderTree "#cf_organizations_tree", false

Template.cf_organization_list.events