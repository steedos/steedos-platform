/*
 * @Author: sunhaolin@hotoa.com
 * @Date: 2022-06-08 09:38:56
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2024-04-15 18:18:09
 * @Description: 
 */
const express = require("express");
const router = express.Router();
const core = require('@steedos/core');
const formidable = require('formidable');
const _ = require('lodash')
const {
    getCollection,
    File,
    formatFileName
} = require('../manager');
const FS_COLLECTION_NAME = 'instances';
const DB_COLLECTION_NAME = 'cfs.instances.filerecord';

/**
 * 申请单上传附件
 */
router.post('/api/v4/instances/s3/', core.requireAuthentication, async function (req, res) {
    try {

        const userSession = req.user;
        const userId = userSession.userId;

        const form = formidable({});

        form.parse(req, async (err, fields, files) => {
            try {
                if (err) {
                    throw new Error(err);
                }

                // console.log(fields);
                // console.log(files);

                const {
                    approve,
                    instance,
                    is_private,
                    owner,
                    owner_name,
                    space,
                    upload_from,
                    isAddVersion,
                    parent,
                    main,
                    locked_by,
                    locked_by_name,
                    overwrite
                } = fields;

                const {
                    filepath: tempFilePath,
                    mimetype,
                    mtime,
                    newFilename,
                    originalFilename,
                    size
                } = files.file;

                const collection = await getCollection(DB_COLLECTION_NAME);

                const deny_ext = _.split(process.env.STEEDOS_CFS_UPLOAD_DENY_EXT, ',');

                const fileName = formatFileName(originalFilename, upload_from);

                const name_split = fileName.split('.');
                const extention = name_split.pop();

                if(_.includes(deny_ext, extention)){
                    throw new Error(`禁止上传「${extention}」附件`)
                }

                const newFile = new File({ name: formatFileName(originalFilename, upload_from), size, mimetype, fsCollectionName: FS_COLLECTION_NAME });

                let parentId = '';
                const metadata = {
                    owner,
                    owner_name,
                    space,
                    instance,
                    approve,
                    current: true
                };

                newFile.metadata = metadata;

                // 保存文件
                newFile.save(tempFilePath, async function (err, result) {
                    if (err) {
                        res.send({ errors: [{ errorMessage: err.message }] });
                        return;
                    }

                    if (is_private && is_private.toLocaleLowerCase() === "true") {
                        metadata.is_private = true;
                    } else {
                        metadata.is_private = false;
                    }
                    if (main === "true") {
                        metadata.main = true;
                    }
                    if (isAddVersion && parent) {
                        parentId = parent;
                    }

                    if (parentId) {
                        const r = await collection.updateOne({
                            'metadata.parent': parentId,
                            'metadata.current': true
                        }, {
                            $unset: {
                                'metadata.current': ''
                            }
                        });
                        if (r) {
                            metadata.parent = parentId;
                            if (locked_by && locked_by_name) {
                                metadata.locked_by = locked_by;
                                metadata.locked_by_name = locked_by_name;
                            }
                            newFile.metadata = metadata;
                            await collection.insertOne(newFile.insertDoc());
                            // 删除同一个申请单同一个步骤同一个人上传的重复的文件
                            if (overwrite && overwrite.toLocaleLowerCase() === "true") {
                                await collection.deleteMany({
                                    'metadata.instance': instance,
                                    'metadata.parent': parentId,
                                    'metadata.owner': owner,
                                    'metadata.approve': approve,
                                    'metadata.current': {
                                        $ne: true
                                    }
                                });
                            }
                        }
                    } else {
                        metadata.parent = newFile.id;
                        newFile.metadata = metadata;
                        await collection.insertOne(newFile.insertDoc());
                    }



                    const resp = {
                        version_id: newFile._id,
                        size: size
                    };
                    res.end(JSON.stringify(resp));
                })


            } catch (error) {
                console.error(error);
                res.send({ errors: [{ errorMessage: error.message }] });
            }

        });

    } catch (error) {
        console.error(error);
        res.send({ errors: [{ errorMessage: error.message }] });
    }

});
exports.default = router;