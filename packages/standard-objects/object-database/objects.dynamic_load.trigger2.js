var objectql = require('@steedos/objectql');

module.exports = {

    listenTo: 'objects',

    afterInsert: async function () {
        
    },
    afterUpdate: async function () {
        console.log('afterUpdate doc', this.doc);
        // const datasource = objectql.getDataSource();
        // datasource.setObject();
    },
    afterDelete: async function () {

        
    }
}