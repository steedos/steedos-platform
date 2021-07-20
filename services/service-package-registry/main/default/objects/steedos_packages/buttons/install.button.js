
module.exports = {
    install: function (object_name, record_id) {
        const record = Creator.odata.get(object_name,record_id);
        Steedos.authRequest(Steedos.absoluteUrl('/api/nodes/install'), {type: 'post', async: false, data: JSON.stringify({
            module: record.name,
            version: record.new_version,
        })})
        if(record_id){
            SteedosUI.reloadRecord(object_name, record_id)
        }
        FlowRouter.reload()
    },
    installVisible: function (object_name,record_id) {
        const record = Creator.odata.get(object_name,record_id);
        if(record.local){
            return false;
        }
        if(!record.status){
            return true;
        }
        return false
    }
}