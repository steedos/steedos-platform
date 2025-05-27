/*
 * @Author: 殷亮辉 yinlianghui@hotoa.com
 * @Date: 2025-05-27 14:51:49
 * @LastEditors: 殷亮辉 yinlianghui@hotoa.com
 * @LastEditTime: 2025-05-27 15:48:42
 */
const { requireAuthentication } = require("@steedos/auth");
const { getSteedosSchema, getObject } = require("@steedos/objectql");
const express = require("express");
const router = express.Router();
const _ = require("lodash");

const util = {
    /**
     * Returns the object record Relative url
     */
    getObjectRecordRelativeUrl: (objectName, recordId, spaceId = null, options = {}) => {
        let appId = '-';
        if (options.appId) {
            appId = options.appId;
        }
        let url = `/app/${appId}/${objectName}/view/${recordId}`;
        if (objectName === "instances") {
            url = `/workflow/space/${spaceId}/inbox/${recordId}`;
        }
        return url;
    }
}

router.get(
    "/api/v4/notifications/:_id/read",
    requireAuthentication,
    async function (req, res) {
        let { _id: record_id } = req.params;
        let { rootUrl, appId } = req.query;
        const userSession = req.user;
        let req_async = _.has(req.query, 'async');
        if (userSession.userId) {
            let record = await getSteedosSchema().getObject("notifications").findOne(record_id, { fields: ['owner', 'is_read', 'related_to', 'space', 'url'] });
            if (!record) {
                // 跳转到通知记录界面会显示为404效果
                let redirectUrl = util.getObjectRecordRelativeUrl("notifications", record_id);
                if (req.get("X-Requested-With") === 'XMLHttpRequest') {
                    return res.status(200).send({
                        "status": 404,
                        "redirect": redirectUrl
                    });
                } else {
                    return res.redirect(redirectUrl);
                }
            }
            if (!record.related_to && !record.url) {
                return res.status(401).send({
                    "error": "Validate Request -- Missing related_to or url",
                    "success": false
                });
            }
            if (!record.is_read && record.owner === userSession.userId) {
                // 没有权限时，只是不修改is_read值，但是允许跳转到相关记录查看
                await getSteedosSchema().getObject('notifications').update(record_id, { 'is_read': true, modified: new Date() })
            }
            let redirectUrl = record.url ? record.url : util.getObjectRecordRelativeUrl(record.related_to.o, record.related_to.ids[0], record.space, {
                rootUrl, appId
            });
            if (req_async) { // || req.get("X-Requested-With") === 'XMLHttpRequest'
                return res.status(200).send({
                    "status": 200,
                    "redirect": redirectUrl
                });
            } else {
                return res.redirect(redirectUrl);
            }
        }
        return res.status(401).send({
            "error": "Validate Request -- Missing X-Auth-Token",
            "success": false
        })
    }
);

router.post(
    "/api/v4/notifications/all/markReadAll",
    requireAuthentication,
    async function (req, res) {
        let userSession = req.user;
        let error;
        let updatedCount = await getObject("notifications").directUpdateMany([
            ["space", "=", userSession.spaceId],
            ["owner", "=", userSession.userId],
            [["is_read", "=", null], 'or', ["is_read", "=", false]]
        ], {
            is_read: true
        }).catch((ex) => {
            console.error(ex);
            error = ex;
            return 0;
        });
        if (error) {
            res.status(500).send({
                "error": error,
                "success": false
            });
        }
        else {
            return res.send({
                markedCount: updatedCount,
                "success": true
            });
        }
    }
);

exports.default = router;
