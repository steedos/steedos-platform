/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-09-15 13:09:51
 * @LastEditors: liaodaxue
 * @LastEditTime: 2023-12-26 17:40:35
 * @Description: 
 */
const express = require("express");
const router = express.Router();
const auth = require('@steedos/auth');
const _ = require('lodash');
const Fiber = require("fibers");

router.post('/api/workflow/v2/draft', auth.requireAuthentication, async function (req, res) {
    try {
        let userSession = req.user;
        const { instance = {} } = req.body;
        if(!instance.space){
            instance.space = userSession.spaceId;
        }
        Fiber(async function () {
            try {

                let new_ins_id = uuflowManager.create_instance(instance, Object.assign({}, userSession, {_id: userSession.userId}));
                let new_ins = db.instances.findOne({
                    _id: new_ins_id
                }, {
                fields: {
                    space: 1,
                    flow: 1,
                    flow_version: 1,
                    form: 1,
                    form_version: 1
                }
                });
                res.status(200).send({
                    'instance': new_ins
                });
            } catch (error) {
                console.error(error);
                res.status(200).send({
                    error: error.message
                });
            }

        }).run()
    
    } catch (error) {
        console.error(error);
        res.status(200).send({
            error: error.message
        });
    }
});
exports.default = router;