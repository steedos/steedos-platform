const objectql = require('@steedos/objectql');
module.exports = {
    listenTo: 'queries',
    afterInsert: async function(){
        const {doc} = this;
        const name = await objectql.getObject('charts')._makeNewID()
        await objectql.getObject('charts').insert({
            query: doc.name,
            name: name,
            label:"Table",
            description:"",
            type:"TABLE",
            options: {},
            space: doc.space,
            owner: doc.owner,
            created_by: doc.owner,
            modified_by: doc.owner,
            company_id: doc.company_id,
            company_ids: doc.company_ids
        })
    }
}