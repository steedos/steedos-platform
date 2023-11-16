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

const ExcludeFieldNames = [
    'instances'
]

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
        getObjectFieldsLayoutOptions: {
            rest: {
                method: "GET",
                path: "/objects/:objectName/fields/layout_options"
            },
            async handler(ctx) {
                const options = await this.getObjectFieldsLayoutOptions(ctx);
                return { status: 0, data: { options } }
            }
        },
        getObjectFieldsGroups: {
            rest: {
                method: "GET",
                path: "/objects/:objectName/fields/groups"
            },
            async handler(ctx) {
                const options = await this.getObjectFieldsGroups(ctx);
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
        getObjectDetailListsOptions: {
            rest: {
                method: "GET",
                path: "/objects/:objectName/detailLists/options"
            },
            async handler(ctx) {
                const options = await this.getObjectDetailListsOptions(ctx);
                return { status: 0, data: { options } }
            }
        },
        getObjectRelatedListsOptions: {
            rest: {
                method: "GET",
                path: "/objects/:objectName/relatedLists/options"
            },
            async handler(ctx) {
                const options = await this.getObjectRelatedListsOptions(ctx);
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
                const objectName = ctx.params.objectName;
                const object = await objectql.getSteedosSchema().getObject(objectName);
                const objectConfig = object.toConfig();
                const fields = objectConfig.fields;

                // image、file、lookup、master_detail、select 不参与排序
                let ascChildren = [];
                _.forEach(fieldsOptions, (opt)=>{
                    if(["image","file","lookup","master_detail","select"].indexOf(fields[opt.value].type)<0){
                        ascChildren.push({label: `${opt.label}(${steedosI18n.t('asc', {}, lng)})`, value: `${opt.value}:asc`})
                    }
                })
                let descChildren = [];
                _.forEach(fieldsOptions, (opt)=>{
                    if(["image","file","lookup","master_detail","select"].indexOf(fields[opt.value].type)<0){
                        descChildren.push({label: `${opt.label}(${steedosI18n.t('desc', {}, lng)})`, value: `${opt.value}:desc`})
                    }
                })
                const options = [
                    {
                        label: steedosI18n.t('asc', {}, lng),
                        searchable: true,
                        children: ascChildren
                    },
                    {
                        label: steedosI18n.t('desc', {}, lng),
                        searchable: true,
                        children: descChildren
                    }
                ];

                return { status: 0, data: { options } }
            },
        },
        getObjectsForGenerateTabsOptions: {
            rest: {
                method: "GET",
                path: "/objects/generate_tabs_options"
            },
            async handler(ctx) {
                const options = await this.getObjectsGenerateTabsOptions(ctx);
                return { status: 0, data: { options } }
            }
        },
        generateTabs: {
            rest: {
                method: "POST",
                path: "/objects/generate/tabs"
            },
            async handler(ctx) {
                const result = await this.generateTabs(ctx);
                return { status: 0, data: result }
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
        getObjectsOptions: {
            async handler(ctx) {
                const userSession = ctx.meta.user;
                const lng = userSession.language || 'zh-CN';
                const spaceId = userSession.spaceId;
                const allMetadataObjects = await objectql.getSteedosSchema().getAllObject();
                const allObjects = _.map(allMetadataObjects, 'metadata');
                const query = {
                    filters: [  ['name', '<>', ExcludeObjectNames]], //['hidden', '!=', true] ,
                    projection: {
                        name: 1, 
                        label: 1
                    }
                };

                const objects = _.map(_.filter(allObjects, (obj)=>{
                    return !_.includes(ExcludeObjectNames, obj.name)
                }), (obj)=>{
                    return {
                        name: obj.name,
                        label: obj.label
                    }
                })

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
                const object = await objectql.getSteedosSchema().getObject(objectName);
                const objectConfig = object.toConfig();
                steedosI18n.translationObject(lng, objectConfig.name, objectConfig);

                const include_deep = ctx.params.include_deep === "true";
                const include_hide = ctx.params.include_hide === "true";
                const include_related = ctx.params.include_related === "true";
                
                if(objectConfig.enable_workflow){
                    try {
                        objectConfig.fields.instance_state.hidden = false;
                    } catch (error) {
                        console.log("error", error)
                    }
                }
                
                // 设置主表
                let fieldsArr = [];
                _.each(objectConfig.fields , (field, field_name)=>{
                    if(!_.has(field, "name")){
                        field.name = field_name
                    }
                    fieldsArr.push(field)
                })

                let output = [];
                output =  _.uniq(_.compact(_.map(_.sortBy(fieldsArr, "sort_no"), (field)=>{
                    if((include_hide || !field.hidden) && !_.includes(["grid", "object", "[Object]", "[object]", "Object", "markdown"], field.type)){
                        // 隐藏的字段 和 字段类型 判断
                        return {
                            value: field.name,
                            label: field.label || field.name
                        }
                    }
                })));
                
                if(include_deep) {
                    for( let i = 0; i < fieldsArr.length; i ++ ) {
                        if(!include_hide && fieldsArr[i].hidden) continue;
                        if((fieldsArr[i].type == 'lookup' || fieldsArr[i].type == 'master_detail') && fieldsArr[i].reference_to && _.isString(fieldsArr[i].reference_to)) {
                            const r_object = await objectql.getSteedosSchema().getObject(fieldsArr[i].reference_to).toConfig();
                            steedosI18n.translationObject(lng, r_object.name, r_object);
                            if (r_object){
                                _.forEach(r_object.fields, (f2, k2)=>{
                                    if(!include_hide && f2.hidden) return;
                                    output.push({
                                        'value': fieldsArr[i].name + '.' + k2,
                                        'label': (fieldsArr[i].label || fieldsArr[i].name) + '=>' + (f2.label || k2)
                                    });
                                });
                            }
                        }
                    }
                }
                
                if(include_related){
                    const relationsInfo = await object.getRelationsInfo();
                    const lookupDetails = relationsInfo && relationsInfo.lookup_details;
                    let details = relationsInfo && relationsInfo.details;

                    details = _.uniq(details.concat(lookupDetails));
                    
                    let relatedListObjects = [];
                    _.each(details, (related)=>{
                        let foo = related.split('.');
                        let rObjectName = foo[0];
                        let foreign_key = foo[1];
                        relatedListObjects.push({object_name: rObjectName, foreign_key: foreign_key});
                    });
                    
                    if(objectConfig.enable_files){
                        relatedListObjects.push({
                            object_name: 'cms_files', 
                            foreign_key: 'parent'
                        })
                    }
                    if(objectConfig.enable_tasks){
                        relatedListObjects.push({
                            object_name: 'tasks', 
                            foreign_key: 'related_to'
                        })
                    }
                    if(objectConfig.enable_notes){
                        relatedListObjects.push({
                            object_name: 'notes', 
                            foreign_key: 'related_to'
                        })
                    }
                    if(objectConfig.enable_events){
                        relatedListObjects.push({
                            object_name: 'events', 
                            foreign_key: 'related_to'
                        })
                    }
                    if(objectConfig.enable_instances){
                        relatedListObjects.push({
                            object_name: 'instances', 
                            foreign_key: 'record_ids'
                        })
                    }
                    if(objectConfig.enable_approvals){
                        relatedListObjects.push({
                            object_name: 'approvals', 
                            foreign_key: 'related_to'
                        })
                    }
                    if(objectConfig.enable_process){
                        relatedListObjects.push({
                            object_name: 'process_instance_history', 
                            foreign_key: 'target_object'
                        })
                    }
                    if(objectConfig.enable_audit){
                        relatedListObjects.push({
                            object_name: 'audit_records', 
                            foreign_key: 'related_to'
                        })
                    }

                    for( let i = 0; i < relatedListObjects.length; i ++ ) {
                        // 获得相关对象的字段
                        const relatedObject = await objectql.getSteedosSchema().getObject(relatedListObjects[i].object_name);
                        const relatedObjectConfig = relatedObject.toConfig();
                        steedosI18n.translationObject(lng, relatedObjectConfig.name, relatedObjectConfig);
                        const fieldsArr = [];
                        _.each(relatedObjectConfig.fields, (field, field_name) => {
                            if (!_.has(field, "name")) {
                                field.name = field_name;
                            }
                            fieldsArr.push(field);
                        })
                        let relatedOptions = [];
                        relatedOptions = _.uniq(_.compact(_.map(_.sortBy(fieldsArr, "sort_no"), (field) => {
                            if ((!field.hidden) && !_.includes(["grid", "object", "[Object]", "[object]", "Object", "markdown"], field.type)) {
                                return {
                                    'value': field.name,
                                    'label': field.label || field.name
                                }
                            }
                        })));

                        _.each(relatedOptions, (relatedOption)=>{
                            if (relatedListObjects[i].foreign_key != relatedOption.value){
                                output.push({
                                    'value': relatedObjectConfig.name + '.' + relatedOption.value,
                                    'label': (relatedObjectConfig.label || relatedObjectConfig.name) + '=>' + relatedOption.label
                                })
                            }                        
                        })
                    }
                }
                // 根据用户关键字进行过滤
                if( ctx.params.term ) {
                    let form_fields = output;
                    output = [];
                    form_fields.forEach((item) => {
                      if(item.label.toLowerCase().indexOf(ctx.params.term.toLowerCase()) !== -1)
                        output.push(item); 
                    })
                }
                output = _.uniqWith(_.compact(output), _.isEqual);
                return output;
            }
        },
        getObjectFieldsLayoutOptions: {
            async handler(ctx) {
                const userSession = ctx.meta.user;
                const lng = userSession.language || 'zh-CN';
                const objectName = ctx.params.objectName;
                let {showHiddenField = false} = ctx.params;
                if(showHiddenField=='true'){
                    showHiddenField = true;
                }
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
                    if (showHiddenField != true && field.hidden) return;
                    if (ExcludeFieldNames.includes(field_name)) return;
                    if(!_.has(field, "name")){
                        field.name = field_name
                    }
                    fieldsArr.push(field)
                })
                return _.uniq(_.compact(_.map(_.sortBy(fieldsArr, "sort_no"), (field)=>{
                    return {
                        value: field.name,
                        label: field.label || field.name,
                        group: field.group,
                        readonly: field.readonly,
                        required: field.required
                    }
                })));
            }
        },
        getObjectFieldsGroups: {
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
                    return field.group
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

                const actionsArr = [];
                _.each(objectConfig.actions , (action, action_name)=>{
                    if(!_.has(action, "name")){
                        action.name = action_name
                    }
                    actionsArr.push(action)
                })
                return _.uniq(_.compact(_.map(_.sortBy(actionsArr, "sort"), (action)=>{
                    const label = action.label || action.name
                    return {
                        value: action.name,
                        label: `${label}(${action.name})`
                    }
                })));
            }
        },
        getObjectDetailListsOptions: {
            async handler(ctx) {
                const userSession = ctx.meta.user;
                const lng = userSession.language || 'zh-CN';
                const objectName = ctx.params.objectName;
                const object = await objectql.getSteedosSchema().getObject(objectName);
                const objectConfig = object.toConfig();
                steedosI18n.translationObject(lng, objectConfig.name, objectConfig);

                const options = [];
                /*
                    object.details是一个字符串，形如：testb__c.testa__c
                */
                const relationsInfo = await object.getRelationsInfo();
                const details = relationsInfo && relationsInfo.details;

                _.each(details, async function(related){
                    if (!related) return;
                    let foo = related.split('.');
                    let rObjectName = foo[0];
                    // let rFieldName = foo[1];
                    const rObjectConfig = await objectql.getSteedosSchema().getObject(rObjectName).toConfig();
                    steedosI18n.translationObject(lng, rObjectConfig.name, rObjectConfig);
                    let rObjectLable = rObjectConfig.label;
                    options.push({label: rObjectLable, value: rObjectName})
                })
                return options;
            }
        },
        getObjectRelatedListsOptions: {
            async handler(ctx) {
                const userSession = ctx.meta.user;
                const lng = userSession.language || 'zh-CN';
                const objectName = ctx.params.objectName;
                const object = await objectql.getSteedosSchema().getObject(objectName);
                const objectConfig = object.toConfig();
                steedosI18n.translationObject(lng, objectConfig.name, objectConfig);

                const options = [];
                let relatedLists = []
                if(objectConfig.enable_files){
                    relatedLists.push("cms_files.parent")
                }
                /*
                    object.details是一个字符串，形如：testb__c.testa__c
                    object.lookup_details是一个对象，格式如下：
                    {
                        key: "testd__c.testa__c",
                        objectName: "testa__c",
                        type: "detail",
                    }
                */
                const relationsInfo = await object.getRelationsInfo();
                const details = relationsInfo && relationsInfo.details;
                const lookupDetails = relationsInfo && relationsInfo.lookup_details;
                relatedLists = relatedLists.concat(_.union(details, lookupDetails));

                if(objectConfig.enable_tasks){
                    relatedLists.push("tasks.related_to")
                }
                if(objectConfig.enable_notes){
                    relatedLists.push("notes.related_to")
                }
                if(objectConfig.enable_events){
                    relatedLists.push("events.related_to")
                }
                if(objectConfig.enable_instances){
                    relatedLists.push("instances.record_ids")
                }
                if(objectConfig.enable_approvals){
                    relatedLists.push("approvals.related_to")
                }
                if(objectConfig.enable_process){
                    relatedLists.push("process_instance_history.target_object")
                }
                if(objectConfig.enable_audit){
                    relatedLists.push("audit_records.related_to")
                }

                _.each(relatedLists, async function(related){
                    if (!related) return;
                    /*related可能是一个lookup_details，它是对象而不是字符串，从中取出key值*/
                    if(typeof related !== "string"){
                        related = related.key;
                    }
                    if (!related) return;
                    let foo = related.split('.');
                    let rObjectName = foo[0];
                    let rFieldName = foo[1];
                    const rObjectConfig = await objectql.getSteedosSchema().getObject(rObjectName).toConfig();
                    steedosI18n.translationObject(lng, rObjectConfig.name, rObjectConfig);
                    let rObjectLable = rObjectConfig.label;
                    let rObjectFieldLable = (_.find(rObjectConfig.fields, function(field){return field.name === rFieldName}) || {}).label;
                    options.push({label: `${rObjectLable}.${rObjectFieldLable}`, value: related})
                })
                return options;
            }
        },
        getObjectsGenerateTabsOptions: {
            async handler(ctx) {
                const userSession = ctx.meta.user;
                const lng = userSession.language || 'zh-CN';
                const spaceId = userSession.spaceId;
                const objectTabs = await objectql.getObject('tabs').find({filters: [['type', '=', "object"]]});
                const tabObjects = _.map(objectTabs, "object");
                const allMetadataObjects = await objectql.getSteedosSchema().getAllObject();
                const allObjects = _.map(allMetadataObjects, 'metadata');
                const query = {
                    filters: [['hidden', '!=', true], ['name', '<>', tabObjects]],
                    projection: {
                        name: 1, 
                        label: 1
                    }
                };
                // 只列出未找到tabs记录的对象清单
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
        generateTabs: {
            async handler(ctx) {
                let selectedObjects = ctx.params && ctx.params.objects && ctx.params.objects.split(",");
                if(!selectedObjects || !selectedObjects.length){
                    return {
                        doneCount:0,
                        errors: []
                    }
                }
                const userSession = ctx.meta.user;
                const lng = userSession.language || 'zh-CN';
                const spaceId = userSession.spaceId;
                const userId = userSession.userId;
                const companyId = userSession.company_id;
                const companyIds = userSession.company_ids;
                const allMetadataObjects = await objectql.getSteedosSchema().getAllObject();
                const allObjects = _.map(allMetadataObjects, 'metadata');
                const query = {
                    filters: [['name', 'in', selectedObjects]], //['hidden', '!=', true] ,
                    projection: {
                        name: 1,
                        label: 1
                    }
                };

                const objects = objectql.getSteedosSchema().metadataDriver.find(allObjects, query, spaceId);

                _.each(objects, (object) => {
                    if (object && object.name) {
                        steedosI18n.translationObject(lng, object.name, object)
                    }
                })
                const errors = [];
                let doneCount = 0;
                for(let i = 0;i < objects.length; i++) {
                    const object = objects[i];
                    try{
                        const existCount = await objectql.getObject('tabs').count({filters: [['object', '=', object.name]]});
                        if(existCount > 0){
                            return;
                        }
                        const tabLabel = object.label || object.name;
                        const tabName = "object_" + object.name.replace(/__c$/, "");
                        const now = new Date();
                        const doc = {
                            label: tabLabel, 
                            name: tabName, 
                            icon: object.icon,
                            type: "object", 
                            mobile: true,
                            desktop: true,
                            object: object.name,
                            space: spaceId,
                            owner: userId,
                            created_by: userId,
                            created: now,
                            modified_by: userId,
                            modified: now,
                            company_id: companyId,
                            company_ids: companyIds
                        };
                        const tab = await objectql.getObject('tabs').insert(doc);
                        if(tab && tab._id){
                            doneCount++;
                        }
                        else{
                            errors.push({
                                object: (object.label || object.name) + `(${object.name})`,
                                message: ""
                            });
                        }
                    }
                    catch(ex){
                        errors.push({
                            object: (object.label || object.name) + `(${object.name})`,
                            message: ex.message
                        });
                    }
                };
                return {
                    doneCount:doneCount,
                    errors: errors
                }
            }
        }
    }
};
