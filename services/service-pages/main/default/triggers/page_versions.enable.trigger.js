const objectql = require('@steedos/objectql');
const _ = require('underscore');

module.exports = {
    listenTo: 'page_versions',
    afterUpdate: async function(){
        const {id, doc, previousDoc} = this;
        if(_.has(doc, 'is_active') && doc.is_active && previousDoc.is_active != doc.is_active ){
            const record = await objectql.getObject('page_versions').findOne(id)
            await objectql.getObject('pages').directUpdate(record.page, {
                is_active: true,
                version: record.version,
            })
        }
    }
}