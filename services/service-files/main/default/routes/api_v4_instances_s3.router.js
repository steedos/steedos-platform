/*
 * @Author: sunhaolin@hotoa.com
 * @Date: 2022-06-08 09:38:56
 * @LastEditors: sunhaolin@hotoa.com
 * @LastEditTime: 2022-06-08 18:45:04
 * @Description: 
 */
const express = require("express");
const router = express.Router();
const core = require('@steedos/core');
const formidable = require('formidable');
const {
    getCollection,
    _makeNewID,
    fileKeyMaker,
    save
} = require('../manager');
const FS_COLLECTION_NAME = 'instances';
const DB_COLLECTION_NAME = 'cfs.instances.filerecord';

router.post('/api/v4/instances/s3/', core.requireAuthentication, async function (req, res) {
    try {

        const form = formidable({});

        form.parse(req, async (err, fields, files) => {
            try {
                if (err) {
                    throw new Error(err);
                }

                console.log(fields);
                console.log(files);

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

                const collection = getCollection(DB_COLLECTION_NAME);

                let filename = originalFilename;

                if (["image.jpg", "image.gif", "image.jpeg", "image.png"].includes(filename.toLowerCase())) {
                    filename = "image-" + moment(new Date()).format('YYYYMMDDHHmmss') + "." + filename.split('.').pop();
                }

                try {
                    if (upload_from === "IE" || upload_from === "node") {
                        filename = decodeURIComponent(filename);
                    }
                } catch (error) {
                    console.error(filename);
                    console.error(error);
                    filename = filename.replace(/%/g, "-");
                }

                const now = new Date();
                const newFileId = _makeNewID();
                const fileKey = fileKeyMaker({ _id: newFileId, filename, instance, fsCollectionName: FS_COLLECTION_NAME });
                const newFile = {
                    "_id": newFileId,
                    "original": {
                        "type": mimetype,
                        "size": size,
                        "name": filename
                    },
                    // "metadata" : {},
                    "uploadedAt": now,
                    "copies": {
                        [FS_COLLECTION_NAME]: {
                            "name": filename,
                            "type": mimetype,
                            "size": size,
                            "key": fileKey,
                            "updatedAt": now,
                            "createdAt": now
                        }
                    }
                };

                let parentId = '';
                const metadata = {
                    owner,
                    owner_name,
                    space,
                    instance,
                    approve,
                    current: true
                };

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
                        await collection.insertOne(newFile);
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
                    metadata.parent = newFileId;
                    newFile.metadata = metadata;
                    await collection.insertOne(newFile);
                }

                // 保存文件
                save(tempFilePath, FS_COLLECTION_NAME, fileKey, function (err, result) {
                    const resp = {
                        version_id: newFile._id,
                        size: size
                    };
                    res.end(JSON.stringify(resp));
                })


            } catch (error) {
                console.error(`[/api/v4/instances/s3/]: ${error}`);
                res.status(500).send({ message: error.message });
            }

        });

    } catch (error) {
        console.error(`[/api/v4/instances/s3/]: ${error}`);
        res.status(500).send({ message: error.message });
    }

});
exports.default = router;