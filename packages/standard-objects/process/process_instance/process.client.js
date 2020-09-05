Steedos.ProcessManager = {};

Steedos.ProcessManager.showProcessApprovalForm = function(action, fields, formId, doc, onConfirm){
    // var approveSchema = {
    //     approver: { 
    //         label: `process_approval_approver_label_${action}`, 
    //         type: String,
    //         optional: false, 
    //         autoform: { 
    //             reference_to: "users", 
    //             create: false, 
    //             type: "selectuser", 
    //             is_company_limited: false 
    //         } 
    //     },
    //     comment: {
    //         label: "process_approval_comment", 
    //         type: String,
    //         optional: false,
    //         autoform: { 
    //             type: "widearea", 
    //             rows: 2
    //         } 
    //     }
    // }

    var approveSchema = Creator.getObjectSchema({fields: fields})

    Modal.show("quickFormModal", {formId: formId, title: TAPi18n.__(`process_approval_title_${action}`), confirmBtnText: `process_approval_confirmBtnText_${action}`, schema: approveSchema, doc: doc, onConfirm: onConfirm});
}


Steedos.ProcessManager.showApproveButs = function(objectName, recordId){
    var record = Creator.getCollection(objectName).findOne(recordId);
    if(record){
        return record.step_status === 'pending';
    }
}

Steedos.ProcessManager.Reassign = function(object_name, record_id){
    var formId = 'processApprovalForm';
    Steedos.ProcessManager.showProcessApprovalForm('reassign', {
        approver: {
            label: TAPi18n.__('process_approval_approver_label_reassign'),
            type: 'lookup',
            reference_to: 'users',
            required: true,
            is_wide: true
        },
        comment: {
            label: TAPi18n.__('process_approval_comment'),
            type: 'textarea',
            rows: 10,
            is_wide: true
        }
    }, formId, {}, function(formValues, e, t){
        console.log('Reassign formValues', formValues);
        Steedos.authRequest(`/api/v4/process/reassign/${object_name}/${record_id}`, {type: 'post', data: JSON.stringify(formValues.insertDoc)});
        FlowRouter.reload();
        Modal.hide(t);
    })
}