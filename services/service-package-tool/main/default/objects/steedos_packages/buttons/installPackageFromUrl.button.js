/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-11-18 16:32:30
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2022-11-18 17:41:45
 * @Description: 
 */
module.exports = {
    installPackageFromUrl: function (object_name, record_id) {
        SteedosUI.showModal(stores.ComponentRegistry.components.ObjectForm, {
            name: "install_package_from_url",
            title: '手动安装软件包',
            objectSchema: {
                fields: {
                    module: {
                        type: 'text',
                        is_wide: true,
                        required: true,
                        label: "软件包名称",
                        inlineHelpText: 'package.json 中的 name值',
                    },
                    version: {
                        // required: "{{formData.url ? false : true}}",
                        type: 'text',
                        is_wide: true,
                        label: "版本号",
                        inlineHelpText: "如果未填写, 则安装最新正式版",
                        help: "latest",
                        value: undefined,
                        visible_on: "{{formData.url ? false : true}}"
                    },
                    url: {
                        // required: "{{formData.version ? false : true}}",
                        type: 'text',
                        is_wide: true,
                        label: "软件包URL",
                        visible_on: "{{formData.version ? false : true}}"
                    },
                    auth: {
                        // required: "{{formData.version ? false : true}}",
                        type: 'password',
                        is_wide: true,
                        label: "认证信息"
                    }
                }
            },
            onFinish: async (values = {}) => {
                return new Promise((resolve, reject) => {
                    Steedos.authRequest(Steedos.absoluteUrl('/api/nodes/cloud/saas/packages/url'), {
                        type: 'post', async: true, data: JSON.stringify({
                            module: values.module,
                            version: values.version,
                            url: values.url,
                            auth: values.auth
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