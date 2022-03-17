Template.page_list_view.onRendered ->
    self = this;
    this.autorun ()->
        Steedos.Page.Listview.render(self, Session.get("object_name"));