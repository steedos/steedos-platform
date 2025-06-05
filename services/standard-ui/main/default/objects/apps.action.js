/*
 * @Author: baozhoutao@hotoa.com
 * @Date: 2021-12-27 10:49:33
 * @LastEditors: 廖大雪 2291335922@qq.com
 * @LastEditTime: 2023-03-05 18:11:32
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
    customizeVisible: function(object_name, record_id, record_permissions, data){
        var record = data && data.record;
        if(record._id === 'admin'){return false;}
        return Steedos.Object.base.actions.standard_new.visible() && record.is_system && !record.from_code_id;
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
    resetVisible: function(object_name, record_id, record_permissions, data){
        const record = data && data.record;
        if(Steedos.Object.base.actions.standard_edit.visible(object_name, record_id, record_permissions)){
            return record.from_code_id;
        }
    }
}