const objectql = require('@steedos/objectql');

module.exports = {
    listenTo: 'page_assignments',
    beforeInsert: async function(){
        const {doc, spaceId} = this;
        if(doc.page){
            const record = await objectql.getObject('pages').findOne(doc.page);
            if(record.type === 'app'){
                throw new Error('page_assignments_error_not_allowed_to_application_pages');
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
                throw new Error("page_assignments_error_organization_default_already_exists")
            }
        }

        if(doc.type === 'appDefault'){
            const count = await objectql.getObject('page_assignments').count({filters: [['page', '=', doc.page], ['type', '=', doc.type], ['app', '=', doc.app]]})
            if(count > 0){
                throw new Error("page_assignments_error_application_default_already_exists")
            }
        }

        if(doc.type === 'appRecordProfile'){
            const count = await objectql.getObject('page_assignments').count({filters: [['page', '=', doc.page], ['type', '=', doc.type], ['app', '=', doc.app], ['profile', '=', doc.profile]]})
            if(count > 0){
                throw new Error("page_assignments_error_application_and_profile_already_exists")
            }
        }

    },
    beforeUpdate: async function(){
        const {object_name, doc, spaceId, id} = this;
        if(doc.page){
            const record = await objectql.getObject('pages').findOne(doc.page);
            if(record.type === 'app'){
                throw new Error('page_assignments_error_not_allowed_to_application_pages');
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
                throw new Error("page_assignments_error_organization_default_already_exists")
            }
        }

        if(doc.type === 'appDefault'){
            const count = await objectql.getObject('page_assignments').count({filters: [['_id', '!=', id], ['page', '=', doc.page], ['type', '=', doc.type], ['app', '=', doc.app]]})
            if(count > 0){
                throw new Error("page_assignments_error_application_default_already_exists")
            }
        }

        if(doc.type === 'appRecordProfile'){
            const count = await objectql.getObject('page_assignments').count({filters: [['_id', '!=', id], ['page', '=', doc.page], ['type', '=', doc.type], ['app', '=', doc.app], ['profile', '=', doc.profile]]})
            if(count > 0){
                throw new Error("page_assignments_error_application_and_profile_already_exists")
            }
        }
    }
}