module.exports = {
    disable: function (object_name, record_id) {
        Steedos.sobject(object_name).retrieve(record_id).then((record)=>{
            if(!record){
                return SteedosUI.notification.error({message: '未找到软件包'})
            }
            SteedosUI.Modal.confirm({
                title: t('steedos_packages.disable.title'),
                content: t('steedos_packages.disable.text') + ` ${record.name}?`,
                okText: t('steedos_packages.disable.title'),
                cancelText: t('Cancel'),
                onOk: function(){
                    Steedos.authRequest(Steedos.absoluteUrl('/api/nodes/disable'), {type: 'post', async: false, data: JSON.stringify({
                            module: record.name,
                            nodeID: window.$("#steedos_package_main_node").val()
                        }),
                        success: function(data){
                            if(data.status == 1){
                                SteedosUI.notification.error({message: data.msg});
                                return;
                            }
                            setTimeout(function(){
                                SteedosUI.notification.success(t('steedos_packages.disable.toastr_success'))
                                window.location.reload()
                            }, 1000 * 2)
                        },
                        error: function(XMLHttpRequest){
                            SteedosUI.notification.error({message: XMLHttpRequest.responseJSON.msg});
                        }
                    })
                }
            });
        })
        
    },
    disableVisible: function (object_name, record_id, permission, data) {
        if(Steedos.settings.public.enable_saas){
            return false;
        }
        const record = data?.record || {};
        if (record.status === 'enable') {
            return true;
        }
        return false
    }
}