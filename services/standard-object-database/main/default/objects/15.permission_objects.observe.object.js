const objectql = require("@steedos/objectql");
const objectName = "permission_objects";
Meteor.startup(function () {
    var _change, _remove, inited = false;
    _change = function (document) {
        try {
            objectql.getSteedosSchema().broker.call(`permission_fields.resetFieldPermissions`, {
                permissionObjectId: document._id
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
            console.error(`resetFieldPermissions`, error)
        }
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
        // removed: function (oldDocument) {
        //     return _change(oldDocument);
        // }
    });
    inited = true;
});