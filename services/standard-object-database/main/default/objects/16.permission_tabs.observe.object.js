/*
 * @Author: 孙浩林 sunhaolin@steedos.com
 * @Date: 2023-06-28 16:15:36
 * @LastEditors: 孙浩林 sunhaolin@steedos.com
 * @LastEditTime: 2023-06-28 18:59:40
 * @FilePath: /project-template/Users/sunhaolin/Documents/GitHub/steedos-platform-2.3/services/standard-object-database/main/default/objects/16.permission_tabs.observe.object.js
 * @Description: 
 */
const objectql = require("@steedos/objectql");
const objectName = "permission_tabs";
const SERVICE_NAME = `~database-permission_tabs`;
Meteor.startup(function () {
    var _change, _remove, inited = false;
    _change = function (document) {
        objectql.registerPermissionTabs.register(broker, SERVICE_NAME, document)
    };
    _remove = function (document) {
        objectql.registerPermissionTabs.remove(broker, SERVICE_NAME, document)
    };
    Creator.getCollection(objectName).find({}, {
        fields: {
            created: 0,
            created_by: 0,
            modified: 0,
            modified_by: 0
        }
    }).observe({
        added: function (newDocument) {
            if (inited) {
                return _change(newDocument);
            }
        },
        changed: function (newDocument, oldDocument) {
            if (newDocument.name != oldDocument.name) {
                _remove(oldDocument)
            }
            return _change(newDocument);
        },
        removed: function (oldDocument) {
            return _remove(oldDocument);
        }
    });
    inited = true;
});