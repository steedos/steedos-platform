Template.page_record_view.onRendered ->
    self = this;
    objectName = Session.get("object_name");
    recordId = Session.get("record_id");
    this.containerList = [];
    this.autorun ()->
        container = Steedos.Page.Record.render(self, objectName, recordId);
        if container 
            self.containerList.push(container)


Template.page_record_view.onDestroyed ->
    try 
        SteedosUI.refs["amis-#{Session.get("app_id")}-#{Session.get("object_name")}-detail"].unmount()
    catch e
        console.error(e);
    _.each(this.containerList, (container)->
        if container 
            ReactDOM.unmountComponentAtNode(container)
    )