var objectql = require('@steedos/objectql');
var objectCore = require('./objects.core.js');
const defaultDatasourceName = 'default';
function reloadObject(objectName, objectDataSourceName){
    const datasource = objectql.getDataSource(objectDataSourceName);
    //获取到最新的对象
    const object = objectql.getObjectConfig(objectName);
    datasource.setObject(object.name, object);
    try {
        if(!objectDataSourceName || objectDataSourceName == defaultDatasourceName){
            Creator.Objects[object.name] = object;
            Creator.loadObjects(object, object.name);
        }
    } catch (error) {
        console.log('error', error);
    }
}

function loadObjectTrigger(doc){

    var dbObject = objectCore.getObjectFromDB(doc.object);
    var objectDataSourceName = objectCore.getDataSourceName(dbObject);

    if(!dbObject || !objectCore.canLoadObject(dbObject.name, objectDataSourceName)){
        console.warn('warn: Not loaded. Invalid custom object_triggers -> ', doc.name);
        return;
    }
    console.log('load object trigger', doc._id, doc.object, doc.when);
    //给对象添加触发器
    objectql.addObjectListenerConfig({
        _id: doc._id,
        listenTo: doc.object,
        [doc.when]: eval(`(async function(){${doc.todo}})`)//warn: 此处代码存在风险
    });
    reloadObject(doc.object, objectDataSourceName);
}

function removeObjectTrigger(doc){
    var dbObject = objectCore.getObjectFromDB(doc.object);
    var objectDataSourceName = objectCore.getDataSourceName(dbObject);
    if(!objectCore.canLoadObject(dbObject.name, objectDataSourceName)){
        console.warn('warn: Not deleted. Invalid custom object -> ', doc.name);
        return;
    }
    console.log('remove object trigger', doc._id, doc.object, doc.when);
    objectql.removeObjectListenerConfig(doc._id, doc.object, doc.when);
    reloadObject(doc.object, objectDataSourceName);
}

Meteor.startup(function () {
    var _change, _remove;
    _change = function (document) {
        loadObjectTrigger(document)
    };
    _remove = function (document) {
        removeObjectTrigger(document);
    };
    var config = objectql.getSteedosConfig();
    if(config.tenant && config.tenant.saas){
        return ;
    }else{
        Creator.getCollection("object_triggers").find({is_enable: true}, {
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