const objectql = require('@steedos/objectql');
const _ = require('lodash');
const serviceObjectGraphql = require('@steedos/service-object-graphql');
module.exports = {
  name: "instance",
  actions: {
    instances__getRelatedInstances: {
      graphql: {
        query:
          `
          #获取可选取的相关申请单列表
          instances__getRelatedInstances(
            #过滤条件
            filters: JSON,
            #按流程过滤
            flowId: String,
            #按状态过滤 
            state: String,
            #按关键字过滤 
            keywords: String,
            #分页参数: 每次返回的记录数
            top: Int, 
            #分页参数: 跳过的记录数
            skip: Int, 
            #排序规则
            sort: String): [instances]
          `,
      },
      async handler(ctx) {
        const userSession = ctx.meta.user;
        const { resolveInfo } = ctx.meta;
        const { flowId, state, keywords , top , skip , sort, filters: userFilters} = ctx.params;

        const filters = await this.getRelatedFilters(flowId, state, keywords, userSession)

        if(!_.isEmpty(userFilters)){
            filters.push(userFilters);
        }

        let fields = [];

        const fieldNames = serviceObjectGraphql.getGraphqlFields(resolveInfo);

        if (!_.isEmpty(fieldNames)) {
            fields = fieldNames;
        };

        const query = {
            filters: filters, 
            fields: fields,
            top: top,
            skip: skip,
            sort: sort,
        }

        return await objectql.getObject('instances').find(query, null)
      },
    },
    instances__getRelatedInstances__count: {
        graphql: {
            query:
            " instances__getRelatedInstances__count(flowId: String, state: String, keywords: String, filters: JSON): Int"
        },
        async handler(ctx) {
            const userSession = ctx.meta.user;
            const { flowId, state, keywords, filters: userFilters } = ctx.params;
            const filters = await this.getRelatedFilters(flowId, state, keywords, userSession);
            if(!_.isEmpty(userFilters)){
                filters.push(userFilters);
            }
            const query = {
                filters: filters
            }
    
            return await objectql.getObject('instances').count(query, null)
          },
    },
    getApprove: {
        async handler(ctx){
            const { instanceId, traceId, approveId } = ctx.params;
            return await this.getApprove(instanceId, traceId, approveId);
        }
    },
    getBoxFilters: {
        async handler(ctx){
            const { appId, box, flowId, userId, is_space_admin, spaceId } = ctx.params;
            const categoriesIds = await this.getAppCategoriesIds(appId);
            const filter = [];
            switch (box) {
                case 'inbox':
                    filter.push(['handler', '=', userId]);
                    filter.push(['is_finished', '=', false]);
                    break;
                case 'outbox':
                    filter.push(['handler', '=', userId]);
                    filter.push(['is_finished', '=', true]);
                    filter.push(['is_latest_approve', '=', true]);
                    break;
                case 'draft':
                    filter.push(['submitter', '=', userId]);
                    filter.push(['state', '=', 'draft']);
                    //TODO 需要排除 分发、转发的申请单
                    // filter.push(['inbox_users', '=', []]);
                    break;
                case 'pending':
                    filter.push(['state', '=', 'pending']);
                    filter.push([['submitter', '=', userId], 'or', ['applicant', '=', userId]]);
                    break;
                case 'completed':
                    filter.push(['submitter', '=', userId]);
                    filter.push(['state', '=', 'completed']);
                    break;
                case 'monitor':
                    filter.push(['state', 'in', ["pending", "completed"]]);
                    if(!is_space_admin){
                        const flowIds = await new Promise(function (resolve, reject) {
                            Fiber(function () {
                                try {
                                    resolve(WorkflowManager.getMyAdminOrMonitorFlows(spaceId, userId));
                                } catch (error) {
                                    reject(error);
                                }
                            }).run()
                        })
                        if(flowId){
                            if(!_.includes(flowIds, flowId)){
                                // filter.push([
                                //     ['submitter', '=', userId], 'or', ['applicant', '=', userId], 'or', ['inbox_users', '=', userId], 'or', ['outbox_users', '=', userId]
                                // ])
                            }
                        }else{
                            filter.push(['flow', 'in', flowIds])
                        }
                    }
                    break;
                default:
                    filter.push(['state', '=', 'none']);
                    break;
            }

            if(categoriesIds && categoriesIds.length > 0){
                filter.push(['category', 'in', categoriesIds])
            }

            return filter;
        }
    }
  },
  methods: {
    getRelatedFilters: {
        async handler(flowId, state, keywords, userSession){
            const filters = [];
            const defaultFilters = await this.getRelatedDefaultFilters(userSession);
            const userFilters = [];

            if(!_.isEmpty(defaultFilters)){
                filters.push(defaultFilters);
            }

            if(flowId){
                userFilters.push(['flow', '=', flowId]);
            };

            if(state){
                userFilters.push(['state', '=', state]);
            }else{
                userFilters.push(['state', 'in', ['pending', 'completed']]);
            }

            if(keywords){
                userFilters.push([
                    ['name', 'contains', keywords], 
                    'or', 
                    ['applicant_name', 'contains', keywords], 
                    'or', 
                    ['flow_name', 'contains', keywords], 
                    'or', 
                    ['current_step_name', 'contains', keywords]
                ])
            };

            if(!_.isEmpty(userFilters)){
                filters.push(userFilters);
            };
            return filters;
        }
    },
    getRelatedDefaultFilters: {
        async handler(userSession){
            const filters = [];

            filters.push(['space', '=', userSession.spaceId]);

            if(!userSession.is_space_admin){
                const monitorFlows = await objectql.getObject('flows').find({filters: [
                    ['perms.orgs_can_monitor', 'in',   userSession.organizations_parents],
                    'or',
                    ['perms.users_can_monitor', '=', userSession.userId]
                ], fields: ['_id']});
                
                const adminFlows = await objectql.getObject('flows').find({filters: [
                    ['perms.orgs_can_admin', 'in',   userSession.organizations_parents],
                    'or',
                    ['perms.users_can_admin', '=', userSession.userId]
                ], fields: ['_id']})
                
                filters.push([
                    ['submitter', '=', userSession.userId],
                    'or',
                    ['applicant', '=', userSession.userId],
                    'or',
                    ['inbox_users', '=', userSession.userId],
                    'or',
                    ['outbox_users', '=', userSession.userId],
                    'or',
                    ['cc_users', '=', userSession.userId],
                    'or',
                    ['inbox_users', '=', userSession.userId],
                    'or',
                    ['flow', 'in', _.uniq(_.concat(_.map(monitorFlows, '_id'), _.map(adminFlows, '_id')))],
                ])

            }
            return filters;
        },
    },
    getApprove: {
        async handler(instanceId, traceId, approveId){
            const instance = await objectql.getObject('instances').findOne(instanceId);
            const trace = _.find(instance.traces, (trace) => {
                return trace._id == traceId;
              });
            if(trace){
                return _.find(trace.approves, (approve) => {
                    return approve._id == approveId;
                });
            }
        }
    },
    getAppCategoriesIds: {
        async handler(appId) {
          const categories = await objectql.getObject('categories').directFind({ filters: [['app', '=', appId]] });
          return _.map(categories, '_id');
        }
    },
  }
};
