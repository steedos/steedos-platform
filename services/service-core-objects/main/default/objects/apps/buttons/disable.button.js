/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2024-03-30 11:37:53
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2024-04-15 10:43:38
 * @Description: 
 */
module.exports = {
    disable: function (object_name, record_id) {
        const record = Creator.odata.get(object_name, record_id);
        const nodesSelect = Steedos.PackageRegistry.getNodesSelect();
        swal({
            title: '停用',
            text:  `确定要停用${record.name}?${nodesSelect}`,
            html: true,
            showCancelButton: true,
            confirmButtonText: '停用',
            cancelButtonText: TAPi18n.__('Cancel')
        }, function (option) {
            if (option) {
                toastr.info(t('停用中，请稍后...'), null, {timeOut: false});
                Steedos.authRequest(Steedos.absoluteUrl(`/api/v1/apps/${record_id}`), {
                    type: 'put', async: false, data: JSON.stringify({
                        doc: {
                            visible: false
                        }
                    }),
                    success: function(){
                        setTimeout(function(){
                            if (record_id) {
                                SteedosUI.reloadRecord(object_name, record_id)
                            }
                            toastr.clear();
                            toastr.success(t('steedos_packages.disable.toastr_success'));
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
    disableVisible: function (object_name, record_id) {
        const record = Creator.odata.get(object_name, record_id);
        if(record._id == record.code){
            return false
        }
        if(record.visible){
            return true;
        }
        return false;
    }
}