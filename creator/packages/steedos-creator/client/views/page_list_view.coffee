Template.page_list_view.onRendered ->
    self = this;
    objectName=Session.get("object_name");
    this.autorun ()->
        Steedos.Page.Listview.render(self, objectName);