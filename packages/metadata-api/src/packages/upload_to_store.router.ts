/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-11-17 16:29:16
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2022-11-29 11:56:12
 * @Description: 
 */
import { requireAuthentication } from '@steedos/auth';

import { jsonToFile, mkTempFolder, compressFiles, deleteFolderRecursive, mkdirsSync } from '@steedos/metadata-core'

import { getPackageInfo, uploadFile, getPackageManifest, uploadInfo, groupPackageComponents, savePackageVersionInfo} from './util';
import { getSteedosPackageData } from '../util/steedos_package_data';

const express = require("express");
const router = express.Router();
const fs = require('fs');
const path = require('path');

// const Fiber = require('fibers');
declare var Fiber;
const _ = require('underscore');
const clone = require('clone');

const uploadToStore = async function (req, res) {
    try {
        const userSession = req.user;
        const isSpaceAdmin = req.user.is_space_admin;
        const spaceId = userSession.spaceId;
        // const userId = userSession.userId;
        let urlParams = req.params;
        let packageId = urlParams.packageId;
        const body = req.body;
        if (!isSpaceAdmin) {
            return res.status(401).send({ status: 'error', message: 'Permission denied' });
        }

        const packageData = await getPackageManifest(packageId);
        const packageVersionInfo = body.version_info;
        var steedosPackageData = await getSteedosPackageData(packageData, userSession)
        var _steedosPackageData = clone(steedosPackageData);
        var tempDir = mkTempFolder('user-package-')
        const deployDir = path.join(tempDir, 'deploy');
        const fileDir = path.join(deployDir, 'main', 'default');
        mkdirsSync(fileDir);

        await jsonToFile(fileDir, steedosPackageData);
        const packageInfo = await getPackageInfo(packageId);
        const packageComponents = groupPackageComponents(_steedosPackageData);
        const package_info = {
            name: packageInfo.name,
            label: packageInfo.label,
            keyword: packageInfo.keyword
        };
        const package_version_info = {
            name: packageVersionInfo.name,
            version: packageVersionInfo.version,
            description: packageVersionInfo.description,
            post_install: packageVersionInfo.post_install,
            install_password: packageVersionInfo.install_password,
            release_notes: packageVersionInfo.release_notes,
            components: packageComponents
        };
        const passwordProtected = !!packageVersionInfo.install_password
        var option = {includeJs: false, tableTitle: 'Steedos Package', showLog: false};
        // console.log('deployDir', deployDir);
        compressFiles(deployDir, deployDir, tempDir, option, async function (zipBuffer, zipDir) {
            try {
                const json = await uploadInfo(package_info, package_version_info, userSession);
                const packageAPIName = json.package_api_name;
                const packageVersion = json.package_version;

                await uploadFile(`${packageAPIName}@${packageVersion.version}.zip`, fs.createReadStream(zipDir), {
                    record_id: packageVersion._id,
                    object_name: packageVersion.__object_name,
                    spaceId: packageVersion.space,
                    owner: packageVersion.owner,
                    owner_name: packageVersion.__owner_name,
                    parent: packageVersion.parent
                });
                
                const versionInfo = await savePackageVersionInfo(packageId, passwordProtected, packageVersion, packageComponents, userSession)
                
                return res.status(200).send(versionInfo);
            } catch (error) {
                console.log(error)
                return res.status(500).send({error: error.message});
            } finally{
                deleteFolderRecursive(tempDir);
            }
        });
    } catch (error) {
        console.log(error)
        return res.status(500).send({error: error.message});
    }
}

router.post('/api/package/upload_to_store/:packageId', requireAuthentication, function (req, res) {
    return Fiber(function(){
        return uploadToStore(req, res);
    }).run();;
});



exports.default = router;