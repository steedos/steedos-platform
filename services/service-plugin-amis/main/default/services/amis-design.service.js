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
        },
        getRelatedObjects: {
            rest: {
                method: "GET",
                path: "/related_objects/:objectName"
            },
            async handler(ctx) {
                return await this.getRelatedObjects(ctx);
            }
        },
        getObject: {
            rest: {
                method: "GET",
                path: "/object/:objectName"
            },
            async handler(ctx) {
                return await this.getObject(ctx);
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
                    projection: {
                        name: 1, 
                        label: 1, 
                        list_views: 1
                    }
                };

                const objects = objectql.getSteedosSchema().metadataDriver.find(allObjects, query, spaceId);

                const dbListViews = await objectql.getObject('object_listviews').directFind({filters: [['shared', '!=', false]]})

                _.each(objects, (object)=>{
                    if(object && object.name){

                        steedosI18n.translationObject(lng, object.name, object)

                        if(object.list_views && !_.isEmpty(object.list_views)){
                            _.each(object.list_views, (list_view, name)=>{
                                list_view.name = name;
                                list_view._id = list_view._id || list_view.name;
                                list_view.label = list_view.label || list_view.name;
                            })
                            
                            object.list_views = objectql.getSteedosSchema().metadataDriver.find(_.values(object.list_views), {
                                projection: {
                                    _id: 1, 
                                    name: 1, 
                                    label: 1
                                }
                            }, spaceId);
                            
                        }

                        if(_.isEmpty(object.list_views)){
                            object.list_views = [];
                        }

                        const objectListViews = objectql.getSteedosSchema().metadataDriver.find(dbListViews, {
                            filters: [['object_name', '=', object.name],  ['shared', '=', true] ],
                            fields: "_id, name, label"
                        }, spaceId);

                        _.each(object.list_views, (listView)=>{
                            if(!_.find(objectListViews, (dbListView)=>{ return dbListView.name === listView.name})){
                                objectListViews.push(listView);
                            }
                        })
                        object.list_views = objectListViews;
                    }
                })
                return objects;
            }
        },
        /* 复制getObjects函数根据objectName筛选下单独的对象信息 */
        getObject: {
            async handler(ctx) {
                const objectName = ctx.params.objectName;
                const userSession = ctx.meta.user;
                const lng = userSession.language || 'zh-CN';
                const spaceId = userSession.spaceId;
                const allMetadataObjects = await objectql.getSteedosSchema().getAllObject();
                const allObjects = _.pluck(clone(allMetadataObjects), 'metadata');

                const query = {
                    filters: [ ['hidden', '!=', true] , ['name', '<>', ExcludeObjectNames]],
                    projection: {
                        name: 1, 
                        label: 1, 
                        list_views: 1
                    }
                };

                const objects = objectql.getSteedosSchema().metadataDriver.find(allObjects, query, spaceId);

                const dbListViews = await objectql.getObject('object_listviews').directFind({filters: [['shared', '!=', false]]})

                _.each(objects, (object)=>{
                    if(object && object.name){

                        steedosI18n.translationObject(lng, object.name, object)

                        if(object.list_views && !_.isEmpty(object.list_views)){
                            _.each(object.list_views, (list_view, name)=>{
                                list_view.name = name;
                                list_view._id = list_view._id || list_view.name;
                                list_view.label = list_view.label || list_view.name;
                            })
                            
                            object.list_views = objectql.getSteedosSchema().metadataDriver.find(_.values(object.list_views), {
                                projection: {
                                    _id: 1, 
                                    name: 1, 
                                    label: 1
                                }
                            }, spaceId);
                            
                        }

                        if(_.isEmpty(object.list_views)){
                            object.list_views = [];
                        }

                        const objectListViews = objectql.getSteedosSchema().metadataDriver.find(dbListViews, {
                            filters: [['object_name', '=', object.name],  ['shared', '=', true] ],
                            fields: "_id, name, label"
                        }, spaceId);

                        _.each(object.list_views, (listView)=>{
                            if(!_.find(objectListViews, (dbListView)=>{ return dbListView.name === listView.name})){
                                objectListViews.push(listView);
                            }
                        })
                        object.list_views = objectListViews;
                    }
                })
                const object = objects.find(function (obj) {
                    return obj.name === objectName;
                });
                return object;
            }
        },
        getRelatedObjects: {
            async handler(ctx) {
                const objectName = ctx.params.objectName;
                const userSession = ctx.meta.user;
                const lng = userSession.language || 'zh-CN';
                const spaceId = userSession.spaceId;
                const allMetadataObjects = await objectql.getSteedosSchema().getAllObject();
                const allObjects = _.pluck(clone(allMetadataObjects), 'metadata');

                const query = {
                    filters: [ ['hidden', '!=', true] , ['name', '<>', ExcludeObjectNames]],
                    projection: {
                        name: 1, 
                        label: 1, 
                        list_views: 1,
                        fields: 1
                    }
                };

                let objects = objectql.getSteedosSchema().metadataDriver.find(allObjects, query, spaceId);
                objects = objects.filter(function(object){
                    let relatedFieldKey = _.findKey(object.fields, function(field){
                        return (field.type === "lookup" || field.type === "master_detail") && field.reference_to === objectName;
                    });
                    return !!relatedFieldKey;
                });

                const dbListViews = await objectql.getObject('object_listviews').directFind({filters: [['shared', '!=', false]]})

                _.each(objects, (object)=>{
                    if(object && object.name){

                        steedosI18n.translationObject(lng, object.name, object)

                        if(object.list_views && !_.isEmpty(object.list_views)){
                            _.each(object.list_views, (list_view, name)=>{
                                list_view.name = name;
                                list_view._id = list_view._id || list_view.name;
                                list_view.label = list_view.label || list_view.name;
                            })
                            
                            object.list_views = objectql.getSteedosSchema().metadataDriver.find(_.values(object.list_views), {
                                projection: {
                                    _id: 1, 
                                    name: 1, 
                                    label: 1
                                }
                            }, spaceId);
                            
                        }

                        if(_.isEmpty(object.list_views)){
                            object.list_views = [];
                        }

                        const objectListViews = objectql.getSteedosSchema().metadataDriver.find(dbListViews, {
                            filters: [['object_name', '=', object.name],  ['shared', '=', true] ],
                            fields: "_id, name, label"
                        }, spaceId);

                        _.each(object.list_views, (listView)=>{
                            if(!_.find(objectListViews, (dbListView)=>{ return dbListView.name === listView.name})){
                                objectListViews.push(listView);
                            }
                        })
                        object.list_views = objectListViews;
                    }
                })
                return objects;
            }
        }
    }
};
