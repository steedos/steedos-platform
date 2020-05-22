var objectql = require('@steedos/objectql');
var objectCore = require('./objects.lib.js');
const defaultDatasourceName = 'default';
function reloadObject(objectName, objectDataSourceName){
    const datasource = objectql.getDataSource(objectDataSourceName);
    if(!datasource){
        return 
    }
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
    try {
        //给对象添加触发器
        objectql.addObjectListenerConfig({
            _id: doc._id,
            listenTo: doc.object,
            [doc.when]: eval(`(async function(){${doc.todo}})`)//warn: 此处代码存在风险
        });
        reloadObject(doc.object, objectDataSourceName);
    } catch (error) {
        console.log('info', error.message)
    }
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


module.exports = {
    loadObjectTrigger,removeObjectTrigger
}