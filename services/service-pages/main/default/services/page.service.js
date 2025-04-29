const objectql = require('@steedos/objectql');
const metadataAPI = require('@steedos/metadata-api');
const _ = require('lodash');
// 使用变量,存储所有资产
const ASSETS = {};
const ENV_ASSETS = process.env.STEEDOS_PUBLIC_PAGE_ASSETURLS
? process.env.STEEDOS_PUBLIC_PAGE_ASSETURLS.split(",")
: []
module.exports = {
    name: "page",
    mixins: [],
    /**
     * Settings
     */
    settings: {
        pageRender: process.env.STEEDOS_PAGE_RENDER || process.env.DEFAULT_PAGE_RENDER
    },

    /**
     * Dependencies
     */
    dependencies: [],

    /**
     * Actions
     */
    actions: {
        getMeSchema: {
            async handler(ctx) {
                const userSession = ctx.meta.user;
                const { type, app, objectApiName, recordId, pageId, formFactor } = ctx.params;
                return await this.getMeSchema(type, app, objectApiName, recordId, pageId, formFactor, userSession);
            }
        },
        //发布最新版
        deploy: {
            rest: {
                method: "POST",
                path: "/deploy"
            },
            params: {
                pageId: { type: 'string' }
            },
            handler: async function (ctx) {
                const { pageId } = ctx.params;
                const userSession = ctx.meta.user;
                const lastVersion = await this.getLatestPageVersion(pageId);
                const page = await objectql.getObject('pages').findOne(pageId);
                const response = {};
                if(lastVersion){
                    if(page && page.type == 'field_layout'){
                        response.fieldLayoutLog = await this.fieldLayoutSave(lastVersion.schema, page.object_name, userSession)
                    }
                    response.page_versions = await objectql.getObject('page_versions').update(lastVersion._id, { is_active: true }, userSession);
                    return response;
                }
            }
        },

        // 启用Page
        enable: {
            rest: {
                method: "POST",
                path: "/enable"
            },
            params: {
                pageId: { type: 'string' }
            },
            handler: async function (ctx) {
                const { pageId } = ctx.params;
                const userSession = ctx.meta.user;
                return await objectql.getObject('pages').update(pageId, { is_active: true }, userSession)
            }
        },

        // 禁用Page
        disable: {
            rest: {
                method: "POST",
                path: "/disable"
            },
            params: {
                pageId: { type: 'string' }
            },
            handler: async function (ctx) {
                const { pageId } = ctx.params;
                const userSession = ctx.meta.user;
                return await objectql.getObject('pages').update(pageId, { is_active: false }, userSession)
            }
        },
        getLatestPageVersion:{
            rest: {
                method: "GET",
                path: "/pageVersion/:pageId/latest"
            },
            params: {
                pageId: { type: "any" }
            },
            async handler(ctx){
                // const userSession = ctx.meta.user;
                const { pageId } = ctx.params;
                const pageVersion = await this.getLatestPageVersion(pageId);
                const page = await objectql.getObject('pages').findOne(pageId)
                return Object.assign(pageVersion || {}, {object_name: page.object_name, type: page.type})
            }
        },
        changePageVersion:{
            rest: {
                method: "PUT",
                path: "/pageVersion/:pageId"
            },
            params: {
                pageId: { type: "any" },
                schema: { type: "any" }
            },
            async handler(ctx){
                const userSession = ctx.meta.user;
                const { pageId, schema } = ctx.params;
                return await this.changePageVersion(pageId, schema, userSession);
            }
        },
        resetDefaultVersion: {
            rest: {
                method: "POST",
                path: "/resetDefaultSchema"
            },
            params: {
                pageId: { type: 'string' }
            },
            handler: async function (ctx) {
                const userSession = ctx.meta.user;
                const { pageId } = ctx.params;
                const page = await objectql.getObject('pages').findOne(pageId)
                const pageVersion = await this.getLatestPageVersion(pageId);
                const broker = objectql.getSteedosSchema().broker;
                const actions = broker.registry.getActionList({
                    onlyLocal: false
                });
                if(_.find(actions, (action)=>{
                    return action.name === `${page.render_engine}.getInitSchema`
                })){
                    const schema = await broker.call(`${page.render_engine}.getInitSchema`, {type: page.type, objectApiName: page.object_name}, {
                        meta:{
                            user: userSession
                        }
                    })
                    if(schema){
                        const now = new Date();
                        await objectql.getObject('page_versions').directInsert({
                            page: pageId,
                            is_active: false,
                            version: pageVersion && pageVersion.version ? pageVersion.version + 1 : 1,
                            schema: JSON.stringify(schema, null, 4),
                            space: page.space,
                            owner: userSession.userId,
                            created: now,
                            modified: now,
                            created_by: userSession.userId,
                            modified_by: userSession.userId,
                            company_id: page.company_id,
                            company_ids: page.company_ids
                        })
                    }
                }

                return {}
            }
        },
        customPage: {
            rest: {
                method: "POST",
                path: "/customPage"
            },
            params: {
                pageId: { type: 'string' }
            },
            handler: async function (ctx) {
                const userSession = ctx.meta.user;
                if(!userSession.is_space_admin){
                    throw new Error('Permission denied')
                }
                const { pageId } = ctx.params;
                const page = await objectql.getObject('pages').findOne(pageId);
                const records = await objectql.getObject('pages').find({filters: [['name', '=', page.name]]});
                const dbManager = new metadataAPI.DbManager(userSession);
                let result = {};
                if(records && records.length > 0 && records[0]._id != pageId){
                    result = {_id: records[0]._id}
                    return result
                }
                try {
                    await dbManager.connect();
                    var session = await dbManager.startSession();
                    const transactionOptions = {
                        readPreference: 'primary',
                        readConcern: { level: 'majority' },
                        writeConcern: { w: 'majority' }
                    };
                    try {
                        await session.withTransaction(async () => {
                            const pageCollection = new metadataAPI.PageCollection();
                            delete page.is_system
                            delete page.record_permissions
                            const info = await pageCollection.save(dbManager, page);
                            result._id = info.insertedId;
                        }, transactionOptions);
                    } catch(err) {
                        throw err
                    }
                }catch (err) {
                    throw new Error(err.message)  // 重新整理错误信息,否则会导致 service-api 无法处理错误信息导致接口挂起.
                }finally{
                    await dbManager.endSession();
                    await dbManager.close();
                }
                return result;
            }
        },
        addAssetUrl: {
            handler: async function (ctx) {
                const { name, url } = ctx.params;
                // console.log(`addAssetUrl`, name, url)
                return broker.broadcast("page.addAssetUrl", {
                    name, url
                });
            }
        },
        removeAssetUrl: {
            handler: async function (ctx) {
                const { name } = ctx.params;
                return broker.broadcast("page.removeAssetUrl", {
                    name
                });
            }
        }
    },

    /**
     * Events
     */
    events: {
        'page.addAssetUrl': function (ctx) {
            const { name, url } = ctx.params;
            ASSETS[name] = url;
            process.env.STEEDOS_PUBLIC_PAGE_ASSETURLS = _.compact(_.uniq(_.concat(ENV_ASSETS, _.values(ASSETS)))).join(',');
        },
        'page.removeAssetUrl': function (ctx) {
            const { name } = ctx.params;
            delete ASSETS[name]
            process.env.STEEDOS_PUBLIC_PAGE_ASSETURLS = _.compact(_.uniq(_.concat(ENV_ASSETS, _.values(ASSETS)))).join(',');
        },
    },

    /**
     * Methods
     */
    methods: {
        getDefaultSchema: {
            async handler(type, app, objectApiName, recordId, formFactor, userSession) {
                const pageRender = this.settings.pageRender;
                if (pageRender) {
                    return await this.broker.call(`${pageRender}.getDefaultSchema`, {type, app, objectApiName, recordId, formFactor}, {
                        meta: {
                          user: userSession
                        }
                      })
                }
                return;
            }
        },
        getTypePages: {
            async handler(type, objectApiName, userSession) {
                const filters = [['type', '=', type], ['is_active', '=', true]];
                if (type === 'list' || type === 'record' || type === 'form') {
                    filters.push(['object_name', '=', objectApiName]);
                }
                return await objectql.getObject('pages').find({ filters: filters, sort: 'modified desc' });
            }
        },
        getAssignments: {
            async handler(formFactor, typePages) {
                if(!typePages || typePages.length < 1){
                    return ;
                }
                const filters = [['page', 'in', _.map(typePages, '_id')]];
                if(formFactor === 'SMALL'){
                    filters.push(['mobile','=', true])
                }else{
                    filters.push(['desktop','=', true])
                }
                return await objectql.getObject("page_assignments").find({ filters: filters, sort: 'modified desc' });
            }
        },
        getAppProfileAssignment: {
            async handler(app, assignments, userSession) {
                return _.filter(assignments, (assignment) => {
                    //TODO Record Type
                    return assignment.app === app && arguments.profile === userSession.profile;
                });
            }
        },
        getAppDefaultAssignment: {
            async handler(app, assignments) {
                return _.filter(assignments, (assignment) => {
                    return assignment.app === app;
                });
            }
        },
        getOrgDefaultAssignment: {
            async handler(assignments) {
                return _.filter(assignments, (assignment) => {
                    return !assignment.app && !assignment.profile
                })
            }
        },
        getAssignmentPage: {
            async handler(assignment, typePages) {
                const page = _.find(typePages, (typePage) => {
                    return typePage.name == assignment.page || typePage._id == assignment.page
                })
                if (page) {
                    return page;
                }
                // else {
                //     throw new Error(`not find assignment page ${assignment.desktop}`)
                // }
            }
        },
        getUserPage: {
            /**
             * 自定义记录页面可在不同层面上分配：
             * 1 组织默认设置 记录页面会为对象显示，除非已进行更多特定分配。
             * 2 如果已指定，则应用程序默认设置 页面分配会覆盖组织默认设置。
             * 3 应用程序、记录类型和简档, 分配会覆盖组织和应用程序默认设置。
             * 
             */
            async handler(type, app, objectApiName, recordId, formFactor, userSession) {

                try {
                    const typePages = await this.getTypePages(type, objectApiName, userSession);
                    
                    //如果是app 类型,则直接返回最新的.
                    if(type === 'app'){
                        return typePages.length > 0 ? typePages[0] : null; 
                    }

                    const assignments = await this.getAssignments(formFactor, typePages);

                    const appProfileassignment = await this.getAppProfileAssignment(app, assignments, userSession);
                    if (appProfileassignment && appProfileassignment.length > 0) {
                        return await this.getAssignmentPage(appProfileassignment[0], typePages)
                    }

                    const appDefaultAssignment = await this.getAppDefaultAssignment(app, assignments);
                    if (appDefaultAssignment && appDefaultAssignment.length > 0) {
                        return await this.getAssignmentPage(appDefaultAssignment[0], typePages)
                    }

                    const orgDefaultAssignment = await this.getOrgDefaultAssignment(assignments);
                    if (orgDefaultAssignment && orgDefaultAssignment.length > 0) {
                        return await this.getAssignmentPage(orgDefaultAssignment[0], typePages)
                    }
                } catch (error) {
                    console.error(`error`, error);
                    return ;
                }
            }
        },
        getMeSchema: {
            async handler(type, app, objectApiName, recordId, pageId, formFactor, userSession) {
                if(pageId){
                    const records = await objectql.getObject('pages').find({filters: [['name', '=', pageId]]});
                    let pageInfo = {};
                    if(records.length > 0){
                        pageInfo = records[0];
                        const pageVersion = await this.getLatestPageVersion(pageInfo._id, true);
                        if(pageVersion && pageVersion.schema){
                            return Object.assign({}, pageInfo, {schema: pageVersion.schema});
                        } 
                    }
                    return ;
                    
                }
                // 计算 userSchema
                const userPage = await this.getUserPage(type, app, objectApiName, recordId, formFactor, userSession);
                if (userPage) {
                    const pageVersion = await this.getLatestPageVersion(userPage._id, true);
                    if(pageVersion && pageVersion.schema){
                        return Object.assign({}, userPage, {schema: pageVersion.schema});
                    }
                }
                const defaultSchema = await this.getDefaultSchema(type, app, objectApiName, recordId, formFactor, userSession);
                if(defaultSchema){
                    const pageRender = this.settings.pageRender;
                    return { render_engine: pageRender , schema: defaultSchema}
                }
            }
        },
        getLatestPageVersion:{
            async handler(pageId, isArchived) {
                const filters = [['page', '=', pageId]];
                if(isArchived){
                    filters.push(['is_active','=',true])
                }
                // 根据pageId 获取 page version
                const pageVersions = await objectql.getObject('page_versions').find({filters: filters, sort: 'version desc', top: 1});
                if(pageVersions.length === 1){
                    return pageVersions[0]
                }
            }
        },
        changePageVersion: {
            async handler(pageId, schema, userSession) {
                // 根据pageId 获取 pageversions
                const pageVersion = await this.getLatestPageVersion(pageId);
                let version = pageVersion ? pageVersion.version :0;
                if(pageVersion && !pageVersion.is_active){
                    return await objectql.getObject('page_versions').update(pageVersion._id, {
                        schema: schema
                    }, userSession);
                }else{
                    return await objectql.getObject('page_versions').insert({
                        page: pageId,
                        is_active: false,
                        schema: schema,
                        version: ++version,
                        space: userSession.spaceId
                    }, userSession) 
                }
            }
        },
        fieldLayoutSave: {
            async handler(schemaString, object_name, userSession) {
                const submitProps = ["_name", "name", "type", "amis", "auto_fill_mapping", "autonumber_enable_modify", "column_name", "coordinatesType", "create", "data_type",
                    "defaultValue", "deleted_lookup_record_behavior", "depend_on", "description", "enable_enhanced_lookup", "enable_thousands", "filterable", "filters", "filtersFunction", "formula_blank_value", "formula",
                    "generated", "group", "hidden", "index", "inlineHelpText", "is_customize", "is_name", "is_system", "is_wide", "label", "language", "multiple", "object", "options", "precision", "primary", "readonly", "reference_to_field",
                    "reference_to", "required", "rows", "scale", "searchable", "show_as_qr", "sort_no", "sortable", "static", "summary_field", "summary_object", "summary_filters", "summary_type", "unique", "visible_on", "write_requires_master_read"
                ];
                const schema = JSON.parse(schemaString);
                let steedosFields = [];
                //提取schema中的steedos-field
                function findSteedosFields(obj) {
                    if (Array.isArray(obj)) {
                        for (let i = 0; i < obj.length; i++) {
                            findSteedosFields(obj[i]);
                        }
                    } else if (typeof obj === 'object' && obj !== null) {
                        if (obj.type === 'steedos-field') {
                            steedosFields.push(obj);
                        } else {
                            for (let key in obj) {
                                findSteedosFields(obj[key]);
                            }
                        }
                    }
                }
                findSteedosFields(schema);

                const fields = [];
                //根据object_fields的字段，提取对应属性
                _.forEach(steedosFields, item => {
                    item._name = item.name;
                    fields.push(_.pick(item.config, submitProps))
                })
                const object_fields = await objectql.getObject('object_fields');
                const dbFields = await object_fields.directFind({filters: ['object','=', object_name]});
                /*
                    若fields中存在，dbFields中不存在，将该对象name值存入insertFields
                    若fields中存在，dbFields中也存在，将该对象name值存入updateFields
                    若fields中不存在，dbFields中存在，将该对象name值存入deleteFields
                */
                let insertFields = _.differenceBy(fields, dbFields, 'name').map(field => field.name);
                let updateFields = _.intersectionBy(fields, dbFields, 'name').map(field => field.name);
                let deleteFields = _.differenceBy(dbFields, fields, 'name').map(field => field.name);
                
                // 用于记录成功和失败的字段
                const log = {
                    insert: {
                        success: [],
                        error: []
                    },
                    update: {
                        success: [],
                        error: []
                    },
                    delete: {
                        success: [],
                        error: []
                    }
                };
                
                // 循环需要增加的字段
                for (const fieldName of insertFields) {
                    try {
                        const newId = await object_fields._makeNewID();
                        const now = new Date();
                        const field = _.find(fields, { name: fieldName });
                        await object_fields.directInsert(Object.assign({}, field, {
                            _id: newId,
                            owner: userSession.userId,
                            space: userSession.spaceId,
                            object: object_name,
                            created: now,
                            modified: now,
                            created_by: userSession.userId,
                            modified_by: userSession.userId,
                            company_id: userSession.company_id,
                            company_ids: userSession.company_ids
                        }));
                        log.insert.success.push(fieldName);
                    } catch (e) {
                        log.insert.error.push(fieldName);
                        console.error(`新增字段 ${fieldName} 时出错：`, e);
                    }
                }
                
                // const fieldsToUpdate = [];
                // _.forEach(updateFields, field => {
                //     const fieldInFields = _.find(fields, {name: field});
                //     const sameKeys = _.keys(fieldInFields);
                //     const fieldInDbFields = _.pick(_.find(dbFields, {name: field}), sameKeys);


                //     // 比较这两个对象，如果不相等，则添加到fieldsToUpdate数组中
                //     if (!_.isEqual(fieldInFields, fieldInDbFields)) {
                //         fieldsToUpdate.push(field);
                //     }
                // });
                // // 更新updateFields为fieldsToUpdate
                // updateFields = fieldsToUpdate;
                // 循环需要修改的字段
                const now = new Date();
                for (const fieldName of updateFields) {
                    try {
                        const field = _.find(fields, { name: fieldName });
                        const id = _.find(dbFields, { name: fieldName })._id;
                        const submitField = _.omit(field, ['name', '_name']);
                        await object_fields.directUpdate(id, Object.assign({}, submitField, {
                            modified: now,
                            modified_by: userSession.userId
                        }));
                        log.update.success.push(fieldName);
                    } catch (e) {
                        log.update.error.push(fieldName);
                        console.error(`更新字段 ${fieldName} 时出错：`, e);
                    }
                }
                // 循环需要删除的字段
                for (const fieldName of deleteFields) {
                    try {
                        const id = _.find(dbFields, { name: fieldName })._id;
                        await object_fields.directDelete(id);
                        log.delete.success.push(fieldName);
                    } catch (e) {
                        log.delete.error.push(fieldName);
                        console.error(`删除字段 ${fieldName} 时出错：`, e);
                    }
                }
                //label和修改时间未实时生效
                const object = await objectql.getObject('objects');
                const current_object = await object.findOne({filters:[["name","=",object_name]]});
                await object.update(current_object._id,{reload_time: new Date()})
                return log;
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
