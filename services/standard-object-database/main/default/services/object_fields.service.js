/*
 * @Description: 提供action_field_updates(字段更新对象)需要的数据接口
 */

const register = require("@steedos/metadata-registrar");
const steedosI18n = require("@steedos/i18n");
const _ = require("lodash");
const clone = require("clone");
const serviceObjectMixin = require('@steedos/service-object-mixin');
// 默认值字段代码：services/standard-object-database/main/default/services/object_fields.service.js
module.exports = {
    name: "object_fields",
    mixins: [serviceObjectMixin],
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
        },
        getAmisDesignSchema: {
            // 需要传 objectName, targetObject(非必填), field_name 参数进来。
            rest: {
                method: "GET",
                path: "/amis/design/schema"
            },
            async handler(ctx) {
                const schema = await this.getAmisDesignSchema(ctx);
                return { status: 0, msg: "", schema: schema }
            }
        },
        saveAmisDesignSchema: {
            rest: {
                method: "POST",
                path: "/amis/design/schema"
            },
            async handler(ctx) {
                const data = await this.saveAmisDesignSchema(ctx);
                return { status: 0, msg: "", data: data}
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
        },
        getAmisDesignSchema: {
            async handler(ctx) {
                // console.log('ctx==>', ctx);
                const userSession = ctx.meta.user;
                const lng = userSession.language || 'zh-CN';
                const oid = ctx.params.oid || 'text';

                const object = await this.getObject("objects").findOne(oid);

                if(object){

                    const groups = object.field_groups;

                    const getGroup = (groupName)=>{
                        if(groupName == 'undefined' || groupName == 'null'){
                            groupName = '';
                        }
                        return _.find(groups, (group)=>{
                            return group.group_name === groupName;
                        }) || {group_name: groupName}
                    }

                    const objectName = object.name;
                    let objectFields = await this.getObject('object_fields').find({filters: [['object', '=', objectName]]});

                    _.map(objectFields, (objectField)=>{
                        if(!objectField.group){
                            objectField.group = '基本信息'
                        }
                    })

                    return {
                        type: 'steedos-object',
                        name: objectName,
                        label: object.label,
                        description: object.description,
                        data: {
                            objectName
                        },
                        className: "steedos-amis-form steedos-field-layout-page m-4",
                        body: _.map(_.groupBy(_.orderBy(objectFields, function(o) { return o.sort_no || 100 }), 'group'), (items, groupName)=>{
                            const group = getGroup(groupName)
                            return {
                                type: 'steedos-field-group',
                                title: group.group_name,
                                collapsed: group.collapsed,
                                visible_on: group.visible_on,
                                body: _.map(items, (field)=>{
                                    return {
                                        type: `sfield-${field.type}`,
                                        config: Object.assign({amis: {name: field.name}}, field)
                                    }
                                })
                            }
                        })
                    }
                }

            }
        },
        saveAmisDesignSchema: {
            async handler(ctx) {
                // console.log('ctx==>', ctx);
                const userSession = ctx.meta.user;

                if(!userSession.is_space_admin){
                    return {
                        message: '无权限'
                    }
                }


                const lng = userSession.language || 'zh-CN';
                // TODO 必须是管理员

                const oid = ctx.params.oid || 'text';
                const schema = ctx.params.schema;
                const object = await this.getObject("objects").findOne(oid);
                const fields = [];
                const groups = [];
                const objectSet = {
                    name: schema.name,
                    label: schema.label,
                    description: schema.description
                };
                if(!object){
                    return {}
                }
                let sort_no = 50;
                _.each(schema.body, (group)=>{
                    if(group.type === 'steedos-field-group'){
                        const groupName = group.title;
                        _.each(group.body, (field)=>{
                            if(_.startsWith(field.type, 'sfield-')){
                                fields.push(Object.assign({}, field.config, {group: groupName, sort_no}));
                                sort_no += 50;
                            }
                        })
                        groups.push({
                            group_name: group.title,
                            collapsed: group.collapsed,
                            visible_on: group.visible_on
                        })
                    }else if(_.startsWith(field.type, 'sfield-')){
                        fields.push(Object.assign({}, field.config, {sort_no}));
                        sort_no += 50;
                    }
                })

                objectSet.field_groups = groups;

                const object_fields = await this.getObject('object_fields');
                const dbFields = await object_fields.directFind({filters: ['object','=', object.name]});

                let insertFields = _.differenceBy(fields, dbFields, 'name').map(field => field.name);
                let updateFields = _.intersectionBy(fields, dbFields, 'name').map(field => field.name);
                let deleteFields = _.differenceBy(dbFields, fields, 'name').map(field => field.name);

                // 用于记录成功和失败的字段
                const log = {
                    insert: {
                        success: [],
                        error: []
                    },
                    update: {
                        success: [],
                        error: []
                    },
                    delete: {
                        success: [],
                        error: []
                    }
                };
                
                // 循环需要增加的字段
                for (const fieldName of insertFields) {
                    try {
                        const newId = await object_fields._makeNewID();
                        const now = new Date();
                        const field = _.find(fields, { name: fieldName });
                        await object_fields.directInsert(Object.assign({}, field, {
                            _id: newId,
                            owner: userSession.userId,
                            space: userSession.spaceId,
                            object: object.name,
                            created: now,
                            modified: now,
                            created_by: userSession.userId,
                            modified_by: userSession.userId,
                            company_id: userSession.company_id,
                            company_ids: userSession.company_ids
                        }));
                        log.insert.success.push(fieldName);
                    } catch (e) {
                        log.insert.error.push(fieldName);
                        console.error(`新增字段 ${fieldName} 时出错：`, e);
                    }
                }
                
                // 循环需要修改的字段
                const now = new Date();
                for (const fieldName of updateFields) {
                    try {
                        const field = _.find(fields, { name: fieldName });
                        const id = _.find(dbFields, { name: fieldName })._id;
                        const submitField = _.omit(field, ['name', '_name']);
                        await object_fields.directUpdate(id, Object.assign({}, submitField, {
                            modified: now,
                            modified_by: userSession.userId
                        }));
                        log.update.success.push(fieldName);
                    } catch (e) {
                        log.update.error.push(fieldName);
                        console.log(`dbFields`, fieldName, dbFields)
                        console.error(`更新字段 ${fieldName} 时出错：`, e);
                    }
                }
                // 循环需要删除的字段
                for (const fieldName of deleteFields) {
                    try {
                        const id = _.find(dbFields, { name: fieldName })._id;
                        await object_fields.directDelete(id);
                        log.delete.success.push(fieldName);
                    } catch (e) {
                        log.delete.error.push(fieldName);
                        console.error(`删除字段 ${fieldName} 时出错：`, e);
                    }
                }
                //label和修改时间未实时生效
                const objectConn = await this.getObject('objects');
                const current_object = await objectConn.findOne({filters:[["name","=",object.name]]});
                await objectConn.update(current_object._id, Object.assign({}, objectSet, {reload_time: new Date()}))
                return log;
            }
        }
    }
};
