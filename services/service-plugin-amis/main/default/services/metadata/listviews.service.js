/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-04-27 10:07:56
 * @Description:
 */

const objectql = require("@steedos/objectql");
const steedosI18n = require("@steedos/i18n");
const _ = require("underscore");
const clone = require("clone");
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
                            });
                            break;
                        case 'number':
                            fields.push({
                                label: field.label,
                                type: field.type,
                                name: field.name,
                            });
                            break;
                        case 'date':
                            fields.push({
                                label: field.label,
                                type: field.type,
                                name: field.name,
                            });
                            break;
                        case 'datetime':
                            fields.push({
                                label: field.label,
                                type: field.type,
                                name: field.name,
                            });
                            break;
                        case 'time':
                            fields.push({
                                label: field.label,
                                type: field.type,
                                name: field.name,
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
                                searchable: true
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
