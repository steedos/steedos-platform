module.exports = {
    extend: 'base',
    actions: {
        standard_query: {
            label: "Search",
            visible: function () {
                return Steedos.StandardObjects.Base.Actions.standard_query.visible.apply(this, arguments)
            },
            on: "list",
            todo: "standard_query"
        },
        standard_new: {
            label: "New",
            visible: function (object_name) {
                return Steedos.StandardObjects.Base.Actions.standard_new.visible.apply(this, arguments)
            },
            on: "list",
            todo: "standard_new"
        },
        standard_open_view: {
            label: "Open",
            visible: false,
            on: "list_item",
            todo: "standard_open_view"
        },
        standard_edit: {
            label: "Edit",
            sort: 0,
            visible: function (object_name, record_id, record_permissions) {
                return Steedos.StandardObjects.Base.Actions.standard_edit.visible.apply(this, arguments)
            },
            on: "record",
            todo: "standard_edit"
        },
        standard_delete: {
            label: "Delete",
            visible: function (object_name, record_id, record_permissions) {
                return Steedos.StandardObjects.Base.Actions.standard_delete.visible.apply(this, arguments)
            },
            on: "record_more",
            todo: "standard_delete"
        },
        standard_delete_many: {
            label: "Delete",
            visible: function (object_name, record_id, record_permissions) {
                var currentListView = Creator.getListView();
                var isCalendar = currentListView && currentListView.type === "calendar";
                if(Steedos.isMobile() || isCalendar){
                    return false;
                }
                return Steedos.StandardObjects.Base.Actions.standard_delete_many.visible.apply(this, arguments)
            },
            on: "list",
            todo: function () {
                return Steedos.StandardObjects.Base.Actions.standard_delete_many.todo.apply(this, arguments)
            }
        },
        standard_approve: {
            label: "Initiate Approval",
            visible: function (object_name, record_id, record_permissions) {
                return Steedos.StandardObjects.Base.Actions.standard_approve.visible.apply(this, arguments)
            },
            on: "record_only",
            todo: function () {
                return Steedos.StandardObjects.Base.Actions.standard_approve.todo.apply(this, arguments)
            }
        },
        standard_view_instance: {
            label: "View Instance",
            visible: function (object_name, record_id, record_permissions) {
                return Steedos.StandardObjects.Base.Actions.standard_view_instance.visible.apply(this, arguments)
            },
            on: "record_only",
            todo: function () {
                return Steedos.StandardObjects.Base.Actions.standard_view_instance.todo.apply(this, arguments)
            }
        },
        standard_follow: {
            label: "Follow",
            visible: function (object_name, record_id, record_permissions) {
                return Steedos.StandardObjects.Base.Actions.standard_follow.visible.apply(this, arguments)
            },
            on: "list",
            todo: function () {
                return Steedos.StandardObjects.Base.Actions.standard_follow.todo.apply(this, arguments)
            }
        },
        standard_submit_for_approval: {
            visible: function (object_name, record_id) {
                return Steedos.StandardObjects.Base.Actions.standard_submit_for_approval.visible.apply(this, arguments)
            },
            on: "record_only",
            todo: function (object_name, record_id) {
                return Steedos.StandardObjects.Base.Actions.standard_submit_for_approval.todo.apply(this, arguments)
            }
        }
    },
    triggers: {
        "before.insert.client.default": {
            on: "client",
            when: "before.insert",
            todo: function (userId, doc) {
                return doc.space = Session.get("spaceId");
            }
        }
    }
};