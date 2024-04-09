var objectql = require('@steedos/objectql');
const { DEFAULT_FIELD } = require('@steedos/metadata-core');
const register = require('@steedos/metadata-registrar');
const clone = require('clone');
const defaultDatasourceName = 'default';
const defaultDatasourcesName = ['default','meteor'];

const DB_OBJECT_SERVICE_NAME = '~database-objects';

const _ = require('underscore');

function canLoadObject(name, datasource) {
    // if(!datasource || datasource === defaultDatasourceName){
    //     if(!name.endsWith('__c')){
    //         return false;
    //     }else{
    //         return true;
    //     }
    // }else{
    //     return true;
    // }
    return true;
}

function removeObjectConfig(objectName){
    broker.call('objects.removeConfig', {
        objectName: objectName
    });
}

function getDataSource(doc) {
    if (doc.datasource && !_.include(defaultDatasourcesName, doc.datasource)) {
        let datasource = Creator.getCollection("datasources").findOne({ _id: doc.datasource })
        return datasource;
    }
}

function getDataSourceName(doc) {
    if (doc && doc.datasource && !_.include(defaultDatasourcesName, doc.datasource)) {
        let datasource = Creator.getCollection("datasources").findOne({ _id: doc.datasource })
        if (datasource) {
            return datasource.name
        } else {
            throw new Error('not find datasource ', doc.datasource);
        }
    }
    if(doc.datasource && _.include(defaultDatasourcesName, doc.datasource)){
        return doc.datasource
    }
    return defaultDatasourceName
}


function getObjectFields(object) {
    var object_fields = Creator.getCollection("object_fields").find({
        space: object.space,
        object: object.name
    }, {
        fields: {
            created: 0,
            modified: 0,
            owner: 0,
            created_by: 0,
            modified_by: 0
        },
        sort: {
            sort_no: 1
        }
    }).fetch();
    var fields = {};
    var table_fields = {};
    _.forEach(object_fields, function (f) {
        _.each(DEFAULT_FIELD, (value, key) => {
            if (!_.has(f, key)) {
                f[key] = value;
            }
        });
        var cf_arr, child_fields;
        if (/^[a-zA-Z_]\w*(\.\$\.\w+){1}[a-zA-Z0-9]*$/.test(f.name)) {
            cf_arr = f.name.split(".$.");
            child_fields = {};
            child_fields[cf_arr[1]] = f;
            if (!_.size(table_fields[cf_arr[0]])) {
                table_fields[cf_arr[0]] = {};
            }
            return _.extend(table_fields[cf_arr[0]], child_fields);
        } else {
            return fields[f.name] = f;
        }
    });
    _.each(table_fields, function (f, k) {
        if (fields[k].type === "grid") {
            if (!_.size(fields[k].fields)) {
                fields[k].fields = {};
            }
            return _.extend(fields[k].fields, f);
        }
    });
    return fields;
}

function getObjectActions(object) {
    var object_actions = Creator.getCollection("object_actions").find({
        object: object.name,
        space: object.space,
        is_enable: true
    }, {
        fields: {
            created: 0,
            modified: 0,
            owner: 0,
            created_by: 0,
            modified_by: 0
        }
    }).fetch();
    var actions = {};
    _.forEach(object_actions, function (f) {
        return actions[f.name] = f;
    });
    return actions;
}

function getObjectRelateList(object) {
    var relatedList = Creator.getCollection("object_related_list").find({
        space: object.space,
        object_name: object.name
      }, {
        sort: {sort_no: -1},
        fields: {
          _id: 0,
          space: 0,
          object_name: 0,
          created: 0,
          modified: 0,
          owner: 0,
          created_by: 0,
          modified_by: 0
        }
      }).fetch();
    return relatedList;
}


function loadDBObject(object){
    let fields = getObjectFields(object);
    let actions = getObjectActions(object);
    let relatedList = getObjectRelateList(object);
    objectql.extend(object, {fields: fields}, {actions: actions}, {relatedList: relatedList});
    _.each(actions, function(action){
        action._visible = action.visible;
        register.addLazyLoadButtons(action.object, action);
    })
}


