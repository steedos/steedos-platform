module.exports = {
    showDesign: function (object_name, record_id) {
        const record = Creator.odata.get(object_name,record_id);
        
        SteedosUI.render(BuilderReact.BuilderComponent, {model:"page",content:{
            "data":{
               "blocks":[
                  {
                     "@type":"@builder.io/sdk:Element",
                     "@version":2,
                     "id":"builder-2b290abc4e4042498645863f53ee6815",
                     "component":{
                        "name": `design-${record.render_engine}`,
                        "options":{
                           "schema": record.schema || {}
                        }
                     },
                     "responsiveStyles":{
                        "large":{
                           "display":"flex",
                           "flexDirection":"column",
                           "alignItems":"stretch",
                           "position":"relative",
                           "marginTop":"20px",
                           "lineHeight":"normal",
                           "height":"auto",
                           "textAlign":"center"
                        }
                     }
                  }
               ],
               "inputs":[
                  
               ]
            }
         }}, $(".slds-template__container")[0])

        // Steedos.openWindow(Steedos.absoluteUrl(`/builder/#/charts-design/${record.query}`));
    },
    showDesignVisible: function (object_name, record_id, record_permissions) {
        var perms, record;
        perms = {};
        if (record_permissions) {
            perms = record_permissions;
        } else {
            record = Creator.getObjectRecord(object_name, record_id);
            record_permissions = Creator.getRecordPermissions(object_name, record, Meteor.userId());
            if (record_permissions) {
                perms = record_permissions;
            }
        }
        return perms["allowEdit"];
    }
}