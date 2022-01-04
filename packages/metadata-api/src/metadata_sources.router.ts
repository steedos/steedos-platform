const express = require("express");
const router = express.Router();
const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');

const chalk = require("chalk");
const Fiber = require('fibers');
const _ = require('underscore');

import { requireAuthentication } from '@steedos/core';
import { getMetadataSources } from './metadata/collection';

import { DbManager } from './util/dbManager';
import { getFullName } from '@steedos/metadata-core';

const getSources = async function (req, res) {
    try {
        const userSession = req.user;
        const isSpaceAdmin = req.user.is_space_admin;
        // const spaceId = userSession.spaceId;

        let urlParams = req.params;
        let metadataName = urlParams.metadataName;
        if (!isSpaceAdmin) {
            return res.status(401).send({ status: 'error', message: 'Permission denied' });
        }
        var dbManager = new DbManager(userSession);
        await dbManager.connect();
        const records = await getMetadataSources(dbManager, metadataName);
        await dbManager.close();
        let sources: any = [];
        _.each(records, function (reocrd) {
            sources.push({ fullName: getFullName(metadataName, reocrd), type: metadataName })
        })

        return res.status(200).send(sources);
    } catch (error) {
        console.log(`sources error`, error);
        return res.status(500).send(error.message);
    }
}



router.get('/api/metadata/sources/:metadataName', requireAuthentication, function (req, res) {
    return Fiber(function(){
        return getSources(req, res);
    }).run();;
});



exports.default = router;