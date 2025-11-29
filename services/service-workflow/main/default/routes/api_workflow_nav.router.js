'use strict';
// @ts-check
const objectql = require('@steedos/objectql');
const express = require('express');
const router = express.Router();
const core = require('@steedos/core');
const _ = require('underscore');
const lodash = require('lodash');
const { link } = require('fs');
const { t } = require('@steedos/i18n')
var Fiber = require('fibers');

/**
@api {get} /api/workflow/nav 获取用户
@apiVersion 0.0.0
@apiName /api/workflow/nav
@apiGroup service-workflow
@apiSuccessExample {json} Success-Response:
    HTTP/1.1 200 OK
    {
      'links': [],
    }
@apiErrorExample {json} Error-Response:
    HTTP/1.1 200 OK
    {
      errors: [{ errorMessage: e.message }]
    }
 */

/**
 * 查询草稿箱数据数量
 */
const getDraftCount = async (userSession, req) => {
  const { appId } = req.params;
  const { userId, is_space_admin, spaceId } = userSession;
  const filters = await objectql.getSteedosSchema().broker.call("instance.getBoxFilters", {
    box: "draft", flowId: null, userId, is_space_admin, appId, spaceId
  })
  const draftCount = await objectql.getObject('instances').count({ filters:filters }, userSession)
  return draftCount;
}


/**
 * 1 查询inbox数据
 * 2 结算出分类
 * 3 按要求返回数据结构
 */
const getCategoriesInbox = async (userSession, req, currentUrl) => {
  const { appId } = req.params;
  const { userId, is_space_admin, spaceId } = userSession;
  const filters = await objectql.getSteedosSchema().broker.call("instance.getBoxFilters", {
    box: "inbox", flowId: null, userId, is_space_admin, appId, spaceId
  })
  const data = await objectql.getObject("instance_tasks").find({
    filters: filters,
    fields: ['_id', 'flow', 'category','flow_name','category_name']
  }, userSession)

  const output = [];
  const categoryGroups = lodash.groupBy(data, 'category_name');
  lodash.each(categoryGroups, (v, k)=>{
    let categoryBadge = 0;
    const flowGroups = lodash.groupBy(v, 'flow_name');
    const flows = [];
    const categoryValue = `/app/${appId}/instance_tasks/grid/inbox?additionalFilters=['category','=',${v[0].category?"'" + v[0].category + "'":v[0].category}]&flowId=&categoryId=${v[0].category}`;
    let categoryIsUnfolded = false;
    lodash.each(flowGroups, (v2, k2)=>{
      const flowValue = `/app/${appId}/instance_tasks/grid/inbox?additionalFilters=['flow','=','${v2[0].flow}']&flowId=${v2[0].flow}&categoryId=${v[0].category}`;
      let flowIsUnfolded = false;
      if(currentUrl == flowValue){
        flowIsUnfolded = true;
        categoryIsUnfolded = true;
      }
      categoryBadge += v2.length
      flows.push({
        label: k2,
        flow_name: k2,
        tag:v2.length,
        options:{
          level:3,
          value: v2[0].flow,
          name: 'flow',
          to: flowValue,
        },
        value: flowValue,
        unfolded: flowIsUnfolded
      })
    })
    if(currentUrl == categoryValue){
      categoryIsUnfolded = true;
    }
    output.push({
      label: k == 'null' || k == 'undefined' || !k ? "未分类" : k,
      children: flows,
      category_name: k == 'null' || k == 'undefined' || !k ? "未分类" : k,
      tag: v.length,
      options: {
        level: 2,
        value: v[0].category,
        name: 'category',
        to: categoryValue,
      },
      value: categoryValue,
      unfolded: categoryIsUnfolded
    })
  })
  return {
    schema: output,
    count: data.length,
  }
}

/**
 * 1 查询监控箱flows数据
 * 2 结算出分类
 * 3 按要求返回数据结构
 */
