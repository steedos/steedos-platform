/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-08-05 14:17:44
 * @LastEditors: sunhaolin@hotoa.com
 * @LastEditTime: 2023-05-12 09:33:27
 * @Description: 
 */
const objectql = require("@steedos/objectql");
const objectName = "object_fields";
Meteor.startup(function () {
    var _change, _remove, inited = false;
    _change = function (document) {
        // 重置字段权限延迟10秒,防止对象服务未上线
        setTimeout(()=>{
            try {
                // console.log("====resetAllPermissionSetFieldPermissions====")
                objectql.getSteedosSchema().broker.call(`permission_fields.resetAllPermissionSetFieldPermissions`, {
                    objectName: document.object
                }, {
                    meta: {
                        user: {
                            userId: document.owner,
                            spaceId: document.space,
                            company_id: document.company_id,
                            company_ids: document.company_ids,
                        }
                    }
                });
            } catch (error) {
                console.error(`resetAllPermissionSetFieldPermissions`, error)
            }
        }, 1000 * 10)
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
            return _change(newDocument);
        },
        removed: function (oldDocument) {
            return _change(oldDocument);
        }
    });
    inited = true;
});