let _objectConfigs = [];
let _setTimeoutId = null;
function _sendObjectMeta(objectConfig){

    if(_setTimeoutId){
        clearTimeout(_setTimeoutId);
    }

    _objectConfigs.push(objectConfig);

    _setTimeoutId = setTimeout(function(){
        var length = _objectConfigs.length
        register.MetadataRegister.addObjectConfigs(DB_OBJECT_SERVICE_NAME, _objectConfigs).then(function(res){         
            if(res){
                // console.log('send object meta success', length);
                broker.broadcast("$packages.statisticsActivatedPackages", {});
            }
        })
        _objectConfigs = [];
        _setTimeoutId = null;
    }, 300)

    
}


function loadObject(doc, oldDoc) {
    try {
        if (!canLoadObject(doc.name, doc.datasource)) {
            console.warn('warn: Not loaded. Invalid custom object -> ', doc.name);
            return;
        }
        
        var datasourceDoc = getDataSource(doc);
        if (doc.datasource && !_.include(defaultDatasourcesName, doc.datasource) && (!datasourceDoc || !datasourceDoc.is_enable)) {
            console.warn('warn: Not loaded. Invalid custom object -> ', doc.name, doc.datasource);
            return;
        }
        var datasourceName = getDataSourceName(doc);
        const datasource = objectql.getDataSource(datasourceName);
    
        if (!datasource) {
            console.warn(`warn: Not loaded object [${doc.name}]. Cant not find datasource -> `, datasourceName);
            return;
        }
    
        if (oldDoc) {
            var oldDatasourceName = getDataSourceName(oldDoc);
            if (datasourceName != oldDatasourceName) {
                const oldDatasource = objectql.getDataSource(oldDatasourceName);
                if (oldDatasource) {
                    oldDatasource.removeObject(oldDoc.name);
                    objectql.removeObjectConfig(oldDoc.name, oldDatasourceName);
                }
            }
        }
    
        if (oldDoc && doc.name != oldDoc.name) {
            removeObject(oldDoc, true);
        }
    
        if (datasourceName === defaultDatasourceName) {
            delete doc.table_name
        }
        //继承base
        loadDBObject(doc);
        const originalObject = clone(doc);
        
        // 由于外部数据源对象的datasource属性存的是datasource._id的值，故这里转换为datasoruce.name
        if(!_.include(defaultDatasourcesName, originalObject.datasource)) { 
            originalObject.datasource = datasourceName;
        }

        originalObject.isMain = true;

        const objConfig = register.getOriginalObjectConfig(doc.name);

        if(objConfig){
            _.each(objConfig.fields, (config, name)=>{
                if(!config._id && !doc.fields[name]){
                    doc.fields[name] = config;
                }
            })
        }

        register.addObjectConfig(doc, datasourceName);
        register.loadObjectLazyListViews(doc.name);
        register.loadObjectLazyActions(doc.name);
        register.loadActionScripts(doc.name);
        register.loadObjectLazyMethods(doc.name);
        register.loadObjectLazyListenners(doc.name);
        register.loadObjectLazyButtons(doc.name);
        //获取到继承后的对象
        // const _doc = objectql.getObjectConfig(doc.name);
        // console.log(`loadObject===>`, doc.name)
        _sendObjectMeta(originalObject);
        
        
    } catch (error) {
        console.error(error)
    }
}

function removeObject(doc, enforce, reInitDatasource) {
    if (!enforce && !objectql.hasObjectSuffix(doc.name, doc.space) && !doc.datasource) {
        console.warn('warn: Not deleted. Invalid custom object -> ', doc.name);
        return;
    }
    var datasourceName = getDataSourceName(doc);
    const datasource = objectql.getDataSource(datasourceName);
    objectql.removeObjectConfig(doc.name, datasourceName);
    if (datasource) {
        datasource.removeObject(doc.name);
        if(reInitDatasource){
            datasource.init();
        }
    }
    if (!datasourceName || datasourceName == defaultDatasourceName) {
        Creator.removeObject(doc.name);
    }
}

