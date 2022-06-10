/*
 * @Author: sunhaolin@hotoa.com
 * @Date: 2022-06-09 09:36:43
 * @LastEditors: sunhaolin@hotoa.com
 * @LastEditTime: 2022-06-10 11:39:52
 * @Description: 文件类，处理文件保存
 */
'use strict';
// @ts-check

const objectql = require('@steedos/objectql');
const fs = require('fs');
const path = require('path');
const mkdirp = require('mkdirp');
const { _makeNewID } = require('./util');
const AWS = require('aws-sdk');

class File {

    constructor({ name, size, mimetype, fsCollectionName }) {
        this._id = _makeNewID();
        this._name = name;
        this._size = size;
        this._mimetype = mimetype;

        this._fsCollectionName = fsCollectionName;
    }

    /**
     * @param {any} metadata
     {
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
        overwrite,
        current
     }
     */
    set metadata(metadata) {
        this._metadata = metadata;
        this._fileKey = this.fileKeyMaker({ _id: this._id, filename: this._name, instance: metadata.instance, fsCollectionName: this._fsCollectionName });
    }

    /**
     * @returns {String}
     */
    get name() {
        return this._name;
    }

    /**
     * @returns {String}
     */
    get id() {
        return this._id;
    }

    /**
     * 获取文件新增所需信息
     * @returns {any}
     */
    insertDoc() {
        const now = new Date();
        const _id = this._id;
        const filename = this._name;
        const mimetype = this._mimetype;
        const size = this._size;
        const fsCollectionName = this._fsCollectionName;
        const metadata = this._metadata;
        const fileKey = this._fileKey;

        const doc = {
            "_id": _id,
            "original": {
                "type": mimetype,
                "size": size,
                "name": filename
            },
            "metadata": metadata,
            "uploadedAt": now,
            "copies": {
                [fsCollectionName]: {
                    "name": filename,
                    "type": mimetype,
                    "size": size,
                    "key": fileKey,
                    "updatedAt": now,
                    "createdAt": now
                }
            }
        };

        return doc;
    }


    /**
     * 获取文件存储的文件夹路径
     * @param {String} fsCollectionName 
     * @returns 
     */
    storageBasePath(fsCollectionName) {
        return path.join(process.env.STEEDOS_STORAGE_DIR, `files/${fsCollectionName}`);
    }

    /**
     * 
     * @returns 
     */
    getStoreName() {
        const config = objectql.getSteedosConfig();
        const storeName = config.public.cfs ? (config.public.cfs.store || 'local') : 'local';
        return storeName;
    }

    /**
     * 生成文件存储路径后缀
     * @param {{ _id, filename, instance, fsCollectionName }} param0 
     * @returns 
     */
    fileKeyMaker({ _id, filename, instance, fsCollectionName }) {

        const storeName = this.getStoreName();

        const name_split = filename.split('.');
        const extention = name_split.pop();
        const final_filename = name_split.join('.').substring(0, 50) + '.' + extention;

        if ('local' === storeName) {
            const now = new Date;
            const year = now.getFullYear();
            const month = now.getMonth() + 1;

            let customPathPrefix = year + '/' + month + '/';
            if (instance) {
                customPathPrefix += instance;
            }

            const pathname = path.join(this.storageBasePath(fsCollectionName), customPathPrefix);

            const absolutePath = path.resolve(pathname);
            // 如果文件夹不存在，则创建文件夹
            mkdirp.sync(absolutePath);

            return customPathPrefix + '/' + fsCollectionName + '-' + _id + '-' + final_filename;
        }
        else {
            return fsCollectionName + '/' + fsCollectionName + '-' + _id + '-' + final_filename;
        }

    }

    /**
     * 文件存储完整路径
     * @param {String} fsCollectionName 
     * @param {String} fileKey 
     */
    fileStoreFullPath(fsCollectionName, fileKey) {
        return path.join(this.storageBasePath(fsCollectionName), fileKey);
    }

    /**
     * 保存文件
     * @param {*} tempFilePath 
     * @param {*} callback 
     */
    save(tempFilePath, callback) {
        try {
            const storeName = this.getStoreName();
            const fsCollectionName = this._fsCollectionName;
            const fileKey = this._fileKey;
            if ('local' === storeName) {
                const fileStorePath = this.fileStoreFullPath(fsCollectionName, fileKey);
                fs.renameSync(tempFilePath, fileStorePath);
                callback(null);
            }
            else if ('OSS' === storeName || 'S3' === storeName) {

                // 将文件保存到OSS或S3
                const config = objectql.getSteedosConfig();
                const options = config.cfs.aws || {};

                // Determine which folder (key prefix) in the bucket to use
                let folder = options.folder;
                if (typeof folder === "string" && folder.length) {
                    if (folder.slice(0, 1) === "/") {
                        folder = folder.slice(1);
                    }
                    if (folder.slice(-1) !== "/") {
                        folder += "/";
                    }
                } else {
                    folder = "";
                }

                const bucket = options.bucket;
                if (!bucket)
                    throw new Error('未指定bucket');

                const defaultAcl = options.ACL || 'private';

                const serviceParams = Object.assign({
                    Bucket: bucket,
                    region: null, //required
                    accessKeyId: null, //required
                    secretAccessKey: null, //required
                    ACL: defaultAcl
                }, options);

                const S3 = new AWS.S3(serviceParams);

                const stream = fs.createReadStream(tempFilePath);
                const params = {
                    Bucket: bucket,
                    Key: folder + fileKey,
                    Body: stream
                };

                S3.upload(params, function (err, data) {
                    console.log(err, data);
                    // 删除临时文件
                    fs.unlinkSync(tempFilePath);

                    callback(err, data);
                });

            }
            else if ('STEEDOSCLOUD' === storeName) {
                // TODO
            }
            else {
                throw new Error(`Unsupported store name: ${storeName}`);
            }
        } catch (error) {
            console.error(error);
            callback(error)
        }
    }






}

module.exports = {
    File
};