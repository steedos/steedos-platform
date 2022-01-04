module.exports = {
    standard_deleteVisible: function (object_name, record_id) {
        var record = Creator.odata.get(object_name, record_id, "_relatedFrom");
        if(record && record._relatedFrom){
            return false;
        }
        return true;
    }
}