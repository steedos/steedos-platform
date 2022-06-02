/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-04-27 10:07:56
 * @Description:
 */

const objectql = require("@steedos/objectql");
const steedosI18n = require("@steedos/i18n");
const _ = require("underscore");

const DATE_DATETIME_OPERATORS = [
    'equal', 
    'not_equal', 
    'less', 
    'less_or_equal', 
    'greater', 
    'greater_or_equal', 
    'between',
    {
        "label": "去年",
        "value": "between:last_year",
        "values": []
    },
    {
        "label": "今年",
        "value": "between:this_year",
        "values": []
    },
    {
        "label": "明年",
        "value": "between:next_year",
        "values": []
    },
    {
        "label": "上季度",
        "value": "between:last_quarter",
        "values": []
    },
    {
        "label": "本季度",
        "value": "between:this_quarter",
        "values": []
    },
    {
        "label": "下季度",
        "value": "between:next_quarter",
        "values": []
    },
    {
        "label": "上月",
        "value": "between:last_month",
        "values": []
    },
    {
        "label": "本月",
        "value": "between:this_month",
        "values": []
    },
    {
        "label": "下月",
        "value": "between:next_month",
        "values": []
    },
    {
        "label": "上周",
        "value": "between:last_week",
        "values": []
    },
    {
        "label": "本周",
        "value": "between:this_week",
        "values": []
    },
    {
        "label": "下周",
        "value": "between:next_week",
        "values": []
    },
    {
        "label": "昨天",
        "value": "between:yestday", // 一个错误的拼写, 待@steedos/filters 修正
        "values": []
    },
    {
        "label": "今天",
        "value": "between:today",
        "values": []
    },
    {
        "label": "明天",
        "value": "between:tomorrow",
        "values": []
    },
    {
        "label": "过去7天",
        "value": "between:last_7_days",
        "values": []
    },
    {
        "label": "过去30天",
        "value": "between:last_30_days",
        "values": []
    },
    {
        "label": "过去60天",
        "value": "between:last_60_days",
        "values": []
    },
    {
        "label": "过去90天",
        "value": "between:last_90_days",
        "values": []
    },
    {
        "label": "过去120天",
        "value": "between:last_120_days",
        "values": []
    },
    {
        "label": "未来7天",
        "value": "between:next_7_days",
        "values": []
    },
    {
        "label": "未来30天",
        "value": "between:next_30_days",
        "values": []
    },
    {
        "label": "未来60天",
        "value": "between:next_60_days",
        "values": []
    },
    {
        "label": "未来90天",
        "value": "between:next_90_days",
        "values": []
    },
    {
        "label": "未来120天",
        "value": "between:next_120_days",
        "values": []
    }
]


const getFieldOperators = (type)=>{
    switch (type) {
        case 'text':
            return ['equal', 'not_equal', 'like', 'not_like', 'starts_with', 'ends_with']
        case 'number':
            return [ 'equal', 'not_equal', 'less', 'less_or_equal', 'greater', 'greater_or_equal', 'between']
        case 'date':
            return DATE_DATETIME_OPERATORS
        case 'datetime':
            return DATE_DATETIME_OPERATORS
        case 'time':
            return [ 'equal', 'not_equal', 'less', 'less_or_equal', 'greater', 'greater_or_equal', 'between']
        case 'lookup':
        case 'master_detail':
        case 'select':
            return [ 'select_equals', 'select_not_equals', 'select_any_in', 'select_not_any_in' ]
        default:
            return ;
    }

}

module.exports = {
    name: "amis-metadata-listviews",
    mixins: [],
    /**
     * Settings
     */
    settings: {},

    /**
     * Dependencies
     */
    dependencies: [],

    /**
     * Actions
     */
    actions: {
        getFilterFields: {
            rest: {
                method: "GET",
                path: "/getFilterFields",
            },
            async handler(ctx) {
                const fields = await this.getFilterFields(ctx);
                return { fields }
            },
        },
        getSelectFieldOptions: {
            rest: {
                method: "GET",
                path: "/getSelectFieldOptions",
            },
            async handler(ctx) {
                const options = await this.getSelectFieldOptions(ctx);
                return { status: 0, data: { options } }
            },
        }
    },

    /**
     * Events
     */
    events: {},

    /**
     * Methods
     */
    methods: {
        getFilterFields: {
            async handler(ctx) {
                const userSession = ctx.meta.user;
                const { objectName } = ctx.params;
                const lng = userSession.language || "zh-CN";
                const spaceId = userSession.spaceId;
                const objectConfig = await objectql.getObjectConfig(objectName);

                steedosI18n.translationObject(lng, objectConfig.name, objectConfig);

                const fields = [];
                _.each(objectConfig.fields, (field) => {
                    field.label = field.label || field.name
                    switch (field.type) {
                        case 'text':
                            fields.push({
                                label: field.label,
                                type: field.type,
                                name: field.name,
                                operators: getFieldOperators(field.type)
                            });
                            break;
                        case 'number':
                            fields.push({
                                label: field.label,
                                type: field.type,
                                name: field.name,
                                operators: getFieldOperators(field.type)
                            });
                            break;
                        case 'date':
                            fields.push({
                                label: field.label,
                                type: field.type,
                                name: field.name,
                                operators: getFieldOperators(field.type)
                            });
                            break;
                        case 'datetime':
                            fields.push({
                                label: field.label,
                                type: field.type,
                                name: field.name,
                                operators: getFieldOperators(field.type)
                            });
                            break;
                        case 'time':
                            fields.push({
                                label: field.label,
                                type: field.type,
                                name: field.name,
                                operators: getFieldOperators(field.type)
                            });
                            break;
                        case 'lookup':
                        case 'master_detail':
                        case 'select':
                            fields.push({
                                label: field.label,
                                type: 'select',
                                name: field.name,
                                source: "${context.rootUrl}" + `/service/api/amis-metadata-listviews/getSelectFieldOptions?objectName=${objectName}&fieldName=${field.name}`,
                                searchable: true,
                                operators: getFieldOperators(field.type)
                            });
                            break;
                        default:
                            break;
                    }
                });

                return fields;
            },
        },
        getSelectFieldOptions: {
            async handler(ctx) {
                const userSession = ctx.meta.user;
                const { objectName, fieldName } = ctx.params;
                const lng = userSession.language || "zh-CN";
                const objectConfig = await objectql.getObjectConfig(objectName);

                steedosI18n.translationObject(lng, objectConfig.name, objectConfig);

                const field = objectConfig.fields[fieldName];
                if(field.type === 'select'){
                    return field.options;
                }else if(field.reference_to){
                    const records = await objectql.getObject(field.reference_to).find({filters: [[]]})
                    return _.map(records, (record)=>{
                        return {
                            label: record[objectConfig._NAME_FIELD_KEY || 'name'],
                            value: record[objectConfig._idFieldName || '_id']
                        };
                    })
                }
            },
        }
    },
};
