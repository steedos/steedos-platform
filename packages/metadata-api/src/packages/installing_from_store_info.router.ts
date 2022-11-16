import { requireAuthentication } from '@steedos/core';

import { getInstallingInfo } from './util';

const express = require("express");
const router =require('@steedos/router').staticRouter()

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