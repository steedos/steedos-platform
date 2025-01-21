/*
 * @Author: 孙浩林 sunhaolin@steedos.com
 * @Date: 2024-01-25 13:23:33
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2025-01-21 17:26:04
 * @FilePath: /steedos-platform-2.3/packages/standard-objects/autonumber.router.js
 * @Description: 
 */
'use strict';
// @ts-check
const express = require('express');
const router = express.Router();
const auth = require('@steedos/auth');
const objectql = require('@steedos/objectql');
const { generateAutonumber } = require('./autonumberTirggerHelper')

/**
* @api {post} /api/autonumber/generator/:objectName/:fieldName 生成自动编号
* @apiVersion 0.0.0
* @apiName /api/autonumber/generator/:objectName/:fieldName
* @apiParam {String} objectName 对象API Name，如：contracts
* @apiParam {String} fieldName 字段API Name，如：autonumber
* @apiGroup autonumber
* @apiBody {Object} doc 记录
* @apiSuccessExample {json} Success-Response:
*     HTTP/1.1 200 OK
*     {
*       "status": 0, // 返回 0，表示当前接口正确返回，否则按错误请求处理
*       "msg": "", // 返回接口处理信息
*       "data": {
*         "autonumber": "xxx",
*       }
*     }
* @apiErrorExample {json} Error-Response:
*     HTTP/1.1 500 Error
*     {
*       "status": -1,
*       "msg": "",
*       "data": {}
*     }
*/
router.post('/api/autonumber/generator/:objectName/:fieldName', auth.requireAuthentication, async function (req, res) {
    try {
        let userSession = req.user;
        const spaceId = userSession.spaceId;
        const { objectName, fieldName } = req.params;
        const { doc } = req.body;
        const obj = objectql.getObject(objectName);
        const fields = await obj.getFields();
        const f = fields[fieldName];
        if (!f) {
            throw new Error('未找到字段，请确认。')
        }
        if ('autonumber' != f.type) {
            throw new Error('字段类型不是自动编号，请确认。')
        }
        const formula = f.formula;

        const autonumber = await generateAutonumber(formula, spaceId, objectName, fieldName, doc || {});
        res.status(200).send({
            "status": 0,
            "msg": "",
            "data": {
                "autonumber": autonumber
            }
        })
    } catch (e) {
        res.status(500).send({
            "status": -1,
            "msg": e.message,
            "data": e
        });
    }
});
exports.default = router;
