/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2024-03-30 11:37:53
 * @LastEditors: 殷亮辉 yinlianghui@hotoa.com
 * @LastEditTime: 2025-09-01 20:52:46
 * @Description: 
 */
module.exports = {
    disable: function (object_name, record_id, record_permissions, data) {
        Steedos.sobject(object_name).retrieve(record_id).then((record)=>{
            if(!record){
                return SteedosUI.notification.error({message: t('apps_not_found')})
            }
            SteedosUI.Modal.confirm({
                title: t('apps_actions_disable_dialog_title'),
                content: `${t('apps_actions_disable_dialog_content_prefix')}${record.name}${t('apps_actions_disable_dialog_content_suffix')}`,
                okText: t('CustomAction.apps.disable'),
                cancelText: t('Cancel'),
                onOk: function(){
                    Steedos.authRequest(Steedos.absoluteUrl(`/api/v1/apps/${record_id}`), {type: 'put', async: false, data: JSON.stringify({
                        doc: {
                            visible: false
                        }
                        }),
                        success: function(data){
                            if(data.status == 1){
                                SteedosUI.notification.error({message: data.msg});
                                return;
                            }
                            setTimeout(function(){
                                SteedosUI.notification.success({
                                    message: t('steedos_packages.disable.toastr_success')
                                });
                                window.location.reload()
                            }, 100 * 1)
                        },
                        error: function(XMLHttpRequest){
                            SteedosUI.notification.error({message: XMLHttpRequest.responseJSON.msg});
                        }
                    })
                }
            });
        })

    },
    disableVisible: function (object_name, record_id, record_permissions, data) {
        var record = data.record;
        if(record._id == record.code){
            return false
        }
        if(record.visible){
            return true;
        }
        return false;
    }
}