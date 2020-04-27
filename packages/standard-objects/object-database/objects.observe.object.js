var objectql = require('@steedos/objectql');

function loadObject(doc){
    if(!doc.name.endsWith("__c")){
        console.warn('warn: Not loaded. Invalid custom object -> ', doc.name);
        return;
    }
    const datasource = objectql.getDataSource();
    //继承base
    objectql.addObjectConfig(doc, 'default');
    //获取到继承后的对象
    const _doc = objectql.getObjectConfig(doc.name);
    datasource.setObject(doc.name, _doc);
    try {
        Creator.Objects[doc.name] = doc;
        Creator.loadObjects(doc, doc.name);
    } catch (error) {
        console.log('error', error);
    }
}

function removeObject(doc){
    if(!doc.name.endsWith("__c")){
        console.warn('warn: Not deleted. Invalid custom object -> ', doc.name);
        return;
    }
    const datasource = objectql.getDataSource();
    objectql.removeObjectConfig(doc.name, 'default');
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