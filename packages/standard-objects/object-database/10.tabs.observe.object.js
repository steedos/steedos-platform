const objectql = require("@steedos/objectql");
const objectName = "tabs";
const SERVICE_NAME = `~database-${objectName}`;
Meteor.startup(function () {
    var _change, _remove, inited = false;
    _change = function (document) {
        objectql.addTabConfig(document, SERVICE_NAME)
    };
    _remove = function (document) {
        objectql.removeTab(document.name)
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
            if(newDocument.name != oldDocument.name){
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