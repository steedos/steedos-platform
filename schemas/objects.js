const SimpleSchema = require('simpl-schema');
module.exports = new SimpleSchema({
    name: {
        type: String,
        label: '对象名',
        regEx: /^[a-zA-Z_][a-zA-Z0-9_]*$/
    },
    label: {
        type: String,
        label: '显示名称'
    },
    icon: {
        type: String,
        label: '图标',
        optional: true
    },
    is_enable: {
        type: Boolean,
        label: '已启用',
        optional: true
    },
    enable_search: {
        type: Boolean,
        label: '允许搜索',
        optional: true
    },
    enable_files: {
        type: Boolean,
        label: '允许上传附件',
        optional: true
    },
    enable_tasks: {
        type: Boolean,
        label: '允许添加任务',
        optional: true
    },
    enable_notes: {
        type: Boolean,
        label: '允许添加备注',
        optional: true
    },
    enable_events: {
        type: Boolean,
        label: '允许添加事件',
        optional: true
    },
    enable_api: {
        type: Boolean,
        label: '允许 API 访问',
        optional: true
    },
    enable_share: {
        type: Boolean,
        label: '允许共享记录',
        optional: true
    },
    enable_instances: {
        type: Boolean,
        label: '允许查看申请单',
        optional: true
    },
    enable_chatter: {
        type: Boolean,
        label: '允许添加评论',
        optional: true
    },
    enable_audit: {
        type: Boolean,
        label: '记录字段历史',
        optional: true
    },
    enable_trash: {
        type: Boolean,
        label: '允许假删除',
        optional: true
    },
    enable_space_global: {
        type: Boolean,
        label: '允许存放标准数据',
        optional: true
    },
    is_view: {
        type: Boolean,
        label: '',
        optional: true
    },
    hidden: {
        type: Boolean,
        label: '隐藏',
        optional: true
    },
    description: {
        type: String,
        label: '描述',
        optional: true
    },
    sidebar: {
        type: Object,
        label: '左侧列表',
        optional: true,
        blackbox: true
    },
    fields: {
        type: Object,
        label: '字段',
        optional: true,
        blackbox: true
    },
    list_views: {
        type: Object,
        label: '列表视图',
        optional: true,
        blackbox: true
    },
    actions: {
        type: Object,
        label: '操作',
        optional: true,
        blackbox: true
    },
    permission_set: {
        type: Object,
        label: '权限设置',
        optional: true,
        blackbox: true
    },
    triggers: {
        type: Object,
        label: '触发器',
        optional: true,
        blackbox: true
    },
    custom: {
        type: Boolean,
        label: '规则',
        optional: true
    },
    owner: {
        type: String,
        label: '所有者',
        optional: true
    },
    app_unique_id: {
        type: String,
        label: '',
        optional: true
    },
    app_version: {
        type: String,
        label: '',
        optional: true
    }
})