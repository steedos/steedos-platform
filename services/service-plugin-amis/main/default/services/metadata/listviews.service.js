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
                return await this.getObjects(ctx);
            },
        },
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

                steedosI18n.translationObject(lng, object.name, object);

                const fields = [];
                _.each(objectConfig.fields, (field) => {
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
                        case 'select':
                            fields.push({
                                label: field.label,
                                type: field.type,
                                name: field.name,
                                source: "/amis/api/mock2/form/getOptions?waitSeconds=1",   //TODO
                                searchable: true
                            });
                            break;
                        default:
                            break;
                    }
                });

                return objects;
            },
        },
    },
};
