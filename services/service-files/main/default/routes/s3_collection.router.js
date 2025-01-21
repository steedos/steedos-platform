/*
 * @Author: sunhaolin@hotoa.com
 * @Date: 2022-06-10 09:38:53
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2025-01-21 17:27:54
 * @Description: 
 */

const express = require("express");
const router = express.Router();
const auth = require('@steedos/auth');
const formidable = require('formidable');
const { getSettings } = require('@steedos/utils')
const _ = require('lodash')
const {
    getCollection,
    File,
} = require('../manager');

/**
 * 上传记录的附件
 */
router.post('/s3/:collection/', auth.requireAuthentication, async function (req, res) {
    try {

        const userSession = req.user;
        const userId = userSession.userId;
        const spaceId = userSession.spaceId;

        const FS_COLLECTION_NAME = req.params.collection;
        const DB_COLLECTION_NAME = `cfs.${FS_COLLECTION_NAME}.filerecord`;

        const form = formidable({});

        form.parse(req, async (err, fields, files) => {
            try {
                if (err) {
                    throw new Error(err);
                }

                // console.log(fields);
                // console.log(files);
                const settings = await getSettings(spaceId);
                const deny_ext = _.get(settings, 'cfs.upload.deny_ext') || _.split(process.env.STEEDOS_CFS_UPLOAD_DENY_EXT, ',') || [];

                const {
                    filepath: tempFilePath,
                    mimetype,
                    mtime,
                    newFilename,
                    originalFilename,
                    size
                } = files.file;

                const name_split = originalFilename.split('.');
                const extention = name_split.pop();

                if(_.includes(deny_ext, extention)){
                    throw new Error(`禁止上传「${extention}」附件`)
                }

                const collection = await getCollection(DB_COLLECTION_NAME);

                const newFile = new File({ name: originalFilename, size, mimetype, fsCollectionName: FS_COLLECTION_NAME });

                newFile.metadata = {
                    ...fields,
                    owner: userId,
                };
                // 保存文件
                newFile.save(tempFilePath, async function (err, result) {
                    if (err) {
                        res.status(500).send({ error: { message: err.message } });
                        return;
                    }

                    await collection.insertOne(newFile.insertDoc());

                    const fileDoc = await collection.findOne({ _id: newFile.id });
                    res.status(200).send(fileDoc);
                })

            } catch (error) {
                console.error(error);
                res.status(500).send({ error: { message: error.message } });
            }

        });

    } catch (error) {
        console.error(error);
        res.status(500).send({ error: { message: err.message } });
    }

});
exports.default = router;