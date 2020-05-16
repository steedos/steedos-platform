var objectql = require('@steedos/objectql');
var schema = objectql.getSteedosSchema();

function loadDataSource(doc){
   console.log('loadDataSource', doc);
   if(doc.mssql_options){
       doc.options = JSON.parse(doc.mssql_options)
       delete doc.mssql_options
   }
   var datasource = schema.addDataSource(doc.name, doc); 
   datasource.init();
}


Meteor.startup(function () {
    var _change, _remove;
    _change = function (document) {
        loadDataSource(document)
    };
    _remove = function (document) {
        removeDataSource(document);
    };
    var config = objectql.getSteedosConfig();
    if(config.tenant && config.tenant.saas){
        return ;
    }else{
        Creator.getCollection("datasources").find({}, {
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