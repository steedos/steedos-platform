/*
 * @Author: sunhaolin@hotoa.com
 * @Date: 2022-03-28 15:21:51
 * @LastEditors: sunhaolin@hotoa.com
 * @LastEditTime: 2022-03-31 19:00:57
 * @Description: 
 */
module.exports = {
    disable: function (object_name, record_id) {
        window.$(document.body).addClass('loading');
        let url = `/service/api/@steedos/standard-process/disable`;
        let options = {
            type: 'post',
            async: true,
            data: JSON.stringify({ _id: record_id }),
            success: function (data) {
                toastr.success('流程已禁用。');
                SteedosUI.reloadRecord(object_name, record_id);
                FlowRouter.reload();
                window.$(document.body).removeClass('loading');
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                toastr.error(t(XMLHttpRequest.responseJSON.error))
                window.$(document.body).removeClass('loading');
            }
        };
        Steedos.authRequest(url, options);
    },
    disableVisible: function (object_name, record_id, permission, data) {
        var record = data && data.record;
        return record && record.is_active && !record.is_system;
    }
}