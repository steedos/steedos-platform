Template.page_record_view.onRendered ->
    self = this;
    this.autorun ()->
        Steedos.Page.Record.render(self, Session.get("object_name"), Session.get("record_id"));