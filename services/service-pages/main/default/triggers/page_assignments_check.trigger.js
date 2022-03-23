const objectql = require('@steedos/objectql');

module.exports = {
    listenTo: 'page_assignments',
    beforeInsert: async function(){
        const {doc, spaceId} = this;
        if(doc.page){
            const record = await objectql.getObject('pages').findOne(doc.page);
            if(record.type === 'app'){
                throw new Error('禁止给应用程序页面分配权限');
            }
        }
    },
    beforeUpdate: async function(){
        const {object_name, doc, spaceId, id} = this;
        if(doc.page){
            const record = await objectql.getObject('pages').findOne(doc.page);
            if(record.type === 'app'){
                throw new Error('禁止给应用程序页面分配权限');
            }
        }
    }
}