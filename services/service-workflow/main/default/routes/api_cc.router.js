/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-09-15 13:09:51
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2025-01-21 17:29:55
 * @Description: 
 */
const express = require("express");
const router = express.Router();
const auth = require('@steedos/auth');
const objectql = require('@steedos/objectql')
const _ = require('lodash');
const Fiber = require("fibers");

router.post('/api/workflow/v2/cc_do', auth.requireAuthentication, async function (req, res) {
    try {
        let userSession = req.user;
        const { instanceId, traceId, approveId, usersId, description } = req.body;
        const approve = await objectql.getSteedosSchema().broker.call('instance.getApprove', {instanceId, traceId, approveId})
        Fiber(async function () {
            try {
                Meteor.call('cc_do', approve, usersId, description, {userId: userSession.userId}, (error, result)=>{
                    if(error){
                        res.status(200).send({
                            error: error.message
                        });
                    }else{
                        res.status(200).send(result); 
                    }
                })
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