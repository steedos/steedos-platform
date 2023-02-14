/*
 * @Author: sunhaolin@hotoa.com
 * @Date: 2022-04-13 09:15:30
 * @LastEditors: sunhaolin@hotoa.com
 * @LastEditTime: 2022-04-13 09:16:09
 * @Description: 
 */
module.exports = {
    copy: function (object_name, record_id) {
        window.$(document.body).addClass('loading');
        let url = `/service/api/@steedos/standard-process/copy`;
        let options = {
            type: 'post',
            async: true,
            data: JSON.stringify({ _id: record_id }),
            success: function (data) {
                toastr.success('流程已复制。');
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
    copyVisible: function (object_name, record_id, permission, data) {
        var record = data && data.record;
        return record && !record.is_system;
    }
}