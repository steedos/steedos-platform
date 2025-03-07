module.exports = {
    reload: function (object_name, record_id, permission, data) {
        SteedosUI.notification.info({message: t('steedos_packages.reload.toastr_info')})
        const record = data?.record || {};
        //TODO nodeID
        Steedos.authRequest(Steedos.absoluteUrl('/api/nodes/reload'), {type: 'post', async: false, data: JSON.stringify({
                module: record.name,
                nodeID: record.node_id
            }),
            success: function(){
                setTimeout(function(){
                    SteedosUI.notification.success({message: t('steedos_packages.reload.toastr_success')})
                    window.location.reload()
                }, 1000 * 5)
            },
            error: function(XMLHttpRequest){
                SteedosUI.notification.error({message: XMLHttpRequest.responseJSON.error})
            }
        })
    },
    reloadVisible: function (object_name,record_id, permission, data) {
        if(Steedos.settings.public.enable_saas){
            return false;
        }
        const record = data?.record;
        if(record.status === 'enable'){
            return true;
        }
        return false
    }
}