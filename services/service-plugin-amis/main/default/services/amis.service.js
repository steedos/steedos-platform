/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-05-19 11:38:30
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2022-05-23 10:01:02
 * @Description: 
 */
const AmisSchema = require('./utils/amis-schema');
const AmisLib = require('@steedos-widgets/amis-lib');
const objectql = require("@steedos/objectql");
const steedosI18n = require("@steedos/i18n");
const clone = require("clone");

const getObjectConfig = async function(objectName){
    const object = objectql.getObject(objectName);
    const objectConfig = clone(object.toConfig());
    // TODO: 后续再支持附件子表
    // let relatedLists = []
    // if(objectConfig.enable_files){
    //     relatedLists.push("cms_files.parent")
    // }
    const relationsInfo = await object.getRelationsInfo();

    // TODO: 跨工作区了，后续需要补充spaceId过滤条件
    const dbListViews = await objectql.getObject("object_listviews").directFind({ 
        filters: [['object_name', '=', objectName], ['shared', '=', true]] 
    })

    objectConfig.list_views = Object.assign({}, objectConfig.list_views)
    _.each(dbListViews, function(dbListView){
        delete dbListView.created;
        delete dbListView.created_by;
        delete dbListView.modified;
        delete dbListView.modified_by;
        objectConfig.list_views[dbListView.name] = dbListView;
    })
    
    objectConfig.details = relationsInfo && relationsInfo.details;
    objectConfig.masters = relationsInfo && relationsInfo.masters;
    objectConfig.lookup_details = relationsInfo && relationsInfo.lookup_details;
    // TODO： 后续再支持related_lists
    // objectConfig.related_lists = relationsInfo && relationsInfo.related_lists;

    // let lng = objectql.getUserLocale(userSession);
    let lng = "zh-CN";//先写死中文，后续拟通过环境变量配置语言
    steedosI18n.translationObject(lng, object.name, objectConfig);
    return objectConfig;
}

AmisLib.setUISchemaFunction(async function(objectName, force){
    return await getObjectConfig(objectName);
});

module.exports = {
    name: "amis",
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
        getDefaultSchema: {
            async handler(ctx) {
                const userSession = ctx.meta.user;
                const { type, app, objectApiName, recordId, formFactor } = ctx.params;
                return this.getDefaultSchema({type, app, objectApiName, recordId, formFactor, userSession});
            }
        },
        getInitSchema: {
            async handler(ctx) {
                const userSession = ctx.meta.user;
                const { type, objectApiName, formFactor } = ctx.params;
                return this.getInitSchema({type, objectApiName, formFactor, userSession} );
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
        getDefaultSchema: {
            handler({type, app, objectApiName, recordId, formFactor, userSession}) {
                // if(type === 'list'){
                //     return {
                //         type: 'page',
                //         body: [{"type":"tpl","tpl":"${rootUrl}","inline":false,"id":"u:6ed8d90b5f25","style":{}}]
                //     }
                // }
                // if(type === 'form'){
                //     return {
                //         "title": "系统提示",
                //         "body": [
                //           {
                //             "type": "tpl",
                //             "tpl": "对你点击了",
                //             "inline": false
                //           },
                //           {
                //             "type": "tpl",
                //             "tpl": "${objectApiName}\n${objectName}",
                //             "inline": false,
                //             "id": "u:4253372a0780",
                //             "closeOnEsc": false,
                //             "closeOnOutside": false,
                //             "showCloseButton": true,
                //             "style": {
                //             }
                //           }
                //         ],
                //         "type": "dialog"
                //       }
                // }
            }
        },
        getInitSchema: {
            async handler({type, objectApiName, formFactor, userSession}) {
                if(objectApiName){
                    let schema;
                    switch(type){
                        case "form":
                            schema = await AmisLib.getFormPageInitSchema(objectApiName);
                            break;
                        case "list":
                            schema = await AmisLib.getListPageInitSchema(objectApiName);
                            break;
                        case "record":
                            schema = await AmisLib.getRecordPageInitSchema(objectApiName);
                            break;
                    }
                    return schema;
                    //    return AmisSchema.getRecordSchema(objectApiName, '${recordId}', false, userSession); 
                }
            }
        }
    },

    /**
     * Service created lifecycle event handler
     */
    async created() {

    },

    /**
     * Service started lifecycle event handler
     */
    async started() {

    },

    /**
     * Service stopped lifecycle event handler
     */
    async stopped() {

    }
};
