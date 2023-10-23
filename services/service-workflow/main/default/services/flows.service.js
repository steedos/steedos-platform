/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2023-01-14 11:31:56
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2023-10-18 09:50:42
 * @Description:
 */
const objectql = require("@steedos/objectql");
const { getStep } = require('../uuflowManager');
const _ = require("lodash");
module.exports = {
  name: "flows",
  settings: {
    graphql: {
      type: `
        """
        This type describes a post entity.
        """			
        type categoriesTree {
            _id: String
            name: String
            space: String
            created: Date
            created_by: JSON
            modified: Date
            modified_by: JSON
            flows: [flows]
        }
      `
    }
  },
  actions: {
    flows__getList: {
      graphql: {
        query: `
          #按权限获取flows数据
          flows__getList(
            # add || query || distribute
            action: String,
            # app Id
            appId: String
            # 搜索的关键字
            keywords: String,
            # distribute instance id
            distributeInstanceId: String
            # distribute step id
            distributeStepId: String,
            # 显示所有流程
            allData: Boolean
            ): [categoriesTree]
          `,
      },
      async handler(ctx) {
        try {
          const userSession = ctx.meta.user;
          const { resolveInfo } = ctx.meta;
          const { action, appId, keywords, distributeInstanceId, distributeStepId, allData } = ctx.params;
          return await this.getFlowListData(action, { appId, keywords, distributeInstanceId, distributeStepId, allData }, userSession)
        } catch (error) {
          throw error;
        }
      },
    },
  },
  methods: {
    formatKeywords: {
      handler(keywords) {
        if (keywords) {
          return _.uniq(_.compact(keywords.split(' ')))
        }
      }
    },
    getKeywordsFilter: {
      handler(keywords) {
        if (keywords) {
          const keys = this.formatKeywords(keywords);
          if (keys && keys.length > 0) {
            const keywordsFilter = [];
            _.each(keys, (key) => {
              keywordsFilter.push(['name', 'contains', key])
            })
            return keywordsFilter;
          }
        }
      }
    },
    getAppCategoriesIds: {
      async handler(appId, allData) {
        const query = {};
        if(appId && allData !=true){
          query.filters = [['app', '=', appId]] 
        }
        // console.log(`getAppCategoriesIds`, appId, allData, query)
        const categories = await objectql.getObject('categories').find(query);
        return _.map(categories, '_id');
      }
    },
    getFlowListData: {
      async handler(action, options, userSession) {
        const { appId, keywords, distributeInstanceId, distributeStepId, allData } = options;

        const categoriesIds = await this.getAppCategoriesIds(appId, allData);

        const keywordsFilter = this.getKeywordsFilter(keywords)
        let data = [];
        const { is_space_admin } = userSession;
        // 分发的流程范围处理
        let distributeOptionalFlows = [];
        if (action === "distribute") {
          if (distributeInstanceId && distributeStepId) {
            const instance = await objectql.getObject('instances').findOne(distributeInstanceId);
            if (instance) {
              const flow = await objectql.getObject('flows').findOne(instance.flow);
              if (flow) {
                const step = getStep(instance, flow, distributeStepId);
                if (step && step.allowDistribute == true) {
                  distributeOptionalFlows = step.distribute_optional_flows || [];
                }
              }
            }
          }
          if (distributeOptionalFlows.length > 0) {
            const dflows = await objectql
              .getObject("flows")
              .find({
                filters: [
                  ["_id", "in", distributeOptionalFlows],
                  ["state", "=", "enabled"],
                ],
                fields: ['_id', 'name', 'sort_no', 'category', 'distribute_optional_users', 'distribute_to_self', 'distribute_end_notification'], // 只取必要字段
                sort: "sort_no,name"
              });
            const dCategoryIds = _.map(dflows, 'category')
            const dCategoryDocs = await this.getSpaceCategories(dCategoryIds, userSession);
            for (const category of dCategoryDocs) {
              category.flows = [];
              for (const flow of dflows) {
                if (flow.category === category._id)
                  category.flows.push(flow);
              }
            }
            data = dCategoryDocs;
          }
        } else {
          var categories = await this.getSpaceCategories(categoriesIds, userSession);
          for (const category of categories) {
            const filters = [
              ["category", "=", category._id],
              ["state", "=", "enabled"],
              ["forbid_initiate_instance", "!=", true]
            ];
            if (keywordsFilter) {
              filters.push(keywordsFilter)
            }
            // console.log(`filters`, filters)
            const categoryFlows = await objectql.getObject("flows").find({
              filters: filters,
              fields: ['_id', 'name', 'sort_no', 'category', 'perms'],
              sort: "sort_no,name",
            });
            category.flows = [];
            for (const flow of categoryFlows) {
              if(allData){
                category.flows.push(flow);
              }else{
                if (this.canAdd(flow, userSession)) {
                  category.flows.push(flow);
                } else if (action == 'query') {
                  if (is_space_admin || this.canMonitor(flow, userSession) || this.canAdmin(flow, userSession)) {
                    category.flows.push(flow);
                  }
                }
              }
            }
          }
          data = categories;
        }
        return data;
      }
    },
    getSpaceCategories: {
      async handler(ids, userSession) {
        const filters = [["space", "=", userSession.spaceId]];
        if (!_.isEmpty(ids)) {
          filters.push(["_id", "in", ids]);
        }
        return await objectql
          .getObject("categories")
          .find({ filters: filters, sort: "sort_no desc" });
      }
    },
    canAdd: {
      handler(flow, userSession) {
        let canAdd = false;
        const { perms } = flow;
        const { userId, organizations, organizations_parents } = userSession;
        const organizationIds = _.map(organizations, "_id");
        if (perms) {
          if (perms.users_can_add && perms.users_can_add.includes(userId)) {
            canAdd = true;
          } else if (perms.orgs_can_add && perms.orgs_can_add.length > 0) {
            if (
              organizationIds &&
              _.intersection(organizationIds, perms.orgs_can_add).length > 0
            ) {
              canAdd = true;
            } else {
              canAdd =
                organizations_parents &&
                _.intersection(organizations_parents, perms.orgs_can_add).length >
                0;
            }
          }
        }
        return canAdd;
      }
    },
    canAdmin: {
      handler(flow, userSession) {
        let canAdmin = false;
        const { perms } = flow;
        const { userId, organizations, organizations_parents } = userSession;
        const organizationIds = _.map(organizations, "_id");
        if (perms) {
          if (perms.users_can_admin && perms.users_can_admin.includes(userId)) {
            canAdmin = true;
          } else if (perms.orgs_can_admin && perms.orgs_can_admin.length > 0) {
            if (
              organizationIds &&
              _.intersection(organizationIds, perms.orgs_can_admin).length > 0
            ) {
              canAdmin = true;
            } else {
              canAdmin =
                organizations_parents &&
                _.intersection(organizations_parents, perms.orgs_can_admin)
                  .length > 0;
            }
          }
        }
        return canAdmin;
      }
    },
    canMonitor: {
      handler(flow, userSession) {
        let canMonitor = false;
        const { perms } = flow;
        const { userId, organizations, organizations_parents } = userSession;
        const organizationIds = _.map(organizations, "_id");
        if (perms) {
          if (
            perms.users_can_monitor &&
            perms.users_can_monitor.includes(userId)
          ) {
            canMonitor = true;
          } else if (
            perms.orgs_can_monitor &&
            perms.orgs_can_monitor.length > 0
          ) {
            if (
              organizationIds &&
              _.intersection(organizationIds, perms.orgs_can_monitor).length > 0
            ) {
              canMonitor = true;
            } else {
              canMonitor =
                organizations_parents &&
                _.intersection(organizations_parents, perms.orgs_can_monitor)
                  .length > 0;
            }
          }
        }
        return canMonitor;
      }
    },
  },
};
