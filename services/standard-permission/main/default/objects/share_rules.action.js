const _ = require("underscore");
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

        Creator.odata.insert(object_name, Object.assign(newDoc), function (result, error) {
            if (result) {
                FlowRouter.go(`/app/-/${object_name}/view/${result._id}`)
            }
        });
    },
    customizeVisible: function (object_name, record_id, record_permissions, data) {
        var record = data && data.record;
        if (!record) {
            record = {}
        }
        return Steedos.Object.base.actions.standard_new.visible() && record.is_system;
    }
}