
module.exports = {
    install: function (object_name, record_id) {
        const record = Creator.odata.get(object_name,record_id);
        swal({
            title: `安装`,
            text: `确定要安装${record.name}?`,
            html: true,
            showCancelButton: true,
            confirmButtonText: '安装',
            cancelButtonText: TAPi18n.__('Cancel')
        }, function (option) {
            if (option) {
                toastr.info('安装中，请稍后...', null, {timeOut: false});
                Steedos.authRequest(Steedos.absoluteUrl('/api/nodes/install'), {type: 'post', async: false, data: JSON.stringify({
                    module: record.name,
                    version: record.new_version,
                })})
                setTimeout(function(){
                    if(record_id){
                        SteedosUI.reloadRecord(object_name, record_id)
                    }
                    toastr.clear();
                    toastr.success('已安装');
                    FlowRouter.reload()
                }, 1000 * 10)
            }
        })
        
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