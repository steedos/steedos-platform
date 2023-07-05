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
                        list_views: 1,
                        NAME_FIELD_KEY: 1
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

                const object = await objectql.getSteedosSchema().getObject(objectName);
                const objectConfig = object.toConfig();
                steedosI18n.translationObject(lng, objectConfig.name, objectConfig);

                /*
                    object.details是一个字符串，形如：testb__c.testa__c
                    object.lookup_details是一个对象，格式如下：
                    {
                        key: "testd__c.testa__c",
                        objectName: "testa__c",
                        type: "detail",
                    }
                */
                const relatedListObjects = [];
                const relationsInfo = await object.getRelationsInfo();
                let details = relationsInfo && relationsInfo.details;
                const lookupDetails = relationsInfo && relationsInfo.lookup_details;
                details = _.union(details, lookupDetails);

                _.each(details, function(related){
                    /*related可能是一个lookup_details，它是对象而不是字符串，从中取出key值*/
                    if(typeof related !== "string"){
                        relatedListObjects.push(related.objectName)
                    }
                    let foo = related.split('.');
                    let rObjectName = foo[0];
                    relatedListObjects.push(rObjectName);
                })

                if(objectConfig.enable_files){
                    relatedListObjects.push("cms_files")
                }
                if(objectConfig.enable_tasks){
                    relatedListObjects.push("tasks")
                }
                if(objectConfig.enable_notes){
                    relatedListObjects.push("notes")
                }
                if(objectConfig.enable_events){
                    relatedListObjects.push("events")
                }
                if(objectConfig.enable_instances){
                    relatedListObjects.push("instances")
                }
                if(objectConfig.enable_approvals){
                    relatedListObjects.push("approvals")
                }
                if(objectConfig.enable_process){
                    relatedListObjects.push("process_instance_history")
                }
                if(objectConfig.enable_audit){
                    relatedListObjects.push("audit_records")
                }

                const query = {
                    // filters: [ ['hidden', '!=', true] , ['name', '<>', ExcludeObjectNames]],
                    filters: [ ['hidden', '!=', true] ],
                    projection: {
                        name: 1, 
                        label: 1, 
                        list_views: 1,
                        fields: 1
                    }
                };

                let objects = objectql.getSteedosSchema().metadataDriver.find(allObjects, query, spaceId);
                objects = objects.filter(function(object){
                    return relatedListObjects.includes(object.name);
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
