module.exports = {
    standard_newVisible: function (object_name, record_id, permission, data) {
        if (!record_id) {
            return false;
        }
        if(!Steedos.isSpaceAdmin()){
            return false
        }
        var record = data && data.record;
        if(!record){
            return false;
        }
        return record && record.created;
    }
}