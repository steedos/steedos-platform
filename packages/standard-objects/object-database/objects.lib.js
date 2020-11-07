var objectql = require('@steedos/objectql');
const defaultDatasourceName = 'default';

function canLoadObject(name, datasource){
    var config = objectql.getSteedosConfig();
    if(config.tenant && config.tenant.saas){
        return false;
    }
    return true;
    // if(!datasource || datasource === defaultDatasourceName){
    //     if(name.endsWith('__c')){
    //         return false;
    //     }else{
    //         return true;
    //     }
    // }else{
    //     return true;
    // }
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

function getObjectFromDB(objectName){
    if(!objectName){
        return 
    }
    return Creator.getCollection("objects").findOne({name: objectName})
}

module.exports = {
    getDataSourceName,canLoadObject,getObjectFromDB
}