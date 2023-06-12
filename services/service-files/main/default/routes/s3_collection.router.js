/*
 * @Author: sunhaolin@hotoa.com
 * @Date: 2022-06-10 09:38:53
 * @LastEditors: sunhaolin@hotoa.com
 * @LastEditTime: 2022-08-03 11:33:20
 * @Description: 
 */

const express = require("express");
const router = express.Router();
const core = require('@steedos/core');
const formidable = require('formidable');
const {
    getCollection,
    File,
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

                // console.log(fields);
                // console.log(files);

                const {
                    filepath: tempFilePath,
                    mimetype,
                    mtime,
                    newFilename,
                    originalFilename,
                    size
                } = files.file;

                //安全问题，禁止上传svg格式的文件
                if ("image/svg+xml" == mimetype){
                    throw new Error("SVG NOT Allowed!");
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