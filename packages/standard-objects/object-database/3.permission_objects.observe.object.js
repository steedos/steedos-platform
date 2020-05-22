var objectql = require('@steedos/objectql');
var objectCore = require('./objects.core.js');

function loadObjectPermission(doc){
    var dbObject = objectCore.getObjectFromDB(doc.object_name);
    var objectDataSourceName = objectCore.getDataSourceName(dbObject);

    if(!objectCore.canLoadObject(dbObject.name, objectDataSourceName)){
        console.warn('warn: Not loaded. Invalid custom permission_objects -> ', doc.name);
        return;
    }
    const pset = Creator.getCollection("permission_set").findOne({_id: doc.permission_set_id, space: doc.space});
    if(pset){
        const datasource = objectql.getDataSource(objectDataSourceName);
        datasource.setObjectSpacePermission(doc.object_name, doc.space, Object.assign({}, doc, {name: pset.name}));
    }
}

function removeObjectPermission(doc){
    var dbObject = objectCore.getObjectFromDB(doc.object_name);
    var objectDataSourceName = objectCore.getDataSourceName(dbObject);

    if(!objectCore.canLoadObject(dbObject.name, objectDataSourceName)){
        console.warn('warn: Not deleted. Invalid custom permission_objects -> ', doc.name);
        return;
    }
    const pset = Creator.getCollection("permission_set").findOne({_id: doc.permission_set_id, space: doc.space});
    if(pset){
        const datasource = objectql.getDataSource(objectDataSourceName);
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
    var config = objectql.getSteedosConfig();
    if(config.tenant && config.tenant.saas){
        return ;
    }else{
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
    }
});