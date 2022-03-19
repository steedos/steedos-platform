const objectql = require('@steedos/objectql');

const _ = require('lodash');

module.exports = {
    name: "page",
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
        getMeSchema: {
            async handler(ctx) {
                const userSession = ctx.meta.user;
                const { type, app, objectApiName, recordId, formFactor } = ctx.params;
                return await this.getMeSchema(type, app, objectApiName, recordId, formFactor, userSession);
            }
        },
        // enablePageVersion:{
        //     rest: {
        //         method: "GET",
        //         path: "/pageSchema/enable/:pageVersionId"
        //     },
        //     params: {
        //         pageVersionId: { type: "any" }
        //     },
        //     async handler(ctx) {
        //         const userSession = ctx.meta.user;
        //         const { pageVersionId } = ctx.params;
        //         return await this.enablePageVersion(pageVersionId, userSession);
        //     }
        // },
        getLatestPageVersion:{
            rest: {
                method: "GET",
                path: "/pageVersion/:pageId/latest"
            },
            params: {
                pageId: { type: "any" }
            },
            async handler(ctx){
                const userSession = ctx.meta.user;
                const { pageId } = ctx.params;
                return await this.getLatestPageVersion(pageId, userSession);
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
            async handler(type, app, objectApiName, formFactor, recordId, userSession) {
                if (process.env.DEFAULT_PAGE_RENDER) {
                    return await this.broker.call(`${process.env.DEFAULT_PAGE_RENDER}.getDefaultSchema`, {type, app, objectApiName, recordId, formFactor}, {
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
                const filters = [['type', '=', type], ['is_archived', '=', true]];
                if (type === 'list' || type === 'record' || type === 'form') {
                    filters.push(['object_name', '=', objectApiName]);
                }
                return await objectql.getObject('pages').find({ filters: filters });
            }
        },
        getAssignments: {
            async handler(formFactor) {
                const filters = [];
                if(formFactor === 'SMALL'){
                    filters.push(['mobile','=', true])
                }else{
                    filters.push(['desktop','=', true])
                }
                return await objectql.getObject("page_assignments").find({ filters: filters });
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
             * TODO form factors "LARGE","SMALL"
             * TODO 页面分配有多条时的优先级处理（始终是最新的分配生效）。
             */
            async handler(type, app, objectApiName, recordId, formFactor, userSession) {

                try {
                    const typePages = await this.getTypePages(type, objectApiName, userSession);
                    const assignments = await this.getAssignments(formFactor);

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
            async handler(type, app, objectApiName, recordId, formFactor, userSession) {
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
                    return {schema: defaultSchema}
                }
            }
        },
        getLatestPageVersion:{
            async handler(pageId, isArchived) {
                const filters = [['page', '=', pageId]];
                if(isArchived){
                    filters.push(['is_archived','=',true])
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
                if(pageVersion && !pageVersion.is_archived){
                    return await objectql.getObject('page_versions').update(pageVersion._id, {
                        schema: schema
                    }, userSession);
                }else{
                    return await objectql.getObject('page_versions').insert({
                        page: pageId,
                        is_archived: false,
                        schema: schema,
                        version: ++version,
                        space: userSession.spaceId
                    }, userSession) 
                }
            }
        },
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
