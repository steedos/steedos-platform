Template.page_record_view.onRendered ->
    self = this;
    objectName = Session.get("object_name");
    recordId = Session.get("record_id");
    this.containerList = [];
    this.pageName = null;
    this.autorun ()->
        regions = self.data.regions();
        updateProps = true;
        if regions.objectName != this.lastRegions?.objectName
            updateProps = false;
        this.lastRegions = regions;
        if(updateProps && self.pageName)
            try
                # SteedosUI.refs[self.pageName].unmount()
                if SteedosUI.refs[self.pageName]
                    updatePropsData = {
                        objectName: objectName
                    }
                    updatePropsData.recordId = Tracker.nonreactive ()->
                        Session.get("record_id")
                    lastData = SteedosUI.refs[self.pageName]?.__$schema?.data || {};
                    # console.log("page_record_view Steedos.Page.Record.updateProps")
                    return SteedosUI.refs[self.pageName].updateProps({
                        data: window._.defaultsDeep(updatePropsData, lastData)
                    })
                
            catch e
                console.error(self.pageName + ": " + e);
        if !updateProps && self.pageName && SteedosUI.refs[self.pageName]
            try
                SteedosUI.refs[self.pageName].unmount()
            catch e
                console.error(self.pageName + ": " + e);

        if(self.data.regions)
            regions = Tracker.nonreactive self.data.regions ;
            this.lastRegions = regions;
            if regions && regions.page && regions.page.schema
                schema = regions.page.schema
                if _.isString(schema)
                    schema = JSON.parse(schema)
                self.pageName = schema.name
        objectName = Tracker.nonreactive ()->
            Session.get("object_name");
        recordId = Tracker.nonreactive ()->
            Session.get("record_id");
        container = Steedos.Page.Record.render(self, objectName, recordId);
        # console.log("page_record_view Steedos.Page.Record.render")
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