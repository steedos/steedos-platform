var objectql = require('@steedos/objectql');

function getDataSource(doc){
    if(doc.datasource && doc.datasource != 'default'){
        let datasource = Creator.getCollection("datasources").findOne({_id: doc.datasource})
        return datasource;
    }
}

function getDataSourceName(doc){
    if(doc.datasource && doc.datasource != 'default'){
        let datasource = Creator.getCollection("datasources").findOne({_id: doc.datasource})
        if(datasource){
            return datasource.name
        }else{
            throw new Error('not find datasource ', doc.datasource);
        }
    }
    return 'default'
}

function loadObject(doc){
    if(!doc.name.endsWith("__c") && !doc.datasource){
        // console.warn('warn: Not loaded. Invalid custom object -> ', doc.name);
        return;
    }

    var datasourceDoc = getDataSource(doc);
    if(doc.datasource && doc.datasource != 'default' && (!datasourceDoc || !datasourceDoc.is_enable)){
        console.warn('warn: Not loaded. Invalid custom object -> ', doc.name, doc.datasource);
        return ;
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
        if(!datasourceName || datasourceName == 'default'){
            Creator.Objects[doc.name] = doc;
            Creator.loadObjects(doc, doc.name);
        }
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
    const datasource = objectql.getDataSource(datasourceName);
    objectql.removeObjectConfig(doc.name, datasourceName);
    datasource.removeObject(doc.name);
    if(!datasourceName || datasourceName == 'default'){
        Creator.removeObject(doc.name);
    }
}

module.exports = {
    loadObject,removeObject
}