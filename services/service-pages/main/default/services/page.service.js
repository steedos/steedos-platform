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
                const { type, app, objectApiName, recordId } = ctx.params;
                return await this.getMeSchema(type, app, objectApiName, recordId, userSession);
            }
        },
        // getDefaultSchema: {
        //     async handler(ctx) {
        //         return await this.getDefaultSchema();
        //     }
        // }
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
            async handler(type, app, objectApiName, recordId, userSession) {
                if (process.env.DEFAULT_PAGE_RENDER) {
                    return await this.broker.call(`${process.env.DEFAULT_PAGE_RENDER}.getDefaultSchema`, {type, app, objectApiName, recordId}, {
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
                const filters = [['type', '=', type]];
                if (type === 'list' || type === 'record' || type === 'form') {
                    filters.push(['object_name', '=', objectApiName]);
                }
                return await objectql.getObject('pages').find({ filters: filters }, userSession);
            }
        },
        getAssignments: {
            async handler(app, userSession) {
                return await objectql.getObject("page_assignments").find({ filters: ['app', '=', app] }, userSession);
            }
        },
        getLevel1Assignment: {
            async handler(app, assignments, userSession) {
                return _.filter(assignments, (assignment) => {
                    //TODO Record Type
                    return assignment.app === app && arguments.profile === userSession.profile;
                });
            }
        },
        getLevel2Assignment: {
            async handler(app, assignments) {
                return _.filter(assignments, (assignment) => {
                    return assignment.app === app;
                });
            }
        },
        getOrgDefaultPage: {
            async handler(typePages) {
                return _.find(typePages, (typePage) => {
                    return typePage.is_default
                })
            }
        },
        getAssignmentPage: {
            async handler(assignment, typePages) {
                const page = _.find(typePages, (typePage) => {
                    return typePage.name == assignment.desktop
                })
                if (page) {
                    return page;
                } else {
                    throw new Error(`not find assignment page ${assignment.desktop}`)
                }
            }
        },
        getUserPage: {
            /**
             * 自定义记录页面可在不同层面上分配：
             * 1 组织默认设置 记录页面会为对象显示，除非已进行更多特定分配。
             * 2 如果已指定，则应用程序默认设置 页面分配会覆盖组织默认设置。
             * 3 应用程序、记录类型和简档, 分配会覆盖组织和应用程序默认设置。
             * 
             * TODO form factors
             * TODO 页面分配有多条时的优先级处理（始终是最新的分配生效）。
             */
            async handler(type, app, objectApiName, userSession) {

                try {
                    const typePages = await this.getTypePages(type, objectApiName, userSession);
                    const assignments = await this.getAssignments(app, userSession);

                    const assignment1 = await this.getLevel1Assignment(app, assignments, userSession);
                    if (assignment1 && assignment1.length > 0) {
                        return await this.getAssignmentPage(assignment1[0], typePages)
                    }

                    const assignment2 = await this.getLevel2Assignment(app, assignments);
                    if (assignment2 && assignment2.length > 0) {
                        return await this.getAssignmentPage(assignment2[0], typePages)
                    }

                    const orgDefaultPage = await this.getOrgDefaultPage(typePages);
                    if (orgDefaultPage) {
                        return orgDefaultPage;
                    }
                } catch (error) {
                    console.error(`error`, error);
                    return ;
                }
            }
        },
        getMeSchema: {
            async handler(type, app, objectApiName, recordId, userSession) {
                // 计算出 userSchema
                const userSchema = await this.getUserPage(type, app, objectApiName, userSession);
                if (userSchema) {
                    return userSchema;
                }
                return await this.getDefaultSchema(type, app, objectApiName, recordId, userSession);
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
