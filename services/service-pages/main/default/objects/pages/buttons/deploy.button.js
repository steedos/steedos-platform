/*
 * @Author: baozhoutaon@hotoa.com
 * @Date: 2022-03-29 20:33:44
 * @LastEditors: sunhaolin@hotoa.com
 * @LastEditTime: 2022-04-10 14:20:32
 * @Description: 
 */
module.exports = {
    deploy: function (object_name, record_id) {
        $(document.body).addClass('loading');
        let url = `/service/api/page/deploy`;
        let options = {
            type: 'post',
            async: true,
            data: JSON.stringify({ pageId: record_id }),
            success: function (data) {
                toastr.success('页面已发布。');
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
    deployVisible: function (object_name, record_id, permission, record) {
        return record && !record.is_system;
    }
}