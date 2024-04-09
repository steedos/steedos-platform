const objectql = require("@steedos/objectql");
const schema = objectql.getSteedosSchema();
const objectName = "permission_fields";
const SERVICE_NAME = `~database-${objectName}`;
Meteor.startup(function () {
    var _change, _remove, inited = false;
    _change = function (document) {
        objectql.registerPermissionFields.register(schema.broker, SERVICE_NAME, document)
    };
    _remove = function (document) {
        objectql.registerPermissionFields.remove(schema.broker, SERVICE_NAME, document)
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
            if (newDocument.copy_from) { // 通过复制简档创建的字段权限，使用批量注册
                return;
            }
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