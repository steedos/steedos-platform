/*
 * @Description: 提供action_field_updates(字段更新对象)需要的数据接口
 */

const register = require("@steedos/metadata-registrar");
const steedosI18n = require("@steedos/i18n");
const _ = require("lodash");
const clone = require("clone");

// 默认值字段代码：services/standard-object-database/main/default/services/object_fields.service.js

module.exports = {
    name: "object_fields",
    mixins: [],
    /**
     * Settings
     */
    settings: {

    },

    /**
     * Dependencies
     */
    dependencies: [],

    /**
     * Actions
     */
    actions: {
        getDefaultValueSchema: {
            // 需要传 objectName, targetObject(非必填), field_name 参数进来。
            rest: {
                method: "POST",
                path: "/defaultValue/schema"
            },
            async handler(ctx) {
                const data = await this.getDefaultValueSchema(ctx);
                return { status: 0, msg: "", data: data }
            }
        }
    },

    /**
     * Events
     */
    events: {

    },

    /**
     * Methods
     */
    methods: {
        /* defaultValue 字段使用*/
        getDefaultValueSchema: {
            async handler(ctx) {
                // console.log('ctx==>', ctx);
                const userSession = ctx.meta.user;
                const lng = userSession.language || 'zh-CN';
                const type = ctx.params.type || 'text';
                const objectName = ctx.params.object;
                const fieldName = ctx.params.name;
                const reference_to = ctx.params.reference_to;
                const options = ctx.params.options;
                const multiple = ctx.params.multiple;
                const filtersFunction = ctx.params.filtersFunction;
                const reference_to_field = ctx.params.reference_to_field || '_id';
                const _id = ctx.params._id;
                const mode = ctx.params.mode;
                const scale = ctx.params.scale;
                // const mode = global.mode;
                
                const partialType = ['text','textarea','html','code','markdown','boolean','toggle','date','datetime','time','password','url','email','color','location']; 
                // const fieldType = partialType.indexOf(type) > -1 ? type : 'text'; 

                let targetField = null;
                let NAME_FIELD_KEY = null;
                if (mode === 'read') {
                    const objectConfig = await register.getObjectConfig(objectName);
                    NAME_FIELD_KEY = objectConfig.NAME_FIELD_KEY || 'name';
                    targetField = objectConfig.fields[fieldName];
                }
                // console.log('targetField==>', targetField);
                const value = (targetField && targetField.defaultValue) || '';
                const translatedLabel = lng === 'zh-CN' ? "默认值" : 'DefaultValue';
                let defaultValue_schema = {
                    "type": "text",
                    "name": "defaultValue",
                    "label": translatedLabel,
                    "labelClassName": "text-left"
                }
                
                if(partialType.indexOf(type) > -1){
                    defaultValue_schema.type = type;
                }else if(type === 'select' && options){
                    defaultValue_schema.type = type;
                    defaultValue_schema.options = options;
                    defaultValue_schema.multiple = multiple;
                }else if(['lookup','master_detail'].includes(type) && reference_to){
                    defaultValue_schema.type = type;
                    defaultValue_schema.reference_to = reference_to;
                    defaultValue_schema.multiple = multiple;
                    defaultValue_schema.filtersFunction = filtersFunction;
                    defaultValue_schema.reference_to_field = reference_to_field;
                } else if(['number','currency','percent'].includes(type)){
                    defaultValue_schema.type = type;
                    defaultValue_schema.scale = scale;
                }
                let body = [];
                let steedos_field = {
                    type:'steedos-field', 
                    name:'defaultValue', 
                    clearValueOnHidden: true,
                    fieldName: 'defaultValue', 
                    field: defaultValue_schema,
                    value: value,
                    readonly: mode === 'read' ?  true : false
                };
                if(mode === 'read'){
                    const baseFieldConfig = {
                        "name": "defaultValue",
                        "label": translatedLabel,
                        "labelClassName": "text-left",
                        "clearValueOnHidden": true,
                        "fieldName": "defaultValue"
                    }
                    const regDoubleQuote = /\$\{([^}]*)\}/g; // 更改捕获组内容：([^}]*) 匹配非 } 字符
                    if(_.isString(value) && regDoubleQuote.test(value)){
                        // 只读时值是公式就显示公式
                        steedos_field = {
                            "type": "static",
                            "label": translatedLabel,
                            "tpl": value.replace(regDoubleQuote, '\\${$1}'),
                            "labelClassName": "text-left",
                            "name": "defaultValue"
                        }
                    }else if(['number','currency','percent'].includes(type)){
                        steedos_field = {
                            ...baseFieldConfig,
                            "type": "static-tpl",
                            "tpl": `<div>${value}</div>`,
                            "className": "m-1 md:border-b steedos-static-tpl-readonly",
                            "quickEdit": false,
                        }
                    }else if(['date','datetime','time'].includes(type)){
                        let fieldTypeConfig ={};
                        if(type==='date'){
                            fieldTypeConfig = {
                                "type": "input-date",
                                "inputFormat": "YYYY-MM-DD",
                                "format": "YYYY-MM-DDT00:00:00.000[Z]",
                                "className": "m-1 steedos-input-date-edit",
                            }
                        }else if(type==='datetime'){
                            fieldTypeConfig = {
                                "type": "input-datetime",
                                "inputFormat": "YYYY-MM-DD HH:mm",
                                "format": "YYYY-MM-DDTHH:mm:ss.SSSZ",
                                "className": "m-1 steedos-input-datetime-edit",
                            }
                        }else if(type==='time'){
                            fieldTypeConfig = {
                                "type": "input-time",
                                "inputFormat": "HH:mm",
                                "format": "1970-01-01THH:mm:00.000[Z]",
                                "className": "m-1 steedos-input-time-edit",
                            }
                        }
                        steedos_field = {
                            ...baseFieldConfig,
                            ...fieldTypeConfig,
                            value: value,
                            static: true
                        }
                    }else if(['boolean'].includes(type)){
                        steedos_field = {
                            ...baseFieldConfig,
                            value: value,
                            "type": "static",
                            "tpl": `${value}`,
                            "className": "m-1 md:border-b steedos-static-readonly"
                        }
                    }else if(['lookup','master_detail'].includes(type)){
                        // console.log('t==>', type, reference_to, NAME_FIELD_KEY, targetField)
                        if(value && value.length && _.isString(reference_to)){
                            const query = {
                                fields: [NAME_FIELD_KEY],
                                filters: [reference_to_field, '=', value]
                            }
                            const res = await this.broker.call(
                                'objectql.find', 
                                {
                                  objectName: reference_to,
                                  query
                                }
                            );
                            // console.log('res==>', res, reference_to, NAME_FIELD_KEY, targetField);
                            const tpl = _.map(res, NAME_FIELD_KEY).join('、')
                            steedos_field = {
                                "type": "control",
                                "label": translatedLabel,
                                "body": {
                                    "name": "defaultValue",
                                    "label": translatedLabel,
                                    "labelClassName": "text-left",
                                    "type": "tpl",
                                    "tpl": tpl
                                },
                                value: value
                            }
                        }
                    }
                    body = [steedos_field];
                }else{
                    body = [steedos_field];
                    body[0].field.amis = {
                        // disabledOn: "!!this.defaultValue_formula",
                        "clearable": true,
                        "className": {
                            "defaultValue_field_hidden": "!this.defaultValue && (!this.defaultValue || '').toString() && !!this.defaultValue_formula"
                        }
                    }
                    body.push({
                        "name": "defaultValue_formula",
                        "label": translatedLabel,
                        "evalMode": false,
                        "type": "input-formula",
                        "placeholder": "公式",
                        "variableMode": "tabs",
                        "variables": "${defaultValueVariables}", //公式编辑器内引用的变量，在对象字段表单微页面内定义
                        "visibleOn": "${defaultValueVariables}",
                        // "disabledOn": "!!this.defaultValue && !!this.defaultValue.toString()",
                        "className": {
                            "defaultValue_field_formula": true,
                            "defaultValue_field_formula_visible": "!!this.defaultValue_formula",
                            "defaultValue_field_formula_hidden": "(!!this.defaultValue && !!this.defaultValue.toString()) || (!this.defaultValue && !this.defaultValue_formula)"
                        }
                    })
                }
                // console.log('body==>', body);
                return {
                    body
                }
            }
        }
    }
};
