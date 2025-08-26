/*
 * @Author: baozhoutaon@hotoa.com
 * @Date: 2022-03-29 20:33:44
 * @LastEditors: 殷亮辉 yinlianghui@hotoa.com
 * @LastEditTime: 2025-08-26 13:58:13
 * @Description: 
 */
module.exports = {
    resetSchema: function (object_name, record_id) {
        SteedosUI.Modal.confirm({
            title: t("CustomLabels.pages_action_resetSchema_dialog_title"), 
            content: t("CustomLabels.pages_action_resetSchema_dialog_title"), 
            onOk: function(){
                $(document.body).addClass('loading');
                let url = `/service/api/page/resetDefaultSchema`;
                let options = {
                    type: 'post',
                    async: true,
                    data: JSON.stringify({ pageId: record_id }),
                    success: function (data) {
                        SteedosUI.notification.success({
                            message: t("CustomLabels.pages_action_resetSchema_success_message"),
                            description: t("CustomLabels.pages_action_resetSchema_success_description"),
                        });
                        SteedosUI.router.go({
                            type: 'new',
                            objectName: object_name,
                            recordId: record_id
                        });
                        $(document.body).removeClass('loading');
                    },
                    error: function (XMLHttpRequest, textStatus, errorThrown) {
                        SteedosUI.notification.error({
                            message: t("CustomLabels.pages_action_resetSchema_failed_message"),
                            description: t(XMLHttpRequest.responseJSON.error),
                        });
                        $(document.body).removeClass('loading');
                    }
                };
                Steedos.authRequest(url, options);
            }
        });
    },
    resetSchemaVisible: function (object_name, record_id, permission, data) {
        var record = data && data.record;
        return record && !record.is_system && record.type === 'form';
    }
}