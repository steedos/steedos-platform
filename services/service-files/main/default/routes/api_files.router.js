/*
 * @Author: sunhaolin@hotoa.com
 * @Date: 2022-06-10 13:47:47
 * @LastEditors: sunhaolin@hotoa.com
 * @LastEditTime: 2022-06-21 10:07:10
 * @Description: 
 */

const express = require("express");
const router = express.Router();
const core = require('@steedos/core');
const {
    getCollection,
    createFileReadStream
} = require('../manager');
const steedosAuth = require('@steedos/auth');

/**
 * 下载文件
 * 增加环境变量 FILE_DOWNLOAD_NEED_AUTH 判断下载是否需要认证，如果此变量值为'false'则无需认证，否则需要认证
 */

/**
 * 增加认证中间件
 * token为authObject base64之后的字符串
 * authObject为{
 *  "authToken": "", 必填
 *  "expiration": 时间戳, 选填
 * }
 * token生成算法：
 * var authObject = { authToken : x-auth-token }
 * var token = window.btoa(JSON.stringify(authObject))
 * token作为url参数传给下载接口，如 '/api/files/instances/xxx/?token=' + token
 */

const authMiddleWare = async (req, res, next) => {
    try {
        const {
            token
        } = req.query;
        if (token) {
            const authObject = JSON.parse(Buffer.from(token, 'base64').toString());
            if (!authObject.authToken) {
                throw new Error('authToken is required');
            }
            const {
                authToken,
                expiration
            } = authObject;

            if (expiration && expiration < Date.now()) {
                throw new Error('authToken is expired');
            }
            // 让auth包做统一认证
            req.headers['x-auth-token'] = authToken;
        }

        next();
    }
    catch (error) {
        res.status(401).send(error.message);
    }
}

router.get('/api/files/:collectionName/:id', authMiddleWare, async function (req, res) {
    try {

        const { download } = req.query;

        const { collectionName: FS_COLLECTION_NAME, id } = req.params;

        if (!(process.env.STEEDOS_CFS_DOWNLOAD_PUBLIC).split(',').includes(FS_COLLECTION_NAME)) {
            // 手动认证
            let user = await steedosAuth.auth(req, res);
            if (user.userId) {
                req.user = user;
            }
            if (!req.user) {
                res.status(401).send({ status: 'error', message: 'You must be logged in to do this.' });
                return;
            }
        }

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

        const readStream = await createFileReadStream(FS_COLLECTION_NAME, key);

        readStream.on('error', function (err) {
            console.log(err);
            res.removeHeader('Content-Type');
            res.removeHeader('Content-Disposition');
            res.status(500).send({ error: err.message });
        });
        req.on('aborted', function () {

        });

        readStream.pipe(res);
    } catch (error) {
        console.error(error);
        // 防止文件不存在时仍然下载0字节文件
        res.removeHeader('Content-Type');
        res.removeHeader('Content-Disposition');
        res.status(error.statusCode || 500).send({ error: error.message || error.code });
    }

});
exports.default = router;