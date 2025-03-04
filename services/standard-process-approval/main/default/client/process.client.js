Steedos.ProcessManager = {};

Steedos.ProcessManager.showProcessApprovalForm = function(action, fields, formId, doc, onConfirm, title){

    var approveSchema = Creator.getObjectSchema({fields: fields})

    Modal.show("quickFormModal", {formId: formId, title: title || t(`process_approval_title_${action}`), confirmBtnText: `process_approval_confirmBtnText_${action}`, schema: approveSchema, doc: doc, onConfirm: onConfirm}, {
        backdrop: 'static',
        keyboard: true
    });
}

Steedos.ProcessManager.allowApprover = function(object_name, record_id){
    if(!object_name || !record_id){
        return false;
    }
    var result = Steedos.authRequest(`/api/v4/process/permission/approver/${object_name}/${record_id}`, {type: 'get', async: false});
    if(result && result.allowApprover){
        return true;
    }else{
        return false;
    }
}

Steedos.ProcessManager.allowRecall = function(object_name, record_id){
    if(!object_name || !record_id){
        return false;
    }
    var result = Steedos.authRequest(`/api/v4/process/permission/recall/${object_name}/${record_id}`, {type: 'get', async: false});
    if(result && result.allowRecall){
        return true;
    }else{
        return false;
    }
}

Steedos.ProcessManager.allowSubmit = function(object_name, record_id){
    if(!object_name || !record_id){
        return false;
    }
    var _window$Creator;
    const object = this.object || ((_window$Creator = window.Creator) === null || _window$Creator === void 0 ? void 0 : _window$Creator.getObject(object_name));
    if(!object.enable_process){
        return false;
    }
    var result = Steedos.authRequest(`/api/v4/process/permission/submit/${object_name}/${record_id}`, {type: 'get', async: false});
    if(result && result.allowSubmit){
        return true;
    }else{
        return false;
    }
}

Steedos.ProcessManager.submit = function(object_name, record_id, options){
    var formId = 'processApprovalForm';

    var schema = {
        comment: {
            label: t('process_approval_comment'),
            type: 'textarea',
            rows: 3,
            is_wide: true
        }
    }

    if(options && options.showApprover){
        schema.approver = {
            label: t('process_approval_approver_label'),
            type: 'lookup',
            reference_to: 'users',
            required: true,
            is_wide: true
        }
        schema.comment.hidden = true;
    }

    var formValue = {};
    if(options && options.value){
        formValue = options.value;
    }
    Steedos.ProcessManager.showProcessApprovalForm('submit', schema, formId, formValue, function(formValues, e, t){
        var result = Steedos.authRequest(`/api/v4/process/submit/${object_name}/${record_id}`, {type: 'post', async: false, data: JSON.stringify(formValues.insertDoc)});
        if(result.state === 'FAILURE'){
            if(result.error === 'process_approval_error_needToChooseApprover'){
                Modal.hide(t);
                Meteor.setTimeout(function(){
                    Steedos.ProcessManager.submit(object_name, record_id, {showApprover: true, value: {comment: formValues.insertDoc.comment}});
                }, 800)
            }else{
                toastr.error(t(result.error));
                Modal.hide(t);
                FlowRouter.reload();
            }
        }else{
            Modal.hide(t);
            FlowRouter.reload();
        }
    })
    
}

Steedos.ProcessManager.recall = function(object_name, record_id){
    var formId = 'processApprovalForm';
    Steedos.ProcessManager.showProcessApprovalForm('recall', {
        comment: {
            label: t('process_approval_comment'),
            type: 'textarea',
            rows: 3,
            is_wide: true
        }
    }, formId, {}, function(formValues, e, t){
        var result = Steedos.authRequest(`/api/v4/process/recall/${object_name}/${record_id}`, {type: 'post', async: false, data: JSON.stringify(formValues.insertDoc)});
        if(result.state === 'FAILURE'){
            toastr.error(t(result.error));
        }
        FlowRouter.reload();
        Modal.hide(t);
    })
}

Steedos.ProcessManager.approve = function(object_name, record_id, options){
    var formId = 'processApprovalForm';
    var title = `${t('process_instance_history_action_approve')}` //TODO approval record name
    var schema = {
        comment: {
            label: t('process_approval_comment'),
            type: 'textarea',
            rows: 3,
            is_wide: true
        }
    }

    if(options && options.showApprover){
        schema.approver = {
            label: t('process_approval_approver_label'),
            type: 'lookup',
            reference_to: 'users',
            required: true,
            is_wide: true
        }
        schema.comment.hidden = true;
    }

    var formValue = {};
    if(options && options.value){
        formValue = options.value;
    }
    Steedos.ProcessManager.showProcessApprovalForm('approve', schema, formId, formValue, function(formValues, e, t){
        var result = Steedos.authRequest(`/api/v4/process/approve/${object_name}/${record_id}`, {type: 'post', async: false, data: JSON.stringify(formValues.insertDoc)});
        if(result.state === 'FAILURE'){
            if(result.error === 'process_approval_error_needToChooseApprover'){
                Modal.hide(t);
                Meteor.setTimeout(function(){
                    Steedos.ProcessManager.approve(object_name, record_id, {showApprover: true, value: {comment: formValues.insertDoc.comment}});
                }, 800)
            }else{
                toastr.error(t(result.error));
                Modal.hide(t);
                FlowRouter.reload();
            }
        }else{
            Modal.hide(t);
            FlowRouter.reload();
        }
    }, title)
    
}

Steedos.ProcessManager.reject = function(object_name, record_id){
    var formId = 'processApprovalForm';
    var title = `${t('process_instance_history_action_reject')}` //TODO approval record name
    Steedos.ProcessManager.showProcessApprovalForm('reject', {
        comment: {
            label: t('process_approval_comment'),
            type: 'textarea',
            rows: 3,
            is_wide: true
        }
    }, formId, {}, function(formValues, e, t){
        var result = Steedos.authRequest(`/api/v4/process/reject/${object_name}/${record_id}`, {type: 'post', async: false, data: JSON.stringify(formValues.insertDoc)});
        if(result.state === 'FAILURE'){
            toastr.error(t(result.error));
        }
        FlowRouter.reload();
        Modal.hide(t);
    }, title)
}

Steedos.ProcessManager.reassign = function(object_name, record_id){
    var formId = 'processApprovalForm';
    Steedos.ProcessManager.showProcessApprovalForm('reassign', {
        approver: {
            label: t('process_approval_approver_label_reassign'),
            type: 'lookup',
            reference_to: 'users',
            required: true,
            is_wide: true
        },
        comment: {
            label: t('process_approval_comment'),
            type: 'textarea',
            rows: 3,
            is_wide: true
        }
    }, formId, {}, function(formValues, e, t){
        var result = Steedos.authRequest(`/api/v4/process/reassign/${object_name}/${record_id}`, {type: 'post', async: false, data: JSON.stringify(formValues.insertDoc)});
        if(result.state === 'FAILURE'){
            toastr.error(t(result.error));
        }
        FlowRouter.reload();
        Modal.hide(t);
    })
}