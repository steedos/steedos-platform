var objectql = require('@steedos/objectql');
var triggerCore = require('./object_triggers.core.js');

Meteor.startup(function () {
    var _change, _remove;
    _change = function (document) {
        triggerCore.loadObjectTrigger(document)
    };
    _remove = function (document) {
        triggerCore.removeObjectTrigger(document);
    };
    var config = objectql.getSteedosConfig();
    if(config.tenant && config.tenant.saas){
        return ;
    }else{
        Creator.getCollection("object_triggers").find({is_enable: true}, {
            fields: {
                created: 0,
                created_by: 0,
                modified: 0,
                modified_by: 0
            }
        }).observe({
            added: function (newDocument) {
                return _change(newDocument);
            },
            changed: function (newDocument, oldDocument) {
                return _change(newDocument);
            },
            removed: function (oldDocument) {
                return _remove(oldDocument);
            }
        });
    }
});