const getCategoriesMonitor = async (userSession, req, currentUrl) => {
  let hasFlowsPer = userSession.is_space_admin;
  const { appId } = req.params;
  let output = [];
  let monitorIsUnfolded = false;
  try {
    // const sa = new Date().getTime();
    const apps = await objectql.getObject('apps').find({filters: ['space', '=', userSession.spaceId], fields: ['_id', 'code']});
    // console.log(`find apps`, new Date().getTime() - sa)
    const appsMap = new Map(Object.entries(lodash.keyBy(apps, '_id')));
    // const sc = new Date().getTime();
    const categories = await objectql.getObject('categories').find({filters: ["space", "=", `${userSession.spaceId}`], sort: "sort_no desc"})
    // console.log(`find categories`, new Date().getTime() - sc)
    for (const item of categories) {
      if(item.app){
        item.app__expand = appsMap.get(item.app)
      }else{
        item.app__expand = {}
      }
    }

    let currentAppCategories = [];
    if(appId == "approve_workflow"){
      currentAppCategories = categories;
    }else{
      currentAppCategories = lodash.filter(categories, (category) => {
        if(category.app__expand?.code == appId) return true;
        else return false;
      })
      if(currentAppCategories.length == 0) {
        //如果没有任何分类绑定该app，则该app显示所有分类（该规则为审批王规则）
        currentAppCategories = categories;
      }
    }
    let categoriesIds = lodash.map(currentAppCategories, '_id');
    // console.log(`getCategoriesMonitor categoriesIds`, categoriesIds)
    // console.log(`getCategoriesMonitor hasFlowsPer`, hasFlowsPer)
    let flows = [];
    if (!hasFlowsPer) {
      const flowIds = await new Promise(function (resolve, reject) {
        Fiber(function () {
          try {
            resolve(WorkflowManager.getMyAdminOrMonitorFlows(userSession.spaceId, userSession.userId));
          } catch (error) {
            reject(error);
          }
        }).run();
      });
      hasFlowsPer = flowIds && flowIds.length > 0;
      if (hasFlowsPer) {
        flows = await objectql.getObject('flows').find({
          filters: [["_id","in", flowIds],"and",["category","in", categoriesIds], "and", ["state", "=", "enabled"]],
          fields: ['_id', 'name', 'category', 'sort_no'],
          sort:"sort_no desc"
        });
      }
    } else {
      // const s1 = new Date().getTime();
      flows = await objectql.getObject('flows').find({
        filters:[["space", "=", userSession.spaceId],["category","in", categoriesIds],["state", "=", "enabled"]],
        fields: ['_id', 'name', 'category', 'sort_no'],
        sort:"sort_no desc"
      })
      // console.log(`find flows`, new Date().getTime() - s1)
    }
    if (flows.length > 0) {
      const categoriesMap = new Map(Object.entries(lodash.keyBy(categories, '_id')));

      for (const item of flows) {
        if(item.category){
          item.category__expand = categoriesMap.get(item.category)
        }else{
          item.category__expand = {}
        }
      }

      const categoryGroups = lodash.groupBy(flows, 'category__expand.name');
      lodash.each(categoryGroups, (v, k) => {
        const flowGroups = lodash.groupBy(v, 'name');
        const flows = [];
        const categoryValue = `/app/${appId}/instances/grid/monitor?additionalFilters=['category','=',${v[0].category__expand?"'" + v[0].category__expand._id + "'":null}]&flowId=&categoryId=${v[0].category__expand && v[0].category__expand._id}`;
        let categoryIsUnfolded = false;
        lodash.each(flowGroups, (v2, k2) => {
          const flowValue = `/app/${appId}/instances/grid/monitor?additionalFilters=['flow','=','${v2[0]._id}']&flowId=${v2[0]._id}&categoryId=${v[0].category__expand && v[0].category__expand._id}`;
          let flowIsUnfolded = false;
          if(currentUrl == flowValue){
            flowIsUnfolded = true;
            categoryIsUnfolded = true;
            monitorIsUnfolded = true;
          }
          flows.push({
            label: k2,
            flow_name: k2,
            options: {
              level: 3,
              value: v2[0]._id,
              name: 'flow',
              to: flowValue,
            },
            value: flowValue,
            unfolded: flowIsUnfolded
          })
        })
        if(currentUrl == categoryValue){
          categoryIsUnfolded = true;
          monitorIsUnfolded = true;
        }
        output.push({
          label: k == 'null' || k == 'undefined' || !k? "未分类" : k,
          children: flows,
          category_name: k == 'null' || k == 'undefined' || !k ? "未分类" : k,
          options: {
            level: 2,
            value: v[0].category__expand && v[0].category__expand._id,
            name: 'category',
            to: categoryValue,
          },
          value: categoryValue,
          unfolded: categoryIsUnfolded
        })
      })
      output = lodash.sortBy(output, [function (o) {
        return lodash.findIndex(categories, (e) => {
          return e._id == o.options.value;
        });
      }]);
    }
  } catch (error) {
    console.log(error)
  }
  return {
    schema: output,
    hasFlowsPer: hasFlowsPer,
    monitorIsUnfolded: monitorIsUnfolded
  };
}

