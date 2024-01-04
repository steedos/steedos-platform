/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-09-15 13:09:51
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2024-01-04 17:47:43
 * @Description: 
 */
const express = require("express");
const router = express.Router();
const core = require('@steedos/core');
const _ = require('lodash');
const Fiber = require("fibers");

router.post('/api/object/workflow/drafts', core.requireAuthentication, async function (req, res) {
    try {
        let userSession = req.user;
        const { Instances } = req.body;
        const userId = userSession.userId;
        const inserted_instances = [];
        Fiber(function () {
            try {
                _.each(Instances, (instance_from_client)=>{
                    const new_ins_id = uuflowManagerForInitApproval.create_instance(instance_from_client, Object.assign({}, userSession, {_id: userSession.userId}))

                    new_ins = Creator.Collections.instances.findOne({ _id: new_ins_id }, { fields: { space: 1, flow: 1, flow_version: 1, form: 1, form_version: 1 } })

                    inserted_instances.push(new_ins)
                })
                res.status(200).send({
                    inserts: inserted_instances
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