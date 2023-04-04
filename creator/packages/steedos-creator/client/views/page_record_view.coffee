Template.page_record_view.onRendered ->
    self = this;
    objectName = Session.get("object_name");
    recordId = Session.get("record_id");
    this.containerList = [];
    this.pageName = null;
    this.autorun ()->
        regions = self.data.regions()
        if(self.pageName)
            try
                # SteedosUI.refs[self.pageName].unmount()
                if SteedosUI.refs[self.pageName]
                    updatePropsData = {
                        objectName: objectName
                    }
                    updatePropsData.recordId = Tracker.nonreactive ()->
                        Session.get("record_id")
                    lastData = SteedosUI.refs[self.pageName]?.__$schema?.data || {};
                    return SteedosUI.refs[self.pageName].updateProps({
                        data: window._.defaultsDeep(updatePropsData, lastData)
                    })
                
            catch e
                console.error(self.pageName + ": " + e);
        if(self.data.regions)
            regions = Tracker.nonreactive self.data.regions ;
            if regions && regions.page && regions.page.schema
                schema = regions.page.schema
                if _.isString(schema)
                    schema = JSON.parse(schema)
                self.pageName = schema.name
        container = Steedos.Page.Record.render(self, objectName, recordId);
        if container 
            self.containerList.push(container)


Template.page_record_view.onDestroyed ->
    try 
        SteedosUI.refs[this.pageName].unmount()
    catch e
        console.error(this.pageName + ": " + e);
    _.each(this.containerList, (container)->
        if container 
            ReactDOM.unmountComponentAtNode(container)
    )