const express = require("express");
const router = express.Router();
const _ = require("underscore");
// const Fiber = require('fibers');
declare var Fiber;

import { requireAuthentication } from '@steedos/auth';
import { DbManager } from '../util/dbManager'

import { getObjectsByIdsAndFields } from './index'

declare var Steedos: any;

router.post('/api/composite/sobjects/:SObjectName', requireAuthentication, async function (req, res) {
    
    return Fiber(function(){
        return doPost(req, res);
    }).run();;
});

router.get('/api/composite/sobjects/:SObjectName', requireAuthentication, async function (req, res) {
    
    return Fiber(function(){
        return doGet(req, res);
    }).run();;
});

exports.default = router;

async function doPost(req, res){
    const userSession = req.user;
    const spaceId = userSession.spaceId;

    const isSpaceAdmin = req.user.is_space_admin;
    if(!isSpaceAdmin){
        return res.status(401).send({ status: 'error', message: 'Permission denied' });
    }

    // if(!Steedos.hasFeature('metadata_api', spaceId)){
    //     return res.status(403).send({ status: 'error', message: 'Please upgrade the platform license to Enterprise Edition' });
    // }

    var SObjectName = req.params.SObjectName
    var ids = req.body.ids
    var fields = req.body.fields
    var recordsCount = req.body.recordsCount
    var showLog = req.body.showLog

    var dbManager = new DbManager(userSession);
    await dbManager.connect();
    
    try{
        if(recordsCount){
            recordsCount = Number(recordsCount) 
        }
        var objects = await getObjectsByIdsAndFields(dbManager, SObjectName, ids, fields, recordsCount, showLog);
    }catch(err){
        return res.status(500).send({ status: 'error', message: err.message });
    }
    
    await dbManager.close();
    res.writeHead(200, {
        "Content-Type": "application/json;charset=utf-8" 
    });
    res.end(JSON.stringify(objects));
}
async function doGet(req, res){
    const userSession = req.user;

    const isSpaceAdmin = req.user.is_space_admin;
    if(!isSpaceAdmin){
        return res.status(401).send({ status: 'error', message: 'Permission denied' });
    }
    
    var SObjectName = req.params.SObjectName
    var ids = req.query.ids
    var fields = req.query.fields

    var dbManager = new DbManager(userSession);
    await dbManager.connect();

    try{
        var idList = ids.split(',');
        if(ids){
            idList = ids.split(",");
        }
        var fieldList = [];
        if(fields){
            fieldList = fields.split(",");
        }
        var objects = await getObjectsByIdsAndFields(dbManager, SObjectName, idList, fieldList);
    }catch(err){
        return res.status(500).send({ status: 'error', message: err.message });
    }
    
    await dbManager.close();
    res.writeHead(200, {
        "Content-Type": "application/json;charset=utf-8" 
    });
    res.end(JSON.stringify(objects));
}
