/*
 * @Author: sunhaolin@hotoa.com
 * @Date: 2022-06-10 13:47:47
 * @LastEditors: sunhaolin@hotoa.com
 * @LastEditTime: 2022-06-10 18:21:31
 * @Description: 
 */

const express = require("express");
const router = express.Router();
const core = require('@steedos/core');
const {
    getCollection,
    createFileReadStream
} = require('../manager');

/**
 * 下载文件
 */
router.get('/api/files/:collectionName/:id', core.requireAuthentication, async function (req, res) {
    try {

        const userSession = req.user;
        const userId = userSession.userId;

        const { download } = req.query;

        const { collectionName: FS_COLLECTION_NAME, id } = req.params;
        const DB_COLLECTION_NAME = `cfs.${FS_COLLECTION_NAME}.filerecord`;

        const collection = getCollection(DB_COLLECTION_NAME);

        const fileDoc = await collection.findOne({ _id: id });

        if (!fileDoc) {
            throw new Error(`文件不存在`);
        }

        const copyInfo = fileDoc.copies[FS_COLLECTION_NAME];

        if (!copyInfo) {
            throw new Error('This file was not stored in the ' + FS_COLLECTION_NAME + ' store');
        }

        const { type, name, size, updatedAt, key } = copyInfo;

        // Set the content type for file
        if (typeof type === "string") {
            res.setHeader('Content-Type', type);
        } else {
            res.setHeader('Content-Type', 'application/octet-stream');
        }

        // Add 'Content-Disposition' header if requested a download/attachment URL
        if (typeof download !== "undefined") {
            res.setHeader('Content-Disposition', "attachment; filename*=UTF-8''" + encodeURIComponent(name));
        } else {
            res.setHeader('Content-Disposition', 'inline');
        }

        // Inform clients for browser cache
        res.setHeader('cache-control', 'public, max-age=31536000');

        const modiFied = updatedAt;
        const reqModifiedHeader = req.headers['if-modified-since'];
        if (reqModifiedHeader != null) {
            if (reqModifiedHeader == modiFied.toUTCString()) {
                res.setHeader('Last-Modified', reqModifiedHeader);
                res.status(304).send();
                return;
            }
        }
        // Last modified header (updatedAt from file info) 
        res.setHeader('Last-Modified', updatedAt.toUTCString());

        const readStream = createFileReadStream(FS_COLLECTION_NAME, key);

        readStream.on('error', function (err) {
            console.log(err);
            res.end();
        });
        req.on('aborted', function () {
            
        });

        readStream.pipe(res);
    } catch (error) {
        console.error(error);
        res.status(error.statusCode || 500).send({ error: error.message });
    }

});
exports.default = router;