/*
 * @Author: sunhaolin@hotoa.com
 * @Date: 2022-06-10 13:47:47
 * @LastEditors: 孙浩林 sunhaolin@steedos.com
 * @LastEditTime: 2024-01-30 10:09:17
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
 * 添加环境变量process.env.STEEDOS_CFS_DOWNLOAD_PUBLIC，用于记录不需要认证的collectionName；
    如：STEEDOS_CFS_DOWNLOAD_PUBLIC=avatars,images,files
    默认值为avatars
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

router.get(['/api/files/:collectionName/:id', '/api/files/:collectionName/:id/:filename'], authMiddleWare, async function (req, res) {
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

        const collection = await getCollection(DB_COLLECTION_NAME);

        const fileDoc = await collection.findOne({ _id: id });

        if (!fileDoc) {
            throw new Error(`文件不存在`);
        }

        const copyInfo = fileDoc.copies[FS_COLLECTION_NAME];

        if (!copyInfo) {
            throw new Error('This file was not stored in the ' + FS_COLLECTION_NAME + ' store');
        }

        const { type, name, size, updatedAt, key } = copyInfo;


        res.setHeader('Access-Control-Expose-Headers', 'Content-Disposition');

        // Set the content type for file
        if (typeof type === "string") {
            res.setHeader('Content-Type', type + ";charset=utf-8");
        } else {
            res.setHeader('Content-Type', 'application/octet-stream;charset=utf-8');
        }

        // Add 'Content-Disposition' header if requested a download/attachment URL
        if (typeof download !== "undefined") {
            res.setHeader('Content-Disposition', "attachment; filename*=UTF-8''" + encodeURIComponent(name));
        } else {
            res.setHeader('Content-Disposition', 'inline');
        }

        // Get the contents range from request
        var range = requestRange(req, copyInfo.size);

        // Some browsers cope better if the content-range header is
        // still included even for the full file being returned.
        res.setHeader('Content-Range', range.unit + ' ' + range.start + '-' + range.end + '/' + range.size);

        // If a chunk/range was requested instead of the whole file, serve that'
        if (range.partial) {
            res.status(206);
        } else {
            res.status(200);
        }

        // Inform clients about length (or chunk length in case of ranges)
        res.setHeader('Content-Length', range.length);

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

        // Inform clients that we accept ranges for resumable chunked downloads
        res.setHeader('Accept-Ranges', range.unit);

        const readStream = await createFileReadStream(FS_COLLECTION_NAME, key, { start: range.start, end: range.end });

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

/*
  requestRange will parse the range set in request header - if not possible it
  will throw fitting errors and autofill range for both partial and full ranges

  throws error or returns the object:
  {
    start
    end
    length
    unit
    partial
  }
*/
function requestRange(req, fileSize) {
    if (req) {
        if (req.headers) {
            var rangeString = req.headers.range;

            // Make sure range is a string
            if (rangeString === '' + rangeString) {

                // range will be in the format "bytes=0-32767"
                var parts = rangeString.split('=');
                var unit = parts[0];

                // Make sure parts consists of two strings and range is of type "byte"
                if (parts.length == 2 && unit == 'bytes') {
                    // Parse the range
                    var range = parts[1].split('-');
                    var start = Number(range[0]);
                    var end = Number(range[1]);

                    // Fix invalid ranges?
                    if (range[0] != start) start = 0;
                    if (range[1] != end || !end) end = fileSize - 1;

                    // Make sure range consists of a start and end point of numbers and start is less than end
                    if (start < end) {

                        var partSize = 0 - start + end + 1;

                        // Return the parsed range
                        return {
                            start: start,
                            end: end,
                            length: partSize,
                            size: fileSize,
                            unit: unit,
                            partial: (partSize < fileSize)
                        };

                    } else {
                        throw new Error(416, "Requested Range Not Satisfiable");
                    }

                } else {
                    // The first part should be bytes
                    throw new Error(416, "Requested Range Unit Not Satisfiable");
                }

            } else {
                // No range found
            }

        } else {
            // throw new Error('No request headers set for _parseRange function');
        }
    } else {
        throw new Error('No request object passed to _parseRange function');
    }

    return {
        start: 0,
        end: fileSize - 1,
        length: fileSize,
        size: fileSize,
        unit: 'bytes',
        partial: false
    };
};