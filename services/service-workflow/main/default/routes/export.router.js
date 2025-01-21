/*
 * @Author: sunhaolin@hotoa.com
 * @Date: 2022-12-26 11:26:25
 * @LastEditors: sunhaolin@hotoa.com
 * @LastEditTime: 2022-12-26 12:04:02
 * @Description: 
 */
'use strict';
// @ts-check
const express = require('express');
const router = express.Router();
const auth = require('@steedos/auth');
const _ = require('underscore');
const Fiber = require('fibers');

const JSZip = require("jszip");

const exportByFlowIds = function (flowIds, res) {
    var fileNames, flows, zip;
    flows = db.flows.find({
        _id: {
            $in: flowIds
        }
    }, {
        fields: {
            form: 1
        }
    }).fetch();
    zip = new JSZip();
    fileNames = {};
    _.each(flows, function (flow) {
        var data, fileName;
        data = steedosExport.form(flow.form);
        if (_.isEmpty(data)) {
            fileName = 'null';
        } else {
            fileName = data.name;
        }
        if (fileNames[fileName] > 0) {
            fileName = `${fileName} (${fileNames[fileName]})`;
            fileNames[fileName] = fileNames[fileName] + 1;
        } else {
            fileNames[fileName] = 1;
        }
        return zip.file(`${fileName}.json`, new Buffer(JSON.stringify(data), 'utf-8'));
    });
    res.setHeader('Content-type', 'application/octet-stream');
    res.setHeader('Content-Disposition', 'attachment;filename=' + encodeURI('导出的流程文件') + '.zip');
    return zip.generateNodeStream().pipe(res).on('finish', function () {
        return console.log("text file written.");
    });
};


/**
@api {get} /api/workflow/export/form 流程导出
@apiVersion 0.0.0
@apiName /api/workflow/export/form
@apiGroup service-workflow
@apiQuery {String} [flows] 流程ID，多个逗号隔开
@apiQuery {String} [form] 表单ID
@apiSuccessExample {.json} Success-Response:
    HTTP/1.1 200 OK
@apiErrorExample {json} Error-Response:
    HTTP/1.1 200 OK
    {
      errors: [{ errorMessage: e.message }]
    }
 */
router.get('/api/workflow/export/form', auth.requireAuthentication, async function (req, res) {
    try {
        Fiber(async function () {
            try {
                var data, fileName, flowIds, form, formId, ref, ref1, space;
                flowIds = (ref = req.query) != null ? ref.flows : void 0;
                if (flowIds) {
                    return exportByFlowIds(flowIds.split(','), res);
                }
                formId = (ref1 = req.query) != null ? ref1.form : void 0;
                form = db.forms.findOne({
                    _id: formId
                }, {
                    fields: {
                        space: 1
                    }
                });
                if (_.isEmpty(form)) {
                    res.writeHead(401);
                    res.end(JSON.stringify({
                        "error": "Validate Request -- Invalid formId",
                        "success": false
                    }));
                    return;
                } else {
                    //			if !Steedos.isSpaceAdmin(form.space, userId)
                    //				res.writeHead(401);
                    //				res.end JSON.stringify({
                    //					"error": "Validate Request -- No permission",
                    //					"success": false
                    //				})
                    //				return;
                    space = db.spaces.findOne(form.space, {
                        fields: {
                            _id: 1
                        }
                    });
                    if (!space) {
                        return res.status(404).send({
                            "error": "Validate Request -- No permission",
                            "success": false
                        });
                    }
                }
                try {
                    data = steedosExport.form(formId);
                    if (_.isEmpty(data)) {
                        fileName = 'null';
                    } else {
                        fileName = data.name;
                    }
                    res.setHeader('Content-type', 'application/x-msdownload');
                    res.setHeader('Content-Disposition', 'attachment;filename=' + encodeURI(fileName) + '.json');
                    return res.end(JSON.stringify(data));
                } catch (e) {
                    res.status(200).send({
                        "error": e.message,
                        "success": false
                    });
                }
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
