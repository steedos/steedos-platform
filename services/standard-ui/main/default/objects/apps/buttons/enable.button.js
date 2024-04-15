/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2024-03-30 11:37:53
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2024-04-15 10:43:45
 * @Description: 
 */
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
                Steedos.authRequest(Steedos.absoluteUrl(`/api/v1/apps/${record_id}`), {type: 'put', async: false, data: JSON.stringify({
                        doc: {
                            visible: true
                        }
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
                        }, 100)
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
        const record = Creator.odata.get(object_name,record_id);
        if(record._id == record.code){
            return false
        }
        if(record.visible){
            return false;
        }
        return true
    }
}