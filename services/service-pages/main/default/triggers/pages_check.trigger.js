const objectql = require('@steedos/objectql');
const _ = require('lodash');
module.exports = {
    listenTo: 'pages',
    beforeUpdate: async function(){
        const {object_name, doc, spaceId, id} = this;
        if(_.has(doc, 'type') || _.has(doc, 'render_engine')){
            const record = await objectql.getObject('pages').findOne(id);
            if(_.has(doc, 'type') && doc.type != record.type){
                throw new Error('page_check_error_prohibit_modifying_page_types');
            }
            if(_.has(doc, 'render_engine') && doc.render_engine != record.render_engine){
                throw new Error('page_check_error_prohibit_modifying_page_renderer');
            }
        }
        
        if(_.has(doc, 'is_active') && !doc.is_active){
            let type = null;
            if(_.has(doc, 'type')){
                type = doc.type
            }else{
                const record = await objectql.getObject('pages').findOne(id);
                type = record.type;
            }
            if(type === 'app'){
                throw new Error('page_check_error_prohibit_disabling_application_pages');
            }
        }
    }
}