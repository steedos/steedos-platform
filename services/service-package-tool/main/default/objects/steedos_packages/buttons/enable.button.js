module.exports = {
    enable: function (object_name, record_id) {
        const record = Creator.odata.get(object_name,record_id);
        const nodesSelect = Steedos.PackageRegistry.getNodesSelect();
        swal({
            title: `启用`,
            text: `确定要启用${record.name}?${nodesSelect}`,
            html: true,
            showCancelButton: true,
            confirmButtonText: '启用',
            cancelButtonText: TAPi18n.__('Cancel')
        }, function (option) {
            if (option) {
                toastr.info('启用中，请稍后...', null, {timeOut: false});
                Steedos.authRequest(Steedos.absoluteUrl('/api/nodes/enable'), {type: 'post', async: false, data: JSON.stringify({
                        module: record.name,
                        nodeID: window.$("#steedos_package_main_node").val()
                    }),
                    success: function(data){
                        if(data.status == 1){
                            toastr.clear();
                            toastr.error(data.msg);
                            return;
                        }
                        setTimeout(function(){
                            if (FlowRouter.current().params.record_id) {
                                SteedosUI.reloadRecord(object_name, record_id)
                            }
                            toastr.clear();
                            toastr.success('已启用');
                            FlowRouter.reload()
                        }, 1000 * 8)
                    },
                    error: function(XMLHttpRequest){
                        toastr.clear();
                        toastr.error(XMLHttpRequest.responseJSON.error);
                    }
                })
            }
        })
    },
    enableVisible: function (object_name,record_id) {
        if(Meteor.settings.public.enable_saas){
            return false;
        }
        const record = Creator.odata.get(object_name,record_id);
        if(record.status !== 'enable'){
            return true;
        }
        return false
    }
}