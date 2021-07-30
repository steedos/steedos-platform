module.exports = {
    disable: function (object_name, record_id) {
        const record = Creator.odata.get(object_name, record_id);
        swal({
            title: `禁用`,
            text: `确定要禁用${record.name}?`,
            html: true,
            showCancelButton: true,
            confirmButtonText: '禁用',
            cancelButtonText: TAPi18n.__('Cancel')
        }, function (option) {
            if (option) {
                toastr.info('禁用中，请稍后...', null, {timeOut: false});
                Steedos.authRequest(Steedos.absoluteUrl('/api/nodes/disable'), {
                    type: 'post', async: false, data: JSON.stringify({
                        module: record.name
                    })
                })
                setTimeout(function(){
                    if (record_id) {
                        SteedosUI.reloadRecord(object_name, record_id)
                    }
                    toastr.clear();
                    toastr.success('已禁用');
                    FlowRouter.reload()
                }, 1000 * 5)
            }
        })
    },
    disableVisible: function (object_name, record_id) {
        const record = Creator.odata.get(object_name, record_id);
        if (record.status === 'enable') {
            return true;
        }
        return false
    }
}