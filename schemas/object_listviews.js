const SimpleSchema = require('simpl-schema').default;
module.exports = new SimpleSchema({
    name: {
        type: String,
        label: '列表视图名称',
        optional: true
    },
    label: {
        type: String,
        label: '显示名称',
        optional: true
    },
    object_name: {
        type: String,
        label: '对象',
        optional: true
    },
    filter_scope: {
        type: String,
        label: '过滤范围',
        defaultValue: 'space',
        allowedValues: ['mine', 'space']
    },
    columns: {
        type: Array,
        label: '需要显示的列',
        optional: true
    },
    'columns.$': String,
    filter_fields: {
        type: Array,
        label: '默认过虑字段',
        optional: true
    },
    'filter_fields.$': String,
    shared: {
        type: Boolean,
        label: '共享视图到工作区',
        optional: true
    },
    shared: {
        type: Boolean,
        label: '共享视图到工作区',
        optional: true
    },
    sort: {
        type: Array,
        label: '默认排序规则',
        optional: true
    },
    'sort.$': {
        type: Object,
        label: '排序条件',
        optional: true,
        blackbox: true
    },
    'sort.$.field_name': {
        type: String,
        label: '排序字段',
        optional: true
    },
    'sort.$.order': {
        type: String,
        label: '排序方式',
        optional: true,
        defaultValue: 'asc',
        allowedValues: ['asc', 'desc']
    },
    filters: {
        type: Array,
        label: '过滤器',
        optional: true
    },
    'filters.$': {
        type: Object,
        label: '过滤条件',
        optional: true,
        blackbox: true
    },
    'filters.$.field': {
        type: String,
        label: '字段',
        optional: true
    },
    'filters.$.operation': {
        type: String,
        label: '运算符',
        optional: true
    },
    'filters.$.value': {
        type: String,
        label: '值',
        optional: true
    },
    filter_logic: {
        type: String,
        label: '过滤逻辑',
        optional: true
    },
    is_default: {
        type: Boolean,
        label: '是否为默认视图',
        optional: true,
        defaultValue: false
    }

})