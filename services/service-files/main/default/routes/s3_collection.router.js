/*
 * @Author: sunhaolin@hotoa.com
 * @Date: 2022-06-10 09:38:53
 * @LastEditors: sunhaolin@hotoa.com
 * @LastEditTime: 2022-06-10 10:54:50
 * @Description: 
 */

const express = require("express");
const router = express.Router();
const core = require('@steedos/core');
const formidable = require('formidable');
const {
    getCollection,
    File,
    formatFileName,
    _makeNewID
} = require('../manager');

/**
 * 上传记录的附件
 */
router.post('/s3/:collection/', core.requireAuthentication, async function (req, res) {
    try {

        const userSession = req.user;
        const userId = userSession.userId;

        const FS_COLLECTION_NAME = req.params.collection;
        const DB_COLLECTION_NAME = `cfs.${FS_COLLECTION_NAME}.filerecord`;

        const form = formidable({});

        form.parse(req, async (err, fields, files) => {
            try {
                if (err) {
                    throw new Error(err);
                }

                console.log(fields);
                console.log(files);

                const {
                    filepath: tempFilePath,
                    mimetype,
                    mtime,
                    newFilename,
                    originalFilename,
                    size
                } = files.file;

                const collection = getCollection(DB_COLLECTION_NAME);

                const newFile = new File({ name: originalFilename, size, mimetype, fsCollectionName: FS_COLLECTION_NAME });

                newFile.metadata = {
                    ...fields,
                    owner: userId,
                };
                await collection.insertOne(newFile.insertDoc());
                
                // 保存文件
                newFile.save(tempFilePath, async function (err, result) {
                    const fileDoc = await collection.findOne({ _id: newFile.id });
                    res.status(200).send(fileDoc);
                })

            } catch (error) {
                console.error(error);
                res.status(500).send({ message: error.message });
            }

        });

    } catch (error) {
        console.error(error);
        res.status(500).send({ message: error.message });
    }

});
exports.default = router;