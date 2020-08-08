var objectql = require('@steedos/objectql');
const defaultDatasourceName = 'default';
var triggerCore = require('./object_triggers.core.js');
var permissionCore = require('./permission_objects.core.js');

function canLoadObject(name, datasource){
    if(!datasource || datasource === defaultDatasourceName){
        if(!name.endsWith('__c')){
            return false;
        }else{
            return true;
        }
    }else{
        return true;
    }
}

function getDataSource(doc){
    if(doc.datasource && doc.datasource != defaultDatasourceName){
        let datasource = Creator.getCollection("datasources").findOne({_id: doc.datasource})
        return datasource;
    }
}

function getDataSourceName(doc){
    if(doc && doc.datasource && doc.datasource != defaultDatasourceName){
        let datasource = Creator.getCollection("datasources").findOne({_id: doc.datasource})
        if(datasource){
            return datasource.name
        }else{
            throw new Error('not find datasource ', doc.datasource);
        }
    }
    return defaultDatasourceName
}

function loadObjectTriggers(object){
    Creator.getCollection("object_triggers").find({space: object.space, object: object.name, is_enable: true}, {
        fields: {
            created: 0,
            created_by: 0,
            modified: 0,
            modified_by: 0
        }
    }).forEach(function(trigger){
        triggerCore.loadObjectTrigger(trigger);
    })
}

function loadObjectPermission(object){
    Creator.getCollection("permission_objects").find({space: object.space, object_name: object.name}, {
        fields: {
            created: 0,
            created_by: 0,
            modified: 0,
            modified_by: 0
        }
    }).forEach(function(permission){
        permissionCore.loadObjectPermission(permission);
    })
}

function loadObject(doc, oldDoc){
    if(!canLoadObject(doc.name, doc.datasource)){
        console.warn('warn: Not loaded. Invalid custom object -> ', doc.name);
        return;
    }

    var datasourceDoc = getDataSource(doc);
    if(doc.datasource && doc.datasource != defaultDatasourceName && (!datasourceDoc || !datasourceDoc.is_enable)){
        console.warn('warn: Not loaded. Invalid custom object -> ', doc.name, doc.datasource);
        return ;
    }

    var datasourceName = getDataSourceName(doc);
    const datasource = objectql.getDataSource(datasourceName);

    if(!datasource){
        console.warn(`warn: Not loaded object [${doc.name}]. Cant not find datasource -> `, datasourceName);
        return ;
    }

    if(oldDoc){
        var oldDatasourceName = getDataSourceName(oldDoc);
        if(datasourceName != oldDatasourceName){
            const oldDatasource = objectql.getDataSource(oldDatasourceName);
            if(oldDatasource){
                oldDatasource.removeObject(oldDoc.name);
                objectql.removeObjectConfig(oldDoc.name, oldDatasourceName);
            }
        }
    }

    if(oldDoc && doc.name != oldDoc.name){
        datasource.removeObject(oldDoc.name);
    }

    if(datasourceName === defaultDatasourceName){
        delete doc.table_name
    }

    //继承base
    objectql.addObjectConfig(doc, datasourceName);
    objectql.loadObjectLazyListenners(doc.name);
    objectql.loadObjectLazyActions(doc.name);
    objectql.loadObjectLazyMethods(doc.name);
    //获取到继承后的对象
    const _doc = objectql.getObjectConfig(doc.name);
    datasource.setObject(doc.name, _doc);
    datasource.init();
    try {
        if(!datasourceName || datasourceName == defaultDatasourceName){
            Creator.Objects[doc.name] = _doc;
            Creator.loadObjects(_doc, _doc.name);
        }
    } catch (error) {
        console.log('error', error);
    }
    if(!oldDoc || (oldDoc && oldDoc.is_enable === false && doc.is_enable)){
        loadObjectTriggers(doc);
        loadObjectPermission(doc);
    }
}

function removeObject(doc){
    if(!doc.name.endsWith("__c") && !doc.datasource){
        console.warn('warn: Not deleted. Invalid custom object -> ', doc.name);
        return;
    }
    var datasourceName = getDataSourceName(doc);
    const datasource = objectql.getDataSource(datasourceName);
    objectql.removeObjectConfig(doc.name, datasourceName);
    if(datasource){
        datasource.removeObject(doc.name);
    }
    if(!datasourceName || datasourceName == defaultDatasourceName){
        Creator.removeObject(doc.name);
    }
}

function getObjectFromDB(objectName){
    if(!objectName){
        return 
    }
    return Creator.getCollection("objects").findOne({name: objectName})
}

module.exports = {
    loadObject,removeObject,getDataSourceName,canLoadObject,getObjectFromDB,getDataSource
}