/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-08-05 14:17:44
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2023-06-27 09:32:45
 * @Description: 
 */
var objectql = require('@steedos/objectql');
var objectCore = require('./objects.core.js');
var lodash = require('lodash');
Meteor.startup(function () {
    var _change, _remove, inited = false;
    _change = function (document) {
        // 防止visible默认值丢失
        if(!document.visible && !lodash.isBoolean(document.visible)){
            document.visible = true;
        }

        document._visible = document.visible;
        objectCore.triggerReloadObject(document.object, 'action', document, 'update');
    };
    _remove = function (document) {
        objectql.removeObjectButtonsConfig(document.object, document);
        objectql.removeLazyLoadButton(document.object, document);
        objectCore.triggerReloadObject(document.object, 'action', document, 'remove');
    };
    var config = objectql.getSteedosConfig();
    if (config.tenant && config.tenant.saas) {
        return;
    } else {
        Creator.getCollection("object_actions").find({ is_enable: true }, {
            fields: {
                created: 0,
                created_by: 0,
                modified: 0,
                modified_by: 0
            }
        }).observe({
            added: function (newDocument) {
                if(inited){
                    return _change(Object.assign(newDocument, {_previousName: newDocument.name}));
                }
            },
            changed: function (newDocument, oldDocument) {
                if(inited){
                    return _change(Object.assign(newDocument, {_previousName: oldDocument.name}));
                }
            },
            removed: function (oldDocument) {
                if(inited){
                    return _remove(oldDocument);
                }
            }
        });
        inited=true;
    }
});