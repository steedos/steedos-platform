var objectql = require('@steedos/objectql');
var schema = objectql.getSteedosSchema();
var objectCore = require('./objects.core.js');
const datasourceCore = require('./datasources.core');

function loadDataSourceObjects(doc){
    Creator.getCollection('objects').find({space: doc.space, datasource: doc._id, is_enable: {$ne: false}}).forEach(function(object){
        objectCore.loadObject(object, null);
    })
}

function loadDataSource(doc, oldDoc, server_datasources_init) {
    try {
        datasourceCore.checkDriver(doc.driver);
        try {
            if (doc.mssql_options) {
                doc.options = JSON.parse(doc.mssql_options)
                delete doc.mssql_options
            }
    
            if(oldDoc && doc.name != oldDoc.name){
                removeDataSource(oldDoc);
            }
    
            var datasource = schema.addDataSource(doc.name, doc, true);
            datasource.init();
            if (server_datasources_init && oldDoc && oldDoc.is_enable === false && doc.is_enable) {
                loadDataSourceObjects(doc);
            }
        } catch (error) {
            console.error(`Load dataSource [${doc.name}] error: `, error.message)
        }
    } catch (error1) {
        console.error(`Load dataSource [${doc.name}] error: `, t(error1.message))
    }
}

function removeDataSource(doc){
    schema.removeDataSource(doc.name).catch(result => {
        console.error(result)
    })
}


Meteor.startup(function () {
    var _change = function (document, oldDocument, server_datasources_init) {
        loadDataSource(document, oldDocument, server_datasources_init)
    };
    var _remove = function (document) {
        removeDataSource(document);
    };
    var config = objectql.getSteedosConfig();
    if(config.tenant && config.tenant.saas){
        return ;
    }else{
        server_datasources_init = false;
        Creator.getCollection("datasources").find({}, {
            fields: {
                created: 0,
                created_by: 0,
                modified: 0,
                modified_by: 0
            }
        }).observe({
            added: function (newDocument) {
                if(newDocument.is_enable){
                    return _change(newDocument, null, server_datasources_init);
                }
            },
            changed: function (newDocument, oldDocument) {
                if(newDocument.is_enable){
                    return _change(newDocument, oldDocument, server_datasources_init);
                }else{
                    return _remove(oldDocument);
                }
            },
            removed: function (oldDocument) {
                return _remove(oldDocument);
            }
        });
        server_datasources_init = true;
    }
});