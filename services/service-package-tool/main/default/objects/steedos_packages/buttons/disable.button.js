module.exports = {
    disable: function (object_name, record_id) {
        const record = Creator.odata.get(object_name, record_id);
        const nodesSelect = Steedos.PackageRegistry.getNodesSelect();
        swal({
            title: `停用`,
            text: `确定要停用${record.name}?${nodesSelect}`,
            html: true,
            showCancelButton: true,
            confirmButtonText: '停用',
            cancelButtonText: TAPi18n.__('Cancel')
        }, function (option) {
            if (option) {
                toastr.info('停用中，请稍后...', null, {timeOut: false});
                Steedos.authRequest(Steedos.absoluteUrl('/api/nodes/disable'), {
                    type: 'post', async: false, data: JSON.stringify({
                        module: record.name,
                        nodeID: window.$("#steedos_package_main_node").val()
                    }),
                    success: function(){
                        setTimeout(function(){
                            if (record_id) {
                                SteedosUI.reloadRecord(object_name, record_id)
                            }
                            toastr.clear();
                            toastr.success('已停用');
                            FlowRouter.reload()
                        }, 1000 * 5)
                    },
                    error: function(XMLHttpRequest){
                        toastr.clear();
                        toastr.error(XMLHttpRequest.responseJSON.error);
                    }
                })
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