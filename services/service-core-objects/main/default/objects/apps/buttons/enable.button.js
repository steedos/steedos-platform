/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2024-03-30 11:37:53
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2024-04-15 10:43:45
 * @Description: 
 */
module.exports = {
    enable: function (object_name, record_id) {
        Steedos.sobject(object_name).retrieve(record_id).then((record)=>{
            if(!record){
                return SteedosUI.notification.error({message: '未找到应用'})
            }
            SteedosUI.Modal.confirm({
                title: '启用',
                content: `确定要启用「${record.name}」应用?`,
                okText: '启用',
                cancelText: t('Cancel'),
                onOk: function(){
                    Steedos.authRequest(Steedos.absoluteUrl(`/api/v1/apps/${record_id}`), {type: 'put', async: false, data: JSON.stringify({
                        doc: {
                            visible: true
                        }
                        }),
                        success: function(data){
                            if(data.status == 1){
                                SteedosUI.notification.error({message: data.msg});
                                return;
                            }
                            setTimeout(function(){
                                SteedosUI.notification.success('已启用')
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
    enableVisible: function (object_name, record_id, record_permissions, data) {
        var record = data.record;
        if(record._id == record.code){
            return false
        }
        if(record.visible){
            return false;
        }
        return true
    }
}