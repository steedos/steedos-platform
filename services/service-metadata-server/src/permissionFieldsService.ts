import * as _ from 'lodash';
const metadataService = require('./metadataService');
const SERVICE_NAME = 'permission_fields';
const METADATA_TYPE = 'permission_fields';
const objectql = require("@steedos/objectql");

const systemFields = ['owner', 'created', 'created_by', 'modified', 'modified_by', 'locked', 'company_id', 'company_ids', 'instance_state'];

async function getFieldPermission(apiName) {
    const schema = objectql.getSteedosSchema();
    const config = await objectql.registerPermissionFields.get(schema.broker, apiName)
    return config ? config.metadata : null;
}

const getFieldDefaultEditable = (field) => {
    if (_.includes(systemFields, field.name) && (field.omit || field.hidden || field.readonly || field.disabled)) {
        return false;
    }
    if (field.omit || field.hidden || field.readonly || field.disabled) {
        return false;
    }
    return true;
}

const getFieldDefaultReadable = (field) => {
    if (_.includes(systemFields, field.name) && !field.hidden) {
        return true;
    }
    if (field.hidden) {
        return false
    }
    return true;
}

module.exports = {
    name: SERVICE_NAME,
    mixins: [metadataService],
    settings: {
        metadataType: METADATA_TYPE
    },
    methods: {
        resetFieldPermissions: {
            async handler(permissionObjectId: string, userSession: any) {
                const record = await objectql.getObject('permission_objects').findOne(permissionObjectId)
                const permissionSet = await objectql.getObject('permission_set').findOne(record.permission_set_id)
                //获取对象所有字段
                const fields = await objectql.getObject('object_fields').find({ filters: [['object', '=', record.object_name]] });
                const now = new Date();
                for (const field of fields) {
                    const result = await objectql.getObject('permission_fields').directFind({ filters: [['permission_set_id', '=', permissionSet.name], ['permission_object', '=', record.name], ['object_name', '=', record.object_name], ['field', '=', field.name], ['is_system', '!=', true]] });
                    const count = result.length;
                    if (count == 0) {
                        const apiName = `${permissionSet.name}.${record.object_name}.${field.name}`
                        const fieldPermission = await getFieldPermission(apiName)
                        await objectql.getObject('permission_fields').directInsert({
                            name: apiName,
                            permission_set_id: permissionSet.name,
                            permission_object: record.name,
                            object_name: record.object_name,
                            field: field.name,
                            editable: fieldPermission ? fieldPermission.editable : getFieldDefaultEditable(field),
                            readable: fieldPermission ? fieldPermission.readable : getFieldDefaultReadable(field),
                            owner: userSession.userId,
                            space: userSession.spaceId,
                            created: now,
                            modified: now,
                            created_by: userSession.userId,
                            modified_by: userSession.userId,
                            company_id: userSession.company_id,
                            company_ids: userSession.company_ids
                        })
                    }
                }
                //删除已删除、卸载的字段权限
                const fieldsPermission = await objectql.getObject('permission_fields').find({ filters: [['permission_set_id', '=', permissionSet.name], ['object_name', '=', record.object_name]] });
                const allFields = _.map(fieldsPermission, 'field');
                const objectFields = _.map(fields, 'name');
                const diffFields = _.difference(allFields, objectFields);
                for (const diffField of diffFields) {
                    const fieldPermission = _.find(fieldsPermission, (fp) => {
                        return fp.field == diffField
                    })
                    await objectql.getObject('permission_fields').delete(fieldPermission._id)
                }
            }
        }
    },
    actions: {
        resetFieldPermissions: {
            async handler(ctx) {
                const userSession = ctx.meta.user;
                const { permissionObjectId } = ctx.params;
                return await this.resetFieldPermissions(permissionObjectId, userSession)
            }
        },
        resetAllPermissionSetFieldPermissions: {
            async handler(ctx) {
                const userSession = ctx.meta.user;
                const { objectName } = ctx.params;
                const records = await objectql.getObject('permission_objects').directFind({ filters: [['object_name', '=', objectName]] })
                for (const record of records) {
                    await this.resetFieldPermissions(record._id, userSession)
                }
            }
        }
    }
};