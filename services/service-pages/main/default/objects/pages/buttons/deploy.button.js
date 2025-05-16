/*
 * @Author: baozhoutaon@hotoa.com
 * @Date: 2022-03-29 20:33:44
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2022-05-28 17:44:34
 * @Description: 
 */
module.exports = {
    deploy: function (object_name, record_id) {
        let url = `/service/api/page/deploy`;
        let options = {
            type: 'post',
            async: true,
            data: JSON.stringify({ pageId: record_id }),
            success: function (data) {
                SteedosUI.notification.success({
                    message: '页面已发布。'
                });
                SteedosUI.reloadRecord(object_name, record_id);
                window.location.reload();
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                SteedosUI.notification.error({
                    message: '操作失败',
                    description: t(XMLHttpRequest.responseJSON.error),
                });
            }
        };
        Steedos.authRequest(url, options);
    },
    deployVisible: function (object_name, record_id, permission, data) {
        var record = data && data.record;
        return record && !record.is_system;
    }
}