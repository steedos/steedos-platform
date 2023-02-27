/*
 * @Author: 殷亮辉 yinlianghui@hotoa.com
 * @Date: 2023-02-27 15:51:42
 * @LastEditors: 殷亮辉 yinlianghui@hotoa.com
 * @LastEditTime: 2023-02-27 18:21:25
 * @FilePath: /project-ee/Users/yinlianghui/Documents/GitHub/steedos-platform2-4/services/service-workflow/main/default/routes/api_workflow_nav.router.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
'use strict';
// @ts-check
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
router.get('/api/workflow/nav', core.requireAuthentication, async function (req, res) {
  try {
    var links = [
      {
        "label": "待审核",
        "to": "/app/oa/instance_tasks/grid/inbox",
        "icon": "fa fa-download",
        "badge": "188"
      },
      {
        "label": "已审核",
        "to": "/app/oa/instance_tasks/grid/outbox",
        "icon": "fa fa-check"
      },
      {
        "label": "监控箱",
        "to": "/app/oa/instances/grid/monitor",
        "icon": "fa fa-eye"
      },
      {
        "label": "我的文件",
        "unfolded": true,
        "children": [
          {
            "label": "草稿",
            "to": "/app/oa/instances/grid/draft",
            "icon": "fa fa-pencil"
          },
          {
            "label": "进行中",
            "to": "/app/oa/instances/grid/pending",
            "icon": "fa fa-circle"
          },
          {
            "label": "已完成",
            "to": "/app/oa/instances/grid/completed",
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
