/*
 * @Author: 殷亮辉 yinlianghui@hotoa.com
 * @Date: 2025-07-07 16:57:38
 * @LastEditors: 殷亮辉 yinlianghui@hotoa.com
 * @LastEditTime: 2025-09-01 17:04:07
 */
module.exports = {
    enable: function (object_name, record_id) {
        Steedos.sobject(object_name).retrieve(record_id).then((record)=>{
            if(!record){
                return SteedosUI.notification.error({message: '未找到软件包'})
            }
            console.log('record.....',record)

            SteedosUI.Modal.confirm({
                title: t('steedos_packages.enable.title'),
                content: t('steedos_packages.enable.text') + ` ${record.name}?`,
                okText: t('steedos_packages.enable.title'),
                cancelText: t('Cancel'),
                onOk: function(){
                    Steedos.authRequest(Steedos.absoluteUrl('/api/nodes/enable'), {type: 'post', async: false, data: JSON.stringify({
                            module: record.name,
                            nodeID: window.$("#steedos_package_main_node").val()
                        }),
                        success: function(data){
                            if(data.status == 1){
                                SteedosUI.notification.error({message: data.msg});
                                return;
                            }
                            setTimeout(function(){
                                 SteedosUI.notification.success({
                                    message: t('steedos_packages.enable.toastr_success')
                                });
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
    enableVisible: function (object_name,record_id, permission, data) {
        if(Steedos.settings.public.enable_saas){
            return false;
        }
        const record = data?.record || {};
        if(record.isUnmanaged){
            return false
        }
        if(record.status !== 'enable'){
            return true;
        }
        return false
    }
}