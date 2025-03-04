module.exports = {
    uninstall: function (object_name, record_id) {
        const record = Creator.odata.get(object_name,record_id);
        const nodesSelect = Steedos.PackageRegistry.getNodesSelect();
        swal({
            title: t('steedos_packages.uninstall.title'),
            text: t('steedos_packages.uninstall.text') + ` ${record.name}?${nodesSelect}`,
            html: true,
            showCancelButton: true,
            confirmButtonText: t('steedos_packages.uninstall.title'),
            cancelButtonText: t('Cancel')
        }, function (option) {
            if (option) {
                toastr.info(t('steedos_packages.uninstall.toast_info'), null, {timeOut: false});
                Steedos.authRequest(Steedos.absoluteUrl('/api/nodes/uninstall'), {type: 'post', async: false, data: JSON.stringify({
                        module: record.name,
                        nodeID: window.$("#steedos_package_main_node").val()
                    }),
                    success: function(){
                        setTimeout(function(){
                            if (FlowRouter.current().params.record_id) {
                                return FlowRouter.go("/app/admin/steedos_packages/grid/all")
                            }
                            toastr.clear();
                            toastr.success(t('steedos_packages.uninstall.toastr_success'));
                            FlowRouter.reload()
                        }, 1000 * 10)
                    },
                    error: function(XMLHttpRequest){
                        toastr.clear();
                        toastr.error(XMLHttpRequest.responseJSON.error);
                    }
                })
            }
        })
    },
    uninstallVisible: function (object_name,record_id) {
        if(Steedos.settings.public.enable_saas){
            return false;
        }
        const record = Creator.odata.get(object_name,record_id);
        if(record.local || record.static){
            return false;
        }
        if(record.status){
            return true;
        }
        return false
    }
}