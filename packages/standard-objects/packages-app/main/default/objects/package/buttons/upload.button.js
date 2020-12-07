module.exports = {
    upload: function (object_name, record_id) {
        let object = {
            fields: {
                name: {
                    type: 'text',
                    label: '版本名称'
                },
                version: {
                    type: 'text',
                    label: '版本号'
                },
                release_notes: {
                    type: 'textarea',
                    is_wide: true,
                    label: '发行说明'
                },
                post_install: {
                    type: 'textarea',
                    is_wide: true,
                    label: '发布安装说明'
                },
                description: {
                    type: 'textarea',
                    is_wide: true,
                    inlineHelpText: "inlineHelpText",
                    label: '描述'
                },
                install_password: {
                    type: 'password',
                    inlineHelpText: "Password protect this Package by entering a password below. Leave blank if you do not want to require a password.",
                    is_wide: true,
                    label: '密码',
                    group: 'Password (Optional)'
                },
                confirm_install_password: {
                    type: 'password',
                    is_wide: true,
                    label: '确认密码',
                    group: 'Password (Optional)'
                }
            }
        }
        let schema = Creator.getObjectSchema(object);
        let formId = 'uploadPackageForm';
        let onConfirm = function(formValues){
            $("body").addClass('loading');
            if(formValues.insertDoc.install_password && formValues.insertDoc.install_password != formValues.insertDoc.confirm_install_password){
                $("body").removeClass('loading');
                return toastr.error('密码不一致');
            }
            toastr.success('上载中，请稍等...');
            var result = Steedos.authRequest(`/api/package/upload_to_store/${record_id}`, {type: 'post', async: false, data: JSON.stringify({version_info: formValues.insertDoc})})
            console.log('result', result);
            $("body").removeClass('loading');
        }
        let doc = {};
        Modal.show("quickFormModal", {formId: formId, title: TAPi18n.__(`上载软件包`), confirmBtnText: `上载`, schema: schema, doc: doc, onConfirm: onConfirm}, {
            backdrop: 'static',
            keyboard: true
        });
    },
    uploadVisible: function () {
        return true
    }
}