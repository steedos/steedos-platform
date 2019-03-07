const SimpleSchema = require('simpl-schema').default;
module.exports = new SimpleSchema({
    object_name: {
        type: String,
        label: '所属对象',
        regEx: /^[a-zA-Z_]\w*(\.\$\.\w+)?[a-zA-Z0-9]*$/
    },
    type: {
        type: String,
        label: '类型'
    },
    beforeInsert: {
        type: Function,
        label: '新增记录之前',
        optional: true
    },
    beforeUpdate: {
        type: Function,
        label: '修改记录之前',
        optional: true
    },
    beforeDelete: {
        type: Function,
        label: '删除记录之前',
        optional: true
    },
    afterInsert: {
        type: Function,
        label: '新增记录之后',
        optional: true
    },
    afterUpdate: {
        type: Function,
        label: '修改记录之后',
        optional: true
    },
    afterDelete: {
        type: Function,
        label: '删除记录之后',
        optional: true
    }
})