function getObjectFromDB(objectName) {
    if (!objectName) {
        return
    }
    return Creator.getCollection("objects").findOne({ name: objectName })
}

function reloadObject(changeLog){
    var objectName = changeLog.object_name;
    var data = changeLog.change_data;
    const objectRecord = Creator.getCollection("objects").findOne({
        name: objectName
      })
    var objectDataSourceName = '';
    if(objectRecord){
        objectDataSourceName = getDataSourceName(objectRecord);
    }else{
        objectDataSourceName = objectql.getObject(objectName).datasource.name;
    }
    const deleted = {
        fields: [],
        actions: []
    }
    if((!objectRecord || objectRecord.is_system == true) && objectDataSourceName){

        switch (data.type) {
            case 'field':
                if(data.event === 'remove'){
                    deleted.fields.push(data.value.name);
                    register.removeObjectFieldConfig(objectName, data.value);
                }else{
                    if(data.event === 'update'){
                        if(data.value._previousName != data.value.name){
                            deleted.fields.push(data.value._previousName);
                            register.removeObjectFieldConfig(objectName, {name: data.value._previousName});
                        }
                    }
                    register.addObjectFieldConfig(objectName, data.value);
                }
                break;
            case 'action':
                if(data.event === 'remove'){
                    deleted.actions.push(data.value.name);
                    register.removeObjectButtonsConfig(objectName, data.value);
                }else{
                    if(data.event === 'update'){
                        if(data.value._previousName != data.value.name){
                            deleted.actions.push(data.value._previousName);
                            register.removeObjectButtonsConfig(objectName, {name: data.value._previousName});
                        }
                    }
                    if(data.value.is_enable){
                        register.addObjectButtonsConfig(objectName, data.value);
                    }else{
                        deleted.actions.push(data.value.name);
                        register.removeObjectButtonsConfig(objectName, data.value);
                    }
                }
                break;
            case 'related_list':
                console.log('TODO related_list');
                // objectql.addObjectFieldConfig(objectName, data.value);
                break;
            default:
                break;
        }

        const datasource = objectql.getDataSource(objectDataSourceName);
        if(!datasource){
            return 
        }
        //获取到最新的对象
        const object = register.getOriginalObjectConfig(objectName);

        let _mf =  _.max(_.values(object.fields), function (field) { return field.sort_no; });
        if(_mf && object.name){
            object.fields_serial_number = _mf.sort_no + 10;
        }

        if(deleted.fields.length == 0){
            deleted.fields = null;
        }
        if(deleted.actions.length == 0){
            deleted.actions = null;
        }
        // console.log(`reloadObject===>`, object.name)
        objectql.getSteedosSchema().metadataRegister.addObjectConfig(DB_OBJECT_SERVICE_NAME, Object.assign({}, object, {isMain:false, __deleted: deleted})).then(function(res){            
            if(res){
                // datasource.setObject(object.name, object);
                // try {
                //     if(!objectDataSourceName || objectDataSourceName == defaultDatasourceName){
                //         Creator.Objects[object.name] = object;
                //         Creator.loadObjects(object, object.name);
                //     }
                // } catch (error) {
                //     console.log('error', error);
                // }
                broker.broadcast("$packages.statisticsActivatedPackages", {});
            }
        })
    }

}

function triggerReloadObject(objectName, type, value, event){
    const objectRecord = Creator.getCollection("objects").findOne({
        name: objectName
      })
    if(objectRecord && objectRecord.is_system != true){
        //TODO 待支持动态加载related_list后， 删除此行代码
        // console.log(`triggerReloadObject===>`, objectName)
        Creator.getCollection("objects").update({name: objectName}, {$set: {reload_time: new Date()}})
    }else{
        Creator.getCollection("_object_reload_logs").insert({
            object_name: objectName,
            change_data: {
                type: type,
                event: event,
                value: value
            },
            change_time: new Date(),
            space: value.space
        })
    }
}

module.exports = {
    loadObject, removeObject, getDataSourceName, canLoadObject, getObjectFromDB, getDataSource, reloadObject, triggerReloadObject, loadDBObject, removeObjectConfig
}