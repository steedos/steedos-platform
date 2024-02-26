/*
 * @Author: baozhoutaon@hotoa.com
 * @Date: 2022-03-29 20:33:44
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2024-02-23 14:13:06
 * @Description: 
 */
module.exports = {
    customPage: function (object_name, record_id) {
        $(document.body).addClass('loading');
        let url = `/service/api/page/customPage`;
        let options = {
            type: 'post',
            async: true,
            data: JSON.stringify({ pageId: record_id }),
            success: function (data) {
                SteedosUI.notification.success({
                    message: '页面已自定义。'
                });
                SteedosUI.router.go({}, "/app/" + Session.get("app_id") + "/" + object_name + "/view/" + data._id);
                $(document.body).removeClass('loading');
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                SteedosUI.notification.error({
                    message: '操作失败',
                    description: t(XMLHttpRequest.responseJSON.error),
                });
                $(document.body).removeClass('loading');
            }
        };
        Steedos.authRequest(url, options);
    },
    customPageVisible: function (object_name, record_id, permission, data) {
        if(Meteor.settings.public.enable_saas){
            return false;
        }
        var record = data && data.record;
        return record && record.is_system;
    }
}