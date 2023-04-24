/*
 * @Author: 殷亮辉 yinlianghui@hotoa.com
 * @Date: 2023-02-27 15:51:42
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2023-04-24 14:52:26
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
  const { userId, is_space_admin} = userSession;
  const filters = await objectql.getSteedosSchema().broker.call("instance.getBoxFilters", {
    box: "inbox", flowId: null, userId, is_space_admin, appId
  })
  const data = await objectql.getObject('instance_tasks').find({
    filters: filters,
    fields: ['_id', 'flow_name', 'category_name']
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
        value:{
          level:3,
          value:k2,
          name: 'flow_name',
          to: `/app/${appId}/instance_tasks/grid/inbox?additionalFilters=['flow_name', '=', '${k2}']`,
        },
      })
    })
    output.push({
      label: k,
      children: flows,
        // to: `/app/${appId}/instance_tasks/grid/inbox?additionalFilters=['category_name', '=', '${k}']`,
      category_name:k,
      tag:v.length,
      value:{
        level:2,
        value:k,
        name: 'category_name',
        to: `/app/${appId}/instance_tasks/grid/inbox?additionalFilters=['category_name', '=', '${k}']`,
      },
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
        "label": "待审核",
        "icon": "fa fa-download",
        "tag":count,
        "value":{
          "level":1,
          "to": `/app/${appId}/instance_tasks/grid/inbox`
        },
        "children":schema
      },
      {
        "label": "已审核",
        "value":{
          "level":1,
          "to": `/app/${appId}/instance_tasks/grid/outbox`
        },
        "icon": "fa fa-check"
      },
      {
        "label": "监控箱",
        "icon": "fa fa-eye",
        "value":{
          "level":1,
          "to": `/app/${appId}/instances/grid/monitor`,
        }
      },
      {
        "label": "我的文件",
        "value":{
          "level":1,
          // "to": `/app/${appId}/instance_tasks/grid/inbox`
        },
        "unfolded": true,
        "children": [
          {
            "label": "草稿",
            "value":{
              "level":1,
              "to": `/app/${appId}/instances/grid/draft`
            },
            "icon": "fa fa-pencil"
          },
          {
            "label": "进行中",
            "value":{
              "level":1,
              "to": `/app/${appId}/instances/grid/pending`,
            },
            "icon": "fa fa-circle"
          },
          {
            "label": "已完成",
            "value":{
              "level":1,
              "to": `/app/${appId}/instances/grid/completed`,
            },
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
