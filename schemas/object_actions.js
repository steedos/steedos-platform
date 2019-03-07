const SimpleSchema = require('simpl-schema').default;
module.exports = new SimpleSchema({
    object: {
        type: String,
        label: '所属对象',
        optional: true
    },
    name: {
        type: String,
        label: '名称',
        optional: true,
        regEx: /^[a-zA-Z_][a-zA-Z0-9_]*$/
    },
    label: {
        type: String,
        label: '显示名称',
        optional: true
    },
    is_enable: {
        type: Boolean,
        label: '是否已启用',
        optional: true
    },
    visible: {
        type: Boolean,
        label: '是否可见',
        optional: true
    },
    on: {
        type: String,
        label: '显示位置',
        allowedValues: ['list', 'record']
    },
    todo: {
        type: Function,
        label: '执行的脚本'
    }
})