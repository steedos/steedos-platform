module.exports = {
    customize: function (object_name, record_id, fields) {
        console.log(this)
        var doc = this.record.record;
        var newDoc = {}
        _.each(Creator.getObject(object_name).fields, function (v, k) {
            if (_.has(doc, k)) {
                newDoc[k] = doc[k]
            }
        })
        delete newDoc.is_system;

        Creator.odata.insert(object_name, Object.assign(newDoc), function (result, error) {
            if (result) {
                if (Session.get("object_name") === 'queue_import') {
                    FlowRouter.go(`/app/-/${object_name}/view/${result._id}`)
                } else {
                    href = Creator.getObjectUrl(object_name, result._id);
                    window.open(href, '_blank', 'width=800, height=600, left=50, top= 50, toolbar=no, status=no, menubar=no, resizable=yes, scrollbars=yes')
                }
            }
        });
    },
    customizeVisible: function (object_name, record_id, record_permissions, data) {
        var record = data && data.record;
        return record && Creator.baseObject.actions.standard_new.visible() && record.is_system;
    }
}
