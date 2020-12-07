module.exports = {
    install: function () {
        let object = {
            fields: {
                packageVersionId: {
                    type: 'text',
                    label: '软件包版本Id',
                    is_wide: true
                },
                password: {
                    type: 'password',
                    label: '密码',
                    inlineHelpText: '如果不需要密码，请将其留空。',
                    is_wide: true
                }
            }
        }
        let schema = Creator.getObjectSchema(object);
        let formId = 'installPackageForm';
        
        let onConfirm = function(formValues, e, t){
            const data = formValues.insertDoc;
            var result = Steedos.authRequest(`/api/package/installing_from_store/info/${data.packageVersionId}`, {type: 'post', async: false, data: JSON.stringify({password: data.password})});
            let _schema = Creator.getObjectSchema(result.schema);
            let _doc = result.data;
            Modal.hide(t);
            Meteor.setTimeout(function(){
                const installPackage = function(){
                    toastr.success('installPackage...');
                    var result = Steedos.authRequest(`/api/package/installing_from_store/file/${data.packageVersionId}`, {type: 'post', async: false, data: JSON.stringify({password: data.password})});
                    console.log('result', result);
                }
                console.log('_doc', _doc);
                Modal.show("quickFormModal", {formId: formId, formType: 'readonly', modalSize: 'modal-lg', title: TAPi18n.__(`安装软件包`), confirmBtnText: `确认`, schema: _schema, doc: _doc, onConfirm: installPackage}, {
                    backdrop: 'static',
                    keyboard: true
                });
            }, 800)
        }
        let doc = {};
        Modal.show("quickFormModal", {formId: formId, title: TAPi18n.__(`安装软件包`), confirmBtnText: `下一步`, schema: schema, doc: doc, onConfirm: onConfirm}, {
            backdrop: 'static',
            keyboard: true
        });
    },
    installVisible: function () {
        return true
    }
}