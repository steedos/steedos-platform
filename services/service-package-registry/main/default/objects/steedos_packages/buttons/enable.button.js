module.exports = {
    enable: function (object_name, record_id) {
        const record = Creator.odata.get(object_name,record_id);
        swal({
            title: `启用`,
            text: `确定要启用${record.name}?`,
            html: true,
            showCancelButton: true,
            confirmButtonText: '启用',
            cancelButtonText: TAPi18n.__('Cancel')
        }, function (option) {
            if (option) {
                toastr.info('启用中，请稍后...', null, {timeOut: false});
                Steedos.authRequest(Steedos.absoluteUrl('/api/nodes/enable'), {type: 'post', async: false, data: JSON.stringify({
                    module: record.name
                })})
                setTimeout(function(){
                    if(record_id){
                        SteedosUI.reloadRecord(object_name, record_id)
                    }
                    toastr.clear();
                    toastr.success('已启用');
                    FlowRouter.reload()
                }, 1000 * 8)
            }
        })
    },
    enableVisible: function (object_name,record_id) {
        const record = Creator.odata.get(object_name,record_id);
        if(record.local || !record.version){
            return false;
        }
        if(record.status !== 'enable'){
            return true;
        }
        return false
    }
}