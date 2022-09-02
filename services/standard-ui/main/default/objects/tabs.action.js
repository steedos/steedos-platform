module.exports = {
    generateObjectTabs: function (object_name, record_id, fields) {
        const appId = Session.get("app_id");
        const page = Steedos.Page.getPage('app', appId, object_name, null, "generate_object_tabs");
        const title = "对象选项卡";
        if (page && page.schema) {
            Steedos.Page.render(SteedosUI.Modal, page, Object.assign({}, {
                appId: appId,
                objectName: object_name,
                title: title
            }));
        }
    },
    generateObjectTabsVisible: function(object_name, record_id, record_permissions, record) {
        return Creator.baseObject.actions.standard_new.visible()
    }
}