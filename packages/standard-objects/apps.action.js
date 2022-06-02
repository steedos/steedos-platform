/*
 * @Author: baozhoutao@hotoa.com
 * @Date: 2021-12-27 10:49:33
 * @LastEditors: sunhaolin@hotoa.com
 * @LastEditTime: 2022-05-30 11:53:17
 * @Description: 
 */
module.exports = {
    customize: function (object_name, record_id, fields) {
        var doc = Creator.odata.get(object_name, record_id);
        var newRecord = _.pick(doc, Creator.getObjectFieldsName(object_name));
        delete newRecord.is_system;
        delete newRecord._id;
        delete newRecord.record_permissions;
        newRecord.from_code_id = record_id;
        Creator.odata.insert(object_name, newRecord, function(result, error){
            if(result){
                FlowRouter.go(`/app/-/${object_name}/view/${result._id}`)
            }
        });
            
    },
    customizeVisible: function(object_name, record_id, record_permissions, record){
        if(record._id === 'admin'){return false;}
        return Creator.baseObject.actions.standard_new.visible() && record.is_system && !record.from_code_id;
    },
    reset: function(object_name, record_id, fields){
        var record = Creator.odata.get(object_name, record_id);
        var doc = Creator.odata.get(object_name, record.from_code_id);
        var newRecord = _.pick(doc, Creator.getObjectFieldsName(object_name));
        newRecord.from_code_id = newRecord._id;
        delete newRecord.is_system;
        delete newRecord._id;
        delete newRecord.record_permissions;
        Creator.odata.update(object_name, record_id, newRecord);
        FlowRouter.reload();
    },
    resetVisible: function(object_name, record_id, record_permissions, record){
        if(Creator.baseObject.actions.standard_edit.visible()){
            return record.from_code_id;
        }
    },
    createOAuth2App: function (object_name) {
        const fields = Creator.getObject(object_name).fields;
        const oauthAppFields = {};
        _.map(fields, function (v, k) {
            if (k) {
                if (_.include(['name', 'code', 'visible', 'description', 'is_creator', 'mobile', 'sort', 'is_use_iframe', 'is_new_window'], k) || k.startsWith("oauth2")) {
                    oauthAppFields[k] = v;
                }
            }
        });
        const onFinish = async (values = {}) => {
            return new Promise((resolve, reject) => {
                try {
                    console.log(`values`, values)
                    Creator.odata.insert(object_name, values)
                    setTimeout(function () { FlowRouter.reload() }, 100)
                    resolve(true);
                } catch (error) {
                    console.error(`e2`, error);
                    reject(false);
                }
            })
        }
        SteedosUI.showModal(stores.ComponentRegistry.components.ObjectForm, {
            name: "createOAuth2App",
            title: '创建 OAuth 应用',
            objectSchema: {
                fields: oauthAppFields
            },
            // initialValues: initialValues,
            onFinish: onFinish //onFinishByFrame
        }, null, { iconPath: '/assets/icons' })
    },
    createOAuth2AppVisible: function () {
        return false && Creator.baseObject.actions.standard_new.visible();
    }
}