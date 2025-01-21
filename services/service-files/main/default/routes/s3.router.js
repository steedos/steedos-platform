/*
 * @Author: sunhaolin@hotoa.com
 * @Date: 2022-06-10 09:38:53
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2025-01-21 17:27:46
 * @Description: 
 */

const express = require("express");
const router = express.Router();
const auth = require('@steedos/auth');
const { getSettings } = require('@steedos/utils')
const _ = require('lodash')
const formidable = require('formidable');
const {
    getCollection,
    File,
    formatFileName,
    _makeNewID
} = require('../manager');
const FS_COLLECTION_NAME = 'files';
const DB_COLLECTION_NAME = 'cfs.files.filerecord';

/**
 * 上传记录的附件
 */
router.post('/s3/', auth.requireAuthentication, async function (req, res) {
    try {

        const userSession = req.user;
        const userId = userSession.userId;
        const spaceId = userSession.spaceId;

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
                    owner,
                    owner_name,
                    space,
                    upload_from,
                    record_id,
                    parent,
                    object_name,
                    description,
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
                const fileCollection = await getCollection('cms_files');

                const newFile = new File({ name: formatFileName(originalFilename, upload_from), size, mimetype, fsCollectionName: FS_COLLECTION_NAME });

                const filename = newFile.name;

                const name_split = filename.split('.');
                const extention = name_split.pop();

                if(_.includes(deny_ext, extention)){
                    throw new Error(`禁止上传「${extention}」附件`)
                }

                const metadata = {
                    owner,
                    owner_name,
                    space,
                    record_id,
                    object_name,
                };
                if (parent) {
                    metadata.parent = parent;
                }
                newFile.metadata = metadata;

                // 保存文件
                newFile.save(tempFilePath, async function (err, result) {
                    if (err) {
                        res.send({ errors: [{ errorMessage: err.message }] });
                        return;
                    }

                    await collection.insertOne(newFile.insertDoc());

                    if (parent) {
                        await fileCollection.updateOne({
                            _id: parent
                        }, {
                            $set: {
                                name: filename,
                                extention: extention,
                                size: size,
                                modified: new Date(),
                                modified_by: userId
                            },
                            $push: {
                                versions: {
                                    $each: [newFile.id],
                                    $position: 0
                                }
                            }
                        });
                    } else {
                        const newFileObjId = _makeNewID();
                        await fileCollection.insertOne({
                            _id: newFileObjId,
                            name: filename,
                            description: description,
                            extention: extention,
                            size: size,
                            versions: [newFile.id],
                            parent: {
                                o: object_name,
                                ids: [record_id]
                            },
                            owner: owner,
                            space: space,
                            created: new Date(),
                            created_by: userId,
                            modified: new Date(),
                            modified_by: userId
                        });
                        await collection.updateOne({
                            _id: newFile.id
                        }, {
                            $set: {
                                'metadata.parent': newFileObjId
                            }
                        });
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
        res.send({ errors: [{ errorMessage: err.message }] });
    }

});
exports.default = router;