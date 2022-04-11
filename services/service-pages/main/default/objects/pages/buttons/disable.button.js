/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-03-29 19:19:01
 * @Description: 
 */
module.exports = {
    disable: function (object_name, record_id) {
        $(document.body).addClass('loading');
        let url = `/service/api/page/disable`;
        let options = {
            type: 'post',
            async: true,
            data: JSON.stringify({ pageId: record_id }),
            success: function (data) {
                toastr.success('页面已禁用。');
                SteedosUI.reloadRecord(object_name, record_id);
                FlowRouter.reload();
                $(document.body).removeClass('loading');
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                toastr.error(t(XMLHttpRequest.responseJSON.error))
                $(document.body).removeClass('loading');
            }
        };
        Steedos.authRequest(url, options);
    },
    disableVisible: function (object_name, record_id, permission, record) {
        return record && record.is_active && !record.is_system
    }
}