Template.steedos_contacts_group_tree.helpers
  is_disabled: ->
    return !Session.get("contacts_groupId") || Session.get("contacts_groupId")=='root'


Template.steedos_contacts_group_tree.onRendered ->
  $('[data-toggle="tooltip"]').tooltip()
  $(document.body).addClass('loading')

  this.autorun ()->
    if Steedos.subsSpace.ready("address_groups")
      $("#steedos_contacts_group_tree").on('changed.jstree', (e, data) ->
            if data.selected.length
              Session.set("contact_showBooks", true)
              Session.set("contacts_groupId", data.selected[0])
            return
          ).jstree
                core:
                    themes: { "stripes" : true, "variant" : "large" },
                    data:  (node, cb) ->
                      Session.set("contacts_groupId", node.id)
                      cb(ContactsManager.getBookNode(node))

                plugins: ["wholerow", "search"]
      $("#steedos_contacts_group_tree").on('select_node.jstree', (e, data) ->
        $(".contacts-list-wrapper").hide();
      )

  $(document.body).removeClass('loading');


Template.steedos_contacts_group_tree.events
  'click #search-btn': (event, template) ->
    $('#steedos_contacts_group_tree').jstree(true).search($("#search-key").val())

  'click #steedos_contacts_group_tree_add_btn': (event, template) ->
    AdminDashboard.modalNew 'address_groups', {}, ()->
      $.jstree.reference('#steedos_contacts_group_tree').refresh()

  'click #steedos_contacts_group_tree_edit_btn': (event, template) ->
    AdminDashboard.modalEdit 'address_groups', Session.get('contacts_groupId'), ()->
      $.jstree.reference('#steedos_contacts_group_tree').refresh()

  'click #steedos_contacts_group_tree_remove_btn': (event, template) ->
    AdminDashboard.modalDelete 'address_groups', Session.get('contacts_groupId'), ()->
      $.jstree.reference('#steedos_contacts_group_tree').refresh()

  'click #contacts_back': (event, template)->
    $(".contacts-list-wrapper").hide()
