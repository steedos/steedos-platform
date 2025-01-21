/*
 * @Author: sunhaolin@hotoa.com
 * @Date: 2022-12-26 11:32:59
 * @LastEditors: sunhaolin@hotoa.com
 * @LastEditTime: 2022-12-26 14:43:07
 * @Description: 
 */
'use strict';
// @ts-check
const express = require('express');
const router = express.Router();
const auth = require('@steedos/auth');
const _ = require('underscore');
const Fiber = require('fibers');
const formidable = require('formidable');
const fs = require('fs')

const importWorkflow = function (jsonStr, uid, spaceId, company_id, flowId) {
    var e, flow, form, new_flowIds, options;
    try {
        form = JSON.parse(jsonStr);
    } catch (error) {
        e = error;
        throw new Meteor.Error('error', "无效的JSON文件");
    }
    options = {};
    if (flowId) {
        options.flowId = flowId;
        options.upgrade = true;
        flow = db.flows.findOne({
            _id: flowId,
            space: spaceId
        }, {
            fields: {
                form: 1
            }
        });
        if (!flow) {
            throw new Meteor.Error("error", "无效的flowId");
        } else {
            options.formId = flow.form;
        }
    }
    new_flowIds = steedosImport.workflow(uid, spaceId, form, false, company_id, options);
    return {
        new_flows: new_flowIds
    };
};

/**
@api {post} /api/workflow/import/form 流程导入
@apiVersion 0.0.0
@apiName /api/workflow/import/form
@apiGroup service-workflow
@apiQuery {String} space 工作区ID
@apiQuery {String} company_id 分部ID
@apiQuery {String} flowId 流程ID
@apiSuccessExample {json} Success-Response:
    HTTP/1.1 200 OK
    {
        'multiple': 是否导入多个文件,
        'fail': 失败个数,
        'success': 成功个数,
    }
@apiErrorExample {json} Error-Response:
    HTTP/1.1 200 OK
    {
      errors: [{ errorMessage: e.message }]
    }
 */
router.post('/api/workflow/import/form', auth.requireAuthentication, async function (req, res) {
    try {
        Fiber(async function () {
            try {
                var company_id, flow, flowId, msg, ref, ref1, ref2, space, spaceId, uid;
                msg = "";
                spaceId = (ref = req.query) != null ? ref.space : void 0;
                company_id = (ref1 = req.query) != null ? ref1.company_id : void 0;
                flowId = (ref2 = req.query) != null ? ref2.flowId : void 0;
                if (flowId) {
                    flow = db.flows.findOne({
                        _id: flowId,
                        space: spaceId
                    }, {
                        fields: {
                            company_id: 1
                        }
                    });
                    if (flow) {
                        company_id = flow.company_id;
                    }
                }
                space = db.spaces.findOne(spaceId, {
                    fields: {
                        _id: 1
                    }
                });
                if (!space) {
                    return res.status(200).send({
                        "error": "Validate Request -- No permission",
                        "success": false
                    });
                }
                if (!WorkflowCore.checkCreatePermissions(spaceId, uid, company_id)) {
                    res.writeHead(401);
                    res.end(JSON.stringify({
                        "error": "Validate Request -- No permission",
                        "success": false
                    }));
                    return;
                }
                const form = formidable({ multiples: true });
                return form.parse(req, async (err, fields, files) => {
                    Fiber(async function () {
                        var fail, multiple, success;
                        try {
                            fail = {};
                            success = {};
                            multiple = false;
                            if (files.length > 1) {
                                multiple = true;
                            }
                            if (flowId && files.length > 0) {
                                files = [files[0]];
                            }
                            _.each(files, function (file) {
                                var filename, jsonData;
                                filename = file.originalFilename;
                                try {
                                    jsonData = fs.readFileSync(file.filepath, 'utf8');
                                    return success[filename] = importWorkflow(jsonData, uid, spaceId, company_id, flowId);
                                } catch (e) {
                                    console.log(e)
                                    if (e.reason && e.details) {
                                        return fail[filename] = {
                                            reason: e.reason,
                                            details: e.details
                                        };
                                    } else {
                                        return fail[filename] = e.reason || e.message;
                                    }
                                }
                            });
                            if (_.isEmpty(fail)) {
                                res.statusCode = 200;
                            } else {
                                res.statusCode = 500;
                            }
                            return res.end(JSON.stringify({
                                multiple: multiple,
                                fail: fail,
                                success: success
                            }));
                        } catch (error) {
                            console.log(error)
                            msg = "无效的JSON文件";
                            res.statusCode = 500;
                            return res.end(msg);
                        }
                    }).run()
                });

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
