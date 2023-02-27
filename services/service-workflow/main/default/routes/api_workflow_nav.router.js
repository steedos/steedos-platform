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
        'nav': [],
    }
@apiErrorExample {json} Error-Response:
    HTTP/1.1 200 OK
    {
      errors: [{ errorMessage: e.message }]
    }
 */
router.get('/api/workflow/nav', core.requireAuthentication, async function (req, res) {
    try {
        var nav = [
            {
              "label": "待审核",
              "to": "/app/oa/instance_tasks/grid/inbox",
              "icon": "fa fa-user"
            },
            {
              "label": "已审核",
              "to": "/app/oa/instance_tasks/grid/outbox",
              "icon": "fa fa-user"
            },
            {
              "label": "监控箱",
              "to": "/app/oa/instances/grid/monitor",
              "icon": "fa fa-user"
            },
            {
              "label": "我的文件",
              "unfolded": true,
              "children": [
                {
                  "label": "草稿",
                  "to": "/app/oa/instances/grid/draft"
                },
                {
                  "label": "进行中",
                  "to": "/app/oa/instances/grid/pending"
                },
                {
                  "label": "已完成",
                  "to": "/app/oa/instances/grid/completed"
                }
                ]
            }
        ];
        res.status(200).send({
            nav: nav
        });
    } catch (e) {
        res.status(200).send({
            errors: [{ errorMessage: e.message }]
        });
    }
});
exports.default = router;
