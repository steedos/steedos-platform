/*
 * @Author: sunhaolin@hotoa.com
 * @Date: 2022-03-31 18:46:00
 * @LastEditors: sunhaolin@hotoa.com
 * @LastEditTime: 2022-04-01 08:43:15
 * @Description: 
 */

module.exports = {
    customize: function (object_name, record_id, fields) {
        var doc = Creator.odata.get(object_name, record_id);
        var newDoc = {}
        _.each(Creator.getObject(object_name).fields, function (v, k) {
            if (_.has(doc, k)) {
                newDoc[k] = doc[k]
            }
        })
        delete newDoc.is_system;
        newDoc._id = record_id;

        Creator.odata.insert(object_name, Object.assign(newDoc), function (result, error) {
            if (result) {
                let versionMetaDoc = Creator.getObjectRecord('process_versions', newDoc._id);
                let versionDoc = {
                    description: versionMetaDoc.description,
                    entry_criteria: versionMetaDoc.entry_criteria,
                    is_active: false,
                    process: result._id,
                    schema: versionMetaDoc.schema,
                    version: 1,
                    when: versionMetaDoc.when,
                    _id: versionMetaDoc._id
                };
                Creator.odata.insert('process_versions', versionDoc, function (version, error) {
                    if (version) {
                        SteedosUI.reloadRecord(object_name, record_id);
                        FlowRouter.reload();
                        FlowRouter.go(`/app/-/${object_name}/view/${result._id}`)
                    }
                });
            }
        });
    },
    customizeVisible: function (object_name, record_id, record_permissions, data) {
        return false;
        // var record = data && data.record;
        // return record && Steedos.Object.base.actions.standard_new.visible() && record.is_system;
    }
}
