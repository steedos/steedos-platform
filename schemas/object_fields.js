const SimpleSchema = require('simpl-schema').default;
module.exports = new SimpleSchema({
    name: {
        type: String,
        label: '字段名',
        regEx: /^[a-zA-Z_]\w*(\.\$\.\w+)?[a-zA-Z0-9]*$/
    },
    label: {
        type: String,
        label: '显示名称',
        optional: true
    },
    is_name: {
        type: Boolean,
        label: '',
        optional: true
    },
    object: {
        type: String,
        label: '所属对象',
        optional: true
    },
    type: {
        type: String,
        label: '字段类型',
        optional: true,
        allowedValues: ['text', 'textarea', 'html', 'select', 'boolean', 'date', 'datetime', 'number', 'currency', 'password', 'lookup', 'master_detail', 'grid', 'url', 'email']
    },
    sort_no: {
        type: Number,
        label: '排序号',
        optional: true,
        defaultValue: 100
    },
    group: {
        type: String,
        label: '字段分组',
        optional: true
    },
    defaultValue: {
        type: String,
        label: '默认值',
        optional: true
    },
    allowedValues: {
        type: Array,
        label: '允许的值',
        optional: true
    },
    'allowedValues.$': String,
    multiple: {
        type: Boolean,
        label: '多选',
        optional: true
    },
    required: {
        type: Boolean,
        label: '必填',
        optional: true
    },
    is_wide: {
        type: Boolean,
        label: '宽字段',
        optional: true
    },
    readonly: {
        type: Boolean,
        label: '只读',
        optional: true
    },
    hidden: {
        type: Boolean,
        label: '',
        optional: true
    },
    omit: {
        type: Boolean,
        label: '忽略',
        optional: true
    },
    index: {
        type: Boolean,
        label: '创建索引',
        optional: true
    },
    searchable: {
        type: Boolean,
        label: '可搜索',
        optional: true
    },
    sortable: {
        type: Boolean,
        label: '可排序',
        optional: true
    },
    precision: {
        type: Number,
        label: '精度(数字长度)',
        optional: true,
        defaultValue: 18
    },
    scale: {
        type: Number,
        label: '小数位数',
        optional: true,
        defaultValue: 2
    },
    reference_to: {
        type: String,
        label: '引用对象',
        optional: true
    },
    rows: {
        type: Number,
        label: '多行文本行数',
        optional: true
    },
    options: {
        type: String,
        label: '选择项',
        optional: true
    },
    description: {
        type: String,
        label: '描述',
        optional: true
    },
    reference_sort: {
        type: Object,
        label: '',
        optional: true,
        blackbox: true
    },
    reference_limit: {
        type: Number,
        label: '',
        optional: true
    },
    optionsFunction: {
        type: Function,
        label: '',
        optional: true
    },
    filterable: {
        type: Boolean,
        label: '',
        optional: true
    }
})