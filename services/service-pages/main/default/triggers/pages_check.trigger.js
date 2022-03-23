const objectql = require('@steedos/objectql');
const _ = require('lodash');
module.exports = {
    listenTo: 'pages',
    beforeUpdate: async function(){
        const {object_name, doc, spaceId, id} = this;
        if(_.has(doc, 'type') || _.has(doc, 'render_engine')){
            const record = await objectql.getObject('pages').findOne(id);
            if(_.has(doc, 'type') && doc.type != record.type){
                throw new Error('禁止修改页面类型');
            }
            if(_.has(doc, 'render_engine') && doc.render_engine != record.render_engine){
                throw new Error('禁止修改页面渲染器');
            }
        }
        
        if(_.has(doc, 'is_archived') && !doc.is_archived){
            let type = null;
            if(_.has(doc, 'type')){
                type = doc.type
            }else{
                const record = await objectql.getObject('pages').findOne(id);
                type = record.type;
            }
            if(type === 'app'){
                throw new Error('禁止停用应用程序页面');
            }
        }
    }
}