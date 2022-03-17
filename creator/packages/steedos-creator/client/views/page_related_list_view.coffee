Template.page_related_list_view.onRendered ->
    self = this;
    this.autorun ()->
        Steedos.Page.RelatedListview.render(self, Session.get("object_name"), Session.get("record_id"));