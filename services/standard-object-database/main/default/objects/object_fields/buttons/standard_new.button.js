module.exports = {
    standard_newVisible: function (object_name, record_id, permission, data) {
        if(!Creator.isSpaceAdmin()){
            return false
        }
        var record = data && data.record;
        if(!record){
            record = Creator.odata.get("objects", record_id, "is_deleted");
        }
        return record && record.created;
    }
}