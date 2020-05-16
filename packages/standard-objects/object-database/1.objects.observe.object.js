var objectql = require('@steedos/objectql');

function getDataSourceName(doc){
    if(doc.datasource){
        let datasource = Creator.getCollection("datasources").findOne({_id: doc.datasource})
        if(datasource){
            return datasource.name
        }else if(doc.datasource != 'default'){
            throw new Error('not find datasource ', doc.datasource);
        }
    }
    return 'default'
}

function loadObject(doc){
    if(!doc.name.endsWith("__c") && !doc.datasource){
        console.warn('warn: Not loaded. Invalid custom object -> ', doc.name);
        return;
    }
    var datasourceName = getDataSourceName(doc);
    const datasource = objectql.getDataSource(datasourceName);
    //继承base
    objectql.addObjectConfig(doc, datasourceName);
    //获取到继承后的对象
    const _doc = objectql.getObjectConfig(doc.name);
    datasource.setObject(doc.name, _doc);
    datasource.init();
    try {
        Creator.Objects[doc.name] = doc;
        Creator.loadObjects(doc, doc.name);
    } catch (error) {
        console.log('error', error);
    }
}

function removeObject(doc){
    if(!doc.name.endsWith("__c") && !doc.datasource){
        console.warn('warn: Not deleted. Invalid custom object -> ', doc.name);
        return;
    }
    var datasourceName = getDataSourceName(doc);
    console.log('removeObject', doc.name, doc.datasource);
    const datasource = objectql.getDataSource(datasourceName);
    objectql.removeObjectConfig(doc.name, datasourceName);
    datasource.removeObject(doc.name);
    Creator.removeObject(doc.name);
}

Meteor.startup(function () {
    var _changeServerObjects, _removeServerObjects, server_objects_init;
    _changeServerObjects = function (document) {
        loadObject(document)
    };
    _removeServerObjects = function (document) {
        removeObject(document);
    };

    var config = objectql.getSteedosConfig();
    if(config.tenant && config.tenant.saas){
        return ;
    }else{
        server_objects_init = false;
        Creator.getCollection("objects").find({}, {
            fields: {
                created: 0,
                created_by: 0,
                modified: 0,
                modified_by: 0
            }
        }).observe({
            added: function (newDocument) {
                if (!server_objects_init || _.has(newDocument, "fields")) {
                    return _changeServerObjects(newDocument);
                }
            },
            changed: function (newDocument, oldDocument) {
                return _changeServerObjects(newDocument);
            },
            removed: function (oldDocument) {
                return _removeServerObjects(oldDocument);
            }
        });
        server_objects_init = true;
    }
});