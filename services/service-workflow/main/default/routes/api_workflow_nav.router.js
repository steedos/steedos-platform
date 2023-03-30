/*
 * @Author: 殷亮辉 yinlianghui@hotoa.com
 * @Date: 2023-02-27 15:51:42
 * @LastEditors: 殷亮辉 yinlianghui@hotoa.com
 * @LastEditTime: 2023-03-13 11:39:25
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


router.get('/api/:appId/workflow/nav', core.requireAuthentication, async function (req, res) {
  try {
    let userSession = req.user;
    const { appId } = req.params;
    const spaceId = userSession.spaceId;
    const userId = userSession.userId;
    let query = {
      filters: [['user', '=', userId], ['space', '=', spaceId], ['key', '=', 'badge']]
    };
    const steedosKeyValues = await objectql.getObject('steedos_keyvalues').find(query);
    let sum = steedosKeyValues && steedosKeyValues[0] && steedosKeyValues[0].value && steedosKeyValues[0].value.workflow;
    var links = [
      {
        "label": "待审核",
        "to": `/app/${appId}/instance_tasks/grid/inbox`,
        "icon": "fa fa-download",
        "badge": sum
      },
      {
        "label": "已审核",
        "to": `/app/${appId}/instance_tasks/grid/outbox`,
        "icon": "fa fa-check"
      },
      {
        "label": "监控箱",
        "to": `/app/${appId}/instances/grid/monitor`,
        "icon": "fa fa-eye"
      },
      {
        "label": "我的文件",
        "unfolded": true,
        "children": [
          {
            "label": "草稿",
            "to": `/app/${appId}/instances/grid/draft`,
            "icon": "fa fa-pencil"
          },
          {
            "label": "进行中",
            "to": `/app/${appId}/instances/grid/pending`,
            "icon": "fa fa-circle"
          },
          {
            "label": "已完成",
            "to": `/app/${appId}/instances/grid/completed`,
            "icon": "fa fa-check-square"
          }
        ]
      }
    ];
    res.status(200).send({
      data: {
        links: links
      },
      msg: "",
      status: 0
    });
  } catch (e) {
    res.status(200).send({
      errors: [{ errorMessage: e.message }]
    });
  }
});
exports.default = router;
