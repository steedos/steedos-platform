import { importWithCmsFile } from "./objectImport"
import { requireAuthentication } from '@steedos/core';

const express = require("express");
const router = express.Router();
const Fiber = require('fibers');

// declare var Creator: any;
// declare var Meteor: any;
declare var Steedos: any;

const initiateImport = async function (req, res) {
    try {
        const userSession = req.user;
        // const spaceId = userSession.spaceId;

        const isSpaceAdmin = req.user.is_space_admin;
        if (!isSpaceAdmin) {
            return res.status(401).send({ status: 'error', message: 'Permission denied' });
        }

        // if (!Steedos.hasFeature('metadata_api', spaceId)) {
        //     return res.status(403).send({ status: 'error', message: 'Please upgrade the platform license to Enterprise Edition' });
        // }
        const importObjId = req.body.importObjId;
        try {
            let result = await importWithCmsFile(importObjId, userSession);
            return res.status(200).send({ status: 'success', result });
        } catch (error) {
            return res.status(500).send({ status: 'failed', message: error.message });
        }
        
    } catch (error) {
        return res.status(500).send({ status: 'failed', error: error.message });
    }
}

router.post('/api/data/initiateImport', requireAuthentication, function (req, res) { //requireAuthentication
    return Fiber(function () {
        return initiateImport(req, res);
    }).run();;
});

exports.default = router;

