/*
 * @Author: 殷亮辉 yinlianghui@hotoa.com
 * @Date: 2023-01-06 22:43:24
 * @LastEditors: 孙浩林 sunhaolin@steedos.com
 * @LastEditTime: 2024-04-28 10:38:18
 */
const baseFieldsName = [{ "name": "object", "required": true }, { "name": "label", "required": true },
{ name: '_name', required: true }, { "name": "type", "required": false }, { "name": "defaultValue" },
{ "name": "group" }, { "name": "sort_no" }, { "name": "is_name" }, { "name": "required" },
{ "name": "is_wide" }, { "name": "readonly" }, { "name": "hidden" }, { "name": "omit" },
{ "name": "index" }, { "name": "sortable" }, { "name": "searchable" }, { "name": "filterable" },
{ "name": "inlineHelpText" }, { "name": "description" }, { "name": "name" }, { "name": "_id" }];

const fieldSchema = require("@steedos/schemas/field/schema.json")
const _ = require("lodash")

export const getAllAllowedFieldNames = () => {
    const allProperties = fieldSchema.properties;
    const keys = _.keys(allProperties);
    return keys
}

export const getFieldsByType = (doc, type: string, dataType?: string) => {
    let fields: any[] = [];
    if (dataType) {
        fields = fields.concat(getFieldsByType(doc, dataType))
    }
    switch (type) {
        case 'textarea': {
            fields.push({ name: 'rows', required: false });
            break;
        }
        case 'select': {
            fields.push({ name: 'options', required: true });
            fields.push({ name: 'options.$', required: false });
            fields.push({ name: 'options.$.label', required: false });
            fields.push({ name: 'options.$.value', required: false });
            fields.push({ name: 'options.$.color', required: false });
            fields.push({ name: 'multiple' });
            break;
        }
        case 'number': {
            fields.push({ name: 'precision', required: false });
            fields.push({ name: 'scale', required: false });
            break;
        }
        case 'currency': {
            fields.push({ name: 'precision', required: false });
            fields.push({ name: 'scale', required: false });
            break;
        }
        case 'lookup': {
            fields.push({ name: 'reference_to' });
            fields.push({ name: 'filtersFunction' });
            fields.push({ name: 'optionsFunction' });
            fields.push({ name: 'multiple' });
            break;
        }
        case 'master_detail': {
            fields.push({ name: 'reference_to' });
            fields.push({ name: 'filtersFunction' });
            fields.push({ name: 'optionsFunction' });
            fields.push({ name: 'write_requires_master_read' });
            break;
        }
        case 'autonumber': {
            fields.push({ name: 'formula', required: true });
            break;
        }
        case 'formula': {
            fields.push({ name: 'formula', required: true });
            fields.push({ name: 'data_type', required: true });
            fields.push({ name: 'formula_blank_value', required: false });
            break;
        }
        case 'summary': {
            fields.push({ name: 'formula_blank_value', required: false });
            fields.push({ name: 'summary_object', required: true });
            fields.push({ name: 'summary_type', required: true });
            fields.push({ name: 'summary_filters', required: false });
            if (doc.summary_type != 'count') {
                fields.push({ name: 'summary_field', required: true });
            }
            fields.push({ name: 'data_type', required: false });
            fields.push({ name: 'precision', required: true });
            fields.push({ name: 'scale', required: true });
            fields.push({ name: 'filters' });
            fields.push({ name: 'filters.$' });
            fields.push({ name: 'filters.$.field' });
            fields.push({ name: 'filters.$.operation' });
            fields.push({ name: 'filters.$.value' });
            break;
        }
        default:
            break;
    }

    return baseFieldsName.concat(fields);
}


export const getFieldNamesFromDoc = (doc: any, fields?: any): string[] => {
    const docFieldNames: string[] = _.keys(doc) || [];

    let reFieldNames: string[] = [];
    for (const fieldName of docFieldNames) {
        if(_.includes(['$inc','$min','$max','$mul'], fieldName)){
            const keys = getFieldNamesFromDoc(doc[fieldName], fields);
            reFieldNames = reFieldNames.concat(keys);
        }
    }

    reFieldNames = _.union(reFieldNames, docFieldNames)
    
    if(fields){
        // 如果提供了fields，则进一步筛选，只返回fields中存在的字段我
        return reFieldNames.filter((docFieldName)=>{
            return !!fields[docFieldName];
        });
    }
    else{
        return reFieldNames;
    }
}