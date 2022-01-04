var objectql = require('@steedos/objectql');
var objectCore = require('./objects.core.js');
Meteor.startup(function () {
    var _change, _remove;
    _change = function (document) {
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