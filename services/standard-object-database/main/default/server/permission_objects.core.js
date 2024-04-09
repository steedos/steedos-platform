var objectql = require('@steedos/objectql');
var objectCore = require('./objects.lib.js');
var _ = require('lodash');

function loadObjectPermission(doc){
    var dbObject = objectCore.getObjectFromDB(doc.object_name);
    var objectDataSourceName = objectCore.getDataSourceName(dbObject);
    try {
        if(_.includes(['admin', 'user', 'customer', 'supplier'], doc.permission_set_id)){
            doc.name = doc.permission_set_id
        }else{
            const record = Creator.getCollection("permission_set").findOne(doc.permission_set_id);
            if(record){
                doc.name = record.name;
            }else{
                throw new Error(`Not found permission_set: ${doc.permission_set_id}`);
            }
        }
        objectql.addPermissionConfig(doc.object_name, doc);
    } catch (error) {
        console.error(error)
    }

    if(!dbObject){
        try {
            objectDataSourceName = objectql.getObject(doc.object_name).datasource.name;
        } catch (error) {
            // console.warn('warn: Not loaded. Invalid custom permission_objects -> ', doc.name, doc.object_name);
            return;
        }
    }

    if(dbObject && !objectCore.canLoadObject(dbObject.name, objectDataSourceName)){
        // console.warn('warn: Not loaded. Invalid custom permission_objects -> ', doc.name, doc.object_name);
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

    if(!dbObject){
        try {
            objectDataSourceName = objectql.getObject(doc.object_name).datasource.name;
        } catch (error) {
            console.warn('warn: Not loaded. Invalid custom permission_objects -> ', doc.name, doc.object_name);
            return;
        }
    }

    if(dbObject && !objectCore.canLoadObject(dbObject.name, objectDataSourceName)){
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