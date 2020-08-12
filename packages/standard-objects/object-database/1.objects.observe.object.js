var objectql = require('@steedos/objectql');
var objectCore = require('./objects.core.js');

Meteor.startup(function () {
    var server_objects_init;
    var _changeServerObjects = function (document, oldDocument) {
        objectCore.loadObject(document, oldDocument)
    };
    var _removeServerObjects = function (document) {
        objectCore.removeObject(document);
    };

    var config = objectql.getSteedosConfig();
    if(config.tenant && config.tenant.saas){
        return ;
    }else{
        server_objects_init = false;
        Creator.getCollection("objects").find({is_deleted: {$ne: true}}, {
            fields: {
                created: 0,
                created_by: 0,
                modified: 0,
                modified_by: 0
            }
        }).observe({
            added: function (newDocument) {
                if (!server_objects_init || _.has(newDocument, "fields")) {
                    if(newDocument.is_enable != false){
                        return _changeServerObjects(newDocument, null);
                    }
                }
            },
            changed: function (newDocument, oldDocument) {
                if(newDocument.is_enable === false){
                    _removeServerObjects(oldDocument);
                }else{
                    return _changeServerObjects(newDocument, oldDocument);
                }
            },
            removed: function (oldDocument) {
                return _removeServerObjects(oldDocument);
            }
        });
        server_objects_init = true;
    }
});