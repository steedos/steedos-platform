const objectql = require('@steedos/objectql');
const _ = require('underscore');

module.exports = {
    listenTo: 'page_versions',
    beforeUpdate: async function(){
        const {id, doc} = this;
        const record = await objectql.getObject('page_versions').findOne(id);
        if(record){
            const getLatestPageVersion = await objectql.getSteedosSchema().broker.call('page.getLatestPageVersion', {
                pageId: record.page
            })
            if(getLatestPageVersion._id != id){
                throw new Error('禁止修改非最新版');
            }
        }
        // if(_.has(doc, 'is_archived') && !doc.is_archived){
            
        // }
    }
}