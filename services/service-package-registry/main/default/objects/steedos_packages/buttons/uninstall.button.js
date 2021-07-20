module.exports = {
    uninstall: function (object_name, record_id) {
        const record = Creator.odata.get(object_name,record_id);
        Steedos.authRequest(Steedos.absoluteUrl('/api/nodes/uninstall'), {type: 'post', async: false, data: JSON.stringify({
            module: record.name
        })})
        if(record_id){
            SteedosUI.reloadRecord(object_name, record_id)
        }
        FlowRouter.reload()
    },
    uninstallVisible: function (object_name,record_id) {
        const record = Creator.odata.get(object_name,record_id);
        if(record.local){
            return false;
        }
        if(record.status){
            return true;
        }
        return false
    }
}