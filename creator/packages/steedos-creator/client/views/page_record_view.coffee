Template.page_record_view.onRendered ->
    self = this;
    objectName = Session.get("object_name");
    recordId = Session.get("record_id");
    this.autorun ()->
        Steedos.Page.Record.render(self, objectName, recordId);