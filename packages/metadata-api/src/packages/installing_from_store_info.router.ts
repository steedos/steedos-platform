/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-11-17 16:29:16
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2022-11-29 11:55:49
 * @Description: 
 */
import { requireAuthentication } from '@steedos/auth';

import { getInstallingInfo } from './util';

const express = require("express");
const router = express.Router();

const getInstallingData = async function (req, res) {
    try {
        const userSession = req.user;
        const isSpaceAdmin = userSession.is_space_admin;
        let urlParams = req.params;
        let packageVersionId = urlParams.packageVersionId;
        const body = req.body;
        const password = body.password;
        if (!isSpaceAdmin) {
            return res.status(401).send({ status: 'error', message: 'Permission denied' });
        }
        const info = await getInstallingInfo(packageVersionId, password, userSession);
        
        return res.status(200).send(info);
    } catch (error) {
        return res.status(500).send({error: error.message});
    }
}

router.post('/api/package/installing_from_store/info/:packageVersionId', requireAuthentication, getInstallingData);

exports.default = router;