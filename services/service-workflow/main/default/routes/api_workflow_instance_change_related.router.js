/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-09-15 13:09:51
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2022-09-23 11:45:42
 * @Description: 
 */
const express = require("express");
const router = express.Router();
const auth = require('@steedos/auth');
const _ = require('lodash');
const Fiber = require("fibers");
const objectql = require('@steedos/objectql');

router.post('/api/workflow/v2/instance/change/related', auth.requireAuthentication, async function (req, res) {
    try {
        let userSession = req.user;
        const { userId } = userSession;
        const { id, related_instances } = req.body;
        const count = await objectql.getObject('instances').count({filters: [
            ['_id', '=', id],
            [
                ['submitter', '=', userId],
                'or',
                ['applicant', '=', userId],
                'or',
                ['inbox_users', '=', userId],
                'or',
                ['cc_users', '=', userId]
            ]
        ]})
        if(count > 0){
            const record = await objectql.getObject('instances').update(id, {
                related_instances: related_instances,
                modified: new Date(),
                modified_by: userId
            })
            return res.status(200).send({
                'instance': record
            });
        }
        
        res.status(500).send({
            error: 'No permission'
        }); 
    
    } catch (error) {
        console.error(error);
        res.status(500).send({
            error: error.message
        });
    }
});
exports.default = router;