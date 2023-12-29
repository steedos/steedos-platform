/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2023-12-22 13:48:46
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2023-12-27 16:05:58
 * @Description: 
 * 1 更新表单字段
 * 2 如果绑定了对象,则更新对象字段映射
 * 3 如果绑定了对象,则更新flow的instance_fields, instance_table_fields字段.
 */
const designerManager = require('@steedos/workflow/src/designerManager')
const _ = require('lodash');

module.exports = {
    rest: {
        method: 'POST',
        fullPath: '/api/workflow/updateFormFields'
    },
    params: {
        formId: { type: 'string'},
        fields: { type: 'array', items: 'object' }
    },
    async handler(ctx) {
        const { fields, formId } = ctx.params;

        const { user } = ctx.meta;

        // 清理被前端组件污染的属性
        _.each(fields, (field)=>{
            if(field.type === 'table'){
                delete field.children
            }
        })

        // 检查数据结构, 防止旧数据处理异常.
        _.each(fields, (field)=>{
            if(field.type === 'table'){
                if(!field.relatedId){
                    throw new Error('字段数据异常, 点击设置字段修正数据后重试.')
                }
            }
        })

        const formObj = this.getObject('forms');
        const formDoc = await formObj.findOne(formId);
        let updatedForms = [];
        let updatedFlows = [];
        let userId = user.userId;

        formDoc.current.fields = fields;
        await designerManager.updateForm(formDoc._id, formDoc, updatedForms, updatedFlows, userId);

        const flowObj = this.getObject('flows');
        
        const owObj = this.getObject('object_workflows');

        const { _id: flowId, object_name: objectName} = (await flowObj.find({ filters: [['form', '=', formId]] }))[0];
        // 绑定了对象时
        if(objectName){
            const owDoc = (await owObj.find({ filters: [['object_name', '=', objectName], ['flow_id', '=', flowId]] }))[0];
            if (owDoc) {
                let fieldMap = []

                _.each(fields, (field)=>{
                    if(field.type === 'table'){
                        _.each(field.fields, (tField)=>{
                            const ofCode = `${field.code}.${tField.code.split(field.code + '_')[1]}`;
                            const wfCode = `${field.code}.${tField.code}`;
                            fieldMap.push({
                                object_field: ofCode,
                                workflow_field: wfCode
                            });
                        })
                    }else{
                        fieldMap.push({
                            object_field: field.code,
                            workflow_field: field.code
                        });
                    }
                })

                await owObj.directUpdate(owDoc._id, {
                    field_map_back: fieldMap,
                    field_map: fieldMap
                });

                const instance_fields = [];
                const instance_table_fields = [];

                _.each(fields, (field)=>{
                    if(field.type === 'table'){
                        instance_table_fields.push(Object.assign({}, {
                            detail_field_fullname: field.relatedId,
                            sort_order: 'asc',
                            field_names: _.map(field.fields, (tField)=>{
                                return tField.code.replace(`${field.code}_`, "")
                            })
                        }, { value: field.name, label: field.name }))
                    }else{
                        instance_fields.push(Object.assign({}, _.pickBy(field.steedos_field, (v,k)=>{return k == 'name' || k == 'label'}), {required: field.is_required}));
                    }
                })

                await flowObj.directUpdate(flowId, {
                    instance_fields, instance_table_fields
                })
            }
        }
    }
}