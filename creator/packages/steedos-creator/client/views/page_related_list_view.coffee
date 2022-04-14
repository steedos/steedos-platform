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
    _.each(this.containerList, (container)->
        if container 
            ReactDOM.unmountComponentAtNode(container)
    )