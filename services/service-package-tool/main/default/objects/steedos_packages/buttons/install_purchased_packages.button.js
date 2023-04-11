/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-11-18 16:32:30
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2023-04-11 11:14:56
 * @Description: 
 */
module.exports = {
    install_purchased_packages: function (object_name, record_id) {
        const result = Steedos.authRequest(Steedos.absoluteUrl('api/nodes/cloud/saas/packages/purchased'), {async: false, type: 'get'});
        if(result && result.packages.length === 0){
            return toastr.info('您还未购买任何软件包')
        }else{
            toastr.info('安装中，请稍后...', '', {
                timeOut: 0,
                progressBar: true,
            })
            Steedos.authRequest(Steedos.absoluteUrl('api/nodes/cloud/saas/packages/purchased'), {type: 'post', error: function(XMLHttpRequest, textStatus, errorThrown){
                toastr.clear()
                if (XMLHttpRequest.responseJSON && XMLHttpRequest.responseJSON.error) {
                    toastr.error(XMLHttpRequest.responseJSON.error)
                }
                else {
                    toastr.error(XMLHttpRequest.responseJSON)
                }
            },
            success: function(result){
                try {
                    toastr.clear()
                    const installErrors = result.installErrors;
                    let errorsHtml = '';
                    let index = 0;
                    _.each(installErrors, function(v, k){
                        index ++ 
                        errorsHtml = `${errorsHtml}<li class="py-4">
                        <div class="flex space-x-3">
                          <div class="flex-1 space-y-1">
                            <div class="flex items-center justify-between">
                              <h3 class="text-sm font-medium"><b>${k}</b></h3>
                              <p class="text-sm text-gray-500"><span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-pink-100 text-pink-800">
                              Error ${index}
                            </span></p>
                            </div>
                            <p class="text-sm text-gray-500">${v}</p>
                          </div>
                        </div>
                      </li>`
                    })
                    if(!_.isEmpty(installErrors)){
                        swal({
                            title: "安装软件包异常",
                            text: `<div>
                            <ul role="list" class="divide-y divide-gray-200">
                            ${errorsHtml}
                            </ul>
                        </div>`,
                            html: true,
                            showCancelButton: false,
                            closeOnConfirm: false,
                            cancelButtonText: t('Cancel'),
                            confirmButtonText: t('OK')
                        });
                    }else{
                        toastr.success('安装完成')
                    }
                    FlowRouter.reload();
                } catch (error) {
                    toastr.error(XMLHttpRequest.responseJSON.error)
                }
                
            }
            });
        }
        
    },
    install_purchased_packagesVisible: function (object_name, record_id) {
        return false;
    }
}