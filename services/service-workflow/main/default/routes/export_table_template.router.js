/*
 * @Author: sunhaolin@hotoa.com
 * @Date: 2022-12-24 15:14:56
 * @LastEditors: sunhaolin@hotoa.com
 * @LastEditTime: 2022-12-26 12:04:19
 * @Description: 
 */
'use strict';
// @ts-check
const express = require('express');
const router = express.Router();
const auth = require('@steedos/auth');
const _ = require('underscore');
const Fiber = require('fibers');
const Cookies = require("cookies");
/**
@api {get} /api/workflow/export/talbe_template 接口说明
@apiVersion 0.0.0
@apiName /api/workflow/export/talbe_template
@apiGroup service-workflow
@apiBody {String} X-User-Id X-User-Id
@apiBody {String} X-Auth-Token X-Auth-Token
@apiQuery {String} flow 流程ID
@apiSuccessExample {html} Success-Response:
    HTTP/1.1 200 OK
@apiErrorExample {json} Error-Response:
    HTTP/1.1 200 OK
    {
      errors: [{ errorMessage: e.message }]
    }
 */
router.get('/api/workflow/export/talbe_template', auth.requireAuthentication, async function (req, res) {
    try {
        let userSession = req.user;
        const spaceId = userSession.spaceId;
        const userId = userSession.userId;
        const isSpaceAdmin = userSession.is_space_admin;
        Fiber(async function () {
            try {
                var authToken, cookies, data, fileName, flow, flowId, form, ref, ref1, space, userId;
                cookies = new Cookies(req, res);
                if (req.body) {
                    userId = req.body["X-User-Id"];
                    authToken = req.body["X-Auth-Token"];
                }
                if (!userId || !authToken) {
                    userId = cookies.get("X-User-Id");
                    authToken = cookies.get("X-Auth-Token");
                }
                if (!(userId && authToken)) {
                    res.writeHead(401);
                    res.end(JSON.stringify({
                        "error": "Validate Request -- Missing X-Auth-Token",
                        "success": false
                    }));
                    return;
                }
                flowId = (ref = req.query) != null ? ref.flow : void 0;
                flow = db.flows.findOne({
                    _id: flowId
                }, {
                    fields: {
                        space: 1,
                        form: 1,
                        name: 1
                    }
                });
                form = db.forms.findOne({
                    _id: flow.form
                }, {
                    fields: {
                        space: 1,
                        "current._id": 1
                    }
                });
                if (_.isEmpty(flow)) {
                    res.writeHead(401);
                    res.end(JSON.stringify({
                        "error": "Validate Request -- Invalid formId",
                        "success": false
                    }));
                    return;
                } else {
                    if (!Steedos.isSpaceAdmin(flow.space, userId)) {
                        res.writeHead(401);
                        res.end(JSON.stringify({
                            "error": "Validate Request -- No permission",
                            "success": false
                        }));
                        return;
                    }
                    space = db.spaces.findOne(flow.space, {
                        fields: {
                            is_paid: 1
                        }
                    });
                    if (!space) {
                        return res.status(404).send({
                            "error": "Validate Request -- No permission",
                            "success": false
                        });
                    }
                }
                data = TemplateManager.handleTableTemplate({
                    form: flow.form,
                    form_version: form != null ? (ref1 = form.current) != null ? ref1._id : void 0 : void 0
                }, true);
                fileName = flow.name;
                res.setHeader('Content-type', 'application/x-msdownload');
                res.setHeader('Content-Disposition', 'attachment;filename=' + encodeURI(fileName) + '.html');
                return res.end(data);
            } catch (e) {
                console.error(e);
                res.status(200).send({
                    errors: [{ errorMessage: e.message }]
                });
            }
        }).run()
    } catch (e) {
        res.status(200).send({
            errors: [{ errorMessage: e.message }]
        });
    }
});
exports.default = router;
