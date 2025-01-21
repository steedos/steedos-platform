/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-09-15 13:09:51
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2022-09-21 11:37:30
 * @Description: 
 */
const express = require("express");
const router = express.Router();
const auth = require('@steedos/auth');
const _ = require('lodash');
const Fiber = require("fibers");
const objectql = require('@steedos/objectql');

router.post('/api/workflow/v2/instance/save', auth.requireAuthentication, async function (req, res) {
    try {
        let userSession = req.user;
        const { instance } = req.body;
        const record = await objectql.getObject('instances').findOne(instance._id, {fields:[
            'flow','form','applicant_name','applicant_organization','applicant_organization_fullname','applicant_organization_name',
            'code', 'flow_version', 'form_version', 'submit_date'
        ]});
        Fiber(async function () {
            try {
                const ins = uuflowManager.draft_save_instance(Object.assign(record, instance), userSession.userId);
                res.status(200).send({
                    'instance': ins
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