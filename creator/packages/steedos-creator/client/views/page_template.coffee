Template.page_template.onRendered ->
    self = this;
    appId = Session.get("app_id")
    this.containerList = [];
    this.autorun ()->
        container = Steedos.Page.App.render(self, Session.get("pageApiName"), appId)
        if container 
            self.containerList.push(container)

Template.page_template.onDestroyed ->
    _.each(this.containerList, (container)->
        if container 
            ReactDOM.unmountComponentAtNode(container)
    )