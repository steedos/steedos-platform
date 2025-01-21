/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-11-17 16:29:16
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2022-11-29 11:55:45
 * @Description: 
 */
import { requireAuthentication } from '@steedos/auth';
import { deleteFolderRecursive } from '@steedos/metadata-core'
import { getInstallingFile, getInstallingInfo, saveImportedPackage } from './util';
import { jsonToDb } from '../metadata/deploy/jsonToDb';
import { DbManager } from '../util/dbManager'
import { loadFileToJson } from '../metadata/deploy/fileToJson';
const fs = require('fs');
const os = require('os');
const path = require("path");
const express = require("express");
const router = express.Router();

const installingPackage = async function(dataBuffer, userSession){
    var dbManager = new DbManager(userSession);
    try {
        var tempDFolder = path.join(os.tmpdir(), "steedos-dx");
        if(fs.existsSync( tempDFolder )){
            fs.mkdirSync(tempDFolder);
        }
        var tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "steedos-dx", 'install-'));
        var zipDir = path.join(tempDir, 'deploy.zip');
        fs.writeFileSync(zipDir, dataBuffer);
        await dbManager.connect();
        var session = await dbManager.startSession();
        let SteedosPackage = await loadFileToJson(tempDir);
        // console.log('SteedosPackage',SteedosPackage);
        await jsonToDb(SteedosPackage, dbManager, session);
    } catch (error) {
        throw error;   
    }finally{
        deleteFolderRecursive(tempDir);
        await dbManager.endSession();
        await dbManager.close();
    }
}

const installingFile = async function (req, res) {
    try {
        const userSession = req.user;
        const isSpaceAdmin = userSession.is_space_admin;
        let urlParams = req.params;
        let packageVersionId = urlParams.packageVersionId;
        const spaceId = userSession.spaceId;
        const body = req.body;
        const password = body.password;
        if (!isSpaceAdmin) {
            return res.status(401).send({ status: 'error', message: 'Permission denied' });
        }
        const packageVersionInfo = await getInstallingInfo(packageVersionId, password, userSession);
        const packageVersionFileBuffer = await getInstallingFile(packageVersionId, password, userSession);
        await installingPackage(packageVersionFileBuffer, userSession);
        const ipackage = await saveImportedPackage(packageVersionInfo.data, userSession);
        return res.status(200).send(ipackage);
    } catch (error) {
        console.error(error)
        return res.status(500).send({error: error.message});
    }
}

router.post('/api/package/installing_from_store/file/:packageVersionId', requireAuthentication, installingFile);

exports.default = router;