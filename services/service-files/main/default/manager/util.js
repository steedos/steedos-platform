/*
 * @Author: sunhaolin@hotoa.com
 * @Date: 2022-06-09 11:20:59
 * @LastEditors: sunhaolin@hotoa.com
 * @LastEditTime: 2022-06-12 13:58:08
 * @Description: 
 */

const objectql = require('@steedos/objectql');
const path = require('path');
const {
    LOCAL_STORE,
} = require('./consts');

/**
 * 获取对象集合
 * @param {String} name 
 */
function getCollection(name) {
    return objectql.getDataSource('default').adapter.collection(name);
}

/**
 * 生成主键
 * @returns 主键
 */
function _makeNewID() {
    return objectql.getDataSource('default').adapter._makeNewID();
}

/**
 * 格式化文件名
 * @param {*} filename 
 * @param {*} upload_from 
 * @returns 
 */
function formatFileName(filename, upload_from) {
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
    return filename;
}


/**
 * 获取文件本地存储的文件夹路径
 * @param {String} fsCollectionName 
 * @returns 
 */
function storageBasePath(fsCollectionName) {
    return path.join(process.env.STEEDOS_STORAGE_DIR, `files/${fsCollectionName}`);
}

/**
 * 
 * @returns 
 */
function getStoreName() {
    const config = objectql.getSteedosConfig();
    const storeName = config.public.cfs ? (config.public.cfs.store || LOCAL_STORE) : LOCAL_STORE;
    return storeName;
}


/**
 * 文件存储完整路径
 * @param {String} fsCollectionName 
 * @param {String} fileKey 
 */
function fileStoreFullPath(fsCollectionName, fileKey) {
    return path.join(storageBasePath(fsCollectionName), fileKey);
}

/**
 * 
 * @returns S3或者OSS 配置
 */
function getS3Options() {
    const config = objectql.getSteedosConfig();
    const options = config.cfs.aws || config.cfs.aliyun || {};
    return options;
}

/**
 * 
 * @returns folder (key prefix) 
 */
function getS3FoldOption() {
    const options = getS3Options();

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

    return folder;
}

/**
 * @returns bucket
 */
function getS3BucketOption() {
    const options = getS3Options();
    return options.bucket;
}

/**
 * 
 * @returns serviceParams 用于初始化S3Client
 */
function getS3ServiceParams() {
    const options = getS3Options();

    const bucket = options.bucket;
    if (!bucket)
        throw new Error('未指定bucket');

    const defaultAcl = options.ACL || 'private';

    // 如果配置了region并且store是OSS则使用region生成endpoint，否则使用默认endpoint
    const storeName = getStoreName();
    const region = options.region;
    if (region && storeName === 'OSS') {
        options.endpoint = 'http://' + region + '.aliyuncs.com';
        delete options.region;
    }

    const serviceParams = Object.assign({
        Bucket: bucket,
        region: null,
        accessKeyId: null, //required
        secretAccessKey: null, //required
        ACL: defaultAcl
    }, options);
    return serviceParams;
}


/**
 * 
 * @returns STEEDOSCLOUD配置
 */
 function getCloudOptions() {
    const config = objectql.getSteedosConfig();
    const options = config.cfs.steedosCloud || {};
    return options;
}

/**
 * 
 * @returns folder (key prefix) 
 */
function getCloudFoldOption() {
    const options = getCloudOptions();

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

    var bucket = options.bucket;
    if (!bucket)
        throw new Error('未指定bucket');

    // 拼接folder
    folder = path.join(bucket, folder, '/');

    return folder;
}

/**
 * @returns bucket
 */
function getCloudBucketOption() {
    const options = getCloudOptions();
    return options.steedosBucket || 's3-kong-servie';;
}

/**
 * 
 * @returns serviceParams 用于初始化S3Client
 */
function getCloudServiceParams() {
    const options = {
        ...getCloudOptions()
    };

    options.s3ForcePathStyle = true;

    const steedosBucket = getCloudBucketOption();

    options.folder = getCloudFoldOption();
    delete options.bucket;

    const defaultAcl = options.ACL || 'private';

    var serviceParams = Object.assign({
        Bucket: steedosBucket,
        region: null,
        accessKeyId: null, //required
        secretAccessKey: null, //required
        ACL: defaultAcl
    }, options);
    return serviceParams;
}

/**
 * 
 * @returns apikey
 */
function getCloudApikey() {
    const options = getCloudOptions();
    return options.secretAccessKey;
}

module.exports = {
    getCollection,
    _makeNewID,
    formatFileName,
    storageBasePath,
    getStoreName,
    fileStoreFullPath,
    getS3ServiceParams,
    getS3FoldOption,
    getS3BucketOption,
    getCloudFoldOption,
    getCloudBucketOption,
    getCloudServiceParams,
    getCloudApikey
}