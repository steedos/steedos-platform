/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-06-23 17:58:55
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2023-12-05 10:35:52
 * @Description: 
 */
var objectql = require('@steedos/objectql');
var objectCore = require('./objects.core.js');

Meteor.startup(function () {
    var server_objects_init;
    var _changeServerObjects = function (document, oldDocument) {
        try {
            objectCore.loadObject(document, oldDocument)
        } catch (error) {
            throw error
        }
    };
    var _removeServerObjects = function (document) {
        try {
            objectCore.removeObject(document, false, true);
        } catch (error) {
            throw error
        }
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
                // if (!server_objects_init || _.has(newDocument, "fields")) {
                    if(newDocument.is_enable != false){
                        return _changeServerObjects(newDocument, null);
                    }
                // }
            },
            changed: function (newDocument, oldDocument) {
                if(newDocument.is_enable === false){
                    _removeServerObjects(oldDocument);
                }else{
                    return _changeServerObjects(newDocument, oldDocument);
                }
            },
            removed: function (oldDocument) {
                if(oldDocument.is_system){
                    objectCore.removeObjectConfig(oldDocument.name)
                }
                return _removeServerObjects(oldDocument);
            }
        });
        server_objects_init = true;
    }
});