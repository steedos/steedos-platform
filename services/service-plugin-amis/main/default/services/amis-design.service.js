/*
 * @Date: 2022-04-19 11:36:12
 * @Description: 提供设计器需要的数据接口
 */

const objectql = require("@steedos/objectql");
const steedosI18n = require("@steedos/i18n");
const _ = require("underscore");
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
    name: "amis-design",
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
        getObjects: {
            rest: {
                method: "GET",
                path: "/objects"
            },
            async handler(ctx) {
                return await this.getObjects(ctx);
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
        getObjects: {
            async handler(ctx) {
                const userSession = ctx.meta.user;
                const lng = userSession.language || 'zh-CN';
                const spaceId = userSession.spaceId;
                const allMetadataObjects = await objectql.getSteedosSchema().getAllObject();
                const allObjects = _.pluck(clone(allMetadataObjects), 'metadata');

                const query = {
                    filters: [ ['hidden', '!=', true] , ['name', '<>', ExcludeObjectNames]],
                    fields: "name, label, list_views"
                };

                const objects = objectql.getSteedosSchema().metadataDriver.find(allObjects, query, spaceId);

                const dbListViews = await objectql.getObject('object_listviews').directFind({filters: [['shared', '!=', false]]})

                _.each(objects, (object)=>{
                    if(object && object.name){

                        steedosI18n.translationObject(lng, object.name, object)

                        if(object.list_views && !_.isEmpty(object.list_views)){
                            _.each(object.list_views, (list_view, name)=>{
                                list_view.name = name;
                                if(!_.has(list_view, '_id')){
                                    list_view._id = list_view.name;
                                }
                            })
                            
                            object.list_views = objectql.getSteedosSchema().metadataDriver.find(_.values(object.list_views), {
                                fields: "_id, name, label"
                            }, spaceId);
                            
                        }

                        if(_.isEmpty(object.list_views)){
                            object.list_views = [];
                        }

                        object.list_views = object.list_views.concat(objectql.getSteedosSchema().metadataDriver.find(dbListViews, {
                            filters: [['object_name', '=', object.name],  ['shared', '=', true] ],
                            fields: "_id, name, label"
                        }, spaceId))

                    }
                })
                return objects;
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
