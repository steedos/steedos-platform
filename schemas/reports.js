// 报表
const SimpleSchema = require('simpl-schema').default;
module.exports = new SimpleSchema({
    name: {
        type: String,
        label: '名称'
    },
    report_type: {
        type: String,
        label: '报表类型',
        optional: true,
        defaultValue: 'tabular',
        allowedValues: ['tabular', 'summary', 'matrix']
    },
    object_name: {
        type: String,
        label: '对象名'
    },
    filter_scope: {
        type: String,
        label: '过滤范围',
        optional: true,
        defaultValue: 'space',
        allowedValues: ['space', 'mine']
    },
    filters: {
        type: Array,
        label: '过滤条件',
        optional: true
    },
    'filters.$': {
        type: Object,
        label: '过滤器',
        optional: true,
        blackbox: true
    },
    'filters.$.field': {
        type: String,
        label: '字段名',
        optional: true
    },
    'filters.$.operation': {
        type: String,
        label: '操作符',
        optional: true,
        defaultValue: "=",
        allowedValues: ['=', '<>', '<', '>', '<=', '>=', 'contains', 'notcontains', 'startswith', 'between']
    },
    'filters.$.value': {
        type: SimpleSchema.oneOf(String, Number, SimpleSchema.Integer, Boolean, {
            type: Object,
            blackbox: true
        }, Date),
        label: '字段值',
        optional: true,
        blackbox: true
    },
    filter_logic: {
        type: String,
        label: '过滤逻辑',
        optional: true
    },
    fields: {
        type: Array,
        label: '字段',
        optional: true
    },
    'fields.$': String,
    rows: {
        type: Array,
        label: '行',
        optional: true
    },
    'rows.$': String,
    columns: {
        type: Array,
        label: '列',
        optional: true
    },
    'columns.$': String,
    values: {
        type: Array,
        label: '统计',
        optional: true
    },
    'values.$': String,
    filter_fields: {
        type: Array,
        label: '默认过虑字段',
        optional: true
    },
    'filter_fields.$': String,
    options: {
        type: Object,
        label: '操作',
        optional: true,
        blackbox: true
    },
    description: {
        type: String,
        label: '描述',
        optional: true
    },
    charting: {
        type: Boolean,
        label: '显示图表',
        optional: true,
        defaultValue: true
    },
    grouping: {
        type: Boolean,
        label: '显示小计',
        optional: true,
        defaultValue: true
    },
    totaling: {
        type: Boolean,
        label: '显示总计',
        optional: true,
        defaultValue: true
    },
    counting: {
        type: Boolean,
        label: '显示记录计数',
        optional: true,
        defaultValue: true
    }
})