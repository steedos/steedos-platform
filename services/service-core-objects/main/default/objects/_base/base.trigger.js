const objectql = require('@steedos/objectql');
const _ = require('underscore');

const afterDeleteBase = async function () {
    const { object_name, previousDoc } = this;
    if (!previousDoc) {
        return;
    }

    const object = objectql.getObject(object_name);
    const objectConfig = object.toConfig();
    const fields = objectConfig.fields;
    const fieldsName = _.keys(previousDoc);

    for (const fieldName of fieldsName) {
        const fieldProps = fields[fieldName];
        const indexOfType = fieldProps && ['file', 'image'].indexOf(fieldProps.type);
        if (indexOfType > -1 && previousDoc[fieldName] && previousDoc[fieldName].length) {
            const collection = ['cfs_files_filerecord', 'cfs_images_filerecord'][indexOfType];
            let ids = previousDoc[fieldName]
            if (typeof ids === 'string') {
                ids = [ids]
            }
            for (const id of ids) {
                await objectql.getObject(collection).delete(id)
            }
        }
    }

    if ("cms_files" != object_name) {
        // 删除附件
        const cmsFilesObj = objectql.getObject('cms_files')
        const cmsFiles = await cmsFilesObj.find({
            filters: [
                ["parent/o", "=", object_name],
                ["parent/ids", "=", previousDoc._id]
            ]
        })
        for (const cmsFile of cmsFiles) {
            await cmsFilesObj.delete(cmsFile._id)
        }
    }
}

module.exports = {
    listenTo: 'base',
    afterDelete: async function () {
        return await afterDeleteBase.apply(this, arguments)
    }
}