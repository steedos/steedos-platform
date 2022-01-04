const express = require("express");
const router = express.Router();
const fs = require('fs');
const os = require('os');
const path = require("path");
const Fiber = require('fibers');

import { requireAuthentication } from '@steedos/core';
import { deleteFolderRecursive } from '@steedos/metadata-core';
import { deployMetadata } from './';

const uploadMetadata = async function (req, res) {

    const userSession = req.user;
    const isSpaceAdmin = req.user.is_space_admin;

    if(!isSpaceAdmin){
        return res.status(401).send({ status: 'error', message: 'Permission denied' });
    }

    // if(!Steedos.hasFeature('metadata_api', spaceId)){
    //     return res.status(403).send({ status: 'error', message: 'Please upgrade the platform license to Enterprise Edition' });
    // }

    const dataBuffer = Buffer.from(req.body.file, 'base64');

    //console.log(dataBuffer);

    var tempDFolder = path.join(os.tmpdir(), "steedos-dx");

    if(!fs.existsSync(tempDFolder)){
        fs.mkdirSync(tempDFolder);
    } 

    var tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "steedos-dx", 'upload-'));

    var zipDir = path.join(tempDir, 'deploy.zip');

    // console.log(tempDir);
    fs.writeFileSync(zipDir, dataBuffer);
    var resMsg = {
        status: '', 
        msg: '',
    };

    try {
        await deployMetadata(tempDir, userSession);
    } catch (err) {
        resMsg.status = "500";
        resMsg.msg = err.message;
    } 

    deleteFolderRecursive(tempDir);
    return res.status(resMsg.status).send(resMsg.msg);
};

router.post('/api/metadata/deploy', requireAuthentication, function (req, res) {
    return Fiber(function(){
        return uploadMetadata(req, res);
    }).run();;
});
exports.default = router;