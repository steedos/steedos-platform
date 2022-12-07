Template.page_list_view.onRendered ->
    self = this;
    objectName=Session.get("object_name");
    this.containerList = [];
    this.autorun ()->
        container = Steedos.Page.Listview.render(self, objectName);
        if container 
            self.containerList.push(container)

Template.page_list_view.onDestroyed ->
    try
        SteedosUI.refs["amis-#{Session.get("app_id")}-#{Session.get("object_name")}-listview"].unmount()
    catch e
        console.error(e);
    _.each(this.containerList, (container)->
        if container 
            ReactDOM.unmountComponentAtNode(container)
    )