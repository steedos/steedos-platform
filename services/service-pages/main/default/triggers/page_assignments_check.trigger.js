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

        if(doc.type === 'orgDefault'){
            delete doc.app;
            delete doc.profile;
        }

        if(doc.type === 'appDefault'){
            delete doc.profile;
        }

        if(doc.type === 'orgDefault'){
            const count = await objectql.getObject('page_assignments').count({filters: [['page', '=', doc.page], ['type', '=', doc.type]]})
            if(count > 0){
                throw new Error("已存在「组织默认设置」授权")
            }
        }

        if(doc.type === 'appDefault'){
            const count = await objectql.getObject('page_assignments').count({filters: [['page', '=', doc.page], ['type', '=', doc.type], ['app', '=', doc.app]]})
            if(count > 0){
                throw new Error("已存在「应用程序默认设置」授权")
            }
        }

        if(doc.type === 'appRecordProfile'){
            const count = await objectql.getObject('page_assignments').count({filters: [['page', '=', doc.page], ['type', '=', doc.type], ['app', '=', doc.app], ['profile', '=', doc.profile]]})
            if(count > 0){
                throw new Error("已存在「应用程序和简档」授权")
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

        if(doc.type === 'orgDefault'){
            doc.app = null;
            doc.profile = null;
        }

        if(doc.type === 'appDefault'){
            doc.profile = null;
        }

        if(doc.type === 'orgDefault'){
            const count = await objectql.getObject('page_assignments').count({filters: [['_id', '!=', id], ['page', '=', doc.page], ['type', '=', doc.type]]})
            if(count > 0){
                throw new Error("已存在「组织默认设置」授权")
            }
        }

        if(doc.type === 'appDefault'){
            const count = await objectql.getObject('page_assignments').count({filters: [['_id', '!=', id], ['page', '=', doc.page], ['type', '=', doc.type], ['app', '=', doc.app]]})
            if(count > 0){
                throw new Error("已存在「应用程序默认设置」授权")
            }
        }

        if(doc.type === 'appRecordProfile'){
            const count = await objectql.getObject('page_assignments').count({filters: [['_id', '!=', id], ['page', '=', doc.page], ['type', '=', doc.type], ['app', '=', doc.app], ['profile', '=', doc.profile]]})
            if(count > 0){
                throw new Error("已存在「应用程序和简档」授权")
            }
        }
    }
}