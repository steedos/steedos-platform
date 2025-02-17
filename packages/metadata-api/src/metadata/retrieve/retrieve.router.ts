/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2023-03-07 15:58:28
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2025-02-17 18:02:46
 * @Description: 
 */
const express = require("express");
const router = express.Router();
const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');

const chalk = require("chalk");

import { requireAuthentication } from '@steedos/auth';

import { getSteedosPackage } from './dbToJson';

import { jsonToFile, mkTempFolder, compressFiles, deleteFolderRecursive, mkdirsSync } from '@steedos/metadata-core'

import { DbManager } from '../../util/dbManager';

declare var Steedos: any;

const downloadMetadata = async function (req, res) {
    try{
        const userSession = req.user;
        const isSpaceAdmin = req.user.is_space_admin;
        const spaceId = userSession.spaceId;
        // const userId = userSession.userId;

        if(!isSpaceAdmin){
            return res.status(401).send({ status: 'error', message: 'Permission denied' });
        }

        // if(!Steedos.hasFeature('metadata_api', spaceId)){
        //     return res.status(403).send({ status: 'error', message: 'Please upgrade the platform license to Enterprise Edition' });
        // }
        //兼容旧版steedos cli retrieve
        const yml_base64 = req.query.yml || req.body.yml  // 这里给一个steedos_package.yml格式文件的base64

        const yml = yaml.safeLoad(Buffer.from(Buffer.from(yml_base64, 'base64').toString('utf8'), 'utf8'));

        // console.log(yml);
        var dbManager = new DbManager(userSession);
        await dbManager.connect();
        var steedosPackage = {}
        var dbJson = await getSteedosPackage(yml, steedosPackage, dbManager);
        await dbManager.close();
        // console.log('dbJson', dbJson);
        var tempDir = mkTempFolder('download-')

        const deployDir = path.join(tempDir, 'deploy');
        const fileDir = path.join(deployDir, 'main', 'default');
        mkdirsSync(fileDir);

        await jsonToFile(fileDir, dbJson);
        var option = {includeJs: true, tableTitle: 'Steedos', showLog: false};
        compressFiles(deployDir, deployDir, tempDir, option, function(zipBuffer){
            try{
                deleteFolderRecursive(tempDir);
                // console.log(tempDir);
                res.writeHead(200, {
                    'Content-Type': 'text/plain'
                });        
                res.end(zipBuffer.toString());
            }catch(err){
                console.error(err);
                res.status(500).send({ status: 'error', message: err.message });
            }
        });
    }catch(err){
        console.error(err);
        return res.status(500).send({ status: 'error', message: err.message });
    }
}

router.get('/api/metadata/retrieve', requireAuthentication, downloadMetadata);



exports.default = router;