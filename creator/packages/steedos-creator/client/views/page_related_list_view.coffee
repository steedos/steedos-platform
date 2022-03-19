Template.page_related_list_view.onRendered ->
    self = this;
    objectName = Session.get("object_name")
    recordId = Session.get("record_id")
    this.autorun ()->
        Steedos.Page.RelatedListview.render(self, objectName, recordId);