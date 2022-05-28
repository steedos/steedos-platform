/*
 * @Author: baozhoutaon@hotoa.com
 * @Date: 2022-03-29 20:33:44
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2022-05-27 18:08:21
 * @Description: 
 */
module.exports = {
    resetSchema: function (object_name, record_id) {
        SteedosUI.Modal.confirm({
            title: "重置页面", 
            content: "重置页面后,会根据最新的对象字段配置生成一个新的页面版本.", 
            onOk: function(){
                $(document.body).addClass('loading');
                let url = `/service/api/page/resetDefaultSchema`;
                let options = {
                    type: 'post',
                    async: true,
                    data: JSON.stringify({ pageId: record_id }),
                    success: function (data) {
                        SteedosUI.notification.success({
                            message: '操作成功',
                            description: `页面已重置.`,
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
                            message: '操作失败',
                            description: t(XMLHttpRequest.responseJSON.error),
                        });
                        $(document.body).removeClass('loading');
                    }
                };
                Steedos.authRequest(url, options);
            }
        });
    },
    resetSchemaVisible: function (object_name, record_id, permission, record) {
        return record && !record.is_system && record.type === 'form';
    }
}