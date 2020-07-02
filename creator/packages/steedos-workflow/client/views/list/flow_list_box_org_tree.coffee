Template.flow_list_box_org_tree.helpers


Template.flow_list_box_org_tree.onRendered ->

  showUserMainOrg = false
  showCompanyOnly = true
  $(document.body).addClass('loading');

  $("#steedos_contacts_org_tree").on('changed.jstree', (e, data) ->
        if data.selected.length
          flow_list_box_org_id = data.selected[0]
          if showUserMainOrg
            if flow_list_box_org_id.split("userMainOrg_").length > 1
              flow_list_box_org_id = flow_list_box_org_id.split("userMainOrg_")[1]
          Session.set("flow_list_box_org_id", flow_list_box_org_id);
        return
      ).jstree
            core: 
                themes: { "stripes" : true, "variant" : "large" },
                data:  (node, cb) ->
                  cb(ContactsManager.getOrgNode(node, '', showUserMainOrg, true, showCompanyOnly));
                      
            plugins: ["wholerow"]


  $(document.body).removeClass('loading');



Template.flow_list_box_org_tree.events