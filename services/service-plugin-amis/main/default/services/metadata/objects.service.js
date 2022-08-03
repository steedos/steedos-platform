/*
 * @Date: 2022-04-19 11:36:12
 * @Description: 提供设计器需要的数据接口
 */

const objectql = require("@steedos/objectql");
const steedosI18n = require("@steedos/i18n");
const _ = require("lodash");
const clone = require("clone");

const ExcludeObjectNames = [
    'cfs_instances_filerecord',
    'cfs_files_filerecord',
    'cms_files', 
    'chat_messages', 
    'api_keys', 
    'object_webhooks_queue', 
    'users', 
    'cms_posts',
];


module.exports = {
    name: "amis-metadata-objects",
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
        getObjectsOptions: {
            rest: {
                method: "GET",
                path: "/objects/options"
            },
            async handler(ctx) {
                const options = await this.getObjectsOptions(ctx);
                return { status: 0, data: { options } }
            }
        },
        getObjectFieldsOptions: {
            rest: {
                method: "GET",
                path: "/objects/:objectName/fields/options"
            },
            async handler(ctx) {
                const options = await this.getObjectFieldsOptions(ctx);
                return { status: 0, data: { options } }
            }
        },
        getObjectActionsOptions: {
            rest: {
                method: "GET",
                path: "/objects/:objectName/actions/options"
            },
            async handler(ctx) {
                const options = await this.getObjectActionsOptions(ctx);
                return { status: 0, data: { options } }
            }
        },
        getObjectSortFieldsOptions: {
            rest: {
                method: "GET",
                path: "/objects/:objectName/sortFields/options",
            },
            async handler(ctx) {
                const fieldsOptions = await this.getObjectFieldsOptions(ctx);
                const userSession = ctx.meta.user;
                const lng = userSession.language || "zh-CN";
                const options = [
                    {
                        label: steedosI18n.t('asc', {}, lng),
                        searchable: true,
                        children: _.map(fieldsOptions, (opt)=>{
                            return {label: `${opt.label}(${steedosI18n.t('asc', {}, lng)})`, value: `${opt.value}:asc`}
                        })
                    },
                    {
                        label: steedosI18n.t('desc', {}, lng),
                        searchable: true,
                        children: _.map(fieldsOptions, (opt)=>{
                            return {label: `${opt.label}(${steedosI18n.t('desc', {}, lng)})`, value: `${opt.value}:desc`}
                        })
                    }
                ];

                return { status: 0, data: { options } }
            },
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
        getObjectsOptions: {
            async handler(ctx) {
                const userSession = ctx.meta.user;
                const lng = userSession.language || 'zh-CN';
                const spaceId = userSession.spaceId;
                const allMetadataObjects = await objectql.getSteedosSchema().getAllObject();
                const allObjects = _.map(clone(allMetadataObjects), 'metadata');
                const query = {
                    filters: [  ['name', '<>', ExcludeObjectNames]], //['hidden', '!=', true] ,
                    projection: {
                        name: 1, 
                        label: 1
                    }
                };

                const objects = objectql.getSteedosSchema().metadataDriver.find(allObjects, query, spaceId);

                _.each(objects, (object)=>{
                    if(object && object.name){
                        steedosI18n.translationObject(lng, object.name, object)
                    }
                })
                return _.map(objects, (object)=>{
                    return {
                        value: object.name,
                        label: object.label || object.name
                    }
                });
            }
        },
        getObjectFieldsOptions: {
            async handler(ctx) {
                const userSession = ctx.meta.user;
                const lng = userSession.language || 'zh-CN';
                const objectName = ctx.params.objectName;
                const objectConfig = await objectql.getSteedosSchema().getObject(objectName).toConfig();
                steedosI18n.translationObject(lng, objectConfig.name, objectConfig);

                if(objectConfig.enable_workflow){
                    try {
                        objectConfig.fields.instance_state.hidden = false;
                    } catch (error) {
                        console.log("error", error)
                    }
                }

                const fieldsArr = [];
                _.each(objectConfig.fields , (field, field_name)=>{
                    if(!_.has(field, "name")){
                        field.name = field_name
                    }
                    fieldsArr.push(field)
                })
                return _.uniq(_.compact(_.map(_.sortBy(fieldsArr, "sort_no"), (field)=>{
                    if(!field.hidden && !_.includes(["grid", "object", "[Object]", "[object]", "Object", "markdown", "html"], field.type)){
                        return {
                            value: field.name,
                            label: field.label || field.name
                        }
                    }
                })));
            }
        },
        getObjectActionsOptions: {
            async handler(ctx) {
                const userSession = ctx.meta.user;
                const lng = userSession.language || 'zh-CN';
                const objectName = ctx.params.objectName;
                const objectConfig = await objectql.getSteedosSchema().getObject(objectName).toConfig();
                steedosI18n.translationObject(lng, objectConfig.name, objectConfig);

                // if(objectConfig.enable_workflow){
                //     try {
                //         objectConfig.fields.instance_state.hidden = false;
                //     } catch (error) {
                //         console.log("error", error)
                //     }
                // }

                const actionsArr = [];
                _.each(objectConfig.actions , (action, action_name)=>{
                    if(!_.has(action, "name")){
                        action.name = action_name
                    }
                    actionsArr.push(action)
                })
                return _.uniq(_.compact(_.map(_.sortBy(actionsArr, "sort"), (action)=>{
                    return {
                        value: action.name,
                        label: action.label || action.name
                    }
                })));
            }
        }
    }
};
