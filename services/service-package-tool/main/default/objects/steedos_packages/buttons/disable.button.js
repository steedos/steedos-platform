module.exports = {
    disable: function (object_name, record_id) {
        const record = Creator.odata.get(object_name, record_id);
        const nodesSelect = Steedos.PackageRegistry.getNodesSelect();
        swal({
            title: t('steedos_packages.disable.title'),
            text:  t('steedos_packages.disable.text') + ` ${record.name}?${nodesSelect}`,
            html: true,
            showCancelButton: true,
            confirmButtonText: t('steedos_packages.disable.title'),
            cancelButtonText: t('Cancel')
        }, function (option) {
            if (option) {
                toastr.info(t('steedos_packages.disable.toast_info'), null, {timeOut: false});
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
                            toastr.success(t('steedos_packages.disable.toastr_success'));
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
        if(Steedos.settings.public.enable_saas){
            return false;
        }
        const record = Creator.odata.get(object_name, record_id);
        if (record.status === 'enable') {
            return true;
        }
        return false
    }
}