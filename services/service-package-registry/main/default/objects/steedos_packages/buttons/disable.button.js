module.exports = {
    disable: function (object_name, record_id) {
        const record = Creator.odata.get(object_name,record_id);
        Steedos.authRequest(Steedos.absoluteUrl('/api/nodes/disable'), {type: 'post', async: false, data: JSON.stringify({
            module: record.name
        })})
        if(record_id){
            SteedosUI.reloadRecord(object_name, record_id)
        }
        FlowRouter.reload()
    },
    disableVisible: function (object_name,record_id) {
        const record = Creator.odata.get(object_name,record_id);
        if(record.local){
            return false;
        }
        if(record.status === 'enable'){
            return true;
        }
        return false
    }
}