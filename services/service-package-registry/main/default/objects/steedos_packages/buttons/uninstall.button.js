module.exports = {
    uninstall: function (object_name, record_id) {
        Steedos.sobject(object_name).retrieve(record_id).then((record)=>{
            if(!record){
                return SteedosUI.notification.error({message: '未找到软件包'})
            }

            SteedosUI.Modal.confirm({
                title: t('steedos_packages.uninstall.text') + ` ${record.name} 吗?` ,
                content: `卸载后，该软件包中的所有组件将被永久删除且无法恢复`,
                okText: t('steedos_packages.uninstall.title'),
                cancelText: t('Cancel'),
                width: 480,
                onOk: function(){
                    return new Promise((resolve, reject) => {
                        Steedos.authRequest(Steedos.absoluteUrl('/api/nodes/uninstall'), {type: 'post', async: false, data: JSON.stringify({
                                module: record.name,
                                nodeID: window.$("#steedos_package_main_node").val()
                            }),
                            success: function(data){
                                if(data.status == 1){
                                    SteedosUI.notification.error({message: data.msg});
                                    resolve(data);
                                    return;
                                }
                                setTimeout(function(){
                                    SteedosUI.notification.success({
                                        message: t('steedos_packages.uninstall.toastr_success')
                                    });
                                    resolve(data);
                                    navigate("/app/admin/steedos_packages")
                                }, 1000 * 2)
                            },
                            error: function(XMLHttpRequest){
                                SteedosUI.notification.error({message: XMLHttpRequest.responseJSON.msg});
                                reject()
                            }
                        })
                    })
                }
            });
        })
    },
    uninstallVisible: function (object_name,record_id, permission, data) {
        if(Steedos.settings.public.enable_saas){
            return false;
        }
        const record = data?.record;
        if(record.local || record.static){
            return false;
        }
        if(record.status){
            return true;
        }
        return false
    }
}