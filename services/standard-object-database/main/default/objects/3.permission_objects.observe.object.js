var permissionCore = require('./permission_objects.core.js');

Meteor.startup(function () {
    var _change, _remove;
    _change = function (document) {
        permissionCore.loadObjectPermission(document)
    };
    _remove = function (document) {
        permissionCore.removeObjectPermission(document);
    };
    Creator.getCollection("permission_objects").find({}, {
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
});