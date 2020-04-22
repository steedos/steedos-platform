var objectql = require('@steedos/objectql');

//TODO：更新权限到Creator对象下
function loadObjectPermission(doc){
    if(!doc.object_name.endsWith("__c")){
        console.warn('warn: Not loaded. Invalid custom permission_objects -> ', doc.name);
        return;
    }
    const pset = Creator.getCollection("permission_set").findOne({_id: doc.permission_set_id, space: doc.space});
    if(pset){
        const datasource = objectql.getDataSource();
        datasource.setObjectSpacePermission(doc.object_name, doc.space, Object.assign({}, doc, {name: pset.name}));
    }
}

function removeObjectPermission(doc){
    if(!doc.object_name.endsWith("__c")){
        console.warn('warn: Not deleted. Invalid custom permission_objects -> ', doc.name);
        return;
    }
    const pset = Creator.getCollection("permission_set").findOne({_id: doc.permission_set_id, space: doc.space});
    if(pset){
        const datasource = objectql.getDataSource();
        datasource.removeObjectSpacePermission(doc.object_name, doc.space, pset.name)
    }
}

Meteor.startup(function () {
    var _change, _remove;
    _change = function (document) {
        loadObjectPermission(document)
    };
    _remove = function (document) {
        removeObjectPermission(document);
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