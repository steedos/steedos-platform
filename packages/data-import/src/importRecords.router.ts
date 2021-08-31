import { importWithCmsFile } from "./objectImport"
import { requireAuthentication } from '@steedos/core';

const express = require("express");
const router = express.Router();
const Fiber = require('fibers');

const json2xls = require('json2xls');
import { getObject } from '@steedos/objectql';
import _ from 'lodash';


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

router.get('/api/data/download/template/:record_id', requireAuthentication, async function (req, res) { //requireAuthentication
    try {
        const { record_id } = req.params;
        let queueImportDoc = await getObject("queue_import").findOne(record_id);
        let fieldMaps = queueImportDoc.field_mappings;
        if (_.isEmpty(fieldMaps)) {
            return;
        }
        let json = {};
        for (const fMap of fieldMaps) {
            json[fMap.header] = null;
        }
        let xls = json2xls([json]);
        res.writeHead(200, {
            'Content-Type': 'application/octet-stream',
            'Content-Disposition': 'attachment;filename=' + encodeURI(queueImportDoc.description + '.xlsx'),
        });
        res.end(xls, 'binary');
    } catch (error) {
        console.error(error);
        res.status(500).send({ error: error.message });
    }

});

exports.default = router;

