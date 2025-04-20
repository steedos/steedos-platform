const _ =require('lodash');
module.exports = {
    beforeInsert: async function(){
        const { doc } = this;
        delete doc.visible_type
        doc.visible;
    },
    beforeUpdate: async function(){
        const { doc, id } = this;
        if(doc.label){
            const dbRecord = await this.getObject('object_actions').findOne(id);

            const amis_schema = doc.amis_schema || dbRecord.amis_schema;
    
            if(dbRecord && dbRecord.label != doc.label && amis_schema && _.isString(amis_schema) ){
                try {
                    const json = JSON.parse(amis_schema);
                    json.body[0].label = doc.label
                    doc.amis_schema = JSON.stringify(json)
                } catch (error) {
                    console.log(error)
                }
            }
        }
        delete doc.visible_type
        doc.visible;
    },
    beforeFind: async function () {
        delete this.query.fields;
    }
}