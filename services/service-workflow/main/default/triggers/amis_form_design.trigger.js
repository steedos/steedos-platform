const _ = require('lodash');
const workflow = require('@steedos/workflow');
const objectql = require("@steedos/objectql");
const AmisInputTypes = [
    //44个表单项
    'input-image',
    'input-number',
    'input-group',
    'input-file',
    'input-text',
    'submit',
    'uuid',
    'checkbox',
    'checkboxes',
    'radios',
    'list-select',
    'input-tag',
    'switch',
    'static',
    'button-toolbar',
    'button',
    'input-city',
    'input-color',
    'matrix-checkboxes',
    'nested-select',
    'picker',
    'input-repeat',
    'input-rich-text',
    'input-table',
    'input-color',
    'text',
    'combo',
    'chained-select',
    'transfer',
    'input-tree',
    'tree-select',
    'input-excel',
    'input-kv',
    'input-date-range',
    'input-range',
    'input-rating',
    'input-sub-form',
    'input-date',
    'textarea',
    'tabs-transfer',
    'select',
    'fieldset',
    'formula',
    'hidden',
    'location-picker',
    'tabs-transfer'
];

// getInstanceFormSchema() 在用户创建的表单中获取到type为form name为instanceForm的表单，其他的表单不要
function getInstanceFormSchema(amis_schema) {

    if (amis_schema.type === 'form' && amis_schema.name === 'instanceForm') {
        const proper_schema = amis_schema;
        return proper_schema;
    }

    const body = amis_schema.body;

    if (_.isArray(body)) {
        for (const item of body) {
            return getInstanceFormSchema(item);
        }
    }

}

// getInputFiled() 对符合条件的formSchema做解析处理,得到{label:"F1", name: 'f1', type: 'text'}对象作为数组元素
function getInputFiled(bodyItem) {
    if (!_.isArray(bodyItem)) {
        if (_.includes(AmisInputTypes, bodyItem.type)) {
            // console.log(bodyItem);
            return bodyItem
        }
    }
}

// getFormInputFields() 得到一个存有formSchema.body，即存有用户创建表单内各组建字段的数组
function getFormInputFields(formSchema) {

    const inputFields = [];

    _.each(formSchema.body, (bodyItem) => {

        let flag = true;
        const field = getInputFiled(bodyItem);
        if (field) {
            //加个判断条件：如果要添加的field
            _.each(inputFields, (item) => {
                if (field.name === item.name) {
                    flag = false;
                }
            })
            if (flag) {
                inputFields.push(field);
            }
        }

    })
    console.log('inputFields', inputFields);
    return inputFields;
}

module.exports = {
    listenTo: 'forms',

    afterUpdate: async function () {

        // 判断doc中是否有amis_schema字段
        if (_.has(this.doc, 'amis_schema')) {

            const amis_schema = JSON.parse(this.doc.amis_schema);
            // 在amis_schema中提取符合条件的amis_schema,若不符合则返回空
            const formSchema = getInstanceFormSchema(amis_schema);
            if (!formSchema) {
                return;
            }
            const formFields = getFormInputFields(formSchema);
            // 先通过id得到forms对象存下来
            const form = await objectql.getObject('forms').findOne(this.id);
            delete form.historys;
            // 数据库更新操作：将forms表current的fields更新为formFields
            form.current.fields = formFields;


            // 以下为将解析字段存储的功能,为将解析字段存储至数据库forms表的功能
            let updatedForms = [];
            let updatedFlows = [];
            let userId = this.userId;
            let spaceId = this.spaceId;
            let roles = this.roles;
            // 执行者的身份校验
            workflow.desingerManager.checkSpaceUserBeforeUpdate(spaceId, userId, roles);
            // 更新表单
            workflow.desingerManager.updateForm(this.id, form, updatedForms, updatedFlows, userId);

        }

    },

}