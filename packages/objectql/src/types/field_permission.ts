/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-03-28 09:35:34
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2023-05-30 10:46:30
 * @Description: 
 */
import { registerPermissionFields } from '@steedos/metadata-registrar';
import { getSteedosSchema } from '../types'
import * as _ from 'lodash'

export class FieldPermission {

    static async getObjectFieldsPermission(objectApiName, permissionSetApiName) {
        const schema = getSteedosSchema();
        return await registerPermissionFields.find(schema.broker, {
            pattern: `${permissionSetApiName}.${objectApiName}.*`
        })
    }

    static async getObjectFieldsPermissionGroupRole(objectApiName) {
        const permissions = await this.getObjectFieldsPermission(objectApiName, '*');
        const result = {};
        _.each(permissions, (permission) => {
            const { permission_set_id, field, editable, readable } = permission.metadata;
            if (!result[permission_set_id]) {
                result[permission_set_id] = [];
            }
            result[permission_set_id].push({ field: field, read: readable, edit: editable })
        })
        return result;
    }

    static async getObjectsFieldsPermissionGroupRole() {
        const permissions = await this.getObjectFieldsPermission('*', '*');
        const result = {};
        _.each(permissions, (permission) => {
            if (!result[permission.object_name]) {
                result[permission.object_name] = {};
            }
            const { permission_set_id, field, editable, readable } = permission.metadata;
            if (!result[permission.object_name][permission_set_id]) {
                result[permission.object_name][permission_set_id] = [];
            }
            result[permission.object_name][permission_set_id].push({ field: field, read: readable, edit: editable })
        })
        return result;
    }
}