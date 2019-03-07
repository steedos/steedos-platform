const SimpleSchema = require('simpl-schema').default;
const detailSchema = require('./object_permission_set_detail');
module.exports = new SimpleSchema({
    none: {
        type: detailSchema,
        label: '',
        optional: true
    },
    user: {
        type: detailSchema,
        label: '用户',
        optional: true
    },
    admin: {
        type: detailSchema,
        label: '管理员',
        optional: true
    },
    workflow_admin: {
        type: detailSchema,
        label: '单位管理员',
        optional: true
    },
    member: {
        type: detailSchema,
        label: '成员',
        optional: true
    },
    guest: {
        type: detailSchema,
        label: '游客',
        optional: true
    }
})