router.get('/api/:appId/workflow/nav', core.requireAuthentication, async function (req, res) {
  try {
    let currentUrl = decodeURIComponent(req.headers.referer);
    currentUrl = currentUrl.substring(currentUrl.indexOf("/app"));
    let userSession = req.user;
    const { appId } = req.params;
    // const s1 = new Date().getTime();
    let inboxResult = await getCategoriesInbox(userSession, req, currentUrl);
    // console.log(`inboxResult time`, new Date().getTime() - s1);
    // const s2 = new Date().getTime();
    let monitorResult = await getCategoriesMonitor(userSession, req, currentUrl)
    // console.log(`monitorResult time`, new Date().getTime() - s2);
    // const s3 = new Date().getTime();
    let draftCount = await getDraftCount(userSession,req);
    // console.log(`getDraftCount time`, new Date().getTime() - s3);
    
    var options = [
      {
        "label": t('inbox', {}, userSession.language),
        "icon": "fa fa-download",
        "tag":inboxResult.count,
        "options":{
          "level":1,
          "to": `/app/${appId}/instance_tasks/grid/inbox?additionalFilters=&flowId=&categoryId=`
        },
        "value": `/app/${appId}/instance_tasks/grid/inbox?additionalFilters=&flowId=&categoryId=`,
        "children": inboxResult.schema
      },
      {
        "label": t('outbox', {}, userSession.language),
        "options":{
          "level":1,
          "to": `/app/${appId}/instance_tasks/grid/outbox?additionalFilters=&flowId=&categoryId=`
        },
        "value": `/app/${appId}/instance_tasks/grid/outbox?additionalFilters=&flowId=&categoryId=`,
        "icon": "fa fa-check"
      },
      {
        "label": t('monitor', {}, userSession.language),
        "icon": "fa fa-eye",
        "options":{
          "level":1,
          "to": `/app/${appId}/instances/grid/monitor?additionalFilters=&flowId=&categoryId=`,
        },
        "value": `/app/${appId}/instances/grid/monitor?additionalFilters=&flowId=&categoryId=`,
        "children": monitorResult.schema,
        "unfolded": monitorResult.monitorIsUnfolded,
        "visible": monitorResult.hasFlowsPer
      },
      {
        "label": t('myfile', {}, userSession.language),
        "options":{
          "level":1,
          // "to": `/app/${appId}/instance_tasks/grid/inbox`
        },
        "unfolded": true,
        "children": [
          {
            "label": t('draft', {}, userSession.language),
            "options":{
              "level":1,
              "to": `/app/${appId}/instances/grid/draft?additionalFilters=&flowId=&categoryId=`
            },
            "value": `/app/${appId}/instances/grid/draft?additionalFilters=&flowId=&categoryId=`,
            "icon": "fa fa-pencil",
            "tag": draftCount
          },
          {
            "label": t('pending', {}, userSession.language),
            "options":{
              "level":1,
              "to": `/app/${appId}/instances/grid/pending?additionalFilters=&flowId=&categoryId=`,
            },
            "value": `/app/${appId}/instances/grid/pending?additionalFilters=&flowId=&categoryId=`,
            "icon": "fa fa-circle"
          },
          {
            "label": t('completed', {}, userSession.language),
            "options":{
              "level":1,
              "to": `/app/${appId}/instances/grid/completed?additionalFilters=&flowId=&categoryId=`,
            },
            "value": `/app/${appId}/instances/grid/completed?additionalFilters=&flowId=&categoryId=`,
            "icon": "fa fa-check-square"
          }
        ]
      }
    ];
    res.status(200).send({
      data: {
        options:options
      },
      msg: "",
      status: 0
    });
  } catch (e) {
    console.log(`e`, e)
    res.status(200).send({
      errors: [{ errorMessage: e.message }]
    });
  }
});
exports.default = router;
