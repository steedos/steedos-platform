/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-03-28 09:35:34
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2022-11-04 10:05:32
 * @Description: 
 */
import { uniqBy } from 'lodash';
const collection_name = 'permission_fields';

export async function getObjectFieldPermissions(dbManager, objectApiName, permissionSetId) {
    const fieldsPermission: any = [];
    const records = await dbManager.find(collection_name, { permission_set_id: permissionSetId, object_name: objectApiName });
    for (const record of records) {
        fieldsPermission.push({
            field: record.field,
            readable: record.readable,
            editable: record.editable
        })
    }
    return uniqBy(fieldsPermission, "field");
}

export async function saveOrUpdateFieldPermissions(dbManager, permissionSetName, objectName, objectPermission) {
    if (!objectPermission.field_permissions) {
        return;
    }
    for (const field_permission of objectPermission.field_permissions) {
        const filter = { permission_set_id: permissionSetName, object_name: objectName, field: field_permission.field };
        const dbField = await dbManager.findOne(collection_name, filter);

        let fieldPermission = {
            name: `${permissionSetName}.${objectName}.${field_permission.field}`,
            permission_set_id: permissionSetName,
            permission_object: objectPermission.name,
            object_name: objectName,
            field: field_permission.field,
            readable: field_permission.readable,
            editable: field_permission.editable
        }

        if (dbField == null) {
            await dbManager.insert(collection_name, fieldPermission);
        } else {
            await dbManager.update(collection_name, filter, fieldPermission);
        }
    }
}