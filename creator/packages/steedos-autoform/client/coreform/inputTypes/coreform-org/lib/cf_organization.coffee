renderTree = (container,isSelf)->
  templateData = Template.instance().data
  spaceId = templateData.spaceId
  CFDataManager.setOrganizationModalValue(CFDataManager.getFormulaOrganizations(templateData.defaultValues, spaceId));
  $.jstree.defaults.checkbox.three_state = false;
  plugins = ["wholerow", "conditionalselect"];
  Template.cf_organization.multiple = templateData.multiple;
  if templateData.multiple
    plugins.push("checkbox");
  $(container).on('select_node.jstree', (e, data) ->
    # 选中组织时把另一个组织的同一节点也选中
    if(container == "#cf_organizations_tree_self")
      targetTree = $("#cf_organizations_tree").jstree()
    else
      targetTree = $("#cf_organizations_tree_self").jstree()
    currentNode = targetTree.get_node?(data.node.id);
    if currentNode
      targetTree.select_node? currentNode
  ).on('deselect_node.jstree', (e, data) ->
    # 删除选中组织时把另一个组织的同一节点也删除
    if(container == "#cf_organizations_tree_self")
      targetTree = $("#cf_organizations_tree").jstree()
    else
      targetTree = $("#cf_organizations_tree_self").jstree()
    currentNode = targetTree.get_node?(data.node.id);
    if currentNode
      targetTree.deselect_node? currentNode
  ).on('changed.jstree', (e, data) ->
    if data.selected.length
      Session.set("cf_selectOrgId", data.selected[0]);
      if data?.node?.parent=="#" && data?.node?.state?.opened
        return ;
      $(container).jstree('toggle_node', data.node?.id);
    return
  ).jstree
      core:
        themes: { "stripes" : true },
        data:  (node, cb) ->
          # Session.set("cf_selectOrgId", node.id);
          cb(CFDataManager.getNode(spaceId, node, isSelf));
        three_state: false
      conditionalselect: (node) ->
        return Template.cf_organization.conditionalselect(node);
      plugins: plugins


Template.cf_organization.helpers


Template.cf_organization.conditionalselect = (node)->
  if Template.cf_organization.multiple
    values = CFDataManager.getOrganizationModalValue();

    if node.state.selected
      values.remove(values.getProperty("id").indexOf(node.id))
    else
      if values.getProperty("id").indexOf(node.id) < 0
        values.push({id: node.id, name: node.text, fullname: node.data.fullname});

    CFDataManager.setOrganizationModalValue(values);
    CFDataManager.handerOrganizationModalValueLabel();
  else
    CFDataManager.setOrganizationModalValue([{id: node.id, name: node.text, fullname: node.data.fullname}]);
    $("#confirm", $("#cf_organization_modal")).click()

  return true;


Template.cf_organization.onRendered ->
  renderTree "#cf_organizations_tree_self",true
  renderTree "#cf_organizations_tree",false

Template.cf_organization.events
