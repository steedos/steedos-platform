var objectql = require('@steedos/objectql');
var objectCore = require('./objects.core.js');

Meteor.startup(function () {
    var config = objectql.getSteedosConfig();
    if(config.tenant && config.tenant.saas){
        return ;
    }else{
        var _init = false;
        Creator.getCollection("_object_reload_logs").find({change_time: {$gte:new Date()}}, {
            fields: {
                created: 0,
                created_by: 0,
                modified: 0,
                modified_by: 0
            }
        }).observe({
            added: function (newDocument) {
                if (_init) {
                    objectCore.reloadObject(newDocument)
                }
            }
        });
        _init = true;
    }
});