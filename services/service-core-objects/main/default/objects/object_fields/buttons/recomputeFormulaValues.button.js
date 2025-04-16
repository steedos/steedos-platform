module.exports = {

    recomputeFormulaValues: function(object_name, record_id, item_element, data) {
        SteedosUI.Modal.confirm({
            title: '重算公式值',
            content: `确定要重算吗?`,
            okText: '重算',
            cancelText: t('Cancel'),
            onOk: function(){
                Steedos.authRequest(Steedos.absoluteUrl("/api/object_fields/recomputeFormulaValues"), {type: 'post', async: false, data: JSON.stringify({
                    record_id:record_id
                    }),
                    success: function(data){
                        if(data.status == 1){
                            SteedosUI.notification.error("object_fields_function_recomputeFormulaValues_error", t(data.error.reason));
                            return;
                        }
                        SteedosUI.notification.success(t('object_fields_function_recomputeFormulaValues_success'))
                    },
                    error: function(XMLHttpRequest){
                        SteedosUI.notification.error({message: XMLHttpRequest.responseJSON.msg});
                    }
                })
            }
        });
    },
    recomputeFormulaValuesVisible: function(object_name, record_id, record_permissions, data) {
        if (!Steedos.isSpaceAdmin()) {
            return false
        }
        var record = data.record;
        if (record && record.type === "formula") {
            return true;
        }
    }

}