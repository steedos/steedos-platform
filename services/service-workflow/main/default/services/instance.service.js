const objectql = require('@steedos/objectql');
const _ = require('lodash');
module.exports = {
  name: "instance",
  actions: {
    instances__getRelatedInstances: {
      graphql: {
        query:
          `
          #获取可选取的相关申请单列表
          instances__getRelatedInstances(
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
        const { flowId, state, keywords , top , skip , sort} = ctx.params;

        const filters = await this.getRelatedFilters(flowId, state, keywords, userSession)

        let fields = [];

        const fieldNames = objectql.getGraphqlFields(resolveInfo);

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
            " instances__getRelatedInstances__count(flowId: String, state: String, keywords: String): Int"
        },
        async handler(ctx) {
            const userSession = ctx.meta.user;
            const { flowId, state, keywords } = ctx.params;
            const filters = await this.getRelatedFilters(flowId, state, keywords, userSession);
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
    }
  }
};
