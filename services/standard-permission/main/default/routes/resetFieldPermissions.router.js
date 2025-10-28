/*
 * @Author: 殷亮辉 yinlianghui@hotoa.com
 * @Date: 2025-10-27 22:42:00
 * @LastEditors: 殷亮辉 yinlianghui@hotoa.com
 * @LastEditTime: 2025-10-28 10:14:50
 */
'use strict';

const express = require("express");
const router = express.Router();
const auth = require('@steedos/auth');
const objectql = require('@steedos/objectql');
const _ = require('underscore');

router.post('/api/permission/permission_objects/resetFieldPermissions', auth.requireAuthentication, async function (req, res) {
    try {
        const { params, user: userSession } = req;
        // const recordId = params.permissionObjectId;
        const { permissionObjectId: recordId } = req.body;
        await objectql.getSteedosSchema().broker.call(`permission_fields.resetFieldPermissions`, {
            permissionObjectId: recordId
        }, {
            meta: {
                user: userSession
            }
        });
        res.status(200).send({success: true});
    } catch (error) {
        console.error(error);
        res.status(400).send({
            error: error.message
        });
    }
});
exports.default = router;