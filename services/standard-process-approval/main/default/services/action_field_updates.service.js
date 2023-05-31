/*
 * @Description: 提供action_field_updates(字段更新对象)需要的数据接口
 */

const register = require("@steedos/metadata-registrar");
const steedosI18n = require("@steedos/i18n");
const _ = require("lodash");
const clone = require("clone");


module.exports = {
    name: "action_field_updates",
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
        getTargetObjectOptions: {
            // 需要传 objectName 参数进来。
            rest: {
                method: "GET",
                path: "/target_object/options"
            },
            async handler(ctx) {
                const options = await this.getTargetObjectOptions(ctx);
                return { status: 0, data: { options } }
            }
        },
        getFieldNameOptions: {
            // 需要传 objectName, targetObject 参数进来。
            rest: {
                method: "GET",
                path: "/field_name/options"
            },
            async handler(ctx) {
                const options = await this.getFieldNameOptions(ctx);
                return { status: 0, data: { options } }
            }
        },
        getOperationOptions: {
            // 需要传 objectName, targetObject(非必填), field_name 参数进来。
            rest: {
                method: "GET",
                path: "/operation/options"
            },
            async handler(ctx) {
                const options = await this.getOperationOptions(ctx);
                return { status: 0, data: { options } }
            }
        },
        getLiteralValueOptions: {
            // 需要传 objectName, targetObject(非必填), field_name 参数进来。
            rest: {
                method: "GET",
                path: "/literal_value/options"
            },
            async handler(ctx) {
                const data = await this.getLiteralValueOptions(ctx);
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
        /* target_object 字段使用*/
        getTargetObjectOptions: {
            async handler(ctx) {
                const userSession = ctx.meta.user;
                const lng = userSession.language || 'zh-CN';
                const objectName = ctx.params.objectName;
                if(!objectName){
                    return []
                }
                const objectConfig = await register.getObjectConfig(objectName);
                steedosI18n.translationObject(lng, objectConfig.name, objectConfig);

                const options = [{ label: objectConfig.label, value: objectConfig.name }];
                for (fieldName in objectConfig.fields) {
                    const field = objectConfig.fields[fieldName]
                    if (field && field.type === 'master_detail' && _.isString(field.reference_to)) {
                        const referenceToObjectConfig = await register.getObjectConfig(field.reference_to);
                        steedosI18n.translationObject(lng, referenceToObjectConfig.name, referenceToObjectConfig);
                        if (referenceToObjectConfig) {
                            options.push({
                                label: referenceToObjectConfig.label,
                                value: field.name,
                            });
                        }
                    }
                }
                return options;
            }
        },
        /* field_name 字段使用*/
        getFieldNameOptions: {
            async handler(ctx) {
                const userSession = ctx.meta.user;
                const lng = userSession.language || 'zh-CN';
                const objectName = ctx.params.objectName;
                const targetObject = ctx.params.targetObject;
                if (!objectName || !targetObject) {
                    return []
                }

                let mainObjectName = null;
                if (targetObject && targetObject != objectName) {
                    const targetField = await register.getObjectConfig(objectName).fields[targetObject];
                    mainObjectName = targetField && targetField.reference_to;
                } else {
                    mainObjectName = objectName;
                }

                const objectConfig = await register.getObjectConfig(mainObjectName);
                const options = [];
                if (objectConfig) {
                    steedosI18n.translationObject(lng, objectConfig.name, objectConfig);
                    _.forEach(objectConfig.fields, function (field, fname) {
                        if (["formula", "summary", "autonumber"].indexOf(field.type) < 0 ) {
                            /*公式、累计汇总、自动编号三种字段类型是只读的，不允许字段更新来变更其值*/
                            options.push({
                                label: field.label,
                                value: field.name,
                            });
                        }
                    });
                }
                return options;
            }
        },
        /* operation 字段使用*/
        getOperationOptions: {
            async handler(ctx) {
                const userSession = ctx.meta.user;
                const lng = userSession.language || 'zh-CN';
                const objectName = ctx.params.objectName;
                const targetObject = ctx.params.targetObject;
                const fieldName = ctx.params.fieldName;
                
                if (!objectName || !fieldName) {
                    return []
                }

                let mainObjectName = null;
                if (targetObject && targetObject != objectName) {
                    const targetField = await register.getObjectConfig(objectName).fields[targetObject];
                    mainObjectName = targetField && targetField.reference_to;
                } else {
                    mainObjectName = objectName;
                }

                const objectConfig = await register.getObjectConfig(mainObjectName);
                const options = [];
                if (objectConfig) {
                    steedosI18n.translationObject(lng, objectConfig.name, objectConfig);
                    const field = objectConfig.fields[fieldName];
                    if (field && field.type != 'boolean') {
                        options.push({
                            label: TAPi18n.__("action_field_updates_field_operation_options_null",{},lng),
                            value: 'null',
                        })
                    }
                    options.push({
                        label: TAPi18n.__("action_field_updates_field_operation_options_formula",{},lng),
                        value: 'formula',
                    });
                    options.push({
                        label: TAPi18n.__("action_field_updates_field_operation_options_literal",{},lng),
                        value: 'literal',
                    })
                }
                return options;
            }
        },
        /* literal_value 字段使用*/
        getLiteralValueOptions: {
            async handler(ctx) {
                const userSession = ctx.meta.user;
                const lng = userSession.language || 'zh-CN';
                const objectName = ctx.params.objectName;
                const targetObject = ctx.params.targetObject;
                const fieldName = ctx.params.fieldName;
                
                if (!objectName || !fieldName) {
                    return []
                }

                let mainObjectName = null;
                if (targetObject && targetObject != objectName) {
                    const targetField = await register.getObjectConfig(objectName).fields[targetObject];
                    mainObjectName = targetField && targetField.reference_to;
                } else {
                    mainObjectName = objectName;
                }

                const objectConfig = await register.getObjectConfig(mainObjectName);
                let literal_value_schema = {
                    "type": "text",
                    "name": "literal_value",
                    "label": "指定新字段值",
                    "required": false,
                    "is_wide": true,
                    "labelClassName": "text-left"
                }
                if (objectConfig) {
                    steedosI18n.translationObject(lng, objectConfig.name, objectConfig);
                    const field = objectConfig.fields[fieldName];
                    delete field.visible_on; // visible_on属性为false时始终不显示
                    literal_value_schema = Object.assign({}, field, {
                        name: "literal_value",
                        label: "指定新字段值",
                        disabled: false,
                        readonly: false,
                        is_wide: true
                    });
                }
                return {
                    "body": [
                        {
                            "type": "steedos-field",
                            "field": literal_value_schema,
                            "name": "literal_value",
                            "clearValueOnHidden": true,
                            "fieldName": "literal_value",
                            "visibleOn": "this.operation === 'literal'"
                        }
                    ]
                }
            }
        }
    }
};
