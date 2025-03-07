module.exports = {
    enable: function (object_name, record_id) {
        Steedos.sobject(object_name).retrieve(record_id).then((record)=>{
            if(!record){
                return SteedosUI.notification.error({message: '未找到软件包'})
            }
            console.log('record.....',record)

            SteedosUI.Modal.confirm({
                title: '启用',
                content: `确定要启用${record.name}?`,
                okText: '启用',
                cancelText: '取消',
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
                                SteedosUI.notification.success("已启用")
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
        if(record.status !== 'enable'){
            return true;
        }
        return false
    }
}