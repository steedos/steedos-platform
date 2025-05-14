
const { requireAuthentication } = require('@steedos/auth');
const { importWithCmsFile } = require('@steedos/data-import/lib/index')
const express = require('express');
const router = express.Router();

const json2xls = require('json2xls');
const { getObject } = require('@steedos/objectql');
const _ = require('lodash');

const initiateImport = async function (req, res) {
    try {
        const userSession = req.user;
        // const spaceId = userSession.spaceId;
        let { importObjId, importObjectHistoryId } = req.body;
        let fileId = null;
        const isSpaceAdmin = req.user.is_space_admin;
        //传入了importObjId参数，必须是工作区管理员权限
        if (importObjId && !isSpaceAdmin) {
            return res
                .status(401)
                .send({ status: "error", message: "Permission denied" });
        }

        if (importObjectHistoryId) {
            const record = await getObject('queue_import_history').findOne(importObjectHistoryId);
            if (!record) {
                throw new Error(
                    `can not find queue_import_history record with given id "${importObjectHistoryId}"`
                );
            }
            if (!record.file) {
                throw new Error(`Upload excel file, please.`);
            }
            fileId = record.file
            importObjId = record.queue_import
        }

        // if (!Steedos.hasFeature('metadata_api', spaceId)) {
        //     return res.status(403).send({ status: 'error', message: 'Please upgrade the platform license to Enterprise Edition' });
        // }

        try {
            let result = await importWithCmsFile(importObjId, userSession, importObjectHistoryId, fileId);
            return res.status(200).send({ status: "success", result });
        } catch (error) {
            console.log(error)
            return res
                .status(500)
                .send({ status: "failed", message: error.message });
        }
    } catch (error) {
        console.log(error)
        return res.status(500).send({ status: "failed", error: error.message });
    }
}

router.post('/api/data/initiateImport', requireAuthentication, initiateImport);

router.get('/api/data/download/template/:record_id', requireAuthentication, async function (req, res) {
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
            'Access-Control-Expose-Headers': 'Content-Disposition'
        });
        res.end(xls, 'binary');
    } catch (error) {
        console.error(error);
        res.status(500).send({ error: error.message });
    }

});

exports.default = router;

