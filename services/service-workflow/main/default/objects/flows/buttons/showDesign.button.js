/*
 * @Author: 李海龙 220 lihailong@steedos.com
 * @Date: 2023-03-13 06:22:57
 * @LastEditors: 殷亮辉 yinlianghui@hotoa.com
 * @LastEditTime: 2023-04-12 23:02:43
 */
module.exports = {
    showDesign: function (object_name, record_id) {
        //这里/api/amisFormDesign?PagId 改为 id
        document.location = Steedos.absoluteUrl(`/api/amisFormDesign?id=${record_id}`);
    },
    showDesignVisible: function (object_name, record_id, record_permissions, data) {
        var record = data && data.record;
        return record.enable_amisform;
    },
	// 通过判断该流程是否绑定对象，决定流程详情页-标题面板上是否显示“添加字段”按钮
    addFormFields: function (object_name, record_id) {
        //这里/api/amisFormDesign?PagId 改为 id
        document.location = Steedos.absoluteUrl(`/api/amisFormDesign?id=${record_id}`);
    },
    addFormFieldsVisable: function (object_name, record_id, record_permissions, data) {
        var record = data && data.record;
        return record.object_name;
    }

}
