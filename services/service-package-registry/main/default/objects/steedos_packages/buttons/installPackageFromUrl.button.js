module.exports = {
    installPackageFromUrl: function (object_name, record_id) {
        SteedosUI.showModal(stores.ComponentRegistry.components.ObjectForm, {
            name: "install_package_from_url",
            title: '手动安装软件包',
            objectSchema: {
                fields:{
                  module: {
                    type: 'text',
                    is_wide: true,
                    required: true,
                    label: "软件包名称",
                    inlineHelpText: 'package.json 中的 name值',
                  },
                  url: {
                    required: true,
                    type: 'text',
                    is_wide: true,
                    label: "软件包URL"
                  }
                }
            },
            onFinish: async (values = {}) => {
                return new Promise((resolve, reject) => {
                    Steedos.authRequest(Steedos.absoluteUrl('service/api/~packages-project-server/cloud/saas/packages/url'), {
                        type: 'post', async: true, data: JSON.stringify({
                            module: values.module,
                            url: values.url
                        }),
                        success: function () {
                            setTimeout(function () {
                                toastr.clear();
                                toastr.success('安装成功');
                                if (record_id) {
                                    SteedosUI.reloadRecord(object_name, record_id)
                                }
                                FlowRouter.reload()
                                resolve(true)
                            }, 1000 * 10)
                        },
                        error: function (XMLHttpRequest) {
                            toastr.clear();
                            toastr.error(XMLHttpRequest.responseJSON.error);
                            reject(false);
                        }
                    })
                })
                
            }
        }, null, { iconPath: '/assets/icons' })
    },
    installPackageFromUrlVisible: function (object_name, record_id) {
        return Steedos.isSpaceAdmin();
    }
}