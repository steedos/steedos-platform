Template.page_related_list_view.onRendered ->
    self = this;
    objectName = Session.get("object_name")
    recordId = Session.get("record_id")
    this.containerList = [];
    this.autorun ()->
        container = Steedos.Page.RelatedListview.render(self, objectName, recordId);
        if container 
            self.containerList.push(container)

Template.page_related_list_view.onDestroyed ->
    try
        SteedosUI.refs["amis-#{Session.get("app_id")}-#{FlowRouter.getParam("object_name")}-related-#{Session.get("related_object_name")}"].unmount()
    catch e
        console.error(e);
    _.each(this.containerList, (container)->
        if container 
            ReactDOM.unmountComponentAtNode(container)
    )