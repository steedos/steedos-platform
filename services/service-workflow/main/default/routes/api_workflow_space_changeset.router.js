/*
 * @Author: sunhaolin@hotoa.com
 * @Date: 2022-12-24 14:56:47
 * @LastEditors: sunhaolin@hotoa.com
 * @LastEditTime: 2022-12-24 15:00:05
 * @Description: 
 */
'use strict';
// @ts-check
const express = require('express');
const router = express.Router();
const auth = require('@steedos/auth');
const _ = require('underscore');
const Fiber = require('fibers');
/**
@api {get} /uf/space/changeset 废弃？？
@apiVersion 0.0.0
@apiName /uf/space/changeset
@apiGroup service-workflow
@apiQuery {String} auth_token auth_token
@apiQuery {String} sync_token sync_token
@apiQuery {String[]} formids formids
@apiQuery {Boolean} is_admin is_admin
@apiSuccessExample {json} Success-Response:
    HTTP/1.1 200 OK
    {
        'Spaces': [],
        ...
    }
@apiErrorExample {json} Error-Response:
    HTTP/1.1 200 OK
    {
      errors: [{ errorMessage: e.message }]
    }
 */
router.get('/uf/space/changeset', auth.requireAuthentication, async function (req, res) {
    try {
        let userSession = req.user;
        const spaceId = userSession.spaceId;
        const userId = userSession.userId;
        const isSpaceAdmin = userSession.is_space_admin;
        Fiber(async function () {
            try {
                var auth_token, data, e, formids, is_admin, query, sync_token;
                query = req.query;
                auth_token = db.auth_tokens.findOne({
                    auth_token: query.auth_token
                });
                if ((!auth_token) || (!auth_token.enabled)) {
                    throw new Meteor.Error(401, 'Unauthorized');
                }
                sync_token = query["sync_token"];
                formids = query["formids"];
                is_admin = query["is_admin"];
                data = uuflowManager.get_SpaceChangeSet(formids, is_admin, sync_token);

                res.status(200).send(data);
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
