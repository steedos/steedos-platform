Template.page_list_view.onRendered ->
    self = this;
    objectName=Session.get("object_name");
    this.containerList = [];
    this.autorun ()->
        container = Steedos.Page.Listview.render(self, objectName);
        if container 
            self.containerList.push(container)

Template.page_list_view.onDestroyed ->
    _.each(this.containerList, (container)->
        if container 
            ReactDOM.unmountComponentAtNode(container)
    )