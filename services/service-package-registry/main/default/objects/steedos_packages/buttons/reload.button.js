module.exports = {
    reload: function (object_name, record_id) {
        const record = Creator.odata.get(object_name,record_id);
        Steedos.authRequest(Steedos.absoluteUrl('/api/nodes/reload'), {type: 'post', async: false, data: JSON.stringify({
            module: record.name
        })})
        if(record_id){
            SteedosUI.reloadRecord(object_name, record_id)
        }
        FlowRouter.reload()
    },
    reloadVisible: function (object_name,record_id) {
        const record = Creator.odata.get(object_name,record_id);
        if(record.status === 'enable'){
            return true;
        }
        return false
    }
}