const express = require("express");
const router =require('@steedos/router').staticRouter()
const Fiber = require('fibers');

import { requireAuthentication } from '@steedos/core';
import { DbManager } from '../util/dbManager'
import { insertObjectsToDB } from './index'

declare var Steedos: any;

router.post('/api/composite/sobjects', requireAuthentication, async function (req, res) {

    return Fiber(function(){
        return doPost(req, res);
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

    var allOrNone = req.body.allOrNone === 'true';
    var records = req.body.records

    var dbManager = new DbManager(userSession);   
    try{
        await dbManager.connect();
        var insertResults = await insertObjectsToDB(dbManager, records, allOrNone);
    }catch(err){
        return res.status(500).send({ status: 'error', message: err.message });
    }finally{
        await dbManager.close();
    }
    var hasErrors = false;
    for(var i=0; i<insertResults.length; i++){
        var insertResult = insertResults[i];
        if(insertResult.success == false){
            hasErrors = true;
            break;
        }
    }
    var response = {"hasErrors":hasErrors,"results":insertResults};
    res.status(200).send(JSON.stringify(response));
}

