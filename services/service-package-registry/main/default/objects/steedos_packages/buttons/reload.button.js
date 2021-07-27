module.exports = {
    reload: function (object_name, record_id) {
        toastr.info('重新加载中，请稍后...', null, {timeOut: false});
        const record = Creator.odata.get(object_name,record_id);
        Steedos.authRequest(Steedos.absoluteUrl('/api/nodes/reload'), {type: 'post', async: false, data: JSON.stringify({
            module: record.name
        })})
        setTimeout(function(){
            if(record_id){
                SteedosUI.reloadRecord(object_name, record_id)
            }
            toastr.clear();
            toastr.success('已重新加载');
            FlowRouter.reload()
        }, 1000 * 5)
        
    },
    reloadVisible: function (object_name,record_id) {
        const record = Creator.odata.get(object_name,record_id);
        if(record.status === 'enable'){
            return true;
        }
        return false
    }
}