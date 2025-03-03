/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2024-04-17 16:17:02
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2025-03-03 16:28:58
 * @Description:
 */
const { requireAuthentication } = require("@steedos/auth");
const { getObject } = require("@steedos/objectql");
const express = require("express");
const router = express.Router();
const _ = require("lodash");

const OBJECT_NAME = "settings";

router.get(
    "/api/settings/get/:key",
    requireAuthentication,
    async function (req, res) {
        const userSession = req.user;
        const { key } = req.params;
        try {
            const records = await getObject(OBJECT_NAME).find(
                { filters: ["key", "=", key] },
                userSession
            );
            let data = _.get(_.first(records), 'value') || "{}";
            if(_.isString(data)){
                data = JSON.parse(data)
            }
            return res.status(200).send({
                status: 0,
                msg: "",
                data: data,
            });
        } catch (error) {
            return res.status(200).send({
                status: 500,
                msg: error.message,
            });
        }
    }
);

router.post(
    "/api/settings/set/:key",
    requireAuthentication,
    async function (req, res) {
        const userSession = req.user;
        const { key } = req.params;
        const value = req.body;
        try {
            const records = await getObject(OBJECT_NAME).find(
                { filters: ["key", "=", key] },
                userSession
            );
            let data = {}
            if(records.length > 0){
                data = await getObject(OBJECT_NAME).update(records[0]._id, {
                    value: value
                }, userSession)
            }else{
                data = await getObject(OBJECT_NAME).insert({
                    key: key,
                    value: value,
                    is_public: key.startsWith("public_"),
                    space: userSession.spaceId
                }, userSession)
            }
            return res.status(200).send({
                status: 0,
                msg: "",
                data: data,
            });
        } catch (error) {
            return res.status(200).send({
                status: 500,
                msg: error.message,
            });
        }
    }
);

exports.default = router;
