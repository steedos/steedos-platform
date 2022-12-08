Template.page_related_list_view.onRendered ->
    self = this;
    objectName = Session.get("object_name")
    recordId = Session.get("record_id")
    this.containerList = [];
    this.pageName = null;
    this.autorun ()->
        if(self.pageName)
            try
                SteedosUI.refs[self.pageName].unmount()
            catch e
                console.error(self.pageName + ": " + e);
        if(self.data.regions)
            regions = self.data.regions();
            if regions && regions.page && regions.page.schema
                schema = regions.page.schema
                if _.isString(schema)
                    schema = JSON.parse(schema)
                self.pageName = schema.name
        container = Steedos.Page.RelatedListview.render(self, objectName, recordId);
        if container 
            self.containerList.push(container)

Template.page_related_list_view.onDestroyed ->
    try
        SteedosUI.refs[this.pageName].unmount()
    catch e
        console.error(this.pageName + ": " + e);
    _.each(this.containerList, (container)->
        if container 
            ReactDOM.unmountComponentAtNode(container)
    )