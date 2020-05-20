var objectql = require('@steedos/objectql');
var objectCore = require('./objects.core.js');

Meteor.startup(function () {
    var _changeServerObjects, _removeServerObjects, server_objects_init;
    _changeServerObjects = function (document) {
        objectCore.loadObject(document)
    };
    _removeServerObjects = function (document) {
        objectCore.removeObject(document);
    };

    var config = objectql.getSteedosConfig();
    if(config.tenant && config.tenant.saas){
        return ;
    }else{
        server_objects_init = false;
        Creator.getCollection("objects").find({is_enable: {$ne: false}}, {
            fields: {
                created: 0,
                created_by: 0,
                modified: 0,
                modified_by: 0
            }
        }).observe({
            added: function (newDocument) {
                if (!server_objects_init || _.has(newDocument, "fields")) {
                    return _changeServerObjects(newDocument);
                }
            },
            changed: function (newDocument, oldDocument) {
                return _changeServerObjects(newDocument);
            },
            removed: function (oldDocument) {
                return _removeServerObjects(oldDocument);
            }
        });
        server_objects_init = true;
    }
});