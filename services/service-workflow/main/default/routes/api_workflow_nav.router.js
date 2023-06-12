/*
 * @Author: 殷亮辉 yinlianghui@hotoa.com
 * @Date: 2023-02-27 15:51:42
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2023-05-12 10:32:01
 * @FilePath: /project-ee/Users/yinlianghui/Documents/GitHub/steedos-platform2-4/services/service-workflow/main/default/routes/api_workflow_nav.router.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
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
 * 1 查询instance_tasks数据
 * 2 结算出分类
 * 3 按要求返回数据结构
 */
const getCategoriesInbox = async (userSession, req) => {
  const { appId } = req.params;
  const { userId, is_space_admin, spaceId } = userSession;
  const filters = await objectql.getSteedosSchema().broker.call("instance.getBoxFilters", {
    box: "inbox", flowId: null, userId, is_space_admin, appId, spaceId
  })
  const data = await objectql.getObject('instance_tasks').find({
    filters: filters,
    fields: ['_id', 'flow', 'category','flow_name','category_name']
  }, userSession)

  const output = [];
  const categoryGroups = lodash.groupBy(data, 'category_name');
  lodash.each(categoryGroups, (v, k)=>{
    let categoryBadge = 0;
    const flowGroups = lodash.groupBy(v, 'flow_name');
    const flows = [];
    lodash.each(flowGroups, (v2, k2)=>{
      categoryBadge += v2.length
      flows.push({
        label: k2,
        // to: `/app/${appId}/instance_tasks/grid/inbox?additionalFilters=['flow_name', '=', '${k2}']`,
        flow_name: k2,
        tag:v2.length,
        options:{
          level:3,
          value: v2[0].flow,
          name: 'flow',
          to: `/app/${appId}/instance_tasks/grid/inbox?additionalFilters=['flow', '=', '${v2[0].flow}']`,
        },
        value: `/app/${appId}/instance_tasks/grid/inbox?additionalFilters=['flow', '=', '${v2[0].flow}']`
      })
    })
    output.push({
      label: k,
      children: flows,
      // to: `/app/${appId}/instance_tasks/grid/inbox?additionalFilters=['category_name', '=', '${k}']`,
      category_name: k,
      tag: v.length,
      options: {
        level: 2,
        value: v[0].category,
        name: 'category',
        to: `/app/${appId}/instance_tasks/grid/inbox?additionalFilters=['category', '=', '${v[0].category}']`,
      },
      value: `/app/${appId}/instance_tasks/grid/inbox?additionalFilters=['category', '=', '${v[0].category}']`
    })
  })
  return {
    schema: output,
    count: data.length,
  }
}

router.get('/api/:appId/workflow/nav', core.requireAuthentication, async function (req, res) {
  try {

    let userSession = req.user;
    const { appId } = req.params;
    let {schema, count} = await getCategoriesInbox(userSession,req)
    var options = [
      {
        "label": t('inbox', {}, userSession.language),
        "icon": "fa fa-download",
        "tag":count,
        "options":{
          "level":1,
          "to": `/app/${appId}/instance_tasks/grid/inbox`
        },
        "value": `/app/${appId}/instance_tasks/grid/inbox`,
        "children":schema
      },
      {
        "label": t('outbox', {}, userSession.language),
        "options":{
          "level":1,
          "to": `/app/${appId}/instance_tasks/grid/outbox`
        },
        "value": `/app/${appId}/instance_tasks/grid/outbox`,
        "icon": "fa fa-check"
      },
      {
        "label": t('monitor', {}, userSession.language),
        "icon": "fa fa-eye",
        "options":{
          "level":1,
          "to": `/app/${appId}/instances/grid/monitor`,
        },
        "value": `/app/${appId}/instances/grid/monitor`
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
              "to": `/app/${appId}/instances/grid/draft`
            },
            "value": `/app/${appId}/instances/grid/draft`,
            "icon": "fa fa-pencil"
          },
          {
            "label": t('pending', {}, userSession.language),
            "options":{
              "level":1,
              "to": `/app/${appId}/instances/grid/pending`,
            },
            "value": `/app/${appId}/instances/grid/pending`,
            "icon": "fa fa-circle"
          },
          {
            "label": t('completed', {}, userSession.language),
            "options":{
              "level":1,
              "to": `/app/${appId}/instances/grid/completed`,
            },
            "value": `/app/${appId}/instances/grid/completed`,
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
