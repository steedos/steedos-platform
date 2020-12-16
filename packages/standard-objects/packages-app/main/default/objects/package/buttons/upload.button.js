module.exports = {
    upload: function (object_name, record_id) {
        let object = {
            fields: {
                name: {
                    type: 'text',
                    label: TAPi18n.__('package_action_upload_form_name'),
                    required: true
                },
                version: {
                    type: 'text',
                    label: TAPi18n.__('package_action_upload_form_version'),
                    required: true
                },
                release_notes: {
                    type: 'textarea',
                    is_wide: true,
                    rows:2,
                    label: TAPi18n.__('package_action_upload_form_release_notes')
                },
                post_install: {
                    type: 'textarea',
                    is_wide: true,
                    rows:2,
                    label: TAPi18n.__('package_action_upload_form_post_install')
                },
                description: {
                    type: 'textarea',
                    is_wide: true,
                    rows:2,
                    label: TAPi18n.__('package_action_upload_form_description')
                },
                install_password: {
                    type: 'password',
                    inlineHelpText: TAPi18n.__('package_action_upload_form_install_password_inlineHelpText'),
                    is_wide: true,
                    label: TAPi18n.__('package_action_upload_form_install_password'),
                    group: TAPi18n.__('package_action_upload_form_group_password')
                },
                confirm_install_password: {
                    type: 'password',
                    is_wide: true,
                    label: TAPi18n.__('package_action_upload_form_confirm_install_password'),
                    group: TAPi18n.__('package_action_upload_form_group_password')
                }
            }
        }
        let schema = Creator.getObjectSchema(object);
        schema.install_password.autoform.autocomplete='new-password';
        let formId = 'uploadPackageForm';
        let onConfirm = function(formValues, e, t){
            $("body").addClass('loading');
            if(formValues.insertDoc.install_password && formValues.insertDoc.install_password != formValues.insertDoc.confirm_install_password){
                $("body").removeClass('loading');
                return toastr.error(TAPi18n.__('package_action_upload_form__error_password_ne'));
            }
            var result = Steedos.authRequest(`/api/package/upload_to_store/${record_id}`, {type: 'post', async: false, data: JSON.stringify({version_info: formValues.insertDoc})})
            if(!result){
                return $("body").removeClass('loading');
            }
            if(result.error){
                $("body").removeClass('loading');
                return toastr.error(result.error);
            }
            toastr.success(TAPi18n.__('package_action_upload_success'));
            $("body").removeClass('loading');
            FlowRouter.go("/app/-/package_version/view/" + result._id);
            Modal.hide(t);
        }
        let doc = {};
        Modal.show("quickFormModal", {formId: formId, title: TAPi18n.__('package_action_upload_form_title'), confirmBtnText: TAPi18n.__('package_action_upload'), schema: schema, doc: doc, onConfirm: onConfirm}, {
            backdrop: 'static',
            keyboard: true
        });
    },
    uploadVisible: function () {
        return true
    }
}