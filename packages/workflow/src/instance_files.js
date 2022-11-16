const express = require('express');
const SteedosRouter = require('@steedos/router');
const router = SteedosRouter.staticRouter();
const steedosAuth = require('@steedos/auth');
const objectql = require("@steedos/objectql");
const steedosSchema = objectql.getSteedosSchema();

const workflowManager = require('./workflowManager')

router.use('/instances/:id/files', async function auth(req, res, next) {
    const user = await steedosAuth.auth(req, res)
    if(!user.userId){
        res.status(401).send({
            status: 'error',
            message: 'You must be logged in to do this.'
        });
        return;
    }
    const insId = req.params.id
    const instance = await steedosSchema.getObject("instances").findOne(insId)
    if(!instance){
        res.status(401).send({
            status: 'error',
            message: `not find instance by id ${insId}.`
        });
        return;
    }

    if(!(await workflowManager.hasInstancePermissions({_id: user.userId}, instance))){
        res.status(401).send({
            status: 'error',
            message: `no permission.`
        });
        return;
    }
    
    let filters = [["metadata.instance", '=', insId]]
    if(!('history' in req.query)){
        filters.push(["metadata.current", '=', true]);
    }
    const cfsInsFileRecrod = steedosSchema.getObject("cfs_instances_filerecord")
    const insFiles = await cfsInsFileRecrod.find({filters: filters, fields: ['_id', 'original', 'metadata', 'uploadedAt']})
    res.send({files: insFiles})
})
exports.router = router;