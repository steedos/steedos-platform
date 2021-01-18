var objectql = require('@steedos/objectql');
var objectCore = require('./objects.lib.js');

function loadObjectPermission(doc){
    var dbObject = objectCore.getObjectFromDB(doc.object_name);
    var objectDataSourceName = objectCore.getDataSourceName(dbObject);

    if(!dbObject){
        try {
            objectDataSourceName = objectql.getObject(doc.object_name).datasource.name;
        } catch (error) {
            console.warn('warn: Not loaded. Invalid custom permission_objects -> ', doc.name, doc.object_name);
            return;
        }
    }

    if(dbObject && !objectCore.canLoadObject(dbObject.name, objectDataSourceName)){
        console.warn('warn: Not loaded. Invalid custom permission_objects -> ', doc.name, doc.object_name);
        return;
    }
    const pset = Creator.getCollection("permission_set").findOne({_id: doc.permission_set_id, space: doc.space});
    if(pset){
        const datasource = objectql.getDataSource(objectDataSourceName);
        if(datasource){
            datasource.setObjectSpacePermission(doc.object_name, doc.space, Object.assign({}, doc, {name: pset.name}));
        }
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
        if(datasource){
            datasource.removeObjectSpacePermission(doc.object_name, doc.space, pset.name)
        }
    }
}

module.exports = {
    loadObjectPermission,removeObjectPermission
}