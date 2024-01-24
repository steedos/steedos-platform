/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2023-12-29 17:16:35
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2024-01-24 10:55:23
 * @Description: 
 */

const _ = (lodash = require("lodash"));
const objectql = require('@steedos/objectql')

const getFieldAmis = (field, static, fieldAmis = {}, ctx = { showBorderBottom: true }) => {
    let className = ''
    if (field.is_wide || field.type === 'group') {
        if (field.type === 'table') {
            className = 'col-span-2 m-0';
        } else {
            className = 'col-span-2 m-1';
        }
    } else {
        className = 'm-1';
    }
    if (static) {
        fieldAmis.className = `${className} ${fieldAmis.className || ''}`;
        if (ctx.showBorderBottom && field.type != 'table' && ctx.inTable != true) {
            fieldAmis.className = `border-b ${fieldAmis.className || ''}`;
        }
    }
    return fieldAmis;
}

const convertFormFieldsToSteedosFields = (formFields, stepPermissions = {}, ctx) => {
    const steedosFields = [];

    _.each(formFields, (field) => {
        const static = stepPermissions[field.code] === 'editable' ? false : true;
        if (field.type === "table") {

            steedosFields.push({
                ...field.steedos_field,
                ..._.pickBy(field, (v, k) => {
                    return k != "type" && k != "fields" && k != 'steedos_field' && k != 'options';
                }),
                type: "table",
                name: field.code,
                label: field.name,
                // _prefix: `${field.code}.`,
                is_wide: true,
                subFields: _.map(field.fields, (fField) => {
                    const fStatic = stepPermissions[fField.code] === 'editable' ? false : true;
                    return {
                        ...fField.steedos_field,
                        ..._.pickBy(fField, (v, k) => {
                            return k != "type" && k != "steedos_field" && k != 'options';
                        }),
                        name: `${field.code}.$.${fField.code}`,
                        static: fStatic,
                        amis: getFieldAmis(fField, fStatic, fField.steedos_field?.amis, Object.assign({}, ctx, { inTable: true })),
                        description: null
                    };
                }),
                static: static,
                amis: getFieldAmis(field, static, field.steedos_field?.amis, ctx),
                description: null
            });
        } else {
            steedosFields.push({
                ...field.steedos_field,
                ..._.pickBy(field, (v, k) => {
                    return k != "type" && k != "steedos_field" && k != 'options';
                }),
                name: field.code,
                label: field.name,
                static: static,
                amis: getFieldAmis(field, static, field.steedos_field?.amis, ctx),
                description: null
            });
        }
    });
    return steedosFields;
}


const getFormVersion = async (formId, formVersionId)=>{
    const form = await objectql.getObject('forms').findOne(formId, {fields: ['current']})
    if(form){
        if(form.current._id === formVersionId){
            return form.current;
        }

        const oldForm = await objectql.getObject('forms').findOne(formId, {fields: ['historys']})

        return _.find(oldForm.historys, (history)=>{
            return history._id === formVersionId
        })
    }
}

const getFlowVersion = async (flowId, flowVersionId)=>{
    const flow = await objectql.getObject('flows').findOne(flowId, {fields: ['current']})
    if(flow){
        if(flow.current._id === flowVersionId){
            return flow.current;
        }

        const oldFlow = await objectql.getObject('flows').findOne(flowId, {fields: ['historys']})

        return _.find(oldFlow.historys, (history)=>{
            return history._id === flowVersionId
        })
    }
}

module.exports = {
    convertFormFieldsToSteedosFields,
    getFormVersion,
    getFlowVersion
}
