const SimpleSchema = require('simpl-schema').default;
module.exports = new SimpleSchema({
    allowCreate: {
        type: Boolean,
        label: '允许添加',
        optional: true
    },
    allowDelete: {
        type: Boolean,
        label: '允许删除',
        optional: true
    },
    allowEdit: {
        type: Boolean,
        label: '允许编辑',
        optional: true
    },
    allowRead: {
        type: Boolean,
        label: '允许读取',
        optional: true
    },
    modifyAllRecords: {
        type: Boolean,
        label: '允许编辑所有',
        optional: true
    },
    viewAllRecords: {
        type: Boolean,
        label: '允许读取所有',
        optional: true
    },
    modifyCompanyRecords: {
        type: Boolean,
        label: '允许编辑单位级记录',
        optional: true
    },
    viewCompanyRecords: {
        type: Boolean,
        label: '允许读取单位级记录',
        optional: true
    },
    disabled_list_views: {
        type: Array,
        label: '禁用视图',
        optional: true
    },
    'disabled_list_views.$': String,
    disabled_actions: {
        type: Array,
        label: '禁止动作',
        optional: true
    },
    'disabled_actions.$': String,
    unreadable_fields: {
        type: Array,
        label: '不可见字段',
        optional: true
    },
    'unreadable_fields.$': String,
    uneditable_fields: {
        type: Array,
        label: '不可编辑字段',
        optional: true
    },
    'uneditable_fields.$': String,
    unrelated_objects: {
        type: Array,
        label: '',
        optional: true
    },
    'unrelated_objects.$': String
})