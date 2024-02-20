/*
 * @Author: sunhaolin@hotoa.com
 * @Date: 2022-02-28 09:25:02
 * @LastEditors: 孙浩林 sunhaolin@steedos.com
 * @LastEditTime: 2024-02-20 16:27:30
 * @Description: 
 */
const objectql = require("@steedos/objectql");

/**
 * 根据主表及子表字段生成对应的对象流程映射记录
 * @param {*} doc 
 */
async function createObjectWorkflow(doc) {
    const objectName = doc.object_name;
    const instanceFields = doc.instance_fields || [];
    const instanceTableFields = doc.instance_table_fields || []
    const owObj = objectql.getObject('object_workflows');
    const count = await owObj.count({ filters: [['space', '=', doc.space], ['flow_id', '=', doc._id], ['object_name', '=', objectName]] });
    if (count == 0) {
        const objectConfig = await objectql.getObject(objectName).toConfig();
        const baseInfo = {
            space: doc.space,
            company_id: doc.company_id,
            owner: doc.owner,
            created: new Date(),
            created_by: doc.created_by
        };
        let fieldMap = []
        // 主表映射
        for (const f of instanceFields) {
            fieldMap.push({
                object_field: f.name,
                workflow_field: f.name
            });
        }
        // 子表映射
        for (const tf of instanceTableFields) {
            const detailObjName = tf.detail_field_fullname.split('.')[0]
            for (const fName of tf.field_names) {
                fieldMap.push({
                    object_field: `${detailObjName}.${fName}`,
                    workflow_field: `${detailObjName}.${detailObjName}_${fName}`
                });
            }
        }
        await owObj.insert({
            ...baseInfo,
            name: `${doc.name}-${objectConfig.label}`,
            object_name: objectName,
            flow_id: doc._id,
            sync_attachment: 'lastest',
            sync_type: 'every_step',
            sync_direction: 'both',
            field_map_back: fieldMap,
            field_map: fieldMap,
            lock_record_after_approval: true
        })
    }
}

module.exports = {
    beforeUpdate: async function () {
        let doc = this.doc;
        let id = this.id;
        if (doc.hasOwnProperty('object_name')) {
            const currentDoc = await this.getObject(this.object_name).findOne(id, { fields: ['object_name'] });
            if (doc.object_name != currentDoc.object_name) {
                doc.instance_fields = [];
                doc.instance_table_fields = [];
            }
        }
    },
    afterInsert: async function () {
        const { doc } = this;
        if (doc.object_name) {
            await createObjectWorkflow(doc);
        }
    },
    afterUpdate: async function () {
        const { doc, previousDoc, id } = this;
        let objectName = doc.object_name;
        if (objectName && objectName != previousDoc.object_name) {
            const updatedDoc = await this.getObject(this.object_name).findOne(id);
            await createObjectWorkflow(updatedDoc);
        }
    },
}